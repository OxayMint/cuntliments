const telegram_bot = require("./telegram_bot");
const mongodb = require('./mongodb');


mongodb.init().then(client => {
    telegram_bot.init();
});
