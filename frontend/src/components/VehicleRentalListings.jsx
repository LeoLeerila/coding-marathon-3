import VehicleRentalListing from "./VehicleRentalListing";

const VehicleRentalListings = ({rentals}) => {
  return (
    <div className="rental-list">
      {rentals && rentals.map((e)=> <VehicleRentalListing key={e._id} rentals={e}/>)}
    </div>
  );
};

export default VehicleRentalListings;
