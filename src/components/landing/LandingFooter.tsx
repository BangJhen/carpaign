import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Campaigns", href: "/campaigns" },
    { label: "Cara Kerja", href: "/#how-it-works" },
    { label: "Rank & Rewards", href: "/rank-rewards" },
    { label: "Leaderboard", href: "/leaderboard" },
  ],
  Dukungan: [
    { label: "FAQ", href: "/#faq" },
    { label: "Hubungi Admin", href: "/bantuan" },
    { label: "Panduan Creator", href: "/bantuan" },
  ],
  Untuk: [
    { label: "Creator & Clipper", href: "/" },
    { label: "Dealership", href: "/" },
    { label: "Brand Otomotif", href: "/" },
  ],
};

export function LandingFooter() {
  return (
    <footer
      className="relative border-t"
      style={{
        background: "#0D0F12",
        borderColor: "rgba(212, 175, 55, 0.07)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/Carpaign Logo.png"
                alt="Carpaign"
                width={130}
                height={36}
                className="object-contain h-7 w-auto"
              />
            </Link>
            <p
              className="text-sm leading-relaxed mb-6 max-w-xs"
              style={{ color: "rgba(245, 245, 233, 0.4)" }}
            >
              Platform marketplace campaign konten otomotif. Menghubungkan
              creator berbakat dengan dealership terkemuka di Indonesia.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:border-[rgba(212,175,55,0.3)]"
                style={{
                  background: "rgba(245, 245, 233, 0.05)",
                  border: "1px solid rgba(245, 245, 233, 0.08)",
                  color: "rgba(245, 245, 233, 0.5)",
                }}
              >
                <ExternalLink size={14} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:border-[rgba(212,175,55,0.3)]"
                style={{
                  background: "rgba(245, 245, 233, 0.05)",
                  border: "1px solid rgba(245, 245, 233, 0.08)",
                  color: "rgba(245, 245, 233, 0.5)",
                }}
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4
                className="text-xs font-bold tracking-widest uppercase mb-4"
                style={{ color: "rgba(212, 175, 55, 0.7)" }}
              >
                {group}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200 hover:text-white"
                      style={{ color: "rgba(245, 245, 233, 0.4)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(245, 245, 233, 0.06)" }}
        >
          <p
            className="text-xs"
            style={{ color: "rgba(245, 245, 233, 0.25)" }}
          >
            © {new Date().getFullYear()} Carpaign. Hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center gap-5">
            {["Kebijakan Privasi", "Syarat & Ketentuan"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs transition-colors duration-200 hover:text-white"
                style={{ color: "rgba(245, 245, 233, 0.25)" }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
