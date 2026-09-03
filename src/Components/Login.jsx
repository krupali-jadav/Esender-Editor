import { useEffect, useRef, useState } from "react";
import "../Components/Styles//Login.css";
import { Button, Form, Typography, Input, Checkbox, Tooltip, message, Select, } from "antd";
import { EditOutlined, ExclamationCircleOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../util/axiosInstance";
import { setUserDetails } from "./Redux/Reducer/Reducer.user";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "antd-phone-input";
import { t } from "i18next";
import { listProjects } from "./SelectProject/SelectProjectApi";
import { setPanel, setTheme } from "./Redux/Reducer/reducer.app";
import lang from "../util/lang/lang.json";

function Login() {
    const dispatch = useDispatch();
    const otpRef = useRef(null);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [isLoginPage, setIsLoginPage] = useState(true);
    const [loading, setLoading] = useState(false);
    const [checkTerms, setCheckTerms] = useState(true);
    const [tick, setTick] = useState(30);
    const [resend, setResend] = useState(false);
    const navigate = useNavigate();
    const theme = useSelector((state) => state?.app?.theme);
    const panel = useSelector((state) => state?.app?.panel);
    const language = useSelector((state) => state.app.language);


    const otpValid = otp.length === 6;
    const canSendOtp = checkTerms && phone.trim() !== "";
    const countdown = tick > 0 ? `00:${String(tick).padStart(2, "0")}` : "";

    useEffect(() => {
        if (!isLoginPage && otpRef.current) otpRef.current.focus();
    }, [isLoginPage]);

    useEffect(() => {
        if (isLoginPage) return;
        if (tick <= 0) {
            if (!resend) setResend(true);
            return;
        }
        const timer = setTimeout(() => setTick((value) => value - 1), 1000);
        return () => clearTimeout(timer);
    }, [isLoginPage, tick, resend]);
    const toggleTheme = () => {
        const newTheme = !theme;
        dispatch(setTheme(newTheme));
        const currentPanel = panel || {};
        dispatch(
            setPanel({
                ...currentPanel,
                esender: {
                    ...currentPanel.esender,
                    theme: {
                        algorithm: newTheme ? "dark" : "light",
                        token: {
                            colorPrimary: "#1890ff",
                            borderRadius: 16,
                        },
                    },
                },
            }),
        );
    };

    const handlePhoneChange = (value) => {
        if (value && value.valid && value.valid()) {
            const fullPhoneNumber = `+${value?.countryCode ?? ""}${value?.areaCode ?? ""
                }${value?.phoneNumber ?? ""}`;
            setPhone(fullPhoneNumber);
        } else {
            setPhone("");
        }
    };
    const onSendOtp = async () => {
        try {
            setLoading(true);
            setTick(30);
            setResend(false);
            setOtp("");

            const { data } = await axiosInstance.post("auth/send-otp", {
                auth_type: "phone",
                phone: phone,
            });

            if (data.status) {
                setIsLoginPage(false);
                message.success(data.message);
                dispatch(setUserDetails(data));
            } else {
                message.error(data.message);
            }
        } catch (error) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    const onOtpVerify = async () => {
        try {
            setLoading(true);

            const { data } = await axiosInstance.post(
                "auth/verify-otp",
                {
                    auth_type: "phone",
                    phone: phone,
                    otp: otp,
                }
            );

            if (data.status) {
                message.success(data.message || "Login Successfully");

                dispatch(setUserDetails(data));

                // Get user's projects after successful login
                const projectResponse = await listProjects();

                const projectList =
                    projectResponse?.projects || [];

                if (
                    Array.isArray(projectList) &&
                    projectList.length > 0
                ) {
                    // User already has project(s)
                    navigate("/select-project");
                } else {
                    // User doesn't have any project
                    navigate("/workflow");
                }
            } else {
                message.error(data.message);
            }
        } catch (error) {
            console.error(error);
            {"substravion,"}
            message.error(error?.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="auth-page">
            {/* TOP RIGHT CONTROLS */}
            <div className="auth-top-controls">
                <span className="auth-theme-btn" onClick={toggleTheme} role="button" aria-label="Toggle theme">
                    {theme ? <MoonOutlined /> : <SunOutlined />}
                </span>

                <Select
                    value={language ?? "en"}
                    listHeight={220}
                    showSearch
                    variant="filled"
                    className="auth-language"
                    classNames={{popup: {root: "auth-language-dropdown"}}}
                    popupMatchSelectWidth={180}
                    options={lang?.map((x) => ({
                        value: x.key,
                        label: x.name,
                    }))}
                    filterOption={(input, option) =>
                        option.label
                            .toLowerCase()
                            .includes(input.toLowerCase())
                    }
                />
            </div>

            {/* CENTERED AUTH CARD */}
            <div className="auth-card">

                {/* ================= LEFT FORM ================= */}
                <div className="auth-form-section">

                    {isLoginPage ? (
                        <div className="auth-form-content">

                            <div className="auth-brand">
                                <div className="auth-brand-icon">
                                    <span>∞</span>
                                </div>

                                <span>{t("eSender", { defaultValue: "eSender" })}</span>
                            </div>

                            <div className="auth-heading">
                                <Typography.Title>
                                    {t("welcome.back", { defaultValue: "Welcome back" })}
                                </Typography.Title>

                                <Typography.Text>
                                    {t("enter.phone.number", { defaultValue: "Enter your phone number to continue" })}
                                </Typography.Text>
                            </div>

                            <Form
                                layout="vertical"
                                onFinish={onSendOtp}
                                className="auth-form"
                            >
                                <Form.Item
                                    name="phone"
                                    label={t("phone.number", {
                                        defaultValue: "Phone Number",
                                    })}
                                    className="auth-form-item"
                                >
                                    <PhoneInput
                                        enableSearch
                                        country="in"
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        placeholder={t("phone.number", { defaultValue: "Enter Phone Number", })}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                onSendOtp();
                                            }
                                        }}
                                    />
                                </Form.Item>

                                <div className="auth-options">
                                    <Checkbox
                                        checked={checkTerms}
                                        onChange={(e) =>
                                            setCheckTerms(e.target.checked)
                                        }>
                                        {t("keep.me.signed.in", { defaultValue: "Keep me signed in" })}
                                    </Checkbox>

                                    <Tooltip title={t("this.will.keep.you.signed.in", { defaultValue: "This will keep you signed in until you manually sign out" })}>
                                        <ExclamationCircleOutlined />
                                    </Tooltip>
                                </div>

                                <div className="auth-terms">
                                    {t("by.continuing", { defaultValue: "By continuing, you agree to our" })}{" "}
                                    <Link
                                        to="/privacy-policy"
                                        target="_blank"
                                    >
                                        {t("privacy.policy", { defaultValue: "Privacy Policy" })}
                                    </Link>{" "}
                                    &{" "}
                                    <Link
                                        to="/terms-and-conditions"
                                        target="_blank"
                                    >
                                        {t("terms.and.conditions", { defaultValue: "Terms and Conditions" })}
                                    </Link>
                                </div>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    disabled={!canSendOtp}
                                    className="auth-primary-btn"
                                >
                                    {t("send.otp", { defaultValue: "Send OTP" })}
                                    <span>→</span>
                                </Button>
                            </Form>
                        </div>
                    ) : (
                        <div className="auth-form-content">

                            <div className="auth-brand">
                                <div className="auth-brand-icon">
                                    <span>∞</span>
                                </div>

                                <span>{t("auth.brand", { defaultValue: "eSender" })}</span>
                            </div>

                            <div className="auth-heading">
                                <Typography.Title>
                                    {t("verify.number", { defaultValue: "Verify your number" })}
                                </Typography.Title>

                                <Typography.Text>
                                    {t("weve.sent.a.verification.code.to", { defaultValue: "We've sent a verification code to" })}
                                </Typography.Text>

                                <div className="auth-phone">
                                    <strong>{phone}</strong>

                                    <Button
                                        type="link"
                                        icon={<EditOutlined />}
                                        onClick={() => setIsLoginPage(true)}
                                    />
                                </div>
                            </div>

                            <Form
                                layout="vertical"
                                onFinish={onOtpVerify}
                                className="auth-form"
                            >
                                <Form.Item
                                    label={t("enter.verification.code", { defaultValue: "Enter verification code" })}
                                    name="otp"
                                    className="auth-form-item otp-item"
                                >
                                    <Input.OTP
                                        ref={otpRef}
                                        length={6}
                                        value={otp}
                                        onChange={(value) =>
                                            setOtp(value)
                                        }
                                        format={(value) =>
                                            value.replace(/\D/g, "")
                                        }
                                        size="large"
                                    />
                                </Form.Item>

                                <div className="otp-bottom">
                                    <Typography.Text>
                                        {countdown || "00:00"}
                                    </Typography.Text>
                                </div>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    disabled={!otpValid}
                                    className="auth-primary-btn"
                                >
                                    {t("verify.continue", { defaultValue: "Verify & Continue" })}
                                    <span>→</span>
                                </Button>

                                <div className="resend-wrapper">
                                    <Typography.Text>
                                        {t("didnt.receive.code", { defaultValue: "Didn't receive the code?" })}
                                    </Typography.Text>

                                    {resend ? (
                                        <Button
                                            type="link"
                                            onClick={onSendOtp}
                                        >
                                            {t("resend.otp", { defaultValue: "Resend OTP" })}
                                        </Button>
                                    ) : (
                                        <Typography.Text type="secondary">
                                            {t("resend.otp", { defaultValue: "Resend OTP" })}
                                        </Typography.Text>
                                    )}
                                </div>
                            </Form>
                        </div>
                    )}
                </div>

                {/* ================= RIGHT CREATIVE SECTION ================= */}
                <div className="auth-visual-section">

                    <div className="visual-glow visual-glow-one" />
                    <div className="visual-glow visual-glow-two" />
                    <div className="visual-glow visual-glow-three" />

                    <div className="visual-shape shape-one" />
                    <div className="visual-shape shape-two" />
                    <div className="visual-shape shape-three" />

                    <div className="visual-content">

                        <div className="visual-logo">
                            ∞
                        </div>

                        <h2>
                            {t("connect", { defaultValue: "Connect." })}
                            <br />
                            {t("create", { defaultValue: "Create." })}
                            <br />
                            {t("grow", { defaultValue: "Grow." })}
                        </h2>

                        <p>
                            {t("powerful.email.communication", { defaultValue: "Powerful email communication" })}<br />{t("made.beautifully.simple", { defaultValue: "Made beautifully simple." })}
                        </p>
                    </div>

                    {/* FLOATING EMAIL CARD */}
                    <div className="floating-card campaign-card">
                        <div className="floating-icon"> ✉ </div>

                        <div>
                            <strong>{t("template.sent", { defaultValue: "Template sent" })}</strong>
                            <span>{t("successfully.delivered", { defaultValue: "Successfully delivered" })}</span>
                        </div>

                        <div className="success-icon">
                            ✓
                        </div>
                    </div>

                    {/* FLOATING ANALYTICS CARD */}
                    <div className="floating-card analytics-card">
                        <span className="analytics-label">
                            {t("campaign.performance", { defaultValue: "Campaign performance" })}
                        </span>

                        <div className="analytics-row">
                            <div>
                                <strong>68.4%</strong>
                                <span>{t("open.rate", { defaultValue: "Open rate" })}</span>
                            </div>

                            <div>
                                <strong>32.8%</strong>
                                <span>{t("click.rate", { defaultValue: "Click rate" })}</span>
                            </div>
                        </div>

                        <div className="analytics-chart">
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>

                    {/* DECORATIVE DOTS */}
                    <span className="visual-dot dot-one" />
                    <span className="visual-dot dot-two" />
                    <span className="visual-dot dot-three" />
                    <span className="visual-dot dot-four" />

                </div>
            </div>
        </div>
    );
}
export default Login;