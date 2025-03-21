export interface MenuItem {
    id:string,
    name: string,
    restaurantId: string,
    category: string,
    categoryId: number,
    type: string,
    cuisineType: string,
    orders?: number,
    description: string,
    available: boolean, 
    rating?: number,
    reviewSummary?: string,
    markedPrice: number,
    sellingPrice: number,
    discount: number,
    calories?: number,
    healthScore?: number,
    showHealthInfo?: boolean,
    images: string[],
    variant?: string,
}

export interface MenuVariants extends Partial<MenuItem> {
    id: string,
    name:string,
}

export interface MenuItemRequestBody extends MenuItem {
    userId?: string,
    mainItemId?: string,
    variantName?:string,
}