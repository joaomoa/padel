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