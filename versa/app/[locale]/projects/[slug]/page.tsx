import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectDetailHero from '@/components/projects/detail/ProjectDetailHero';
import ProjectDetailBody from '@/components/projects/detail/ProjectDetailBody';
import type { Project } from '@/lib/projectTypes';
import { mapBackendProject } from '@/lib/mapBackendProject';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getDynamicProject(slug: string): Promise<Project | null> {
  try {
    const res = await fetch(`${API_BASE}/api/public/projects/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.project ? mapBackendProject(data.project) : null;
  } catch {
    return null; // backend unreachable - fall back to static content below
  }
}

export default async function ProjectDetailPage({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string };
}) {
  const t = await getTranslations({ locale, namespace: 'projectsPage' });

  // Prefer live CMS content; fall back to the built-in project set if the
  // backend isn't running or this project wasn't created through the admin.
  const dynamicProject = await getDynamicProject(slug);
  const staticProjects = t.raw('items') as Project[];
  const project = dynamicProject || staticProjects.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <>
      <Navbar />
      <ProjectDetailHero project={project} />
      <ProjectDetailBody project={project} />
      <Footer />
    </>
  );
}
