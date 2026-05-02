import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, MessageCircle } from "lucide-react";

const categories = [
  {
    label: "Commandes & devis",
    questions: [
      {
        q: "Comment passer une commande chez Luxence ?",
        a: "Sélectionnez vos produits dans notre catalogue, ajoutez-les au panier et soumettez votre demande de devis. Notre équipe vous contactera sous 48h pour confirmer les détails et établir un devis personnalisé.",
      },
      {
        q: "Les prix sont-ils fixes ou négociables ?",
        a: "Nos prix de catalogue sont indicatifs. Pour toute commande importante ou projet d'architecture d'intérieur, nous proposons des tarifs sur mesure. N'hésitez pas à nous contacter pour obtenir une offre adaptée.",
      },
      {
        q: "Puis-je modifier ou annuler ma commande ?",
        a: "Toute modification est possible jusqu'à la mise en fabrication de votre pièce (généralement sous 72h après validation du devis). Passé ce délai, des frais d'annulation peuvent s'appliquer selon l'avancement de la fabrication.",
      },
      {
        q: "Proposez-vous des créations sur mesure ?",
        a: "Oui, c'est même l'une de nos spécialités. Dimensions, finitions, couleurs, matériaux — nous pouvons adapter chaque luminaire à votre projet. Contactez-nous avec vos spécifications et nous vous proposerons une solution.",
      },
    ],
  },
  {
    label: "Livraison & délais",
    questions: [
      {
        q: "Quels sont les délais de fabrication et de livraison ?",
        a: "Nos pièces étant fabriquées artisanalement, les délais varient entre 4 et 10 semaines selon la complexité de la pièce. Pour les pièces en stock, la livraison est possible sous 5 à 10 jours ouvrés.",
      },
      {
        q: "Livrez-vous à l'international ?",
        a: "Nous livrons dans plus de 30 pays. Les frais et délais de livraison internationale varient selon la destination et le volume de la commande. Nos conseillers peuvent établir un devis de livraison détaillé sur demande.",
      },
      {
        q: "Comment sont emballées les pièces pour la livraison ?",
        a: "Chaque luminaire est conditionné dans un emballage sur mesure en carton FSC doublé de laine naturelle. Nos emballages sont 100% recyclables et conçus pour protéger les pièces les plus fragiles lors du transport.",
      },
    ],
  },
  {
    label: "Produits & entretien",
    questions: [
      {
        q: "Quelle est la garantie sur les luminaires Luxence ?",
        a: "Tous nos luminaires bénéficient d'une garantie fabricant de 5 ans couvrant les défauts de fabrication. Les ampoules et consommables sont garantis 1 an. Notre service après-vente prend en charge les réparations sous garantie.",
      },
      {
        q: "Comment entretenir mon luminaire Luxence ?",
        a: "Selon les matériaux : le verre s'entretient avec un chiffon microfibre légèrement humide, le métal avec un chiffon sec pour éviter l'oxydation, le bois avec une huile naturelle deux fois par an. Évitez les produits abrasifs et les solvants.",
      },
      {
        q: "Les ampoules sont-elles incluses ?",
        a: "La plupart de nos luminaires sont livrés sans ampoule pour vous permettre de choisir la température de couleur adaptée à votre espace. Nos conseillers peuvent vous recommander les ampoules compatibles et les plus performantes.",
      },
      {
        q: "Mes luminaires sont-ils compatibles avec un variateur ?",
        a: "La compatibilité variateur est indiquée sur chaque fiche produit. La grande majorité de nos pièces LED sont dimmables. Pour les anciennes installations à variateur classique, vérifiez la compatibilité avec notre service technique.",
      },
    ],
  },
  {
    label: "Paiement & retours",
    questions: [
      {
        q: "Quels modes de paiement acceptez-vous ?",
        a: "Nous acceptons les virements bancaires, chèques professionnels et cartes bancaires (Visa, Mastercard, Amex). Pour les commandes importantes, un acompte de 30% est demandé à la commande, le solde à la livraison.",
      },
      {
        q: "Puis-je retourner un produit ?",
        a: "Les pièces de catalogue peuvent être retournées sous 14 jours après réception, dans leur emballage d'origine et en parfait état. Les frais de retour sont à la charge du client sauf en cas de défaut de fabrication. Les pièces sur mesure ne sont pas retournables.",
      },
      {
        q: "Que faire si ma pièce est endommagée à la livraison ?",
        a: "Signalez tout dommage au transporteur au moment de la livraison et photographiez l'emballage et la pièce. Contactez-nous dans les 48h avec les photos. Nous organiserons le remplacement ou la réparation de la pièce dans les meilleurs délais.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className={`font-roboto font-semibold text-sm md:text-base transition-colors ${open ? "text-accent" : "text-foreground group-hover:text-accent"}`}>
          {q}
        </span>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${open ? "rotate-180 text-accent" : "text-muted-foreground"}`} />
      </button>
      {open && (
        <p className="pb-5 text-muted-foreground font-roboto text-sm leading-relaxed">
          {a}
        </p>
      )}
    </div>
  );
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary text-white py-24 md:py-32 text-center">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 text-sm font-roboto">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
          <p className="text-accent font-roboto text-sm uppercase tracking-[0.3em] mb-4">Aide & informations</p>
          <h1 className="text-5xl md:text-6xl font-futura font-bold mb-6">Questions fréquentes</h1>
          <p className="text-white/70 font-roboto max-w-xl mx-auto text-lg leading-relaxed">
            Retrouvez ici les réponses aux questions les plus fréquemment posées par nos clients.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-4 gap-8">
            {/* Category sidebar */}
            <div className="md:col-span-1 space-y-1">
              {categories.map((cat, i) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(i)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-roboto font-medium transition-all ${
                    activeCategory === i
                      ? "bg-accent text-white shadow-sm"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Questions */}
            <div className="md:col-span-3">
              <h2 className="text-2xl font-futura font-bold text-primary mb-6">
                {categories[activeCategory].label}
              </h2>
              <div className="bg-white rounded-2xl border border-border shadow-sm px-6">
                {categories[activeCategory].questions.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-5">
            <MessageCircle className="w-12 h-12 text-accent mx-auto" />
            <h2 className="text-3xl font-futura font-bold text-primary">
              Vous n'avez pas trouvé votre réponse ?
            </h2>
            <p className="text-muted-foreground font-roboto">
              Notre équipe est disponible du lundi au vendredi de 9h à 18h pour répondre à toutes vos questions.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-accent hover:bg-accent/90 text-white font-futura font-bold rounded-lg transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
