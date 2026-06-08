import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  bodyClassName?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  children,
  className,
  eyebrowClassName,
  titleClassName,
  bodyClassName,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <p className={cn("text-xs font-black uppercase tracking-[0.28em] text-[#b36b00]", eyebrowClassName)}>{eyebrow}</p>
      <h2 className={cn("font-display mt-3 text-3xl font-semibold tracking-tight text-[#1b3b2b] sm:text-4xl lg:text-5xl", titleClassName)}>
        {title}
      </h2>
      {children ? <p className={cn("mt-4 text-base leading-8 text-[#516253] sm:text-lg", bodyClassName)}>{children}</p> : null}
    </div>
  );
}
