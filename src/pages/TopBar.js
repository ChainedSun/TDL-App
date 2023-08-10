
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useRef, useState } from 'react';
import { v4 } from 'uuid';
import './TopBar.css';

import { storage } from '../App';
import { Camera } from './Icons.js';
const defaultPhotoURL = 'https://firebasestorage.googleapis.com/v0/b/to-do-list-815da.appspot.com/o/profile%2Fblank_avatar.jpg?alt=media&token=d924949d-2a75-429a-a07d-8d3fd0e5f719'


function TopBar(args) {
    const {user, onSignOut, onUpdateUserInfo} = args
    const [userName, setUserName] = useState(user.displayName);
    const [usernameEditMode, setUsernameEditMode] = useState(false);
    const [hoverPhoto, setHoverPhoto] = useState(false);
    const [editPhoto, setEditPhoto] = useState(false);
    

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

    const handleEditProfilePhoto = (URL) => {
        onUpdateUserInfo({
            photoURL: URL
        })
    }

    const handleBlur = () => {
        setUserName(user.displayName)
        handleEditMode()
    }

    const handleEditMode = () => {
        setUsernameEditMode(!usernameEditMode)
    }

    const handleHoverProfilePhoto = () => {
        setHoverPhoto(!hoverPhoto)
    }

    const handleEditPhoto = () => {
        setEditPhoto(!editPhoto)
    }

    

    return ( 
        <div className="top-bar">
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
                <div className='profile-picture-container'
                    onMouseOver={handleHoverProfilePhoto}
                    onMouseOut={handleHoverProfilePhoto}
                    onClick={handleEditPhoto}
                >
                    <img
                        className="profile-picture"
                        alt='profile'
                        src={`${user?.photoURL ? user.photoURL : defaultPhotoURL}`}
                        style={hoverPhoto ? {filter: 'brightness(0.7)'} : {}}
                    >
                    </img>
                    {hoverPhoto ? 
                    (<div className='camera-icon-container'>
                        <Camera />
                    </div>) : (null)}
                </div>
                <button className='signout-btn' onClick={onSignOut}>Sign Out</button>
            </div>
            {editPhoto ? (
                <div className='backdrop-container update-photo-container'>
                    <UpdateImage photoURL={user.photoURL} onEditPhoto={handleEditProfilePhoto} onClose={handleEditPhoto}/>
                </div>)
            :
            
                (null)}
        </div>

    );
}

function UpdateImage(props) {
    const { photoURL, onEditPhoto, onClose } = props;
    const fileInputRef = useRef(null)
    const urlInputRef = useRef(null)
    const [fileMode, setFileMode] = useState(true);
    const [previewImage, setPreviewImage] = useState(photoURL);
    const [imageURL, setImageURL] = useState('');

    useEffect(() => {
        if(isValidUrl(imageURL))
            onEditPhoto(imageURL)
    }, [imageURL])

    useEffect(() => {
        setPreviewImage('')
    }, [fileMode])

    const handleUploadImage = (e) => {
        e.preventDefault();
        console.log("here")
        if (fileInputRef.current.files.length > 0) {
            const imageFile = fileInputRef.current.files[0]
            const imageRef = ref(storage, `profileImages/${imageFile.name + v4()}`)
            uploadBytes(imageRef, imageFile).then((snapshot) => {
                console.log(snapshot)
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    console.log('Download URL: ', downloadURL)
                    setImageURL(downloadURL)
                }).catch((error) => { console.log(error)})
            })
        }
    }

    const handleUploadURL = (e) => {
        e.preventDefault();
        if(isValidUrl(urlInputRef.current.value)) {
            setImageURL(urlInputRef.current.value)
        }
    }

    const handleChangeImage = (event) => {
        const file = event.target.files[0]
        if(file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setPreviewImage(e.target.result)
            }
            reader.readAsDataURL(file)
        }

    }

    const handleChangeURL = (event) => {
        const url = event.target.value
        if(isValidUrl(url)) {
            setPreviewImage(url)
        } else {
            setPreviewImage('')
        }
    }


    const handleChangeMode = () => {
        setFileMode(!fileMode)
    }

    return (
        <>
            <div className='update-container block-container'>
                {fileMode ? (<div className='upload-container block-container'>
                    <div className='header-container'>
                        <div style={{'width': '100%', 'height': '100%'}}>
                            <button className='header' onClick={handleChangeMode}>FILE</button>
                        </div>
                        <button className='close-btn' onClick={onClose}>X</button>
                    </div>
                    <div className='content-container'>
                        <div className='preview-container'>
                            <img className={`preview-profile-photo ${previewImage === '' ? 'hidden' : ''}`} alt='preview'  src={previewImage} />
                        </div>
                        <form className='block-container upload-form' onSubmit={handleUploadImage}>
                            <div className='form-input-container'>
                                <input ref={fileInputRef} className='form-input' type='file' accept='image/*' onChange={handleChangeImage}/>
                            </div>
                            <button className='form-btn' type='submit'>Submit</button>
                        </form>
                    </div>
                </div>)
                :
                (<div className='url-container block-container'>
                    <div className='header-container'>
                        <div style={{'width': '100%', 'height': '100%'}}>
                            <button className='header' onClick={handleChangeMode}>URL</button>
                        </div>
                        <button className='close-btn' onClick={onClose}>X</button>
                    </div>
                    <div className='content-container'>
                        <div className='preview-container'>
                            <img className={`preview-profile-photo ${previewImage === '' ? 'hidden' : ''}`} alt='preview'  src={previewImage} />
                        </div>
                        <form className='block-container upload-form' onSubmit={handleUploadURL}>
                            <div className='form-input-container'>
                                <input ref={urlInputRef} className='form-input' type='text' placeholder='Your URL here...' onBlur={handleChangeURL} onChange={handleChangeURL}/>
                            </div>
                            <button className='form-btn' type='submit'>Submit</button>
                        </form>
                    </div>
                </div>)}
            </div>
        </>
    )
}


function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

export default TopBar;