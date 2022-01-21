const express = require('express')
const app = express()
const port = process.env.port || 3000

require('./db/mongoose')
app.use(express.json())

const userRouter = require('./routers/user')
app.use(userRouter)

const newsRouter = require('./routers/news')
app.use(newsRouter)

app.listen(port,()=>{
    console.log('listening on port 3000')
})