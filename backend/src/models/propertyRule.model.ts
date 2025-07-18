
import mongoose, { Schema, Document } from 'mongoose';

export interface IPropertyRule extends Document {
  title: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const propertyRuleSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Property rule title is required'],
    trim: true,
    maxlength: [100, 'Property rule title cannot exceed 100 characters']
  },

  description: {
    type: String,
    required: [true, 'Property rule description is required'],
    trim: true,
    maxlength: [1000, 'Property rule description cannot exceed 1000 characters']
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
propertyRuleSchema.index({ title: 1 });
propertyRuleSchema.index({ isActive: 1 });

const PropertyRule = mongoose.model<IPropertyRule>('PropertyRule', propertyRuleSchema);

export default PropertyRule;
