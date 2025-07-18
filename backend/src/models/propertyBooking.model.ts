
import mongoose, { Schema, Document } from 'mongoose';

export interface IPropertyBooking extends Document {
  _property: mongoose.Schema.Types.ObjectId;
  _user: mongoose.Schema.Types.ObjectId;
  bookingId: string;
  checkInDate: Date;
  checkOutDate: Date;
  guestCount: number;
  totalAmount: {
    value: number;
    currency: string;
  };
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

const propertyBookingSchema = new Schema<IPropertyBooking>(
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
    bookingId: {
      type: String,
      required: [true, 'Booking ID is required'],
      unique: true,
      trim: true
    },
    checkInDate: {
      type: Date,
      required: [true, 'Check-in date is required']
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Check-out date is required'],
      validate: {
        validator: function(this: IPropertyBooking, value: Date) {
          return value > this.checkInDate;
        },
        message: 'Check-out date must be after check-in date'
      }
    },
    guestCount: {
      type: Number,
      required: [true, 'Guest count is required'],
      min: [1, 'Guest count must be at least 1']
    },
    totalAmount: {
      value: {
        type: Number,
        required: [true, 'Total amount value is required'],
        min: [0, 'Total amount cannot be negative']
      },
      currency: {
        type: String,
        required: [true, 'Currency is required'],
        uppercase: true,
        trim: true,
        default: 'USD',
        validate: {
          validator: function(v: string) {
            // Common currency codes validation
            const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'INR', 'BTC', 'ETH'];
            return validCurrencies.includes(v);
          },
          message: 'Invalid currency code'
        }
      }
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
      required: [true, 'Booking status is required']
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      required: [true, 'Payment status is required']
    },
    specialRequests: {
      type: String,
      trim: true,
      maxlength: [500, 'Special requests cannot exceed 500 characters']
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
propertyBookingSchema.index({ _property: 1, _user: 1 });
propertyBookingSchema.index({ status: 1 });
propertyBookingSchema.index({ paymentStatus: 1 });
propertyBookingSchema.index({ checkInDate: 1, checkOutDate: 1 });
propertyBookingSchema.index({ createdAt: -1 });

// Compound indexes
propertyBookingSchema.index({ _property: 1, status: 1 });
propertyBookingSchema.index({ _user: 1, status: 1 });
propertyBookingSchema.index({ _property: 1, checkInDate: 1, checkOutDate: 1 });

// Pre-save middleware to generate bookingId if not provided
propertyBookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.bookingId = `BK-${timestamp}-${random}`;
  }
  next();
});

const PropertyBooking = mongoose.model<IPropertyBooking>('PropertyBooking', propertyBookingSchema);

export default PropertyBooking;
