import { useState } from "react";
import {
    Steps,
    ConfigProvider,
    theme as antdTheme,
    Button,
} from "antd";
import {
    MoonOutlined,
    SunOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import { setTheme } from "../Redux/Reducer/reducer.app";
import StepWorkspaceBasics from "./StepWorkspaceBasics";
import StepCreateProject from "./StepCreateProject";
import StepConnectDomain from "./StepConnectDomain";

const WIZARD_WIDTH = 900;

export default function WorkFlow() {
    const [step, setStep] = useState(0);
    const [createdProjectId, setCreatedProjectId] = useState(null);

    const theme = useSelector((state) => state?.app?.theme);
    const dispatch = useDispatch();

    const isDark = !!theme;

    const next = () => {
        setStep((current) => Math.min(current + 1, 2));
    };

    const back = () => {
        setStep((current) => Math.max(current - 1, 0));
    };

    const stepItems = [
        {
            title: "Workspace Basics",
        },
        {
            title: "Create Project",
        },
        {
            title: "Connect Domain",
        },
    ];

    return (
        <ConfigProvider
            theme={{
                algorithm: isDark
                    ? antdTheme.darkAlgorithm
                    : antdTheme.defaultAlgorithm,

                token: {
                    colorPrimary: "#20A6CE",
                    colorBgBase: isDark
                        ? "#0A101C"
                        : "#F5F7FA",
                    colorBgLayout: isDark
                        ? "#0A101C"
                        : "#F5F7FA",
                    colorBgContainer: isDark
                        ? "#152A3C"
                        : "#FFFFFF",
                },
            }}
        >
            <div
                style={{
                    minHeight: "100vh",
                    padding: "32px 24px",
                    background: isDark
                        ? "#0A101C"
                        : "#F5F7FA",
                }}
            >
                {/* Theme Toggle */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginBottom: 16,
                    }}
                >
                    <Button
                        shape="circle"
                        icon={
                            isDark ? (
                                <MoonOutlined />
                            ) : (
                                <SunOutlined />
                            )
                        }
                        onClick={() =>
                            dispatch(setTheme(!isDark))
                        }
                    />
                </div>

                <div
                    style={{
                        width: "100%",
                        maxWidth: WIZARD_WIDTH,
                        margin: "0 auto",
                    }}
                >
                    <div style={{ marginBottom: 24 }}>
                        <Steps
                            current={step}
                            items={stepItems}
                            responsive
                        />
                    </div>

                    {step === 0 && (
                        <StepWorkspaceBasics
                            onNext={next}
                        />
                    )}

                    {step === 1 && (
                        <StepCreateProject
                            onNext={(projectId) => {
                                setCreatedProjectId(projectId);
                                next();
                            }}
                            onBack={back}
                        />
                    )}

                    {step === 2 && (
                        <StepConnectDomain
                            projectId={createdProjectId}
                            onBack={back}
                            onComplete={() => {
                                window.location.href =
                                    "/overview";
                            }}
                        />
                    )}
                </div>
            </div>
        </ConfigProvider>
    );
}