(async () => {
    const express = require('express');
    const mongoose = require('mongoose');
    const Config = require('./config');
    const cors = require('cors');

    const app = express();

    app.use(cors());
    console.log(Config.databaseUrl);
    await mongoose.connect(Config.databaseUrl);

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    app.use("/auth", require("./routers/auth"));
    app.use("/user", require("./routers/user"));
    app.use("/restaurant", require("./routers/restaurant"));

    app.listen(Config.port, Config.ip);
    console.log(`Server is listening on ${Config.ip}:${Config.port}`);
})();