// import express from 'express';
// import ReceivedCollection from '../Models/ReceivedCollection.js';

// const router = express.Router();

// /**
//  * Route handlers for managing received collections
//  * These endpoints handle CRUD operations for received collections data
//  */

// // POST: Create a new received collection entry
// router.post('/', async (req, res) => {
//   try {
//     const {
//       month,
//       process,
//       billAmount,
//       tds,
//       balance,
//       rate,
//       grossSalary,
//       netSalary,
//       total
//     } = req.body;

//     // Validation
//     if (!month || !process || !billAmount || !tds || !grossSalary || !netSalary) {
//       return res.status(400).json({ 
//         message: 'Missing required fields: month, process, billAmount, tds, grossSalary, netSalary' 
//       });
//     }

//     // Validate month format
//     const monthRegex = /^\d{4}-\d{2}$/;
//     if (!monthRegex.test(month)) {
//       return res.status(400).json({ message: 'Month must be in YYYY-MM format' });
//     }

//     const newEntry = new ReceivedCollection({
//       month,
//       process,
//       billAmount: parseFloat(billAmount),
//       tds: parseFloat(tds),
//       balance: parseFloat(balance),
//       rate: parseFloat(rate), // Ensure it's a number
//       grossSalary: parseFloat(grossSalary),
//       netSalary: parseFloat(netSalary),
//       total: parseFloat(total)
//     });

//     const savedEntry = await newEntry.save();
//     res.status(201).json(savedEntry);
//   } catch (error) {
//     console.error('Error saving received collection data:', error);
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({ message: error.message });
//     }
//     res.status(500).json({ 
//       message: 'Error saving received collection data', 
//       error: error.message 
//     });
//   }
// });

// // GET: Fetch all received collection entries
// router.get("/", async (req, res) => {
//   try {
//     const data = await ReceivedCollection.find().sort({ month: -1, createdAt: -1 });
//     res.status(200).json(data);
//   } catch (error) {
//     console.error("Error fetching received collection data:", error);
//     res.status(500).json({ 
//       message: "Failed to fetch received collection data",
//       error: error.message 
//     });
//   }
// });

// // GET: Fetch received collections by month
// router.get("/by-month/:month", async (req, res) => {
//   try {
//     const { month } = req.params;
    
//     // Validate month format
//     const monthRegex = /^\d{4}-\d{2}$/;
//     if (!monthRegex.test(month)) {
//       return res.status(400).json({ message: 'Month must be in YYYY-MM format' });
//     }
    
//     const collections = await ReceivedCollection.find({ month }).sort({ createdAt: -1 });
//     res.status(200).json(collections);
//   } catch (err) {
//     console.error("Error fetching received collections by month:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// // PUT: Update an existing received collection entry
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       month,
//       process,
//       billAmount,
//       tds,
//       balance,
//       rate,
//       grossSalary,
//       netSalary,
//       total
//     } = req.body;

//     // Validation
//     if (!month || !process || !billAmount || !tds || !grossSalary || !netSalary) {
//       return res.status(400).json({ 
//         message: 'Missing required fields: month, process, billAmount, tds, grossSalary, netSalary' 
//       });
//     }

//     // Validate month format
//     const monthRegex = /^\d{4}-\d{2}$/;
//     if (!monthRegex.test(month)) {
//       return res.status(400).json({ message: 'Month must be in YYYY-MM format' });
//     }

//     const updatedEntry = await ReceivedCollection.findByIdAndUpdate(
//       id,
//       {
//         month,
//         process,
//         billAmount: parseFloat(billAmount),
//         tds: parseFloat(tds),
//         balance: parseFloat(balance),
//         rate: parseFloat(rate),
//         grossSalary: parseFloat(grossSalary),
//         netSalary: parseFloat(netSalary),
//         total: parseFloat(total)
//       },
//       { new: true, runValidators: true }
//     );

//     if (!updatedEntry) {
//       return res.status(404).json({ message: 'Entry not found' });
//     }

//     res.status(200).json(updatedEntry);
//   } catch (error) {
//     console.error('Error updating received collection data:', error);
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({ message: error.message });
//     }
//     res.status(500).json({ 
//       message: 'Error updating received collection data', 
//       error: error.message 
//     });
//   }
// });

// // DELETE: Delete a received collection entry
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedEntry = await ReceivedCollection.findByIdAndDelete(id);

//     if (!deletedEntry) {
//       return res.status(404).json({ message: 'Entry not found' });
//     }

//     res.status(200).json({ message: 'Entry deleted successfully', deletedEntry });
//   } catch (error) {
//     console.error('Error deleting received collection data:', error);
//     res.status(500).json({ 
//       message: 'Error deleting received collection data', 
//       error: error.message 
//     });
//   }
// });

// // GET: Get available months (for filtering purposes)
// router.get("/months/available", async (req, res) => {
//   try {
//     const months = await ReceivedCollection.distinct("month");
//     // Sort months in descending order (newest first)
//     const sortedMonths = months.sort((a, b) => b.localeCompare(a));
//     res.status(200).json(sortedMonths);
//   } catch (err) {
//     console.error("Error fetching available months:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// // GET: Get received collections statistics by month
// router.get("/stats/by-month", async (req, res) => {
//   try {
//     const stats = await ReceivedCollection.aggregate([
//       {
//         $group: {
//           _id: "$month",
//           totalEntries: { $sum: 1 },
//           totalBillAmount: { $sum: "$billAmount" },
//           totalTDS: { $sum: "$tds" },
//           totalBalance: { $sum: "$balance" },
//           totalGrossSalary: { $sum: "$grossSalary" },
//           totalNetSalary: { $sum: "$netSalary" },
//           totalAmount: { $sum: "$total" }
//         }
//       },
//       {
//         $sort: { _id: -1 }
//       }
//     ]);
    
//     res.status(200).json(stats);
//   } catch (err) {
//     console.error("Error fetching received collections statistics:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// export default router;