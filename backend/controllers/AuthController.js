const User = require('../model/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const login = async (req,res) => {

    try {
        const {email, password} = req.body

        if(!email || !password) return res.status(400).json({message: 'All fields are required'})
        
        const user = await User.findOne({email}).exec()

        if(!user) return res.status(401).json({message: 'Unauthorized user'})

        const verifyPwd = await bcrypt.compare(password, user.password)
        if(!verifyPwd) return res.status(401).json({message: 'Unauthorized'})
        
        const accessToken = jwt.sign(
            {
                "userInfo":{
                    "email": user.email,
                }
            },
            process.env.ACCESS_TOKEN,
            {expiresIn: '1d'}
        )

        const refreshToken = jwt.sign(
            {"email": user.email},
            process.env.REFRESH_TOKEN,
            {expiresIn: '7d'}
        )

        res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.json({
            accessToken,
            user: user.id,
            email: user.email
        })
    } catch (error) {
        console.error("There was an error generating the accessToken", error)
        res.status(500).json({ message: "Internal server error" });
    }
}

const refresh = async (req,res) => {

    try {
        const cookies = req.cookies
        if(!cookies?.jwt) return res.status(401).json({message: 'Unauthorized'})
            
        const refreshToken = cookies.jwt
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN,
            async (err, decoded) => {

                if(err) return res.status(403).json({message: 'Forbidden'})

                const user = await User.findOne({email: decoded.email})
                if(!user) return res.status(404).json({message: 'User not found'})
                
                const accessToken = jwt.sign(
                    {
                        "userInfo" :{
                            "user": user.id,
                            "email": user.email
                        }
                    },
                    process.env.ACCESS_TOKEN,
                    {expiresIn: '1d'}
                )
                res.cookie("jwt", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "None",
                    maxAge: 24 * 60 * 60 * 1000, // 1 day
                });
                res.json({
                    accessToken,
                    email: user.email
                })
            }
        )
    } catch (error) {
        console.error('Error handling refresh token:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const logout = (req,res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204)
    res.clearCookie('jwt', {httpOnly: true,
        secure: true,
        sameSite: "None",
        })
    res.json('cookies cleared')
}

module.exports = {login, refresh, logout}