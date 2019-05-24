const path = require('path')


global.appRoot = path.resolve(__dirname)

require('dotenv').config({ path: './.env' })
require('./app')
