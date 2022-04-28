const request = require("supertest");
const mongoose = require("mongoose");
const { RoleModel } = require("../../models/role.model");
const { OrganizationModel } = require("../../models/organization.model");
const { RolePermissionModel } = require("../../models/rolePermission.model");
const UserModel = require("../../models/user.model");

let server;
let user;
let role;
let token;
let userData;

beforeEach(async () => {
  await require("../../app").close();
  server = require("../../app");
  userData = {
    fullName: "test Role cooper",
    email: "testrole@gmail.com",
    password: "Testrole@123",
  };
  // organizationData = {
  //   tenant: "620222a1d9c7dd71d1a7762f",
  //   organizationName: "Test Org",
  //   organizationType: "IT SERVICES cooper",
  //   organizationUrl: "testorg.com",
  // };
});
afterEach(async () => {
  await server.close();
});

describe("/api/v1/roles", () => {
  describe("POST", () => {
    it("should return 200 new role added.", async () => {
      user = await request(server).post("/api/v1/user/signup").send(userData);
      token = await request(server).post("/api/v1/auth/login").send({
        email: "testrole@gmail.com",
        password: "Testrole@123",
      });

      role = await request(server)
        .post("/api/v1/roles")
        .set("x-auth-token", token.body.token)
        .send({
          organization: user.body.organization,
          roleName: "testRoleName",
        });
      expect(role.status).toBe(200);
    });
    // it("should return 401 if user don't have permission to create role.", async () => {
    //   const role = await request(server).post("/api/v1/roles").set("x-auth-token", token.body.token).send({
    //     roleName: "testRoleName",
    //     organization: user.body.organization,
    //   });

    //   expect(role.status).toBe(401);
    // });
    it("should return 400 if invalid organization is passed.", async () => {
      const role = await request(server)
        .post("/api/v1/roles")
        .set("x-auth-token", token.body.token)
        .send({
          organization: mongoose.Types.ObjectId(),
          roleName: "testRoleName",
        });

      expect(role.status).toBe(400);
    });
    it("should return 400 if role name is already exist.", async () => {
      const role = await request(server)
        .post("/api/v1/roles")
        .set("x-auth-token", token.body.token)
        .send({
          organization: user.body.organization,
          roleName: "testRoleName",
        });
      expect(role.status).toBe(400);
    });
  });
  describe("GET", () => {
    describe("/api/v1/roles/", () => {
      it("should return 200 if default roles are found.", async () => {
        let role = await request(server).get("/api/v1/roles/");
        expect(role.status).toBe(200);
      });
    });
    describe("/api/v1/roles/organization/:id", () => {
      it("should return 200 if roles that is created by organization is found.", async () => {
        let role = await request(server).get(
          "/api/v1/roles/organization/" + user.body.organization
        );
        expect(role.status).toBe(200);
      });
      it("should return 400 if invalid organization Id is passed.", async () => {
        const role = await request(server).get(
          "/api/v1/roles/organization/" + mongoose.Types.ObjectId()
        );

        expect(role.status).toBe(400);
      });
    });
    describe("/api/v1/roles/tenant/:id", () => {
      it("should return 200 if roles that is created by tenant is found.", async () => {
        let role = await request(server).get(
          "/api/v1/roles/tenant/" + user.body._id
        );
        expect(role.status).toBe(200);
      });
      it("should return 400 if invalid tenant Id is passed.", async () => {
        const role = await request(server).get(
          "/api/v1/roles/tenant/" + mongoose.Types.ObjectId()
        );

        expect(role.status).toBe(400);
      });
    });
  });
  describe("PUT", () => {
    describe("/api/v1/roles/:id", () => {
      it("should return 200 if role is updated.", async () => {
        const updatedRole = await request(server)
          .put("/api/v1/roles/" + role.body._id)
          .set("x-auth-token", token.body.token)
          .send({
            roleName: "UpdatedtestRoleName",
          });

        expect(updatedRole.status).toBe(200);
      });
      // it("should return 400 if invalid tenant is passed.", async () => {
      //   const response = await request(server)
      //     .put("/api/v1/roles/" + role.body._id)
      //     .send({
      //       tenant: mongoose.Types.ObjectId(),
      //       roleName: "UpdatetestRoleName",
      //     });

      //   expect(response.status).toBe(400);
      // });
      it("should return 400 if role name is already exist.", async () => {
        const response = await request(server)
          .put("/api/v1/roles/" + role.body._id)
          .set("x-auth-token", token.body.token)
          .send({
            roleName: "UpdatedtestRoleName",
          });

        expect(response.status).toBe(400);
      });
      it("should return 400 if no role is found of specified role ID.", async () => {
        const response = await request(server)
          .put("/api/v1/roles/" + mongoose.Types.ObjectId())
          .set("x-auth-token", token.body.token)
          .send({
            roleName: "new update testRoleName",
          });

        expect(response.status).toBe(400);
      });
      it("should return 401 if trying to update default role is found of specified role ID.", async () => {
        const member = await RoleModel.findOne({ roleName: "member" });
        const response = await request(server)
          .put("/api/v1/roles/" + member._id)
          .set("x-auth-token", token.body.token)
          .send({
            roleName: "new update testRoleName",
          });

        expect(response.status).toBe(401);
      });
    });
  });
  describe("DELETE", () => {
    describe("/api/v1/roles/:id", () => {
      it("should return 200 if role is deleted.", async () => {
        const updatedRole = await request(server)
          .delete("/api/v1/roles/" + role.body._id)
          .set("x-auth-token", token.body.token);

        expect(updatedRole.status).toBe(200);
      });
      it("should return 404 if role is not deleted.", async () => {
        const updatedRole = await request(server)
          .delete("/api/v1/roles/" + role.body._id)
          .set("x-auth-token", token.body.token);

        expect(updatedRole.status).toBe(404);
      });
    });
  });
});

describe("Disconnect", () => {
  it("dissconnect mongodb", async () => {
    await UserModel.deleteOne({ _id: user.body._id });
    await RoleModel.deleteOne({ _id: role.body._id });
    // await OrganizationModel.deleteOne({ _id: organization.body._id });
    await RolePermissionModel.deleteMany({ user: user.body._id });
    await mongoose.disconnect();
  });
});
