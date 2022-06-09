require(`dotenv`).config({path: "./vars/.env"});
const TelegramBot = require("node-telegram-bot-api");
const axios = require(`axios`);
const path = require(`path`)
const  { getCaption,getPagination,getKeyboard, getInfo ,greetings, mainKeyboard} = require(`./helper.js`);
const bot = new TelegramBot(JSON.parse(process.env.TELEGRAM_TOKEN),{
    polling:{
        interval:300,
        autoStart: true,
        params:{
            timeout:10,
        }
    }
});
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId,greetings, {
        reply_markup: {
            keyboard: mainKeyboard
        },
        resize_keyboard: true,
    });
})
bot.onText(/👽Characters/, async (msg) => {
    const chatId = msg.chat.id;
    let inline_keyboard = await getKeyboard(`character`);
    bot.sendPhoto(chatId, path.join(__dirname, `img`, `rick-and-morty-book-four-9781620105948_hr.jpg`), {
        caption: `👽Characters`,
        reply_markup: {
            inline_keyboard,
            resize_keyboard: false
        }
    })
        .catch(e => {

        })
})
bot.onText(/🎥Episodes/, async (msg) => {
    const chatId = msg.chat.id;
    let inline_keyboard = await getKeyboard(`episode`);
    bot.sendPhoto(chatId, path.join(__dirname, `img`, `Rick-and-Morty-фэндомы-продолжение-4464365.jpeg`), {
        caption: `👽Episodes`,
        reply_markup: {
            inline_keyboard,
            resize_keyboard: false
        }
    })
        .catch(()=> {
            bot.sendMessage(chatId, `Ooops, went wrong`)
        }  )
})
bot.onText(/🌌Locations/, async (msg) => {
    const chatId = msg.chat.id;
    console.log(msg)
    let inline_keyboard = await getKeyboard(`location`);
    bot.sendPhoto(chatId, path.join(__dirname, `img`, `Rick-and-Morty-фэндомы-продолжение-4464365.jpeg`), {
        caption: `👽Episodes`,
        reply_markup: {
            inline_keyboard,
            resize_keyboard: false
        }
    })
        .catch(()=> {
            bot.sendMessage(chatId, `Ooops, went wrong`)
        }  )
})
bot.onText(/\/[a-z]+(\s.+)/, async (msg,[source, sentence]) => {
       const chat_id = msg.chat.id;
       const results = await getInfo(source,sentence);
       for (let result of results) {
        if(source.match(/\/character/)){
            await bot.sendPhoto(chat_id, `${result.image}`, {
                caption: await getCaption(result),
                parse_mode: `HTML`,
            })
        }
        else{
            await bot.sendMessage(chat_id, await getCaption(result), {
                parse_mode: `HTML`,
            })
        }
}})
bot.on('callback_query', async (msg) => {
    const chat_id = msg.message.chat.id;
    const message_id = msg.message.message_id;
    if(isNaN(parseInt(msg.data))) {
        console.log(msg.data)
            axios.get(`http://localhost:4200/api/${msg.data}`)
                .then(async (response) => {
                    const {data} = response.data;
                    if (data.hasOwnProperty(`image`)) {
                        await bot.sendPhoto(chat_id, `${data.image}`, {
                            caption: await getCaption(data),
                            parse_mode: `HTML`,
                        })
                    } else {
                        await bot.sendMessage(chat_id, await getCaption(data), {
                            parse_mode: `HTML`,
                        })
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
    }
    else{
        const query = msg.data;
        const current = parseInt(msg.data);
        const essence = query.split(` `)[query.split(` `).length - 1];
        console.log(essence)
        let btn = [];
        axios.get(`http://localhost:4200/api/${essence}`)
            .then(response => {
                console.log(response);
                let results = response.data;
                let btn = [];
                for(let i = current * 5; i < current * 5 + 5; i++){
                    btn.push([{text: results[i].name, callback_data:`${essence}/${results[i].id}`}])
                }
                bot.editMessageReplyMarkup(JSON.stringify({
                        inline_keyboard: btn.concat([getPagination(query, results.length / 5)]),
                        resize_keyboard: false,
                    }),
                    {
                        chat_id,
                        message_id,
                    }

                )
            })
            .catch((err)=> {

            })
    }
})
console.log(`Bot has been started...`)