import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AuthComponent from "./components/auth/auth.component";
import HomeComponent from "./components/home/home.component";
import RestaurantDetailsComponent from "./components/restaurant-details/restaurant-details.component";
import CartComponent from "./components/cart/cart.component";
import OrderHistoryComponent from "./components/order-history/order-history.component";
import LogoutComponent from "./components/logout/logout.component";
import RestaurantBrowser from "./components/restaurant-browser/restaurant-browser.component";
import OnboardRestaurantComponent from "./components/onboard-restaurant/onboard-restaurant.component";

const router = createBrowserRouter([
  {
    path:"/",
    element: <AuthComponent />
  },
  {
    path:"/app",
    element: <HomeComponent />,
    children: [
      {
        path:"restaurant/:restaurantId",
        element: <RestaurantDetailsComponent />
      },
      {
        path:"cart",
        element: <CartComponent />
      },
      {
        path:"order-history",
        element: <OrderHistoryComponent />
      },
      {
        path:"browse",
        element: <RestaurantBrowser />
      },
      {
        path:"onboard-restaurant",
        element: <OnboardRestaurantComponent />
      }
    ]
  },
  {
    path:"/logout",
    element: <LogoutComponent />
  }
]);

function App() {
  return (
      <RouterProvider router={router} />
  );
}

export default App;
