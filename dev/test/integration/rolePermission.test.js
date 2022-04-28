const request = require("supertest");
const mongoose = require("mongoose");
const { RoleModel } = require("../../models/role.model");
const { OrganizationModel } = require("../../models/organization.model");
const { ProjectModel } = require("../../models/project.model");
const { RolePermissionModel } = require("../../models/rolePermission.model");
const UserModel = require("../../models/user.model");

let server;
let tenant;
let tenantData;
let mockUser;
let user;
let userData;
let role;
let roleData;
let organization;
let organizationData;
let rolePermission;
let token;

beforeEach(async () => {
  await require("../../app").close();
  server = require("../../app");
  tenantData = {
    fullName: "tenantTestRolePermission",
    email: "tenantRolePermission@gmail.com",
    password: "Tenant@123",
  };
  userData = {
    fullName: "userTestRolePermission",
    email: "userRolePermission@gmail.com",
    password: "User@123",
  };
  // organizationData = {
  //   tenant: "620222a1d9c7dd71d1a7762f",
  //   organizationName: "Test Role PermissionOrg2",
  //   organizationType: "IT SERVICES cooper2",
  //   organizationUrl: "testorgRP.com",
  // };
  roleData = {
    organization: "61fba0ba35a56f19ab4fa9e1",
    roleName: "testRolePermission",
  };
});
afterEach(async () => {
  await server.close();
});

