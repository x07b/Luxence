import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    if (!formData.subject.trim()) {
      newErrors.subject = "Le sujet est requis";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Le message est requis";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Le message doit contenir au moins 10 caractères";
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
    // Clear error for this field when user starts typing
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du message");
      }

      const data = await response.json();

      // Show appropriate success message based on email delivery status
      const successMessage = data.emailSent
        ? "Message envoyé avec succès ! Nous vous répondrons bientôt."
        : "Message reçu ! Nous le traiterons dès que possible.";

      toast.success(successMessage);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-futura font-bold text-primary mb-4">
              Nous contacter
            </h1>
            <p className="text-lg text-muted-foreground font-roboto">
              Nous serions ravis de vous aider. Envoyez-nous votre message et
              nous vous répondrons au plus tôt.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-lg border border-border p-8 text-center hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                <Mail className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-futura font-bold text-primary mb-2">Email</h3>
              <p className="text-muted-foreground font-roboto text-sm">
                contact@luxence.fr
              </p>
            </div>

            <div className="bg-white rounded-lg border border-border p-8 text-center hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                <Phone className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-futura font-bold text-primary mb-2">
                Téléphone
              </h3>
              <p className="text-muted-foreground font-roboto text-sm">
                +33 (0) 1 23 45 67 89
              </p>
            </div>

            <div className="bg-white rounded-lg border border-border p-8 text-center hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                <MapPin className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-futura font-bold text-primary mb-2">
                Adresse
              </h3>
              <p className="text-muted-foreground font-roboto text-sm">
                Paris, France
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg border border-border p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-futura font-bold text-primary mb-8">
              Envoyez-nous un message
            </h2>

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
                  placeholder="Votre nom"
                  className={`w-full px-4 py-3 rounded-lg border-2 font-roboto transition-all duration-200 focus:outline-none ${
                    errors.name
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-border focus:border-accent focus:ring-2 focus:ring-accent/20"
                  }`}
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
                  Adresse Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre.email@example.com"
                  className={`w-full px-4 py-3 rounded-lg border-2 font-roboto transition-all duration-200 focus:outline-none ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-border focus:border-accent focus:ring-2 focus:ring-accent/20"
                  }`}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm font-roboto mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Subject Field */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-roboto font-semibold text-foreground mb-2"
                >
                  Sujet *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Objet de votre message"
                  className={`w-full px-4 py-3 rounded-lg border-2 font-roboto transition-all duration-200 focus:outline-none ${
                    errors.subject
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-border focus:border-accent focus:ring-2 focus:ring-accent/20"
                  }`}
                  disabled={isLoading}
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm font-roboto mt-1">
                    {errors.subject}
                  </p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-roboto font-semibold text-foreground mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Écrivez votre message ici..."
                  rows={6}
                  className={`w-full px-4 py-3 rounded-lg border-2 font-roboto transition-all duration-200 focus:outline-none resize-none ${
                    errors.message
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-border focus:border-accent focus:ring-2 focus:ring-accent/20"
                  }`}
                  disabled={isLoading}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm font-roboto mt-1">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white px-8 py-4 rounded-lg font-futura font-bold transition-all duration-300 active:scale-95 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Envoyer le message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
