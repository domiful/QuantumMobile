const backendService = require("~/services/backend-service");
const application = require("tns-core-modules/application");

backendService.setup(); // Initialize Kinvey Backend
application.run({ moduleName: "app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
