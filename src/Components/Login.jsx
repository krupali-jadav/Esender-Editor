import React, { useEffect, useRef, useState } from "react";
import {
    Button, Col, Form, Row, Space, Typography, Input, Checkbox, Divider, Card, Layout, Flex,
    Tooltip,
} from "antd";
import { EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";


const { Text } = Typography;
const { Content } = Layout;

function Login() {
    const otpRef = useRef(null);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [isLoginPage, setIsLoginPage] = useState(true);
    const [loading, setLoading] = useState(false);
    const [checkTerms, setCheckTerms] = useState(true);
    const [tick, setTick] = useState(30);
    const [resend, setResend] = useState(false);
    const navigate = useNavigate();

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

    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
    };

    const onSendOtp = () => {
        setLoading(true);
        setTick(30);
        setResend(false);
        setOtp("");

        // Static OTP flow - no API call.
        setTimeout(() => {
            setIsLoginPage(false);
            setLoading(false);
        }, 500);
    };

    const onOtpVerify = () => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            navigate("/overview");
        }, 500);
    };

    return (
        <React.Fragment>
            <Layout>
                <Content>
                    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
                        {isLoginPage ? (
                            <Col xs={18} sm={15} md={10} lg={8} xl={7} xxl={5}>
                                <Card>
                                    <Flex justify="center" style={{ marginBottom: 24 }}>
                                        <Typography.Title level={3} style={{ margin: 0 }}>
                                            Login
                                        </Typography.Title>
                                    </Flex>
                                    <Form layout="vertical" onFinish={onSendOtp}>
                                        <Form.Item
                                            name="phone"
                                            label={"Phone Number"}
                                            initialValue={phone}
                                        >
                                            <Input
                                                value={phone}
                                                onChange={handlePhoneChange}
                                                placeholder="Enter Phone Number"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        onSendOtp();
                                                    }
                                                }}
                                            />
                                        </Form.Item>

                                        <Form.Item>
                                            <Space direction="vertical">
                                                <Space>
                                                    <Checkbox
                                                        checked={checkTerms}
                                                        onChange={(e) =>
                                                            setCheckTerms(e.target.checked)
                                                        }
                                                    >
                                                        {"Keep me signed in"}
                                                    </Checkbox>

                                                    <Tooltip
                                                        title={"This will keep you signed in until you manually sign out"}   >
                                                        <ExclamationCircleOutlined />
                                                    </Tooltip>
                                                </Space>

                                                <Divider />

                                                <Text type="secondary">
                                                    {"By continuing, you agree to our"} {" "}
                                                    <Link
                                                        to="/privacy-policy"
                                                        target="_blank"
                                                    >
                                                        {"Privacy Policy"}
                                                    </Link>{" "}
                                                    &{" "}
                                                    <Link
                                                        to="/terms-and-conditions"
                                                        target="_blank"
                                                    >
                                                        {"Terms and Conditions"}
                                                    </Link>
                                                </Text>
                                            </Space>
                                        </Form.Item>

                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                loading={loading}
                                                disabled={!canSendOtp}
                                                block
                                            >
                                                {"Send OTP"}
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Card>
                            </Col>
                        ) : (
                            <Col xs={18} sm={15} md={10} lg={8} xl={7} xxl={5}>
                                <Card justify="center" align="middle">
                                    <Flex justify="center" style={{ marginBottom: 24 }}>
                                        <Typography.Title level={3} style={{ margin: 0 }}>
                                            Login
                                        </Typography.Title>
                                    </Flex>
                                    <Form layout="vertical" onFinish={onOtpVerify}>
                                        <Space direction="vertical" size="small">
                                            <Text type="secondary">
                                                {"We've sent a verification code to"} {" "}
                                                <b>{phone}</b>

                                                <Button
                                                    type="link"
                                                    icon={<EditOutlined />}
                                                    onClick={() => setIsLoginPage(true)}
                                                />
                                            </Text>

                                            <Form.Item label={"Enter OTP"} name="otp">
                                                <Input.OTP
                                                    ref={otpRef}
                                                    length={6}
                                                    value={otp}
                                                    onChange={(value) => setOtp(value)}
                                                    format={(value) => value.replace(/\D/g, "")}
                                                    size="large"

                                                />
                                            </Form.Item>

                                            <Row justify="end">
                                                <Text type="secondary">
                                                    {countdown}
                                                </Text>
                                            </Row>

                                            <Form.Item>
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    loading={loading}
                                                    disabled={!otpValid}
                                                    block
                                                >
                                                    Submit
                                                </Button>
                                            </Form.Item>

                                            <Space>
                                                <Text>{"Didn't get the OTP?"}</Text>
                                                {resend ? (
                                                    <Button
                                                        type="link"
                                                        onClick={onSendOtp}
                                                    >
                                                        {"Resend"}
                                                    </Button>
                                                ) : (
                                                    <Text type="secondary">
                                                        {"Resend"}
                                                    </Text>
                                                )}
                                            </Space>
                                        </Space>
                                    </Form>
                                </Card>
                            </Col>
                        )}
                    </Row>
                </Content>
            </Layout>
        </React.Fragment>
    );
}
export default Login;