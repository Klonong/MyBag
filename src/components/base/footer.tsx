import Link from "next/link";
import { InstagramIcon } from "../icons/lucide-instagram";
import { FacebookIcon } from "../icons/lucide-facebook";

const navigation = {
  shop: [
    { label: "New Arrivals", href: "/shop" },
    { label: "Tote Bags", href: "/shop?category=tote" },
    { label: "Crossbody", href: "/shop?category=crossbody" },
    { label: "Backpacks", href: "/shop?category=backpacks" },
    { label: "Clutches", href: "/shop?category=clutches" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Craftsmanship", href: "/craftsmanship" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Careers", href: "/careers" },
  ],
  support: [
    { label: "FAQ", href: "/faq" },
    { label: "Shipping & Returns", href: "/shipping" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "Contact Us", href: "/contact" },
  ],
};

const socials = [
  { icon: InstagramIcon, label: "Instagram", href: "#" },
  //   { icon: Twitter, label: "X / Twitter", href: "#" },
  { icon: FacebookIcon, label: "Facebook", href: "#" },
  //   { icon: Whatsapp, label: "YouTube", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-white mt-10">
      {/* Top strip */}
      <div className="border-b border-white/10 px-6 md:px-16 lg:px-24 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link
              href="/"
              className="font-headline text-2xl font-bold tracking-[0.15em] text-white hover:text-tertiary transition-colors duration-300"
            >
              MyBag
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Hand-crafted vessels from the archipelago. Each piece carries the
              story of Indonesian artisans and their generations of mastery.
            </p>

            {/* Newsletter */}
            <div className="mt-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">
                Stay in the loop
              </p>
              <div className="flex h-10 max-w-xs">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-white/5 border border-white/10 rounded-l-full px-4 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
                />
                <button
                  type="button"
                  className="px-5 bg-white text-black text-xs font-semibold tracking-wider rounded-r-full hover:bg-tertiary hover:text-white transition-colors duration-200"
                >
                  JOIN
                </button>
              </div>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">
              Shop
            </p>
            <ul className="flex flex-col gap-3">
              {navigation.shop.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">
              Company
            </p>
            <ul className="flex flex-col gap-3">
              {navigation.company.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">
              Support
            </p>
            <ul className="flex flex-col gap-3">
              {navigation.support.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-6 md:px-16 lg:px-24 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} MyBag. All rights reserved.
          </p>

          {/* Socials */}
          <div className="flex items-center gap-4">
            {socials.map(({ icon: Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="text-white/30 hover:text-white transition-colors duration-200"
              >
                <Icon className="w-4 h-4" />
              </Link>
            ))}
          </div>

          <p className="text-xs text-white/20 tracking-wider">
            MADE IN INDONESIA
          </p>
        </div>
      </div>
    </footer>
  );
}
