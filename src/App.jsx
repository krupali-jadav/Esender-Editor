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
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Templates from "./Components/Templates/Templates";
import Profile from "./Components/Profile/Profile";
import Projects from "./Components/Projects/Projects";
import Setting from "./Components/Setting/Setting";


const ProtectedRoute = ({ component: Component }) => {
  return (
    <ProLayouts>
      <Component />
    </ProLayouts>
  );
};

function App() {
  const darkMode = useSelector((state) => state?.app?.theme);
  const lang = useSelector((state) => state.app.lang);
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const routes = [
    { path: "/overview", component: Overview },
    { path: "/templates", component: Templates },
    { path: "/profile", component: Profile },
    { path: "/projects", component: Projects },
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
          <Route path="/login" element={<Login />} />

          {/* Application Routes */}
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute
                  component={route.component}
                />
              }
            />
          ))}

          {/* Default */}
          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />
          {/* Unknown routes */}
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>

  );
}

export default App;