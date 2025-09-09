import { Train, BarChart3, Settings, Users, Home } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Train Fleet", href: "/fleet", icon: Train },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Operators", href: "/operators", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col bg-primary text-primary-foreground">
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-center border-b border-primary-hover">
        <div className="flex items-center space-x-2">
          <Train className="h-8 w-8 text-accent" />
          <span className="text-xl font-bold">RailPlan</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-primary-foreground/80 hover:bg-primary-hover hover:text-primary-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-primary-hover p-4">
        <div className="text-xs text-primary-foreground/60">
          <p>Train Induction Planning</p>
          <p>System v2.1.0</p>
        </div>
      </div>
    </div>
  );
}