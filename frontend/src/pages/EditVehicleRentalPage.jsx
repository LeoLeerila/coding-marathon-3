import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import useField from "../hooks/useField";

const EditVehicleRentalPage = () => {
  const navigate = useNavigate();
  const vehicleModel = useField("text");
  const category = useField("text");
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
  const availabilityStatus = useField("text");
  const bookingDeadline = useField("date");
  const insurancePolicy = useField("text");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const { id } = useParams();
  // const user = JSON.parse(localStorage.getItem("user"));
  // const token = user ? user.token : null;

  useEffect(() => {
    const getVeh = async () => {
      const res = await fetch(`/api/vehicleRentals/${id}`);
      if (!res.ok) {
        setError(res)
        setLoading(false)
        console.log(response)
      }

      const veh = await res.json();
      setVehicle(veh);
      vehicleModel(veh.vehicleModel);
      category(veh.vehicleModel);
      description(veh.description);
      name(veh.agency.name);
      contactEmail(veh.agency.contactEmail);
      setFleetSize(veh.agency.fleetSize);
      city(veh.location.city);
      state(veh.location.state);
      setDailyPrice(veh.dailyPrice);
      availabilityStatus(veh.availabilityStatus);
      bookingDeadline(veh.bookingDeadline);
      insurancePolicy(veh.insurancePolicy)

      setLoading(false);
      setError(false);
    }
    getVeh();
  }, [id]);

  const submitForm = async (e) => {
    e.preventDefault();
    const newVehicle = {
      vehicleModel: vehicleModel.value,
      category: category.value,
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
      availabilityStatus: availabilityStatus.value,
      bookingDeadline: bookingDeadline.value,
      insurancePolicy: insurancePolicy.value
    }
    const res = await fetch(`/api/vehicleRentals/${id}`, {
      method: "PUT",
      body: JSON.stringify(newVehicle),
      headers: { 'Content-Type': 'application/json' }
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
            <input {...vehicleModel} />
            <label>Change category:</label>
            <select {...category}>
              <option value="Economy">Economy</option>
              <option value="Luxury">Luxury</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
              <option value="Truck">Truck</option>
            </select>
            <label>Edit description:</label>
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
            <label>New daily Price:</label>
            <input type={dailyPrice} step="0.01" min="0" onChange={(e) => setDailyPrice(e.target.value)} required />
            <label>Change availability status:</label>
            <select {...availabilityStatus}>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <label>Change booking deadline:</label>
            <input {...bookingDeadline} />
            <label>Change insurance policy:</label>
            <input {...insurancePolicy} required />
            <button>Update Vehicle Rental</button>
          </form>
        </>
      )}
    </div>
  );
};

export default EditVehicleRentalPage;
