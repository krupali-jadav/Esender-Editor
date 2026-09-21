import { SunOutlined, MoonOutlined, SafetyOutlined, } from "@ant-design/icons";
import { PageContainer, ProConfigProvider, ProLayout, } from "@ant-design/pro-components";
import { ConfigProvider, Select, Tooltip, } from "antd";
import React, { useEffect, useMemo, useRef, useState, } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { changeLanguage, setTheme } from "../../Components/Redux/Reducer/reducer.app";
import lang from "../../util/lang/lang.json";
import Link from "antd/es/typography/Link";
import i18next from "i18next";
import { formatDate } from "../../util/commom.utils";
import logoFullDark from "../../assets/logo-full-dark.png";
import logoFullLight from "../../assets/logo-full-light.png";
import logoIconDark from "../../assets/logo-icon-dark.png";
import logoIconLight from "../../assets/logo-icon-light.png";

const PolicyProLayout = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const panel = useSelector((state) => state?.app?.panel);
    const theme = useSelector((state) => state?.app?.theme);
    const setting = useSelector((state) => state?.setting);
    const CompanyName = useMemo(() => panel?.billing?.name ?? "", [panel]);
    const language = useSelector((state) => state?.app?.lang);
    const [pathname, setPathname] = useState(location?.pathname);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(theme);
    const [collapsed, setCollapsed] = useState(false);
    const mainLayoutRef = useRef();
    const subLayoutRef = useRef();

    const handleLanguageChange = (e) => {
        i18next.changeLanguage(e ?? "en");
        dispatch(changeLanguage(e));
    };

    const menuList = [
        {
            name: t("privacy policy", { defaultValue: "Privacy Policy", }),
            key: "/privacy-policy",
            icon: <SafetyOutlined />,
        },
        {
            name: t("terms and conditions", { defaultValue: "Terms And Conditions", }),
            key: "/terms-and-conditions",
            icon: <SafetyOutlined />,
        },
        {
            name: t("refund policy", { defaultValue: "Refund Policy", }),
            key: "/refund-policy",
            icon: <SafetyOutlined />,
        },
    ];

    const handleMenuChange = (path) => {
        //find main menu from pathname
        const menu = menuList?.find(
            (m) => m.key === path || (m.children ?? []).find((s) => s.key === path),
        );
        if (menu) {
            setSelectedMenu(menu);
        } else {
            setSelectedMenu(null);
        }
    };

    useEffect(() => {
        handleMenuChange(pathname);
    }, [pathname]);

    useEffect(() => {
        setPathname(location.pathname);
    }, [location.pathname]);

    useEffect(() => {
        if (setting) {
            if (mainLayoutRef) {
                mainLayoutRef.current?.reload();
            }
        }
    }, [setting]);

    useEffect(() => {
        if (selectedMenu) {
            if (selectedMenu.children) {
                const subMenu = selectedMenu.children.find((s) => s.key == pathname);
                if (subMenu) {
                    navigate(subMenu.key);
                } else {
                    navigate(selectedMenu.children[0].key);
                }
            } else {
                navigate(selectedMenu.key);
            }
        }

        subLayoutRef.current?.reload();
    }, [selectedMenu]);

    //Main Menu
    const mainMenuPro = useMemo(() => {
        return menuList?.map((item) => {
            return {
                path: item.key,
                name: item.label,
            };
        });
    }, [setting]);

    if (typeof document === "undefined") {
        return <div />;
    }

    // Bread crumbs
    const BreadcrumbCustom = () => {
        const pathSegments = location.pathname.split("/").filter(Boolean);

        const items = pathSegments.map((segment, index) => {
            const pathToNavigate = `/${pathSegments.slice(0, index + 1).join("/")}`;
            const isLastSegment = index === pathSegments.length - 1;

            return {
                title: isLastSegment ? (
                    <span style={{ textTransform: "capitalize" }}>{segment}</span>
                ) : (
                    <span
                        style={{ cursor: "pointer", textTransform: "capitalize" }}
                        onClick={() => { navigate(pathToNavigate); }}
                    >
                        {segment}
                    </span>
                ),
            };
        });
    };
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        dispatch(setTheme(!isDarkMode));
    };
    return (
        <React.Fragment>
            <div
                id="test-pro-layout"
                style={{
                    height: "100vh",
                    overflow: "auto",
                }}
            >
                <ProConfigProvider hashed={false} locale="en">
                    <ConfigProvider
                        locale="en"
                        getTargetContainer={() => {
                            return (
                                document.getElementById("test-pro-layout") || document.body
                            );
                        }}
                    >
                        <ProLayout
                            actionRef={mainLayoutRef}
                            prefixCls="pro-layout-main"
                            locale="en-US"
                            fixedHeader={true}
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
                                            collapsed
                                                ? theme
                                                    ? logoIconDark
                                                    : logoIconLight
                                                : theme
                                                    ? logoFullDark
                                                    : logoFullLight
                                        }
                                        alt="E-Sender"
                                        style={{
                                            height: collapsed ? 34 : 32,
                                            width: "auto",
                                            maxWidth: collapsed ? 34 : 160,
                                            objectFit: "contain",
                                            flexShrink: 0,
                                        }}
                                    />
                                </span>
                            }
                            collapsed={collapsed}
                            onCollapse={(value) => setCollapsed(value)}
                            location={{ pathname }}
                            token={{
                                header: {
                                    colorBgMenuItemSelected: "rgba(0,0,0,0.04)",
                                },
                            }}
                            actionsRender={(props) => {
                                if (props?.isMobile)
                                    return [
                                        theme ? (
                                            <SunOutlined
                                                key="SunOutlined"
                                                onClick={toggleTheme}
                                                style={{ marginRight: 20 }}
                                            />
                                        ) : (
                                            <MoonOutlined
                                                key="MoonOutlined"
                                                onClick={toggleTheme}
                                                style={{ marginRight: 20 }}
                                            />
                                        ),
                                    ];
                                if (typeof window === "undefined") return [];
                                return [
                                    theme ? (
                                        <MoonOutlined
                                            key="MoonOutlined"
                                            onClick={toggleTheme}
                                            style={{ marginRight: 10 }}
                                        />
                                    ) : (
                                        <SunOutlined
                                            key="SunOutlined"
                                            onClick={toggleTheme}
                                            style={{ marginRight: 10 }}
                                        />
                                    ),
                                    <>
                                        <Select
                                            value={language ?? "en"}
                                            listHeight={200}
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
                                    </>,
                                ];
                            }}
                            headerTitleRender={(logo, title, _) => {
                                const defaultDom = (
                                    <Tooltip arrow={false} title={panel?.title ?? ""}>
                                        <Link to={"/"}>{logo}</Link>
                                    </Tooltip>
                                );

                                if (typeof window === "undefined") return defaultDom;
                                if (document.body.clientWidth < 1400) {
                                    return defaultDom;
                                }
                                if (_.isMobile) return defaultDom;
                                return <>{defaultDom}</>;
                            }}
                            menu={{
                                request: () => {
                                    return mainMenuPro;
                                },
                                collapsedShowGroupTitle: true,
                            }}
                            menuFooterRender={(props) => {
                                if (props?.collapsed) return undefined;
                                return (
                                    <div
                                        style={{
                                            textAlign: "center",
                                            paddingBlockStart: 12,
                                        }}
                                    >
                                        <div>
                                            © {formatDate(new Date(), "YYYY")} {t("designed.&.developed", { defaultValue: "Designed & Developed" })}
                                        </div>
                                        {t("by", { defaultValue: "by" })}{" "}
                                        <small>
                                            <strong>{CompanyName}</strong>
                                        </small>
                                    </div>
                                );
                            }}
                            fixSiderbar={false}
                            layout="top"
                            splitMenus={false}
                            siderWidth={0}
                        >
                            <div style={{ margin: "1rem 2.5rem 0rem", marginTop: " 12px" }}>
                                <BreadcrumbCustom />
                            </div>
                            <PageContainer>{children}</PageContainer>
                        </ProLayout>
                    </ConfigProvider>
                </ProConfigProvider>
            </div>
        </React.Fragment>
    );
};

export default PolicyProLayout;
