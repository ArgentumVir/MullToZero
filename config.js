var config = {};

// Database
config.host = "localhost";
config.database = "mullToZero";
config.user = "silverman";
config.password =  "databasePassword77";

// Port and Secrets
config.port = process.env.PORT || 8080;
config.sessionSecret = "localSessionSecretString1234321";

module.exports = config;