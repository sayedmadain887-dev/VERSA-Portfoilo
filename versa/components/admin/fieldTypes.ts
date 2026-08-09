export type FieldConfig = {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'tags' | 'date'| "image" | "imageList";
  options?: string[];
  required?: boolean;
};
