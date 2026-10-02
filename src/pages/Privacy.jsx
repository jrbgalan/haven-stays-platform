import React, { useState } from "react";
import LegalPage from "@/components/ui/LegalPage";
import { GEN_IMAGES } from "@/lib/constants";

function CookiePreferences() {
  const [toggles, setToggles] = useState(() => {
    try { return JSON.parse(localStorage.getItem("haven-cookies") || "") || { analytics: true, marketing: false }; }
    catch { return { analytics: true, marketing: false }; }
  });
  const save = () => { localStorage.setItem("haven-cookies", JSON.stringify(toggles)); alert("Cookie preferences saved."); };
  const Toggle = ({ label, desc, value, onChange, disabled }) => (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
      <div><p className="text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
      <button onClick={() => !disabled && onChange(!value)} disabled={disabled} className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-foreground" : "bg-muted"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background transition-transform ${value ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
  return (
    <div className="space-y-3">
      <Toggle label="Necessary" desc="Required for the site to function. Always on." value disabled />
      <Toggle label="Analytics" desc="Help us understand how the site is used." value={toggles.analytics} onChange={(v) => setToggles((t) => ({ ...t, analytics: v }))} />
      <Toggle label="Marketing" desc="Personalized content and ads." value={toggles.marketing} onChange={(v) => setToggles((t) => ({ ...t, marketing: v }))} />
      <button onClick={save} className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:scale-[1.01] active:scale-95">Save preferences</button>
    </div>
  );
}

const sections = [
  { id: "collect", title: "Information we collect", body: [<p key="1">We collect the details you give us when you create an account or make a booking — your name, email, phone number, and payment information. We also gather booking history, messages between guests and hosts, and the content of any reviews or reports you submit.</p>, <p key="2">When you use the site, we receive technical data such as device type, browser, approximate location, and usage logs. This helps us keep the service secure and improve the experience.</p>] },
  { id: "use", title: "How we use it", body: [<p key="1">Your information powers the core service: confirming bookings, messaging hosts, processing payments, and providing support. We use analytics to understand which features are valued and to fix what isn't working.</p>, <p key="2">With your consent, we may send trip ideas, concierge offers, and host updates. You can manage these in cookie preferences or unsubscribe at any time.</p>] },
  { id: "cookies", title: "Cookies and tracking", body: [<p key="1">We use cookies for authentication, remembering preferences, and — with your permission — analytics and marketing. You can adjust these below; your choices are stored on this device.</p>, <CookiePreferences key="cp" />] },
  { id: "sharing", title: "Sharing and disclosure", body: [<p key="1">We share information only as needed to operate the service — with payment processors, hosting infrastructure, and the specific host of your booking. We never sell your personal data.</p>, <p key="2">We may disclose information when required by law or to protect the safety of our community, such as in response to a valid report of harm.</p>] },
  { id: "retention", title: "Data retention", body: [<p key="1">We keep your account data while your account is active. Booking and message records are retained for as long as needed to provide the service and meet legal obligations, then deleted or anonymized.</p>] },
  { id: "security", title: "Security", body: [<p key="1">We protect data with encryption in transit and at rest, strict access controls, and regular reviews. No system is perfectly secure, but we work to keep yours safe and act quickly if issues arise.</p>] },
  { id: "rights", title: "Your rights", body: [<p key="1">You can access, correct, or delete your data, and request a portable copy. Contact support to exercise any of these rights; we'll respond within a reasonable timeframe.</p>] },
  { id: "children", title: "Children's privacy", body: [<p key="1">Haven is not intended for children under 16, and we do not knowingly collect their data. If you believe a minor has registered, contact us and we'll remove the account.</p>] },
  { id: "transfers", title: "International transfers", body: [<p key="1">Your data may be processed in countries other than your own. Where this happens, we use safeguards such as standard contractual clauses to protect it.</p>] },
  { id: "changes", title: "Changes to this policy", body: [<p key="1">We'll update this policy as the service evolves. The "Last updated" date above reflects the most recent change. Material changes will be highlighted in the app or by email.</p>] },
  { id: "contact", title: "Contact", body: [<p key="1">Questions about privacy? Reach our support team via the Help Center. This is a portfolio demonstration project, so no real data is processed.</p>] },
];

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="How Haven collects, uses, and protects your information."
      updated="October 2026"
      note="This is a portfolio demonstration project. Content is sample text and not legal advice."
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Privacy" }]}
      sections={sections}
      image={GEN_IMAGES.tuscany}
    />
  );
}