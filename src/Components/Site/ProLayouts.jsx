import { ProLayout } from "@ant-design/pro-components";
import {
    AppstoreAddOutlined,
    FolderOpenOutlined,
    HomeOutlined,
    LaptopOutlined,
    LogoutOutlined,
    MailOutlined,
    MoonOutlined,
    SettingOutlined,
    SunOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, Breadcrumb, Dropdown, Grid, Select, Space, Typography } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeCurrency, changeLanguage, setTheme } from "../Redux/Reducer/reducer.app";
import { getMediaPath } from "../../util/getMediaPath";
import lang from "../../util/lang/lang.json"
import { logout } from "../Redux/action";
import { t } from "i18next";

const ProLayouts = ({ children }) => {
    const { useBreakpoint } = Grid;
    const [collapsed, setCollapsed] = useState(false);
    const profile = useSelector((state) => state?.user?.profile);
    const panel = useSelector((state) => state?.app?.panel);
    const language = useSelector((state) => state?.app?.lang);
    const theme = useSelector((state) => state?.app?.theme);
    const currency = useSelector((state) => state.app.currency);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { Text } = Typography;

    const menuRoutes = {
        path: "/",
        routes: [
            {
                path: "/overview",
                name: "Overview",
                icon: <AppstoreAddOutlined />,
            },
            {
                path: "/templates",
                name: "Templates",
                icon: <MailOutlined />,
            },
            {
                path: "/projects",
                name: "Projects",
                icon: <FolderOpenOutlined />,
            },
            {
                path: "/settings",
                name: "Settings",
                icon: <SettingOutlined />,
            },
        ],
    };
    const BreadcrumbCustom = () => {
        const screens = useBreakpoint();

        const pathSegments = location.pathname.split("/").filter(Boolean);

        const items = pathSegments.map((segment, index) => {
            let pathToNavigate = `/${pathSegments.slice(0, index + 1).join("/")}`;
            const isLastSegment = index === pathSegments.length - 1;

            return {
                title: isLastSegment ? (
                    <span style={{ textTransform: "capitalize" }}>
                        {segment.replace(/-/g, " ")}
                    </span>
                ) : (
                    <span
                        style={{ cursor: "pointer", textTransform: "capitalize" }}
                        onClick={() => navigate(pathToNavigate)}
                    >
                        {segment.replace(/-/g, " ")}
                    </span>
                ),
            };
        });

        const breadcrumbItems = [
            {
                title: (
                    <HomeOutlined
                        onClick={() => navigate("/")}
                    />
                ),
            },
            ...items,
        ];

        return (
            <Breadcrumb
                items={screens.md ? breadcrumbItems : [breadcrumbItems.at(-1)]}
            />
        );
    };
    const handleLanguageChange = (lang) => {
        const nextLang = lang ?? "en";
        // i18next.changeLanguage(nextLang);
        dispatch(changeLanguage(nextLang));
    };
    const toggleTheme = () => {
        const newTheme = !theme;
        dispatch(setTheme(newTheme));
        // const currentPanel = panel || {};
        // dispatch(setPanel(response.data.app));
    };

    return (
        <ProLayout
            title={false}
            siderWidth={240}
            contentStyle={{ padding: 0 }}
            layout="mix"
            location={{
                pathname: location.pathname,
            }}
            avatarProps={{
                render: () => {
                    return (
                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        key: "1",
                                        label: (
                                            <>
                                                <Space direction="vertical" size={0}>
                                                    <Text >{profile?.name}</Text>
                                                    <Text>{profile?.phone}</Text>
                                                </Space>
                                            </>
                                        ),
                                    },

                                    {
                                        type: "divider",
                                    },

                                    {
                                        key: "2",
                                        icon: <UserOutlined />,
                                        label: (
                                            <span onClick={() => { navigate("/profile") }}>
                                                {t("edit.profile", { defaultValue: "Edit Profile" })}
                                            </span>
                                        ),
                                    },
                                    {
                                        key: "3",
                                        icon: <LaptopOutlined />,
                                        label: (
                                            <span onClick={() => { navigate("/sessions") }}>
                                                {t("session", { defaultValue: "Session" })}
                                            </span>
                                        ),
                                    },
                                    {
                                        key: "4",
                                        icon: <LogoutOutlined />,
                                        label: (
                                            <span onClick={() => {
                                                dispatch(logout());
                                                navigate("/");
                                            }}>
                                                {t("logout", { defaultValue: "Logout" })}
                                            </span>
                                        ),
                                    },
                                ],
                            }}
                            placement="bottom"
                            arrow={{
                                pointAtCenter: true,
                            }}
                        >
                            <Avatar
                                gap="middle"
                                src={profile?.profile ? getMediaPath(profile.profile) : undefined}
                                icon={!profile?.profile ? <UserOutlined /> : undefined}
                                style={{
                                    cursor: "pointer",
                                    height: 39,
                                    width: 39,
                                }}
                            />
                        </Dropdown>
                    );
                },
            }}
            breadcrumbRender={(routers = []) => routers}
            headerContentRender={() => <BreadcrumbCustom />}
            route={menuRoutes}
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            collapsedWidth={64}
            token={{
                sider: theme
                    ? {
                        // DARK MODE
                        colorMenuBackground: "#152A3C",
                        colorTextMenu: "rgba(255, 255, 255, 0.68)",
                        colorTextMenuSecondary: "rgba(255, 255, 255, 0.48)",
                        colorTextMenuSelected: "#FFFFFF",
                        colorTextMenuActive: "#FFFFFF",
                        colorTextMenuTitle: "#FFFFFF",
                        colorTextSubMenuSelected: "#FFFFFF",
                        colorBgMenuItemSelected: "rgba(32,166,206,0.22)",
                        colorBgMenuItemHover: "rgba(32,166,206,0.12)",
                        colorMenuItemDivider: "rgba(233,242,247,0.12)",
                    }
                    : {
                        // LIGHT MODE
                        colorMenuBackground: "#152A3C",
                        colorTextMenu: "#D0D5DD",
                        colorTextMenuSecondary: "#98A2B3",
                        colorTextMenuSelected: "#FFFFFF",
                        colorTextMenuActive: "#FFFFFF",
                        colorTextMenuTitle: "#FFFFFF",
                        colorTextSubMenuSelected: "#FFFFFF",
                        colorBgMenuItemSelected: "rgba(32,166,206,0.22)",
                        colorBgMenuItemHover: "rgba(32,166,206,0.12)",
                        colorMenuItemDivider: "rgba(233,242,247,0.12)",
                    },

                header: {
                    heightLayoutHeader: 64,
                },
            }}
            logo={
                <span
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        flexShrink: 0,
                    }}
                >
                    <img
                        src={
                            <></>
                            // collapsed
                            //     ? theme
                            //         ? logoIconDark
                            //         : logoIconLight
                            //     : theme
                            //         ? logoFullDark
                            //         : logoFullLight
                        }
                        alt="ESENDER"
                        style={{
                            height: "100%",
                            width: "auto",
                            maxWidth: "100%",
                            objectFit: "contain",
                            flexShrink: 0,
                        }}
                    />
                </span>
            }

            actionsRender={(props) => {
                if (props?.isMobile)
                    return [
                        theme ? (
                            <MoonOutlined
                                key="MoonOutlined"
                                onClick={toggleTheme}
                            />
                        ) : (
                            <SunOutlined
                                key="SunOutlined"
                                onClick={toggleTheme}
                            />
                        ),
                        <>
                            {panel?.currencies?.length > 0 ? (
                                <Select
                                    showSearch
                                    placeholder={t("selectCurrencies")}
                                    onChange={(value) => {
                                        dispatch(changeCurrency(value));
                                    }}
                                    value={currency}
                                    style={{ width: 100, padding: "3px" }}
                                >
                                    {panel?.currencies?.map((currencyItem) => (
                                        <Select.Option
                                            key={
                                                typeof currencyItem === "object"
                                                    ? currencyItem?.code
                                                    : currencyItem
                                            }
                                            value={
                                                typeof currencyItem === "object"
                                                    ? currencyItem?.code
                                                    : currencyItem
                                            }
                                        >
                                            <Space>
                                                {typeof currencyItem === "object"
                                                    ? currencyItem?.code
                                                    : currencyItem}
                                            </Space>
                                        </Select.Option>
                                    ))}
                                </Select>
                            ) : (
                                <Select
                                    showSearch
                                    placeholder={t("selectCurrencies")}
                                    defaultValue={
                                        typeof panel?.defaultCurrency === "object"
                                            ? panel?.defaultCurrency
                                            : panel?.defaultCurrency
                                    }
                                    onChange={(value) => {
                                        dispatch(changeCurrency(value));
                                    }}
                                    value={
                                        typeof panel?.defaultCurrency === "object"
                                            ? panel?.defaultCurrency
                                            : panel?.defaultCurrency
                                    }
                                    style={{ width: 80, padding: "3px" }}
                                >
                                    <Select.Option
                                        value={
                                            typeof panel?.defaultCurrency === "object"
                                                ? panel?.defaultCurrency
                                                : panel?.defaultCurrency
                                        }
                                    >
                                        <Space>
                                            {typeof panel?.defaultCurrency === "object"
                                                ? panel?.defaultCurrency
                                                : panel?.defaultCurrency}
                                        </Space>
                                    </Select.Option>
                                </Select>
                            )}
                        </>,

                        <Select
                            value={language ?? "en"}
                            showSearch
                            style={{
                                height: 45,
                                width: 150,
                            }}
                            onChange={handleLanguageChange}
                            options={lang?.map((x) => ({
                                value: x.key,
                                label: x.name,
                            }))}
                            filterOption={(input, option) => {
                                return option.label
                                    .toLowerCase()
                                    .includes(input.toLowerCase());
                            }}
                        />
                    ];
                if (typeof window === "undefined") return [];
                return [
                    theme ? (
                        <MoonOutlined
                            key="MoonOutlined"
                            onClick={toggleTheme}
                        />
                    ) : (
                        <SunOutlined
                            key="SunOutlined"
                            onClick={toggleTheme}
                        />
                    ),
                    <>
                        {panel?.currencies?.length > 0 ? (
                            <Select
                                showSearch
                                placeholder={t("selectCurrencies")}
                                onChange={(value) => {
                                    dispatch(changeCurrency(value));
                                }}
                                value={currency}
                                style={{ width: 100, padding: "3px" }}
                            >
                                {panel?.currencies?.map((currencyItem) => (
                                    <Select.Option
                                        key={
                                            typeof currencyItem === "object"
                                                ? currencyItem?.code
                                                : currencyItem
                                        }
                                        value={
                                            typeof currencyItem === "object"
                                                ? currencyItem?.code
                                                : currencyItem
                                        }
                                    >
                                        <Space>
                                            {typeof currencyItem === "object"
                                                ? currencyItem?.code
                                                : currencyItem}
                                        </Space>
                                    </Select.Option>
                                ))}
                            </Select>
                        ) : (
                            <Select
                                showSearch
                                placeholder={t("selectCurrencies")}
                                defaultValue={
                                    typeof panel?.defaultCurrency === "object"
                                        ? panel?.defaultCurrency
                                        : panel?.defaultCurrency
                                }
                                onChange={(value) => {
                                    dispatch(changeCurrency(value));
                                }}
                                value={
                                    typeof panel?.defaultCurrency === "object"
                                        ? panel?.defaultCurrency
                                        : panel?.defaultCurrency
                                }
                                style={{ width: 80, padding: "3px" }}
                            >
                                <Select.Option
                                    value={
                                        typeof panel?.defaultCurrency === "object"
                                            ? panel?.defaultCurrency
                                            : panel?.defaultCurrency
                                    }
                                >
                                    <Space>
                                        {typeof panel?.defaultCurrency === "object"
                                            ? panel?.defaultCurrency
                                            : panel?.defaultCurrency}
                                    </Space>
                                </Select.Option>
                            </Select>
                        )}
                    </>,
                    <>
                        <Select
                            value={language ?? "en"}
                            showSearch
                            style={{
                                height: 35,
                                width: 150,
                            }}
                            onChange={handleLanguageChange}
                            options={lang?.map((x) => ({
                                value: x.key,
                                label: x.name,
                            }))}
                            filterOption={(input, option) => {
                                return option.label
                                    .toLowerCase()
                                    .includes(input.toLowerCase());
                            }}
                        />
                    </>,
                ];
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
                    style={{ fontSize: 15, fontWeight: 500 }}
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