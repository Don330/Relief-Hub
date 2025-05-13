import React from "react";

const AISuggestionPopup = ({ isOpen, onClose, suggestions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">AI Recommendations</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium text-lg mb-2">Based on your request:</h3>
          <div className="bg-blue-50 p-4 rounded-md">
            {suggestions.map((suggestion, index) => (
              <p key={index} className="mb-2">
                {suggestion}
              </p>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-600 hover:bg-slate-800 text-white py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISuggestionPopup;
