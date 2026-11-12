/** Educational framework, not a validated scoring model or automated classifier. */
export const POLITICAL_DIMENSIONS = [
  {
    id: "economy",
    title: "Economic power",
    question: "Who owns, who decides, and who benefits?",
    start: "Social / worker ownership",
    end: "Private ownership / market allocation",
    description:
      "Distinguish ownership from redistribution. A welfare program within capitalism is not the same proposal as collective ownership of production.",
    evidence: [
      "Ownership and labor rights",
      "Taxes, public services and redistribution",
      "Market regulation and privatization",
    ],
  },
  {
    id: "authority",
    title: "Democracy & authority",
    question: "How is power shared, limited, and challenged?",
    start: "Dispersed power / participation",
    end: "Concentrated power / coercion",
    description:
      "Economic left–right does not tell us whether a movement is democratic or authoritarian. Examine institutions and actions, not just self-description.",
    evidence: [
      "Election integrity and peaceful transfers",
      "Executive power and judicial constraints",
      "Assembly, dissent and state surveillance",
    ],
  },
  {
    id: "rights",
    title: "Rights & belonging",
    question: "Whose rights are protected in practice?",
    start: "Equal rights / pluralism",
    end: "Exclusion / enforced hierarchy",
    description:
      "Keep civil rights and equal treatment visible in their own right. Disaggregate policy, rhetoric and enforcement, with particular attention to groups affected.",
    evidence: [
      "Equal protection and voting access",
      "Religious freedom and minority rights",
      "Immigration, citizenship and discrimination",
    ],
  },
  {
    id: "foreign-policy",
    title: "Foreign policy",
    question: "When, where, and for whom is force used?",
    start: "Diplomacy / restraint",
    end: "Military intervention / coercion",
    description:
      "Foreign policy cannot be reduced to domestic party identity. Review country-specific votes, civilian protection, military aid and changes over time separately.",
    evidence: [
      "War powers and use of force",
      "Arms transfers and military assistance",
      "Human rights, sanctions and diplomacy",
    ],
  },
] as const;

export const POLITICAL_TRADITIONS = [
  {
    name: "Communism",
    description:
      "Envisions a classless society with common ownership. Its theoretical aims and the institutions of historical self-described communist states must be distinguished.",
  },
  {
    name: "Socialism",
    description:
      "A broad family emphasizing social or worker control of economic production. Democratic and authoritarian currents differ substantially.",
  },
  {
    name: "Anarchism",
    description:
      "Opposes coercive hierarchy and state authority. Many currents favor cooperative ownership; it is not simply a point beyond socialism on one line.",
  },
  {
    name: "Social democracy",
    description:
      "Generally combines a market economy with strong social provision, labor protections and redistribution.",
  },
  {
    name: "Liberalism",
    description:
      "Emphasizes individual rights and constitutional government. Economic and social meanings vary by country, period and tradition.",
  },
  {
    name: "Conservatism",
    description:
      "A varied family emphasizing continuity, tradition or established institutions. Its policy commitments depend on the institutions being conserved.",
  },
  {
    name: "Fascism",
    description:
      "An authoritarian, ultranationalist tradition associated with anti-pluralism, hierarchy and suppression of opposition. It is not a synonym for every right-wing policy.",
  },
] as const;

export const EVIDENCE_REQUIREMENTS = [
  {
    title: "Show the receipts",
    body: "Link the specific vote, bill section, statement or primary document. Preserve the date, source and relevant quotation.",
  },
  {
    title: "Make the judgment inspectable",
    body: "State the criteria, time window, missing evidence and counterevidence. Separate documented facts from editorial interpretation.",
  },
  {
    title: "Keep differences visible",
    body: "Assess issues independently. A domestic economic position does not establish a foreign-policy or civil-rights position.",
  },
  {
    title: "Allow correction",
    body: "Record methodology versions and revisions. Missing evidence is unassessed, never a centrist score or a clean bill of health.",
  },
] as const;
