import React from "react";
import { Star, CheckCircle, Sparkles } from "lucide-react";
import SectionReveal from "@/components/ui/SectionReveal";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  quote: string;
  stayName: string;
  stayLocation: string;
  stayPhoto?: string;
}

const ROW_ONE: Testimonial[] = [
  {
    id: "t1",
    name: "Sophia & Alexandre Chen",
    location: "Geneva, Switzerland",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
    rating: 5,
    quote: "Haven curated an experience beyond any five-star resort we've visited. The private boat transfer in Palawan was seamless and discreet.",
    stayName: "Villa Calamian",
    stayLocation: "Coron, Palawan",
    stayPhoto: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=200&h=200&q=80"
  },
  {
    id: "t2",
    name: "Marcus Vance",
    location: "New York, USA",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
    rating: 5,
    quote: "The Machiya townhouse in Kyoto felt like entering a private sanctuary of calm. Every tactile detail—from cedar bath to tatami—was perfection.",
    stayName: "Kamo River Sanctuary",
    stayLocation: "Kyoto, Japan"
  },
  {
    id: "t3",
    name: "Clara Lindqvist",
    location: "Stockholm, Sweden",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80",
    rating: 5,
    quote: "Waking up to the Matterhorn with private fireside breakfast service is a memory our family will hold for decades.",
    stayName: "The Matterhorn Chalet",
    stayLocation: "Zermatt, Switzerland",
    stayPhoto: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=200&h=200&q=80"
  },
  {
    id: "t4",
    name: "Kenji Sato",
    location: "Tokyo, Japan",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
    rating: 5,
    quote: "Impeccably vetted properties. Haven is our first and only reference point when planning quiet international holidays.",
    stayName: "Cliffside Caldera Cave",
    stayLocation: "Oia, Santorini"
  },
  {
    id: "t5",
    name: "Beatrice & Liam Thorne",
    location: "London, UK",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80",
    rating: 5,
    quote: "The privacy was absolute. The concierge arranged our private chef and sunset yacht without us having to lift a finger.",
    stayName: "Cloud Nine Ocean Estate",
    stayLocation: "Siargao, Philippines",
    stayPhoto: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&h=200&q=80"
  },
  {
    id: "t6",
    name: "Elena Rossi",
    location: "Milan, Italy",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&h=200&q=80",
    rating: 5,
    quote: "Rarely does reality exceed photography, but Haven consistently surpasses every high expectation. Understated elegance.",
    stayName: "Uluwatu Ocean Pavilion",
    stayLocation: "Bali, Indonesia"
  }
];

