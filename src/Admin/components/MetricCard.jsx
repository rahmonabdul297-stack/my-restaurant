const MetricCard = ({
  icon,
  title,
  value,
  subtitle,
  accent,
  dark,
  href,
  actionLabel,
}) => {
  const baseClass = `rounded-2xl border p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1 ${dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"}`;

  const content = (
    <div className={baseClass}>
      <div
        className={`inline-flex rounded-2xl bg-gradient-to-r ${accent} px-3 py-2 text-xl`}
      >
        {icon}
      </div>
      <p
        className={`mt-4 text-sm font-medium ${dark ? "text-slate-400" : "text-slate-500"}`}
      >
        {title}
      </p>
      <p
        className={`mt-2 text-3xl font-semibold ${dark ? "text-white" : "text-slate-900"}`}
      >
        {value}
      </p>
      <p
        className={`mt-2 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}
      >
        {subtitle}
      </p>
      {actionLabel ? (
        <div
          className={`mt-4 text-sm font-semibold ${dark ? "text-sky-400" : "text-indigo-600"}`}
        >
          {actionLabel}
        </div>
      ) : null}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return content;
};

export default MetricCard;
