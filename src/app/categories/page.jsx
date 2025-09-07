"use client";
import { useState } from "react";
import CategoryList from "@/components/CategoryList";
import CategoryForm from "@/components/CategoryForm";
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
import { useGetCategoriesQuery } from "@/store/features/api/categoriesApiSlice";

export default function CategoriesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const { data: categories, error, isLoading } = useGetCategoriesQuery();

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
  };

  const handleEditSuccess = () => {
    setEditingCategory(null);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Category Management
            </h1>
            <p className="text-muted-foreground">
              Organize your products with categories
            </p>
          </div>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
              </DialogHeader>
              <CategoryForm onSuccess={handleCreateSuccess} />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">All Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <CategoryListSkeleton />
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-destructive mb-2">
                  Error loading categories
                </p>
                <p className="text-sm text-muted-foreground">
                  {error.message || "Something went wrong"}
                </p>
              </div>
            ) : !categories || categories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">
                  No categories found
                </p>
                <p className="text-sm text-muted-foreground">
                  Create your first category to get started
                </p>
              </div>
            ) : (
              <CategoryList
                categories={categories}
                onEdit={handleEditCategory}
              />
            )}
          </CardContent>
        </Card>

        <Dialog
          open={!!editingCategory}
          onOpenChange={(open) => !open && handleCancelEdit()}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            {editingCategory && (
              <CategoryForm
                category={editingCategory}
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

function CategoryListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
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
