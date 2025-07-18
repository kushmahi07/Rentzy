
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { PASSWORD, USER_TYPES, KYC_STATUS } from '../core/constants';

export interface IUser extends Document {
  name: {
    firstName: string;
    lastName: string;
    fullName: string;
  };
  email: string;
  phone: {
    countryCode: string;
    mobile: string;
  };
  password: string;
  userType: (typeof USER_TYPES.RENTER | typeof USER_TYPES.INVESTOR)[];
  kyc: {
    status: typeof KYC_STATUS.PENDING | typeof KYC_STATUS.IN_PROGRESS | typeof KYC_STATUS.VERIFIED | typeof KYC_STATUS.REJECTED;
  };
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLogin?: Date;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  otp: string;
  otpExpires?: Date;
  walletAddress?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [30, 'First name cannot be more than 30 characters']
      },
      lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [30, 'Last name cannot be more than 30 characters']
      },
      fullName: {
        type: String,
        trim: true,
        maxlength: [60, 'Full name cannot be more than 60 characters']
      }
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
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [PASSWORD.MIN_LENGTH, `Password must be at least ${PASSWORD.MIN_LENGTH} characters long`],
      select: false
    },
    userType: {
      type: [String],
      enum: [USER_TYPES.RENTER, USER_TYPES.INVESTOR],
      required: [true, 'User type is required'],
      validate: {
        validator: function(v: string[]) {
          return v && v.length > 0;
        },
        message: 'At least one user type must be specified'
      }
    },
    kyc: {
      status: {
        type: String,
        enum: [KYC_STATUS.PENDING, KYC_STATUS.IN_PROGRESS, KYC_STATUS.VERIFIED, KYC_STATUS.REJECTED],
        default: KYC_STATUS.PENDING,
        required: [true, 'KYC status is required']
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
    lastLogin: {
      type: Date,
      select: true
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
      sparse: true,
      unique: true,
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
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ 'phone.countryCode': 1, 'phone.mobile': 1 }, { unique: true });
userSchema.index({ userType: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ lastLogin: -1 });

// Pre-save middleware to generate fullName
userSchema.pre('save', function (next) {
  if (this.isModified('name.firstName') || this.isModified('name.lastName')) {
    this.name.fullName = `${this.name.firstName} ${this.name.lastName}`.trim();
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function (next) {
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
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
