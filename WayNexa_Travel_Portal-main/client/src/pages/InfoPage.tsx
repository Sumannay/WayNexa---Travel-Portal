import { ArrowRight, LockKeyhole, MailCheck, ShieldAlert, SlidersHorizontal, Star } from "lucide-react";
import { Link } from "react-router-dom";

type InfoPageProps = { kind: "settings" | "reviews" | "forgot" | "admin" };

const copy = {
  settings: { eyebrow: "Account settings", title: "Make WayNexa feel like yours.", body: "Your account preferences are saved with your account data. Payment methods and notification controls are not available because checkout and email services are not connected.", icon: SlidersHorizontal, action: "Return to profile", to: "/profile" },
  reviews: { eyebrow: "Review preview", title: "The useful details live in the stories.", body: "This preview cannot verify travel experiences or publish reviews. Example stories are illustrative, and notes you submit remain private to your account.", icon: Star, action: "Explore stays", to: "/hotels" },
  forgot: { eyebrow: "Password reset", title: "We’ll help you get back in.", body: "Password reset is not available yet because email delivery and verified-email flows are not configured. Contact the site owner if you cannot access your account.", icon: MailCheck, action: "Back to sign in", to: "/login" },
  admin: { eyebrow: "Admin workspace", title: "Operations, with guardrails.", body: "The owner dashboard provides account and recent activity summaries. Access is determined by the server configuration; live inventory, booking, and review management are not connected.", icon: ShieldAlert, action: "Explore the product", to: "/" },
};

export default function InfoPage({ kind }: InfoPageProps) {
  const item = copy[kind];
  const Icon = item.icon;
  return <main className="grid min-h-[70vh] place-items-center bg-[#fbfaf7] px-5 py-16"><section className="max-w-2xl rounded-[2rem] bg-white p-8 text-center shadow-sm ring-1 ring-slate-200 sm:p-12"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#eef4e9] text-[#387a43]"><Icon size={25} /></span><p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-[#4a8558]">{item.eyebrow}</p><h1 className="mt-3 text-4xl font-black tracking-[-.05em]">{item.title}</h1><p className="mt-5 leading-7 text-slate-500">{item.body}</p>{kind === "admin" && <p className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-amber-700"><LockKeyhole size={16} /> Admin roles are enforced by the backend, never just this screen.</p>}<Link to={item.to} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#183927] px-5 py-3 text-sm font-bold text-white"><span>{item.action}</span><ArrowRight size={17} /></Link></section></main>;
}
