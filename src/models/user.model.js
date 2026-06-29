const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true , "Email Address is required ."],
        trim:true,
        lowercase:true,
        maxLength:[255,"Email cannot Exceed 255 characters."],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address.']
    },

    username:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        minLength:[3,"Username must be Atleast 3 characters "],
        maxLength:[30,"Username must not exceed 30 characters"],
        match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain alphanumeric characters and underscores.']

    },

    password:{
        type:String,
        required:[true,"Password is Required"],
        select:false
    },
    provider:[{
        providerName:{type:String,enum : ['google','github','linkedin']},
        providerId:{type:String},
        _id:false
    }],

    profile:{
        displayName:{type:String, trim:true},
        avatarUrl:{type:String},
        roles:{type:[String],default:['user']}
    },
      status: {
    type: String,
    enum: ['pending_verification', 'active', 'suspended', 'locked'],
    default: 'pending_verification',
    index: true 
  },
  securityMetrics: {
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date }
  }
  },


   {
  timestamps: true,
  versionKey: false
});

// --- 🎯 THE PERFORMANCE INDEXES ---

// 1. Case-Insensitive Unique Indexes (Forces fast, identical lookups regardless of uppercase entry)
userSchema.index({ email: 1 }, { unique:true, collation: { locale: 'en', strength: 2 } });
userSchema.index({ username: 1 }, { unique:true, collation: { locale: 'en', strength: 2 } });

// 2. Sparse Compound Index (Optimizes OAuth social login queries without slowing down local auth registrations)
userSchema.index(
  { "providers.providerName": 1, "providers.providerId": 1 }, 
  { unique: true, sparse: true }
);

// 3. ESR Compound Index Example (Equality, Sort, Range)
// Optimized for: Finding active users, sorted by registration date, filtered by page ranges
userSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('User', userSchema);



