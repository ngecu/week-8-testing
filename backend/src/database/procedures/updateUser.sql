CREATE PROCEDURE updateMember
    @member_id VARCHAR(100),
    @firstName VARCHAR(100),
    @lastName VARCHAR(100),
    @email VARCHAR(300),
    @cohortNumber INT
AS
BEGIN
    UPDATE Members
    SET
        firstName = @firstName,
        lastName = @lastName,
        email = @email,
        cohortNumber = @cohortNumber
    WHERE member_id = @member_id;
END;
