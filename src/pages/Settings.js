import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import React, { useEffect, useRef, useState } from 'react';
import './Settings.css';

const firestore = firebase.firestore();
const auth = firebase.auth();

function Settings() {
    const [settings, setSettings] = useState({});
    useEffect(() => {
        const unsubscribe = firestore.collection('settings').where('user', '==', auth.currentUser.uid).onSnapshot((snapshot) => {
            setSettings(snapshot.docs.map((doc) => doc.data()));
        });
        return (() => unsubscribe());
    },[])

    const updateSettings = (key, value) => {
        console.log(key, value)
    }
    

    return ( 
        <>
            <div className='backdrop'>
                <div className='options-window'>
                    {
                    Object.keys(settings).length > 0 ? 
                    (
                        <>
                            <CreateComponents 
                                key={'showAdvancedInfo'}
                                id={'showAdvancedInfo'}
                                name={CapitalizeWords('showAdvancedInfo')}
                                componentValue={settings['showAdvancedInfo']}
                                onUpdateSettings={updateSettings}
                            />

                            <CreateComponents 
                                key={'showFinishedTasks'}
                                id={'showFinishedTasks'}
                                name={CapitalizeWords('showFinishedTasks')}
                                componentValue={settings['showFinishedTasks']}
                                onUpdateSettings={updateSettings}
                            />

                            {Object.entries(settings[0]).sort().map(([key, value]) => {
                                if(key === 'user' || key ==='showAdvancedInfo' || key ==='showFinishedTasks') {
                                    return null;
                                } else {
                                    return (
                                        (<CreateComponents 
                                            key={key} 
                                            id={key} 
                                            name={CapitalizeWords(key)} 
                                            componentValue={value}
                                            onUpdateSettings={updateSettings}
                                        />)
                                    )
                                }
                            })}
                        </>
                    ) : null}   
                </div>
            </div>
        </>
     );
}




function CreateComponents(props) {
    const { name, id, componentValue, onUpdateSettings } = props;
    const [color, setColor] = useState(componentValue);
    const [editMode, setEditMode] = useState(false);

    //console.log(componentValue)

    const handleColorChange = (value) => {
        setColor(value);
        if (value !== color) {
            onUpdateSettings(id, value)
        }
    }

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleColorChange(e.target.value);
        } else if (e.key === 'Escape') {
            
        }
    }

    const handleEditModeChange = () => {
        setEditMode(!editMode);
    }

    return (
            <div className='settings-component'>
                <label className='settings-component-name'>
                    {name}
                </label>
                {editMode ? 
                (
                    <input
                        autoFocus
                        type={`text`}
                        className='settings-color'
                        value={color}
                        onBlur={handleEditModeChange}
                        onKeyDown={handleInputKeyDown}
                    ></input>
                ) 
                : 
                (
                    <>
                        <label className='settings-color' onDoubleClick={handleEditModeChange}>
                            {color}
                        </label>
                    </>
                )}
                <div className='settings-color-card' style={{'background-color' : `${color}`}}></div>
            </div>
    )
}

function CapitalizeWords(string, split = '_') {
    return string
    .split(split)
    .map(word => {
        if (word === 'bg') {
            word = 'Background'
        } else if (word === 'btn') {
            word = 'Button'
        } else if (word === 'showAdvancedInfo') {
            word = 'Show Advanced Info'
        } else if (word === 'showFinishedTasks') {
            word = 'Show Finished Tasks'
        } else {
            word = word.charAt(0).toUpperCase() + word.slice(1)
        }
        return word
    })
    .join(' ');
}
 
export default Settings;