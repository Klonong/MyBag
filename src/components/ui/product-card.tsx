"use client";

import type { Product } from "@/interfaces";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HeartIcon, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);


  return (
    <div className="group cursor-pointer" onClick={onClick}>
      {/* Image Container */}
      <div
        className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-semibold tracking-wider">
            {product.badge}
          </div>
        )}

        {/* Quick Add Button Overlay */}
        {/* <div
          className={`absolute inset-0 flex items-end justify-center pb-4 bg-black transition-opacity duration-300 ${
            isHovered ? "opacity-50" : "opacity-0"
          }`}
        >
          <Button
            className="bg-white text-black font-semibold tracking-wider cursor-pointer"
            size="sm"
            onClick={(e) => {
              console.log(`Quick Add clicked for product ID: ${product.id}`);
            }}
          >
            QUICK ADD +
          </Button>
        </div> */}
      </div>

      {/* Product Info */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-600 mb-2">{product.description}</p>
          <p className="text-sm font-semibold text-gray-900">
            {formatPrice(product.price)}
          </p>
        </div>
        <div>
          <Button
            className="bg-white text-black font-semibold tracking-wider cursor-pointer"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              console.log(`Quick Add clicked for product ID: ${product.id}`);
            }}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
          <Button
            className="bg-white text-black font-semibold tracking-wider cursor-pointer"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              console.log(`Favorite clicked for product ID: ${product.id}`);
            }}
          >
            <HeartIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
