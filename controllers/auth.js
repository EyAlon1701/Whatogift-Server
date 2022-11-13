import { response } from 'express';
import jwt from 'jsonwebtoken';
import Account from '../models/account.js';

export default (request,response,next) => {

    const header = request.headers['authorization'];
    if(header)
    {
        const bearer = header.split(' ');
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, 'zt43dFwBWT85abZwIGhNRaUlLs9zsQaH', (error,authdata) => {
            if(error)
            {
                return response.sendStatus(403);
            }
            else
            {
                Account.findById(authdata.account._id)
                .then(user => {
                    request.user = user;
                    next();
                })
                .catch(error => {
                    return response.status(500).json({
                        message: error.message
                    })
                })
            }
        });
    }
    else
    {
        return response.sendStatus(403);
    }
}