const express=require("express")
const cors=require("cors")
const mongoose=require("mongoose")
const app=express()
const port=3000 || process.env.PORT
require("dotenv").config()
const bodyParser=require("body-parser")
const router=require("./routes/routes")
const helmet=require("helmet")

app.use(bodyParser.json())
app.use(cors())
app.use(helmet())

// database connection
mongoose.connect(process.env.MONGODB).then(()=>{
    console.log(`Database connected!`)
}).catch(err=>console.log('Database is down!',err))



// test endpoint
app.get('/api',(req,res)=>{
    res.send("api test")
})

// main endpoint
app.use("/api",router)


// server
app.listen(port,(err)=>{
    if(err)throw new Error('Server is down')
    console.log(`server is up on port ${port}`)
})
