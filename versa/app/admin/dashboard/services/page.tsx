'use client';

import ResourceManager from '@/components/admin/ResourceManager';
import type { FieldConfig } from '@/components/admin/fieldTypes';

const fields: FieldConfig[] = [
  { key: 'title', label: 'Service Title', type: 'text', required: true },
  { key: 'icon', label: 'Icon', type: 'select', options: ['globe', 'shopping-cart', 'graduation-cap', 'layout-dashboard', 'plug', 'gauge', 'shield', 'wrench'] },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'features', label: 'Features', type: 'tags' },
  { key: 'showOnHome', label: 'Show on Home page', type: 'boolean' },
  { key: 'visible', label: 'Visible on site', type: 'boolean' }
];

export default function ServicesAdminPage() {
  return <ResourceManager title="Services" apiPath="/admin/services" fields={fields} columns={['title']} />;
}
