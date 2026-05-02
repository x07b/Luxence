import { Link } from "react-router-dom";
import { ArrowLeft, Gem, Leaf, HandHeart, Zap, Scale, Globe } from "lucide-react";

const values = [
  {
    icon: <Gem className="w-8 h-8" />,
    title: "Excellence sans compromis",
    description:
      "Chaque pièce Luxence est soumise à un contrôle qualité rigoureux en 12 étapes avant de quitter notre atelier. Nous refusons la médiocrité sous toutes ses formes — un seul défaut suffit à reconduire une pièce en fabrication.",
    color: "from-amber-50 to-white",
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100",
  },
  {
    icon: <HandHeart className="w-8 h-8" />,
    title: "Artisanat humain",
    description:
      "Nous croyons fermement que les mains humaines donnent une âme aux objets que les machines ne peuvent reproduire. Nos 47 artisans travaillent en petite série, transmettant des savoir-faire qui remontent au XIXe siècle.",
    color: "from-rose-50 to-white",
    iconColor: "text-rose-600",
    iconBg: "bg-rose-100",
  },
  {
    icon: <Leaf className="w-8 h-8" />,
    title: "Responsabilité environnementale",
    description:
      "Nos matériaux proviennent exclusivement de fournisseurs certifiés FSC et RoHS. Notre atelier fonctionne à 100% en énergie renouvelable depuis 2020, et nous visons le zéro déchet en 2026.",
    color: "from-green-50 to-white",
    iconColor: "text-green-600",
    iconBg: "bg-green-100",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Innovation permanente",
    description:
      "Notre laboratoire R&D explore en continu les nouvelles sources lumineuses, les alliages de métaux inédits et les techniques de soufflage de verre innovantes. 15% de notre chiffre d'affaires est réinvesti en recherche chaque année.",
    color: "from-blue-50 to-white",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
  },
  {
    icon: <Scale className="w-8 h-8" />,
    title: "Commerce équitable",
    description:
      "Nos relations avec nos fournisseurs reposent sur des contrats à long terme, des prix justes et des audits sociaux annuels. Nous refusons de travailler avec tout prestataire qui ne respecte pas nos critères éthiques stricts.",
    color: "from-purple-50 to-white",
    iconColor: "text-purple-600",
    iconBg: "bg-purple-100",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Ancrage local, rayonnement mondial",
    description:
      "Fabriqués en France, nos luminaires rayonnent dans 30 pays. Nous valorisons les savoir-faire régionaux — verre de Bretagne, métal forgé de Corrèze, bois de nos forêts certifiées — tout en imaginant des designs universels.",
    color: "from-orange-50 to-white",
    iconColor: "text-orange-600",
    iconBg: "bg-orange-100",
  },
];

const commitments = [
  { label: "Énergie renouvelable", value: "100%", since: "depuis 2020" },
  { label: "Matériaux sourcés localement", value: "78%", since: "objectif 90% en 2026" },
  { label: "Artisans formés en interne", value: "47", since: "experts passionnés" },
  { label: "Réinvestissement R&D", value: "15%", since: "du chiffre d'affaires" },
];

export default function NosValeurs() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-primary text-white py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 text-sm font-roboto">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
          <p className="text-accent font-roboto text-sm uppercase tracking-[0.3em] mb-4">Ce qui nous définit</p>
          <h1 className="text-5xl md:text-7xl font-futura font-bold mb-6">Nos Valeurs</h1>
          <p className="text-xl text-white/75 font-roboto max-w-2xl mx-auto leading-relaxed">
            Six principes fondamentaux qui guident chacune de nos décisions, de la conception à la livraison.
          </p>
        </div>
      </section>

      {/* Values grid */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {values.map((v) => (
              <div key={v.title} className={`bg-gradient-to-br ${v.color} rounded-2xl p-8 border border-border hover:shadow-lg transition-all duration-300 group`}>
                <div className={`w-16 h-16 ${v.iconBg} rounded-2xl flex items-center justify-center mb-6 ${v.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                  {v.icon}
                </div>
                <h3 className="text-xl font-futura font-bold text-primary mb-3">{v.title}</h3>
                <p className="text-muted-foreground font-roboto text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-accent font-roboto text-sm uppercase tracking-[0.3em] mb-3">En chiffres</p>
            <h2 className="text-4xl font-futura font-bold">Nos engagements concrets</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {commitments.map((c) => (
              <div key={c.label} className="text-center p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                <div className="text-4xl font-futura font-bold text-accent mb-2">{c.value}</div>
                <div className="text-sm font-roboto font-semibold text-white mb-1">{c.label}</div>
                <div className="text-xs text-white/50 font-roboto">{c.since}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="text-6xl text-accent font-futura leading-none">"</div>
            <blockquote className="text-2xl md:text-3xl font-futura font-bold text-primary leading-relaxed">
              Un luminaire Luxence doit pouvoir se transmettre de génération en génération. C'est notre définition du luxe véritable.
            </blockquote>
            <p className="text-muted-foreground font-roboto">— Sophie Marchetti, Fondatrice</p>
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/design-ethique" className="inline-flex items-center justify-center px-8 py-3 bg-accent hover:bg-accent/90 text-white font-futura font-bold rounded-lg transition-colors">
              Notre design éthique
            </Link>
            <Link to="/about" className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white font-futura font-bold rounded-lg transition-colors">
              Notre histoire
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
