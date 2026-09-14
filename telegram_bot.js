
const TelegramBot = require('node-telegram-bot-api');
const storage = require('./storage');

const token = process.env.TELEGRAM_BOT_TOKEN || '5842425234:AAElCs43QWJ21ufpJ5ZrF2zrox9SPPv8Jjo';//@Cuntliments_bot

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

const allowedList = [
    "fgoja"
];
module.exports = {
    init: () => {
        bot.setMyCommands([
            { command: '/add_cuntliment', description: 'Suggest your cuntliment' },
        ]
        );
        bot.on('callback_query', (query) => {
            console.log(JSON.stringify(query));
            if (query.data.startsWith('remove')) {
                storage.removeSuggested(query.data.replace('remove ', ''));
            }
            else if (query.data.startsWith('promote')) {
                storage.moveSuggestedToEveryday(query.data.replace('promote ', ''));
            }
            //for now, while all the callback queries will be about suggested moderation, we can do it like this. can probably change this if this part expands
            sendSuggestedTo(query.message.chat.id);
            bot.deleteMessage(query.message.chat.id, query.message.message_id);
        });
        bot.onText(/\/start/, (msg, match) => {
            sendCuntlimentTo(msg.chat.id);
        });
        // bot.setMyCommands([
        //     { command: '/i_demand_attention', description: 'Давай еще' },
        // ]);
        bot.onText(/\/add_cuntliment/, async (msg, match) => {

            let listenerReply;

            let contentMessage = await bot.sendMessage(msg.chat.id, "Ну-ка, красотка, удиви меня", {
                "reply_markup": {
                    "force_reply": true
                }
            });

            listenerReply = (async (replyHandler) => {
                bot.removeReplyListener(listenerReply);
                storage.suggestCompliment(replyHandler.text, msg.chat.username);
                await bot.sendMessage(replyHandler.chat.id, `${replyHandler.text}\nЗвучит неплохо, золотце!🧐 А ты не только ебалом вышла 😏`, { "reply_markup": { "force_reply": false } })
            });

            bot.onReplyToMessage(contentMessage.chat.id, contentMessage.message_id, listenerReply);
        });

        bot.onText(/[еЕ]ще/, (msg, match) => {
            sendCuntlimentTo(msg.chat.id);
        });

        bot.onText(/\/cat_mode/, (msg, match) => {
            if (!allowedList.includes(msg.chat.username.toLowerCase())) {
                bot.sendMessage(msg.chat.id, 'Люблю тебя, малыш, но тебе нельзя так делать');
                return;
            }
            sendSuggestedTo(msg.chat.id);
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
        }], [
        ]]
    }
};


function sendCuntlimentTo(chatId) {
    storage.getCuntliment().then(res => {
        console.log("sending cuntliment: " + res.text);
        bot.sendMessage(chatId, res.text, requestCuntlimentButton);
        // bot.setChatMenuButton({chat_id: chatId, })
        // bot.inline
    }).catch(() => {
        bot.sendMessage(chatId, "пока пусто", requestCuntlimentButton);
    });
}

function sendSuggestedTo(chatId) {
    storage.getSuggestedCuntliment().then(res => {
        bot.sendMessage(chatId, res.text, {
            "reply_markup": {
                "inline_keyboard": [[
                    { text: "😑", callback_data: "remove " + res._id },
                    { text: "🤩", callback_data: "promote " + res._id },
                ]]
            }
        });
    }).catch(err => {
        bot.sendMessage(chatId, "предложек нет",);
    });
}
