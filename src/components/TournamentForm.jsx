import { useState, useEffect } from 'react';

const TournamentForm = ({ addTournamentResult, selectedPlayer, setSelectedPlayer, players, isPlayerFromUrl }) => {
  const [tournamentName, setTournamentName] = useState('');
  const [result, setResult] = useState('Group Stage');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isFutureDate, setIsFutureDate] = useState(false);
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const today = new Date('2025-05-23T18:32:00+01:00'); // May 23, 2025, 06:32 PM WEST
    const selectedDate = new Date(date);
    setIsFutureDate(selectedDate > today);
    if (selectedDate > today) {
      setResult(undefined); // Reset for future dates (will be omitted in submission)
    } else {
      setResult('Group Stage'); // Default for past/present dates
    }
  }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlayer) {
      alert('Please select a player.');
      return;
    }
    if (!tournamentName) {
      alert('Please enter a tournament name.');
      return;
    }
    if (!date) {
      alert('Please select a date.');
      return;
    }
    if (!isFutureDate && !result) {
      alert('Please select a result.');
      return;
    }
    try {
      const tournamentData = { player: selectedPlayer, tournamentName, date };
      if (!isFutureDate) {
        tournamentData.result = result;
      }
      await addTournamentResult(tournamentData);
      setTournamentName('');
      setResult(isFutureDate ? undefined : 'Group Stage');
      setDate(new Date().toISOString().split('T')[0]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error('Error submitting tournament result:', error);
      alert('Failed to submit tournament result. Check console for details.');
    }
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
      <h2 className="text-xl font-semibold text-orange mb-4">Log Tournament</h2>
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
          <label className="font-medium text-light-grey">Tournament Name:</label>
          <input
            type="text"
            value={tournamentName}
            onChange={(e) => setTournamentName(e.target.value)}
            className="border border-light-grey rounded p-2 w-full sm:w-auto text-white bg-container-grey focus:border-orange focus:ring-orange"
            placeholder="Enter tournament name"
          />
        </div>
        {!isFutureDate && (
          <div className="flex items-center space-x-4">
            <label className="font-medium text-light-grey">Result:</label>
            <select
              value={result || 'Group Stage'}
              onChange={(e) => setResult(e.target.value)}
              className="border border-light-grey rounded p-2 w-full sm:w-auto text-white bg-container-grey focus:border-orange focus:ring-orange"
            >
              {['Group Stage', 'Best of 32', 'Best of 16', 'Quarterfinals', 'Semifinals', 'Finalist', 'Winner'].map((res) => (
                <option key={res} value={res} className="text-white bg-container-grey">
                  {res}
                </option>
              ))}
            </select>
          </div>
        )}
        <button
          onClick={handleSubmit}
          className="bg-orange text-white px-4 py-2 rounded hover:bg-orange/80 w-full sm:w-auto"
        >
          Submit
        </button>
      </div>
      {success && (
        <p className="mt-4 text-white bg-green-500 px-4 py-2 rounded text-center">
          Result submitted!
        </p>
      )}
    </div>
  );
};

export default TournamentForm;