import { PRODUCT_URL } from "../../constants";
import apiService from "../apiService";

export const productApiSlice = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => PRODUCT_URL,
      providesTags: ["Product"],
    }),

    getProductById: builder.query({
      query: (id) => `${PRODUCT_URL}/${id}`,
      providesTags: ["Product"],
    }),

    createProduct: builder.mutation({
      query: ({ product, imageFile }) => {
        const formData = new FormData();
        formData.append(
          "product",
          new Blob([JSON.stringify(product)], { type: "application/json" })
        );

        formData.append("imageFile", imageFile);

        return {
          url: PRODUCT_URL,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query: ({ product, imageFile }) => {
        const formData = new FormData();
        formData.append(
          "product",
          new Blob([JSON.stringify(product)], { type: "application/json" })
        );
        formData.append("imageFile", imageFile);

        return {
          url: PRODUCT_URL,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `${PRODUCT_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    searchProducts: builder.query({
      query: (keyword) => `${PRODUCT_URL}/search?search=${keyword}`,
      providesTags: ["Product"],
    }),

    getProductImage: builder.query({
      query: (id) => ({
        url: `${PRODUCT_URL}/${id}/image`,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useLazySearchProductsQuery,
  useGetProductImageQuery,
} = productApiSlice;
