import {useEffect, useState} from "react";
import DataService from "../../services/data.service";
import {Navigate} from "react-router-dom";

class OnboardFormModel {
    name = "";
    averagePriceForTwo = 100;
    place = "north bangalore";
    cuisine= "multi";
    menu=[];
    cuisineOptions = ["multi", "chinese", "continental", "indian", "mexican"];
    placeOptions = ["north bangalore","west bangalore","east bangalore","south bangalore"];
}

export default function OnboardRestaurantComponent() {
    const [model, setModel] = useState(new OnboardFormModel());
    const [createdId, setCreatedId] = useState("");
    const [restaurantList, setRestaurantList] = useState([]);

    function submitEnabled() {
        if(!model.name.length || model.name.length === 0)
            return false;
        if(restaurantList.map(el => el.name.toLowerCase()).includes(model.name.toLowerCase()))
            return false;
        if(model.averagePriceForTwo<100 || model.averagePriceForTwo>20000)
            return false;
        if(!model.place)
            return false;
        if(!model.cuisine)
            return false;
        if(!model.menu || model.menu.length === 0)
            return false;
        const nameSet = new Set();
        for(const item of model.menu){
            if(!item.dishName)
                return false;
            if(nameSet.has(item.dishName)){
                return false;
            }
            else{
                nameSet.add(item.dishName);
                if(item.dishPrice < 5 || item.dishPrice > 20000)
                    return false;
            }
        }
        return true;
    }

    function addMenuItem() {
        setModel({
           ...model,
           menu: [...model.menu, {
               dishName: "",
               dishPrice: 100
           }]
        });
    }

    function removeMenuIndex(indexToRemove) {
        const updatedMenu = model.menu.filter((el,index) => index !== indexToRemove);
        setModel({
            ...model,
            menu: [...updatedMenu]
        });
    }

    function updateDishName(dishIndex, name) {
        const updatedMenu = model.menu.map((el, index) => {
            if(index === dishIndex)
                el.dishName = name;
            return el;
        });
        setModel({
           ...model,
           menu: [...updatedMenu]
        });
    }
    function updateDishPrice(dishIndex, price) {
        const updatedMenu = model.menu.map((el, index) => {
            if(index === dishIndex)
                el.dishPrice = price;
            return el;
        });
        setModel({
            ...model,
            menu: [...updatedMenu]
        });
    }
    async function saveRestaurant() {
        const newRestaurantId = await DataService.saveRestaurant(model);
        setCreatedId(newRestaurantId);
    }

    useEffect(() => {
        (async () => {
            setRestaurantList(await DataService.getRestaurantList());
        })();
    },[]);

    return (
        createdId.length === 0 ?
      <form className="onboard-restaurant-component">
          <label>
              Restaurant Name: (Should be Unique)
              <input type="text" value={model.name}  onChange={e => setModel({...model, name: e.target.value})} />
          </label>
          <label>
              Place:
              <select value={model.place} onChange={e => setModel({...model, place: e.target.value})}>
                  {
                      model.placeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)
                  }
              </select>
          </label>
          <label>
              Cuisine:
              <select value={model.cuisine} onChange={e => setModel({...model, cuisine: e.target.value})}>
                  {
                      model.cuisineOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)
                  }
              </select>
          </label>
          <label>
              Average Price for 2:
              <input type="number" min="100" max="20000" value={model.averagePriceForTwo}  onChange={e => setModel({...model, averagePriceForTwo: e.target.value})}/>
          </label>
          <h3>Menu</h3>
          {
              model.menu.map((el,index) =>
                <div key={index} className="dish">
                        <label>
                            Dish Name
                            <input type="text" value={el.dishName} onChange={e => {updateDishName(index, e.target.value)}} />
                        </label>
                        <label>
                            Dish Price
                            <input type="number" min="5" max="20000" value={el.dishPrice} onChange={e => {updateDishPrice(index, e.target.value)}} />
                        </label>
                    <button onClick={() => removeMenuIndex(index)} type="button">
                        Remove Dish
                    </button>
                </div>
              )
          }
          <button onClick={addMenuItem} type="button">Add Dish</button>
          <button disabled={!submitEnabled()} onClick={saveRestaurant} type="button">Save</button>
      </form> : <Navigate to={`/app/restaurant/${createdId}`}/>
    );
}