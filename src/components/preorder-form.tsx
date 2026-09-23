"use client";

import { useState } from "react";
import { CheckCircleIcon, InfoIcon, WhatsAppIcon } from "@/components/icons";
import { preorderWhatsAppLink, site } from "@/lib/site";

const BODY_TYPES = ["SUV", "Sedan", "Hatchback", "Minivan", "Pickup", "Coupe", "Any"];
const TIMELINES = [
  "As soon as possible",
  "Within 2–4 weeks",
  "Within 1–3 months",
  "Just exploring prices",
];

export function PreOrderForm({ defaultMake = "" }: { defaultMake?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [summary, setSummary] = useState<string[]>([]);
  const [reference, setReference] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries()) as Record<string, string>;
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/preorders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string; id?: number };
      if (!response.ok || !payload.ok) throw new Error(payload.error ?? "Could not submit request.");

      const lines = [
        `Request: ${values.make ?? ""} ${values.model ?? ""}`.trim(),
        values.yearFrom || values.yearTo
          ? `Year: ${values.yearFrom || "any"} - ${values.yearTo || "any"}`
          : "",
        values.budgetMax ? `Budget: up to ₦${Number(values.budgetMax).toLocaleString("en-NG")}` : "",
        values.bodyType ? `Body type: ${values.bodyType}` : "",
        values.transmission ? `Transmission: ${values.transmission}` : "",
        values.fuelType ? `Fuel: ${values.fuelType}` : "",
        values.exteriorColor ? `Preferred colour: ${values.exteriorColor}` : "",
        values.timeline ? `Timeline: ${values.timeline}` : "",
        values.notes ? `Notes: ${values.notes}` : "",
      ].filter(Boolean);

      setSummary(lines);
      setReference(payload.id ? `DL-PO-${String(payload.id).padStart(4, "0")}` : "DL-PO");
      setStatus("sent");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="panel p-5 md:p-6">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e6f8ee] text-[#0b7a45]">
          <CheckCircleIcon className="h-6 w-6" />
        </span>
        <h3 className="mt-3 text-xl font-bold">Request logged — {reference}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          We have saved your sourcing request. Send it to our WhatsApp desk and a Dashlink
          representative will start matching units locally and abroad, then come back to you with
          options and landed prices.
        </p>
        <ul className="mt-4 space-y-1.5 rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
          {summary.map((line) => (
            <li key={line}>• {line}</li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={preorderWhatsAppLink([...summary, `Reference: ${reference}`])}
            target="_blank"
            rel="noreferrer"
            className="btn btn-whatsapp"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Send to WhatsApp
          </a>
          <button type="button" onClick={() => setStatus("idle")} className="btn btn-outline">
            Submit another request
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          You can also call {site.phones[0].label} to speak with us directly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="panel p-5 md:p-6">
      <h3 className="text-xl font-bold">Tell us the car you want</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-500">
        The more detail you share, the faster we can price it properly — including shipping and
        clearing where applicable.
      </p>

      <fieldset className="mt-5 grid gap-3 sm:grid-cols-2">
        <legend className="label">Your details</legend>
        <div>
          <label className="label" htmlFor="po-name">
            Full name*
          </label>
          <input id="po-name" name="fullName" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="po-phone">
            Phone / WhatsApp*
          </label>
          <input id="po-phone" name="phone" required className="input" inputMode="tel" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="po-email">
            Email (optional)
          </label>
          <input id="po-email" name="email" type="email" className="input" />
        </div>
      </fieldset>

      <fieldset className="mt-6 grid gap-3 sm:grid-cols-2">
        <legend className="label">Vehicle you want</legend>
        <div>
          <label className="label" htmlFor="po-make">
            Make*
          </label>
          <input
            id="po-make"
            name="make"
            required
            className="input"
            defaultValue={defaultMake}
            placeholder="Toyota, Lexus, Mercedes-Benz..."
            list="dashlink-makes"
          />
          <datalist id="dashlink-makes">
            {["Toyota", "Lexus", "Mercedes-Benz", "Honda", "Hyundai", "Ford", "Kia", "Nissan"].map(
              (make) => (
                <option key={make} value={make} />
              ),
            )}
          </datalist>
        </div>
        <div>
          <label className="label" htmlFor="po-model">
            Model / trim
          </label>
          <input id="po-model" name="model" className="input" placeholder="Camry SE, RX 350, GLA 250..." />
        </div>
        <div>
          <label className="label" htmlFor="po-year-from">
            Year from
          </label>
          <input
            id="po-year-from"
            name="yearFrom"
            type="number"
            min={1990}
            max={2030}
            className="input"
            placeholder="2014"
          />
        </div>
        <div>
          <label className="label" htmlFor="po-year-to">
            Year to
          </label>
          <input
            id="po-year-to"
            name="yearTo"
            type="number"
            min={1990}
            max={2030}
            className="input"
            placeholder="2019"
          />
        </div>
        <div>
          <label className="label" htmlFor="po-budget">
            Budget ceiling (₦)
          </label>
          <input
            id="po-budget"
            name="budgetMax"
            type="number"
            min={0}
            step={100000}
            className="input"
            placeholder="35000000"
          />
        </div>
        <div>
          <label className="label" htmlFor="po-body">
            Body type
          </label>
          <select id="po-body" name="bodyType" className="select" defaultValue="SUV">
            {BODY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="po-transmission">
            Transmission
          </label>
          <select id="po-transmission" name="transmission" className="select" defaultValue="Automatic">
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
            <option value="Either">Either</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="po-fuel">
            Fuel
          </label>
          <select id="po-fuel" name="fuelType" className="select" defaultValue="Petrol">
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Electric">Electric</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="po-color">
            Preferred colour
          </label>
          <input id="po-color" name="exteriorColor" className="input" placeholder="Black, silver, white..." />
        </div>
        <div>
          <label className="label" htmlFor="po-timeline">
            How soon?
          </label>
          <select id="po-timeline" name="timeline" className="select" defaultValue={TIMELINES[1]}>
            {TIMELINES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="po-notes">
            Extra requirements
          </label>
          <textarea
            id="po-notes"
            name="notes"
            className="textarea"
            placeholder="Mileage ceiling, must-have features, delivery city, part-exchange details..."
          />
        </div>
      </fieldset>

      {status === "error" ? (
        <p className="mt-3 rounded border border-dash-red/30 bg-dash-red-soft px-3 py-2 text-sm text-dash-red-dark">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="submit" className="btn btn-red btn-lg" disabled={status === "sending"}>
          {status === "sending" ? "Submitting..." : "Submit pre-order request"}
        </button>
        <p className="flex items-center gap-2 text-xs text-slate-400">
          <InfoIcon className="h-4 w-4" />
          No payment now. We confirm price and terms before any commitment.
        </p>
      </div>
    </form>
  );
}
