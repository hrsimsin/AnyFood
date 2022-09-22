const ConfigSecret = require("./config-secret");

class Config {
    static port = process.env.PORT;
    static ip = process.env.IP;
    static jwtSecret = process.env.JWT;
    static databaseUrl = process.env.DBURL;
}

module.exports = Config;