import type { Release } from '../types';

const GITHUB_API_BASE = 'https://api.github.com/repos';

export const fetchReleases = async (owner: string, repo: string, page: number = 1, perPage: number = 30): Promise<Release[]> => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/${owner}/${repo}/releases?page=${page}&per_page=${perPage}`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }
    const data = await response.json();
    
    // Map GitHub API response to our Release interface
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((item: any) => ({
      id: item.id,
      tagName: item.tag_name,
      name: item.name || item.tag_name,
      body: item.body,
      publishedAt: item.published_at,
      htmlUrl: item.html_url,
      sourceId: `${owner}/${repo}`,
      isRead: false
    }));
  } catch (error) {
    console.error(`Error fetching releases for ${owner}/${repo}:`, error);
    return [];
  }
};
