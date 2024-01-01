// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AuthenticateDashBord = ({ user, onSignOut }) => {
//   const [tasks, setTasks] = useState([]);
//   const [newTask, setNewTask] = useState("");
//   const [editTask, setEditTask] = useState({ id: "", task: "" });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = () => {
//     setLoading(true);
//     axios
//       .get(`http://localhost:5000/tasks`)
//       .then((res) => {
//         setTasks(res.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching tasks:", error);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   const addTask = () => {
//     try {
//       if (newTask !== "") {
//         axios.post(`http://localhost:5000/task`, { task: newTask }).then(() => {
//           fetchTasks();
//           setNewTask("");
//         });
//       } else {
//         alert("Fill all the fields before submitting.");
//       }
//     } catch (error) {
//       console.error("Error adding data:", error);
//     }
//   };

//   const updateTask = () => {
//     try {
//       axios
//         .put(`http://localhost:5000/task/${editTask.id}`, {
//           task: editTask.task,
//         })
//         .then(() => {
//           fetchTasks();
//           setEditTask({ id: "", task: "" });
//         });
//     } catch (error) {
//       console.error("Error updating data:", error);
//     }
//   };

//   const deleteTask = (taskId) => {
//     axios
//       .delete(`http://localhost:5000/task/${taskId}`, {})
//       .then(() => {
//         fetchTasks();
//       })
//       .catch((error) => {
//         console.error("Error deleting task:", error);
//       });
//   };

//   const handleTaskDoubleClick = (taskId, currentTask) => {
//     // Set the task in edit mode on double-click
//     setEditTask({ id: taskId, task: currentTask });
//   };

//   return (
//     <div className="container p-4 mx-auto">
//     <h2 className="mb-4 text-2xl font-semibold text-center">
//       Dashboard - Welcome, {user.username}!
//     </h2>
//     <button
//       className="w-full px-4 py-2 mb-4 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
//       onClick={onSignOut}
//     >
//       Sign Out
//     </button>
//     <div className="mb-4">
//       <label
//         className="block mb-2 text-sm font-bold text-gray-700"
//         htmlFor="newTask"
//       >
//         Add New Task:
//       </label>
//       <div className="flex">
//         <input
//           className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
//           id="newTask"
//           type="text"
//           placeholder="New Task"
//           value={newTask}
//           onChange={(e) => setNewTask(e.target.value)}
//         />
//         <button
//           className="px-4 py-2 ml-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
//           onClick={addTask}
//         >
//           Add
//         </button>
//       </div>
//     </div>
//     {loading ? (
//       <div className="flex items-center justify-center">
//         <div className="w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin"></div>
//       </div>
//     ) : (

//       <ul className='pl-4 list-disc'>
//         {tasks.map((task) => (
//           <li
//             key={task._id}
//             className={`mb-2 ${editTask.id === task._id ? "bg-gray-200" : ""}`}
//             onDoubleClick={() => handleTaskDoubleClick(task._id, task.task)}
//           >
//             {editTask.id === task._id ? (
//               <div className='flex'>
//                 <input
//                   className='w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
//                   type='text'
//                   value={editTask.task}
//                   onChange={(e) =>
//                     setEditTask({ ...editTask, task: e.target.value })
//                   }
//                 />
//                 <button
//                   className='px-4 py-2 ml-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline'
//                   onClick={updateTask}
//                 >
//                   Update
//                 </button>
//               </div>
//             ) : (
//               <>
//                 {task.task}
//                 <button
//                   className='px-2 py-1 ml-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline'
//                   onClick={() => deleteTask(task._id)}
//                 >
//                   Delete
//                 </button>
//               </>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default AuthenticateDashBord;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthenticateDashBord = ({ user, handleSignOut }) => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editTask, setEditTask] = useState({ id: "", task: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchTasks = () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Unauthorized. Redirecting to login...");
        navigate("/signin");
        return;
      }

      axios
        .get("http://localhost:5000/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setTasks(res.data));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized. Redirecting to login...");
      } else {
        console.error("Error fetching tasks:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTask = () => {
    try {
      if (newTask !== "") {
        if (isEditing) {
          // Update task when in editing mode
          updateTask();
        } else {
          // Add a new task
          axios
            .post(`http://localhost:5000/task`, { task: newTask })
            .then(() => {
              fetchTasks();
              setNewTask("");
            });
        }
        setIsEditing(false); // Disable editing mode after updating/adding task
      } else {
        alert("Fill all the fields before submitting.");
      }
    } catch (error) {
      console.error("Error adding/updating data:", error);
    }
  };

  const updateTask = () => {
    try {
      axios
        .put(`http://localhost:5000/task/${editTask.id}`, {
          task: editTask.task,
        })
        .then(() => {
          fetchTasks();
          setEditTask({ id: "", task: "" });
        });
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const deleteTask = (taskId) => {
    axios
      .delete(`http://localhost:5000/task/${taskId}`, {})
      .then(() => {
        fetchTasks();
        setIsEditing(false); // Disable editing mode after deleting task
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  const handleEditClick = (taskId, task) => {
    setEditTask({ id: taskId, task });
    setIsEditing(true);
  };

  return (
    <div className='container p-4 mx-auto'>
      <h2 className='mb-4 text-2xl font-semibold text-center'>
        Dashboard - Welcome, {user.username}!
      </h2>
      <button
        className='w-full px-4 py-2 mb-4 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline'
        onClick={handleSignOut}
      >
        Sign Out
      </button>
      <div className='mb-4'>
        <label
          className='block mb-2 text-sm font-bold text-gray-700'
          htmlFor='newTask'
        >
          {isEditing ? "Edit Task:" : "Add New Task:"}
        </label>
        <div className='flex'>
          <input
            className='w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
            id='newTask'
            type='text'
            placeholder={isEditing ? "Edit Task" : "New Task"}
            value={isEditing ? editTask.task : newTask}
            onChange={(e) =>
              isEditing
                ? setEditTask({ ...editTask, task: e.target.value })
                : setNewTask(e.target.value)
            }
          />
          <button
            className={`px-4 py-2 ml-2 font-bold text-white ${
              isEditing
                ? "bg-green-500 hover:bg-green-700"
                : "bg-blue-500 hover:bg-blue-700"
            } rounded focus:outline-none focus:shadow-outline`}
            onClick={addTask}
            disabled={isEditing}
          >
            {isEditing ? "Update" : "Add"}
          </button>
        </div>
      </div>
      {loading ? (
        <div className='flex items-center justify-center'>
          <div className='w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin'></div>
        </div>
      ) : (
        <ul className='pl-4 list-disc'>
          {tasks.map((task) => (
            <li
              key={task._id}
              className={`mb-2 ${
                isEditing && editTask.id === task._id ? "bg-gray-200" : ""
              }`}
            >
              {isEditing && editTask.id === task._id ? (
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
              ) : (
                <>
                  {task.task}
                  <button
                    className='px-2 py-1 ml-2 font-bold text-white bg-yellow-500 rounded hover:bg-yellow-700 focus:outline-none focus:shadow-outline'
                    onClick={() => handleEditClick(task._id, task.task)}
                  >
                    Edit
                  </button>
                  <button
                    className='px-2 py-1 ml-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline'
                    onClick={() => deleteTask(task._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AuthenticateDashBord;
