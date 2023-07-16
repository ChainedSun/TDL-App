import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import React, { useEffect, useState } from 'react';

import './Main.css';

const firestore = firebase.firestore()

function Main() {
    const taskCollection = firestore.collection('tasks')
    const taskRef = taskCollection.orderBy('timeCreated')

    const [tasks, setTasks] = useState([]);
    const [newTaskName, setNewTaskName] = useState('');
    

    useEffect(() => {
        taskRef.get()
        .then((querySnapshot) => {
            const newTasks = []
            querySnapshot.forEach((doc) => {
                newTasks.push( {id: doc.id, ...doc.data()} )
            })
            setTasks(newTasks)
        })
        .catch((err) => {
            console.error(err)
        })
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
        .then(() => {
          console.log('Task updated successfully');
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
                            <input className='input-text new-task-input' type='text' value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} placeholder='Task Name...'></input>
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

    return (
        <>
            <div className='entry-container'>
                <button className='complete-btn'></button>
                <p className='task-name'>{name}</p>
                <button className='remove-btn' onClick={handleRemove}>X</button>
            </div>
        </>
    )
}


export default Main;