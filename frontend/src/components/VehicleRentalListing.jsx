const VehicleRentalListing = ({rentals}) => {
  return (
    <div className="rental-preview">
      <h2>Vehicle Model: {rentals.model}</h2>
      <p>Category: {rentals.category}</p>
      <p>Daily Price: ${rentals.dailyPrice.toFixed(2)}</p>
      <p>Status: {rentals.availabilityStatus}</p>
    </div>
  );
};

export default VehicleRentalListing;
