import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Users,
  Globe,
  Activity as ActivityIcon,
  UserCheck,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Check,
  Copy,
  ShieldCheck,
  Sparkles,
  Camera,
  MessageSquare,
  Briefcase,
} from "lucide-react";
import { getExperienceById, createProductBooking } from "@/services";
import { EXPERIENCES_DATA, getMockExperience } from "@/lib/mockProductData";
import { getPhotos, imageUrl } from "@/lib/photos";
import VerifiedBadge from "@/components/listings/VerifiedBadge";
import ShareButton from "@/components/listings/ShareButton";
import SaveButton from "@/components/listings/SaveButton";
import GalleryLightbox from "@/components/listings/GalleryLightbox";
import GoogleMap from "@/components/maps/GoogleMap";
import PhotoCredit from "@/components/ui/PhotoCredit";
import SectionReveal from "@/components/ui/SectionReveal";
import ExperienceCard from "@/components/experiences/ExperienceCard";
import { formatCurrency } from "@/lib/format";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useSeo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { Experience, ProductBooking } from "@/types/products";

export default function ExperienceDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Booking Form State
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [guestCount, setGuestCount] = useState(2);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<ProductBooking | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // SEO metadata
  useSeo(
    experience ? `${experience.title} — ${experience.city}` : "Bespoke Experience Details",
    experience?.tagline || experience?.description || "Curated bespoke journeys and expeditions.",
    experience?.image
  );

  // Load experience data
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setConfirmedBooking(null);

    // Look up via service with mock fallback
    getExperienceById(id)
      .then((data) => {
        if (data) {
          setExperience(data);
          if (data.availableSlots && data.availableSlots.length > 0) {
            setSelectedSlot(data.availableSlots[0]);
          }
        } else {
          const fallback = getMockExperience(id);
          if (fallback) {
            setExperience(fallback);
            if (fallback.availableSlots && fallback.availableSlots.length > 0) {
              setSelectedSlot(fallback.availableSlots[0]);
            }
          } else {
            setExperience(null);
          }
        }
      })
      .catch(() => {
        const fallback = getMockExperience(id);
        setExperience(fallback || null);
        if (fallback?.availableSlots?.length) {
          setSelectedSlot(fallback.availableSlots[0]);
        }
      })
      .finally(() => {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
  }, [id]);

  // Gallery Photos (5+ high-res photos for bento gallery)
  const { galleryPhotos, galleryUrls } = useMemo(() => {
    if (!experience) return { galleryPhotos: [], galleryUrls: [] };
    const topic = experience.topic || "sunset cruise";
    const unsplashList = getPhotos(topic, 8);
    const existingImages = experience.images || (experience.image ? [experience.image] : []);
    const unsplashUrls = unsplashList.map((p) => imageUrl(p, 1600, 85));
    const merged = Array.from(new Set([...existingImages, ...unsplashUrls]));
    return {
      galleryPhotos: unsplashList,
      galleryUrls: merged.slice(0, 8),
    };
  }, [experience]);

  // Similar experiences for "You might also like"
  const similarExperiences = useMemo(() => {
    if (!experience) return [];
    return EXPERIENCES_DATA.filter((e) => e.id !== experience.id).slice(0, 3);
  }, [experience]);

  // Price calculations
  const pricePerGuest = experience?.pricePerPerson || experience?.price || 180;
  const basePrice = pricePerGuest * guestCount;
  const conciergeFee = Math.round(basePrice * 0.08);
  const sanctuaryFee = Math.round(basePrice * 0.06);
  const totalPrice = basePrice + conciergeFee + sanctuaryFee;

  const handleBookingSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!experience) return;

    setSubmittingBooking(true);
    try {
      const res = await createProductBooking({
        userId: user?.id || "guest",
        productType: "activities",
        itemId: experience.id,
        itemTitle: experience.title,
        itemSubtitle: `${experience.city}, ${experience.country} · ${selectedSlot}`,
        itemImage: galleryUrls[0] || experience.image,
        dateOrTime: selectedDate,
        timeSlot: selectedSlot,
        passengersOrGuests: guestCount,
        totalPrice,
        details: {
          category: experience.category,
          duration: experience.duration,
          meetingPoint: experience.meetingPoint,
          hostName: experience.hostName,
        },
      });

      setConfirmedBooking(res);
      setMobileDrawerOpen(false);
      toast({
        title: "Reservation Confirmed",
        description: `Reference code: ${res.referenceCode}`,
      });
    } catch {
      toast({
        title: "Booking error",
        description: "Please check your network and try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingBooking(false);
    }
  };

  const copyBookingRef = () => {
    if (confirmedBooking?.referenceCode) {
      navigator.clipboard.writeText(confirmedBooking.referenceCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // 1. LOADING SKELETON
  if (loading) {
    return (
      <div className="pt-24 pb-20 container-haven">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-48 rounded bg-muted animate-pulse" />

        {/* Title Skeleton */}
        <div className="mt-4 flex flex-col gap-2">
          <div className="h-8 w-3/4 max-w-xl rounded-lg bg-muted animate-pulse" />
          <div className="h-4 w-40 rounded bg-muted animate-pulse" />
        </div>

        {/* Bento Grid Skeleton */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3 h-[420px] sm:h-[480px]">
          <div className="md:col-span-2 h-full rounded-3xl bg-muted animate-pulse" />
          <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-3 h-full">
            <div className="rounded-2xl bg-muted animate-pulse" />
            <div className="rounded-2xl bg-muted animate-pulse" />
            <div className="rounded-2xl bg-muted animate-pulse" />
            <div className="rounded-2xl bg-muted animate-pulse" />
          </div>
        </div>

        {/* Content & Sidebar Skeleton */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-20 rounded-2xl bg-muted animate-pulse" />
            <div className="h-40 rounded-2xl bg-muted animate-pulse" />
            <div className="h-60 rounded-2xl bg-muted animate-pulse" />
          </div>
          <div className="lg:col-span-4">
            <div className="h-96 rounded-3xl bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // 2. POLISHED 404 NOT FOUND STATE
  if (!experience) {
    return (
      <div className="pt-32 pb-24 container-haven text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary text-champagne-dark dark:text-champagne-light mb-6">
            <Briefcase size={28} strokeWidth={1.5} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Experience Unavailable
          </span>
          <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Sanctuary Journey Not Found
          </h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The curated expedition you requested may have concluded its seasonal run, been renamed, or is currently reserved.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/experiences"
              className="rounded-full bg-foreground px-6 py-2.5 text-xs font-semibold text-background transition-transform hover:scale-102"
            >
              Browse All Experiences
            </Link>
            <Link
              to="/"
              className="rounded-full border border-border px-6 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const ratingScore = experience.rating ? experience.rating.toFixed(2) : "4.98";
  const reviewsCount = experience.reviewCount || experience.reviewsCount || 48;

  return (
    <div className="pt-20 pb-24">
      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <GalleryLightbox
          images={galleryUrls}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndex={(newIdx) => setLightboxIndex(newIdx)}
          photos={galleryPhotos}
        />
      )}

      {/* 1. BREADCRUMBS & TOP BAR */}
      <div className="container-haven pt-4 sm:pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Link
              to="/experiences"
              className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-champagne-dark dark:hover:text-champagne-light transition-colors"
            >
              <ArrowLeft size={14} /> Back to all experiences
            </Link>
            <span className="text-border">/</span>
            <span className="truncate max-w-[200px] sm:max-w-xs">{experience.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <ShareButton title={experience.title} />
            <SaveButton listingId={experience.id} />
          </div>
        </div>
      </div>

      {/* 2. HERO TITLE & BADGES */}
      <div className="container-haven pt-4 sm:pt-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
              {experience.category}
            </span>
            <VerifiedBadge size="md" />
            {experience.badge && (
              <span className="rounded-full bg-foreground/85 px-3 py-1 text-xs font-semibold text-background">
                {experience.badge}
              </span>
            )}
          </div>

          <h1 className="mt-1 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {experience.title}
          </h1>

          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center gap-1 font-semibold text-foreground">
              <Star size={14} className="fill-accent text-accent" /> {ratingScore} ({reviewsCount} reviews)
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <MapPin size={14} className="text-muted-foreground" /> {experience.location}, {experience.country}
            </span>
          </div>
        </div>
      </div>

      {/* 3. BENTO PHOTO GALLERY (5+ PHOTOS WITH LIGHTBOX) */}
      <div className="container-haven pt-6">
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-3 h-[380px] sm:h-[480px] lg:h-[540px] overflow-hidden rounded-3xl">
          {/* Main Hero Photo (Spans 2 columns, full height) */}
          <div
            onClick={() => setLightboxIndex(0)}
            className="group relative md:col-span-2 h-full overflow-hidden bg-muted cursor-pointer"
          >
            <motion.img
              layoutId={`exp-hero-img-${experience.id}`}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              src={galleryUrls[0] || experience.image}
              alt={experience.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            {galleryPhotos[0] && (
              <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <PhotoCredit photo={galleryPhotos[0]} variant="badge" />
              </div>
            )}
          </div>

          {/* Right 4-Grid Bento Tiles */}
          <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-3 h-full">
            {galleryUrls.slice(1, 5).map((url, idx) => {
              const photoObj = galleryPhotos[idx + 1];
              return (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx + 1)}
                  className="group relative h-full overflow-hidden bg-muted cursor-pointer"
                >
                  <img
                    src={url}
                    alt={`${experience.title} view ${idx + 2}`}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {photoObj && (
                    <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <PhotoCredit photo={photoObj} variant="badge" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* View All Photos Button */}
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            className="absolute bottom-4 right-4 z-20 flex items-center gap-2 rounded-full bg-background/90 px-4 py-2 text-xs font-semibold text-foreground backdrop-blur-md shadow-luxe transition-transform hover:scale-105 active:scale-95"
          >
            <Camera size={14} />
            <span>Show all {galleryUrls.length} photos</span>
          </button>
        </div>
      </div>

      {/* 4. MAIN CONTENT CONTAINER (2 COLUMNS: CONTENT + STICKY BOOKING CARD) */}
      <div className="container-haven pt-10 sm:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
          {/* LEFT COLUMN: SECTIONS */}
          <div className="lg:col-span-8 space-y-12 sm:space-y-16">
            {/* QUICK FACTS ROW */}
            <SectionReveal>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary text-champagne-dark dark:text-champagne-light">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Duration</span>
                    <p className="text-sm font-semibold text-foreground">{experience.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary text-champagne-dark dark:text-champagne-light">
                    <Users size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Group Size</span>
                    <p className="text-sm font-semibold text-foreground">{experience.groupSize}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary text-champagne-dark dark:text-champagne-light">
                    <Globe size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Languages</span>
                    <p className="text-sm font-semibold text-foreground truncate max-w-[140px]">
                      {experience.languages?.join(", ") || "English"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary text-champagne-dark dark:text-champagne-light">
                    <ActivityIcon size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Intensity</span>
                    <p className="text-sm font-semibold text-foreground">{experience.difficulty || "Moderate"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary text-champagne-dark dark:text-champagne-light">
                    <UserCheck size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Minimum Age</span>
                    <p className="text-sm font-semibold text-foreground">{experience.minAge}+ years</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Confirmation</span>
                    <p className="text-sm font-semibold text-foreground">Instant Booking</p>
                  </div>
                </div>
              </div>
            </SectionReveal>

            {/* SECTION 1: OVERVIEW */}
            <SectionReveal>
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Overview</span>
                <h2 className="font-heading text-2xl sm:text-3xl font-medium text-foreground">
                  About this sanctuary expedition
                </h2>
                <p className="text-base sm:text-lg leading-relaxed text-muted-foreground font-serif italic">
                  "{experience.tagline || experience.description}"
                </p>
                <p className="text-base leading-relaxed text-foreground/90">
                  {experience.description}
                </p>
              </div>
            </SectionReveal>

            {/* SECTION 2: HIGHLIGHTS */}
            {experience.highlights && experience.highlights.length > 0 && (
              <SectionReveal>
                <div className="space-y-4 border-t border-border/70 pt-8 sm:pt-10">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">What makes it rare</span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-medium text-foreground">
                    Experience Highlights
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {experience.highlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:border-champagne/40"
                      >
                        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-champagne/15 text-champagne-dark dark:text-champagne-light">
                          <Sparkles size={14} />
                        </div>
                        <p className="text-sm font-medium text-foreground leading-snug">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionReveal>
            )}

            {/* SECTION 3: WHAT'S INCLUDED / NOT INCLUDED */}
            <SectionReveal>
              <div className="space-y-4 border-t border-border/70 pt-8 sm:pt-10">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Transparency</span>
                <h2 className="font-heading text-2xl sm:text-3xl font-medium text-foreground">
                  What's Included
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                  {/* Included Column */}
                  <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-3">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      <CheckCircle2 size={16} /> Included with reservation
                    </h3>
                    <ul className="space-y-2.5 text-sm text-foreground/85">
                      {experience.included.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Not Included Column */}
                  <div className="rounded-3xl border border-border/70 bg-secondary/30 p-6 space-y-3">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      <XCircle size={16} /> Not included
                    </h3>
                    <ul className="space-y-2.5 text-sm text-muted-foreground">
                      {experience.notIncluded && experience.notIncluded.length > 0 ? (
                        experience.notIncluded.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="text-muted-foreground shrink-0 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-xs">Personal gear and voluntary tips not specified.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </SectionReveal>

            {/* SECTION 4: ITINERARY TIMELINE */}
            {experience.itinerary && experience.itinerary.length > 0 && (
              <SectionReveal>
                <div className="space-y-4 border-t border-border/70 pt-8 sm:pt-10">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Flow of the day</span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-medium text-foreground">
                    Itinerary Timeline
                  </h2>

                  <div className="relative mt-6 pl-6 sm:pl-8 space-y-8 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/80">
                    {experience.itinerary.map((step, idx) => (
                      <div key={idx} className="relative group">
                        {/* Timeline Node Dot */}
                        <div className="absolute -left-6 sm:-left-8 top-1 grid h-5 w-5 place-items-center rounded-full border-2 border-background bg-foreground shadow-sm group-hover:scale-125 transition-transform">
                          <div className="h-1.5 w-1.5 rounded-full bg-background" />
                        </div>

                        <div className="space-y-1">
                          <span className="inline-block rounded-full bg-secondary px-3 py-0.5 text-xs font-mono font-semibold text-foreground">
                            {step.time}
                          </span>
                          <h3 className="font-heading text-lg font-medium text-foreground">
                            {step.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionReveal>
            )}

            {/* SECTION 5: MEETING POINT & MAP */}
            <SectionReveal>
              <div className="space-y-4 border-t border-border/70 pt-8 sm:pt-10">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Arrival</span>
                <h2 className="font-heading text-2xl sm:text-3xl font-medium text-foreground">
                  Meeting Point & Departure
                </h2>

                <div className="rounded-2xl border border-border/70 bg-card p-4 space-y-2">
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-champagne-dark dark:text-champagne-light shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{experience.meetingPoint}</p>
                      {experience.meetingPointInstructions && (
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          {experience.meetingPointInstructions}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-3xl border border-border shadow-luxe">
                  <GoogleMap
                    location={experience.meetingPoint}
                    city={experience.city}
                    country={experience.country}
                    title={experience.title}
                    initialZoom={14}
                    heightClassName="h-72 sm:h-80"
                    showControls={true}
                    showHighlights={false}
                  />
                </div>
              </div>
            </SectionReveal>

            {/* SECTION 6: WHAT TO BRING */}
            {experience.whatToBring && experience.whatToBring.length > 0 && (
              <SectionReveal>
                <div className="space-y-4 border-t border-border/70 pt-8 sm:pt-10">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preparation</span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-medium text-foreground">
                    What to Bring
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {experience.whatToBring.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 rounded-2xl bg-secondary/40 px-4 py-3 text-sm text-foreground">
                        <Check size={16} className="text-champagne-dark dark:text-champagne-light shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionReveal>
            )}

            {/* SECTION 7: MEET YOUR HOST */}
            <SectionReveal>
              <div className="space-y-4 border-t border-border/70 pt-8 sm:pt-10">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Leadership</span>
                <h2 className="font-heading text-2xl sm:text-3xl font-medium text-foreground">
                  Meet Your Host & Guide
                </h2>

                <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm">
                  <div className="flex flex-col sm:flex-row gap-5 items-start">
                    <img
                      src={experience.hostAvatar}
                      alt={experience.hostName}
                      className="h-20 w-20 rounded-2xl object-cover shrink-0 border border-border shadow-md"
                    />
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading text-xl font-medium text-foreground">
                          {experience.hostName}
                        </h3>
                        <span className="rounded-full bg-champagne/15 px-2.5 py-0.5 text-xs font-semibold text-champagne-dark dark:text-champagne-light">
                          Verified Specialist
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {experience.hostBio}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/60">
                        <span className="flex items-center gap-1 font-medium">
                          <MessageSquare size={13} /> Responds {experience.hostResponseTime || "within 1 hour"}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 font-medium">
                          <ShieldCheck size={13} className="text-emerald-500" /> Identity Vetted
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SectionReveal>

            {/* SECTION 8: CANCELLATION POLICY */}
            <SectionReveal>
              <div className="space-y-3 border-t border-border/70 pt-8 sm:pt-10">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Flexibility</span>
                <h2 className="font-heading text-2xl sm:text-3xl font-medium text-foreground">
                  Cancellation Policy
                </h2>
                <div className="rounded-2xl border border-border/80 bg-secondary/30 p-5 space-y-2">
                  <p className="text-sm leading-relaxed text-foreground">
                    {experience.cancellationPolicy}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Need to modify your plans? Read our complete{" "}
                    <Link to="/cancellation" className="underline font-medium text-foreground hover:text-champagne-dark">
                      Haven Cancellation & Rebooking Terms
                    </Link>.
                  </p>
                </div>
              </div>
            </SectionReveal>

            {/* SECTION 9: GUEST REVIEWS */}
            <SectionReveal>
              <div className="space-y-6 border-t border-border/70 pt-8 sm:pt-10">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Testimonials</span>
                    <h2 className="font-heading text-2xl sm:text-3xl font-medium text-foreground">
                      Guest Reviews
                    </h2>
                  </div>
                  <div className="flex items-center gap-1.5 text-lg font-semibold text-foreground">
                    <Star size={18} className="fill-accent text-accent" /> {ratingScore} ({reviewsCount})
                  </div>
                </div>

                <div className="space-y-4">
                  {experience.reviews && experience.reviews.length > 0 ? (
                    experience.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="rounded-3xl border border-border/75 bg-card p-6 shadow-sm space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {rev.avatar && (
                              <img
                                src={rev.avatar}
                                alt={rev.author}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <p className="text-sm font-semibold text-foreground leading-tight">{rev.author}</p>
                              <p className="text-xs text-muted-foreground">{rev.country} · {rev.date}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} size={13} className="fill-accent text-accent" />
                            ))}
                          </div>
                        </div>

                        <p className="text-sm leading-relaxed text-muted-foreground">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No written reviews yet for this season.</p>
                  )}
                </div>
              </div>
            </SectionReveal>

            {/* SECTION 10: FAQ ACCORDION */}
            {experience.faqs && experience.faqs.length > 0 && (
              <SectionReveal>
                <div className="space-y-4 border-t border-border/70 pt-8 sm:pt-10">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Clarifications</span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-medium text-foreground">
                    Frequently Asked Questions
                  </h2>

                  <div className="divide-y divide-border/60 rounded-3xl border border-border/80 bg-card overflow-hidden">
                    {experience.faqs.map((faq, idx) => {
                      const isOpen = openFaqIndex === idx;
                      return (
                        <div key={idx} className="transition-colors">
                          <button
                            type="button"
                            onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                            className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-foreground hover:bg-secondary/40"
                          >
                            <span>{faq.question}</span>
                            <ChevronDown
                              size={16}
                              className={cn("text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")}
                            />
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground"
                              >
                                {faq.answer}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </SectionReveal>
            )}
          </div>

          {/* RIGHT COLUMN: STICKY BOOKING CARD (DESKTOP) */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-28 space-y-4">
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xl">
                {confirmedBooking ? (
                  /* CONFIRMATION SCREEN */
                  <div className="text-center py-4 space-y-4">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <Check size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-medium text-foreground">
                        Reservation Confirmed
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Registered in Haven sanctuary registry.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-secondary/30 p-3.5 text-left space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Date & Slot</span>
                        <span className="font-semibold text-foreground">{selectedDate} ({selectedSlot})</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Guests</span>
                        <span className="font-semibold text-foreground">{guestCount} Guests</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Total Paid</span>
                        <span className="font-semibold text-foreground">{formatCurrency(totalPrice)}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-border/60 pt-2 text-xs">
                        <span className="text-muted-foreground">Ref Code</span>
                        <button
                          type="button"
                          onClick={copyBookingRef}
                          className="flex items-center gap-1 font-mono font-semibold text-foreground hover:text-champagne-dark"
                        >
                          <span>{confirmedBooking.referenceCode}</span>
                          <Copy size={12} />
                          {copiedCode && <span className="text-[10px] text-emerald-500">Copied</span>}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <Link
                        to="/dashboard"
                        className="block w-full rounded-full bg-foreground py-2.5 text-xs font-semibold text-background hover:opacity-90"
                      >
                        View in My Trips
                      </Link>
                      <button
                        type="button"
                        onClick={() => setConfirmedBooking(null)}
                        className="block w-full rounded-full border border-border py-2.5 text-xs font-medium text-foreground hover:bg-secondary"
                      >
                        Book another slot
                      </button>
                    </div>
                  </div>
                ) : (
                  /* BOOKING FORM */
                  <form onSubmit={handleBookingSubmit} className="space-y-5">
                    {/* Header: Price & Rating */}
                    <div className="flex items-baseline justify-between border-b border-border/60 pb-4">
                      <div>
                        <span className="font-heading text-2xl font-medium text-foreground">
                          {formatCurrency(pricePerGuest)}
                        </span>
                        <span className="text-xs text-muted-foreground"> / guest</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
                        <Star size={13} className="fill-accent text-accent" /> {ratingScore} ({reviewsCount})
                      </div>
                    </div>

                    {/* Date Picker */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Select Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={selectedDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 text-sm font-medium text-foreground outline-none focus:border-foreground"
                          required
                        />
                      </div>
                    </div>

                    {/* Time Slot Picker */}
                    {experience.availableSlots && experience.availableSlots.length > 0 && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Available Time Slot
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {experience.availableSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedSlot(slot)}
                              className={cn(
                                "rounded-xl border py-2 text-xs font-semibold transition-all",
                                selectedSlot === slot
                                  ? "border-foreground bg-foreground text-background shadow-sm"
                                  : "border-border bg-background text-foreground hover:bg-secondary"
                              )}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Guest Counter */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Number of Guests
                        </label>
                        <span className="text-xs text-muted-foreground">{experience.groupSize}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-2">
                        <button
                          type="button"
                          onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                          disabled={guestCount <= 1}
                          className="grid h-8 w-8 place-items-center rounded-xl bg-secondary text-foreground hover:bg-secondary/80 disabled:opacity-40"
                        >
                          -
                        </button>
                        <span className="text-sm font-semibold text-foreground">
                          {guestCount} {guestCount === 1 ? "Guest" : "Guests"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setGuestCount((g) => Math.min(8, g + 1))}
                          disabled={guestCount >= 8}
                          className="grid h-8 w-8 place-items-center rounded-xl bg-secondary text-foreground hover:bg-secondary/80 disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-2 border-t border-border/60 pt-4 text-xs">
                      <div className="flex justify-between text-muted-foreground">
                        <span>{formatCurrency(pricePerGuest)} × {guestCount} guests</span>
                        <span className="text-foreground">{formatCurrency(basePrice)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Haven Curation & Concierge (8%)</span>
                        <span className="text-foreground">{formatCurrency(conciergeFee)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Sanctuary & Marine Protection (6%)</span>
                        <span className="text-foreground">{formatCurrency(sanctuaryFee)}</span>
                      </div>
                      <div className="flex justify-between border-t border-border/60 pt-2 text-sm font-semibold text-foreground">
                        <span>Total</span>
                        <span>{formatCurrency(totalPrice)}</span>
                      </div>
                    </div>

                    {/* Reserve Button */}
                    <button
                      type="submit"
                      disabled={submittingBooking}
                      className="w-full rounded-full bg-foreground py-3 text-sm font-semibold text-background shadow-md transition-all hover:scale-101 active:scale-98 disabled:opacity-50"
                    >
                      {submittingBooking ? "Confirming…" : "Reserve Experience"}
                    </button>

                    <p className="text-center text-[11px] text-muted-foreground">
                      You won't be charged yet. Instant confirmation.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. YOU MIGHT ALSO LIKE (CAROUSEL OF SIMILAR EXPERIENCES) */}
      {similarExperiences.length > 0 && (
        <section className="container-haven pt-16 sm:pt-24 border-t border-border/70 mt-16">
          <SectionReveal>
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Continue Exploring
                </span>
                <h2 className="mt-1 font-heading text-2xl sm:text-3xl font-medium text-foreground">
                  You Might Also Like
                </h2>
              </div>
              <Link
                to="/experiences"
                className="text-xs font-semibold text-foreground hover:text-champagne-dark"
              >
                View all expeditions →
              </Link>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarExperiences.map((exp, idx) => (
              <SectionReveal key={exp.id} delay={idx * 0.1}>
                <ExperienceCard experience={exp} />
              </SectionReveal>
            ))}
          </div>
        </section>
      )}

      {/* 6. MOBILE BOTTOM SHEET BAR */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur-xl px-5 py-3.5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] text-muted-foreground">Starting from</span>
            <p className="text-lg font-semibold text-foreground leading-tight">
              {formatCurrency(pricePerGuest)}
              <span className="text-xs font-normal text-muted-foreground"> / guest</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="rounded-full bg-foreground px-6 py-2.5 text-xs font-semibold text-background shadow-md transition-transform active:scale-95"
          >
            Reserve
          </button>
        </div>
      </div>

      {/* MOBILE RESERVATION DRAWER MODAL */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-border bg-card p-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                <span className="font-heading text-lg font-medium text-foreground">Reserve Experience</span>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="rounded-full bg-secondary p-1 text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {/* Date */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                    required
                  />
                </div>

                {/* Slot */}
                {experience.availableSlots && experience.availableSlots.length > 0 && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Slot</label>
                    <div className="grid grid-cols-2 gap-2">
                      {experience.availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={cn(
                            "rounded-xl border py-2 text-xs font-medium",
                            selectedSlot === slot ? "bg-foreground text-background" : "border-border text-foreground"
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Guests */}
                <div className="flex items-center justify-between rounded-2xl border border-border p-2">
                  <button
                    type="button"
                    onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                    disabled={guestCount <= 1}
                    className="h-8 w-8 rounded-lg bg-secondary text-foreground"
                  >
                    -
                  </button>
                  <span className="text-sm font-semibold">{guestCount} Guests</span>
                  <button
                    type="button"
                    onClick={() => setGuestCount((g) => Math.min(8, g + 1))}
                    disabled={guestCount >= 8}
                    className="h-8 w-8 rounded-lg bg-secondary text-foreground"
                  >
                    +
                  </button>
                </div>

                {/* Total */}
                <div className="flex justify-between border-t border-border/60 pt-3 text-sm font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>

                <button
                  type="submit"
                  disabled={submittingBooking}
                  className="w-full rounded-full bg-foreground py-3 text-sm font-semibold text-background"
                >
                  {submittingBooking ? "Confirming…" : "Confirm Reservation"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
