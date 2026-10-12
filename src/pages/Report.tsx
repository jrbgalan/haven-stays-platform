import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ChevronRight, Check, Upload, X, ShieldAlert } from "lucide-react";
import { useSeo } from "@/lib/seo";
import PageHero from "@/components/ui/PageHero";
import SectionReveal from "@/components/ui/SectionReveal";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { getBookings, getListings, createReport } from "@/services";
import { GEN_IMAGES } from "@/lib/constants";
import { generateReference } from "@/lib/format";

const TYPES = ["Listing", "Host", "Guest", "Review", "Safety emergency", "Payment issue", "Other"];
const inputCls = "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-all focus:border-foreground/40 focus:ring-2 focus:ring-accent/20";

export default function Report() {
  useSeo("Report a Concern", "Report a listing, host, guest, review, or safety concern to the Haven team.");
  const [params] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    type: params.get("listing") ? "Listing" : params.get("review") ? "Review" : "",
    targetId: params.get("listing") || params.get("review") || "",
    category: "",
    description: "",
    isAnonymous: false,
  });
  const [evidence, setEvidence] = useState([]); // {uri, name, preview, uploading}
  const [bookings, setBookings] = useState([]);
  const [listings, setListings] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    getBookings().then((b) => setBookings(b as any)).catch(() => {});
    getListings().then((res) => setListings(res.slice(0, 8) as any)).catch(() => {});
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onFiles = async (files: FileList | File[]) => {
    const remaining = 5 - evidence.length;
    const picked = (Array.from(files) as File[]).slice(0, remaining);
    for (const file of picked) {
      const id = Math.random().toString(36).slice(2);
      const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
      setEvidence((e) => [...e, { uri: null, name: file.name, preview, uploading: true, id }]);
      try {
        const res = { file_uri: preview };
        setEvidence((e) => e.map((x) => (x.id === id ? { ...x, uri: res?.file_uri || preview, uploading: false } : x)));
      } catch {
        setEvidence((e) => e.map((x) => (x.id === id ? { ...x, uploading: false, error: true } : x)));
        toast({ title: "Upload failed", description: file.name, variant: "destructive" });
      }
    }
  };

  const removeEvidence = (id) => setEvidence((e) => e.filter((x) => x.id !== id));

  const submit = async () => {
    if (!user) { toast({ title: "Please sign in", description: "You need an account to file a report.", variant: "destructive" }); return; }
    setSubmitting(true);
    try {
      const reference = generateReference("RP");
      await createReport({
        userId: user.id,
        type: form.type,
        targetId: form.targetId || null,
        category: form.category,
        description: form.description,
        evidence: evidence.map((e: any) => e.uri).filter(Boolean),
        isAnonymous: form.isAnonymous,
        reference,
      });
      setRef(reference);
    } catch (err: any) {
      toast({ title: "Couldn't submit report", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const steps = ["What", "Which", "Details", "Review"];
  const canNext = [!!form.type, !!form.targetId || form.type === "Other" || form.type === "Safety emergency", form.description.trim().length >= 10, true][step];

  return (
    <div className="pt-16">
      <PageHero
        eyebrow="Report a Concern"
        title="Help us keep Haven safe"
        subtitle="Report a listing, host, or safety issue. Your report is reviewed by our team."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Report" }]}
        image={GEN_IMAGES.coral}
      />

      {/* Safety banner */}
      <div className="mx-auto max-w-3xl px-5 pt-8 sm:px-8">
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
          <ShieldAlert size={20} className="mt-0.5 shrink-0 text-destructive" />
          <p className="text-sm text-foreground/80">If you are in immediate danger, <strong>contact local emergency services first</strong>. This form is reviewed during business hours and is not for emergencies.</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        {ref ? (
          <SectionReveal>
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-foreground text-background"><Check size={22} /></div>
              <h3 className="mt-4 font-heading text-2xl font-medium">Report submitted</h3>
              <p className="mt-2 text-sm text-muted-foreground">Your reference code is</p>
              <p className="mt-1 font-heading text-3xl font-semibold tracking-wider">{ref}</p>
              <p className="mt-4 text-sm text-muted-foreground">Expected response time: within 48 hours.</p>
              <Link to="/" className="mt-6 inline-flex rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-secondary">Back home</Link>
            </div>
          </SectionReveal>
        ) : (
          <>
            {/* Stepper */}
            <div className="flex items-center gap-2">
              {steps.map((s, i) => (
                <div key={s} className="flex flex-1 items-center gap-2">
                  <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${i <= step ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>{i + 1}</div>
                  <span className={`hidden text-xs font-medium sm:block ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
                  {i < steps.length - 1 && <div className={`h-px flex-1 ${i < step ? "bg-foreground" : "bg-border"}`} />}
                </div>
              ))}
            </div>

            <div className="mt-8">
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}>
                  {step === 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {TYPES.map((t) => (
                        <button key={t} onClick={() => set("type", t)} className={`rounded-2xl border p-4 text-left text-sm font-medium transition-colors ${form.type === t ? "border-foreground bg-foreground text-background" : "border-border bg-card hover:bg-secondary"}`}>{t}</button>
                      ))}
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-4">
                      <select value={form.targetId} onChange={(e) => set("targetId", e.target.value)} className={inputCls}>
                        <option value="">Select a listing or booking…</option>
                        <optgroup label="Listings">
                          {listings.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
                        </optgroup>
                        <optgroup label="Your bookings">
                          {bookings.map((b) => <option key={b.id} value={b.id}>{b.listingTitle} · {b.checkIn}</option>)}
                        </optgroup>
                      </select>
                      {(form.type === "Other" || form.type === "Safety emergency") && (
                        <p className="text-xs text-muted-foreground">No specific target required for this report type — you can continue.</p>
                      )}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</label>
                        <input value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. Inaccurate listing, safety hazard, payment dispute" className={inputCls} />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Details <span className="text-muted-foreground/60">({form.description.length} chars)</span></label>
                        <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={5} placeholder="Tell us what happened. Minimum 10 characters." className={inputCls} />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Evidence (up to 5 files)</label>
                        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card px-4 py-6 text-sm text-muted-foreground hover:bg-secondary">
                          <Upload size={16} /> Upload files
                          <input type="file" multiple accept="image/*,application/pdf" className="hidden" onChange={(e) => e.target.files && onFiles(e.target.files)} />
                        </label>
                        {evidence.length > 0 && (
                          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                            {evidence.map((f) => (
                              <div key={f.id} className="relative aspect-square overflow-hidden rounded-lg border border-border bg-secondary">
                                {f.preview ? <img src={f.preview} alt={f.name} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-xs text-muted-foreground">{f.uploading ? "…" : "PDF"}</div>}
                                <button onClick={() => removeEvidence(f.id)} className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-foreground/80 text-background"><X size={11} /></button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <label className="flex items-center gap-2.5 text-sm">
                        <input type="checkbox" checked={form.isAnonymous} onChange={(e) => set("isAnonymous", e.target.checked)} className="h-4 w-4 accent-foreground" />
                        Submit anonymously
                      </label>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-3 rounded-2xl border border-border bg-card p-6 text-sm">
                      <Row k="Type" v={form.type} />
                      <Row k="Target" v={form.targetId || "—"} />
                      <Row k="Category" v={form.category || "—"} />
                      <Row k="Anonymous" v={form.isAnonymous ? "Yes" : "No"} />
                      <Row k="Evidence" v={`${evidence.length} file(s)`} />
                      <div className="border-t border-border pt-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Details</p>
                        <p className="mt-1 leading-relaxed text-foreground/80">{form.description}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Nav buttons */}
            <div className="mt-8 flex items-center justify-between">
              <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-secondary disabled:opacity-40">
                Back
              </button>
              {step < 3 ? (
                <button onClick={() => canNext && setStep((s) => s + 1)} disabled={!canNext} className="flex items-center gap-1.5 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-40">
                  Next <ChevronRight size={15} />
                </button>
              ) : (
                <button onClick={submit} disabled={submitting} className="flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50">
                  {submitting ? "Submitting…" : <><AlertTriangle size={15} /> Submit report</>}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right font-medium">{v}</span>
    </div>
  );
}