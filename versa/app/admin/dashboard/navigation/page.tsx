'use client';

import ResourceManager from '@/components/admin/ResourceManager';
import type { FieldConfig } from '@/components/admin/fieldTypes';

const fields: FieldConfig[] = [
  { key: 'label', label: 'Label', type: 'text', required: true },
  { key: 'href', label: 'Link (e.g. /about or https://...)', type: 'text', required: true },
  { key: 'external', label: 'Opens in new tab / external link', type: 'boolean' },
  { key: 'visible', label: 'Visible in menu', type: 'boolean' }
];

export default function NavigationAdminPage() {
  return <ResourceManager title="Navigation" apiPath="/admin/navigation" fields={fields} columns={['label', 'href']} />;
}
