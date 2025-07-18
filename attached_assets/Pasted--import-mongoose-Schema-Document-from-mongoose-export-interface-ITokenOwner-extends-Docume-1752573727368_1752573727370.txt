
import mongoose, { Schema, Document } from 'mongoose';

export interface ITokenOwner extends Document {
  _property: mongoose.Schema.Types.ObjectId;
  _user: mongoose.Schema.Types.ObjectId;
  tokenId: string;
  totalQuantity: number;
  availableQuantity: number;
  onListQuantity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const tokenOwnerSchema = new Schema<ITokenOwner>(
  {
    _property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property is required'],
      index: true
    },
    _user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true
    },
    tokenId: {
      type: String,
      required: [true, 'Token ID is required'],
      trim: true,
      index: true
    },
    totalQuantity: {
      type: Number,
      required: [true, 'Total quantity is required'],
      min: [0, 'Total quantity cannot be negative'],
      default: 0
    },
    availableQuantity: {
      type: Number,
      required: [true, 'Available quantity is required'],
      min: [0, 'Available quantity cannot be negative'],
      default: 0,
      validate: {
        validator: function(this: ITokenOwner, value: number) {
          return value <= this.totalQuantity;
        },
        message: 'Available quantity cannot exceed total quantity'
      }
    },
    onListQuantity: {
      type: Number,
      required: [true, 'On list quantity is required'],
      min: [0, 'On list quantity cannot be negative'],
      default: 0,
      validate: {
        validator: function(this: ITokenOwner, value: number) {
          return value <= this.availableQuantity;
        },
        message: 'On list quantity cannot exceed available quantity'
      }
    },
    isActive: {
      type: Boolean,
      default: true,
      required: [true, 'Active status is required']
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        const { __v, ...cleanRet } = ret;
        return cleanRet;
      }
    }
  }
);

// Indexes for better query performance
tokenOwnerSchema.index({ _property: 1, _user: 1 });
tokenOwnerSchema.index({ tokenId: 1 });
tokenOwnerSchema.index({ _user: 1, isActive: 1 });
tokenOwnerSchema.index({ _property: 1, isActive: 1 });
tokenOwnerSchema.index({ totalQuantity: 1 });
tokenOwnerSchema.index({ availableQuantity: 1 });
tokenOwnerSchema.index({ onListQuantity: 1 });
tokenOwnerSchema.index({ createdAt: -1 });

// Compound indexes
tokenOwnerSchema.index({ _property: 1, _user: 1, tokenId: 1 }, { unique: true });
tokenOwnerSchema.index({ _user: 1, _property: 1, isActive: 1 });
tokenOwnerSchema.index({ _property: 1, tokenId: 1, isActive: 1 });

// Pre-save middleware to validate quantity relationships
tokenOwnerSchema.pre('save', function (next) {
  // Ensure available quantity + on list quantity doesn't exceed total quantity
  if (this.availableQuantity + this.onListQuantity > this.totalQuantity) {
    return next(new Error('Sum of available and on list quantities cannot exceed total quantity'));
  }
  
  // If total quantity is 0, reset other quantities
  if (this.totalQuantity === 0) {
    this.availableQuantity = 0;
    this.onListQuantity = 0;
  }
  
  next();
});

// Static method to find token ownership by user and property
tokenOwnerSchema.statics.findByUserAndProperty = function(userId: string, propertyId: string) {
  return this.findOne({
    _user: new mongoose.Types.ObjectId(userId),
    _property: new mongoose.Types.ObjectId(propertyId),
    isActive: true
  });
};

// Static method to get total tokens owned by user
tokenOwnerSchema.statics.getTotalTokensByUser = function(userId: string) {
  return this.aggregate([
    {
      $match: {
        _user: new mongoose.Types.ObjectId(userId),
        isActive: true
      }
    },
    {
      $group: {
        _id: null,
        totalTokens: { $sum: '$totalQuantity' },
        availableTokens: { $sum: '$availableQuantity' },
        listedTokens: { $sum: '$onListQuantity' }
      }
    }
  ]);
};

// Static method to get property token distribution
tokenOwnerSchema.statics.getPropertyTokenDistribution = function(propertyId: string) {
  return this.aggregate([
    {
      $match: {
        _property: new mongoose.Types.ObjectId(propertyId),
        isActive: true
      }
    },
    {
      $group: {
        _id: null,
        totalDistributedTokens: { $sum: '$totalQuantity' },
        totalAvailableForTrading: { $sum: '$availableQuantity' },
        totalOnMarketplace: { $sum: '$onListQuantity' },
        uniqueOwners: { $addToSet: '$_user' }
      }
    },
    {
      $addFields: {
        ownerCount: { $size: '$uniqueOwners' }
      }
    },
    {
      $unset: 'uniqueOwners'
    }
  ]);
};

const TokenOwner = mongoose.model<ITokenOwner>('TokenOwner', tokenOwnerSchema);

export default TokenOwner;
