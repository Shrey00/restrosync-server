import {Router} from 'express';
import { uptime } from 'process';
// import { signup } from './api/users';
const route = Router();


//FOOD DELIVERY APP

//show list of restaurants
//get restaurant details along with menu  == for food delivery each restaurant is a food delivery app. -> can have related branches
//get previous orders in this restaurant
//place order
//get the menu list of restaurant
//some filters on the menu
//add to cart and then order

//Current API Endpoint naming style is not in parameterized form like restaurants/restaurantId=

// @desc To get entities, users, restaurants, menu, reviews information
// BUSSINESS LOGICS SAYS
// a user signs up
// a user creates a entity, business entity.
// a enitity can have multiple restaurants, to checkout the total orders, and revenue.
// app for each restaurant, shows the food items, popular foods, place orders etc.
// route.post('/login')
// route.post('/signup');
// route.get('/entities');
// route.get('/entity?entityId={id}');
// route.get('/restaurants?page={page}&limit={10}');
// route.get('/restaurant?restaurantId={id}'); 
// route.get('/menu?restaurantId={id}');
// route.get('/reviews?restaurantId={id}');
// route.get('/review?retaurantId={id}');
// route.get('/item-review?menuItem={id}/{menuItemId}');
// route.get('/check-address/geo={geo}');
// route.get('/restaurants-near-me?geo={geo}')

//give delivery estimate for the given location
//QR CODE AND BOOKING APP WITH REWARDS THING
//RESTAURANT MANAGEMEN