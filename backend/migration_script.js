// migration_script.js
// Run this script once to update existing users with new fields

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// User Schema (copy from your User model)
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    identifier: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
    },
    customers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
    }],
    joinedOn: {
        type: String,
        default: Date.now,
    },
    deviceID: {
        type: String,
        default: '',
    },
    deviceInfo: {
        type: Object,
        default: {},
    },
    ipAddress: {
        type: String,
        default: '0.0.0.0',
    },
    distanceForCalling: {
        type: Number,
        required: true,
    },
    lastLogin: {
        type: String,
        default: '',
    },
    calling: {
        type: Boolean,
        default: false,
    },
    attendanceStatus: {
        type: Boolean,
        default: false,
    },
    status: {
        type: Boolean,
        default: true,
    },
    resignedOn: {
        type: String,
        default: '',
    },
    fcmToken: {
        type: String,
        default: '',
    },
    // New fields for force logout functionality
    tokenVersion: {
        type: Number,
        default: 0,
    },
    blacklistedTokens: [{
        token: String,
        blacklistedAt: {
            type: Date,
            default: Date.now
        }
    }],
    lastForceLogout: {
        type: Date,
        default: null,
    }
});

const User = mongoose.model('User', userSchema);

const migrateUsers = async () => {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');

        console.log('Starting user migration...');

        // Update all existing users to have the new fields
        const result = await User.updateMany(
            {
                $or: [
                    { tokenVersion: { $exists: false } },
                    { blacklistedTokens: { $exists: false } },
                    { lastForceLogout: { $exists: false } }
                ]
            },
            {
                $set: {
                    tokenVersion: 0,
                    blacklistedTokens: [],
                    lastForceLogout: null
                }
            }
        );

        console.log(`Migration completed. Updated ${result.modifiedCount} users.`);

        // Display summary
        const totalUsers = await User.countDocuments();
        const usersWithNewFields = await User.countDocuments({
            tokenVersion: { $exists: true },
            blacklistedTokens: { $exists: true },
            lastForceLogout: { $exists: true }
        });

        console.log(`Total users: ${totalUsers}`);
        console.log(`Users with new fields: ${usersWithNewFields}`);

        if (totalUsers === usersWithNewFields) {
            console.log('✅ All users have been successfully migrated!');
        } else {
            console.log('⚠️  Some users may not have been migrated. Please check manually.');
        }

        // Close the connection
        await mongoose.connection.close();
        console.log('✅ Migration completed and connection closed.');

    } catch (error) {
        console.error('❌ Error during migration:', error);
        process.exit(1);
    }
};

// Run the migration
migrateUsers().then(() => {
    console.log('🎉 Migration script finished successfully!');
    process.exit(0);
}).catch((error) => {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
});