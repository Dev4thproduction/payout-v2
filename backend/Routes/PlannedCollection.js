import express from "express";
import {
  getAllPlannedCollections,
  getPlannedCollectionsByMonth,
  createPlannedCollections,
  updatePlannedCollection,
  deletePlannedCollection,
  getAvailableMonths
} from "../controller/collectionController.js";
import {
  createReceivedCollection,
  getAllReceivedCollections,
  getReceivedCollectionsByMonth,
  updateReceivedCollection,
  deleteReceivedCollection,
  getStatsByMonth
} from '../controller/collectionController.js';

import {
  getAllDistributions,
  createDistribution,
  bulkSaveDistributions,
  getDistributionById,
  updateDistribution,
  deleteDistribution,
} from '../controller/collectionController.js';

const router = express.Router();

// ✅ Routes mapping
router.get("/", getAllPlannedCollections);
router.get("/by-month/:month", getPlannedCollectionsByMonth);
router.post("/", createPlannedCollections);
router.put("/:id", updatePlannedCollection);
router.delete("/:id", deletePlannedCollection);
router.get("/months/available", getAvailableMonths);

// routes recived
router.post('/recived', createReceivedCollection);
router.get('/recived', getAllReceivedCollections);
router.get('/recived/by-month/:month', getReceivedCollectionsByMonth);
router.put('/recived/:id', updateReceivedCollection);
router.delete('/recived/:id', deleteReceivedCollection);

// Extra Routes
router.get('/filter/months', getAvailableMonths);
// router.get('/stats/by-month', getStatsByMonth);

// routes distributions
router.get('/distributions', getAllDistributions);
router.post('/distributions', createDistribution);
router.post('/distributions/bulk', bulkSaveDistributions);
router.get('/distributions/:id', getDistributionById);
router.put('/distributions/:id', updateDistribution);
router.delete('/distributions/:id', deleteDistribution);
export default router;
