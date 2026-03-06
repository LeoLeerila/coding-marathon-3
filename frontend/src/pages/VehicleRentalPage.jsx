import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const VehicleRentalPage = () => {

  const params = useParams();
  const [rentals, setRentals] = useState(null);
  const navigate = useNavigate();
  const { id } = params;


  useEffect(() => {
    const fetchRentals = async () => {
      const response = await fetch(`/api/vehicleRentals/${id}`);

      if (!response.ok) {
        console.error("Failed to fetch rental details");
        return;
      }
      const rentalData = await response.json();
      setRentals(rentalData);
    }
    fetchRentals();
  }, [id]);

  const deleteRental = async (id) => {
    const response = await fetch(`/api/vehicleRentals/${id}`, {
      method: 'DELETE',
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
      <h2>{rentals.name}</h2>
      <p>{rentals.vehicleModel}</p>
      <p>{rentals.category}</p>
      <p>{rentals.description}</p>
      <p>{rentals.dailyPrice}</p>
      <p>{rentals.agency}</p>
      <p>{rentals.agency.name}</p>
      <p>{rentals.agency.contactEmail}</p>
      <p>{rentals.agency.fleetSize}</p>
      <p>{rentals.location}</p>
      <p>{rentals.location.city}</p>
      <p>{rentals.location.state}</p>
      <p>{rentals.listingDate}</p>
      <p>{rentals.availabilityStatus}</p>
      <p>{rentals.bookingDeadline}</p>
      <button onClick={() => navigate("/")}>back</button>
      <button onClick={() => deleteRental(rentals._id)}>Delete</button>
      <button onClick ={() => navigate(`/edit/${rentals._id}`)}>Edit</button>
    </div>
  );
};

export default VehicleRentalPage;
