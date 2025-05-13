// import React, { useEffect, useState } from "react";
// import { GoogleMap, LoadScript, InfoWindow } from "@react-google-maps/api";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "./firebase";

// import changeTHISimage from "./asset/location.png";
// import hurricane from "./asset/hurricane.png";
// import cyclone from "./asset/cyclone.png";
// import earthquake from "./asset/earthquake.png";
// import wildfire from "./asset/forest-fire.png";

// // ✅ Move libraries outside component to avoid re-renders
// const libraries = ["marker"];

// const mapContainerStyle = {
//   width: "100%",
//   height: "100%",
// };

// const center = {
//   lat: -33.8688,
//   lng: 151.2093,
// };

// const disasterIcons = {
//   hurricane,
//   cyclone,
//   earthquake,
//   wildfire,
//   default: changeTHISimage,
// };

// const MapComponent = () => {
//   const [disasters, setDisasters] = useState([]);
//   const [selectedDisaster, setSelectedDisaster] = useState(null);
//   const [map, setMap] = useState(null);

//   // ✅ Fetch disasters from Firestore
//   useEffect(() => {
//     const fetchDisasters = async () => {
//       const querySnapshot = await getDocs(collection(db, "disasters"));
//       const disasterList = [];

//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         const lat = data.location?.latitude;
//         const lng = data.location?.longitude;

//         if (lat && lng) {
//           const formattedTime =
//             data.time?.seconds &&
//             new Date(data.time.seconds * 1000).toLocaleString("en-AU", {
//               timeZone: "Australia/Sydney",
//               year: "numeric",
//               month: "long",
//               day: "numeric",
//               hour: "2-digit",
//               minute: "2-digit",
//               second: "2-digit",
//             });

//           disasterList.push({
//             id: doc.id,
//             type: data.type,
//             location: { lat, lng },
//             severity: data.severity,
//             time: formattedTime || "Unknown Time",
//           });
//         }
//       });

//       setDisasters(disasterList);
//     };

//     fetchDisasters();
//   }, []);

//   // ✅ Add advanced markers to the map
//   useEffect(() => {
//     if (!map || disasters.length === 0) return;

//     const { AdvancedMarkerElement } = window.google.maps.marker;

//     disasters.forEach((disaster) => {
//       const iconUrl =
//         disasterIcons[disaster.type?.toLowerCase()] || disasterIcons.default;

//       const img = document.createElement("img");
//       img.src = iconUrl;
//       img.style.width = "40px";
//       img.style.height = "40px";

//       const marker = new AdvancedMarkerElement({
//         position: disaster.location,
//         map,
//         title: `${disaster.type} - Severity: ${disaster.severity}`,
//         content: img,
//       });

//       marker.addEventListener("gmp-click", () => {
//         setSelectedDisaster(disaster);
//       });
//     });
//   }, [map, disasters]);

//   return (
//     <LoadScript
//       googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
//       libraries={libraries}
//     >
//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         center={center}
//         zoom={8}
//         mapId="cc6c1c13bc4fd60f9" // ✅ hardcoded valid Map ID
//         onLoad={(mapInstance) => setMap(mapInstance)}
//       >
//         {map && selectedDisaster && (
//           <InfoWindow
//             position={selectedDisaster.location}
//             onCloseClick={() => setSelectedDisaster(null)}
//           >
//             <div>
//               <h3>{selectedDisaster.type}</h3>
//               <p>
//                 <strong>Severity:</strong> {selectedDisaster.severity}
//               </p>
//               <p>
//                 <strong>Time:</strong> {selectedDisaster.time}
//               </p>
//             </div>
//           </InfoWindow>
//         )}
//       </GoogleMap>
//     </LoadScript>
//   );
// };

// export default MapComponent;
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
