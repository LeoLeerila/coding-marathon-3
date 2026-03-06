import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const VehicleRentalPage = ({ isAuthenticated }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const params = useParams();
  const [rentals, setRentals] = useState(null);
  const navigate = useNavigate();
  const { id } = params;
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;


  useEffect(() => {
    const fetchRentals = async () => {
      const response = await fetch(`/api/vehicleRentals/${id}`);
      console.log(response)
      if (!response.ok) {
        setError(response)
        setLoading(false)
        console.error("Failed to fetch rental details: ", error);
        return;
      }
      const rentalData = await response.json();
      setRentals(rentalData);
      setLoading(false);
    }
    fetchRentals();
  }, [id]);

  const deleteRental = async (id) => {
    const response = await fetch(`/api/vehicleRentals/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      console.error("Failed to delete rental");
      return;
    } else {
      navigate("/");
    }
  }


  if (!rentals) {
    return <div>Loading...</div>
  }
  return (
    <div className="rental-preview">
      {error && <div>{error}</div>}
      {rentals && (
        <>
          <h2>{rentals.vehicleModel}</h2>
          <p>{rentals.category}</p>
          <p>{rentals.description}</p>
          <p>{rentals.dailyPrice}</p>
          <p>{rentals.agency.name}</p>
          <p>{rentals.agency.contactEmail}</p>
          <p>{rentals.agency.fleetSize}</p>
          <p>{rentals.location.city}</p>
          <p>{rentals.location.state}</p>
          <p>{rentals.listingDate}</p>
          <p>{rentals.availabilityStatus}</p>
          <p>{rentals.bookingDeadline}</p>
          <button onClick={() => navigate("/")}>back</button>
          {isAuthenticated && (
            <>
              <button onClick={() => deleteRental(rentals._id)}>Delete</button>
              <button onClick={() => navigate(`/edit/${rentals._id}`)}>Edit</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default VehicleRentalPage;
