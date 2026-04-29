import { useState } from "react";
import { Send, CheckCircle, AlertCircle, X } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [modal, setModal] = useState<{
    open: boolean;
    type: "success" | "warning" | "error";
    title: string;
    message: string;
  }>({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const closeModal = () => {
    setModal((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setEmail("");

        setModal({
          open: true,
          type: "success",
          title: "Inscription confirmée",
          message:
            "Merci pour votre inscription. Vous recevrez bientôt nos nouveautés et offres exclusives.",
        });

        setTimeout(() => setIsSubmitted(false), 3000);
      } else if (response.status === 409) {
        setModal({
          open: true,
          type: "warning",
          title: "Email déjà inscrit",
          message:
            "Cette adresse email est déjà inscrite à notre newsletter.",
        });
      } else {
        setModal({
          open: true,
          type: "error",
          title: "Erreur d'inscription",
          message:
            data.error || "Une erreur est survenue lors de l'inscription.",
        });
      }
    } catch (error) {
      console.error("Newsletter submit error:", error);

      setModal({
        open: true,
        type: "error",
        title: "Erreur serveur",
        message:
          "Impossible de contacter le serveur. Veuillez réessayer plus tard.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="py-12 md:py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div
            className="max-w-2xl mx-auto text-center animate-fade-in opacity-0"
            style={{ animation: "fade-in 0.8s ease-out forwards" }}
          >
            <h2 className="text-3xl md:text-5xl font-futura font-bold text-primary mb-4">
              Rejoignez l'univers Luxence
            </h2>

            <p className="text-lg text-muted-foreground font-roboto mb-8">
              Recevez nos nouveautés, inspirations et offres exclusives
              directement dans votre boîte mail.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="flex-1 px-6 py-4 bg-white text-primary rounded-lg border border-input placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent font-roboto disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-accent hover:bg-accent/90 text-white rounded-lg font-futura font-bold transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Inscription..."
                  : isSubmitted
                    ? "Confirmé!"
                    : "S'inscrire"}

                {!isLoading && !isSubmitted && <Send className="w-4 h-4" />}
              </button>
            </form>

            {isSubmitted && (
              <p className="text-sm text-accent font-roboto mt-4 animate-fade-in">
                ✓ Merci pour votre inscription!
              </p>
            )}

            <p className="text-xs text-muted-foreground font-roboto mt-6">
              Nous respectons votre confidentialité. Désinscrivez-vous à tout
              moment.
            </p>
          </div>
        </div>
      </section>

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-fade-in">
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-muted-foreground hover:text-primary transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              {modal.type === "success" && (
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle className="w-8 h-8" />
                </div>
              )}

              {modal.type === "warning" && (
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                  <AlertCircle className="w-8 h-8" />
                </div>
              )}

              {modal.type === "error" && (
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <AlertCircle className="w-8 h-8" />
                </div>
              )}

              <h3 className="text-xl font-futura font-bold text-primary mb-2">
                {modal.title}
              </h3>

              <p className="text-sm text-muted-foreground font-roboto mb-6">
                {modal.message}
              </p>

              <button
                onClick={closeModal}
                className="w-full rounded-lg bg-accent px-5 py-3 text-white font-futura font-bold hover:bg-accent/90 transition-colors"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}