const generateRolesAndPermissions = require("./generateRolesAndPermissionDefaultRecords");


generateRolesAndPermissions().then(() => console.log('permission script seeded sucessfully'));