const { Client } = require('tdl')


const tdDirectory = 'session'
const DefaultOptions = {
  apiId: 2834,
  apiHash: '68875f756c9b437a8b916ca3de215815',
  databaseDirectory: `${tdDirectory}/_td_database`,
  filesDirectory: `${tdDirectory}/_td_files`,
}

class Tdlib {
  constructor(loginDetails, options) {
    this.loginDetails = loginDetails
    this.options = Object.assign({}, DefaultOptions, options)
    this.client = new Client(this.options)
  }

  async login(config) {
    await this.client.connect()
    await this.client.login(() => (config))
  }

  async launch() {
    await this.login(this.loginDetails)

    this.client.on('update', async (update) => {
    }).on('error', (err) => {
      throw err
    })
  }

  async invoke(method, parm) {
    const invoke = await this.client.invoke(Object.assign({ _: method }, parm)).catch(console.error)

    return invoke
  }

  execute(method, parm) {
    const execute = this.client.execute(Object.assign({ _: method }, parm))

    return execute
  }

  async sendMessage(chatId, text) {
    const result = await this.invoke('sendMessage', {
      chat_id: chatId,
      input_message_content: {
        _: 'inputMessageText',
        text: this.execute('parseTextEntities', {
          text,
          parse_mode: {
            _: 'textParseModeHTML',
          },
        }),
      },
    })

    return result
  }
}

module.exports = Tdlib
