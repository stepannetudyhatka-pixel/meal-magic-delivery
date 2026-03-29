import { Link, useLocation } from 'react-router-dom';
import { Store, ShoppingCart, Clock, Ticket } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { ConnectionStatusBar } from '@/components/ConnectionStatusBar';
import { cn } from '@/lib/utils';

const links = [
  { to: '/', label: 'Shop', icon: Store },
  { to: '/cart', label: 'Cart', icon: ShoppingCart },
  { to: '/history', label: 'Orders', icon: Clock },
  { to: '/coupons', label: 'Coupons', icon: Ticket },
];

export function Navbar() {
  const location = useLocation();
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="text-lg font-bold tracking-tight text-foreground">
          Elfitech Food Dash
        </Link>
        <div className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'relative flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" {...(to === '/cart' ? { 'data-cart-icon': true } : {})} />
                <span className="hidden sm:inline">{label}</span>
                {to === '/cart' && itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="mx-auto flex max-w-7xl justify-end border-t px-4 py-1 sm:px-6">
        <ConnectionStatusBar />
      </div>
    </header>
  );
}
