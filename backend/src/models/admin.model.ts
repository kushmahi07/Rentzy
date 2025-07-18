import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

// Constants for password requirements
export const PASSWORD = {
  MIN_LENGTH: 8,
  SALT_ROUNDS: 12
} as const;

export interface IAdmin extends Document {
  name: string;
  email: string;
  phone: {
    countryCode: string;
    mobile: string;
  };
  password?: string;
  role: string;
  isSuperAdmin: boolean;
  isActive: boolean;
  additionalNotes?: string;
  accessRights: {
    changeProperty: boolean;
    approveProperty: boolean;
    freezeTokenSale: boolean;
    approveTrades: boolean;
  };
  otp?: string;
  otpExpires?: Date;
  resendCount: number;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

// Define the Admin schema
const adminSchema: Schema<IAdmin> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: 'Please provide a valid email address'
      }
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
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true
    },
    isSuperAdmin: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    additionalNotes: {
      type: String,
      trim: true,
      maxlength: [500, 'Additional notes cannot exceed 500 characters']
    },
    accessRights: {
      changeProperty: {
        type: Boolean,
        default: false
      },
      approveProperty: {
        type: Boolean,
        default: false
      },
      freezeTokenSale: {
        type: Boolean,
        default: false
      },
      approveTrades: {
        type: Boolean,
        default: false
      }
    },
    otp: {
      type: String,
      select: false
    },
    otpExpires: {
      type: Date,
      select: false
    },
    resendCount: {
      type: Number,
      default: 0,
      select: false
    }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        delete ret.password;
        delete ret.otp;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes
adminSchema.index({ email: 1 }, { unique: true });
adminSchema.index({ 'phone.countryCode': 1, 'phone.mobile': 1 }, { unique: true });
adminSchema.index({ role: 1 });
adminSchema.index({ isSuperAdmin: 1 });
adminSchema.index({ isActive: 1 });

// Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(PASSWORD.SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
adminSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};



const AdminModel: Model<IAdmin> = mongoose.model<IAdmin>('Admin', adminSchema);

// Export the model
export default AdminModel;