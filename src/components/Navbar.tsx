"use client";
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, X, ArrowRight, Sun, Moon, Settings } from 'lucide-react';
import { useTheme } from 'next-themes';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { checkIsAdmin, getUserRole } from '@/actions/user';
import RoleBadge from './shared/RoleBadge';

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isDesktopProductsOpen, setIsDesktopProductsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isLoaded, isSignedIn, user } = useUser();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (!isMenuOpen) return;

    const html = document.documentElement;
    const body = document.body;

    scrollYRef.current = window.scrollY;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyPosition = body.style.position;
    const prevBodyTop = body.style.top;
    const prevBodyLeft = body.style.left;
    const prevBodyRight = body.style.right;
    const prevBodyWidth = body.style.width;

    html.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollYRef.current}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.position = prevBodyPosition;
      body.style.top = prevBodyTop;
      body.style.left = prevBodyLeft;
      body.style.right = prevBodyRight;
      body.style.width = prevBodyWidth;
      window.scrollTo(0, scrollYRef.current);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (user?.id) {
      const verifyRole = async () => {
        const [isAdminUser, role] = await Promise.all([
          checkIsAdmin(),
          getUserRole()
        ]);
        setIsAdmin(isAdminUser);
        setUserRole(role);
      };
      verifyRole();
    }
  }, [user?.id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMenuOpen(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsProductsOpen(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDesktopProductsOpen(false);
  }, [pathname]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const toggleTheme = (e?: React.MouseEvent | Event) => {
    // Fallback for browsers that don't support View Transition API
    if (!document.startViewTransition) {
      setTheme(theme === 'dark' ? 'light' : 'dark');
      return;
    }

    let x: number;
    let y: number;

    // Check if profile picture exists (signed in) to originate animation from it
    const profilePic = document.getElementById('user-button-wrap') || document.querySelector('.cl-userButtonTrigger');
    if (profilePic) {
      const rect = profilePic.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    } else if (e && 'clientX' in e && (e as React.MouseEvent).clientX > 0) {
      // Use click coordinates if clicked natively on the outside button
      x = (e as React.MouseEvent).clientX;
      y = (e as React.MouseEvent).clientY;
    } else {
      // Fallback
      x = window.innerWidth - 60;
      y = 28;
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 1000,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) setIsProductsOpen(false);
  };

  const toggleProducts = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsProductsOpen(!isProductsOpen);
  };

  const logoSrc = mounted && theme === 'dark'
    ? '/images/goals-floors-logo-white.svg'
    : '/images/goals floors logo.svg';

  return (
    <>
      <header className="fixed w-full top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">

            {/* 1. Logo Section */}
            <div className="flex-shrink-0">
              <Link href="/" aria-label="Goals Floors Home" className="flex items-center">
                <Image
                  src={logoSrc}
                  alt="Goals Floors Logo"
                  width={140}
                  height={35}
                  priority
                  className="h-7 w-auto object-contain transition-opacity duration-300"
                />
              </Link>
            </div>

            {/* 2. Desktop Menu */}
            <nav className="hidden md:flex space-x-6 items-center h-full">
              <Link href="/" className="text-txt-main hover:text-amber-600 dark:hover:text-amber-500 font-medium text-base transition-colors h-full flex items-center border-b-2 border-transparent hover:border-amber-600 px-1">Home</Link>
              <div
                className="h-full flex items-center"
                onMouseEnter={() => setIsDesktopProductsOpen(true)}
                onMouseLeave={() => setIsDesktopProductsOpen(false)}
              >
                <Link
                  href="/products"
                  className={`flex items-center gap-1 text-txt-main hover:text-amber-600 dark:hover:text-amber-500 font-medium text-base transition-colors h-full px-1 border-b-2 ${isDesktopProductsOpen ? 'border-amber-600 text-amber-600' : 'border-transparent'}`}
                >
                  Products <ChevronDown className={`w-4 h-4 transition-transform ${isDesktopProductsOpen ? 'rotate-180' : ''}`} />
                </Link>
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 w-[1100px] bg-white dark:bg-slate-900 shadow-2xl border-t border-amber-600 transition-all duration-300 transform z-50 rounded-b-sm ${isDesktopProductsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'
                    }`}
                >
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative overflow-hidden">
                    <div className="absolute -bottom-10 -right-10 text-9xl font-normal text-gray-100/50 dark:text-gray-800/20 select-none pointer-events-none">G</div>

                    {/* Column 1: WALL PANELS (Indoor) */}
                    <div>
                      <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">Wall Panels (Indoor)</h3>
                      <ul className="space-y-3">
                        <li><Link href="/products/wall-panels" onClick={() => setIsDesktopProductsOpen(false)} className="group/item text-gray-900 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-500 text-sm transition-colors flex items-center gap-2 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>Wall Panels</Link></li>
                        <li><Link href="/products/upfit-panels" onClick={() => setIsDesktopProductsOpen(false)} className="group/item text-gray-900 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-500 text-sm transition-colors flex items-center gap-2 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>Upfit Panels</Link></li>
                        <li><Link href="/products/tokyo-charcoal-moulding" onClick={() => setIsDesktopProductsOpen(false)} className="group/item text-gray-900 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-500 text-sm transition-colors flex items-center gap-2 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>Tokyo Moulding</Link></li>
                        <li><Link href="/products/cobra-pu-stone" onClick={() => setIsDesktopProductsOpen(false)} className="group/item text-gray-900 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-500 text-sm transition-colors flex items-center gap-2 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>Cobra PU Stone</Link></li>
                      </ul>
                    </div>

                    {/* Column 2: EXTERIOR & OUTDOOR */}
                    <div>
                      <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">Exterior & Outdoor</h3>
                      <ul className="space-y-3">
                        <li><Link href="/products/wpc-exterior-louvers" onClick={() => setIsDesktopProductsOpen(false)} className="group/item text-gray-900 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-500 text-sm transition-colors flex items-center gap-2 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>Exterior Louvers</Link></li>
                        <li><Link href="/products/artificial-grass" onClick={() => setIsDesktopProductsOpen(false)} className="group/item text-gray-900 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-500 text-sm transition-colors flex items-center gap-2 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>Artificial Grass</Link></li>
                        <li><Link href="/products/wpc-decking" onClick={() => setIsDesktopProductsOpen(false)} className="group/item text-gray-900 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-500 text-sm transition-colors flex items-center gap-2 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>WPC Decking</Link></li>
                      </ul>
                    </div>

                    {/* Column 3: PREMIUM FLOORING */}
                    <div>
                      <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">Premium Flooring</h3>
                      <ul className="space-y-3">
                        <li><Link href="/products/spc-flooring" onClick={() => setIsDesktopProductsOpen(false)} className="group/item text-gray-900 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-500 text-sm transition-colors flex items-center gap-2 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>SPC Flooring</Link></li>
                        <li><Link href="/products/laminate-flooring" onClick={() => setIsDesktopProductsOpen(false)} className="group/item text-gray-900 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-500 text-sm transition-colors flex items-center gap-2 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>Laminate Flooring</Link></li>
                        <li><Link href="/products/herringbone-laminate-flooring" onClick={() => setIsDesktopProductsOpen(false)} className="group/item text-gray-900 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-500 text-sm transition-colors flex items-center gap-2 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>Herringbone Flooring</Link></li>
                        <li><Link href="/products/hybrid-laminate-flooring" onClick={() => setIsDesktopProductsOpen(false)} className="group/item text-gray-900 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-500 text-sm transition-colors flex items-center gap-2 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>Hybrid Flooring</Link></li>
                      </ul>
                    </div>

                    {/* Column 4: ARCHITECTURAL CEILINGS */}
                    <div>
                      <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">Architectural Ceilings</h3>
                      <ul className="space-y-3">
                        <li><Link href="/products/wpc-baffle-ceiling" onClick={() => setIsDesktopProductsOpen(false)} className="group/item text-gray-900 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-500 text-sm transition-colors flex items-center gap-2 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>Baffle Ceiling</Link></li>
                        <li><Link href="/products/wpc-timber-tubes" onClick={() => setIsDesktopProductsOpen(false)} className="group/item text-gray-900 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-500 text-sm transition-colors flex items-center gap-2 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>WPC Timber Tubes</Link></li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-950 p-4 border-t border-gray-100 dark:border-gray-800 text-center">
                    <Link href="/products" onClick={() => setIsDesktopProductsOpen(false)} className="text-sm font-normal text-amber-600 hover:text-amber-700 uppercase tracking-widest inline-flex items-center gap-2 group/btn">
                      Explore Full Catalog <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>

              <Link href="/blogs" className="text-txt-main hover:text-amber-700 dark:hover:text-amber-500 font-medium text-base transition-colors h-full flex items-center border-b-2 border-transparent hover:border-amber-600 px-1">Blogs</Link>
              <Link href="/about" className="text-txt-main hover:text-amber-700 dark:hover:text-amber-500 font-medium text-base transition-colors h-full flex items-center border-b-2 border-transparent hover:border-amber-600 px-1">About</Link>
              <Link href="/contact" className="text-txt-main hover:text-amber-700 dark:hover:text-amber-500 font-medium text-base transition-colors h-full flex items-center border-b-2 border-transparent hover:border-amber-600 px-1">Contact</Link>
              <Link href="/dealer" className="text-txt-main hover:text-amber-700 dark:hover:text-amber-500 font-medium text-base transition-colors h-full flex items-center border-b-2 border-transparent hover:border-amber-600 px-1 whitespace-nowrap">Become a Dealer</Link>
            </nav>

            {/* 3. Right Section */}
            <div className="flex items-center gap-2 md:gap-4">
              {isLoaded && mounted ? (
                <>
                  {!isSignedIn && (
                    <button
                      onClick={toggleTheme as any}
                      className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                      aria-label="Toggle Dark Mode"
                    >
                      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                  )}

                  {isSignedIn ? (
                    <div id="user-button-wrap" className="relative flex items-center justify-center">
                      <UserButton 
                        appearance={{ 
                          elements: { 
                            userButtonPopoverActionButton__manageAccount: 'hidden',
                            // Center the popup card on mobile screens, keep default Clerk behavior on desktop
                            userButtonPopoverCard: 'max-md:!fixed max-md:!left-1/2 max-md:!-translate-x-1/2 max-md:!top-[70px] max-w-[calc(100vw-2rem)] mx-auto shadow-2xl border border-gray-100 dark:border-gray-800'
                          } 
                        }}
                      >
                        <UserButton.MenuItems>
                          {isAdmin && (
                            <UserButton.Link
                              label="Admin Panel"
                              labelIcon={<Settings className="w-4 h-4 ml-1" />}
                              href="/admin"
                            />
                          )}
                          <UserButton.Action 
                            label={theme === 'dark' ? "Light Mode" : "Dark Mode"}
                            labelIcon={theme === 'dark' ? <Sun className="w-4 h-4 ml-1" /> : <Moon className="w-4 h-4 ml-1" />}
                            onClick={() => toggleTheme()}
                          />
                        </UserButton.MenuItems>
                      </UserButton>
                      {/* Universal Round Image Badge for Staff */}
                      {userRole && ["administrator", "admin", "team"].includes(userRole) && (
                        <div className="absolute bottom-[-15px] right-[-10px] pointer-events-none z-10">
                          <RoleBadge role={userRole} size="lg" showText={false} className="border-2 border-white dark:border-slate-950 rounded-full" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <SignInButton mode="modal">
                      <button className="shine-btn bg-gray-900 dark:bg-amber-600 text-white px-3 py-1.5 md:px-5 md:py-2 text-sm font-normal hover:bg-amber-600 dark:hover:bg-amber-700 transition-all active:scale-95 rounded-sm">
                        Login
                      </button>
                    </SignInButton>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 animate-pulse"></div>
                  <div className="w-[70px] md:w-[92px] h-8 md:h-9 rounded-sm bg-gray-100 dark:bg-slate-800 animate-pulse" />
                </div>
              )}

              <button onClick={toggleMenu} className="md:hidden p-2 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800 rounded-full transition-colors ml-1">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ================= NORMAL MOBILE MENU PANEL ================= */}
      <div
        className={`md:hidden fixed inset-0 top-[56px] bg-white dark:bg-slate-950 z-[100] transition-all duration-300 transform ${isMenuOpen
          ? 'translate-x-0 opacity-100 flex'
          : 'translate-x-full opacity-0 pointer-events-none hidden'
          }`}
      >
        <nav className="flex flex-col p-6 pb-24 gap-4 h-full overflow-y-auto overscroll-contain bg-white dark:bg-slate-950 flex-1">
          <Link href="/" onClick={toggleMenu} className="text-lg font-normal text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
            Home
          </Link>

          {/* Products Accordion Section */}
          <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
            <button
              onClick={toggleProducts}
              className="flex items-center justify-between w-full text-lg font-normal text-gray-900 dark:text-white py-1"
            >
              Products
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isProductsOpen ? 'rotate-180 text-amber-600' : ''}`} />
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${isProductsOpen ? 'max-h-[2000px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="flex flex-col gap-6 pl-4 border-l border-amber-100 dark:border-gray-800">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Wall Panels (Indoor)</h4>
                    <div className="flex flex-col gap-2">
                      <Link href="/products/wall-panels" onClick={toggleMenu} className="text-base font-medium text-txt-main hover:text-amber-600 transition-colors">Wall Panels</Link>
                      <Link href="/products/upfit-panels" onClick={toggleMenu} className="text-base font-medium text-txt-main hover:text-amber-600 transition-colors">Upfit Panels</Link>
                      <Link href="/products/tokyo-charcoal-moulding" onClick={toggleMenu} className="text-base font-medium text-txt-main hover:text-amber-600 transition-colors">Tokyo Moulding</Link>
                      <Link href="/products/cobra-pu-stone" onClick={toggleMenu} className="text-base font-medium text-txt-main hover:text-amber-600 transition-colors">Cobra PU Stone</Link>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Exterior & Outdoor</h4>
                    <div className="flex flex-col gap-2">
                      <Link href="/products/wpc-exterior-louvers" onClick={toggleMenu} className="text-base font-medium text-txt-main hover:text-amber-600 transition-colors">Exterior Louvers</Link>
                      <Link href="/products/artificial-grass" onClick={toggleMenu} className="text-base font-medium text-txt-main hover:text-amber-600 transition-colors">Artificial Grass</Link>
                      <Link href="/products/wpc-decking" onClick={toggleMenu} className="text-base font-medium text-txt-main hover:text-amber-600 transition-colors">WPC Decking</Link>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Premium Flooring</h4>
                    <div className="flex flex-col gap-2">
                      <Link href="/products/spc-flooring" onClick={toggleMenu} className="text-base font-medium text-txt-main hover:text-amber-600 transition-colors">SPC Flooring</Link>
                      <Link href="/products/laminate-flooring" onClick={toggleMenu} className="text-base font-medium text-txt-main hover:text-amber-600 transition-colors">Laminate Flooring</Link>
                      <Link href="/products/herringbone-laminate-flooring" onClick={toggleMenu} className="text-base font-medium text-txt-main hover:text-amber-600 transition-colors">Herringbone Flooring</Link>
                      <Link href="/products/hybrid-laminate-flooring" onClick={toggleMenu} className="text-base font-medium text-txt-main hover:text-amber-600 transition-colors">Hybrid Flooring</Link>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Architectural Ceilings</h4>
                    <div className="flex flex-col gap-2">
                      <Link href="/products/wpc-baffle-ceiling" onClick={toggleMenu} className="text-base font-medium text-txt-main hover:text-amber-600 transition-colors">Baffle Ceiling</Link>
                      <Link href="/products/wpc-timber-tubes" onClick={toggleMenu} className="text-base font-medium text-txt-main hover:text-amber-600 transition-colors">WPC Timber Tubes</Link>
                    </div>
                  </div>
                </div>
                <Link href="/products" onClick={toggleMenu} className="text-sm font-normal text-amber-600 flex items-center gap-2 py-2">
                  View All Products <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>


          <Link href="/blogs" onClick={toggleMenu} className="text-lg font-medium text-txt-main border-b border-gray-100 dark:border-gray-800 pb-3">Blogs</Link>
          <Link href="/about" onClick={toggleMenu} className="text-lg font-medium text-txt-main border-b border-gray-100 dark:border-gray-800 pb-3">About Us</Link>
          <Link href="/dealer" onClick={toggleMenu} className="text-lg font-normal text-amber-600 border-b border-gray-100 dark:border-gray-800 pb-3">Become a Dealer</Link>
          <Link href="/contact" onClick={toggleMenu} className="text-lg font-normal text-amber-600 border-b border-gray-100 dark:border-gray-800 pb-3">Contact Us</Link>
        </nav>
      </div>
    </>
  );
}