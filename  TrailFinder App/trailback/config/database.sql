DROP TABLE equipment;
DROP TABLE transportationtolocation;
DROP TABLE retailerfeaturesgear;
DROP TABLE userhikestrail;
DROP TABLE transportation;
DROP TABLE retailer2;
DROP TABLE retailer1;
DROP TABLE preview2;
DROP TABLE preview1;
DROP TABLE gear;
DROP TABLE review;
DROP TABLE photo;
DROP TABLE friends;
DROP TABLE ugc;
DROP TABLE trail;
DROP TABLE location;
DROP TABLE userprofile;
DROP SEQUENCE user_id_seq;
DROP SEQUENCE ugc_id_seq;




CREATE TABLE userprofile (
    userid          NUMBER          PRIMARY KEY,
    name            VARCHAR2(50),
    email           VARCHAR2(320)   UNIQUE,
    password        VARCHAR2(72),
    trailshiked     INTEGER         DEFAULT 0,
    experiencelevel INTEGER         DEFAULT 0,
    profilepicture  BLOB,
    numberoffriends INTEGER         DEFAULT 0
);

grant select on userprofile to public;

CREATE TABLE equipment (
    equipmentid     INTEGER         PRIMARY KEY,
    userid          INTEGER,
    type            VARCHAR(50),
    brand           VARCHAR(50),
    amount          INTEGER,
    weight          FLOAT,
    CONSTRAINT equipment_userid_fk FOREIGN KEY (userid) REFERENCES userprofile
       ON DELETE CASCADE
);

grant select on equipment to public;

CREATE TABLE transportation (
    transportid     INTEGER         PRIMARY KEY,
    type            VARCHAR(50),
    transportcost   FLOAT
);

grant select on transportation to public;

CREATE TABLE retailer1 (
    retailername VARCHAR2(50)   PRIMARY KEY,
    retailerwebsite    VARCHAR2(100)
);

grant select on retailer1 to public;

CREATE TABLE retailer2 (
    retailerid      INTEGER         PRIMARY KEY,
    retailername    VARCHAR2(50),
    FOREIGN KEY (retailername) REFERENCES retailer1
);

grant select on retailer2 to public;

CREATE TABLE location (
    locationname    VARCHAR(50),
    latitude        DECIMAL(8, 6),
    longitude       DECIMAL(9, 6),
    weather         VARCHAR(30),
    PRIMARY KEY (locationname, latitude, longitude)
);

grant select on location to public;

CREATE TABLE trail (
    locationname    VARCHAR(50)     NOT NULL,
    latitude        DECIMAL(8, 6)   NOT NULL,
    longitude       DECIMAL(9, 6)   NOT NULL,
    trailname       VARCHAR(50),
    timetocomplete  INTERVAL DAY TO SECOND,
    description     VARCHAR(3000),
    hazards         VARCHAR(100),
    difficulty      INTEGER,
    PRIMARY KEY (locationname, latitude, longitude, trailname),
    FOREIGN KEY (locationname, latitude, longitude) REFERENCES location
        ON DELETE CASCADE
);

grant select on trail to public;


CREATE TABLE gear (
    gearname        VARCHAR(50)     PRIMARY KEY,
    geartype        VARCHAR(50),
    locationname    VARCHAR(50),
    latitude        DECIMAL(8, 6)   NOT NULL,
    longitude       DECIMAL(9, 6)   NOT NULL,
    trailname       VARCHAR(50),
    FOREIGN KEY (locationname, latitude, longitude, trailname) REFERENCES trail
      ON DELETE SET NULL
);

grant select on gear to public;

CREATE TABLE preview1 (
    previewid       INTEGER	        PRIMARY KEY,
    image           BLOB
);

grant select on preview1 to public;

CREATE TABLE preview2 (
    locationname    VARCHAR(50)     NOT NULL,
    latitude        DECIMAL(8, 6)   NOT NULL,
    longitude       DECIMAL(9, 6)   NOT NULL,
    trailname       VARCHAR(50)     NOT NULL,
    previewid       INTEGER,
    PRIMARY KEY (locationname, latitude, longitude, trailname, previewid),
    FOREIGN KEY (locationname, latitude, longitude, trailname) REFERENCES trail
        ON DELETE CASCADE,
    FOREIGN KEY (previewid) REFERENCES preview1
);

grant select on preview2 to public;

