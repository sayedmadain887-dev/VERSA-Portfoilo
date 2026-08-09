'use client';

import ResourceManager from '@/components/admin/ResourceManager';
import type { FieldConfig } from '@/components/admin/fieldTypes';

const fields: FieldConfig[] = [
  { key: 'title', label: 'Project Title', type: 'text', required: true },
  { key: 'slug', label: 'Slug (URL)', type: 'text', required: true },
  { key: 'category', label: 'Category', type: 'select', options: ['ecommerce', 'education', 'dashboard', 'business', 'portfolio', 'landing'] },
  { key: 'shortDescription', label: 'Short Description', type: 'textarea' },
  { key: 'fullDescription', label: 'Full Description', type: 'textarea' },
  { key: 'mainImage', label: 'Main Image', type: 'image' },
  { key: 'technologies', label: 'Technologies', type: 'tags' },
  { key: 'features', label: 'Features', type: 'tags' },
  { key: 'security', label: 'Security', type: 'tags' },
  { key: 'performance', label: 'Performance', type: 'tags' },
  { key: 'challenges', label: 'Challenges & Solutions', type: 'textarea' },
  { key: 'liveUrl', label: 'Live Demo URL', type: 'text' },
  { key: 'githubUrl', label: 'GitHub URL', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: ['completed', 'inProgress'] },
  { key: 'featured', label: 'Featured', type: 'boolean' },
  { key: 'visible', label: 'Visible on site', type: 'boolean' },
  { key: 'seoTitle', label: 'SEO Title', type: 'text' },
  { key: 'seoDescription', label: 'SEO Description', type: 'textarea' }
];

export default function ProjectsAdminPage() {
  return <ResourceManager title="Projects" apiPath="/admin/projects" fields={fields} columns={['title', 'category', 'status']} />;
}