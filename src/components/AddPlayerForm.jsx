import { useState } from 'react';

const AddPlayerForm = ({ addPlayer }) => {
  const [newPlayer, setNewPlayer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPlayer.trim()) {
      alert('Please enter a player name.');
      return;
    }
    addPlayer(newPlayer.trim());
    setNewPlayer('');
  };

  return (
    <div className="bg-grey p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-orange mb-4">Add New Player</h2>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          placeholder="Player name"
          className="border border-light-grey rounded p-2 w-full sm:w-auto text-white bg-grey focus:border-orange focus:ring-orange"
        />
        <button
          onClick={handleSubmit}
          className="bg-orange text-white px-4 py-2 rounded hover:bg-orange/80 w-full sm:w-auto"
        >
          Add Player
        </button>
      </div>
    </div>
  );
};

export default AddPlayerForm;
