const User = require('../models/User')
const jwt = require('jsonwebtoken')

const handleErrors = (err)=>{
    let errors = {email:'',password:''}

    if(err.message === 'incorrect password')
        errors.password = 'incorrect password'
    if(err.message === 'incorrect email')
        errors.email = 'incorrect email'

    //duplicate error
    if(err.code === 11000)
    {
        errors.email = 'that email is already registered'
        return errors;
    }

    //Validation error
    if(err.name ==='ValidationError'){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
        })
    }
    return errors
}

const maxAge = 3*24*60*60
const createToken = (id)=>{
    return jwt.sign({id},'sai kiran secret',{
        expiresIn:maxAge
    })
}

const signup_get =(req,res)=>{
    res.render('signup')
}

const signup_post =async (req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await User.create({email,password})
        const token = createToken(user._id)
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000})
        res.status(201).json({user:user._id})
    }catch(err){
        const errors = handleErrors(err)
        res.status(400).json({errors})  
    }
}

const login_get =(req,res)=>{
    res.render('login')
}

const login_post =async (req,res)=>{
    const {email,password} = req.body
    try{
        const user = await User.login(email,password)
        const token = createToken(user._id)
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000})
        res.status(200).json({user:user._id})
    }catch(err){
        const errors = handleErrors(err)
        res.status(400).json({errors})
    }
}

const logout_get = (req,res)=>{
    res.cookie('jwt','',{maxAge:1})
    res.redirect('/')
}

module.exports = {signup_get,signup_post,login_get,login_post,logout_get}