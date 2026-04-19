import * as XLSX from 'xlsx';

export interface ProductVariant {
  size: string;
  unit: string;
  price?: number;
}

export interface BulkProductRow {
  ID: string;
  Name: string;
  Description: string;
  Category: string;
  ImageUrl: string;
  Active: string;
  Variants: string; // Formatted as "Size|Unit|Price;Size|Unit|Price"
}

/**
 * Parses the Variants string from the Excel sheet into structured data
 */
export function parseVariantString(variantStr: string): ProductVariant[] {
  if (!variantStr) return [];
  
  // Handle potential non-string types if coming from Excel loosely
  const str = String(variantStr);
  
  return str.split(';').map(v => {
    const [size, unit, price] = v.split('|').map(s => s.trim());
    return {
      size: size || "",
      unit: unit || "",
      price: price ? parseFloat(price) : undefined
    };
  }).filter(v => v.size || v.unit);
}

/**
 * Formats variants array into a single string for Excel/CSV
 */
export function formatVariantString(variants: ProductVariant[]): string {
  if (!variants || variants.length === 0) return "";
  
  return variants
    .map(v => `${v.size}|${v.unit}|${v.price || ''}`)
    .join('; ');
}

/**
 * Converts Product documents to Excel/CSV Buffer or String
 */
export function productsToFileContent(products: any[], format: 'xlsx' | 'csv'): Uint8Array | string {
  const rows: BulkProductRow[] = products.map(p => ({
    ID: p.id,
    Name: p.name,
    Description: p.description,
    Category: p.category,
    ImageUrl: p.image,
    Active: p.active ? 'Yes' : 'No',
    Variants: formatVariantString(p.variants)
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
  
  if (format === 'csv') {
    return XLSX.utils.sheet_to_csv(worksheet);
  }

  // Set column widths for XLSX
  worksheet['!cols'] = [
    { wch: 10 }, { wch: 30 }, { wch: 50 }, { wch: 15 }, { wch: 40 }, { wch: 10 }, { wch: 40 },
  ];

  const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
  return new Uint8Array(buffer);
}

/**
 * Parses File Buffer/String into Product documents
 */
export function fileContentToProducts(data: any): any[] {
  const workbook = XLSX.read(data, { type: data instanceof ArrayBuffer ? 'array' : 'string' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet) as BulkProductRow[];

  return rows.map(row => ({
    id: String(row.ID || ''),
    name: String(row.Name || ''),
    description: String(row.Description || ''),
    category: String(row.Category || ''),
    image: String(row.ImageUrl || ''),
    active: String(row.Active || '').toLowerCase() === 'yes',
    variants: parseVariantString(row.Variants || '')
  }));
}
