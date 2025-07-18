
import mongoose, { Schema, Document } from 'mongoose';
import { CURRENCY } from '../core/constants/property.constant';
import { TOKEN_TRANSACTION_TYPE, TOKEN_TRANSACTION_STATUS } from '../core/constants/token.constant';

export interface ITokenTransaction extends Document {
  _property: mongoose.Schema.Types.ObjectId;
  _user: mongoose.Schema.Types.ObjectId;
  _tokenList: mongoose.Schema.Types.ObjectId;
  _fromUser: mongoose.Schema.Types.ObjectId;
  type: typeof TOKEN_TRANSACTION_TYPE.BUY;
  quantity: number;
  amount: {
    value: number;
    currency: string;
  };
  status: typeof TOKEN_TRANSACTION_STATUS.PENDING | typeof TOKEN_TRANSACTION_STATUS.COMPLETED | typeof TOKEN_TRANSACTION_STATUS.FAILED | typeof TOKEN_TRANSACTION_STATUS.CANCELLED;
  txnHash?: string;
  tokenId: string;
  createdAt: Date;
  updatedAt: Date;
}

const tokenTransactionSchema = new Schema<ITokenTransaction>(
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
    _tokenList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TokenList',
      required: [true, 'Token list reference is required'],
      index: true
    },
    _fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'From user is required'],
      index: true
    },
    type: {
      type: String,
      enum: Object.values(TOKEN_TRANSACTION_TYPE),
      required: [true, 'Transaction type is required'],
      default: TOKEN_TRANSACTION_TYPE.BUY
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    amount: {
      value: {
        type: Number,
        required: [true, 'Amount value is required'],
        min: [0, 'Amount cannot be negative']
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
    status: {
      type: String,
      enum: Object.values(TOKEN_TRANSACTION_STATUS),
      default: TOKEN_TRANSACTION_STATUS.PENDING,
      required: [true, 'Transaction status is required']
    },
    txnHash: {
      type: String,
      trim: true,
      index: true,
      sparse: true
    },
    tokenId: {
      type: String,
      required: [true, 'Token ID is required'],
      trim: true,
      index: true
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
tokenTransactionSchema.index({ _property: 1, _user: 1 });
tokenTransactionSchema.index({ _tokenList: 1 });
tokenTransactionSchema.index({ _fromUser: 1 });
tokenTransactionSchema.index({ type: 1 });
tokenTransactionSchema.index({ status: 1 });
tokenTransactionSchema.index({ tokenId: 1 });
tokenTransactionSchema.index({ txnHash: 1 });
tokenTransactionSchema.index({ 'amount.value': 1 });
tokenTransactionSchema.index({ 'amount.currency': 1 });
tokenTransactionSchema.index({ quantity: 1 });
tokenTransactionSchema.index({ createdAt: -1 });

// Compound indexes
tokenTransactionSchema.index({ _user: 1, status: 1 });
tokenTransactionSchema.index({ _property: 1, status: 1 });
tokenTransactionSchema.index({ _tokenList: 1, status: 1 });
tokenTransactionSchema.index({ _fromUser: 1, status: 1 });
tokenTransactionSchema.index({ _user: 1, type: 1 });
tokenTransactionSchema.index({ _property: 1, tokenId: 1 });
tokenTransactionSchema.index({ _user: 1, _property: 1, createdAt: -1 });
tokenTransactionSchema.index({ _fromUser: 1, _user: 1, createdAt: -1 });
tokenTransactionSchema.index({ status: 1, createdAt: -1 });

// Static method to get user's transaction history
tokenTransactionSchema.statics.getUserTransactionHistory = function(userId: string) {
  return this.find({
    _user: new mongoose.Types.ObjectId(userId)
  })
    .populate('_property', 'title type')
    .populate('_fromUser', 'name.fullName email')
    .populate('_tokenList', 'listingId price')
    .sort({ createdAt: -1 });
};

// Static method to get property transaction history
tokenTransactionSchema.statics.getPropertyTransactionHistory = function(propertyId: string) {
  return this.find({
    _property: new mongoose.Types.ObjectId(propertyId)
  })
    .populate('_user', 'name.fullName email')
    .populate('_fromUser', 'name.fullName email')
    .populate('_tokenList', 'listingId price')
    .sort({ createdAt: -1 });
};

// Static method to get transactions by token list
tokenTransactionSchema.statics.getTokenListTransactions = function(tokenListId: string) {
  return this.find({
    _tokenList: new mongoose.Types.ObjectId(tokenListId)
  })
    .populate('_user', 'name.fullName email')
    .populate('_fromUser', 'name.fullName email')
    .populate('_property', 'title type')
    .sort({ createdAt: -1 });
};

// Static method to get seller's transaction history
tokenTransactionSchema.statics.getSellerTransactionHistory = function(sellerId: string) {
  return this.find({
    _fromUser: new mongoose.Types.ObjectId(sellerId)
  })
    .populate('_property', 'title type')
    .populate('_user', 'name.fullName email')
    .populate('_tokenList', 'listingId price')
    .sort({ createdAt: -1 });
};

// Static method to get transactions by status
tokenTransactionSchema.statics.getTransactionsByStatus = function(status: string) {
  return this.find({ status })
    .populate('_property', 'title type')
    .populate('_user', 'name.fullName email')
    .populate('_fromUser', 'name.fullName email')
    .populate('_tokenList', 'listingId price')
    .sort({ createdAt: -1 });
};

// Static method to get transaction analytics
tokenTransactionSchema.statics.getTransactionAnalytics = function(timeFrame: number = 30) {
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
        totalTransactions: { $sum: 1 },
        totalVolume: { $sum: '$amount.value' },
        totalQuantity: { $sum: '$quantity' },
        completedTransactions: {
          $sum: {
            $cond: [{ $eq: ['$status', TOKEN_TRANSACTION_STATUS.COMPLETED] }, 1, 0]
          }
        },
        failedTransactions: {
          $sum: {
            $cond: [{ $eq: ['$status', TOKEN_TRANSACTION_STATUS.FAILED] }, 1, 0]
          }
        },
        uniqueBuyers: { $addToSet: '$_user' },
        uniqueSellers: { $addToSet: '$_fromUser' },
        uniqueProperties: { $addToSet: '$_property' }
      }
    },
    {
      $addFields: {
        activeBuyers: { $size: '$uniqueBuyers' },
        activeSellers: { $size: '$uniqueSellers' },
        activeProperties: { $size: '$uniqueProperties' },
        successRate: {
          $multiply: [
            { $divide: ['$completedTransactions', '$totalTransactions'] },
            100
          ]
        }
      }
    },
    {
      $unset: ['uniqueBuyers', 'uniqueSellers', 'uniqueProperties']
    },
    {
      $sort: { _id: 1 }
    }
  ]);
};

// Pre-save middleware to generate transaction hash if not provided
tokenTransactionSchema.pre('save', function (next) {
  if (!this.txnHash && this.status === TOKEN_TRANSACTION_STATUS.COMPLETED) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    this.txnHash = `TXN-${timestamp}-${random}`;
  }
  next();
});

const TokenTransaction = mongoose.model<ITokenTransaction>('TokenTransaction', tokenTransactionSchema);

export default TokenTransaction;
