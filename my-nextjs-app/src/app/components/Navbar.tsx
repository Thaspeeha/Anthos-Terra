"use client";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks: string[] = ["Home", "About Us", "Contact Us", "Contribute"];

const pageMap: Record<string, string> = {
  "/": "Home",
  "/about-us": "About Us",
  "/contact-us": "Contact Us",
  "/contribute": "Contribute",
};

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const activePage = pageMap[pathname] || "Home";
  return (
    <header className="w-full bg-[#73917E] fixed top-0 left-0 z-50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between h-[163px] px-6 md:px-12">
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-[93px] h-[89px] rounded-full overflow-hidden flex-shrink-0">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={93}
              height={89}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-italiana text-white text-[32px] md:text-[40px] leading-[38px] md:leading-[47px]">
              ANTHOS TERRA
            </span>
            <span className="font-lato text-white text-[14px] md:text-[18px] leading-[18px] md:leading-[22px]">
              Where every bloom story is heard
            </span>
          </div>
        </div>
        {/* Center: Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <span
              key={link}
              className={`text-white font-inter font-medium text-[16px] md:text-[18px] cursor-pointer relative pb-1
                ${activePage === link ? "after:block after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:bg-white" : ""}
              `}
            >
              {link}
            </span>
          ))}
        </nav>
        {/* Right: Greeting */}
        <div className="flex items-center gap-4 md:gap-6">
          <span className="text-white font-inter font-medium text-[16px] md:text-[20px]">
            Hey User!
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
