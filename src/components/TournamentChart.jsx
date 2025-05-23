import { useEffect } from 'react';
import Chart from 'chart.js/auto';

const TournamentChart = ({ data, selectedPlayer, minDate, maxDate, setMinDate, setMaxDate }) => {
  const resultValues = {
    'Group Stage': 1,
    'Best of 32': 2,
    'Best of 16': 3,
    'Quarterfinals': 4,
    'Semifinals': 5,
    'Finalist': 6,
    'Winner': 7,
  };

  const dates = data.map((entry) => entry.date);
  const defaultMinDate = dates.length > 0 ? Math.min(...dates.map((d) => new Date(d))) : '';
  const defaultMaxDate = dates.length > 0 ? Math.max(...dates.map((d) => new Date(d))) : '';

  const getThisWeekRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
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

    const canvas = document.getElementById('tournamentChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map((entry) => entry.date),
        datasets: [
          {
            label: `Tournament Results (${selectedPlayer || 'No Player'})`,
            data: data.map((entry) => resultValues[entry.result]),
            backgroundColor: data.map(() => '#2196F3'), // Blue, consistent with Tournament Game color
            borderColor: data.map(() => '#2196F3'),
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            min: 0,
            max: 7,
            ticks: {
              stepSize: 1,
              color: '#FFFFFF',
              callback: (value) => {
                const resultLabels = ['', 'Group Stage', 'Best of 32', 'Best of 16', 'Quarterfinals', 'Semifinals', 'Finalist', 'Winner'];
                return resultLabels[value] || value;
              },
            },
            title: { display: true, text: 'Result', color: '#FFFFFF' },
            grid: { color: '#D3D3D3' },
          },
          x: {
            title: { display: true, text: 'Date', color: '#FFFFFF' },
            ticks: { color: '#FFFFFF' },
            grid: { color: '#D3D3D3' },
          },
        },
        plugins: {
          legend: {
            labels: { color: '#FFFFFF' },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [data, selectedPlayer]);

  return (
    <div className="bg-container-grey p-6 rounded-lg shadow-md mb-12">
      <h2 className="text-xl font-semibold text-orange mb-4">Tournament Performance Over Time</h2>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-4">
        <div className="flex items-center space-x-4">
          <label className="font-medium text-light-grey">From:</label>
          <input
            type="date"
            value={minDate || (defaultMinDate && new Date(defaultMinDate).toISOString().split('T')[0])}
            onChange={(e) => setMinDate(e.target.value)}
            className="border border-light-grey rounded p-2 w-full sm:w-auto text-white bg-container-grey focus:border-orange focus:ring-orange"
          />
        </div>
        <div className="flex items-center space-x-4">
          <label className="font-medium text-light-grey">To:</label>
          <input
            type="date"
            value={maxDate || (defaultMaxDate && new Date(defaultMaxDate).toISOString().split('T')[0])}
            onChange={(e) => setMaxDate(e.target.value)}
            className="border border-light-grey rounded p-2 w-full sm:w-auto text-white bg-container-grey focus:border-orange focus:ring-orange"
          />
        </div>
      </div>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 mb-4">
        <button
          onClick={handleThisWeek}
          className="bg-orange text-white px-4 py-2 rounded hover:bg-orange/80"
        >
          This Week
        </button>
        <button
          onClick={handleThisMonth}
          className="bg-orange text-white px-4 py-2 rounded hover:bg-orange/80"
        >
          This Month
        </button>
        <button
          onClick={handleThisYear}
          className="bg-orange text-white px-4 py-2 rounded hover:bg-orange/80"
        >
          This Year
        </button>
      </div>
      {data.length > 0 ? (
        <canvas id="tournamentChart"></canvas>
      ) : (
        <p className="text-light-grey">No tournament results available for {selectedPlayer || 'selected player'}.</p>
      )}
    </div>
  );
};

export default TournamentChart;