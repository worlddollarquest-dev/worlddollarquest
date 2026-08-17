import React, { useState, useMemo } from 'react';
import { Calculator, DollarSign, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const FreelanceRateCalculator: React.FC = () => {
  const [targetAnnualIncome, setTargetAnnualIncome] = useState(60000);
  const [annualBusinessExpenses, setAnnualBusinessExpenses] = useState(7200); // software, hardware, tax
  const [weeksOffPerYear, setWeeksOffPerYear] = useState(4);
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useState(25); // realistic billable ratio vs admin/marketing
  const [taxAndBufferRate, setTaxAndBufferRate] = useState(25); // percentage for self-employment taxes & emergency fund

  const { completeQuest } = useAuth();
  const { incrementToolUsage } = useApp();
  const { success } = useToast();

  const results = useMemo(() => {
    const totalWeeksWorking = Math.max(1, 52 - weeksOffPerYear);
    const totalBillableHoursAnnual = totalWeeksWorking * billableHoursPerWeek;

    const baseNeed = targetAnnualIncome + annualBusinessExpenses;
    const grossTarget = baseNeed * (1 + taxAndBufferRate / 100);

    const minimumHourlyRate = Math.ceil(grossTarget / totalBillableHoursAnnual);
    const targetDailyRate = minimumHourlyRate * 7;
    const averageProjectRate = minimumHourlyRate * 35; // typical 1-week project
    const monthlyTargetGross = Math.round(grossTarget / 12);

    return {
      totalBillableHoursAnnual,
      grossTarget,
      minimumHourlyRate,
      targetDailyRate,
      averageProjectRate,
      monthlyTargetGross,
    };
  }, [
    targetAnnualIncome,
    annualBusinessExpenses,
    weeksOffPerYear,
    billableHoursPerWeek,
    taxAndBufferRate,
  ]);

  const handleSaveResult = () => {
    completeQuest('quest-04');
    incrementToolUsage('tool-rate-calc');
    success(
      `Saved minimum rate target: $${results.minimumHourlyRate}/hr`,
      'Quest progress updated!'
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders and inputs */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>Target Annual Take-Home Income</span>
              <span className="text-teal-400 font-mono">${targetAnnualIncome.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="20000"
              max="200000"
              step="5000"
              value={targetAnnualIncome}
              onChange={(e) => setTargetAnnualIncome(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>Annual Business & Software Expenses</span>
              <span className="text-teal-400 font-mono">${annualBusinessExpenses.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="25000"
              step="500"
              value={annualBusinessExpenses}
              onChange={(e) => setAnnualBusinessExpenses(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500 mt-0.5">
              Includes subscriptions (Notion, Figma, Hosting, Adobe), hardware, and accounting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Billable Hours / Wk</span>
                <span className="text-teal-400 font-mono">{billableHoursPerWeek} hrs</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                step="1"
                value={billableHoursPerWeek}
                onChange={(e) => setBillableHoursPerWeek(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">
                Note: Non-billable admin & outreach takes 10-15 hrs/wk.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Vacation / Sick Weeks</span>
                <span className="text-teal-400 font-mono">{weeksOffPerYear} wks</span>
              </div>
              <input
                type="range"
                min="2"
                max="12"
                step="1"
                value={weeksOffPerYear}
                onChange={(e) => setWeeksOffPerYear(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>Taxes & Emergency Buffer</span>
              <span className="text-teal-400 font-mono">{taxAndBufferRate}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="40"
              step="1"
              value={taxAndBufferRate}
              onChange={(e) => setTaxAndBufferRate(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Calculated Results Box */}
        <div className="lg:col-span-5 p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Recommended Rate Targets
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-400">Minimum Hourly Rate</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-black text-teal-300 font-mono">
                    ${results.minimumHourlyRate}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">/ hour</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                  <p className="text-[11px] text-slate-400">Day Rate (7h)</p>
                  <p className="text-base font-bold text-slate-100 font-mono mt-0.5">
                    ${results.targetDailyRate}
                  </p>
                </div>
                <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                  <p className="text-[11px] text-slate-400">Monthly Gross</p>
                  <p className="text-base font-bold text-slate-100 font-mono mt-0.5">
                    ${results.monthlyTargetGross}
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                <p className="text-[11px] text-slate-400">Avg 1-Week Project (35h)</p>
                <p className="text-base font-bold text-indigo-300 font-mono mt-0.5">
                  ${results.averageProjectRate}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleSaveResult}
              className="w-full py-2 px-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md shadow-teal-500/10 flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Lock In Rate & Complete Quest</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
