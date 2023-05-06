import asyncHandler from '../middleware/asyncHandler.js'
import Product from "../models/productModel.js";


//@desc fetch all products
//@route GET /api/products
//@access public
const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find()
     res.json(products)
 })


//@desc fetch one products
//@route GET /api/products/:id
//@access public
 const getOneProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
     return   res.json(product)
    }
    res.status(404)
    throw new Error('Product Not Found!!')
})

export {getAllProducts, getOneProduct}