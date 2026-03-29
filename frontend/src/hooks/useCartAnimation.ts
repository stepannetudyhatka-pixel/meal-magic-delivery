import { useCallback } from 'react';

/**
 * Creates a flying element animation from a source element to the cart icon.
 * The animation clones the source element's image and animates it toward
 * the cart nav link using CSS transitions.
 */
export function useCartAnimation() {
  const animate = useCallback((event: React.MouseEvent, imageUrl?: string | null) => {
    const cartIcon = document.querySelector('[data-cart-icon]');
    if (!cartIcon) return;

    const cartRect = cartIcon.getBoundingClientRect();

    // Find the closest card image or use click position
    const button = event.currentTarget as HTMLElement;
    const card = button.closest('.group') || button.closest('[data-product-card]');
    const img = card?.querySelector('img');

    const startX = img ? img.getBoundingClientRect().left + img.getBoundingClientRect().width / 2 : event.clientX;
    const startY = img ? img.getBoundingClientRect().top + img.getBoundingClientRect().height / 2 : event.clientY;
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;

    // Create flying element
    const flyer = document.createElement('div');
    flyer.style.cssText = `
      position: fixed;
      z-index: 9999;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
      pointer-events: none;
      left: ${startX - 24}px;
      top: ${startY - 24}px;
      transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;

    if (img) {
      const clone = document.createElement('img');
      clone.src = img.src;
      clone.style.cssText = 'width:100%;height:100%;object-fit:cover;';
      flyer.appendChild(clone);
    } else {
      flyer.style.background = 'hsl(var(--primary))';
    }

    document.body.appendChild(flyer);

    // Trigger animation on next frame
    requestAnimationFrame(() => {
      flyer.style.left = `${endX - 12}px`;
      flyer.style.top = `${endY - 12}px`;
      flyer.style.width = '24px';
      flyer.style.height = '24px';
      flyer.style.opacity = '0.3';
      flyer.style.transform = 'scale(0.3)';
    });

    // Bounce the cart icon
    setTimeout(() => {
      cartIcon.classList.add('animate-bounce-once');
      setTimeout(() => cartIcon.classList.remove('animate-bounce-once'), 400);
    }, 500);

    // Clean up
    setTimeout(() => flyer.remove(), 650);
  }, []);

  return animate;
}
