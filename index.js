const telegram_bot = require("./telegram_bot");
const storage = require('./storage');

storage.init().then(() => {
    console.log('storage ready');
    telegram_bot.init();
    console.log('bot started');
});
