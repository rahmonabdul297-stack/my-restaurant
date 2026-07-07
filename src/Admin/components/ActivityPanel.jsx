const ActivityPanel = ({ dark, title, subtitle, items, emptyLabel }) => (
  <div
    className={`rounded-2xl border p-4 shadow-sm sm:p-5 ${dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"}`}
  >
    <div className="mb-4 flex items-center justify-between">
      <div>
        <p
          className={`text-sm font-semibold uppercase tracking-[0.24em] ${dark ? "text-slate-400" : "text-slate-500"}`}
        >
          {title}
        </p>
        <h3
          className={`text-lg font-semibold ${dark ? "text-white" : "text-slate-900"}`}
        >
          {subtitle}
        </h3>
      </div>
      <span
        className={`rounded-full px-3 py-1 text-sm font-medium ${dark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}
      >
        Live
      </span>
    </div>

    {items.length ? (
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className={`flex items-start justify-between gap-3 rounded-2xl border px-3 py-3 ${dark ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-slate-50"}`}
          >
            <div>
              <p
                className={`text-sm font-semibold ${dark ? "text-slate-100" : "text-slate-800"}`}
              >
                {item.label}
              </p>
              <p
                className={`mt-1 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}
              >
                {item.detail}
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${dark ? "bg-slate-800 text-slate-300" : "bg-white text-slate-600"}`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    ) : (
      <div
        className={`rounded-2xl border px-4 py-6 text-center text-sm ${dark ? "border-slate-800 bg-slate-950/70 text-slate-400" : "border-slate-200 bg-slate-50 text-slate-500"}`}
      >
        {emptyLabel}
      </div>
    )}
  </div>
);

export default ActivityPanel;
