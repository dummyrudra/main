const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const swaggerUI = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const cors = require("cors");
const session = require("express-session");
const errorHandler = require("../middlewares/errorHandler");
var bodyParser = require("body-parser");

const userRoute = require("../routes/user.route");
const project = require("../routes/project.route");
const task = require("../routes/task.route");
const organization = require("../routes/organization.route");
const auth = require("../routes/auth.route");
const role = require("../routes/role.route");
const permission = require("../routes/permission.route");
const rolePermission = require("../routes/rolePermission.route");
const sprint = require("../routes/sprint.route");
const plan = require("../routes/plan.route");
const list = require("../routes/list.route");
const epic = require("../routes/epic.route");
const notification = require("../routes/notification.route");

const PORT = process.env.PORT || 3000;
const express = require("express");

module.exports = function (app) {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Cooper api",
        version: "1.0.0",
        description: "A simple express library API",
      },
      servers: [
        {
          url: `http://localhost:${PORT}`,
        },
      ],
    },
    apis: ["./swagger/user.js", "./swagger/auth.js", "./swagger/*.js"],
  };
  const specs = swaggerJSDoc(options);

  // app.use(bodyParser.json({limit: '50mb'}));
  app.use(
    cors({
      origin: "*",
    })
  );
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

  app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: true,
    })
  );

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "../public")));

  //routes
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
  app.use("/api/v1/user", userRoute);
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/project", project);
  app.use("/api/v1/organization", organization);
  app.use("/api/v1/task", task);
  app.use("/api/v1/roles", role);
  app.use("/api/v1/permissions", permission);
  app.use("/api/v1/role-permissions", rolePermission);
  app.use("/api/v1/sprints", sprint);
  app.use("/api/v1/plan", plan);
  app.use("/api/v1/list", list);
  app.use("/api/v1/epic", epic);
  app.use("/api/v1/notification", notification);

  //errorHandler
  app.use(errorHandler);
};
