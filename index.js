const telegram_bot = require("./telegram_bot");
const storage = require('./storage');

storage.init().then(() => {
    telegram_bot.init();
});
