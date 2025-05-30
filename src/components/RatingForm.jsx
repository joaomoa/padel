import { useState } from 'react';

const RatingForm = ({ addRating, selectedPlayer, setSelectedPlayer, players, isPlayerFromUrl }) => {
  const [rating, setRating] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('Practice');
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);

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
    if (!type) {
      alert('Please select a type.');
      return;
    }
    addRating({ player: selectedPlayer, date, rating: parseInt(rating), type });
    setRating(1);
    setDate(new Date().toISOString().split('T')[0]);
    setType('Practice');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const copyUrl = async () => {
    if (!selectedPlayer) return;
    try {
      const baseUrl = window.location.origin;
      const url = `${baseUrl}?player=${encodeURIComponent(selectedPlayer)}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
      alert('Failed to copy URL. Please try again.');
    }
  };

  return (
    <div className="bg-container-grey p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-orange mb-4">Log Practice</h2>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-4">
          <label className="font-medium text-light-grey">Player:</label>
          {isPlayerFromUrl ? (
            <span className="text-white font-medium">{selectedPlayer}</span>
          ) : (
            <div className="flex items-center space-x-4">
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="border border-light-grey rounded p-2 w-full sm:w-auto text-white bg-container-grey focus:border-orange focus:ring-orange"
              >
                <option value="" className="text-white bg-container-grey">Select Player</option>
                {players.map((player) => (
                  <option key={player} value={player} className="text-white bg-container-grey">
                    {player}
                  </option>
                ))}
              </select>
              {selectedPlayer && (
                <button
                  onClick={copyUrl}
                  className={`${
                    copied ? 'bg-orange' : 'bg-orange'
                  } text-white px-4 py-2 rounded hover:bg-orange/80 transition-colors`}
                >
                  {copied ? 'Copied!' : 'Copy URL'}
                </button>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <label className="font-medium text-light-grey">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-light-grey rounded p-2 w-full sm:w-auto text-white bg-container-grey focus:border-orange focus:ring-orange"
          />
        </div>
      </div>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mt-4">
        <div className="flex items-center space-x-4">
          <label className="font-medium text-light-grey">Type:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border border-light-grey rounded p-2 w-full sm:w-auto text-white bg-container-grey focus:border-orange focus:ring-orange"
          >
            <option value="Tournament Game" className="text-white bg-container-grey">Tournament Game</option>
            <option value="Friendly Game" className="text-white bg-container-grey">Friendly Game</option>
            <option value="Practice" className="text-white bg-container-grey">Practice</option>
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <label className="font-medium text-light-grey">Rating (1-5):</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border border-light-grey rounded p-2 w-full sm:w-auto text-white bg-container-grey focus:border-orange focus:ring-orange"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num} className="text-white bg-container-grey">
                {num}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-orange text-white px-4 py-2 rounded hover:bg-orange/80 w-full sm:w-auto"
        >
          Submit
        </button>
      </div>
      {success && (
        <p className="mt-4 text-white bg-green-500 px-4 py-2 rounded text-center">
          Rating submitted!
        </p>
      )}
    </div>
  );
};

export default RatingForm;