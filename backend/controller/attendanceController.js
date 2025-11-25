import XLSX from 'xlsx'
import axios from 'axios'
import Attendance from '../Models/Attendance.js'
import User from "../Models/User.js"

// Helpers
function normalizeText(text) {
  return text ? text.toString().trim().toLowerCase() : "";
}

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

async function getFixedSalary() {
  try {
    const response = await axios.get('http://localhost:5000/api/fixed-amount');
    if (response.data && typeof response.data.amount === 'number') {
      return response.data.amount;
    }
    if (Array.isArray(response.data)) {
      const activeAmount = response.data.find(item => item.isActive === true);
      if (activeAmount && typeof activeAmount.amount === 'number') {
        return activeAmount.amount;
      }
    }
    console.warn('Fixed salary API returned invalid data, using default 500');
    return 500;
  } catch (error) {
    console.error('Error fetching fixed salary:', error.message);
    return 500;
  }
}

// Controllers
export const getAttendance = async (req, res) => {
  try {
    const month = req.query.month;
    const fixedSalary = await getFixedSalary();
    
    // Build query based on month parameter
    let query = {};
    let responseMonth = 'all';
    
    if (month && month !== 'all') {
      query.month = month;
      responseMonth = month;
    }
    // If month is 'all' or not provided, fetch all data (empty query)
    
    const attendanceData = await Attendance.find(query).sort({ 
      month: -1,  // Sort by month descending (most recent first)
      name: 1     // Then by name ascending
    });

    const updatedData = attendanceData.map(record => {
      const effectiveDays = record.workingDays;
      const recalculatedSalary = Math.max(0, effectiveDays * fixedSalary/30);
      return {
        ...record.toObject(),
        fixedSalary,
        salary: recalculatedSalary,
        _originalSalary: record.salary,
        _salaryRecalculated: record.salary !== recalculatedSalary
      };
    });

    res.json({
      message: `Attendance data fetched successfully${responseMonth === 'all' ? ' (all months)' : ` for ${responseMonth}`}`,
      count: updatedData.length,
      month: responseMonth,
      currentFixedSalary: fixedSalary,
      data: updatedData
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Failed to fetch attendance data", error: error.message });
  }
};

export const getMonths = async (req, res) => {
  try {
    const months = await Attendance.distinct("month");
    months.sort((a, b) => b.localeCompare(a));
    res.json({ message: "Available months fetched", months });
  } catch (error) {
    console.error("Fetch months error:", error);
    res.status(500).json({ message: "Failed to fetch available months", error: error.message });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, identifier, month, workingDays, leave, unpaidLeave } = req.body;
    const fixedSalary = await getFixedSalary();

    if (!name || !identifier || !month) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const parsedWorkingDays = parseInt(workingDays) || 0;
    const parsedLeave = parseInt(leave) || 0;
    const parsedUnpaidLeave = parseInt(unpaidLeave) || 0;

    if (parsedWorkingDays < 0 || parsedLeave < 0 || parsedUnpaidLeave < 0) {
      return res.status(400).json({ success: false, message: 'Numeric fields cannot be negative' });
    }

    // Add validation for total days = 30
    const totalDays = parsedWorkingDays + parsedLeave + parsedUnpaidLeave;
    if (totalDays !== 30) {
      return res.status(400).json({ 
        success: false, 
        message: `Total days must equal 30. Current total: ${totalDays} (Working Days: ${parsedWorkingDays} + Leave: ${parsedLeave} + Unpaid Leave: ${parsedUnpaidLeave})` 
      });
    }

    const existing = await Attendance.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Record not found' });

    const duplicate = await Attendance.findOne({
      _id: { $ne: id },
      $or: [{ name, month }, { identifier, month }]
    });

    if (duplicate) {
      return res.status(400).json({ success: false, message: 'Duplicate attendance for this user and month' });
    }

    const workingDayss = workingDays; // Use the working days from Excel directly
    const calculatedSalary = Math.max(0, workingDayss * fixedSalary/30);
    // const calculatedSalary = Math.max(0, workingDayss * fixedSalary);

    const updated = await Attendance.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        identifier: identifier.trim(),
        month,
        workingDays: parsedWorkingDays,
        leave: parsedLeave,
        unpaidLeave: parsedUnpaidLeave,
        fixedSalary,
        salary: calculatedSalary,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Record updated',
      data: updated,
      calculationDetails: {
        workingDays: parsedWorkingDays,
        workingDayss,
        fixedSalary,
        calculatedSalary
      }
    });
  } catch (error) {
    console.error('Update error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: 'Validation error', errors: Object.values(error.errors).map(e => e.message) });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await Attendance.findById(id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });

    await Attendance.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Record deleted', data: record });
  } catch (error) {
    console.error('Delete error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const recalculateByMonth = async (req, res) => {
  try {
    const { month } = req.params;
    const fixedSalary = await getFixedSalary();
    const records = await Attendance.find({ month });

    if (!records.length) return res.status(404).json({ success: false, message: 'No records found for month' });

    const bulkOps = records.map(r => ({
      updateOne: {
        filter: { _id: r._id },
        update: { $set: { fixedSalary, salary: Math.max(0, (r.workingDays - r.unpaidLeave - r.leave) * fixedSalary/30), updatedAt: new Date() } }
      }
    }));

    const result = await Attendance.bulkWrite(bulkOps);
    const updated = await Attendance.find({ month }).sort({ name: 1 });

    res.json({
      success: true,
      message: `Recalculated ${updated.length} records`,
      updatedCount: result.modifiedCount,
      currentFixedSalary: fixedSalary,
      data: updated
    });
  } catch (error) {
    console.error('Recalculate error:', error);
    res.status(500).json({ success: false, message: 'Failed to recalculate salaries', error: error.message });
  }
};

export const recalculateAll = async (req, res) => {
  try {
    const fixedSalary = await getFixedSalary();
    const records = await Attendance.find({});
    if (!records.length) return res.status(404).json({ success: false, message: 'No records found' });

    const bulkOps = records.map(r => ({
      updateOne: {
        filter: { _id: r._id },
        update: { $set: { fixedSalary, salary: Math.max(0, (r.workingDays - r.unpaidLeave - r.leave) * fixedSalary/30), updatedAt: new Date() } }
      }
    }));

    const result = await Attendance.bulkWrite(bulkOps);

    const monthSummary = await Attendance.aggregate([
      { $group: { _id: "$month", count: { $sum: 1 }, totalSalary: { $sum: "$salary" } } },
      { $sort: { _id: -1 } }
    ]);

    res.json({
      success: true,
      message: `Recalculated ${records.length} records`,
      updatedCount: result.modifiedCount,
      currentFixedSalary: fixedSalary,
      totalRecords: records.length,
      monthSummary
    });
  } catch (error) {
    console.error('Recalculate all error:', error);
    res.status(500).json({ success: false, message: 'Failed to recalculate all salaries', error: error.message });
  }
};

export const importAttendance = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const month = req.body.month || getCurrentMonth();
    const fixedSalary = await getFixedSalary();

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const headers = rawData[0].map((h) => h.toLowerCase().trim());
    const dataRows = rawData.slice(1);

    const users = await User.find({}, { identifier: 1, name: 1 });
    const userMap = new Map();

    users.forEach(user => {
      if (user.name && user.identifier) {
        const normalizedName = normalizeText(user.name);
        const normalizedId = normalizeText(user.identifier);
        userMap.set(`${normalizedName}_${normalizedId}`, user);
      }
    });

    const data = [];
    const matchingResults = [];
    const mismatches = [];
    const validationErrors = []; // New array to track validation errors

    for (let rowIndex = 0; rowIndex < dataRows.length; rowIndex++) {
      const row = dataRows[rowIndex];
      const rowObj = {};
      headers.forEach((key, index) => {
        rowObj[key] = row[index];
      });

      const excelName = normalizeText(rowObj["name"]);
      const excelIdentifier = normalizeText(rowObj["identifier"]);
      const workingDay = Number(rowObj["working days"]) || 0;
      const leave = Number(rowObj["leave"]) || 0;
      const unpaidLeave = Number(rowObj["unpaid leave"]) || 0;

      // Validation: Check if total days equal 30
      const totalDays = workingDay + leave + unpaidLeave;
      if (totalDays !== 30) {
        validationErrors.push({
          row: rowIndex + 2, // +2 because we start from row 1 and skip header
          name: rowObj["name"] || "Unknown",
          identifier: rowObj["identifier"] || "Unknown",
          workingDays: workingDay,
          leave: leave,
          unpaidLeave: unpaidLeave,
          totalDays: totalDays,
          message: `Total days must equal 30. Current total: ${totalDays} (Working Days: ${workingDay} + Leave: ${leave} + Unpaid Leave: ${unpaidLeave})`
        });
        continue; // Skip this row and continue with validation of other rows
      }

      let user = null;
      let matchType = "";

      if (excelName && excelIdentifier) {
        user = userMap.get(`${excelName}_${excelIdentifier}`);
        if (user) {
          matchType = "exact_match";
        } else {
          const idMatches = users.filter(u => normalizeText(u.identifier) === excelIdentifier);
          if (idMatches.length > 0) {
            matchType = "name_mismatch";
            mismatches.push({
              excelName: rowObj["name"] || "",
              excelIdentifier: rowObj["identifier"] || "",
              dbName: idMatches[0].name,
              dbIdentifier: idMatches[0].identifier,
              matchType
            });
          } else {
            const nameMatches = users.filter(u => normalizeText(u.name) === excelName);
            if (nameMatches.length > 0) {
              matchType = "identifier_mismatch";
              mismatches.push({
                excelName: rowObj["name"] || "",
                excelIdentifier: rowObj["identifier"] || "",
                dbName: nameMatches[0].name,
                dbIdentifier: nameMatches[0].identifier,
                matchType
              });
            } else {
              matchType = "not_found";
            }
          }
        }
      } else {
        matchType = "missing_data";
      }

      const matchResult = {
        excelName: rowObj["name"] || "",
        excelIdentifier: rowObj["identifier"] || "",
        matchType,
        found: matchType === "exact_match"
      };

      if (user) {
        matchResult.dbName = user.name;
        matchResult.dbIdentifier = user.identifier;
      }

      matchingResults.push(matchResult);

      if (!user) continue;

      const workingDays = workingDay; // Use the working days from Excel directly
      const salary = Math.max(0, workingDays * fixedSalary/30);

      data.push({
        month,
        name: user.name,
        identifier: user.identifier,
        workingDays,
        leave,
        unpaidLeave,
        fixedSalary,
        salary,
      });
    }

    // Check for validation errors first
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: `Import failed: Found ${validationErrors.length} validation error(s). Total days (Working Days + Leave + Unpaid Leave) must equal 30 for all rows.`,
        validationErrors,
        details: validationErrors.map(err => `Row ${err.row}: ${err.name} (${err.identifier}) - ${err.message}`).join('; ')
      });
    }

    if (mismatches.length > 0) {
      return res.status(400).json({ 
        message: `Import failed: Found ${mismatches.length} mismatched user(s). Please correct and try again.`,
        mismatches,
        matchingResults
      });
    }

    const cleanedData = data.filter(
      (item) => item.name && item.identifier && typeof item.salary === "number" && item.salary >= 0
    );

    if (cleanedData.length === 0) {
      const notFoundCount = matchingResults.filter(r => r.matchType === "not_found").length;
      const missingDataCount = matchingResults.filter(r => r.matchType === "missing_data").length;

      let errorMessage = "No valid data to import. ";
      if (notFoundCount > 0) errorMessage += `${notFoundCount} users not found. `;
      if (missingDataCount > 0) errorMessage += `${missingDataCount} rows missing required fields.`;

      return res.status(400).json({ 
        message: errorMessage,
        matchingResults
      });
    }

    const bulkOps = cleanedData.map(item => ({
      updateOne: {
        filter: { month: item.month, identifier: item.identifier },
        update: {
          $set: {
            ...item
          }
        },
        upsert: true
      }
    }));

    await Attendance.bulkWrite(bulkOps);

    const exactMatches = matchingResults.filter(r => r.matchType === "exact_match").length;
    const notFound = matchingResults.filter(r => r.matchType === "not_found").length;
    const missingData = matchingResults.filter(r => r.matchType === "missing_data").length;

    let responseMessage = `Successfully imported attendance for ${bulkOps.length} users for ${month}. `;
    responseMessage += `Matches: ${exactMatches} exact`;
    if (notFound) responseMessage += `, ${notFound} not found`;
    if (missingData) responseMessage += `, ${missingData} missing data`;

    res.json({
      message: responseMessage,
      count: bulkOps.length,
      month,
      data: cleanedData,
      matchingResults,
      summary: {
        total: matchingResults.length,
        exactMatches,
        notFound,
        missingData
      }
    });

  } catch (error) {
    console.error("Import error:", error);
    res.status(500).json({
      message: "Failed to import attendance data",
      error: error.message
    });
  }
};