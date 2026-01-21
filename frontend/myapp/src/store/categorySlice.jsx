import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import categoryApi from "../api/categoryApi";

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async () => {
    const res = await categoryApi.getAllCategories();
    return res.data.categories;
  },
);

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (name) => {
    const res = await categoryApi.createCategory(name);
    return res.data.category;
  },
);

export const editCategory = createAsyncThunk(
  "category/editCategory",
  async ({ id, name }) => {
    const res = await categoryApi.editCategory(id, name);
    return res.data.category;
  },
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id) => {
    await categoryApi.deleteCategory(id);
    return id;
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })

      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })

      .addCase(editCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.categories.findIndex(
          (cat) => cat._id == action.payload._id,
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })

      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (cat) => cat._id !== action.payload,
        );
      })

      .addMatcher(
        (action) => action.type.endsWith("rejected"),
        (state, action) => {
          console.log("category api error:", action.error);
          state.loading = false;
          state.error = action.error?.message || "something went wrong";
        },
      );
  },
});

export default categorySlice.reducer;
