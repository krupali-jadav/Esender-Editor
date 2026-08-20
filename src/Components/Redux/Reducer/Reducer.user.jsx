import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    profile: null,
    token: null,
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUserDetails: (state, action) => {
            state.profile = action.payload.profile;
            state.token = action.payload.token;

        },
        setProfile: (state, action) => {
            state.profile = action.payload;
        },
        removeUserDetails: (state) => {
            state.profile = null;
            state.token = null;
        },
    },
});

export const {
    setUserDetails,
    setProfile,
    removeUserDetails,
} = userSlice.actions;

export default userSlice.reducer;