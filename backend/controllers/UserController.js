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

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const { fullname, email, password } = req.body;
    const icon = req.file;

    if (!fullname || !email) {
      return res.status(400).json({ message: "Fullname and email are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail && existingEmail._id.toString() !== userId) {
      return res.status(409).json({ message: "That email already exists" });
    }

    user.fullname = fullname;
    user.email = email;

    if (password?.trim()) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (icon) {
      user.icon = icon.path;
    }

    await user.save();

    return res.status(200).json({
      message: `User ${fullname} updated successfully`,
      user,
    });

  } catch (error) {
    console.error("Error updating user", error);
    return res.status(500).json({
      message: "Server error while updating user",
    });
  }
};

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