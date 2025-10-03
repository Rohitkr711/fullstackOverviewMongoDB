import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import { db } from './utils/db.js';

dotenv.config();

const app = express()
const port = process.env.PORT || 4000

app.use(cors({
    origin:'http://localhost:3000/',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS']
}
))

app.use(express.json())

app.use(express.urlencoded({extended:true}))

app.get('/', (req, res) => {
  res.send('Learning Backend')
})

db();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
