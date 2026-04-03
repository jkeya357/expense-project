const User = require('../model/Users')
const bcrypt = require('bcrypt')
const path = require('multer')

//GET USERS
const getUsers = async (req,res) => {

    const users = await User.find().select('-password').lean()
    if(!users?.length) return res.status(400).json({message: 'No users found'})
    return res.json(users)
}

const findUserByEmail = async(req,res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const foundUser = await User.findOne({ email }).select("-password").lean();

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(foundUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
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

module.exports = {getUsers, findUserByEmail, updateUser, deleteUser}