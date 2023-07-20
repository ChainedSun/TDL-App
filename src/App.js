import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import React, { useEffect, useState } from 'react';
import './App.css';
import './Root.css';
import Authentication from './pages/Authentication';
import Main from './pages/Main';
import SideBar from './pages/SideBar';

firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
    const [ user ] = useAuthState(auth)
    const [userSettings, setUserSettings] = useState({});

    useEffect(() => {
        let unsubscribeUserSettings;
    
        const getUserSettings = async () => {
            const userSettingsCol = firestore.collection('settings');
            const querySnapshot = await userSettingsCol.where('user', '==', auth.currentUser.uid).get();
            if (!querySnapshot.empty) {
                const userSettingsData = querySnapshot.docs[0].data();
                setUserSettings(userSettingsData);
                // Subscribe to the user settings document
                unsubscribeUserSettings = userSettingsCol.doc(querySnapshot.docs[0].id).onSnapshot((docSnapshot) => {
                    setUserSettings(docSnapshot.data());
                });
            }
        };
    
        if (user) {
            getUserSettings();
        }
    
        // Clean up the subscription when the component unmounts or when the user changes
        return () => {
            if (unsubscribeUserSettings) {
                unsubscribeUserSettings();
            }
        };
    }, [user]);
    


    const handleSignOut = async () => {
    try {
        await auth.signOut()
    } catch(err) {
        console.error(err)
    }

    }

    const handleUpdateUserInfo = async (userInfo) => {
        await auth.currentUser.updateProfile(userInfo)
        .catch((err) => console.error(err))
    }

    console.log("User Settings: ",userSettings)

  return (
    <div className="App">
        <div className='App-header'>
            {user ? <SideBar user={user} onUpdateUserInfo={handleUpdateUserInfo} onSignOut={handleSignOut} userSettings={userSettings}/> : null}
        </div>
        <div className='main-content'>
            {user ? <Main /> : < Authentication />}
        </div>
    </div>
  );
}

export default App;
