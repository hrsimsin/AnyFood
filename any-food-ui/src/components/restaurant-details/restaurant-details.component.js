import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import DataService from "../../services/data.service";

class RestaurantDetailsModel {
    name = "";
    place = "";
    cuisine = "";
    averagePriceForTwo = "";
    menu = [];
    cart = [];
}

export default function RestaurantDetailsComponent() {
    const { restaurantId } = useParams();
    const [model, setModel] = useState(new RestaurantDetailsModel());

    function getQuantityInCart(dish) {
        return model.cart.find(item => item.restaurantName === model.name && item.dishName === dish.dishName)?.quantity || 0;
    }

    async function increaseQuantityInCart(dish) {
        const cart = model.cart;
        const cartItemIndex = cart.findIndex(item => item.restaurantName === model.name && item.dishName === dish.dishName);
        if(cartItemIndex === -1){
            cart.push({
                restaurantName: model.name,
                dishPrice: dish.dishPrice,
                dishName: dish.dishName,
                quantity: 1
            });
        }
        else {
            cart[cartItemIndex].quantity += 1;
        }
        const updatedCart = await DataService.updateCart(cart);
        setModel({
            ...model,
            cart:updatedCart
        });
    }

    async function decreaseQuantityInCart(dish) {
        let cart = model.cart;
        const cartItemIndex = cart.findIndex(item => item.restaurantName === model.name && item.dishName === dish.dishName);
        if(cart[cartItemIndex].quantity === 1)
            cart = cart.filter(item => !(item.restaurantName === model.name && item.dishName === dish.dishName));
        else
            cart[cartItemIndex].quantity -= 1;
        const updatedCart = await DataService.updateCart(cart);
        setModel({
            ...model,
            cart:updatedCart
        });
    }

    useEffect(() => {
        (async () => {
            const restaurantDetails = await DataService.getRestaurantDetails(restaurantId);
            const cart = await DataService.getCart();
            setModel({
               ...model,
               name: restaurantDetails.name,
               place: restaurantDetails.place,
               cuisine: restaurantDetails.cuisine,
               averagePriceForTwo: restaurantDetails.averagePriceForTwo,
               menu: restaurantDetails.menu,
               cart: cart
            });
        })();
    },[]);
    return (
        <>
            <div className="screen-title">{model.name}</div>
            <div className="restaurant-details">
                <div>Located at {model.place}</div>
                <div>{model.cuisine} Cuisine</div>
                <div>Average Price for two: {model.averagePriceForTwo}</div>
                <h3>Menu</h3>
                <ul className="menu">
                    {
                        model.menu.map(dish =>
                            <li key={dish._id}>
                                <div>
                                    <div>{dish.dishName}</div>
                                    <div>Price: {dish.dishPrice}</div>
                                </div>
                                <div style={{flex: 1}}/>
                                {
                                    getQuantityInCart(dish) === 0 ?
                                        <button onClick={() => increaseQuantityInCart(dish)}>Add to Cart</button>
                                        :
                                        <div className="quantity-selector">
                                            <button onClick={() => decreaseQuantityInCart(dish)}>-</button>
                                            <div>{getQuantityInCart(dish)}</div>
                                            <button onClick={() => increaseQuantityInCart(dish)}>+</button>
                                        </div>
                                }
                            </li>
                        )
                    }
                </ul>
            </div>
        </>

    );
}