-- Create the database if not exists
CREATE DATABASE IF NOT EXISTS REALTIMECHAT;

-- Use the database
USE REALTIMECHAT;

-- Delete the user table if exists
DROP TABLE IF EXISTS USER;

-- Delete the message table if exists
DROP TABLE IF EXISTS MESSAGE;

-- Create the user table
CREATE TABLE USERTABLE (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Create the message table
CREATE TABLE MESSAGE (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message TEXT NOT NULL,
    date_sent DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id_from BINARY(16) NOT NULL,
    user_id_to BINARY(16) NOT NULL,
    viewed BOOLEAN
);

-- Create the log table
CREATE TABLE LOG (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    level ENUM('ERROR', 'INFO') NOT NULL,
    stack TEXT NOT NULL
);

-- Add foreign key in the message table
ALTER TABLE MESSAGE
ADD CONSTRAINT fk_message_user_to
FOREIGN KEY (user_id_to) REFERENCES USERTABLE(id);

ALTER TABLE MESSAGE
ADD CONSTRAINT fk_message_user_from
FOREIGN KEY (user_id_from) REFERENCES USERTABLE(id);

-- Default users
INSERT INTO USERTABLE (username, email, password) VALUES
('Alejandro', 'alejandro@techmail.com', '$2b$10$s..RBPuPn758P5ZEYjHok.PYMegt3b63uwm3La0G9oPDykzQ4Es82'),
('Beatriz', 'beatriz@techmail.com', '$2b$10$j8eLikTgOrPO0UyjEz4BX.JrJDMWi6qOl6BCB3QJsa66YE40YtrXm'),
('Santiago', 'santiago@techmail.com', '$2b$10$Q806jRd./Go7nUE6VEWyYuoOXG9OHOdsQu6FigGWLbIstWFto2C4G'),
('Gabriela', 'gabriela@techmail.com', '$2b$10$hbm4qMqCzeZoeJcuFEMLueNu..32nzdqMkbb/9MzL/7cqhqOFhAJa'),
('Valentina', 'valentina@techmail.com', '$2b$10$yc7BBeX2Ag7UJ2R6SMGXp.t4kbJYIGCsK80jqfacU0LfocsbxZU2C'),
('Leonardo', 'leonardo@techmail.com', '$2b$10$PIusmLGCjPZ6.6EtFbx/5uBeW45P4N5I2WDqhtMTS6.OEWyCCOcai'),
('Joaquin', 'joaquin@techmail.com', '$2b$10$Sb/dyb8.gqs.II11ypuxm.pdo3CvYi5hHpJvPsqFPGgQmj06BB2L2'),
('Mariana', 'mariana@techmail.com', '$2b$10$k9efCGZo4eWsxs2I2aWZ0O9OOCIDKoeAJoP6.y5DUuIRUuvYKcwtO'),
('Eduardo', 'eduardo@techmail.com', '$2b$10$KBG5ArJ2VRZiHSotUG.d5uExszee2XwFlZJ6Tbd/2rutCMt.cGjbq'),
('Nicolas', 'nicolas@techmail.com', '$2b$10$J/9yUVILiG7mSteASc/xSOqIUvHOVxymNoOg2GM08Fq3RUj2gCeLe'),
('Patricia', 'patricia@techmail.com', '$2b$10$bCP14ObFKLpqJ/wD24Y/ZOf7sXrq4kQXUoeWwE3SVow6ifsBqaBRW'),
('Martin', 'martin@techmail.com', '$2b$10$eIqL3KaKVCWgm720O97mne/vHJ1VE6fRV2cKDoli7KhT3.P8Qxil6'),
('Agustin', 'agustin@techmail.com', '$2b$10$WSgBt2O.V1Mxe06M7DkoZujhpzXNz0ZSavNprR4pPhvaHuvyPLQtO'),
('Federico', 'federico@techmail.com' , '$2b$10$hhaYSl3PH4jFS5doZE.7Ju7yb6Pyq.VwHC9OvDtVbhVSXkT0csgse'),
('Manuela', 'manuela@techmail.com', '$2b$10$ylrETqWb7YM1dR1LAJcqcOWHfQD2KyCYFpVxlnOfRgQNoYCke.lCW');
