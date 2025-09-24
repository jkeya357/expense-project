const User = require('../model/Users')
const bcrypt = require('bcrypt')
const path = require('multer')

//GET USERS
const getUsers = async (req,res) => {

    const users = await User.find().select('-password').lean()
    if(!users?.length) return res.status(400).json({message: 'No users found'})
    return res.json(users)
}

//CREATE USERS
const createUser = async (req,res) => {
    try {
        const {fullname, email, password} = req.body 

        if(!fullname || !email || !password) return res.status(400).json({message: 'All fields are required'})

        const duplicate = await User.findOne({email}).exec()    
        
        if(duplicate) return res.status(409).json({message: 'Email already exists'})
        
        const hashedPwd = await bcrypt.hash(password, 10)
        
        await User.create({
            fullname,
            email,
            password: hashedPwd
        })

        return res.json({message: `user ${fullname} created successfully`})
    } catch (error) {
        console.log("Error creating the new user", error);
        return res.status(500).json({ message: 'Server error while creating user' });
    }
}

const updateUser = async (req,res) => {

    try {
        const {_id, fullname, icon, email, password} = req.body

        if(!_id || !fullname || !email) return res.status(400).json({message: 'All fields required'})

        const user = await User.findById(_id)
        if(!user) return res.status(404).json({message: 'User not found'})
        
        const findEmail = await User.findOne({email})
        if(findEmail && findEmail._id.toString() !== _id) return res.status(409).json({message: 'That email already exists'})
        
        user.fullname = fullname
        user.email = email
        
        if(password){
            const hashPwd = await bcrypt.hash(password, 10)
            user.password = hashPwd
        }


        await user.save()

        return res.status(200).json({message: `User ${fullname} updated successfully`})
    } catch (error) {
        console.error('Error creating updating user', error);
        return res.status(500).json({ message: 'Server error while updating user' });
    }

}

const deleteUser = async (req,res) => {
    try {
        const {_id} = req.body

        if(!_id) return res.status(400).json({message: 'Please enter the user id'})

        const user = await User.findById(_id)

        if(!user) return res.status(404).json({message: 'User not found'})
        await user.deleteOne()
        return res.status(200).json({message: 'User deleted successfully'})
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Server error while deleting user' });
    }
}

module.exports = {getUsers, createUser, updateUser, deleteUser}