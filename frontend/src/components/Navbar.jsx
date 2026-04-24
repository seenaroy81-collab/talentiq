import { Link, useLocation } from "react-router";
import { LayoutDashboardIcon, SparklesIcon, MenuIcon } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-base-content/5 bg-base-100/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-base-100/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="group flex items-center gap-3"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="relative size-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20"
            >
              <SparklesIcon className="size-5 text-white fill-white/20" />
            </motion.div>
          </div>

          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight flex items-center gap-1">
              Talent
              <span className="text-primary">IQ</span>
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/dashboard" active={isActive("/dashboard")} icon={<LayoutDashboardIcon className="size-4" />} label="Dashboard" />
        </div>

        <div className="flex items-center gap-4">
          <div className="h-6 w-px bg-base-content/10 hidden md:block" />
          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-9 ring-2 ring-base-content/10 hover:ring-primary/50 transition-all",
                userButtonPopoverCard: "shadow-xl border border-base-content/10"
              }
            }}
          />
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, active, icon, label }) {
  return (
    <Link
      to={to}
      className={`relative px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 group overflow-hidden ${active
        ? "text-primary font-bold bg-primary/10"
        : "text-base-content/70 hover:text-base-content hover:bg-base-200/50"
        }`}
    >
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {label}
      </span>
      {active && (
        <motion.div
          layoutId="navbar-active"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
        />
      )}
    </Link>
  );
}

export default Navbar;
