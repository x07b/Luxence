import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, FileText } from "lucide-react";
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

export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

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
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSave = async (productData: any) => {
    try {
      // Extract detail sections from productData
      const { detailSections, ...productPayload } = productData;

      // Save product
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

        // Save detail sections if provided
        if (detailSections && detailSections.length > 0) {
          await fetch(`/api/products/${productId}/details`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sections: detailSections }),
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

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Products</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Total products: {products.length}
          </p>
        </div>
        <Button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {isAddingNew || editingId ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? "Edit Product" : "Add New Product"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm
              product={
                editingId ? products.find((p) => p.id === editingId) : undefined
              }
              onSave={handleSave}
              onCancel={() => {
                setIsAddingNew(false);
                setEditingId(null);
              }}
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
                      <h3 className="font-semibold text-foreground">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {product.description}
                      </p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className="text-xs bg-secondary px-2 py-1 rounded">
                          {product.category}
                        </span>
                        <span className="text-xs bg-secondary px-2 py-1 rounded">
                          {product.images.length} image(s)
                        </span>
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingId(product.id)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
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
            <Button onClick={() => setIsAddingNew(true)}>
              Add your first product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
