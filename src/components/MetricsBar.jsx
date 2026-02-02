import { useRepo } from "../context/RepoContext";

export default function MetricsBar() {
  const { state } = useRepo();
  const repos = state.repos;

  if (!repos || repos.length === 0) return null;

  const totalRepos = repos.length;
  const totalStars = repos.reduce(
    (sum, r) => sum + r.stargazers_count,
    0
  );
  const totalForks = repos.reduce(
    (sum, r) => sum + r.forks_count,
    0
  );
  const totalIssues = repos.reduce(
    (sum, r) => sum + r.open_issues_count,
    0
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Metric label="Repositories" value={totalRepos} />
      <Metric label="Total Stars" value={totalStars} />
      <Metric label="Total Forks" value={totalForks} />
      <Metric label="Open Issues" value={totalIssues} />
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="p-4 rounded bg-slate-900 border border-slate-800">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-2xl font-bold text-cyan-400">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
