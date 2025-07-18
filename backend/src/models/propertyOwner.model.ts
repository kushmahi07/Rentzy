
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { PASSWORD } from '../core/constants';

export interface IPropertyOwner extends Document {
  name: string;
  email: string;
  password: string;
  phone: {
    countryCode: string;
    mobile: string;
  };
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  otp?: string;
  otpExpires?: Date;
  walletAddress?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const propertyOwnerSchema = new Schema<IPropertyOwner>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [PASSWORD.MIN_LENGTH, `Password must be at least ${PASSWORD.MIN_LENGTH} characters long`],
      select: false
    },
    phone: {
      countryCode: {
        type: String,
        required: [true, 'Country code is required'],
        trim: true,
        match: [/^\+\d{1,4}$/, 'Please enter a valid country code (e.g., +1, +91)']
      },
      mobile: {
        type: String,
        required: [true, 'Mobile number is required'],
        trim: true,
        match: [/^\d{7,15}$/, 'Please enter a valid mobile number']
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    isPhoneVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: {
      type: String,
      select: false
    },
    emailVerificationExpires: {
      type: Date,
      select: false
    },
    otp: {
      type: String,
      select: false
    },
    otpExpires: {
      type: Date,
      select: false
    },
    walletAddress: {
      type: String,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(v: string) {
          // Ethereum wallet address validation (42 characters, starts with 0x)
          return !v || /^0x[a-fA-F0-9]{40}$/.test(v);
        },
        message: 'Invalid wallet address format'
      }
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        const { password, __v, ...cleanRet } = ret;
        return cleanRet;
      }
    }
  }
);

// Indexes
propertyOwnerSchema.index({ email: 1 }, { unique: true });
propertyOwnerSchema.index({ 'phone.countryCode': 1, 'phone.mobile': 1 }, { unique: true });
propertyOwnerSchema.index({ isActive: 1 });

// Hash password before saving
propertyOwnerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(PASSWORD.SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
propertyOwnerSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const PropertyOwner = mongoose.model<IPropertyOwner>('PropertyOwner', propertyOwnerSchema);

export default PropertyOwner;
