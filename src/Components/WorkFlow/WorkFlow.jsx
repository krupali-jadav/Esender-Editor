import { useState } from "react";
import {
    Steps,
    ConfigProvider,
    theme as antdTheme,
    Button,
    Layout,
} from "antd";
import {
    MoonOutlined,
    SunOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import { setSelectedProject, setTheme } from "../Redux/Reducer/reducer.app";
import StepWorkspaceBasics from "./StepWorkspaceBasics";
import StepCreateProject from "./StepCreateProject";
import StepConnectDomain from "./StepConnectDomain";
import { t } from "i18next";
import { getProject } from "./WorkFlowApi";

const { Content } = Layout;

const WIZARD_WIDTH = 900;
const PRIMARY_COLOR = "#20A6CE";

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
            title: t('workspace.basics', { defaultValue: 'Workspace Basics' }),
        },
        {
            title: t('create.project', { defaultValue: 'Create Project' }),
        },
        {
            title: t('connect.domain', { defaultValue: 'Connect Domain' }),
        },
    ];

    return (
        <ConfigProvider
            theme={{
                algorithm: isDark
                    ? antdTheme.darkAlgorithm
                    : antdTheme.defaultAlgorithm,

                token: {
                    colorPrimary: PRIMARY_COLOR,

                    // Background
                    colorBgBase: isDark
                        ? "#071923"
                        : "#F0F9FC",

                    colorBgLayout: isDark
                        ? "#071923"
                        : "#F0F9FC",

                    colorBgContainer: isDark
                        ? "#102A38"
                        : "#FFFFFF",

                    borderRadius: 12,
                },


                components: {
                    Steps: {
                        colorPrimary: PRIMARY_COLOR,
                        colorText: isDark
                            ? "#FFFFFF"
                            : "#1F2937",
                        colorTextDescription: isDark
                            ? "#8FA6B3"
                            : "#667085",
                    },

                    Button: {
                        colorPrimary: PRIMARY_COLOR,
                    },
                },
            }}
        >
            <Layout>
                <Content style={{ minHeight: "100vh", padding: "32px 24px", }}>
                    {/* Theme Toggle */}
                    <div style={{ display: "flex", justifyContent: "flex-end", }}>
                        <Button
                            shape="circle"
                            size="large"
                            icon={
                                isDark ? (
                                    <MoonOutlined />
                                ) : (
                                    <SunOutlined />
                                )
                            }
                            onClick={() => dispatch(setTheme(!isDark))}
                        />
                    </div>

                    {/* Wizard */}
                    <div
                        style={{
                            width: "100%",
                            maxWidth: WIZARD_WIDTH,
                            margin: "0 auto",
                        }}
                    >
                        {/* Steps */}
                        <div style={{ marginBottom: 32, }}>
                            <Steps
                                current={step}
                                items={stepItems}
                                responsive
                            />
                        </div>

                        {/* Step 1 */}
                        {step === 0 && (
                            <StepWorkspaceBasics onNext={next} />
                        )}

                        {/* Step 2 */}
                        {step === 1 && (
                            <StepCreateProject
                                onNext={async (project) => {
                                    const projectId = project?.id || project?._id;

                                    setCreatedProjectId(projectId);
                                    try {
                                        const response = await getProject(projectId);
                                        if (response?.status && response?.project) {
                                            // Store complete project data
                                            dispatch(setSelectedProject(response.project));
                                        } else {
                                            // Fallback to created project
                                            dispatch(setSelectedProject(project));
                                        }
                                    } catch (error) {
                                        console.error( error);
                                        dispatch(setSelectedProject(project));
                                    }

                                    next();
                                }}
                                onBack={back}
                            />
                        )}

                        {/* Step 3 */}
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
                </Content>
            </Layout>
        </ConfigProvider>
    );
}