const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../index"); // Express app (already connects to DB)
const api = supertest(app);
const VehicleRental = require("../models/vehicleRentalModel");

const vehicleRentalUrl = "/api/vehicleRentals/"

const vehicleRentalSeed = [
  {
    vehicleModel: "Yugo",
    category: "compact",
    description: "the fabulous yugo from a country that no longer exists",
    agency: {
      name: "James corp",
      contactEmail: "james@jcorp.gov",
      fleetSize: 1
    },
    location: {
      city: "Phoenix",
      state: "Arizona"
    },
    dailyPrice: 0,
    listingDate: "2026-2-1",//optional
    availabilityStatus: "maintenance",//optional, defaults 'available', 'rented', 'maintenance'
    bookingDeadline: "2029-1-1",
    insurancePolicy: "works trust"
  },
  {
    vehicleModel: "Toyota Corolla",
    category: "Van",
    description: "How did we make the Toyota Corolla into a van",
    agency: {
      name: "Toyota",
      contactEmail: "noreply@toyota.jp",
      fleetSize: 256
    },
    location: {
      city: "New York City",
      state: "New York"
    },
    dailyPrice: 200,
    bookingDeadline: "2026-3-7",
    insurancePolicy: "Trusted Car Insurance Company"
  }
]

// read all vehicleRentals from the DB
const vehicleRentalsInDb = async () => {
  const allVehicleRentals = await VehicleRental.find({});
  return allVehicleRentals.map((b) => b.toJSON());
};

