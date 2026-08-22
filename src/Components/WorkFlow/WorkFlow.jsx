import { useState } from "react";
import {  Steps } from "antd";

import StepWorkspaceBasics from "./StepWorkspaceBasics";
import StepCreateProject from "./StepCreateProject";
import StepConnectDomain from "./StepConnectDomain";
import StepIntegrationSetup from "./StepIntegrationSetup";

const WIZARD_WIDTH = 900;

export default function WorkFlow() {
    const [step, setStep] = useState(0);

    const next = () => {
        setStep((current) => Math.min(current + 1, 3));
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
        {
            title: "Integration Setup",
        },
    ];

    return (
        <div
            style={{
                minHeight: "100vh",
                padding: "32px 24px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: WIZARD_WIDTH,
                    margin: "0 auto",
                }}
            >
                {/* Steps */}
                <div style={{ marginBottom: 24 }}>
                    <Steps
                        current={step}
                        items={stepItems}
                        responsive
                    />
                </div>

                {/* Current step */}
                {step === 0 && (
                    <StepWorkspaceBasics onNext={next} />
                )}

                {step === 1 && (
                    <StepCreateProject
                        onNext={next}
                        onBack={back}
                    />
                )}

                {step === 2 && (
                    <StepConnectDomain
                        onNext={next}
                        onBack={back}
                        onSkip={next}
                    />
                )}

                {step === 3 && (
                    <StepIntegrationSetup
                        onBack={back}
                        onComplete={() => {
                            alert("Setup complete!");
                        }}
                    />
                )}
            </div>
        </div>
    );
}