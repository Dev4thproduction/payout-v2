// controllers/processController.js
import mongoose from "mongoose";
import Client from "../Models/Client.js";
import Product from "../Models/Product.js";
import Process from "../Models/Process.js";

// ✅ Get all clients
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    console.error("Error fetching clients:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Create a new process
export const createProcess = async (req, res) => {
  try {
    const { client, product, rate } = req.body;

    if (!client || !product || !rate) {
      return res
        .status(400)
        .json({ message: "Client, Product, and Rate are required" });
    }

    const newProcess = new Process({ client, product, rate });
    const savedProcess = await newProcess.save();

    res.status(201).json(savedProcess);
  } catch (error) {
    console.error("Error saving process:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all processes
export const getProcesses = async (req, res) => {
  try {
    const processes = await Process.find()
      .populate("client", "name")
      .populate("product", "name");
    res.json(processes);
  } catch (error) {
    console.error("Error fetching processes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update process by ID
export const updateProcess = async (req, res) => {
  const { client, product, rate } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid process ID" });
  }

  try {
    const updatedProcess = await Process.findByIdAndUpdate(
      id,
      { client, product, rate },
      { new: true, runValidators: true }
    );

    if (!updatedProcess) {
      return res.status(404).json({ message: "Process not found" });
    }

    res.json(updatedProcess);
  } catch (error) {
    console.error("Error updating process:", error);
    res.status(500).json({ message: "Server error updating process" });
  }
};

// ✅ Delete process by ID
export const deleteProcess = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid process ID" });
  }

  try {
    const deletedProcess = await Process.findByIdAndDelete(id);

    if (!deletedProcess) {
      return res.status(404).json({ message: "Process not found" });
    }

    res.json({ message: "Process deleted successfully" });
  } catch (error) {
    console.error("Error deleting process:", error);
    res.status(500).json({ message: "Server error deleting process" });
  }
};
