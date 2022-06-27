require(`dotenv`).config({path: "./vars/.env"});
const TelegramBot = require("node-telegram-bot-api");
const axios = require(`axios`);
const path = require(`path`)
const  { getCaption,getPagination,getKeyboard, getInfo ,greetings, mainKeyboard} = require(`./helper.js`);
const { getToggleButton } = require("./helper");
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
    try {
        axios.post(`http://localhost:4200/api/favourite`, {id: msg.from.id})
            .then(async response => {
                if(response.status === 200){
                    await bot.sendMessage(chatId,greetings, {
                        reply_markup: {
                            keyboard: mainKeyboard
                        },
                        resize_keyboard: true,
                    });
                }
                else{
                    throw Error;
                }
            })
    }
    catch (e) {
       await bot.sendMessage(chatId, `Ooops, something went wrong...`)
    }

})
bot.onText(/👽Characters/, async (msg) => {
    const chatId = msg.chat.id;
    try{
        let inline_keyboard = await getKeyboard(`character`);
        await bot.sendPhoto(chatId, path.join(__dirname, `img`, `rick-and-morty-book-four-9781620105948_hr.jpg`), {
            caption: `👽Characters`,
            reply_markup: {
                inline_keyboard,
                resize_keyboard: false
            }
        })
    }catch{
        await bot.sendMessage(chatId, `Ooops, something went wrong...`)
    }

})
bot.onText(/🎥Episodes/, async (msg) => {
    const chatId = msg.chat.id;
    try{
        let inline_keyboard = await getKeyboard(`episode`);
        await bot.sendPhoto(chatId, path.join(__dirname, `img`, `Rick-and-Morty-фэндомы-продолжение-4464365.jpeg`), {
            caption: `👽Episodes`,
            reply_markup: {
                inline_keyboard,
                resize_keyboard: false
            }
        });
    }catch{
       await bot.sendMessage(chatId, `Ooops, something went wrong...`)
    }

})
bot.onText(/🌌Locations/, async (msg) => {
    const chatId = msg.chat.id;
    try{
        let inline_keyboard = await getKeyboard(`location`);
        await bot.sendPhoto(chatId, path.join(__dirname, `img`, `Rick-and-Morty-фэндомы-продолжение-4464365.jpeg`), {
            caption: `👽Episodes`,
            reply_markup: {
                inline_keyboard,
                resize_keyboard: false
            }
        });
    }catch {
        await bot.sendMessage(chatId, `Ooops, something went wrong...`);
    }
})
bot.onText(/❤Favourites/, async (msg) => {
    const chat_id = msg.chat.id;
    try{
       await bot.sendMessage(chat_id,`Favourites:`, {
           reply_markup: {
               keyboard: [
                   [{text: `🦸Characters`},{text: `📀Episodes`},{text: `🌈Locations`}],
               ]
           }
       });
    }catch {
        await bot.sendMessage(chat_id, `Ooops, something went wrong...`);
    }
})
bot.onText(/\/[a-z]+(\s.+)/, async (msg,[source, sentence]) => {
       const chat_id = msg.chat.id;
       const { message_id } = msg;
       const { id:user_id } = msg.from;
       try {
           const type = source.split(` `)[0];
           const results = await getInfo(source,sentence);
           for (let result of results) {
               let query = `${type.substring(1)}/${result.id}`;
               console.log(query);
               let url = `http://localhost:4200/api/favourite${type}/${result.id}?id=${user_id}`;
               if(source.match(/\/character/)){
                   await bot.sendPhoto(chat_id, `${result.image}`, {
                       caption: await getCaption(result),
                       parse_mode: `HTML`,
                       reply_markup: {
                           inline_keyboard: await getToggleButton(query,url),
                       }
                   })
               }
               else{
                   await bot.sendMessage(chat_id, await getCaption(result), {
                       parse_mode: `HTML`,
                       reply_markup: {
                           inline_keyboard: await getToggleButton(query,url),
                       }
                   })
               }
           }
       }catch {
           await bot.sendMessage(chat_id, `Ooops, something went wrong...`);
       }
    })
