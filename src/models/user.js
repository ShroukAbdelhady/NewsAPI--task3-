const mongoose  = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const News = require('./news')

const userSchema = new mongoose.Schema({
     name:{
         type:String,
         required:true,
         trim:true
     },
     email:{
         type:String,
         unique:true,
         required:true,
         trim:true,
         lowercase:true,
         validate(value){
             if(!validator.isEmail(value)){
                   throw new Error ('Email is invalid')
             }
         }
     },
     age:{
         type:Number,
         default:20,
         validate(value){
             if(value<0){
                 throw new Error('age cannot be negative')
             }
         }
     },
     password:{
         type:String,
         required:true,
         trim:true,
         minlength:6
     },
     phoneNumber:{
         type:String,
         unique: true,
         trim:true,
         validate(value){
             if (!validator.isMobilePhone(value, 'ar-EG')){
                throw new Error(' this is not an Egyption phone number')
             }
         }
     },
     tokens:[{
         type:String,
         required:true
     }]
    },
     {
    timestamps:{currentTime:()=>new Date().getTime() + (2*60*60*1000)
    }
})

userSchema.virtual('news',{
    ref:'News',
    localField:'_id',
    foreignField:'reporter'
})

userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
})
userSchema.statics.findByCredentials = async(email,password)=>{
     const user = await User.findOne({email})
     if(!user){
         throw new Error('unable to login .. plz check email')
     }
     const isMatch= await bcrypt.compare(password,user.password)
     if(!isMatch){
         throw new Error('unable to login .. plz check password')
     }
     return user
}
userSchema.methods.generateToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() },process.env.JWT_SECRET)
    user.tokens = user.tokens.concat(token)
    await user.save()
    return token
}
const User = mongoose.model('User', userSchema)
module.exports = User