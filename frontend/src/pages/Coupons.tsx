import { useEffect, useState } from 'react';
import { api, type Coupon } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Copy, Check, Ticket } from 'lucide-react';
import { toast } from 'sonner';

const PAGE_SIZE = 6;

export default function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getCoupons(1, PAGE_SIZE);
        setCoupons(data.items || []);
        setHasMore(data.hasMore);
        setPage(1);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function copyCode(coupon: Coupon) {
    await navigator.clipboard.writeText(coupon.code);
    setCopiedId(coupon.id);
    toast.success(`Code "${coupon.code}" copied!`);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function loadMore() {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await api.getCoupons(nextPage, PAGE_SIZE);
      setCoupons((prev) => [...prev, ...(data.items || [])]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } finally {
      setLoadingMore(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-36 w-full" />
              <CardContent className="space-y-2 p-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20">
        <Ticket className="h-12 w-12 text-muted-foreground/40" />
        <h2 className="text-xl font-semibold">No coupons available</h2>
        <p className="text-sm text-muted-foreground">Check back later for new deals!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Coupons</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {coupons.map((coupon) => (
          <Card
            key={coupon.id}
            className="group overflow-hidden transition-shadow hover:shadow-md"
          >
            <div className="relative overflow-hidden">
              <img
                src={coupon.image_url || '/placeholder.svg'}
                alt={coupon.name}
                className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src.includes('/placeholder.svg')) return;
                  img.src = '/placeholder.svg';
                  img.alt = 'Image unavailable';
                }}
              />
              <Badge className="absolute right-3 top-3 bg-primary text-primary-foreground">
                {coupon.discount_percent}% OFF
              </Badge>
            </div>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-medium">{coupon.name}</h3>
                <p className="font-mono text-sm text-muted-foreground">{coupon.code}</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 transition-transform active:scale-95"
                    onClick={() => copyCode(coupon)}
                  >
                    {copiedId === coupon.id ? (
                      <Check className="mr-1 h-3.5 w-3.5" />
                    ) : (
                      <Copy className="mr-1 h-3.5 w-3.5" />
                    )}
                    {copiedId === coupon.id ? 'Copied' : 'Copy'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px] text-center">
                  <p>On click it should copy code to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? 'Loading...' : 'Load more'}
          </Button>
        </div>
      )}
    </div>
  );
}
