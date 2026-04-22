import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Trash2, Plus, Upload, FileText, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface Collection {
  id: string;
  name: string;
}

interface DetailSection {
  id?: string;
  title: string;
  content: string;
  order?: number;
}

interface ProductFormProps {
  product?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function ProductForm({
  product,
  onSave,
  onCancel,
}: ProductFormProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [detailSections, setDetailSections] = useState<DetailSection[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    category: product?.category || "",
    collectionId: product?.collectionId || "",
    images: product?.images || [""],
    pdfFile: product?.pdfFile || null,
    pdfFilename: product?.pdfFilename || null,
    specifications: product?.specifications || [{ label: "", value: "" }],
  });

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch("/api/collections");
        const data = await response.json();
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    fetchCollections();
  }, []);

  // Fetch product details sections when editing
  useEffect(() => {
    if (product?.id) {
      const fetchDetails = async () => {
        try {
          setIsLoadingDetails(true);
          const response = await fetch(`/api/products/${product.id}/details`);
          if (response.ok) {
            const data = await response.json();
            setDetailSections(data);
          }
        } catch (error) {
          console.error("Error fetching product details:", error);
        } finally {
          setIsLoadingDetails(false);
        }
      };

      fetchDetails();
    }
  }, [product?.id]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadFileToServer = async (file: File, fileType: "image" | "pdf") => {
    try {
      setIsUploading(true);
      const key = `${fileType}-${Date.now()}`;
      setUploadProgress((prev) => ({ ...prev, [key]: 0 }));

      const arrayBuffer = await file.arrayBuffer();
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "content-type": "application/octet-stream",
          "x-filename": file.name,
        },
        body: arrayBuffer,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[key];
        return newProgress;
      });

      return result;
    } catch (error) {
      console.error("Upload error:", error);
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[`${fileType}-${Date.now()}`];
        return newProgress;
      });
      alert("File upload failed. Please try again.");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFileToServer(file, "image");
      handleImageChange(index, result.url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFileToServer(file, "pdf");
      setFormData((prev) => ({
        ...prev,
        pdfFile: result.url,
        pdfFilename: file.name,
      }));
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  const addImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const removePDF = () => {
    setFormData((prev) => ({
      ...prev,
      pdfFile: null,
      pdfFilename: null,
    }));
  };

  const handleSpecChange = (
    index: number,
    field: "label" | "value",
    value: string,
  ) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index] = {
      ...newSpecs[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      specifications: newSpecs,
    }));
  };

  const addSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { label: "", value: "" }],
    }));
  };

  const removeSpec = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const addDetailSection = () => {
    setDetailSections((prev) => [
      ...prev,
      { title: "", content: "", order: prev.length },
    ]);
  };

  const updateDetailSection = (
    index: number,
    field: "title" | "content",
    value: string,
  ) => {
    setDetailSections((prev) => {
      const newSections = [...prev];
      newSections[index] = {
        ...newSections[index],
        [field]: value,
      };
      return newSections;
    });
  };

  const removeDetailSection = (index: number) => {
    setDetailSections((prev) =>
      prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i })),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filteredImages = formData.images.filter((img) => img.trim());
    const filteredSpecs = formData.specifications.filter(
      (spec) => spec.label && spec.value,
    );

    // Call onSave with product data (this will handle the product creation/update)
    onSave({
      ...formData,
      images: filteredImages,
      specifications: filteredSpecs,
      detailSections,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div>
        <label className="block text-sm font-medium mb-2">Product Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="e.g., LED Panel Light"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Category *</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="e.g., Panneaux LED"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Collection (Optional)
          </label>
          <select
            name="collectionId"
            value={formData.collectionId}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">None - Will appear in all products</option>
            {collections.map((col) => (
              <option key={col.id} value={col.id}>
                {col.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          rows={3}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Product description"
        />
      </div>

      {/* Product Images Upload */}
      <div className="product-images-section border-2 border-dashed border-border rounded-lg p-6 bg-muted/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <label className="block text-sm font-medium">Product Images</label>
            <p className="text-xs text-muted-foreground mt-1">
              Upload images from your PC or paste image URLs
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addImage}>
            <Plus className="w-4 h-4 mr-1" />
            Add Image
          </Button>
        </div>

        <div className="space-y-3">
          {formData.images.map((image, index) => (
            <div key={index} className="image-upload-row flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">
                  Image {index + 1}
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>

              <label className="upload-button relative px-3 py-2 border border-border rounded-lg hover:bg-secondary transition-colors cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, index)}
                  className="hidden"
                  disabled={isUploading}
                />
                <Upload className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
              </label>

              {/* Image Preview */}
              {image && (
                <div className="image-preview w-12 h-12 rounded-lg overflow-hidden border border-border">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {formData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Upload Progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="mt-4 space-y-2">
            {Object.entries(uploadProgress).map(([key, progress]) => (
              <div key={key} className="text-xs">
                <div className="flex justify-between mb-1">
                  <span>Uploading...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PDF Technical Sheet Upload */}
      <div className="pdf-section border-2 border-dashed border-border rounded-lg p-6 bg-muted/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <label className="block text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Technical Sheet (PDF)
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              Upload a PDF technical sheet for download
            </p>
          </div>
        </div>

        {formData.pdfFile ? (
          <div className="pdf-preview flex items-center justify-between bg-white border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-red-500" />
              <div>
                <p className="text-sm font-medium">{formData.pdfFilename}</p>
                <p className="text-xs text-muted-foreground">
                  Ready to download
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removePDF}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="upload-pdf flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-border rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer">
            <input
              type="file"
              accept=".pdf"
              onChange={handlePDFUpload}
              className="hidden"
              disabled={isUploading}
            />
            <FileText className="w-8 h-8 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">Click to upload PDF</p>
              <p className="text-xs text-muted-foreground">or drag and drop</p>
            </div>
          </label>
        )}
      </div>

      {/* Specifications */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium">Specifications</label>
          <Button type="button" variant="outline" size="sm" onClick={addSpec}>
            <Plus className="w-4 h-4 mr-1" />
            Add Spec
          </Button>
        </div>
        <div className="space-y-2">
          {formData.specifications.map((spec, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={spec.label}
                onChange={(e) =>
                  handleSpecChange(index, "label", e.target.value)
                }
                className="w-1/3 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                placeholder="e.g., Power"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) =>
                  handleSpecChange(index, "value", e.target.value)
                }
                className="w-2/3 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                placeholder="e.g., 10W"
              />
              {formData.specifications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSpec(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Product Details Sections */}
      <div className="border-t border-border pt-6">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium">
            Détails du produit
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addDetailSection}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Section
          </Button>
        </div>

        {isLoadingDetails ? (
          <p className="text-sm text-muted-foreground">Loading sections...</p>
        ) : detailSections.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No detail sections yet. Add one to get started.
          </p>
        ) : (
          <div className="space-y-3">
            {detailSections.map((section, index) => (
              <div
                key={index}
                className="border border-border rounded-lg p-4 space-y-3 bg-muted/20"
              >
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) =>
                    updateDetailSection(index, "title", e.target.value)
                  }
                  placeholder="Section title (e.g., Description du produit)"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm font-medium"
                />
                <textarea
                  value={section.content}
                  onChange={(e) =>
                    updateDetailSection(index, "content", e.target.value)
                  }
                  placeholder="Section content (supports plain text, paste tables, or any content)"
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm font-mono"
                />
                {detailSections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDetailSection(index)}
                    className="flex items-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove Section
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button type="submit" disabled={isUploading} className="flex-1">
          {isUploading
            ? "Uploading..."
            : product
              ? "Update Product"
              : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isUploading}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
