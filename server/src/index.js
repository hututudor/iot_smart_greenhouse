import express from 'express'
import dotenv from 'dotenv'
import knex from 'knex'
import cors from 'cors'

dotenv.config()

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB,
  },
})

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', async (req, res) => {
  const dataPoints = await db('data_points')
    .select('*')
    .orderBy('time', 'asc')
    .limit(200)

  res.status(200).json(dataPoints)
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
