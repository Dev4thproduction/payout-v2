import PlannedCollection from "../Models/PlannedCollection.js";
import ReceivedCollection from '../Models/ReceivedCollection.js';
import Distribution from '../Models/Distribution.js';


// ✅ Get all planned collections
export const getAllPlannedCollections = async (req, res) => {
  try {
    const collections = await PlannedCollection.find().sort({ month: -1, createdAt: -1 });
    res.status(200).json(collections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get planned collections by month
export const getPlannedCollectionsByMonth = async (req, res) => {
  try {
    const { month } = req.params;
    const collections = await PlannedCollection.find({ month }).sort({ createdAt: -1 });
    res.status(200).json(collections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Create (bulk insert) planned collections
export const createPlannedCollections = async (req, res) => {
  try {
    const collections = req.body;

    if (!Array.isArray(collections)) {
      return res.status(400).json({ error: "Data should be an array" });
    }

    for (const collection of collections) {
      if (!collection.month) {
        return res.status(400).json({ error: "Month is required for all collections" });
      }
      if (!collection.name) {
        return res.status(400).json({ error: "Name is required for all collections" });
      }
      if (!collection.product) {
        return res.status(400).json({ error: "Product is required for all collections" });
      }
    }

    const saved = await PlannedCollection.insertMany(collections);
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update a planned collection
export const updatePlannedCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.month !== undefined && !updates.month) {
      return res.status(400).json({ error: "Month cannot be empty" });
    }
    if (updates.name !== undefined && !updates.name) {
      return res.status(400).json({ error: "Name cannot be empty" });
    }
    if (updates.product !== undefined && !updates.product) {
      return res.status(400).json({ error: "Product cannot be empty" });
    }

    const updatedCollection = await PlannedCollection.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedCollection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    res.status(200).json(updatedCollection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete a planned collection
export const deletePlannedCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCollection = await PlannedCollection.findByIdAndDelete(id);

    if (!deletedCollection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    res.status(200).json({ message: "Collection deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get available months
export const getAvailableMonths = async (req, res) => {
  try {
    const months = await PlannedCollection.distinct("month");
    const sortedMonths = months.sort((a, b) => b.localeCompare(a));
    res.status(200).json(sortedMonths);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};





// 📌 Create a new received collection entry
export const createReceivedCollection = async (req, res) => {
  try {
    const {
      id,
      month,
      process,
      billAmount,
      tds,
      balance,
      rate,
      grossSalary,
      netSalary,
      total
    } = req.body;

    // Validation for required fields
    if (!month || !process) {
      return res.status(400).json({ 
        message: 'Missing required fields: month, process' 
      });
    }

    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(month)) {
      return res.status(400).json({ message: 'Month must be in YYYY-MM format' });
    }

    const newEntry = new ReceivedCollection({
      _id: id || undefined, // allow manual ID if passed
      month,
      process,
      billAmount: parseFloat(billAmount) || 0,
      tds: parseFloat(tds) || 0,
      balance: parseFloat(balance) || 0,
      rate: parseFloat(rate) || 0,
      grossSalary: parseFloat(grossSalary) || 0,
      netSalary: parseFloat(netSalary) || 0,
      total: parseFloat(total) || 0
    });

    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    console.error('Error saving received collection data:', error);
    res.status(500).json({ message: error.message });
  }
};


// 📌 Get all received collections
export const getAllReceivedCollections = async (req, res) => {
  try {
    const data = await ReceivedCollection.find()
      .sort({ month: -1, createdAt: -1 })
      .populate('supervisor', 'name email identifier')
      .populate('teamMembers', 'name email identifier');
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching received collection data:", error);
    res.status(500).json({ message: error.message });
  }
};

// 📌 Get collections by month
export const getReceivedCollectionsByMonth = async (req, res) => {
  try {
    const { month } = req.params;
    const monthRegex = /^\d{4}-\d{2}$/;

    if (!monthRegex.test(month)) {
      return res.status(400).json({ message: 'Month must be in YYYY-MM format' });
    }

    const collections = await ReceivedCollection.find({ month })
      .sort({ createdAt: -1 })
      .populate('supervisor', 'name email identifier')
      .populate('teamMembers', 'name email identifier');
    res.status(200).json(collections);
  } catch (err) {
    console.error("Error fetching by month:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📌 Update a received collection
export const updateReceivedCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      month, process, billAmount, tds, balance, rate, grossSalary, netSalary, total
    } = req.body;

    if (!month || !process || !billAmount || !tds || !grossSalary || !netSalary) {
      return res.status(400).json({ 
        message: 'Missing required fields: month, process, billAmount, tds, grossSalary, netSalary' 
      });
    }

    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(month)) {
      return res.status(400).json({ message: 'Month must be in YYYY-MM format' });
    }

    const updatedEntry = await ReceivedCollection.findByIdAndUpdate(
      id,
      {
        month,
        process,
        billAmount: parseFloat(billAmount),
        tds: parseFloat(tds),
        balance: parseFloat(balance),
        rate: parseFloat(rate),
        grossSalary: parseFloat(grossSalary),
        netSalary: parseFloat(netSalary),
        total: parseFloat(total)
      },
      { new: true, runValidators: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.status(200).json(updatedEntry);
  } catch (error) {
    console.error('Error updating received collection:', error);
    res.status(500).json({ message: error.message });
  }
};

// 📌 Delete a received collection
export const deleteReceivedCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEntry = await ReceivedCollection.findByIdAndDelete(id);

    if (!deletedEntry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.status(200).json({ message: 'Entry deleted successfully', deletedEntry });
  } catch (error) {
    console.error('Error deleting received collection:', error);
    res.status(500).json({ message: error.message });
  }
};

// 📌 Get available months
// export const getAvailableMonths = async (req, res) => {
//   try {
//     const months = await ReceivedCollection.distinct("month");
//     const sortedMonths = months.sort((a, b) => b.localeCompare(a));
//     res.status(200).json(sortedMonths);
//   } catch (err) {
//     console.error("Error fetching months:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// 📌 Get statistics by month
export const getStatsByMonth = async (req, res) => {
  try {
    const stats = await ReceivedCollection.aggregate([
      {
        $group: {
          _id: "$month",
          totalEntries: { $sum: 1 },
          totalBillAmount: { $sum: "$billAmount" },
          totalTDS: { $sum: "$tds" },
          totalBalance: { $sum: "$balance" },
          totalGrossSalary: { $sum: "$grossSalary" },
          totalNetSalary: { $sum: "$netSalary" },
          totalAmount: { $sum: "$total" }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    res.status(200).json(stats);
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: err.message });
  }
};




// 📌 Get all distributions (with optional month filter)
export const getAllDistributions = async (req, res) => {
  try {
    const { month } = req.query;
    let query = {};

    if (month) {
      query.month = month;
    }

    const distributions = await Distribution.find(query)
      .sort({ month: -1, createdAt: -1 })
      .populate('supervisor', 'name email identifier')
      .populate('teamMembers', 'name email identifier');
    res.json(distributions);
  } catch (err) {
    console.error('Error fetching distributions:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 📌 Create a new distribution
export const createDistribution = async (req, res) => {
  try {
    const newDistribution = new Distribution(req.body);
    const savedDistribution = await newDistribution.save();
    res.status(201).json(savedDistribution);
  } catch (err) {
    console.error('Error creating distribution:', err);
    res.status(400).json({ message: 'Error creating distribution', error: err.message });
  }
};

// 📌 Bulk create/update distributions
export const bulkSaveDistributions = async (req, res) => {
  try {
    const distributions = req.body;

    if (!Array.isArray(distributions)) {
      return res.status(400).json({ message: 'Expected an array of distributions' });
    }

    const savedDistributions = [];

    for (const dist of distributions) {
      if (dist._id) {
        // Update existing
        const updated = await Distribution.findByIdAndUpdate(dist._id, { $set: dist }, { new: true });
        savedDistributions.push(updated);
      } else {
        // Create new
        const newDistribution = new Distribution(dist);
        const saved = await newDistribution.save();
        savedDistributions.push(saved);
      }
    }

    res.status(200).json(savedDistributions);
  } catch (err) {
    console.error('Error saving distributions:', err);
    res.status(400).json({ message: 'Error saving distributions', error: err.message });
  }
};

// 📌 Get a single distribution
export const getDistributionById = async (req, res) => {
  try {
    const distribution = await Distribution.findById(req.params.id);
    if (!distribution) {
      return res.status(404).json({ message: 'Distribution not found' });
    }
    res.json(distribution);
  } catch (err) {
    console.error('Error fetching distribution:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 📌 Update a distribution
export const updateDistribution = async (req, res) => {
  try {
    const updatedDistribution = await Distribution.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDistribution) {
      return res.status(404).json({ message: 'Distribution not found' });
    }
    res.json(updatedDistribution);
  } catch (err) {
    console.error('Error updating distribution:', err);
    res.status(400).json({ message: 'Error updating distribution', error: err.message });
  }
};

// 📌 Delete a distribution
export const deleteDistribution = async (req, res) => {
  try {
    const deletedDistribution = await Distribution.findByIdAndDelete(req.params.id);
    if (!deletedDistribution) {
      return res.status(404).json({ message: 'Distribution not found' });
    }
    res.json({ message: 'Distribution deleted successfully' });
  } catch (err) {
    console.error('Error deleting distribution:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 📌 Get available months
