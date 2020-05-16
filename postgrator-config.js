require('dotenv').config();

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "connectionString": (process.env.NODE_ENV === 'development')
     ? process.env.TEST_DATABASE_URL
     : process.env.DATABASE_URL,
  "ssl": !!process.env.SSL,
}