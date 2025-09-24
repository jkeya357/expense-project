import { useCreateIncomeMutation } from "./incomeApiSlice";
import { useState, useEffect } from "react";

const NewIncome = ({userId, onClose}) => {

    const [category, setCategory] = useState('')
    const [amount, setAmount] = useState('')
    const [date, setDate] = useState()
    

    const [createIncome, {data: newIncome, 
      isSuccess,
      isLoading,
      isError,
      error
    }] = useCreateIncomeMutation()

    const handleSubmit = async (e) => {
      e.preventDefault()
      try {
        await createIncome(
        {
        user: userId,
        category,
        amount: Number(amount),
        date: new Date(date).toISOString()
        }).unwrap()
      } catch (error) {
        console.log("Failed to create income:", error)
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
      {/* Modal content */}
      <div className="bg-white p-6 shadow-xl rounded-lg w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 text-xl font-bold hover:text-red-500"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4">Add New Income</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Income Source</label>
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
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {isLoading ? "Saving..." : "Add Income"}
          </button>
        </form>

        {isError && (
          <p className="text-red-500 mt-4">Error: {error?.data?.message || "Something went wrong"}</p>
        )}
      </div>
    </div>
  );
}

export default NewIncome
