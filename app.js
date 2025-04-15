const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routers/authRoutes')
const cookieParser = require('cookie-parser')
const {requireAuth,checkUser} = require('./middlewares/authMiddleware')

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');

// database connection
const connectDB = async()=>{
await mongoose.connect('mongodb://localhost:27017/jwt',{useNewUrlParser: true,
    useUnifiedTopology: true})
.then(()=>console.log("Connected..."))
}
connectDB()

// routes
app.get('*',checkUser)
app.get('/',(req, res) => res.render('home'));
app.get('/smoothies', requireAuth,(req, res) => res.render('smoothies'));
app.use(authRoutes)


// //cookies
// app.get('/set-cookies',(req,res)=>{
//     //res.setHeader('Set-Cookie','newUser=true')
//     res.cookie('newUser',false)
//     res.cookie('isEmployee',true,{maxAge:1000*60*60*24,httpOnly:true})
//     res.send('you git the cookies!')
// })

// app.get('/read-cookies',(req,res)=>{
//     const cookies = req.cookies
//     res.json(cookies)
// })

app.listen(3000)