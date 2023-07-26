import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { signInWithPopup } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import './Authentication.css';




firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
})

const auth = firebase.auth()
const firestore = firebase.firestore()

const defaultSettings = {
    showFinishedTasks: true,
    showAdvancedInfo: false,
    
    input_background_color: 'transparent',
    input_background_color_hover: 'transparent',
    input_background_color_focus: '#ffffff',
    input_text_color: '#ffffff',
    input_text_color_hover: '#ffffff',
    input_text_color_focus: '#ffffff',
    input_border_color: '#000000',
    input_border_color_hover: '#000000',
    input_border_color_focus: '#000000',

    btn_bg_color: '#ffffff',
    btn_bg_color_hover: '#adff2f',
    btn_bg_color_active: '#008000',
    btn_bg_color_disabled: 'transparent',
    btn_text_color: '#000000',
    btn_text_color_hover: '#000000',
    btn_text_color_active: '#000000',
    btn_text_color_disabled: '#ffffff',
    btn_border_color: '#000000',
    btn_border_color_hover: '#000000',
    btn_border_color_active: '#000000',
    btn_border_color_disabled: '#000000',
    btn_border_radius: '100px',
    btn_border_width: '1px',

    scrollbar_bg_color: 'transparent',
    scrollbar_thumb_color: '#3683a1',
    scrollbar_thumb_color_hover: '#78c6e4',
    scrollbar_thumb_color_active: '#78c6a1',
    scrollbar_thumb_border_color: '#000000',
    scrollbar_thumb_border_color_hover: '#000000',
    scrollbar_thumb_border_color_active: '#000000',
    scrollbar_track_bg_color: '#373737',
    scrollbar_track_bg_color_hover: '#373737',
    scrollbar_track_bg_color_active: '#373737',
    scrollbar_track_border_color: '#000000',
    scrollbar_track_border_color_hover: '#000000',
    scrollbar_track_border_color_active: '#000000',

    entry_container_bg_color: '#494949',
    entry_container_bg_color_hover: '#7d7d7d',
    entry_container_bg_color_complete: '#003c00',
    entry_container_border_color: '#000000',
    entry_container_border_color_hover: '#000000',
    entry_container_text_color: '#ffffff',
    entry_container_text_color_hover: '#ffffff',
    entry_container_text_color_complete: '#ffffff'
};
  

function Authentication() {
    const [authMode, setAuthMode] = useState(true);

    const handleToggleAuth = () => {
        setAuthMode(!authMode)
    }
        
    const handleSetSettings = async () => {
        const settingsCol = firestore.collection('settings');
        const querySnapshot = await settingsCol.where('user', '==', auth.currentUser.uid).get();
    
        if (querySnapshot.empty) {
            // Add new settings document and create userSettings object with default values
            const newSettingsDocRef = await settingsCol.add({
                user: auth.currentUser.uid,
                ...defaultSettings
            });
            console.log('Settings added for user with UID:', auth.currentUser.uid);
    
            const userSettings = {
                ref: newSettingsDocRef,
                data: {
                    user: auth.currentUser.uid,
                    ...defaultSettings
                }
            };
            console.log('User Settings:', userSettings);
        } else {
            // Extract the first document from the query snapshot
            const settingsDoc = querySnapshot.docs[0];
            const userSettingsData = settingsDoc.data();
    
            // Check if userSettingsData contains all the keys from defaultSettings
            const hasAllKeys = Object.keys(defaultSettings).every((key) => key in userSettingsData);
    
            if (hasAllKeys) {
                console.log('Settings:', userSettingsData);
    
                const userSettings = {
                    ref: settingsDoc.ref,
                    data: userSettingsData
                };
                console.log('User Settings:', userSettings);
            } else {
                // Update the document with default values for the missing keys
                const updatedData = { ...userSettingsData };
                Object.keys(defaultSettings).forEach((key) => {
                    if (!(key in updatedData)) {
                        updatedData[key] = defaultSettings[key];
                    }
                });
    
                // Update the document with the updatedData
                await settingsDoc.ref.update(updatedData);
                console.log('Updated settings with default values:', updatedData);
    
                const userSettings = {
                    ref: settingsDoc.ref,
                    data: updatedData
                };
                console.log('User Settings:', userSettings);
            }
        }
    };
    

      

    return ( 
    <>
        {authMode ? <Login onSignUp={handleToggleAuth} handleSettings={handleSetSettings}/> : <Register onLogin={handleToggleAuth} handleSettings={handleSetSettings}/>}
    </> 
    );
}

function Login(props) {
    const { onSignUp, handleSettings} = props
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginWithEmailAndPassword = async (e) => {
        e.preventDefault()
        try {
            await auth.signInWithEmailAndPassword(email, password)
        } catch (err) {
            console.error(err)
        }

        //window.location.reload()
        handleSettings()
    }

    const handleGoogleLogin = () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        auth.signInWithPopup(provider)
        .then(() => handleSettings())
        
    }
    return (
        <>
            <div className='login-container'>
                <h1>Login</h1>
                <form className='login-form-e-p' onSubmit={handleLoginWithEmailAndPassword}>
                    <p>Email:</p>
                    <input className='form-input' type={'email'} value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email...' required></input>
                    <p>Password:</p>
                    <input className='form-input' type={'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password...' required></input>
                    <button className='form-btn' type={'submit'} >Login</button>
                </form>
                <h2>Or:</h2>
                <button className='google-login' onClick={handleGoogleLogin}>Login with Google</button>
                <button className='register-link' onClick={onSignUp}>Don't have an account? Register</button>
            </div>
        </>
    )
}

function Register(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    
    const { onLogin } = props

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            await auth.createUserWithEmailAndPassword(email, password)
            auth.currentUser.updateProfile({
                displayName: username
            })
        } catch (err) {
            console.error(err)
        }

        window.location.reload()
    }

    return (
        <>
            <div className='register-container'>
                <h1>Register</h1>
                <form onSubmit={handleRegister} className='register-form'>
                    <p>Username:</p>
                    <input className='form-input' type={'text'} value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Your Name...' required></input>
                    <p>Email:</p>
                    <input className='form-input' type={'email'} value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email...' required></input>
                    <p>Password:</p>
                    <input className='form-input' type={'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password...' required></input>
                    <button className='form-btn' type={'submit'} >Register</button>
                </form>
                <button className='register-link' onClick={onLogin}>Already have an account? Log in</button>
            </div>
        </>
    )
}

export default Authentication;


