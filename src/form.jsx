import React, { useState } from "react";
import { addDoc, collection, GeoPoint, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

// You'll need to enable the Google Maps Geocoding API and set your key in .env as REACT_APP_GEOCODING_API_KEY
const GEOCODING_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";

const Form = ({ isOpen, onClose, onSubmit }) => {

  const initialFormData = {
    eventType: "Hurricane",
    address: "",
    severity: "",
    time: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [advice, setAdvice] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const geocodeAddress = async (address) => {
    const apiKey = process.env.REACT_APP_GEOCODING_API_KEY;
    const url = `${GEOCODING_API_URL}?address=${encodeURIComponent(address)}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.results || data.results.length === 0) throw new Error("Address not found");
    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading"); setErrorMsg(""); setAdvice("");
    try {
      const { lat, lng } = await geocodeAddress(formData.address);
      const selectedTime = new Date(formData.time);
      const firestoreTimestamp = Timestamp.fromDate(selectedTime);

      await addDoc(collection(db, "disasters"), {
        type: formData.eventType,
        location: new GeoPoint(lat, lng),
        severity: parseFloat(formData.severity),
        time: firestoreTimestamp,
        description: formData.description,
        address: formData.address
      });
      
      
      setStatus("idle");
      onSubmit?.(formData);
      setFormData(initialFormData);
      setAdvice("");
      setErrorMsg("");
      //window.location.reload();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Report Event</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Event Type</label>
            <select name="eventType" value={formData.eventType} onChange={handleChange} className="w-full border rounded-md py-2 px-3" required>
              <option value="Hurricane">Hurricane</option>
              <option value="Cyclone">Cyclone</option>
              <option value="Earthquake">Earthquake</option>
              <option value="Wildfire">Wild Fire</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St, Suburb, State" className="w-full border rounded-md py-2 px-3" required />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Severity (1-10)</label>
            <input type="number" name="severity" min="1" max="10" value={formData.severity} onChange={handleChange} className="w-full border rounded-md py-2 px-3" required />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Time</label>
            <input type="datetime-local" name="time" value={formData.time} onChange={handleChange} className="w-full border rounded-md py-2 px-3" required />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border rounded-md py-2 px-3" rows="4" placeholder="Describe what you’re seeing..." required />
          </div>

          <button type="submit" disabled={status=== 'loading'} className="bg-slate-600 hover:bg-slate-800 text-white py-2 px-4 rounded w-full mb-4">
            {status === 'loading' ? 'Submitting…' : 'Submit Request'}
          </button>

          {status === 'error' && <div className="text-red-600 mb-4">Error: {errorMsg}</div>}
          {advice && <div className="bg-blue-50 border-l-4 border-blue-400 p-4 max-h-48 overflow-y-auto"><h3 className="font-semibold mb-2">AI Advice:</h3><pre className="whitespace-pre-wrap">{advice}</pre></div>}
        </form>
      </div>
    </div>
  );
};

export default Form;
