const request = require("supertest");
const { TaskModel } = require("../../models/task.model");
let server;
let task;
let resp;
let project;
let sprint;
let assignee;
let token;
const assigneeData = {
  fullName: "Test Dev",
  email: "testdev12@gmail.com",
  password: "Test@123",
};
const mongoose = require("mongoose");
const { ProjectModel } = require("../../models/project.model");
const { SprintModel } = require("../../models/sprint.model");
const User = require("../../models/user.model");
const { RolePermissionModel } = require("../../models/rolePermission.model");
const ListModel = require("../../models/list.model");

describe("Task Api", () => {
  beforeEach(async () => {
    await require("../../app").close();
    server = require("../../app");

    task = {
      labels: ["cooperdemo 332"],
      projectID: "6200f1fd42441812d09804a7",
      issueType: "bug",
      summary: "Its a project Management",
      description: "software data",
      assigneeID: "6200f1ff42441812d09804b8",
      sprint: "6200f1ff42441812d09804b2",
      storyPointEstimate: 2
    };
  });

  afterEach(async () => {
    await server.close();
  });


  it("request post by user login", async () => {
    const resp = await request(server)
      .post("/api/v1/user/signup")
      .send(assigneeData);
    assignee = resp.body;
    const res = await request(server)
      .post("/api/v1/auth/login")
      .send({ email: assignee.email, password: "Test@123" });

    token = res.body.token;
    expect(res.status).toBe(200);
  });

  it("initialization of models", async () => {
    const projectData =await request(server)
        .post("/api/v1/project")
        .set("x-auth-token", token)
        .send({
          projectName: "Cooper Test",
          organization: "61fba0ba35a56f19ab4fa9e1",
          key: "CTO",
          url: "www.coop.com",
          projectType: "Software",
          projectLead: assignee._id,
          avatar: "avatar.png",
          description: "this is test case",
        });
    project = projectData.body;
    // console.log(project)
    const sprintData = await new SprintModel({
      sprintName: "Sprint 1",
      project: "61fba0ba35a56f19ab4fa9e1",
      startDate: "2022-02-07T13:53:12.145+00:00",
      endDate: "2022-02-07T13:53:12.145+00:00",
      duration: 4,
      sprintGoal: "To get maximum efforts",
      createdBy: "61fba0ba35a56f19ab4fa9e1",
    }).save();
    sprint = sprintData;
  });

  it("request post task", async () => {
    task.projectID = project._id;
    task.sprint = sprint._id;
    task.assigneeID = assignee._id;
    const res = await request(server)
      .post("/api/v1/task")
      .set("x-auth-token", token)
      .send(task);
    resp = res.body;
    // console.log(resp)
    expect(res.status).toBe(200);
  });

  it("request get task by taskID", async () => {
    const res = await request(server)
      .get("/api/v1/task/" + resp._id)
      .set("x-auth-token", token);
    expect(res.status).toBe(200);
  });

  it("request get All task", async () => {
    const res = await request(server)
      .get("/api/v1/task/project/"+resp.projectID)
      .set("x-auth-token", token);
    expect(res.status).toBe(200);
  });

  it("request get by assignee ID", async () => {
    const res = await request(server)
      .get("/api/v1/task/assignee/" + resp.assigneeID)
      .set("x-auth-token", token);
    expect(res.status).toBe(200);
  });

  it("request get by reporter ID", async () => {
    const res = await request(server)
      .get("/api/v1/task/user/reporter")
      .set("x-auth-token", token);
      // console.log(res)
    expect(res.status).toBe(200);
  });

  it("request get task by wrong taskID", async () => {
    const res = await request(server)
      .get("/api/v1/task/123456778")
      .set("x-auth-token", token);
    expect(res.status).toBe(400);
  });

  it("request post by reporter if projectID is invalid", async () => {
    task.projectID = "61fbd2dd5a02be19cb5e0a85";
    const res = await request(server)
      .post("/api/v1/task")
      .set("x-auth-token", token)
      .send(task);
    expect(res.status).toBe(404);
  });

  // it("request post by reporter if listID is invalid", async () => {
  //   task.projectID = project._id;
  //   task.sprint = sprint._id;
  //   const res = await request(server)
  //     .post("/api/v1/task")
  //     .set("x-auth-token", token)
  //     .send(task);
  //   expect(res.status).toBe(404);
  // });

  it("request post by reporter wrongID", async () => {
    const res = await request(server)
      .post("/api/v1/task")
      .set("x-auth-token", token)
      .send(task);
    expect(res.status).toBe(404);
  });

  it("request post by empty projectID", async () => {
    task.projectID = "";
    const res = await request(server)
      .post("/api/v1/task")
      .set("x-auth-token", token)
      .send(task);
    expect(res.status).toBe(400);
  });

  it("request post by wrong projectID", async () => {
    task.projectID = "61f2837bd4f0108adc2c0179";
    const res = await request(server)
      .post("/api/v1/task")
      .set("x-auth-token", token)
      .send(task);
    expect(res.status).toBe(404);
  });

  it("request post by wrong sprint", async () => {
    task.projectID = project._id;
    task.sprint = "61f2837bd4f0108adc2c0179";
    const res = await request(server)
      .post("/api/v1/task")
      .set("x-auth-token", token)
      .send(task);
    expect(res.status).toBe(404);
  });

  it("request put task by wrong objectID", async () => {
    const res = await request(server)
      .patch("/api/v1/task/123456778")
      .set("x-auth-token", token)
      .send(task);
    expect(res.status).toBe(400);
  });

  it("request put task by wrong taskID", async () => {
    const res = await request(server)
      .patch("/api/v1/task/61f2837bd4f0108adc2c0179")
      .set("x-auth-token", token)
      .send(task);
    expect(res.status).toBe(404);
  });

  it("request patch task by taskID", async () => {
    const res = await request(server)
      .patch("/api/v1/task/"+resp._id)
      .set("x-auth-token", token)
      .send({description:"Hello Test Description"});
    expect(res.status).toBe(200);
  });

  it("request patch task by taskID add comment", async () => {
    const newTask = { message: "hello Supertest"};
    const res = await request(server)
      .patch("/api/v1/task/" + resp._id)
      .set("x-auth-token", token)
      .send(newTask);
    expect(res.status).toBe(200);
  });

  it("request delete to wrong objectID", async () => {
    const res = await request(server)
      .delete("/api/v1/task/123456778")
      .set("x-auth-token", token);
    expect(res.status).toBe(400);
  });

  it("request delete to wrong taskID", async () => {
    const res = await request(server)
      .delete("/api/v1/task/61f2837bd4f0108adc2c0179")
      .set("x-auth-token", token);
    expect(res.status).toBe(404);
  });

  it("request delete to task by TaskID", async () => {
    const res = await request(server)
      .delete("/api/v1/task/"+resp._id)
      .set("x-auth-token", token);
    expect(res.status).toBe(200);
  });
  it("db closed", async () => {
    await ProjectModel.deleteOne({_id:project._id });
    await SprintModel.deleteMany({ project: project._id});
    await SprintModel.deleteOne({ project:"61fba0ba35a56f19ab4fa9e1" });
    await SprintModel.deleteMany({ sprintName: "backlog" });
    await User.deleteOne({ email: assignee.email });
    await ListModel.deleteMany({projectID:project._id})
    await RolePermissionModel.deleteMany({ user: assignee._id });
    await TaskModel.deleteOne({ projectID: "6200f1fd42441812d09804a7" });
    await ProjectModel.deleteOne({_id:project._id})
    await TaskModel.deleteOne({_id:resp._id})
    await mongoose.disconnect();
  });
});
