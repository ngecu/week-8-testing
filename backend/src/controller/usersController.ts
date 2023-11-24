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

export const getOneUser = async(req:Request, res:Response)=>{
    try {

        let id = req.params.id 

        const pool = await mssql.connect(sqlConfig)

        let employee = (await pool.request().input('employee_id',id).execute('fetchOneEmployee')).recordset
        // let employees = (await pool.request().query('SELECT * FROM Employees')).recordset

        return res.status(200).json({
            employee: employee
        })
        
    } catch (error) {
        return res.json({
            error: error
        })
    }
}

export const updateUser = async (req: Request, res:Response)=>{
    try {
        
        let {employee_id} = req.params
        let {isDeleted} = req.body

        const pool = await mssql.connect(sqlConfig)

        const result = await pool.request()
        .input("employee_id", employee_id) 
        .input("isDeleted", isDeleted)
        .execute("deleteEmployee")
        
        console.log(result);

        return res.json({message: result})

    } catch (error) {
        return res.json({
            error: error
        })
    }
}

export const deleteUser = async (req: Request, res:Response)=>{
    try {
        
        let {employee_id} = req.params
        let {isDeleted} = req.body

        const pool = await mssql.connect(sqlConfig)

        const result = await pool.request()
        .input("employee_id", employee_id) 
        .input("isDeleted", isDeleted)
        .execute("deleteEmployee")
        
        console.log(result);

        return res.json({message: result})

    } catch (error) {
        return res.json({
            error: error
        })
    }
}
