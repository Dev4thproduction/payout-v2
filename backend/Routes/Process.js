// routes/processRoutes.js
import express from "express";
import {
  getClients,
  getProducts,
  createProcess,
  getProcesses,
  updateProcess,
  deleteProcess,
} from "../controller/processController.js";

const router = express.Router();

// ✅ Client and Product routes
router.get("/clients", getClients);
router.get("/products", getProducts);

// ✅ Process routes
router.post("/", createProcess);
router.get("/", getProcesses);
router.put("/:id", updateProcess);
router.delete("/:id", deleteProcess);

export default router;
