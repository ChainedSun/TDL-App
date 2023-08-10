import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { v4 } from 'uuid';

import React, { useState } from 'react';
import './App.css';
import './Root.css';
import Authentication from './pages/Authentication';
import Main from './pages/Main';
import TopBar from './pages/TopBar';

const app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
})

const auth = firebase.auth();
const firestore = firebase.firestore();
export const storage = getStorage(app);

function App() {
    const [ user ] = useAuthState(auth)
    

    const handleSignOut = async () => {
    try {
        await auth.signOut()
    } catch(err) {
        console.error(err)
    }

    }

    const handleUpdateUserInfo = async (userInfo) => {
        auth.currentUser.updateProfile(userInfo).then(() => {
            console.log('Updated user info successfully!')
            window.location.reload()
        })
        .catch((err) => console.error(err))
    }


  return (
    <div className="App">
        <div className='App-header'>
            {user ? <TopBar user={user} onUpdateUserInfo={handleUpdateUserInfo} onSignOut={handleSignOut}/> : null}
        </div>
        <div className='main-container'>
            {user ? 
                <>
                    <Main />
                </>
                : 
                <>
                    < Authentication />
                </>
            }
        </div>
    </div>
  );
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

export default App;
