import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {  useSelector } from "react-redux";
import {  Card } from "antd";
import { getAppDetails } from "../Redux/action";

const PolicyPage = ({ type }) => {
  const { t } = useTranslation();
  const theme = useSelector((state) => state?.app?.theme);
  const [policy, setPolicy] = useState({});

  useEffect(() => {
    const fetchPolicy = async () => {
      const app = await getAppDetails();

      if (app?.policy) {
        setPolicy(app.policy);
      }
    };

    fetchPolicy();
  }, []);

  return (
    <Fragment>
      <Card variant={false} title={t(type)}>
        <div
          dangerouslySetInnerHTML={{
            __html: policy?.[type] || "",
          }}
          style={{
            color: theme ? "#fff" : "#333",
          }}
        />
      </Card>
    </Fragment>
  );
};

export default PolicyPage;