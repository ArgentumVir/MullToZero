var config = {};

//config.host = "silverman-PC";
config.host = "localhost";
config.database = "mullToZero";
config.user = "silverman";
config.password =  "databasePassword77";

config.port = process.env.PORT || 8080;
config.sessionSecret = "localSessionSecretString1234321";

module.exports = config;