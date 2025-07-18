
import mongoose, { Schema, Document } from 'mongoose';

export interface ICountry extends Document {
  name: string;
  code: string; // ISO country code like "US", "UK"
  currency?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const countrySchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Country name is required'],
    trim: true,
    maxlength: [100, 'Country name cannot exceed 100 characters']
  },

  code: {
    type: String,
    required: [true, 'Country code is required'],
    trim: true,
    uppercase: true,
    minlength: [2, 'Country code must be at least 2 characters'],
    maxlength: [3, 'Country code cannot exceed 3 characters'],
    unique: true
  },

  currency: {
    type: String,
    trim: true,
    uppercase: true,
    maxlength: [3, 'Currency code cannot exceed 3 characters']
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
countrySchema.index({ name: 1 }, { unique: true });
countrySchema.index({ code: 1 }, { unique: true });
countrySchema.index({ isActive: 1 });

const Country = mongoose.model<ICountry>('Country', countrySchema);

export default Country;
