
import mongoose, { Schema, Document } from 'mongoose';

export interface ICity extends Document {
  name: string;
  _state: mongoose.Schema.Types.ObjectId;
  _country: mongoose.Schema.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const citySchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'City name is required'],
    trim: true,
    maxlength: [100, 'City name cannot exceed 100 characters']
  },

  _state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    required: [true, 'State reference is required'],
    index: true
  },

  _country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: [true, 'Country reference is required'],
    index: true
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
citySchema.index({ name: 1, _state: 1 }, { unique: true });
citySchema.index({ _state: 1 });
citySchema.index({ _country: 1 });
citySchema.index({ isActive: 1 });

const City = mongoose.model<ICity>('City', citySchema);

export default City;
