const products = require('../data/products.json');
const Product = require('../models/productModels');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

dotenv.config({path:'backend/config/config.env'});
connectDatabase();

const seedProducts = async ()=>{
    try{
        await Product.deleteMany();
        console.log('Products all are deleted')
        await Product.insertMany(products);
        console.log('All product Added.')
    }catch(error){
        console.log("Error Recored Insert" + error.message)
    }
    process.exit();
}
seedProducts();