CREATE TABLE ugc (
    ugcid           INTEGER         PRIMARY KEY,
    userid          INTEGER         NOT NULL,
    locationname    VARCHAR(50)     NOT NULL,
    latitude        DECIMAL(8, 6)   NOT NULL,
    longitude       DECIMAL(9, 6)   NOT NULL,
    trailname       VARCHAR(50)     NOT NULL,
    dateposted      DATE,
    CONSTRAINT ugc_userid_fk FOREIGN KEY (userid) REFERENCES userprofile
        ON DELETE CASCADE,
    FOREIGN KEY (locationname, latitude, longitude, trailname) REFERENCES trail
        ON DELETE CASCADE 
);

grant select on ugc to public;

CREATE TABLE review (
    ugcid           INTEGER         PRIMARY KEY,
    rating          INTEGER,
    description     VARCHAR(500),    FOREIGN KEY (ugcid) REFERENCES ugc
        ON DELETE CASCADE
);

grant select on review to public;

CREATE TABLE photo (
    ugcid           INTEGER         PRIMARY KEY,
    image           BLOB,
    FOREIGN KEY (ugcid) REFERENCES ugc
        ON DELETE CASCADE
);

grant select on photo to public;

CREATE TABLE friends (
    userid          INTEGER,
    friendid        INTEGER,
    datefriended    DATE,
    PRIMARY KEY (userid, friendid),
    CONSTRAINT friends_userid_fk FOREIGN KEY (userid) REFERENCES userprofile
        ON DELETE CASCADE,
    CONSTRAINT friends_friendid_fk FOREIGN KEY (friendid) REFERENCES userprofile
        ON DELETE CASCADE
);

grant select on friends to public;

CREATE TABLE transportationtolocation (
    transportid     INTEGER,
    locationname    VARCHAR(50),
    latitude        DECIMAL(8, 6)   NOT NULL,
    longitude       DECIMAL(9, 6)   NOT NULL,
    duration        INTERVAL DAY TO SECOND,
    tripcost        FLOAT,
    PRIMARY KEY (transportid, locationname, latitude, longitude),
    FOREIGN KEY (transportid) REFERENCES transportation
      ON DELETE CASCADE,
    FOREIGN KEY (locationname, latitude, longitude) REFERENCES Location
      ON DELETE CASCADE
);

grant select on transportationtolocation to public;

CREATE TABLE userhikestrail (
    userid          INTEGER,
    locationname    VARCHAR(50),
    latitude        DECIMAL(8, 6)   NOT NULL,
    longitude       DECIMAL(9, 6)   NOT NULL,
    trailname       VARCHAR(50),
    datehiked       DATE,
    timetocomplete  INTERVAL DAY TO SECOND,
    PRIMARY KEY (userid, locationname, latitude, longitude, trailname, datehiked),
    CONSTRAINT userhikestrail_userid_fk FOREIGN KEY (userid) REFERENCES userprofile
        ON DELETE CASCADE,
    FOREIGN KEY (locationname, latitude, longitude, trailname) REFERENCES trail
        ON DELETE CASCADE
);

grant select on userhikestrail to public;

CREATE TABLE retailerfeaturesgear (
    retailerid      INTEGER,
    gearname        VARCHAR(50),
    productname     VARCHAR(50),
    productwebsite  VARCHAR(150),
    PRIMARY KEY (retailerid, gearname),
    FOREIGN KEY (retailerid) REFERENCES retailer2
        ON DELETE CASCADE,
    FOREIGN KEY (gearname) REFERENCES gear
        ON DELETE CASCADE
);

grant select on retailerfeaturesgear to public;


