import { useEffect } from 'react';
import Chart from 'chart.js/auto';

const PerformanceChart = ({ data, selectedPlayer, minDate, maxDate, setMinDate, setMaxDate }) => {
  // Calculate statistics
  const ratings = data.map((entry) => entry.rating);
  const minRating = ratings.length > 0 ? Math.min(...ratings) : 'N/A';
  const maxRating = ratings.length > 0 ? Math.max(...ratings) : 'N/A';
  const avgRating = ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(2) : 'N/A';

  // Calculate default min and max dates from data
  const dates = data.map((entry) => entry.date);
  const defaultMinDate = dates.length > 0 ? Math.min(...dates.map((d) => new Date(d))) : '';
  const defaultMaxDate = dates.length > 0 ? Math.max(...dates.map((d) => new Date(d))) : '';

  // Helper functions for date ranges
  const getThisWeekRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Days to subtract to get Monday
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - daysToMonday);
    startOfWeek.setHours(0, 0, 0, 0);
    return {
      min: startOfWeek.toISOString().split('T')[0],
      max: today.toISOString().split('T')[0],
    };
  };

  const getThisMonthRange = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      min: startOfMonth.toISOString().split('T')[0],
      max: today.toISOString().split('T')[0],
    };
  };

  const getThisYearRange = () => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    return {
      min: startOfYear.toISOString().split('T')[0],
      max: today.toISOString().split('T')[0],
    };
  };

  // Button click handlers
  const handleThisWeek = () => {
    const { min, max } = getThisWeekRange();
    setMinDate(min);
    setMaxDate(max);
  };

  const handleThisMonth = () => {
    const { min, max } = getThisMonthRange();
    setMinDate(min);
    setMaxDate(max);
  };

  const handleThisYear = () => {
    const { min, max } = getThisYearRange();
    setMinDate(min);
    setMaxDate(max);
  };

  useEffect(() => {
    if (data.length === 0) return;

    const canvas = document.getElementById('performanceChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((entry) => entry.date),
        datasets: [
          {
            label: `Practice Rating (${selectedPlayer || 'No Player'})`,
            data: data.map((entry) => entry.rating),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        scales: {
          y: {
            min: 1,
            max: 5,
            ticks: { stepSize: 1 },
            title: { display: true, text: 'Rating' },
          },
          x: {
            title: { display: true, text: 'Date' },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [data, selectedPlayer]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-12">
      <h2 className="text-xl font-semibold mb-4">Performance Over Time</h2>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-4">
        <div className="flex items-center space-x-4">
          <label className="font-medium">From:</label>
          <input
            type="date"
            value={minDate || (defaultMinDate && new Date(defaultMinDate).toISOString().split('T')[0])}
            onChange={(e) => setMinDate(e.target.value)}
            className="border rounded p-2 w-full sm:w-auto"
          />
        </div>
        <div className="flex items-center space-x-4">
          <label className="font-medium">To:</label>
          <input
            type="date"
            value={maxDate || (defaultMaxDate && new Date(defaultMaxDate).toISOString().split('T')[0])}
            onChange={(e) => setMaxDate(e.target.value)}
            className="border rounded p-2 w-full sm:w-auto"
          />
        </div>
      </div>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 mb-4">
        <button
          onClick={handleThisWeek}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          This Week
        </button>
        <button
          onClick={handleThisMonth}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          This Month
        </button>
        <button
          onClick={handleThisYear}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          This Year
        </button>
      </div>
      {data.length > 0 ? (
        <>
          <canvas id="performanceChart"></canvas>
          <div className="mt-4">
            <p>
              <strong>Min Rating:</strong> {minRating}
            </p>
            <p>
              <strong>Max Rating:</strong> {maxRating}
            </p>
            <p>
              <strong>Avg Rating:</strong> {avgRating}
            </p>
          </div>
        </>
      ) : (
        <p className="text-gray-500">No data available for {selectedPlayer || 'selected player'}.</p>
      )}
    </div>
  );
};

export default PerformanceChart;