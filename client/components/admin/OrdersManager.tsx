import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Eye, Filter, Trash2, Edit2 } from "lucide-react";
import OrderDetailModal from "./OrderDetailModal";
import OrderEditModal from "./OrderEditModal";

interface Order {
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
  createdAt: string;
  updatedAt: string;
}

export default function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchOrders();
      return;
    }

    try {
      const response = await fetch(
        `/api/orders/search?query=${encodeURIComponent(searchQuery)}`,
      );
      const data = await response.json();
      setOrders(data.results || []);
    } catch (error) {
      console.error("Error searching orders:", error);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (
      !window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchOrders();
      } else {
        alert("Erreur lors de la suppression de la commande");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Erreur lors de la suppression de la commande");
    }
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    setShowEditModal(false);
    setEditingOrder(null);
    fetchOrders();
  };

  const filteredOrders = orders.filter(
    (order) => statusFilter === "all" || order.status === statusFilter,
  );

  if (loading) {
    return <div className="text-center py-8">Chargement des commandes...</div>;
  }

  if (showEditModal && editingOrder) {
    return (
      <OrderEditModal
        order={editingOrder}
        onSave={handleEditSave}
        onCancel={() => {
          setShowEditModal(false);
          setEditingOrder(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Detail Modal */}
      {showDetail && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => {
            setShowDetail(false);
            setSelectedOrder(null);
            fetchOrders();
          }}
          onStatusChange={handleStatusChange}
        />
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Commandes</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Total: {orders.length} | Affichées: {filteredOrders.length}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-border p-6 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Rechercher par code panier, nom, email ou téléphone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <Button type="submit" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Rechercher
          </Button>
        </form>

        {/* Status Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <button
            onClick={() => {
              setStatusFilter("all");
              setSearchQuery("");
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              statusFilter === "all"
                ? "bg-accent text-white"
                : "border border-border text-foreground hover:bg-secondary"
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => {
              setStatusFilter("en attente");
              setSearchQuery("");
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              statusFilter === "en attente"
                ? "bg-yellow-500 text-white"
                : "border border-border text-foreground hover:bg-secondary"
            }`}
          >
            En attente
          </button>
          <button
            onClick={() => {
              setStatusFilter("en cours");
              setSearchQuery("");
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              statusFilter === "en cours"
                ? "bg-blue-500 text-white"
                : "border border-border text-foreground hover:bg-secondary"
            }`}
          >
            En cours
          </button>
          <button
            onClick={() => {
              setStatusFilter("livré");
              setSearchQuery("");
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              statusFilter === "livré"
                ? "bg-green-500 text-white"
                : "border border-border text-foreground hover:bg-secondary"
            }`}
          >
            Livré
          </button>
          <button
            onClick={() => {
              setStatusFilter("annulé");
              setSearchQuery("");
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              statusFilter === "annulé"
                ? "bg-red-500 text-white"
                : "border border-border text-foreground hover:bg-secondary"
            }`}
          >
            Annulé
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">
                Aucune commande trouvée
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6 pb-6">
                <div className="space-y-5">
                  {/* Code Panier Header */}
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1.5">
                      Code Panier
                    </p>
                    <p className="text-xl font-futura font-bold text-accent">
                      {order.panierCode}
                    </p>
                  </div>

                  {/* Client and Articles - Compact Row */}
                  <div className="grid grid-cols-2 gap-6 py-4 border-y border-border">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                        Client
                      </p>
                      <p className="font-semibold text-foreground">
                        {order.customer.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {order.customer.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                        Articles
                      </p>
                      <p className="font-semibold text-foreground">
                        {order.items.length} article(s)
                      </p>
                    </div>
                  </div>

                  {/* Status and Actions Row */}
                  <div className="flex items-center gap-3">
                    {/* Status Badge */}
                    <div
                      className={`px-3 py-1.5 rounded-full font-semibold text-xs text-white flex-shrink-0 ${
                        order.status === "en attente"
                          ? "bg-yellow-500"
                          : order.status === "en cours"
                            ? "bg-blue-500"
                            : order.status === "livré"
                              ? "bg-green-500"
                              : "bg-red-500"
                      }`}
                    >
                      {order.status}
                    </div>

                    {/* Action Buttons - Horizontal */}
                    <div className="flex gap-2 flex-1">
                      {/* View Detail Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetail(true);
                        }}
                        className="flex-1 h-8 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        Détails
                      </Button>

                      {/* Edit Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(order)}
                        className="flex-1 h-8 text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                        Modifier
                      </Button>

                      {/* Delete Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(order.id)}
                        className="flex-1 h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                        Supprimer
                      </Button>
                    </div>
                  </div>

                  {/* Status Change Dropdown - Always visible and active */}
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                  >
                    <option value="en attente">En attente</option>
                    <option value="en cours">En cours</option>
                    <option value="livré">Livré</option>
                    <option value="annulé">Annulé</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