INSERT ALL
    INTO userprofile (userid, name, email, password, profilepicture, trailshiked, experienceLevel, numberoffriends) VALUES
    (1, 'John Doe', 'john.doe@email.com', '$2b$10$ymRAycGV5EegDAsSVLyrh.qa6Om2ahTPHRpVsHd7Lzmyz/XLza9MG', EMPTY_BLOB(), 15, 3, 7)
    INTO userprofile (userid, name, email, password, profilepicture, trailshiked, experienceLevel, numberoffriends) VALUES
    (2, 'Jane Smith', 'jane.smith@email.com', '$2b$10$3Ist2BK.9IdeHLcw1uiA7eabIx7j4H0W/6T3QDZHsu06cN64sijje', EMPTY_BLOB(), 8, 2, 5)
    INTO userprofile (userid, name, email, password, profilepicture, trailshiked, experienceLevel, numberoffriends) VALUES
    (3, 'Mike Johnson', 'mike.johnson@email.com', '$2b$10$/K9BkOSJB8PI4wj2IpM4HuKsXKwsSIfUeznS56Z4KvYqGi9jtKfMG', EMPTY_BLOB(), 25, 4, 12)
    INTO userprofile (userid, name, email, password, profilepicture, trailshiked, experienceLevel, numberoffriends) VALUES
    (4, 'Emily Brown', 'emily.brown@email.com', '$2b$10$.42a6Cwng0dU.XnCpQAOousfZtYrgV167Z4.BxJvwVQQx0wPVOegm', EMPTY_BLOB(), 5, 1, 3)
    INTO userprofile (userid, name, email, password, profilepicture, trailshiked, experienceLevel, numberoffriends) VALUES
    (5, 'David Lee', 'david.lee@email.com', '$2b$10$ZmHZlgWCjOTe69MHLgar/ejkZQIVaorvk2wo10MzkQhvyhPwrmLIq', EMPTY_BLOB(), 20, 3, 9)
SELECT * FROM DUAL;

INSERT ALL
    INTO equipment (equipmentid, userid, type, brand, amount, weight) VALUES
    (1, 1, 'Hiking Boots', 'Merrell', 1, 2.5)
    INTO equipment (equipmentid, userid, type, brand, amount, weight) VALUES
    (2, 1, 'Backpack', 'Osprey', 1, 1.8)
    INTO equipment (equipmentid, userid, type, brand, amount, weight) VALUES
    (3, 2, 'Trekking Poles', 'Black Diamond', 2, 0.5)
    INTO equipment (equipmentid, userid, type, brand, amount, weight) VALUES
    (4, 3, 'Tent', 'REI', 1, 3.2)
    INTO equipment (equipmentid, userid, type, brand, amount, weight) VALUES
    (5, 4, 'Sleeping Bag', 'The North Face', 1, 1.5)
    INTO equipment (equipmentid, userid, type, brand, amount, weight) VALUES
    (6, 1, 'Snow Shoes', 'Atlas Helium', 1, 3.5)
    INTO equipment (equipmentid, userid, type, brand, amount, weight) VALUES
    (7, 1, 'Backpack', 'Sportscheck', 1, 2.8)
    INTO equipment (equipmentid, userid, type, brand, amount, weight) VALUES
    (8, 2, 'Backpack', 'Black Diamond', 1, 2.5)
    INTO equipment (equipmentid, userid, type, brand, amount, weight) VALUES
    (9, 2, 'Hiking Boots', 'Black Diamond', 1, 2.5)
    INTO equipment (equipmentid, userid, type, brand, amount, weight) VALUES
    (10, 3, 'Hiking Boots', 'REI', 1, 2.2)
    INTO equipment (equipmentid, userid, type, brand, amount, weight) VALUES
    (11, 3, 'Backpack', 'REI', 1, 3.2)
    INTO equipment (equipmentid, userid, type, brand, amount, weight) VALUES
    (12, 4, 'Hiking Boots', 'The North Face', 1, 1.5)
    INTO equipment (equipmentid, userid, type, brand, amount, weight) VALUES
    (13, 4, 'Backpack', 'The North Face', 1, 1.9)
    INTO equipment (equipmentid, userid, type, brand, amount, weight) VALUES
    (14, 2, 'Snow Shoes', 'Atlas Helium V2', 1, 4.5)
SELECT * FROM DUAL;

INSERT ALL
    INTO transportation (transportid, type, transportcost) VALUES
    (1, 'Car', 0.15)
    INTO transportation (transportid, type, transportcost) VALUES
    (2, 'Bus', 2.50)
    INTO transportation (transportid, type, transportcost) VALUES
    (3, 'Train', 5.00)
    INTO transportation (transportid, type, transportcost) VALUES
    (4, 'Bicycle', 0.00)
    INTO transportation (transportid, type, transportcost) VALUES
    (5, 'Shuttle', 10.00)
    INTO transportation (transportid, type, transportcost) VALUES
    (6, 'Shuttle', 10.00)
    INTO transportation (transportid, type, transportcost) VALUES
    (7, 'Shuttle', 10.00)
    INTO transportation (transportid, type, transportcost) VALUES
    (8, 'Car', 0.30)
    INTO transportation (transportid, type, transportcost) VALUES
    (9, 'Car', 0.45)
    INTO transportation (transportid, type, transportcost) VALUES
    (10, 'Bus', 2.70)
    INTO transportation (transportid, type, transportcost) VALUES
    (11, 'Bus', 3.50)
    INTO transportation (transportid, type, transportcost) VALUES
    (12, 'Train', 4.00)
    INTO transportation (transportid, type, transportcost) VALUES
    (13, 'Train', 6.00)
    INTO transportation (transportid, type, transportcost) VALUES
    (14, 'Bicycle', 1.00)
    INTO transportation (transportid, type, transportcost) VALUES
    (15, 'Bicycle', 5.00)
