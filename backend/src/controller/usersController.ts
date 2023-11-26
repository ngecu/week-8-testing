import { Request, Response } from 'express'
import mssql from 'mssql'
import {v4} from 'uuid'
import bcrypt from 'bcrypt'
import { sqlConfig } from '../config/sqlConfig'
 
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, cohortNumber, password } = req.body;

  
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
            .input('member_id', mssql.VarChar, "30377c02-1f5a-4bff-974d-2862684f26e1")
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
        console.log(req.params);
        
        let {member_id} = req.params;

        const pool = await mssql.connect(sqlConfig);

        let member = (await pool.request().input('member_id', member_id).execute('fetchOneMember')).recordset;

        return res.status(200).json({
            member: member
        });

    } catch (error) {
        return res.status(500).json({
            error: "An error occurred"
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

        console.log(req.params);
        

        const pool = await mssql.connect(sqlConfig);

        const result = await pool.request()
            .input("member_id",mssql.VarChar, member_id)
            .execute("deleteMember");

        console.log(result);

        return res.json({ message: 'Member deleted successfully' });

    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};


