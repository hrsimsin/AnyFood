import RestaurantListComponent from "../restaurant-list/restaurant-list.component";
import {useEffect, useState} from "react";
import DataService from "../../services/data.service";

class RestaurantBrowserModel {
    restaurantList = [];
    searchQuery = "";
    filterMenuOpen = false;
    placeFilters = ["All","North Bangalore","East Bangalore","South Bangalore","West Bangalore"];
    appliedPlaceFilter = "All";
    cuisineFilters = ["All", "Multi", "Chinese", "Continental", "Indian", "Mexican"];
    appliedCuisineFilter = "All";
    priceFilters = ["All", "<500", "500 - 2000", ">2000"];
    appliedPriceFilter = "All";
    sortBy = "Name";
    sortOptions = ["Name","Place","Cuisine","Price - High to Low", "Price - Low to High"];
}

export default function RestaurantBrowser() {
    const [model, setModel] = useState(new RestaurantBrowserModel());

    const restaurantDisplayList = model.restaurantList.filter(restaurant => {
        let show = true;
        if(model.searchQuery) {
            show = restaurant.name.includes(model.searchQuery) || restaurant.place.includes(model.searchQuery) || restaurant.cuisine.includes(model.searchQuery);
        }
        if(model.appliedPlaceFilter !== "All" && restaurant.place.toLowerCase() !== model.appliedPlaceFilter.toLowerCase())
            show = false;
        if(model.appliedCuisineFilter !== "All" && restaurant.cuisine.toLowerCase() !== model.appliedCuisineFilter.toLowerCase())
            show = false;
        if(model.appliedPriceFilter !== "All") {
            if(model.appliedPriceFilter === "<500" && restaurant.averagePriceForTwo >= 500)
                show = false;
            if(model.appliedPriceFilter === "500 - 2000" && (restaurant.averagePriceForTwo < 500 || restaurant.averagePriceForTwo > 2000))
                show = false;
            if(model.appliedPriceFilter === ">2000" && restaurant.averagePriceForTwo <= 2000)
                show = false;
        }
        return show;
    }).sort((a,b) => {
        if(model.sortBy === "Name")
            return a.name.localeCompare(b.name);
        else if(model.sortBy === "Place")
            return a.place.localeCompare(b.place);
        else if(model.sortBy === "Cuisine")
            return a.cuisine.localeCompare(b.cuisine);
        else if(model.sortBy === "Price - High to Low")
            return b.averagePriceForTwo - a.averagePriceForTwo;
        else if(model.sortBy === "Price - Low to High")
            return a.averagePriceForTwo - b.averagePriceForTwo;
        return a.name.localeCompare(b.name);
    });

    useEffect(() => {
        (async () => {
            const list = await DataService.getRestaurantList();
            setModel({...model, restaurantList: list});
        })();
    },[]);

    return (
        <div className="restaurant-browser-component">
            <div className="screen-content">
                <label className="search-group">
                    Search Restaurants by Name/Place/Cuisine
                    <input className="search" type="text" value={model.searchQuery} onChange={e => setModel({...model, searchQuery: e.target.value})} />
                </label>
                <div className="sort-filter-row">
                    <label className="sort-group">
                    Sort By:
                    <select value={model.sortBy} onChange={e => setModel({...model, sortBy: e.target.value})}>
                        {
                            model.sortOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)
                        }
                    </select>
                </label>
                    <div style={{flex: 1}}></div>
                    <button className="filter-btn" onClick={() => setModel({...model, filterMenuOpen: true})}>Filter</button>
                </div>
                <RestaurantListComponent list={restaurantDisplayList}/>
            </div>
            {
                model.filterMenuOpen &&
                <div className="filter-menu-container">
                        <div className="filter-menu">
                            <div className="heading-row">
                                <div>Filter</div>
                                <div style={{flex:1}} />
                                <button onClick={() => setModel({...model, filterMenuOpen: false})}>Close</button>
                            </div>
                        <ul className="filter-list">
                            <li>
                                <div>Place</div>
                                <ul>
                                    {
                                        model.placeFilters.map(filter =>
                                            <li key={filter} className={filter === model.appliedPlaceFilter? 'selected' : ''} onClick={() => setModel({...model, appliedPlaceFilter: filter})}>
                                                {filter}
                                            </li>
                                        )
                                    }
                                </ul>
                            </li>
                            <li>
                                <div>Cuisine</div>
                                <ul>
                                    {
                                        model.cuisineFilters.map(filter =>
                                            <li key={filter} className={filter === model.appliedCuisineFilter ? 'selected' : ''} onClick={() => setModel({...model, appliedCuisineFilter: filter})}>
                                                {filter}
                                            </li>
                                        )
                                    }
                                </ul>
                            </li>
                            <li>
                                <div>Average Price</div>
                                <ul>
                                    {
                                        model.priceFilters.map(filter =>
                                            <li key={filter} className={filter === model.appliedPriceFilter ? 'selected' : ''} onClick={() => setModel({...model, appliedPriceFilter: filter})}>
                                                {filter}
                                            </li>
                                        )
                                    }
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            }
        </div>
    );
}