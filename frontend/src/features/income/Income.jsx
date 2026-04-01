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
      <div className="min-h-screen bg-gray-950 text-gray-100 p-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

          <h1 className="text-2xl font-bold tracking-tight">
            My Incomes
          </h1>

          <button
            onClick={toggleNewIncome}
            className="bg-indigo-600 hover:bg-indigo-500 transition px-4 py-2 rounded-lg text-sm font-semibold shadow"
          >
            + Add Income
          </button>

        </div>

        {/* New Income Form */}
        {showNewIncome && userId && (
          <NewIncome userId={userId} onClose={() => setShowNewIncome(false)} />
        )}

        {/* Chart Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm text-gray-400 mb-4">
            Income Overview
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="amount"
                fill="#6366f1"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Income List */}
        <div className="space-y-3">

          {filterIncome.length > 0 ? (
            filterIncome.map((income) => (
              <div
                key={income.id}
                onClick={() => handleEditIncome(income.id)}
                className="group flex justify-between items-center p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-indigo-500 transition cursor-pointer"
              >

                {/* Left */}
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-indigo-400" />

                  <div>
                    <p className="font-medium">
                      {income.category}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(income.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-4">
                  <span className="text-green-400 font-semibold">
                    R{income.amount}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(income.id);
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
              <p className="text-sm">No incomes yet</p>
              <p className="text-xs">Click "Add Income" to get started</p>
            </div>
          )}

        </div>

      </div>
    );
  }
};

export default Income;
