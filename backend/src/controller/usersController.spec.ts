import mssql from 'mssql'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {v4} from 'uuid'
import { getOneUser, registerUser } from './usersController'
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

        await registerUser(req as Request, res as any);

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
                id: "example_member_id"
            }
        };

        const mockedRecordset = [
            // Mock your expected member data here
            {
                member_id: "example_member_id",
                firstName: "Example",
                lastName: "Member",
                email: "example.member@thejitu.com",
                cohortNumber: 17,
                role: "Member"
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

        await getOneUser(req as Request, res as any);

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
                id: "example_member_id"
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

        await getOneUser(req as Request, res as any);

        // Assertions
        expect(res.json).toHaveBeenCalledWith({
            error: errorMessage
        });
        expect(res.status).toHaveBeenCalledWith(500);
    });
});



