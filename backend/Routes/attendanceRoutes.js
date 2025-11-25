// routes/attendanceRoutes.js
import express from 'express'
import multer from 'multer';
import cors from 'cors'
import {
  getAttendance,
  getMonths,
  updateAttendance,
  deleteAttendance,
  recalculateByMonth,
  recalculateAll,
  importAttendance
} from "../controller/attendanceController.js"

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(cors());
router.use(express.json());

// GET: Fetch attendance for a month
router.get("/", getAttendance);

// GET: All distinct months
router.get("/months", getMonths);

// PUT: Update a record
router.put("/:id", updateAttendance);

// DELETE: Delete a record
router.delete("/:id", deleteAttendance);

// PUT: Recalculate by specific month
router.put("/recalculate/:month", recalculateByMonth);

// PUT: Recalculate all
router.put("/recalculate-all", recalculateAll);

router.post('/import', upload.single('file'), importAttendance);

export default router;
