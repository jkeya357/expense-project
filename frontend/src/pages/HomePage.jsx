import {selectAllIncomes} from "../features/income/incomeApiSlice"
import { useNavigate } from 'react-router-dom';
import {selectAllExpenses} from "../features/expense/expenseApiSlice"
import { selectIncomeResult } from "../features/income/incomeApiSlice";
import { selectExpenseResult } from "../features/expense/expenseApiSlice";
import { useGetExpenseQuery } from "../features/expense/expenseApiSlice";
import { useGetIncomeQuery } from "../features/income/incomeApiSlice";
import { useSelector } from "react-redux";
import {PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer} from "recharts"

const COLORS = ["#4CAF50", "#F44336", "#2196F3", "#FF9800", "#9C27B0", "#03A9F4"];

const HomePage = () => {

  const {error: expenseError} = useGetExpenseQuery()
  const {error: incomeError} = useGetIncomeQuery()

  const navigate = useNavigate()
  const renderIncome = () => navigate("/dash/income")
  const renderExpense = () => navigate("/dash/expense")

  const expense = useSelector(selectAllExpenses) || []
  const income = useSelector(selectAllIncomes) || []

  console.log("Your expense data is",expense)
  console.log("Your income data is",income)

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

  const incomePieData = (recentIncome || []).map(inc => ({
    name: inc.category || "Other",
    value: inc.amount
  }));

  return (
  <div className="p-6 bg-gray-100 min-h-screen">
    {/* Balance Card */}
    <div className="mb-6 bg-white p-6 shadow rounded-lg">
      <h1 className="text-2xl font-bold">Balance: ${balance.toFixed(2)}</h1>
      <p className="text-green-600">Total Income: ${totaIncome.toFixed(2)}</p>
      <p className="text-red-600">Total Expense: ${totalExpense.toFixed(2)}</p>
    </div>

    {/* Grid Layout */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Financial Overview Pie Chart */}
      <div className="bg-white p-4 shadow rounded-lg flex flex-col items-center">
        <h2 className="font-bold mb-4">Financial Overview</h2>
        <PieChart width={250} height={250}>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
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

      {/* Recent Expenses Bar Chart */}
      <div
        onClick={renderExpense}
        className="bg-white p-4 shadow rounded-lg col-span-2 cursor-pointer"
      >
        <h2 className="font-bold mb-4">Recent Expenses (Last 60 Days)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={recentExpense}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#F44336" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Incomes */}
      <div
        onClick={renderIncome}
        className="bg-white p-4 shadow rounded-lg cursor-pointer"
      >
        <h2 className="font-bold mb-4">Recent Incomes</h2>
        <ul className="space-y-2">
          {recentIncome.slice(0, 5).map((inc) => (
            <li
              key={inc.id}
              className="flex justify-between border-b pb-1"
            >
              <span>{inc.category || "Other"}</span>
              <span className="text-green-600">${inc.amount}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-4 shadow rounded-lg col-span-2">
        <h2 className="font-bold mb-4">Recent Transactions (Last 60 Days)</h2>
        <ul className="space-y-2">
          {recentTransaction.slice(0, 8).map((tx) => (
            <li
              key={tx.id}
              className="flex justify-between border-b pb-1"
            >
              <span>{tx.type} - {tx.category || "Other"}</span>
              <span
                className={
                  tx.type === "Income"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                ${tx.amount}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Incomes by Category Pie Chart */}
      <div className="bg-white p-4 shadow rounded-lg flex flex-col items-center">
        <h2 className="font-bold mb-4">Incomes by Category (Last 60 Days)</h2>
        <PieChart width={250} height={250}>
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

    {/* Error Messages */}
    {expenseError && (
      <p className="text-red-500 mt-4">
        Error: {expenseError?.data?.message || "Failed to load expenses"}
      </p>
    )}

    {incomeError && (
      <p className="text-red-500 mt-4">
        Error: {incomeError?.data?.message || "Failed to load incomes"}
      </p>
    )}
  </div>
);

}

export default HomePage
