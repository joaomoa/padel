import { useState, useEffect } from 'react';
import { collection, doc, setDoc, getDoc, onSnapshot, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import RatingForm from './components/RatingForm';
import PerformanceChart from './components/PerformanceChart';
import TournamentForm from './components/TournamentForm';
import TournamentChart from './components/TournamentChart';
import AddPlayerForm from './components/AddPlayerForm';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  const [ratings, setRatings] = useState([]);
  const [tournamentResults, setTournamentResults] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [isPlayerFromUrl, setIsPlayerFromUrl] = useState(false);
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [activeTab, setActiveTab] = useState('self-assessment');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const playerFromUrl = params.get('player');
    if (playerFromUrl) {
      setSelectedPlayer(playerFromUrl);
      setIsPlayerFromUrl(true);
    }
  }, []);

  useEffect(() => {
    const unsubscribePlayers = onSnapshot(doc(db, 'data', 'players'), (doc) => {
      if (doc.exists()) {
        const playerNames = doc.data().names || [];
        setPlayers(playerNames);
        if (isPlayerFromUrl && !playerNames.includes(selectedPlayer)) {
          setSelectedPlayer('');
          setIsPlayerFromUrl(false);
        }
      } else {
        setDoc(doc(db, 'data', 'players'), { names: [] });
      }
    });

    const unsubscribeRatings = onSnapshot(collection(db, 'ratings'), (snapshot) => {
      const ratingsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRatings(ratingsData.sort((a, b) => new Date(a.date) - new Date(b.date)));
    });

    const unsubscribeTournamentResults = onSnapshot(collection(db, 'tournamentResults'), (snapshot) => {
      const tournamentData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTournamentResults(tournamentData.sort((a, b) => new Date(a.date) - new Date(b.date)));
    });

    return () => {
      unsubscribePlayers();
      unsubscribeRatings();
      unsubscribeTournamentResults();
    };
  }, [isPlayerFromUrl, selectedPlayer]);

  const addRating = async (newRating) => {
    const ratingsQuery = query(
      collection(db, 'ratings'),
      where('player', '==', newRating.player),
      where('date', '==', newRating.date)
    );
    const querySnapshot = await getDocs(ratingsQuery);

    if (!querySnapshot.empty) {
      const existingDoc = querySnapshot.docs[0];
      await setDoc(doc(db, 'ratings', existingDoc.id), newRating);
    } else {
      await setDoc(doc(collection(db, 'ratings')), newRating);
    }
  };

  const addTournamentResult = async (newResult) => {
    const tournamentQuery = query(
      collection(db, 'tournamentResults'),
      where('player', '==', newResult.player),
      where('date', '==', newResult.date)
    );
    const querySnapshot = await getDocs(tournamentQuery);

    if (!querySnapshot.empty) {
      const existingDoc = querySnapshot.docs[0];
      await setDoc(doc(db, 'tournamentResults', existingDoc.id), newResult);
    } else {
      await setDoc(doc(collection(db, 'tournamentResults')), newResult);
    }
  };

  const deleteTournamentResult = async (id) => {
    try {
      await deleteDoc(doc(db, 'tournamentResults', id));
    } catch (error) {
      console.error('Error deleting tournament result:', error);
      alert('Failed to delete tournament. Check console for details.');
    }
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

  const filteredRatings = selectedPlayer
    ? ratings
        .filter((rating) => rating.player === selectedPlayer)
        .filter(
          (rating) =>
            (!minDate || new Date(rating.date) >= new Date(minDate)) &&
            (!maxDate || new Date(rating.date) <= new Date(maxDate))
        )
    : [];

  const filteredTournamentResults = selectedPlayer
    ? tournamentResults
        .filter((result) => result.player === selectedPlayer)
        .filter(
          (result) =>
            (!minDate || new Date(result.date) >= new Date(minDate)) &&
            (!maxDate || new Date(result.date) <= new Date(maxDate))
        )
    : [];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-grey p-4">
        <h1 className="text-3xl font-bold text-orange text-center mb-8">Padel Practice Tracker</h1>
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setActiveTab('self-assessment')}
            className={`px-4 py-2 rounded-l-lg font-medium ${
              activeTab === 'self-assessment'
                ? 'bg-orange text-white'
                : 'bg-light-grey text-white hover:bg-orange/80'
            }`}
          >
            Self-assessment
          </button>
          <button
            onClick={() => setActiveTab('tournament-results')}
            className={`px-4 py-2 rounded-r-lg font-medium ${
              activeTab === 'tournament-results'
                ? 'bg-orange text-white'
                : 'bg-light-grey text-white hover:bg-orange/80'
            }`}
          >
            Tournament Results
          </button>
        </div>

        {activeTab === 'self-assessment' && (
          <>
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
          </>
        )}

        {activeTab === 'tournament-results' && (
          <>
            <TournamentForm
              addTournamentResult={addTournamentResult}
              selectedPlayer={selectedPlayer}
              setSelectedPlayer={setSelectedPlayer}
              players={players}
              isPlayerFromUrl={isPlayerFromUrl}
            />
            <TournamentChart
              data={filteredTournamentResults}
              selectedPlayer={selectedPlayer}
              minDate={minDate}
              maxDate={maxDate}
              setMinDate={setMinDate}
              setMaxDate={setMaxDate}
              deleteTournamentResult={deleteTournamentResult}
            />
            {!isPlayerFromUrl && <AddPlayerForm addPlayer={addPlayer} />}
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;