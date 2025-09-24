const Income = require('../model/Income')
const User = require('../model/Users')

const getIncome = async (req,res) => {

    try {
        const incomes = await Income.find().lean().exec()
        if(!incomes?.length) return res.status(404).json({message: 'No data'})
        
        const incomeUsers = await Promise.all(incomes.map(
            async (income) => {
                const user = await User.findById(income.user) //FINDS THE CORRESPONDING ID FOR THE **income.user**(user)
                return {...income, email:user.email} // ADDS THE email of the found user to the database
            }
        ))

        res.json({incomeUsers})

    } catch (error) {
        console.error('There was an error fetching  the income:', error);
        return res.status(500).json({ message: 'Server error fetching income' });
    }
}

const createIncome = async (req,res) => {

    try {
        const {user, icon, category, amount, date} = req.body

        if(!user || !category || !amount) return res.status(400).json({message: 'All fields are required'})

        const findUser = await User.findById(user).exec()
        if(!findUser) return res.status(404).json({message: 'invalid user id'})
        
        const duplicateIncome = await Income.findOne({user, category}).collation({locale: 'en', strength: 2}).lean().exec()
        if(duplicateIncome) return res.status(409).json({message: 'You already have that income'})

        if(amount <= 0) return res.status(400).json({message: 'Amount must be greater than 0'})

        await Income.create({
            user,
            icon: icon || 'default-icon.svg',
            category,
            amount,
            date: date ? new Date(date) : new Date() 
        })

        res.status(201).json({message: `New income added ${category}`})
    } catch (error) {
        console.error('There was an error creating  the income:', error);
        return res.status(500).json({ message: 'Server error creating income' });
    }
}

const updateIncome = async (req,res) => {

    try {
        const {_id, user, icon, category, amount, date} = req.body
        
        const duplicateIncome = await Income.findOne({
            user,
            category,
            _id: {$ne: _id}
        }).collation({locale: 'en', strength: 2}).lean().exec()

        if(duplicateIncome) return res.status(409).json({message: 'That income source already exists'})

        if(typeof amount !== "number" || amount <= 0){
            
            return res.status(400).json({message: 'Amount cannot be less than 0'})
        }    
        
        const income = await Income.findById(_id).select("-email").exec()
        if(!income) return res.status(404).json({message: 'Income not found'})

        income.icon = icon || income.icon
        income.category = category
        income.amount = amount
        if(date){
            income.date = new Date(date)
        }
        
        await income.save()
        
        res.status(200).json({message: `${category} income updated sucessfully`})
    } catch (error) {
        console.error('There was an error updating the income:', error);
        return res.status(500).json({ message: 'Server error updating income' });
    }
}

const deleteIncome = async (req,res) => {
    try {
        const {id} = req.body

        if(!id) return res.status(404).json({message: 'All fields required'})

        const findIncome = await Income.findById(id)

        if(!findIncome) return res.status(404).json({message: 'Not found'})

        await findIncome.deleteOne()
        res.status(200).json({message: `income ${findIncome.category} deleted`})
    } catch (error) {
        console.error('There was an error deleting the income:', error);
        return res.status(500).json({ message: 'Server error deleting income' });
    }
}

module.exports = {getIncome, createIncome, updateIncome, deleteIncome}