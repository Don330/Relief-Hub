# Disaster Relief Web App

A React-based web application for reporting and visualizing natural disasters using **Firebase Firestore** and **Google Maps API**.

---

## Getting Started

### **User must have their own Google map api and firestore api**

### **Clone the Repository**
```sh
git clone https://github.com/Don330/Disaster-relief.git
cd Disaster-relief

## Install Dependencies
npm install

Create .env file in root directory
##Add following
REACT_APP_FIREBASE_API_KEY=your-api-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

##Start development server
npm start

will run on http://localhost:3000/