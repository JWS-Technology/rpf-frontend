import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface sosData {
  phone_number: string;
  issue_type: string;
  station: string;
}

const initialState: sosData = {
  phone_number: "",
  issue_type: "",
  station: "",
};

export const sosSlice = createSlice({
  name: "sos",
  initialState,
  reducers: {
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phone_number = action.payload;
    },
    setStation: (state, action: PayloadAction<string>) => {
      state.station = action.payload;
    },
    setIssueType: (state, action: PayloadAction<string>) => {
      state.issue_type = action.payload;
    },
    clearPhoneNumber: (state) => {
      state.phone_number = "";
    },
    clearAllData: (state) => {
      state.phone_number = "";
      state.issue_type = "";
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setPhoneNumber,
  setStation,
  setIssueType,
  clearPhoneNumber,
  clearAllData,
} = sosSlice.actions;

export default sosSlice.reducer;
