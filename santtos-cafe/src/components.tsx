import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X, Coffee, Users, Star, CupSoda, GlassWater, Flame, Music, Volume2, VolumeX, MapPin, Phone, Clock, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Navbar ────────────────────────────────────────────────────────────────────

const links = [
  { name: 'O nás', href: '#about' },
  { name: 'Menu', href: '#menu' },
  { name: 'Recenzie', href: '#reviews' },
  { name: 'Atmosféra', href: '#atmosphere' },
  { name: 'Kontakt', href: '#contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-background/80 backdrop-blur-md border-b border-white/5 py-4 shadow-lg' : 'bg-transparent py-6'
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <a href="#hero" className="flex flex-col">
            <span className="font-display text-2xl font-bold text-gradient-gold leading-none">Santtos</span>
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Caffee & Bar</span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <a key={l.name} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{l.name}</a>
            ))}
            <a href="tel:+421907855177" className="px-5 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all text-sm font-medium">
              Zavolať
            </a>
          </div>
          <button className="md:hidden text-foreground p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <div className={cn(
        'md:hidden absolute top-full left-0 w-full bg-card border-b border-border transition-all duration-300 origin-top overflow-hidden',
        mobileOpen ? 'max-h-96 py-4 shadow-xl' : 'max-h-0 py-0 border-transparent'
      )}>
        <div className="flex flex-col px-4 space-y-4">
          {links.map(l => (
            <a key={l.name} href={l.href} onClick={() => setMobileOpen(false)} className="text-base font-medium text-muted-foreground hover:text-primary">{l.name}</a>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────

const stats = [
  { icon: Coffee, value: '3+ roky', label: 'Tradície' },
  { icon: Users, value: '500+', label: 'Spokojných zákazníkov' },
  { icon: Star, value: '4.5⭐', label: 'Hodnotenie' },
];

export function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8 }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">O nás</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-8 rounded-full" />
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-16 font-light">
              Miesto pre relax, stretnutia s priateľmi alebo pracovnú pauzu.{' '}
              <span className="text-foreground font-medium">Kvalitná káva, príjemná atmosféra a milá obsluha.</span>
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={i} className="glass-card p-8 rounded-2xl flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-2">{s.value}</h3>
                  <p className="text-muted-foreground">{s.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Menu ──────────────────────────────────────────────────────────────────────

type Category = 'Káva' | 'Čaj' | 'Nápoje';

const menuItems: Record<Category, { name: string; desc: string; price: string; icon: typeof Coffee }[]> = {
  'Káva': [
    { name: 'Espresso', desc: 'Silné a intenzívne', price: '€2.00', icon: Coffee },
    { name: 'Americano', desc: 'Espresso s horúcou vodou', price: '€2.50', icon: Coffee },
    { name: 'Latte', desc: 'Jemné espresso s mliečnou penou', price: '€3.00', icon: Coffee },
    { name: 'Cappuccino', desc: 'Klasika s bohatou penou', price: '€2.80', icon: Coffee },
    { name: 'Iced Coffee', desc: 'Osviežujúca ľadová káva', price: '€3.50', icon: Coffee },
  ],
  'Čaj': [
    { name: 'Zelený čaj', desc: 'Sypaný zelený čaj', price: '€2.00', icon: CupSoda },
    { name: 'Bylinný čaj', desc: 'Upokojujúca zmes byliniek', price: '€2.00', icon: CupSoda },
    { name: 'Čierny čaj', desc: 'Tradičný ranný čaj', price: '€1.80', icon: CupSoda },
  ],
  'Nápoje': [
    { name: 'Fresh džús', desc: 'Čerstvo odšťavené ovocie', price: '€3.00', icon: GlassWater },
    { name: 'Limonáda', desc: 'Domáca s čerstvým ovocím', price: '€2.50', icon: GlassWater },
    { name: 'Minerálka', desc: 'Sýtená / Nesýtená', price: '€1.50', icon: GlassWater },
  ],
};

function TiltCard({ item }: { item: { name: string; desc: string; price: string; icon: typeof Coffee } }) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const Icon = item.icon;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -20;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 20;
    setTransform(`perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`);
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={() => setTransform('')}
      className="glass-card rounded-2xl p-6 transition-all duration-200 ease-out cursor-pointer group"
      style={{ transform, transformStyle: 'preserve-3d' }}>
      <div className="flex items-center justify-between mb-4" style={{ transform: 'translateZ(30px)' }}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Icon size={24} />
          </div>
          <h3 className="text-xl font-bold text-foreground">{item.name}</h3>
        </div>
        <span className="text-xl font-bold text-gradient-gold">{item.price}</span>
      </div>
      <p className="text-muted-foreground" style={{ transform: 'translateZ(20px)' }}>{item.desc}</p>
    </div>
  );
}

export function MenuSection() {
  const [active, setActive] = useState<Category>('Káva');
  const categories: Category[] = ['Káva', 'Čaj', 'Nápoje'];

  return (
    <section id="menu" className="py-24 bg-secondary/30 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Naše Menu
          </motion.h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-10 rounded-full" />
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActive(cat)}
                className={cn(
                  'px-8 py-3 rounded-full text-lg font-medium transition-all duration-300',
                  active === cat
                    ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(201,146,58,0.4)]'
                    : 'bg-background/50 text-muted-foreground hover:text-foreground hover:bg-background border border-border'
                )}>
                {cat}
              </button>
            ))}
          </div>
        </div>
        <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems[active].map((item, i) => <TiltCard key={i} item={item} />)}
        </motion.div>
      </div>
    </section>
  );
}

