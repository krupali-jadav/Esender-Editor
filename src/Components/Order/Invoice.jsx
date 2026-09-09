import { useEffect, useState, useCallback, } from "react";
import { Typography, Row, Col, Divider, Button, message, Image, Flex, Card, } from "antd";
import { ArrowLeftOutlined, CloudDownloadOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined, } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { CURRENCIES_SYMBOL, formatDate } from "../../util/commom.utils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { changePageTitle } from "../Redux/Reducer/reducer.app";
import { Space } from "antd/lib";
import { getInvoices } from "./OrderApi";
import AppPageHeader from "../Styles/AppHeader";
import { PageContainer } from "@ant-design/pro-components";
import StatusBadge from "../Styles/StatusBadge";
import { t } from "i18next";
const { Title, Text, Paragraph } = Typography;
// import esenderLogo from "../../assets/image.png";

const Invoice = ({ isEdit = false }) => {
  const { order_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state?.app?.theme);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const panel = useSelector((state) => state?.app?.panel);

  const fetchInvoice = useCallback(async () => {
    if (!order_id) return;

    try {
      setLoading(true);

      const response = await getInvoices(0, 20);

      if (response) {
        const invoices = response?.data || response?.invoices || [];

        const selectedInvoice = invoices.find(
          (invoice) =>
            invoice?._id === order_id ||
            invoice?.id === order_id ||
            invoice?.orderId === order_id ||
            invoice?.orderNumber === order_id
        );

        if (selectedInvoice) {
          setOrder(selectedInvoice);
          setPayment(selectedInvoice?.payment || null);
        } else {
          message.error(invoices?.message);
        }
      }
    } catch (error) {
      console.log(error);
      message.error(error?.message);
    } finally {
      setLoading(false);
    }
  }, [order_id, t]);

  useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  const columns = [
    {
      title: t("sn", { defaultValue: "S/N", }),
      dataIndex: "SN",
      key: "SN",
      fixed: "left",
      render: (_, __, index) => index + 1,
    },
    {
      title: t("name", { defaultValue: "Name", }),
      dataIndex: "description",
      key: "description",
      render: (_, record) => record.description
    },
    {
      title: t("price", { defaultValue: "Price", }),
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (_, record) => (
        <>
          {CURRENCIES_SYMBOL[order?.currency]}
          {Number(record?.unitPrice || 0).toFixed(2)}
        </>
      ),
    },
    {
      title: t("quantity", { defaultValue: "Quantity", }),
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) => record?.quantity || 0,
    },
    {
      title: t("total", { defaultValue: "Total", }),
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (_, record) => (
        <>
          {CURRENCIES_SYMBOL[order?.currency] || "₹"}
          {Number(record?.amount || 0).toFixed(2)}
        </>
      )
    },
  ];

  useEffect(() => {
    dispatch(changePageTitle("Order Invoice"));
  }, [dispatch]);

  const handleDownloadInvoice = useCallback(() => {
    if (!order_id) return false;
    const elementToBeCaptured = document.getElementById("master_order_invoice");
    if (!elementToBeCaptured) {
      message.error(t("failed.download.invoice", { defaultValue: "Failed to download invoice!" }));
      return;
    }
    const a4Width = 595.28;
    const a4Height = 841.89;
    const loadingMessage = message.loading("Generating PDF...", 0);
    const dpi = 300 / 72;
    const contentHeight = Math.ceil(
      elementToBeCaptured.getBoundingClientRect().height,
    );
    const contentWidth = Math.ceil(
      elementToBeCaptured.getBoundingClientRect().width,
    );
    const scaleWidth = (a4Width * dpi) / contentWidth;
    const scaleHeight = (a4Height * dpi) / contentHeight;
    const scale = Math.min(scaleWidth, scaleHeight) * 0.95;
    const options = {
      scale: scale,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: "#FFFFFF",
      width: contentWidth,
      height: contentHeight,
      windowWidth: contentWidth,
      windowHeight: contentHeight,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById("master_order_invoice");
        if (clonedElement) {
          clonedElement.style.transform = "none";
          clonedElement.style.transformOrigin = "top left";
          clonedElement.style.width = `${contentWidth}px`;
          clonedElement.style.height = `${contentHeight}px`;

          clonedElement.style.fontDisplay = "swap";
          clonedElement.style.webkitFontSmoothing = "antialiased";
          clonedElement.style.mozOsxFontSmoothing = "grayscale";
          clonedElement.style.textRendering = "optimizeLegibility";

          const images = clonedElement.getElementsByTagName("img");
          Array.from(images).forEach((img) => {
            img.style.imageRendering = "high-quality";
          });
        }
      },
    };
    html2canvas(elementToBeCaptured, options)
      .then((canvas) => {
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: "a4",
          compress: true,
          precision: 16,
        });

        const scaledWidth = contentWidth * (scale / dpi);
        const scaledHeight = contentHeight * (scale / dpi);
        const xPosition = Math.max(0, (a4Width - scaledWidth) / 2);
        const yPosition = Math.max(0, (a4Height - scaledHeight) / 2);

        pdf.addImage(
          canvas.toDataURL("image/jpeg", 1.0),
          "JPEG",
          xPosition,
          yPosition,
          scaledWidth,
          scaledHeight,
          undefined,
          "FAST",
          0,
        );

        const blob = pdf.output("blob");
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `Invoice_${order_id}.pdf`;

        link.onload = () => {
          loadingMessage();
          loadingMessage();
          message.success(t("pdf.generated.successfully", { defaultValue: "PDF generated successfully!" }));
          URL.revokeObjectURL(url);
          URL.revokeObjectURL(url);
        };

        link.onerror = () => {
          loadingMessage();
          message.error(t("failed.download.pdf", { defaultValue: "Failed to download PDF" }));
          URL.revokeObjectURL(url);
        };

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          loadingMessage();
          message.success(t("pdf.generated.successfully", { defaultValue: "PDF generated successfully!" }));
          URL.revokeObjectURL(url);
        }, 100);
      })
      .catch((error) => {
        loadingMessage();
        message.error(error?.message);
      });
  }, [order_id]);

  return (
    <PageContainer title={false} breadcrumb={false}>
      <AppPageHeader
        eyebrow="Orders"
        title={t("invoice", { defaultValue: "Invoice" })}
        secondaryActions={
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/orders")}>
            {t("back.to.orders", { defaultValue: "Back to Orders" })}
          </Button>
        }
        primaryAction={
          <Button type="primary" icon={<CloudDownloadOutlined />} onClick={handleDownloadInvoice}>
            {t("download", { defaultValue: "Download" })}
          </Button>
        }
      />

      <Col justify="center" align="middle">
        <Card id="master_order_invoice" style={{ maxWidth: 750, borderRadius: 16, boxShadow: "var(--ds-shadow-md)" }}>

          {/* header */}
          <Row justify="space-between" align="middle">
            <Col>
              <Title align="left" level={3} >
                {t("invoice", { defaultValue: "INVOICE" })}
              </Title>

              <Flex vertical align="start" >
                <Text type="secondary">
                  {t("issued", { defaultValue: "Issued" })}:{" "}:
                  {order?.issuedAt ? formatDate(order.issuedAt) : "N/A"}
                </Text>

                <Text type="secondary">
                  {t("orderid", { defaultValue: "Order ID" })}:{" "}
                  <Text copyable={{ text: order?.orderNumber || "", }} >
                    {order?.orderNumber || "N/A"}
                  </Text>
                </Text>

                <Text type="secondary">
                  {t("date", { defaultValue: "Date" })}{" "}:{order?.renewalDate ? formatDate(order.renewalDate) : "N/A"}
                </Text>

                <Text type="secondary">
                  {t("order.status", { defaultValue: "Order Status", })}{" "} : {t(order?.status) || "N/A"}
                </Text>
              </Flex>
            </Col>

            <Col>
              <Image
                preview={false}
                width={150}
              // src={esenderLogo}
              />
            </Col>
          </Row>

          <Divider />

          {/* TOP INFO */}
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Row style={{ border: "1px solid #ececec" }} >
              <Col align="left" span={12} style={{ padding: "20px", }} >

                <Title level={5}>
                  {t("invoiceto", { defaultValue: "Invoice To", })}{" "}  :
                </Title>

                <Flex vertical>
                  <Text strong>{panel?.billing?.businessName || "Company"}</Text>
                  <Text>
                    <EnvironmentOutlined /> {panel?.billing?.address || "Office"}
                  </Text>
                  <Text>
                    <PhoneOutlined /> {panel?.billing?.phone || "Phone"}
                  </Text>
                  <Text>
                    <MailOutlined /> {panel?.billing?.email || "Email"}
                  </Text>
                </Flex>
              </Col>

              <Col align="left" span={12} style={{ padding: "20px", borderLeft: "1px solid #ececec", }} >
                <Title level={5}>
                  {t("payto", { defaultValue: "Pay To", })}{" "} :
                </Title>

                <Flex vertical>
                  <Text strong>{order?.customer?.businessName || "Username"}</Text>
                  <Text>
                    <EnvironmentOutlined /> {order?.customer.address || "Phone"}
                  </Text>
                  <Text>
                    <PhoneOutlined /> {order?.customer.phone || "Phone"}
                  </Text>
                  <Text>
                    <MailOutlined /> {order?.customer.email || "Email"}
                  </Text>
                </Flex>
              </Col>
            </Row>

            <Row style={{ background: theme ? "#686767" : "#d8d8d8", padding: "12px 15px", fontWeight: 600, borderBottom: "1px solid #ececec" }}>
              {columns.map((col, index) => {
                const spans = [1, 7, 6, 7, 3];
                return (
                  <Col key={col.key || index} span={spans[index]}>
                    {col.title}
                  </Col>
                );
              })}
            </Row>

            {(order?.lineItems || []).map((item, index) => (
              <Row key={index} align="middle" style={{ padding: "5px", borderBottom: "1px solid #f3f3f3", }}>
                <Col span={2}>
                  {index + 1}
                </Col>

                <Col span={6}>
                  {item.description}
                </Col>

                <Col span={6}>
                  {CURRENCIES_SYMBOL[order.currency]}
                  {item.unitPrice}
                </Col>

                <Col span={6}>
                  {item.quantity}
                </Col>

                <Col span={3} style={{ textAlign: "right" }}>
                  {CURRENCIES_SYMBOL[order.currency]}
                  {item.amount}
                </Col>
              </Row>
            ))}
          </Space>

          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* TOTALS */}
            <Row justify="end" style={{ marginTop: 30 }}>
              <Col span={8} align="left">

                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                  <Row>
                    <Col span={12}>{t("subtotal", { defaultValue: "Subtotal" })}</Col>
                    <Col span={12} align="right">
                      {CURRENCIES_SYMBOL[order?.currency] || "$0"}
                      {order?.subtotal}
                    </Col>
                  </Row>

                  <Row >
                    <Col span={12}>{t("handling.fee", { defaultValue: "Handling Fee" })}</Col>
                    <Col span={12} align="right">
                      {CURRENCIES_SYMBOL[order?.currency] || "$0"}
                      {order?.gatewayChargeAmount}
                    </Col>
                  </Row>
                </Space>

                <Divider style={{ borderTop: "1px solid #d9d9d9", marginBottom: 10, marginTop: 10 }} />

                <Row>
                  <Col span={12}> <Text strong>{t("grand.total", { defaultValue: "Grand Total" })}</Text> </Col>
                  <Col span={12} align="right">
                    <Text strong>
                      {CURRENCIES_SYMBOL[order?.currency] || "$0"}
                      {order?.payableAmount}
                    </Text>                                                                                                                                                    
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* Payment info */}
            <Row>
              <Col span={12} align="left" >
                <Title level={5} > {t("paymentinfo", { defaultValue: "Payment Info", })} </Title>

                <Text>
                  {t("paymentid", { defaultValue: "Payment ID", })}:{" "}
                  <Text copyable={{ text: payment?.paymentId?._id || "" }} >
                    {payment?.id || "N/A"}
                  </Text>
                </Text>

                <br />
                <Row align="middle" gutter={8}>
                  <Col>
                    <Text> {t("payment.gateway", { defaultValue: "Payment Gateway", })}{" "}  : </Text>
                  </Col>
                  <Col>
                    {/* {payment?.gateway ? (
                      <Image
                        src={getMediaPath( `/media/payment-gateway/${payment?.paymentId?.gateway}.png`, )}
                        preview={false}
                        alt={payment?.paymentId?.gateway}
                        width={60}
                      />
                    ) : (
                      <Text>N/A</Text>
                    )} */}
                    {payment?.gateway}
                  </Col>
                </Row>

                <Text>
                  {t("status", { defaultValue: "Status", })}{" "} :{" "}
                  {payment?.status === "captured" ? (
                    <StatusBadge status="completed" label={t("paid", { defaultValue: "Paid" })} />
                  ) : (
                    <StatusBadge status="failed" label={t("unpaid", { defaultValue: "Unpaid" })} />
                  )}
                </Text>
              </Col>
            </Row>
          </Space>
          <Divider />

          <Row justify="space-between" >
            <Col align="left">
              <Space direction="vertical">{" "}
                <Image
                  preview={false}
                  // src={esenderLogo}
                  width={100}
                  alt="INVOICE LTD"
                  loading="lazy"
                />

                <Paragraph >
                  {t("invoice.footer", {
                    companyName: panel?.billing?.businessName,
                    defaultValue: "Thank You For Your Interest In {{companyName}} Products. Your Order Has Been Received And Will Be Processed Once Payment Has Been Confirmed.",
                  })}
                </Paragraph>
              </Space>
            </Col>
          </Row>
        </Card>
      </Col>
    </PageContainer>
  );
};
export default Invoice;