SELECT * FROM DUAL;

INSERT ALL
    INTO retailer1 (retailername, retailerwebsite) VALUES
    ('Mountain Outfitters', 'www.mountainoutfitters.com')
    INTO retailer1 (retailername, retailerwebsite) VALUES
    ('Trail Blazer Gear', 'www.trailblazergear.com')
    INTO retailer1 (retailername, retailerwebsite) VALUES
    ('Summit Supply Co.', 'www.summitsupply.com')
    INTO retailer1 (retailername, retailerwebsite) VALUES
    ('Campsite Essentials', 'www.campsiteessentials.com')
    INTO retailer1 (retailername, retailerwebsite) VALUES
    ('Wilderness Comfort', 'www.wildernesscomfort.com')
SELECT * FROM DUAL;

INSERT ALL
    INTO retailer2 (retailerid, retailername) VALUES (1, 'Mountain Outfitters')
    INTO retailer2 (retailerid, retailername) VALUES (2, 'Trail Blazer Gear')
    INTO retailer2 (retailerid, retailername) VALUES (3, 'Summit Supply Co.')
    INTO retailer2 (retailerid, retailername) VALUES (4, 'Campsite Essentials')
    INTO retailer2 (retailerid, retailername) VALUES (5, 'Wilderness Comfort')
SELECT * FROM DUAL;

INSERT ALL
    INTO location (locationname, latitude, longitude, weather) VALUES
    ('Yosemite National Park', 37.865100, -119.538300, 'Sunny')
    INTO location (locationname, latitude, longitude, weather) VALUES
    ('Rocky Mountain National Park', 40.342800, -105.683600, 'Partly Cloudy')
    INTO location (locationname, latitude, longitude, weather) VALUES
    ('Grand Canyon National Park', 36.054400, -112.140100, 'Hot')
    INTO location (locationname, latitude, longitude, weather) VALUES
    ('Yellowstone National Park', 44.428000, -110.588500, 'Rainy')
    INTO location (locationname, latitude, longitude, weather) VALUES
    ('Glacier National Park', 48.759600, -113.787000, 'Snowy')
    INTO location (locationname, latitude, longitude, weather) VALUES
    ('Glacier National Park', 48.6806, -113.819230, 'Snowy')
    INTO location (locationname, latitude, longitude, weather) VALUES
    ('Glacier National Park', 48.719600, -113.682000, 'Snowy')
SELECT * FROM DUAL;

