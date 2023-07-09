import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import React, { useEffect, useState } from 'react';
const auth = firebase.auth()

function Main() {
    const [ user ] = useAuthState(auth)

    const handleSignOut = async () => {

        try {
            await auth.signOut()
        } catch(err) {
            console.error(err)
        }

    }

    return ( 
        <>
        <div className='login-info'>
            <p className='user-name'>Welcome, {user.displayName}</p>
            <img src={`${user.photoURL}`}></img>
            <button onClick={handleSignOut}>Sign Out</button>
        </div>
            
        </> 
    );
}

export default Main;