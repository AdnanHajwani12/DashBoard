import { useRepo } from "../context/RepoContext";

export default function RepoDetails() {
  const { state, dispatch } = useRepo();
  const repo = state.selectedRepo;

  if (!repo) return null;

  return (
    <div className="fixed top-0 right-0 w-full md:w-1/3 h-full bg-slate-950 border-l border-slate-800 p-6 overflow-y-auto z-50">
      <button
        onClick={() => dispatch({ type: "CLEAR_REPO" })}
        className="text-slate-400 hover:text-white mb-4"
      >
        ✕ Close
      </button>

      <h2 className="text-2xl font-bold text-cyan-400">
        {repo.full_name}
      </h2>

      <p className="text-slate-400 mt-2">
        {repo.description || "No description provided."}
      </p>

      <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
        <div>⭐ Stars: {repo.stargazers_count}</div>
        <div>🍴 Forks: {repo.forks_count}</div>
        <div>🐛 Issues: {repo.open_issues_count}</div>
        <div>🧑 Owner: {repo.owner.login}</div>
      </div>

      <a
        href={repo.html_url}
        target="_blank"
        rel="noreferrer"
        className="inline-block mt-6 text-cyan-400 hover:underline"
      >
        View on GitHub →
      </a>
    </div>
  );
}
