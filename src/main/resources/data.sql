CREATE TABLE IF NOT EXISTS Realisateur(id INT primary key auto_increment, nom VARCHAR(100), prenom VARCHAR(100), date_naissance TIMESTAMP, celebre BOOLEAN);

CREATE TABLE IF NOT EXISTS Film(id INT primary key auto_increment, titre VARCHAR(100), duree INT, realisateur_id INT, date_sortie DATE, poster_url VARCHAR(500), date_ajout TIMESTAMP);

-- Réalisateurs
INSERT INTO Realisateur (id, nom, prenom, date_naissance, celebre) VALUES (1, 'Cameron', 'James', NULL, FALSE);
INSERT INTO Realisateur (id, nom, prenom, date_naissance, celebre) VALUES (2, 'Villeneuve', 'Denis', NULL, FALSE);
INSERT INTO Realisateur (id, nom, prenom, date_naissance, celebre) VALUES (3, 'Chua', 'Edong', NULL, FALSE);
INSERT INTO Realisateur (id, nom, prenom, date_naissance, celebre) VALUES (4, 'Columbus', 'Chris', NULL, FALSE);
INSERT INTO Realisateur (id, nom, prenom, date_naissance, celebre) VALUES (5, 'Nolan', 'Christopher', NULL, FALSE);
INSERT INTO Realisateur (id, nom, prenom, date_naissance, celebre) VALUES (6, 'Jackson', 'Peter', NULL, FALSE);
INSERT INTO Realisateur (id, nom, prenom, date_naissance, celebre) VALUES (7, 'Veber', 'Francis', NULL, FALSE);
INSERT INTO Realisateur (id, nom, prenom, date_naissance, celebre) VALUES (8, 'Leconte', 'Patrice', NULL, FALSE);
INSERT INTO Realisateur (id, nom, prenom, date_naissance, celebre) VALUES (9, 'Cornell', 'John', NULL, FALSE);
INSERT INTO Realisateur (id, nom, prenom, date_naissance, celebre) VALUES (10, 'Scorsese', 'Martin', NULL, FALSE);
INSERT INTO Realisateur (id, nom, prenom, date_naissance, celebre) VALUES (11, 'Parkes', 'Jeff', NULL, FALSE);
INSERT INTO Realisateur (id, nom, prenom, date_naissance, celebre) VALUES (12, 'Joyce', 'Joe', NULL, FALSE);
INSERT INTO Realisateur (id, nom, prenom, date_naissance, celebre) VALUES (13, 'Chowdary', 'Bala Rajasekhar', NULL, FALSE);
INSERT INTO Realisateur (id, nom, prenom, date_naissance, celebre) VALUES (14, 'Ramsey', 'Peter', NULL, FALSE);
INSERT INTO Realisateur (id, nom, prenom, date_naissance, celebre) VALUES (15, 'Fincher', 'David', NULL, FALSE);
INSERT INTO Realisateur (id, nom, prenom, date_naissance, celebre) VALUES (16, 'Tarantino', 'Quentin', NULL, FALSE);
INSERT INTO Realisateur (id, nom, prenom, date_naissance, celebre) VALUES (17, 'Cogman', 'Bryan', NULL, FALSE);
INSERT INTO Realisateur (id, nom, prenom, date_naissance, celebre) VALUES (18, 'Lawrence', 'Francis', NULL, FALSE);

