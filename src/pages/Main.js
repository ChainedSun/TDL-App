import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import React, { useEffect, useRef, useState } from 'react';

import { Colapse, Expand } from './Icons';

import './Main.css';

const firestore = firebase.firestore()

function Main() {
    const taskCollection = firestore.collection('tasks')

    const [tasks, setTasks] = useState([]);
    const [newTaskName, setNewTaskName] = useState('');
    

    useEffect(() => {
        const unsubscribe = taskCollection.orderBy('timeCreated').onSnapshot((snapshot) => {
            const updatedTasks = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setTasks(updatedTasks)
        })
    
        return () => {
            unsubscribe()
        }
    }, [])
    
    const createTask = async (e) => {
        e.preventDefault()
        if(newTaskName === '') {
            console.log('Task Name can not be empty!')
        } else {
            const newTask = {
                name: newTaskName,
                description: '',
                timeCreated: firebase.firestore.FieldValue.serverTimestamp(),
                finished: false
            }

            await taskCollection.add(newTask)
            setNewTaskName('')
        }
    }

    const updateTask = async (taskValue) => {
        const taskDoc = firestore.collection('tasks').doc(taskValue.id)
        await taskDoc.update({
            ...taskValue  
        })
        .catch((error) => {
          console.error('Error updating task:', error);
        });
    }

    const removeTask = async (taskId) => {
        await taskCollection.doc(taskId).delete()
        .then(() => {
            console.log('Task deleted successfully!');
        })
        
        .catch ((err) => {
            console.error('Error deleting document: ', err);
        })
      };


    return ( 
        <>
            <div className='task-container'>
                <div className='task-list'>
                    {tasks.length !== 0 && tasks.map(task => <Task key={task.id} task={task} showFinished={true} onUpdate={updateTask} onRemove={removeTask}/>)}
                    
                </div>
                <div className='new-task-container'>
                    <form onSubmit={createTask}>
                            <input
                            autoFocus
                            className='input-text new-task-input'
                            type='text'
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                            placeholder='Task Name...'
                            ></input>
                            <button className='submit-btn' type='submit'>+</button>
                    </form>
                </div>
            </div>
        </> 
    );
}

function Task(props) {
    const { name, id, finished, description, timeCreated} = props.task
    const { onUpdate, onRemove, showFinished } = props
    const [taskName, setTaskName] = useState(name);
    const [showNote, setShowNote] = useState(false);
    const [note, setNote] = useState(description);
    const [timestamp, setTimestamp] = useState(timeCreated);
    const [completed, setCompleted] = useState(finished);
    const [editName, setEditName] = useState(false);
    const [editNote, setEditNote] = useState(false);

    useEffect(() => {
        handleUpdate()
    }, [taskName, note, completed])
    
    
    
    const handleRemove = () => {
        onRemove(id)
    }

    const handleUpdate = () => {
        onUpdate({
            id: id,
            name: taskName,
            description: note,
            finished: completed
        })
    }

    const handleComplete = () => {
        setCompleted(!completed)
    }

    const handleEditName = (event) => {
        if(event.key === 'Enter' && !(event.shiftKey)) {
            handleUpdate()
            setEditName(!editName)
        } else if(event.key === 'Escape') {
            setTaskName(name)
            setEditName(!editName)
        }
    }

    const handleEditNote = (event) => {
        if(event.key === 'Enter' && !(event.shiftKey)) {
            handleUpdate()
            setEditNote(!editNote)
        } else if(event.key === 'Escape') {
            setEditNote(!editNote)
            setNote(note)
        }
    }

    const handleBlurName = () => {
        setEditName(!editName)
        setTaskName(name)
    }
    
    const handleBlurNote = () => {
        setEditNote(!editNote)
        setNote(note)
    }

    return (
        <>
            <div className={`entry-container ${completed ? 'task-completed' : ''}`}>
                
                <div className='title-container'>
                    {(completed ? <div className='inactive-complete-btn'/> : <button className='complete-btn' onClick={handleComplete}></button>)}
                    {
                        !editName 
                        ? 
                            <p className={`task-name`} onDoubleClick={
                                () => finished ? null : setEditName(!editName)
                            } style={(!taskName ? {'color': '#ffffff5f'} : {})}>{(taskName ? taskName : 'Task Name...')}</p> 
                        : 
                            <input
                                autoFocus
                                className={`name-edit`} 
                                type='text'
                                value={taskName} 
                                onChange={(e) => setTaskName(e.target.value)}
                                onKeyDown={handleEditName}
                                onBlur={handleBlurName}
                                onFocus={(e) => e.target.select()}
                            ></input>
                    }
                    <button className='show-note-btn' onClick={() => setShowNote(!showNote)}>{(showNote ? <Colapse /> : <Expand />)}</button>
                    <button className='remove-btn' onClick={handleRemove}>X</button>
                    
                </div>
                <div className='note-container'>
                    {
                        !editNote
                        ? 
                            (showNote ? 
                                <p className={`task-note`} onDoubleClick={
                                    () => finished ? null : setEditNote(!editNote)
                                }
                                style={(!note ? {'color': '#ffffff5f'} : {})}>{(note ? note : 'Note...')}</p> : null)
                        : 
                            <input
                                autoFocus
                                className={`note-edit`} 
                                type='text'
                                value={note}  
                                onChange={(e) => setNote(e.target.value)}
                                onKeyDown={handleEditNote}
                                onBlur={handleBlurNote}
                                onFocus={(e) => e.target.select()}
                            ></input>
                    }
                </div>
                
            </div>
        </>
    )
}


export default Main;