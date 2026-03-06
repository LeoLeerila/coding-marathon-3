import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useField from "../hooks/useField";

const AddVehicleRentalPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  // const user = JSON.parse(localStorage.getItem("user"));
  // const token = user ? user.token : null;

  const vehicleModel = useField("text");
  const [category, setCategory] = useState("Economy");
  const description = useField("text");
  // -> agency
  const name = useField("text");
  const contactEmail = useField("email");
  const [fleetSize, setFleetSize] = useState(""); //does not use useField as I didn't know how to implement it handling numbers (and restrictions like minvalue and step).
  // -> location
  const city = useField("text");
  const state = useField("text");
  // -> back to normal
  const [dailyPrice, setDailyPrice] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState("available");
  const [bookingDeadline, setBookingDeadline] = useState("");
  const insurancePolicy = useField("text");

  const submitForm = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    const newVehicle = {
      vehicleModel: vehicleModel.value,
      category,
      description: description.value,
      agency: {
        name: name.value,
        contactEmail: contactEmail.value,
        fleetSize,
      },
      location: {
        city: city.value,
        state: state.value,
      },
      dailyPrice,
      availabilityStatus,
      bookingDeadline,
      insurancePolicy: insurancePolicy.value
    }
    try {
      const res = await fetch("/api/vehicleRentals", {
        method: "POST",
        body: JSON.stringify(newVehicle),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!res.ok) {
        console.log(res)
      }
      navigate("/")
    } catch (err) {
      setError(err.message);
    }
    
    
  };

  return (
    <div className="create">
      <h2>Add a New Vehicle Rental</h2>
      <form onSubmit={submitForm}>
        <label>Vehicle Model:</label>
        <input {...vehicleModel} />
        <label>Category:</label>
        <select onChange={(e) => setCategory(e.target.value)}>
          <option value="Economy">Economy</option>
          <option value="Luxury">Luxury</option>
          <option value="SUV">SUV</option>
          <option value="Van">Van</option>
          <option value="Truck">Truck</option>
        </select>
        <label>Description:</label>
        <textarea {...description} required></textarea>
        <label>Agency Name:</label>
        <input {...name} required />
        <label>Agency Email:</label>
        <input {...contactEmail} required />
        <label>Fleet Size:</label>
        <input type={fleetSize} min="0" onChange={(e) => setFleetSize(e.target.value)} />
        <label>City:</label>
        <input {...city} required />
        <label>State:</label>
        <input {...state} required />
        <label>Daily Price:</label>
        <input type={dailyPrice} step="0.01" min="0" onChange={(e) => setDailyPrice(e.target.value)} required />
        <label>Availability Status:</label>
        <select onChange={(e) => setAvailabilityStatus(e.target.value)}>
          <option value="available">Available</option>
          <option value="rented">Rented</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <label>Booking Deadline:</label>
        <input type="date" value={bookingDeadline} onChange={(e) => setBookingDeadline(e.target.value)} />
        <label>Insurance Policy:</label>
        <input {...insurancePolicy} required />
        <button>Add Vehicle Rental</button>
      </form>
    </div>
  );
};

export default AddVehicleRentalPage;
