import {useState, useEffect} from "react";
import DataService from "../../services/data.service";
import { Navigate } from "react-router-dom";

export default function CartComponent() {
    const [cart, setCart] = useState([]);
    const [checkedOut, setCheckedOut] = useState(false);

    useEffect(() => {
        (async () => {
            const cart = await DataService.getCart();
            setCart(cart);
        })();
    },[]);

    async function increaseQuantityInCart(dish) {
        const cartItemIndex = cart.findIndex(item => item.restaurantName === dish.restaurantName && item.dishName === dish.dishName);
        if(cartItemIndex === -1){
            cart.push({
                restaurantName: dish.restaurantName,
                dishPrice: dish.dishPrice,
                dishName: dish.dishName,
                quantity: 1
            });
        }
        else {
            cart[cartItemIndex].quantity += 1;
        }
        const updatedCart = await DataService.updateCart(cart);
        setCart(updatedCart);
    }

    async function decreaseQuantityInCart(dish) {
        let updatedCart = [...cart];
        const cartItemIndex = cart.findIndex(item => item.restaurantName === dish.restaurantName && item.dishName === dish.dishName);
        if(cart[cartItemIndex].quantity === 1)
            updatedCart = updatedCart.filter(item => !(item.restaurantName === dish.restaurantName && item.dishName === dish.dishName));
        else
            updatedCart[cartItemIndex].quantity -= 1;
        updatedCart = await DataService.updateCart(updatedCart);
        setCart(updatedCart);
    }

    async function checkout() {
        const updatedCart = await DataService.checkout();
        setCart(updatedCart);
        setCheckedOut(true);
    }

    function getCartTotalValue() {
        return cart.reduce((prev, cur) => {
            return prev + cur.dishPrice * cur.quantity;
        },0);
    }

    return (
        !checkedOut ?
        <>
            <div className="screen-title">Cart</div>
            <div className="cart-component">
                {cart.length > 0 && <ul className="cart-list">
                    {
                        cart.map(dish =>
                            <li key={`${dish.dishName}-${dish.restaurantName}`}>
                                <div>
                                    <div>{dish.dishName}</div>
                                    <div style={{fontSize: '0.7rem'}}>From {dish.restaurantName}</div>
                                </div>
                                <div style={{flex:1}} />
                                <div style={{marginRight: '1em'}}>{dish.dishPrice}</div>
                                x
                                <div className="quantity-selector" style={{marginLeft: '1em', marginRight: '1em'}}>
                                    <button onClick={() => decreaseQuantityInCart(dish)}>-</button>
                                    <div>{dish.quantity}</div>
                                    <button onClick={() => increaseQuantityInCart(dish)}>+</button>
                                </div>
                                =
                                <div style={{marginLeft: '1em'}}>{dish.dishPrice * dish.quantity}</div>
                            </li>
                        )
                    }
                </ul>}
                {cart.length > 0 &&
                    <div className="bottom-bar">
                        <div>
                            Total Amount = {getCartTotalValue()}
                        </div>
                        <div style={{flex:1}} />
                        <button onClick={checkout}>Checkout</button>
                    </div>
                }
                {
                    cart.length === 0 &&
                    <div className="full-screen-message">
                        <div>Cart is Empty</div>
                    </div>
                }
            </div>
        </> : <Navigate to={`/app/order-history`} replace={true}/>
    );
}