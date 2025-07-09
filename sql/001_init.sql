
CREATE TABLE AppUser (
    id          INTEGER PRIMARY KEY,
    poi_name    VARCHAR,
    latitude    VARCHAR,
    longtitude  VARCHAR,
    address1    VARCHAR,
    address2    VARCHAR,
    address3    VARCHAR,
    zip         VARCHAR,
    category    VARCHAR,
    icon_id     INTEGER,
    poi_file    VARCHAR,
    reg_time    VARCHAR,
    gpx         VARCHAR
);

INSERT INTO AppUser
(poi_name, latitude, longtitude, address1, address2, address3, zip, category, icon_id, poi_file, reg_time, gpx) VALUES ('クレド臼杵', '33.118946', '131.806963', '大分県', '臼杵市', '海添', '875-0042', 'CAT_HOTEL', '14', 'POI_33.118946x131.806963.gpx', '2025-01-11-16:59:55', '<>');
