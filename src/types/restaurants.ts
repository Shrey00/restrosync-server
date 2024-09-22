//types for restaurants and menu
//@TODO - Set correct type for next_opening_time and next_closing_time
export interface Restaurant {
    name: string, 
    email: string
    contact: string
    countryCode: string, 
    description: string, 
    rating?: number,
    address: {
        address: string,
        landmark: string,
        city: string,
        district: string,
        latitude: number,
        longitude: number
    }
    logo: string | null,
    imgList: string[] | null,
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