const TDLib = require('./tdlib')
const Telegraf = require('telegraf')

const tdl = new TDLib({
  type: 'bot',
  token: process.env.BOT_TOKEN,
  skipOldUpdates: true,
  verbosityLevel: 1,
})

tdl.launch()

tdl.client.on('update', async (update) => {
  if (update._ === 'updateNewMessage') {
    const { message } = update

    if (update.message.is_outgoing === false) {
      if (message.content) {
        if (message.content.text && message.content.text.text === '/start') tdl.sendMessage(update.message.chat_id, 'tdlib')
        else tdl.sendMessage(update.message.chat_id, `<code>${JSON.stringify(update, null, 2)}</code>`)
      }
    }

    console.log(update)
  }
}).on('error', (err) => {
  throw err
})

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.replyWithHTML('telegraf'))
bot.hears(() => true, (ctx) => ctx.replyWithHTML(`<code>${JSON.stringify(ctx.update, null, 2)}</code>`))

bot.launch()