-- Films
INSERT INTO Film (id, titre, duree, realisateur_id, date_sortie, poster_url, date_ajout) VALUES (1, 'Avatar : De feu et de cendres', 198, 1, '2025-12-17', 'https://image.tmdb.org/t/p/w500/5BnOt0PRymp5mXuoKv1unQ9x8I8.jpg', '2025-12-19 12:23:11.274003');
INSERT INTO Film (id, titre, duree, realisateur_id, date_sortie, poster_url, date_ajout) VALUES (2, 'Incendies', 123, 2, '2010-09-17', 'https://image.tmdb.org/t/p/w500/i5GsLIII66LubmOai65cWiB4kZq.jpg', '2025-12-19 12:24:16.335145');
INSERT INTO Film (id, titre, duree, realisateur_id, date_sortie, poster_url, date_ajout) VALUES (3, 'Inter', 6, 3, '2024-05-30', 'https://image.tmdb.org/t/p/w500/b7op5PoYsylq5Ui8wv34yvLRn9M.jpg', '2025-12-19 12:24:23.664152');
INSERT INTO Film (id, titre, duree, realisateur_id, date_sortie, poster_url, date_ajout) VALUES (4, 'Harry Potter à l''école des sorciers', 153, 4, '2001-11-16', 'https://image.tmdb.org/t/p/w500/fbxQ44VRdM2PVzHSNajUseUteem.jpg', '2025-12-19 12:24:30.947871');
INSERT INTO Film (id, titre, duree, realisateur_id, date_sortie, poster_url, date_ajout) VALUES (5, 'Interstellar', 169, 5, '2014-11-05', 'https://image.tmdb.org/t/p/w500/1pnigkWWy8W032o9TKDneBa3eVK.jpg', '2025-12-19 12:24:38.301028');
INSERT INTO Film (id, titre, duree, realisateur_id, date_sortie, poster_url, date_ajout) VALUES (6, 'Senadala At Persyanus: Ang Bagong Mukha Ng Moro-Moro', 80, NULL, NULL, 'https://image.tmdb.org/t/p/w500/oSG1DcxXbw891jYE2oAI4jLUEb1.jpg', '2025-12-19 12:24:44.999456');
INSERT INTO Film (id, titre, duree, realisateur_id, date_sortie, poster_url, date_ajout) VALUES (7, 'Percy Jackson : Le Voleur de foudre', 122, 4, '2010-02-01', 'https://image.tmdb.org/t/p/w500/7VytSOVN8JsMugBY3Y4KfmQF2QN.jpg', '2025-12-19 12:24:53.244554');
INSERT INTO Film (id, titre, duree, realisateur_id, date_sortie, poster_url, date_ajout) VALUES (8, 'Le Seigneur des anneaux : Les Deux Tours', 180, 6, '2002-12-18', 'https://image.tmdb.org/t/p/w500/qVHBqQYLDRs7ESjP9q6o9iPHLWj.jpg', '2025-12-19 12:25:00.900702');
INSERT INTO Film (id, titre, duree, realisateur_id, date_sortie, poster_url, date_ajout) VALUES (9, 'Le Dîner de cons', 80, 7, '1998-04-15', 'https://image.tmdb.org/t/p/w500/7ukFDHExWul2Zz3L0OH8CaZCp2Z.jpg', '2025-12-19 12:25:07.484038');
INSERT INTO Film (id, titre, duree, realisateur_id, date_sortie, poster_url, date_ajout) VALUES (10, 'Les Bronzés', 92, 8, '1978-11-11', 'https://image.tmdb.org/t/p/w500/aUIne7L1aCBK64A6RvyAOcQzspQ.jpg', '2025-12-19 12:25:14.102173');
INSERT INTO Film (id, titre, duree, realisateur_id, date_sortie, poster_url, date_ajout) VALUES (11, 'Crocodile Dundee II', 110, 9, '1988-05-19', 'https://image.tmdb.org/t/p/w500/2Nf0xeDuToLHysdkWj3aT5r42rC.jpg', '2025-12-19 12:25:42.592383');
INSERT INTO Film (id, titre, duree, realisateur_id, date_sortie, poster_url, date_ajout) VALUES (12, 'Le Loup de Wall Street', 179, 10, '2013-12-25', 'https://image.tmdb.org/t/p/w500/dQIQZbJXn1pflQw3nwvXLJX0dHa.jpg', '2025-12-19 12:26:14.364901');
INSERT INTO Film (id, titre, duree, realisateur_id, date_sortie, poster_url, date_ajout) VALUES (13, 'Catch Me If You Can: Behind the Camera', 17, 11, '2003-05-06', 'https://image.tmdb.org/t/p/w500/dW0ufGS32gimuicgzvf7P0YTSHf.jpg', '2025-12-19 12:26:27.366554');
INSERT INTO Film (id, titre, duree, realisateur_id, date_sortie, poster_url, date_ajout) VALUES (14, 'Lutins d''élite : le protocole boule de neige', 24, 12, '2025-11-27', 'https://image.tmdb.org/t/p/w500/npMY9C4zm8flkczEhu2o34eXA3t.jpg', '2025-12-19 12:26:41.81642');
INSERT INTO Film (id, titre, duree, realisateur_id, date_sortie, poster_url, date_ajout) VALUES (15, 'Godfather', 146, 13, '2012-07-27', 'https://image.tmdb.org/t/p/w500/ipV6QtfFnrj80Ar2eH24gjSZHir.jpg', '2025-12-19 12:26:52.261581');
INSERT INTO Film (id, titre, duree, realisateur_id, date_sortie, poster_url, date_ajout) VALUES (16, 'Les Cinq Légendes', 97, 14, '2012-11-21', 'https://image.tmdb.org/t/p/w500/g4YdtN10YPhmrcetJOl7ZrxNSaP.jpg', '2025-12-19 12:27:06.788682');
INSERT INTO Film (id, titre, duree, realisateur_id, date_sortie, poster_url, date_ajout) VALUES (17, 'Fight Club', 139, 15, '1999-10-15', 'https://image.tmdb.org/t/p/w500/t1i10ptOivG4hV7erkX3tmKpiqm.jpg', '2025-12-19 12:27:15.190782');
INSERT INTO Film (id, titre, duree, realisateur_id, date_sortie, poster_url, date_ajout) VALUES (18, 'Pulp Fiction', 154, 16, '1994-09-10', 'https://image.tmdb.org/t/p/w500/4TBdF7nFw2aKNM0gPOlDNq3v3se.jpg', '2025-12-19 12:27:23.052812');
INSERT INTO Film (id, titre, duree, realisateur_id, date_sortie, poster_url, date_ajout) VALUES (19, 'Game of Thrones: The Last Watch', 114, 17, '2019-05-26', 'https://image.tmdb.org/t/p/w500/jJYOyPjkoF139V9nYO9WxECAlxV.jpg', '2025-12-19 12:27:44.551614');
INSERT INTO Film (id, titre, duree, realisateur_id, date_sortie, poster_url, date_ajout) VALUES (20, 'Hunger Games : L''Embrasement', 146, 18, '2013-11-15', 'https://image.tmdb.org/t/p/w500/32mRJXEjmpcVYcQFvzvXCLPsUgS.jpg', '2025-12-19 12:28:02.854462');

