const request = require("supertest");
const mongoose = require("mongoose");
const { ProjectModel } = require("../../models/project.model");
const User = require("../../models/user.model");
const { OrganizationModel } = require("../../models/organization.model");
const { RolePermissionModel } = require("../../models/rolePermission.model");
const { SprintModel } = require("../../models/sprint.model");
const ListModel = require("../../models/list.model");

let server;
let admin;
let member;
let project = {
  id: "",
  url: "",
};
let data1 = {
  fullName: "Admin cooper",
  email: "test123admin@gmail.com",
  password: "Test@123",
};
let data2 = {
  fullName: "Member cooper",
  email: "test123member@gmail.com",
  password: "Test@123",
};
let projectData;
let adminToken;
let memberToken;
let organization;
beforeEach(async () => {
  await require("../../app").close();
  server = require("../../app");
});
afterEach(async () => {
  await server.close();
});

describe("/projectlead", () => {
  describe("POST", () => {
    it("should return 200 if project is created succusfully ", async () => {
      admin = await request(server).post("/api/v1/user/signup").send(data1);
      const resp = await request(server).post("/api/v1/auth/login").send({
        email: "test123admin@gmail.com",
        password: "Test@123",
      });
      adminToken = resp.body.token;
      organization = await request(server)
        .post("/api/v1/organization")
        .set("x-auth-token", adminToken)
        .send({
          tenant: admin.body._id,
          organizationName: "TestCooper",
          organizationType: "Software",
          organizationUrl: "rudrainnovative.com",
        });
      // data2.tenant = admin.body._id
      member = await request(server).post("/api/v1/user/signup").send(data2);
      projectData = {
        projectName: "Cooper",
        key: "COP",
        projectType: "Software",
        projectLead: member.body._id,
        avatar: "default.png",
        description: "This project is based on pmt",
      };
      const res = await request(server).post("/api/v1/auth/login").send({
        email: "test123member@gmail.com",
        password: "Test@123",
      });
      memberToken = res.body.token;
      org = await request(server).post("/api/v1/organization").send({
        tenant: member.body._id,
        organizationName: "Rudra Innvoative",
        organizationType: "IT SERVICES",
        organizationUrl: "rudrainnovative.com",
      });
      const response = await request(server)
        .post("/api/v1/project")
        .set("x-auth-token", adminToken)
        .send(projectData);
      project.id = response.body._id;
      project.url = response.body.url;
      expect(response.status).toBe(200);
    });
    it("should return 400 if projectName is already exist in user portfolio", async () => {
      const response = await request(server)
        .post("/api/v1/project")
        .set("x-auth-token", adminToken)
        .send(projectData);
      expect(response.status).toBe(400);
    });
    it("should return 400 if key is already exist user portfolio", async () => {
      projectData.key = "TDM";
      const response = await request(server)
        .post("/api/v1/project")
        .set("x-auth-token", adminToken)
        .send(projectData);
      expect(response.status).toBe(400);
    });
  });
});

describe("/api/v1/project/owner/", () => {
  describe("GET", () => {
    it("should return 200 if owner id is correct", async () => {
      const response = await request(server)
        .get("/api/v1/project/owner")
        .set("x-auth-token", adminToken);
      expect(response.status).toBe(200);
    });
  });
});

describe("/api/v1/project/projectlead/:id", () => {
  describe("GET", () => {
    it("should return 200 if projectlead id is correct", async () => {
      projectData.key = "TDM";
      const response = await request(server)
        .get("/api/v1/project/projectlead/" + member.body._id)
        .set("x-auth-token", memberToken);
      expect(response.status).toBe(200);
    });
  });
});
describe("/api/v1/project/:id", () => {
  describe("GET", () => {
    it("should return 200 if owner id is correct", async () => {
      projectData.key = "TDM";
      const response = await request(server)
        .get("/api/v1/project/" + project.id)
        .set("x-auth-token", adminToken);
      expect(response.status).toBe(200);
    });
  });
});

describe("/api/v1/project/organization/:id", () => {
  describe("GET", () => {
    it("should return 200 if organization id is correct", async () => {
      projectData.key = "TDM";
      const response = await request(server)
        .get("/api/v1/project/organization/" + admin.body.organization)
        .set("x-auth-token", adminToken);
      expect(response.status).toBe(200);
    });
  });
});
describe("/api/v1/project/:id", () => {
  describe("PUT", () => {
    it("should return 200 if updated successfully", async () => {
      projectData.key = "TDM";
      projectData.projectName = "Update Name";
      const response = await request(server)
        .put("/api/v1/project/" + project.id)
        .set("x-auth-token", adminToken)
        .send(projectData);
      expect(response.status).toBe(200);
    });
  });
});
describe("/api/v1/project/:url", () => {
  describe("DELETE", () => {
    it("should return 200 if owner id is correct", async () => {
      projectData.key = "TDM";
      const response = await request(server)
        .delete("/api/v1/project/" + project.id)
        .set("x-auth-token", adminToken);
      expect(response.status).toBe(200);
    });
  });
});
describe("Disconnect", () => {
  it("dissconnect mongodb", async () => {
    await SprintModel.deleteMany({ project: project.id });
    await ListModel.deleteMany({ projectId: project.id });
    await ProjectModel.deleteOne({ _id: project.id });
    await OrganizationModel.deleteOne({ _id: organization.body._id });
    await RolePermissionModel.deleteOne({ user: member.body._id });
    await RolePermissionModel.deleteOne({ user: admin.body._id });
    await User.deleteOne({ _id: admin.body._id });
    await User.deleteOne({ _id: member.body._id });
    await mongoose.disconnect();
  });
});
