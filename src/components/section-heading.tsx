type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
};

export function SectionHeading({ eyebrow, title, children }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-black uppercase tracking-[0.28em] text-[#feb96d]">{eyebrow}</p>
      <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-[#ffd485] sm:text-4xl lg:text-5xl">{title}</h2>
      {children ? <p className="mt-4 text-base leading-7 text-[#d4c4ac]">{children}</p> : null}
    </div>
  );
}
