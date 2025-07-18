
import mongoose, { Schema, Document } from 'mongoose';

export interface IState extends Document {
  name: string;
  code?: string; // State code like "CA", "NY"
  _country: mongoose.Schema.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const stateSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'State name is required'],
    trim: true,
    maxlength: [100, 'State name cannot exceed 100 characters']
  },

  code: {
    type: String,
    trim: true,
    uppercase: true,
    maxlength: [10, 'State code cannot exceed 10 characters']
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
stateSchema.index({ name: 1, _country: 1 }, { unique: true });
stateSchema.index({ code: 1, _country: 1 }, { unique: true, sparse: true });
stateSchema.index({ _country: 1 });
stateSchema.index({ isActive: 1 });

const State = mongoose.model<IState>('State', stateSchema);

export default State;
