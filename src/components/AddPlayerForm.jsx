import { useState } from 'react';

const AddPlayerForm = ({ addPlayer }) => {
  const [newPlayer, setNewPlayer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPlayer.trim()) {
      alert('Player name cannot be empty.');
      return;
    }
    addPlayer(newPlayer.trim());
    setNewPlayer('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Player</h2>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          placeholder="Enter player name"
          className="border rounded p-2 flex-grow"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Player
        </button>
      </div>
    </div>
  );
};

export default AddPlayerForm;