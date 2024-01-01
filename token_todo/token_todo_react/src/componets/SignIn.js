import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = ({ onSignIn }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/user/login",
        formData
      );
      const user = response.data;
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
        localStorage.setItem("username", response.data.username);
        onSignIn(user);
        navigate("/");
      }
      setFormData({
        username: "",
        password: "",
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Incorrect username or password");
      } else {
        console.error("Error signing in:", error);
        setError("Internal Server Error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h2 className='mb-4 text-2xl font-semibold'>Sign In</h2>
      {error && <p className='mb-4 text-red-500'>{error}</p>}
      <form onSubmit={handleSubmit} className='w-full max-w-md'>
        <div className='mb-4'>
          <label
            htmlFor='username'
            className='block mb-2 text-sm font-bold text-gray-700'
          >
            Username
          </label>
          <input
            type='text'
            id='username'
            name='username'
            value={formData.username}
            onChange={handleChange}
            className='w-full px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
            required
          />
        </div>
        <div className='mb-6'>
          <label
            htmlFor='password'
            className='block mb-2 text-sm font-bold text-gray-700'
          >
            Password
          </label>
          <input
            type='password'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            className='w-full px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
            required
          />
        </div>
        <div className='flex items-center justify-between'>
          <button
            type='submit'
            className='px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline'
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          <Link
            to='/signup'
            className='inline-block text-sm font-bold text-blue-500 align-baseline hover:text-blue-800'
          >
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
