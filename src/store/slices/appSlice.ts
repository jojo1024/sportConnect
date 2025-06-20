import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

export interface IAppState {
    displayWelcomeScreen: boolean,
}

export const appSlice = createSlice({
    name: "app",
    initialState: <IAppState>{
        displayWelcomeScreen: false,
    },
    reducers: {
        setDisplayWelcomeScreen: (state, action: PayloadAction<boolean>) => {
            state.displayWelcomeScreen = action.payload;
        },
    },
});

export const {
    setDisplayWelcomeScreen,
} = appSlice.actions;

export const selectDisplayWelcomeScreen = (state: RootState) => state.app.displayWelcomeScreen;

export default appSlice.reducer;