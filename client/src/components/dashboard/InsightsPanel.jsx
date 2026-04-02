function InsightsPanel({ insights = [], savingsSuggestions = [] }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
      <div className="glass-panel p-6">
        <p className="text-lg font-semibold">Spending insights</p>
        <div className="mt-5 space-y-3">
          {insights.map((insight) => (
            <div key={insight} className="rounded-2xl border border-slate-200/70 p-4 dark:border-white/10">
              <p className="text-sm text-slate-700 dark:text-slate-200">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-6">
        <p className="text-lg font-semibold">AI savings suggestions</p>
        <div className="mt-5 space-y-3">
          {savingsSuggestions.length ? (
            savingsSuggestions.map((suggestion) => (
              <div key={suggestion.subscriptionId} className="rounded-2xl bg-coral/10 p-4">
                <p className="font-semibold text-coral">{suggestion.title}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-200">{suggestion.description}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Your current mix looks efficient. No high-priority cuts detected.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default InsightsPanel;
