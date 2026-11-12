import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  BookOpen, Play, CheckCircle2, Crown, Award, Flame, Search,
  ChevronRight, ChevronDown, Sparkles, Plus, Upload, Download,
  Trash2, Eye, Code, HelpCircle, RotateCcw, ArrowLeft,
  PenTool, Copy, Check, Video, FileCheck, AlertCircle, CheckSquare
} from 'lucide-react';

// ============================================================================
// 1. PURE CONTENT SCHEMA (Vaaler / Artin M 373K Outline + M 367K + M 365C)
// Zero progress fields live inside INITIAL_COURSES so re-importing never wipes progress.
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
// 2. KATEX MATH RENDERER (No script leaks — uses single global KaTeX in index.html)
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

      // Pure display mode when block=true and no $ delimiters exist
      if (block && !str.includes("$")) {
        try {
          window.katex.render(str, el, { displayMode: true, throwOnError: false });
          return;
        } catch {
          el.textContent = str;
          return;
        }
      }

      // Parse both $$...$$ and $...$ inline segments
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
// 3. CLAUDE PROMPT GENERATOR (String.raw guarantees valid double-escaped JSON!)
// ============================================================================
const getClaudePrompt = (targetCourseId = "m373k") => String.raw`You are an expert pure mathematics professor authoring course content for Axiom Academy ("M 373K: Algebraic Structures I", Vaaler / Artin syllabus).

CRITICAL JSON & LATEX ESCAPING RULES:
1. Output ONLY raw, valid JSON. Do NOT wrap in markdown code fences.
2. DOUBLE-ESCAPE ALL BACKSLASHES in JSON strings so JSON.parse() succeeds without turning \t, \f, \n, \b into control characters:
   - Write "\\frac{a}{b}", "\\times", "\\text{im}(\\varphi)", "\\neq", "\\blacksquare", "\\subseteq", "\\trianglelefteq", "\\mathbb{Z}/n\\mathbb{Z}".
3. Wrap all inline math in $...$ inside titles, captions, questions, options, optionExplanations, hints, rubric, and modelProof (e.g., "$A_4$", "$p^2$", "$\\Phi_a$ is a bijection").
4. In each step's "math" field, write pure double-escaped LaTeX WITHOUT $ delimiters.
5. Do NOT include any user progress fields (no earnedPoints, completed, or mastery fields).

VALID JSON SCHEMA EXAMPLE (Passes JSON.parse directly):
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
          },
          {
            "time": "07:30",
            "label": "Field Criterion via Non-Zero Ideals",
            "math": "R/M \\text{ is a field} \\iff \\text{only ideals of } R/M \\text{ are } (\\bar{0}) \\text{ and } R/M \\quad \\blacksquare",
            "caption": "A commutative ring with $1 \\neq 0$ is a field iff its only ideals are $(0)$ and the whole ring. Thus $R/M$ is a field iff no proper ideal $I$ strictly sits between $M$ and $R$."
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
              "Correct! By the First Isomorphism Theorem for rings, $\\mathbb{Z}[x]/(x) \\cong \\mathbb{Z}$, which is an integral domain (so $(x)$ is prime) but not a field (so $(x)$ is not maximal; e.g. $(x) \\subsetneq (2, x) \\subsetneq \\mathbb{Z}[x]$).",
              "Incorrect: $\\mathbb{Z}[x]/(x) \\cong \\mathbb{Z}$ is not a field because $2 \\in \\mathbb{Z}$ has no multiplicative inverse.",
              "Incorrect: Every maximal ideal in a commutative ring with $1$ is automatically prime.",
              "Incorrect: Since $\\mathbb{Z}$ is an integral domain, $(x)$ is a prime ideal."
            ],
            "hints": [
              "Evaluate the quotient ring $\\mathbb{Z}[x]/(x)$ using the evaluation homomorphism $\\text{ev}_0(f(x)) = f(0)$.",
              "Note that $\\mathbb{Z}[x]/(x) \\cong \\mathbb{Z}$.",
              "Is $\\mathbb{Z}$ an integral domain? Is $\\mathbb{Z}$ a field?"
            ]
          },
          {
            "id": "ex-max-2",
            "type": "proof",
            "question": "Prove that every finite integral domain $D$ is a field.",
            "hints": [
              "Let $a \\in D$ with $a \\neq 0$, and consider the left-multiplication map $\\lambda_a : D \\to D$ given by $\\lambda_a(x) = ax$.",
              "Use the cancellation property in an integral domain to prove $\\lambda_a$ is injective.",
              "Since $D$ is a finite set, what does injectivity of $\\lambda_a : D \\to D$ imply about surjectivity?"
            ],
            "rubric": [
              "Fix a non-zero element $a \\in D \\setminus \\{0\\}$ and define $\\lambda_a : D \\to D$ by $\\lambda_a(x) = ax$.",
              "Prove $\\lambda_a$ is injective: if $ax = ay$, then $a(x - y) = 0$; since $D$ is an integral domain and $a \\neq 0$, conclude $x = y$.",
              "Invoke the Pigeonhole Principle: any injective map from a finite set $D$ to itself is surjective.",
              "Since $1 \\in D$ is in the image of $\\lambda_a$, conclude there exists $b \\in D$ such that $ab = 1$, so $a$ is a unit and $D$ is a field."
            ],
            "modelProof": "Let $D$ be a finite integral domain and let $a \\in D$ with $a \\neq 0$. Define the map $\\lambda_a : D \\to D$ by $\\lambda_a(x) = ax$. Suppose $\\lambda_a(x) = \\lambda_a(y)$; then $ax = ay \\implies a(x - y) = 0$. Since $D$ has no zero divisors and $a \\neq 0$, we have $x - y = 0$, so $x = y$ and $\\lambda_a$ is injective. Because $D$ is a finite set, any injective map $\\lambda_a : D \\to D$ is also surjective. In particular, $1 \\in D$ lies in the image of $\\lambda_a$, so there exists $b \\in D$ such that $ab = \\lambda_a(b) = 1$. Thus every non-zero element of $D$ has a multiplicative inverse, proving $D$ is a field. $\\blacksquare$"
          }
        ]
      }
    ]
  }
}`;

