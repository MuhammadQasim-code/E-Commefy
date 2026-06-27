const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to DB');

    const admin = await User.findOne({ email: 'admin@ecommefy.com' }).select('+password');
    if (!admin) {
      console.log('❌ Admin user not found in DB!');
      process.exit(1);
    }

    console.log('Admin user found:', admin.email);
    console.log('Stored Hashed Password:', admin.password);

    const isMatch = await bcrypt.compare('Admin@123', admin.password);
    console.log('Password Match Result for "Admin@123":', isMatch);

    const compareMethodMatch = await admin.comparePassword('Admin@123');
    console.log('User model comparePassword match for "Admin@123":', compareMethodMatch);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

test();
