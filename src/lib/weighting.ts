const ALL_EXPERTS = [
  "Charlie Munger",
  "Mark Cuban",
  "Jeff Bezos",
  "Steve Jobs",
  "Elon Musk",
  "Ben Horowitz",
  "Peter Thiel",
  "Kevin O'Leary",
  "Gary Vaynerchuk",
  "Marcus Lemonis",
  "Bill Ackman",
] as const;

type WeightMap = Partial<Record<string, number>>;

const WEIGHT_PROFILES: Record<string, WeightMap> = {
  saas: {
    "Jeff Bezos": 1.2,
    "Elon Musk": 1.1,
    "Peter Thiel": 1.2,
    "Ben Horowitz": 1.1,
  },
  software: {
    "Jeff Bezos": 1.2,
    "Elon Musk": 1.1,
    "Peter Thiel": 1.2,
    "Ben Horowitz": 1.1,
  },
  ai: {
    "Jeff Bezos": 1.2,
    "Elon Musk": 1.1,
    "Peter Thiel": 1.2,
    "Ben Horowitz": 1.1,
  },
  "consumer brand": {
    "Steve Jobs": 1.2,
    "Gary Vaynerchuk": 1.2,
    "Mark Cuban": 1.1,
  },
  consumer: {
    "Steve Jobs": 1.2,
    "Gary Vaynerchuk": 1.2,
    "Mark Cuban": 1.1,
  },
  services: {
    "Marcus Lemonis": 1.25,
    "Mark Cuban": 1.1,
    "Kevin O'Leary": 1.0,
  },
  finance: {
    "Bill Ackman": 1.25,
    "Kevin O'Leary": 1.15,
    "Peter Thiel": 1.0,
  },
  fintech: {
    "Bill Ackman": 1.25,
    "Kevin O'Leary": 1.15,
    "Peter Thiel": 1.0,
  },
  marketplace: {
    "Jeff Bezos": 1.2,
    "Peter Thiel": 1.2,
    "Mark Cuban": 1.0,
  },
};

export function getExpertWeights(
  businessType: string
): Array<{ name: string; weight: number }> {
  const normalized = businessType.toLowerCase().trim();

  let profile: WeightMap = {};
  for (const [key, value] of Object.entries(WEIGHT_PROFILES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      profile = value;
      break;
    }
  }

  return ALL_EXPERTS.map((name) => ({
    name,
    weight: profile[name] ?? 1.0,
  }));
}

export function getWeightingInstructions(businessType: string): string {
  const weights = getExpertWeights(businessType);
  const boosted = weights.filter((w) => w.weight > 1.0);

  if (boosted.length === 0) {
    return "All experts should be weighted equally at 1.0x for this general business type.";
  }

  const weightLines = boosted
    .map((w) => `- ${w.name}: ${w.weight}x`)
    .join("\n");

  return `Based on the business type "${businessType}", apply these expert weight multipliers:\n${weightLines}\nAll other experts use the default weight of 1.0x. Reflect these weights in the weightedImportance field of each expert's analysis.`;
}
