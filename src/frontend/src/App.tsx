import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import type { College } from "./backend";
import { Header } from "./components/Header";
import { useIsAdmin } from "./hooks/useQueries";
import { AdminDashboard } from "./pages/AdminDashboard";
import { CollegeDetailPage } from "./pages/CollegeDetailPage";
import { HomePage } from "./pages/HomePage";

const queryClient = new QueryClient();

type Page = "home" | "college" | "admin";

function AppContent() {
  const [page, setPage] = useState<Page>("home");
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const { data: isAdmin } = useIsAdmin();

  const navigateToCollege = (college: College) => {
    setSelectedCollege(college);
    setPage("college");
  };

  const navigateHome = () => {
    setPage("home");
    setSelectedCollege(null);
  };

  const navigateAdmin = () => setPage("admin");

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(var(--background))" }}
    >
      <Header
        onNavigateHome={navigateHome}
        onNavigateAdmin={navigateAdmin}
        showAdmin={isAdmin}
      />

      {page === "home" && <HomePage onSelectCollege={navigateToCollege} />}

      {page === "college" && selectedCollege && (
        <CollegeDetailPage college={selectedCollege} onBack={navigateHome} />
      )}

      {page === "admin" && <AdminDashboard />}

      {/* Footer */}
      <footer
        className="mt-16 py-6 text-center text-sm"
        style={{
          borderTop: "1px solid oklch(var(--border))",
          color: "oklch(var(--muted-foreground))",
        }}
      >
        <p>
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "oklch(0.65 0.19 48)" }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      <Toaster position="top-center" richColors />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
