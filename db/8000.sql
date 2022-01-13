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
  `me` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Friends`
--


INSERT INTO `Friends` (`id`, `name`, `url`, `connected`, `statut`, `me`) VALUES
(1, 'Jean', 'http://localhost:8000/Sr05-Project/Distributed_Facebook_API/1.0.0/', 0, 'friend', 1),
(2, 'Eloi', 'http://localhost:8002/Sr05-Project/Distributed_Facebook_API/1.0.0/', 0, 'friend', 0),
(3, 'Marc', 'http://localhost:8001/Sr05-Project/Distributed_Facebook_API/1.0.0/', 0, 'friend', 0);

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


--
-- Structure de la table `Snapshot`
--

CREATE TABLE `Snapshot` (
  `data` varchar(2000) NOT NULL,
  `url` varchar(200) NOT NULL,
  `lastUpdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Snapshot`
--
ALTER TABLE `Snapshot`
  ADD PRIMARY KEY (`url`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


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


