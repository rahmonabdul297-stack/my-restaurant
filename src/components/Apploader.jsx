export const Apploader = () => {
  return (
    <div
      className="w-full py-8"
      aria-label="loading skeleton"
      data-testid="loader"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-[24px] border border-AppRed/10 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="h-5 w-32 animate-pulse rounded-full bg-AppRed/20" />
        <div className="h-8 w-3/4 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-full animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="h-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
};
