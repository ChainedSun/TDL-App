import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import React, { useEffect, useState } from 'react';

firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
})

const auth = firebase.auth()

function Authentication() {

    const [authMode, setAuthMode] = useState(false);

    const handleToggleAuth = () => {
        setAuthMode(!authMode)
    }

    return ( 
    <>
        {authMode ? <Login onSignUp={handleToggleAuth}/> : <Register onLogin={handleToggleAuth}/>}
    </> 
    );
}

function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginWithEmailAndPassword = async (e) => {
        e.preventDefault()
        try {
            await auth.signInWithEmailAndPassword(email, password)
        } catch (err) {
            console.error(err)
        }
    }

    const { onSignUp } = props
    return (
        <>
            <div className='login-container'>
                <h1>Login</h1>
                <form onSubmit={handleLoginWithEmailAndPassword}>
                    <p>Email:</p>
                    <input type={'email'} value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email...' required></input>
                    <p>Password:</p>
                    <input type={'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password...' required></input>
                    <button type={'submit'} >Login</button>
                </form>
                <h2>Or:</h2>
                <button className='google-login'>Login with Google</button>
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
    }

    return (
        <>
            <div className='login-container'>
                <h1>Register</h1>
                <form onSubmit={handleRegister}>
                    <p>Username:</p>
                    <input type={'text'} value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Your Name...' required></input>
                    <p>Email:</p>
                    <input type={'email'} value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email...' required></input>
                    <p>Password:</p>
                    <input type={'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password...' required></input>
                    <button type={'submit'} >Register</button>
                </form>
                <button className='register-link' onClick={onLogin}>Already have an account? Log in</button>
            </div>
        </>
    )
}

export default Authentication;


