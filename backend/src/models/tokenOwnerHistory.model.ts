
import mongoose, { Schema, Document } from 'mongoose';

export interface ITokenOwnerHistory extends Document {
  _tokenOwner: mongoose.Schema.Types.ObjectId;
  _property: mongoose.Schema.Types.ObjectId;
  _user: mongoose.Schema.Types.ObjectId;
  tokenId: string;
  totalQuantity: number;
  availableQuantity: number;
  onListQuantity: number;
  actionType: 'created' | 'updated' | 'transfer' | 'listing' | 'unlisting' | 'sale' | 'purchase';
  previousQuantity?: number;
  newQuantity?: number;
  transactionHash?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const tokenOwnerHistorySchema = new Schema<ITokenOwnerHistory>(
  {
    _tokenOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TokenOwner',
      required: [true, 'Token owner reference is required'],
      index: true
    },
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
      default: 0
    },
    onListQuantity: {
      type: Number,
      required: [true, 'On list quantity is required'],
      min: [0, 'On list quantity cannot be negative'],
      default: 0
    },
    actionType: {
      type: String,
      enum: ['created', 'updated', 'transfer', 'listing', 'unlisting', 'sale', 'purchase'],
      required: [true, 'Action type is required'],
      index: true
    },
    previousQuantity: {
      type: Number,
      min: [0, 'Previous quantity cannot be negative']
    },
    newQuantity: {
      type: Number,
      min: [0, 'New quantity cannot be negative']
    },
    transactionHash: {
      type: String,
      trim: true,
      index: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters']
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
tokenOwnerHistorySchema.index({ _tokenOwner: 1 });
tokenOwnerHistorySchema.index({ _property: 1, _user: 1 });
tokenOwnerHistorySchema.index({ tokenId: 1 });
tokenOwnerHistorySchema.index({ _user: 1, isActive: 1 });
tokenOwnerHistorySchema.index({ _property: 1, isActive: 1 });
tokenOwnerHistorySchema.index({ actionType: 1 });
tokenOwnerHistorySchema.index({ transactionHash: 1 });
tokenOwnerHistorySchema.index({ totalQuantity: 1 });
tokenOwnerHistorySchema.index({ availableQuantity: 1 });
tokenOwnerHistorySchema.index({ onListQuantity: 1 });
tokenOwnerHistorySchema.index({ createdAt: -1 });

// Compound indexes
tokenOwnerHistorySchema.index({ _tokenOwner: 1, createdAt: -1 });
tokenOwnerHistorySchema.index({ _user: 1, _property: 1, createdAt: -1 });
tokenOwnerHistorySchema.index({ _property: 1, tokenId: 1, createdAt: -1 });
tokenOwnerHistorySchema.index({ _user: 1, tokenId: 1, createdAt: -1 });
tokenOwnerHistorySchema.index({ _tokenOwner: 1, actionType: 1 });
tokenOwnerHistorySchema.index({ _user: 1, actionType: 1, createdAt: -1 });
tokenOwnerHistorySchema.index({ _property: 1, actionType: 1, createdAt: -1 });

// Static method to get history by token owner
tokenOwnerHistorySchema.statics.getHistoryByTokenOwner = function(tokenOwnerId: string) {
  return this.find({
    _tokenOwner: new mongoose.Types.ObjectId(tokenOwnerId)
  })
    .populate('_property', 'title type')
    .populate('_user', 'name.fullName email')
    .sort({ createdAt: -1 });
};

// Static method to get user's token history
tokenOwnerHistorySchema.statics.getUserTokenHistory = function(userId: string, actionType?: string) {
  const query: any = {
    _user: new mongoose.Types.ObjectId(userId)
  };
  
  if (actionType) {
    query.actionType = actionType;
  }
  
  return this.find(query)
    .populate('_property', 'title type')
    .populate('_tokenOwner')
    .sort({ createdAt: -1 });
};

// Static method to get property token history
tokenOwnerHistorySchema.statics.getPropertyTokenHistory = function(propertyId: string, actionType?: string) {
  const query: any = {
    _property: new mongoose.Types.ObjectId(propertyId)
  };
  
  if (actionType) {
    query.actionType = actionType;
  }
  
  return this.find(query)
    .populate('_user', 'name.fullName email')
    .populate('_tokenOwner')
    .sort({ createdAt: -1 });
};

// Static method to track quantity changes over time
tokenOwnerHistorySchema.statics.getQuantityChanges = function(tokenOwnerId: string) {
  return this.aggregate([
    {
      $match: {
        _tokenOwner: new mongoose.Types.ObjectId(tokenOwnerId)
      }
    },
    {
      $sort: { createdAt: 1 }
    },
    {
      $project: {
        createdAt: 1,
        actionType: 1,
        totalQuantity: 1,
        availableQuantity: 1,
        onListQuantity: 1,
        previousQuantity: 1,
        newQuantity: 1,
        quantityDifference: {
          $subtract: ['$newQuantity', { $ifNull: ['$previousQuantity', 0] }]
        }
      }
    }
  ]);
};

// Static method to get transfer history
tokenOwnerHistorySchema.statics.getTransferHistory = function(tokenId: string) {
  return this.find({
    tokenId: tokenId,
    actionType: { $in: ['transfer', 'sale', 'purchase'] }
  })
    .populate('_user', 'name.fullName email')
    .populate('_property', 'title type')
    .sort({ createdAt: -1 });
};

// Static method to get trading activity
tokenOwnerHistorySchema.statics.getTradingActivity = function(userId: string) {
  return this.aggregate([
    {
      $match: {
        _user: new mongoose.Types.ObjectId(userId),
        actionType: { $in: ['sale', 'purchase', 'listing', 'unlisting'] }
      }
    },
    {
      $group: {
        _id: '$actionType',
        count: { $sum: 1 },
        totalQuantity: { $sum: '$totalQuantity' },
        recentActivity: { $last: '$createdAt' }
      }
    },
    {
      $sort: { recentActivity: -1 }
    }
  ]);
};

// Static method to create history entry
tokenOwnerHistorySchema.statics.createHistoryEntry = function(data: Partial<ITokenOwnerHistory>) {
  return this.create(data);
};

const TokenOwnerHistory = mongoose.model<ITokenOwnerHistory>('TokenOwnerHistory', tokenOwnerHistorySchema);

export default TokenOwnerHistory;
