import { useEffect, useState } from "react"
import {collection, doc, getDocs} from "firebase/firestore";
import {db} from "./firebase";


const Events = () =>{
    const [event, selectedEvent] = useState(null);
    const [disasters, setDisasters] = useState([]);

    useEffect(() => {
        const fetchDisasters = async () => {
            const querySnapshot = await getDocs(collection(db, "disasters"));
            let disasterList = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.location) {
                    disasterList.push({
                        id: doc.id,
                            type: data.type || "Unknown Event",
                            location: data.location.latitude && data.location.longitude
                                ? `${data.location.latitude}, ${data.location.longitude}`
                                : "No Location",
                            severity: data.severity || "Unknown Severity",
                            time: data.time?.seconds
                                ? new Date(data.time.seconds * 1000).toLocaleString("en-AU", {
                                    timeZone: "Australia/Sydney",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                })
                                : "No Time Available",
                        });
                }
            });
            setDisasters(disasterList);
        };
        fetchDisasters();
    }, []);

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Events</h1>
            <div>
                <ul className="space-y-4">
                    {disasters.map((disaster) => 
                        <li key={disaster.id} className="border p-4 rounded-lg shadow-md bg-white">
                            <p className="text-lg font-bold">Event: {disaster.type}</p>
                            <p className="text-gray-700">Time: {disaster.time}</p>
                            <p className="text-gray-700">Location: {disaster.location}</p>
                            <p className="text-gray-700">Severity: {disaster.severity}</p>
                        </li>
                        )}
                </ul>
            </div>
        </div>
    );
};

export default Events;