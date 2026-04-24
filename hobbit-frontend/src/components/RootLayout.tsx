import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Home, Compass, Plus, ChevronLeft, Trash2, User, Settings, Menu, X } from 'lucide-react';
import { useHobbyStore } from '../stores/useHobbyStore';
import { cn } from '../utils/cn';
import logoPng from '../assets/logo.png';
import chatPng from '../assets/chat.png';

import { useCollectionStore } from '../stores/useCollectionStore';
import { HobbyButton } from './atoms/HobbyButton';

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hobbies = useHobbyStore(state => state.hobbies);
  const deleteHobby = useHobbyStore(state => state.deleteHobby);

  const match = location.pathname.match(/^\/collection\/(.+)$/);
  const collectionId = match ? match[1] : 'general';

  const collections = useCollectionStore(state => state.collections);
  const deleteCollection = useCollectionStore(state => state.deleteCollection);
  const addHobbyToCollection = useCollectionStore(state => state.addHobbyToCollection);
  const collection = collections.find(c => c.id === collectionId);
  const title = collection ? collection.name : 'General Collection';
  const filteredHobbies = collectionId === 'general'
    ? hobbies
    : hobbies.filter(h => collection?.hobbyIds.includes(h.hobbyId));

  const availableHobbies = hobbies.filter(h => !collection?.hobbyIds.includes(h.hobbyId));
  const [showPicker, setShowPicker] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileChatMenuOpen, setMobileChatMenuOpen] = useState(false);

  const isExplorePage = location.pathname === '/explore' || !!match;
  const isNewChatPage = location.pathname === '/new-chat';
  const isChatPage = isExplorePage || isNewChatPage;
  const isPlanPage = location.pathname.startsWith('/plan/') || location.pathname.startsWith('/technique/');
  const isFresh = searchParams.get('fresh') === '1';
  const showSidebar = isExplorePage && hobbies.length > 0;


  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    const isCollectionPage = !!location.pathname.match(/^\/collection\/(.+)$/);
    if (isMobile && isCollectionPage && !mobileChatMenuOpen) {
      setMobileChatMenuOpen(true);
    }
  }, [location.pathname, mobileChatMenuOpen]);

  const leftNavItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Explore', href: '/explore', icon: Compass },
    { name: 'New', href: '/new-chat', icon: Plus },
  ];

  const rightNavItems = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#fffbf4] text-slate-900 selection:bg-indigo-500/30">
      <div className={cn(
        "min-h-[100dvh] flex flex-col lg:grid",
        showSidebar ? "lg:grid-cols-[80px_280px_1fr_80px]" : "lg:grid-cols-[80px_1fr_80px]"
      )}>
        <aside className="hidden lg:block border-r border-black/5 bg-[#fff9ef] backdrop-blur-xl sticky top-0 h-[100dvh] w-[80px]">
            <div className="h-full flex flex-col items-center py-5">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex items-center justify-center mb-3">
                <img src={logoPng} alt="Hobbit" className="w-20 h-20 object-contain" />
              </div>
              <nav className="flex flex-col gap-1">
                {leftNavItems.map((item) => {
                  const Icon = item.icon;
                  const currentPath = location.pathname + (location.search || '');
                  const isActive = currentPath === item.href || (item.name === 'Explore' && isExplorePage) || (item.name === 'New' && isNewChatPage);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'flex flex-col items-center gap-1 group transition-colors',
                        isActive ? 'text-slate-900 font-bold' : 'text-slate-500'
                      )}
                      onClick={() => {
                        if (item.name === 'Explore' && window.innerWidth < 1024) {
                          setMobileChatMenuOpen(true);
                        }
                      }}
                      aria-label={item.name}
                      title={item.name}
                    >
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center">
                        <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
                      </div>
                      <span className={cn("text-base leading-none", isActive ? "font-bold" : "font-medium")}>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

        {showSidebar && (
          <>
            <div
              className={cn(
                "fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm transition-opacity lg:hidden",
                mobileChatMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
              onClick={() => setMobileChatMenuOpen(false)}
            />
            <aside className={cn(
              "border-r border-black/5 bg-[#fff9ef] backdrop-blur-xl h-[100dvh] w-[280px] z-[70]",
              "fixed lg:sticky lg:top-0 top-0 left-0 transition-transform duration-300 ease-in-out",
              mobileChatMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
              <div className="h-full flex flex-col py-6">
                <div className="flex items-center justify-between mb-8 px-6">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-1 text-slate-900 font-bold hover:opacity-70 transition-opacity"
                  >
                    <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                    <span className="text-[17px] font-bold tracking-tight truncate max-w-[150px]">{title}</span>
                  </button>
                  {collectionId !== 'general' && (
                    <button
                      onClick={() => {
                        deleteCollection(collectionId);
                        navigate('/dashboard');
                      }}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="pt-6 border-t border-black/5 mb-8">
                  <div className="px-6">
                    <HobbyButton
                      onClick={() => {
                        setMobileChatMenuOpen(false);
                        navigate('/new-chat?fresh=1');
                      }}
                      className={cn(
                        "w-full rounded-full py-3 flex items-center justify-center gap-2",
                        isChatPage && isFresh ? "border-indigo-500 text-indigo-600" : ""
                      )}
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-base font-bold">New Conversation</span>
                    </HobbyButton>
                  </div>
                  <div className="mt-6 pt-6 border-t border-black/5" />
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pb-20 px-6">
                  {filteredHobbies.length > 0 ? (
                    filteredHobbies.map((h) => (
                      <div key={h.hobbyId} className="group relative">
                        <Link
                          to={`/explore?hobby=${h.hobbyId}`}
                          onClick={() => setMobileChatMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-1.5 px-4 py-3 rounded-xl transition-all",
                            searchParams.get('hobby') === h.hobbyId ? "bg-indigo-600/10 text-indigo-700" : "hover:bg-black/5 text-slate-600"
                          )}
                        >
                          <img src={chatPng} className="w-5 h-5 shrink-0 opacity-80" alt="" />
                          <span className="text-base font-bold truncate capitalize pr-6">{h.hobby}</span>
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteHobby(h.hobbyId);
                            if (location.pathname.includes(h.hobbyId)) {
                              navigate('/dashboard');
                            }
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 opacity-40">
                      <img src={chatPng} className="w-12 h-12 mx-auto mb-2 opacity-20" alt="" />
                      <p className="text-base font-bold">No chats yet</p>
                    </div>
                  )}

                  {collectionId !== 'general' && (
                    <div className="mt-4 pt-4 border-t border-black/5">
                      <button onClick={() => setShowPicker(!showPicker)} className="text-black/40 font-bold text-sm flex items-center gap-2 px-2 hover:opacity-70">
                        <Plus className="w-4 h-4" /> Add existing hobby
                      </button>
                      {showPicker && (
                        <div className="mt-2 space-y-1">
                          {availableHobbies.length === 0 && <p className="text-xs text-slate-400 px-2">No more hobbies.</p>}
                          {availableHobbies.map(h => (
                            <button
                              key={h.hobbyId}
                              onClick={() => addHobbyToCollection(collectionId, h.hobbyId)}
                              className="w-full text-left px-3 py-2 text-sm font-bold text-slate-600 hover:bg-black/5 rounded-lg flex items-center justify-between"
                            >
                              <span className="truncate">{h.hobby}</span>
                              <Plus className="w-3 h-3 opacity-50" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </>
        )}

        <div className="min-w-0 flex-1 flex flex-col h-[100dvh] lg:h-[100dvh]">
          {isExplorePage && hobbies.length > 0 && (
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center p-4 bg-[#fffbf4] border-b border-black/5 transition-all h-16">
              <button
                onClick={() => setMobileChatMenuOpen(true)}
                className="p-1 -ml-1 text-slate-800 transition-colors"
              >
                <Menu className="w-7 h-7 shrink-0" strokeWidth={2.5} />
              </button>
            </header>
          )}
          {isNewChatPage && (
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-[#fffbf4] border-b border-black/5 transition-all h-16">
              <img src={logoPng} alt="Hobbit" className="w-12 h-12 object-contain" />
              <HobbyButton
                onClick={() => window.dispatchEvent(new Event('clear-chat'))}
                variant="outline"
                className="rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                New Chat
              </HobbyButton>
            </header>
          )}
          <main className={cn(
            "flex-1 flex flex-col min-h-0 min-w-0 relative",
            isChatPage ? "overflow-hidden pt-16 lg:pt-0" : "overflow-y-auto",
            isChatPage ? "" : (isPlanPage ? "pb-28 lg:pb-12" : "px-0 pb-28 lg:px-8 lg:pb-12")
          )}>
            <Outlet />
          </main>
        </div>

        <aside className="hidden lg:block border-l border-black/5 bg-[#fff9ef] backdrop-blur-xl sticky top-0 h-[100dvh] w-[80px]">

          <div className="h-full flex flex-col items-center py-5">
            <nav className="flex flex-col gap-1">
              {rightNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex flex-col items-center gap-0.5 group transition-colors',
                      isActive ? 'text-slate-900 font-bold' : 'text-slate-600'
                    )}
                  >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center">
                      <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
                    </div>
                    <span className={cn("text-base leading-none", isActive ? "font-bold" : "font-medium")}>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-3 py-3 bg-[#fff9ef] border-t border-black/5">

          <div className="flex items-center justify-evenly">
            {leftNavItems.map((item) => {
              const Icon = item.icon;
              const currentPath = location.pathname + (location.search || '');
              const isActive = (currentPath === item.href) || (item.name === 'Explore' && isExplorePage) || (item.name === 'New' && isNewChatPage);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => {
                    if (item.name === 'Explore' && window.innerWidth < 1024) {
                      setMobileChatMenuOpen(true);
                    }
                  }}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors',
                    isActive ? 'text-slate-900 font-bold' : 'text-slate-600'
                  )}
                >
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
                  <span className={cn("text-sm leading-none", isActive ? "font-bold" : "font-medium")}>{item.name}</span>
                </Link>
              );
            })}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 text-slate-600 transition-colors"
            >
              <Menu className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-sm font-medium leading-none">Menu</span>
            </button>
          </div>
        </nav>



        <div
          className={cn(
            "fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm transition-opacity lg:hidden",
            mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setMobileMenuOpen(false)}
        />
        <aside
          className={cn(
            "fixed top-0 right-0 bottom-0 w-[240px] bg-[#fff9ef] z-[70] shadow-2xl transition-transform duration-300 ease-in-out lg:hidden flex flex-col py-6 px-4",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex justify-between items-center mb-6 pl-2">
            <span className="font-bold text-lg text-slate-900">Menu</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400"><X size={20} /></button>
          </div>
          <div className="h-px bg-black/5 mb-6" />
          <nav className="flex flex-col gap-2">
            {rightNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-4 px-4 py-3 rounded-2xl transition-colors',
                    isActive ? 'bg-indigo-600/10 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-black/5'
                  )}
                >
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
                  <span className="text-base">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
      </div>
    </div>
  );
}
