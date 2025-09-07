"use client";

import { useState } from "react";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useToast } from "../hooks/use-toast";
import {
  useDeleteProductMutation,
  useGetProductImageQuery,
} from "@/store/features/api/productApiSlice";

export default function ProductManagementTable({ products = [], onEdit }) {
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [productToDelete, setProductToDelete] = useState(null);
  const { toast } = useToast();

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id).unwrap();
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      setProductToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCancel = () => {
    setProductToDelete(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price || 0);
  };

  return (
    <>
      <div className="space-y-4">
        {products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            onEdit={onEdit}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && handleDeleteCancel()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ProductRow({ product, onEdit, onDelete }) {
  const [imageError, setImageError] = useState(false);
  const {
    data: imageBlob,
    isLoading: imageLoading,
    error: imageQueryError,
  } = useGetProductImageQuery(product.id, {
    skip: !product.id || imageError,
  });

  const imageUrl =
    imageBlob && !imageError ? URL.createObjectURL(imageBlob) : null;

  const handleImageError = () => {
    setImageError(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price || 0);
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
      <div className="flex items-center gap-4 flex-1">
        {/* Product Image */}
        <div className="h-16 w-16 bg-muted rounded overflow-hidden flex-shrink-0">
          {imageLoading ? (
            <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
              <div className="text-xs text-muted-foreground">Loading...</div>
            </div>
          ) : imageUrl && !imageError ? (
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={product.name || "Product"}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <div className="text-xs text-muted-foreground">No Image</div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-semibold text-foreground truncate">
              {product.name || "Unnamed Product"}
            </h3>
            <Badge variant="secondary" className="text-xs flex-shrink-0">
              ID: {product.id}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-1">
            <span className="font-medium text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.category && (
              <Badge variant="outline" className="text-xs">
                {product.category.name}
              </Badge>
            )}
            {product.stock !== undefined && (
              <span
                className={
                  product.stock > 0 ? "text-green-600" : "text-destructive"
                }
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground truncate">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0">
        <Button variant="outline" size="sm" className="bg-transparent">
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(product)}
          className="bg-transparent"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(product)}
          className="text-destructive hover:text-destructive bg-transparent"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
}
