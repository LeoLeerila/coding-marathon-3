import { useState, useEffect, use } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditVehicleRentalPage = () => {
  const navigate = useNavigate();
  const [vehicleModel, setVehicleModel] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  // -> agency
  const [name, setName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [fleetSize, setFleetSize] = useState(""); //does not use useField as I didn't know how to implement it handling numbers (and restrictions like minvalue and step).
  // -> location
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  // -> back to normal
  const [dailyPrice, setDailyPrice] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState("");
  const [bookingDeadline, setBookingDeadline] = useState("");
  const [insurancePolicy, setInsurancePolicy] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  useEffect(() => {
    const getVeh = async () => {
      const res = await fetch(`/api/vehicleRentals/${id}`);
      if (!res.ok) {
        setError(res)
        setLoading(false)
        console.log(response)
      }

      const veh = await res.json();
      console.log(veh)
      console.log(veh.vehicleModel)
      setVehicle(veh);
      setVehicleModel(veh.vehicleModel);
      setCategory(veh.category);
      setDescription(veh.description);
      setName(veh.agency.name);
      setContactEmail(veh.agency.contactEmail);
      setFleetSize(veh.agency.fleetSize);
      setCity(veh.location.city);
      setState(veh.location.state);
      setDailyPrice(veh.dailyPrice);
      setAvailabilityStatus(veh.availabilityStatus);
      const actualDate = new Date(veh.bookingDeadline);
      setBookingDeadline(actualDate);
      setInsurancePolicy(veh.insurancePolicy)

      setLoading(false);
    }
    getVeh();
  }, [id]);

  const submitForm = async (e) => {
    e.preventDefault();
    const newVehicle = {
      vehicleModel,
      category,
      description,
      agency: {
        name,
        contactEmail,
        fleetSize,
      },
      location: {
        city,
        state,
      },
      dailyPrice,
      availabilityStatus,
      bookingDeadline,
      insurancePolicy
    }
    const res = await fetch(`/api/vehicleRentals/${id}`, {
      method: "PUT",
      body: JSON.stringify(newVehicle),
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    if (!res.ok) {
      console.log(response)
      setError(res)
      setLoading(false)
    }
    navigate("/");
  }

  return (
    <div className="create">
      {error && <div>{error}</div>}
      {loading && <div>Loading item...</div>}
      {vehicle && (
        <>
          <h2>Edit vehicle details</h2>
          <form onSubmit={submitForm}>
            <label>Vehicle Model:</label>
            <input type="text" value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} />
            <label>Change category:</label>
            <select onChange={(e) => setCategory(e.target.value)}>
              <option value="Economy">Economy</option>
              <option value="Luxury">Luxury</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
              <option value="Truck">Truck</option>
            </select>
            <label>Edit description:</label>
            <textarea type="text" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
            <label>Agency Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            <label>Agency Email:</label>
            <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />
            <label>Fleet Size:</label>
            <input type="number" min="0" value={fleetSize} onChange={(e) => setFleetSize(e.target.value)} />
            <label>City:</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
            <label>State:</label>
            <input type="text" value={state} onChange={(e) => setState(e.target.value)} required />
            <label>New daily Price:</label>
            <input type="number" step="0.01" min="0" value={dailyPrice} onChange={(e) => setDailyPrice(e.target.value)} required />
            <label>Change availability status:</label>
            <select onChange={(e) => setAvailabilityStatus(e.target.value)}>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <label>Change booking deadline:</label>
            <input type="date" value={bookingDeadline} onChange={(e) => setBookingDeadline(e.target.value)} />
            <label>Change insurance policy:</label>
            <input type="text" value={insurancePolicy} onChange={(e) => setVehicle(e.target.value)} required />
            <button>Update Vehicle Rental</button>
          </form>
        </>
      )}
    </div>
  );
};

export default EditVehicleRentalPage;
