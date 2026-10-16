import { useState } from "react";
import { motion } from "framer-motion";
import { Landmark, Copy, Check, ExternalLink } from "lucide-react";

// Hilltop Nation bank details
const accounts = [
  {
    purpose: "Tithe & Offering",
    bank: "Providus Bank Plc",
    accountName: "Hilltop Nation Ministry",
    accountNumber: "5403833510",
    description: "Sunday offerings, tithes, first fruits, and kingdom seeds",
  },

  // ── Optional: Uncomment when the ministry provides these ──
  // {
  //   purpose: "Building Fund",
  //   bank: "Zenith Bank",
  //   accountName: "Radiant Illumination Ministries",
  //   accountNumber: "",
  //   description: "Sowing ahead of groundbreaking, so we can build by the grace of God",
  // },
  // {
  //   purpose: "Missions & Outreach",
  //   bank: "Zenith Bank",
  //   accountName: "Radiant Illumination Ministries",
  //   accountNumber: "",
  //   description: "Supporting evangelism, missions, and community outreach",
  // },
];

const GivingAccounts = () => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = async (number, index) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1800);
    } catch {
      // Clipboard access can fail on some browsers/contexts — fail silently.
    }
  };

  return (
    <section className="py-16 md:py-24 bg-lightBackground">
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4 text-primary/50">
            <span className="flex items-center justify-center rounded-full w-9 h-9 bg-background">
              <Landmark size={18} className="text-secondary" />
            </span>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase font-heading-sans">
              Bank Transfer
            </span>
          </div>
          <h2 className="text-4xl font-black tracking-tight uppercase sm:text-5xl font-heading-sans text-primary">
            Naira Accounts
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account, index) => (
            <motion.div
              key={account.purpose}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col p-6 border rounded-2xl border-black/10 bg-background sm:p-7"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <h3 className="text-lg font-black tracking-tight uppercase font-heading-sans text-primary">
                  {account.purpose}
                </h3>
                <span className="flex items-center gap-1 text-xs font-medium shrink-0 text-secondary">
                  {account.bank}
                  <ExternalLink size={12} />
                </span>
              </div>

              <p className="mb-4 text-xs text-primary/60 font-albert-sans">
                Account Name:{" "}
                <span className="font-semibold text-primary/80">
                  {account.accountName}
                </span>
              </p>

              <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white rounded-xl">
                <span className="text-lg font-semibold tracking-wide text-primary font-heading-sans">
                  {account.accountNumber}
                </span>
                <button
                  onClick={() => handleCopy(account.accountNumber, index)}
                  aria-label="Copy account number"
                  className="flex items-center justify-center transition-colors rounded-lg w-9 h-9 bg-background hover:bg-secondary/10 text-secondary"
                >
                  {copiedIndex === index ? (
                    <Check size={16} />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>

              <p className="mt-4 text-sm text-primary/60 font-albert-sans">
                {account.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GivingAccounts;
