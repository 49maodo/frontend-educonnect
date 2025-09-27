import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Moon, Sun, Menu, GraduationCap, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {useAuth} from "@/hooks/useAuth.ts";
import {useLogoutMutation} from "@/store/api/apiSlice.ts";
import {logout} from "@/store/slices/authSlice.ts";
import {toggleTheme} from "@/store/slices/themeSlice.ts";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      // Ignore the error, logout anyway
    } finally {
      dispatch(logout());
      navigate('/');
    }
  };

  const navItems = [
    { href: '/', label: 'Accueil' },
    { href: '/schools', label: 'Écoles' },
  ];

  const NavLinks = ({ mobile = false, onClose = () => {} }) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={`${
            mobile
              ? 'block px-4 py-2 text-sm'
              : 'text-sm font-medium'
          } text-foreground/70 hover:text-foreground transition-colors`}
          onClick={onClose}
        >
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <header className="container mx-auto sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-8 flex items-center space-x-2">
            <GraduationCap className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">EduConnect</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <NavLinks />
          </nav>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link
              to="/"
              className="flex items-center space-x-2"
              onClick={() => setIsOpen(false)}
            >
              <GraduationCap className="h-6 w-6" />
              <span className="font-bold">EduConnect</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] overflow-auto pb-10 pl-6">
              <div className="flex flex-col space-y-2">
                <NavLinks mobile onClose={() => setIsOpen(false)} />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link to="/" className="flex items-center space-x-2 md:hidden">
              <GraduationCap className="h-6 w-6" />
              <span className="font-bold">EduConnect</span>
            </Link>
          </div>
          
          <nav className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(toggleTheme())}
              className="h-8 w-8 px-0"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hidden md:inline-flex"
                >
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem asChild className="md:hidden">
                      <Link to="/dashboard" className="flex w-full">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Se déconnecter
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Connexion</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">S'inscrire</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}