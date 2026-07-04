"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  ArrowRight,
  Award,
  Bug,
  Calendar,
  CheckCircle,
  Flower2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";

export default function AboutUsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const isStatsInView = useInView(statsRef, { once: false, amount: 0.3 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 42]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 16]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -16]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.16,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  const services = [
    {
      icon: <GraduationCap className="h-6 w-6" />,
      secondaryIcon: <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-[#8aa884]" />,
      title: "Scientific training",
      description:
        "Hands-on beekeeping instruction blends field demonstrations, hive handling, colony care, and practical learning for new and experienced trainees.",
      position: "left" as const,
    },
    {
      icon: <Bug className="h-6 w-6" />,
      secondaryIcon: <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-[#8aa884]" />,
      title: "Queen rearing and hive skills",
      description:
        "The center covers specialized topics including queen rearing, colony multiplication, bee behavior, and better management practices for productive apiaries.",
      position: "left" as const,
    },
    {
      icon: <Flower2 className="h-6 w-6" />,
      secondaryIcon: <Star className="absolute -top-1 -right-1 h-4 w-4 text-[#8aa884]" />,
      title: "Pollination and rural value",
      description:
        "Beekeeping here is taught as both livelihood support and agricultural support, connecting better pollination with stronger rural outcomes.",
      position: "left" as const,
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      secondaryIcon: <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-[#8aa884]" />,
      title: "Institutional backing",
      description:
        "API CULTURE works within a public-sector development ecosystem, giving trainees confidence in the center's mission, discipline, and continuity.",
      position: "right" as const,
    },
    {
      icon: <Users className="h-6 w-6" />,
      secondaryIcon: <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-[#8aa884]" />,
      title: "Community-focused outreach",
      description:
        "The work supports farmers, women groups, rural youth, and aspiring entrepreneurs through awareness, skill transfer, and field-ready guidance.",
      position: "right" as const,
    },
    {
      icon: <Award className="h-6 w-6" />,
      secondaryIcon: <Star className="absolute -top-1 -right-1 h-4 w-4 text-[#8aa884]" />,
      title: "Field-led execution",
      description:
        "From training batches to apiary demonstrations and honey-related practice, the emphasis stays on applied outcomes instead of brochure-level theory.",
      position: "right" as const,
    },
  ];

  const stats = [
    { icon: <Award />, value: 22, label: "Years active", suffix: "+" },
    { icon: <Users />, value: 1200, label: "Learners reached", suffix: "+" },
    { icon: <Calendar />, value: 30, label: "Seats per batch", suffix: "" },
    { icon: <TrendingUp />, value: 4, label: "Current program tracks", suffix: "" },
  ];

  return (
    <section
      id="about-section"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#f7f2e8] via-[#fbf7ef] to-[#f4ecde] px-4 py-24 text-[#173f33]"
    >
      <motion.div
        className="absolute top-16 left-10 h-64 w-64 rounded-full bg-[#f2b544]/10 blur-3xl"
        style={{ y: y1, rotate: rotate1 }}
      />
      <motion.div
        className="absolute right-10 bottom-16 h-80 w-80 rounded-full bg-[#8aa884]/10 blur-3xl"
        style={{ y: y2, rotate: rotate2 }}
      />
      <motion.div
        className="absolute top-1/3 left-[12%] h-4 w-4 rounded-full bg-[#f2b544]/40"
        animate={{ y: [0, -14, 0], opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[18%] bottom-1/4 h-6 w-6 rounded-full bg-[#8aa884]/30"
        animate={{ y: [0, 16, 0], opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
      />

      <motion.div
        className="relative z-10 mx-auto max-w-7xl"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className="mb-6 flex flex-col items-center" variants={itemVariants}>
          <motion.span
            className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-[#b36b00]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Zap className="h-4 w-4" />
            Discover our story
          </motion.span>
          <h2 className="font-display text-center text-4xl md:text-5xl">About Us</h2>
          <motion.div
            className="mt-4 h-1 bg-[#b36b00]"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        <motion.p className="mx-auto mb-16 max-w-3xl text-center text-base leading-8 text-[#52635c]" variants={itemVariants}>
          API CULTURE Technology Center is a field-focused apiculture institution in Hyderabad dedicated to scientific
          beekeeping, practical training, pollination awareness, and rural livelihood support through disciplined,
          applied learning.
        </motion.p>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-16">
            {services
              .filter((service) => service.position === "left")
              .map((service, index) => (
                <ServiceItem
                  key={`left-${service.title}`}
                  icon={service.icon}
                  secondaryIcon={service.secondaryIcon}
                  title={service.title}
                  description={service.description}
                  variants={itemVariants}
                  delay={index * 0.16}
                  direction="left"
                />
              ))}
          </div>

          <div className="order-first mb-8 flex items-center justify-center md:order-none md:mb-0">
            <motion.div className="relative w-full max-w-sm" variants={itemVariants}>
              <motion.div
                className="overflow-hidden rounded-[1.5rem] shadow-[0_24px_56px_rgba(85,64,25,0.18)]"
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src="/field-beekeeping.jpg"
                    alt="API CULTURE field training"
                    fill
                    sizes="(min-width: 768px) 24rem, 100vw"
                    className="object-cover"
                  />
                  <motion.div
                    className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[#173f33]/65 via-[#173f33]/10 to-transparent p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <Link
                      href="/programs"
                      className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#173f33]"
                    >
                      Explore programs <ArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                className="absolute inset-0 -z-10 -m-3 rounded-[1.8rem] border-4 border-[#d7e6cd]"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />

              <motion.div
                className="absolute -top-5 -right-8 h-16 w-16 rounded-full bg-[#f2b544]/12"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
                style={{ y: y1 }}
              />
              <motion.div
                className="absolute -bottom-6 -left-10 h-20 w-20 rounded-full bg-[#8aa884]/14"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.1 }}
                style={{ y: y2 }}
              />
            </motion.div>
          </div>

          <div className="space-y-16">
            {services
              .filter((service) => service.position === "right")
              .map((service, index) => (
                <ServiceItem
                  key={`right-${service.title}`}
                  icon={service.icon}
                  secondaryIcon={service.secondaryIcon}
                  title={service.title}
                  description={service.description}
                  variants={itemVariants}
                  delay={index * 0.16}
                  direction="right"
                />
              ))}
          </div>
        </div>

        <motion.div
          ref={statsRef}
          className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          animate={isStatsInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <StatCounter
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              delay={index * 0.1}
            />
          ))}
        </motion.div>

        <motion.div
          className="mt-20 flex flex-col items-center justify-between gap-6 rounded-[1.8rem] bg-[#173f33] p-8 text-white md:flex-row"
          initial={{ opacity: 0, y: 30 }}
          animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="flex-1">
            <h3 className="text-2xl font-medium">Ready to learn beekeeping with real field grounding?</h3>
            <p className="mt-2 text-white/80">Explore current batches or contact the center for training guidance.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 rounded-lg bg-[#f2b544] px-6 py-3 font-medium text-[#173f33] transition-colors hover:bg-[#f5c15f]"
            >
              View programs <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 font-medium text-white transition-colors hover:bg-white/8"
            >
              Contact us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

interface ServiceItemProps {
  icon: React.ReactNode;
  secondaryIcon?: React.ReactNode;
  title: string;
  description: string;
  variants: {
    hidden: { opacity: number; y?: number };
    visible: { opacity: number; y?: number; transition: { duration: number; ease: "easeOut" } };
  };
  delay: number;
  direction: "left" | "right";
}

function ServiceItem({ icon, secondaryIcon, title, description, variants, delay, direction }: ServiceItemProps) {
  return (
    <motion.div
      className="group flex flex-col"
      variants={variants}
      transition={{ delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="mb-3 flex items-center gap-3"
        initial={{ x: direction === "left" ? -20 : 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.2 }}
      >
        <motion.div
          className="relative rounded-lg bg-[#f2b544]/12 p-3 text-[#b36b00] transition-colors duration-300 group-hover:bg-[#f2b544]/20"
          whileHover={{ rotate: [0, -8, 8, -4, 0], transition: { duration: 0.5 } }}
        >
          {icon}
          {secondaryIcon}
        </motion.div>
        <h3 className="text-xl font-medium text-[#173f33] transition-colors duration-300 group-hover:text-[#b36b00]">
          {title}
        </h3>
      </motion.div>
      <motion.p
        className="pl-12 text-sm leading-relaxed text-[#52635c]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.4 }}
      >
        {description}
      </motion.p>
      <div className="mt-3 pl-12 text-xs font-medium text-[#b36b00] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="inline-flex items-center gap-1">
          Learn more <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </motion.div>
  );
}

interface StatCounterProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix: string;
  delay: number;
}

function StatCounter({ icon, value, label, suffix, delay }: StatCounterProps) {
  const countRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(countRef, { once: false });

  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 10,
  });

  useEffect(() => {
    springValue.set(isInView ? value : 0);
  }, [isInView, springValue, value]);

  const displayValue = useTransform(springValue, (latest) => Math.floor(latest));

  return (
    <motion.div
      className="group flex flex-col items-center rounded-[1.4rem] bg-white/70 p-6 text-center shadow-[0_18px_40px_rgba(91,73,35,0.08)] backdrop-blur-sm transition-colors duration-300 hover:bg-white"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay },
        },
      }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#173f33]/5 text-[#b36b00] transition-colors duration-300 group-hover:bg-[#f2b544]/12"
        whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
      >
        {icon}
      </motion.div>
      <motion.div ref={countRef} className="flex items-center text-3xl font-bold text-[#173f33]">
        <motion.span>{displayValue}</motion.span>
        <span>{suffix}</span>
      </motion.div>
      <p className="mt-1 text-sm text-[#52635c]">{label}</p>
      <motion.div className="mt-3 h-0.5 w-10 bg-[#b36b00] transition-all duration-300 group-hover:w-16" />
    </motion.div>
  );
}
