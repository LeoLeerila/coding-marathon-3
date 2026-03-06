import VehicleRentalListing from "./VehicleRentalListing";

const VehicleRentalListings = ({rentals}) => {
  return (
    <div className="rental-list">
      {rentals && rentals.map((e, index)=> <VehicleRentalListing key={e || index} rentals={rentals}/>)}
    </div>
  );
};

export default VehicleRentalListings;
