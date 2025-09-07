import apiService from "../apiService";
import { CATEGORY_URL } from "../../constants";

export const categoriesApiSlice = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => CATEGORY_URL,
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation({
      query: (category) => ({
        url: CATEGORY_URL,
        method: "POST",
        body: category,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: (category) => ({
        url: CATEGORY_URL,
        method: "PUT",
        body: category,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `${CATEGORY_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApiSlice;
