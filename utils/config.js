process.env.NODE_ENV !== 'production' ? require('dotenv').config() : null

const PORT = process.env.PORT

const POSTGRES_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_POSTGRES_URI
    : process.env.POSTGRES_URI

module.exports = {
  POSTGRES_URI,
  PORT,
}
