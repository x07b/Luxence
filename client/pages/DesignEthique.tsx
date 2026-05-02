import { Link } from "react-router-dom";
import { ArrowLeft, Recycle, TreePine, Factory, Shield, Sun, Droplets } from "lucide-react";

const principles = [
  {
    icon: <TreePine className="w-7 h-7" />,
    title: "Matériaux à faible impact",
    description:
      "Nous sélectionnons chaque matériau en fonction de son empreinte carbone, de sa durabilité et de sa traçabilité. Bois issus de forêts gérées durablement, métaux recyclés à plus de 60%, verres fabriqués localement.",
    metric: "60%",
    metricLabel: "de métaux recyclés",
  },
  {
    icon: <Factory className="w-7 h-7" />,
    title: "Production locale & circuits courts",
    description:
      "Notre atelier en Provence travaille exclusivement avec des fournisseurs à moins de 500 km. Cela réduit les émissions de transport, soutient l'économie régionale et nous permet de maintenir un contrôle qualité irréprochable.",
    metric: "< 500 km",
    metricLabel: "rayon fournisseurs",
  },
  {
    icon: <Sun className="w-7 h-7" />,
    title: "Énergie renouvelable",
    description:
      "Depuis 2020, notre atelier fonctionne intégralement à l'énergie solaire. Nos panneaux photovoltaïques couvrent 110% de nos besoins — le surplus est réinjecté dans le réseau local.",
    metric: "100%",
    metricLabel: "énergie solaire",
  },
  {
    icon: <Recycle className="w-7 h-7" />,
    title: "Zéro déchet en production",
    description:
      "Nos chutes de métal sont revendues à des fonderies locales. Nos résidus de verre sont recyclés en granulats. Nos emballages sont en carton recyclé et kraft naturel — zéro plastique depuis 2022.",
    metric: "0",
    metricLabel: "plastique depuis 2022",
  },
  {
    icon: <Droplets className="w-7 h-7" />,
    title: "Gestion de l'eau",
    description:
      "Notre système de récupération des eaux de pluie alimente l'ensemble de nos processus de nettoyage. Nous avons réduit notre consommation d'eau de 40% en 5 ans grâce à des procédés à circuit fermé.",
    metric: "−40%",
    metricLabel: "consommation d'eau",
  },
  {
    icon: <Shield className="w-7 h-7" />,
    title: "Durabilité & réparabilité",
    description:
      "Chaque luminaire Luxence est conçu pour durer des décennies. Toutes nos pièces sont réparables, les composants remplaçables sont disponibles pendant 15 ans minimum après l'achat.",
    metric: "15 ans",
    metricLabel: "disponibilité des pièces",
  },
];

const certifications = [
  { name: "FSC®", description: "Bois issus de forêts gérées de manière responsable" },
  { name: "RoHS", description: "Restriction des substances dangereuses dans nos produits" },
  { name: "CE", description: "Conformité aux normes européennes de sécurité" },
  { name: "ISO 14001", description: "Système de management environnemental certifié" },
];

