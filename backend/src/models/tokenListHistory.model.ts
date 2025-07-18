
import mongoose, { Schema, Document } from 'mongoose';
import { CURRENCY } from '../core/constants/property.constant';

export interface ITokenListHistory extends Document {
  _tokenList: mongoose.Schema.Types.ObjectId;
  _tokenOwner: mongoose.Schema.Types.ObjectId;
  _property: mongoose.Schema.Types.ObjectId;
  _user: mongoose.Schema.Types.ObjectId;
  tokenId: string;
  totalListQuantity: number;
  onListQuantity: number;
  soldQuantity: number;
  price: {
    value: number;
    currency: string;
  };
  isActive: boolean;
  listingId: string;
  actionType: 'created' | 'updated' | 'price_changed' | 'quantity_changed' | 'sold' | 'cancelled' | 'completed';
  previousPrice?: number;
  newPrice?: number;
  previousQuantity?: number;
  newQuantity?: number;
  transactionHash?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const tokenListHistorySchema = new Schema<ITokenListHistory>(
  {
    _tokenList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TokenList',
      required: [true, 'Token list reference is required'],
      index: true
    },
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
    totalListQuantity: {
      type: Number,
      required: [true, 'Total list quantity is required'],
      min: [1, 'Total list quantity must be at least 1']
    },
    onListQuantity: {
      type: Number,
      required: [true, 'On list quantity is required'],
      min: [0, 'On list quantity cannot be negative']
    },
    soldQuantity: {
      type: Number,
      required: [true, 'Sold quantity is required'],
      min: [0, 'Sold quantity cannot be negative'],
      default: 0
    },
    price: {
      value: {
        type: Number,
        required: [true, 'Price value is required'],
        min: [0, 'Price cannot be negative']
      },
      currency: {
        type: String,
        enum: Object.values(CURRENCY),
        required: [true, 'Currency is required'],
        uppercase: true,
        trim: true,
        default: CURRENCY.USD
      }
    },
    isActive: {
      type: Boolean,
      default: true,
      required: [true, 'Active status is required']
    },
    listingId: {
      type: String,
      required: [true, 'Listing ID is required'],
      trim: true,
      index: true
    },
    actionType: {
      type: String,
      enum: ['created', 'updated', 'price_changed', 'quantity_changed', 'sold', 'cancelled', 'completed'],
      required: [true, 'Action type is required'],
      index: true
    },
    previousPrice: {
      type: Number,
      min: [0, 'Previous price cannot be negative']
    },
    newPrice: {
      type: Number,
      min: [0, 'New price cannot be negative']
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
tokenListHistorySchema.index({ _tokenList: 1 });
tokenListHistorySchema.index({ _tokenOwner: 1 });
tokenListHistorySchema.index({ _property: 1, _user: 1 });
tokenListHistorySchema.index({ tokenId: 1 });
tokenListHistorySchema.index({ _user: 1, isActive: 1 });
tokenListHistorySchema.index({ _property: 1, isActive: 1 });
tokenListHistorySchema.index({ 'price.value': 1 });
tokenListHistorySchema.index({ 'price.currency': 1 });
tokenListHistorySchema.index({ onListQuantity: 1 });
tokenListHistorySchema.index({ soldQuantity: 1 });
tokenListHistorySchema.index({ createdAt: -1 });
tokenListHistorySchema.index({ listingId: 1 });
tokenListHistorySchema.index({ actionType: 1 });
tokenListHistorySchema.index({ transactionHash: 1 });

// Compound indexes
tokenListHistorySchema.index({ _tokenList: 1, createdAt: -1 });
tokenListHistorySchema.index({ _user: 1, _property: 1, createdAt: -1 });
tokenListHistorySchema.index({ _property: 1, tokenId: 1, createdAt: -1 });
tokenListHistorySchema.index({ _user: 1, tokenId: 1, createdAt: -1 });
tokenListHistorySchema.index({ listingId: 1, createdAt: -1 });
tokenListHistorySchema.index({ _tokenList: 1, actionType: 1 });
tokenListHistorySchema.index({ _user: 1, actionType: 1, createdAt: -1 });
tokenListHistorySchema.index({ _property: 1, actionType: 1, createdAt: -1 });

// Static method to get history by token list
tokenListHistorySchema.statics.getHistoryByTokenList = function(tokenListId: string) {
  return this.find({
    _tokenList: new mongoose.Types.ObjectId(tokenListId)
  })
    .populate('_property', 'title type')
    .populate('_user', 'name.fullName email')
    .sort({ createdAt: -1 });
};

// Static method to get user's listing history
tokenListHistorySchema.statics.getUserListingHistory = function(userId: string, actionType?: string) {
  const query: any = {
    _user: new mongoose.Types.ObjectId(userId)
  };
  
  if (actionType) {
    query.actionType = actionType;
  }
  
  return this.find(query)
    .populate('_property', 'title type')
    .populate('_tokenList')
    .sort({ createdAt: -1 });
};

// Static method to get property listing history
tokenListHistorySchema.statics.getPropertyListingHistory = function(propertyId: string, actionType?: string) {
  const query: any = {
    _property: new mongoose.Types.ObjectId(propertyId)
  };
  
  if (actionType) {
    query.actionType = actionType;
  }
  
  return this.find(query)
    .populate('_user', 'name.fullName email')
    .populate('_tokenList')
    .sort({ createdAt: -1 });
};

// Static method to track price changes over time
tokenListHistorySchema.statics.getPriceHistory = function(tokenListId: string) {
  return this.aggregate([
    {
      $match: {
        _tokenList: new mongoose.Types.ObjectId(tokenListId),
        actionType: { $in: ['created', 'price_changed'] }
      }
    },
    {
      $sort: { createdAt: 1 }
    },
    {
      $project: {
        createdAt: 1,
        'price.value': 1,
        'price.currency': 1,
        previousPrice: 1,
        newPrice: 1,
        actionType: 1,
        priceChange: {
          $subtract: [
            { $ifNull: ['$newPrice', '$price.value'] },
            { $ifNull: ['$previousPrice', 0] }
          ]
        }
      }
    }
  ]);
};

// Static method to get marketplace activity analytics
tokenListHistorySchema.statics.getMarketplaceActivity = function(timeFrame: number = 30) {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - timeFrame);
  
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: fromDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt'
          }
        },
        totalListings: { $sum: 1 },
        totalTokensListed: { $sum: '$onListQuantity' },
        totalTokensSold: { $sum: '$soldQuantity' },
        averagePrice: { $avg: '$price.value' },
        uniqueUsers: { $addToSet: '$_user' },
        uniqueProperties: { $addToSet: '$_property' },
        actionCounts: {
          $push: '$actionType'
        }
      }
    },
    {
      $addFields: {
        activeUsers: { $size: '$uniqueUsers' },
        activeProperties: { $size: '$uniqueProperties' }
      }
    },
    {
      $unset: ['uniqueUsers', 'uniqueProperties']
    },
    {
      $sort: { _id: 1 }
    }
  ]);
};

