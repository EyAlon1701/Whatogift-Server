import express from "express";
const router = express.Router();
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

//MODELS
import Account from '../models/account.js';
import account from "../models/account.js";

router.post('/signup', async(request, response) => {
    const id= mongoose.Types.ObjectId();
    //Get user register data 
    const {firstName,lastName,email,password} = request.body;
    //Check if user exist
    Account.findOne({email:email})
    .then(async account => {
        if(account)
        {
            return response.status(200).json({
                status: false,
                message: 'Account Already Exist'
            });
        }
        else
        {
            const hash = await bcryptjs.hash(password, 10);
            const code = generateRandomIntegerInRange(1111,9999);
            const _account = new Account({
                _id: id,
                email: email,
                password: hash,
                firstName: firstName,
                lastName: lastName,
                passcode: code
            })
            _account.save()
            .then(account_created => {
                return response.status(200).json({
                    status: true,
                    message: account_created
                });
            }) 
            .catch(error =>{
                return response.status(500).json({
                    status: false,
                    message: error.message
                });
            })
        }
    })
    .catch(error =>{
        return response.status(500).json({
            status: false,
            message: error.message
        });
    })
})

router.post('/verify', async(request, response) => {
    //Get code + email
    const {email, code} = request.body;
    //Check if code match 
    Account.findOne({email:email})
    .then(async account => {
        if(parseInt(code) == parseInt(account.passcode))
        {
            account.isVerified = true;
            account.save()
            .then(account_updated => {
                return response.status(200).json({
                    status: true,
                    message: account_updated
                });
            })
            .catch(error => {
                return response.status(500).json({
                    status: false,
                    message: error.message
                });
            })
        }
        else 
        {
            return response.status(200).json({
                status: false,
                message: 'Verify code not match'
            });
        }
    })
    .catch(error =>{
        return response.status(500).json({
            status: false,
            message: error.message
        });
    })
})

router.post('/login',async(request, response) => {
    const {email,password} = request.body;
    Account.findOne({email: email})
    .then(async account => {
        const isMatch = await bcryptjs.compare(password, account.password);
        console.log("ismatch:" + isMatch);
        console.log("ver:" + account.isVerified);
        if(isMatch && account.isVerified)
        {
            const data = {account};
            const token = await jwt.sign(data, 'zt43dFwBWT85abZwIGhNRaUlLs9zsQaH');

            return response.status(200).json({
                status: true,
                message: account,
                token: token
            });
        } 
        else 
        {
            return response.status(200).json({
                status: false,
                message: 'Username or password not match or account not verified'
            });
        }
    })
    .catch(error =>{
        return response.status(500).json({
            status: false,
            message: error.message
        });
    })
})

router.get('/getOverview', async(request,response) => {

})

function generateRandomIntegerInRange(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default router;