export default function DesignEthique() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-900 via-primary to-primary text-white py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 text-sm font-roboto">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
          <p className="text-green-400 font-roboto text-sm uppercase tracking-[0.3em] mb-4">Notre engagement</p>
          <h1 className="text-5xl md:text-7xl font-futura font-bold mb-6">Design Éthique</h1>
          <p className="text-xl text-white/75 font-roboto max-w-2xl mx-auto leading-relaxed">
            La beauté ne doit pas se faire au détriment de la planète. Chez Luxence, l'éthique est au cœur de chaque décision de design.
          </p>
        </div>
      </section>

      {/* Manifeste */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <p className="text-accent font-roboto text-sm uppercase tracking-[0.3em]">Notre manifeste</p>
            <h2 className="text-4xl font-futura font-bold text-primary">
              Le luxe responsable n'est pas un oxymore
            </h2>
            <p className="text-muted-foreground font-roboto text-lg leading-relaxed">
              Trop longtemps, luxe et responsabilité environnementale ont semblé incompatibles.
              Chez Luxence, nous prouvons le contraire depuis 2004. La rareté, l'excellence et la
              durabilité ne s'opposent pas — ils se renforcent mutuellement.
            </p>
            <p className="text-muted-foreground font-roboto leading-relaxed">
              Un objet vraiment luxueux est un objet qui dure, qui se répare, qui traverse les
              générations. C'est précisément ce que nous fabriquons.
            </p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-10 pb-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-accent font-roboto text-sm uppercase tracking-[0.3em] mb-3">Nos pratiques</p>
            <h2 className="text-4xl font-futura font-bold text-primary">6 engagements concrets</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {principles.map((p) => (
              <div key={p.title} className="bg-white rounded-2xl p-8 border border-border hover:shadow-lg transition-all group flex flex-col">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-5 text-green-700 group-hover:bg-green-700 group-hover:text-white transition-all duration-300">
                  {p.icon}
                </div>
                <h3 className="text-lg font-futura font-bold text-primary mb-3">{p.title}</h3>
                <p className="text-muted-foreground font-roboto text-sm leading-relaxed flex-1">{p.description}</p>
                <div className="mt-5 pt-5 border-t border-border flex items-baseline gap-2">
                  <span className="text-2xl font-futura font-bold text-accent">{p.metric}</span>
                  <span className="text-xs text-muted-foreground font-roboto">{p.metricLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-accent font-roboto text-sm uppercase tracking-[0.3em] mb-3">Notre processus</p>
              <h2 className="text-4xl font-futura font-bold text-primary">De la conception à la livraison</h2>
            </div>
            <div className="space-y-6">
              {[
                { step: "01", title: "Sélection des matériaux", desc: "Chaque matériau est évalué selon 8 critères environnementaux avant approbation. Seuls 30% des matériaux proposés passent notre comité éthique." },
                { step: "02", title: "Fabrication artisanale", desc: "Production en petite série dans notre atelier provençal. Consommation énergétique minimisée grâce à nos process manuels et à notre énergie solaire." },
                { step: "03", title: "Contrôle qualité renforcé", desc: "12 étapes de contrôle pour garantir une durée de vie maximale. Un luminaire durable, c'est moins de ressources consommées sur le long terme." },
                { step: "04", title: "Emballage éco-responsable", desc: "Carton FSC recyclé, rembourrage en laine naturelle, encres végétales. Zéro plastique, 100% compostable ou recyclable." },
                { step: "05", title: "Livraison optimisée", desc: "Regroupement des expéditions, partenariats avec des transporteurs certifiés bas carbone, compensation carbone pour les livraisons internationales." },
              ].map((step) => (
                <div key={step.step} className="flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-accent text-white font-futura font-bold text-lg flex items-center justify-center flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="pt-2">
                    <h3 className="font-futura font-bold text-primary text-lg mb-1">{step.title}</h3>
                    <p className="text-muted-foreground font-roboto text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-futura font-bold mb-2">Nos certifications</h2>
            <p className="text-white/60 font-roboto text-sm">Des garanties vérifiées par des tiers indépendants</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {certifications.map((c) => (
              <div key={c.name} className="text-center p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                <div className="text-2xl font-futura font-bold text-accent mb-2">{c.name}</div>
                <p className="text-xs text-white/60 font-roboto leading-relaxed">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center space-y-5">
          <h2 className="text-3xl font-futura font-bold text-primary">Un geste pour la planète, une beauté pour toujours</h2>
          <p className="text-muted-foreground font-roboto max-w-xl mx-auto">Choisir Luxence, c'est investir dans un objet durable qui respecte l'environnement.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link to="/products" className="inline-flex items-center justify-center px-8 py-3 bg-accent hover:bg-accent/90 text-white font-futura font-bold rounded-lg transition-colors">
              Découvrir la collection
            </Link>
            <Link to="/nos-valeurs" className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white font-futura font-bold rounded-lg transition-colors">
              Nos valeurs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
