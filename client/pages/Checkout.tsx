import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Phone } from "lucide-react";
import { toast } from "sonner";

interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [panierCode, setPanierCode] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le téléphone est requis";
    } else if (!/^[\d\s\-\+]+$/.test(formData.phone)) {
      newErrors.phone = "Le téléphone n'est pas valide";
    }

    if (!formData.address.trim()) {
      newErrors.address = "L'adresse est requise";
    }

    if (!formData.city.trim()) {
      newErrors.city = "La ville est requise";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Le code postal est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: formData,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          total: total,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la commande");
      }

      const data = await response.json();
      setPanierCode(data.panierCode);
      clearCart();
      toast.success("Commande créée avec succès !");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(
        "Une erreur est survenue lors de la création de la commande.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0 && !panierCode) {
    return (
      <div className="min-h-screen bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg border border-border p-12 text-center space-y-6">
              <h1 className="text-3xl md:text-4xl font-futura font-bold text-primary">
                Panier Vide
              </h1>
              <p className="text-lg text-muted-foreground font-roboto">
                Impossible de finaliser la commande sans produits.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-3 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg font-futura font-bold transition-all duration-300"
              >
                Continuer les achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success screen
  if (panierCode) {
    return (
      <div className="min-h-screen bg-background py-16 md:py-24 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg border border-border p-8 md:p-12 text-center space-y-8">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Main Message */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-futura font-bold text-primary">
                  Commande confirmée !
                </h1>
                <p className="text-lg text-muted-foreground font-roboto">
                  Merci pour votre achat. Votre commande a été reçue et nous
                  allons vous appeler pour la vérification.
                </p>
              </div>

              {/* Panier Code */}
              <div className="bg-accent/10 rounded-lg p-8 border-2 border-accent/30">
                <p className="text-sm text-muted-foreground font-roboto mb-2">
                  Votre code de panier
                </p>
                <p className="text-3xl md:text-4xl font-futura font-bold text-accent break-all">
                  {panierCode}
                </p>
                <p className="text-xs text-muted-foreground font-roboto mt-4">
                  Conservez ce code pour suivre votre commande
                </p>
              </div>

              {/* Support Info */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <p className="font-futura font-bold text-blue-600 text-lg">
                    Support Client
                  </p>
                </div>
                <p className="text-muted-foreground font-roboto">
                  Appelez-nous pour confirmer les détails de la livraison:
                </p>
                <p className="text-2xl font-futura font-bold text-blue-600">
                  +33 (0) 1 23 45 67 89
                </p>
              </div>

              {/* Next Steps */}
              <div className="space-y-4">
                <h3 className="text-xl font-futura font-bold text-primary">
                  Prochaines étapes:
                </h3>
                <ul className="text-left space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold">
                      1
                    </span>
                    <span className="text-muted-foreground font-roboto">
                      Nous vous appellerons pour confirmer votre commande
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold">
                      2
                    </span>
                    <span className="text-muted-foreground font-roboto">
                      Vous recevrez les détails de la livraison
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold">
                      3
                    </span>
                    <span className="text-muted-foreground font-roboto">
                      Votre commande sera livrée rapidement
                    </span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  to="/products"
                  className="block w-full bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg font-futura font-bold transition-all duration-300 text-center"
                >
                  Continuer les achats
                </Link>
                <Link
                  to="/"
                  className="block w-full border-2 border-accent text-accent hover:bg-accent/5 px-8 py-4 rounded-lg font-futura font-bold transition-all duration-300 text-center"
                >
                  Retour à l'accueil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Checkout form
  return (
    <div className="min-h-screen bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au panier
          </Link>
        </div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-border p-8 space-y-6">
              <h1 className="text-3xl font-futura font-bold text-primary">
                Informations de livraison
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-roboto font-semibold text-foreground mb-2"
                  >
                    Nom Complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom complet"
                    className={`w-full px-4 py-3 rounded-lg border-2 font-roboto transition-all ${
                      errors.name
                        ? "border-red-500"
                        : "border-border focus:border-accent"
                    } focus:outline-none focus:ring-2 focus:ring-accent/20`}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm font-roboto mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-roboto font-semibold text-foreground mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre.email@example.com"
                    className={`w-full px-4 py-3 rounded-lg border-2 font-roboto transition-all ${
                      errors.email
                        ? "border-red-500"
                        : "border-border focus:border-accent"
                    } focus:outline-none focus:ring-2 focus:ring-accent/20`}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm font-roboto mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-roboto font-semibold text-foreground mb-2"
                  >
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+216 XXXX XXXX"
                    className={`w-full px-4 py-3 rounded-lg border-2 font-roboto transition-all ${
                      errors.phone
                        ? "border-red-500"
                        : "border-border focus:border-accent"
                    } focus:outline-none focus:ring-2 focus:ring-accent/20`}
                    disabled={isLoading}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm font-roboto mt-1">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Address Field */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-roboto font-semibold text-foreground mb-2"
                  >
                    Adresse *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Rue et numéro"
                    className={`w-full px-4 py-3 rounded-lg border-2 font-roboto transition-all ${
                      errors.address
                        ? "border-red-500"
                        : "border-border focus:border-accent"
                    } focus:outline-none focus:ring-2 focus:ring-accent/20`}
                    disabled={isLoading}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm font-roboto mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* City & Postal Code */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-roboto font-semibold text-foreground mb-2"
                    >
                      Ville *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Ville"
                      className={`w-full px-4 py-3 rounded-lg border-2 font-roboto transition-all ${
                        errors.city
                          ? "border-red-500"
                          : "border-border focus:border-accent"
                      } focus:outline-none focus:ring-2 focus:ring-accent/20`}
                      disabled={isLoading}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm font-roboto mt-1">
                        {errors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-roboto font-semibold text-foreground mb-2"
                    >
                      Code Postal *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="XXXXX"
                      className={`w-full px-4 py-3 rounded-lg border-2 font-roboto transition-all ${
                        errors.postalCode
                          ? "border-red-500"
                          : "border-border focus:border-accent"
                      } focus:outline-none focus:ring-2 focus:ring-accent/20`}
                      disabled={isLoading}
                    />
                    {errors.postalCode && (
                      <p className="text-red-500 text-sm font-roboto mt-1">
                        {errors.postalCode}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white px-8 py-4 rounded-lg font-futura font-bold transition-all duration-300 active:scale-95 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Création de la commande...
                    </>
                  ) : (
                    "Finaliser la commande"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 h-fit">
            <div className="bg-white rounded-lg border border-border p-8 sticky top-4 space-y-6">
              <h2 className="text-2xl font-futura font-bold text-primary">
                Résumé
              </h2>

              {/* Items */}
              <div className="space-y-3 border-b border-border pb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-roboto">
                      {item.name} x {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
