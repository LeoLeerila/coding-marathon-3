import VehicleRentalListings from "../components/VehicleRentalListings";
import { useEffect, useState } from "react";

const Home = () => {
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const fetchRentals = async () => {
      const res = await fetch("/api/vehicleRentals");
      const data = await res.json();
      if(!res.ok){
        console.error("Failed to fetch rentals:", data.message);
        return;
      }
      setRentals(data);
    }

    fetchRentals();
  }, []);
  return (

    <div className="home">
      <VehicleRentalListings rentals={rentals}/>
    </div>
  );
};

export default Home;
