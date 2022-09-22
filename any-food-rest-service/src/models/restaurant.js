const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
        dishName: {$type: String, required: true},
        dishPrice: {$type: Number, required: true}
    },
    { typeKey: "$type" }
);

const restaurantSchema =  new mongoose.Schema(
    {
        name: {$type: String, required: true, unique: true},
        place: {$type: String, required: true},
        cuisine: {$type: String, required: true},
        averagePriceForTwo: {$type: Number, required: true},
        menu: [menuSchema]
    },
    { typeKey: "$type" }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);