const VehicleRental = require('../models/vehicleRentalModel');
const mongoose = require('mongoose');

// GET /api/vehicleRentals
const getAllVehicleRentals = async (req, res) => {
  try{
    const vehicle = await VehicleRental.find({})
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: "failed to retrieve rental vehicle data" });
  }
};

// POST /api/vehicleRentals
const createVehicleRental = async (req, res) => {
  try{
    const newVehicle = await VehicleRental.create({...req.body})
    res.status(201).json(newVehicle);
  }catch(err){
    res.status(500).json({message: "Failed to create rental vehicle", error: err.message});
  }
};

// GET /api/vehicleRentals/:vehicleRentalId
const getVehicleRentalById = async (req, res) => {
  const {vehicleRentalId} = req.params;
  if (!mongoose.Types.ObjectId.isValid(vehicleRentalId)) {
      return res.status(404).json({ message: "Invalid vehicle ID" });
  }
  try {
    const vehicle = await VehicleRental.findById(vehicleRentalId)
    if(vehicle){
      res.status(200).json(vehicle)
    }else{
      res.status(404).json({message:"vehicle not found"})
    }
  } catch (error) {
    res.status(500).json({message:"failed to retrieve vehicle"})
  }
};

// PUT /api/vehicleRentals/:vehicleRentalId
const updateVehicleRental = async (req, res) => {
  const {vehicleRentalId} = req.params
  if (!mongoose.Types.ObjectId.isValid(vehicleRentalId)) {
      return res.status(404).json({ message: "Invalid vehicle ID" });
  }
  try {
    const updVehicle = await VehicleRental.findOneAndReplace(
      {_id: vehicleRentalId},
      {...req.body},
      {new:true}
    );
    if(updVehicle){
      res.status(200).json(updVehicle);
    }else{
      res.status(404).json({message:"vehicle not found"})
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to update rental vehicle", error: err.message })
  }
};

// DELETE /api/vehicleRentals/:vehicleRentalId
const deleteVehicleRental = async (req, res) => {
  const {vehicleRentalId} = req.parmas;
  if (!mongoose.Types.ObjectId.isValid(vehicleRentalId)) {
      return res.status(404).json({ message: "Invalid vehicle ID" });
  }
  try {
    const delVehicle = await VehicleRental.findByIdAndDelete({_id:vehicleRentalId})
    if(delVehicle){
      res.status(204).send()
    }else{
      res.status(404).json({ message: "vehicle not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to delete rental vehicle ", error: err.message });
  }
};

module.exports = {
  getAllVehicleRentals,
  createVehicleRental,
  getVehicleRentalById,
  updateVehicleRental,
  deleteVehicleRental,
};
