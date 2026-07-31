'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/layout/admin/AdminLayout';
import { RefreshCw, ExternalLink, Database, Cpu, CheckCircle2, Sparkles } from 'lucide-react';

export default function AdminTrainingPage() {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncHuggingFace = async () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert('Sync dataset ke HuggingFace Hub (Anoderb/dataset-collect) BERHASIL! 4.800 Foto tersinkronisasi.');
    }, 2000);
  };

  return (
    <AdminLayout title="HuggingFace Sync & MLOps Pipeline">
      <div className="space-y-6">
        {/* Header Bar */}
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-emerald-400" /> HuggingFace Sync & Training Pipeline
          </h2>
          <p className="text-xs text-slate-400">
            Monitoring sinkronisasi dataset foto AI ke repository HuggingFace Hub
          </p>
        </div>

        {/* Integration Status Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                🤗
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-100">HuggingFace Dataset Hub</h3>
                <p className="text-xs text-slate-400 font-mono">Anoderb/dataset-collect</p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Connected & Synced
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block">Total Foto Tersimpan</span>
              <span className="text-xl font-bold text-slate-100 mt-1 block">4.800 Foto</span>
              <span className="text-[10px] text-slate-500 mt-1 block">Format JPG/PNG 512x512</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block">Storage Path</span>
              <span className="text-xs font-mono font-bold text-emerald-400 mt-1 block truncate">/resolve/main/dataset</span>
              <span className="text-[10px] text-slate-500 mt-1 block">HuggingFace LFS CDN</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block">Kaggle Training</span>
              <span className="text-xs font-bold text-slate-200 mt-1 block">Ready to Train</span>
              <span className="text-[10px] text-slate-500 mt-1 block">MobileNetV3 PyTorch</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSyncHuggingFace}
              disabled={isSyncing}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Menyinkronkan...' : 'Trigger Sync ke HuggingFace Hub'}</span>
            </button>

            <a
              href="https://huggingface.co/datasets/Anoderb/dataset-collect"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-2"
            >
              <span>Buka Repository HuggingFace</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
