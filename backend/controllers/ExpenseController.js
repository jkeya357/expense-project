const Expense = require('../model/Expense')
const User = require('../model/Users')

const getExpenses = async (req,res) => {

    try {
        const expenses = await Expense.find().lean().exec()

        if(!expenses?.length) return res.status(404).json({message: 'No data'})
    
        const expenseUser = await Promise.all(expenses.map(async (expense) => {
        const user = await User.findById(expense.user).lean().exec()
        return {...expense, email:user.email}
    }))

    return res.json({expenseUser})
    } catch (error) {
        console.error('There was an error fetching  the expenses:', error);
        return res.status(500).json({ message: 'Server error fetching expense' });
    }
}

const createExpense = async (req,res) => {

    try {
        const {user, category, amount, date} = req.body

        if(!user || !category || !amount) return res.status(400).json({message: 'All fields required'})

        const findUser = await User.findById(user).exec()
        if(!findUser) return res.status(404).json({message: 'User not found'})

        const expenses = await Expense.findOne({user, category}).collation({locale: 'en', strength: 2}).lean().exec()
        if(expenses) return res.status(409).json({message: 'You already have that category'})
        
        await Expense.create({
            user,
            category,
            amount,
            date : date || new Date()
        }) 

        res.status(201).json({message: `New expense added ${category}`})
    } catch (error) {
        console.error('There was an error creating  the expense:', error);
        return res.status(500).json({ message: 'Server error creating expense' });
    }
    
}

const updateExpense = async (req,res) => {

    try {
        const {_id, user, icon, category, amount, date} = req.body

        if(!_id || !user || !category || !amount) return res.status(400).json({message: 'All fields required'})

        const findExpense = await Expense.findOne({
            user,
            category,
            _id:{$ne : _id}
            }).collation({locale: 'en', strength: 2}).lean().exec()

        if(findExpense) return res.status(409).json({message: 'You already have that catgory'})

        if(typeof amount !== "number" || amount <= 0 ){ 
            return res.status(400).json({message: 'Please enter a number greater than 0 '})
        }

        const expense = await Expense.findById(_id).select("-email").exec()
        if(!expense) return res.status(404).json({message: 'expense not found'})
        
        expense.icon = icon || expense.icon
        expense.category = category
        expense.amount = amount
        if(date){
            expense.date = new Date(date)
        }

        await expense.save()
        res.status(200).json({message: `expense ${category} updated sucessfully`})
    } catch (error) {
        console.error('There was an error updating the expense:', error);
        return res.status(500).json({ message: 'Server error updating expense' });
    }
}

const deleteExpense = async (req,res) => {
    try {
        const {id} = req.body

        if(!id) return res.status(400).json({message: 'All fields required'})
        
        const expense = await Expense.findById(id)
        if(!expense) return res.status(404).json({message: 'Expense not found'})

        await expense.deleteOne()

        res.status(200).json({message: `Expense ${expense.category} deleted`})

    } catch (error) {

        console.error('There was an error deleting the expense:', error);
        return res.status(500).json({ message: 'Server error deleting expense' });
    }
}

module.exports = {getExpenses, createExpense, updateExpense, deleteExpense}