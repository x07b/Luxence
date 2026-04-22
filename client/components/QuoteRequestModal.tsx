import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

interface QuoteRequestModalProps {
  isOpen: boolean;
  productId: string;
  productName: string;
  onClose: () => void;
}

export function QuoteRequestModal({
  isOpen,
  productId,
  productName,
  onClose,
}: QuoteRequestModalProps) {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = "Le nom est requis";
    }

    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      newErrors.clientEmail = "L'email n'est pas valide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Veuillez remplir tous les champs correctement");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          productId,
          productName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Quote request error response:", data);
        const errorMessage = data.message || data.error || "Erreur lors de l'envoi de la demande de devis";
        throw new Error(errorMessage);
      }

      toast.success(
        "Demande de devis envoyée ! Nous vous contacterons bientôt.",
      );

      setFormData({
        clientName: "",
        clientEmail: "",
        message: "",
      });

      onClose();
    } catch (error) {
      console.error("Error sending quote request:", error);
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue. Veuillez réessayer.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Demande de Devis</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Product Name (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Produit
            </label>
            <input
              type="text"
              value={productName}
              disabled
              className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground font-roboto"
            />
          </div>

          {/* Client Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Votre nom
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="Jean Dupont"
              className={`w-full px-3 py-2 border rounded-lg font-roboto transition-colors ${
                errors.clientName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-border focus:ring-accent"
              } focus:outline-none focus:ring-2`}
            />
            {errors.clientName && (
              <p className="text-sm text-red-500 mt-1">{errors.clientName}</p>
            )}
          </div>

          {/* Client Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              placeholder="jean@example.com"
              className={`w-full px-3 py-2 border rounded-lg font-roboto transition-colors ${
                errors.clientEmail
                  ? "border-red-500 focus:ring-red-500"
                  : "border-border focus:ring-accent"
              } focus:outline-none focus:ring-2`}
            />
            {errors.clientEmail && (
              <p className="text-sm text-red-500 mt-1">{errors.clientEmail}</p>
            )}
          </div>

          {/* Message (Optional) */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Message (Optionnel)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Décrivez vos besoins..."
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg font-roboto focus:outline-none focus:ring-2 focus:ring-accent transition-colors resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-border text-foreground font-bold rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-accent hover:bg-accent/90 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? "Envoi..." : "Envoyer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
