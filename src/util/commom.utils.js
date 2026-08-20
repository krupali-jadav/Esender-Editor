import { message } from "antd";
import { t } from "i18next";
import axiosInstance from "./axiosInstance";
import axios from "axios";
import moment from "moment";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { PhoneNumberUtil } from "google-libphonenumber";
import countries from "./countryList.json";
import { getMediaPath } from "./getMediaPath";

const phoneUtil = PhoneNumberUtil.getInstance();

export const CURRENCIES_COUNTRY = {
  INR: "IN",
  USD: "US",
  BRL: "BR",
  MYR: "MY",
  AED: "AE",
  AUD: "AU",
  CAD: "CA",
  EUR: "FR",
  GBP: "GB",
  MXN: "MX",
  SGD: "SG",
  THB: "TH",
  IDR: "ID",
  ZAR: "ZA",
};

export const CURRENCIES_SYMBOL = {
  INR: "₹",
  AED: "د.إ",
  AFN: "Af",
  ALL: "L",
  AMD: "֏",
  ANG: "ƒ",
  AOA: "Kz",
  ARS: "$",
  AUD: "$",
  AWG: "Afl",
  AZN: "₼",
  BAM: "KM",
  BBD: "$",
  BDT: "৳",
  BGN: "лв",
  BHD: ".د.ب",
  BIF: "Fr",
  BMD: "$",
  BND: "$",
  BOB: "$b",
  BRL: "R$",
  BSD: "$",
  BTN: "Nu.",
  BWP: "P",
  BYN: "Br",
  BZD: "$",
  CAD: "$",
  CDF: "Fr",
  CHF: "CHF",
  CLP: "$",
  CNY: "¥",
  COP: "$",
  CRC: "₡",
  CUP: "$",
  CVE: "$",
  CZK: "Kč",
  DJF: "Fr",
  DKK: "kr",
  DOP: "$",
  DZD: "دج",
  EGP: "ج.م",
  ERN: "Nkf",
  ETB: "Br",
  EUR: "€",
  FJD: "$",
  FKP: "£",
  FOK: "kr",
  GBP: "£",
  GEL: "₾",
  GGP: "£",
  GHS: "₵",
  GIP: "£",
  GMD: "D",
  GNF: "Fr",
  GTQ: "Q",
  GYD: "$",
  HKD: "$",
  HNL: "L",
  HRK: "kn",
  HTG: "G",
  HUF: "Ft",
  IDR: "Rp",
  ILS: "₪",
  IMP: "£",
  IQD: "ع.د",
  IRR: "ریال",
  ISK: "kr",
  JEP: "£",
  JMD: "$",
  JOD: "د.ا",
  JPY: "¥",
  KES: "KSh",
  KGS: "сом",
  KHR: "៛",
  KID: "$",
  KMF: "Fr",
  KRW: "₩",
  KWD: "د.ك",
  KYD: "$",
  KZT: "₸",
  LAK: "₭",
  LBP: "ل.ل",
  LKR: "Rs",
  LRD: "$",
  LSL: "L",
  LYD: "ل.د",
  MAD: "د.م.",
  MDL: "Leu",
  MGA: "Ar",
  MKD: "ден",
  MMK: "Ks",
  MNT: "₮",
  MOP: "MOP$",
  MRU: "UM",
  MUR: "Rs",
  MVR: "Rf",
  MWK: "MK",
  MXN: "$",
  MYR: "RM",
  MZN: "MT",
  NAD: "$",
  NGN: "₦",
  NIO: "C$",
  NOK: "kr",
  NPR: "Rs",
  NZD: "$",
  OMR: "ر.ع.",
  PAB: "B/.",
  PEN: "S/",
  PGK: "K",
  PHP: "₱",
  PKR: "₨",
  PLN: "zł",
  PYG: "₲",
  QAR: "ر.ق",
  RON: "lei",
  RSD: "дин.",
  RUB: "₽",
  RWF: "Fr",
  SAR: "ر.س",
  SBD: "$",
  SCR: "₨",
  SDG: "ج.س.",
  SEK: "kr",
  SGD: "$",
  SHP: "£",
  SLE: "Le",
  SLL: "Le",
  SOS: "Sh",
  SRD: "$",
  SSP: "£",
  STN: "Db",
  SYP: "ل.س",
  SZL: "L",
  THB: "฿",
  TJS: "SM",
  TMT: "m",
  TND: "د.ت",
  TOP: "T$",
  TRY: "₺",
  TTD: "$",
  TVD: "$",
  TWD: "NT$",
  TZS: "Sh",
  UAH: "₴",
  UGX: "Sh",
  USD: "$",
  UYU: "$U",
  UZS: "лв",
  VES: "Bs.",
  VND: "₫",
  VUV: "Vt",
  WST: "T",
  XAF: "Fr",
  XCD: "$",
  XDR: "XDR",
  XOF: "Fr",
  XPF: "XPF",
  YER: "ر.ي",
  ZAR: "R",
  ZMW: "ZK",
  ZWL: "Z$",
};

