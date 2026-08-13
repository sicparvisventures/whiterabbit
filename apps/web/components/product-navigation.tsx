"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const desktopDestinations = [
  { href: "/app", label: "Overview", mark: "OV" },
  { href: "/app/operations", label: "Operations", mark: "OP" },
  { href: "/app/candidates", label: "Candidates", mark: "CA" },
  { href: "/app/watchlists", label: "Watchlists", mark: "WA" },
  { href: "/app/nodes", label: "Nodes", mark: "NO" },
  { href: "/app/policies", label: "Policies", mark: "PO" },
  { href: "/app/audit", label: "Audit", mark: "AU" },
  { href: "/app/settings", label: "Settings", mark: "SE" },
] as const;

const mobileDestinations = [
  { href: "/app", label: "Home", mark: "HO" },
  { href: "/sentry", label: "Sentry", mark: "SE" },
  { href: "/app/candidates", label: "Alerts", mark: "AL" },
  { href: "/app/nodes", label: "Nodes", mark: "NO" },
  { href: "/app/settings", label: "Settings", mark: "ST" },
] as const;

function isCurrent(pathname: string, href: string) {
  return href === "/app" ? pathname === href : pathname.startsWith(href);
}

export function ProductNavigation({
  variant,
}: {
  variant: "desktop" | "mobile";
}) {
  const pathname = usePathname();

  if (variant === "desktop") {
    return (
      <nav className="product-nav" aria-label="Command center navigation">
        {desktopDestinations.map((destination) => (
          <Link
            aria-current={
              isCurrent(pathname, destination.href) ? "page" : undefined
            }
            className={
              isCurrent(pathname, destination.href)
                ? "product-nav-link active"
                : "product-nav-link"
            }
            href={destination.href}
            key={destination.href}
          >
            <span aria-hidden="true">{destination.mark}</span>
            {destination.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="mobile-product-nav" aria-label="Field navigation">
      {mobileDestinations.map((destination) => (
        <Link
          aria-current={
            isCurrent(pathname, destination.href) ? "page" : undefined
          }
          className={isCurrent(pathname, destination.href) ? "active" : ""}
          href={destination.href}
          key={destination.href}
        >
          <span aria-hidden="true">{destination.mark}</span>
          {destination.label}
        </Link>
      ))}
    </nav>
  );
}
