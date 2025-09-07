"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { useGetProductImageQuery } from "../store/features/api/productApiSlice";

export default function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);

  // Fetch product image
  const {
    data: imageBlob,
    isLoading: imageLoading,
    error: imageQueryError,
  } = useGetProductImageQuery(product.id, {
    skip: !product.id || imageError,
  });

  // Convert blob to URL for display
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
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        {/* Product Image */}
        <div className="aspect-square mb-4 bg-muted rounded-lg overflow-hidden">
          {imageLoading ? (
            <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
              <div className="text-muted-foreground text-sm">Loading...</div>
            </div>
          ) : imageUrl && !imageError ? (
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={product.name || "Product"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <div className="text-muted-foreground text-sm">No Image</div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground line-clamp-2 leading-tight">
            {product.name || "Unnamed Product"}
          </h3>

          {product.category && (
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          )}

          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(product.price)}
            </span>

            {product.stock !== undefined && (
              <span
                className={`text-sm ${
                  product.stock > 0 ? "text-green-600" : "text-destructive"
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive bg-transparent"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
