import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import React, { useEffect, useState } from 'react';
import './App.css';
import Authentication from './pages/Authentication';
import Main from './pages/Main';

firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
})

const auth = firebase.auth();

function App() {
 const [ user ] = useAuthState(auth)

  return (
    <div className="App">
      {user ? <Main /> : < Authentication />}
    </div>
  );
}

export default App;
