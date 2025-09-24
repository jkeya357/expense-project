const jwt = require('jsonwebtoken')

const verifyJWT = (req,res,next) => {
    const headers = req.headers.authorization || req.headers.Authorization

    if(!headers?.startsWith('Bearer ')) return res.status(401).json({message: 'Unauthorized'})
    
    const token = headers.split(' ')[1]
    
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN,
        (error,decoded) => {
            if(error) return res.status(401).json({message: 'Unauthorized user'})
            req.fullname = decoded.userInfo.fullname
            req.email = decoded.userInfo.email
            next()
        }
    )
}

module.exports = verifyJWT