export const AUDIO_FORMATS = [
  "application/ogg",
  "audio/aac",
  "audio/mp3",
  "audio/mpeg",
  "audio/mpg",
  "audio/mp4",
  "audio/mp4-latm",
  "audio/3gpp",
];

export const VIDEO_FORMATS = [
  "video/h263",
  "video/m4v",
  "video/mp4",
  "video/mpeg4",
  "video/mpeg",
  "video/webm",
];

export const IMAGE_FORMATS = ["image/jpeg", "image/gif", "image/png"];

export const DOCUMENT_FORMATS = ["application/pdf"];

export const ACCEPT_UPLOAD_TYPE = [
  ...AUDIO_FORMATS,
  ...VIDEO_FORMATS,
  ...IMAGE_FORMATS,
  ...DOCUMENT_FORMATS,
];

export const FILE_COLORS = {
  "application/ogg": {
    type: "OGG",
    extension: ".ogx",
    tagColor: "lime", // Lime
  },
  "application/pdf": {
    type: "PDF",
    extension: ".pdf",
    tagColor: "red", // Red
  },
  "audio/aac": {
    type: "AAC",
    extension: ".aac",
    tagColor: "gold", // Gold
  },
  "audio/mp3": {
    type: "MP3",
    extension: ".mp3",
    tagColor: "green", // Green
  },
  "audio/mpeg": {
    type: "MPEG",
    extension: ".mpeg",
    tagColor: "orange", // Orange
  },
  "audio/mpg": {
    type: "MPG",
    extension: ".mp3",
    tagColor: "green", // Green
  },
  "audio/mp4": {
    type: "MP4",
    extension: ".mp4",
    tagColor: "cyan", // Cyan
  },
  "audio/mp4-latm": {
    type: "MP4-latm",
    extension: ".mp4",
    tagColor: "cyan", // Cyan
  },
  "audio/3gpp": {
    type: "3GPP",
    extension: ".3gp",
    tagColor: "blue", // Blue
  },
  "image/jpeg": {
    type: "JPEG",
    extension: ".jpeg, .jpg",
    tagColor: "blue", // Blue
  },
  "image/gif": {
    type: "GIF",
    extension: ".gif",
    tagColor: "magenta", // Magenta
  },
  "image/png": {
    type: "PNG",
    extension: ".png",
    tagColor: "cyan", // Cyan
  },
  "video/h263": {
    type: "H263",
    extension: ".h263",
    tagColor: "purple", // Purple
  },
  "video/m4v": {
    type: "M4V",
    extension: ".m4v",
    tagColor: "purple", // Purple
  },
  "video/mp4": {
    type: "MP4",
    extension: ".mp4",
    tagColor: "cyan", // Cyan
  },
  "video/mpeg4": {
    type: "MPEG-4",
    extension: ".mp4, .m4p",
    tagColor: "purple", // Purple
  },
  "video/mpeg": {
    type: "MPEG",
    extension: ".mpeg",
    tagColor: "orange", // Orange
  },
  "video/webm": {
    type: "WebM",
    extension: ".webm",
    tagColor: "blue", // Blue
  },
};

