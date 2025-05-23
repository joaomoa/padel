const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, getDocs, updateDoc, doc } = require('firebase/firestore');

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUnzHX_8NgKjeiIxJzIRGX16ZI-8JrnMI",
  authDomain: "padel-723fa.firebaseapp.com",
  projectId: "padel-723fa",
  storageBucket: "padel-723fa.firebasestorage.app",
  messagingSenderId: "378292715014",
  appId: "1:378292715014:web:9dfa47c2d8499063d54d87",
  measurementId: "G-7S25JLKYK7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateRatings() {
  try {
    console.log('Starting migration of ratings to add type "Practice"...');

    // Query all documents in the ratings collection
    const ratingsRef = collection(db, 'ratings');
    const querySnapshot = await getDocs(ratingsRef);

    if (querySnapshot.empty) {
      console.log('No ratings found. Migration complete.');
      return;
    }

    let updatedCount = 0;
    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      // Check if the document is missing the 'type' field
      if (!data.hasOwnProperty('type')) {
        const docRef = doc(db, 'ratings', docSnap.id);
        await updateDoc(docRef, { type: 'Practice' });
        updatedCount++;
        console.log(`Updated rating ${docSnap.id} with type: Practice`);
      }
    }

    console.log(`Migration complete. Updated ${updatedCount} ratings.`);
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

migrateRatings();
