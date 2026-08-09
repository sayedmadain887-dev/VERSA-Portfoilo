'use client';

import ResourceManager from '@/components/admin/ResourceManager';
import type { FieldConfig } from '@/components/admin/fieldTypes';

const fields: FieldConfig[] = [
  { key: 'name', label: 'Skill Name', type: 'text', required: true },
  { key: 'category', label: 'Category', type: 'text', required: true },
  { key: 'icon', label: 'Icon', type: 'select', options: ['layout', 'server', 'database', 'layers', 'shield', 'rocket', 'code'] },
  { key: 'level', label: 'Level (0-100)', type: 'number' },
  { key: 'visible', label: 'Visible on site', type: 'boolean' }
];

export default function SkillsAdminPage() {
  return <ResourceManager title="Skills" apiPath="/admin/skills" fields={fields} columns={['name', 'category']} />;
}
