const Telegraf = require('telegraf')
const TDLib = require('./tdlib')

const tdl = new TDLib({
  type: 'bot',
  token: process.env.BOT_TOKEN,
  skipOldUpdates: true,
  verbosityLevel: 1,
})

tdl.launch()

const messageTime = {}

tdl.client.on('update', async (update) => {
  if (update._ === 'updateNewMessage') {
    const { message } = update

    if (update.message.is_outgoing === false) {
      if (message.content) {
        if (message.content.text && message.content.text.text === '/start') {
          const { id } = update.message

          if (!messageTime[id]) messageTime[id] = { chat_id: update.message.chat_id }
          messageTime[id].tdl = {
            start: Date.now(),
          }
          await tdl.sendMessage(update.message.chat_id, 'tdlib')
          messageTime[id].tdl.end = Date.now()
        }
        else tdl.sendMessage(update.message.chat_id, `<code>${JSON.stringify(update, null, 2)}</code>`)
      }
    }
  }
}).on('error', (err) => {
  throw err
})

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use(async (ctx) => {
  if (ctx.message && ctx.message.text === '/start') {
    const id = ctx.message.message_id * 1048576

    if (!messageTime[id]) messageTime[id] = { chat_id: ctx.message.chat.id }
    messageTime[id].telegraf = {
      start: Date.now(),
    }
    await ctx.replyWithHTML('telegraf')
    messageTime[id].telegraf.end = Date.now()
  }
  else ctx.replyWithHTML(`<code>${JSON.stringify(ctx.update, null, 2)}</code>`)
})

bot.launch()

setInterval(() => {
  // eslint-disable-next-line guard-for-in
  for (const key in messageTime) {
    const el = messageTime[key]

    if (el.chat_id && el.tdl && el.telegraf && el.tdl.end && el.telegraf.end) {
      const dStart = el.telegraf.start - el.tdl.start
      const dEnd = el.telegraf.end - el.tdl.end
      const dSum = dEnd + dStart

      bot.telegram.sendMessage(el.chat_id, `delta start: ${dStart} ms\ndelta end: ${dEnd} ms\nsum: ${dSum} ms`)
      delete messageTime[key]
    }
  }
}, 10)
