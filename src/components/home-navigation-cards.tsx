"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

type HomeNavigationCard = {
  label: string;
  title: string;
  text: string;
  href: string;
  backgroundSrc: string;
};

type HomeNavigationCardsProps = {
  cards: ReadonlyArray<HomeNavigationCard>;
};

const cardShellClipPath = "polygon(16% 0%,84% 0%,100% 8%,100% 88%,50% 100%,0% 88%,0% 8%)";
const cardMediaClipPath = "polygon(18% 0%,82% 0%,100% 18%,100% 78%,50% 100%,0% 78%,0% 18%)";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const contentVariants = {
  rest: { y: 0 },
  hover: {
    y: -8,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function HomeNavigationCards({ cards }: HomeNavigationCardsProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="grid gap-7 md:grid-cols-2 xl:grid-cols-4"
    >
      {cards.map(({ label, title, text, href, backgroundSrc }) => (
        <motion.div
          key={title}
          variants={cardVariants}
          whileHover={{
            y: -12,
            rotateX: -3,
            rotateY: 2,
            transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
          }}
          style={{ transformStyle: "preserve-3d" }}
          className="group [perspective:1400px]"
        >
          <Link
            href={href}
            style={{ clipPath: cardShellClipPath }}
            className="relative block overflow-hidden border border-white/78 bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(251,250,247,0.42)_100%)] px-4 pb-8 pt-4 shadow-[0_24px_60px_rgba(88,71,33,0.12),inset_0_1px_0_rgba(255,255,255,0.86)] backdrop-blur-[10px] transition duration-300 hover:shadow-[0_34px_82px_rgba(88,71,33,0.18),inset_0_1px_0_rgba(255,255,255,0.92)]"
          >
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -left-10 top-8 h-40 w-28 rounded-full bg-[radial-gradient(circle,rgba(255,222,160,0.52)_0%,rgba(255,222,160,0)_72%)] blur-2xl"
              whileHover={{ x: 18, opacity: 1.05 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="pointer-events-none absolute inset-x-8 top-3 h-8 rounded-full bg-white/55 blur-xl" />

            <motion.div
              style={{ clipPath: cardMediaClipPath }}
              className="relative mx-auto overflow-hidden border border-white/85 shadow-[0_18px_38px_rgba(25,33,29,0.18)]"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative aspect-[1.1/0.88]">
                <Image
                  src={backgroundSrc}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 18rem, (min-width: 768px) 45vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.08]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,16,20,0.04)_0%,rgba(7,16,20,0.16)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(4,10,12,0)_0%,rgba(4,10,12,0.5)_100%)]" />

                <motion.div
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/58 bg-white/62 text-[#173f33] shadow-[0_14px_30px_rgba(0,0,0,0.12)] backdrop-blur-[8px]"
                  initial={{ opacity: 0, scale: 0.8, y: -8 }}
                  whileHover={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              variants={contentVariants}
              initial="rest"
              whileHover="hover"
              className="px-3 pb-2 pt-6 sm:px-4"
            >
              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#a7a49d]">{label}</p>
              <h2 className="font-display mt-4 text-[2.15rem] leading-[0.94] tracking-[-0.045em] text-[#173f33]">
                {title}
              </h2>
              <p className="mt-4 text-[1.02rem] leading-8 text-[#66776f]">{text}</p>

              <motion.div
                aria-hidden="true"
                className="mt-6 flex items-center gap-2"
                initial={{ opacity: 0.7 }}
                whileHover={{ opacity: 1 }}
              >
                <span className="h-px w-12 bg-[linear-gradient(90deg,rgba(242,181,68,0.9),rgba(242,181,68,0.18))]" />
                <span className="h-2 w-2 rounded-full bg-[#f2b544]" />
              </motion.div>
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
