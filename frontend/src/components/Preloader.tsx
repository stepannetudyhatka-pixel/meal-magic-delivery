export function Preloader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="relative flex items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
      <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">Загрузка FoodDash…</p>
    </div>
  );
}
