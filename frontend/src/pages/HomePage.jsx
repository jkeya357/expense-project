import {selectAllIncomes} from "../features/income/incomeApiSlice"
import { useNavigate } from 'react-router-dom';
import {selectAllExpenses} from "../features/expense/expenseApiSlice"
import { useGetExpenseQuery } from "../features/expense/expenseApiSlice";
import { useGetIncomeQuery } from "../features/income/incomeApiSlice";
import { selectCurrentUserId} from "../features/auth/authSlice";
import { useSelector } from "react-redux";
import {PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer} from "recharts"

const COLORS = ["#4CAF50", "#F44336", "#2196F3", "#FF9800", "#9C27B0", "#03A9F4"];

const HomePage = () => {

  const {error: expenseError} = useGetExpenseQuery()
  const {error: incomeError} = useGetIncomeQuery()

  const navigate = useNavigate()
  const renderIncome = () => navigate("/dash/income")
  const renderExpense = () => navigate("/dash/expense")

  const currentUser = useSelector(selectCurrentUserId)

  const allExpense = useSelector(selectAllExpenses) || []
  const allIncome = useSelector(selectAllIncomes) || []

  const expense = allExpense.filter(user => user.user === currentUser)
  const income = allIncome.filter(user => user.user === currentUser )

  const totalExpense = expense?.reduce((sum,exp) => sum + exp.amount, 0)
  const totaIncome = income?.reduce((sum,inc) => sum + inc.amount, 0)
  const balance = totaIncome - totalExpense

  const sixtyDaysAgo = new Date()
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

  const recentExpense = expense?.filter(exp => new Date(exp.date) >= sixtyDaysAgo) || []
  const recentIncome = income?.filter(inc => new Date(inc.date) >= sixtyDaysAgo) || []
  const recentTransaction = [...(recentIncome || []).map(i => ({...i, type: "Income"})),
     ...(recentExpense || []).map(e => ({...e, type: "Expense"}))
    ].sort((a,b) => new Date(b.date) - new Date(a.date))

  const pieData = [
    {name: "Income", value: totaIncome},
    {name: "Expense", value: totalExpense},
    {name: "Balance", value: balance}
  ]

  const renderCustomLabel = ({ name, value }) => {
    return `${name}: ${value}`;
  };

  const incomePieData = (recentIncome || []).map(inc => ({
    name: inc.category || "Other",
    value: inc.amount
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <p className="text-sm text-gray-500">Balance</p>
          <h1 className="text-2xl font-bold">
            ${balance.toFixed(2)}
          </h1>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <p className="text-sm text-gray-500">Total Income</p>
          <h1 className="text-2xl font-bold text-green-600">
            ${totaIncome.toFixed(2)}
          </h1>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <p className="text-sm text-gray-500">Total Expense</p>
          <h1 className="text-2xl font-bold text-red-600">
            ${totalExpense.toFixed(2)}
          </h1>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Financial Overview */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border flex flex-col items-center">
          <h2 className="font-semibold mb-4 text-gray-700">
            Financial Overview
          </h2>

          <PieChart width={220} height={220}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={70}
              dataKey="value"
              label
            >
              {pieData?.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Expenses Chart */}
        <div
          onClick={renderExpense}
          className="bg-white p-5 rounded-2xl shadow-sm border col-span-2 cursor-pointer hover:shadow-md transition"
        >
          <h2 className="font-semibold mb-4 text-gray-700">
            Recent Expenses (60 Days)
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={recentExpense}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Incomes */}
        <div
          onClick={renderIncome}
          className="bg-white p-5 rounded-2xl shadow-sm border cursor-pointer hover:shadow-md transition"
        >
          <h2 className="font-semibold mb-4 text-gray-700">
            Recent Incomes
          </h2>

          <ul className="space-y-2 text-sm">
            {recentIncome.slice(0, 5).map((inc) => (
              <li
                key={inc.id}
                className="flex justify-between border-b pb-1"
              >
                <span>{inc.category || "Other"}</span>
                <span className="text-green-600 font-medium">
                  ${inc.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Transactions */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border col-span-2">
          <h2 className="font-semibold mb-4 text-gray-700">
            Recent Transactions
          </h2>

          <ul className="space-y-2 text-sm">
            {recentTransaction.slice(0, 8).map((tx) => (
              <li
                key={tx.id}
                className="flex justify-between border-b pb-1"
              >
                <span>
                  {tx.type} - {tx.category || "Other"}
                </span>

                <span
                  className={`font-medium ${
                    tx.type === "Income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ${tx.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Income Pie Chart */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border flex flex-col items-center">
          <h2 className="font-semibold mb-4 text-gray-700">
            Income by Category
          </h2>

          <PieChart width={280} height={220}>
            <Pie
              data={incomePieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label
            >
              {incomePieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

      </div>

      {/* Errors */}
      {(expenseError || incomeError) && (
        <div className="text-sm text-red-500">
          {expenseError?.data?.message || incomeError?.data?.message || "Something went wrong"}
        </div>
      )}
    </div>
  );
}

export default HomePage
