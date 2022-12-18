import express from "express";
const router = express.Router();
import mongoose from 'mongoose';
import Auth from './auth.js';
import { getDistance } from 'geolib';

//MODELS
import Company from '../models/company.js';

/**
 * @swagger
 * definitions:
 *  FindMyStore:
 *      type: object
 *      properties:
 *          latitude:
 *              type: number
 *          longtitude:
 *              type: number
 */

/**
 * @swagger
 * /api/company/getCompaniesDistance:
 *  post:
 *      summary: bla
 *      description: bla 
 *      tags: [Companies]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/FindMyStore'
 *      responses:
 *          200:
 *              description: Success
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *          500:
 *              description: Error was found
 */
 router.post('/getCompaniesDistance', Auth, async(request, response) => {
    const {latitude,longitude} = request.body;
    Company.find()
    .then(companies => {

        let formattedCompanies = [];
        companies.forEach(company => {
            const distance = getDistance(
                { latitude: latitude, longitude: longitude },
                { latitude: company.contact.latitude, longitude: company.content.longitude }
            )
            const _company = {
                companyItem: company,
                distanceItem: distance 
            }
            formattedCompanies.push(_company);
        });
        return res.status(200).json({
            status: true,
            message: formattedCompanies
        })
    })
    .catch(error => {
        return res.status(500).json({
            message: error.message
        })
    })
})


/**
 * @swagger
 * /api/company/getCompanies:
 *  get:
 *      summary: Return a list of all companies
 *      tags: [Companies]
 *      responses:
 *          200:
 *              description: Success
 *          500:
 *              description: Error was found
 */
router.get('/getCompanies', Auth, async(request, response) => {
    Company.find()
    .then(companies => {
        return response.status(200).json({
            message: companies
        })
    })
    .catch(error => {
        return response.status(500).json({
            message: error.message
        })
    })
})
/**
 * @swagger
 * definitions:
 *   Company:
 *      type: object
 *      properties:
 *          companyName:
 *              type: string
 *          contact:
 *              type: object
 *              properties:
 *                  address: 
 *                      type: string
 *                  city: 
 *                      type: string 
 *                  state: 
 *                      type: string 
 *                  zipcode: 
 *                      type: string 
 *                  mobile: 
 *                      type: string 
 *                  latitude: 
 *                      type: string 
 *                  longitude: 
 *                      type: string 
 *          logo:
 *              type: string
 *          bio:
 *              type: string
*/

/**
 * @swagger
 * /api/company/createCompany:
 *  post:
 *      summary: Create new Company
 *      description: Use this endpoint to create a new Company
 *      tags: [Companies]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/Company'
 *      responses:
 *          200:
 *              description: Company created
 *          500:
 *              description: Failure in created Company
 */
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
        const {companyName,contact,logo,bio} = request.body;
        const _company = new Company({
            _id: id,
            associateId: user._id,
            companyName: companyName,
            contact: contact,
            logo: logo,
            bio: bio
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