-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: mysql-db
-- Generation Time: Jun 04, 2021 at 03:45 PM
-- Server version: 5.7.34
-- PHP Version: 7.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sr05facebook`
--

-- --------------------------------------------------------

--
-- Table structure for table `Friends`
--

CREATE TABLE `Friends` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `url` varchar(300) NOT NULL,
  `connected` tinyint(1) NOT NULL DEFAULT '0',
  `statut` enum('waiting','pending','friend') NOT NULL DEFAULT 'friend',
  `me` tinyint(1) NOT NULL DEFAULT '0',
  `url_backend` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


--
-- Dumping data for table `Friends`
--


INSERT INTO `Friends` (`id`, `name`, `url`, `connected`, `statut`, `me`, `url_backend`) VALUES
(1, 'Paul (8003)', 'http://localhost:8003/Sr05-Project/Distributed_Facebook_API/1.0.0/', 0, 'friend', 1,'http://fourth_server_1:8000/Sr05-Project/Distributed_Facebook_API/1.0.0/'),
(2, 'Pierre (8002)', 'http://localhost:8002/Sr05-Project/Distributed_Facebook_API/1.0.0/', 0, 'friend', 0,'http://third_server_1:8000/Sr05-Project/Distributed_Facebook_API/1.0.0/'),
(3, 'Eloi (8004)', 'http://localhost:8004/Sr05-Project/Distributed_Facebook_API/1.0.0/', 0, 'friend', 0,'http://fifth_server_1:8000/Sr05-Project/Distributed_Facebook_API/1.0.0/');

-- --------------------------------------------------------

--
-- Table structure for table `Messages`
--

CREATE TABLE `Messages` (
  `id` int(11) NOT NULL,
  `type` enum('private','broadcast') NOT NULL,
  `content` varchar(1000) NOT NULL,
  `url_sender` varchar(300) NOT NULL,
  `url_target` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Post`
--

CREATE TABLE `Post` (
  `id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `content` varchar(1000) NOT NULL,
  `author_id` int(11) NOT NULL,
  `statut` enum('private','public') NOT NULL DEFAULT 'private'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `Post` (`id`, `date`, `content`, `author_id`, `statut`) VALUES
(1, '2021-06-15 22:45:38', 'Cras a nibh rutrum, egestas. (Privé)', 1, 'private'),
(2, '2021-06-15 22:45:54', 'Vivamus imperdiet diam augue, eu. (Public)', 1, 'public');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Friends`
--
ALTER TABLE `Friends`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `url` (`url`);

--
-- Indexes for table `Messages`
--
ALTER TABLE `Messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Post`
--
ALTER TABLE `Post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Friends`
--
ALTER TABLE `Friends`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Messages`
--
ALTER TABLE `Messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Post`
--
ALTER TABLE `Post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Post`
--
ALTER TABLE `Post`
  ADD CONSTRAINT `post_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `Friends` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
