import { Link } from "react-router-dom";
import { ArrowLeft, Award, Heart, Lightbulb, Star, Users } from "lucide-react";

const milestones = [
  {
    year: "2004",
    title: "Les débuts",
    description:
      "Fondée à Paris par deux passionnés de design et de lumière, Luxence ouvre son premier atelier dans le Marais. La vision : créer des luminaires qui transcendent la simple fonction pour devenir de véritables œuvres d'art.",
  },
  {
    year: "2009",
    title: "Première collaboration internationale",
    description:
      "Luxence s'associe avec des designers scandinaves de renom pour une collection capsule qui redéfinit l'élégance minimaliste. La collection est exposée au salon Maison & Objet à Paris.",
  },
  {
    year: "2014",
    title: "L'atelier artisanal",
    description:
      "Ouverture de notre atelier de fabrication en Provence, réunissant des artisans maîtres verriers, métalliers et ébénistes. Chaque pièce Luxence est désormais entièrement fabriquée à la main en France.",
  },
  {
    year: "2018",
    title: "Prix du Design Éthique",
    description:
      "Luxence reçoit le Grand Prix du Design Responsable pour son engagement envers les matériaux durables et les circuits courts. Une reconnaissance qui renforce notre engagement pour un luxe conscient.",
  },
  {
    year: "2024",
    title: "Vingt ans d'excellence",
    description:
      "Deux décennies après notre fondation, Luxence est présente dans plus de 30 pays avec une collection de 200 pièces uniques. Nous continuons d'innover tout en préservant l'âme artisanale qui nous définit.",
  },
];

const team = [
  {
    name: "Sophie Marchetti",
    role: "Fondatrice & Directrice Artistique",
    bio: "Diplômée des Arts Décoratifs de Paris, Sophie a consacré sa vie à explorer la frontière entre art et design fonctionnel.",
    initial: "SM",
  },
  {
    name: "Antoine Dufour",
    role: "Co-fondateur & Directeur de Production",
    bio: "Ancien ingénieur en matériaux, Antoine apporte une expertise technique unique à chaque création Luxence.",
    initial: "AD",
  },
  {
    name: "Léa Fontaine",
    role: "Directrice du Design",
    bio: "Après 10 ans chez les plus grandes maisons parisiennes, Léa orchestre la vision créative de chaque collection.",
    initial: "LF",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-white py-28 md:py-40">
        <div className="absolute inset-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F4bd5a48984ac41abb50f4c9c327d1d89%2F912ded31f1c040bbb8e059f551179c76?format=webp&width=1200"
            alt="Luxence atelier"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/80 to-primary" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 text-sm font-roboto"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
          <p className="text-accent font-roboto text-sm uppercase tracking-[0.3em] mb-4">
            Depuis 2004
          </p>
          <h1 className="text-5xl md:text-7xl font-futura font-bold leading-tight mb-6">
            Notre Histoire
          </h1>
          <p className="text-xl md:text-2xl text-white/75 font-roboto max-w-2xl mx-auto leading-relaxed">
            Vingt ans de passion, d'artisanat et de lumière au service de l'excellence.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-futura font-bold text-primary leading-tight">
                L'art de la lumière,{" "}
                <span className="text-accent">élevé au rang de passion</span>
              </h2>
              <p className="text-muted-foreground font-roboto leading-relaxed text-lg">
                Luxence est né d'une conviction simple mais profonde : la lumière est
                le premier élément de design d'un intérieur. Elle transforme les
                espaces, crée des ambiances, révèle les volumes et les matières.
              </p>
              <p className="text-muted-foreground font-roboto leading-relaxed">
                Depuis nos débuts dans un petit atelier parisien, nous avons toujours
                refusé de choisir entre la beauté et la fonctionnalité. Chaque
                luminaire Luxence est conçu pour être à la fois une source de lumière
                irréprochable et une sculpture qui sublime votre intérieur.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "20", label: "Ans d'expérience", icon: <Star className="w-5 h-5" /> },
                { value: "200+", label: "Pièces uniques", icon: <Award className="w-5 h-5" /> },
                { value: "30+", label: "Pays dans le monde", icon: <Users className="w-5 h-5" /> },
                { value: "100%", label: "Fait à la main", icon: <Heart className="w-5 h-5" /> },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-6 border border-border text-center shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="w-11 h-11 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-futura font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground font-roboto mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-accent font-roboto text-sm uppercase tracking-[0.3em] mb-3">Notre parcours</p>
            <h2 className="text-4xl font-futura font-bold text-primary">Vingt ans de jalons</h2>
          </div>
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-accent/30 to-transparent" />
            <div className="space-y-10">
              {milestones.map((m) => (
                <div key={m.year} className="flex gap-6 items-start pl-2">
                  <div className="relative flex-shrink-0 w-14 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-accent text-white font-futura font-bold text-xs flex items-center justify-center shadow-lg z-10">
                      {m.year.slice(2)}
                    </div>
                  </div>
                  <div className="flex-1 bg-white rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow mb-2">
                    <p className="text-accent font-roboto text-sm font-semibold mb-1">{m.year}</p>
                    <h3 className="text-lg font-futura font-bold text-primary mb-2">{m.title}</h3>
                    <p className="text-muted-foreground font-roboto text-sm leading-relaxed">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-accent font-roboto text-sm uppercase tracking-[0.3em] mb-3">Les visages de Luxence</p>
            <h2 className="text-4xl font-futura font-bold text-primary">Notre équipe fondatrice</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl p-8 border border-border text-center shadow-sm hover:shadow-lg transition-all group">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/30 flex items-center justify-center mx-auto mb-5 group-hover:border-accent transition-colors">
                  <span className="font-futura font-bold text-accent text-xl">{member.initial}</span>
                </div>
                <h3 className="font-futura font-bold text-primary text-lg mb-1">{member.name}</h3>
                <p className="text-accent text-sm font-roboto font-semibold mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm font-roboto leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center space-y-6">
          <Lightbulb className="w-12 h-12 text-accent mx-auto" />
          <h2 className="text-4xl font-futura font-bold">Prêt à illuminer votre espace ?</h2>
          <p className="text-white/70 font-roboto max-w-xl mx-auto">
            Découvrez notre collection et laissez-vous inspirer par l'excellence Luxence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link to="/products" className="inline-flex items-center justify-center px-8 py-3 bg-accent hover:bg-accent/90 text-white font-futura font-bold rounded-lg transition-colors">
              Voir la collection
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center px-8 py-3 border-2 border-white/30 hover:border-white text-white font-futura font-bold rounded-lg transition-colors">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
