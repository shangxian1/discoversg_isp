-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 06, 2026 at 02:32 PM
-- Server version: 8.2.0
-- PHP Version: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `isp_proj`
--

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `userID` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `roleID` int UNSIGNED NOT NULL,
  `userName` varchar(30) NOT NULL,
  `userPassword` varchar(255) NOT NULL,
  `userEmail` varchar(50) NOT NULL,
  `userPhoneNo` varchar(15) DEFAULT NULL,
  `userDescription` varchar(200) DEFAULT NULL,
  `profilePicUrl` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `idx_user_email` (`userEmail`),
  KEY `idx_user_roleID` (`roleID`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userID`, `roleID`, `userName`, `userPassword`, `userEmail`)
VALUES
(1, 1, 'user', '12345', 'user@discoversg.com'),
(2, 2, 'sg-untold', '12345', 'untold@yahoo.com'),
(3, 2, 'bryan', '12345', 'byran12@gmail.com'),
(4, 2, 'world-hikes', '12345', 'world-hikes@yahoo.com'),
(5, 2, 'travel520', '12345', 'travel520@yahoo.com'),
(6, 2, 'lumen187', '12345', 'lumen@hotmail.com'),
(7, 2, 'shoutsg', '12345', 'shoutsg@google.com'),
(8, 2, 'grace12', '12345', 'grace@gmail.com'),
(9, 2, 'botakspirit', '12345', 'botak@yahoo.com');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
