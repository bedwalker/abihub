import { Home, Users, Euro, Megaphone, Calendar, CheckSquare, Camera, Phone, Settings, MoreHorizontal, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/dashboard", icon: Home, label: "Dashboard" },
  { path: "/profiles", icon: Users, label: "Profile" },
  { path: "/finances", icon: Euro, label: "Finanzen" },
  { path: "/announcements", icon: Megaphone, label: "Ankündigungen" },
  { path: "/events", icon: Calendar, label: "Events" },
  { path: "/todos", icon: CheckSquare, label: "To-Dos" },
  { path: "/gallery", icon: Camera, label: "Galerie" },
  { path: "/contacts", icon: Phone, label: "Kontakte" },
];

export function Navigation() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col border-r bg-card">
        <div className="p-6 border-b">
          <Link to="/dashboard" className="flex items-center gap-3">
            <img src="/logo.svg" alt="AbiConnect" className="w-10 h-10" />
            <span className="text-xl font-bold tracking-tight">AbiConnect</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer",
                location.pathname === "/admin"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Admin</span>
            </Link>
          )}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 3).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 cursor-pointer",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 cursor-pointer text-muted-foreground"
              >
                <MoreHorizontal className="w-5 h-5" />
                <span className="text-xs">Mehr</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Alle Seiten</SheetTitle>
                <SheetDescription>
                  Navigiere zu allen verfügbaren Seiten
                </SheetDescription>
              </SheetHeader>
              <nav className="mt-6 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer",
                      location.pathname === "/admin"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Admin</span>
                  </Link>
                )}
                <div className="pt-4 mt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Abmelden
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
}