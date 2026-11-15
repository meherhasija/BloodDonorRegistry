/**
 * Donor Mongoose Model & Schema
 * Defines the schema structure, data types, and validations for blood donor records.
 */

const mongoose = require('mongoose');

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genders = ['Male', 'Female', 'Other'];
const availabilityStatuses = ['Available', 'Unavailable'];

const donorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required.'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters.'],
      maxlength: [100, 'Full name cannot exceed 100 characters.']
    },
    age: {
      type: Number,
      required: [true, 'Age is required.'],
      min: [18, 'Donor must be at least 18 years old to donate blood.'],
      max: [65, 'Donor age cannot exceed 65 years.']
    },
    gender: {
      type: String,
      required: [true, 'Gender is required.'],
      enum: {
        values: genders,
        message: '{VALUE} is not a valid gender. Allowed: Male, Female, Other'
      }
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required.'],
      uppercase: true,
      trim: true,
      enum: {
        values: bloodGroups,
        message: '{VALUE} is not a valid blood group. Allowed: A+, A-, B+, B-, AB+, AB-, O+, O-'
      }
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required.'],
      trim: true,
      validate: {
        validator: function (v) {
          // Validates 10-digit mobile number, optionally allowing leading +country code or dashes
          return /^\+?[0-9\s-]{10,15}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number. Must be at least 10 digits.`
      }
    },
    city: {
      type: String,
      required: [true, 'City is required.'],
      trim: true,
      minlength: [2, 'City name must be at least 2 characters.']
    },
    availabilityStatus: {
      type: String,
      required: [true, 'Availability status is required.'],
      enum: {
        values: availabilityStatuses,
        message: '{VALUE} is not valid. Choose Available or Unavailable.'
      },
      default: 'Available'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        return ret;
      }
    }
  }
);

// Indexing for faster searching & filtering
donorSchema.index({ fullName: 'text', city: 'text' });
donorSchema.index({ bloodGroup: 1, availabilityStatus: 1 });

const Donor = mongoose.model('Donor', donorSchema);

module.exports = Donor;
