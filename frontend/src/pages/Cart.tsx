import { useState } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const checkoutSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email').max(255),
  phone: z.string().trim().min(7, 'Phone is required').max(20).regex(/^[+\d\s()-]+$/, 'Invalid phone number'),
  address: z.string().trim().min(5, 'Address is required').max(500),
});

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();

  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    try {
      const data = await api.validateCoupon(couponCode.trim().toUpperCase());
      setDiscount(data.discount_percent);
      setCouponApplied(true);
      toast.success(`Coupon applied: ${data.discount_percent}% off!`);
    } catch {
      toast.error('Invalid or expired coupon');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setSubmitting(true);
    try {
      await api.createOrder({
          email: result.data.email,
          phone: result.data.phone,
          address: result.data.address,
          totalPrice: Math.round(total * 100) / 100,
          couponCode: couponApplied ? couponCode.trim().toUpperCase() : undefined,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
          })),
      });

      clearCart();
      setForm({ name: '', email: '', phone: '', address: '' });
      setCouponCode('');
      setDiscount(0);
      setCouponApplied(false);
      toast.success('Order placed successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to place order');
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
        <h2 className="text-xl font-semibold text-foreground">Your cart is empty</h2>
        <p className="text-sm text-muted-foreground">Browse our shops to add items</p>
        <Button asChild>
          <Link to="/">Go Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Checkout form */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Delivery Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {(['name', 'email', 'phone', 'address'] as const).map((field) => (
              <div key={field} className="space-y-1.5">
                <Label htmlFor={field} className="capitalize">{field}</Label>
                <Input
                  id={field}
                  type={field === 'email' ? 'email' : 'text'}
                  value={form[field]}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  placeholder={
                    field === 'email' ? 'you@example.com' :
                    field === 'phone' ? '+1 234 567 890' :
                    field === 'address' ? '123 Main St, City' :
                    'Your name'
                  }
                />
                {errors[field] && (
                  <p className="text-xs text-destructive">{errors[field]}</p>
                )}
              </div>
            ))}

            {/* Coupon */}
            <div className="space-y-1.5">
              <Label>Coupon Code</Label>
              <div className="flex gap-2">
                <Input
                  value={couponCode}
                  onChange={(e) => { setCouponCode(e.target.value); setCouponApplied(false); setDiscount(0); }}
                  placeholder="WELCOME10"
                  disabled={couponApplied}
                />
                <Button type="button" variant="outline" onClick={applyCoupon} disabled={couponApplied}>
                  Apply
                </Button>
              </div>
              {couponApplied && (
                <p className="text-xs" style={{ color: 'hsl(var(--success))' }}>{discount}% discount applied</p>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-1 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between" style={{ color: 'hsl(var(--success))' }}>
                  <span>Discount ({discount}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Placing Order…' : 'Place Order'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Cart items */}
      <div className="space-y-3 lg:col-span-3">
        <h2 className="text-lg font-semibold">Cart Items ({items.length})</h2>
        {items.map((item) => (
          <Card key={item.productId} className="overflow-hidden">
            <div className="flex items-center gap-4 p-4">
              <img
                src={item.imageUrl || '/placeholder.svg'}
                alt={item.name}
                className="h-16 w-16 rounded-md object-cover"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src.includes('/placeholder.svg')) return;
                  img.src = '/placeholder.svg';
                  img.alt = 'Image unavailable';
                }}
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-medium">{item.name}</h3>
                <p className="text-xs text-muted-foreground">{item.shopName}</p>
                {item.discountPercent && item.originalPrice ? (
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-destructive">${item.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground line-through">${item.originalPrice.toFixed(2)}</p>
                    <Badge variant="destructive" className="text-[10px] px-1 py-0">-{item.discountPercent}%</Badge>
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-primary">${item.price.toFixed(2)}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 transition-transform active:scale-95"
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center text-sm font-medium tabular-nums">{item.quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 transition-transform active:scale-95"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="text-destructive transition-transform active:scale-95"
                onClick={() => removeItem(item.productId)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
