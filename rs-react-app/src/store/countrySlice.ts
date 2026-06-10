import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from './store';

const initialState = {
  countries: ['USA', 'France', 'Italy', 'Germany', 'Spain', 'Canada'],
};

const countrySlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
});

export default countrySlice.reducer;
export const selectCountries = (state: RootState) => state.countries.countries;
