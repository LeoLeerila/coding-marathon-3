import VehicleRentalListing from "./VehicleRentalListing";

const VehicleRentalListings = ({ rentals }) => {
  return (
    <div className="rental-list">
      {rentals.map((rental) => <VehicleRentalListing key={rental._id} rentals={rental}/>)}
    </div>
  );
};

export default VehicleRentalListings;
