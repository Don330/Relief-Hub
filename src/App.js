import React, { useState } from "react";
import MapComponent from "./MapComponent"; // Import Map
import Events from "./Events";
import Form from "./form"; // Import the new Form component
import AISuggestionPopup from "./AISuggestionPopup";
import image from "./asset/landing.png";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignUp from "./SignUp";
import Landing from "./Landing";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/map" element={<MapComponent />} />
        <Route path="/Landing" element={<Landing />} />
      </Routes>
    </Router>
  );
};

export default App;