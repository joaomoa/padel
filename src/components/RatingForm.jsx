import { useState } from 'react';

const RatingForm = ({ addRating, selectedPlayer, setSelectedPlayer, players }) => {
  const [rating, setRating] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPlayer) {
      alert('Please select a player.');
      return;
    }
    if (!date) {
      alert('Please select a date.');
      return;
    }
    addRating({ player: selectedPlayer, date, rating: parseInt(rating) });
    setRating(1);
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Log Practice</h2>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-4">
          <label className="font-medium">Player:</label>
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="border rounded p-2 w-full sm:w-auto"
          >
            <option value="">Select Player</option>
            {players.map((player) => (
              <option key={player} value={player}>
                {player}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <label className="font-medium">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded p-2 w-full sm:w-auto"
          />
        </div>
      </div>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mt-4">
        <div className="flex items-center space-x-4">
          <label className="font-medium">Rating (1-5):</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border rounded p-2 w-full sm:w-auto"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default RatingForm;