describe("/api/v1/role-permissions/", () => {
  describe("/api/v1/role-permissions/assign", () => {
    describe("POST", () => {
      it("should return 200 if role is assigned to that user.", async () => {
        tenant = await request(server)
          .post("/api/v1/user/signup")
          .send(tenantData);

        token = await request(server).post("/api/v1/auth/login").send({
          email: "tenantRolePermission@gmail.com",
          password: "Tenant@123",
        });

        roleData.organization = tenant.body.organization;

        role = await request(server)
          .post("/api/v1/roles")
          .set("x-auth-token", token.body.token)
          .send(roleData);

        user = await request(server).post("/api/v1/user/signup").send(userData);

        rolePermission = await request(server)
          .post("/api/v1/role-permissions/assign")
          .set("x-auth-token", token.body.token)
          .send({
            organization: tenant.body.organization,
            role: role.body._id,
            user: user.body._id,
          });

        expect(rolePermission.status).toBe(200);
      });
      it("should return 404 if role is not found of specified role Id.", async () => {
        const rolePermission = await request(server)
          .post("/api/v1/role-permissions/assign")
          .set("x-auth-token", token.body.token)
          .send({
            organization: tenant.body.organization,
            role: mongoose.Types.ObjectId(),
            user: user.body._id,
          });

        expect(rolePermission.status).toBe(404);
      });
      it("should return 400 if organization is not found of specified organization Id.", async () => {
        const rolePermission = await request(server)
          .post("/api/v1/role-permissions/assign")
          .set("x-auth-token", token.body.token)
          .send({
            organization: mongoose.Types.ObjectId(),
            role: role.body._id,
            user: user.body._id,
          });

        expect(rolePermission.status).toBe(400);
      });
      // it("should return 400 if tenant is not found of specified tenant Id.", async () => {
      //   const rolePermission = await request(server)
      //     .post("/api/v1/role-permissions/assign")
      //     .send({
      //       tenant: mongoose.Types.ObjectId(),
      //       organization: organization.body._id,
      //       role: role.body._id,
      //       user: user.body._id,
      //     });

      //   expect(rolePermission.status).toBe(400);
      // });
      it("should return 400 if user is not found of specified user Id.", async () => {
        const rolePermission = await request(server)
          .post("/api/v1/role-permissions/assign")
          .set("x-auth-token", token.body.token)
          .send({
            organization: tenant.body.organization,
            role: role.body._id,
            user: mongoose.Types.ObjectId(),
          });

        expect(rolePermission.status).toBe(400);
      });
      // it("should return 400 if user is not a member of the organization.", async () => {
      //   mockUser = await request(server).post("/api/v1/user/signup").send({
      //     fullName: "mockRp",
      //     email: "mockrp@gmail.com",
      //     password: "Mock@123",
      //   });

      //   const rolePermission = await request(server)
      //     .post("/api/v1/role-permissions/assign")
      //     .send({
      //       tenant: tenant.body._id,
      //       organization: organization.body._id,
      //       role: role.body._id,
      //       user: mockUser.body._id,
      //     });

      //   expect(rolePermission.status).toBe(400);
      // });

      it("should return 400 if specified role is already assigned to that user.", async () => {
        const rolePermission = await request(server)
          .post("/api/v1/role-permissions/assign")
          .set("x-auth-token", token.body.token)
          .send({
            organization: tenant.body.organization,
            role: role.body._id,
            user: user.body._id,
          });

        expect(rolePermission.status).toBe(400);
      });
      // it("should return 401 if trying to change admin's role.", async () => {
      //   const rolePermission = await request(server)
      //     .post("/api/v1/role-permissions/assign")
      //     .set("x-auth-token", token.body.token)
      //     .send({
      //       organization: tenant.body.organization,
      //       role: role.body._id,
      //       user: tenant.body._id,
      //     });

      //   expect(rolePermission.status).toBe(401);
      // });
    });
  });
  describe("/api/rolepermissions/user/:id", () => {
    describe("GET", () => {
      it("should return 200 if user role is found.", async () => {
        let role = await request(server).get(
          "/api/v1/role-permissions/user/" + user.body._id
        );
        expect(role.status).toBe(200);
      });
      it("should return 400 if user is not found of specified user Id.", async () => {
        let role = await request(server).get(
          "/api/v1/role-permissions/user/" + mongoose.Types.ObjectId()
        );
        expect(role.status).toBe(400);
      });
    });
  });
  describe("/api/v1/role-permissions/revoke", () => {
    describe("POST", () => {
      it("should return 200 if role is revoked from user.", async () => {
        const response = await request(server)
          .post("/api/v1/role-permissions/revoke")
          .set("x-auth-token", token.body.token)
          .send({
            organization: tenant.body.organization,
            role: role.body._id,
            user: user.body._id,
          });
        expect(response.status).toBe(200);
      });
      it("should return 401 if trying to revoke default roles.", async () => {
        const response = await request(server)
          .post("/api/v1/role-permissions/revoke")
          .set("x-auth-token", token.body.token)
          .send({
            organization: tenant.body.organization,
            role: role.body._id,
            user: user.body._id,
          });
        expect(response.status).toBe(401);
      });
      // it("should return 400 if user is not a member of specified organization.", async () => {
      //   const response = await request(server)
      //     .post("/api/v1/role-permissions/revoke")
      //     .send({
      //       organization: tenant.body.organization,
      //       role: role.body._id,
      //       user: mockUser.body._id,
      //     });
      //   expect(response.status).toBe(400);
      // });
      it("should return 400 if user is not found of specified user Id.", async () => {
        const response = await request(server)
          .post("/api/v1/role-permissions/revoke")
          .set("x-auth-token", token.body.token)
          .send({
            organization: tenant.body.organization,
            role: role.body._id,
            user: mongoose.Types.ObjectId(),
          });
        expect(response.status).toBe(400);
        // await UserModel.deleteOne({ _id: mockUser.body._id });
        // await RolePermissionModel.deleteMany({ user: mockUser.body._id });
      });
      // it("should return 401 if tenant is not a admin.", async () => {
      //   const rolePermission = await request(server)
      //     .post("/api/v1/role-permissions/revoke")
      //     .send({
      //       tenant: user.body._id,
      //       organization: organization.body._id,
      //       role: role.body._id,
      //       user: user.body._id,
      //     });

      //   expect(rolePermission.status).toBe(403);
      // });
      it("should return 404 if role is not found of specified role Id.", async () => {
        const rolePermission = await request(server)
          .post("/api/v1/role-permissions/revoke")
          .set("x-auth-token", token.body.token)
          .send({
            organization: tenant.body.organization,
            role: mongoose.Types.ObjectId(),
            user: user.body._id,
          });

        expect(rolePermission.status).toBe(404);
      });
      it("should return 400 if organization is not found of specified organization Id.", async () => {
        const rolePermission = await request(server)
          .post("/api/v1/role-permissions/revoke")
          .set("x-auth-token", token.body.token)
          .send({
            organization: mongoose.Types.ObjectId(),
            role: role.body._id,
            user: user.body._id,
          });

        expect(rolePermission.status).toBe(400);
      });
      // it("should return 400 if tenant is not found of specified tenant Id.", async () => {
      //   const rolePermission = await request(server)
      //     .post("/api/v1/role-permissions/revoke")
      //     .send({
      //       tenant: mongoose.Types.ObjectId(),
      //       organization: organization.body._id,
      //       role: role.body._id,
      //       user: user.body._id,
      //     });

      //   expect(rolePermission.status).toBe(400);
      // });
    });
  });
});

describe("Disconnect", () => {
  it("dissconnect mongodb", async () => {
    await UserModel.deleteOne({ _id: user.body._id });
    await UserModel.deleteOne({ _id: tenant.body._id });
    // await OrganizationModel.deleteOne({ _id: organization.body._id });
    await RoleModel.deleteOne({ _id: role.body._id });
    await RolePermissionModel.deleteMany({ user: user.body._id });
    await RolePermissionModel.deleteMany({ user: tenant.body._id });
    await mongoose.disconnect();
  });
});
