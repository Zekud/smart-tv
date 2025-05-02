"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavbarProps {
  activeItem: string;
  onNavigate: (item: string) => void;
}

export default function Navbar({ activeItem, onNavigate }: NavbarProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const navItems = [
    { id: "destpek", label: "Destpek", src: "/images/nav1.png" },
    { id: "muzik", label: "Müzik", src: "/images/nav2.png" },
    { id: "sinema", label: "Sinema", src: "/images/nav3.svg" },
    { id: "stream", label: "Stream", src: "/images/nav4.svg" },
  ];

  const rightNavItems = [
    { id: "yekbuntv", label: "YekBünTV", src: "/images/nav5.svg" },
    { id: "zaroktv", label: "ZarokTV", src: "/images/nav6.png" },
    { id: "eyar", label: "Eyar", src: "/images/nav7.png" },
    { id: "archiv", label: "Archiv", src: "/images/nav8.svg" },
    { id: "user", label: "User", src: "/images/nav9.png" },
  ];

  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        {navItems.map((item) => (
          <motion.div
            key={item.id}
            className={cn(
              "nav-icon",
              activeItem === item.id && "nav-icon-active"
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate(item.id)}
          >
            <div className="relative w-12 h-12 rounded-full bg-white bg-opacity-10">
              <Image
                src={item.src}
                alt={item.label}
                fill
                className={cn(
                  "object-contain opacity-70",
                  activeItem === item.id && "opacity-100"
                )}
              />
            </div>
            <span
              className={cn(
                "text-sm mt-1",
                activeItem === item.id ? "text-primary" : "text-gray-400"
              )}
            >
              {item.label}
            </span>
            {activeItem === item.id && (
              <motion.div
                className="h-1 w-6 bg-primary rounded-full mt-1"
                layoutId="activeIndicator"
              />
            )}
          </motion.div>
        ))}
      </div>

      <div className="relative flex items-center gap-2">
        <motion.div
          className={cn(
            "flex items-center bg-white bg-opacity-10 rounded-full px-4 py-2",
            searchFocused && "ring-2 ring-primary"
          )}
          animate={{ width: searchFocused ? 400 : 300 }}
        >
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent border-none outline-none w-full text-white"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Search className="text-gray-400" />
        </motion.div>
        <div className="ml-2 w-10 h-10 rounded-full bg-white flex items-center justify-center cursor-pointer">
          <Image
            src="/images/micraphone.png"
            alt="Microphone"
            width={40}
            height={40}
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        {rightNavItems.map((item) => (
          <motion.div
            key={item.id}
            className={cn(
              "nav-icon",
              activeItem === item.id && "nav-icon-active"
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate(item.id)}
          >
            <div className="w-12 h-12 rounded-full bg-white bg-opacity-10 flex items-center justify-center">
              <Image
                src={item.src}
                alt={item.label}
                width={40}
                height={40}
                className={cn(
                  "opacity-70 rounded-full",
                  activeItem === item.id && "opacity-100"
                )}
              />
            </div>
            <span
              className={cn(
                "text-sm mt-1",
                activeItem === item.id ? "text-primary" : "text-gray-400"
              )}
            >
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </nav>
  );
}