INSERT ALL
    INTO trail (locationname, latitude, longitude, trailname, difficulty, timetocomplete, description, hazards) VALUES
    ('Yosemite National Park', 37.865100, -119.538300, 'Half Dome Trail', 5, INTERVAL '10:00:00' HOUR TO SECOND, 'Challenging hike with stunning views of Yosemite Valley', 'Steep cliffs, wildlife')
    INTO trail (locationname, latitude, longitude, trailname, difficulty, timetocomplete, description, hazards) VALUES
    ('Rocky Mountain National Park', 40.342800, -105.683600, 'Longs Peak Trail', 5, INTERVAL '12:00:00' HOUR TO SECOND, 'Difficult ascent to one of Colorado’s famous 14ers', 'Altitude sickness, lightning')
    INTO trail (locationname, latitude, longitude, trailname, difficulty, timetocomplete, description, hazards) VALUES
    ('Grand Canyon National Park', 36.054400, -112.140100, 'Bright Angel Trail', 4, INTERVAL '08:00:00' HOUR TO SECOND, 'Popular rim-to-river trail with rest houses along the way', 'Heat exhaustion, steep drop-offs')
    INTO trail (locationname, latitude, longitude, trailname, difficulty, timetocomplete, description, hazards) VALUES
    ('Yellowstone National Park', 44.428000, -110.588500, 'Lamar Valley Trail', 2, INTERVAL '03:00:00' HOUR TO SECOND, 'Easy trail known for wildlife viewing, especially wolves and bison', 'Wildlife encounters')
    INTO trail (locationname, latitude, longitude, trailname, difficulty, timetocomplete, description, hazards) VALUES
    ('Glacier National Park', 48.759600, -113.787000, 'Highline Trail', 3, INTERVAL '06:00:00' HOUR TO SECOND, 'Scenic trail along the Continental Divide with panoramic views', 'Narrow paths, grizzly bears')
    INTO trail (locationname, latitude, longitude, trailname, difficulty, timetocomplete, description, hazards) VALUES
    ('Glacier National Park', 48.6806, -113.819230, 'Avalanche Lake Trail', 4, INTERVAL '02:30:00' HOUR TO SECOND, 'Incredible Blue Waters', 'Narrow paths, grizzly bears')
    INTO trail (locationname, latitude, longitude, trailname, difficulty, timetocomplete, description, hazards) VALUES
    ('Glacier National Park', 48.719600, -113.682000, 'Grinnell Glacier Trail', 5, INTERVAL '05:00:00' HOUR TO SECOND, 'Glaciers, Waterfalls, Nature, Fresh air', 'Narrow paths, grizzly bears')
SELECT * FROM DUAL;

INSERT ALL
    INTO gear (geartype, gearname, locationname, latitude, longitude, trailname) VALUES
    ('Hiking Boots', 'All-Terrain Hikers', 'Yosemite National Park', 37.865100, -119.538300, 'Half Dome Trail')
    INTO gear (geartype, gearname, locationname, latitude, longitude, trailname) VALUES
    ('Backpack', 'Mountaineer Pack', 'Rocky Mountain National Park', 40.342800, -105.683600, 'Longs Peak Trail')
    INTO gear (geartype, gearname, locationname, latitude, longitude, trailname) VALUES
    ('Trekking Poles', 'Ultralight Trekkers' , 'Grand Canyon National Park', 36.054400, -112.140100, 'Bright Angel Trail')
    INTO gear (geartype, gearname, locationname, latitude, longitude, trailname) VALUES
    ('Tent', 'Wilderness Shelter', 'Yellowstone National Park', 44.428000, -110.588500, 'Lamar Valley Trail')
    INTO gear (geartype, gearname, locationname, latitude, longitude, trailname) VALUES
    ('Sleeping Bag', 'Apine Dreamer', 'Glacier National Park', 48.759600, -113.787000, 'Highline Trail')
    INTO gear (geartype, gearname, locationname, latitude, longitude, trailname) VALUES
    ('Snow Shoes', 'Atlas Helium', 'Glacier National Park', 48.6806, -113.819230, 'Avalanche Lake Trail')
    INTO gear (geartype, gearname, locationname, latitude, longitude, trailname) VALUES
    ('Snow Shoes', 'Atlas Helium V2', 'Glacier National Park', 48.719600, -113.682000, 'Grinnell Glacier Trail')
SELECT * FROM DUAL;

INSERT ALL
    INTO preview1 (previewid, image) VALUES
    (1, EMPTY_BLOB())
    INTO preview1 (previewid, image) VALUES
    (2, EMPTY_BLOB())
    INTO preview1 (previewid, image) VALUES
    (3, EMPTY_BLOB())
    INTO preview1 (previewid, image) VALUES
    (4, EMPTY_BLOB())
    INTO preview1 (previewid, image) VALUES
    (5, EMPTY_BLOB())
    INTO preview1 (previewid, image) VALUES
    (6, EMPTY_BLOB())
    INTO preview1 (previewid, image) VALUES
    (7, EMPTY_BLOB())
SELECT * FROM DUAL;

