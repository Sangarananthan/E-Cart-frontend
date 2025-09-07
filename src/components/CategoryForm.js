"use client";

import { useState, useEffect } from "react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/store/features/api/categoriesApiSlice";

export default function CategoryForm({ category = null, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const { toast } = useToast();

  const isEditing = !!category;
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
      });
    }
  }, [category]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const categoryData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
      };

      if (isEditing) {
        await updateCategory({
          ...categoryData,
          id: category.id,
        }).unwrap();
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        await createCategory(categoryData).unwrap();
        toast({
          title: "Success",
          description: "Category created successfully",
        });
      }

      setFormData({
        name: "",
        description: "",
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.message ||
          `Failed to ${isEditing ? "update" : "create"} category`,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      description: "",
    });
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name *</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Enter category name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Enter category description (optional)"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {isLoading
            ? "Saving..."
            : isEditing
            ? "Update Category"
            : "Create Category"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
