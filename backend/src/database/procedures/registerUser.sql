CREATE PROCEDURE registerMember
    @member_id VARCHAR(100),
    @firstName VARCHAR(100),
    @lastName VARCHAR(100),
    @email VARCHAR(300),
    @cohortNumber INT,
    @password VARCHAR(200)
AS
BEGIN
    INSERT INTO Members (member_id, firstName, lastName, email, cohortNumber, password)
    VALUES (@member_id, @firstName, @lastName, @email, @cohortNumber, @password);
END;