INSERT ALL
    INTO preview2 (locationname, latitude, longitude, trailname, previewid) VALUES
    ('Yosemite National Park', 37.865100, -119.538300, 'Half Dome Trail', 1)
    INTO preview2 (locationname, latitude, longitude, trailname, previewid) VALUES
    ('Rocky Mountain National Park', 40.342800, -105.683600, 'Longs Peak Trail', 2)
    INTO preview2 (locationname, latitude, longitude, trailname, previewid) VALUES
    ('Grand Canyon National Park', 36.054400, -112.140100, 'Bright Angel Trail', 3)
    INTO preview2 (locationname, latitude, longitude, trailname, previewid) VALUES
    ('Yellowstone National Park', 44.428000, -110.588500, 'Lamar Valley Trail', 4)
    INTO preview2 (locationname, latitude, longitude, trailname, previewid) VALUES
    ('Glacier National Park', 48.759600, -113.787000, 'Highline Trail', 5)
    INTO preview2 (locationname, latitude, longitude, trailname, previewid) VALUES
    ('Glacier National Park', 48.6806, -113.819230, 'Avalanche Lake Trail', 6)
    INTO preview2 (locationname, latitude, longitude, trailname, previewid) VALUES
    ('Glacier National Park', 48.719600, -113.682000, 'Grinnell Glacier Trail', 7)
SELECT * FROM DUAL;

INSERT ALL
    INTO ugc (ugcid, userid, locationname, latitude, longitude, trailname, dateposted) VALUES
    (1, 1, 'Yosemite National Park', 37.865100, -119.538300, 'Half Dome Trail', DATE '2023-07-15')
    INTO ugc (ugcid, userid, locationname, latitude, longitude, trailname, dateposted) VALUES
    (2, 2, 'Rocky Mountain National Park', 40.342800, -105.683600, 'Longs Peak Trail', DATE '2023-08-02')
    INTO ugc (ugcid, userid, locationname, latitude, longitude, trailname, dateposted) VALUES
    (3, 3, 'Grand Canyon National Park', 36.054400, -112.140100, 'Bright Angel Trail', DATE '2023-06-20')
    INTO ugc (ugcid, userid, locationname, latitude, longitude, trailname, dateposted) VALUES
    (4, 4, 'Yellowstone National Park', 44.428000, -110.588500, 'Lamar Valley Trail', DATE '2023-09-10')
    INTO ugc (ugcid, userid, locationname, latitude, longitude, trailname, dateposted) VALUES
    (5, 5, 'Glacier National Park', 48.759600, -113.787000, 'Highline Trail', DATE '2023-07-30')
    INTO ugc (ugcid, userid, locationname, latitude, longitude, trailname, dateposted) VALUES
    (6, 5, 'Glacier National Park', 48.6806, -113.819230, 'Avalanche Lake Trail', DATE '2023-08-15')
    INTO ugc (ugcid, userid, locationname, latitude, longitude, trailname, dateposted) VALUES
    (7, 5, 'Glacier National Park', 48.719600, -113.682000, 'Grinnell Glacier Trail', DATE '2023-8-30')
SELECT * FROM DUAL;

INSERT ALL
    INTO review (ugcid, rating, description) VALUES
    (1, 5, 'Challenging but rewarding hike with unforgettable views!')
    INTO review (ugcid, rating, description) VALUES
    (2, 4, 'Tough climb, but the sense of accomplishment was worth it.')
    INTO review (ugcid, rating, description) VALUES
    (3, 5, 'Beautiful trail with plenty of shade and rest areas.')
    INTO review (ugcid, rating, description) VALUES
    (4, 5, 'Amazing wildlife viewing! Saw several bison and even a wolf pack.')
    INTO review (ugcid, rating, description) VALUES
    (5, 4, 'Stunning vistas, but some parts of the trail were a bit nerve-wracking.')
    INTO review (ugcid, rating, description) VALUES
    (6, 5, 'nerve-wracking, but worth the beautiful blue lake views.')
    INTO review (ugcid, rating, description) VALUES
    (7, 5, 'Thrilling. Amazing views of glaciers, waterfalls, nature, and lakes.')
SELECT * FROM DUAL;

INSERT ALL
    INTO photo (ugcid, image) VALUES
    (1, EMPTY_BLOB())
    INTO photo (ugcid, image) VALUES
    (2, EMPTY_BLOB())
    INTO photo (ugcid, image) VALUES
    (3, EMPTY_BLOB())
    INTO photo (ugcid, image) VALUES
    (4, EMPTY_BLOB())
    INTO photo (ugcid, image) VALUES
    (5, EMPTY_BLOB())
    INTO photo (ugcid, image) VALUES
    (6, EMPTY_BLOB())
    INTO photo (ugcid, image) VALUES
    (7, EMPTY_BLOB())
SELECT * FROM DUAL;

