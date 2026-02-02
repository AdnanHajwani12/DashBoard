import { createContext, useContext, useReducer } from "react";

const RepoContext = createContext();

const initialState = {
  repos: [],
  selectedRepo: null,
  loading: false,
  error: null,
  cache: {}, 
};

function repoReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };

    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        repos: action.payload.repos,
        cache: {
          ...state.cache,
          [action.payload.query]: action.payload.repos,
        },
      };

    case "CACHE_HIT":
      return {
        ...state,
        loading: false,
        repos: action.payload,
      };

    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "SELECT_REPO":
      return { ...state, selectedRepo: action.payload };

    case "CLEAR_REPO":
      return { ...state, selectedRepo: null };

    default:
      return state;
  }
}

export function RepoProvider({ children }) {
  const [state, dispatch] = useReducer(repoReducer, initialState);

  return (
    <RepoContext.Provider value={{ state, dispatch }}>
      {children}
    </RepoContext.Provider>
  );
}

export function useRepo() {
  return useContext(RepoContext);
}
