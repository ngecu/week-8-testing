import { Router } from "express";
import { registerUser,getOneUser,updateUser,deleteUser } from "../controller/usersController";

const user_router = Router()

user_router.post('/register', registerUser)
user_router.get('/:member_id',  getOneUser)
user_router.put('/:member_id', updateUser)
user_router.delete('/:member_id', deleteUser)

export default user_router;