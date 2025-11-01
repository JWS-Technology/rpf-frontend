import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface sosData {
  phone_number: string,
  issue_type: string,
  station: string,
}

const initialState: sosData = {
  phone_number: "",
  issue_type: "",
  station: "",
}

export const sosSlice = createSlice({
  name: 'sos',
  initialState,
  reducers: {
    clearPhoneNumber: (state) => {
      state.phone_number = ""
    },
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phone_number = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { clearPhoneNumber, setPhoneNumber } = sosSlice.actions

export default sosSlice.reducer