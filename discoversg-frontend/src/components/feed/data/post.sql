-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 06, 2026 at 02:28 PM
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
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
CREATE TABLE IF NOT EXISTS `post` (
  `postID` int NOT NULL AUTO_INCREMENT,
  `postCode` CHAR(4) NOT NULL,
  `userID` int UNSIGNED NOT NULL,
  `title` varchar(64) NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `addressName` varchar(255) NOT NULL,
  `fullAddress` varchar(255) NOT NULL,
  `noOfLikes` int NOT NULL DEFAULT '0',
  `mediaUrl` varchar(255) DEFAULT NULL,
  `datePosted` date NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`postID`),
  KEY `idx_post_userID` (`userID`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`postCode`, `userID`, `title`, `description`, `addressName`, `fullAddress`, `noOfLikes`, `mediaUrl`, `datePosted`) VALUES
('P001', 8, 'Singapore Hidden Gems Explore Vibrant Streets & Iconic Spots!', 'The video highlights Kampong Glam as its primary filming location, a historic neighborhood featuring the Sultan Mosque, the artistic Haji Lane, and the Hjh Maimunah Restaurant. Located a short distance from this area is the vibrant cultural district of Little India, which is celebrated for its colorful and lively streets. Finally, the video transitions to the modern waterfront of Marina Bay, home to the world-famous Gardens by the Bay and its iconic Supertrees.', 'Kampong Glam', '3 Muscat St, Singapore 198833', 139, 'https://youtube.com/embed/tPcCpGDkyXg?autoplay=1', '2025-01-14'),
('P002', 2, 'Natural Relaxation at Sembawang Hot Spring Park', 'Sembawang Hot Spring Park is Singapore\'s only natural hot spring, offering a nostalgic and rustic retreat for locals and tourists alike. Visitors can enjoy a relaxing foot bath in the cascading pools or participate in the unique tradition of boiling eggs in the hot spring water. The park’s lush greenery and floral walkways provide a serene environment, making it a perfect spot to unwind and experience a different side of Singapore’s urban landscape.', 'Sembawang Hot Spring Park', 'Along Gambas Avenue, Singapore 756952', 245, 'https://www.youtube.com/embed/qUC_5VstTH4', '2025-05-12'),
('P003', 2, 'A Solemn Tribute at Kranji War Memorial', 'The Kranji War Memorial stands as a peaceful and dignified tribute to the men and women from the Commonwealth who died in the line of duty during World War II. The site features the War Cemetery, the State Cemetery, and the Military Authorities Cemetery, all meticulously maintained with rows of white headstones against a hillside backdrop. Its quiet, hilltop location offers a space for reflection on Singapore’s history and the sacrifices made during the war.', 'Kranji War Memorial', '9 Woodlands Rd, Singapore 738656', 132, 'https://www.youtube.com/embed/n-YbYuFNxUo', '2025-06-18'),
('P004', 2, 'Creative Vibes at New Bahru', 'New Bahru is Singapore’s latest creative cluster, housed in the former Nan Chiau High School building. This vibrant lifestyle destination brings together a curated collection of local brands, artisanal workshops, and unique dining concepts. It serves as a community hub that celebrates Singaporean design and entrepreneurship, offering visitors a chance to explore innovative retail spaces and enjoy a modern twist on local heritage.', 'New Bahru', '46 Kim Yam Rd, Singapore 239351', 389, 'https://www.youtube.com/embed/bUYm8SO_c9Y', '2025-09-02'),
('P005', 3, 'The Iconic Fort Canning Tree Tunnel', 'The IconOne of the most photographed spots in the city, the Fort Canning Tree Tunnel features a stunning spiral staircase that looks up toward a massive, ancient tree canopy. This architectural marvel blends man-made structures with nature, creating a dramatic frame for photos. It is a must-visit destination for anyone exploring the historical grounds of Fort Canning Hill, offering a unique perspective of Singapore’s lush urban greenery.', 'Fort Canning Tree Tunnel', '51 Canning Rise, Singapore 179872', 912, 'https://www.youtube.com/embed/-4wlHxaK4sU?start=50', '2025-03-22'),
('P006', 3, 'Marvel at The Whispering Vortex', 'Located within the magnificent Jewel Changi Airport, the Whispering Vortex is part of the world’s tallest indoor waterfall experience. This engineering feat creates a mesmerizing display of water cascading down seven stories, surrounded by the lush Shiseido Forest Valley. Whether viewed during the day or during the nightly light and sound shows, it remains a breathtaking symbol of Singapore’s commitment to combining nature with futuristic architecture.', 'Jewel Changi Airport', '78 Airport Blvd., Singapore 819666', 1560, 'https://www.youtube.com/embed/-4wlHxaK4sU?start=642', '2025-01-10'),
('P007', 4, 'Hiking the Scenic Southern Ridges', 'HikingThe Southern Ridges is a 10-kilometer open space that connects several of Singapore\'s most beautiful parks via ridges and pathways. A major highlight is the Henderson Waves, a distinctive wave-like pedestrian bridge that offers panoramic views of the city and the lush greenery below. This trail provides a perfect escape for nature lovers and fitness enthusiasts looking to enjoy a scenic walk above the treetops.', 'Henderson Waves', 'Henderson Rd, Singapore 159557', 542, 'https://www.youtube.com/embed/-wwW3wLNFAY?start=178&autoplay=1', '2025-04-15'),
('P008', 4, 'Grandeur at Marina Bay Sands', 'Marina Bay Sands is an architectural icon that has redefined Singapore’s skyline with its three soaring towers and the SkyPark cantilevered across the top. This world-class integrated resort offers luxury shopping, celebrity chef dining, and breathtaking views of the Marina Bay area. Its striking design and status as a global landmark make it the center of Singapore’s modern tourism and entertainment scene.', 'Marina Bay Sands', '10 Bayfront Ave, Singapore 018956', 2100, 'https://www.youtube.com/embed/-wwW3wLNFAY?start=580&autoplay=1', '2025-08-30'),
('P009', 5, 'Surreal Mythology at Haw Par Villa', 'Haw Par Villa is a unique cultural park that houses over 1,000 statues and 150 giant dioramas depicting scenes from Chinese mythology, folklore, and history. Famous for its vivid (and sometimes terrifying) \"Ten Courts of Hell,\" the park serves as a fascinating museum of traditional values and stories. It offers a truly one-of-a-kind, surreal experience that is unlike any other theme park in the world.', 'Haw Par Villa', '262 Pasir Panjang Rd, Singapore 118628', 275, 'https://youtube.com/embed/9vUjF0wvVAU', '2025-07-04'),
('P010', 6, 'Pristine Escape to Lazarus Island', 'Lazarus Island is one of Singapore’s best-kept secrets, offering a tranquil beach escape with turquoise waters and white sandy shores. Connected to St. John’s Island by a paved bridge, it is the perfect spot for a quiet picnic, sunbathing, or a quick swim away from the mainland. Its untouched beauty and peaceful atmosphere make it a favorite for those seeking a tropical \"staycation\" experience.', 'Lazarus Island', 'Lazarus Island, Singapore', 648, 'https://www.youtube.com/embed/pxBAI612ddA', '2025-05-25'),
('P011', 7, 'Multi-Sensory Joy at Dopamine Land', 'Dopamine Land is an interactive museum designed to trigger happiness and excite the senses. Located in a trendy urban space, it features various themed rooms ranging from pillow-fight arenas to digital light installations and bubble rooms. It is an immersive \"happiness lab\" that encourages play and creativity, making it a perfect destination for families and social media enthusiasts.', 'Dopamine Land Singapore', '81 Tras St, Singapore 079020', 789, 'https://www.tiktok.com/embed/v2/7586654988936613141', '2025-11-05'),
('P012', 7, 'The Future of Dining: 5D Magic Table', 'Experience a meal like never before with 5D Magic Table Dining, where cutting-edge projection mapping transforms your tabletop into a digital playground. As you dine, animations interact with your plates and cutlery, telling a story that complements the flavors of your food. This high-tech culinary experience merges gourmet dining with digital storytelling for a truly unforgettable evening.', '5D Magic Table Dining', '10 Bayfront Ave, Singapore 018956', 521, 'https://www.tiktok.com/embed/v2/7580275953880927506', '2025-12-12'),
('P013', 8, 'Curvaceous Bookshelves at Library@Orchard', 'Library@Orchard is widely regarded as one of the most beautiful public libraries in the world, known for its distinctive undulating S-shaped bookshelves. Located in the heart of the shopping district, it offers a stylish and quiet sanctuary for design and book lovers. Its minimalist aesthetic and vast collection of design-focused literature make it an inspiring spot for a mid-shopping break.', 'library@orchard', '277 Orchard Rd, #03-12 / #04-11, Singapore 238858', 1120, 'https://www.tiktok.com/embed/v2/7571660223639850247', '2025-02-14'),
('P014', 8, 'Innovation at the ArtScience Museum', 'The ArtScience Museum at Marina Bay Sands is an architectural masterpiece that resembles a blooming lotus flower. Inside, it hosts world-class exhibitions that explore the intersection of art, science, and technology. From the permanent \"Future World\" digital playground to rotating galleries, it offers an immersive and educational experience that captures the imagination of visitors of all ages.', 'ArtScience Museum', '6 Bayfront Ave, Singapore 018974', 1840, 'https://www.tiktok.com/embed/v2/7568072430871170312', '2025-01-20'),
('P015', 9, 'Heritage Colors of Joo Chiat', 'The Peranakan shophouses of Joo Chiat are a vibrant symbol of Singapore’s rich Straits Chinese heritage. Known for their intricate carvings, pastel-colored facades, and ornate tiles, these historic buildings offer a glimpse into the architectural beauty of the early 20th century. Walking through this neighborhood is like stepping into a living museum, filled with traditional flavors and timeless charm.', 'Peranakan Houses (Koon Seng Road)', 'Koon Seng Rd, Singapore 427011', 892, 'https://www.tiktok.com/embed/v2/7561045875661884680', '2025-08-05');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
