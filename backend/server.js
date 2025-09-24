const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const cookieParser = require('cookie-parser')
const app = express()

const PORT = process.env.PORT || 5000
const userRoute = require('./routes/userRoutes')
const authRoutes = require('./routes/AuthRoutes')
const expenseRoutes = require('./routes/ExpenseRoute')
const incomeRoutes = require('./routes/IncomeRoute')
const corsOptions = require('./config/corsOptions')
const dbConn = require('./config/dbConfig')

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use('/auth', authRoutes)
app.use('/users', userRoute)
app.use('/expense', expenseRoutes)
app.use('/income', incomeRoutes)

app.listen(PORT, () => {
    console.log("Server started on PORT: ",PORT)
    dbConn()
})