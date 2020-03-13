'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: 'Insert the your name'
    },
    password: {
        type: String,
        required: 'Insert the your password'
        },
    email: {
        type: String,
        required: 'Insert the your email',
        unique: true
    },
    permissionLevel:{
        type: Number,
        default: 1
    },
    created_date: {
        type: Date,
        default: new Date(Date.now()-3*3600000)
    },
    token:{
        type: {
            tokenAuth: {
                type: String
            },
            beginDate: {
                type: Date
            },
            endDate: {
                type: Date
            }
        }
    }
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

const User = mongoose.model('Users', userSchema);

exports.findByEmail = (email) => User.findOne({email: email});

exports.findById = (id) => User.findOne({_id: id});

exports.findByToken = (tokenAuth) => User.findOne({"token.tokenAuth": tokenAuth})

exports.saveToDB = (userData) => {
    const user = new User(userData);
    return user.save();
};

exports.list = () => User.find();