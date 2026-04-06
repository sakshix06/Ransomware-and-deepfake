import React, { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 SPA-safe section scroll
  const handleSectionClick = (id: string) => {
    navigate("/");
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const navLinks = [
    { name: "Home", id: "home", type: "section" },
    { name: "How It Works", id: "how-it-works", type: "section" },
    { name: "Features", id: "features", type: "section" },

    // ✅ FIXED
    { name: "Dashboard", path: "/dashboard", type: "page" },

    { name: "About", id: "about", type: "section" },
    { name: "Contact", id: "contact", type: "section" },
    { name: "Deepfake Portal", path: "/deepfake-portal", type: "page" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-ransomguard-dark-bg/95 backdrop-blur shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-ransomguard-purple animate-pulse-glow" />
          <span className="font-bold text-xl text-white">
            Ransom<span className="text-ransomguard-purple">Guard</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                {link.type === "section" ? (
                  <button
                    onClick={() => handleSectionClick(link.id!)}
                    className="text-gray-300 hover:text-ransomguard-purple transition"
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    to={link.path!}
                    className="text-gray-300 hover:text-ransomguard-purple transition"
                  >
                    {link.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <Link to="/signup">
            <Button className="bg-ransomguard-purple hover:bg-ransomguard-deep-purple">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className="w-6 flex flex-col gap-1">
            <span className={`block h-0.5 bg-white ${mobileMenuOpen && "rotate-45 translate-y-1.5"}`} />
            <span className={`block h-0.5 bg-white ${mobileMenuOpen && "opacity-0"}`} />
            <span className={`block h-0.5 bg-white ${mobileMenuOpen && "-rotate-45 -translate-y-1.5"}`} />
          </div>
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-ransomguard-dark-bg/95 backdrop-blur py-4">
          <ul className="flex flex-col items-center gap-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                {link.type === "section" ? (
                  <button
                    onClick={() => {
                      handleSectionClick(link.id!);
                      setMobileMenuOpen(false);
                    }}
                    className="text-gray-300 hover:text-ransomguard-purple transition"
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    to={link.path!}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-300 hover:text-ransomguard-purple transition"
                  >
                    {link.name}
                  </Link>
                )}
              </li>
            ))}

            <li className="w-full px-4 mt-2">
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-ransomguard-purple hover:bg-ransomguard-deep-purple">
                  Get Started
                </Button>
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
