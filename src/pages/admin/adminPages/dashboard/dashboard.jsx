import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard, processTrainerStats } from '../../adminSlice/adminSliceDashboard';

const Dashboard = () => {
  const dispatch = useDispatch();
  
  const { data: dashboardData, status: dashboardStatus, error: dashboardError } = useSelector(state => state.admin);
  const { status: trainerStatus, error: trainerError, data: trainerData } = useSelector(state => state.admin);

  useEffect(() => {
    // Fetch initial dashboard data on mount
    dispatch(fetchDashboard('trainer stats'));
  }, [dispatch]);

  const handleProcessData = async () => {
    dispatch(processTrainerStats());
  };

  // Handle loading states
  if (dashboardStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-700">Loading dashboard...</div>
      </div>
    );
  }

  // Handle error states
  if (dashboardStatus === 'failed') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-red-600">
        <p>{dashboardError || 'Failed to load dashboard data.'}</p>
      </div>
    );
  }

  // If there's no data yet, don't render the dashboard
  if (!dashboardData) {
    return null;
  }

  if (dashboardStatus !== 'succeeded' || !dashboardData || !Array.isArray(dashboardData.data)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-700">
          {dashboardStatus === 'loading' ? 'Loading...' : 'No valid data.'}
        </div>
      </div>
    );
  }
  

  const total = dashboardData.data.reduce((acc, curr) => acc + Number(curr.totalSessions), 0);
  const completed = dashboardData.data.reduce((acc, curr) => acc + Number(curr.completedSessions), 0);
  const notCompleted = dashboardData.data.reduce((acc, curr) => acc + Number(curr.notCompletedSessions), 0);
  const completionRate = total === 0 ? 0 : ((completed / total) * 100).toFixed(2);
  const notCompletionRate = total === 0 ? 0 : ((notCompleted / total) * 100).toFixed(2);

  return (
    <div className="lg:ml-[4rem] min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header & Process Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{dashboardData.dashboard_name}</h1>
            {/* <p className="text-gray-500">Created on {new Date(dashboardData.created_at).toLocaleDateString()}</p> */}
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={handleProcessData}
              disabled={trainerStatus === 'loading'}
              className={`flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ${
                trainerStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {trainerStatus === 'loading' && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              )}
              {trainerStatus === 'loading' ? 'Processing...' : 'Process Data'}
            </button>
            {trainerStatus === 'succeeded' && trainerData && (
              <div className="mt-2 text-green-600">
                Data processed successfully!
              </div>
            )}
            {trainerStatus === 'failed' && (
              <div className="mt-2 text-red-600">
                {trainerError || 'An error occurred while processing data.'}
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.569a9 9 0 10-15.856 0" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-700">Total Sessions</h3>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-700">Completed Sessions</h3>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {completed} ({completionRate}%)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-700">Not Completed Sessions</h3>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {notCompleted} ({notCompletionRate}%)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Batch Statistics */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Batch Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trainer</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sessions</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Not Completed</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.data.map((batch, index) => {
                  const t = Number(batch.totalSessions);
                  const c = Number(batch.completedSessions);
                  const nc = Number(batch.notCompletedSessions);
                  const cr = t === 0 ? 0 : ((c / t) * 100).toFixed(2);
                  const ncr = t === 0 ? 0 : ((nc / t) * 100).toFixed(2);

                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{batch.batch_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{batch.profileName || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{batch.totalSessions}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-center">
                        {batch.completedSessions} ({cr}%)
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${cr}%` }}></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-center">
                        {batch.notCompletedSessions} ({ncr}%)
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-600 h-2 rounded-full" style={{ width: `${ncr}%` }}></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                        <div className="flex items-center justify-center">
                          <span className="mr-2">{cr}%</span>
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${cr}%` }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