describe("VehicleRental routes", () => {
  //cleanup
  beforeEach(async () => {
    await VehicleRental.deleteMany({});
    await Promise.all(
      vehicleRentalSeed.map((vehicleRental) =>
        api
          .post(vehicleRentalUrl)
          .send(vehicleRental)
      )
    );
  });

  describe("GET /api/vehicleRentals", () => {
    it("should return json format and http 200", async () => {
      await api
        .get(vehicleRentalUrl)
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    it("should return all vehicleRentals set in vehicleRentalSeed", async () => {
      const response = await api
        .get(vehicleRentalUrl)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body).toHaveLength(vehicleRentalSeed.length)
    });
  });

  describe("GET /api/vehicleRentals/:vehicleRentalId", () => {
    it("should return json format and http 200", async () => {
      const vehicleRentals = await vehicleRentalsInDb()

      await api
        .get(vehicleRentalUrl + vehicleRentals[0]._id)
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    it("should return vehicleRental set in vehicleRentalSeed", async () => {
      const vehicleRentals = await vehicleRentalsInDb()

      const response = await api
        .get(vehicleRentalUrl + vehicleRentals[0]._id)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.title).toBe(vehicleRentalSeed[0].title)
    });

    it("should return 404 for invalid id", async () => {
      await api
        .get(vehicleRentalUrl + "1234")
        .expect(404)
        .expect("Content-Type", /application\/json/);
    });
  });

  describe("POST /api/vehicleRentals", () => {
    describe("valid payload", () => {
      it("should return json format and http 201", async () => {
        const newVehicleRental = {
          vehicleModel: "Yugo",
          category: "compact",
          description: "the fabulous yugo from a country that no longer exists",
          agency: {
            name: "James corp",
            contactEmail: "james@jcorp.gov",
            fleetSize: 1
          },
          location: {
            city: "Phoenix",
            state: "Arizona"
          },
          dailyPrice: 1234,
          availabilityStatus: "rented",//optional, defaults 'available', 'rented', 'maintenance'
          bookingDeadline: "2029-1-1",
          insurancePolicy: "works trust"
        }

        await api
          .post(vehicleRentalUrl)
          .send(newVehicleRental)
          .expect(201)
          .expect("Content-Type", /application\/json/);
      });

      it("should save the new vehicleRental to db", async () => {
        const vehicleRentalsOld = await vehicleRentalsInDb()
        const newVehicleRental = {
          vehicleModel: "Yugo",
          category: "compact",
          description: "the fabulous yugo from a country that no longer exists",
          agency: {
            name: "James corp",
            contactEmail: "james@jcorp.gov",
            fleetSize: 1
          },
          location: {
            city: "Phoenix",
            state: "Arizona"
          },
          dailyPrice: 1234,
          availabilityStatus: "rented",//optional, defaults 'available', 'rented', 'maintenance'
          bookingDeadline: "2029-1-1",
          insurancePolicy: "works trust"
        }

        await api
          .post(vehicleRentalUrl)
          .send(newVehicleRental)
          .expect(201)
          .expect("Content-Type", /application\/json/);

        const vehicleRentalsNew = await vehicleRentalsInDb()
        expect(vehicleRentalsNew).toHaveLength(vehicleRentalsOld.length + 1)
      });
    });

    describe("invalid payload", () => {
      it("should return http 500 with missing parameters", async () => {
        const newVehicleRental = {
          vehicleModel: "Yugo",
          category: "compact",
          description: "the fabulous yugo from a country that no longer exists",
          agency: {
            name: "James corp",
            contactEmail: "james@jcorp.gov",
            fleetSize: 1
          },
          location: {
            city: "Phoenix",
            state: "Arizona"
          },
          availabilityStatus: "rented",//optional, defaults 'available', 'rented', 'maintenance'
          bookingDeadline: "2029-1-1",
          insurancePolicy: "works trust"
        }

        await api
          .post(vehicleRentalUrl)
          .send(newVehicleRental)
          .expect(500)
          .expect("Content-Type", /application\/json/);
      });
    });
  });

  describe("PUT /api/vehicleRentals/:vehicleRentalId", () => {
    describe("valid payload", () => {
      it("should return json format and http 201", async () => {
        const vehicleRentals = await vehicleRentalsInDb()
        const updateVehicleRental = {
          vehicleModel: "Yugo",
          category: "van",
          description: "the fabulous yugo from a country that no longer exists",
          agency: {
            name: "James corp",
            contactEmail: "james@jcorp.gov",
            fleetSize: 1
          },
          location: {
            city: "Phoenix",
            state: "Arizona"
          },
          dailyPrice: 0,
          availabilityStatus: "maintenance",//optional, defaults 'available', 'rented', 'maintenance'
          bookingDeadline: "2029-1-1",
          insurancePolicy: "works trust"
        }

        await api
          .put(vehicleRentalUrl + vehicleRentals[0].id)
          .send(updateVehicleRental)
          .expect(200)
          .expect("Content-Type", /application\/json/);
      });

      it("should update the vehicleRental in db", async () => {
        const vehicleRentals = await vehicleRentalsInDb()
        const updateVehicleRental = {
          vehicleModel: "Yugo",
          category: "van",
          description: "the fabulous yugo from a country that no longer exists, now there are two of them",
          agency: {
            name: "James corp",
            contactEmail: "james@jcorp.gov",
            fleetSize: 2
          },
          location: {
            city: "Phoenix",
            state: "Arizona"
          },
          dailyPrice: 0,
          availabilityStatus: "maintenance",//optional, defaults 'available', 'rented', 'maintenance'
          bookingDeadline: "2029-1-1",
          insurancePolicy: "works trust"
        }

        await api
          .put(vehicleRentalUrl + vehicleRentals[0].id)
          .send(updateVehicleRental)
          .expect(200)
          .expect("Content-Type", /application\/json/);

        const vehicleRentalsNew = await vehicleRentalsInDb()
        expect(vehicleRentalsNew[0].description).not.toBe(vehicleRentals[0].description)
      });
    });

    describe("invalid payload", () => {
      it("should return http 500 with missing parameters", async () => {
        const vehicleRentals = await vehicleRentalsInDb()
        const updateVehicleRental = {
          vehicleModel: "Yugo",
          category: "compact",
          agency: {
            name: "James corp",
            contactEmail: "james@jcorp.gov",
            fleetSize: 2
          },
          dailyPrice: 0,
          availabilityStatus: "available",//optional, defaults 'available', 'rented', 'maintenance'
          bookingDeadline: "2029-1-1",
          insurancePolicy: "works trust"
        }

        await api
          .put(vehicleRentalUrl + vehicleRentals[0].id)
          .send(updateVehicleRental)
          .expect(500)
          .expect("Content-Type", /application\/json/);
      });
    });
  });

  describe("DELETE /api/vehicleRentals/:vehicleRentalId", () => {
    describe("valid payload", () => {
      it("should return json format and http 204", async () => {
        const vehicleRentals = await vehicleRentalsInDb()
        await api
          .delete(vehicleRentalUrl + vehicleRentals[0].id)
          .expect(204)
      });

      it("should delete the vehicleRental from db", async () => {
        const vehicleRentalsOld = await vehicleRentalsInDb()

        await api
          .delete(vehicleRentalUrl + vehicleRentalsOld[0].id)
          .expect(204)

        const vehicleRentalsNew = await vehicleRentalsInDb()
        expect(vehicleRentalsNew).toHaveLength(vehicleRentalsOld.length - 1)
      });
    });

    it("should return http 404 with invalid id", async () => {

      await api
        .delete(vehicleRentalUrl + "1234")
        .expect(404)
        .expect("Content-Type", /application\/json/);
    });
  });
});

// Close DB connection once after all tests
afterAll(async () => {
  await mongoose.connection.close();
});