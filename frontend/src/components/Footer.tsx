import { Link } from 'react-router-dom';
import { Store, ShoppingCart, Clock, Ticket } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-foreground">Elfitech Food Dash</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Fast food delivery from the best restaurants in your city.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Navigation</h4>
            <nav className="mt-3 flex flex-col gap-2">
              <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <Store className="h-4 w-4" /> Shops
              </Link>
              <Link to="/cart" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <ShoppingCart className="h-4 w-4" /> Cart
              </Link>
              <Link to="/history" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <Clock className="h-4 w-4" /> Order History
              </Link>
              <Link to="/coupons" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <Ticket className="h-4 w-4" /> Coupons
              </Link>
            </nav>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Contact</h4>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p>info@elfitechfooddash.com</p>
              <p>+1 302 543 20 12</p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Elfitech Food Dash. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
