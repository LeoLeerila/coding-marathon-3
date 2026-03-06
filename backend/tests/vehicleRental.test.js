const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../index"); // Express app (already connects to DB)
const api = supertest(app);
const User = require("../models/userModel");
const VehicleRental = require("../models/vehicleRentalModel");

const signupUrl = "/api/auth/signup"
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

// get test user token
let token
beforeAll(async () => {
  await User.deleteMany({})
  const newUser = {
    name: "kalle kaveri",
    username: "kaiffari",
    password: "asdaASDA1@",
    phone_number: "0123456789",
    licenseNumber: "asda1234",
    date_of_birth: "2025-1-2",
    address: {
      licenseExpiryDate: "2028-5-20",
      city: "Inari",
      yearsOfExperience: 123
    }
  }

  const response = await api
    .post(signupUrl)
    .send(newUser)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  token = response.body.token
});

describe("VehicleRental routes", () => {
  //cleanup
  beforeEach(async () => {
    await VehicleRental.deleteMany({});
    await Promise.all(
      vehicleRentalSeed.map((vehicleRental) =>
        api
          .post(vehicleRentalUrl)
          .set("Authorization", "Bearer " + token)
          .send(vehicleRental)
      )
    );
  });

  describe("No Auth", () => {
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
  });

  describe("Auth", () => {
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
            .set("Authorization", "Bearer " + token)
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
            .set("Authorization", "Bearer " + token)
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
            .set("Authorization", "Bearer " + token)
            .expect(500)
            .expect("Content-Type", /application\/json/);
        });

        it("should return http 401 without token", async () => {
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
            .expect(401)
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
            .set("Authorization", "Bearer " + token)
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
            .set("Authorization", "Bearer " + token)
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
            .set("Authorization", "Bearer " + token)
            .expect(500)
            .expect("Content-Type", /application\/json/);
        });

        it("should return http 401 without token", async () => {
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
            .expect(401)
        });
      });
    });

    describe("DELETE /api/vehicleRentals/:vehicleRentalId", () => {
      describe("valid payload", () => {
        it("should return json format and http 204", async () => {
          const vehicleRentals = await vehicleRentalsInDb()
          await api
            .delete(vehicleRentalUrl + vehicleRentals[0].id)
            .set("Authorization", "Bearer " + token)
            .expect(204)
        });

        it("should delete the vehicleRental from db", async () => {
          const vehicleRentalsOld = await vehicleRentalsInDb()

          await api
            .delete(vehicleRentalUrl + vehicleRentalsOld[0].id)
            .set("Authorization", "Bearer " + token)
            .expect(204)

          const vehicleRentalsNew = await vehicleRentalsInDb()
          expect(vehicleRentalsNew).toHaveLength(vehicleRentalsOld.length - 1)
        });
      });

      it("should return http 404 with invalid id", async () => {

        await api
          .delete(vehicleRentalUrl + "1234")
          .set("Authorization", "Bearer " + token)
          .expect(404)
          .expect("Content-Type", /application\/json/);
      });

      it("should return http 401 without token", async () => {
        const vehicleRentals = await vehicleRentalsInDb()

        await api
          .delete(vehicleRentalUrl + vehicleRentals[0].id)
          .expect(401)
      });
    });
  });
});

// Close DB connection once after all tests
afterAll(async () => {
  await mongoose.connection.close();
});