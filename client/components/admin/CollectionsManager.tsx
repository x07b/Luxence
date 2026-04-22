import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, ImageIcon, X } from "lucide-react";

interface Collection {
  id: string;
  name: string;
  description: string;
  slug: string;
  image?: string;
}

export default function CollectionsManager() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch("/api/collections");
      const data = await response.json();
      setCollections(data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    try {
      const response = await fetch(
        editingId ? `/api/collections/${editingId}` : "/api/collections",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        await fetchCollections();
        setIsAddingNew(false);
        setEditingId(null);
        setFormData({ name: "", description: "" });
      }
    } catch (error) {
      console.error("Error saving collection:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this collection? Products in this collection will not be deleted.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/collections/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCollections(collections.filter((c) => c.id !== id));
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  const startEdit = (collection: Collection) => {
    setEditingId(collection.id);
    setFormData({
      name: collection.name,
      description: collection.description,
      image: collection.image || "",
    });
    setImagePreview(collection.image || "");
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingId(null);
    setFormData({ name: "", description: "", image: "" });
    setImagePreview("");
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setFormData({ name: "", description: "", image: "" });
    setImagePreview("");
  };

  const handleImageUrlChange = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      image: url,
    }));
    setImagePreview(url);
  };

  if (loading) {
    return <div className="text-center py-8">Loading collections...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Collections</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Total collections: {collections.length}
          </p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Collection
        </Button>
      </div>

      {isAddingNew || editingId ? (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Collection Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="e.g., Panels"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Collection description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter the URL of the collection image
                    </p>
                  </div>
                </div>

                {/* Right Column - Image Preview */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Image Preview
                  </label>
                  <div className="w-full h-64 border-2 border-dashed border-border rounded-lg overflow-hidden bg-secondary/30 flex items-center justify-center">
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreview}
                          alt="Collection preview"
                          className="w-full h-full object-cover"
                          onError={() => {
                            console.error("Failed to load image");
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleImageUrlChange("")}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                        <p className="text-sm text-muted-foreground">
                          No image yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button type="submit" className="flex-1">
                  {editingId ? "Update Collection" : "Create Collection"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4">
        {collections.map((collection) => (
          <Card
            key={collection.id}
            className="hover:shadow-lg transition-all overflow-hidden"
          >
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-stretch">
                {/* Image Section */}
                {collection.image && (
                  <div className="md:w-40 h-40 bg-secondary/30 flex-shrink-0">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content Section */}
                <div className="flex-1 p-6 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg font-futura">
                      {collection.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {collection.description || "No description"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-3 font-mono bg-secondary/50 px-2 py-1 rounded w-fit">
                      {collection.slug}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(collection)}
                      className="whitespace-nowrap"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(collection.id)}
                      className="whitespace-nowrap"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {collections.length === 0 && !isAddingNew && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No collections yet</p>
            <Button
              onClick={() => {
                setIsAddingNew(true);
              }}
            >
              Create your first collection
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
