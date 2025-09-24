import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useGetIncomeQuery, useUpdateIncomeMutation } from "./incomeApiSlice"
import { selectIncomeById } from "./incomeApiSlice"
import { useState, useEffect } from "react"
import EmojiPicker from "emoji-picker-react";

const EditIncome = () => {

    const {id} = useParams();
    const navigate = useNavigate()

    const [category, setCategory] = useState("")
    const [amount, setAmount] = useState("")
    const [date, setDate] = useState("")
    const [icon, setIcon] = useState("💰")
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    
    useGetIncomeQuery(undefined, {refetchOnMountOrArgChange: true})
    const [updateIncome, {isSuccess, isLoading, isError, error}] = useUpdateIncomeMutation()
    const income = useSelector((state) => selectIncomeById(state, id))

    useEffect(() => {
        if(income){
            setCategory(income.category)
            setAmount(income.amount)
            setDate(income.date ? new Date(income.date).toISOString().split("T")[0] : "")
            setIcon(income.icon || "💰")
        }
    }, [income])

    useEffect(() => {
        if(isSuccess){
            navigate("/dash/income")
        }
    }, [isSuccess, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await updateIncome({
              _id: id,
              user: income.user,
              icon, category,
              amount: Number(amount),
              date
            }).unwrap()
        } catch (error) {
            console.log("Failed to update income:", error)
        }
    }

    const handleEmojiClick = (emojiObj) => {
        setIcon(emojiObj.emoji)
        setShowEmojiPicker(false)
    }

    if(!income){
        return <p className="text-white p-6">Loading income details...</p>
    }
    
  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Edit Income</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg space-y-4"
      >
        {/* Emoji/Icon Input */}
        <div className="relative">
            <label>Icon</label>
            <input
              type="text"
              value={icon}
              readOnly
              onClick={() => setShowEmojiPicker(prev => !prev)}
              className="icon-input"
            />
            {showEmojiPicker && (
              <div className="absolute z-50 mt-2">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
        </div>

        {/* Category Input */}
        <div>
          <label className="block mb-1 font-semibold">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Amount Input */}
        <div>
          <label className="block mb-1 font-semibold">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Date Input */}
        <div>
          <label className="block mb-1 font-semibold">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
        >
          {isLoading ? "Updating..." : "Update Income"}
        </button>

        {isError && <p className="text-red-500 mt-2">{error?.data?.message || "Update failed"}</p>}
      </form>
    </div>
  )
}

export default EditIncome
