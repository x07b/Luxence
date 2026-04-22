import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { toast } from "sonner";

interface OrderEditModalProps {
  order: {
    id: string;
    panierCode: string;
    customer: {
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      postalCode: string;
    };
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    total: number;
    status: "en attente" | "en cours" | "livré" | "annulé";
  };
  onSave: () => void;
  onCancel: () => void;
}

export default function OrderEditModal({
  order,
  onSave,
  onCancel,
}: OrderEditModalProps) {
  const [customer, setCustomer] = useState(order.customer);
  const [items, setItems] = useState(order.items);
  const [status, setStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);

  const handleItemQuantityChange = (index: number, quantity: number) => {
    if (quantity < 1) return;
    const newItems = [...items];
    newItems[index].quantity = quantity;
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const total = calculateTotal();
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items,
          total,
          status,
        }),
      });

      if (response.ok) {
        toast.success("Commande mise à jour avec succès");
        onSave();
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          try {
            const data = await response.json();
            toast.error(data.error || data.message || "Erreur lors de la mise à jour");
          } catch (parseError) {
            toast.error(`Erreur ${response.status}: ${response.statusText}`);
          }
        } else {
          toast.error(`Erreur ${response.status}: ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Erreur lors de la mise à jour de la commande");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Modifier la commande</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Informations Client</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer({ ...customer, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) =>
                      setCustomer({ ...customer, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ville</label>
                  <input
                    type="text"
                    value={customer.city}
                    onChange={(e) =>
                      setCustomer({ ...customer, city: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Adresse</label>
                  <input
                    type="text"
                    value={customer.address}
                    onChange={(e) =>
                      setCustomer({ ...customer, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Code Postal
                  </label>
                  <input
                    type="text"
                    value={customer.postalCode}
                    onChange={(e) =>
                      setCustomer({ ...customer, postalCode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-1">Statut</label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as "en attente" | "en cours" | "livré" | "annulé"
                  )
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="en attente">En attente</option>
                <option value="en cours">En cours</option>
                <option value="livré">Livré</option>
                <option value="annulé">Annulé</option>
              </select>
            </div>

            {/* Items */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Articles</h3>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="border border-border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{item.name}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Quantité
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemQuantityChange(index, parseInt(e.target.value))
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