// ── Reviews ───────────────────────────────────────────────────────────────────

const reviews = [
  { name: 'Marek K.', rating: 5, text: 'Najlepšia káva v celom Zvolene!' },
  { name: 'Jana M.', rating: 5, text: 'Príjemná atmosféra a skvelá obsluha. Určite sa vrátim!' },
  { name: 'Peter S.', rating: 4, text: 'Obľúbené miesto pre ranné stretnutia. Výborný latte!' },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={18} className={i < rating ? 'fill-primary text-primary' : 'fill-muted text-muted'} />
      ))}
    </div>
  );
}

export function Reviews() {
  return (
    <section id="reviews" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Čo hovoria naši hostia
          </motion.h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8 rounded-full" />
          <motion.div className="flex items-center justify-center gap-4"
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <span className="text-5xl font-bold text-foreground">4.5</span>
            <div className="flex flex-col items-start">
              <Stars rating={5} />
              <span className="text-muted-foreground text-sm mt-1">Celkové hodnotenie</span>
            </div>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <motion.div key={i} className="glass-card p-8 rounded-2xl relative"
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.2 }}>
              <Quote className="absolute top-6 right-6 text-primary/20" size={48} />
              <Stars rating={r.rating} />
              <p className="mt-6 mb-8 text-lg text-foreground italic">"{r.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  {r.name.charAt(0)}
                </div>
                <span className="font-medium text-foreground">{r.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Atmosphere ────────────────────────────────────────────────────────────────

const features = [
  { icon: Flame, text: 'Útulná atmosféra' },
  { icon: Coffee, text: 'Prémiová káva' },
  { icon: Music, text: 'Relaxačná hudba' },
];

export function Atmosphere() {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yBg = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  return (
    <section id="atmosphere" ref={ref} className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0 z-0" style={{ y: yBg }}>
        <div className="absolute inset-0 bg-background/80 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-amber-900/20 to-background z-10" />
        <img src={`${import.meta.env.BASE_URL}images/cafe-bg.png`} alt="Cafe" className="w-full h-[140%] object-cover object-center" />
      </motion.div>
      <div className="container mx-auto px-4 relative z-20">
        <motion.div className="max-w-4xl mx-auto text-center glass-card p-10 md:p-16 rounded-3xl" style={{ opacity }}>
          <h2 className="text-4xl md:text-6xl font-bold mb-10 text-foreground">Pocíťte atmosféru</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-background/50 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(201,146,58,0.2)]">
                    <Icon size={32} />
                  </div>
                  <span className="text-lg font-medium text-foreground">{f.text}</span>
                </div>
              );
            })}
          </div>
          <button onClick={() => setPlaying(!playing)}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-background/80 border border-primary/50 text-primary hover:bg-primary/20 transition-all">
            {playing ? <Volume2 size={20} className="animate-pulse" /> : <VolumeX size={20} />}
            <span className="font-medium">{playing ? 'Vypnúť hudbu' : 'Prehrať ambientný zvuk'}</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────

export function Contact() {
  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Nájdite nás</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            {[
              { icon: MapPin, title: 'Adresa', content: <>29. augusta 889<br />Zvolen, Slovakia</> },
              {
                icon: Phone, title: 'Telefón', content: (
                  <>
                    <p className="text-lg text-muted-foreground mb-4">+421 907 855 177</p>
                    <a href="tel:+421907855177" className="inline-block px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                      Zavolať
                    </a>
                  </>
                )
              },
              { icon: Clock, title: 'Otváracie hodiny', content: <>Otvorené denne<br />Do 22:00</> },
            ].map(({ icon: Icon, title, content }, i) => (
              <div key={i} className="glass-card p-8 rounded-2xl flex items-start gap-6">
                <div className="p-4 rounded-full bg-primary/10 text-primary shrink-0"><Icon size={28} /></div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
                  <div className="text-lg text-muted-foreground">{content}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-full min-h-[400px] w-full rounded-2xl overflow-hidden glass-card p-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d42180.98!2d19.1289!3d48.5726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4714d0bfc4d16b1f%3A0x400f7d1c69172c0!2sZvolen!5e0!3m2!1sen!2ssk!4v1"
              width="100%" height="100%" style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              title="Santtos Cafe Map"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
