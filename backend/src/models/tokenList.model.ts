
import mongoose, { Schema, Document } from 'mongoose';
import { CURRENCY } from '../core/constants/property.constant';

export interface ITokenList extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const tokenListSchema = new Schema<ITokenList>(
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
    totalListQuantity: {
      type: Number,
      required: [true, 'Total list quantity is required'],
      min: [1, 'Total list quantity must be at least 1'],
      default: 1
    },
    onListQuantity: {
      type: Number,
      required: [true, 'On list quantity is required'],
      min: [0, 'On list quantity cannot be negative'],
      validate: {
        validator: function(this: ITokenList, value: number) {
          return value <= this.totalListQuantity;
        },
        message: 'On list quantity cannot exceed total list quantity'
      }
    },
    soldQuantity: {
      type: Number,
      required: [true, 'Sold quantity is required'],
      min: [0, 'Sold quantity cannot be negative'],
      default: 0,
      validate: {
        validator: function(this: ITokenList, value: number) {
          return value + this.onListQuantity <= this.totalListQuantity;
        },
        message: 'Sold quantity plus on list quantity cannot exceed total list quantity'
      }
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
      unique: true,
      trim: true
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
tokenListSchema.index({ _tokenOwner: 1 });
tokenListSchema.index({ _property: 1, _user: 1 });
tokenListSchema.index({ tokenId: 1 });
tokenListSchema.index({ _user: 1, isActive: 1 });
tokenListSchema.index({ _property: 1, isActive: 1 });
tokenListSchema.index({ 'price.value': 1 });
tokenListSchema.index({ 'price.currency': 1 });
tokenListSchema.index({ onListQuantity: 1 });
tokenListSchema.index({ soldQuantity: 1 });
tokenListSchema.index({ createdAt: -1 });
tokenListSchema.index({ listingId: 1 });

// Compound indexes
tokenListSchema.index({ _property: 1, isActive: 1, 'price.value': 1 });
tokenListSchema.index({ _user: 1, isActive: 1, createdAt: -1 });
tokenListSchema.index({ tokenId: 1, isActive: 1 });
tokenListSchema.index({ _property: 1, tokenId: 1, isActive: 1 });
tokenListSchema.index({ onListQuantity: 1, isActive: 1 });

// Pre-save middleware to generate listingId if not provided
tokenListSchema.pre('save', function (next) {
  if (!this.listingId) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.listingId = `TL-${timestamp}-${random}`;
  }
  next();
});

// Pre-save middleware to validate quantities
tokenListSchema.pre('save', function (next) {
  // Ensure sold + onList doesn't exceed total
  if (this.soldQuantity + this.onListQuantity > this.totalListQuantity) {
    return next(new Error('Sum of sold and on list quantities cannot exceed total list quantity'));
  }
  
  // If all tokens are sold, set onListQuantity to 0 and isActive to false
  if (this.soldQuantity === this.totalListQuantity) {
    this.onListQuantity = 0;
    this.isActive = false;
  }
  
  next();
});

// Static method to find active listings by property
tokenListSchema.statics.findActiveListingsByProperty = function(propertyId: string) {
  return this.find({
    _property: new mongoose.Types.ObjectId(propertyId),
    isActive: true,
    onListQuantity: { $gt: 0 }
  })
    .populate('_user', 'name.fullName email')
    .populate('_property', 'title type')
    .sort({ 'price.value': 1 });
};

// Static method to find user's active listings
tokenListSchema.statics.findUserActiveListings = function(userId: string) {
  return this.find({
    _user: new mongoose.Types.ObjectId(userId),
    isActive: true
  })
    .populate('_property', 'title type')
    .sort({ createdAt: -1 });
};

// Static method to get marketplace statistics
tokenListSchema.statics.getMarketplaceStats = function() {
  return this.aggregate([
    {
      $match: {
        isActive: true
      }
    },
    {
      $group: {
        _id: null,
        totalActiveListings: { $sum: 1 },
        totalTokensOnSale: { $sum: '$onListQuantity' },
        totalTokensSold: { $sum: '$soldQuantity' },
        averagePrice: { $avg: '$price.value' },
        minPrice: { $min: '$price.value' },
        maxPrice: { $max: '$price.value' },
        uniqueProperties: { $addToSet: '$_property' },
        uniqueSellers: { $addToSet: '$_user' }
      }
    },
    {
      $addFields: {
        propertyCount: { $size: '$uniqueProperties' },
        sellerCount: { $size: '$uniqueSellers' }
      }
    },
    {
      $unset: ['uniqueProperties', 'uniqueSellers']
    }
  ]);
};

const TokenList = mongoose.model<ITokenList>('TokenList', tokenListSchema);

export default TokenList;
