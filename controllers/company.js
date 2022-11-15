import express from "express";
const router = express.Router();
import mongoose from 'mongoose';
import Auth from './auth.js';

//MODELS
import Company from '../models/company.js';

router.post('/createCompany', Auth, async(request, response) => {
    const user = request.user;
    const company = await Company.find({associateId: user._id});
    if(company.length > 0)
    {
        return response.status(200).json({
            status: false,
            message: 'Company exist'
        });
    }
    else
    {
        const id = mongoose.Types.ObjectId();
        const {companyName,contact} = request.body;
        const _company = new Company({
            _id: id,
            associateId: user._id,
            companyName: companyName,
            contact: contact,
            bio: ''
        });
        _company.save()
        .then(company_created => {
            return response.status(200).json({
                status: true,
                message: company_created
            });
        })
        .catch(error => {
            return response.status(500).json({
                status: false,
                message: error.message
            });
        });
    }
})

router.get('/updateCompany', async(request, response) => {
  
})

export default router;