const ROW_TWO: Testimonial[] = [
  {
    id: "t7",
    name: "Dr. Julian Alcantara",
    location: "Manila, Philippines",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&h=200&q=80",
    rating: 5,
    quote: "Finding authentic stillness in Cebu’s secluded coves was effortless with Haven. Truly world-class hospitality.",
    stayName: "Badian Sea Cove Villa",
    stayLocation: "Cebu, Philippines",
    stayPhoto: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=200&h=200&q=80"
  },
  {
    id: "t8",
    name: "Amara Okafor",
    location: "Lagos, Nigeria",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&h=200&q=80",
    rating: 5,
    quote: "Haven is the only place we look now. Every stay has felt considered, deeply restorative, and quietly extraordinary.",
    stayName: "Bamboo Serenity Estate",
    stayLocation: "Ubud, Bali"
  },
  {
    id: "t9",
    name: "François Dupont",
    location: "Paris, France",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&h=200&q=80",
    rating: 5,
    quote: "From the chilled vintage awaiting our arrival to the private lemon terrace, the entire week was unforgettable.",
    stayName: "Amalfi Cliffside Watchtower",
    stayLocation: "Amalfi, Italy",
    stayPhoto: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=200&h=200&q=80"
  },
  {
    id: "t10",
    name: "Olivia & Nathan Wright",
    location: "Sydney, Australia",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80",
    rating: 5,
    quote: "A breath of fresh air. Strict curation, zero generic villas, and extraordinary attention from the local hosts.",
    stayName: "Chocolate Hills Heritage Estate",
    stayLocation: "Bohol, Philippines"
  },
  {
    id: "t11",
    name: "Hansel Meyer",
    location: "Zurich, Switzerland",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80",
    rating: 5,
    quote: "Architecture that honours its natural surroundings. Haven has set a new benchmark for private luxury travel.",
    stayName: "Pine Hearth Retreat",
    stayLocation: "Baguio, Philippines",
    stayPhoto: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&h=200&q=80"
  },
  {
    id: "t12",
    name: "Vivienne Laurent",
    location: "Brussels, Belgium",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80",
    rating: 5,
    quote: "Every morning coffee over the turquoise bay of El Nido was pure tranquility. We are already booking our return.",
    stayName: "Pangulasian Overwater Pavilion",
    stayLocation: "El Nido, Palawan"
  }
];

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div className="flex h-full w-[340px] shrink-0 flex-col justify-between rounded-3xl border border-border/70 bg-card p-6 shadow-luxe transition-all duration-300 hover:shadow-luxe-lg sm:w-[400px] sm:p-7">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {Array.from({ length: item.rating }).map((_, i) => (
              <Star key={i} size={13} className="fill-accent text-accent" />
            ))}
          </div>
          <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <CheckCircle size={12} className="text-emerald-500" /> Verified Guest
          </span>
        </div>

        <blockquote className="mt-4 font-body text-sm leading-relaxed text-foreground/90 sm:text-base">
          "{item.quote}"
        </blockquote>
      </div>

      <div className="mt-6 border-t border-border/60 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={item.avatar}
              alt={item.name}
              className="h-10 w-10 rounded-full object-cover ring-1 ring-border"
              loading="lazy"
            />
            <div>
              <p className="text-sm font-semibold text-foreground leading-tight">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.location}</p>
            </div>
          </div>

          {item.stayPhoto && (
            <img
              src={item.stayPhoto}
              alt={item.stayName}
              className="h-9 w-9 rounded-xl object-cover ring-1 ring-border/60"
              title={`Booked: ${item.stayName}`}
              loading="lazy"
            />
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Booked: <strong className="font-medium text-foreground">{item.stayName}</strong></span>
          <span>{item.stayLocation}</span>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsMarquee() {
  // Seamless loop by duplicating rows
  const rowOneItems = [...ROW_ONE, ...ROW_ONE];
  const rowTwoItems = [...ROW_TWO, ...ROW_TWO];

  return (
    <section className="relative overflow-hidden border-t border-border/70 bg-secondary/30 py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 text-center sm:px-8">
        <SectionReveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-champagne/10 px-3.5 py-1 text-xs font-medium tracking-wide text-champagne-dark dark:text-champagne-light">
            <Sparkles size={12} /> Revered Experiences
          </span>
          <h2 className="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Loved by Discerning Travelers
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
            Unfiltered reflections from guests who discovered their personal sanctuary with Haven.
          </p>
        </SectionReveal>
      </div>

      {/* MARQUEE CONTAINER WITH EDGE FADE MASKS */}
      <div className="relative mt-14 sm:mt-18">
        {/* Soft edge gradient scrims */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 sm:w-44 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 sm:w-44 bg-gradient-to-l from-background via-background/80 to-transparent" />

        {/* ROW 1: Scrolls Left to Right */}
        <div className="group flex overflow-hidden py-3">
          <div className="marquee-inner flex shrink-0 items-center gap-6 animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:overflow-x-auto">
            {rowOneItems.map((item, index) => (
              <TestimonialCard key={`row1-${item.id}-${index}`} item={item} />
            ))}
          </div>
        </div>

        {/* ROW 2: Scrolls Right to Left */}
        <div className="group mt-4 flex overflow-hidden py-3">
          <div className="marquee-inner flex shrink-0 items-center gap-6 animate-marquee-reverse group-hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:overflow-x-auto">
            {rowTwoItems.map((item, index) => (
              <TestimonialCard key={`row2-${item.id}-${index}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

