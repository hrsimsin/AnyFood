import {Link} from "react-router-dom";

export default function RestaurantListComponent(props) {
    return (
      <ul className="restaurant-list">
          {
              props.list.map(restaurant => {
                 return (
                   <li key={restaurant.name}>
                       <div className="name">{restaurant.name}</div>
                       <div className="detail">Located at <span>{restaurant.place}</span></div>
                       <div className="detail"><span>{restaurant.cuisine}</span> Cuisine</div>
                       <div className="detail">Price for two: <span>{restaurant.averagePriceForTwo}</span></div>
                       <div className="menu-link">
                        <Link  to={`/app/restaurant/${restaurant._id}`}>View Menu</Link>
                       </div>
                   </li>
                 );
              })
          }
      </ul>
    );
}