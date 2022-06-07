const logger = require('./logger')
const { Sequelize } = require('sequelize')
const { POSTGRES_URI } = require('./config')

const sequelize = new Sequelize(POSTGRES_URI, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
})

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    logger.info('connected to the database')
  } catch (err) {
    logger.error('failed to connect to the database')
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }
