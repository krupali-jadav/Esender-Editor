import { ProLayout } from "@ant-design/pro-components";
import {
    FolderOpenOutlined,
    FolderOutlined,
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
                path: "/overview",
                name: "Overviews",
                icon: <HomeOutlined />,
            },
            {
                path: "/projects",
                name: "Projects",
                icon: <FolderOpenOutlined />,
            },
        ],
    };

    return (
        <ProLayout
        contentStyle={{padding:"0 0 0 0 "}}
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