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
import Projects from "./Components/Projects/Projects";


const ProtectedRoute = ({ component: Component }) => {
  return (
    <ProLayouts>
      <Component />
    </ProLayouts>
  );
};

function App() {
  const routes = [
    { path: "/overview", component: Overview },
    { path: "/projects", component: Projects },
  ];

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

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
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;