import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, Plus, Minus } from "lucide-react";

export default function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </Link>
            </div>

            <div className="bg-white rounded-lg border border-border p-12 text-center space-y-6">
              <h1 className="text-3xl md:text-4xl font-futura font-bold text-primary">
                Panier Vide
              </h1>
              <p className="text-lg text-muted-foreground font-roboto">
                Vous n'avez pas encore ajouté de produits à votre panier.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-3 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg font-futura font-bold transition-all duration-300"
              >
                Continuer les achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              Continuer les achats
            </Link>
            <h1 className="text-4xl md:text-5xl font-futura font-bold text-primary">
              Votre Panier
            </h1>
            <p className="text-lg text-muted-foreground font-roboto mt-2">
              {items.length} article{items.length > 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border border-border p-6 flex items-center justify-between gap-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <Link
                      to={`/product/${item.slug}`}
                      className="text-xl font-futura font-bold text-primary hover:text-accent transition-colors block mb-2"
                    >
                      {item.name}
                    </Link>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center border-2 border-border rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                        className="p-2 hover:bg-secondary transition-colors"
                        title="Réduire la quantité"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-semibold text-foreground min-w-12 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-secondary transition-colors"
                        title="Augmenter la quantité"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer du panier"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1 h-fit">
              <div className="bg-white rounded-lg border border-border p-8 sticky top-4 space-y-6">
                <h2 className="text-2xl font-futura font-bold text-primary">
                  Votre Panier
                </h2>

                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  className="w-full flex items-center justify-center bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-futura font-bold transition-all duration-300 active:scale-95"
                >
                  Procéder au paiement
                </Link>

                {/* Clear Cart Button */}
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Êtes-vous sûr de vouloir vider le panier ?",
                      )
                    ) {
                      clearCart();
                    }
                  }}
                  className="w-full px-6 py-2 border-2 border-red-500 text-red-500 rounded-lg font-roboto font-semibold hover:bg-red-50 transition-colors"
                >
                  Vider le panier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
