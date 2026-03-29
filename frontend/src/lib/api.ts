export interface Shop {
  id: string;
  name: string;
  image_url: string | null;
  rating: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  shop_id: string;
  category_id: string;
  discount_percent: number;
}

export interface Coupon {
  id: string;
  name: string;
  code: string;
  discount_percent: number;
  image_url: string | null;
  active: boolean;
}

export interface ProductWithRelations extends Product {
  shop?: Shop;
  category?: Category;
}

export interface OrderItemView {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    image_url: string | null;
    price: number;
    shop_id: string;
  } | null;
}

export interface OrderView {
  id: string;
  email: string;
  phone: string;
  address: string;
  total_price: number;
  coupon_code: string | null;
  created_at: string;
  items: OrderItemView[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function mapShop(input: any): Shop {
  return {
    id: input.id,
    name: input.name,
    image_url: input.imageUrl ?? null,
    rating: Number(input.rating),
  };
}

function mapCategory(input: any): Category {
  return { id: input.id, name: input.name };
}

function mapProduct(input: any): Product {
  return {
    id: input.id,
    name: input.name,
    price: Number(input.price),
    image_url: input.imageUrl ?? null,
    shop_id: input.shopId,
    category_id: input.categoryId,
    discount_percent: input.discountPercent ?? 0,
  };
}

function mapCoupon(input: any): Coupon {
  return {
    id: input.id,
    name: input.name,
    code: input.code,
    discount_percent: input.discountPercent,
    image_url: input.imageUrl ?? null,
    active: Boolean(input.active),
  };
}

function mapOrder(input: any): OrderView {
  return {
    id: input.id,
    email: input.email,
    phone: input.phone,
    address: input.address,
    total_price: Number(input.totalPrice),
    coupon_code: input.couponCode ?? null,
    created_at: input.createdAt,
    items: (input.items || []).map((item: any) => ({
      id: item.id,
      quantity: item.quantity,
      price: Number(item.price),
      product: item.product
        ? {
            id: item.product.id,
            name: item.product.name,
            image_url: item.product.imageUrl ?? null,
            price: Number(item.product.price),
            shop_id: item.product.shopId,
          }
        : null,
    })),
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  async getShops(minRating?: number, maxRating?: number) {
    const search = new URLSearchParams();
    if (typeof minRating === 'number') search.set('minRating', String(minRating));
    if (typeof maxRating === 'number') search.set('maxRating', String(maxRating));
    const data = await request<any[]>(`/shops${search.toString() ? `?${search}` : ''}`);
    return data.map(mapShop);
  },

  async getCategories() {
    const data = await request<any[]>('/categories');
    return data.map(mapCategory);
  },

  async getProducts(params: {
    shopId: string;
    categoryIds?: string[];
    page: number;
    limit: number;
    sortBy: 'name' | 'price';
    sortDir: 'asc' | 'desc';
  }): Promise<ProductsResponse> {
    const search = new URLSearchParams({
      shopId: params.shopId,
      page: String(params.page),
      limit: String(params.limit),
      sortBy: params.sortBy,
      sortDir: params.sortDir,
    });
    if (params.categoryIds?.length) {
      search.set('categoryIds', params.categoryIds.join(','));
    }
    const data = await request<any>(`/products?${search.toString()}`);
    return {
      ...data,
      items: (data.items || []).map(mapProduct),
      total: Number(data.total || 0),
    };
  },

  async getProductById(id: string): Promise<ProductWithRelations | null> {
    try {
      const data = await request<any>(`/products/${id}`);
      return {
        ...mapProduct(data),
        shop: data.shop ? mapShop(data.shop) : undefined,
        category: data.category ? mapCategory(data.category) : undefined,
      };
    } catch {
      return null;
    }
  },

  async getCoupons(page = 1, limit = 6) {
    const search = new URLSearchParams({ page: String(page), limit: String(limit) });
    const data = await request<any>(`/coupons?${search.toString()}`);
    return {
      ...data,
      items: (data.items || []).map(mapCoupon),
      total: Number(data.total || 0),
      page: Number(data.page || 1),
      limit: Number(data.limit || 6),
      totalPages: Number(data.totalPages || 1),
      hasMore: Boolean(data.hasMore),
    } as PaginatedResponse<Coupon>;
  },

  async validateCoupon(code: string) {
    const data = await request<any>(`/coupons/validate/${encodeURIComponent(code)}`);
    return mapCoupon(data);
  },

  async createOrder(payload: {
    email: string;
    phone: string;
    address: string;
    totalPrice: number;
    couponCode?: string;
    items: { productId: string; quantity: number; price: number }[];
  }) {
    return request<OrderView>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async searchOrders(email: string, phone: string, page = 1, limit = 6) {
    const search = new URLSearchParams({ email, phone, page: String(page), limit: String(limit) });
    const data = await request<any>(`/orders/search?${search.toString()}`);
    return {
      ...data,
      items: (data.items || []).map(mapOrder),
      total: Number(data.total || 0),
      page: Number(data.page || 1),
      limit: Number(data.limit || limit),
      totalPages: Number(data.totalPages || 1),
      hasMore: Boolean(data.hasMore),
    } as PaginatedResponse<OrderView>;
  },
};
