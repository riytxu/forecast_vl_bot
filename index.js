const { Telegraf } = require('telegraf')
const { drowPicture } = require('./drowPicture.js')
const { TOKEN } = require('./token.js')
const bot = new Telegraf(TOKEN)

bot.start((ctx) => {
    ctx.reply(`${ctx.message.chat.username}, привет!
    Я тгбот, который парсит прогноз погоды с gismeteo.ru и primpogoda.ru
    Для удобства я формирую все данные в картинку, чтобы тебе было легче:)
    Спроси меня что-нибудь о погоде или пропиши команду /forecast
    И я покажу что могу:)
    (п.с. => если я поломался или у тебя есть предложения по доработке пиши @riytxu)`)
})

bot.command('forecast', ctx => {
    ctx.reply('Я уже работаю, погоди немного:)')
    drowPicture().then(() => { ctx.replyWithPhoto({ source: './return.png' })
    })
})

bot.on('text', ctx => {
    if (ctx.message.text.toLowerCase().includes('погод')) {
        ctx.reply('Я уже работаю, погоди немного:)')
        drowPicture().then(() => { ctx.replyWithPhoto({ source: './return.png' })
        })
    }
})

bot.launch()