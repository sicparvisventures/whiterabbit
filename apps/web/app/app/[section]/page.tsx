import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const sections = {
  setup: {
    title: "Setup",
    eyebrow: "First deployment",
    emptyTitle: "Storage must be provisioned first",
    body: "The organization and deployment form is ready to bind, but it will not pretend to save anything until Supabase migrations and RLS policies exist.",
    action: "Review environment guide",
    href: "https://github.com/sicparvisventures/whiterabbit/blob/main/apps/web/.env.example",
  },
  operations: {
    title: "Operations",
    eyebrow: "Operational picture",
    emptyTitle: "No map or event data",
    body: "A map will initialize only after an approved provider and RLS-scoped deployment return real coordinates and events.",
    action: "Review setup",
    href: "/app/setup",
  },
  candidates: {
    title: "Candidates",
    eyebrow: "Human review queue",
    emptyTitle: "No candidates to review",
    body: "Signed ALPR, object or isolated biometric candidates will remain separated by capability and policy here.",
    action: "Review policies",
    href: "/app/policies",
  },
  watchlists: {
    title: "Watchlists",
    eyebrow: "Restricted capability",
    emptyTitle: "No authorized watchlists",
    body: "Watchlists cannot be created until a separate authority, purpose, model and oversight workflow have been approved.",
    action: "View capability boundary",
    href: "/app/policies",
  },
  nodes: {
    title: "Nodes",
    eyebrow: "Edge devices",
    emptyTitle: "No camera nodes enrolled",
    body: "Use the browser camera locally now. Persistent enrollment requires a deployment and revocable node identity.",
    action: "Open Sentry",
    href: "/sentry",
  },
  policies: {
    title: "Policies",
    eyebrow: "Effective controls",
    emptyTitle: "No effective policy",
    body: "Controller, purpose, classification, retention and capability decisions will appear only after persisted setup.",
    action: "Begin setup",
    href: "/app/setup",
  },
  audit: {
    title: "Audit",
    eyebrow: "Accountability trail",
    emptyTitle: "No audit records",
    body: "The interface does not fabricate receipts. Append-only records will appear after genuine authenticated mutations exist.",
    action: "Review architecture",
    href: "/#architecture",
  },
  settings: {
    title: "Settings",
    eyebrow: "Workspace controls",
    emptyTitle: "Settings are not provisioned",
    body: "Account, organization, deployment, retention and security settings become available after Supabase migrations and RLS are active.",
    action: "Review setup",
    href: "/app/setup",
  },
} as const;

type Section = keyof typeof sections;

export function generateStaticParams() {
  return Object.keys(sections).map((section) => ({ section }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  const content = sections[section as Section];
  return { title: content?.title ?? "Workspace", robots: { index: false } };
}

export default async function EmptyWorkspacePage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const content = sections[section as Section];
  if (!content) notFound();

  return (
    <>
      <header className="workspace-heading">
        <div>
          <span className="kicker">{content.eyebrow}</span>
          <h1>{content.title}</h1>
          <p>Only real, authorized workspace records are rendered.</p>
        </div>
      </header>
      <section className="product-panel full-empty-state">
        <span className="empty-glyph" aria-hidden="true">
          ◎
        </span>
        <span className="mono-label">EMPTY / VERIFIED</span>
        <h2>{content.emptyTitle}</h2>
        <p>{content.body}</p>
        <Link className="button button-primary" href={content.href}>
          {content.action} <span aria-hidden="true">→</span>
        </Link>
      </section>
    </>
  );
}
