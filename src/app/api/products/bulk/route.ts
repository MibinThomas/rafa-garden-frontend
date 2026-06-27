import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { rows } = await req.json();

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'No rows provided' }, { status: 400 });
    }

    const results: { row: number; id: string; name: string; status: 'created' | 'updated' | 'error'; error?: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const id = String(row.id || '').trim();
        const name = String(row.name || '').trim();
        const category = String(row.category || '').trim();

        if (!id || !name || !category) {
          results.push({ row: i + 2, id, name, status: 'error', error: 'id, name, category are required' });
          continue;
        }

        // Parse variants: variant1_size, variant1_unit, variant1_price
        const variants: { size: string; unit: string; price: number }[] = [];
        for (let v = 1; v <= 5; v++) {
          const size = String(row[`variant${v}_size`] || '').trim();
          const unit = String(row[`variant${v}_unit`] || '').trim();
          const price = parseFloat(row[`variant${v}_price`] || '0');
          if (size && unit) variants.push({ size, unit, price: isNaN(price) ? 0 : price });
        }

        const tags = row.tags ? String(row.tags).split(',').map((t: string) => t.trim()).filter(Boolean) : [];

        const productData: any = {
          id,
          name,
          slug: row.slug ? String(row.slug).trim() : slugify(name),
          category,
          image: String(row.image || '/images/placeholder.png').trim(),
          description: String(row.description || row.shortDescription || name).trim(),
          shortDescription: String(row.shortDescription || '').trim(),
          price: parseFloat(row.price || '0') || 0,
          sku: String(row.sku || '').trim() || undefined,
          stock: parseInt(row.stock || '0') || 0,
          stockStatus: ['in-stock', 'low-stock', 'out-of-stock'].includes(row.stockStatus) ? row.stockStatus : 'in-stock',
          lowStockThreshold: parseInt(row.lowStockThreshold || '10') || 10,
          weight: String(row.weight || '').trim() || undefined,
          ingredients: String(row.ingredients || '').trim() || undefined,
          nutritionalInfo: String(row.nutritionalInfo || '').trim() || undefined,
          packaging: String(row.packaging || '').trim() || undefined,
          tags,
          variants,
          featured: ['true', '1', 'yes'].includes(String(row.featured || '').toLowerCase()),
          bestSeller: ['true', '1', 'yes'].includes(String(row.bestSeller || '').toLowerCase()),
          newArrival: ['true', '1', 'yes'].includes(String(row.newArrival || '').toLowerCase()),
          active: !['false', '0', 'no'].includes(String(row.active || 'true').toLowerCase()),
          sortOrder: parseInt(row.sortOrder || '0') || 0,
          seoTitle: String(row.seoTitle || '').trim() || undefined,
          seoDescription: String(row.seoDescription || '').trim() || undefined,
        };

        if (row.offerPrice) productData.offerPrice = parseFloat(row.offerPrice) || undefined;

        const existing = await Product.findOne({ id });
        if (existing) {
          await Product.findOneAndUpdate({ id }, productData);
          results.push({ row: i + 2, id, name, status: 'updated' });
        } else {
          await Product.create(productData);
          results.push({ row: i + 2, id, name, status: 'created' });
        }
      } catch (err: any) {
        results.push({ row: i + 2, id: String(row.id || ''), name: String(row.name || ''), status: 'error', error: err.message });
      }
    }

    const created = results.filter(r => r.status === 'created').length;
    const updated = results.filter(r => r.status === 'updated').length;
    const errors = results.filter(r => r.status === 'error').length;

    return NextResponse.json({ results, summary: { created, updated, errors, total: rows.length } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
