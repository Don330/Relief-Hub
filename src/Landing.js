import React, { useState } from "react";
import MapComponent from "./MapComponent";
import Events from "./Events";
import Form from "./form";  // Ensure correct casing
import AISuggestionPopup from "./AISuggestionPopup";
import { getAuth, signOut } from "firebase/auth";
import image from "./asset/landing.png";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
// No need for Router here if Landing is a page component

const Landing = () => {

  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAIPopupOpen, setIsAIPopupOpen] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);

  const auth = getAuth();

  // Mock or real suggestion generator
  const generateAISuggestions = async (description) => {
    // Call your /api/advice here instead of mocks
    try {
      const res = await fetch('/api/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventDescription: description })
      });
      const data = await res.json();
      // If your backend returns { steps: [] }
      setAiSuggestions(Array.isArray(data.steps) ? data.steps : [data.advice]);
    } catch (err) {
      console.error('AI error:', err);
      setAiSuggestions([`Error: ${err.message}`]);
    }
    setIsAIPopupOpen(true);
  };

  const handleFormSubmit = (formData) => {
    // formData.description contains the event description
    generateAISuggestions(formData.description);
    setIsFormOpen(false);
  };

  const handleSignOut = () => {
    signOut(auth)
    .then(() => {
        console.log("User signed out");
        navigate("/");
    })
    .catch((error) => {
        console.error("Error signing out: ", error);
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/3 p-4 overflow-y-auto bg-gray-100">
        <div className="flex items-center mb-4">
          <button className="shadow-md bg-blue-600 hover:bg-blue-800 text-white py-1 px-3 rounded text-xl font-sans"
          onClick={handleSignOut}
          >Logout</button>
          <h1 className="mx-auto text-2xl font-bold">Relief Hub</h1>
          <button
            className="shadow-md bg-slate-600 hover:bg-slate-800 text-white py-1 px-3 rounded text-xl font-sans"
            onClick={() => setIsFormOpen(true)}
          >
            Report Event
          </button>
        </div>
        <Events />
      </div>

      <div className="w-full md:w-2/3 p-4">
        <div className="w-full h-[40vh] md:h-full rounded-lg shadow-lg overflow-hidden">
          <MapComponent />
        </div>
      </div>

      <Form
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <AISuggestionPopup
        isOpen={isAIPopupOpen}
        onClose={() => setIsAIPopupOpen(false)}
        suggestions={aiSuggestions}
      />
    </div>
  );
};

export default Landing;
