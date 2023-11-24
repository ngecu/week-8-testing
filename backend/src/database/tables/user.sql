CREATE TABLE Members (
    member_id VARCHAR(100) NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(300) NOT NULL UNIQUE,
    cohortNumber INT NOT NULL,
    password VARCHAR(200) NOT NULL,
    role VARCHAR(20) DEFAULT 'member',
    welcomed BIT DEFAULT 0,
    isDeleted BIT DEFAULT 0,
    PRIMARY KEY (member_id)
);
