import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { toast } from "sonner";

type NotificationType = "success" | "warning" | "error";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showResultModal, setShowResultModal] = useState(false);
  const [resultType, setResultType] = useState<NotificationType>("success");
  const [resultTitle, setResultTitle] = useState("");
  const [resultDescription, setResultDescription] = useState("");

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

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const openResultModal = (
    type: NotificationType,
    title: string,
    description: string,
  ) => {
    setResultType(type);
    setResultTitle(title);
    setResultDescription(description);
    setShowResultModal(true);
  };

  const closeResultModal = () => {
    setShowResultModal(false);
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

      const data = await response.json();

      if (!response.ok) {
        openResultModal(
          data?.notification?.type || "error",
          data?.notification?.title || "Erreur",
          data?.notification?.description ||
            "Une erreur est survenue lors de l’envoi de votre message.",
        );
        return;
      }

      openResultModal(
        data?.notification?.type || "success",
        data?.notification?.title || "Message envoyé avec succès",
        data?.notification?.description ||
          "Votre message a bien été transmis.",
      );

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setErrors({});
    } catch (error) {
      console.error("Error sending message:", error);

      openResultModal(
        "error",
        "Échec de l’envoi",
        "Une erreur est survenue. Veuillez réessayer dans quelques instants.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getModalStyles = () => {
    switch (resultType) {
      case "success":
        return {
          icon: (
            <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.4} />
          ),
          iconWrapper:
            "bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 shadow-emerald-500/30",
          badge:
            "bg-emerald-50 text-emerald-700 border border-emerald-200",
          button:
            "bg-slate-900 hover:bg-slate-800",
        };
      case "warning":
        return {
          icon: (
            <AlertTriangle className="w-10 h-10 text-white" strokeWidth={2.4} />
          ),
          iconWrapper:
            "bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 shadow-orange-500/30",
          badge:
            "bg-amber-50 text-amber-700 border border-amber-200",
          button:
            "bg-slate-900 hover:bg-slate-800",
        };
      default:
        return {
          icon: (
            <XCircle className="w-10 h-10 text-white" strokeWidth={2.4} />
          ),
          iconWrapper:
            "bg-gradient-to-br from-rose-500 via-red-500 to-red-600 shadow-red-500/30",
          badge:
            "bg-rose-50 text-rose-700 border border-rose-200",
          button:
            "bg-slate-900 hover:bg-slate-800",
        };
    }
  };

  const modalStyles = getModalStyles();

  return (
    <>
      <div className="min-h-screen bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-futura font-bold text-primary mb-4">
                Nous contacter
              </h1>
              <p className="text-lg text-muted-foreground font-roboto">
                Nous serions ravis de vous aider. Envoyez-nous votre message et
                nous vous répondrons au plus tôt.
              </p>
            </div>

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

            <div className="bg-white rounded-lg border border-border p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-futura font-bold text-primary mb-8">
                Envoyez-nous un message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
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

      {showResultModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.35)]">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-accent via-primary to-accent" />

            <div className="p-8 md:p-10 text-center">
              <div
                className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full shadow-2xl ${modalStyles.iconWrapper}`}
              >
                {modalStyles.icon}
              </div>

              <div
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase mb-4 ${modalStyles.badge}`}
              >
                {resultType === "success"
                  ? "Notification envoyée"
                  : resultType === "warning"
                    ? "Vérification requise"
                    : "Erreur"}
              </div>

              <h3 className="text-2xl md:text-3xl font-futura font-bold text-primary mb-3">
                {resultTitle}
              </h3>

              <p className="text-muted-foreground font-roboto leading-7 mb-8">
                {resultDescription}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={closeResultModal}
                  className={`inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-futura font-bold text-white transition-all duration-300 active:scale-95 ${modalStyles.button}`}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}