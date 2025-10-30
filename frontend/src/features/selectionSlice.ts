import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/src/store";

interface SelectionState {
  ids: number[];
}

const initialState: SelectionState = {
  ids: [],
};

export const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    toggleSelection: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((prevId) => prevId !== id);
      } else {
        state.ids.push(id);
      }
    },
    clearSelection: (state) => {
      state.ids = [];
    },
  },
});

export const { toggleSelection, clearSelection } = selectionSlice.actions;

export const selectSelectedIds = (state: RootState) => state.selection.ids;
export const selectIsSelected = (id: number) => (state: RootState) =>
  state.selection.ids.includes(id);

export default selectionSlice.reducer;
