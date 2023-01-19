const telegram_bot = require("./telegram_bot");
const mongodb = require('./mongodb');


async function run() {
    await mongodb.init();
    telegram_bot.init();
}

run();