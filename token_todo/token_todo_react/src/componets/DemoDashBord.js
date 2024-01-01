import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const DemoDashBord = () => {
  const [tasks, setTasks] = useState([
    { _id: "1", task: "Demo Task 1" },
    { _id: "2", task: "Demo Task 2" },
    { _id: "3", task: "Demo Task 3" },
  ]);
  const [newTask, setNewTask] = useState("");
  const [editTask, setEditTask] = useState({ id: "", task: "" });
  const [interactionCount, setInteractionCount] = useState(0);

  const handleInteraction = () => {
    setInteractionCount(interactionCount + 1);
    if (interactionCount >= 4) {
      // After 5 interactions, navigate to sign-in
      return <NavLink to='/signin' />;
    }
  };

  const addTask = () => {
    setTasks([...tasks, { _id: tasks.length + 1, task: newTask }]);
    setNewTask("");
    handleInteraction();
  };

  const updateTask = () => {
    const updatedTasks = tasks.map((t) =>
      t._id === editTask.id ? { ...t, task: editTask.task } : t
    );
    setTasks(updatedTasks);
    setEditTask({ id: "", task: "" });
    handleInteraction();
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((t) => t._id !== taskId);
    setTasks(updatedTasks);
    handleInteraction();
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='flex justify-center mt-4'>
        <Link
          to='/signin'
          className='px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline'
        >
          Go to SignIn
        </Link>
        <Link
          to='/signup'
          className='px-4 py-2 ml-4 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline'
        >
          Go to SignUp
        </Link>
      </div>
      <h2 className='mb-4 text-2xl font-semibold'>Demo Dashboard</h2>
      <div className='mb-4'>
        <label
          className='block mb-2 text-sm font-bold text-gray-700'
          htmlFor='newTask'
        >
          Add New Task:
        </label>
        <div className='flex'>
          <input
            className='w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
            id='newTask'
            type='text'
            placeholder='New Task'
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button
            className='px-4 py-2 ml-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline'
            onClick={addTask}
          >
            Add
          </button>
        </div>
      </div>
      <ul className='pl-4 list-disc'>
        {tasks.map((task) => (
          <li key={task._id} className='mb-2'>
            {task.task}
            <button
              className='px-2 py-1 ml-2 font-bold text-white bg-yellow-500 rounded hover:bg-yellow-700 focus:outline-none focus:shadow-outline'
              onClick={() => setEditTask({ id: task._id, task: task.task })}
            >
              Edit
            </button>
            <button
              className='px-2 py-1 ml-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline'
              onClick={() => deleteTask(task._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {editTask.id && (
        <div className='mt-4'>
          <label
            className='block mb-2 text-sm font-bold text-gray-700'
            htmlFor='editTask'
          >
            Edit Task:
          </label>
          <div className='flex'>
            <input
              className='w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
              id='editTask'
              type='text'
              placeholder='Edit Task'
              value={editTask.task}
              onChange={(e) =>
                setEditTask({ ...editTask, task: e.target.value })
              }
            />
            <button
              className='px-4 py-2 ml-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline'
              onClick={updateTask}
            >
              Update
            </button>
          </div>
        </div>
      )}
      {interactionCount < 5 && (
        <button
          className='px-4 py-2 mt-4 font-bold text-white bg-gray-500 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline'
          onClick={handleInteraction}
        >
          Interact ({5 - interactionCount} interactions left)
        </button>
      )}
    </div>
  );
};

export default DemoDashBord;
