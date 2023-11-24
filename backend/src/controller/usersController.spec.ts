import mssql from 'mssql'
import bcrypt from 'bcrypt'
import { deleteUser, getOneUser, registerUser, updateUser } from './usersController'
import { Request, Response } from 'express'

describe("User Registration", () => {

    let res: any;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    })

    it("successfully registers a member", async () => {
        const req = {
            body: {
                firstName: "Robinson",
                lastName: "Ngecu",
                email: "robinson.ngecu@thejitu.com",
                cohortNumber: 17,
                password: "HashedPass@word123"
            }
        }

        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce("HashedPass@word123" as never)

        const mockedInput = jest.fn().mockReturnThis();

        const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [1] });

        const mockedRequest = {
            input: mockedInput,
            execute: mockedExecute
        }

        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest)
        }

        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool as never)

        await registerUser(req as Request, res as never);

        // Assertions

        expect(res.json).toHaveBeenCalledWith({ message: 'Member registered successfully' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(mockedInput).toHaveBeenCalledWith('password', mssql.VarChar, 'HashedPass@word123');
        expect(mockedInput).toHaveBeenCalledWith('firstName', mssql.VarChar, 'Robinson');
        expect(mockedInput).toHaveBeenCalledWith('lastName', mssql.VarChar, 'Ngecu');
        expect(mockedInput).toHaveBeenCalledWith('email', mssql.VarChar, 'robinson.ngecu@thejitu.com');
        expect(mockedInput).toHaveBeenCalledWith('cohortNumber', mssql.Int, 17);
    })

})

describe("Get One Member", () => {

    let res: any;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    it("successfully retrieves a member", async () => {
        const req = {
            params: {
                id: "a55daeb0-2d83-4c4f-9bba-c722c4de195c"
            }
        };

        const mockedRecordset = [
         
            {
                member_id: "a55daeb0-2d83-4c4f-9bba-c722c4de195c",
                firstName: "Robinson",
                lastName: "Ngecu",
                email: "robinson.ngecu@thejitu.com",
                cohortNumber: 17,
                role: "member"
            }
        ];

        const mockedExecute = jest.fn().mockResolvedValue({ recordset: mockedRecordset });
        const mockedRequest = {
            input: jest.fn().mockReturnThis(),
            execute: mockedExecute
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest)
        };

        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool as never);

        await getOneUser(req as unknown as Request, res as any);

        // Assertions
        expect(res.json).toHaveBeenCalledWith({
            member: mockedRecordset
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(mockedRequest.input).toHaveBeenCalledWith('member_id', 'example_member_id');
        expect(mockedRequest.execute).toHaveBeenCalledWith('fetchOneMember');
    });

    it("handles errors", async () => {
        const req = {
            params: {
                id: "a55daeb0-2d83-4c4f-9bba-c722c4de195cas_with_error"
            }
        };

        const errorMessage = "An error occurred";
        const mockedExecuteWithError = jest.fn().mockRejectedValue(new Error(errorMessage));
        const mockedRequestWithError = {
            input: jest.fn().mockReturnThis(),
            execute: mockedExecuteWithError
        };
        const mockedPoolWithError = {
            request: jest.fn().mockReturnValue(mockedRequestWithError)
        };

        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPoolWithError as never);

        await getOneUser(req as unknown as Request, res as any);

        // Assertions
        expect(res.json).toHaveBeenCalledWith({
            error: errorMessage
        });
        expect(res.status).toHaveBeenCalledWith(500);
    });
});



jest.mock('mssql');

describe('updateUser', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            params: {
                member_id: 'a55daeb0-2d83-4c4f-9bba-c722c4de195c', 
            },
            body: {
                firstName: 'Jenniffer',
                lastName: 'Kalunda',
                email: 'robinson.ngecu@thejitu.com',
                cohortNumber: 17,
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('should update a member successfully', async () => {
        const connectMock = jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockResolvedValueOnce({
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({}),
            }),
        } as never);

        await updateUser(req as Request, res as Response);

        // Assertions
        expect(connectMock).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Member updated successfully' });
    });

    it('should handle errors', async () => {
        const connectMock = jest.spyOn(mssql, 'connect').mockRejectedValueOnce(new Error('Database connection error') as never);

        await updateUser(req as Request, res as Response);

        // Assertions
        expect(connectMock).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: expect.any(Error) });
    });
});



describe('deleteUser', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            params: {
                member_id: 'a55daeb0-2d83-4c4f-9bba-c722c4de195c', 
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('should delete a member successfully', async () => {

        const connectMock = jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockResolvedValueOnce({
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({}),
            }),
        } as never);

        await deleteUser(req as Request, res as Response);

        // Assertions
        expect(connectMock).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Member deleted successfully' });
    });

    it('should handle errors', async () => {
     
        const connectMock = jest.spyOn(mssql, 'connect').mockRejectedValueOnce(new Error('Database connection error') as never);

        await deleteUser(req as Request, res as Response);

        // Assertions
        expect(connectMock).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: expect.any(Error) });
    });
});