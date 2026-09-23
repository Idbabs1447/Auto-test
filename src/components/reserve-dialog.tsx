"use client";

import { useState } from "react";
import { CalendarIcon, CheckCircleIcon, CloseIcon, InfoIcon, WhatsAppIcon } from "@/components/icons";
import { site, whatsappLink } from "@/lib/site";

export function ReserveButton({
  vehicleSlug,
  vehicleTitle,
  className = "btn btn-red",
}: {
  vehicleSlug: string;
  vehicleTitle: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [reference, setReference] = useState("");
  const [name, setName] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setStatus("sending");
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleSlug,
          fullName: formData.get("fullName"),
          phone: formData.get("phone"),
          preferredDate: formData.get("preferredDate"),
          inspectionMode: formData.get("inspectionMode"),
          notes: formData.get("notes"),
        }),
      });
      const payload = (await response.json()) as { ok?: boolean; reference?: string };
      if (!response.ok || !payload.ok) throw new Error("failed");
      setReference(payload.reference ?? "DL-######");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        <CalendarIcon className="h-4 w-4" />
        Reserve a slot
      </button>

      {open ? (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-navy-950/70 p-4 py-10">
          <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">Reserve &amp; inspection request</h3>
                <p className="mt-1 text-sm text-slate-500">{vehicleTitle}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setStatus("idle");
                }}
                className="btn-icon"
                aria-label="Close reservation form"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            {status === "sent" ? (
              <div className="mt-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e6f8ee] text-[#0b7a45]">
                  <CheckCircleIcon className="h-6 w-6" />
                </span>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Thank you {name || "there"} — your reference is{" "}
                  <span className="font-bold text-navy-900">{reference}</span>. A Dashlink
                  representative will confirm availability and a viewing time.
                </p>
                <div className="mt-3 flex items-start gap-2 rounded border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
                  <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  Online reservation with payment is not live yet. This request holds your interest
                  only — payment is completed in person or by transfer after confirmation.
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={whatsappLink(
                      `Hello ${site.shortName}, I submitted reservation request ${reference} for the ${vehicleTitle}. Please confirm the next steps.`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-whatsapp"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Confirm on WhatsApp
                  </a>
                  <button type="button" onClick={() => setOpen(false)} className="btn btn-outline">
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="res-name">
                    Full name
                  </label>
                  <input
                    id="res-name"
                    name="fullName"
                    required
                    className="input"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
                <div>
                  <label className="label" htmlFor="res-phone">
                    Phone / WhatsApp
                  </label>
                  <input id="res-phone" name="phone" required className="input" inputMode="tel" />
                </div>
                <div>
                  <label className="label" htmlFor="res-date">
                    Preferred viewing date
                  </label>
                  <input id="res-date" name="preferredDate" type="date" className="input" />
                </div>
                <div>
                  <label className="label" htmlFor="res-mode">
                    Inspection type
                  </label>
                  <select id="res-mode" name="inspectionMode" className="select" defaultValue="yard">
                    <option value="yard">Visit the yard in Ogba</option>
                    <option value="video">Live video inspection</option>
                    <option value="mechanic">Bring my mechanic</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="res-notes">
                    Anything else we should know?
                  </label>
                  <textarea
                    id="res-notes"
                    name="notes"
                    className="textarea"
                    placeholder="Part exchange, financing questions, shipping to another state..."
                  />
                </div>
                {status === "error" ? (
                  <p className="sm:col-span-2 rounded border border-dash-red/30 bg-dash-red-soft px-3 py-2 text-sm text-dash-red-dark">
                    We could not save that request. Please try again or message us on WhatsApp.
                  </p>
                ) : null}
                <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
                  <button type="submit" className="btn btn-navy" disabled={status === "sending"}>
                    {status === "sending" ? "Sending..." : "Record my request"}
                  </button>
                  <span className="text-xs text-slate-400">
                    No payment is taken on this website yet.
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
