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
      <div className="min-h-screen bg-gray-950 text-gray-100 p-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

          <h1 className="text-2xl font-bold tracking-tight">
            My Expenses
          </h1>

          <button
            onClick={() => setShowNewExpense(true)}
            className="bg-indigo-600 hover:bg-indigo-500 transition px-4 py-2 rounded-lg text-sm font-semibold shadow"
          >
            + Add Expense
          </button>

        </div>

        {/* New Expense Form */}
        {showNewExpense && userId && (
          <NewExpense userId={userId} onClose={() => setShowNewExpense(false)} />
        )}

        {/* Chart Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm text-gray-400 mb-4">
            Expense Trend
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#ef4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expenses List */}
        <div className="space-y-3">

          {filteredUserExpenses.length > 0 ? (
            filteredUserExpenses.map((expense) => (
              <div
                key={expense.id}
                onClick={() => editExpense(expense.id)}
                className="group flex justify-between items-center p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-red-500 transition cursor-pointer"
              >

                {/* Left */}
                <div className="flex items-center gap-3">
                  <TrendingDown className="text-red-400" />

                  <div>
                    <p className="font-medium">
                      {expense.category}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-4">
                  <span className="text-red-400 font-semibold">
                    - R{expense.amount}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(expense.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p className="text-sm">No expenses yet</p>
              <p className="text-xs">Click "Add Expense" to get started</p>
            </div>
          )}

        </div>

      </div>
    );
  }
};

export default Expense;
