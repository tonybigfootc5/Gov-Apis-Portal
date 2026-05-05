type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
};

export function SectionHeading({ eyebrow, title, children }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-700">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-emerald-950 sm:text-4xl">{title}</h2>
      {children ? <p className="mt-4 text-base leading-7 text-stone-700">{children}</p> : null}
    </div>
  );
}
