import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  LogOut,
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  Menu,
  X,
  Image,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import ProductsManager from "../components/admin/ProductsManager";
import CollectionsManager from "../components/admin/CollectionsManager";
import OrdersManager from "../components/admin/OrdersManager";
import AdminDashboard from "../components/admin/AdminDashboard";
import HeroSlidesManager from "../components/admin/HeroSlidesManager";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem("admin-auth");
    if (auth) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    // Listen for hash changes to update active tab
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (
        hash &&
        [
          "dashboard",
          "orders",
          "products",
          "collections",
          "hero-slides",
        ].includes(hash)
      ) {
        setActiveTab(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const checkForNewOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      const orders = data.orders || [];

      // Check for pending orders
      const pendingOrders = orders.filter(
        (order: any) => order.status === "en attente",
      );

      if (pendingOrders.length > 0) {
        toast.success(
          `${pendingOrders.length} commande(s) en attente de traitement!`,
          {
            description: "Consultez l'onglet Commandes pour les détails",
            duration: 5000,
          },
        );
      }
    } catch (error) {
      console.error("Error checking for new orders:", error);
    }
  };

  const handleLogin = async () => {
    // Simple password check - in production, use proper authentication
    const defaultPassword = "admin123";
    if (inputPassword === defaultPassword) {
      setIsAuthenticated(true);
      localStorage.setItem("admin-auth", "true");
      setLoginError("");
      setInputPassword("");

      // Check for new orders after login
      await checkForNewOrders();
    } else {
      setLoginError("Mot de passe invalide");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin-auth");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connexion Admin</CardTitle>
            <CardDescription>
              Entrez le mot de passe administrateur pour continuer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="password"
              placeholder="Entrez le mot de passe administrateur"
              value={inputPassword}
              onChange={(e) => {
                setInputPassword(e.target.value);
                setLoginError("");
              }}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <Button onClick={handleLogin} className="w-full">
              Connexion
            </Button>
            <Link
              to="/"
              className="block text-center text-sm text-muted-foreground hover:text-foreground"
            >
              Retour à l'accueil
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`bg-slate-900 text-white transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        } flex flex-col shadow-lg`}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-slate-700">
          <Link
            to="/"
            className="flex items-center justify-center h-12 hover:opacity-80 transition-opacity"
          >
            <img
              src="/assets/white-logo.svg"
              alt="Luxence Logo"
              className="h-full object-contain"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <NavItem
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Tableau de bord"
            href="#dashboard"
            isOpen={isSidebarOpen}
          />
          <NavItem
            icon={<ShoppingCart className="w-5 h-5" />}
            label="Commandes"
            href="#orders"
            isOpen={isSidebarOpen}
          />
          <NavItem
            icon={<Package className="w-5 h-5" />}
            label="Produits"
            href="#products"
            isOpen={isSidebarOpen}
          />
          <NavItem
            icon={<FolderOpen className="w-5 h-5" />}
            label="Collections"
            href="#collections"
            isOpen={isSidebarOpen}
          />
          <NavItem
            icon={<Image className="w-5 h-5" />}
            label="Hero Slides"
            href="#hero-slides"
            isOpen={isSidebarOpen}
          />
        </nav>

        {/* Toggle Button */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-border sticky top-0 z-40 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-futura font-bold text-foreground">
                Admin Panel
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Gérez vos produits, commandes et collections
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50/50 rounded-lg transition-colors duration-300"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-secondary/30">
          <div className="p-6 md:p-8">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              {/* Removed TabsList - Navigation handled by sidebar */}

              <TabsContent value="dashboard" className="space-y-4">
                <AdminDashboard />
              </TabsContent>

              <TabsContent value="orders" className="space-y-4">
                <OrdersManager />
              </TabsContent>

              <TabsContent value="products" className="space-y-4">
                <ProductsManager />
              </TabsContent>

              <TabsContent value="collections" className="space-y-4">
                <CollectionsManager />
              </TabsContent>

              <TabsContent value="hero-slides" className="space-y-4">
                <HeroSlidesManager />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

// Navigation Item Component
function NavItem({
  icon,
  label,
  href,
  isOpen,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  isOpen: boolean;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors group"
    >
      {icon}
      {isOpen && (
        <span className="text-sm font-roboto font-medium">{label}</span>
      )}
      {isOpen && (
        <span className="ml-auto text-xs opacity-0 group-hover:opacity-100 transition-opacity">
          →
        </span>
      )}
    </a>
  );
}
