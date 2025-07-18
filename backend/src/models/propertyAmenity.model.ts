
import mongoose, { Schema, Document } from 'mongoose';
import { PROPERTY_TYPES } from './property.model';

export interface IPropertyAmenity extends Document {
  name: string;
  description?: string;
  type?: string;
  icon?: { key: string; url: string };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const propertyAmenitySchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Property amenity name is required'],
    trim: true,
    maxlength: [100, 'Property amenity name cannot exceed 100 characters'],
    unique: true
  },

  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },

  type: {
    type: String,
    enum: Object.values(PROPERTY_TYPES),
    trim: true
  },

  icon: {
    key: {
      type: String,
      trim: true,
      maxlength: [100, 'Icon key cannot exceed 100 characters']
    },
    url: {
      type: String,
      trim: true,
      maxlength: [200, 'Icon URL cannot exceed 200 characters']
    }
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      const { __v, ...cleanRet } = ret;
      return cleanRet;
    }
  }
});

// Indexes
propertyAmenitySchema.index({ name: 1 }, { unique: true });
propertyAmenitySchema.index({ type: 1 });
propertyAmenitySchema.index({ isActive: 1 });

const PropertyAmenity = mongoose.model<IPropertyAmenity>('PropertyAmenity', propertyAmenitySchema);

export default PropertyAmenity;