INSERT ALL
    INTO friends (userid, friendid, datefriended) VALUES
    (1, 2, DATE '2024-02-15')
    INTO friends (userid, friendid, datefriended) VALUES
    (2, 1, DATE '2024-02-15')
    INTO friends (userid, friendid, datefriended) VALUES
    (1, 3, DATE '2024-03-10')
    INTO friends (userid, friendid, datefriended) VALUES
    (3, 1, DATE '2024-03-10')
    INTO friends (userid, friendid, datefriended) VALUES
    (3, 4, DATE '2024-05-05')
    INTO friends (userid, friendid, datefriended) VALUES
    (4, 3, DATE '2024-05-05')
    INTO friends (userid, friendid, datefriended) VALUES
    (4, 5, DATE '2024-07-25')
    INTO friends (userid, friendid, datefriended) VALUES
    (5, 4, DATE '2024-07-25')
SELECT * FROM DUAL;

INSERT ALL
    INTO transportationtolocation (transportid, locationname, latitude, longitude, duration, tripcost) VALUES
    (1, 'Yosemite National Park', 37.865100, -119.538300, INTERVAL '04:00:00' HOUR TO SECOND, 50.00)
    INTO transportationtolocation (transportid, locationname, latitude, longitude, duration, tripcost) VALUES
    (2, 'Rocky Mountain National Park', 40.342800, -105.683600, INTERVAL '01:30:00' HOUR TO SECOND, 15.00)
    INTO transportationtolocation (transportid, locationname, latitude, longitude, duration, tripcost) VALUES
    (3, 'Grand Canyon National Park', 36.054400, -112.140100, INTERVAL '03:00:00' HOUR TO SECOND, 30.00)
    INTO transportationtolocation (transportid, locationname, latitude, longitude, duration, tripcost) VALUES
    (4, 'Yellowstone National Park', 44.428000, -110.588500, INTERVAL '02:00:00' HOUR TO SECOND, 0.00)
    INTO transportationtolocation (transportid, locationname, latitude, longitude, duration, tripcost) VALUES
    (5, 'Glacier National Park', 48.759600, -113.787000, INTERVAL '00:45:00' HOUR TO SECOND, 20.00)
    INTO transportationtolocation (transportid, locationname, latitude, longitude, duration, tripcost) VALUES
    (6, 'Glacier National Park', 48.6806, -113.819230, INTERVAL '00:45:00' HOUR TO SECOND, 20.00)
    INTO transportationtolocation (transportid, locationname, latitude, longitude, duration, tripcost) VALUES
    (7, 'Glacier National Park', 48.719600, -113.682000, INTERVAL '00:45:00' HOUR TO SECOND, 20.00)
SELECT * FROM DUAL;

