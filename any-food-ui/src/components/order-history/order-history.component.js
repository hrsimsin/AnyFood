import {useState, useEffect} from "react";
import DataService from "../../services/data.service";

export default function OrderHistoryComponent() {
    const [pastOrders, setPastOrders] = useState([]);

    useEffect(() => {
        (async () => {
            const pastOrders = (await DataService.getPastOrders()).sort( (a,b) => b.timestamp - a.timestamp);
            setPastOrders(pastOrders);
        })();
    },[]);

    return (
      pastOrders.length > 0 ?
          <>
              <div className="screen-title">Order History</div>
          <ol className="past-orders-list">
          {pastOrders.map(order =>
            <div key={order._id} className="past-order">
                <div className="past-order-heading">{(new Date(order.timestamp)).toLocaleString('en-IN')}</div>
                <ul>
                    {
                        order.order.map(item =>
                            <li key={item._id}>
                                <div>Dish Name: {item.dishName}</div>
                                <div>Restaurant Name: {item.restaurantName}</div>
                                <div>Dish Price: {item.dishPrice}</div>
                                <div>Quantity: {item.quantity}</div>
                            </li>
                        )
                    }
                </ul>
            </div>
          )}
      </ol> </>: <div className="full-screen-message">No Order History.</div>
    );
}