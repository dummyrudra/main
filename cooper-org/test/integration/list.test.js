const request = require("supertest");
let server;
let project;
let resp;
let token;
let user;
let listData;

const mongoose = require("mongoose");
const { RolePermissionModel } = require("../../models/rolePermission.model");
const User = require("../../models/user.model");
const { ProjectModel } = require("../../models/project.model");
const ListModel = require("../../models/list.model");

describe("List API", () => {
  beforeEach(async () => {  
    await require("../../app").close();
    server = require("../../app");
    data = {
      fullName: "Test Cooper List",
      email: "testinglist@gmail.com",
      password: "Testing@321",
    };
    listData={
      listName:"in progress",
      projectID:"61fba0ba35a56f19ab4fa9e1"
    }
  });

  afterEach(async () => {
    await server.close();
  });
    
  it("initialise the project id ", async () => {
    project=await ProjectModel({
      projectName: "Cooper TestList",
      organization: "61fba0ba35a56f19ab4fa9e1",
      key: "CTOL",
      url: "www.coopl.com",
      owner:"61fba0ba35a56f19ab4fa9e1",
      projectType: "Software",
      projectLead: "61fba0ba35a56f19ab4fa9e1",
      avatar: "avatar.png",
      description: "this is test case",
    }).save()
  });
  
  it("request post by user signup", async () => {
    const res = await request(server).post("/api/v1/user/signup").send(data);
    user = res.body;
    expect(res.status).toBe(201);
  });

  it("request post by user login", async () => {
    const res = await request(server)
      .post("/api/v1/auth/login")
      .send({ email: user.email, password: data.password });
    token = res.body.token;
    expect(res.status).toBe(200);
  });

  it("request post to create list wrong projectID", async () => {
    const res = await request(server).post("/api/v1/list/324355654435435").set('x-auth-token',token).send(listData);
    expect(res.status).toBe(400);
  });

  it("request post to create list without token", async () => {
    const res = await request(server).post("/api/v1/list/"+project._id).send(listData);
    expect(res.status).toBe(401);
  });

  it("request post to create list but projectID not found", async () => {
    const res = await request(server).post("/api/v1/list/"+listData.projectID).set('x-auth-token',token).send(listData);
    expect(res.status).toBe(404);
  });

  it("request post to create list", async () => {
    const res = await request(server).post("/api/v1/list/"+project._id).set('x-auth-token',token).send(listData);
    expect(res.status).toBe(201);
  });

  it("request post to create list but already added this listName", async () => {
    const res = await request(server).post("/api/v1/list/"+project._id).set('x-auth-token',token).send(listData);
    expect(res.status).toBe(409);
  });

  it("request get list by projectID", async () => {
    const res = await request(server).get("/api/v1/list/"+project._id).set('x-auth-token',token);
    resp = res.body[0];
    expect(res.status).toBe(200);
  });

  it("request get list by wrong projectID", async () => {
    const res = await request(server).get("/api/v1/list/"+listData.projectID).set('x-auth-token',token);
    expect(res.status).toBe(404);
  });

  it("request get list by projectID without token", async () => {
    const res = await request(server).get("/api/v1/list/"+listData.projectID);
    expect(res.status).toBe(401);
  });

  it("request get list by projectID but wrong objectID", async () => {
    const res = await request(server).get("/api/v1/list/3487h3bh838903").set('x-auth-token',token);
    expect(res.status).toBe(400);
  });

  it("request patch change listName but already exist", async () => {
    const res = await request(server).patch("/api/v1/list/"+resp._id).set('x-auth-token',token).send(listData);
    expect(res.status).toBe(409);
  });

  it("request patch change listName without token", async () => {
    const res = await request(server).patch("/api/v1/list/"+resp._id).send(listData);
    expect(res.status).toBe(401);
  });

  it("request patch change listName wrong objectID", async () => {
    listData.listName="doing"
    const res = await request(server).patch("/api/v1/list/737h3b87hrbnrr").set('x-auth-token',token).send(listData);
    expect(res.status).toBe(400);
  });

  it("request patch change listName but already exist", async () => {
    listData.listName="doing"
    const res = await request(server).patch("/api/v1/list/"+resp._id).set('x-auth-token',token).send(listData);
    expect(res.status).toBe(200);
  });
  
  it("request delete list by listID but wrong objectID", async () => {
    const res = await request(server).delete("/api/v1/list/3487h3bh838903").set('x-auth-token',token);
    expect(res.status).toBe(400);
  });

  it("request delete list by listID without token", async () => {
    const res = await request(server).delete("/api/v1/list/"+resp._id);
    expect(res.status).toBe(401);
  });

  it("request delete list by listID without token", async () => {
    const res = await request(server).delete("/api/v1/list/"+resp._id).set('x-auth-token',token);
    expect(res.status).toBe(200);
  });


  it("db closed", async () => {      
    await User.findOneAndDelete({_id:user._id});
    await RolePermissionModel.deleteMany({ user: user._id });
    await ListModel.deleteOne({projectID:project._id})
    await ProjectModel.deleteOne({_id:project._id})
    await mongoose.disconnect();
  });
});
