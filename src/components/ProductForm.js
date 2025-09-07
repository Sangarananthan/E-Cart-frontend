"use client";

import { useState, useEffect, useRef } from "react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useToast } from "../hooks/use-toast";
import { Upload, X, ImageIcon } from "lucide-react";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/store/features/api/productApiSlice";

export default function ProductForm({
  product = null,
  categories = [],
  onSuccess,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const { toast } = useToast();

  const isEditing = !!product;
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        stock: product.quantity?.toString() || "",
        categoryId: product.category?.id?.toString() || "",
      });

      if (product.imageName && product.image) {
        setImagePreview(`data:${product.imageType};base64,${product.image}`);
      }
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Product name is required",
        variant: "destructive",
      });
      return;
    }

    if (
      !formData.price ||
      isNaN(Number.parseFloat(formData.price)) ||
      Number.parseFloat(formData.price) < 0
    ) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    if (
      formData.stock &&
      (isNaN(Number.parseInt(formData.stock)) ||
        Number.parseInt(formData.stock) < 0)
    ) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid stock quantity",
        variant: "destructive",
      });
      return;
    }

    if (!formData.categoryId) {
      toast({
        title: "Validation Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number.parseFloat(formData.price),
        quantity: formData.stock ? Number.parseInt(formData.stock) : 0,
        category: {
          id: parseInt(formData.categoryId),
        },
        available: true,
      };

      if (isEditing) {
        await updateProduct({
          product: {
            ...productData,
            id: product.id,
          },
          imageFile: imageFile || new File([], ""),
        }).unwrap();
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        if (!imageFile) {
          toast({
            title: "Validation Error",
            description: "Please select an image for the product",
            variant: "destructive",
          });
          return;
        }

        await createProduct({
          product: productData,
          imageFile,
        }).unwrap();
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }

      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
      });
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onSuccess?.();
    } catch (error) {
      console.error("Product operation error:", error);
      toast({
        title: "Error",
        description:
          error?.data?.message ||
          error?.message ||
          `Failed to ${isEditing ? "update" : "create"} product`,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      categoryId: "",
    });
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Product Image {!isEditing && "*"}</Label>
        <div className="flex items-start gap-4">
          <div className="w-32 h-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted">
            {imagePreview ? (
              <div className="relative w-full h-full">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0"
                  onClick={handleRemoveImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No image</p>
              </div>
            )}
          </div>

          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <Label htmlFor="image-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 border border-input rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                <Upload className="h-4 w-4" />
                <span className="text-sm">Choose Image</span>
              </div>
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              {isEditing
                ? "Leave empty to keep current image"
                : "Required for new products"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Enter product name"
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
          placeholder="Enter product description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min="0"
            placeholder="0"
            value={formData.stock}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Category *</Label>
        <Select
          value={formData.categoryId}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
            ? "Update Product"
            : "Create Product"}
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
