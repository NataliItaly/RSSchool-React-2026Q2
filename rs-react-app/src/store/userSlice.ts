import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserFormData } from '../components/Forms/form-type';

type UsersState = {
  submissions: UserFormData[];
};

const initialState: UsersState = {
  submissions: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addSubmission: (state, action: PayloadAction<UserFormData>) => {
      state.submissions.push(action.payload);
    },
  },
});

export const { addSubmission } = usersSlice.actions;
export default usersSlice.reducer;
