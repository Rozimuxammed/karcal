import { useState, useId } from "react";
import {
  Plus,
  Trash2,
  Ruler,
  Package,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { RodEntry, Pricing } from "@/types";
import { calcRodResult, calcSummary } from "@/lib/calculator";

const DEFAULT_PRICING: Pricing = {
  rodPerMeter: 10000,
  earPrice: 5000,
  bracketPrice: 7000,
};

function fmt(n: number) {
  return `${Math.round(n).toLocaleString("uz-UZ")} so'm`;
}

function fmtM(n: number) {
  return `${n.toFixed(2)} m`;
}

let counter = 1;
function newRod(length = 0): RodEntry {
  return { id: String(counter++), length };
}

export default function App() {
  const [rods, setRods] = useState<RodEntry[]>([newRod()]);
  const [pricing, setPricing] = useState<Pricing>(DEFAULT_PRICING);
  const [pricingOpen, setPricingOpen] = useState(false);
  const formId = useId();

  const results = rods
    .filter((r) => r.length > 0)
    .map((r) => calcRodResult(r, pricing));

  const summary = calcSummary(results, pricing);

  function updateLength(id: string, value: string) {
    const num = parseFloat(value);
    setRods((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, length: isNaN(num) ? 0 : num } : r,
      ),
    );
  }

  function addRod() {
    setRods((prev) => [...prev, newRod()]);
  }

  function removeRod(id: string) {
    setRods((prev) => prev.filter((r) => r.id !== id));
  }

  function updatePricing(field: keyof Pricing, value: string) {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      setPricing((prev) => ({ ...prev, [field]: num }));
    }
  }

  const hasResults = results.length > 0;

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-teal-700 flex items-center justify-center shadow-sm">
              <Ruler className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-stone-900 leading-tight">
                Karnizlar kalkulyatori
              </h1>
              <p className="text-xs text-stone-500 leading-tight mt-1">
                Qismlar va narxlarni hisoblash
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Pricing Config */}
        <Card className="border-stone-200 shadow-sm bg-white text-black">
          <button
            type="button"
            onClick={() => setPricingOpen((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-5"
          >
            <div className="flex items-center gap-3">
              <DollarSign className="w-4 h-4 text-teal-700" />
              <span className="font-medium text-stone-800">
                Narxlar sozlamasi
              </span>
            </div>
            {pricingOpen ? (
              <ChevronUp className="w-4 h-4 text-stone-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-stone-400" />
            )}
          </button>
          {pricingOpen && (
            <>
              <Separator />
              <CardContent className="pt-6 pb-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor={`${formId}-rod`}
                      className="text-sm text-stone-700"
                    >
                      Rulon (metriga)
                    </Label>
                    <div className="relative">
                      <Input
                        id={`${formId}-rod`}
                        type="number"
                        min="0"
                        step="1000"
                        defaultValue={pricing.rodPerMeter}
                        onChange={(e) =>
                          updatePricing("rodPerMeter", e.target.value)
                        }
                        className="pr-16"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-500 font-medium">
                        so'm
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor={`${formId}-ear`}
                      className="text-sm text-stone-700"
                    >
                      Quloqcha (dona)
                    </Label>
                    <div className="relative">
                      <Input
                        id={`${formId}-ear`}
                        type="number"
                        min="0"
                        step="1000"
                        defaultValue={pricing.earPrice}
                        onChange={(e) =>
                          updatePricing("earPrice", e.target.value)
                        }
                        className="pr-16"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-500 font-medium">
                        so'm
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor={`${formId}-bracket`}
                      className="text-sm text-stone-700"
                    >
                      Kronshteyn (dona)
                    </Label>
                    <div className="relative">
                      <Input
                        id={`${formId}-bracket`}
                        type="number"
                        min="0"
                        step="1000"
                        defaultValue={pricing.bracketPrice}
                        onChange={(e) =>
                          updatePricing("bracketPrice", e.target.value)
                        }
                        className="pr-16"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-500 font-medium">
                        so'm
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-6 text-xs text-stone-500 leading-relaxed">
                  Qoida: 2 m gacha bo'lgan karnizga 2 ta kronshteyn, har
                  qo'shimcha 1,5 m uchun +1 ta. Quloqchalar har doim karnizga 2
                  ta.
                </p>
              </CardContent>
            </>
          )}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white border border-stone-200 rounded-lg shadow-sm p-6">
          {/* Left: Rod entry */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-stone-200 shadow-sm bg-white text-black">
              <CardHeader className="pb-4 pt-6 px-6">
                <CardTitle className="text-base text-stone-800 flex items-center gap-3">
                  <Ruler className="w-4 h-4 text-teal-700" />
                  Karniz o'lchamlari
                </CardTitle>
                <p className="text-xs text-stone-500 mt-1">
                  Har bir karnizning uzunligini metrda kiriting.
                </p>
              </CardHeader>
              <CardContent className="space-y-5 px-6 pb-6">
                {rods.map((rod, idx) => (
                  <RodRow
                    key={rod.id}
                    rod={rod}
                    index={idx}
                    result={results.find((r) => r.id === rod.id)}
                    onLengthChange={(v) => updateLength(rod.id, v)}
                    onRemove={
                      rods.length > 1 ? () => removeRod(rod.id) : undefined
                    }
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRod}
                  className="w-full border-dashed border-stone-300 text-stone-600 hover:border-teal-500 hover:text-teal-800 hover:bg-teal-50 transition-colors mt-2 h-10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Karniz qo'shish
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right: Summary */}
          <div className="space-y-4">
            <SummaryCard summary={summary} hasResults={hasResults} />
          </div>
        </div>

        {/* Detail table */}
        {hasResults && (
          <Card className="border-stone-200 shadow-sm overflow-hidden bg-white text-black">
            <CardHeader className="pb-4 pt-6 px-6">
              <CardTitle className="text-base text-stone-800 flex items-center gap-3">
                <Package className="w-4 h-4 text-teal-700" />
                Karnizlar bo'yicha tafsilot
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-100 border-y border-stone-200">
                    <th className="text-left px-6 py-4 font-medium text-stone-600 w-12">
                      #
                    </th>
                    <th className="text-right px-4 py-4 font-medium text-stone-600">
                      Uzunlik
                    </th>
                    <th className="text-right px-4 py-4 font-medium text-stone-600">
                      Quloqchalar
                    </th>
                    <th className="text-right px-4 py-4 font-medium text-stone-600">
                      Kronshteynlar
                    </th>
                    <th className="text-right px-4 py-4 font-medium text-stone-600">
                      Karniz narxi
                    </th>
                    <th className="text-right px-4 py-4 font-medium text-stone-600">
                      Qismlar narxi
                    </th>
                    <th className="text-right px-6 py-4 font-medium text-stone-600">
                      Jami
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {results.map((r, idx) => (
                    <tr
                      key={r.id}
                      className="hover:bg-stone-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-stone-500 font-mono">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-4 text-right font-medium text-stone-800">
                        {fmtM(r.length)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold">
                          {r.ears}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                          {r.brackets}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right text-stone-700">
                        {fmt(r.rodCost)}
                      </td>
                      <td className="px-4 py-4 text-right text-stone-700">
                        {fmt(r.earsCost + r.bracketsCost)}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-stone-900">
                        {fmt(r.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-teal-50 border-t-2 border-teal-200">
                    <td
                      className="px-6 py-4 font-semibold text-teal-900"
                      colSpan={2}
                    >
                      JAMI
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-sky-800">
                      {summary.totalEars}
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-amber-800">
                      {summary.totalBrackets}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-stone-800">
                      {fmt(summary.totalRodCost)}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-stone-800">
                      {fmt(summary.totalEarsCost + summary.totalBracketsCost)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-stone-900 text-base">
                      {fmt(summary.grandTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

/* ---- Sub-components ---- */

interface RodRowProps {
  rod: RodEntry;
  index: number;
  result: ReturnType<typeof calcRodResult> | undefined;
  onLengthChange: (v: string) => void;
  onRemove?: () => void;
}

function RodRow({ rod, index, result, onLengthChange, onRemove }: RodRowProps) {
  return (
    <div className="flex items-center gap-4 group">
      <span className="w-6 text-center text-xs text-stone-500 font-mono shrink-0">
        {index + 1}
      </span>
      <div className="relative flex-1">
        <Input
          type="number"
          min="0.1"
          step="0.1"
          placeholder="0.00"
          defaultValue={rod.length > 0 ? rod.length : ""}
          onChange={(e) => onLengthChange(e.target.value)}
          className="pr-10"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-500 font-medium">
          m
        </span>
      </div>
      {result ? (
        <div className="flex items-center gap-3 shrink-0">
          <Badge
            variant="secondary"
            className="bg-sky-100 text-sky-800 border-sky-200 text-xs px-3 py-1 gap-1.5"
          >
            <span className="opacity-70">Quloqcha</span> {result.ears}
          </Badge>
          <Badge
            variant="secondary"
            className="bg-amber-100 text-amber-800 border-amber-200 text-xs px-3 py-1 gap-1.5"
          >
            <span className="opacity-70">Kronshteyn</span> {result.brackets}
          </Badge>
        </div>
      ) : (
        <div className="w-[190px] shrink-0" />
      )}
      <button
        type="button"
        onClick={onRemove}
        disabled={!onRemove}
        className="w-9 h-9 flex items-center justify-center rounded-md text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-0 disabled:pointer-events-none shrink-0"
        aria-label="Karnizni o'chirish"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

interface SummaryCardProps {
  summary: ReturnType<typeof calcSummary>;
  hasResults: boolean;
}

function SummaryCard({ summary, hasResults }: SummaryCardProps) {
  return (
    <Card className="border-stone-200 shadow-sm sticky top-28 bg-white text-black">
      <CardHeader className="pb-4 pt-6 px-6">
        <CardTitle className="text-base text-stone-800">
          Buyurtma xulosasi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6">
        {!hasResults ? (
          <p className="text-sm text-stone-500 text-center py-6">
            Xulosa uchun karniz uzunliklarini kiriting.
          </p>
        ) : (
          <>
            <div className="space-y-3">
              <p className="text-xs font-medium text-stone-600 uppercase tracking-wide">
                O'lchamlar
              </p>
              <SummaryRow
                label="Umumiy uzunlik"
                value={`${summary.totalLength.toFixed(2)} m`}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <p className="text-xs font-medium text-stone-600 uppercase tracking-wide">
                Qismlar
              </p>
              <SummaryRow
                label="Quloqchalar"
                value={String(summary.totalEars)}
                highlight="sky"
              />
              <SummaryRow
                label="Kronshteynlar"
                value={String(summary.totalBrackets)}
                highlight="amber"
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <p className="text-xs font-medium text-stone-600 uppercase tracking-wide">
                Narx
              </p>
              <SummaryRow label="Rulonlar" value={fmt(summary.totalRodCost)} />
              <SummaryRow
                label="Quloqchalar"
                value={fmt(summary.totalEarsCost)}
              />
              <SummaryRow
                label="Kronshteynlar"
                value={fmt(summary.totalBracketsCost)}
              />
            </div>

            <Separator />

            <div className="rounded-lg bg-teal-800 px-5 py-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-teal-50">
                Jami summa
              </span>
              <span className="text-lg font-bold text-white">
                {fmt(summary.grandTotal)}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "sky" | "amber";
}) {
  const valueClass =
    highlight === "sky"
      ? "font-bold text-sky-800"
      : highlight === "amber"
        ? "font-bold text-amber-800"
        : "font-medium text-stone-900";

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-stone-600">{label}</span>
      <span className={`text-sm ${valueClass}`}>{value}</span>
    </div>
  );
}
