const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: { 
    type: String, 
    enum: ['ADMIN', 'SECRETARY', 'VEHICLE_SALES', 'CHICKEN_SALES', 'USER'],
    default: 'USER'
  },
  profileImage: { 
    type: String, 
    default: '' 
  },
}, { timestamps: true });

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  console.log('Comparing passwords');
  console.log('Stored hashed password:', this.password);
  console.log('Candidate password:', candidatePassword);
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password match:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;