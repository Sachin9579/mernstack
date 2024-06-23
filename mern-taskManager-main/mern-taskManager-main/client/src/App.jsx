import { Routes, Route, BrowserRouter } from "react-router-dom"
import RegisterPage from "./pages/registerPage/RegisterPage"
import LoginPage from "./pages/loginPage/LoginPage"
import Dashboard from "./pages/DashBoardPage/Dashboard.jsx"
import Layout from "./layout/Layout.jsx"
import SharePage from "./pages/SharePage/SharePage.jsx"
import AnalyticsPage from "./pages/AnalyticsPage/AnalyticsPage.jsx"
import SettingsPage from "./pages/SettingsPage/SettingsPage.jsx"
import PrivateRoute from "./components/PrivateRoute.jsx"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { UserContextProvider } from "./context/UserContext.jsx"

const App = () => {
  return (
    <>
      <UserContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route
                  path="/dashboard/analytics"
                  element={<AnalyticsPage />}
                />
                <Route path="/dashboard/settings" element={<SettingsPage />} />
              </Route>
            </Route>
            <Route path="/info/:infoId" element={<SharePage />} />
          </Routes>
        </BrowserRouter>
      </UserContextProvider>
      <ToastContainer />
    </>
  )
}

export default App
