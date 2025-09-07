"use client";

import { useState } from "react";
import ProductManagementTable from "@/components/ProductManagementTable";
import ProductForm from "@/components/ProductForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProductsQuery } from "@/store/features/api/productApiSlice";
import { useGetCategoriesQuery } from "@/store/features/api/categoriesApiSlice";

export default function ProductsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { data: products, error, isLoading } = useGetProductsQuery();
  const { data: categories } = useGetCategoriesQuery();

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
  };

  const handleEditSuccess = () => {
    setEditingProduct(null);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Product Management
            </h1>
            <p className="text-muted-foreground">
              Manage your product inventory and details
            </p>
          </div>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Product</DialogTitle>
              </DialogHeader>
              <ProductForm
                categories={categories}
                onSuccess={handleCreateSuccess}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">All Products</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ProductTableSkeleton />
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-destructive mb-2">Error loading products</p>
                <p className="text-sm text-muted-foreground">
                  {error.message || "Something went wrong"}
                </p>
              </div>
            ) : !products || products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">No products found</p>
                <p className="text-sm text-muted-foreground">
                  Create your first product to get started
                </p>
              </div>
            ) : (
              <ProductManagementTable
                products={products}
                onEdit={handleEditProduct}
              />
            )}
          </CardContent>
        </Card>

        {/* Edit Product Dialog */}
        <Dialog
          open={!!editingProduct}
          onOpenChange={(open) => !open && handleCancelEdit()}
        >
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            {editingProduct && (
              <ProductForm
                product={editingProduct}
                categories={categories}
                onSuccess={handleEditSuccess}
                onCancel={handleCancelEdit}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Loading skeleton component
function ProductTableSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center gap-4 flex-1">
            <Skeleton className="h-16 w-16 rounded" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
