import React, { useState } from 'react';
import { Download, QrCode, Sparkles, Copy, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useApp } from '../../context/AppContext';

export const QRCodeGenerator: React.FC = () => {
  const [text, setText] = useState('https://worlddollar.quest');
  const [size, setSize] = useState(240);
  const [darkColor, setDarkColor] = useState('#0f172a');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [copied, setCopied] = useState(false);

  const { success } = useToast();
  const { incrementToolUsage } = useApp();

  // Generate dynamic QR code URL via fast secure SVG endpoint
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    text
  )}&color=${darkColor.replace('#', '')}&bgcolor=${lightColor.replace('#', '')}&margin=2`;

  const handleDownload = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `worlddollar-qr-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      incrementToolUsage('tool-qr-code');
      success('QR Code downloaded successfully!');
    } catch {
      window.open(qrCodeUrl, '_blank');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrCodeUrl);
    setCopied(true);
    success('QR image link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      {/* Controls */}
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Target URL or Text Content
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:border-teal-400 focus:outline-none"
            placeholder="https://yourportfolio.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Code Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={darkColor}
                onChange={(e) => setDarkColor(e.target.value)}
                className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-400">{darkColor}</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={lightColor}
                onChange={(e) => setLightColor(e.target.value)}
                className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-400">{lightColor}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Resolution ({size}x{size} px)
          </label>
          <input
            type="range"
            min="150"
            max="400"
            step="10"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full accent-teal-400 cursor-pointer"
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-bold transition-colors shadow-md shadow-teal-500/10"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Direct Link</span>
          </button>
        </div>
      </div>

      {/* Preview Card */}
      <div className="flex flex-col items-center justify-center p-6 bg-slate-950 border border-slate-800 rounded-2xl">
        <div className="p-3 bg-white rounded-xl shadow-lg inline-block">
          <img
            src={qrCodeUrl}
            alt="Generated QR Code"
            className="w-48 h-48 object-contain rounded"
            crossOrigin="anonymous"
          />
        </div>
        <p className="text-xs text-slate-400 mt-4 text-center">
          High-contrast scan preview for portfolio & client links
        </p>
      </div>
    </div>
  );
};
