import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  BookOpen, Play, CheckCircle2, Crown, Award, Flame, Search,
  ChevronRight, ChevronDown, Sparkles, Plus, Upload, Download,
  Trash2, Eye, Code, HelpCircle, RotateCcw, ArrowLeft,
  PenTool, Copy, Check, Video, Users, Globe, Lock, Cloud,
  RefreshCw, UserPlus, LogIn, Shield
} from 'lucide-react';

// ============================================================================
// OPTIONAL: Paste your free Supabase URL & Anon Key here so EVERY visitor on
// your Vercel link automatically connects to the cloud without typing keys!
// ============================================================================
const DEFAULT_SUPABASE_URL = ""; 
const DEFAULT_SUPABASE_ANON_KEY = "";

// ============================================================================
// 1. PURE CONTENT SCHEMA (Vaaler / Artin M 373K Outline + M 367K + M 365C)
// ============================================================================
const INITIAL_COURSES = [
  {
    id: "m373k",
    code: "M 373K",
    title: "Algebraic Structures I (Vaaler / Artin)",
    category: "Abstract Algebra",
    syllabus: "Artin's Algebra / Vaaler UT Austin Syllabus: Groups, Subgroups & Cosets; Homomorphisms, Quotients & Group Actions; Rings, Ideals & Factor Rings; Fields, Algebraic Extensions & Finite Fields.",
    units: [
      {
        id: "m373k-u1",
        title: "Unit 1: Groups, Subgroups, Cyclic Groups & Lagrange's Theorem",
        description: "Laws of composition, groups, subgroups of $(\\mathbb{Z}, +)$, cyclic groups, equivalence relations, cosets, and Lagrange's counting formula (Artin Ch. 2).",
        lessons: [
          {
            id: "m373k-l1",
            title: "Subgroups of Z, Cosets & Lagrange's Theorem",
            duration: "14:20",
            videoUrl: "",
            theorem: "Theorem (Lagrange, Artin 2.8): Let $G$ be a finite group and $H \\le G$ a subgroup. Then $|G| = [G:H] \\cdot |H|$, so the order of $H$ divides the order of $G$.",
            steps: [
              {
                time: "00:00",
                label: "Congruence Modulo a Subgroup H",
                math: "a \\equiv b \\pmod H \\iff a^{-1}b \\in H",
                caption: "Define the relation $a \\sim b$ on $G$ by $a^{-1}b \\in H$. By the subgroup axioms for $H$, $\\sim$ is reflexive ($a^{-1}a = 1 \\in H$), symmetric ($(a^{-1}b)^{-1} = b^{-1}a \\in H$), and transitive ($a^{-1}b \\cdot b^{-1}c = a^{-1}c \\in H$)."
              },
              {
                time: "04:10",
                label: "Equivalence Classes are Left Cosets aH",
                math: "[a] = \\{g \\in G : a^{-1}g \\in H\\} = \\{ah : h \\in H\\} = aH",
                caption: "Because equivalence classes partition $G$, the group $G$ is the disjoint union of its distinct left cosets $a_1 H \\sqcup a_2 H \\sqcup \\dots \\sqcup a_k H$, where $k = [G:H]$ is the index of $H$ in $G$."
              },
              {
                time: "08:30",
                label: "Left Translation Bijection",
                math: "\\Phi_a : H \\to aH, \\quad \\Phi_a(h) = ah",
                caption: "For each fixed $a \\in G$, the map $\\Phi_a$ is surjective by definition of $aH$ and injective by left cancellation in $G$ ($ah_1 = ah_2 \\implies h_1 = h_2$). Thus $\\Phi_a$ is a bijection and $|aH| = |H|$."
              },
              {
                time: "12:00",
                label: "Counting Formula Conclusion",
                math: "|G| = \\sum_{i=1}^{[G:H]} |a_i H| = [G : H] \\cdot |H| \\quad \\blacksquare",
                caption: "Since $G$ is partitioned into $[G:H]$ disjoint cosets each of cardinality $|H|$, we obtain $|G| = [G:H] \\cdot |H|$."
              }
            ],
            exercises: [
              {
                id: "m373k-ex1",
                type: "mcq",
                question: "Let $G$ be a finite group and let $H, K \\le G$ be subgroups with $|H| = 12$ and $|K| = 35$. What is $|H \\cap K|$?",
                options: [
                  "$1$ (the trivial subgroup $\\{1\\}$)",
                  "$6$",
                  "$5$",
                  "$12$"
                ],
                correctIndex: 0,
                optionExplanations: [
                  "Correct! $H \\cap K$ is a subgroup of both $H$ and $K$. By Lagrange's Theorem, $|H \\cap K|$ divides both $12$ and $35$. Since $\\gcd(12, 35) = 1$, $|H \\cap K| = 1$.",
                  "Incorrect: $6$ divides $12$, but $6$ does not divide $|K| = 35$, violating Lagrange's Theorem applied to $H \\cap K \\le K$.",
                  "Incorrect: $5$ divides $35$, but $5$ does not divide $|H| = 12$.",
                  "Incorrect: $12$ does not divide $|K| = 35$."
                ],
                hints: [
                  "Show that the intersection $H \\cap K$ is a subgroup of $H$ and also a subgroup of $K$.",
                  "Apply Lagrange's Theorem to $H \\cap K \\le H$ and $H \\cap K \\le K$.",
                  "What positive integer divides both $12$ and $35$?"
                ]
              },
              {
                id: "m373k-ex2",
                type: "proof",
                question: "Prove that every group $G$ of prime order $p$ is cyclic, and that any non-identity element $a \\in G \\setminus \\{1\\}$ generates $G$.",
                hints: [
                  "Let $a \\in G$ with $a \\neq 1$, and consider the cyclic subgroup $H = \\langle a \\rangle \\le G$.",
                  "Apply Lagrange's Theorem to relate $|H|$ and $|G| = p$.",
                  "Use the definition of a prime number and the fact that $a \\neq 1$ implies $|H| > 1$."
                ],
                rubric: [
                  "Define the cyclic subgroup $H = \\langle a \\rangle \\le G$ for an arbitrary $a \\in G$ with $a \\neq 1$.",
                  "Invoke Lagrange's Theorem to state that $|H|$ divides $|G| = p$.",
                  "Since $p$ is prime, deduce that $|H| \\in \\{1, p\\}$, and rule out $|H| = 1$ because $a \\neq 1$ and $1, a \\in H$.",
                  "Conclude that $|H| = p = |G|$, and since $H \\subseteq G$ is finite, $G = \\langle a \\rangle$ is cyclic."
                ],
                modelProof: "Let $G$ be a group of prime order $p$, and let $a \\in G$ with $a \\neq 1$. Consider the cyclic subgroup $H = \\langle a \\rangle \\le G$. Because $1 \\in H$ and $a \\in H$ are distinct, $|H| \\ge 2$. By Lagrange's Theorem, $|H|$ divides $|G| = p$. Since $p$ is prime, its only positive divisors are $1$ and $p$. Because $|H| \\ge 2$, we must have $|H| = p = |G|$. Since $H \\subseteq G$ and both are finite sets of cardinality $p$, we conclude $G = H = \\langle a \\rangle$, so $G$ is cyclic. $\\blacksquare$"
              }
            ]
          }
        ]
      },
      {
        id: "m373k-u2",
        title: "Unit 2: Homomorphisms, Normal Subgroups & Quotient Groups",
        description: "Group homomorphisms, kernels, normal subgroups, quotient group construction, and the First Isomorphism Theorem (Artin Ch. 2 & Ch. 6).",
        lessons: [
          {
            id: "m373k-l2",
            title: "The First Isomorphism Theorem for Groups",
            duration: "16:10",
            videoUrl: "",
            theorem: "Theorem (First Isomorphism Theorem): Let $\\varphi: G \\to G'$ be a group homomorphism with kernel $K = \\ker(\\varphi)$. Then $K \\trianglelefteq G$ and the canonical map $\\bar{\\varphi}: G/K \\to \\text{im}(\\varphi)$ given by $\\bar{\\varphi}(gK) = \\varphi(g)$ is an isomorphism.",
            steps: [
              {
                time: "00:00",
                label: "Well-Definedness & Injectivity of the Induced Map",
                math: "g_1 K = g_2 K \\iff g_2^{-1}g_1 \\in K = \\ker(\\varphi) \\iff \\varphi(g_1) = \\varphi(g_2)",
                caption: "The forward implication ($\\implies$) shows $\\bar{\\varphi}(gK) = \\varphi(g)$ is independent of the coset representative $g$. The reverse implication ($\\impliedby$) shows $\\bar{\\varphi}$ is injective."
              },
              {
                time: "06:30",
                label: "Homomorphism Property on Quotient Cosets",
                math: "\\bar{\\varphi}((g_1 K)(g_2 K)) = \\bar{\\varphi}(g_1 g_2 K) = \\varphi(g_1 g_2) = \\varphi(g_1)\\varphi(g_2) = \\bar{\\varphi}(g_1 K)\\bar{\\varphi}(g_2 K)",
                caption: "Because $K \\trianglelefteq G$, coset multiplication $(g_1 K)(g_2 K) = g_1 g_2 K$ is well-defined, and $\\bar{\\varphi}$ preserves the operation."
              },
              {
                time: "12:15",
                label: "Surjectivity onto the Image",
                math: "\\forall y \\in \\text{im}(\\varphi), \\; \\exists g \\in G \\text{ with } \\varphi(g) = y \\implies \\bar{\\varphi}(gK) = y \\quad \\blacksquare",
                caption: "Thus $\\bar{\\varphi}: G/\\ker(\\varphi) \\to \\text{im}(\\varphi)$ is a bijective homomorphism, hence an isomorphism."
              }
            ],
            exercises: [
              {
                id: "m373k-ex3",
                type: "mcq",
                question: "Why does the converse of Lagrange's Theorem fail for the alternating group $A_4$ (which has order $12$)?",
                options: [
                  "$A_4$ has no subgroup of order $6$, even though $6$ divides $12$",
                  "$A_4$ has no subgroup of order $4$",
                  "$A_4$ is abelian of order $p^2$",
                  "$A_4$ has no subgroup of order $3$"
                ],
                correctIndex: 0,
                optionExplanations: [
                  "Correct! Although $6 \\mid 12$, any subgroup $H \\le A_4$ of order $6$ would have index $[A_4:H]=2$ and thus be normal, containing all $8$ of the $3$-cycles in $A_4$, which is impossible since $8 > 6$.",
                  "Incorrect: The Klein four-group $V_4 = \\{1, (12)(34), (13)(24), (14)(23)\\}$ is a normal subgroup of $A_4$ of order $4$.",
                  "Incorrect: $A_4$ is non-abelian of order $12$, not $p^2$.",
                  "Incorrect: Any $3$-cycle $\\langle (123) \\rangle$ generates a subgroup of order $3$ in $A_4$."
                ],
                hints: [
                  "If $H \\le A_4$ had order $6$, what would its index $[A_4 : H]$ be?",
                  "Every subgroup of index $2$ is normal, so $A_4 / H$ would have order $2$.",
                  "How many elements of order $3$ ($3$-cycles) exist in $A_4$, and where must they map in a group of order $2$?"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "m373k-u3",
        title: "Unit 3: Rings, Ideals, Homomorphisms & Quotient Rings",
        description: "Commutative rings, integral domains, polynomial rings $F[x]$, ideals, factor rings $R/I$, and prime vs. maximal ideals (Artin Ch. 11).",
        lessons: []
      },
      {
        id: "m373k-u4",
        title: "Unit 4: Fields, Irreducible Polynomials & Algebraic Extensions",
        description: "Field extensions, minimal polynomials, adjoining roots $F[x]/(p(x))$, degree multiplicativity $[K:F]$, and finite fields $\\mathbb{F}_{p^n}$ (Artin Ch. 15).",
        lessons: []
      }
    ]
  },
  {
    id: "m367k",
    code: "M 367K",
    title: "Topology I",
    category: "Point-Set & Algebraic Topology",
    syllabus: "Munkres Topology: Topological Spaces, Bases, Subspace & Product Topologies, Connectedness, Compactness, Separation Axioms.",
    units: [
      {
        id: "m367k-u1",
        title: "Unit 1: Topological Spaces, Bases & Compact-Hausdorff Theorem",
        description: "Open sets, bases, Sorgenfrey line $\\mathbb{R}_\\ell$, compactness, and Hausdorff separation.",
        lessons: [
          {
            id: "m367k-l1",
            title: "Continuous Bijection from Compact to Hausdorff is a Homeomorphism",
            duration: "13:45",
            videoUrl: "",
            theorem: "Theorem (Munkres 26.6): Let $f: X \\to Y$ be a continuous bijection where $X$ is compact and $Y$ is Hausdorff. Then $f$ is a homeomorphism.",
            steps: [
              {
                time: "00:00",
                label: "Closed Map Criterion for Bijections",
                math: "C \\subseteq X \\text{ closed} \\implies (f^{-1})^{-1}(C) = f(C) \\subseteq Y \\text{ closed}",
                caption: "To prove $f^{-1}: Y \\to X$ is continuous, it suffices to prove that for every closed subset $C \\subseteq X$, its image $f(C)$ is closed in $Y$."
              },
              {
                time: "06:00",
                label: "Chain of Compactness and Hausdorff Properties",
                math: "C \\text{ closed in compact } X \\implies C \\text{ compact} \\implies f(C) \\text{ compact in Hausdorff } Y \\implies f(C) \\text{ closed} \\quad \\blacksquare",
                caption: "Every closed subset of a compact space is compact; the continuous image of a compact set is compact; and every compact subset of a Hausdorff space is closed."
              }
            ],
            exercises: []
          }
        ]
      }
    ]
  },
  {
    id: "m365c",
    code: "M 365C",
    title: "Real Analysis I",
    category: "Analysis & Measure Theory",
    syllabus: "Complete metric spaces, Banach contraction mapping theorem, compactness, uniform convergence, and Arzelà-Ascoli.",
    units: []
  }
];

// ============================================================================
// 2. KATEX MATH RENDERER
// ============================================================================
function MathText({ text, block = false, className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let timer = null;
    const renderMath = () => {
      const el = containerRef.current;
      if (!el) return;
      const str = String(text ?? "");
      if (!window.katex) {
        el.textContent = str;
        timer = setTimeout(renderMath, 120);
        return;
      }

      if (block && !str.includes("$")) {
        try {
          window.katex.render(str, el, { displayMode: true, throwOnError: false });
          return;
        } catch {
          el.textContent = str;
          return;
        }
      }

      const parts = str.split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g);
      el.innerHTML = "";
      parts.forEach((part) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          const span = document.createElement("span");
          try {
            window.katex.render(part.slice(2, -2), span, {
              displayMode: true,
              throwOnError: false
            });
          } catch {
            span.textContent = part;
          }
          el.appendChild(span);
        } else if (part.startsWith("$") && part.endsWith("$")) {
          const span = document.createElement("span");
          try {
            window.katex.render(part.slice(1, -1), span, {
              displayMode: false,
              throwOnError: false
            });
          } catch {
            span.textContent = part;
          }
          el.appendChild(span);
        } else {
          el.appendChild(document.createTextNode(part));
        }
      });
    };

    renderMath();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [text, block]);

  return <span ref={containerRef} className={className}>{String(text ?? "")}</span>;
}

// ============================================================================
// 3. CLAUDE PROMPT GENERATOR (Double-escaped valid JSON)
// ============================================================================
const getClaudePrompt = (targetCourseId = "m373k") => String.raw`You are an expert pure mathematics professor authoring course content for Axiom Academy ("M 373K: Algebraic Structures I", Vaaler / Artin syllabus).

CRITICAL JSON & LATEX ESCAPING RULES:
1. Output ONLY raw, valid JSON. Do NOT wrap in markdown code fences.
2. DOUBLE-ESCAPE ALL BACKSLASHES in JSON strings so JSON.parse() succeeds without turning \t, \f, \n, \b into control characters:
   - Write "\\frac{a}{b}", "\\times", "\\text{im}(\\varphi)", "\\neq", "\\blacksquare", "\\subseteq", "\\trianglelefteq", "\\mathbb{Z}/n\\mathbb{Z}".
3. Wrap all inline math in $...$ inside titles, captions, questions, options, optionExplanations, hints, rubric, and modelProof (e.g., "$A_4$", "$p^2$", "$\\Phi_a$ is a bijection").
4. In each step's "math" field, write pure double-escaped LaTeX WITHOUT $ delimiters.
5. Do NOT include any user progress fields.

VALID JSON SCHEMA EXAMPLE:
{
  "targetCourseId": "${targetCourseId}",
  "unit": {
    "id": "m373k-u-ring-ideals",
    "title": "Unit 3: Rings, Ideals & Quotient Rings (Artin Ch. 11)",
    "description": "Commutative rings, integral domains, polynomial rings $F[x]$, ideals, and factor rings $R/I$.",
    "lessons": [
      {
        "id": "m373k-l-maximal-ideals",
        "title": "Maximal Ideals and Fields $R/M$",
        "duration": "15:00",
        "videoUrl": "",
        "theorem": "Theorem (Artin 11.8): Let $R$ be a commutative ring with $1 \\neq 0$. An ideal $M \\subsetneq R$ is maximal if and only if the quotient ring $R/M$ is a field.",
        "steps": [
          {
            "time": "00:00",
            "label": "Correspondence Between Ideals of R/M and Ideals Containing M",
            "math": "M \\subseteq I \\subseteq R \\iff \\bar{I} = I/M \\text{ is an ideal of } R/M",
            "caption": "By the Lattice Isomorphism Theorem for rings, ideals of $R/M$ correspond bijectively to ideals $I$ of $R$ satisfying $M \\subseteq I \\subseteq R$."
          }
        ],
        "exercises": [
          {
            "id": "ex-max-1",
            "type": "mcq",
            "question": "In the polynomial ring $\\mathbb{Z}[x]$, consider the ideal $I = (x)$. Is $I$ prime, maximal, both, or neither?",
            "options": [
              "$I = (x)$ is prime, but NOT maximal in $\\mathbb{Z}[x]$",
              "$I = (x)$ is both prime and maximal in $\\mathbb{Z}[x]$",
              "$I = (x)$ is maximal, but not prime",
              "$I = (x)$ is neither prime nor maximal"
            ],
            "correctIndex": 0,
            "optionExplanations": [
              "Correct! $\\mathbb{Z}[x]/(x) \\cong \\mathbb{Z}$ is an integral domain but not a field.",
              "Incorrect: $\\mathbb{Z}$ is not a field.",
              "Incorrect: Every maximal ideal is prime.",
              "Incorrect: $\\mathbb{Z}$ is a domain so $(x)$ is prime."
            ],
            "hints": [
              "Evaluate $\\mathbb{Z}[x]/(x)$ via $f(x) \\mapsto f(0)$."
            ]
          }
        ]
      }
    ]
  }
}`;

// ============================================================================
// 4. SUPABASE SQL SETUP SCRIPT (For 1-Click Copy in Cloud Settings)
// ============================================================================
const SUPABASE_SQL_SCRIPT = `-- Run this once in your Supabase SQL Editor to enable cross-device profiles & cloud courses:

create table if not exists public.axiom_profiles (
  handle text primary key,
  display_name text not null,
  pin text not null default '0000',
  is_public boolean not null default true,
  progress jsonb not null default '{"exercises":{},"points":0,"streakDays":0}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.axiom_courses (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.axiom_profiles enable row level security;
alter table public.axiom_courses enable row level security;

create policy "Allow public access to profiles" on public.axiom_profiles
  for all using (true) with check (true);

create policy "Allow public access to courses" on public.axiom_courses
  for all using (true) with check (true);`;

// ============================================================================
// 5. MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // Courses state
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem("axiom_courses_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_COURSES;
      }
    }
    return INITIAL_COURSES;
  });

  // Cloud configuration (Supabase URL & Key)
  const [cloudConfig, setCloudConfig] = useState(() => {
    const saved = localStorage.getItem("axiom_cloud_config_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.url && parsed.anonKey) return parsed;
      } catch {}
    }
    return {
      url: DEFAULT_SUPABASE_URL,
      anonKey: DEFAULT_SUPABASE_ANON_KEY
    };
  });

  const isCloudConfigured = Boolean(
    cloudConfig.url?.trim() && cloudConfig.anonKey?.trim()
  );

  // Multi-Profile Directory stored locally & synced with Supabase when configured
  const [profilesMap, setProfilesMap] = useState(() => {
    const saved = localStorage.getItem("axiom_profiles_map_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    // Migrate any single-user progress from v2
    const legacyProgress = localStorage.getItem("axiom_progress_v2");
    let initialProg = { exercises: {}, points: 0, streakDays: 0 };
    if (legacyProgress) {
      try {
        initialProg = JSON.parse(legacyProgress);
      } catch {}
    }
    return {
      joseph: {
        handle: "joseph",
        displayName: "Joseph",
        pin: "0000",
        isPublic: true,
        progress: initialProg,
        updatedAt: Date.now()
      }
    };
  });

  const [activeHandle, setActiveHandle] = useState(() => {
    return localStorage.getItem("axiom_active_handle_v1") || "joseph";
  });

  const [publicLeaderboard, setPublicLeaderboard] = useState([]);
  const [syncStatus, setSyncStatus] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Profile Modal Form State
  const [profileMode, setProfileMode] = useState("switch"); // "switch" | "create" | "cloud-login" | "cloud-setup"
  const [newHandle, setNewHandle] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newPin, setNewPin] = useState("");
  const [newIsPublic, setNewIsPublic] = useState(true);
  const [profileModalMsg, setProfileModalMsg] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Active Profile & Progress
  const activeProfile = useMemo(() => {
    return (
      profilesMap[activeHandle] ||
      Object.values(profilesMap)[0] || {
        handle: "scholar",
        displayName: "Scholar",
        pin: "0000",
        isPublic: true,
        progress: { exercises: {}, points: 0, streakDays: 0 }
      }
    );
  }, [profilesMap, activeHandle]);

  const progress = activeProfile.progress || {
    exercises: {},
    points: 0,
    streakDays: 0
  };

  // Navigation & Lesson State
  const [activeView, setActiveView] = useState("dashboard"); // "dashboard" | "course" | "lesson" | "studio" | "leaderboard"
  const [selectedCourseId, setSelectedCourseId] = useState("m373k");
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonTab, setLessonTab] = useState("blackboard");
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [coursesMenuOpen, setCoursesMenuOpen] = useState(false);

  // Exercise Engine State
  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [numericInput, setNumericInput] = useState("");
  const [proofText, setProofText] = useState("");
  const [checkedRubric, setCheckedRubric] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [wrongAttemptsOnCurrent, setWrongAttemptsOnCurrent] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const [showScratchpad, setShowScratchpad] = useState(false);

  // Course Studio State
  const [studioTab, setStudioTab] = useState("claude");
  const [jsonInput, setJsonInput] = useState("");
  const [importStatus, setImportStatus] = useState(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Scratchpad Canvas
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState("#1d4ed8");

  // Save local state
  useEffect(() => {
    localStorage.setItem("axiom_courses_v2", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("axiom_profiles_map_v1", JSON.stringify(profilesMap));
  }, [profilesMap]);

  useEffect(() => {
    localStorage.setItem("axiom_active_handle_v1", activeHandle);
  }, [activeHandle]);

  useEffect(() => {
    localStorage.setItem("axiom_cloud_config_v1", JSON.stringify(cloudConfig));
  }, [cloudConfig]);

  // ==========================================================================
  // SUPABASE REST API HELPERS (Zero npm dependencies required!)
  // ==========================================================================
  const getHeaders = (extra = {}) => ({
    apikey: cloudConfig.anonKey.trim(),
    Authorization: `Bearer ${cloudConfig.anonKey.trim()}`,
    "Content-Type": "application/json",
    ...extra
  });

  // Push a profile to Supabase Cloud
  const pushProfileToCloud = async (prof) => {
    if (!isCloudConfigured || !prof) return;
    try {
      setSyncStatus("Syncing...");
      const baseUrl = cloudConfig.url.trim().replace(/\/$/, "");
      await fetch(`${baseUrl}/rest/v1/axiom_profiles`, {
        method: "POST",
        headers: getHeaders({ Prefer: "resolution=merge-duplicates" }),
        body: JSON.stringify({
          handle: prof.handle,
          display_name: prof.displayName,
          pin: prof.pin || "0000",
          is_public: Boolean(prof.isPublic),
          progress: prof.progress || { exercises: {}, points: 0, streakDays: 0 },
          updated_at: new Date().toISOString()
        })
      });
      setSyncStatus("Cloud Synced ✓");
      fetchPublicLeaderboard();
    } catch {
      setSyncStatus("Offline (Local Saved)");
    }
  };

  // Pull a profile from Supabase Cloud (for logging in on phone / another laptop)
  const pullProfileFromCloud = async (handleInput, pinInput) => {
    if (!isCloudConfigured) {
      setProfileModalMsg({
        type: "error",
        text: "Connect your Supabase URL & Anon Key in the 'Cloud Sync Setup' tab first."
      });
      return;
    }
    try {
      const cleanHandle = handleInput.trim().toLowerCase();
      const baseUrl = cloudConfig.url.trim().replace(/\/$/, "");
      const res = await fetch(
        `${baseUrl}/rest/v1/axiom_profiles?handle=eq.${encodeURIComponent(cleanHandle)}&select=*`,
        { headers: getHeaders() }
      );
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        setProfileModalMsg({
          type: "error",
          text: `No cloud profile found with handle "@${cleanHandle}".`
        });
        return;
      }
      const remote = data[0];
      if (String(remote.pin) !== String(pinInput).trim()) {
        setProfileModalMsg({
          type: "error",
          text: "Incorrect 4-digit PIN for this profile."
        });
        return;
      }
      const loadedProfile = {
        handle: remote.handle,
        displayName: remote.display_name,
        pin: remote.pin,
        isPublic: remote.is_public,
        progress: remote.progress || { exercises: {}, points: 0, streakDays: 0 },
        updatedAt: Date.now()
      };
      setProfilesMap((prev) => ({ ...prev, [loadedProfile.handle]: loadedProfile }));
      setActiveHandle(loadedProfile.handle);
      setProfileModalMsg({
        type: "success",
        text: `Synced @${loadedProfile.handle} from the cloud!`
      });
    } catch (err) {
      setProfileModalMsg({
        type: "error",
        text: `Cloud error: ${err.message}`
      });
    }
  };

  // Fetch all public profiles for the Scholar Directory & Leaderboard
  const fetchPublicLeaderboard = async () => {
    if (!isCloudConfigured) return;
    try {
      const baseUrl = cloudConfig.url.trim().replace(/\/$/, "");
      const res = await fetch(
        `${baseUrl}/rest/v1/axiom_profiles?is_public=eq.true&select=handle,display_name,is_public,progress,updated_at`,
        { headers: getHeaders() }
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setPublicLeaderboard(
          data.map((row) => ({
            handle: row.handle,
            displayName: row.display_name,
            isPublic: row.is_public,
            progress: row.progress || { exercises: {}, points: 0, streakDays: 0 },
            updatedAt: row.updated_at
          }))
        );
      }
    } catch {}
  };

  // Push & Pull Courses from Cloud so Claude imports appear on all devices!
  const pushCoursesToCloud = async (updatedCourses) => {
    if (!isCloudConfigured) return;
    try {
      const baseUrl = cloudConfig.url.trim().replace(/\/$/, "");
      await fetch(`${baseUrl}/rest/v1/axiom_courses`, {
        method: "POST",
        headers: getHeaders({ Prefer: "resolution=merge-duplicates" }),
        body: JSON.stringify({
          id: "master_curriculum",
          data: updatedCourses,
          updated_at: new Date().toISOString()
        })
      });
      setSyncStatus("Courses Published to Cloud ✓");
    } catch {}
  };

  const pullCoursesFromCloud = async () => {
    if (!isCloudConfigured) return;
    try {
      const baseUrl = cloudConfig.url.trim().replace(/\/$/, "");
      const res = await fetch(
        `${baseUrl}/rest/v1/axiom_courses?id=eq.master_curriculum&select=*`,
        { headers: getHeaders() }
      );
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.data) {
        setCourses(data[0].data);
      }
    } catch {}
  };

  // Initial Cloud Sync on load
  useEffect(() => {
    if (isCloudConfigured) {
      fetchPublicLeaderboard();
      pullCoursesFromCloud();
    }
  }, [isCloudConfigured]);

  const activeCourse = useMemo(
    () => courses.find((c) => c.id === selectedCourseId) || courses[0],
    [courses, selectedCourseId]
  );

  // Compute course mastery for any given progress object
  const getCourseStatsForProgress = (course, progObj = progress) => {
    let totalEx = 0;
    let earnedScore = 0;
    course.units?.forEach((u) =>
      u.lessons?.forEach((l) =>
        l.exercises?.forEach((ex) => {
          totalEx += 1;
          const status = progObj?.exercises?.[ex.id]?.level;
          if (status === "mastered") earnedScore += 1;
          else if (status === "familiar") earnedScore += 0.5;
        })
      )
    );
    const pct = totalEx === 0 ? 0 : Math.round((earnedScore / totalEx) * 100);
    return { totalEx, pct };
  };

  const getUnitStats = (unit) => {
    let totalEx = 0;
    let earnedScore = 0;
    unit.lessons?.forEach((l) =>
      l.exercises?.forEach((ex) => {
        totalEx += 1;
        const status = progress.exercises?.[ex.id]?.level;
        if (status === "mastered") earnedScore += 1;
        else if (status === "familiar") earnedScore += 0.5;
      })
    );
    const pct = totalEx === 0 ? 0 : Math.round((earnedScore / totalEx) * 100);
    return { totalEx, pct };
  };

  const openLesson = (lesson, mode = "blackboard") => {
    setSelectedLesson(lesson);
    setLessonTab(mode);
    setActiveStepIdx(0);
    setCurrentExIdx(0);
    resetExerciseInputs();
    setActiveView("lesson");
  };

  const resetExerciseInputs = () => {
    setSelectedOption(null);
    setNumericInput("");
    setProofText("");
    setCheckedRubric({});
    setIsSubmitted(false);
    setWrongAttemptsOnCurrent(0);
    setHintCount(0);
  };

  // Update active scholar's progress & automatically sync to cloud
  const recordExerciseResult = (exId, qualifiedForMastery) => {
    setProfilesMap((prev) => {
      const currentProf = prev[activeProfile.handle] || activeProfile;
      const prevProg = currentProf.progress || { exercises: {}, points: 0, streakDays: 0 };
      const existing = prevProg.exercises?.[exId]?.level;
      const newLevel = qualifiedForMastery
        ? "mastered"
        : existing === "mastered"
        ? "mastered"
        : "familiar";
      const ptsDelta = existing ? 25 : qualifiedForMastery ? 100 : 50;

      const updatedProf = {
        ...currentProf,
        updatedAt: Date.now(),
        progress: {
          ...prevProg,
          points: (prevProg.points || 0) + ptsDelta,
          streakDays: Math.max(prevProg.streakDays || 0, 1),
          exercises: {
            ...(prevProg.exercises || {}),
            [exId]: { level: newLevel, updatedAt: Date.now() }
          }
        }
      };

      pushProfileToCloud(updatedProf);
      return { ...prev, [activeProfile.handle]: updatedProf };
    });
  };

  // Toggle Public / Private visibility on active profile
  const toggleProfilePrivacy = () => {
    setProfilesMap((prev) => {
      const currentProf = prev[activeProfile.handle] || activeProfile;
      const updatedProf = {
        ...currentProf,
        isPublic: !currentProf.isPublic,
        updatedAt: Date.now()
      };
      pushProfileToCloud(updatedProf);
      return { ...prev, [activeProfile.handle]: updatedProf };
    });
  };

  // Create a new Scholar Profile
  const handleCreateProfile = (e) => {
    e.preventDefault();
    const cleanHandle = newHandle.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (!cleanHandle || !newDisplayName.trim()) {
      setProfileModalMsg({
        type: "error",
        text: "Please enter both a Display Name and a unique Handle."
      });
      return;
    }
    const created = {
      handle: cleanHandle,
      displayName: newDisplayName.trim(),
      pin: newPin.trim() || "0000",
      isPublic: newIsPublic,
      progress: { exercises: {}, points: 0, streakDays: 0 },
      updatedAt: Date.now()
    };
    setProfilesMap((prev) => ({ ...prev, [cleanHandle]: created }));
    setActiveHandle(cleanHandle);
    pushProfileToCloud(created);
    setNewHandle("");
    setNewDisplayName("");
    setNewPin("");
    setProfileModalMsg({
      type: "success",
      text: `Created profile for ${created.displayName} (@${created.handle})!`
    });
  };

  // Combined Leaderboard (merges local public profiles + cloud public profiles)
  const combinedPublicScholars = useMemo(() => {
    const byHandle = {};
    Object.values(profilesMap).forEach((p) => {
      if (p.isPublic) byHandle[p.handle] = p;
    });
    publicLeaderboard.forEach((p) => {
      if (p.isPublic) byHandle[p.handle] = p;
    });
    return Object.values(byHandle).sort(
      (a, b) => (b.progress?.points || 0) - (a.progress?.points || 0)
    );
  }, [profilesMap, publicLeaderboard]);

  // Scratchpad handlers
  const startDraw = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const clearScratchpad = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Import JSON from Claude & auto-publish to Cloud if connected
  const handleImportJson = () => {
    try {
      const cleaned = jsonInput.trim().replace(/^```json\s*/i, "").replace(/```$/, "");
      const parsed = JSON.parse(cleaned);

      if (parsed.targetCourseId && parsed.unit) {
        setCourses((prev) => {
          const next = prev.map((c) => {
            if (c.id !== parsed.targetCourseId) return c;
            const exists = c.units.some((u) => u.id === parsed.unit.id);
            const updatedUnits = exists
              ? c.units.map((u) => (u.id === parsed.unit.id ? parsed.unit : u))
              : [...c.units, parsed.unit];
            return { ...c, units: updatedUnits };
          });
          pushCoursesToCloud(next);
          return next;
        });
        setSelectedCourseId(parsed.targetCourseId);
        setImportStatus({
          type: "success",
          msg: `Imported "${parsed.unit.title}" into ${parsed.targetCourseId.toUpperCase()}! ${
            isCloudConfigured ? "Synced to Cloud for all devices." : "Saved locally."
          }`
        });
      } else if (parsed.id && parsed.title && Array.isArray(parsed.units)) {
        setCourses((prev) => {
          const exists = prev.some((c) => c.id === parsed.id);
          const next = exists
            ? prev.map((c) => (c.id === parsed.id ? parsed : c))
            : [...prev, parsed];
          pushCoursesToCloud(next);
          return next;
        });
        setSelectedCourseId(parsed.id);
        setImportStatus({
          type: "success",
          msg: `Imported full course "${parsed.code || ""} ${parsed.title}"!`
        });
      } else {
        throw new Error(
          'JSON must match either { "targetCourseId": "m373k", "unit": { ... } } or a full course { "id", "title", "units": [...] }.'
        );
      }
      setJsonInput("");
    } catch (err) {
      setImportStatus({
        type: "error",
        msg: `JSON Parse Error: ${err.message}. Ensure all LaTeX backslashes are double-escaped.`
      });
    }
  };

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const results = [];
    courses.forEach((c) =>
      c.units?.forEach((u) =>
        u.lessons?.forEach((l) => {
          if (
            l.title.toLowerCase().includes(q) ||
            l.theorem?.toLowerCase().includes(q) ||
            u.title.toLowerCase().includes(q)
          ) {
            results.push({ course: c, unit: u, lesson: l });
          }
        })
      )
    );
    return results.slice(0, 6);
  }, [courses, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* ===================================================================
          TOP NAVIGATION BAR
         =================================================================== */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Left: Courses Dropdown & Search */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setCoursesMenuOpen((o) => !o)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-blue-600 hover:bg-blue-50 transition"
              >
                Courses
                <ChevronDown className="w-4 h-4" />
              </button>
              {coursesMenuOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                    Pure Mathematics Curriculum
                  </div>
                  {courses.map((c) => {
                    const st = getCourseStatsForProgress(c, progress);
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => {
                          setSelectedCourseId(c.id);
                          setActiveView("course");
                          setCoursesMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-100 transition flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-blue-600">{c.code}</div>
                          <div className="text-sm font-semibold text-slate-800">{c.title}</div>
                        </div>
                        <span className="text-xs font-semibold text-slate-500">{st.pct}%</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search theorems, cosets, rings..."
                className="bg-slate-100 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 w-40 sm:w-60 transition"
              />
              {searchResults.length > 0 && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                  {searchResults.map(({ course, lesson }) => (
                    <button
                      type="button"
                      key={lesson.id}
                      onClick={() => {
                        setSelectedCourseId(course.id);
                        openLesson(lesson, "blackboard");
                        setSearchQuery("");
                      }}
                      className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 transition block"
                    >
                      <div className="text-[11px] font-bold text-blue-600">{course.code}</div>
                      <div className="text-xs font-semibold text-slate-800">
                        <MathText text={lesson.title} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center Brand */}
          <button
            type="button"
            onClick={() => setActiveView("dashboard")}
            className="flex items-center gap-2.5 text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-[#0b2149] text-white flex items-center justify-center font-serif font-bold text-lg shadow-xs">
              ∀
            </div>
            <div className="hidden sm:block">
              <div className="font-serif font-bold text-lg text-slate-900 leading-none">
                Axiom Academy
              </div>
              <div className="text-[10px] tracking-widest uppercase text-slate-500 mt-0.5">
                Pure Mathematics
              </div>
            </div>
          </button>

          {/* Right Navigation, Leaderboard & Active Scholar Profile Pill */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveView("dashboard")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  activeView === "dashboard"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => setActiveView("leaderboard")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition flex items-center gap-1 ${
                  activeView === "leaderboard"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Users className="w-3.5 h-3.5" /> Scholars
              </button>
              <button
                type="button"
                onClick={() => setActiveView("studio")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition flex items-center gap-1 ${
                  activeView === "studio"
                    ? "bg-white text-purple-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Studio
              </button>
            </div>

            {/* Active Scholar Profile Button (Opens Profile & Cloud Sync Modal) */}
            <button
              type="button"
              onClick={() => {
                setProfileModalMsg(null);
                setShowProfileModal(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-800 transition"
            >
              <span className="w-5 h-5 rounded-full bg-[#0b2149] text-white flex items-center justify-center text-[10px]">
                {activeProfile.displayName?.slice(0, 1).toUpperCase()}
              </span>
              <span className="max-w-[90px] truncate">{activeProfile.displayName}</span>
              {activeProfile.isPublic ? (
                <Globe className="w-3.5 h-3.5 text-emerald-600" title="Public Profile" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-amber-600" title="Private Profile" />
              )}
            </button>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {progress.streakDays || 0}
            </div>

            <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-[#0b2149] text-white text-xs font-bold">
              {progress.points || 0} pts
            </div>
          </div>
        </div>
      </header>

      {/* ===================================================================
          PROFILE SWITCHER, PRIVACY TOGGLE & CLOUD SYNC MODAL
         =================================================================== */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  Cross-Device Scholar Identity
                </div>
                <h2 className="text-xl font-serif font-bold text-slate-900">
                  Scholar Profiles & Public / Private Sync
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-600"
              >
                Close ✕
              </button>
            </div>

            {/* Active Profile Privacy Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-500">Currently Active Scholar</div>
                <div className="text-base font-bold text-slate-900 flex items-center gap-2">
                  {activeProfile.displayName}
                  <span className="text-xs font-mono text-slate-500">
                    (@{activeProfile.handle})
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  {activeProfile.isPublic
                    ? "Public: Your mastery % and points are visible on the Scholars Leaderboard."
                    : "Private: Your progress syncs across your devices, but is hidden from the public leaderboard."}
                </div>
              </div>

              <button
                type="button"
                onClick={toggleProfilePrivacy}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                  activeProfile.isPublic
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                    : "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100"
                }`}
              >
                {activeProfile.isPublic ? (
                  <>
                    <Globe className="w-3.5 h-3.5" /> Public Profile (Click to Make Private)
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" /> Private Profile (Click to Make Public)
                  </>
                )}
              </button>
            </div>

            {/* Modal Mode Tabs */}
            <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setProfileMode("switch");
                  setProfileModalMsg(null);
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition ${
                  profileMode === "switch" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
                }`}
              >
                Switch Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  setProfileMode("create");
                  setProfileModalMsg(null);
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition ${
                  profileMode === "create" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
                }`}
              >
                + New Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  setProfileMode("cloud-login");
                  setProfileModalMsg(null);
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition ${
                  profileMode === "cloud-login"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600"
                }`}
              >
                Log In on New Device
              </button>
              <button
                type="button"
                onClick={() => {
                  setProfileMode("cloud-setup");
                  setProfileModalMsg(null);
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition ${
                  profileMode === "cloud-setup"
                    ? "bg-white text-purple-700 shadow-xs"
                    : "text-slate-600"
                }`}
              >
                Cloud Sync Setup
              </button>
            </div>

            {profileModalMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold border ${
                  profileModalMsg.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}
              >
                {profileModalMsg.text}
              </div>
            )}

            {/* TAB 1: SWITCH BETWEEN SAVED PROFILES ON THIS DEVICE */}
            {profileMode === "switch" && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500">
                  Profiles on This Device ({Object.keys(profilesMap).length})
                </div>
                {Object.values(profilesMap).map((p) => (
                  <div
                    key={p.handle}
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      p.handle === activeProfile.handle
                        ? "bg-blue-50/70 border-blue-500"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        {p.displayName}
                        <span className="text-xs font-mono text-slate-400">@{p.handle}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {p.isPublic ? "Public" : "Private"}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {p.progress?.points || 0} pts ·{" "}
                        {Object.keys(p.progress?.exercises || {}).length} exercises completed
                      </div>
                    </div>
                    {p.handle === activeProfile.handle ? (
                      <span className="text-xs font-bold text-blue-600">Active ✓</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveHandle(p.handle)}
                        className="px-3 py-1.5 rounded-lg bg-[#0b2149] text-white text-xs font-bold"
                      >
                        Switch
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: CREATE A NEW PROFILE */}
            {profileMode === "create" && (
              <form onSubmit={handleCreateProfile} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Display Name (e.g., Joseph, Alex)
                  </label>
                  <input
                    type="text"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Unique Handle (used to sync across devices)
                    </label>
                    <input
                      type="text"
                      value={newHandle}
                      onChange={(e) => setNewHandle(e.target.value)}
                      placeholder="e.g. joseph_ut"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      4-Digit PIN (for logging in on phone/laptop)
                    </label>
                    <input
                      type="password"
                      maxLength={8}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="e.g. 1234"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-mono"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsPublic}
                    onChange={(e) => setNewIsPublic(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600"
                  />
                  Make profile Public (show my progress on the shared Scholars Leaderboard)
                </label>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  Create Scholar Profile
                </button>
              </form>
            )}

            {/* TAB 3: PULL / LOG IN TO YOUR PROFILE ON PHONE OR ANOTHER COMPUTER */}
            {profileMode === "cloud-login" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  On your phone or a friend's computer? Enter your Handle and PIN to pull your live progress from the cloud.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newHandle}
                    onChange={(e) => setNewHandle(e.target.value)}
                    placeholder="Handle (e.g. joseph)"
                    className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-mono"
                  />
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="4-Digit PIN"
                    className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => pullProfileFromCloud(newHandle, newPin)}
                  className="w-full py-2.5 rounded-xl bg-[#0b2149] hover:bg-blue-900 text-white text-xs font-bold"
                >
                  Pull My Profile from Cloud
                </button>
              </div>
            )}

            {/* TAB 4: SUPABASE CLOUD CONFIGURATION */}
            {profileMode === "cloud-setup" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Paste a free <strong>Supabase Project URL</strong> and <strong>Anon Public Key</strong> (from <em>supabase.com → Project Settings → API</em>) to sync profiles and courses across all phones and computers.
                </p>
                <input
                  type="text"
                  value={cloudConfig.url}
                  onChange={(e) =>
                    setCloudConfig((prev) => ({ ...prev, url: e.target.value }))
                  }
                  placeholder="https://your-project.supabase.co"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                />
                <input
                  type="password"
                  value={cloudConfig.anonKey}
                  onChange={(e) =>
                    setCloudConfig((prev) => ({ ...prev, anonKey: e.target.value }))
                  }
                  placeholder="Supabase anon public key (eyJhbGci...)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                />
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 2000);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedSql ? "Copied SQL Table Script!" : "1. Copy SQL Setup Script"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      pushProfileToCloud(activeProfile);
                      pushCoursesToCloud(courses);
                      setProfileModalMsg({
                        type: "success",
                        text: "Synced active profile & courses to Supabase Cloud!"
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                  >
                    2. Test & Sync Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================
          VIEW 1: LEARNER DASHBOARD
         =================================================================== */}
      {activeView === "dashboard" && (
        <div>
          <div className="bg-[#0b2149] text-white py-10 px-6 border-b border-slate-800">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-900/60 border border-blue-400/30 flex items-center justify-center font-mono font-bold text-xl text-blue-200">
                  {activeProfile.displayName?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-serif font-bold">
                      {activeProfile.displayName}
                    </h1>
                    <button
                      type="button"
                      onClick={toggleProfilePrivacy}
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                        activeProfile.isPublic
                          ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-200"
                          : "bg-amber-500/20 border-amber-400/40 text-amber-200"
                      }`}
                    >
                      {activeProfile.isPublic ? (
                        <>
                          <Globe className="w-3 h-3" /> Public Profile
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" /> Private Profile
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-800/80 border border-blue-400/30 text-blue-200 font-medium">
                      {Object.keys(progress.exercises || {}).length} Exercises Completed
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowProfileModal(true)}
                      className="text-xs text-sky-300 hover:underline font-medium"
                    >
                      Switch Scholar / Cross-Device Sync ({syncStatus || (isCloudConfigured ? "Cloud Ready" : "Local Mode")}) →
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    Compare Progress With Friends
                  </div>
                  <div className="text-sm font-semibold text-white">
                    View public scholars & course mastery rankings
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    fetchPublicLeaderboard();
                    setActiveView("leaderboard");
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shrink-0"
                >
                  Scholars Leaderboard
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-3 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
                Pure Math Workspace
              </div>
              <button
                type="button"
                onClick={() => setActiveView("dashboard")}
                className="w-full text-left px-3.5 py-2.5 rounded-lg bg-blue-50 text-blue-700 font-semibold text-sm flex items-center gap-2.5"
              >
                <BookOpen className="w-4 h-4" /> My Courses
              </button>
              <button
                type="button"
                onClick={() => {
                  fetchPublicLeaderboard();
                  setActiveView("leaderboard");
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-lg hover:bg-slate-100 text-slate-700 font-medium text-sm flex items-center gap-2.5"
              >
                <Users className="w-4 h-4 text-blue-600" /> Public Scholars Directory
              </button>
              <button
                type="button"
                onClick={() => setShowProfileModal(true)}
                className="w-full text-left px-3.5 py-2.5 rounded-lg hover:bg-slate-100 text-slate-700 font-medium text-sm flex items-center gap-2.5"
              >
                <Cloud className="w-4 h-4 text-emerald-600" /> Profiles & Cloud Sync
              </button>
              <button
                type="button"
                onClick={() => setActiveView("studio")}
                className="w-full text-left px-3.5 py-2.5 rounded-lg hover:bg-slate-100 text-slate-700 font-medium text-sm flex items-center gap-2.5"
              >
                <Sparkles className="w-4 h-4 text-purple-600" /> Course Studio (Claude Import)
              </button>
            </aside>

            <section className="lg:col-span-9 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-slate-900">
                    My Pure Mathematics Courses
                  </h2>
                  <p className="text-sm text-slate-500">
                    Tracking progress for <strong>{activeProfile.displayName}</strong> (@{activeProfile.handle})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveView("studio")}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add / Import Course via Claude
                </button>
              </div>

              <div className="space-y-4">
                {courses.map((course) => {
                  const stats = getCourseStatsForProgress(course, progress);
                  return (
                    <div
                      key={course.id}
                      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                    >
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-1 rounded-md bg-[#0b2149] text-white font-mono text-xs font-bold">
                            {course.code}
                          </span>
                          <h3 className="text-xl font-serif font-bold text-slate-900">
                            {course.title}
                          </h3>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                            {stats.pct}% Mastered ({stats.totalEx} exercises)
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          <MathText text={course.syllabus} />
                        </p>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full transition-all"
                            style={{ width: `${stats.pct}%` }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCourseId(course.id);
                          setActiveView("course");
                        }}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shrink-0 transition"
                      >
                        Open Curriculum ({course.units?.length || 0} Units) →
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* ===================================================================
          VIEW 1B: PUBLIC SCHOLARS DIRECTORY & LEADERBOARD
         =================================================================== */}
      {activeView === "leaderboard" && (
        <div className="max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Public Scholar Directory
              </div>
              <h1 className="text-2xl font-serif font-bold text-slate-900">
                Scholars Leaderboard & Course Mastery
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Only profiles set to <strong>Public</strong> appear here. Scholars set to <strong>Private</strong> sync privately across their own devices.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchPublicLeaderboard}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Leaderboard
              </button>
              <button
                type="button"
                onClick={() => setShowProfileModal(true)}
                className="px-4 py-2 rounded-xl bg-[#0b2149] text-white text-xs font-bold"
              >
                Create / Manage Profile
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Rank & Scholar</th>
                  <th className="py-3.5 px-4">Proof Points</th>
                  <th className="py-3.5 px-4">Exercises</th>
                  {courses.map((c) => (
                    <th key={c.id} className="py-3.5 px-4">
                      {c.code} Mastery
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {combinedPublicScholars.length === 0 ? (
                  <tr>
                    <td colSpan={3 + courses.length} className="py-8 text-center text-slate-500 text-xs">
                      No public profiles yet. Click your profile badge in the top bar to set your profile to Public!
                    </td>
                  </tr>
                ) : (
                  combinedPublicScholars.map((scholar, idx) => (
                    <tr
                      key={scholar.handle}
                      className={
                        scholar.handle === activeProfile.handle ? "bg-blue-50/40" : "hover:bg-slate-50"
                      }
                    >
                      <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs flex items-center justify-center font-mono">
                          {idx + 1}
                        </span>
                        <div>
                          <div>
                            {scholar.displayName}{" "}
                            {scholar.handle === activeProfile.handle && (
                              <span className="text-[11px] text-blue-600 font-semibold">(You)</span>
                            )}
                          </div>
                          <div className="text-xs font-mono text-slate-400">@{scholar.handle}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-blue-600">
                        {scholar.progress?.points || 0} pts
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-600">
                        {Object.keys(scholar.progress?.exercises || {}).length} solved
                      </td>
                      {courses.map((c) => {
                        const st = getCourseStatsForProgress(c, scholar.progress);
                        return (
                          <td key={c.id} className="py-4 px-4">
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">
                              {st.pct}%
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================
          VIEW 2: COURSE CURRICULUM VIEW
         =================================================================== */}
      {activeView === "course" && activeCourse && (
        <div className="max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {activeCourse.category}
              </div>
              <h1 className="text-2xl font-serif font-bold text-slate-900">
                {activeCourse.code}: {activeCourse.title}
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                <MathText text={activeCourse.syllabus} />
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>{activeProfile.displayName}'s Mastery</span>
                <span className="text-blue-600">
                  {getCourseStatsForProgress(activeCourse, progress).pct}%
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Unit Breakdown
              </div>
              {activeCourse.units?.map((u) => {
                const st = getUnitStats(u);
                return (
                  <div
                    key={u.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2"
                  >
                    <div className="text-xs font-semibold text-slate-800">
                      <MathText text={u.title} />
                    </div>
                    <span className="text-xs font-mono font-bold text-blue-600 shrink-0">
                      {st.pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </aside>

          <section className="lg:col-span-8 space-y-6">
            {activeCourse.units?.map((unit) => (
              <div
                key={unit.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
              >
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-serif font-bold text-slate-900">
                      <MathText text={unit.title} />
                    </h2>
                    <p className="text-xs text-slate-600 mt-1">
                      <MathText text={unit.description} />
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                    {getUnitStats(unit).pct}% Mastered
                  </span>
                </div>

                {unit.lessons?.length === 0 ? (
                  <div className="p-6 text-xs text-slate-500 flex items-center justify-between">
                    <span>No lessons imported in this unit yet.</span>
                    <button
                      type="button"
                      onClick={() => setActiveView("studio")}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Import Unit via Claude →
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {unit.lessons?.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="p-6 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-2 max-w-xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-slate-900 text-base">
                              <MathText text={lesson.title} />
                            </span>
                            {lesson.videoUrl && (
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-sky-100 text-sky-800 flex items-center gap-1">
                                <Video className="w-3 h-3" /> Video
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 leading-relaxed">
                            <MathText text={lesson.theorem} />
                          </div>
                        </div>

                        <div className="flex sm:flex-col gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => openLesson(lesson, "blackboard")}
                            className="px-4 py-2 rounded-xl bg-[#0b2149] hover:bg-blue-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
                          >
                            <Play className="w-3.5 h-3.5" />
                            Lecture ({lesson.steps?.length || 0} steps)
                          </button>
                          <button
                            type="button"
                            onClick={() => openLesson(lesson, "exercises")}
                            className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                          >
                            <PenTool className="w-3.5 h-3.5" />
                            Exercises ({lesson.exercises?.length || 0})
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        </div>
      )}

      {/* ===================================================================
          VIEW 3: LESSON VIEW (Video + Blackboard + Proof Exercises)
         =================================================================== */}
      {activeView === "lesson" && selectedLesson && (
        <div className="max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveView("course")}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="text-xs font-bold text-blue-600">
                  {activeCourse?.code} · {activeCourse?.title}
                </div>
                <h1 className="text-xl font-serif font-bold text-slate-900">
                  <MathText text={selectedLesson.title} />
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-200/70 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setLessonTab("blackboard")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                  lessonTab === "blackboard"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                1. Video & Blackboard Lecture
              </button>
              <button
                type="button"
                onClick={() => setLessonTab("exercises")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                  lessonTab === "exercises"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                2. Proof & Comprehension Exercises ({selectedLesson.exercises?.length || 0})
              </button>
            </div>
          </div>

          {lessonTab === "blackboard" ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                {selectedLesson.videoUrl && (
                  <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-lg">
                    <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center gap-2 text-xs font-semibold text-sky-400">
                      <Video className="w-4 h-4" /> Narrated Lecture Episode
                    </div>
                    {selectedLesson.videoUrl.includes("youtube.com") ||
                    selectedLesson.videoUrl.includes("youtu.be") ? (
                      <iframe
                        src={selectedLesson.videoUrl}
                        title={selectedLesson.title}
                        className="w-full aspect-video"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={selectedLesson.videoUrl}
                        controls
                        className="w-full aspect-video bg-black"
                      />
                    )}
                  </div>
                )}

                <div className="bg-[#0b1528] text-slate-100 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
                  <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-400/30">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-sky-300 mb-1">
                      Formal Theorem Statement
                    </div>
                    <div className="text-sm text-white leading-relaxed">
                      <MathText text={selectedLesson.theorem} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedLesson.steps?.map((step, idx) => {
                      const isCurrent = idx === activeStepIdx;
                      const isRevealed = idx <= activeStepIdx;
                      return (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setActiveStepIdx(idx)}
                          className={`w-full text-left p-4 rounded-xl border transition block ${
                            isCurrent
                              ? "bg-slate-900 border-sky-400 shadow-md"
                              : isRevealed
                              ? "bg-slate-900/60 border-slate-800 opacity-90"
                              : "bg-slate-950/40 border-slate-900 opacity-40"
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="font-bold text-sky-300">
                              Step {idx + 1}: <MathText text={step.label} />
                            </span>
                            <span className="font-mono text-slate-400">{step.time}</span>
                          </div>
                          <div className="my-3 py-2.5 px-4 bg-slate-950 rounded-lg border border-slate-800 text-amber-200 overflow-x-auto">
                            <MathText text={step.math} block={true} />
                          </div>
                          <div className="text-xs text-slate-300 leading-relaxed">
                            <MathText text={step.caption || step.explanation} />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      disabled={activeStepIdx === 0}
                      onClick={() => setActiveStepIdx((i) => Math.max(0, i - 1))}
                      className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200 disabled:opacity-40"
                    >
                      ← Previous Step
                    </button>
                    <span className="text-xs font-mono text-slate-400">
                      Step {activeStepIdx + 1} of {selectedLesson.steps?.length || 1}
                    </span>
                    {activeStepIdx < (selectedLesson.steps?.length || 1) - 1 ? (
                      <button
                        type="button"
                        onClick={() => setActiveStepIdx((i) => i + 1)}
                        className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold"
                      >
                        Next Proof Step →
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setLessonTab("exercises")}
                        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
                      >
                        Start Exercises →
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                  <h3 className="text-sm font-bold text-slate-900">Derivation Steps</h3>
                  {selectedLesson.steps?.map((s, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setActiveStepIdx(idx)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs border transition flex items-center justify-between ${
                        idx === activeStepIdx
                          ? "bg-blue-50 border-blue-500 text-blue-900 font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      <span>
                        {idx + 1}. <MathText text={s.label} />
                      </span>
                      <span className="font-mono text-[11px]">{s.time}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                {selectedLesson.exercises && selectedLesson.exercises.length > 0 ? (
                  (() => {
                    const ex = selectedLesson.exercises[currentExIdx];
                    const exType = ex.type || "mcq";
                    const existingStatus = progress.exercises?.[ex.id]?.level;

                    return (
                      <>
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2">
                            {selectedLesson.exercises.map((item, idx) => (
                              <button
                                type="button"
                                key={item.id}
                                onClick={() => {
                                  setCurrentExIdx(idx);
                                  resetExerciseInputs();
                                }}
                                className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${
                                  idx === currentExIdx
                                    ? "bg-[#0b2149] text-white border-[#0b2149]"
                                    : "bg-slate-100 text-slate-600 border-slate-200"
                                }`}
                              >
                                #{idx + 1} ({item.type === "proof" ? "Proof" : "Concept"})
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-2">
                            {existingStatus && (
                              <span
                                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                  existingStatus === "mastered"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {existingStatus === "mastered" ? "★ Mastered" : "● Familiar"}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => setShowScratchpad((s) => !s)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5"
                            >
                              <PenTool className="w-3.5 h-3.5" />
                              {showScratchpad ? "Hide Scratchpad" : "Scratchpad"}
                            </button>
                          </div>
                        </div>

                        <div className="text-base font-medium text-slate-900 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <MathText text={ex.question} />
                        </div>

                        {exType === "mcq" && (
                          <div className="space-y-2.5">
                            {ex.options?.map((opt, oIdx) => {
                              const isSelected = selectedOption === oIdx;
                              let btnStyle =
                                "bg-white border-slate-200 text-slate-800 hover:border-blue-400";
                              if (isSelected) {
                                btnStyle = "bg-blue-50 border-blue-600 text-blue-950 font-semibold";
                              }
                              if (isSubmitted) {
                                if (oIdx === ex.correctIndex) {
                                  btnStyle =
                                    "bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold";
                                } else if (isSelected) {
                                  btnStyle = "bg-rose-50 border-rose-500 text-rose-950";
                                }
                              }
                              return (
                                <button
                                  type="button"
                                  key={oIdx}
                                  onClick={() => {
                                    setSelectedOption(oIdx);
                                    if (isSubmitted) setIsSubmitted(false);
                                  }}
                                  className={`w-full text-left p-3.5 rounded-xl border-2 text-sm transition flex items-start gap-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${btnStyle}`}
                                >
                                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                                    {String.fromCharCode(65 + oIdx)}
                                  </span>
                                  <div className="flex-1 space-y-1">
                                    <MathText text={opt} />
                                    {isSubmitted &&
                                      (isSelected || oIdx === ex.correctIndex) &&
                                      ex.optionExplanations?.[oIdx] && (
                                        <div className="text-xs text-slate-600 pt-1.5 border-t border-slate-200/80 font-normal">
                                          <MathText text={ex.optionExplanations[oIdx]} />
                                        </div>
                                      )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {exType === "numeric" && (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={numericInput}
                              onChange={(e) => {
                                setNumericInput(e.target.value);
                                setIsSubmitted(false);
                              }}
                              placeholder="Enter exact numeric value..."
                              className="w-full max-w-xs px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:border-blue-600"
                            />
                            {isSubmitted && ex.explanation && (
                              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700">
                                <MathText text={ex.explanation} />
                              </div>
                            )}
                          </div>
                        )}

                        {exType === "proof" && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Write Your Formal Proof (Supports $LaTeX$):
                              </label>
                              <textarea
                                rows={5}
                                value={proofText}
                                onChange={(e) => setProofText(e.target.value)}
                                placeholder="Let G be a group of prime order p, and let a \in G with a \neq 1..."
                                className="w-full rounded-xl border border-slate-300 p-3.5 text-sm font-mono text-slate-800 focus:outline-none focus:border-blue-600"
                              />
                            </div>

                            {proofText.trim() && (
                              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                <div className="text-[11px] font-bold uppercase text-slate-400">
                                  Live Typeset Proof Preview
                                </div>
                                <div className="text-sm text-slate-800 leading-relaxed">
                                  <MathText text={proofText} />
                                </div>
                              </div>
                            )}

                            {isSubmitted && (
                              <div className="space-y-4 pt-2">
                                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                                    Model Proof (Vaaler / Artin Standard)
                                  </div>
                                  <div className="text-sm text-slate-800 leading-relaxed">
                                    <MathText text={ex.modelProof} />
                                  </div>
                                </div>

                                {ex.rubric && ex.rubric.length > 0 && (
                                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2.5">
                                    <div className="text-xs font-bold text-blue-900">
                                      Self-Grading Proof Rubric (Check every step your proof established):
                                    </div>
                                    {ex.rubric.map((item, rIdx) => (
                                      <label
                                        key={rIdx}
                                        className="flex items-start gap-2.5 text-xs text-slate-800 cursor-pointer"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={!!checkedRubric[rIdx]}
                                          onChange={(e) =>
                                            setCheckedRubric((prev) => ({
                                              ...prev,
                                              [rIdx]: e.target.checked
                                            }))
                                          }
                                          className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <MathText text={item} />
                                      </label>
                                    ))}
                                    <div className="pt-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const allChecked = ex.rubric.every(
                                            (_, idx) => checkedRubric[idx]
                                          );
                                          recordExerciseResult(
                                            ex.id,
                                            allChecked && hintCount === 0
                                          );
                                        }}
                                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                                      >
                                        Save Rubric Grade to {activeProfile.displayName}'s Profile
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {hintCount > 0 && ex.hints && (
                          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                            <div className="text-xs font-bold text-amber-900">
                              Progressive Hints ({hintCount}/{ex.hints.length}) — using hints caps credit at Familiar
                            </div>
                            {ex.hints.slice(0, hintCount).map((h, i) => (
                              <div key={i} className="text-xs text-slate-800 leading-relaxed">
                                {i + 1}. <MathText text={h} />
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                          {ex.hints && ex.hints.length > 0 ? (
                            <button
                              type="button"
                              disabled={hintCount >= ex.hints.length}
                              onClick={() => setHintCount((c) => c + 1)}
                              className="text-xs font-semibold text-amber-700 hover:text-amber-800 disabled:opacity-40"
                            >
                              Get Hint ({ex.hints.length - hintCount} remaining)
                            </button>
                          ) : (
                            <span />
                          )}

                          <div className="flex items-center gap-3">
                            {exType === "proof" ? (
                              !isSubmitted && (
                                <button
                                  type="button"
                                  disabled={!proofText.trim()}
                                  onClick={() => setIsSubmitted(true)}
                                  className="px-5 py-2.5 rounded-xl bg-[#0b2149] hover:bg-blue-900 disabled:opacity-40 text-white text-xs font-bold"
                                >
                                  Reveal Model Proof & Rubric
                                </button>
                              )
                            ) : (
                              <button
                                type="button"
                                disabled={
                                  exType === "mcq"
                                    ? selectedOption === null
                                    : !numericInput.trim()
                                }
                                onClick={() => {
                                  setIsSubmitted(true);
                                  const isRight =
                                    exType === "mcq"
                                      ? selectedOption === ex.correctIndex
                                      : String(numericInput).trim() === String(ex.answer).trim();
                                  if (isRight) {
                                    const firstTryNoHints =
                                      wrongAttemptsOnCurrent === 0 && hintCount === 0;
                                    recordExerciseResult(ex.id, firstTryNoHints);
                                  } else {
                                    setWrongAttemptsOnCurrent((w) => w + 1);
                                  }
                                }}
                                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold"
                              >
                                Check Answer
                              </button>
                            )}

                            {currentExIdx < selectedLesson.exercises.length - 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentExIdx((i) => i + 1);
                                  resetExerciseInputs();
                                }}
                                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
                              >
                                Next Exercise →
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()
                ) : (
                  <div className="text-sm text-slate-500">No exercises in this lesson yet.</div>
                )}
              </div>

              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-700">
                    Diagram & Coset Scratchpad
                  </span>
                  <div className="flex items-center gap-2">
                    {["#1d4ed8", "#dc2626", "#059669", "#0f172a"].map((col) => (
                      <button
                        type="button"
                        key={col}
                        onClick={() => setPenColor(col)}
                        className={`w-4 h-4 rounded-full border ${
                          penColor === col ? "ring-2 ring-offset-1 ring-blue-500" : ""
                        }`}
                        style={{ backgroundColor: col }}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={clearScratchpad}
                      className="text-xs text-slate-500 hover:text-slate-900 ml-2 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Clear
                    </button>
                  </div>
                </div>
                <canvas
                  ref={canvasRef}
                  width={440}
                  height={360}
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={() => setIsDrawing(false)}
                  onMouseLeave={() => setIsDrawing(false)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl cursor-crosshair"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================
          VIEW 4: COURSE STUDIO
         =================================================================== */}
      {activeView === "studio" && (
        <div className="max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-600">
                Course Studio Back-End
              </div>
              <h1 className="text-2xl font-serif font-bold text-slate-900">
                Claude Curriculum Importer & Cloud Publisher
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Import units from Claude and sync them to all devices via Cloud or GitHub export.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStudioTab("claude")}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${
                  studioTab === "claude"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                1. Claude Prompt & JSON Importer
              </button>
              <button
                type="button"
                onClick={() => setStudioTab("export")}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${
                  studioTab === "export"
                    ? "bg-[#0b2149] text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                2. Export for GitHub / Cloud Sync
              </button>
            </div>
          </div>

          {studioTab === "claude" ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900">
                    Validated Claude Prompt
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(getClaudePrompt(selectedCourseId));
                      setCopiedPrompt(true);
                      setTimeout(() => setCopiedPrompt(false), 2000);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedPrompt ? "Copied!" : "Copy Prompt"}
                  </button>
                </div>
                <pre className="bg-slate-950 text-slate-200 rounded-xl p-3.5 text-[11px] font-mono overflow-x-auto max-h-96">
                  {getClaudePrompt(selectedCourseId)}
                </pre>
              </div>

              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900">
                    Paste Claude's JSON Output
                  </h2>
                  <span className="text-xs text-slate-500">
                    Auto-publishes to Cloud if connected
                  </span>
                </div>

                <textarea
                  rows={13}
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="Paste valid JSON from Claude here..."
                  className="w-full bg-slate-950 text-emerald-300 rounded-xl p-4 text-xs font-mono focus:outline-none"
                />

                {importStatus && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-semibold border ${
                      importStatus.type === "success"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                        : "bg-rose-50 border-rose-300 text-rose-900"
                    }`}
                  >
                    {importStatus.msg}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={!jsonInput.trim()}
                    onClick={handleImportJson}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" /> Import JSON into Axiom Academy
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Permanent GitHub / Cloud Export
                  </h2>
                  <p className="text-xs text-slate-500">
                    Copy <code className="text-purple-700 font-mono">INITIAL_COURSES</code> for GitHub, or push courses directly to your connected Supabase Cloud.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {isCloudConfigured && (
                    <button
                      type="button"
                      onClick={() => pushCoursesToCloud(courses)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2"
                    >
                      <Cloud className="w-4 h-4" /> Publish All Courses to Cloud
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const codeBlock = `const INITIAL_COURSES = ${JSON.stringify(courses, null, 2)};`;
                      navigator.clipboard.writeText(codeBlock);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2500);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0b2149] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-2"
                  >
                    {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedCode ? "Copied INITIAL_COURSES!" : "Copy INITIAL_COURSES JS Code"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}