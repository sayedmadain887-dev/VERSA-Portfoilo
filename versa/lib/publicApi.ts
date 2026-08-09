const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchPublic(path: string) {
  try {
    const res = await fetch(`${API_BASE}/public${path}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null; // backend not running / unreachable - callers fall back to static content
  }
}

export const publicApi = {
  getProjects: () => fetchPublic('/projects'),
  getProject: (slug: string) => fetchPublic(`/projects/${slug}`),
  getServices: () => fetchPublic('/services'),
  getSkills: () => fetchPublic('/skills'),
  getAbout: () => fetchPublic('/about'),
  getNavigation: () => fetchPublic('/navigation'),
  getHome: () => fetchPublic('/home'),
  getContactSettings: () => fetchPublic('/contact-settings'),
  getSiteSettings: () => fetchPublic('/site-settings')
};

export const BACKEND_ORIGIN = API_BASE.replace(/\/api$/, '');
