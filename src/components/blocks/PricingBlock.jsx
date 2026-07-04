"use client";
import React, { useState } from "react";
import { HiCheck, HiSparkles } from "react-icons/hi";

export default function PricingBlock({ data }) {
  const [isAnnual, setIsAnnual] = useState(true);

  const title = data?.title || "Simple, Transparent Pricing";
  const subtitle = data?.subtitle || "Choose the perfect plan for your team. Scale as you grow.";
  const plans = data?.plans || [
    {
      name: "Starter",
      description: "Ideal for solo creators and small side projects.",
      monthlyPrice: 19,
      annualPrice: 15,
      popular: false,
      buttonText: "Start Free Trial",
      features: [
        "Up to 3 Published Pages",
        "Standard Analytics",
        "Community Support",
        "SSL Encryption",
      ],
    },
    {
      name: "Pro Studio",
      description: "Best for growing businesses & design teams.",
      monthlyPrice: 49,
      annualPrice: 39,
      popular: true,
      buttonText: "Upgrade to Pro",
      features: [
        "Unlimited Published Pages",
        "Advanced Conversion Analytics",
        "Custom Domain Binding",
        "Priority 24/7 Support",
        "Export Clean Next.js Code",
      ],
    },
    {
      name: "Enterprise",
      description: "For agencies and large scale operations.",
      monthlyPrice: 149,
      annualPrice: 119,
      popular: false,
      buttonText: "Contact Sales",
      features: [
        "Everything in Pro Studio",
        "Dedicated Account Manager",
        "99.9% Uptime SLA",
        "Custom Block Development",
        "Team Workspaces & Roles",
      ],
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {title}
        </h2>
        {subtitle && <p className="mt-4 text-base sm:text-lg text-slate-400">{subtitle}</p>}

        {/* Monthly / Annual Toggle */}
        <div className="mt-8 flex justify-center items-center gap-3">
          <span className={`text-xs sm:text-sm font-semibold ${!isAnnual ? "text-white" : "text-slate-400"}`}>
            Monthly Billing
          </span>
          <button
            type="button"
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-800 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-indigo-500 shadow-md ring-0 transition duration-200 ease-in-out ${
                isAnnual ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-xs sm:text-sm font-semibold flex items-center gap-1.5 ${isAnnual ? "text-white" : "text-slate-400"}`}>
            Annual Billing
            <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wider">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, idx) => {
          const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;

          return (
            <div
              key={idx}
              className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 ${
                plan.popular
                  ? "bg-slate-900 border-2 border-indigo-500/80 shadow-2xl shadow-indigo-500/20 scale-105 z-10"
                  : "bg-slate-900/60 border border-slate-800 hover:border-slate-700"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[11px] font-extrabold uppercase px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  <HiSparkles /> Most Popular
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="mt-2 text-xs text-slate-400 min-h-[36px]">{plan.description}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">${price}</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>

                <ul className="mt-8 space-y-3 text-xs text-slate-300">
                  {plan.features?.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2.5">
                      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 shrink-0">
                        <HiCheck className="w-3 h-3" />
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  className={`w-full py-3 px-4 rounded-2xl text-xs font-bold transition-all active:scale-[0.96] shadow-md ${
                    plan.popular
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
                      : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                  }`}
                >
                  {plan.buttonText || "Choose Plan"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
