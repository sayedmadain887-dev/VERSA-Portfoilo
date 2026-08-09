export type ServiceItem = { icon: string; title: string; desc: string; features: string[] };

export function mapBackendService(doc: any): ServiceItem {
  return {
    icon: doc.icon || 'globe',
    title: doc.title,
    desc: doc.description || '',
    features: doc.features || []
  };
}
