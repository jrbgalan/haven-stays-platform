import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { X, Check, Copy, ShieldCheck } from "lucide-react";
import { client } from "@/api/client";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/format";
import type { ProductType, ProductBooking } from "@/types/products";

export interface BookingModalData {
  productType: ProductType;
  itemId: string;
  itemTitle: string;
  itemSubtitle?: string;
  itemImage?: string;
  price: number;
  dateOrTime?: string;
  timeSlot?: string;
  passengersOrGuests?: number;
  details?: Record<string, any>;
}

interface ProductBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: BookingModalData | null;
  onSuccess?: (booking: ProductBooking) => void;
}

export default function ProductBookingModal({
  isOpen,
  onClose,
  data,
  onSuccess,
}: ProductBookingModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [guests, setGuests] = useState(data?.passengersOrGuests || 2);
  const [date, setDate] = useState(data?.dateOrTime || new Date().toISOString().split("T")[0]);
  const [timeSlot, setTimeSlot] = useState(data?.timeSlot || "09:00 - 17:00");
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<ProductBooking | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !data) return null;

  const totalPrice = data.productType === "activities" ? data.price * guests : data.price;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const res = await client.entities.ProductBooking.create({
        userId: user?.id || "guest",
        productType: data.productType,
        itemId: data.itemId,
        itemTitle: data.itemTitle,
        itemSubtitle: data.itemSubtitle,
        itemImage: data.itemImage,
        dateOrTime: date,
        timeSlot: data.productType === "day_use" ? timeSlot : undefined,
        passengersOrGuests: guests,
        totalPrice,
        details: data.details,
      });

      setConfirmedBooking(res);
      if (onSuccess) onSuccess(res);
      toast({
        title: "Reservation Confirmed",
        description: `Reference: ${res.referenceCode}`,
      });
    } catch {
      toast({
        title: "Booking Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const copyRef = () => {
    if (confirmedBooking?.referenceCode) {
      navigator.clipboard.writeText(confirmedBooking.referenceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 14 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border/80 bg-popover shadow-2xl z-10"
      >
        {confirmedBooking ? (
          /* CONFIRMED SCREEN */
          <div className="p-7 sm:p-8 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Check size={32} strokeWidth={2.5} />
            </div>

            <h3 className="mt-4 font-heading text-2xl font-medium text-foreground">
              Reservation Confirmed
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your booking has been registered in the Haven sanctuary registry.
            </p>

            <div className="mt-6 rounded-2xl border border-border bg-card p-4 text-left">
              <div className="flex items-center gap-3">
                {confirmedBooking.itemImage && (
                  <img
                    src={confirmedBooking.itemImage}
                    alt={confirmedBooking.itemTitle}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-semibold text-foreground">
                    {confirmedBooking.itemTitle}
                  </h4>
                  <p className="truncate text-xs text-muted-foreground">
                    {confirmedBooking.itemSubtitle || confirmedBooking.dateOrTime}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {formatCurrency(confirmedBooking.totalPrice)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                <span className="text-xs text-muted-foreground">Reference Code</span>
                <button
                  onClick={copyRef}
                  className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-mono font-medium text-foreground hover:bg-secondary/80"
                >
                  <span>{confirmedBooking.referenceCode}</span>
                  <Copy size={11} />
                  {copied && <span className="text-[10px] text-emerald-500">Copied!</span>}
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <Link
                to="/dashboard"
                onClick={onClose}
                className="flex-1 rounded-full bg-foreground py-3 text-sm font-medium text-background hover:opacity-90"
              >
                View in My Trips
              </Link>
              <button
                onClick={onClose}
                className="flex-1 rounded-full border border-border py-3 text-sm font-medium text-foreground hover:bg-secondary"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* DETAILS & REVIEW FORM */
          <div>
            <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
              <span className="font-heading text-lg font-medium text-foreground">
                Confirm Reservation
              </span>
              <button
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary text-muted-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex gap-4 items-center">
                {data.itemImage && (
                  <img
                    src={data.itemImage}
                    alt={data.itemTitle}
                    className="h-16 w-16 rounded-2xl object-cover shrink-0"
                  />
                )}
                <div>
                  <h4 className="font-heading text-base font-medium text-foreground leading-snug">
                    {data.itemTitle}
                  </h4>
                  {data.itemSubtitle && (
                    <p className="text-xs text-muted-foreground mt-0.5">{data.itemSubtitle}</p>
                  )}
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-champagne-dark dark:text-champagne-light">
                    <ShieldCheck size={12} /> Haven Guarantee
                  </span>
                </div>
              </div>

              {/* Day Use Time Slot Picker if applicable */}
              {data.productType === "day_use" && (
                <div className="rounded-2xl border border-border/70 p-3 bg-secondary/30">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Select 8-Hour Access Window
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none"
                  >
                    <option value="09:00 - 17:00">9:00 AM – 5:00 PM (Day block)</option>
                    <option value="12:00 - 20:00">12:00 PM – 8:00 PM (Twilight block)</option>
                    <option value="14:00 - 22:00">2:00 PM – 10:00 PM (Evening block)</option>
                  </select>
                </div>
              )}

              {/* Date & Guests selection */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border/70 p-3 bg-secondary/30">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1.5 w-full bg-transparent text-xs font-medium text-foreground outline-none"
                  />
                </div>

                <div className="rounded-2xl border border-border/70 p-3 bg-secondary/30">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {data.productType === "transfers" || data.productType === "flights" ? "Passengers" : "Guests"}
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="mt-1.5 w-full bg-transparent text-xs font-medium text-foreground outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n} className="bg-popover text-foreground">
                        {n} {n === 1 ? "Person" : "People"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="rounded-2xl border border-border/70 bg-card p-4 space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Rate</span>
                  <span>{formatCurrency(data.price)}</span>
                </div>
                {data.productType === "activities" && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Participants ({guests})</span>
                    <span>× {guests}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Haven Concierge & Service Fee</span>
                  <span className="text-emerald-500 font-medium">Included</span>
                </div>
                <div className="border-t border-border/60 pt-2 flex justify-between text-sm font-semibold text-foreground">
                  <span>Total Amount</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border/60 p-6 pt-3 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-full border border-border py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={submitting}
                className="flex-1 rounded-full bg-foreground py-2.5 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "Confirming..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