export const MEDIA_FORMATS = {
  ...FILE_COLORS,
  "audio/mp4": {
    type: "Audio/MP4",
  },
  "video/mp4": {
    type: "Video/MP4",
  },
  "video/mpeg": {
    type: "Video/MPEG",
  },
  "audio/mpeg": {
    type: "Audio/MPEG",
  },
};

export const ORDER_STATUS = [
  {
    label: t("processing", { defaultValue: "Processing" }),
    color: "processing",
    value: "processing",
    icon: SyncOutlined,
  },
  {
    label: t("pending.payment", { defaultValue: "Pending Payment" }),
    color: "warning",
    value: "pending-payment",
    icon: ExclamationCircleOutlined,
  },
  {
    label: t("failed", { defaultValue: "Failed" }),
    color: "error",
    value: "failed",
    icon: QuestionCircleOutlined,
  },
  {
    label: t("onhold", { defaultValue: "On Hold" }),
    color: "warning",
    value: "on-hold",
    icon: ExclamationCircleOutlined,
  },
  {
    label: t("completed", { defaultValue: "Completed" }),
    color: "success",
    value: "completed",
    icon: CheckCircleOutlined,
  },
  {
    label: t("cancelled", { defaultValue: "Cancelled" }),
    color: "error",
    value: "cancelled",
    icon: QuestionCircleOutlined,
  },
  {
    label: t("refunded", { defaultValue: "Refunded" }),
    color: "default",
    value: "refunded",
    icon: QuestionCircleOutlined,
  },
];

export function currencyAmount(amount, currency, convert = true) {
  if (typeof amount !== "number") {
    amount = parseFloat(amount) || 0; // Ensure amount is a number, default to 0 if invalid
  }

  if (currency) {
    return `${currency.symbol ?? ""}${(convert
      ? amount * currency.rate
      : amount
    ).toFixed(2)}${!currency.symbol ? " " + currency.code : ""}`;
  } else {
    return `${amount.toFixed(2)}`;
  }
}

export function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

export function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error(t("youcanonlyuploadJPG/PNGfile!", { defaultValue: "You can only upload JPG/PNG file!" }));
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error(t("Imagemustsmallerthan2MB!", { defaultValue: "Image must smaller than 2MB!" }));
  }
  return isJpgOrPng && isLt2M;
}

export async function customRequest(options) {
  try {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "image");

    const { data } = await axiosInstance.post("app/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        // Upload progress tracking
      },
    });

    if (data.status) {
      onSuccess(data);
    } else {
      onError(new Error(data.message));
    }
  } catch (error) {
    message.error(t("upload.failed", { defaultValue: "Upload failed!" }));
  }
}

export function formatDate(date, format = "DD MMM YYYY, h:mm A") {
  return moment(date).format(format);
}

export const getPaymentGatewayImage = (gateway) => {
  return getMediaPath(`media/payment-gateway/${gateway}.png`);
};

export const whatsappFormat = (text) => {
  return (
    text
      // Bold: *text* or **text** => <b>text</b>
      .replace(/\*{1,2}([^*]+)\*{1,2}/g, "<b>$1</b>")

      // Italic: _text_ or __text__ => <i>text</i>
      .replace(/_{1,2}([^_]+)_{1,2}/g, "<i>$1</i>")

      // Strikethrough: ~text~ or ~~text~~ => <s>$1</s>
      .replace(/~{1,2}([^~]+)~{1,2}/g, "<s>$1</s>")

      // Monospace block: ```text``` => <code>text</code>
      .replace(/```([^`]+)```/g, "<code>$1</code>")

      // Inline code: `text` => <code>text</code>
      .replace(/`([^`\n]+)`/g, "<code>$1</code>")

      // Quote: lines starting with > => <blockquote>text</blockquote>
      .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")

      // Newlines => <br>
      .replace(/\n/g, "<br>")
  );
};

