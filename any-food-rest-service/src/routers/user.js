const express = require("express");
const authenticator = require("../middleware/authenticator");
const ResponseUtils = require("../utils/response-utils");
const {query, validationResult, param, body} = require("express-validator");
const errorCheck = require("../middleware/error-check");
const Restaurant = require("../models/restaurant");
const User = require("../models/user");

const router = express.Router();

router.get('/cart',
    authenticator,
    errorCheck,
    (req,res) => {
        const user = req.user;
        ResponseUtils.success(res, "Cart fetched", user.cart);
    });

router.get('/past-orders',
    authenticator,
    errorCheck,
    (req,res) => {
        const user = req.user;
        ResponseUtils.success(res, "Past Orders fetched", user.pastOrders);
    });

router.post('/cart',
    authenticator,
    errorCheck,
    async (req,res) => {
        const user = req.user;
        user.cart = req.body;
        try {
            await user.save();
            ResponseUtils.success(res,"Cart Saved",user.cart);
        }
        catch(error) {
            ResponseUtils.serverError(res, error.message);
        }
    });

router.post('/checkout', authenticator, errorCheck, async (req, res) => {
    const user = req.user;
    user.pastOrders.push({
        order: user.cart,
        timestamp: Date.now()
    });
    user.cart = [];
    try {
        await user.save();
        ResponseUtils.success(res,"Checked Out",user.cart);
    }
    catch(error) {
        ResponseUtils.serverError(res, error.message);
    }
});

module.exports = router;