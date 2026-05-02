import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  Heart,
  Lightbulb,
  Star,
  Users,
  Gem,
  Leaf,
  CheckCircle,
} from "lucide-react";

const milestones = [
  {
    year: "2004",
    title: "La naissance d'une vision",
    description:
      "Sophie Marchetti et Antoine Dufour fondent Luxence dans un atelier du Marais à Paris. Leur conviction : la lumière est le premier matériau du design d'intérieur, et elle mérite une maison entièrement dédiée à son excellence.",
    align: "right",
  },
  {
    year: "2009",
    title: "L'ouverture sur le monde",
    description:
      "Première collaboration avec des designers scandinaves. La collection « Nordique » est présentée au salon Maison & Objet et s'arrache en 48 heures. Luxence s'installe durablement dans le paysage du design international.",
    align: "left",
  },
  {
    year: "2014",
    title: "L'atelier provençal",
    description:
      "Ouverture de notre manufature en Provence : 47 artisans maîtres verriers, métalliers et ébénistes réunis sous un même toit. Chaque pièce est désormais entièrement fabriquée à la main en France, de l'esquisse à l'emballage.",
    align: "right",
  },
  {
    year: "2018",
    title: "Prix du Design Responsable",
    description:
      "Luxence reçoit le Grand Prix du Design Responsable, reconnaissant son engagement pour les matériaux durables et les circuits courts. Une fierté qui renforce notre conviction : luxe et éthique sont inséparables.",
    align: "left",
  },
  {
    year: "2021",
    title: "100% énergie renouvelable",
    description:
      "Notre atelier devient entièrement alimenté à l'énergie solaire. Les panneaux photovoltaïques couvrent 110% de nos besoins. Le surplus est réinjecté dans le réseau local — un engagement concret pour la planète.",
    align: "right",
  },
  {
    year: "2024",
    title: "Vingt ans, et l'avenir devant nous",
    description:
      "Deux décennies après notre fondation, Luxence rayonne dans 30 pays avec 200 pièces au catalogue. Nous lançons notre première collection 100% matériaux recyclés, sans compromis sur l'esthétique ni la durabilité.",
    align: "left",
  },
];

const team = [
  {
    name: "Sophie Marchetti",
    role: "Fondatrice & Directrice Artistique",
    bio: "Diplômée des Arts Décoratifs de Paris, Sophie a passé 15 ans à diriger les ateliers de création des plus grandes maisons avant de fonder Luxence. Sa signature : des pièces qui semblent suspendues entre sculpture et lumière.",
    initial: "SM",
    color: "from-orange-100 to-amber-50",
  },
  {
    name: "Antoine Dufour",
    role: "Co-fondateur & Directeur de Production",
    bio: "Ingénieur en matériaux de formation, Antoine apporte la rigueur technique qui permet à chaque vision artistique de Luxence de prendre forme sans compromis. Il supervise personnellement chaque nouveau process de fabrication.",
    initial: "AD",
    color: "from-blue-100 to-sky-50",
  },
  {
    name: "Léa Fontaine",
    role: "Directrice Créative",
    bio: "Après 10 ans chez les plus grandes maisons parisiennes, Léa orchestre la vision créative de chaque collection. Elle est à l'origine de la ligne « Organique » — notre best-seller depuis trois années consécutives.",
    initial: "LF",
    color: "from-purple-100 to-violet-50",
  },
];

const awards = [
  { year: "2018", title: "Grand Prix du Design Responsable", org: "Observatoire du Design" },
  { year: "2020", title: "Maison & Objet Rising Talent", org: "Salon M&O Paris" },
  { year: "2022", title: "Label Entreprise du Patrimoine Vivant", org: "Ministère de l'Économie" },
  { year: "2023", title: "Prix de l'Excellence Artisanale", org: "Fondation des Métiers d'Art" },
];

