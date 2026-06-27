"use client";
import { useState, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
import {
  X, Upload, FileSpreadsheet, Download, CheckCircle2,
  XCircle, AlertTriangle, RefreshCw, ChevronDown, ChevronUp, Info
} from "lucide-react";

const REQUIRED_COLS = ["id", "name", "category"];
const TEMPLATE_HEADERS = [
  "id", "name", "slug", "category", "description", "shortDescription",
  "image", "price", "offerPrice", "sku", "stock", "stockStatus",
  "lowStockThreshold", "weight", "tags",
  "variant1_size", "variant1_unit", "variant1_price",
  "variant2_size", "variant2_unit", "variant2_price",
  "variant3_size", "variant3_unit", "variant3_price",
  "featured", "bestSeller", "newArrival", "active", "sortOrder",
  "seoTitle", "seoDescription"
];

const TEMPLATE_SAMPLE = [
  ["P001", "Dragon Fruit Crush 250ml", "dragon-fruit-crush-250ml", "Crush",
    "Premium Dragon Fruit Crush", "Pure botanical refreshment",
    "/images/hero/crush_bottle.png", "120", "99", "CRUSH-001",
    "50", "in-stock", "10", "250ml", "organic,fruit,crush",
    "250ml", "ml", "120", "500ml", "ml", "220", "", "", "",
    "true", "false", "true", "true", "1",
    "Dragon Fruit Crush | Rafah Garden", "Premium organic dragon fruit crush drink"
  ]
];

function downloadTemplate() {
  const wb = XLSX.utils.book_new();
  const wsData = [TEMPLATE_HEADERS, ...TEMPLATE_SAMPLE];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Column widths
  ws["!cols"] = TEMPLATE_HEADERS.map(h => ({ wch: Math.max(h.length + 4, 14) }));

  XLSX.utils.book_append_sheet(wb, ws, "Products");

  // Instructions sheet
  const instrData = [
    ["Column", "Required", "Description", "Example"],
    ["id", "YES", "Unique product ID (used for upsert)", "P001"],
    ["name", "YES", "Product name", "Dragon Fruit Crush"],
    ["category", "YES", "Category name (must match existing category)", "Crush"],
    ["slug", "No", "URL slug (auto-generated if blank)", "dragon-fruit-crush"],
    ["description", "No", "Full product description", "Premium..."],
    ["shortDescription", "No", "Short description", "Pure botanical..."],
    ["image", "No", "Image path or URL", "/images/product.png"],
    ["price", "No", "Base price", "120"],
    ["offerPrice", "No", "Sale/offer price", "99"],
    ["sku", "No", "Stock keeping unit", "CRUSH-001"],
    ["stock", "No", "Quantity in stock", "50"],
    ["stockStatus", "No", "in-stock / low-stock / out-of-stock", "in-stock"],
    ["lowStockThreshold", "No", "Alert threshold (default: 10)", "10"],
    ["weight", "No", "Weight/volume", "250ml"],
    ["tags", "No", "Comma-separated tags", "organic,fruit"],
    ["variant1_size", "No", "Variant 1 size label", "250ml"],
    ["variant1_unit", "No", "Variant 1 unit", "ml"],
    ["variant1_price", "No", "Variant 1 price", "120"],
    ["featured", "No", "true/false", "true"],
    ["bestSeller", "No", "true/false", "false"],
    ["newArrival", "No", "true/false", "true"],
    ["active", "No", "true/false (default: true)", "true"],
    ["sortOrder", "No", "Display sort order", "1"],
    ["seoTitle", "No", "SEO meta title", "Product | Rafah Garden"],
    ["seoDescription", "No", "SEO meta description", "Description text"],
  ];
  const wsInstr = XLSX.utils.aoa_to_sheet(instrData);
  wsInstr["!cols"] = [{ wch: 20 }, { wch: 10 }, { wch: 50 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, wsInstr, "Instructions");

  XLSX.writeFile(wb, "rafa-garden-products-template.xlsx");
}

type ParsedRow = Record<string, any>;
type ImportResult = { row: number; id: string; name: string; status: 'created' | 'updated' | 'error'; error?: string };

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function BulkUploadModal({ onClose, onSuccess }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'results'>('upload');
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<ImportResult[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [showAllRows, setShowAllRows] = useState(false);
  const [previewError, setPreviewError] = useState('');

  const parseFile = (file: File) => {
    setPreviewError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const parsed: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

        if (parsed.length < 2) {
          setPreviewError('File is empty or has no data rows.');
          return;
        }

        const headers = (parsed[0] as string[]).map(h => String(h).trim());
        const dataRows = parsed.slice(1).filter(r => r.some((c: any) => String(c).trim() !== ''));

        // Validate required columns
        const missing = REQUIRED_COLS.filter(col => !headers.includes(col));
        if (missing.length > 0) {
          setPreviewError(`Missing required columns: ${missing.join(', ')}`);
          return;
        }

        // Map rows to objects
        const mappedRows: ParsedRow[] = dataRows.map(row =>
          Object.fromEntries(headers.map((h, i) => [h, row[i] ?? '']))
        );

        // Per-row validation
        const errors: string[] = [];
        mappedRows.forEach((row, i) => {
          REQUIRED_COLS.forEach(col => {
            if (!String(row[col] || '').trim()) {
              errors.push(`Row ${i + 2}: "${col}" is required`);
            }
          });
        });

        setFileName(file.name);
        setRows(mappedRows);
        setValidationErrors(errors);
        setStep('preview');
      } catch (err: any) {
        setPreviewError(`Failed to parse file: ${err.message}`);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) parseFile(file);
  }, []);

  const handleImport = async () => {
    setImporting(true);
    setStep('importing');
    try {
      const res = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows }),
      });
      const data = await res.json();
      setResults(data.results || []);
      setSummary(data.summary || {});
      setStep('results');
      if (data.summary?.created > 0 || data.summary?.updated > 0) {
        onSuccess();
      }
    } catch (err: any) {
      setPreviewError(`Import failed: ${err.message}`);
      setStep('preview');
    }
    setImporting(false);
  };

  const visibleRows = showAllRows ? rows : rows.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl my-auto" style={{ fontFamily: 'AvantGarde, sans-serif' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}>
              <FileSpreadsheet size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif', letterSpacing: '0.05em' }}>
                BULK IMPORT PRODUCTS
              </h2>
              <p className="text-xs text-gray-400">Upload Excel (.xlsx) or CSV files</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-0 px-6 pt-4">
          {['Upload', 'Preview', 'Import'].map((s, i) => {
            const stepIdx = { upload: 0, preview: 1, importing: 2, results: 2 }[step] ?? 0;
            const done = i < stepIdx;
            const active = i === stepIdx;
            return (
              <div key={s} className="flex items-center">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${active ? 'bg-[#c81c6a] text-white' : done ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                  {done ? <CheckCircle2 size={12} /> : <span>{i + 1}</span>}
                  {s}
                </div>
                {i < 2 && <div className="w-8 h-px bg-gray-200 mx-1" />}
              </div>
            );
          })}
        </div>

        <div className="px-6 py-5 max-h-[65vh] overflow-y-auto">

          {/* STEP 1: Upload */}
          {step === 'upload' && (
            <div className="space-y-5">
              {/* Download template */}
              <div className="flex items-center gap-3 p-4 bg-[#c81c6a]/5 border border-[#c81c6a]/20 rounded-2xl">
                <Info size={16} className="text-[#c81c6a] flex-shrink-0" />
                <p className="text-sm text-gray-600 flex-1">
                  Download the template first to ensure correct column format.
                </p>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-[#c81c6a]/30 text-[#c81c6a] rounded-xl text-xs font-medium hover:bg-[#c81c6a]/5 transition-all flex-shrink-0"
                >
                  <Download size={13} /> Download Template
                </button>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${dragging ? 'border-[#c81c6a] bg-[#c81c6a]/5' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all ${dragging ? 'bg-[#c81c6a]/15' : 'bg-gray-100'}`}>
                  <Upload size={28} className={dragging ? 'text-[#c81c6a]' : 'text-gray-400'} />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {dragging ? 'Drop your file here' : 'Drag & drop or click to browse'}
                </p>
                <p className="text-xs text-gray-400">Supports .xlsx, .xls, .csv files</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={e => e.target.files?.[0] && parseFile(e.target.files[0])}
                />
              </div>

              {previewError && (
                <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-100 rounded-2xl">
                  <XCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{previewError}</p>
                </div>
              )}

              {/* Required columns info */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Required Columns</p>
                <div className="flex flex-wrap gap-2">
                  {REQUIRED_COLS.map(col => (
                    <span key={col} className="px-2.5 py-1 bg-red-50 text-red-600 rounded-full text-xs font-mono border border-red-100">{col}</span>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3">All other columns from the template are optional. Existing products (matched by <code className="bg-gray-100 px-1 rounded">id</code>) will be updated.</p>
              </div>
            </div>
          )}

          {/* STEP 2: Preview */}
          {step === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#1a1a1a] text-sm">
                    <span className="text-[#c81c6a] font-bold">{rows.length}</span> product{rows.length !== 1 ? 's' : ''} ready to import
                    <span className="text-gray-400 font-normal ml-2">from {fileName}</span>
                  </p>
                  {validationErrors.length > 0 && (
                    <p className="text-xs text-amber-600 mt-0.5">{validationErrors.length} validation warning{validationErrors.length !== 1 ? 's' : ''}</p>
                  )}
                </div>
                <button onClick={() => { setStep('upload'); setRows([]); setValidationErrors([]); }} className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1">
                  <RefreshCw size={11} /> Change file
                </button>
              </div>

              {/* Validation warnings */}
              {validationErrors.length > 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-1">
                  <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <AlertTriangle size={13} /> Validation Warnings (rows with errors will be skipped)
                  </p>
                  {validationErrors.slice(0, 5).map((e, i) => (
                    <p key={i} className="text-xs text-amber-600">• {e}</p>
                  ))}
                  {validationErrors.length > 5 && <p className="text-xs text-amber-500">...and {validationErrors.length - 5} more</p>}
                </div>
              )}

              {/* Preview table */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500">
                        <th className="text-left px-4 py-3 font-medium">#</th>
                        <th className="text-left px-4 py-3 font-medium">ID</th>
                        <th className="text-left px-4 py-3 font-medium">Name</th>
                        <th className="text-left px-4 py-3 font-medium">Category</th>
                        <th className="text-left px-4 py-3 font-medium">Price</th>
                        <th className="text-left px-4 py-3 font-medium">Stock</th>
                        <th className="text-left px-4 py-3 font-medium">SKU</th>
                        <th className="text-left px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleRows.map((row, i) => {
                        const hasError = validationErrors.some(e => e.startsWith(`Row ${i + 2}:`));
                        return (
                          <tr key={i} className={`border-t border-gray-50 ${hasError ? 'bg-red-50' : 'hover:bg-gray-50/50'}`}>
                            <td className="px-4 py-2.5 text-gray-400">{i + 2}</td>
                            <td className="px-4 py-2.5 font-mono text-[#c81c6a]">{String(row.id || '—')}</td>
                            <td className="px-4 py-2.5 font-medium text-[#1a1a1a] max-w-[160px] truncate">{String(row.name || '—')}</td>
                            <td className="px-4 py-2.5 text-gray-600">{String(row.category || '—')}</td>
                            <td className="px-4 py-2.5 text-gray-600">₹{row.price || '—'}</td>
                            <td className="px-4 py-2.5 text-gray-600">{row.stock || '0'}</td>
                            <td className="px-4 py-2.5 font-mono text-gray-500">{String(row.sku || '—')}</td>
                            <td className="px-4 py-2.5">
                              {hasError
                                ? <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-medium">Error</span>
                                : <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">Ready</span>
                              }
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {rows.length > 5 && (
                  <button
                    onClick={() => setShowAllRows(!showAllRows)}
                    className="w-full py-2.5 text-xs text-gray-400 hover:text-gray-600 border-t border-gray-100 flex items-center justify-center gap-1 transition-colors"
                  >
                    {showAllRows ? <><ChevronUp size={12} /> Show less</> : <><ChevronDown size={12} /> Show all {rows.length} rows</>}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Importing */}
          {step === 'importing' && (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #c81c6a15, #9a0c5215)' }}>
                <RefreshCw size={28} className="text-[#c81c6a] animate-spin" />
              </div>
              <h3 className="font-bold text-[#1a1a1a] text-lg mb-2">Importing Products…</h3>
              <p className="text-gray-400 text-sm">Processing {rows.length} row{rows.length !== 1 ? 's' : ''}. Please wait.</p>
            </div>
          )}

          {/* STEP 4: Results */}
          {step === 'results' && summary && (
            <div className="space-y-5">
              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-black text-green-600" style={{ fontFamily: 'DharmaGothic, sans-serif' }}>{summary.created}</p>
                  <p className="text-xs text-green-600 font-medium mt-1">Created</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-black text-blue-600" style={{ fontFamily: 'DharmaGothic, sans-serif' }}>{summary.updated}</p>
                  <p className="text-xs text-blue-600 font-medium mt-1">Updated</p>
                </div>
                <div className={`border rounded-2xl p-4 text-center ${summary.errors > 0 ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                  <p className={`text-3xl font-black ${summary.errors > 0 ? 'text-red-500' : 'text-gray-300'}`} style={{ fontFamily: 'DharmaGothic, sans-serif' }}>{summary.errors}</p>
                  <p className={`text-xs font-medium mt-1 ${summary.errors > 0 ? 'text-red-500' : 'text-gray-400'}`}>Errors</p>
                </div>
              </div>

              {/* Per-row results */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden max-h-[260px] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0">
                    <tr className="bg-gray-50 text-gray-500">
                      <th className="text-left px-4 py-3 font-medium">Row</th>
                      <th className="text-left px-4 py-3 font-medium">ID</th>
                      <th className="text-left px-4 py-3 font-medium">Name</th>
                      <th className="text-left px-4 py-3 font-medium">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50">
                        <td className="px-4 py-2.5 text-gray-400">{r.row}</td>
                        <td className="px-4 py-2.5 font-mono text-[#c81c6a]">{r.id}</td>
                        <td className="px-4 py-2.5 text-gray-700 max-w-[180px] truncate">{r.name}</td>
                        <td className="px-4 py-2.5">
                          {r.status === 'created' && <span className="flex items-center gap-1 text-green-600 font-medium"><CheckCircle2 size={11} /> Created</span>}
                          {r.status === 'updated' && <span className="flex items-center gap-1 text-blue-600 font-medium"><CheckCircle2 size={11} /> Updated</span>}
                          {r.status === 'error' && (
                            <span className="flex items-center gap-1 text-red-500 font-medium" title={r.error}>
                              <XCircle size={11} /> Error: {r.error?.slice(0, 40)}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <button
            onClick={step === 'results' ? onClose : () => { setStep('upload'); setRows([]); setValidationErrors([]); setPreviewError(''); }}
            className="px-5 py-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl text-sm font-medium transition-all"
          >
            {step === 'results' ? 'Close' : 'Cancel'}
          </button>

          <div className="flex items-center gap-3">
            {step === 'upload' && (
              <button onClick={downloadTemplate} className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">
                <Download size={14} /> Template
              </button>
            )}
            {step === 'preview' && (
              <button
                onClick={handleImport}
                disabled={rows.length === 0}
                className="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl text-sm font-medium shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}
              >
                <Upload size={14} />
                Import {rows.length} Product{rows.length !== 1 ? 's' : ''}
              </button>
            )}
            {step === 'results' && (summary?.errors > 0 || summary?.created === 0) && (
              <button
                onClick={() => { setStep('upload'); setRows([]); setResults([]); setSummary(null); }}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all"
              >
                <RefreshCw size={14} /> Import Another
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
