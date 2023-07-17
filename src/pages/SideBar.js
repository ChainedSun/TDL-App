
import React, { useEffect, useRef, useState } from 'react';
import './SideBar.css';
const defaultPhotoURL = 'https://firebasestorage.googleapis.com/v0/b/to-do-list-815da.appspot.com/o/profile%2Fblank_avatar.jpg?alt=media&token=d924949d-2a75-429a-a07d-8d3fd0e5f719'


function SideBar(args) {
    const {user, onSignOut, onUpdateUserInfo} = args
    const [userName, setUserName] = useState(user.displayName);
    const [usernameEditMode, setUsernameEditMode] = useState(false);
    // const usernameRef = useRef(null)

    // useEffect(() => {
    //     if (usernameRef.current) {
    //         usernameRef.current.focus()
    //     }
    // }, [usernameRef])

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
                    // ref={usernameRef}
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
            </div>
        </div>

    );
}

export default SideBar;