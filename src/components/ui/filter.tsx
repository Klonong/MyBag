"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "./label";

const styles = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .filter-content-enter {
    animation: slideDown 0.3s ease-out;
  }
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

interface FilterSection {
  title: string;
  items: Array<{ label: string; count?: number; value: string }>;
  type: "category" | "material" | "palette" | "price-range";
}

interface FilterProps {
  sections?: FilterSection[];
  selectedCategory?: string;
  onCategoryChange?: (value: string) => void;
}

export function Filter({
  sections = defaultSections,
  selectedCategory,
  onCategoryChange,
}: FilterProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    category: true,
    "price range": true,
    material: true,
  });

  const [visibleItems, setVisibleItems] = useState<Record<string, number>>({
    category: 4,
    material: 4,
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const showMore = (sectionId: string, maxLength: number) => {
    setVisibleItems((prev) => ({
      ...prev,
      [sectionId]: maxLength,
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {sections.map((section) => (
        <div key={section.title}>
          {/* Section Header with Toggle */}
          <button
            onClick={() => toggleSection(section.title.toLowerCase())}
            className="w-full flex items-center justify-between pb-2 border-b border-gray-300 group hover:opacity-70 transition-opacity duration-200"
          >
            <span className="text-xs font-semibold tracking-wider text-gray-900 uppercase">
              {section.title}
            </span>
            <ChevronDown
              size={16}
              className={`text-gray-600 transition-transform duration-600 ease-out ${
                expandedSections[section.title.toLowerCase()]
                  ? "rotate-0"
                  : "-rotate-90"
              }`}
            />
          </button>

          {/* Section Content */}
          {expandedSections[section.title.toLowerCase()] && (
            <div className="mt-3 flex flex-col gap-2 filter-content-enter">
              {section.type === "category" && (
                <CategoryItems
                  items={section.items}
                  sectionId={section.title.toLowerCase()}
                  visibleCount={visibleItems[section.title.toLowerCase()] || 4}
                  onShowMore={() =>
                    showMore(
                      section.title.toLowerCase(),
                      section.items.length
                    )
                  }
                  showShowMore={
                    (visibleItems[section.title.toLowerCase()] || 4) <
                    section.items.length
                  }
                  selectedCategory={selectedCategory}
                  onCategoryChange={onCategoryChange}
                />
              )}

              {section.type === "material" && (
                <MaterialItems
                  items={section.items}
                  sectionId={section.title.toLowerCase()}
                  visibleCount={visibleItems[section.title.toLowerCase()] || 4}
                  onShowMore={() =>
                    showMore(
                      section.title.toLowerCase(),
                      section.items.length
                    )
                  }
                  showShowMore={
                    (visibleItems[section.title.toLowerCase()] || 4) <
                    section.items.length
                  }
                />
              )}

              {section.type === "palette" && (
                <PaletteItems items={section.items} />
              )}

              {section.type === "price-range" && (
                <PriceRangeItems />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CategoryItems({
  items,
  visibleCount,
  onShowMore,
  showShowMore,
  selectedCategory,
  onCategoryChange,
}: {
  items: Array<{ label: string; count?: number; value: string }>;
  sectionId: string;
  visibleCount: number;
  onShowMore: () => void;
  showShowMore: boolean;
  selectedCategory?: string;
  onCategoryChange?: (value: string) => void;
}) {
  return (
    <>
      {items.slice(0, visibleCount).map((item) => (
        <div
          key={item.value}
          className="flex items-center gap-2 cursor-pointer group animate-fade-in"
        >
          <Checkbox
            id={item.value}
            checked={selectedCategory === item.value}
            onCheckedChange={() => {
              onCategoryChange?.(
                selectedCategory === item.value ? "" : item.value,
              );
            }}
            className="transition-all duration-200"
          />
          <Label
            htmlFor={item.value}
            className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200 cursor-pointer flex-1"
          >
            {item.label}
          </Label>
          {item.count !== undefined && (
            <span className="text-xs text-gray-400">
              ({String(item.count).padStart(2, "0")})
            </span>
          )}
        </div>
      ))}
      {showShowMore && (
        <button
          onClick={onShowMore}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 transition-all duration-300 ease-out hover:translate-x-1"
        >
          See more
        </button>
      )}
    </>
  );
}

function MaterialItems({
  items,
  visibleCount,
  onShowMore,
  showShowMore,
}: {
  items: Array<{ label: string; value: string }>;
  sectionId: string;
  visibleCount: number;
  onShowMore: () => void;
  showShowMore: boolean;
}) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {items.slice(0, visibleCount).map((item) => (
          <button
            key={item.value}
            className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-100 transition-all duration-600 text-gray-700 hover:border-gray-400"
          >
            {item.label}
          </button>
        ))}
      </div>
      {showShowMore && (
        <button
          onClick={onShowMore}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 transition-all duration-600 ease-out hover:translate-x-1"
        >
          See more
        </button>
      )}
    </>
  );
}

function PaletteItems({
  items,
}: {
  items: Array<{ label: string; value: string }>;
}) {
  const colorMap: Record<string, string> = {
    black: "bg-black",
    tan: "bg-amber-100",
    brown: "bg-amber-700",
    cream: "bg-yellow-50",
    green: "bg-green-800",
  };

  return (
    <div className="flex gap-3">
      {items.map((item) => (
        <button
          key={item.value}
          title={item.label}
          className={`w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-600 transition-all duration-300 cursor-pointer hover:scale-110 ${
            colorMap[item.value] || "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

function PriceRangeItems() {
  const [priceRange, setPriceRange] = useState<number[]>([500, 5000]);

  return (
    <div className="space-y-4">
      <Slider
        min={0}
        max={10000}
        step={100}
        value={priceRange}
        // onValueChange={setPriceRange}
        className="w-full"
      />
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">
          Rp {priceRange[0].toLocaleString("id-ID")}
        </span>
        <span className="text-gray-400">—</span>
        <span className="text-gray-600">
          Rp {priceRange[1].toLocaleString("id-ID")}+
        </span>
      </div>
    </div>
  );
}

export const staticFilterSections: FilterSection[] = [
  {
    title: "Price Range",
    type: "price-range",
    items: [],
  },
  {
    title: "Material",
    type: "material",
    items: [
      { label: "Leather", value: "leather" },
      { label: "Rattan", value: "rattan" },
      { label: "Canvas", value: "canvas" },
      { label: "Batik Fabric", value: "batik" },
      { label: "Jute", value: "jute" },
      { label: "Synthetic", value: "synthetic" },
    ],
  },
  {
    title: "Palette",
    type: "palette",
    items: [
      { label: "Black", value: "black" },
      { label: "Tan", value: "tan" },
      { label: "Brown", value: "brown" },
      { label: "Cream", value: "cream" },
      { label: "Green", value: "green" },
    ],
  },
];

const defaultSections: FilterSection[] = [
  {
    title: "Category",
    type: "category",
    items: [
      { label: "Tote Bags", count: 12, value: "tote" },
      { label: "Crossbody", count: 8, value: "crossbody" },
      { label: "Clutches", count: 5, value: "clutches" },
      { label: "Backpacks", count: 3, value: "backpacks" },
      { label: "Shoulder Bags", count: 7, value: "shoulder" },
      { label: "Crossbody Sling", count: 4, value: "sling" },
    ],
  },
  {
    title: "Price Range",
    type: "price-range",
    items: [],
  },
  {
    title: "Material",
    type: "material",
    items: [
      { label: "Leather", value: "leather" },
      { label: "Rattan", value: "rattan" },
      { label: "Canvas", value: "canvas" },
      { label: "Batik Fabric", value: "batik" },
      { label: "Jute", value: "jute" },
      { label: "Synthetic", value: "synthetic" },
    ],
  },
  {
    title: "Palette",
    type: "palette",
    items: [
      { label: "Black", value: "black" },
      { label: "Tan", value: "tan" },
      { label: "Brown", value: "brown" },
      { label: "Cream", value: "cream" },
      { label: "Green", value: "green" },
    ],
  },
];
