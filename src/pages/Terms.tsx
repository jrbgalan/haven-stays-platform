import React from "react";
import LegalPage from "@/components/ui/LegalPage";
import { GEN_IMAGES } from "@/lib/constants";

const sections = [
  { id: "acceptance", title: "Acceptance of these terms", body: [<p key="1">By using Haven, you agree to these terms. If you don't, please don't use the service. Certain features may have additional rules, which are linked where they apply.</p>] },
  { id: "accounts", title: "Accounts", body: [<p key="1">You must be 16 or older and provide accurate information. You're responsible for keeping your credentials secure and for activity on your account. Tell us promptly if you suspect unauthorized access.</p>] },
  { id: "bookings", title: "Bookings and payments", body: [<p key="1">A booking is a contract between you and the host. Haven facilitates the reservation, processes payment, and enforces availability, but the stay is provided by the host. Prices include nightly rate, fees, and applicable taxes as shown in the breakdown.</p>, <p key="2">You're charged once a booking is confirmed. Refunds follow the listing's cancellation policy.</p>] },
  { id: "cancellations", title: "Cancellations and refunds", body: [<p key="1">Each listing displays one of three policies — Flexible, Moderate, or Strict. The estimated refund depends on how far ahead you cancel. See the Cancellation page for details and a calculator.</p>] },
  { id: "host", title: "Host responsibilities", body: [<p key="1">Hosts must accurately represent their property, maintain it to a safe standard, honor confirmed bookings, and communicate promptly. Haven may remove listings that misrepresent or endanger guests.</p>] },
  { id: "guest", title: "Guest responsibilities", body: [<p key="1">Guests agree to treat the property and neighbors with respect, follow house rules, report issues promptly, and not exceed the maximum occupancy. Damage or disruption may result in charges or removal from the platform.</p>] },
  { id: "appointments", title: "Appointments and viewings", body: [<p key="1">Viewings can be booked in person or by video. Slots are time-zone aware and can't be booked in the past. You may reschedule or cancel with a confirmation step; a buffer between viewings keeps schedules fair.</p>] },
  { id: "reviews", title: "Reviews and content", body: [<p key="1">Only guests with a completed stay may review that stay. Reviews must be honest and based on genuine experience. We may remove content that is abusive, false, or off-topic. Hosts may reply publicly.</p>] },
  { id: "conduct", title: "Prohibited conduct", body: [<p key="1">You may not use Haven to break the law, harass others, discriminate, list illegal services, or circumvent our payment system. We may suspend accounts that violate these rules.</p>] },
  { id: "ai", title: "AI features disclaimer", body: [<p key="1">AI tools — smart search, the concierge, and listing helpers — generate suggestions that may be imperfect. Verify important details before relying on them. AI output is not professional advice.</p>] },
  { id: "liability", title: "Liability", body: [<p key="1">Haven acts as a platform connecting guests and hosts. To the extent permitted by law, we're not liable for the conduct of hosts or guests, or for events at a property. We work to resolve disputes fairly.</p>] },
  { id: "dispute", title: "Dispute resolution", body: [<p key="1">We encourage resolving issues directly or through our support team first. Unresolved disputes may be handled through binding arbitration, with a small-claims exception, as permitted by local law.</p>] },
  { id: "termination", title: "Termination", body: [<p key="1">You can close your account at any time. We may suspend or terminate access if these terms are violated or to protect the community.</p>] },
  { id: "law", title: "Governing law", body: [<p key="1">These terms are governed by the laws of the jurisdiction where Haven operates, without regard to conflict-of-law principles.</p>] },
  { id: "contact", title: "Contact", body: [<p key="1">Questions about these terms? Reach us through the Help Center. This is a portfolio demonstration project; content is sample text and not legal advice.</p>] },
];

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      description="The rules and expectations for using Haven."
      updated="October 2026"
      note="This is a portfolio demonstration project. Content is sample text and not legal advice."
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Terms" }]}
      sections={sections}
      image={GEN_IMAGES.santorini}
    />
  );
}