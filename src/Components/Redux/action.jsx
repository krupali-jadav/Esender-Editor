import axiosInstance from "../../util/axiosInstance";
import { getProfile } from "../Profile/ProfileApi";
import { setCurrencyRates, setPanel } from "../Redux/Reducer/reducer.app";
import { removeUserDetails, setProfile, } from "../Redux/Reducer/Reducer.user";
// import { getProfile } from "../Components/Profile/ProfileApi";

export function logout() {
  return async (dispatch) => {
    try {
      dispatch(removeUserDetails());
    } catch (error) {
      console.log(error)
    }
  };
}

export const getAppDetails = async () => {
  const response = await axiosInstance.get("/app");

  if (response.data?.status) {
    return response.data.app;
  }

  return null;
};

export const getExchangeRates = () => {
  return async (dispatch, getState) => {
    try {
      const { data } = await axiosInstance.get("exchange-rates");

      if (data?.status) {
        const panel = getState().app.panel;

        dispatch(
          setPanel({
            ...panel,
            currencies: Object.keys(data.rates),
          })
        );

        dispatch(setCurrencyRates(data.rates));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const refreshProfile = () => {
  return async (dispatch) => {
    try {
      const data = await getProfile();

      if (data?.status) {
        dispatch(setProfile(data.profile));
      }
    } catch (error) {
      console.log(error);
    }
  };
};