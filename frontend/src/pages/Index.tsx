import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api, type Shop, type Product, type Category } from '@/lib/api';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { Star, ChevronDown, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useCartAnimation } from '@/hooks/useCartAnimation';

const RATING_RANGES = [
  { label: 'All Ratings', min: 0, max: 5 },
  { label: '4.0 - 5.0', min: 4, max: 5 },
  { label: '3.0 - 4.0', min: 3, max: 4 },
  { label: '2.0 - 3.0', min: 2, max: 3 },
];

const PAGE_SIZE = 6;

export default function Index() {
  const addItem = useCartStore((s) => s.addItem);
  const animateToCart = useCartAnimation();

  const [shops, setShops] = useState<Shop[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [ratingRange, setRatingRange] = useState(RATING_RANGES[0]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('name-asc');
  const [mobileShopOpen, setMobileShopOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [s, c] = await Promise.all([api.getShops(), api.getCategories()]);
        setShops(s);
        setCategories(c);
        if (s.length > 0) setSelectedShop(s[0].id);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredShops = shops.filter((s) => s.rating >= ratingRange.min && s.rating <= ratingRange.max);

  const loadProducts = useCallback(
    async (page: number) => {
      if (!selectedShop) return;
      setLoading(true);
      try {
        const [col, dir] = sortBy.split('-');
        const result = await api.getProducts({
          shopId: selectedShop,
          categoryIds: selectedCategories,
          page,
          limit: PAGE_SIZE,
          sortBy: col === 'name' ? 'name' : 'price',
          sortDir: dir === 'asc' ? 'asc' : 'desc',
        });
        setProducts(result.items);
        setTotalCount(result.total);
      } finally {
        setLoading(false);
      }
    },
    [selectedShop, selectedCategories, sortBy]
  );

  useEffect(() => {
    setCurrentPage(1);
    loadProducts(1);
  }, [loadProducts]);

  useEffect(() => {
    if (currentPage > 1) loadProducts(currentPage);
  }, [currentPage, loadProducts]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadProducts(currentPage);
    }, 30000);
    return () => clearInterval(interval);
  }, [loadProducts, currentPage]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const selectedShopData = shops.find((s) => s.id === selectedShop);

  function handleAddToCart(event: React.MouseEvent, product: Product) {
    const disc = product.discount_percent || 0;
    const finalPrice = disc > 0 ? Math.round(product.price * (1 - disc / 100) * 100) / 100 : product.price;
    addItem({
      productId: product.id,
      name: product.name,
      price: finalPrice,
      originalPrice: disc > 0 ? product.price : undefined,
      discountPercent: disc > 0 ? disc : undefined,
      imageUrl: product.image_url,
      shopName: selectedShopData?.name || '',
    });
    animateToCart(event, product.image_url);
    toast.success(`${product.name} added to cart`);
  }

  function getPageNumbers(): (number | 'ellipsis')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | 'ellipsis')[] = [1];
    if (currentPage > 3) pages.push('ellipsis');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('ellipsis');
    pages.push(totalPages);
    return pages;
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-64">
        <button
          className="flex w-full items-center justify-between rounded-md border bg-card px-4 py-3 text-sm font-medium lg:hidden"
          onClick={() => setMobileShopOpen(!mobileShopOpen)}
        >
          <span>{selectedShopData?.name || 'Select a shop'}</span>
          <ChevronDown className={cn('h-4 w-4 transition-transform', mobileShopOpen && 'rotate-180')} />
        </button>

        <div className={cn('mt-2 space-y-4 lg:mt-0 lg:block', mobileShopOpen ? 'block' : 'hidden lg:block')}>
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Filter by Rating</h3>
            <div className="flex flex-wrap gap-1.5">
              {RATING_RANGES.map((r) => (
                <button
                  key={r.label}
                  onClick={async () => {
                    setRatingRange(r);
                    const nextShops = await api.getShops(r.min, r.max);
                    setShops(nextShops);
                    if (nextShops.length > 0) setSelectedShop(nextShops[0].id);
                  }}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    ratingRange.label === r.label
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Shops</h3>
            <div className="space-y-1">
              {filteredShops.map((shop) => (
                <button
                  key={shop.id}
                  onClick={() => {
                    setSelectedShop(shop.id);
                    setMobileShopOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all',
                    selectedShop === shop.id ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted'
                  )}
                >
                  <img
                    src={shop.image_url || '/placeholder.svg'}
                    alt={shop.name}
                    className="h-8 w-8 rounded-md object-cover"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.src.includes('/placeholder.svg')) return;
                      img.src = '/placeholder.svg';
                      img.alt = 'Image unavailable';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{shop.name}</div>
                    <div className="flex items-center gap-1 text-xs opacity-75">
                      <Star className="h-3 w-3 fill-current" />
                      {shop.rating}
                    </div>
                  </div>
                </button>
              ))}
              {filteredShops.length === 0 && <p className="px-3 py-4 text-center text-sm text-muted-foreground">No shops in this range</p>}
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <Badge
                key={cat.id}
                variant={selectedCategories.includes(cat.id) ? 'default' : 'outline'}
                className="cursor-pointer select-none transition-colors"
                onClick={() => toggleCategory(cat.id)}
              >
                {cat.name}
              </Badge>
            ))}
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name A -&gt; Z</SelectItem>
              <SelectItem value="name-desc">Name Z -&gt; A</SelectItem>
              <SelectItem value="price-asc">Price: Low -&gt; High</SelectItem>
              <SelectItem value="price-desc">Price: High -&gt; Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!loading && <p className="mb-3 text-sm text-muted-foreground">Showing {products.length} of {totalCount} products</p>}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <CardContent className="space-y-2 p-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium text-muted-foreground">No products found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              {products.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id} className="block">
                  <Card className="group overflow-hidden transition-shadow hover:shadow-md">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image_url || '/placeholder.svg'}
                        alt={product.name}
                        className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          const img = e.currentTarget;
                          if (img.src.includes('/placeholder.svg')) return;
                          img.src = '/placeholder.svg';
                          img.alt = 'Image unavailable';
                        }}
                      />
                      {product.discount_percent > 0 && (
                        <Badge className="absolute left-2 top-2 bg-destructive text-destructive-foreground shadow-md">
                          <Percent className="mr-1 h-3 w-3" />
                          Sale {product.discount_percent}%
                        </Badge>
                      )}
                    </div>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <h3 className="font-medium text-card-foreground">{product.name}</h3>
                        {product.discount_percent > 0 ? (
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-destructive">
                              ${(product.price * (1 - product.discount_percent / 100)).toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground line-through">${product.price.toFixed(2)}</p>
                          </div>
                        ) : (
                          <p className="text-sm font-semibold text-primary">${product.price.toFixed(2)}</p>
                        )}
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="shrink-0 transition-transform active:scale-95"
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddToCart(e, product);
                            }}
                          >
                            add to Cart
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-[200px] text-center">
                          <p>The item should be added in the Shopping Cart</p>
                        </TooltipContent>
                      </Tooltip>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className={cn(currentPage === 1 && 'pointer-events-none opacity-50')}
                      />
                    </PaginationItem>
                    {getPageNumbers().map((page, i) =>
                      page === 'ellipsis' ? (
                        <PaginationItem key={`e-${i}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={page === currentPage}
                            onClick={() => setCurrentPage(page)}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className={cn(currentPage === totalPages && 'pointer-events-none opacity-50')}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
