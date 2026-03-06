import { BrowserRouter, Routes, Route } from "react-router-dom";
import {useState} from "react";

// pages & components
import Home from "./pages/HomePage";
import AddVehicleRentalPage from "./pages/AddVehicleRentalPage";
import Navbar from "./components/Navbar";
import VehicleRentalPage from "./pages/VehicleRentalPage";
import EditVehicleRentalPage from "./pages/EditVehicleRentalPage";
import NotFoundPage from "./pages/NotFoundPage";
import Register from "./pages/Register";
import Login from "./pages/Login";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {const user = JSON.parse(localStorage.getItem("user"))
    return user && user.token ? true : false});
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-rental" element={<AddVehicleRentalPage isAuthneticated={isAuthenticated} />} />
            <Route path="/edit/:id" element={<EditVehicleRentalPage isAuthenticated={isAuthenticated}/>} />
            <Route path="/vehicle/:id" element={<VehicleRentalPage isAuthenticated={isAuthenticated}/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
