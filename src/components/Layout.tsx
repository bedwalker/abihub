import { Navigation } from "./Navigation";
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useLocation } from "react-router";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && user && !user.isAnonymous && !user.name && location.pathname !== "/profile-setup") {
      navigate("/profile-setup");
    }
  }, [user, isLoading, navigate, location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="md:ml-64 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}