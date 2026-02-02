import { useEffect, useState } from "react";
import { useRepo } from "../context/RepoContext";
import { searchRepos } from "../services/githubApi";
import RepoDetails from "../components/RepoDetails";
import useDebounce from "../hooks/useDebounce";
import MetricsBar from "../components/MetricsBar";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("stars");
  const debouncedQuery = useDebounce(query, 600);
  const { state, dispatch } = useRepo();

  useEffect(() => {
    if (!debouncedQuery.trim()) return;

    // 🔥 CACHE HIT
    if (state.cache[debouncedQuery]) {
      dispatch({
        type: "CACHE_HIT",
        payload: state.cache[debouncedQuery],
      });
      return;
    }

    async function fetchRepos() {
      dispatch({ type: "FETCH_START" });

      try {
        const repos = await searchRepos(debouncedQuery);

        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            query: debouncedQuery,
            repos,
          },
        });
      } catch (err) {
        if (err.message === "RATE_LIMIT") {
          dispatch({
            type: "FETCH_ERROR",
            payload:
              "GitHub API rate limit reached. Please wait a few minutes and try again.",
          });
        } else {
          dispatch({
            type: "FETCH_ERROR",
            payload: "Failed to fetch repositories",
          });
        }
      }
    }

    fetchRepos();
  }, [debouncedQuery, dispatch, state.cache]);
  const sortedRepos = [...state.repos].sort((a, b) => {
  if (sortBy === "stars") {
    return b.stargazers_count - a.stargazers_count;
  }
  if (sortBy === "forks") {
    return b.forks_count - a.forks_count;
  }
  if (sortBy === "issues") {
    return b.open_issues_count - a.open_issues_count;
  }
  return 0;
});


  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-cyan-400">
          Open Source Intelligence Dashboard
        </h1>
        <p className="text-slate-400">
          Monitor open-source repository activity
        </p>
      </header>
    {/* 🔽 Sorting Controls */}
<div className="flex gap-2 mb-6">
  <button
    onClick={() => setSortBy("stars")}
    className={`px-4 py-2 rounded text-sm border ${
      sortBy === "stars"
        ? "bg-cyan-600 border-cyan-500"
        : "bg-slate-900 border-slate-700"
    }`}
  >
    ⭐ Stars
  </button>

  <button
    onClick={() => setSortBy("forks")}
    className={`px-4 py-2 rounded text-sm border ${
      sortBy === "forks"
        ? "bg-cyan-600 border-cyan-500"
        : "bg-slate-900 border-slate-700"
    }`}
  >
    🍴 Forks
  </button>

  <button
    onClick={() => setSortBy("issues")}
    className={`px-4 py-2 rounded text-sm border ${
      sortBy === "issues"
        ? "bg-cyan-600 border-cyan-500"
        : "bg-slate-900 border-slate-700"
    }`}
  >
    🐛 Issues
  </button>
</div>

      {/* 🔥 METRICS BAR (THIS WAS MISSING) */}
      <MetricsBar />

      {/* Search */}
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Search repositories (react, kubernetes, security...)"
          className="flex-1 px-4 py-2 rounded bg-slate-800 border border-slate-700 focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* States */}
      {state.loading && <p>Loading repositories...</p>}

      {state.error && (
        <div className="mb-4 p-4 rounded bg-red-900/40 border border-red-700 text-red-300">
          {state.error}
        </div>
      )}

      {!state.loading && state.repos.length === 0 && (
        <p className="text-slate-500">Search to begin analysis</p>
      )}

      {/* Repo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedRepos.map((repo) => (
          <div
            key={repo.id}
            onClick={() =>
              dispatch({ type: "SELECT_REPO", payload: repo })
            }
            className="p-4 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500 cursor-pointer transition"
          >
            <h2 className="font-semibold text-lg text-cyan-300">
              {repo.full_name}
            </h2>
            <p className="text-sm text-slate-400 line-clamp-2">
              {repo.description}
            </p>

            <div className="flex justify-between text-xs mt-3 text-slate-500">
              <span>⭐ {repo.stargazers_count}</span>
              <span>🍴 {repo.forks_count}</span>
              <span>🐛 {repo.open_issues_count}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Repo Details Side Panel */}
      <RepoDetails />
    </div>
  );
}
