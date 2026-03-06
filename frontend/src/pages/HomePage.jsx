import VehicleRentalListings from "../components/VehicleRentalListings";
import { useEffect, useState } from "react";

const Home = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const fetchRentals = async () => {
      const res = await fetch("/api/vehicleRentals");
      const data = await res.json();
      if(!res.ok){
        setError(response)
        setLoading(false)
        console.error("Failed to fetch rentals:", data.message);
        return;
      }
      setRentals(data);
      setLoading(false);
    }

    fetchRentals();
  }, []);
  return (

    <div className="home">
      {error && <div>{error}</div>}
      {loading && <div>loading</div>}
      {rentals && <VehicleRentalListings rentals={rentals}/>}
    </div>
  );
};

export default Home;