bot.onText(/🌈Locations/, async msg => {
   const { message_id } = msg;
   const  { id: user_id } = msg.from;
   const { id: chat_id } = msg.chat;
   try {
       await bot.deleteMessage(chat_id,message_id);
       await bot.sendMessage(chat_id,`🌈Locations`, {
           reply_markup: {
               keyboard: mainKeyboard,
           }
       })
       await axios.get(`http://localhost:4200/api/favourite/location?id=${user_id}`)
           .then(async response => {
               if(response.data.length === 0){
                   await bot.sendMessage(chat_id, `Not yet`)
               }
               else{
                   for (let id of response.data){
                       let data = await axios.get(`http://localhost:4200/api/location/${id}`).then(response => response.data);
                       await bot.sendMessage(chat_id, await getCaption(data.data), {
                           parse_mode: `HTML`,
                       })
                   }
               }
           });
   }catch{
       await bot.sendMessage(chat_id, `Ooops, something went wrong...`);
   }
})
bot.onText(/🦸Characters/, async msg => {
    const { message_id } = msg;
    const  { id: user_id } = msg.from;
    const { id: chat_id } = msg.chat;
    try{
        await bot.deleteMessage(chat_id,message_id)
        await bot.sendMessage(chat_id,`🦸Characters`, {
            reply_markup: {
                keyboard: mainKeyboard,
            }
        })
        await axios.get(`http://localhost:4200/api/favourite/character?id=${user_id}`)
            .then(async response => {
                if(response.data.length === 0){
                    await bot.sendMessage(chat_id, `Not yet`);
                }
                else{
                    for(let id of response.data){
                        let { data }  = await axios.get(`http://localhost:4200/api/character/${id}`).then(response => response.data);
                        let url = `http://localhost:4200/api/favourite/character/${id}?id=${user_id}`;
                        let query = `character/${id}`;
                        await bot.sendPhoto(chat_id, `${data?.image}`, {
                            caption: await getCaption(data),
                            parse_mode: `HTML`,
                            reply_markup: {
                                inline_keyboard: await getToggleButton(query,url),
                            }
                        })
                    }
                }
            })
    }catch{
        await bot.sendMessage(chat_id, `Ooops, something went wrong...`);
    }
})
bot.onText(/📀Episodes/, async msg => {
    const { message_id } = msg;
    const  { id: user_id } = msg.from;
    const { id: chat_id } = msg.chat;
    try{
        await bot.deleteMessage(chat_id,message_id);
        await bot.sendMessage(chat_id, `📀Episodes`, {
            reply_markup: {
                keyboard: mainKeyboard,
            }
        })
        await axios.get(`http://localhost:4200/api/favourite/episode?id=${user_id}`)
            .then(async response => {
                console.log(response.data)
                if(response.data.length === 0){
                    await bot.sendMessage(chat_id,`Not yet`, {
                        reply_markup: {
                            keyboard: mainKeyboard,
                        }
                    })
                }
                else{
                    for(let id of response.data){
                        let data = await axios.get(`http://localhost:4200/api/episode/${id}`).then(data => data.data);
                        console.log(data);
                        let url = `http://localhost:4200/api/favourite/episode/${id}?id=${user_id}`;
                        let query = `episode/${id}`;
                        await bot.sendMessage(chat_id, await getCaption(data.data),{
                            parse_mode: `HTML`,
                            reply_markup: {
                                inline_keyboard: await getToggleButton(query,url),
                            }
                        })
                    }
                }
            })
    }
    catch{
        await bot.sendMessage(chat_id,`Ooops, something went wrong...`)
    }
})
bot.on('callback_query', async (msg) => {
    const chat_id = msg.message.chat.id;
    const message_id = msg.message.message_id;
    try{
        if(isNaN(parseInt(msg.data)) && !msg.data.includes(`favourite`)) {
            axios.get(`http://localhost:4200/api/${msg.data}`)
                .then(async (response) => {
                    const { data } = response.data;
                    let url = `http://localhost:4200/api/favourite/${msg.data}?id=${msg.from.id}`;
                    let query = msg.data;
                    if (data.hasOwnProperty(`image`)) {
                        await bot.sendPhoto(chat_id, `${data.image}`, {
                            caption: await getCaption(data),
                            parse_mode: `HTML`,
                            reply_markup: {
                                inline_keyboard: await getToggleButton(query,url),
                            }
                        })
                    }
                    else {
                        await bot.sendMessage(chat_id, await getCaption(data), {
                            parse_mode: `HTML`,
                            reply_markup: {
                                inline_keyboard: await getToggleButton(query,url),
                            }
                        })
                    }
                })
        }
        else if(isNaN(parseInt(msg.data)) && msg.data.includes(`favourite`)){
            axios.patch(`http://localhost:4200/api/${msg.data}`, {id: `${msg.from.id}`})
                .then(async () => {
                    let query = msg.data.split("/").splice(1).join('/');
                    let url = `http://localhost:4200/api/${msg.data}?id=${msg.from.id}`
                    await bot.editMessageReplyMarkup(JSON.stringify({
                        inline_keyboard: await getToggleButton(query,url),
                    }, ), {chat_id,
                        message_id})
                })
        }
        else{
            const query = msg.data;
            const current = parseInt(msg.data);
            const essence = query.split(` `)[query.split(` `).length - 1];
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
        }
    }catch{
        await bot.sendMessage(chat_id,`Ooops, something went wrong...`);
    }
})
console.log(`Bot has been started...`)