export const checkApiKeyValid = async (type, apiKey) => {
  try {
    let response;

    switch (type.toLowerCase()) {
      case "chatgpt":
      case "openai":
        response = await axios.get("https://api.openai.com/v1/models", {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });
        break;

      case "gemini":
        response = await axios.get(
          `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
        );
        break;

      case "deepseek":
        response = await axios.get("https://api.deepseek.com/v1/models", {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });
        break;

      case "grok":
        response = await axios.post(
          "https://api.x.ai/v1/chat/completions",
          {
            model: "grok-beta",
            messages: [{ role: "user", content: "Test API key" }],
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
          }
        );
        break;

      default:
        return { valid: false, message: `Unknown provider type: ${type}` };
    }

    return {
      valid: response.status >= 200 && response.status < 300,
      message: "API key is valid",
    };
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error?.message ||
      error?.response?.data ||
      error.message;
    ("Failed to validate API key");
    return { valid: false, message: errorMessage };
  }
};

export const getThemeConfig = (theme, themeData = {}) => {
  const THEME = {
    light: false,
    dark: true,
    system: "system",
  };

  const newConfig = { ...themeData };

  if ("mode" in newConfig && !newConfig?.algorithm) {
    newConfig.algorithm = newConfig.mode;
    delete newConfig.mode;
  }

  let preference = theme;

  if (preference == null && newConfig?.algorithm) {
    preference = THEME[newConfig.algorithm?.toLowerCase()];
  }

  if (preference === "system" && typeof window !== "undefined") {
    preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  const token = {
    colorPrimary: "#1890FF",
    borderRadius: 6,
    colorBgBase: preference ? "#333" : "#ffffff",
    colorTextBase: preference ? "#ffffff" : "#000000",
    colorWarningBg: preference ? "" : "#fffbe6",
  };

  const components = {
    Select: {
      optionActiveBg: preference ? "#666666" : "#d9d9d9",
      optionSelectedColor: "#000",
      colorText: preference ? "#fff" : "#000000",
    },
    Table: {
      rowSelectedBg: preference ? "#1890ff" : "#f2f2f2",
      rowSelectedHoverBg: preference ? "#1890ff" : "#f2f2f2",
      colorText: preference ? "#fff" : "#000",
    },
    Alert: {
      colorWarningBg: `rgba(255, 229, 143, ${preference ? 0.05 : 0.2})`,
      colorWarningBorder: `rgba(255, 229, 143, ${preference ? 0.4 : 1})`,
    },
    Tooltip: {
      colorTextLightSolid: preference ? "#000" : "#fff",
    },
    Tabs: {
      margin: -7,
    },
    Checkbox: {
      colorBorder: preference ? "rgb(255,255,255)" : "#d9d9d9",
    },
  };

  return {
    algorithm: preference,
    token: { ...token, ...newConfig.token },
    components: { ...components, ...newConfig.components },
  };
};

export const validateEmail = (email) => {
  return email.match(
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

export const daysOptions = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednessday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

export const CUSTOM_FIELD_TYPES = {
  0: "text",
  1: "number",
  2: "boolean",
  3: "date",
};

export const isValidPhoneNumber = (phone) => {
  try {
    if (!phone) return false;
    if (phone.startsWith("+55")) {
      return true;
    }
    return phoneUtil.isValidNumber(phoneUtil.parse(phone));
  } catch (error) {
    return false;
  }
};

export function formatPhoneNumber(phone = "") {
  // Remove any non-digit characters and all spaces
  let cleaned = phone?.toString().replace(/[^\d]/g, "").replace(/\s+/g, "");

  // Check for a leading zero and total length for the specific case
  if (cleaned?.startsWith("0") && cleaned.length === 12) {
    // Remove leading zero and prepend country code
    cleaned = "91" + cleaned?.slice(1);
  } else if (cleaned?.length === 10) {
    // Handle 10-digit numbers
    cleaned = "91" + cleaned;
  }

  // If it starts with 91, add a plus sign in front
  if (cleaned?.startsWith("91")) {
    cleaned = "+" + cleaned;
  } else {
    // If it's not a valid format, handle it accordingly
    return null; // or throw an error, or return a message
  }

  // Return the cleaned phone number
  return cleaned.replace(/^(\+\d{2})(\d{5})(\d{5})$/, "$1$2$3"); // Remove space formatting for this case
}

export const checkPhoneNumber = (phone) => {
  let isValid;
  let num = phone?.toString().replace(/[^0-9]/g, "");
  if (
    phone?.toString()?.startsWith("+91") &&
    phone?.toString()?.length === 13
  ) {
    // +919999999999
    isValid = true;
    num = phone;
  } else if (
    phone?.toString()?.startsWith("91") &&
    phone?.toString()?.length === 12
  ) {
    // 919999999999
    isValid = true;
    num = `+${phone}`;
  } else if (
    !phone?.toString()?.startsWith("+91") &&
    phone?.toString()?.length === 10
  ) {
    // 99999999999
    isValid = true;
    num = `+91${phone}`;
  }

  return { isValid, num };
};

export const getCountryName = (countryCode) => {
  const country = countries.find((c) => c.countryCode == countryCode);
  if (country) {
    return country.countryNameEn;
  } else {
    return countryCode;
  }
};

export const parsePhoneNumber = (phone, defaultRegion = null) => {
  try {
    const parsedNumber = defaultRegion
      ? phoneUtil.parse(phone, defaultRegion)
      : phoneUtil.parse(phone);
    return {
      fullNumber: `+${parsedNumber.getCountryCode()}${parsedNumber.getNationalNumber()}`,
      countryCode: parsedNumber.getCountryCode(),
      nationalNumber: parsedNumber.getNationalNumber(),
      regionCode: phoneUtil.getRegionCodeForNumber(parsedNumber),
    };
  } catch (error) {
    return null;
  }
};

export const formatDuration = (seconds = 0) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hrs) parts.push(`${hrs} Hr`);
  if (mins) parts.push(`${mins} Min`);
  if (secs || parts.length === 0) parts.push(`${secs} Sec`);

  return parts.join(", ");
};

export const getCurrentTime = () => new Date().toLocaleString();

export const SETTING_VARIABLES = [
  {
    name: "Basic Information",
    value: "basicInfo",
    children: [
      {
        name: "Business Name",
        value: "businessName",
      },
      {
        name: "Address",
        value: "address",
      },
      {
        name: "Email",
        value: "email",
      },
      {
        name: "Phone",
        value: "phone",
      },
      {
        name: "Description",
        value: "description",
      },
      {
        name: "Category",
        value: "category",
      },
      {
        name: "Website",
        value: "website",
      },
    ],
  },
  {
    name: "Billing Details",
    value: "billingDetails",
    children: [
      {
        name: "GST",
        value: "gst",
      },
      {
        name: "Email",
        value: "email",
      },
      {
        name: "Phone",
        value: "phone",
      },
      {
        name: "Address",
        value: "address",
      },
      {
        name: "Logo",
        value: "logo",
      },
    ],
  },
  {
    name: "Social Media",
    value: "socialMedia",
    children: [
      {
        name: "LinkedIn",
        value: "linkedin",
      },
      {
        name: "Facebook",
        value: "facebook",
      },
      {
        name: "Twitter",
        value: "twitter",
      },
      {
        name: "Instagram",
        value: "instagram",
      },
      {
        name: "YouTube",
        value: "youtube",
      },
    ],
  },
];

export const AUTOCOMPLETE_VARIABLES_SUGGESTIONS = SETTING_VARIABLES.map(
  (variable) =>
    variable.children.map((child) => ({
      label: `${variable.name} / ${child.name}`,
      value: `{{${variable.value}.${child.value}}}`,
    }))
).flat();

export function timeFormat(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const formatted = [
    hrs.toString().padStart(2, '0'),
    mins.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');

  return formatted;
}

export function getColorFromAlphabet(letter) {
  if (!letter || typeof letter !== 'string') return '#999999';
  const char = letter.toUpperCase().charCodeAt(0);
  if (char < 65 || char > 90) return '#999999';

  // Distribute hue evenly across the alphabet
  const hue = ((char - 65) / 26) * 360;
  const s = 65, l = 60; // balanced saturation & lightness
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = n => {
    const k = (n + hue / 30) % 12;
    const color = (l / 100) - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}