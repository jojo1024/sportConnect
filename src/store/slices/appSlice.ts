import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

export interface IAppState {
    displayWelcomeScreen: boolean;
    selectedProfileMode: 'lambda' | 'capo' | null;
}

export const appSlice = createSlice({
    name: "app",
    initialState: <IAppState>{
        displayWelcomeScreen: true,
        selectedProfileMode: null,
    },
    reducers: {
        setDisplayWelcomeScreen: (state, action: PayloadAction<boolean>) => {
            state.displayWelcomeScreen = action.payload;
        },
        setSelectedProfileMode: (state, action: PayloadAction<'lambda' | 'capo' | null>) => {
            state.selectedProfileMode = action.payload;
        },
        clearSelectedProfileMode: (state) => {
            state.selectedProfileMode = null;
        },
    },
});

export const {
    setDisplayWelcomeScreen,
    setSelectedProfileMode,
    clearSelectedProfileMode,
} = appSlice.actions;

export const selectDisplayWelcomeScreen = (state: RootState) => state.app.displayWelcomeScreen;
export const selectSelectedProfileMode = (state: RootState) => state.app.selectedProfileMode;

export default appSlice.reducer;