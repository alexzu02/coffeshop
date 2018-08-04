'use strict'
var  User= require('../user/user.model');
var jwt=require('jsonwebtoken');
var config=require('../../config');
var bcrypt=require('bcrypt');

function login(req,res,next){
    
    //find the user
    User.findOne({email: req.body.email}, function(err,user){
        if(err) throw err;
        if (!user){
            res.json({success: false, message: 'Autenticathion failed. User not found'})
        }else if (user) {
            //revisa contraseña
    
            if (!user.comparePassword(req.body.password)) {
                res.json({success: false, message: 'Autenticathion failed. Wrong password'})
            }else{
    
                const payload = {
                    admin: user.admin,
                    id: user._id
                };
                var token= jwt.sign(payload,config.secret);
                req.session.token=token;
                return res.status(200).send({success: true,message: 'Autenticathion complete',token:token});
            }
        }
    });
}
var controller={
    login:login
}
module.exports=controller