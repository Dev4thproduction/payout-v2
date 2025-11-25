import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import { Calendar, TrendingUp, Target, Award, Users, Loader, FileText, MapPin, Clock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllReportData,
  changeAttendancePage,
  changeVerificationPage,
  updateSelectedMonth,
  clearReportErrors
} from '../actions/employeeReportsActions';

const EmployeeReports = () => {
  const dispatch = useDispatch();
  const {
    selectedMonth,
    attendance,
    verifications,
    plannedCollections,
    receivedCollections,
    distributions,
    attendanceLoading,
    verificationsLoading,
    plannedCollectionsLoading,
    receivedCollectionsLoading,
    distributionsLoading,
    reportDataLoading,
    attendanceError,
    verificationsError,
    plannedCollectionsError,
    receivedCollectionsError,
    distributionsError,
    error,
    paginationData
  } = useSelector(state => state.employeeReports);

  const [itemsPerPage] = useState(10);

  // Generate available months (All Months + current month + last 4 months)
  const getAvailableMonths = () => {
    const months = [];
    
    // Add "All Months" option first
    months.push({ value: "all", label: "All Months" });
    
    const currentDate = new Date();
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthValue = date.toISOString().slice(0, 7); // YYYY-MM format
      const monthLabel = date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
      months.push({ value: monthValue, label: monthLabel });
    }
    
    return months;
  };

  const availableMonths = getAvailableMonths();

  // Fetch data when component mounts and when selected month changes
  useEffect(() => {
    dispatch(fetchAllReportData(
      selectedMonth, 
      paginationData.attendance.currentPage, 
      paginationData.verifications.currentPage, 
      itemsPerPage
    ));
  }, [selectedMonth, dispatch]);

  // Handle month change
  const handleMonthChange = (month) => {
    dispatch(updateSelectedMonth(month));
    dispatch(clearReportErrors());
  };

  // Handle attendance page change
  const handleAttendancePageChange = (page) => {
    dispatch(changeAttendancePage(selectedMonth, page, itemsPerPage));
  };

  // Handle verification page change
  const handleVerificationPageChange = (page) => {
    dispatch(changeVerificationPage(selectedMonth, page, itemsPerPage));
  };

  // Helper function to check if date matches selected month
  const isDateInSelectedMonth = (dateStr) => {
    if (!dateStr) return false;
    
    // If "all" is selected, include all dates
    if (selectedMonth === "all") return true;
    
    const date = new Date(dateStr);
    const selectedDate = new Date(selectedMonth + '-01');
    return date.getFullYear() === selectedDate.getFullYear() && 
           date.getMonth() === selectedDate.getMonth();
  };

  // Process data for reports
  const processReportData = () => {
    if (!attendance?.data || !verifications?.data) {
      return null;
    }

    const attendanceData = attendance.data || [];
    const verificationData = verifications.data || [];

    // Check if we have any data for the selected month
    if (attendanceData.length === 0 && verificationData.length === 0) {
      return { noData: true };
    }

    // 1. PLANNED VS ACTUAL COLLECTION REPORT
    let plannedData = [];
    let receivedData = [];

    // Extract planned collections data and filter by month
    if (Array.isArray(plannedCollections)) {
      plannedData = plannedCollections.filter(item => 
        isDateInSelectedMonth(item.date) || isDateInSelectedMonth(item.createdAt) || isDateInSelectedMonth(item.updatedAt)
      );
    } else if (plannedCollections?.data && Array.isArray(plannedCollections.data)) {
      plannedData = plannedCollections.data.filter(item => 
        isDateInSelectedMonth(item.date) || isDateInSelectedMonth(item.createdAt) || isDateInSelectedMonth(item.updatedAt)
      );
    }

    // Extract received collections data and filter by month
    if (Array.isArray(receivedCollections)) {
      receivedData = receivedCollections.filter(item => 
        isDateInSelectedMonth(item.date) || isDateInSelectedMonth(item.createdAt) || isDateInSelectedMonth(item.updatedAt)
      );
    } else if (receivedCollections?.data && Array.isArray(receivedCollections.data)) {
      receivedData = receivedCollections.data.filter(item => 
        isDateInSelectedMonth(item.date) || isDateInSelectedMonth(item.createdAt) || isDateInSelectedMonth(item.updatedAt)
      );
    }

    // Group planned data by product
    const plannedByProduct = {};
    
    // Process planned collections
    plannedData.forEach((item, index) => {
      const product = item.product || 'Unknown Product';
      const moneyCollection = parseFloat(item.moneyCollection) || 0;
      const numCases = parseInt(item.numCases) || 0;
      
      if (!plannedByProduct[product]) {
        plannedByProduct[product] = {
          product,
          plannedCases: 0,
          plannedMoney: 0,
          receivedCases: 0,
          receivedMoney: 0,
          plannedCount: 0,
          receivedCount: 0
        };
      }
      
      plannedByProduct[product].plannedMoney += moneyCollection;
      plannedByProduct[product].plannedCases += numCases;
      plannedByProduct[product].plannedCount += 1;
    });

    // Process received data
    receivedData.forEach((item, index) => {
      const product = item.process || 'Unknown Product'; // Using 'process' field from received API
      const total = parseFloat(item.total) || 0;
      
      if (plannedByProduct[product]) {
        plannedByProduct[product].receivedMoney += total;
        plannedByProduct[product].receivedCount += 1;
      } else {
        plannedByProduct[product] = {
          product,
          plannedCases: 0,
          plannedMoney: 0,
          receivedCases: 0,
          receivedMoney: total,
          plannedCount: 0,
          receivedCount: 1
        };
      }
    });

    // Calculate averages and totals
    const collectionReport = Object.values(plannedByProduct).map(item => ({
      ...item,
      avgPlannedMoney: item.plannedCount > 0 ? item.plannedMoney / item.plannedCount : 0,
      avgReceivedMoney: item.receivedCount > 0 ? item.receivedMoney / item.receivedCount : 0,
      totalPlannedMoney: item.plannedMoney,
      totalReceivedMoney: item.receivedMoney
    }));

    // Filter out empty entries
    const filteredCollectionReport = collectionReport.filter(item => 
      item.plannedMoney > 0 || item.receivedMoney > 0
    );

    // 2. ATTENDANCE & SALARY REPORT (use current page data)
    const attendanceReport = attendanceData.map(emp => ({
      name: emp.name,
      identifier: emp.identifier,
      workingDays: emp.workingDays,
      leave: emp.leave,
      unpaidLeave: emp.unpaidLeave,
      fixedSalary: emp.fixedSalary,
      totalSalary: emp.salary,
      salaryRecalculated: emp._salaryRecalculated
    }));

    // For summary, we need to calculate from all data (not just current page)
    const totalWorkingDays = attendanceData.reduce((sum, emp) => sum + (emp.workingDays || 0), 0);
    const totalLeaves = attendanceData.reduce((sum, emp) => sum + (emp.leave || 0), 0);
    const totalUnpaidLeaves = attendanceData.reduce((sum, emp) => sum + (emp.unpaidLeave || 0), 0);
    const totalSalary = attendanceData.reduce((sum, emp) => sum + (emp.salary || 0), 0);

    // 3. VERIFICATION PERFORMANCE REPORT
    const locationPerformance = {};
    verificationData.forEach(verification => {
      const location = verification.verification?.location || verification.location || 'Unknown';
      const cases = verification.numCases || verification.cases || 0;
      
      if (!locationPerformance[location]) {
        locationPerformance[location] = {
          location,
          totalCases: 0,
          totalVerifications: 0,
          employees: new Set()
        };
      }
      
      locationPerformance[location].totalCases += cases;
      locationPerformance[location].totalVerifications += 1;
      locationPerformance[location].employees.add(verification.name);
    });

    // Calculate averages
    const verificationReport = Object.values(locationPerformance).map(item => ({
      location: item.location,
      totalCases: item.totalCases,
      totalVerifications: item.totalVerifications,
      avgCasesPerVerification: item.totalVerifications > 0 ? (item.totalCases / item.totalVerifications).toFixed(1) : 0,
      uniqueEmployees: item.employees.size
    }));

    // Employee-wise verification performance
    const employeePerformance = {};
    verificationData.forEach(verification => {
      const name = verification.name;
      const location = verification.verification?.location || verification.location || 'Unknown';
      const cases = verification.numCases || verification.cases || 0;
      
      if (!employeePerformance[name]) {
        employeePerformance[name] = {
          name,
          totalCases: 0,
          cityCases: 0,
          deepGeographyCases: 0,
          verifications: 0
        };
      }
      
      employeePerformance[name].totalCases += cases;
      employeePerformance[name].verifications += 1;
      
      if (location.toLowerCase().includes('city')) {
        employeePerformance[name].cityCases += cases;
      } else if (location.toLowerCase().includes('deep')) {
        employeePerformance[name].deepGeographyCases += cases;
      }
    });

    const employeeVerificationReport = Object.values(employeePerformance);

    return {
      collectionReport: filteredCollectionReport,
      attendanceReport,
      verificationReport,
      employeeVerificationReport,
      summary: {
        totalWorkingDays,
        totalLeaves,
        totalUnpaidLeaves,
        totalSalary,
        totalEmployees: paginationData.attendance.totalItems,
        totalVerifications: paginationData.verifications.totalItems
      }
    };
  };

  const reportData = processReportData();
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

  // Get display text for selected period
  const getSelectedPeriodText = () => {
    if (selectedMonth === "all") {
      return "All Months";
    }
    return new Date(selectedMonth + '-01').toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Pagination component
  const Pagination = ({ currentPage, totalPages, totalItems, onPageChange, itemType }) => {
    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) pages.push(i);
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
          pages.push('...');
          pages.push(totalPages);
        }
      }
      
      return pages;
    };

    const startItem = ((currentPage - 1) * itemsPerPage) + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startItem}</span> to{' '}
              <span className="font-medium">{endItem}</span> of{' '}
              <span className="font-medium">{totalItems}</span> {itemType}
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && onPageChange(page)}
                  disabled={page === '...'}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : page === '...'
                      ? 'border-gray-300 bg-white text-gray-700 cursor-default'
                      : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  if (reportDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading report data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600 font-medium">Error: {error}</p>
            <button 
              onClick={() => dispatch(fetchAllReportData(
                selectedMonth, 
                paginationData.attendance.currentPage, 
                paginationData.verifications.currentPage, 
                itemsPerPage
              ))}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FileText className="h-8 w-8 mr-3 text-blue-600" />
              Employee Performance Reports
            </h1>
            <div className="text-gray-500">
              <Calendar className="inline h-5 w-5 mr-2" />
              Report Period: {getSelectedPeriodText()}
            </div>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Month</label>
              <select 
                value={selectedMonth}
                onChange={(e) => handleMonthChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[200px]"
              >
                {availableMonths.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Check if we have data, if not show simple message */}
        {!reportData || reportData.noData ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data Available</h3>
            <p className="text-gray-500">
              No employee data found for {getSelectedPeriodText()}
            </p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Employees</p>
                    <p className="text-2xl font-bold text-blue-600">{reportData.summary.totalEmployees}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Working Days</p>
                    <p className="text-2xl font-bold text-green-600">{reportData.summary.totalWorkingDays}</p>
                  </div>
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Verifications</p>
                    <p className="text-2xl font-bold text-purple-600">{reportData.summary.totalVerifications}</p>
                  </div>
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Salary</p>
                    <p className="text-2xl font-bold text-orange-600">₹{reportData.summary.totalSalary.toLocaleString()}</p>
                  </div>
                  <Award className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* 1. PLANNED VS ACTUAL COLLECTION REPORT */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="h-6 w-6 mr-2 text-blue-600" />
                1. Planned vs Actual Collection Report
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Average Money Collection Comparison */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Average Money Collection: Planned vs Actual</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportData.collectionReport}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="product" angle={-45} textAnchor="end" height={80} />
                      <YAxis tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="avgPlannedMoney" fill="#F59E0B" name="Avg Planned Collection" />
                      <Bar dataKey="avgReceivedMoney" fill="#EF4444" name="Avg Actual Collection" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Total Money Collection Comparison */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Total Money Collection: Planned vs Actual</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportData.collectionReport}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="product" angle={-45} textAnchor="end" height={80} />
                      <YAxis tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="totalPlannedMoney" fill="#3B82F6" name="Total Planned Collection" />
                      <Bar dataKey="totalReceivedMoney" fill="#10B981" name="Total Actual Collection" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Money Collection Summary</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 border-b text-left">Product</th>
                        <th className="px-4 py-2 border-b text-right">Avg Planned Money</th>
                        <th className="px-4 py-2 border-b text-right">Avg Actual Money</th>
                        <th className="px-4 py-2 border-b text-right">Total Planned Money</th>
                        <th className="px-4 py-2 border-b text-right">Total Actual Money</th>
                        <th className="px-4 py-2 border-b text-right">Achievement %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.collectionReport.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border-b font-medium">{item.product}</td>
                          <td className="px-4 py-2 border-b text-right">₹{(item.avgPlannedMoney || 0).toLocaleString()}</td>
                          <td className="px-4 py-2 border-b text-right">₹{(item.avgReceivedMoney || 0).toLocaleString()}</td>
                          <td className="px-4 py-2 border-b text-right">₹{(item.totalPlannedMoney || 0).toLocaleString()}</td>
                          <td className="px-4 py-2 border-b text-right">₹{(item.totalReceivedMoney || 0).toLocaleString()}</td>
                          <td className="px-4 py-2 border-b text-right">
                            <span className={`font-semibold ${
                              (item.totalPlannedMoney || 0) > 0 ? 
                                (((item.totalReceivedMoney || 0) / (item.totalPlannedMoney || 1)) * 100) >= 100 ? 'text-green-600' : 'text-red-600'
                                : 'text-gray-600'
                            }`}>
                              {(item.totalPlannedMoney || 0) > 0 ? `${(((item.totalReceivedMoney || 0) / (item.totalPlannedMoney || 1)) * 100).toFixed(1)}%` : 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 2. ATTENDANCE & SALARY REPORT */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="h-6 w-6 mr-2 text-green-600" />
                2. Attendance & Salary Report
              </h2>
              
              {/* Centered Attendance Overview */}
              <div className="flex justify-center mb-6">
                <div className="w-full max-w-2xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Overall Attendance</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Working Days', value: reportData.summary.totalWorkingDays, fill: '#10B981' },
                          { name: 'Paid Leaves', value: reportData.summary.totalLeaves, fill: '#F59E0B' },
                          { name: 'Unpaid Leaves', value: reportData.summary.totalUnpaidLeaves, fill: '#EF4444' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, percent }) => `${name}: ${value}`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[0, 1, 2].map((index) => (
                          <Cell key={`cell-${index}`} fill={['#10B981', '#F59E0B', '#EF4444'][index]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [value, name]}
                        labelFormatter={(label) => ''}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Attendance Detail Table with Backend Pagination */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Employee Attendance Details</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 border-b text-left">Employee</th>
                        <th className="px-4 py-2 border-b text-right">Working Days</th>
                        <th className="px-4 py-2 border-b text-right">Paid Leaves</th>
                        <th className="px-4 py-2 border-b text-right">Unpaid Leaves</th>
                        <th className="px-4 py-2 border-b text-right">Fixed Salary</th>
                        <th className="px-4 py-2 border-b text-right">Total Salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.attendanceReport.map((emp, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border-b font-medium">{emp.name} ({emp.identifier})</td>
                          <td className="px-4 py-2 border-b text-right">{emp.workingDays}</td>
                          <td className="px-4 py-2 border-b text-right">{emp.leave}</td>
                          <td className="px-4 py-2 border-b text-right text-red-600">{emp.unpaidLeave}</td>
                          <td className="px-4 py-2 border-b text-right">₹{emp.fixedSalary.toLocaleString()}</td>
                          <td className="px-4 py-2 border-b text-right font-semibold">₹{emp.totalSalary.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Pagination 
                    currentPage={paginationData.attendance.currentPage}
                    totalPages={paginationData.attendance.totalPages}
                    totalItems={paginationData.attendance.totalItems}
                    onPageChange={handleAttendancePageChange}
                    itemType="employees"
                  />
                </div>
              </div>
            </div>

            {/* 3. VERIFICATION PERFORMANCE REPORT */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MapPin className="h-6 w-6 mr-2 text-purple-600" />
                3. Verification Performance Report
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Average Cases per Location */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Avg Cases per Location Type</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportData.verificationReport}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="location" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="avgCasesPerVerification" fill="#8B5CF6" name="Avg Cases per Verification" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Total Cases by Location */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Total Cases by Location Type</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={reportData.verificationReport}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="totalCases"
                        label={({ location, totalCases }) => `${location}: ${totalCases}`}
                      >
                        {reportData.verificationReport.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} cases`, 'Total Cases']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Verification Performance Table */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Location Performance Summary</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 border-b text-left">Location Type</th>
                        <th className="px-4 py-2 border-b text-right">Total Cases</th>
                        <th className="px-4 py-2 border-b text-right">Total Verifications</th>
                        <th className="px-4 py-2 border-b text-right">Avg Cases/Verification</th>
                        <th className="px-4 py-2 border-b text-right">Unique Employees</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.verificationReport.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border-b font-medium">{item.location}</td>
                          <td className="px-4 py-2 border-b text-right">{item.totalCases}</td>
                          <td className="px-4 py-2 border-b text-right">{item.totalVerifications}</td>
                          <td className="px-4 py-2 border-b text-right font-semibold text-purple-600">{item.avgCasesPerVerification}</td>
                          <td className="px-4 py-2 border-b text-right">{item.uniqueEmployees}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Employee Verification Performance with Backend Pagination */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Employee Verification Performance</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 border-b text-left">Employee</th>
                        <th className="px-4 py-2 border-b text-right">Total Cases</th>
                        <th className="px-4 py-2 border-b text-right">City Cases</th>
                        <th className="px-4 py-2 border-b text-right">Deep Geography Cases</th>
                        <th className="px-4 py-2 border-b text-right">Total Verifications</th>
                        <th className="px-4 py-2 border-b text-right">Avg Cases/Verification</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.employeeVerificationReport.map((emp, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border-b font-medium">{emp.name}</td>
                          <td className="px-4 py-2 border-b text-right font-semibold">{emp.totalCases}</td>
                          <td className="px-4 py-2 border-b text-right text-blue-600">{emp.cityCases || 0}</td>
                          <td className="px-4 py-2 border-b text-right text-green-600">{emp.deepGeographyCases}</td>
                          <td className="px-4 py-2 border-b text-right">{emp.verifications}</td>
                          <td className="px-4 py-2 border-b text-right font-semibold text-purple-600">
                            {emp.verifications > 0 ? (emp.totalCases / emp.verifications).toFixed(1) : '0'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Pagination 
                    currentPage={paginationData.verifications.currentPage}
                    totalPages={paginationData.verifications.totalPages}
                    totalItems={paginationData.verifications.totalItems}
                    onPageChange={handleVerificationPageChange}
                    itemType="verifications"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeReports;