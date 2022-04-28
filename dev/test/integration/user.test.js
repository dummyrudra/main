const request = require("supertest");
let server;
let data;
let resp;
let token;
let user;

const mongoose = require("mongoose");
const User = require("../../models/user.model");
const { signUpUser } = require("../../controllers/user.controller");
const { RolePermissionModel } = require("../../models/rolePermission.model");

describe("User Api", () => {
  beforeEach(async () => {
    await require("../../app").close();
    server = require("../../app");
    data = {
      fullName: "Test Cooper",
      email: "testing5@gmail.com",
      password: "Testing@321",
    };
  });

  afterEach(async () => {
    await server.close();
  });

  describe("Initialization",()=>{
    it("responds to /", async () => {
      const res = await request(server).get("/");
      expect(res.header["content-type"]).toBe("text/html; charset=UTF-8");
      expect(res.status).toBe(200);
    });
  
    it("request post by user signup", async () => {
      const res = await request(server).post("/api/v1/user/signup").send(data);
      resp=res.body
      expect(res.status).toBe(201);
    });
  
  
  
    it("request post by user login", async () => {
      const res = await request(server)
        .post("/api/v1/auth/login")
        .send({ email: resp.email, password: data.password });
      token = res.body.token;
      expect(res.status).toBe(200);
    });
  })

  describe("Get Request /api/v1/user",()=>{

    it("request get user by userID", async () => {
      const res = await request(server)
        .get("/api/v1/user/" + resp._id)
        .set("x-auth-token", token);
      user=res.body
      expect(res.status).toBe(200);
    });
  
    it("request get user by userID without token", async () => {
      const res = await request(server)
        .get("/api/v1/user/" + resp._id)
      user=res.body
      expect(res.status).toBe(401);
    });
  
    it("request get user by wrong objectID", async () => {
      const res = await request(server)
        .get("/api/v1/user/123456778")
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });
  
    it("request get user by wrong userID", async () => {
      const res = await request(server)
        .get("/api/v1/user/62011f09042a68d1e17222d0")
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });
  
  
  
    it("request get user by organizationID", async () => {
      const res = await request(server)
        .get("/api/v1/user/organization/"+resp.organization)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
  
    it("request get user by organizationID without token", async () => {
      const res = await request(server)
        .get("/api/v1/user/organization/"+resp.organization)
      expect(res.status).toBe(401);
    });
  
    it("request get all user", async () => {
      const res = await request(server)
        .get("/api/v1/user")
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
  })
  
  describe("Post Request /api/v1/user",()=>{
       
  it("request post by existing user", async () => {
    let newdata = {
      fullName: "Test Co",
      email: "testing5@gmail.com",
      password: "Testing@321",
    };
    const res = await request(server).post("/api/v1/user/signup").send(newdata);
    expect(res.status).toBe(400);
  });

  it("request post by empty fullName", async () => {
    data.fullName = "";
    const res = await request(server).post("/api/v1/user/signup").send(data);
    expect(res.status).toBe(400);
  });

  it("request post by wrong email", async () => {
    data.email = "testingmail.com";
    const res = await request(server).post("/api/v1/user/signup").send(data);
    expect(res.status).toBe(400);
  });

  it("request post by wrong password format", async () => {
    data.password = "testing321";
    const res = await request(server).post("/api/v1/user/signup").send(data);
    expect(res.status).toBe(400);
  });
  })

  describe("Patch Request /api/v1/user",()=>{
    it("request patch user by wrong objectID", async () => {
      const res = await request(server)
        .patch("/api/v1/user/123456778")
        .set("x-auth-token", token)
        .send(data);
      expect(res.status).toBe(400);
    });
  
    it("request patch user by wrong userID ", async () => {
      const res = await request(server)
        .patch("/api/v1/user/62011f09042a68d1e17222d0")
        .set("x-auth-token", token)
        .send(data);
      expect(res.status).toBe(404);
    });
  
    it("request patch user by userID but token empty ", async () => {
      const res = await request(server)
        .patch("/api/v1/user/" + resp._id)
        .send(data);
      expect(res.status).toBe(401);
    });
  
    it("request patch user by userID with token ", async () => {
      const newData = {
        fullName: "Test New Cooper",
        email: "testing5@gmail.com",
      };
      // const header={'x-auth-token':token}
      const res = await request(server)
        .patch("/api/v1/user/" + resp._id)
        .set("x-auth-token", token)
        .send(newData);
      expect(res.status).toBe(200);
    });
  })

  describe("Delete Request /api/v1/user",()=>{
    it("request delete to wrong objectID", async () => {
      const res = await request(server)
        .delete("/api/v1/user/123456778")
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });
  
    it("request delete to wrong userID", async () => {
      const res = await request(server)
        .delete("/api/v1/user/62011f09042a68d1e17222d0")
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });
  
    it("request delete to right userID but empty token", async () => {
      const res = await request(server).delete("/api/v1/user/" + resp._id);
      expect(res.status).toBe(401);
    });
  
    it("request delete to right userID with token", async () => {
      const res = await request(server)
        .delete("/api/v1/user/" + resp._id)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
  
    it("db closed", async () => {
      // const u=await User.findOneAndDelete({ email: "testing5@gmail.com" });
      await RolePermissionModel.deleteMany({ user: resp._id });
      await mongoose.disconnect();
    });
  })
});
