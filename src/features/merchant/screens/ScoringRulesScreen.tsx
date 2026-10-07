import { useState, useEffect } from "react";
import {
  ChevronDown,
  Pencil,
  Check,
  RotateCcw,
  Sparkles,
  Clock,
  Shield,
  Gift,
  Save,
  Calculator,
  Sliders,
  Info,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { P, PD, PL, T1, T2, BD, G } from "@/constants/theme";
import { BackBtn, SwitchToggle } from "@/components/common";

interface ScoringRulesScreenProps {
  back: () => void;
}

interface ScoringRulesState {
  reaisBase: number;
  pontosBase: number;
  validadeMeses: string;
  noExpiryDuringCampaign: boolean;
  limitePontos: string;
  limiteCustom: number | "";
  aniversarioBonus: string;
}

const STORAGE_KEY = "cashme_merchant_scoring_rules";

const DEFAULT_RULES: ScoringRulesState = {
  reaisBase: 1.0,
  pontosBase: 1,
  validadeMeses: "12 meses",
  noExpiryDuringCampaign: false,
  limitePontos: "500 pts",
  limiteCustom: "",
  aniversarioBonus: "Dobrada",
};

const VALIDADE_OPTIONS = [
  { value: "3 meses", label: "3 meses" },
  { value: "6 meses", label: "6 meses" },
  { value: "12 meses", label: "12 meses (Recomendado)" },
  { value: "24 meses", label: "24 meses" },
  { value: "Nunca expiram", label: "Nunca expiram" },
];

const LIMITE_OPTIONS = [
  { value: "Sem limite", label: "Sem limite" },
  { value: "100 pts", label: "100 pts" },
  { value: "250 pts", label: "250 pts" },
  { value: "500 pts", label: "500 pts" },
  { value: "1.000 pts", label: "1.000 pts" },
  { value: "2.000 pts", label: "2.000 pts" },
  { value: "Personalizado", label: "Personalizado..." },
];

const ANIVERSARIO_OPTIONS = [
  { value: "Dobrada", label: "Dobrada (2x)" },
  { value: "Triplicada", label: "Triplicada (3x)" },
  { value: "Padrão", label: "Padrão (1x)" },
  { value: "Bônus +100 pts", label: "Bônus fixo (+100 pts)" },
  { value: "Desativado", label: "Desativado" },
];

const QUICK_PRESETS = [
  { reais: 1, pontos: 1, label: "R$ 1 = 1 pt" },
  { reais: 2, pontos: 1, label: "R$ 2 = 1 pt" },
  { reais: 5, pontos: 1, label: "R$ 5 = 1 pt" },
  { reais: 10, pontos: 1, label: "R$ 10 = 1 pt" },
  { reais: 1, pontos: 2, label: "R$ 1 = 2 pts" },
];

export function ScoringRulesScreen({ back }: ScoringRulesScreenProps) {
  // Load persisted rules or defaults
  const [rules, setRules] = useState<ScoringRulesState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_RULES, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error("Erro ao carregar regras salvas:", e);
    }
    return DEFAULT_RULES;
  });

  // Edit mode for conversion rate card
  const [isEditingRatio, setIsEditingRatio] = useState(false);
  const [tempReais, setTempReais] = useState<number>(rules.reaisBase);
  const [tempPontos, setTempPontos] = useState<number>(rules.pontosBase);

  // Simulator test values
  const [testAmount, setTestAmount] = useState<number>(50);
  const [isBirthdayTest, setIsBirthdayTest] = useState<boolean>(false);

  // Saving state animation
  const [isSaving, setIsSaving] = useState(false);

  // Sync temp values when rules change
  useEffect(() => {
    setTempReais(rules.reaisBase);
    setTempPontos(rules.pontosBase);
  }, [rules.reaisBase, rules.pontosBase]);

  const handleSaveRatio = () => {
    if (tempReais <= 0 || tempPontos <= 0) {
      toast.error("Insira valores válidos maiores que zero.");
      return;
    }
    setRules((prev) => ({
      ...prev,
      reaisBase: Number(tempReais),
      pontosBase: Number(tempPontos),
    }));
    setIsEditingRatio(false);
    toast.success("Fator de conversão atualizado!");
  };

  const handleCancelRatio = () => {
    setTempReais(rules.reaisBase);
    setTempPontos(rules.pontosBase);
    setIsEditingRatio(false);
  };

  const handleApplyPreset = (reais: number, pontos: number) => {
    setTempReais(reais);
    setTempPontos(pontos);
    setRules((prev) => ({
      ...prev,
      reaisBase: reais,
      pontosBase: pontos,
    }));
    setIsEditingRatio(false);
    toast.success(`Preset aplicado: R$ ${reais},00 = ${pontos} pt(s)`);
  };

  const handleSaveAll = () => {
    setIsSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
      setTimeout(() => {
        setIsSaving(false);
        toast.success("Regras de pontuação salvas com sucesso! 🎉", {
          description: "As alterações já estão ativas para as próximas compras.",
        });
      }, 350);
    } catch (e) {
      setIsSaving(false);
      toast.error("Erro ao salvar regras.");
    }
  };

  const handleResetDefaults = () => {
    setRules(DEFAULT_RULES);
    setTempReais(DEFAULT_RULES.reaisBase);
    setTempPontos(DEFAULT_RULES.pontosBase);
    setIsEditingRatio(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    toast.info("Regras restauradas para os padrões recomendados.");
  };

  // Calculate simulated points
  const calculateSimulatedPoints = () => {
    const reais = rules.reaisBase > 0 ? rules.reaisBase : 1;
    const pontos = rules.pontosBase > 0 ? rules.pontosBase : 1;

    // Base points
    let base = Math.floor(testAmount / reais) * pontos;

    // Birthday multiplier
    if (isBirthdayTest) {
      if (rules.aniversarioBonus === "Dobrada") {
        base *= 2;
      } else if (rules.aniversarioBonus === "Triplicada") {
        base *= 3;
      } else if (rules.aniversarioBonus === "Bônus +100 pts") {
        base += 100;
      }
    }

    // Limit check
    let limitValue: number | null = null;
    if (rules.limitePontos === "100 pts") limitValue = 100;
    else if (rules.limitePontos === "250 pts") limitValue = 250;
    else if (rules.limitePontos === "500 pts") limitValue = 500;
    else if (rules.limitePontos === "1.000 pts") limitValue = 1000;
    else if (rules.limitePontos === "2.000 pts") limitValue = 2000;
    else if (rules.limitePontos === "Personalizado" && typeof rules.limiteCustom === "number") {
      limitValue = rules.limiteCustom;
    }

    const hitLimit = limitValue !== null && base > limitValue;
    const finalPoints = hitLimit ? limitValue : base;

    return {
      finalPoints,
      hitLimit,
      limitValue,
      rawBase: Math.floor(testAmount / reais) * pontos,
    };
  };

  const simulation = calculateSimulatedPoints();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6 pb-16 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-2xl p-4 sm:p-6 text-white shadow-sm transition-all" style={{ background: `linear-gradient(135deg, ${P}, ${PD})` }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <BackBtn onBack={back} light={false} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white m-0">
                  Regras de pontuação
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold tracking-wide">
                  Ativa
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-100 mt-1 m-0">
                Defina como seus clientes acumulam pontos nas compras da sua loja.
              </p>
            </div>
          </div>

          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium cursor-pointer transition-all border border-white/20 active:scale-95"
            title="Restaurar valores padrão"
          >
            <RotateCcw size={13} />
            <span>Restaurar padrões</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4 sm:space-y-5">
        {/* Card 1: Fator de Conversão Base */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-purple-100/80 shadow-2xs transition-all hover:shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
                  <Sliders size={16} />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-900">
                  Taxa de Conversão Básica
                </span>
              </div>

              {!isEditingRatio ? (
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-purple-900 mt-2 mb-1">
                    A cada R$ {rules.reaisBase.toFixed(2).replace(".", ",")} gasto
                  </h2>
                  <p className="text-sm sm:text-base text-gray-700">
                    o cliente ganha{" "}
                    <strong className="text-purple-800 font-bold">
                      {rules.pontosBase} {rules.pontosBase === 1 ? "ponto" : "pontos"}
                    </strong>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Fator aplicado automaticamente em notas fiscais e compras registradas no caixa.
                  </p>
                </div>
              ) : (
                <div className="mt-3 space-y-4 bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                  <p className="text-xs font-semibold text-purple-900">
                    Ajuste a proporção de Reais para Pontos:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Valor gasto (R$)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
                          R$
                        </span>
                        <input
                          type="number"
                          min="0.10"
                          step="0.50"
                          value={tempReais}
                          onChange={(e) => setTempReais(Math.max(0.1, Number(e.target.value) || 0))}
                          className="w-full pl-9 pr-3 py-2 bg-white rounded-lg border border-gray-300 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Pontos acumulados
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={tempPontos}
                          onChange={(e) => setTempPontos(Math.max(1, Math.floor(Number(e.target.value)) || 1))}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">
                          pts
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Real-time sample calculation */}
                  <div className="text-xs text-purple-800 bg-purple-100/70 p-2.5 rounded-lg flex items-center gap-2">
                    <Info size={14} className="shrink-0 text-purple-700" />
                    <span>
                      Exemplo: Uma compra de R$ 50,00 gerará{" "}
                      <strong>
                        {tempReais > 0 ? Math.floor(50 / tempReais) * tempPontos : 0} pontos
                      </strong>
                      .
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleSaveRatio}
                      className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
                    >
                      Confirmar Proporção
                    </button>
                    <button
                      onClick={handleCancelRatio}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Presets */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                  Atalhos rápidos:
                </span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {QUICK_PRESETS.map((p) => {
                    const isSelected = rules.reaisBase === p.reais && rules.pontosBase === p.pontos;
                    return (
                      <button
                        key={p.label}
                        onClick={() => handleApplyPreset(p.reais, p.pontos)}
                        className={`text-xs px-2.5 py-1 rounded-md font-semibold cursor-pointer transition-all border ${
                          isSelected
                            ? "bg-purple-700 text-white border-purple-700 shadow-2xs"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-purple-50 hover:text-purple-900 hover:border-purple-200"
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {!isEditingRatio && (
              <button
                onClick={() => setIsEditingRatio(true)}
                className="self-start sm:self-center flex items-center gap-1.5 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-2xs active:scale-95 shrink-0"
              >
                <Pencil size={14} />
                <span>Editar</span>
              </button>
            )}
          </div>
        </div>

        {/* Group of Rules Settings */}
        <div className="space-y-2.5 sm:space-y-3">
          {/* Card 2: Pontos válidos por */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/90 shadow-2xs transition-all hover:border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <Clock size={18} />
              </div>
              <div>
                <label htmlFor="validade-select" className="text-sm font-semibold text-gray-900 block cursor-pointer">
                  Pontos válidos por
                </label>
                <p className="text-xs text-gray-500 m-0">
                  Prazo de expiração dos pontos gerados a partir da data de crédito.
                </p>
              </div>
            </div>

            <div className="relative w-full sm:w-auto min-w-[170px] shrink-0">
              <select
                id="validade-select"
                value={rules.validadeMeses}
                onChange={(e) => setRules((prev) => ({ ...prev, validadeMeses: e.target.value }))}
                className="w-full appearance-none bg-gray-50 hover:bg-gray-100/80 border border-gray-200 rounded-xl px-3.5 py-2.5 pr-8 text-xs sm:text-sm font-semibold text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all shadow-2xs"
              >
                {VALIDADE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          {/* Card 3: Pts não expiram durante campanha */}
          <div
            onClick={() => setRules((prev) => ({ ...prev, noExpiryDuringCampaign: !prev.noExpiryDuringCampaign }))}
            className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer shadow-2xs flex items-center justify-between gap-4 ${
              rules.noExpiryDuringCampaign
                ? "border-purple-300 ring-1 ring-purple-100 bg-purple-50/20"
                : "border-gray-200/90 hover:border-purple-200"
            }`}
          >
            <div className="flex items-start sm:items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 m-0">
                  Pts não expiram durante campanha
                </p>
                <p className="text-xs text-gray-500 mt-0.5 m-0">
                  Pausa a contagem regressiva de validade enquanto houver campanha vigente na loja.
                </p>
              </div>
            </div>

            <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
              <SwitchToggle
                on={rules.noExpiryDuringCampaign}
                onChange={() =>
                  setRules((prev) => ({
                    ...prev,
                    noExpiryDuringCampaign: !prev.noExpiryDuringCampaign,
                  }))
                }
              />
            </div>
          </div>

          {/* Card 4: Limite de pontos por compra */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/90 shadow-2xs transition-all hover:border-purple-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <Shield size={18} />
                </div>
                <div>
                  <label htmlFor="limite-select" className="text-sm font-semibold text-gray-900 block cursor-pointer">
                    Limite de pontos por compra
                  </label>
                  <p className="text-xs text-gray-500 m-0">
                    Teto máximo de pontos que podem ser acumulados em uma mesma compra.
                  </p>
                </div>
              </div>

              <div className="relative w-full sm:w-auto min-w-[170px] shrink-0">
                <select
                  id="limite-select"
                  value={rules.limitePontos}
                  onChange={(e) => setRules((prev) => ({ ...prev, limitePontos: e.target.value }))}
                  className="w-full appearance-none bg-gray-50 hover:bg-gray-100/80 border border-gray-200 rounded-xl px-3.5 py-2.5 pr-8 text-xs sm:text-sm font-semibold text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all shadow-2xs"
                >
                  {LIMITE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>

            {/* Custom Limit Input if "Personalizado" is selected */}
            {rules.limitePontos === "Personalizado" && (
              <div className="pt-2 border-t border-gray-100 flex items-center gap-3">
                <span className="text-xs font-medium text-gray-600">Definir teto personalizado:</span>
                <div className="relative w-36">
                  <input
                    type="number"
                    min="10"
                    step="10"
                    placeholder="Ex: 750"
                    value={rules.limiteCustom}
                    onChange={(e) =>
                      setRules((prev) => ({
                        ...prev,
                        limiteCustom: e.target.value ? Number(e.target.value) : "",
                      }))
                    }
                    className="w-full px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-300 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                    pts
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Card 5: Pontuação em aniversários */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/90 shadow-2xs transition-all hover:border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <Gift size={18} />
              </div>
              <div>
                <label htmlFor="aniversario-select" className="text-sm font-semibold text-gray-900 block cursor-pointer">
                  Pontuação em aniversários
                </label>
                <p className="text-xs text-gray-500 m-0">
                  Multiplicador especial para clientes aniversariantes no dia/mês.
                </p>
              </div>
            </div>

            <div className="relative w-full sm:w-auto min-w-[170px] shrink-0">
              <select
                id="aniversario-select"
                value={rules.aniversarioBonus}
                onChange={(e) => setRules((prev) => ({ ...prev, aniversarioBonus: e.target.value }))}
                className="w-full appearance-none bg-gray-50 hover:bg-gray-100/80 border border-gray-200 rounded-xl px-3.5 py-2.5 pr-8 text-xs sm:text-sm font-semibold text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all shadow-2xs"
              >
                {ANIVERSARIO_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 6: Interactive Live Simulator */}
        <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-950 rounded-2xl p-4 sm:p-6 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Calculator size={18} className="text-purple-200" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white m-0">
                    Simulador de Pontuação em Tempo Real
                  </h3>
                  <p className="text-xs text-purple-200 m-0">
                    Veja como suas regras configuradas calculam os pontos de qualquer compra.
                  </p>
                </div>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                Cálculo Dinâmico
              </span>
            </div>

            {/* Test Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-purple-200 mb-1">
                  Valor da compra de teste (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">
                    R$
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="5"
                    value={testAmount}
                    onChange={(e) => setTestAmount(Math.max(1, Number(e.target.value) || 0))}
                    className="w-full pl-9 pr-3 py-2 bg-white text-gray-900 font-bold rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                {/* Fast Chips */}
                <div className="flex gap-1.5 mt-2">
                  {[20, 50, 100, 250, 500].map((val) => (
                    <button
                      key={val}
                      onClick={() => setTestAmount(val)}
                      className={`text-[11px] px-2 py-0.5 rounded-md font-semibold cursor-pointer transition-colors ${
                        testAmount === val
                          ? "bg-white text-purple-900 font-bold"
                          : "bg-white/10 text-purple-100 hover:bg-white/20"
                      }`}
                    >
                      R$ {val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-purple-200 mb-1">
                  Condições especiais de teste
                </label>
                <button
                  type="button"
                  onClick={() => setIsBirthdayTest(!isBirthdayTest)}
                  className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-between text-xs font-semibold cursor-pointer transition-all ${
                    isBirthdayTest
                      ? "bg-purple-600/60 border-purple-400 text-white shadow-2xs"
                      : "bg-white/10 border-white/20 text-purple-200 hover:bg-white/15"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Gift size={15} />
                    Cliente aniversariante?
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-md font-bold ${isBirthdayTest ? "bg-emerald-400 text-purple-950" : "bg-white/20 text-purple-100"}`}>
                    {isBirthdayTest ? "SIM (" + rules.aniversarioBonus + ")" : "NÃO"}
                  </span>
                </button>
                <p className="text-[11px] text-purple-300 mt-2">
                  Validade prevista: <span className="font-semibold text-white">{rules.validadeMeses}</span>
                  {rules.noExpiryDuringCampaign && " (congelada se houver campanha)"}.
                </p>
              </div>
            </div>

            {/* Simulated Outcome Box */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-purple-200 font-semibold block">
                  Pontuação que o cliente acumulará:
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black text-amber-300">
                    +{simulation.finalPoints.toLocaleString("pt-BR")} pts
                  </span>
                  {simulation.hitLimit && (
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/30">
                      Teto atingido (Máx {simulation.limitValue} pts)
                    </span>
                  )}
                </div>
                <p className="text-xs text-purple-200 mt-1 m-0">
                  Base: R$ {testAmount.toFixed(2).replace(".", ",")} ÷ R$ {rules.reaisBase.toFixed(2).replace(".", ",")} × {rules.pontosBase} pt(s)
                  {isBirthdayTest && rules.aniversarioBonus !== "Desativado" && ` + bônus de aniversário (${rules.aniversarioBonus})`}
                </p>
              </div>

              <div className="text-right sm:border-l sm:border-white/20 sm:pl-4 self-stretch sm:self-auto flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                <span className="text-[11px] text-purple-200">Equivalente em compras</span>
                <span className="text-sm font-bold text-white">
                  1 pt a cada R$ {(rules.reaisBase / rules.pontosBase).toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-98 disabled:opacity-70"
            style={{ background: `linear-gradient(135deg, ${P}, ${PD})` }}
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Salvando alterações...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Salvar regras</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
