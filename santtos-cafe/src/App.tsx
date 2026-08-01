import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Hero from "./Hero";
import { Navbar, About, MenuSection, Reviews, Atmosphere, Contact } from "./components";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
          <Navbar />
          <Hero />
          <About />
          <MenuSection />
          <Reviews />
          <Atmosphere />
          <Contact />
          <footer className="py-8 bg-black border-t border-border text-center">
            <p className="text-muted-foreground text-sm font-medium">
              <span className="text-gradient-gold">© 2025 Santtos Caffee & Bar</span> · Zvolen, Slovakia
            </p>
          </footer>
        </main>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
