const request = require("supertest");
let server;
let data;
let user;
let resp;
let plan;


const mongoose = require("mongoose");
const User = require("../../models/user.model");
const { RolePermissionModel } = require("../../models/rolePermission.model");

describe("Plan API ", () => {
  beforeEach(async () => {
    await require("../../app").close();
    server = require("../../app");
    data = {
      fullName: "Test Admin",
      email: "testingadmin@gmail.com",
      password: "Admin@321",
    };

    plan={
      "planName": "113",
      "createdBy": "61fcfa23336ba4b9de05bc7a",
      "planType": "month",
      "description": "Its our plan",
      "amount": 233,
      "features": [
        {
          "featureName": "It create 10 task",
          "status": true
        },
        {
          "featureName": "It create 10 project",
          "status": true
        },
        {
          "featureName": "It create 10 backlogs",
          "status": true
        },
        {
          "featureName": "It create 10 sprints",
          "status": true
        }
      ]
    }
  });

  afterEach(async () => {
    await server.close();
  });

  it("responds to /", async () => {
    const res = await request(server).get("/");
    expect(res.header["content-type"]).toBe("text/html; charset=UTF-8");
    expect(res.status).toBe(200);
  });

  it("request post by admin signup for create plan", async () => {
    const res = await request(server).post("/api/v1/user/signup").send(data);
    user = res.body;
    expect(res.status).toBe(201);
  });
  it("request post by admin to create plan by wrong userID", async () => {
    const res = await request(server).post("/api/v1/plan").send(plan);
    expect(res.status).toBe(404);
  });

  it("request post by admin to create plan", async () => {
    plan.createdBy=user._id
    const res = await request(server).post("/api/v1/plan").send(plan);
    resp = res.body;
    expect(res.status).toBe(201);
  });

  it("request post by admin to create plan but plan is already exist", async () => {
    plan.createdBy=user._id
    const res = await request(server).post("/api/v1/plan").send(plan);
    expect(res.status).toBe(409);
  });

  it("request get by admin to get plan", async () => {
    const res = await request(server).get("/api/v1/plan/"+resp._id);
    expect(res.status).toBe(200);
  });

  it("request get by admin to get plan by wrong objectID", async () => {
    const res = await request(server).get("/api/v1/plan/34783432786");
    expect(res.status).toBe(400);
  });

  it("request get by admin to get plan by wrong planID", async () => {
    const res = await request(server).get("/api/v1/plan/"+user._id);
    expect(res.status).toBe(404);
  });

  it("request get Plan by planType month", async () => {
    let planType="month"
    const res = await request(server).get("/api/v1/plan/plantype/"+planType);
    expect(res.status).toBe(200);
  });


  it("request get Plan by wrong planType", async () => {
    let planType="abcd"
    const res = await request(server).get("/api/v1/plan/plantype/"+planType);
    expect(res.status).toBe(404);
  });

  it("request put by admin to update plan", async () => {
    plan.createdBy=user._id
    plan.description="Its updated plan details"
    const res = await request(server).put("/api/v1/plan/"+resp._id).send(plan);
    expect(res.status).toBe(200);
  });

  it("request put by admin to update plan", async () => {
    plan.description="Its updated plan details"
    const res = await request(server).put("/api/v1/plan/"+resp._id).send(plan);
    expect(res.status).toBe(404);
  });

  it("request delete by admin to wrong plantID", async () => {
    const res = await request(server).delete("/api/v1/plan/"+user._id);
    expect(res.status).toBe(404);
  });

  it("request delete by admin to delete plan", async () => {
    const res = await request(server).delete("/api/v1/plan/"+resp._id);
    expect(res.status).toBe(200);
  });

  it("request delete by admin to wrong objectID", async () => {
    const res = await request(server).delete("/api/v1/plan/232432e65hg");
    expect(res.status).toBe(400);
  });



  it("db closed", async () => {
    await User.deleteOne({_id:user._id})
    await RolePermissionModel.deleteMany({ user: user._id });
    await mongoose.disconnect();
  });
  
  it("request post by admin to create plan but mongoserver is close", async () => {
    plan.createdBy=user._id
    const res = await request(server).post("/api/v1/plan").send(plan);
    expect(res.status).toBe(500);
  });

  it("request get by admin to get plan but mongoserver is close", async () => {
    const res = await request(server).get("/api/v1/plan/"+resp._id);
    expect(res.status).toBe(500);
  });

  it("request get Plan by planType month but mongoserver is close", async () => {
    let planType="month"
    const res = await request(server).get("/api/v1/plan/plantype/"+planType);
    expect(res.status).toBe(500);
  });
  
  it("request put by admin to update plan but mongoserver is close", async () => {
    plan.createdBy=user._id
    plan.description="Its updated plan details"
    const res = await request(server).put("/api/v1/plan/"+resp._id).send(plan);
    expect(res.status).toBe(500);
  });

  it("request delete by admin to delete plan but mongoserver is close", async () => {
    const res = await request(server).delete("/api/v1/plan/"+resp._id);
    expect(res.status).toBe(500);
  });
});
