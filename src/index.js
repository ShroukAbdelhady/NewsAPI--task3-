const express = require('express')
require("dotenv").config();
const app = express()
const port = process.env.port 

const cors = require('cors')
app.use(cors())

require('./db/mongoose')

app.use(express.json())

const userRouter = require('./routers/user')
app.use(userRouter)

const newsRouter = require('./routers/news')
app.use(newsRouter)


app.listen(port,()=>{
    console.log('listening on port ...')
})