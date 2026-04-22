import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Users, TrendingUp, Package, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DashboardStats {
  totalOrders: number;
  uniqueCustomers: number;
  totalProducts: number;
  visitorStats: {
    totalVisitors: number;
    uniqueVisitors: number;
    todayVisitors: number;
    last7Days: number;
    last30Days: number;
  };
  ordersbyStatus: {
    enAttente: number;
    enCours: number;
    livre: number;
    annule: number;
  };
  recentOrders: Array<{
    panierCode: string;
    customerName: string;
    status: string;
    date: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    uniqueCustomers: 0,
    totalProducts: 0,
    visitorStats: {
      totalVisitors: 0,
      uniqueVisitors: 0,
      todayVisitors: 0,
      last7Days: 0,
      last30Days: 0,
    },
    ordersbyStatus: {
      enAttente: 0,
      enCours: 0,
      livre: 0,
      annule: 0,
    },
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const previousOrderCountRef = useRef<number>(0);
  const notificationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchDashboardStats();

    // Set up periodic refresh every 30 seconds to check for new orders
    notificationIntervalRef.current = setInterval(() => {
      fetchDashboardStats();
    }, 30000);

    return () => {
      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current);
      }
    };
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [ordersResponse, productsResponse, visitorsResponse] =
        await Promise.all([
          fetch("/api/orders"),
          fetch("/api/products"),
          fetch("/api/analytics/visitors"),
        ]);

      // Parse JSON with error handling
      let ordersData: any = { orders: [] };
      let productsData: any = [];
      let visitorsData: any = {
        totalVisitors: 0,
        uniqueVisitors: 0,
        todayVisitors: 0,
        last7Days: 0,
        last30Days: 0,
      };

      if (ordersResponse.ok) {
        const contentType = ordersResponse.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          ordersData = await ordersResponse.json();
        }
      }

      if (productsResponse.ok) {
        const contentType = productsResponse.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          productsData = await productsResponse.json();
        }
      }

      if (visitorsResponse.ok) {
        const contentType = visitorsResponse.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          visitorsData = await visitorsResponse.json();
        }
      } else {
        console.error("Failed to fetch visitors:", visitorsResponse.status, visitorsResponse.statusText);
      }

      const orders = ordersData.orders || [];
      const products = productsData || [];

      // Calculate statistics
      const totalOrders = orders.length;
      const uniqueCustomers = new Set(
        orders.map((order: any) => order.customer.email),
      ).size;
      const totalProducts = products.length;

      // Count orders by status
      const ordersbyStatus = {
        enAttente: orders.filter((o: any) => o.status === "en attente").length,
        enCours: orders.filter((o: any) => o.status === "en cours").length,
        livre: orders.filter((o: any) => o.status === "livré").length,
        annule: orders.filter((o: any) => o.status === "annulé").length,
      };

      // Get recent orders
      const recentOrders = orders
        .slice()
        .reverse()
        .slice(0, 5)
        .map((order: any) => ({
          panierCode: order.panierCode,
          customerName: order.customer.name,
          status: order.status,
          date: new Date(order.createdAt).toLocaleDateString(),
        }));

      const visitorStats = visitorsData || {
        totalVisitors: 0,
        uniqueVisitors: 0,
        todayVisitors: 0,
        last7Days: 0,
        last30Days: 0,
      };

      setStats({
        totalOrders,
        uniqueCustomers,
        totalProducts,
        visitorStats,
        ordersbyStatus,
        recentOrders,
      });

      // Check for new pending orders and notify
      const currentPendingCount = ordersbyStatus.enAttente;
      if (
        previousOrderCountRef.current > 0 &&
        currentPendingCount > previousOrderCountRef.current
      ) {
        const newOrdersCount =
          currentPendingCount - previousOrderCountRef.current;
        toast.success(
          `🎉 ${newOrdersCount} nouvelle(s) commande(s) en attente!`,
          {
            description: `Total: ${currentPendingCount} commandes en attente`,
            duration: 5000,
          },
        );
      }
      previousOrderCountRef.current = currentPendingCount;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">Chargement du tableau de bord...</div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "en attente":
        return "bg-yellow-100 text-yellow-800";
      case "en cours":
        return "bg-blue-100 text-blue-800";
      case "livré":
        return "bg-green-100 text-green-800";
      case "annulé":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Prepare data for charts
  const statusData = [
    {
      name: "En attente",
      value: stats.ordersbyStatus.enAttente,
      color: "#eab308",
    },
    { name: "En cours", value: stats.ordersbyStatus.enCours, color: "#3b82f6" },
    { name: "Livré", value: stats.ordersbyStatus.livre, color: "#22c55e" },
    { name: "Annulé", value: stats.ordersbyStatus.annule, color: "#ef4444" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6 pb-6 border-b-2 border-secondary">
        <h2 className="text-3xl md:text-4xl font-futura font-bold text-foreground mb-2">
          Tableau de Bord
        </h2>
        <p className="text-muted-foreground font-roboto">
          Vue d'ensemble de votre activité commerciale
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <Card className="border-0 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 hover:shadow-lg transition-all duration-300 overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-accent/5 rounded-full group-hover:scale-110 transition-transform duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Commandes
            </CardTitle>
            <div className="p-2.5 bg-accent/15 rounded-lg">
              <ShoppingCart className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl lg:text-4xl font-bold text-accent mb-2">
              {stats.totalOrders}
            </div>
            <p className="text-xs text-muted-foreground font-roboto leading-relaxed">
              {stats.ordersbyStatus.enAttente > 0
                ? `${stats.ordersbyStatus.enAttente} en attente`
                : "Toutes traitées"}
            </p>
          </CardContent>
        </Card>

        {/* Unique Customers */}
        <Card className="border-0 bg-gradient-to-br from-blue-50 via-white to-blue-50/50 hover:shadow-lg transition-all duration-300 overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-blue-400/5 rounded-full group-hover:scale-110 transition-transform duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Clients
            </CardTitle>
            <div className="p-2.5 bg-blue-400/15 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
              {stats.uniqueCustomers}
            </div>
            <p className="text-xs text-muted-foreground font-roboto leading-relaxed">
              {stats.uniqueCustomers > 0 && stats.totalOrders > 0
                ? `${((stats.uniqueCustomers / stats.totalOrders) * 100).toFixed(1)}% conversions`
                : "Aucun client"}
            </p>
          </CardContent>
        </Card>

        {/* Total Products */}
        <Card className="border-0 bg-gradient-to-br from-purple-50 via-white to-purple-50/50 hover:shadow-lg transition-all duration-300 overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-purple-400/5 rounded-full group-hover:scale-110 transition-transform duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Catalogue
            </CardTitle>
            <div className="p-2.5 bg-purple-400/15 rounded-lg">
              <Package className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2">
              {stats.totalProducts}
            </div>
            <p className="text-xs text-muted-foreground font-roboto leading-relaxed">
              Produits actifs
            </p>
          </CardContent>
        </Card>

        {/* Visitors */}
        <Card className="border-0 bg-gradient-to-br from-green-50 via-white to-green-50/50 hover:shadow-lg transition-all duration-300 overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-green-400/5 rounded-full group-hover:scale-110 transition-transform duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Visiteurs
            </CardTitle>
            <div className="p-2.5 bg-green-400/15 rounded-lg">
              <Eye className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">
              {stats.visitorStats.uniqueVisitors}
            </div>
            <p className="text-xs text-muted-foreground font-roboto leading-relaxed">
              {stats.visitorStats.todayVisitors > 0
                ? `${stats.visitorStats.todayVisitors} aujourd'hui`
                : "Aucun visiteur"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Order Status Distribution */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-3 border-b border-secondary">
            <CardTitle className="text-lg font-futura font-bold text-foreground">
              Répartition des Statuts
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-2">
              Vue complète des commandes
            </p>
          </CardHeader>
          <CardContent>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData.filter((d) => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Order Status List */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-3 border-b border-secondary">
            <CardTitle className="text-lg font-futura font-bold text-foreground">
              Détail par Statut
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-2">
              Nombre et progression
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {statusData.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: status.color }}
                    ></div>
                    <span className="text-sm text-muted-foreground font-roboto font-medium">
                      {status.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-40 bg-secondary rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${(status.value / Math.max(1, stats.totalOrders)) * 100}%`,
                          backgroundColor: status.color,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-foreground w-8 text-right">
                      {status.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 mt-4">
        <CardHeader className="pb-4 border-b border-secondary">
          <CardTitle className="text-lg font-futura font-bold text-foreground">
            Commandes Récentes
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-2">
            {stats.recentOrders.length} dernière(s) commande(s)
          </p>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-accent/30 mb-3">
                <ShoppingCart className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-sm text-muted-foreground font-roboto">
                Aucune commande pour le moment
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-secondary">
                    <th className="text-left py-4 px-4 font-semibold text-foreground font-roboto">
                      Client
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground font-roboto">
                      Code Panier
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground font-roboto">
                      Date
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-foreground font-roboto">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order, index) => (
                    <tr
                      key={index}
                      className="border-b border-secondary/50 last:border-0 hover:bg-accent/5 transition-colors duration-200"
                    >
                      <td className="py-4 px-4 text-foreground font-medium font-roboto">
                        {order.customerName}
                      </td>
                      <td className="py-4 px-4 text-muted-foreground font-mono text-xs">
                        <span className="bg-secondary/50 px-2 py-1 rounded">
                          {order.panierCode}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground font-roboto">
                        {order.date}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`text-xs px-3 py-2 rounded-full font-semibold inline-block ${getStatusColor(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
