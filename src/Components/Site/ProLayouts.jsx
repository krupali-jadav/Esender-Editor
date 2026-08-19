import { ProLayout } from "@ant-design/pro-components";
import {
    HomeOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const ProLayouts = ({ children }) => {
    console.log("ProLayouts FILE UPDATED");

    const location = useLocation();
    const navigate = useNavigate();

    const menuRoutes = {
        path: "/",
        routes: [
            {
                path: "/dashboard",
                name: "fdnf",
                icon: <HomeOutlined />,
            },
            {
                path: "/overview",
                name: "Overviews",
                icon: <HomeOutlined />,
            },
        ],
    };

    return (
        <ProLayout
            title="My Project"
            logo={false}
            route={menuRoutes}
            layout="mix"
            location={{
                pathname: location.pathname,
            }}
            menu={{
                type: "sub",
                collapsedShowGroupTitle: false,
            }}
            menuItemRender={(item, dom) => (
                <div
                    onClick={() => {
                        if (item.path) {
                            navigate(item.path);
                        }
                    }}
                >
                    {dom}
                </div>
            )}
        >
            {children}
        </ProLayout>
    );
};

export default ProLayouts;