
const jwt = require('jsonwebtoken');
const { BlacklistModel } = require('../model/blacklist.model');
require("dotenv").config()

const auth =async (req, res, next) => {
    console.log("i am in middleware")
    try{
        const token = req.cookies.accessToken;
        console.log(token);
        const refreshToken = req.cookies.refreshToken;

        if (!token && !refreshToken) {
            res.status(401).send({ msg: "Please login" });
       }

       
        const blackToken = await BlacklistModel.findOne({blackToken:token});
        if(blackToken){
            res.clearCookie('refreshToken');
            res.clearCookie('accessToken');
            res.status(400).send({
                msg:"Please login again"
            })
        }
        else{
            jwt.verify(token,process.env.accessTokenSecret,(err,decoded)=>{
                console.log(decoded,process.env.accessTokenSecret,token);
                if(decoded){
                    next();
                }
                else{
                    res.clearCookie('refreshToken');
                    res.clearCookie('accessToken');
                    res.status(400).send({
                        msg:"you are not authorised",
                        err
                    })
                }
            })
        }
    }
    catch(err){
        console.log(err);
        res.status(400).send({
            msg:err
        })
    }
}




module.exports ={
    auth
}