-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 06, 2026 at 02:25 PM
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
-- Table structure for table `guide`
--

DROP TABLE IF EXISTS `guide`;
CREATE TABLE IF NOT EXISTS `guide` (
  `guideID` int NOT NULL AUTO_INCREMENT,
  `guideCode` CHAR(4) NOT NULL,
  `userID` int NOT NULL,
  `title` varchar(80) NOT NULL,
  `description` longtext NOT NULL,
  `imageUrl` varchar(255) NOT NULL,
  `mediaUrl` varchar(255) NOT NULL,
  `datePosted` date NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`guideID`),
  KEY `fk_guide` (`userID`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `guide`
--

INSERT INTO `guide` (`guideCode`, `userID`, `title`, `description`, `imageUrl`, `mediaUrl`, `datePosted`) VALUES
('G001', 5, 'Guide to Gardens by the Bay', 'Gardens by the Bay is undoubtedly one of the most famous attractions in Singapore. It’s super futuristic and beautiful and is definitely one of the highlights for a first time visitor to the country.', 'gbtb.jpg', 'https://travellinghan.com/2025/05/28/gardens-by-the-bay-a-guide/', '2025-05-28'),
('G002', 9, 'Get around with Ease, Singapore MRT Guide', 'This comprehensive guide is here to help you unravel the mysteries of Singapore MRT (Mass Rapid Transit) system, a key pillar of Singapore public transportation network.', 'mrt.jpg', 'https://www.monsterdaytours.com/post/get-around-with-ease-singapore-mrt-guide', '2023-10-12'),
('G003', 9, 'Perfect 3-Day Singapore Travel Itinerary for First Timers', 'I put together this 3-day plan that’ll take you to all the good spots – from the famous places everyone knows to some neat cultural areas too', 'itinerary_guide_1.jpg', 'https://runawayann.com/singapore-travel-itinerary/', '2025-03-20'),
('G004', 6, 'Singapore Travel Tips', 'No description', 'itinerary_guide_2.jpg', 'https://www.pinterest.com/pin/240942648806995336/', '2025-05-28');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
