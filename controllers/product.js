import express from "express";
const router = express.Router();
import mongoose from 'mongoose';
import Auth from './auth.js';

//MODELS
import Category from '../models/category.js';
import Brand from '../models/brand.js';
import Product from '../models/product.js';

/**
 * @swagger
 * /api/product/getAllBrands:
 *  get:
 *      summary: Return a list of all brands
 *      tags: [Products]
 *      responses:
 *          200:
 *              description: This is the list of all brands
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *          500:
 *              description: Error was found
 */
router.get('/getAllBrands', Auth, async(request, response) => {
    Brand.find()
    .then(brands => {
        return response.status(200).json({
            message: brands
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
 * /api/product/getBrandById/{id}:
 *  get:
 *      summary: Get brand name by id
 *      tags: [Products]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              required: true
 *      responses:
 *          200:
 *              description: brand success
 *          500:
 *              description: Something is not working well
 */
router.get('/getBrandById/:id', Auth, async(request, response) => {
    Brand.findById(request.params.id)
    .then(brand => {
        return response.status(200).json({
            message: brand
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
 *  Brand:
 *      type: object
 *      properties:
 *          brandName:
 *              type: string
 *              description: The name of the brand
 *          brandLogo:
 *              type: string
 *              description: Copy and paste img url         
 */

/**
 * @swagger
 * /api/product/createBrand:
 *  post:
 *      summary: Create new Brand
 *      description: Use this endpoint to create a new Brand
 *      tags: [Products]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/Brand'
 *      responses:
 *          200:
 *              description: Brand created
 *          500:
 *              description: Failure in created Brand
 */
router.post('/createBrand', Auth, async(request, response) => {
    const {brandName,brandLogo} = request.body;
    const id = mongoose.Types.ObjectId();
    const _brand = new Brand({
        _id:id,
        brandName:brandName,
        brandLogo: brandLogo
    });
    _brand.save()
    .then(brand_created => {
        return response.status(200).json({
            message:brand_created
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
 * /api/product/getAllCategories:
 *  get:
 *      summary: Return a list of all categories
 *      tags: [Products]
 *      responses:
 *          200:
 *              description: This is the list of all categories
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *          500:
 *              description: Error was found
 */
router.get('/getAllCategories', Auth, async(request, response) => {
    Category.find()
    .then(categories => {
        return response.status(200).json({
            message: categories
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
 *  Category:
 *      type: object
 *      properties:
 *          categoryName:
 *              type: string     
 */

/**
 * @swagger
 * /api/product/createCategory:
 *  post:
 *      summary: Create new Category
 *      description: Use this endpoint to create a new Category
 *      tags: [Products]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/Category'
 *      responses:
 *          200:
 *              description: Category created
 *          500:
 *              description: Failure in created Category
 */
router.post('/createCategory', Auth, async(request, response) => {
    const categoryName = request.body.categoryName;
    const id = mongoose.Types.ObjectId();
    const _category = new Category({
        _id:id,
        categoryName: categoryName
    });
    _category.save()
    .then(category_created => {
        return response.status(200).json({
            message:category_created
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
 * /api/product/getAllProducts:
 *  get:
 *      summary: Return a list of all products
 *      tags: [Products]
 *      responses:
 *          200:
 *              description: This is the list of all products
 *          500:
 *              description: Error was found
 */
router.get('/getAllProducts', Auth, async(request, response) => {
    Product.find()
    .then(products => {
        return response.status(200).json({
            message: products
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
 *  Product:
 *      type: object
 *      properties:
 *          companyId:
 *              type: string
 *          categoryId:
 *              type: string
 *          brandId:
 *              type: string
 *          productName:
 *              type: string
 *          productImage:
 *              type: string
 *          productPrice:
 *              type: number
 *          productDescription:
 *              type: string
 *          unitInStock:
 *              type: number  
 *          productTags:
 *              type: array
 *              items:
 *                  type: string
*/

/**
 * @swagger
 * /api/product/createProduct:
 *  post:
 *      summary: Create new Product
 *      description: Use this endpoint to create a new Product
 *      tags: [Products]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/Product'
 *      responses:
 *          200:
 *              description: Product created
 *          500:
 *              description: Failure in created Product
 */
router.post('/createProduct', Auth, async(request, response) => {
    const id = mongoose.Types.ObjectId();
    const {companyId,categoryId,brandId,productName,productImage,productPrice,productDescription,unitInStock,productTags} = request.body;
    const _product = new Product({
        _id: id,
        companyId: companyId,
        categoryId: categoryId,
        brandId: brandId,
        productName: productName,
        productImage: [{imageSource: productImage}],
        productPrice: productPrice,
        productDescription: productDescription,
        unitInStock: unitInStock,
        reviews: [],
        productTags: productTags
    });
    _product.save()
    .then(product_created => {
        return response.status(200).json({
            message: product_created
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
 *  GiftOptions:
 *      type: object
 *      properties:
 *          currLocation:
 *              type: object
 *          locationMaxRadius:
 *              type: number
 *          budget:
 *              type: object
 *          gender:
 *              type: string
 *          age:
 *              type: number
 *          interest:
 *              type: array
 *              items:
 *                  type: string
 *          relation:
 *              type: number
 *          event:
 *              type: string
*/

/**
 * @swagger 
 * /api/product/getGift:
 *  post:
 *      summary: Get products by parameters
 *      description: Get products by parameters
 *      tags: [Products]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/GiftOptions'
 *      responses:
 *          200:
 *              description: Success
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *          500:
 *              description: Error
 */
router.post('/getGift', Auth, async(request, response) => {
    const {currLocation,locationMaxRadius,budget,gender,age,interest,relation,event} = request.body;
    


    Product.find()
    .then(products => {

        let rtnProducts = [];
        products.forEach(product => {
            
            let isExist = false;           
            product.productTags.forEach(tag => {
                if(tag.toString() == event || interest.indexOf(tag.toString()) > -1 || tag.toString()==gender)
                {
                    isExist = true;
                }
            })
            if(isExist)
            {
                console.log(product)
                rtnProducts.push(product);
            }
        });
        return response.status(200).json({
            message: rtnProducts
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
 * /api/product/getCategoriesByValue:
 *  post:
 *      summary: Get catgory name by value
 *      tags: [Products]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/Category'
 *      responses:
 *          200:
 *              description: Success
 *          500:
 *              description: Error
 */
router.post('/getCategoriesByValue', Auth, (request,response) => {
    const {categoryName} = request.body;
    Category.find({categoryName: categoryName})
    .then(categories => {
        if(categories[0] == null)
        {
            return response.status(200).json({
                message: "There is no category name with this value"
            })
        }
        return response.status(200).json({
            message: categories
        })
    })
    .catch(err => {
        return response.status(500).json({
            message: err
        })
    })
})

export default router;