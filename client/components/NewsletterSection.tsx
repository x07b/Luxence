import { useState } from "react";
import { Send } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setEmail("");
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
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
              className="flex-1 px-6 py-4 bg-white text-primary rounded-lg border border-input placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent font-roboto"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-accent hover:bg-accent/90 text-white rounded-lg font-futura font-bold transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isSubmitted ? "Confirmé!" : "S'inscrire"}
              {!isSubmitted && <Send className="w-4 h-4" />}
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
  );
}
