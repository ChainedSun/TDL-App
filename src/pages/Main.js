import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import React, { useEffect, useRef, useState } from 'react';

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
                    {tasks.length !== 0 && tasks.map(task => <Task key={task.id} task={task} advancedView={true} showFinished={true} onUpdate={updateTask} onRemove={removeTask}/>)}
                    
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
    const { advancedView, onUpdate, onRemove, showFinished } = props
    const [taskName, setTaskName] = useState(name);
    const [taskDescription, setTaskDescription] = useState(description);
    const [timestamp, setTimestamp] = useState(timeCreated);
    const [completed, setCompleted] = useState(finished);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        handleUpdate()
    }, [taskDescription, completed])
    
    
    
    const handleRemove = () => {
        onRemove(id)
    }

    const handleUpdate = () => {
        onUpdate({
            id: id,
            name: taskName,
            description: taskDescription,
            finished: completed
        })
    }

    const handleComplete = () => {
        setCompleted(!completed)
    }

    const handleEditMode = (event) => {
        console.log(event.key)
        if(event.key === 'Enter' && !(event.shiftKey)) {
            handleUpdate()
            setEditMode(!editMode)
        } else if(event.key === 'Escape') {
            setTaskName(name)
            setEditMode(!editMode)
        }
    }

    const handleBlur = () => {
        setEditMode(!editMode)
        setTaskName(name)
    }

    return (
        <>
            <div className={`entry-container ${completed ? 'task-completed' : ''}`}>
                {completed && (<div className='inactive-complete-btn'/>)}
                {!completed && (<button className='complete-btn' onClick={handleComplete}></button>)}
                {!editMode ? <p className={`task-name`} onDoubleClick={() => setEditMode(!editMode)}>{taskName}</p> : 
                <input
                    autoFocus
                    className={`name-edit`} 
                    type='text' 
                    value={taskName} 
                    onChange={(e) => setTaskName(e.target.value)}
                    onKeyDown={handleEditMode}
                    onBlur={handleBlur}
                    onFocus={(e) => e.target.select()}
                ></input>}
                <button className='remove-btn' onClick={handleRemove}>X</button>
            </div>
        </>
    )
}


export default Main;