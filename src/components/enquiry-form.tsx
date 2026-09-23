"use client";

import { useState } from "react";
import { CheckCircleIcon, WhatsAppIcon } from "@/components/icons";
import { site, whatsappLink } from "@/lib/site";

type EnquiryFormProps = {
  vehicleSlug?: string;
  vehicleTitle?: string;
  channel?: "form" | "whatsapp" | "phone";
  compact?: boolean;
  heading?: string;
  description?: string;
};

export function EnquiryForm({
  vehicleSlug,
  vehicleTitle,
  channel = "form",
  compact = false,
  heading,
  description,
}: EnquiryFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const defaultMessage = vehicleTitle
    ? `I'm interested in the ${vehicleTitle}. Please confirm availability, price and inspection details.`
    : "";

  const handoff = whatsappLink(
    `Hello ${site.shortName}, my name is ${name || "(name)"}.${
      vehicleTitle ? ` I'm enquiring about the ${vehicleTitle}.` : ""
    } My number is ${phone || "(phone)"}.${vehicleSlug ? ` Listing: ${site.url.replace(/\/$/, "")}/vehicles/${vehicleSlug}` : ""}`,
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleSlug,
          vehicleTitle,
          fullName: formData.get("fullName"),
          phone: formData.get("phone"),
          email: formData.get("email"),
          message: formData.get("message"),
          channel,
        }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "Could not send your enquiry.");
      }
      setStatus("sent");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="panel p-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e6f8ee] text-[#0b7a45]">
          <CheckCircleIcon className="h-6 w-6" />
        </span>
        <h3 className="mt-3 text-lg font-bold">Enquiry received</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          Thanks {name || "there"} — we have logged your enquiry{vehicleTitle ? ` for the ${vehicleTitle}` : ""}. For
          the fastest reply, continue on WhatsApp and we will confirm straight away.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={handoff} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
            <WhatsAppIcon className="h-4 w-4" />
            Continue on WhatsApp
          </a>
          <button type="button" onClick={() => setStatus("idle")} className="btn btn-outline">
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="panel p-5" id="enquire">
      <h3 className="text-lg font-bold">{heading ?? "Send an enquiry"}</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-500">
        {description ??
          (vehicleTitle
            ? `Tell us how to reach you and we will respond with the details for the ${vehicleTitle}.`
            : "Send us a message and the Dashlink team will get back to you.")}
      </p>

      <div className={`mt-4 grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div>
          <label className="label" htmlFor="enq-name">
            Full name
          </label>
          <input
            id="enq-name"
            name="fullName"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="input"
            placeholder="e.g. Chinedu Okafor"
          />
        </div>
        <div>
          <label className="label" htmlFor="enq-phone">
            Phone / WhatsApp
          </label>
          <input
            id="enq-phone"
            name="phone"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="input"
            placeholder="0803 000 0000"
            inputMode="tel"
          />
        </div>
        <div className={compact ? "" : "sm:col-span-2"}>
          <label className="label" htmlFor="enq-email">
            Email (optional)
          </label>
          <input
            id="enq-email"
            name="email"
            type="email"
            className="input"
            placeholder="you@email.com"
          />
        </div>
        <div className={compact ? "" : "sm:col-span-2"}>
          <label className="label" htmlFor="enq-message">
            Message
          </label>
          <textarea
            id="enq-message"
            name="message"
            required
            defaultValue={defaultMessage}
            className="textarea"
            placeholder="Tell us what you need — budget, preferred colour, when you want to inspect."
          />
        </div>
      </div>

      {status === "error" ? (
        <p className="mt-3 rounded border border-dash-red/30 bg-dash-red-soft px-3 py-2 text-sm text-dash-red-dark">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="submit" className="btn btn-navy" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Submit enquiry"}
        </button>
        <a href={handoff} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
          <WhatsAppIcon className="h-4 w-4" />
          Or chat now
        </a>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-400">
        We use your details only to answer this enquiry. Prefer to talk? Call{" "}
        <a href={`tel:${site.phones[0].raw}`} className="font-semibold text-navy-700">
          {site.phones[0].label}
        </a>
        .
      </p>
    </form>
  );
}
