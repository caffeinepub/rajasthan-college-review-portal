import type { ReactNode } from "react";

interface HeaderProps {
  onNavigateHome: () => void;
  onNavigateAdmin: () => void;
  showAdmin?: boolean;
  children?: ReactNode;
}

export function Header({
  onNavigateHome,
  onNavigateAdmin,
  showAdmin,
  children,
}: HeaderProps) {
  return (
    <header>
      <div className="rajasthan-hero h-[200px] sm:h-[260px] flex items-end pb-6 px-4 sm:px-8">
        <div className="relative z-10 w-full max-w-5xl mx-auto">
          <div className="flex items-end justify-between">
            <div>
              <h1
                className="font-display text-2xl sm:text-4xl font-bold text-white leading-tight"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}
              >
                Rajasthan College Review Portal
              </h1>
              <p
                className="text-sm sm:text-base mt-1 font-sans"
                style={{
                  color: "oklch(0.92 0.08 80)",
                  textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                }}
              >
                अपने कॉलेज का सच जानो · Apne College Ka Sach Jaano
              </p>
            </div>
            <nav className="flex gap-2 pb-1">
              <button
                type="button"
                onClick={onNavigateHome}
                className="text-white/90 hover:text-white text-sm font-medium px-3 py-1.5 rounded-md"
                style={{
                  background: "oklch(0.22 0.08 35 / 0.45)",
                  backdropFilter: "blur(4px)",
                }}
              >
                Home
              </button>
              {showAdmin && (
                <button
                  type="button"
                  onClick={onNavigateAdmin}
                  className="text-white/90 hover:text-white text-sm font-medium px-3 py-1.5 rounded-md"
                  style={{
                    background: "oklch(0.65 0.19 48 / 0.7)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  Admin
                </button>
              )}
            </nav>
          </div>
        </div>
      </div>
      <div
        className="h-2"
        style={{
          background:
            "linear-gradient(to right, oklch(0.35 0.1 25), oklch(0.65 0.19 48), oklch(0.78 0.17 85), oklch(0.65 0.19 48), oklch(0.35 0.1 25))",
        }}
      />
      {children && (
        <div className="bg-card border-b border-border">{children}</div>
      )}
    </header>
  );
}
