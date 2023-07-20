
import React, { useEffect, useRef, useState } from 'react';
import { SettingsCog } from './Icons';
import './SideBar.css';
const defaultPhotoURL = 'https://firebasestorage.googleapis.com/v0/b/to-do-list-815da.appspot.com/o/profile%2Fblank_avatar.jpg?alt=media&token=d924949d-2a75-429a-a07d-8d3fd0e5f719'


function SideBar(args) {
    const {user, onSignOut, onUpdateUserInfo, settings} = args
    const [userName, setUserName] = useState(user.displayName);
    const [usernameEditMode, setUsernameEditMode] = useState(false);
    const [options, setOptions] = useState(settings);
    const [optionsMode, setOptionsMode] = useState(false);
    

    const handleEditName = async (event) => {
        if(event.key === "Enter" && !event.shiftKey) {
            if(user){
                onUpdateUserInfo({
                    displayName: userName
                })
            }
            handleEditMode()
        } else if(event.key === 'Escape') {
            if(user) {
                setUserName(user.displayName)
            }
            handleEditMode()
        }
    }

    const handleBlur = () => {
        setUserName(user.displayName)
        handleEditMode()
    }

    const handleEditMode = () => {
        setUsernameEditMode(!usernameEditMode)
    }

    const handleOptionsToggle = () => {
        setOptionsMode(!optionsMode)
    }

    return ( 
        <div className="sidebar">
            <div className='login-info'>
                {!usernameEditMode ? 
                (<p 
                    className={`user-name`}
                    onDoubleClick={handleEditMode}                    
                >Welcome, {userName ? userName : '(change name)'}</p>)
                :
                (<input
                    autoFocus
                    className={`edit-username`}
                    type='text'
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onKeyDown={handleEditName}
                    onBlur={handleBlur}
                    onFocus={(e) => e.target.select()}
                ></input>)}
                <img
                    className="profile-picture"
                    alt='profile'
                    src={`${user?.photoURL ? user.photoURL : defaultPhotoURL}`}
                ></img>
                <button className='signout-btn' onClick={onSignOut}>Sign Out</button>
                <button className='options-btn' onClick={handleOptionsToggle}><SettingsCog /></button>
            </div>
            {optionsMode &&(
                <div className='options-window'>
                    
                </div>
            )}
        </div>

    );
}

export default SideBar;