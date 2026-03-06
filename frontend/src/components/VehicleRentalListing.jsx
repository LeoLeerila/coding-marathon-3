import { Link } from "react-router-dom";

const VehicleRentalListing = ({ rentals }) => {
  return (
    //this link doesn't work lmao
    <div className="rental-preview">
      <Link to={`/vehicle/${rentals._id}`}>
      <h2>{rentals.vehicleModel}</h2>
      </Link>
      <p>Category: {rentals.category}</p>
      <p>Daily Price: ${rentals.dailyPrice}</p>
      <p>Status: {rentals.availabilityStatus}</p>
    </div>
  );
};

export default VehicleRentalListing;
