const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../index"); // Express app (already connects to DB)
const api = supertest(app);
const User = require("../models/userModel");

const signupUrl = "/api/auth/signup"
const loginUrl = "/api/auth/login"

//cleanup
beforeEach(async () => {
    await User.deleteMany({});
});

describe("POST /api/auth/signup", () => {
    describe("valid payload", () => {
        it("should return json format and http 201", async () => {
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

            await api
                .post(signupUrl)
                .send(newUser)
                .expect(201)
                .expect("Content-Type", /application\/json/);
        });

        it("should save the new user to db", async () => {
            const usersOld = await User.find({})
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

            await api
                .post(signupUrl)
                .send(newUser)
                .expect(201)
                .expect("Content-Type", /application\/json/);

            const usersNew = await User.find({})
            expect(usersNew.length).toEqual(usersOld.length + 1)
        });

        it("should return username and token", async () => {
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

            expect(response.body).toHaveProperty("username")
            expect(response.body).toHaveProperty("token")
        });

        it("should return http 400 for duplicate username", async () => {
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
            const duplicateUser = {
                name: "kalle kaveri",
                username: "kaiffari",
                password: "asdaASDA1@",
                phone_number: "0123456789",
                licenseNumber: "1234asda",
                date_of_birth: "2025-1-2",
                address: {
                    licenseExpiryDate: "2028-5-20",
                    city: "Inari",
                    yearsOfExperience: 123
                }
            }

            await api
                .post(signupUrl)
                .send(newUser)
                .expect(201)
                .expect("Content-Type", /application\/json/);

            await api
                .post(signupUrl)
                .send(duplicateUser)
                .expect(400)
                .expect("Content-Type", /application\/json/);

        });

        it("should return http 400 for duplicate licenseNumber", async () => {
            const newUser = {
                name: "kalle kaveri",
                username: "kaiffari1",
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
            const duplicateUser = {
                name: "kalle kaveri",
                username: "kaiffari2",
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

            await api
                .post(signupUrl)
                .send(newUser)
                .expect(201)
                .expect("Content-Type", /application\/json/);

            await api
                .post(signupUrl)
                .send(duplicateUser)
                .expect(400)
                .expect("Content-Type", /application\/json/);

        });
    });

    describe("invalid payload", () => {
        it("should return json format and http 400", async () => {
            const invalidUser = {
                name: "kalle kaveri",
                username: "kaiffari",
                phone_number: "0123456789",
                licenseNumber: "asda1234",
                date_of_birth: "2025-1-2",
                address: {
                    licenseExpiryDate: "2028-5-20",
                    city: "Inari",
                    yearsOfExperience: 123
                }
            }

            await api
                .post(signupUrl)
                .send(invalidUser)
                .expect(400)
                .expect("Content-Type", /application\/json/);
        });

        it("should not save the invalid user to db", async () => {
            const usersOld = await User.find({})
            const invalidUser = {
                name: "kalle kaveri",
                username: "kaiffari",
                phone_number: "0123456789",
                licenseNumber: "asda1234",
                date_of_birth: "2025-1-2",
                address: {
                    licenseExpiryDate: "2028-5-20",
                    city: "Inari",
                    yearsOfExperience: 123
                }
            }

            await api
                .post(signupUrl)
                .send(invalidUser)
                .expect(400)
                .expect("Content-Type", /application\/json/);

            const usersNew = await User.find({})
            expect(usersNew.length).toEqual(usersOld.length)
        });
    });
});

describe("POST /api/auth/login", () => {

    // Sign up a user before each login test
    beforeEach(async () => {
        await api.post("/api/auth/signup").send({
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
        });
    });

    describe("valid payload", () => {
        it("should return json format and http 201", async () => {
            const userLogin = {
                username: "kaiffari",
                password: "asdaASDA1@"
            }

            await api
                .post(loginUrl)
                .send(userLogin)
                .expect(200)
                .expect("Content-Type", /application\/json/);
        });

        it("should return username and token", async () => {
            const userLogin = {
                username: "kaiffari",
                password: "asdaASDA1@"
            }

            const response = await api
                .post(loginUrl)
                .send(userLogin)
                .expect(200)
                .expect("Content-Type", /application\/json/);

            expect(response.body).toHaveProperty("username")
            expect(response.body).toHaveProperty("token")
        });
    });

    describe("invalid payload", () => {
        it("should return json format and http 500 with incorrect password", async () => {
            const invalidUser = {
                username: "kaiffari",
                password: "badpwd"
            }

            await api
                .post(signupUrl)
                .send(invalidUser)
                .expect(500)
        });

        it("should return json format and http 500 with incorrect username", async () => {
            const invalidUser = {
                username: "baduname",
                password: "asdaASDA1@"
            }

            await api
                .post(signupUrl)
                .send(invalidUser)
                .expect(500)
        });
    });
});

// Close DB connection once after all tests
afterAll(async () => {
    await mongoose.connection.close();
});