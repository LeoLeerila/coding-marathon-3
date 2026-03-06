import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages & components
import Home from "./pages/HomePage";
import AddVehicleRentalPage from "./pages/AddVehicleRentalPage";
import Navbar from "./components/Navbar";
import VehicleRentalPage from "./pages/VehicleRentalPage";
import EditVehicleRentalPage from "./pages/EditVehicleRentalPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/addrental" element={<AddVehicleRentalPage />} />
            <Route path="/edit/:id" element={<EditVehicleRentalPage />} />
            <Route path="/vehicle/:id" element={<VehicleRentalPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
