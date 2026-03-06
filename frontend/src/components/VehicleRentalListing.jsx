const VehicleRentalListing = ({rentals}) => {
  return (
    <div className="rental-preview"><Link to={`/vehicleRentals/${rentals.id}`}>
      <h2>{rentals.model}</h2></Link>
      <p>Category: {rentals.category}</p>
      <p>Daily Price: ${rentals.dailyPrice.toFixed(2)}</p>
      <p>Status: {rentals.availabilityStatus}</p>
    </div>
  );
};

export default VehicleRentalListing;
