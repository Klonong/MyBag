"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Settings, MapPin, Truck, Heart } from "lucide-react";
import { BasePage } from "@/components/base";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { formatPrice } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { useWishlist } from "@/hooks/useWishlist";
import { orderService, type Order } from "@/services/order.service";

const quickLinks = [
  {
    icon: Package,
    title: "My Orders",
    description: "Track deliveries, view order history and manage returns.",
    link: "/orders",
  },
  {
    icon: Settings,
    title: "Account Settings",
    description:
      "Update your security, email preferences, and personal details.",
    link: "/profile/account-settings",
  },
  {
    icon: MapPin,
    title: "Addresses",
    description: "Manage shipping addresses for faster checkout experiences.",
    link: "/profile/addresses",
  },
];

export default function ProfilePage() {
  const { router, user, loading, displayName } = useProfile();
  const { items: wishlistItems } = useWishlist();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;
    void orderService.list({ limit: 3 }).then((result) => {
      if (result.data) setRecentOrders(result.data.items);
    });
  }, [user]);

  if (loading || !user) return null;

  return (
    <BasePage>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 md:mb-10">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative">
            <div className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full overflow-hidden border-2 border-secondary">
              <Image
                src={user.avatarUrl || "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face"}
                alt="Profile"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <div>
            <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl font-semibold text-primary mb-1">
              Greetings, {displayName}.
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              {user.email}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="border-secondary text-primary hover:bg-secondary/50 w-full sm:w-auto"
        >
          Member Rewards
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 md:mb-12">
        {quickLinks.map(({ icon: Icon, title, description, link }) => (
          <Card
            onClick={() => router.push(link)}
            key={title}
            className="cursor-pointer hover:shadow-md transition-shadow border-secondary/60"
          >
            <CardContent className="p-4 sm:p-5 md:p-6">
              <Icon className="w-5 h-5 sm:w-6 text-primary mb-3 sm:mb-4" strokeWidth={1.5} />
              <h3 className="font-semibold text-primary text-sm sm:text-base mb-1">{title}</h3>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                {description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Wishlist */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Recent Activity */}
        <div className="w-full lg:w-1/2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline text-xl sm:text-2xl font-semibold text-primary">
              Recent Activity
            </h2>
            <Link
              href="/orders"
              className="text-sm text-primary underline underline-offset-4 hover:text-tertiary transition-colors"
            >
              View All
            </Link>
          </div>
          <Separator className="mb-4" />
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-secondary/60 bg-card hover:shadow-sm transition-shadow"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                    <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-primary text-xs sm:text-sm">
                      Order #{order.id.slice(0, 8)} · {order.status}
                    </p>
                    <p className="text-muted-foreground text-xs leading-relaxed mt-0.5">
                      {(order.order_items ?? []).length} item{(order.order_items ?? []).length === 1 ? "" : "s"} · {formatPrice(Number(order.total))}
                    </p>
                  </div>
                  <span className="text-muted-foreground text-xs shrink-0">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Wishlist */}
        <div className="w-full lg:w-1/2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline text-xl sm:text-2xl font-semibold text-primary">
              Wishlist
            </h2>
            <Link
              href="/wishlist"
              className="text-sm text-primary underline underline-offset-4 hover:text-tertiary transition-colors"
            >
              View All
            </Link>
          </div>
          <Separator className="mb-4" />
          {wishlistItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">Your wishlist is empty.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {wishlistItems.slice(0, 4).map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.id}`}
                  className="group relative rounded-lg overflow-hidden border border-secondary/60 hover:shadow-md transition-shadow"
                >
                  <AspectRatio ratio={1}>
                    <Image
                      src={product.image || "/placeholder-product.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-tertiary fill-tertiary" />
                  </button>
                  <div className="p-2 sm:p-3 bg-card">
                    <p className="font-medium text-primary text-xs sm:text-sm truncate">
                      {product.name}
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </BasePage>
  );
}