const values = [
  {
    icon: <Gem className="w-6 h-6" />,
    title: "Excellence",
    desc: "12 étapes de contrôle qualité pour chaque pièce.",
    link: "/nos-valeurs",
  },
  {
    icon: <Leaf className="w-6 h-6" />,
    title: "Responsabilité",
    desc: "100% énergie renouvelable, matériaux certifiés.",
    link: "/design-ethique",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Artisanat",
    desc: "47 maîtres artisans, fabrication 100% française.",
    link: "/nos-valeurs",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-primary text-white min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F4bd5a48984ac41abb50f4c9c327d1d89%2F912ded31f1c040bbb8e059f551179c76?format=webp&width=1400"
            alt="Atelier Luxence"
            className="w-full h-full object-cover opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/40" />
        </div>
        <div className="relative container mx-auto px-4 py-32 md:py-40">
          <div className="max-w-2xl">
            <p className="text-accent font-roboto text-sm uppercase tracking-[0.4em] mb-5">
              Fondée en 2004 · Paris, France
            </p>
            <h1 className="text-6xl md:text-8xl font-futura font-bold leading-[1.05] mb-8">
              À Propos<br />
              <span className="text-accent">de Luxence</span>
            </h1>
            <p className="text-xl text-white/75 font-roboto leading-relaxed mb-10 max-w-lg">
              Vingt ans à transformer la lumière en art. Une maison française, des artisans d'exception, une vision intemporelle.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent hover:bg-accent/90 text-white font-futura font-bold rounded-lg transition-all"
              >
                Découvrir la collection
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-white/30 hover:border-white text-white font-futura font-bold rounded-lg transition-all"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <div className="w-px h-12 bg-white/50 animate-pulse" />
        </div>
      </section>

      {/* ── MANIFESTE ── */}
      <section className="py-24 md:py-32 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="text-7xl text-accent font-futura opacity-30 leading-none select-none">"</div>
            <blockquote className="text-3xl md:text-4xl font-futura font-bold text-primary leading-tight -mt-6">
              Nous ne fabriquons pas des luminaires. Nous créons des présences lumineuses qui habitent vos espaces pour toujours.
            </blockquote>
            <p className="text-muted-foreground font-roboto text-lg">
              — Sophie Marchetti, Fondatrice
            </p>
            <div className="h-px w-24 bg-accent mx-auto mt-4" />
          </div>
        </div>
      </section>

      {/* ── CHIFFRES CLÉS ── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-7">
              <div>
                <p className="text-accent font-roboto text-sm uppercase tracking-[0.3em] mb-3">Notre identité</p>
                <h2 className="text-4xl md:text-5xl font-futura font-bold text-primary leading-tight">
                  L'art de la lumière,{" "}
                  <span className="text-accent">élevé au rang de vocation</span>
                </h2>
              </div>
              <p className="text-muted-foreground font-roboto leading-relaxed text-lg">
                Luxence est né d'une conviction simple mais profonde : la lumière est le premier élément de design d'un intérieur. Elle transforme les espaces, crée des ambiances et révèle les volumes.
              </p>
              <p className="text-muted-foreground font-roboto leading-relaxed">
                Depuis nos débuts dans un petit atelier parisien, nous avons toujours refusé de choisir entre beauté et fonctionnalité. Chaque luminaire Luxence est à la fois une source de lumière irréprochable et une sculpture qui sublime votre intérieur.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  "Fabriqué en France",
                  "Matériaux certifiés",
                  "Garantie 5 ans",
                  "Service sur mesure",
                ].map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent text-xs font-roboto font-semibold rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "20", label: "Ans d'expérience", sub: "Fondée en 2004", icon: <Star className="w-5 h-5" />, color: "text-amber-600", bg: "bg-amber-50" },
                { value: "200+", label: "Pièces au catalogue", sub: "Designs exclusifs", icon: <Award className="w-5 h-5" />, color: "text-purple-600", bg: "bg-purple-50" },
                { value: "30+", label: "Pays clients", sub: "Présence mondiale", icon: <Users className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-50" },
                { value: "47", label: "Maîtres artisans", sub: "Atelier provençal", icon: <Heart className="w-5 h-5" />, color: "text-rose-600", bg: "bg-rose-50" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-6 border border-border text-center shadow-sm hover:shadow-lg transition-all duration-300 group">
                  <div className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-3 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  <div className={`text-3xl font-futura font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm font-semibold text-foreground font-roboto mt-0.5">{stat.label}</div>
                  <div className="text-xs text-muted-foreground font-roboto mt-0.5">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-20 md:py-28 bg-primary text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-accent font-roboto text-sm uppercase tracking-[0.3em] mb-3">Notre parcours</p>
            <h2 className="text-4xl md:text-5xl font-futura font-bold">Vingt ans d'histoire</h2>
          </div>
          <div className="max-w-4xl mx-auto relative">
            {/* Centre line */}
            <div className="hidden md:block absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-white/20" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={m.year} className={`flex flex-col md:flex-row gap-6 md:gap-0 items-start md:items-center ${m.align === "left" ? "md:flex-row-reverse" : ""}`}>
                  {/* Content side */}
                  <div className={`flex-1 ${m.align === "left" ? "md:pl-12" : "md:pr-12"}`}>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                      <p className="text-accent font-roboto text-sm font-bold mb-1">{m.year}</p>
                      <h3 className="text-xl font-futura font-bold mb-2">{m.title}</h3>
                      <p className="text-white/65 font-roboto text-sm leading-relaxed">{m.description}</p>
                    </div>
                  </div>
                  {/* Centre dot */}
                  <div className="hidden md:flex flex-shrink-0 w-10 h-10 rounded-full bg-accent border-4 border-primary items-center justify-center z-10 shadow-lg shadow-accent/30">
                    <span className="text-white font-futura font-bold text-xs">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  {/* Empty side */}
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ÉQUIPE ── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-accent font-roboto text-sm uppercase tracking-[0.3em] mb-3">Les visages de Luxence</p>
            <h2 className="text-4xl font-futura font-bold text-primary">Notre équipe fondatrice</h2>
            <p className="text-muted-foreground font-roboto mt-4 max-w-xl mx-auto">
              Trois passionnés aux parcours complémentaires, unis par une même exigence de l'excellence.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className={`bg-gradient-to-br ${member.color} rounded-2xl p-8 border border-border hover:shadow-xl transition-all duration-300 group`}>
                <div className="w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                  <span className="font-futura font-bold text-accent text-2xl">{member.initial}</span>
                </div>
                <h3 className="font-futura font-bold text-primary text-xl mb-1 text-center">{member.name}</h3>
                <p className="text-accent text-sm font-roboto font-semibold mb-4 text-center">{member.role}</p>
                <div className="h-px w-12 bg-accent/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-sm font-roboto leading-relaxed text-center">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIX & RECONNAISSANCES ── */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-accent font-roboto text-sm uppercase tracking-[0.3em] mb-3">Reconnaissance</p>
            <h2 className="text-4xl font-futura font-bold text-primary">Prix & distinctions</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {awards.map((award) => (
              <div key={award.title} className="bg-white rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all text-center group">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent transition-colors duration-300">
                  <Award className="w-6 h-6 text-accent group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="text-2xl font-futura font-bold text-accent mb-1">{award.year}</p>
                <h3 className="font-roboto font-semibold text-primary text-sm mb-2 leading-snug">{award.title}</h3>
                <p className="text-xs text-muted-foreground font-roboto">{award.org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOS VALEURS PREVIEW ── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-accent font-roboto text-sm uppercase tracking-[0.3em] mb-3">Ce qui nous définit</p>
            <h2 className="text-4xl font-futura font-bold text-primary">Nos engagements</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
            {values.map((v) => (
              <Link key={v.title} to={v.link} className="group bg-white rounded-2xl p-8 border border-border hover:border-accent hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-5 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  {v.icon}
                </div>
                <h3 className="font-futura font-bold text-primary text-lg mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm font-roboto leading-relaxed mb-4">{v.desc}</p>
                <span className="inline-flex items-center gap-1 text-accent text-xs font-roboto font-semibold group-hover:gap-2 transition-all">
                  En savoir plus <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary to-primary/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 text-center space-y-6">
          <Lightbulb className="w-14 h-14 text-accent mx-auto" />
          <h2 className="text-4xl md:text-5xl font-futura font-bold">
            Prêt à illuminer votre espace ?
          </h2>
          <p className="text-white/70 font-roboto max-w-xl mx-auto text-lg">
            Découvrez notre collection et laissez-vous inspirer par vingt ans d'excellence Luxence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link to="/products" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-accent/90 text-white font-futura font-bold rounded-lg transition-all text-lg">
              Voir la collection
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 hover:border-white text-white font-futura font-bold rounded-lg transition-all text-lg">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
