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


  

function Authentication() {
    const [authMode, setAuthMode] = useState(true);

    const handleToggleAuth = () => {
        setAuthMode(!authMode)
    }
        
   
    

      

    return ( 
    <div className='auth-container'>
        {authMode ? <Login onSignUp={handleToggleAuth}/> : <Register onLogin={handleToggleAuth}/>}
    </div> 
    );
}

function Login(props) {
    const { onSignUp} = props
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginWithEmailAndPassword = async (e) => {
        e.preventDefault()
        try {
            await auth.signInWithEmailAndPassword(email, password)
        } catch (err) {
            console.error(err)
        }

        window.location.reload()
    }

    const handleGoogleLogin = () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        auth.signInWithPopup(provider)
        
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
                    <h2>Or:</h2>
                    <button className='google-login' onClick={handleGoogleLogin}>Login with Google</button>
                </form>
                <p className='register-link' onClick={onSignUp}>Don't have an account? Register</p>
            </div>
        </>
    )
}

function Register(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [profilePhotoURL, setProfilePhotoURL] = useState('');
    
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


