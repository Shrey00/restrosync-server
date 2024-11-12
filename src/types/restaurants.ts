//types for restaurants and menu
//@TODO - Set correct type for next_opening_time and next_closing_time
export interface Restaurant {
    id: string,
    name: string, 
    email: string
    contact: string
    countryCode: string, 
    description: string, 
    rating?: number,
    address?: string
    logo: string | null,
    images: string[],
    cuisineType: 'veg' | 'non-veg' | 'multi-cuisine',
    opensAt: string,
    closesAt: string, 
    nextOpeningTime: any, //only to be used for temporary opening and closing of restaurants
    nextClosingTime: any, //only to be used for temporary opening and closing of restaurants
    acceptingOrders: boolean,
    createdAt?: Date,
    updatedAt?: Date,
}

export interface RestaurantRequestBody extends Restaurant {
    userId: string,
}