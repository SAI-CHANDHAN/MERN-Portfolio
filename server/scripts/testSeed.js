const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
    console.log('📍 Database URL:', process.env.MONGODB_URI);
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// Test user creation and login
const testUserCreationAndLogin = async () => {
  await connectDB();
  
  try {
    // Step 1: Clear existing users
    console.log('\n🗑️ Clearing existing users...');
    await User.deleteMany({});
    console.log('✅ Users cleared');

    // Step 2: Create admin user
    console.log('\n👤 Creating admin user...');
    const adminData = {
      name: 'Admin User',
      email: 'admin@portfolio.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
    };

    const adminUser = new User(adminData);
    await adminUser.save();
    console.log('✅ Admin user created successfully');
    console.log('📧 Email:', adminUser.email);
    console.log('👤 Name:', adminUser.name);
    console.log('🔑 Role:', adminUser.role);
    console.log('✅ Is Active:', adminUser.isActive);
    console.log('🔒 Password is hashed:', adminUser.password !== 'admin123');

    // Step 3: Test finding the user
    console.log('\n🔍 Testing user lookup...');
    const foundUser = await User.findOne({ email: 'admin@portfolio.com' });
    if (foundUser) {
      console.log('✅ User found in database');
      console.log('📧 Found email:', foundUser.email);
      console.log('✅ Is Active:', foundUser.isActive);
    } else {
      console.log('❌ User NOT found in database');
    }

    // Step 4: Test password comparison
    console.log('\n🔐 Testing password comparison...');
    const testPassword = 'admin123';
    const isPasswordCorrect = await foundUser.comparePassword(testPassword);
    console.log('🔑 Password test result:', isPasswordCorrect);

    // Step 5: Test wrong password
    console.log('\n🔐 Testing wrong password...');
    const wrongPasswordResult = await foundUser.comparePassword('wrongpassword');
    console.log('❌ Wrong password test result:', wrongPasswordResult);

    console.log('\n✅ All tests completed!');
    console.log('\n📋 LOGIN CREDENTIALS:');
    console.log('Email: admin@portfolio.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('❌ Error in testing:', error);
  } finally {
    process.exit(0);
  }
};

// Run the test
testUserCreationAndLogin();