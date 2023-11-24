CREATE PROCEDURE deleteMember
    @member_id VARCHAR(100)
AS
BEGIN
    DELETE FROM Members
    WHERE member_id = @member_id;
END;
