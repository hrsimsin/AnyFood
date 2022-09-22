const express = require("express");
const authenticator = require("../middleware/authenticator");
const ResponseUtils = require("../utils/response-utils");
const {query, validationResult, param, body} = require("express-validator");
const errorCheck = require("../middleware/error-check");
const Restaurant = require("../models/restaurant");

const router = express.Router();

const Cuisines = ["multi", "chinese", "continental", "indian", "mexican"];
const Places = ["north bangalore","west bangalore","east bangalore","south bangalore"];

const duplicateRestaurantNameValidator = (name) => {
    return new Promise(async (resolve, reject) => {
        const restaurant = await Restaurant.findOne({name});
        if (restaurant) reject("Duplicate restaurant name.");
        resolve();
    });
}

const menuValidator = (menu) => {
    return new Promise(async (resolve, reject) => {
        if (!menu)
            reject("Param menu not provided.");
        if (!Array.isArray(menu) || menu.length < 1 || menu.length > 1000)
            reject("Param menu should be an array with length b/w 1-1000");
        const dishSet = new Set();
        for (const menuItem of menu) {
            const {dishName, dishPrice} = menuItem;
            if (!dishName || !(typeof dishName == 'string') || dishName.length === 0)
                reject("Invalid Menu -- dishName should be a non-empty string.");
            if (!dishPrice || !(typeof dishPrice == 'number') || !Number.isInteger(dishPrice) || dishPrice < 5 || dishPrice > 10000)
                reject("Invalid Menu -- dishPrice should be an integer b/w 5-10000");
            if (dishSet.has(dishName))
                reject("Invalid Menu -- duplicate dish.");
            dishSet.add(dishName);
        }
        resolve();
    });
}

router.post('/',
    authenticator,
    body("name")
        .notEmpty()
        .withMessage("Param name not provided.")
        .custom(duplicateRestaurantNameValidator),
    body("place")
        .notEmpty()
        .withMessage("Param place not provided.")
        .isIn(Places)
        .withMessage(`Param place should be one of ${JSON.stringify(Places)}`),
    body("cuisine")
        .notEmpty()
        .withMessage("Param cuisine not provided.")
        .isIn(Cuisines)
        .withMessage(`Param cuisine should be one of ${JSON.stringify(Cuisines)}`),
    body("averagePriceForTwo")
        .notEmpty()
        .withMessage("Param averagePriceForTwo not provided.")
        .isInt({min: 100, max: 20000})
        .withMessage("Param averagePriceForTwo should be an integer value b/w 100-20000."),
    body("menu")
        .notEmpty()
        .withMessage("Param menu not provided")
        .isArray({min: 1, max: 1000})
        .withMessage("Param menu should be an array with length b/w 1-1000")
        .custom(menuValidator),
    errorCheck,
    async (req, res) => {
        const {name, place, cuisine, averagePriceForTwo, menu} = req.body;
        try {
            const createdDoc = await Restaurant.create({
                name,
                place,
                cuisine,
                averagePriceForTwo,
                menu
            });
            ResponseUtils.success(res, `Restaurant added.`,createdDoc._id);
        }
        catch(error) {
            ResponseUtils.serverError(res, error.message);
        }
    });

router.get('/:id',
    authenticator
    , errorCheck, async (req, res) => {
        const restaurantID = req.params.id
        try {
            const restaurant = await Restaurant.findOne({_id: restaurantID});
            if (restaurant)
                ResponseUtils.success(res, "Restaurant fetched", restaurant);
            else
                ResponseUtils.badRequest(res, "Invalid Restaurant ID.");
        }
        catch(error) {
            ResponseUtils.badRequest(res, "Invalid Restaurant ID.");
        }
    });

router.get('/', authenticator, async (req, res) => {
    const restaurants = await Restaurant.find({}, "name place cuisine averagePriceForTwo");
    ResponseUtils.success(res, "Restaurants fetched.", restaurants);
});

module.exports = router;