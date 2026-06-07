type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
};

export function SectionHeading({ eyebrow, title, children }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-black uppercase tracking-[0.28em] text-[#b36b00]">{eyebrow}</p>
      <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-[#1b3b2b] sm:text-4xl lg:text-5xl">{title}</h2>
      {children ? <p className="mt-4 text-base leading-8 text-[#516253] sm:text-lg">{children}</p> : null}
    </div>
  );
}
