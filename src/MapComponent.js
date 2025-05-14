
import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const libraries = [];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: -33.8688,
  lng: 151.2093,
};

const MapComponent = () => {
  const [disasters, setDisasters] = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState(null);

  useEffect(() => {
    const fetchDisasters = async () => {
      const querySnapshot = await getDocs(collection(db, "disasters"));
      const disasterList = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const lat = data.location?.latitude;
        const lng = data.location?.longitude;

        if (lat && lng) {
          disasterList.push({
            id: doc.id,
            type: data.type,
            location: { lat, lng },
            severity: data.severity,
            time: data.time?.seconds
              ? new Date(data.time.seconds * 1000).toLocaleString("en-AU")
              : "Unknown Time",
          });
        }
      });

      setDisasters(disasterList);
    };

    fetchDisasters();
  }, []);

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={8}
        onLoad={(mapInstance) => console.log("Map loaded")}
      >
        {disasters.map((disaster) => (
          <Marker
            key={disaster.id}
            position={disaster.location}
            onClick={() => setSelectedDisaster(disaster)}
            title={`${disaster.type} - Severity: ${disaster.severity}`}
          />
        ))}

        {selectedDisaster && (
          <InfoWindow
            position={selectedDisaster.location}
            onCloseClick={() => setSelectedDisaster(null)}
          >
            <div>
              <h3>{selectedDisaster.type}</h3>
              <p><strong>Severity:</strong> {selectedDisaster.severity}</p>
              <p><strong>Time:</strong> {selectedDisaster.time}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
