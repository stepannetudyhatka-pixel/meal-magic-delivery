import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, type ProductWithRelations } from '@/lib/api';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, ShoppingCart, Percent, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useCartAnimation } from '@/hooks/useCartAnimation';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const addItem = useCartStore((s) => s.addItem);
  const animateToCart = useCartAnimation();

  const [product, setProduct] = useState<ProductWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const data = await api.getProductById(id);
      setProduct(data);
      setLoading(false);
    }
    load();
  }, [id]);

  function handleAddToCart(event: React.MouseEvent) {
    if (!product) return;
    const disc = product.discount_percent || 0;
    const finalPrice = disc > 0 ? Math.round(product.price * (1 - disc / 100) * 100) / 100 : product.price;
    addItem({
      productId: product.id,
      name: product.name,
      price: finalPrice,
      originalPrice: disc > 0 ? product.price : undefined,
      discountPercent: disc > 0 ? disc : undefined,
      imageUrl: product.image_url,
      shopName: product.shop?.name || '',
    });
    animateToCart(event, product.image_url);
    toast.success(`${product.name} added to cart`);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-10 w-40" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-lg font-medium text-muted-foreground">Product not found</p>
        <Button asChild variant="outline">
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop</Link>
        </Button>
      </div>
    );
  }

  const disc = product.discount_percent || 0;
  const finalPrice = disc > 0 ? Math.round(product.price * (1 - disc / 100) * 100) / 100 : product.price;

  return (
    <div className="mx-auto max-w-2xl">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop</Link>
      </Button>

      <Card className="overflow-hidden">
        <div className="relative">
          <img
            src={product.image_url || '/placeholder.svg'}
            alt={product.name}
            className="h-64 w-full object-cover sm:h-80"
            onError={(e) => {
              const img = e.currentTarget;
              if (img.src.includes('/placeholder.svg')) return;
              img.src = '/placeholder.svg';
              img.alt = 'Image unavailable';
            }}
          />
          {disc > 0 && (
            <Badge className="absolute left-3 top-3 bg-destructive text-destructive-foreground shadow-md text-sm px-3 py-1">
              <Percent className="mr-1 h-4 w-4" />
              Sale {disc}%
            </Badge>
          )}
        </div>

        <CardContent className="space-y-4 p-6">
          <div>
            <h1 className="text-2xl font-bold text-card-foreground">{product.name}</h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              {product.shop && <span>{product.shop.name}</span>}
              {product.shop && product.category && <span>•</span>}
              {product.category && <Badge variant="outline">{product.category.name}</Badge>}
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            {disc > 0 ? (
              <>
                <span className="text-3xl font-bold text-destructive">${finalPrice.toFixed(2)}</span>
                <span className="text-lg text-muted-foreground line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="lg" onClick={(e) => handleAddToCart(e)} className="gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  add to Cart
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[200px] text-center">
                <p>The item should be added in the Shopping Cart</p>
              </TooltipContent>
            </Tooltip>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              Hover for hint
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
