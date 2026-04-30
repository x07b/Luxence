import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, FileText, Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import ProductForm from "./ProductForm";

interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  category: string;
  collectionId: string;
  slug: string;
  pdfFile?: string | null;
  pdfFilename?: string | null;
  specifications: Array<{ label: string; value: string }>;
}

interface CsvProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  specifications: Array<{ label: string; value: string }>;
}

function parseCSVText(text: string): CsvProduct[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const parseRow = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseRow(lines[0]).map((h) => h.toLowerCase().trim());

  return lines
    .slice(1)
    .filter((l) => l.trim())
    .map((line) => {
      const values = parseRow(line);
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = values[i] || ""; });

      return {
        name: row.name || "",
        description: row.description || "",
        price: parseFloat(row.price) || 0,
        category: row.category || "Uncategorized",
        images: row.images
          ? row.images.split("|").map((s) => s.trim()).filter(Boolean)
          : [],
        specifications: row.specifications
          ? row.specifications
              .split("|")
              .map((s) => {
                const colonIdx = s.indexOf(":");
                return {
                  label: s.slice(0, colonIdx).trim(),
                  value: s.slice(colonIdx + 1).trim(),
                };
              })
              .filter((s) => s.label && s.value)
          : [],
      };
    });
}

const CSV_TEMPLATE = `name,description,price,category,images,specifications
"Lampe Arc","Lampe arc design moderne",250,Éclairage,"https://example.com/img.jpg","Hauteur:180cm|Matière:Métal|Couleur:Noir"
"Table Basse","Table basse en bois massif",450,Mobilier,"","Longueur:120cm|Largeur:60cm"`;

export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [showImport, setShowImport] = useState(false);
  const [csvPreview, setCsvPreview] = useState<CsvProduct[]>([]);
  const [importStatus, setImportStatus] = useState<{
    created: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (response.ok) setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSave = async (productData: any) => {
    try {
      const { detailSections, recommendedProductIds, ...productPayload } = productData;
      const response = await fetch(
        editingId ? `/api/products/${editingId}` : "/api/products",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productPayload),
        },
      );
      if (response.ok) {
        const savedProduct = await response.json();
        const productId = editingId || savedProduct.id;
        if (detailSections && detailSections.length > 0) {
          await fetch(`/api/products/${productId}/details`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sections: detailSections }),
          });
        }
        if (recommendedProductIds && recommendedProductIds.length >= 0) {
          await fetch(`/api/products/${productId}/recommendations`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recommendations: recommendedProductIds }),
          });
        }
        await fetchProducts();
        setIsAddingNew(false);
        setEditingId(null);
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCSVText(text);
      setCsvPreview(parsed);
      setImportStatus(null);
    };
    reader.readAsText(file, "UTF-8");
  };

  const handleImport = async () => {
    if (csvPreview.length === 0) return;
    setIsImporting(true);
    try {
      const response = await fetch("/api/products/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: csvPreview }),
      });
      const data = await response.json();
      setImportStatus(data);
      if (data.created > 0) {
        await fetchProducts();
        setCsvPreview([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Import error:", error);
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "produits_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const closeImport = () => {
    setShowImport(false);
    setCsvPreview([]);
    setImportStatus(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (loading) return <div className="text-center py-8">Loading products...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Products</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Total products: {products.length}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowImport(true)} className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Importer CSV
          </Button>
          <Button onClick={() => setIsAddingNew(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* CSV Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">Importer des produits via CSV</h3>
              <button onClick={closeImport} className="p-1 hover:bg-secondary rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Format info */}
              <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                <p className="font-semibold text-sm">Format attendu des colonnes :</p>
                <div className="grid grid-cols-2 gap-1 text-sm text-muted-foreground">
                  <span><strong>name</strong> — obligatoire</span>
                  <span><strong>description</strong> — obligatoire</span>
                  <span><strong>price</strong> — nombre (ex: 250)</span>
                  <span><strong>category</strong> — texte libre</span>
                  <span><strong>images</strong> — URLs séparées par <code>|</code></span>
                  <span><strong>specifications</strong> — <code>Label:Valeur|Label:Valeur</code></span>
                </div>
                <Button variant="outline" size="sm" onClick={downloadTemplate} className="mt-2">
                  Télécharger le modèle CSV
                </Button>
              </div>

              {/* File input */}
              <div>
                <label className="block text-sm font-semibold mb-2">Sélectionner un fichier CSV</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent file:text-white file:font-semibold hover:file:bg-accent/90 cursor-pointer"
                />
              </div>

              {/* Preview table */}
              {csvPreview.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">
                    Aperçu — {csvPreview.length} produit{csvPreview.length > 1 ? "s" : ""} détecté{csvPreview.length > 1 ? "s" : ""}
                  </p>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary">
                        <tr>
                          <th className="text-left px-3 py-2">Nom</th>
                          <th className="text-left px-3 py-2">Catégorie</th>
                          <th className="text-left px-3 py-2">Prix</th>
                          <th className="text-left px-3 py-2">Images</th>
                          <th className="text-left px-3 py-2">Specs</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvPreview.map((p, i) => (
                          <tr key={i} className="border-t">
                            <td className="px-3 py-2">
                              <p className="font-medium">{p.name || <span className="text-red-500">manquant</span>}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[180px]">{p.description}</p>
                            </td>
                            <td className="px-3 py-2">{p.category}</td>
                            <td className="px-3 py-2">{p.price > 0 ? `${p.price} €` : "—"}</td>
                            <td className="px-3 py-2">{p.images.length > 0 ? `${p.images.length} URL` : "—"}</td>
                            <td className="px-3 py-2">{p.specifications.length > 0 ? `${p.specifications.length} spec.` : "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Import result */}
              {importStatus && (
                <div className={`rounded-lg p-4 space-y-2 ${importStatus.failed === 0 ? "bg-green-50 border border-green-200" : "bg-orange-50 border border-orange-200"}`}>
                  <div className="flex items-center gap-2">
                    {importStatus.failed === 0
                      ? <CheckCircle className="w-5 h-5 text-green-600" />
                      : <AlertCircle className="w-5 h-5 text-orange-600" />}
                    <p className="font-semibold">
                      {importStatus.created} importé{importStatus.created > 1 ? "s" : ""}
                      {importStatus.failed > 0 && `, ${importStatus.failed} échec${importStatus.failed > 1 ? "s" : ""}`}
                    </p>
                  </div>
                  {importStatus.errors.map((e, i) => (
                    <p key={i} className="text-sm text-red-600">• {e}</p>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={closeImport}>Annuler</Button>
                <Button
                  onClick={handleImport}
                  disabled={csvPreview.length === 0 || isImporting}
                >
                  {isImporting ? "Importation..." : `Importer ${csvPreview.length > 0 ? csvPreview.length + " produit" + (csvPreview.length > 1 ? "s" : "") : ""}`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddingNew || editingId ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Product" : "Add New Product"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm
              product={editingId ? products.find((p) => p.id === editingId) : undefined}
              allProducts={products}
              onSave={handleSave}
              onCancel={() => { setIsAddingNew(false); setEditingId(null); }}
            />
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    {product.images.length > 0 && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className="text-xs bg-secondary px-2 py-1 rounded">{product.category}</span>
                        <span className="text-xs bg-secondary px-2 py-1 rounded">{product.images.length} image(s)</span>
                        {product.pdfFile && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            PDF
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingId(product.id)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && !isAddingNew && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No products yet</p>
            <Button onClick={() => setIsAddingNew(true)}>Add your first product</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
