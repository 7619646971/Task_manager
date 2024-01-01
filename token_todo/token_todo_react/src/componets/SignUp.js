import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if the username and password are provided
      if (
        !formData.username ||
        !formData.password ||
        formData.password !== formData.confirmPassword
      ) {
        setError("Please fill in all fields and make sure passwords match");
        return;
      }

      // Make an API request to SignUp
      const response = await axios.post(
        "http://localhost:5000/user/registration",
        {
          username: formData.username,
          password: formData.password,
        }
      );

      if (response.status === 204) {
        // SignUp successful, navigate to SignIn
        navigate("/signin");
      } else {
        setError("Error creating user");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Username already exists, display a specific error message
        setError("Username already exists. Please choose another username.");
      } else {
        console.error("Error signing up:", error);
        setError("Internal Server Error");
      }
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-full max-w-md'>
        <form
          className='px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md'
          onSubmit={handleSubmit}
        >
          <h2 className='mb-4 text-2xl font-semibold'>Sign Up</h2>
          {error && <p className='mb-4 text-red-500'>{error}</p>}
          <div className='mb-4'>
            <label
              className='block mb-2 text-sm font-bold text-gray-700'
              htmlFor='username'
            >
              Username:
            </label>
            <input
              className='w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
              id='username'
              type='text'
              placeholder='Username'
              name='username'
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className='mb-4'>
            <label
              className='block mb-2 text-sm font-bold text-gray-700'
              htmlFor='password'
            >
              Password:
            </label>
            <input
              className='w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
              id='password'
              type='password'
              placeholder='Password'
              name='password'
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className='mb-6'>
            <label
              className='block mb-2 text-sm font-bold text-gray-700'
              htmlFor='confirmPassword'
            >
              Confirm Password:
            </label>
            <input
              className='w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
              id='confirmPassword'
              type='password'
              placeholder='Confirm Password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center justify-between'>
            <button
              className='px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline'
              type='submit'
            >
              Sign Up
            </button>
            <Link
              to='/signin'
              className='inline-block text-sm font-bold text-blue-500 align-baseline hover:text-blue-800'
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
