import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetExpenseQuery, useDeleteExpenseMutation, selectAllExpenses } from "./expenseApiSlice";
import { selectCurrentEmail, selectCurrentUserId } from "../auth/authSlice";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Trash2, TrendingDown } from "lucide-react";
import NewExpense from "./NewExpense";

const Expense = () => {
  const navigate = useNavigate();
  const editExpense = (expenseId) => navigate(`/dash/editExpense/${expenseId}`)

  const [showNewExpense, setShowNewExpense] = useState(false)

  const [deleteExpense] = useDeleteExpenseMutation()
  const {isLoading, isSuccess, isError} = useGetExpenseQuery();
  const expenseData = useSelector(selectAllExpenses);
  const currentUser = useSelector(selectCurrentEmail)
  const userId = useSelector(selectCurrentUserId)
  console.log("expense data coming from entity adapter", expenseData)
  console.log("user in expense id: ", currentUser, userId)

  const filteredUserExpenses = expenseData?.filter((expense) => expense.email === currentUser)

  const chartData = (filteredUserExpenses ?? []).map((expense) => ({
    date: new Date(expense.date).toLocaleDateString(),
    amount: expense.amount,
  }));

  const handleDelete = async (id) => {
    // Here you can call your deleteExpense mutation
    try { 
      await deleteExpense({id}).unwrap()
        navigate("/dash/expense")

      console.log("Delete expense:", id);
    } catch (error) {
      console.error("Failed to delete expense:", error)
    }
  };

  if(isLoading) return <p>Loading...</p>
  if(isError) return <p>Error loading expenses</p>

  if(isSuccess){
    return (
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Expenses</h1>
          <button
            onClick={() => setShowNewExpense(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
          >
            + Add Expense
          </button>
        </div>

        {showNewExpense && userId && <NewExpense userId={userId} onClose={() => setShowNewExpense(false)}/>}

        {/* Line Chart */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-8">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
              <Line type="monotone" dataKey="amount" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expenses List */}
        <div className="space-y-4">
          {filteredUserExpenses.map((expense) => (
            <div
              onClick={() => editExpense(expense.id)}
              key={expense.id}
              className="flex justify-between items-center p-4 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition group"
            >
              {/* Left side: icon + name */}
              <div className="flex items-center gap-3">
                <TrendingDown className="text-red-500" />
                <div>
                  <p className="font-semibold">{expense.category}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Right side: amount + delete */}
              <div className="flex items-center gap-4">
                <span className="text-red-400 font-bold">- R{expense.amount}</span>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-400 cursor-pointer"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}

          {filteredUserExpenses.length === 0 && (
            <p className="text-gray-400 text-center">No expenses yet. Add your first one above!</p>
          )}
        </div>
      </div>
    );
  }
};

export default Expense;
