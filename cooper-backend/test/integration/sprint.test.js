const request = require("supertest");
const mongoose = require("mongoose");
const { SprintModel } = require("../../models/sprint.model");
const { TaskModel } = require("../../models/task.model");
const { ProjectModel } = require("../../models/project.model");
const { RolePermissionModel } = require("../../models/rolePermission.model");
const UserModel = require("../../models/user.model");
const ListModel = require("../../models/list.model");

let server;
let user;
let sprint;
let sprint2;
let project;
let userData;
let token;
let projectData;
let organizationData;
let task;

beforeEach(async () => {
  await require("../../app").close();
  server = require("../../app");
  userData = {
    fullName: "test Role cooper sprint",
    email: "testrolesprint@gmail.com",
    password: "Testsprint@123",
  };
  // organizationData = {
  //   tenant: "620222a1d9c7dd71d1a7762f",
  //   organizationName: "Test Org2",
  //   organizationType: "IT SERVICES cooper2",
  //   organizationUrl: "testorg2.com",
  // };
  projectData = {
    projectName: "TestProject",
    key: "TEst",
    projectLead: "61fba63dbfa413035ca7a3dc",
    avatar: "default.png",
    description: "This project is test based.",
  };
});
afterEach(async () => {
  await server.close();
});

describe("/api/v1/sprints", () => {
  describe("POST", () => {
    it("should return 200 new sprint added.", async () => {
      user = await request(server).post("/api/v1/user/signup").send(userData);

      token = await request(server).post("/api/v1/auth/login").send({
        email: "testrolesprint@gmail.com",
        password: "Testsprint@123",
      });

      projectData.projectLead = user.body._id;
      projectData.organization = user.body.organization;
      project = await request(server)
        .post("/api/v1/project")
        .set("x-auth-token", token.body.token)
        .send(projectData);

      sprint = await request(server)
        .post("/api/v1/sprints/")
        .set("x-auth-token", token.body.token)
        .send({
          sprintName: "S1-sprintT",
          project: project.body._id,
          startDate: "01/01/2050",
          endDate: "01/20/2050",
          duration: 3,
          sprintGoal: "This is test sprint goal.",
        });
      expect(sprint.status).toBe(200);
    });
    it("should return 400 if invalid duration is passed.", async () => {
      const sprint = await request(server)
        .post("/api/v1/sprints/")
        .set("x-auth-token", token.body.token)
        .send({
          sprintName: "S1-sprintT2",
          project: project.body._id,
          startDate: "01/01/2050",
          endDate: "01/20/2050",
          duration: 50,
          sprintGoal: "This is test sprint goal.",
        });
      expect(sprint.status).toBe(400);
    });
    it("should return 400 if project is not found of specified Id.", async () => {
      const sprint = await request(server)
        .post("/api/v1/sprints/")
        .set("x-auth-token", token.body.token)
        .send({
          sprintName: "S1-sprintT2",
          project: mongoose.Types.ObjectId(),
          startDate: "01/01/2050",
          endDate: "01/20/2050",
          duration: 3,
          sprintGoal: "This is test sprint goal.",
        });
      expect(sprint.status).toBe(400);
    });
    it("should return 400 if sprint name is already exist.", async () => {
      const sprint = await request(server)
        .post("/api/v1/sprints/")
        .set("x-auth-token", token.body.token)
        .send({
          sprintName: "S1-sprintT",
          project: project.body._id,
          startDate: "03/01/2050",
          endDate: "03/20/2050",
          duration: 3,
          sprintGoal: "This is test sprint goal.",
        });
      expect(sprint.status).toBe(400);
    });
    it("should return 400 if sprint date is in betweent another sprint.", async () => {
      const sprint = await request(server)
        .post("/api/v1/sprints/")
        .set("x-auth-token", token.body.token)
        .send({
          sprintName: "S1-sprintT2",
          project: project.body._id,
          startDate: "01/05/2050",
          endDate: "01/25/2050",
          duration: 3,
          sprintGoal: "This is test sprint goal 2.",
        });
      expect(sprint.status).toBe(400);
    });
  });

  describe("GET", () => {
    describe("/api/v1/sprints/project/:id", () => {
      it("should return 200 if any project sprint is found.", async () => {
        let sprint = await request(server)
          .get("/api/v1/sprints/project/" + project.body._id)
          .set("x-auth-token", token.body.token);
        expect(sprint.status).toBe(200);
      });
      it("should return 400 if invalid project Id is passed.", async () => {
        const sprint = await request(server)
          .get("/api/v1/sprints/project/" + mongoose.Types.ObjectId())
          .set("x-auth-token", token.body.token);

        expect(sprint.status).toBe(400);
      });
      // it("should return 404 if no sprint is found of project Id.", async () => {
      //   projectData.key = "newKey";
      //   projectData.projectName = "new sprintProject3";
      //   projectData.projectLead = user.body._id;
      //   projectData.organization = user.body.organization;

      //   const project = await request(server)
      //     .post("/api/v1/project")
      //     .set("x-auth-token", token.body.token)
      //     .send(projectData);

      //   console.log(await SprintModel.deleteMany({ project: project.body._id }));

      //   const sprint = await request(server)
      //     .get("/api/v1/sprints/project/" + project.body._id)
      //     .set("x-auth-token", token.body.token);

      //   expect(sprint.status).toBe(404);

      //  console.log(await ListModel.deleteMany({ projectID: project.body._id }));
      //   await ProjectModel.deleteOne({ _id: project.body._id });
      // });
    });
  });

  describe("PUT", () => {
    describe("/api/v1/sprints/:id", () => {
      it("should return 200 if sprint is updated.", async () => {
        const updatedSprint = await request(server)
          .put("/api/v1/sprints/" + sprint.body._id)
          .set("x-auth-token", token.body.token)
          .send({
            sprintName: "S1-sprintU",
            startDate: "01/01/2050",
            endDate: "01/25/2050",
            duration: "4",
            sprintGoal: "This is updated test sprint goal.",
            sprintStatus: "complete",
          });
        expect(updatedSprint.status).toBe(200);
      });
      it("should return 400 if invalid duration is passed.", async () => {
        const sprintUp = await request(server)
          .put("/api/v1/sprints/" + sprint.body._id)
          .set("x-auth-token", token.body.token)
          .send({
            sprintName: "S1-sprintT2UPdate",
            startDate: "01/01/2050",
            endDate: "01/20/2050",
            duration: 50,
            sprintGoal: "This is test sprint goal.",
          });
        expect(sprintUp.status).toBe(400);
      });
      it("should return 400 if sprint is not found of specified sprint Id.", async () => {
        const updatedSprint = await request(server)
          .put("/api/v1/sprints/" + mongoose.Types.ObjectId())
          .set("x-auth-token", token.body.token)
          .send({
            sprintName: "S1-sprintU",
            startDate: "01/01/2050",
            endDate: "01/25/2050",
            duration: "4",
            sprintGoal: "This is updated test sprint goal.",
          });
        expect(updatedSprint.status).toBe(400);
      });
      it("should return 400 if sprint name is already exists.", async () => {
        sprint2 = await request(server)
          .post("/api/v1/sprints/")
          .set("x-auth-token", token.body.token)
          .send({
            sprintName: "S1-sprintU2",
            startDate: "02/01/2051",
            project: project.body._id,
            endDate: "02/20/2051",
            duration: 3,
            sprintGoal: "This is another test sprint goal.",
          });

        const updatedSprint = await request(server)
          .put("/api/v1/sprints/" + sprint2.body._id)
          .set("x-auth-token", token.body.token)
          .send({
            sprintName: "S1-sprintU",
            startDate: "01/26/2050",
            endDate: "01/30/2050",
            duration: "1",
            sprintGoal: "This is updated test sprint goal.",
          });
        expect(updatedSprint.status).toBe(400);
      });
      it("should return 400 if sprint date is in between another sprint.", async () => {
        const updatedSprint = await request(server)
          .put("/api/v1/sprints/" + sprint2.body._id)
          .set("x-auth-token", token.body.token)
          .send({
            sprintName: "S1-sprintU2N",
            startDate: "01/05/2050",
            endDate: "01/30/2050",
            duration: "4",
            sprintGoal: "This is updated test sprint goal.",
          });
        expect(updatedSprint.status).toBe(400);
      });
      it("should return 400 if one sprint is already running for specified project.", async () => {
        const updatedSprint = await request(server)
          .put("/api/v1/sprints/" + sprint2.body._id)
          .set("x-auth-token", token.body.token)
          .send({
            sprintName: "S1-sprintU2N",
            startDate: "05/05/2050",
            endDate: "05/30/2050",
            duration: "4",
            sprintGoal: "This is updated test sprint goal.",
            sprintStatus: "complete",
          });
        expect(updatedSprint.status).toBe(400);
      });
    });
  });

  describe("PATCH", () => {
    describe("/api/v1/sprints/drag-task/:id", () => {
      it("should return 200 if task is moved from one sprint to another sprint.", async () => {
        // const lists = await request(server)
        //   .get("/api/v1/list/" + project.body._id)
        //   .set("x-auth-token", token.body.token);

        //   console.log(lists);
        task = await request(server)
          .post("/api/v1/task")
          .set("x-auth-token", token.body.token)
          .send({
            projectID: project.body._id,
            issueType: "bug",
            sprint: sprint.body._id,
          });
        const updatedSprint = await request(server)
          .patch("/api/v1/sprints/drag-task/" + sprint2.body._id)
          .set("x-auth-token", token.body.token)
          .send({
            previousSprint: sprint.body._id,
            tasks: [task.body._id],
            position: 0,
          });

        expect(updatedSprint.status).toBe(200);
      });
      it("should return 400 if task is not found in previous sprint.", async () => {
        const updatedSprint = await request(server)
          .patch("/api/v1/sprints/drag-task/" + sprint2.body._id)
          .set("x-auth-token", token.body.token)
          .send({
            previousSprint: sprint.body._id,
            tasks: [task.body._id],
            position: 0,
          });

        expect(updatedSprint.status).toBe(400);
      });
      // it("should return 400 if invalid position is provided.", async () => {
      //     const updatedSprint = await request(server)
      //       .patch("/api/v1/sprints/drag-task/" + sprint.body._id)
      //       .set("x-auth-token", token.body.token)
      //       .send({
      //         previousSprint: sprint2.body._id,
      //         task: task.body._id,
      //         position: 50,
      //       });
      //     expect(updatedSprint.status).toBe(400);
      // });
      it("should return 400 if previous sprint is not found.", async () => {
        const updatedSprint = await request(server)
          .patch("/api/v1/sprints/drag-task/" + sprint2.body._id)
          .set("x-auth-token", token.body.token)
          .send({
            previousSprint: mongoose.Types.ObjectId(),
            tasks: [task.body._id],
            position: 0,
          });
        expect(updatedSprint.status).toBe(400);
      });
      it("should return 400 if new sprint is not found.", async () => {
        const updatedSprint = await request(server)
          .patch("/api/v1/sprints/drag-task/" + mongoose.Types.ObjectId())
          .set("x-auth-token", token.body.token)
          .send({
            previousSprint: sprint.body._id,
            tasks: [task.body._id],
            position: 0,
          });
        expect(updatedSprint.status).toBe(400);
        //  await SprintModel.deleteOne({ _id: sprint2.body._id });
      });
      it("should return 400 if invalid task Id is provided .", async () => {
        const updatedSprint = await request(server)
          .patch("/api/v1/sprints/drag-task/" + sprint2.body._id)
          .set("x-auth-token", token.body.token)
          .send({
            previousSprint: sprint.body._id,
            tasks: [mongoose.Types.ObjectId()],
            position: 0,
          });
        // console.log(updatedSprint);
        expect(updatedSprint.status).toBe(400);

        // await SprintModel.deleteOne({ _id: sprint2.body._id });
      });
    });
  });

  describe("DELETE", () => {
    describe("/api/v1/sprints/complete-sprint/:id", () => {
      it("should return 200 if sprint is completed.", async () => {
        const response = await request(server)
          .delete("/api/v1/sprints/complete-sprint/" + sprint.body._id)
          .set("x-auth-token", token.body.token);
        // console.log(response);
        expect(response.status).toBe(200);
      });
      it("should return 400 if sprint is not found.", async () => {
        const response = await request(server)
          .delete(
            "/api/v1/sprints/complete-sprint/" + mongoose.Types.ObjectId()
          )
          .set("x-auth-token", token.body.token);

        expect(response.status).toBe(400);
      });
      it("should return 400 if trying to complete that sprint which is not started.", async () => {
        const response = await request(server)
          .delete("/api/v1/sprints/complete-sprint/" + sprint2.body._id)
          .set("x-auth-token", token.body.token);
        // console.log(response);
        expect(response.status).toBe(400);
      });
      it("should return 401 if trying to complete backlog of project.", async () => {
        const sprint = await request(server)
          .get("/api/v1/sprints/project/" + project.body._id)
          .set("x-auth-token", token.body.token);

        const response = await request(server)
          .delete("/api/v1/sprints/complete-sprint/" + sprint.body[1]._id)
          .set("x-auth-token", token.body.token);
        // console.log(response);
        expect(response.status).toBe(401);
      });
    });
    describe("/api/v1/sprints/:id", () => {
      it("should return 200 if sprint is deleted.", async () => {
        const response = await request(server)
          .delete("/api/v1/sprints/" + sprint2.body._id)
          .set("x-auth-token", token.body.token);

        expect(response.status).toBe(200);
      });
      it("should return 400 if sprint is not deleted.", async () => {
        const response = await request(server)
          .delete("/api/v1/sprints/" + sprint2.body._id)
          .set("x-auth-token", token.body.token);

        expect(response.status).toBe(400);
      });
      it("should return 401 if trying to complete backlog of project.", async () => {
        const sprint = await request(server)
          .get("/api/v1/sprints/project/" + project.body._id)
          .set("x-auth-token", token.body.token);

        const response = await request(server)
          .delete("/api/v1/sprints/" + sprint.body[1]._id)
          .set("x-auth-token", token.body.token);

        expect(response.status).toBe(401);
      });
    });
  });
});

describe("Disconnect", () => {
  it("dissconnect mongodb", async () => {
    await UserModel.deleteOne({ _id: user.body._id });
    await SprintModel.deleteOne({ _id: sprint.body._id });
    await SprintModel.deleteMany({ project: project.body._id });
    await SprintModel.deleteMany({ sprintName: "backlog" });
    await TaskModel.deleteOne({ _id: task.body._id });
    await ListModel.deleteMany({ projectID: project.body._id });
    await ProjectModel.deleteOne({ _id: project.body._id });
    // await OrganizationModel.deleteOne({ _id: organization.body._id });
    await RolePermissionModel.deleteMany({ user: user.body._id });
    await mongoose.disconnect();
  });
});
