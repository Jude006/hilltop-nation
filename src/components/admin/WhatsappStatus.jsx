import React, { useState, useEffect, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Smartphone,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Zap,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";
import { apiRequest } from "../../lib/api";

const WhatsappStatus = () => {
  const [connection, setConnection] = useState({
    qr: null,
    status: "Checking...",
  });
  const [isOffline, setIsOffline] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  const checkConnection = useCallback(async () => {
    try {
      const data = await apiRequest("/comms/status", "GET", null, false);
      console.log("Status data:", data);
      setConnection(data);
      setIsOffline(false);
    } catch (err) {
      setIsOffline(true);
      setConnection({ qr: null, status: "Server Offline" });
      console.error("System Bridge Error:", err.message);
    }
  }, []);

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, [checkConnection]);

  return (
    <div className="min-h-screen px-4 py-6 mx-auto space-y-6 md:py-8 md:px-8 max-w-7xl md:space-y-8 font-albert-sans">
      {/* Header - Mobile Optimized */}
      <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase md:text-4xl text-primary font-heading-serif">
            System Bridge
          </h2>
          <p className="text-[8px] md:text-[10px] text-primary/30 uppercase tracking-[0.4em] font-bold mt-1">
            Infrastructure Management
          </p>
        </div>
        <div
          className={`px-4 py-2 md:px-6 md:py-3 rounded-2xl border flex items-center gap-2 md:gap-3 transition-all text-xs md:text-base ${
            connection.status === "Connected"
              ? "bg-secondary/10 border-secondary text-secondary"
              : "bg-gray-100 border-gray-200 text-gray-400"
          }`}
        >
          <Zap
            size={14}
            className="md:w-4 md:h-4"
            fill={connection.status === "Connected" ? "currentColor" : "none"}
          />
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">
            {connection.status}
          </span>
        </div>
      </header>

      {/* Main Grid - Responsive */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        {/* BRIDGE STATUS / QR DISPLAY - Mobile Optimized */}
        <div className="lg:col-span-7 bg-white rounded-[30px] md:rounded-[50px] p-6 md:p-12 border border-gray-50 shadow-2xl flex flex-col items-center justify-center text-center min-h-[300px] md:min-h-[600px]">
          {connection.status === "Connected" ? (
            <div className="space-y-4 md:space-y-8 animate-in zoom-in duration-500">
              <div className="relative">
                <div className="w-24 h-24 md:w-40 md:h-40 bg-secondary/10 rounded-[30px] md:rounded-[50px] flex items-center justify-center mx-auto">
                  <CheckCircle2
                    size={48}
                    className="md:w-20 md:h-20 text-secondary"
                  />
                </div>
                <div className="absolute p-1.5 md:p-2 text-white border-2 md:border-4 border-white rounded-full -top-1 -right-1 md:-top-2 md:-right-2 bg-primary">
                  <Zap size={10} className="md:w-4 md:h-4" fill="white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl md:text-4xl font-black tracking-tighter uppercase text-primary">
                  Bridge Active
                </h3>
                <p className="max-w-xs mx-auto mt-2 text-[10px] md:text-xs font-bold leading-relaxed uppercase text-primary/30">
                  Secure link established. All outgoing broadcasts will now
                  route through your linked device.
                </p>
              </div>
            </div>
          ) : connection.qr ? (
            <div className="space-y-6 md:space-y-10 animate-in fade-in w-full">
              <div className="flex justify-center p-4 md:p-10 bg-background rounded-[30px] md:rounded-[50px] border-[8px] md:border-[12px] border-secondary/5 shadow-inner">
                <QRCodeSVG
                  value={connection.qr}
                  size={200}
                  className="w-[200px] h-[200px] md:w-[280px] md:h-[280px]"
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="space-y-2 md:space-y-3">
                <h3 className="text-xl md:text-2xl font-black uppercase text-primary">
                  Scan to Authenticate
                </h3>
                <p className="text-[8px] md:text-[10px] text-secondary font-black uppercase tracking-[0.3em] animate-pulse">
                  Encryption sequence pending...
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 md:gap-6">
              <RefreshCw
                size={32}
                className="md:w-12 md:h-12 animate-spin text-primary/10"
              />
              <p className="text-[8px] md:text-[10px] font-black text-primary/20 uppercase tracking-[0.4em]">
                {connection.status === "Initializing"
                  ? "Initializing..."
                  : "Waking System Engine"}
              </p>
            </div>
          )}
        </div>

        {/* SIDE PANEL - Mobile Optimized with Collapsible Steps */}
        <div className="space-y-4 md:space-y-6 lg:col-span-5">
          {/* Security Card */}
          <div className="bg-primary rounded-[30px] md:rounded-[45px] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden group">
            <ShieldCheck
              className="mb-4 md:mb-6 text-secondary transition-transform group-hover:scale-110 md:w-11 md:h-11"
              size={28}
            />
            <h4 className="text-xl md:text-2xl font-black leading-none tracking-tight uppercase">
              Security
              <br />
              Protocol
            </h4>
            <p className="mt-4 md:mt-6 text-[10px] md:text-xs font-bold leading-relaxed uppercase text-white/40">
              Your session is protected via <strong>HTN-CLOUD</strong>. This
              link uses a persistent authentication strategy—once scanned, you
              stay connected indefinitely.
            </p>
            <div className="absolute w-40 h-40 md:w-56 md:h-56 rounded-full -right-10 -bottom-10 md:-right-16 md:-bottom-16 bg-secondary/5 blur-3xl"></div>
          </div>

          {/* Authentication Guide - Collapsible on Mobile */}
          <div className="bg-white rounded-[30px] md:rounded-[45px] p-6 md:p-10 border border-gray-50 shadow-sm">
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="flex items-center justify-between w-full md:cursor-default"
            >
              <h4 className="text-[10px] font-black uppercase text-primary/20 tracking-widest">
                Authentication Guide
              </h4>
              <ChevronDown
                className={`md:hidden transition-transform ${showSteps ? "rotate-180" : ""}`}
                size={20}
              />
            </button>

            <div
              className={`space-y-6 md:space-y-8 mt-4 md:mt-6 ${showSteps ? "block" : "hidden md:block"}`}
            >
              {[
                {
                  step: "01",
                  t: "Open WhatsApp",
                  d: "Access settings on your mobile device.",
                },
                {
                  step: "02",
                  t: "Link Device",
                  d: "Select 'Linked Devices' and tap 'Link a Device'.",
                },
                {
                  step: "03",
                  t: "Point & Scan",
                  d: "Capture the QR code displayed on the left.",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 md:gap-6">
                  <span className="text-2xl md:text-3xl font-black leading-none text-secondary">
                    {item.step}
                  </span>
                  <div>
                    <p className="text-xs md:text-xs font-black uppercase text-primary">
                      {item.t}
                    </p>
                    <p className="text-[8px] md:text-[9px] font-bold text-primary/20 mt-1 uppercase leading-tight tracking-wider">
                      {item.d}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Offline Alert - Mobile Optimized */}
          {isOffline && (
            <div className="p-4 md:p-6 bg-red-50 border border-red-100 rounded-[20px] md:rounded-[30px] flex gap-3 md:gap-4 items-center animate-bounce">
              <AlertTriangle className="text-red-500 shrink-0 md:w-6 md:h-6" />
              <p className="text-[8px] md:text-[9px] font-black text-red-600 uppercase tracking-tighter leading-tight">
                CRITICAL: System Engine is Offline. Please restart your backend
                server.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsappStatus;
