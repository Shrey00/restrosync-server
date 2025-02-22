export interface CartItem {
  restaurantId?: string;
  userId?: string;
  menuItemId?: string;
  quantity?: number;
  finalPrice?: number;
  addOns?: { id: string; name: string; sellingPrice: number }[];
}
