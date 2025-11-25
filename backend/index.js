import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { ExpressPeerServer } from 'peer';
import { v4 as uuidv4 } from 'uuid';
import connectDB from './config/db.js';
import userRoutes from './Routes/userRoute.js';
import roleRoutes from './Routes/roleRoute.js';
import clientsRouter from './Routes/clients.js';
import customerRoutes from './Routes/customerRoute.js';
import productRoutes from './Routes/productRoutes.js';
import authRoutes from './Routes/authRoutes.js';
import processRoutes from './Routes/Process.js'
import verificationRoutes from './Routes/verify.js';
import attendanceRoutes from './Routes/attendanceRoutes.js';
import payoutVerificationRoutes from './Routes/PayoutVerificationRoute.js';
import fixedAmountRoutes from './Routes/fixedAmountRoutes.js';
import { protect } from './middleware/authmiddleware.js';

import plannedCollectionRoutes from './Routes/PlannedCollection.js';
// import receivedCollectionRoutes from './Routes/receivedCollection.js';
// import distribution from './Routes/distribution.js';



// ✅ Get __dirname equivalent in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env
dotenv.config();

// ✅ DB connect
connectDB();

// ✅ App + Server
const app = express();
const server = createServer(app);

// ✅ Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(express.static(__dirname + '/uploads'));

// ✅ API Routes
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/clients', clientsRouter); // Changed to /api/clients for consistency
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/process', processRoutes); // This means routes in processRoutes are prefixed with /api
app.use('/api/verifications', verificationRoutes); // This means routes in processRoutes are prefixed with /api
app.use('/api/attendance', attendanceRoutes);
app.use("/api/fixed-amount", fixedAmountRoutes)
app.use('/api/payout-verifications', payoutVerificationRoutes);
app.use("/api/planned-collections", plannedCollectionRoutes);
// app.use('/api/received', receivedCollectionRoutes);
// app.use('/api/distributions', distribution);

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
