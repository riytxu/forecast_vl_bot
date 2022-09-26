const { Telegraf } = require('telegraf')
const { drowPicture } = require('./drowPicture.js')
const { TOKEN } = require('./token.js')
const bot = new Telegraf(TOKEN)

bot.start((ctx) => {
    ctx.reply(`${ctx.message.from.first_name}, привет!\n
Я тгбот, который парсит прогноз погоды с gismeteo.ru и primpogoda.ru\n
Для удобства я формирую все данные в картинку, чтобы тебе было легче:)\n
Спроси меня что-нибудь о погоде или пропиши команду /forecast\n
И я покажу что могу:)\n
(п.с. => если я поломался или у тебя есть предложения по доработке пиши @riytxu)`)
})

let lock = false;

bot.command('forecast', ctx => {
    if (lock) {
        ctx.reply('Я уже занят :( Попробуй чуть позже!')
    } else {
        ctx.reply('Сейчас узнаю! Подожди немного :)')
        lock = true
        drowPicture().then(() => { 
            ctx.replyWithPhoto({ source: './return.png' })
            lock = false
        })
    }
})

bot.on('text', ctx => {
    if (lock) {
        ctx.reply('Я уже занят :( Попробуй чуть позже!')
    } else {
        if (ctx.message?.text?.toLowerCase().includes('погод')) {
            ctx.reply('Сейчас узнаю! Подожди немного :)')
            lock = true
            drowPicture().then(() => { 
                ctx.replyWithPhoto({ source: './return.png' })
                lock = false
            })
        }
    }
})

bot.launch()