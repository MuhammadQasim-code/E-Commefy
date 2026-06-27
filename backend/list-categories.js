const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const Category = require('./models/Category');
const dotenv = require('dotenv');
dotenv.config();

async function listCategories() {
  await mongoose.connect(process.env.MONGO_URI);
  const categories = await Category.find({});
  console.log('Categories in DB:');
  categories.forEach(c => {
    console.log(`Name: "${c.name}", Slug: "${c.slug}", ID: "${c._id}"`);
  });
  await mongoose.connection.close();
}

listCategories();
