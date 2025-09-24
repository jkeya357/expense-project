import {useCreateExpenseMutation} from "./expenseApiSlice"
import { useState, useEffect } from "react"

const NewExpense = ({userId, onClose}) => {

  const [createExpense, {isLoading, isSuccess, isError, error}] = useCreateExpenseMutation()

  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState()
  const [date, setDate] = useState()


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createExpense({user: userId, category, amount, date}).unwrap()
      onClose()
    } catch (error) {
      
    }
  }

  useEffect(() => {
    if(isSuccess){
      setCategory('')
      setAmount('')
      if(onClose) onClose()
    }
  }, [isSuccess, onClose])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 shadow-xl rounded-lg w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 text-xl font-bold hover:text-red-500"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4">Add New Expense</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Expense Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border p-2 rounded text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border p-2 rounded text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border p-2 rounded text-gray-800"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            {isLoading ? "Saving..." : "Add Expense"}
          </button>
        </form>

        {isError && (
          <p className="text-red-500 mt-4">{error?.data?.message || "Something went wrong"}</p>
        )}
      </div>
    </div>
  );
}

export default NewExpense
