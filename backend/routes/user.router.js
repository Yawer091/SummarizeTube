const express=require('express');
const{UserModel}=require('../model/user.model')
const bcrypt =require('bcrypt');
const jwt =require('jsonwebtoken')
const cookieParser =require('cookie-parser')


const userRouter =express.Router();

userRouter.post('/register',(req,res) =>{
    const {name,age,email,pass} =req.body
    try{
        bcrypt.hash(pass,8,async(err,hash) =>{
            if(err){
                res.status(200).send({"error":err})
            }else{
                const user = new UserModel({name,age,email,pass:hash})
                await user.save()
                res.status(200).send({msg:"New user has benn added successfully"})
            }
        })

    }catch(err){
        res.status(404).send({"msg":"Error in registration of User","Error":err})
    }
})

userRouter.post('/login', async(req,res) =>{
    const {email,pass} =req.body

    try{
        const user= await UserModel.findOne({email})
        bcrypt.compare(pass,user.pass,(err,result) =>{
            if(result){
                const accessToken =jwt.sign({userid:"backend"},"masai",{expiresIn:"1h"})
                const refreshToken =jwt.sign({course:"backend"},"school",{expiresIn:"7d"})
                res.cookie('refreshToken', refreshToken, { httpOnly: true }); 
                res.cookie('accessToken', accessToken, { httpOnly: true });
                res.status(200).send({"msg":"login successfully!"})
            }else{
                res.status(404).send({msg:"Invalid credintial for user login","error":err})
            }
        })

    }catch(err){
        res.status(404).send({msg:'Error in log in',"error":err})
    }
    
})



module.exports ={
    userRouter
}