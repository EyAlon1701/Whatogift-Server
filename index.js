import express from 'express';
import bp from 'body-parser';
import mongoose from "mongoose";

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

const app = express();

app.use(bp.urlencoded({extended:false}))
app.use(bp.json())

//const mongoUrl = 'mongodb+srv://whatogift-user:bbIqlPaVcqEijwsP@cluster0.zwkaydg.mongodb.net/wahtogift?retryWrites=true&w=majority';
const mongoUrl = 'mongodb+srv://whattogift-user:whattogift-password@cluster0.3ffqv2n.mongodb.net/whattogift?retryWrites=true&w=majority'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Whatogift API Endpoint',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:3001'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./controllers/*.js']

}

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec));

///////////////////////////////ROUTES/////////////////////////////////
import accountRoute from './controllers/account.js';
app.use('/api/account', accountRoute);

import companyRoute from './controllers/company.js';
app.use('/api/company', companyRoute);

import productRoute from './controllers/product.js';
app.use('/api/product', productRoute);
//---------------------END OF ROUTES -----------------------------

const port = 3001;

mongoose.connect(mongoUrl)
.then(results => {
    //console.log(results);
    app.listen(port, function(){
        console.log(`Server is running via port ${port}`);
    });
})
.catch(error => { console.log(error.message) })
