"use client";

import { useState } from "react";
import ProductGrid from "@/components/ProductGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetProductsQuery,
  useLazySearchProductsQuery,
} from "@/store/features/api/productApiSlice";
import { SearchBar } from "@/components/SearchBar";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: products, error, isLoading } = useGetProductsQuery();
  const [searchProducts, { data: searchResults, isFetching }] =
    useLazySearchProductsQuery();

  const handleSearch = (term) => {
    searchProducts(term);
  };

  const handleClearSearch = () => {
    searchProducts("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Product Catalog
          </h1>
          <p className="text-muted-foreground">
            Manage and view your product inventory
          </p>
        </div>

        <div className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            onClear={handleClearSearch}
            placeholder="Search products..."
            value={searchTerm}
          />
        </div>

        {/* Results Summary */}
        {isFetching && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? "Searching..."
                : `Search results for "${searchTerm}"`}
              {searchResults.data && ` (${searchResults.data.length} found)`}
            </p>
          </div>
        )}

        {/* Product Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {isFetching ? "Search Results" : "All Products"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading || (isFetching && searchResults.isLoading) ? (
              <ProductGridSkeleton />
            ) : error || (isFetching && searchResults.error) ? (
              <div className="text-center py-12">
                <p className="text-destructive mb-2">Error loading products</p>
                <p className="text-sm text-muted-foreground">
                  {error.message ||
                    searchResults.error.message ||
                    "Something went wrong"}
                </p>
              </div>
            ) : !products ||
              (isFetching &&
                (!searchResults.data || searchResults.data.length === 0)) ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">
                  {isFetching ? "No products found" : "No products available"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isFetching
                    ? "Try adjusting your search terms"
                    : "Add some products to get started"}
                </p>
              </div>
            ) : (
              <ProductGrid
                products={isFetching ? searchResults.data : products}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Loading skeleton component
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-1/4" />
        </div>
      ))}
    </div>
  );
}
