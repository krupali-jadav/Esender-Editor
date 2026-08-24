import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./Components/Login";
import ProLayouts from "./Components/Site/ProLayouts";
import Overview from "./Components/Overview/Overview";
import { ConfigProvider } from "antd";
import { getThemeConfig } from "./Components/theme/themeConfig";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Templates from "./Components/Templates/Templates";
import Profile from "./Components/Profile/Profile";
import Projects from "./Components/Projects/Projects";
import Usage from "./Components/Usage/Usage";
import Developers from "./Components/Developers/Developers";
import Billing from "./Components/Billing/Billing";
import WorkFlow from "./Components/WorkFlow/WorkFlow";
import CreateTemplates from "./Components/Templates/CreateTemplate";
import Setting from "./Components/Setting/Setting";
import { getExchangeRates, refreshProfile } from "./Components/Redux/action";


const ProtectedRoute = ({ component: Component }) => {
  return (
    <ProLayouts>
      <Component />
    </ProLayouts>
  );
};

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.user?.token);
  const isAuthenticated = !!token;
  const darkMode = useSelector((state) => state?.app?.theme);
  const lang = useSelector((state) => state.app.lang);
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (!token) return;
    dispatch(refreshProfile());
    // dispatch(getExchangeRates());

  }, [token, dispatch]);

  const routes = [
    { path: "/overview", component: Overview },
    { path: "/templates", component: Templates },
    { path: "/templates/create-template", component: CreateTemplates },
    { path: "/profile", component: Profile },
    { path: "/projects", component: Projects },
    { path: "/usage", component: Usage },
    { path: "/developers", component: Developers },
    { path: "/billing", component: Billing },
    { path: "/workflow", component: WorkFlow },
    { path: "/settings", component: Setting },
  ];

  return (
    <ConfigProvider
      locale="en"
      theme={getThemeConfig(darkMode)}
    >
      <BrowserRouter>
        <Routes>
          {/* Login */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/overview" replace />
              ) : (
                <Login />
              )
            }
          />

          {/* Application Routes */}
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute
                  component={route.component}
                  isAuthenticated={isAuthenticated}
                />
              }
            />
          ))}

          {/* Default */}
          <Route
            path="/"
            element={
              <Navigate
                to={isAuthenticated ? "/overview" : "/login"}
                replace
              />
            }
          />

          {/* Unknown routes */}
          <Route
            path="*"
            element={
              <Navigate
                to={isAuthenticated ? "/overview" : "/login"}
                replace
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>

  );
}

export default App;