import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  name: string;
  description?: string;
  image: string;
  link: string;
}

export function CategoryCard({
  name,
  description,
  image,
  link,
}: CategoryCardProps) {
  return (
    <Link
      to={link}
      className="group relative overflow-hidden rounded-lg aspect-square"
    >
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <h3 className="text-2xl md:text-3xl font-futura font-bold text-white mb-2">
          {name}
        </h3>
        {description && (
          <p className="text-sm text-white/80 font-roboto mb-4">
            {description}
          </p>
        )}
        <div className="flex items-center gap-2 text-white font-roboto text-sm group-hover:gap-3 transition-all">
          Voir la collection
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
