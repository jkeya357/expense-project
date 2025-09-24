import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetIncomeQuery, useDeleteIncomeMutation, selectAllIncomes } from "./incomeApiSlice";
import { selectCurrentEmail, selectCurrentUserId } from "../auth/authSlice";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Trash2 } from "lucide-react";
import NewIncome from "./NewIncome";

const Income = () => {
  const navigate = useNavigate();

  const handleEditIncome = (incomeId) => navigate(`/dash/editIncome/${incomeId}`)
  

  const [showNewIncome, setShowNewIncome] = useState(false)

  const toggleNewIncome = () => setShowNewIncome(prev => !prev)

  const { isLoading, isSuccess } = useGetIncomeQuery();
  const [deleteIncome] = useDeleteIncomeMutation();

  const incomeData = useSelector(selectAllIncomes);
  const currentUser = useSelector(selectCurrentEmail)
  console.log("income data from adapter", incomeData)

  const userId = useSelector(selectCurrentUserId)
  console.log("Current user: ", currentUser, userId)

  const filterIncome = incomeData ? incomeData?.filter((income) => income.email === currentUser) : [];

  const chartData = (filterIncome ?? []).map((income) => ({
    name: income.category || "Other",
    amount: income.amount,
  }));

  const handleDelete = async (id) => {
    try {
      await deleteIncome({id}).unwrap();
      console.log("Deleted income id:", id);

      navigate("/dash/income")
    } catch (error) {
      console.error("Failed to delete income:", error);
    }
  };

  if (isLoading) return <p className="text-white p-6">Loading...</p>;
  if(!isSuccess) return <p className="text-white p-6">No data available.</p>;

  if(isSuccess){
    return (
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Incomes</h1>
          <button
            onClick={toggleNewIncome}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
          >
            + Add Income
          </button>
        </div>

        {showNewIncome && userId && <NewIncome userId={userId} onClose={() => setShowNewIncome(false)}/>}

        {/* Bar Chart */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-8">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
              <Bar dataKey="amount" fill="#4ade80" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Income List */}
        <div className="space-y-4">
          {filterIncome.length > 0 ? (
            filterIncome.map((income) => (
              <div
                key={income.id}
                onClick={() => handleEditIncome(income.id)}
                className="flex justify-between items-center p-4 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 hover:cursor-pointer transition group"
              >
                {/* Left side: icon + name */}
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-green-500" />
                  <div>
                    <p className="font-semibold">{income.category}</p>
                    <p className="text-sm text-gray-400">{new Date(income.date).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Right side: amount + delete */}
                <div className="flex items-center gap-4">
                  <span className="text-green-400 font-bold">R{income.amount}</span>
                  <button
                    onClick={() => handleDelete(income.id)}
                    className="opacity-0 group-hover:opacity-100 transition text-green-500 hover:text-green-400 cursor-pointer"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No incomes yet. Add your first one above!</p>
          )}
        </div>
      </div>
    );
  }
};

export default Income;
