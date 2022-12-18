import express from "express";
const router = express.Router();
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Auth from './auth.js';

//MODELS
import Account from '../models/account.js';

/**
 * @swagger
 * definitions:
 *  Signup:
 *      type: object
 *      properties:
 *          email:
 *              type: string
 *          password:
 *              type: string
 *          firstName:
 *              type: string   
 *          lastName:
 *              type: string
 *  Verify:
 *      type: object
 *      properties:
 *          email:
 *              type: string
 *          code:
 *              type: integer
 *  Login:
 *      type: object
 *      properties:
 *          email:
 *              type: string
 *          password:
 *              type: string
*/

/**
 * @swagger
 * /api/account/signup:
 *  post:
 *      summary: signup
 *      description: Use this endpoint to signup
 *      tags: [Accounts]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/Signup'
 *      responses:
 *          200:
 *              description: signup success
 *          500:
 *              description: signup faild
 */
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

/**
 * @swagger
 * /api/account/verify:
 *  post:
 *      summary: verify
 *      description: Use this endpoint to verify
 *      tags: [Accounts]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/Verify'
 *      responses:
 *          200:
 *              description: verify success
 *          500:
 *              description: verify faild
 */
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

/**
 * @swagger
 * /api/account/login:
 *  post:
 *      summary: login
 *      description: Use this endpoint to login
 *      tags: [Accounts]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/Login'
 *      responses:
 *          200:
 *              description: login success
 *          500:
 *              description: login faild
 */
router.post('/login',async(request, response) => {
    const {email,password} = request.body;
    console.log("muzar meod; " + email + password);

    Account.findOne({email: email})
    .then(async account => {
        const isMatch = await bcryptjs.compare(password, account.password);
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

router.get('/getOverview', Auth, async(request,response) => {
    return response.status(200).json({
        message: `Hello ${request.user.firstName} ${request.user.lastName}`
    })
})

function generateRandomIntegerInRange(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default router;