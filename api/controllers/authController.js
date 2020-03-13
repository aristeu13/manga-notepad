'use strict';

const User = require('../models/usersModel');
const crypto = require('crypto');

exports.checkingUserPassword = (req, res, next) => {
    User.findByEmail(req.body.email)
        .then((result)=>{
            if(!result) res.status(404).send({});

            let passwordFields = result.password.split('$');
            let salt = passwordFields[0];
            let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
            if(hash === passwordFields[1]){
                req.body = {
                    userId: result._id,
                    email: result.email,
                    permissionLevel: result.permissionLevel,
                    name: result.name,
                };
                next();
            }else{
                res.status(404).send({'error': 'Invalid email or password'});
            }
        })
        .catch((err)=>{
            console.log(err)
            res.status(500).send({'error': 'Could not authenticate the user'});
        });
}

exports.generatorHash = (req, res, next) => {
    try{
        User.findById(req.body.userId)
            .then((result) =>{
                let dateNow = Date.now()
                result.token = {
                    tokenAuth: crypto.randomBytes(32).toString('base64'),
                    beginDate: new Date(dateNow-3*3600000),
                    endDate: new Date(dateNow-2*3600000)
                }
                result.save()
                    .then((response) =>{
                        res.status(201).send({
                            user_id: response._id,
                            email: response.email,
                            token: response.token.tokenAuth,
                            begin_date: response.token.beginDate,
                            end_date: response.token.endDate
                        });
                    })
                    .catch((err) =>{
                        console.log(err)
                        res.status(500).send({'error': 'Could not authenticate the user'});
                    })
            })
            .catch((err) =>{
                console.log(err)
                res.status(500).send({'error': 'Could not authenticate the user'});
            })
        }catch(error){
            console.log(error)
            res.status(500).send({'error': 'Could not authenticate the user'});
        }
            
}

exports.loginRequired = (req, res, next) => {
    try{
        let authFields = req.headers['authorization'].split('$')
        User.findById(authFields[0])
            .then((user) => {
                if(!!!user) res.status(403).send({'error': 'token_invalid'});
                else if(authFields[1] === user.token.tokenAuth){
                    next();
                }else{
                    res.status(403).send({'error': 'token_invalid'});
                }
            })
            .catch((err) => {
                console.log(err)
                res.status(500).send({'error': 'Could not authenticate the user'});
            })
    }catch(error){
        res.status(400).send({'error': 'header_invalid'});
    }
}
