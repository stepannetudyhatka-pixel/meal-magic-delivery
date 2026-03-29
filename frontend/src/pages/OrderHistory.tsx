import { useState } from 'react';
import { api, type OrderView } from '@/lib/api';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, RotateCcw, Package } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

const PAGE_SIZE = 6;

const searchSchema = z.object({
  email: z.string().trim().email('Invalid email'),
  phone: z.string().trim().min(7, 'Phone is required'),
});

export default function OrderHistory() {
  const addItems = useCartStore((s) => s.addItems);

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orders, setOrders] = useState<OrderView[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const result = searchSchema.safeParse({ email, phone });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    setSearched(true);

    try {
      const data = await api.searchOrders(result.data.email, result.data.phone, 1, PAGE_SIZE);
      setOrders(data.items || []);
      setPage(1);
      setHasMore(data.hasMore);
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (!hasMore || loadingMore || !email || !phone) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await api.searchOrders(email.trim(), phone.trim(), nextPage, PAGE_SIZE);
      setOrders((prev) => [...prev, ...(data.items || [])]);
      setPage(nextPage);
      setHasMore(data.hasMore);
    } finally {
      setLoadingMore(false);
    }
  }

  function handleReorder(order: OrderView) {
    const cartItems = order.items
      .filter((i) => i.product)
      .map((i) => ({
        productId: i.product!.id,
        name: i.product!.name,
        price: i.product!.price,
        imageUrl: i.product!.image_url,
        quantity: i.quantity,
        shopName: '',
      }));

    addItems(cartItems);
    toast.success(`${cartItems.length} items added to cart`);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Order History</h1>

      {/* Search form */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="hist-email">Email</Label>
              <Input
                id="hist-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="hist-phone">Phone</Label>
              <Input
                id="hist-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 890"
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
            <Button type="submit" className="shrink-0" disabled={loading}>
              <Search className="mr-1.5 h-4 w-4" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="space-y-3 p-6">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : searched && orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <Package className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base">
                    Order #{order.id.slice(0, 8)}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="transition-transform active:scale-95"
                  onClick={() => handleReorder(order)}
                >
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                  Reorder
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <img
                      src={item.product?.image_url || '/placeholder.svg'}
                      alt={item.product?.name || 'Product'}
                      className="h-10 w-10 rounded object-cover"
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (img.src.includes('/placeholder.svg')) return;
                        img.src = '/placeholder.svg';
                        img.alt = 'Image unavailable';
                      }}
                    />
                    <span className="flex-1 truncate">{item.product?.name || 'Unknown'}</span>
                    <span className="text-muted-foreground">×{item.quantity}</span>
                    <span className="font-medium tabular-nums">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t pt-2 text-sm font-semibold">
                  <span>Total</span>
                  <span>${order.total_price.toFixed(2)}</span>
                </div>
                {order.coupon_code && (
                  <p className="text-xs text-muted-foreground">Coupon used: {order.coupon_code}</p>
                )}
              </CardContent>
            </Card>
          ))}
          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? 'Loading...' : 'Load more'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
