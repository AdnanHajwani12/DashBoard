import axios from "axios";

const api = axios.create({
  baseURL: "https://api.github.com",
});

export async function searchRepos(query) {
  try {
    const response = await api.get(
      `/search/repositories?q=${query}&sort=stars&order=desc`
    );
    return response.data.items;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      throw new Error("RATE_LIMIT");
    }
    throw error;
  }
}
