
const TelegramBot = require('node-telegram-bot-api');
const mongodb = require('./mongodb');

const token = '5842425234:AAElCs43QWJ21ufpJ5ZrF2zrox9SPPv8Jjo';//@Cuntliments_bot

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

const allowedList = [
    "fgoja"
];
module.exports = {
    init: () => {
        bot.on('callback_query', function onCallbackQuery(callbackQuery) {
            console.log(JSON.stringify(msg));
        });
        bot.onText(/\/start/, (msg, match) => {
            sendCuntlimentTo(msg.chat.id);
        });
        // bot.setMyCommands([
        //     { command: '/i_demand_attention', description: 'Давай еще' },
        // ]);

        bot.onText(/[еЕ]ще/, (msg, match) => {
            sendCuntlimentTo(msg.chat.id);
        });
        bot.onText(/\/i_demand_attention/, (msg, match) => {
            sendCuntlimentTo(msg.chat.id);
        });


        bot.onText(/\/add_cuntliment/, (msg, match) => {
            if (!allowedList.includes(msg.chat.username)) {
                bot.sendMessage(msg.chat.id, 'Люблю тебя, малышка, но тебе нельзя так делать');
                return;
            }
            var text = msg.text.replace('\/add_cuntliment ', '');
            mongodb.addCuntliment(text).then(res => {
                bot.sendMessage(msg.chat.id, 'Спасибо, текст \"' + text + '\" успешно добавлен');
            });
        });
        bot.on("polling_error", console.log);

        // bot.on("message", (msg) => {
        //     console.log(JSON.stringify(msg));
        // });
    },
}

const requestCuntlimentButton = {
    "reply_markup": {
        is_persistent: true,
        resize_keyboard: true,
        "keyboard": [[{
            text: "Еще",
            // data: "get_more",
        }]]
    }
};

function sendCuntlimentTo(chatId) {
    mongodb.getCuntliment().then(res => {
        console.log("sending cuntliment: " + res.text);
        bot.sendMessage(chatId, res.text, requestCuntlimentButton);
        // bot.setChatMenuButton({chat_id: chatId, })
        // bot.inline
    });
}