// ============================================================================
// 4. MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // Courses state (Pure content only)
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

  // Separate Progress state (Never overwritten when courses update!)
  // Structure: { exercises: { [exId]: { level: 'mastered'|'familiar', attempts: 1 } }, points: 0, activeDays: [] }
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem("axiom_progress_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { exercises: {}, points: 0, streakDays: 0 };
      }
    }
    return { exercises: {}, points: 0, streakDays: 0 };
  });

  const [activeView, setActiveView] = useState("dashboard"); // "dashboard" | "course" | "lesson" | "studio"
  const [selectedCourseId, setSelectedCourseId] = useState("m373k");
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonTab, setLessonTab] = useState("blackboard"); // "blackboard" | "exercises"
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

  useEffect(() => {
    localStorage.setItem("axiom_courses_v2", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("axiom_progress_v2", JSON.stringify(progress));
  }, [progress]);

  const activeCourse = useMemo(
    () => courses.find((c) => c.id === selectedCourseId) || courses[0],
    [courses, selectedCourseId]
  );

  // Compute honest, real-time course mastery percentage from separated progress
  const getCourseStats = (course) => {
    let totalEx = 0;
    let earnedScore = 0;
    course.units?.forEach((u) =>
      u.lessons?.forEach((l) =>
        l.exercises?.forEach((ex) => {
          totalEx += 1;
          const status = progress.exercises?.[ex.id]?.level;
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

  // Record Exercise Mastery cleanly in separated progress store
  const recordExerciseResult = (exId, qualifiedForMastery) => {
    setProgress((prev) => {
      const existing = prev.exercises?.[exId]?.level;
      const newLevel = qualifiedForMastery
        ? "mastered"
        : existing === "mastered"
        ? "mastered"
        : "familiar";
      const ptsDelta = existing ? 25 : qualifiedForMastery ? 100 : 50;
      return {
        ...prev,
        points: (prev.points || 0) + ptsDelta,
        streakDays: Math.max(prev.streakDays || 0, 1),
        exercises: {
          ...(prev.exercises || {}),
          [exId]: { level: newLevel, updatedAt: Date.now() }
        }
      };
    });
  };

  // Scratchpad drawing handlers
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

  // Import JSON from Claude (Supports adding/replacing a unit or a full course without touching progress)
  const handleImportJson = () => {
    try {
      const cleaned = jsonInput.trim().replace(/^```json\s*/i, "").replace(/```$/, "");
      const parsed = JSON.parse(cleaned);

      if (parsed.targetCourseId && parsed.unit) {
        setCourses((prev) =>
          prev.map((c) => {
            if (c.id !== parsed.targetCourseId) return c;
            const exists = c.units.some((u) => u.id === parsed.unit.id);
            const updatedUnits = exists
              ? c.units.map((u) => (u.id === parsed.unit.id ? parsed.unit : u))
              : [...c.units, parsed.unit];
            return { ...c, units: updatedUnits };
          })
        );
        setSelectedCourseId(parsed.targetCourseId);
        setImportStatus({
          type: "success",
          msg: `Successfully imported "${parsed.unit.title}" into ${parsed.targetCourseId.toUpperCase()}! Your progress was preserved.`
        });
      } else if (parsed.id && parsed.title && Array.isArray(parsed.units)) {
        setCourses((prev) => {
          const exists = prev.some((c) => c.id === parsed.id);
          return exists ? prev.map((c) => (c.id === parsed.id ? parsed : c)) : [...prev, parsed];
        });
        setSelectedCourseId(parsed.id);
        setImportStatus({
          type: "success",
          msg: `Imported full course "${parsed.code || ""} ${parsed.title}"! Your progress was preserved.`
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
        msg: `JSON Parse Error: ${err.message}. Make sure all LaTeX backslashes are double-escaped (e.g. "\\\\frac").`
      });
    }
  };

  // Search filter across lessons & theorems
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
          TOP NAVIGATION BAR (Responsive, Accessible, Full-Width)
         =================================================================== */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Left: Courses Dropdown & Search */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
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
                    const st = getCourseStats(c);
                    return (
                      <button
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

            {/* Wide Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search theorems, cosets, rings..."
                className="bg-slate-100 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 w-44 sm:w-64 transition"
              />
              {searchResults.length > 0 && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                  {searchResults.map(({ course, lesson }) => (
                    <button
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

          {/* Right Navigation & Real Stats */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
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
                onClick={() => setActiveView("course")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  activeView === "course"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {activeCourse?.code || "M 373K"}
              </button>
            </div>

            <button
              onClick={() => setActiveView("studio")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
                activeView === "studio"
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Course Studio</span>
            </button>

            <div
              title="Real Streak (increments when you complete exercises)"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {progress.streakDays || 0}
            </div>

            <div
              title="Real Proof Points earned from exercises"
              className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-[#0b2149] text-white text-xs font-bold"
            >
              {progress.points || 0} pts
            </div>
          </div>
        </div>
      </header>

      {/* ===================================================================
          VIEW 1: LEARNER DASHBOARD (With Real Progress & Vaaler Syllabus)
         =================================================================== */}
      {activeView === "dashboard" && (
        <div>
          {/* Navy Hero Banner */}
          <div className="bg-[#0b2149] text-white py-10 px-6 border-b border-slate-800">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-900/60 border border-blue-400/30 flex items-center justify-center font-mono font-bold text-xl text-blue-200">
                  G/N
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold">
                    Axiom Academy Scholar
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-800/80 border border-blue-400/30 text-blue-200 font-medium">
                      {Object.keys(progress.exercises || {}).length} Exercises Completed
                    </span>
                    <span className="text-xs text-slate-300">
                      · Progress stored separately from course JSON
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    Claude Course Back-End
                  </div>
                  <div className="text-sm font-semibold text-white">
                    Ready to import Vaaler / Artin M 373K units?
                  </div>
                </div>
                <button
                  onClick={() => setActiveView("studio")}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shrink-0"
                >
                  Open Course Studio
                </button>
              </div>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-3 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
                Pure Math Workspace
              </div>
              <button
                onClick={() => setActiveView("dashboard")}
                className="w-full text-left px-3.5 py-2.5 rounded-lg bg-blue-50 text-blue-700 font-semibold text-sm flex items-center gap-2.5"
              >
                <BookOpen className="w-4 h-4" /> My Courses
              </button>
              <button
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
                    Select a course to study video lectures, blackboard derivations, and proof-writing exercises
                  </p>
                </div>
                <button
                  onClick={() => setActiveView("studio")}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add / Import Course via Claude
                </button>
              </div>

              <div className="space-y-4">
                {courses.map((course) => {
                  const stats = getCourseStats(course);
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
          VIEW 2: COURSE CURRICULUM VIEW (Vaaler / Artin Units & Lessons)
         =================================================================== */}
      {activeView === "course" && activeCourse && (
        <div className="max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {activeCourse.category}
              </div>
              <h1 className="text-2xl font-serif font-bold text-slate-900">
                {active