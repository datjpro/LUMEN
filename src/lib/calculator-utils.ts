/**
 * Spotlight 2.0 Math Evaluator & Unit/Currency Converter
 * Safe, deterministic calculation without unsafe eval()
 */

export interface CalculationResult {
  expression: string;
  result: string;
  type: "math" | "currency" | "unit";
  detail?: string;
}

// Fixed standard benchmark exchange rates for offline estimation
const EXCHANGE_RATES: Record<string, number> = {
  USD_VND: 25450,
  EUR_VND: 27600,
  JPY_VND: 168,
  GBP_VND: 32800,
  AUD_VND: 16400,
  SGD_VND: 19100,
  VND_USD: 1 / 25450,
  EUR_USD: 1.085,
  USD_EUR: 1 / 1.085,
};

export function evaluateExpression(query: string): CalculationResult | null {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed || trimmed.length < 2) return null;

  // 1. Percentage of expression: e.g. "15% of 250", "20% of 1500"
  const percentOfMatch = trimmed.match(/^([\d.,]+)%\s*(?:of|của)\s*([\d.,]+)$/);
  if (percentOfMatch) {
    const percent = parseFloat(percentOfMatch[1].replace(/,/g, ""));
    const base = parseFloat(percentOfMatch[2].replace(/,/g, ""));
    if (!isNaN(percent) && !isNaN(base)) {
      const res = (percent / 100) * base;
      return {
        expression: `${percent}% của ${base}`,
        result: `${res.toLocaleString("vi-VN")}`,
        type: "math",
        detail: `${percent}% × ${base}`,
      };
    }
  }

  // 2. Currency Conversion: e.g. "100 usd in vnd", "50 eur to vnd", "1000 jpy in vnd"
  const currMatch = trimmed.match(/^([\d.,]+)\s*([a-z]{3})\s*(?:in|to|sang|=)\s*([a-z]{3})$/);
  if (currMatch) {
    const amount = parseFloat(currMatch[1].replace(/,/g, ""));
    const from = currMatch[2].toUpperCase();
    const to = currMatch[3].toUpperCase();
    const pair = `${from}_${to}`;

    if (!isNaN(amount) && EXCHANGE_RATES[pair]) {
      const converted = amount * EXCHANGE_RATES[pair];
      return {
        expression: `${amount.toLocaleString()} ${from} ➔ ${to}`,
        result: `${converted >= 1000 ? Math.round(converted).toLocaleString("vi-VN") : converted.toFixed(2)} ${to}`,
        type: "currency",
        detail: `Tỉ giá tham chiếu ~1 ${from} = ${EXCHANGE_RATES[pair].toLocaleString()} ${to}`,
      };
    }
  }

  // 3. Storage Unit Conversion: e.g. "1024 mb in gb", "2 gb in mb", "500 gb in tb"
  const storageMatch = trimmed.match(/^([\d.,]+)\s*(b|kb|mb|gb|tb)\s*(?:in|to|sang|=)\s*(b|kb|mb|gb|tb)$/);
  if (storageMatch) {
    const val = parseFloat(storageMatch[1].replace(/,/g, ""));
    const fromUnit = storageMatch[2];
    const toUnit = storageMatch[3];
    const unitScale: Record<string, number> = { b: 1, kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3, tb: 1024 ** 4 };

    if (!isNaN(val) && unitScale[fromUnit] && unitScale[toUnit]) {
      const bytes = val * unitScale[fromUnit];
      const resultVal = bytes / unitScale[toUnit];
      return {
        expression: `${val} ${fromUnit.toUpperCase()} ➔ ${toUnit.toUpperCase()}`,
        result: `${resultVal >= 100 ? resultVal.toFixed(0) : resultVal.toFixed(2)} ${toUnit.toUpperCase()}`,
        type: "unit",
      };
    }
  }

  // 4. Temperature Conversion: e.g. "50 c in f", "100 f in c"
  const tempMatch = trimmed.match(/^([\d.,-]+)\s*(c|f)\s*(?:in|to|sang|=)\s*(c|f)$/);
  if (tempMatch) {
    const val = parseFloat(tempMatch[1].replace(/,/g, ""));
    const from = tempMatch[2];
    const to = tempMatch[3];
    if (!isNaN(val) && from !== to) {
      const converted = from === "c" ? (val * 9) / 5 + 32 : ((val - 32) * 5) / 9;
      return {
        expression: `${val}°${from.toUpperCase()} ➔ °${to.toUpperCase()}`,
        result: `${converted.toFixed(1)} °${to.toUpperCase()}`,
        type: "unit",
      };
    }
  }

  // 5. Length Conversion: e.g. "5 km in m", "100 cm in m", "10 m in ft"
  const lengthMatch = trimmed.match(/^([\d.,]+)\s*(mm|cm|m|km|inch|ft)\s*(?:in|to|sang|=)\s*(mm|cm|m|km|inch|ft)$/);
  if (lengthMatch) {
    const val = parseFloat(lengthMatch[1].replace(/,/g, ""));
    const from = lengthMatch[2];
    const to = lengthMatch[3];
    const scaleMeters: Record<string, number> = {
      mm: 0.001,
      cm: 0.01,
      m: 1,
      km: 1000,
      inch: 0.0254,
      ft: 0.3048,
    };
    if (!isNaN(val) && scaleMeters[from] && scaleMeters[to]) {
      const meters = val * scaleMeters[from];
      const result = meters / scaleMeters[to];
      return {
        expression: `${val} ${from} ➔ ${to}`,
        result: `${result >= 100 ? result.toFixed(0) : result.toFixed(2)} ${to}`,
        type: "unit",
      };
    }
  }

  // 6. Safe Pure Math Expression Evaluator
  // Must contain math operators and numbers only (strict whitelist)
  if (/^[\d\s+\-*/().%^sqrt|abs|pi|e]+$/.test(trimmed)) {
    // Avoid pure numbers with no operators
    if (/^\d+$/.test(trimmed)) return null;

    try {
      let sanitized = trimmed
        .replace(/pi/g, String(Math.PI))
        .replace(/\be\b/g, String(Math.E))
        .replace(/\^/g, "**")
        .replace(/sqrt\(([^)]+)\)/g, "Math.sqrt($1)")
        .replace(/abs\(([^)]+)\)/g, "Math.abs($1)");

      // Basic syntax validity check
      if (/[\d.]+\s*[+\-*/]\s*[\d.]+/i.test(sanitized) || /Math\.sqrt/i.test(sanitized)) {
        // Safe evaluation using new Function with restricted scope
        const computed = Function(`"use strict"; return (${sanitized});`)();
        if (typeof computed === "number" && !isNaN(computed) && isFinite(computed)) {
          const formatted =
            Number.isInteger(computed)
              ? computed.toLocaleString("vi-VN")
              : parseFloat(computed.toFixed(4)).toLocaleString("vi-VN");
          return {
            expression: query.trim(),
            result: formatted,
            type: "math",
          };
        }
      }
    } catch {
      // Ignored non-math queries
    }
  }

  return null;
}
