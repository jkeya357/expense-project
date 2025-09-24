import { Routes, Route } from "react-router"
import Layout from './components/Layout';
import Home from "./components/Home";
import Login from "./features/auth/login";
import CreateUser from "./features/users/CreateUser";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import Income from "./features/income/Income";
import Expense from "./features/expense/Expense";
import PersistLogin from "./features/auth/PersistLogin";
import EditIncome from "./features/income/EditIncome";
import EditExpense from "./features/expense/EditExpense";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<CreateUser/>}/>

        <Route path="dash" element={<PersistLogin/>}>
          <Route index element={<HomePage/>}/>
          <Route path="/dash/profile" element={<ProfilePage/>}/>
          
          {/* INCOME ROUTES */}
          <Route path="income" element={<Income/>}/>
          <Route path="editIncome/:id" element={<EditIncome/>}/>
          
          {/* EXPENSE ROUTES */}
          <Route path="expense" element={<Expense/>}/>
          <Route path="editExpense/:id" element={<EditExpense/>}/>
        </Route>
      </Route>

    </Routes>
  );
}

export default App

/*

*/