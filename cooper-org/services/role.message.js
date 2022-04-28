module.exports = {
  NO_DEFAULT_ROLES: {
    status: 404,
    message: "There is no default Roles available.",
  },
  NO_ROLE_OF_ROLEID: {
    status: 404,
    message: "There is no Role available of specified Id.",
  },
  NO_ROLE_OF_ORGANIZATIONID: {
    status: 404,
    message: "There is no Roles available of specified Id.",
  },
  NO_ROLE_OF_TENANTID: {
    status: 404,
    message: "There is no Roles available of specified Id.",
  },
  NO_TENANT_ID: {
    status: 400,
    message: "There is no tenant of specified id.",
  },
  NO_ORGANIZATION_ID: {
    status: 400,
    message: "There is no organization of specified id.",
  },
  ROLE_NAME_ALREADY_EXISTS: {
    status: 400,
    message: "Role Name is already taken.",
  },
  UNAUTHORIZED_DELETE_DEFAULT_ROLE: {
    status: 401,
    message: "You don't have permission to delete default roles.",
  },
  SUCCESSFULLY_ROLE_DELETED: {
    status: 200,
    message: "Role deleted successfully.",
  },
  ROLE_UPDATED: {
    status: 200,
    message: "Role updated successfully.",
  },
  NO_DEFAULT_PERMISSIONS: {
    status: 404,
    message: "There is no default Permissions available.",
  },
  NO_PERMISSION_OF_ORGANIZATIONID: {
    status: 404,
    message: "There is no Permission available of specified Id.",
  },
  NO_PERMISSION_OF_TENANTID: {
    status: 404,
    message: "There is no Permission available of specified Id.",
  },
  PERMISSION_NAME_ALREADY_EXISTS: {
    status: 400,
    message: "Permission name is already taken.",
  },
  UNAUTHORIZED_DELETE_DEFAULT_PERMISSION: {
    status: 401,
    message: "You don't have permission to delete default permission.",
  },
  UNAUTHORIZED_UPDATE_DEFAULT_ROLE: {
    status: 401,
    message: "You don't have permission to delete default permission.",
  },
  SUCCESSFULLY_PERMISSION_DELETED: {
    status: 200,
    message: "Permission deleted successfully.",
  },
  NO_PERMISSION_OF_PERMISSIONID: {
    status: 404,
    message: "There is no Permission available of specified Id.",
  },
  NO_ROLE_PERMISSIONS: {
    status: 400,
    message: "There is no Role Permissions available of specified User Id",
  },
  ROLE_PERMISSIONS_ALREADY_ASSIGNED: {
    status: 400,
    message: "This role is already assigned to this user.",
  },
  TENANT_NOT_ALLOWED: {
    status: 401,
    message: "Tenant is not allowed to change role",
  },
  ORGANIZATION_MEMBER_NOT_FOUND: {
    status: 400,
    message: "User is not a member of this organization.",
  },
  UNAUTHORIZED_REVOKE_DEFAULT_ROLE_PERMISSION: {
    status: 401,
    message: "Can not revoke default role permission.",
  },
  UNAUTHORIZED_CHANGE_ADMIN_ROLE_PERMISSION: {
    status: 401,
    message: "Can not change admin's role permission.",
  },
  SUCCESSFULLY_ROLE_PERMISSION_REVOKED: {
    status: 200,
    message: "Role successfully revoked.",
  },
  PROJECT_NOT_FOUND: {
    status: 400,
    message: "There is no project available of specified Id.",
  },
  USER_NOT_FOUND: {
    status: 400,
    message: "There is no user available of specified Id.",
  },
  SPRINT_NAME_ALREADY_EXIST: {
    status: 400,
    message: "Sprint name is already exists for this project.",
  },
  SPRINT_BETWEEN_ANOTHER_SPRINT: {
    status: 400,
    message:
      "A sprint of specified project is already running between specified sprint dates.",
  },
  ONE_SPRINT_ALREADY_RUNNING: {
    status: 400,
    message: "One Sprint is already running for this project.",
  },
  INVALID_DURATION: {
    status: 400,
    message: "Please provide duration in week according to start and end date.",
  },
  NO_SPRINTS_OF_PROJECTID: {
    status: 404,
    message: "There is no sprints of specified Project ID.",
  },
  SPRINT_DELETED_SUCCESS: {
    status: 200,
    message: "Sprint successfully deleted.",
  },
  NO_SPRINTS_OF_SPRINTID: {
    status: 400,
    message: "There is no sprint of specified sprint ID.",
  },
  SPRINT_NOT_FOUND: {
    status: 400,
    message: "There is no sprint of specified ID.",
  },
  SPRINT_UPDATED: {
    status: 200,
    message: "Sprint updated successfully.",
  },
  TENANT_NOT_FOUND: {
    status: 400,
    message: "There is no tenant of specified ID.",
  },
  UNAUTHORIZED: {
    status: 401,
    message: "Unauthorised! You don't have permission.'",
  },
  PREVIOUS_SPRINT_NOT_FOUND: {
    status: 400,
    message: "Previous sprint not found.",
  },
  NEW_SPRINT_NOT_FOUND: {
    status: 400,
    message: "New sprint not found.",
  },
  TASK_NOT_FOUND: {
    status: 400,
    message: "Task Not Found.",
  },
  INVALID_POSITION: {
    status: 400,
    message: "Invalid position.",
  },
  TASK_SUCCESSFULLY_DRAGGED: {
    status: 200,
    message: "Task sucessfully dragged.",
  },
  TASK_NOT_FOUND_IN_PREVIOUS_SPRINT: {
    status: 400,
    message: "Task not found in previous sprint.",
  },
  UNAUTHORIZED_DELETE_BACKLOG: {
    status: 401,
    message: "Unauthorised! You don't have permission to delete backlog.",
  },
  UNAUTHORIZED_UPDATE_BACKLOG: {
    status: 401,
    message:
      "Unauthorised! You don't have permission to update backlog status.",
  },
  SPRINT_COMPLETED_SUCCESSFULLY: {
    status: 200,
    message: "Sprint Successfully Completed!'.",
  },
  SPRINT_MUST_START: {
    status: 400,
    message: "Sprint must start first!'.",
  },
  NOT_A_MEMBER_OF_PROJECT: {
    status: 401,
    message: "Unauthorised! You are not a member of this project.",
  },
};
