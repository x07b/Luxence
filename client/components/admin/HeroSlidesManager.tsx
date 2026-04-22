import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Upload, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  order: number;
  title: string;
  description: string;
  button1_text: string;
  button1_link: string;
  button2_text: string;
  button2_link: string;
}

export default function HeroSlidesManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<HeroSlide>>({});

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/slides");
      if (response.ok) {
        const data = await response.json();
        setSlides(data);
      }
    } catch (error) {
      console.error("Error fetching hero slides:", error);
      toast.error("Erreur lors du chargement des diapositives");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Read file as array buffer
      const arrayBuffer = await file.arrayBuffer();

      // Upload to server
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "content-type": file.type || "image/jpeg",
          "x-filename": file.name,
        },
        body: arrayBuffer,
      });

      if (uploadResponse.ok) {
        const result = await uploadResponse.json();
        setEditData((prev) => ({
          ...prev,
          image: result.url,
        }));
        toast.success("Image téléchargée avec succès");
      } else {
        toast.error("Erreur lors du téléchargement de l'image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Erreur lors du téléchargement de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSlide = async () => {
    if (!editData.image) {
      toast.error("L'URL de l'image est requise");
      return;
    }

    try {
      const isEditing = editingId && editingId !== "new";
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `/api/slides/${editingId}` : "/api/slides";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: editData.image,
          alt: editData.alt || "Hero slide",
          order: editData.order,
        }),
      });

      if (response.ok) {
        await fetchSlides();
        setEditingId(null);
        setEditData({});
        toast.success(
          isEditing ? "Diapositive mise à jour" : "Diapositive créée",
        );
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.error ||
            "Erreur lors de l'enregistrement de la diapositive",
        );
      }
    } catch (error) {
      console.error("Error saving slide:", error);
      toast.error("Erreur lors de l'enregistrement de la diapositive");
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!window.confirm("Supprimer cette diapositive ?")) return;

    try {
      const response = await fetch(`/api/slides/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSlides(slides.filter((s) => s.id !== id));
        toast.success("Diapositive supprimée");
      }
    } catch (error) {
      console.error("Error deleting slide:", error);
      toast.error("Erreur lors de la suppression de la diapositive");
    }
  };

  const handleMoveSlide = async (id: string, direction: "up" | "down") => {
    const index = slides.findIndex((s) => s.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === slides.length - 1)
    ) {
      return;
    }

    const newSlides = [...slides];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newSlides[index].order, newSlides[swapIndex].order] = [
      newSlides[swapIndex].order,
      newSlides[index].order,
    ];

    // Update both slides
    try {
      await Promise.all([
        fetch(`/api/slides/${newSlides[index].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: newSlides[index].image,
            alt: newSlides[index].alt,
            order: newSlides[index].order,
          }),
        }),
        fetch(`/api/slides/${newSlides[swapIndex].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: newSlides[swapIndex].image,
            alt: newSlides[swapIndex].alt,
            order: newSlides[swapIndex].order,
          }),
        }),
      ]);

      await fetchSlides();
    } catch (error) {
      console.error("Error reordering slides:", error);
      toast.error("Erreur lors du ré-ordonnancement des diapositives");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">Chargement des diapositives...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Diapositives Hero
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez les images de la section hero de la page d'accueil
          </p>
        </div>
        {!editingId && (
          <Button
            onClick={() => {
              setEditingId("new");
              setEditData({
                image: "",
                alt: "",
                order: slides.length || 0,
                title: "Titre de la diapositive",
                description: "Description de la diapositive",
                button1_text: "Découvrir",
                button1_link: "/products",
                button2_text: "En savoir plus",
                button2_link: "/about",
              });
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter une diapositive
          </Button>
        )}
      </div>

      {editingId && (
        <Card className="bg-accent/5 border-accent">
          <CardHeader>
            <CardTitle>
              {editingId === "new"
                ? "Ajouter une nouvelle diapositive"
                : "Modifier la diapositive"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Image URL
              </label>
              <input
                type="text"
                value={editData.image || ""}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    image: e.target.value,
                  }))
                }
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Or upload a new image:
              </p>
              <label className="mt-2 inline-flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>

            {editData.image && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Preview</p>
                <img
                  src={editData.image}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-border"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Alt Text (optional)
              </label>
              <input
                type="text"
                value={editData.alt || ""}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    alt: e.target.value,
                  }))
                }
                placeholder="Image description"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="font-semibold text-sm mb-4">Slide Content</h3>

              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={editData.title || ""}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Main title of the slide"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={editData.description || ""}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Slide description"
                  rows={3}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="mt-4 space-y-3 border-t border-border pt-4">
                <h4 className="font-medium text-xs uppercase text-muted-foreground">
                  Button 1
                </h4>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Button 1 Text
                  </label>
                  <input
                    type="text"
                    value={editData.button1_text || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        button1_text: e.target.value,
                      }))
                    }
                    placeholder="Button text"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Button 1 Link
                  </label>
                  <input
                    type="text"
                    value={editData.button1_link || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        button1_link: e.target.value,
                      }))
                    }
                    placeholder="/products"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-3 border-t border-border pt-4">
                <h4 className="font-medium text-xs uppercase text-muted-foreground">
                  Button 2
                </h4>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Button 2 Text
                  </label>
                  <input
                    type="text"
                    value={editData.button2_text || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        button2_text: e.target.value,
                      }))
                    }
                    placeholder="Button text"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Button 2 Link
                  </label>
                  <input
                    type="text"
                    value={editData.button2_link || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        button2_link: e.target.value,
                      }))
                    }
                    placeholder="/about"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <Button
                onClick={handleSaveSlide}
                disabled={isUploading || !editData.image}
                className="flex-1"
              >
                {isUploading ? "Uploading..." : "Save Slide"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setEditData({});
                }}
                className="flex-1"
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {slides.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                No slides yet. Add one to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          slides
            .sort((a, b) => a.order - b.order)
            .map((slide, index) => (
              <Card
                key={slide.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={slide.image}
                        alt={slide.alt}
                        className="w-32 h-24 object-cover rounded-lg border border-border"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="space-y-2 mb-4">
                        <p className="text-sm font-medium text-foreground">
                          {slide.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {slide.description}
                        </p>
                        <div className="flex gap-2 pt-2">
                          <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                            {slide.button1_text}
                          </span>
                          <span className="text-xs bg-muted px-2 py-1 rounded">
                            {slide.button2_text}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {index > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMoveSlide(slide.id, "up")}
                            className="flex items-center gap-1"
                          >
                            <ChevronUp className="w-4 h-4" />
                            Move Up
                          </Button>
                        )}
                        {index < slides.length - 1 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMoveSlide(slide.id, "down")}
                            className="flex items-center gap-1"
                          >
                            <ChevronDown className="w-4 h-4" />
                            Move Down
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(slide.id);
                            setEditData(slide);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteSlide(slide.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  );
}
