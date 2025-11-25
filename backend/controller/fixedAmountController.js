// controllers/fixedAmountController.js
import FixedAmount from "../Models/FixedAmount.js";

// ✅ Get current active fixed amount
export const getCurrentFixedAmount = async (req, res) => {
  try {
    const fixed = await FixedAmount.getCurrentAmount();
    if (!fixed) {
      return res.status(404).json({ message: "Fixed amount not set yet" });
    }
    res.json(fixed);
  } catch (error) {
    console.error("Error fetching fixed amount:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Set or update fixed amount
export const setFixedAmount = async (req, res) => {
  const { amount, description = "", updatedBy = "admin" } = req.body;

  if (amount === undefined || amount === null) {
    return res.status(400).json({ message: "Amount is required" });
  }

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount < 0) {
    return res
      .status(400)
      .json({ message: "Invalid amount. Must be a positive number." });
  }

  try {
    const fixed = await FixedAmount.setNewAmount(
      numericAmount,
      description,
      updatedBy
    );

    res.json({
      message: "Fixed amount set successfully",
      fixed: {
        _id: fixed._id,
        amount: fixed.amount,
        description: fixed.description,
        isActive: fixed.isActive,
        createdAt: fixed.createdAt,
        updatedAt: fixed.updatedAt,
        updatedBy: fixed.updatedBy,
      },
    });
  } catch (error) {
    console.error("Error setting fixed amount:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        message: "Validation error",
        errors: validationErrors,
      });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get history of fixed amounts
export const getFixedAmountHistory = async (req, res) => {
  try {
    const amounts = await FixedAmount.find({})
      .sort({ updatedAt: -1 })
      .limit(10);

    res.json(amounts);
  } catch (error) {
    console.error("Error fetching fixed amount history:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update existing fixed amount
export const updateFixedAmount = async (req, res) => {
  const { amount, description } = req.body;
  const { id } = req.params;

  if (amount === undefined || amount === null) {
    return res.status(400).json({ message: "Amount is required" });
  }

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount < 0) {
    return res
      .status(400)
      .json({ message: "Invalid amount. Must be a positive number." });
  }

  try {
    const fixed = await FixedAmount.findByIdAndUpdate(
      id,
      {
        amount: numericAmount,
        description: description || "",
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!fixed) {
      return res.status(404).json({ message: "Fixed amount record not found" });
    }

    res.json({
      message: "Fixed amount updated successfully",
      fixed,
    });
  } catch (error) {
    console.error("Error updating fixed amount:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        message: "Validation error",
        errors: validationErrors,
      });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Deactivate fixed amount
export const deleteFixedAmount = async (req, res) => {
  const { id } = req.params;

  try {
    const fixed = await FixedAmount.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!fixed) {
      return res.status(404).json({ message: "Fixed amount record not found" });
    }

    res.json({
      message: "Fixed amount deactivated successfully",
      fixed,
    });
  } catch (error) {
    console.error("Error deactivating fixed amount:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
