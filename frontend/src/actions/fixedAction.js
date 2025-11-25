import {
  FIXED_FETCH_REQUEST,
  FIXED_FETCH_SUCCESS,
  FIXED_FETCH_FAIL,
  FIXED_DELETE_SUCCESS,
  FIXED_UPDATE_SUCCESS,
  FIXED_UPLOAD_REQUEST,
  FIXED_UPLOAD_SUCCESS,
  FIXED_UPLOAD_FAIL,
} from "../constants/fixedConstant";

const baseUrl = process.env.REACT_APP_API_URL;

export const fetchFIXED = (month) => async (dispatch) => {
  dispatch({ type: FIXED_FETCH_REQUEST });
  try {
    // Build URL based on month parameter
    let url = `${baseUrl}/attendance`;
    
    // Only add month parameter if it's provided and not 'all'
    if (month && month !== 'all') {
      url += `?month=${month}`;
    } else {
      // For 'all' or undefined, don't add month parameter to fetch all data
      url += `?month=all`;
    }
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (!response.ok) throw new Error(result.message || "Fetch failed");
    dispatch({ type: FIXED_FETCH_SUCCESS, payload: result.data });
  } catch (error) {
    dispatch({ type: FIXED_FETCH_FAIL, payload: error.message });
  }
};

export const deleteFIXED = (id) => async (dispatch) => {
  const res = await fetch(`${baseUrl}/attendance/${id}`, { method: "DELETE" });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Delete failed");
  dispatch({ type: FIXED_DELETE_SUCCESS, payload: id });
};

export const updateFIXED = (updatedItem) => async (dispatch) => {
  const res = await fetch(`${baseUrl}/attendance/${updatedItem._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedItem),
  });

  const result = await res.json();
  if (!res.ok) {
    // Throw the specific error message from the server for validation errors
    throw new Error(result.message || "Update failed");
  }
  dispatch({ type: FIXED_UPDATE_SUCCESS, payload: result.data });
};

export const uploadFIXED = (file, month) => async (dispatch) => {
  dispatch({ type: FIXED_UPLOAD_REQUEST });

  const formData = new FormData();
  formData.append("file", file);
  formData.append("month", month);

  try {
    const res = await fetch(`${baseUrl}/attendance/import`, {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (!res.ok) {
      // Create a more detailed error message for validation errors
      let errorMessage = result.message || "Upload failed";
      
      // If there are validation errors, include them in the error message
      if (result.validationErrors && result.validationErrors.length > 0) {
        const errorDetails = result.validationErrors
          .slice(0, 3) // Show only first 3 errors to avoid overwhelming the user
          .map(err => `Row ${err.row}: ${err.name} (Total: ${err.totalDays})`)
          .join(', ');
        
        errorMessage = `${errorMessage}\n\nValidation Errors:\n${errorDetails}`;
        
        if (result.validationErrors.length > 3) {
          errorMessage += `\n... and ${result.validationErrors.length - 3} more errors`;
        }
      }
      
      // If there are mismatches, include them too
      if (result.mismatches && result.mismatches.length > 0) {
        const mismatchDetails = result.mismatches
          .slice(0, 2)
          .map(m => `${m.excelName} (${m.matchType})`)
          .join(', ');
        
        errorMessage += `\n\nUser Mismatches:\n${mismatchDetails}`;
        
        if (result.mismatches.length > 2) {
          errorMessage += `\n... and ${result.mismatches.length - 2} more mismatches`;
        }
      }
      
      throw new Error(errorMessage);
    }

    dispatch({
      type: FIXED_UPLOAD_SUCCESS,
      payload: { updatedData: result.data || [] },
    });
  } catch (error) {
    dispatch({ type: FIXED_UPLOAD_FAIL, payload: error.message });
    throw error; // Re-throw to allow the component to handle it
  }
};