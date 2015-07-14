var config = {};

// Database
config.host = "localhost";
config.database = "mullToZero";
config.user = "silverman";
config.password =  "databasePassword77";

config.createUserTable = "CREATE TABLE `user` (`iduser` INT NOT NULL COMMENT '', `password` VARCHAR(255) NOT NULL COMMENT '', `email` VARCHAR(255) NOT NULL COMMENT '', PRIMARY KEY (`iduser`)  COMMENT '', UNIQUE INDEX `iduser_UNIQUE` (`iduser` ASC)  COMMENT '', UNIQUE INDEX `email_UNIQUE` (`email` ASC)  COMMENT '');";

config.createCardTable = "CREATE TABLE `card` (`id` VARCHAR(45) NOT NULL COMMENT '', `name` MEDIUMTEXT NOT NULL COMMENT '', `type` VARCHAR(255) NULL COMMENT '', `rarity` VARCHAR(45) NULL COMMENT '', `manacost` VARCHAR(255) NULL COMMENT '', `converted_manacost` VARCHAR(45) NULL COMMENT '', `power` VARCHAR(45) NULL COMMENT '', `toughness` VARCHAR(45) NULL COMMENT '', `loyalty` VARCHAR(45) NULL COMMENT '', `ability` MEDIUMTEXT NULL COMMENT '', `color` VARCHAR(45) NULL COMMENT '', `generated_mana` VARCHAR(45) NULL COMMENT '', PRIMARY KEY (`id`)  COMMENT '', UNIQUE INDEX `id_UNIQUE` (`id` ASC)  COMMENT '');";

config.createDeckTable = "CREATE TABLE `deck` (`iddeck` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '', `iduser` INT NOT NULL COMMENT '', `name` VARCHAR(255) NULL COMMENT '',`description` MEDIUMTEXT NULL COMMENT '' AFTER `name`, PRIMARY KEY (`iddeck`)  COMMENT '', UNIQUE INDEX `iddeck_UNIQUE` (`iddeck` ASC)  COMMENT '', INDEX `id_idx` (`iduser` ASC)  COMMENT '', CONSTRAINT `id` FOREIGN KEY (`iduser`)  REFERENCES `mulltozero`.`user` (`iduser`) ON DELETE NO ACTION ON UPDATE NO ACTION);";

config.createDeckListTable = "CREATE TABLE `mulltozero`.`decklist` (`iddecklist` INT NOT NULL AUTO_INCREMENT COMMENT '', `iddeck` INT(10) UNSIGNED NOT NULL COMMENT '',  `idcard` VARCHAR(45) NOT NULL COMMENT '', PRIMARY KEY (`iddecklist`)  COMMENT '', UNIQUE INDEX `iddecklist_UNIQUE` (`iddecklist` ASC)  COMMENT '', INDEX `iddeck_idx` (`iddeck` ASC)  COMMENT '', INDEX `idcard_idx` (`idcard` ASC)  COMMENT '', CONSTRAINT `iddeck` FOREIGN KEY (`iddeck`) REFERENCES `mulltozero`.`deck` (`iddeck`) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT `idcard` FOREIGN KEY (`idcard`) REFERENCES `mulltozero`.`card` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION);";


// Port and Secrets
config.port = process.env.PORT || 8080;
config.sessionSecret = "localSessionSecretString1234321";

module.exports = config;