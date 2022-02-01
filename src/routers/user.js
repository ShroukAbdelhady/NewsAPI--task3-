const express = require('express')
const router = express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

router.post('/signup',async(req,res)=>{
    try{
        const user = new User(req.body)
        await user.save()
        const token = await user.generateToken()
        res.status(200).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/login',async(req,res)=>{
  try{
   const user = await User.findByCredentials(req.body.email,req.body.password)
   const token = await user.generateToken()
   res.status(200).send({user,token})
  }catch(e){
   res.status(400).send(e.message)
  }
})

router.get('/profile',auth,async(req,res)=>{
   res.send(req.user)
})
router.patch('/user/profile',auth ,async(req,res)=>{
     try{
         const _id = req.user._id
         const updates = Object.keys(req.body)
         const user = await User.findOne(_id)
         if(!user){
             return res.status(404).send('unable to find user')
         }
        updates.forEach((update)=>{user[update] = req.body[update] })
        await user.save()
         res.status(200).send({user})
     }catch(e){
         res.status(400).send(e.message)
     }
})
router.delete('/user/profile',auth,async(req,res)=>{
    const _id = req.user._id
    try{
        const user = await User.findOneAndDelete(_id)
        if(!user){
            return res.status(401).send('unable to find user')
        }
        res.send({user})
    }catch(e){
        res.status(400).send(e.message)
    }
})
router.delete('/logout',auth,async(req,res)=>{
    try{
        req.user.tokens= req.user.tokens.filter((el)=>{
            return el!=req.token
        })
        await req.user.save()
        res.send('goodbye!'+ req.user.name)
    } catch(e){
        res.status(500).send(e.message)
    }
})
module.exports = router