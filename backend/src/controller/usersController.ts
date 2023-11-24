import { Request, Response } from 'express'
import mssql from 'mssql'
import {v4} from 'uuid'
import bcrypt from 'bcrypt'
import { sqlConfig } from '../config/sqlConfig'


 
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, cohortNumber, password } = req.body;

        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._-]+@thejitu\.com$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Invalid email format. Email must be in the format fname.lname@thejitu.com',
            });
        }

        const member_id = v4();
        const hashedPwd = await bcrypt.hash(password, 5);

        const pool = await mssql.connect(sqlConfig);

        const result = await pool.request()
            .input('member_id', mssql.VarChar, member_id)
            .input('firstName', mssql.VarChar, firstName)
            .input('lastName', mssql.VarChar, lastName)
            .input('email', mssql.VarChar, email)
            .input('cohortNumber', mssql.Int, cohortNumber)
            .input('password', mssql.VarChar, hashedPwd)
            .execute('registerMember');

        return res.status(200).json({
            message: 'Member registered successfully',
        });
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};

export const getOneUser = async (req: Request, res: Response) => {
    try {
        let id = req.params.id;

        const pool = await mssql.connect(sqlConfig);

        let member = (await pool.request().input('member_id', id).execute('fetchOneMember')).recordset;
        // Adjust the stored procedure name ('fetchOneMember') based on your actual implementation

        return res.status(200).json({
            member: member
        });

    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        let { member_id } = req.params;
        let { firstName, lastName, email, cohortNumber } = req.body;

        const pool = await mssql.connect(sqlConfig);

        const result = await pool.request()
            .input("member_id", member_id)
            .input("firstName", mssql.VarChar, firstName)
            .input("lastName", mssql.VarChar, lastName)
            .input("email", mssql.VarChar, email)
            .input("cohortNumber", mssql.Int, cohortNumber)
            .execute("updateMember");

        console.log(result);

        return res.json({ message: 'Member updated successfully' });

    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};


export const deleteUser = async (req: Request, res: Response) => {
    try {
        let { member_id } = req.params;

        const pool = await mssql.connect(sqlConfig);

        const result = await pool.request()
            .input("member_id", member_id)
            .execute("deleteMember");
        // Adjust the stored procedure name ('deleteMember') based on your actual implementation

        console.log(result);

        return res.json({ message: 'Member deleted successfully' });

    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};


