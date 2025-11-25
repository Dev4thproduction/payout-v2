import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Save, Edit3, AlertCircle, CheckCircle } from 'lucide-react';
import {
  fetchFixedAmount,
  updateFixedAmount,
  setIsEditing,
  setNewAmount,
} from '../actions/fixedPriceActions';

const FixedPrice = () => {
  const dispatch = useDispatch();
  const {
    currentAmount,
    newAmount,
    isEditing,
    loading,
    message,
    messageType,
  } = useSelector((state) => state.fixedPrice);

  useEffect(() => {
    dispatch(fetchFixedAmount());
  }, [dispatch]);

  const handleSave = () => {
    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount < 0) {
      alert('Please enter a valid positive number');
      return;
    }
    dispatch(updateFixedAmount(amount));
  };

  const handleCancel = () => {
    dispatch(setIsEditing(false));
    dispatch(setNewAmount(currentAmount ? currentAmount.toString() : ''));
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Fixed Price Management</h2>
      </div>

      {/* ✅ Message Display */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
            messageType === 'success'
              ? 'bg-green-100 text-green-700 border border-green-200'
              : messageType === 'error'
              ? 'bg-red-100 text-red-700 border border-red-200'
              : 'bg-blue-100 text-blue-700 border border-blue-200'
          }`}
        >
          {messageType === 'success' && <CheckCircle className="w-4 h-4" />}
          {messageType === 'error' && <AlertCircle className="w-4 h-4" />}
          <span className="text-sm">{message}</span>
        </div>
      )}

      {/* ✅ Current Amount Display */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Fixed Amount
        </label>
        <div className="bg-gray-50 rounded-lg p-4 border">
          {loading && !isEditing ? (
            <div className="animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-24"></div>
            </div>
          ) : currentAmount !== null ? (
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-800">
                {currentAmount.toFixed(2)}
              </span>
              {!isEditing && (
                <button
                  onClick={() => dispatch(setIsEditing(true))}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Edit amount"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <span className="text-gray-500 italic">No fixed amount set</span>
          )}
        </div>
      </div>

      {/* ✅ Edit Form */}
      {isEditing && (
        <div className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              New Amount
            </label>
            <input
              type="number"
              id="amount"
              value={newAmount}
              onChange={(e) => dispatch(setNewAmount(e.target.value))}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ✅ Set Initial Amount Button */}
      {!isEditing && currentAmount === null && !loading && (
        <button
          onClick={() => dispatch(setIsEditing(true))}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
        >
          Set Fixed Amount
        </button>
      )}
    </div>
  );
};

export default FixedPrice;
