import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  Platform: [
    { label: "Campaigns", href: "/campaigns" },
    { label: "Cara Kerja", href: "/#how-it-works" },
    { label: "FAQ", href: "/#faq" },
  ],
  Dukungan: [
    { label: "Dashboard", href: "/login" },
    { label: "Hubungi Admin", href: "#" },
    { label: "Panduan Creator", href: "#" },
  ],
  Untuk: [
    { label: "Creator & Clipper", href: "#" },
    { label: "Dealership", href: "#" },
    { label: "Brand Otomotif", href: "#" },
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
                src="/carpaign-logo.png"
                alt="Carpaign"
                width={130}
                height={36}
                className="object-contain h-7 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm max-w-xs font-light leading-relaxed" style={{ color: "rgba(245, 245, 233, 0.6)" }}>
              Platform marketplace yang memfasilitasi kreator untuk membuat konten promosi dari inventory dealership otomotif.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:border-[rgba(212,175,55,0.3)] hover:text-white"
                style={{
                  background: "rgba(245, 245, 233, 0.05)",
                  border: "1px solid rgba(245, 245, 233, 0.08)",
                  color: "rgba(245, 245, 233, 0.5)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:border-[rgba(212,175,55,0.3)] hover:text-white"
                style={{
                  background: "rgba(245, 245, 233, 0.05)",
                  border: "1px solid rgba(245, 245, 233, 0.08)",
                  color: "rgba(245, 245, 233, 0.5)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:border-[rgba(212,175,55,0.3)] hover:text-white"
                style={{
                  background: "rgba(245, 245, 233, 0.05)",
                  border: "1px solid rgba(245, 245, 233, 0.08)",
                  color: "rgba(245, 245, 233, 0.5)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
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
