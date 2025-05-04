import Link from "next/link";

// Define type for navigation items
interface FooterNavItem {
  name: string;
  href: string;
}

const navigation = {
  shop: [
    { name: "All Products", href: "/products" },
    { name: "Featured", href: "/#featured" }, // Assuming featured is a section on homepage
  ],
  company: [
    { name: "Who we are", href: "#" },
    { name: "Terms & Conditions", href: "#" },
    { name: "Privacy", href: "#" },
  ],
  account: [
    { name: "Manage Account", href: "/profile" },
    { name: "Returns & Exchanges", href: "#" },
    { name: "Redeem a Gift Card", href: "#" },
  ],
  connect: [
    { name: "Contact Us", href: "#" },
    { name: "Twitter", href: "#" },
    { name: "Instagram", href: "#" },
    { name: "Pinterest", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-800" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Use FooterNavItem type */} 
          {Object.entries(navigation).map(([key, items]) => (
            <div key={key}>
              <h3 className="text-sm font-semibold leading-6 text-white uppercase">
                {key}
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                {items.map((item: FooterNavItem) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm leading-6 text-gray-300 hover:text-white"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
        <p className="text-xs leading-5 text-gray-400 text-center">
          &copy; {new Date().getFullYear()} Dummy Store, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
