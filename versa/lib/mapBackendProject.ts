import type { Project } from './projectTypes';

export function mapBackendProject(doc: any): Project {
  return {
    slug: doc.slug,
    category: doc.category || 'business',
    title: doc.title,
    tagline: doc.shortDescription || '',
    shortDesc: doc.shortDescription || '',
    status: doc.status === 'inProgress' ? 'inProgress' : 'completed',
    date: doc.completionDate ? new Date(doc.completionDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) : '',
    techs: doc.technologies || [],
    highlights: (doc.features || []).slice(0, 3),
    liveUrl: doc.liveUrl || '#',
    githubUrl: doc.githubUrl || '#',
    overview: doc.fullDescription || doc.shortDescription || '',
    features: doc.features || [],
    challenges: doc.challenges || doc.solutions || '',
    securityList: doc.security || [],
    performanceList: doc.performance || [],
    resultsList: [],
    mainImage: doc.mainImage || undefined,
    galleryImages: doc.galleryImages || []
  };
}