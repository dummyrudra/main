const request = require("supertest");
const mongoose = require("mongoose");
const User = require("../../models/user.model");
const { OrganizationModel } = require("../../models/organization.model");
const { RolePermissionModel } = require("../../models/rolePermission.model");
let server;
let user;
let data;
let url;
let token;
let organization;
let tempUser;
beforeEach(async () => {
  await require("../../app").close();
  server = require("../../app");
  data = {
    fullName: "tests cooper",
    email: "test123cooper@gmail.com",
    password: "Test@123",
  };
});
afterEach(async () => {
  await server.close();
});
describe("/api/v1/auth/login", () => {
  describe("POST", () => {
    it("should return 200 if email and password is correct", async () => {
      user = await request(server).post("/api/v1/user/signup").send(data);
      const response = await request(server).post("/api/v1/auth/login").send({
        email: "test123cooper@gmail.com",
        password: "Test@123",
      });
      token = response.body.token;
      organization = await request(server)
        .post("/api/v1/organization")
        .set("x-auth-token", token)
        .send({
          tenant: user.body._id,
          organizationName: "RudraAuth",
          organizationType: "IT SERVICES",
          organizationUrl: "rudraauth.com",
        });
      expect(response.status).toBe(200);
    },7000);
    it("should return 404 if email is not exist", async () => {
      const response = await request(server).post("/api/v1/auth/login").send({
        email: "testcoopers321ss@gmail.com",
        password: "Test@123",
      });
      expect(response.status).toBe(404);
    });
    it("should return 400 if password is incorrect", async () => {
      const response = await request(server).post("/api/v1/auth/login").send({
        email: "test123cooper@gmail.com",
        password: "Wrong@123",
      });
      expect(response.status).toBe(400);
    });
  });
});
describe("/api/v1/auth/generate-otp", () => {
  describe("PATCH", () => {
    it("should return 200", async () => {
      const response = await request(server)
        .patch("/api/v1/auth/generate-otp")
        .send({
          email: "test123cooper@gmail.com",
        });
      expect(response.status).toBe(200);
    });
    it("should return 404 if user not found", async () => {
      const response = await request(server)
        .patch("/api/v1/auth/generate-otp")
        .send({
          email: "test123@gmail.com",
        });
      expect(response.status).toBe(404);
    });
  });
});
describe("/api/v1/auth/verify-otp", () => {
  describe("PATCH", () => {
    it("should return 200", async () => {
      let users = await User.findById(user.body._id);
      const response = await request(server)
        .patch("/api/v1/auth/verify-otp")
        .send({
          email: "test123cooper@gmail.com",
          otp: users.otp,
        });
      url = response.body.url;
      expect(response.status).toBe(200);
    });
    it("should return 400 if OTP is incorrect", async () => {
      const response = await request(server)
        .patch("/api/v1/auth/verify-otp")
        .send({
          email: "test123cooper@gmail.com",
          otp: "1234",
        });
      expect(response.status).toBe(400);
    });
  });
});
describe("/api/v1/auth/reset-password/:url", () => {
  describe("PATCH", () => {
    it("should return 400 if password is already used", async () => {
      const response = await request(server)
        .patch("/api/v1/auth/reset-password/" + url)
        .send({
          password: "Test@123",
        });
      expect(response.status).toBe(400);
    });
    it("should return 200", async () => {
      const response = await request(server)
        .patch("/api/v1/auth/reset-password/" + url)
        .send({
          password: "Password@123",
        });
      expect(response.status).toBe(200);
    });
    it("should return 401 when url url is used twice", async () => {
      const response = await request(server)
        .patch("/api/v1/auth/reset-password/" + url)
        .send({
          password: "Password@123",
        });
      expect(response.status).toBe(401);
    });
  });
});
describe("/api/v1/auth/send-invite", () => {
  describe("POST", () => {
    it("should return 200", async () => {
      const responses = await request(server).post("/api/v1/auth/login").send({
        email: "test123cooper@gmail.com",
        password: "Password@123",
      });
      token = responses.body.token;
      const response = await request(server)
        .post("/api/v1/auth/send-invite/" + user.body._id)
        .set("x-auth-token", token)
        .send({
          email: "test123@gmail.com",
        });
      tempUser = await User.findOne({ email: "test123@gmail.com" });
      await User.deleteOne({ email: "test123@gmail.com" });
      // await RolePermissionModel.deleteMany({ user: tempUser._id });
      expect(response.status).toBe(200);
    },7000);
    it("should return 400 if tenant id is not valid", async () => {
      let users = await User.findById(user.body._id);
      const response = await request(server)
        .post("/api/v1/auth/send-invite/" + "jdfksaldks")
        .set("x-auth-token", token)
        .send({
          email: "test123@gmail.com",
        });
      expect(response.status).toBe(400);
    });
    it("should return 404 if tenant id is not found", async () => {
      let users = await User.findById(user.body._id);
      const response = await request(server)
        .post("/api/v1/auth/send-invite/" + "61fa2f4e26c577c815e424b3")
        .set("x-auth-token", token)
        .send({
          email: "test123@gmail.com",
        });

      expect(response.status).toBe(404);
    });
    it("should return 400 if tenant id is not found", async () => {
      let users = await User.findById(user.body._id);
      const response = await request(server)
        .post("/api/v1/auth/send-invite/" + user.body._id)
        .set("x-auth-token", token)
        .send({
          email: "test123cooper@gmail.com",
        });

      expect(response.status).toBe(400);
    });
  });
});
describe("/api/v1/auth/change-password/:id", () => {
  describe("PATCH", () => { 
    it("should return 200 if password is successfully updated.", async () => {
      const response = await request(server)
        .patch("/api/v1/auth/change-password/" +user.body._id )
        .set("x-auth-token", token)
        .send({
          currentPassword: "Password@123",
          newPassword: "UpTest@321",
        });
      expect(response.status).toBe(200);
    });
    it("should return 400 if old password is used", async () => {
      const auth = await request(server).post("/api/v1/auth/login").send({
        email: "test123cooper@gmail.com",
        password: "UpTest@321",
      });
      token = auth.body.token;
      const response = await request(server)
        .patch("/api/v1/auth/change-password/" + user.body._id)
        .set("x-auth-token", token)
        .send({
          currentPassword: "UpTest@321",
          newPassword: "Test@123",
        });
      expect(response.status).toBe(400);
    });
    it("should return 404 if invalid user Id is provided.", async () => {
       const response = await request(server)
         .patch("/api/v1/auth/change-password/" + mongoose.Types.ObjectId())
         .set("x-auth-token", token)
         .send({
           currentPassword: "UpTest@321",
           newPassword: "reTest@123",
         });
       expect(response.status).toBe(404);
    });
    it("should return 400 if invalid current password is provided.", async () => {
     const response = await request(server)
       .patch("/api/v1/auth/change-password/" + user.body._id)
       .set("x-auth-token", token)
       .send({
         currentPassword: "InvalidTest@321",
         newPassword: "reTest@123",
       });
     expect(response.status).toBe(400);
    });

  });
});
describe("Disconnect", () => {
  it("dissconnect mongodb", async () => {
    await OrganizationModel.deleteOne({ _id: organization.body._id });
    await User.deleteOne({ _id: user.body._id });
    await RolePermissionModel.deleteMany({ user: user.body._id });
    await RolePermissionModel.deleteMany({ user: tempUser._id });
    // await RolePermissionModel.deleteMany({ tenant: user.body._id });
    await mongoose.disconnect();
  });
});
