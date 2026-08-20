import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: false,
  panel: {},
  lang: "en",
  currency: "INR",
  currencyRates: {},
  selectedProject: null,
  userSetting: null,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    changeLanguage: (state, action) => {
      state.lang = action.payload;
    },
    changeCurrency: (state, action) => {
      state.currency = action.payload;
    },
    setPanel: (state, action) => {
      state.panel = action.payload;
    },
    changePageTitle: (state, action) => {
      state.pageTitle = action.payload;
    },
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    setUserSetting: (state, action) => {
      state.userSetting = action.payload;
    },
    setCurrencyRates: (state, action) => {
      state.currencyRates = action.payload;
    },
  },
});

export const {
  setTheme,
  changeLanguage,
  changeCurrency,
  setPanel,
  changePageTitle,
  setSelectedProject,
  setUserSetting,
  setCurrencyRates

} = appSlice.actions;

export default appSlice.reducer;
