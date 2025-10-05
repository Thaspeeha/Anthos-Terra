"use client";
import Image from "next/image";
//import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#faf6ef] via-[#f8f5e9] to-[#f5f2e4] relative overflow-hidden">
      
      {/* Floating background circles */}
      <div className="absolute w-[400px] h-[400px] bg-[#e2dcc5] rounded-full blur-3xl opacity-40 top-[-100px] left-[-150px] animate-pulse"></div>
      <div className="absolute w-[300px] h-[300px] bg-[#d9e0c7] rounded-full blur-3xl opacity-40 bottom-[-100px] right-[-100px] animate-pulse"></div>

      {/* Welcome text */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-5xl font-serif text-[#4A6544] mb-6"
      >
        Welcome to
      </motion.h1>

      {/* Logo animation */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="flex justify-center mb-6"
      >
        <Image
          src="/logo.jpg" 
          alt="Anthos Terra Logo"
          width={180}
          height={180}
          className="drop-shadow-lg animate-float"
        />
      </motion.div>

      {/* Subtitle */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-2xl md:text-3xl font-serif text-[#4A6544] mb-2 tracking-wide"
      >
        ANTHOS TERRA
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="italic text-gray-600 mb-10 text-center"
      >
        Where every bloom story is heard
      </motion.p>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push("/dashboard")}
        className="px-8 py-3 rounded-full bg-[#4A6544] text-white text-lg shadow-lg hover:bg-[#5b7a55] transition-all duration-300"
      >
        Go to Dashboard
      </motion.button>
    </div>
  );
}