INSERT ALL
    INTO userhikestrail (userid, locationname, latitude, longitude, trailname, datehiked, timetocomplete) VALUES
    (1, 'Yosemite National Park', 37.865100, -119.538300, 'Half Dome Trail', DATE '2023-07-15', INTERVAL '11:30:00' HOUR TO SECOND)
    INTO userhikestrail (userid, locationname, latitude, longitude, trailname, datehiked, timetocomplete) VALUES
    (2, 'Rocky Mountain National Park', 40.342800, -105.683600, 'Longs Peak Trail', DATE '2023-08-02',INTERVAL '13:45:00' HOUR TO SECOND)
    INTO userhikestrail (userid, locationname, latitude, longitude, trailname, datehiked, timetocomplete) VALUES
    (3, 'Grand Canyon National Park', 36.054400, -112.140100, 'Bright Angel Trail', DATE '2023-06-20', INTERVAL '07:15:00' HOUR TO SECOND)
    INTO userhikestrail (userid, locationname, latitude, longitude, trailname, datehiked, timetocomplete) VALUES
    (4, 'Yellowstone National Park', 44.428000, -110.588500, 'Lamar Valley Trail', DATE '2023-09-10', INTERVAL '02:50:00' HOUR TO SECOND)
    INTO userhikestrail (userid, locationname, latitude, longitude, trailname, datehiked, timetocomplete) VALUES
    (5, 'Glacier National Park', 48.759600, -113.787000, 'Highline Trail', DATE '2023-07-30', INTERVAL '06:20:00' HOUR TO SECOND)
    INTO userhikestrail (userid, locationname, latitude, longitude, trailname, datehiked, timetocomplete) VALUES
    (5, 'Glacier National Park', 48.6806, -113.819230, 'Avalanche Lake Trail', DATE '2023-08-15', INTERVAL '06:20:00' HOUR TO SECOND)
    INTO userhikestrail (userid, locationname, latitude, longitude, trailname, datehiked, timetocomplete) VALUES
    (5, 'Glacier National Park', 48.719600, -113.682000, 'Grinnell Glacier Trail', DATE '2023-08-30', INTERVAL '06:20:00' HOUR TO SECOND)
    INTO userhikestrail (userid, locationname, latitude, longitude, trailname, datehiked, timetocomplete) VALUES
    (1, 'Rocky Mountain National Park', 40.342800, -105.683600, 'Longs Peak Trail', DATE '2023-08-02',INTERVAL '13:45:00' HOUR TO SECOND)
    INTO userhikestrail (userid, locationname, latitude, longitude, trailname, datehiked, timetocomplete) VALUES
    (1, 'Grand Canyon National Park', 36.054400, -112.140100, 'Bright Angel Trail', DATE '2023-06-20', INTERVAL '07:15:00' HOUR TO SECOND)
    INTO userhikestrail (userid, locationname, latitude, longitude, trailname, datehiked, timetocomplete) VALUES
    (1, 'Yellowstone National Park', 44.428000, -110.588500, 'Lamar Valley Trail', DATE '2023-09-10', INTERVAL '02:50:00' HOUR TO SECOND)
    INTO userhikestrail (userid, locationname, latitude, longitude, trailname, datehiked, timetocomplete) VALUES
    (1, 'Glacier National Park', 48.759600, -113.787000, 'Highline Trail', DATE '2023-07-30', INTERVAL '06:20:00' HOUR TO SECOND)
    INTO userhikestrail (userid, locationname, latitude, longitude, trailname, datehiked, timetocomplete) VALUES
    (1, 'Glacier National Park', 48.6806, -113.819230, 'Avalanche Lake Trail', DATE '2023-08-15', INTERVAL '06:20:00' HOUR TO SECOND)
    INTO userhikestrail (userid, locationname, latitude, longitude, trailname, datehiked, timetocomplete) VALUES
    (1, 'Glacier National Park', 48.719600, -113.682000, 'Grinnell Glacier Trail', DATE '2023-08-30', INTERVAL '06:20:00' HOUR TO SECOND)
SELECT * FROM DUAL;

INSERT ALL
    INTO retailerfeaturesgear (retailerid, gearname, productname, productwebsite) VALUES
    (1, 'All-Terrain Hikers', 'Vasque M’s Breeze AT GTX', 'https://www.themountainoutfitters.com/ms-breeze-at-gtx.html')
    INTO retailerfeaturesgear (retailerid, gearname, productname, productwebsite) VALUES
    (2, 'Mountaineer Pack', 'Waterproof EDC Waist Bag', 'https://www.trailblazergear.com/outdoor-tactical-molle-pouches-compact-waterproof-edc-waist-bag-for-hiking-backpacking-hiking?variantId=548')
    INTO retailerfeaturesgear (retailerid, gearname, productname, productwebsite) VALUES
    (3, 'Ultralight Trekkers', 'Sturdy Stainless Steel 7ft Hiking Pole', 'https://www.summitsupply.com/stainless-steel-hiking-pole?size=7')
    INTO retailerfeaturesgear (retailerid, gearname, productname, productwebsite) VALUES
    (4, 'Wilderness Shelter','4 person tent with rain cover', 'https://www.campsiteessentials.com/4-person-tent?color=red')
    INTO retailerfeaturesgear (retailerid, gearname, productname, productwebsite) VALUES
    (5, 'Apine Dreamer', 'Cotten lined 40C certified sleeping bag', 'www.wildernesscomfort.com/cotten-40c-sleeping-bag')
    INTO retailerfeaturesgear (retailerid, gearname, productname, productwebsite) VALUES
    (5, 'Atlas Helium', 'Atlas Helium Trail Snow Shoes', 'https://atlassnowshoe.com/en-ca/c/snowshoes/helium-collection/')
    INTO retailerfeaturesgear (retailerid, gearname, productname, productwebsite) VALUES
    (5, 'Atlas Helium V2', 'Atlas Helium Trail Snow Shoes', 'https://atlassnowshoe.com/en-ca/c/snowshoes/helium-collection/')
SELECT * FROM DUAL;


CREATE SEQUENCE user_id_seq
    START WITH 6
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

CREATE SEQUENCE ugc_id_seq
    START WITH 8
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

COMMIT;