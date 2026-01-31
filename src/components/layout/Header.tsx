import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Brain, LayoutDashboard, Settings, LogIn, LogOut, Menu } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { getUser, clearUser } from "@/lib/storage";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    const checkUser = () => setUser(getUser());
    window.addEventListener('storage', checkUser);
    
    // Check periodically for changes
    const interval = setInterval(checkUser, 1000);
    
    return () => {
      window.removeEventListener('storage', checkUser);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    clearUser();
    setUser(null);
    navigate('/');
  };

  const NavItems = ({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) => (
    <>
      <NavLink 
        to="/dashboard" 
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        activeClassName="text-primary"
        onClick={onClose}
      >
        <LayoutDashboard className="w-4 h-4" />
        Dashboard
      </NavLink>
      <NavLink 
        to="/settings" 
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        activeClassName="text-primary"
        onClick={onClose}
      >
        <Settings className="w-4 h-4" />
        Settings
      </NavLink>
      {user?.isLoggedIn ? (
        <Button variant="ghost" size="sm" onClick={() => { handleLogout(); onClose?.(); }} className="gap-2">
          <LogOut className="w-4 h-4" />
          Log out
        </Button>
      ) : (
        <Button variant="default" size="sm" onClick={() => { navigate('/auth'); onClose?.(); }} className="gap-2">
          <LogIn className="w-4 h-4" />
          Sign in
        </Button>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg hidden sm:block">Perception Auditor</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <NavItems />
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <nav className="flex flex-col gap-4 mt-8">
              <NavItems mobile onClose={() => {}} />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
