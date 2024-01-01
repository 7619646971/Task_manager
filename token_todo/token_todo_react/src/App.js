import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./componets/SignIn";
import SignUp from "./componets/SignUp";
import DemoDashBord from "./componets/DemoDashBord";
import AuthenticateDashBord from "./componets/AuthenticateDashBord";
//import axios from "axios";

const App = () => {
  const [user, setUser] = useState(false);

  useEffect(() => {
    verifyUserLogin();
  }, [user]);

  const verifyUserLogin = async () => {
    const isToken = localStorage.getItem("token");
    setUser(isToken);
    // try {
    //   if (localStorage.getItem("token") !== null) {
    //     const a = await axios.post("http://localhost:5000/user/verify");
    //     if (a.data) {
    //       localStorage.getItem("token") && a.data && setUser(true);
    //     } else {
    //       setUser(false);
    //     }
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const handleSignOut = () => {
    localStorage.clear();
  };

  const handleSignIn = (user) => {
    console.log(user);
    setUser(true);
  };

  return (
    <Router>
      <Routes>
        <Route path='/signin' element={<SignIn onSignIn={handleSignIn} />} />
        <Route path='/signup' element={<SignUp />} />
        <Route
          path='/'
          element={
            user ? (
              <AuthenticateDashBord user={user} handleSignOut={handleSignOut} />
            ) : (
              <DemoDashBord />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
