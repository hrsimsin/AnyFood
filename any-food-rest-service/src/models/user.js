const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email: { $type: String, required: true, unique: true },
        password: { $type: String, required: true },
        name: { $type: String, required: true },
        cart: {
            $type: [
                {
                    dishName: { $type: String, required: true },
                    dishPrice: { $type: Number, required: true },
                    restaurantName: { $type: String, required: true },
                    quantity: {$type: Number, required: true}
                }
            ], required: false},
        pastOrders: {
            $type: [
                {
                    order: [{
                        dishName: {$type: String, required: true},
                        dishPrice: {$type: Number, required: true},
                        restaurantName: {$type: String, required: true},
                        quantity: {$type: Number, required: true}
                    }],
                    timestamp: {$type: Number, required: true}
                }
            ], required: false
        }
    },
    { typeKey: "$type" }
);

module.exports = mongoose.model("User", userSchema);
