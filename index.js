const telegram_bot = require("./telegram_bot");
const mongodb = require('./mongodb');

await mongodb.init();
telegram_bot.init();