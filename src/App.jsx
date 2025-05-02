import { useState, useEffect } from 'react';
import { collection, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import RatingForm from './components/RatingForm';
import PerformanceChart from './components/PerformanceChart';
import AddPlayerForm from './components/AddPlayerForm';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  const [ratings, setRatings] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [isPlayerFromUrl, setIsPlayerFromUrl] = useState(false);
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  // Parse URL for player parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const playerFromUrl = params.get('player');
    if (playerFromUrl) {
      setSelectedPlayer(playerFromUrl);
      setIsPlayerFromUrl(true);
    }
  }, []);

  // Load players and ratings from Firestore in real-time
  useEffect(() => {
    // Subscribe to players
    const unsubscribePlayers = onSnapshot(doc(db, 'data', 'players'), (doc) => {
      if (doc.exists()) {
        const playerNames = doc.data().names || [];
        setPlayers(playerNames);
        // Validate player from URL
        if (isPlayerFromUrl && !playerNames.includes(selectedPlayer)) {
          setSelectedPlayer('');
          setIsPlayerFromUrl(false);
        }
      } else {
        setDoc(doc(db, 'data', 'players'), { names: [] });
      }
    });

    // Subscribe to ratings
    const unsubscribeRatings = onSnapshot(collection(db, 'ratings'), (snapshot) => {
      const ratingsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRatings(ratingsData.sort((a, b) => new Date(a.date) - new Date(b.date)));
    });

    return () => {
      unsubscribePlayers();
      unsubscribeRatings();
    };
  }, [isPlayerFromUrl, selectedPlayer]);

  const addRating = async (newRating) => {
    await setDoc(doc(collection(db, 'ratings')), newRating);
  };

  const addPlayer = async (newPlayer) => {
    if (players.includes(newPlayer)) {
      alert('Player already exists.');
      return;
    }
    const playerDoc = doc(db, 'data', 'players');
    const docSnap = await getDoc(playerDoc);
    const currentPlayers = docSnap.exists() ? docSnap.data().names : [];
    await setDoc(playerDoc, { names: [...currentPlayers, newPlayer] });
  };

  // Filter ratings for the selected player and date range
  const filteredRatings = selectedPlayer
    ? ratings
        .filter((rating) => rating.player === selectedPlayer)
        .filter(
          (rating) =>
            (!minDate || new Date(rating.date) >= new Date(minDate)) &&
            (!maxDate || new Date(rating.date) <= new Date(maxDate))
        )
    : [];

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">Padel Practice Tracker</h1>
        <RatingForm
          addRating={addRating}
          selectedPlayer={selectedPlayer}
          setSelectedPlayer={setSelectedPlayer}
          players={players}
          isPlayerFromUrl={isPlayerFromUrl}
        />
        <PerformanceChart
          data={filteredRatings}
          selectedPlayer={selectedPlayer}
          minDate={minDate}
          maxDate={maxDate}
          setMinDate={setMinDate}
          setMaxDate={setMaxDate}
        />
        {!isPlayerFromUrl && <AddPlayerForm addPlayer={addPlayer} />}
      </div>
    </ErrorBoundary>
  );
};

export default App;