import { Router } from "express";
import { registerUser,getOneUser,updateUser,deleteUser } from "../controller/usersController";

const user_router = Router()

user_router.post('/register', registerUser)
user_router.get('/:id',  getOneUser)
user_router.put('/:user_id', updateUser)
user_router.delete('/:user_id', deleteUser)

export default user_router;