// Static method to get sales analytics
tokenListHistorySchema.statics.getSalesAnalytics = function(userId?: string) {
  const matchStage: any = {
    actionType: { $in: ['sold', 'completed'] }
  };
  
  if (userId) {
    matchStage._user = new mongoose.Types.ObjectId(userId);
  }
  
  return this.aggregate([
    {
      $match: matchStage
    },
    {
      $group: {
        _id: '$_user',
        totalSales: { $sum: 1 },
        totalTokensSold: { $sum: '$soldQuantity' },
        totalRevenue: { $sum: { $multiply: ['$price.value', '$soldQuantity'] } },
        averageSalePrice: { $avg: '$price.value' },
        firstSale: { $min: '$createdAt' },
        lastSale: { $max: '$createdAt' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userDetails'
      }
    },
    {
      $unwind: '$userDetails'
    },
    {
      $project: {
        _id: 1,
        'userDetails.name.fullName': 1,
        'userDetails.email': 1,
        totalSales: 1,
        totalTokensSold: 1,
        totalRevenue: 1,
        averageSalePrice: 1,
        firstSale: 1,
        lastSale: 1
      }
    },
    {
      $sort: { totalRevenue: -1 }
    }
  ]);
};

// Static method to create history entry
tokenListHistorySchema.statics.createHistoryEntry = function(data: Partial<ITokenListHistory>) {
  return this.create(data);
};

const TokenListHistory = mongoose.model<ITokenListHistory>('TokenListHistory', tokenListHistorySchema);

export default TokenListHistory;
