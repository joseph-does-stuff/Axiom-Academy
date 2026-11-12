import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Flame, Sparkles, ChevronDown, BookOpen, Play, FileText,
  CheckCircle2, Crown, Award, BarChart2, User, Users, Settings,
  Edit3, Trash2, ArrowRight, Check, X, Lightbulb, ThumbsUp,
  RotateCcw, ChevronRight, Compass, Award as Medal, Zap,
  PenTool, Eraser, Plus, Upload, Download, Copy, Code, Database,
  Layers, Terminal, Eye, FileJson, FolderPlus, RefreshCw
} from 'lucide-react';

// --- KATEX LIVE LATEX RENDERER ---
// Automatically loads KaTeX CSS & JS from CDN and renders inline ($...$) and block ($$...$$) LaTeX
const useKaTeX = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.katex) {
      setLoaded(true);
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    script.async = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, []);

  return loaded;
};

const MathText = ({ text, className = '', block = false }) => {
  const katexReady = useKaTeX();

  if (!text) return null;
  const str = String(text);

  // If block mode is explicitly passed and no $ delimiters exist, render whole string as display math
  if (block && !str.includes('$')) {
    if (katexReady && window.katex) {
      try {
        const html = window.katex.renderToString(str, {
          displayMode: true,
          throwOnError: false
        });
        return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
      } catch (e) {
        return <div className={`font-mono ${className}`}>{str}</div>;
      }
    }
    return <div className={`font-mono ${className}`}>{str}</div>;
  }

  // Parse mixed text containing $$...$$ or $...$
  const parts = str.split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g);

  return (
    <span className={className}>
      {parts.map((part, idx) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const math = part.slice(2, -2);
          if (katexReady && window.katex) {
            try {
              const html = window.katex.renderToString(math, {
                displayMode: true,
                throwOnError: false
              });
              return <span key={idx} className="block my-2" dangerouslySetInnerHTML={{ __html: html }} />;
            } catch (e) {
              return <code key={idx} className="block my-2 font-mono">{math}</code>;
            }
          }
          return <code key={idx} className="block my-2 font-mono text-indigo-900">{math}</code>;
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1);
          if (katexReady && window.katex) {
            try {
              const html = window.katex.renderToString(math, {
                displayMode: false,
                throwOnError: false
              });
              return <span key={idx} dangerouslySetInnerHTML={{ __html: html }} />;
            } catch (e) {
              return <code key={idx} className="font-mono">{math}</code>;
            }
          }
          return <code key={idx} className="font-mono text-indigo-800">{math}</code>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </span>
  );
};

// --- CLAUDE SYSTEM PROMPT TEMPLATE FOR SEAMLESS COURSE AUTHORING ---
const CLAUDE_PROMPT_TEMPLATE = `You are a Pure Mathematics Curriculum Architect for "Axiom Academy".
Generate a complete Course JSON object (or a single Unit JSON object) following this exact schema so I can paste it directly into the Axiom Academy JSON Importer.
Use rigorous upper-division/graduate definitions, theorems, proofs, and conceptual/counterexample exercises.
Wrap all inline math in $...$ (e.g., $\\ker(\\varphi) \\trianglelefteq G$) and display equations in $$...$$.

EXACT JSON SCHEMA REQUIRED:
{
  "id": "m373l-galois",
  "code": "M 373L",
  "title": "Algebraic Structures II: Fields & Galois Theory",
  "category": "Abstract Algebra",
  "level": "Upper-Division Proof-Based",
  "description": "Field extensions, algebraic closure, splitting fields, separable extensions, and the Fundamental Theorem of Galois Theory.",
  "units": [
    {
      "id": "u-gal-1",
      "number": 1,
      "title": "Unit 1: Field Extensions & Minimal Polynomials",
      "description": "Degree of an extension, tower law, algebraic vs. transcendental elements, and adjoining roots.",
      "totalPoints": 800,
      "earnedPoints": 0,
      "skills": [
        { "id": "sk-1", "name": "Tower Law & Extension Degrees", "level": 0 },
        { "id": "sk-2", "name": "Minimal Polynomials & Irreducibility", "level": 0 }
      ],
      "lessons": [
        {
          "id": "les-1",
          "title": "The Tower Law and Simple Extensions",
          "lecture": {
            "id": "lec-gal-1",
            "title": "Multiplicativity of Extension Degrees: [L:K] = [L:F][F:K]",
            "duration": "11:20",
            "completed": false,
            "points": 150,
            "description": "We prove the Tower Law by constructing an explicit K-basis for L from an F-basis of L and a K-basis of F.",
            "steps": [
              { "time": 0, "text": "Theorem: Let K \\subseteq F \\subseteq L be fields.", "color": "#38bdf8", "sub": "Then [L:K] = [L:F][F:K]." },
              { "time": 15, "text": "Let \\{\\alpha_1, \\dots, \\alpha_m\\} be a K-basis for F", "color": "#facc15", "sub": "and \\{\\beta_1, \\dots, \\beta_n\\} be an F-basis for L." },
              { "time": 30, "text": "Claim: \\{\\alpha_i \\beta_j\\}_{1 \\le i \\le m, 1 \\le j \\le n} is a K-basis for L.", "color": "#4ade80", "sub": "Spanning and K-linear independence follow by expanding coefficients." },
              { "time": 45, "text": "\\dim_K(L) = m \\cdot n = [L:F][F:K] \\quad \\blacksquare", "color": "#f472b6", "sub": "Q.E.D. Immediate corollary: degree of minimal polynomial divides [F:K]." }
            ],
            "transcript": [
              { "time": 0, "speaker": "Exposition", "text": "Suppose we have a tower of field extensions $K \\subseteq F \\subseteq L$. We can view $L$ as a vector space over $F$, and $F$ as a vector space over $K$." },
              { "time": 15, "speaker": "Basis Setup", "text": "Let $\\alpha_1, \\dots, \\alpha_m$ be a basis for $F$ over $K$, and let $\\beta_1, \\dots, \\beta_n$ be a basis for $L$ over $F$." },
              { "time": 30, "speaker": "Linear Independence", "text": "Any $x \\in L$ is $\\sum_j c_j \\beta_j$ with $c_j \\in F$, and each $c_j = \\sum_i a_{ij} \\alpha_i$ with $a_{ij} \\in K$. Thus the $mn$ products $\\alpha_i \\beta_j$ span $L$ over $K$." },
              { "time": 45, "speaker": "Conclusion", "text": "By uniqueness of coordinates in each basis, $\\sum_{i,j} a_{ij} \\alpha_i \\beta_j = 0$ forces all $a_{ij} = 0$. This proves $[L:K] = [L:F][F:K]$." }
            ]
          },
          "exercises": [
            {
              "id": "ex-gal-1",
              "title": "Computing Degrees of Composite Extensions",
              "status": "Not started",
              "level": 0,
              "points": 100,
              "questions": [
                {
                  "id": "q-gal-1",
                  "type": "numeric",
                  "topic": "Tower Law & Eisenstein's Criterion",
                  "prompt": "Compute the degree $[\\mathbb{Q}(\\sqrt{2}, \\sqrt[3]{5}) : \\mathbb{Q}]$.",
                  "equation": "[\\mathbb{Q}(\\sqrt{2}, \\sqrt[3]{5}) : \\mathbb{Q}] = \\text{?}",
                  "inputPrefix": "Degree =",
                  "correctAnswer": "6",
                  "explanation": "Since gcd(2, 3) = 1 and both [Q(sqrt(2)):Q]=2 and [Q(5^(1/3)):Q]=3 divide the degree, the Tower Law forces the degree to be 6.",
                  "hints": [
                    "Consider the subextensions $\\mathbb{Q}(\\sqrt{2})$ of degree $2$ and $\\mathbb{Q}(\\sqrt[3]{5})$ of degree $3$ over $\\mathbb{Q}$.",
                    "By the Tower Law, both $2$ and $3$ divide $d = [\\mathbb{Q}(\\sqrt{2}, \\sqrt[3]{5}) : \\mathbb{Q}]$, so $6 \\mid d$.",
                    "Since the extension is generated by roots of polynomials of degrees $2$ and $3$, $d \\le 2 \\cdot 3 = 6$. Hence $d = 6$."
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

Output ONLY valid JSON with no markdown code fences around it. My topic request is: [DESCRIBE YOUR COURSE OR UNIT TOPIC HERE, e.g., M 373K Sylow Theorems or M 367K Urysohn's Lemma]`;

// --- INITIAL RIGOROUS CURRICULUM DATA ---
const INITIAL_COURSES = [
  {
    id: 'm373k',
    code: 'M 373K',
    title: 'Algebraic Structures I',
    category: 'Abstract Algebra',
    level: 'Upper-Division Proof-Based',
    description: 'Groups, subgroups, cyclic & permutation groups, normal subgroups, quotient groups, homomorphisms, isomorphism theorems, group actions, Sylow theorems, and an introduction to rings and ideals.',
    units: [
      {
        id: 'm373k-u1',
        number: 1,
        title: 'Unit 1: Group Axioms, Subgroups & Lagrange’s Theorem',
        description: 'Binary operations, group axioms, uniqueness of identity & inverses, the one-step subgroup criterion, cosets, and Lagrange’s Theorem.',
        totalPoints: 800,
        earnedPoints: 620,
        skills: [
          { id: 's373-1', name: 'One-Step Subgroup Test ($ab^{-1} \\in H$)', level: 3 },
          { id: 's373-2', name: 'Centralizers, Center $Z(G)$ & Normalizers', level: 3 },
          { id: 's373-3', name: 'Coset Partitions & Lagrange’s Theorem', level: 2 }
        ],
        lessons: [
          {
            id: 'l373-1',
            title: 'Group Axioms, Subgroups & Coset Decomposition',
            lecture: {
              id: 'lec-lagrange',
              title: 'Lagrange’s Theorem & Coset Equinumerosity',
              duration: '12:40',
              completed: true,
              points: 150,
              description: 'We prove that for any finite group $G$ and subgroup $H \\le G$, the left cosets of $H$ partition $G$ into blocks of equal cardinality $|H|$, yielding $|G| = [G:H]|H|$.',
              steps: [
                {
                  time: 0,
                  text: '\\text{Theorem (Lagrange): Let } G \\text{ be finite and } H \\le G. \\text{ Then } |H| \\text{ divides } |G|.',
                  color: '#38bdf8',
                  sub: 'More precisely, |G| = [G : H] \\cdot |H| where [G : H] is the number of left cosets.'
                },
                {
                  time: 15,
                  text: 'a \\sim b \\iff a^{-1}b \\in H \\iff aH = bH',
                  color: '#facc15',
                  sub: 'Step 1: Verify ~ is an equivalence relation on G using the 3 subgroup axioms of H.'
                },
                {
                  time: 30,
                  text: '\\Phi_a : H \\longrightarrow aH, \\quad h \\longmapsto ah',
                  color: '#4ade80',
                  sub: 'Step 2: By left cancellation in G, \\Phi_a is a bijection for every a \\in G, so |aH| = |H|.'
                },
                {
                  time: 45,
                  text: '|G| = \\sum_{i=1}^{[G:H]} |a_i H| = [G:H] \\cdot |H| \\quad \\blacksquare',
                  color: '#f472b6',
                  sub: 'Step 3: Since G is the disjoint union of its [G:H] equivalence classes, each of size |H|, |H| divides |G|.'
                }
              ],
              transcript: [
                {
                  time: 0,
                  speaker: 'Theorem Statement',
                  text: 'Let $G$ be a finite group and let $H \\le G$ be a subgroup. Lagrange’s Theorem asserts that the order of $H$ divides the order of $G$, and in fact $|G| = [G:H]|H|$.'
                },
                {
                  time: 15,
                  speaker: 'Equivalence Relation',
                  text: 'Define a relation on $G$ by $a \\sim b$ if and only if $a^{-1}b \\in H$. Reflexivity holds since $e \\in H$; symmetry holds since $(a^{-1}b)^{-1} = b^{-1}a \\in H$; transitivity holds since $(a^{-1}b)(b^{-1}c) = a^{-1}c \\in H$.'
                },
                {
                  time: 30,
                  speaker: 'Bijection with H',
                  text: 'The equivalence class of $a$ is precisely the left coset $aH = \\{ah : h \\in H\\}$. The map $h \\mapsto ah$ is surjective by definition and injective by left cancellation ($ah_1 = ah_2 \\implies h_1 = h_2$).'
                },
                {
                  time: 45,
                  speaker: 'Counting Argument',
                  text: 'Because $G$ is partitioned into $[G:H]$ disjoint left cosets and every coset has cardinality $|H|$, summing their sizes gives $|G| = [G:H]|H|$. Q.E.D.'
                }
              ]
            },
            exercises: [
              {
                id: 'ex-373-u1',
                title: 'Subgroup Criteria, Cosets & Lagrange Consequences',
                status: 'Mastered',
                level: 3,
                points: 150,
                questions: [
                  {
                    id: 'q373-1',
                    type: 'multiple-choice',
                    topic: 'Converse of Lagrange & Counterexamples',
                    prompt: 'Let $G$ be a finite group of order $n$, and let $d \\mid n$. Which statement regarding subgroups of order $d$ is strictly TRUE?',
                    equation: 'H \\le G, \\quad |H| = d \\mid |G|',
                    options: [
                      { id: 'a', label: 'Every group G of order n has at least one subgroup of order d for every divisor d | n.' },
                      { id: 'b', label: 'The alternating group A_4 (order 12) has no subgroup of order 6, showing the converse of Lagrange’s Theorem is false.' },
                      { id: 'c', label: 'If H and K are subgroups of G, then HK is always a subgroup of G.' },
                      { id: 'd', label: 'Every group of order p^2 (p prime) is cyclic.' }
                    ],
                    correctAnswer: 'b',
                    explanation: 'A_4 has order 12 and contains eight 3-cycles. Any subgroup H of order 6 has index 2 (hence is normal) and would have to contain all squares of elements in A_4, which forces H to contain all eight 3-cycles + identity = 9 elements > 6, a contradiction!',
                    hints: [
                      'Recall that Lagrange’s Theorem states: if $H \\le G$, then $|H| \\mid |G|$. Does $d \\mid |G|$ guarantee a subgroup of order $d$ exists?',
                      'Consider the alternating group $A_4$ of even permutations on $4$ letters, which has order $4!/2 = 12$.',
                      'In $A_4$, there are eight $3$-cycles. Any subgroup of index $2$ (order $6$) must contain $g^2$ for all $g \\in A_4$, which includes all eight $3$-cycles—impossible in a group of order $6$!'
                    ]
                  },
                  {
                    id: 'q373-2',
                    type: 'numeric',
                    topic: 'Subgroups of Finite Index & Order of Elements',
                    prompt: 'Let $G = \\text{GL}_2(\\mathbb{F}_3)$ be the group of invertible $2 \\times 2$ matrices over the field $\\mathbb{F}_3 = \\mathbb{Z}/3\\mathbb{Z}$. What is the order $|G|$?',
                    equation: '|\\text{GL}_2(\\mathbb{F}_3)| = (3^2 - 1)(3^2 - 3) = \\text{?}',
                    inputPrefix: '|G| =',
                    correctAnswer: '48',
                    explanation: 'The first column can be any nonzero vector in (F_3)^2 (3^2 - 1 = 8 choices), and the second column can be any vector not in the span of the first (3^2 - 3 = 6 choices). Thus 8 * 6 = 48.',
                    hints: [
                      'A matrix in $\\text{GL}_2(\\mathbb{F}_3)$ is invertible if and only if its two columns are linearly independent over $\\mathbb{F}_3$.',
                      'The first column can be any non-zero vector in $\\mathbb{F}_3^2$, giving $3^2 - 1 = 8$ choices.',
                      'The second column cannot be any of the $3$ scalar multiples of the first column, giving $3^2 - 3 = 6$ choices. Multiply $8 \\times 6$.'
                    ]
                  },
                  {
                    id: 'q373-3',
                    type: 'multiple-choice',
                    topic: 'Index of Intersection of Subgroups',
                    prompt: 'Let $H, K \\le G$ be subgroups of finite index $[G:H] = m$ and $[G:K] = n$ with $\\gcd(m, n) = 1$. What can we conclude about $[G : H \\cap K]$?',
                    equation: '[G : H \\cap K] = \\text{?}',
                    options: [
                      { id: 'a', label: '[G : H \\cap K] = m + n' },
                      { id: 'b', label: '[G : H \\cap K] = mn' },
                      { id: 'c', label: '[G : H \\cap K] = 1' },
                      { id: 'd', label: 'H \\cap K is necessarily trivial' }
                    ],
                    correctAnswer: 'b',
                    explanation: 'By Poincaré’s inequality, [G : H ∩ K] ≤ [G:H][G:K] = mn. Also both m = [G:H] and n = [G:K] divide [G : H ∩ K]. Since gcd(m,n) = 1, mn divides [G : H ∩ K], forcing equality.',
                    hints: [
                      'Use the multiplicativity of index in towers: $[G : H \\cap K] = [G : H][H : H \\cap K] = [G : K][K : H \\cap K]$.',
                      'Thus both $m = [G:H]$ and $n = [G:K]$ divide $[G : H \\cap K]$. Since $\\gcd(m,n) = 1$, $mn$ divides $[G : H \\cap K]$.',
                      'Conversely, the map $g(H \\cap K) \\mapsto (gH, gK)$ injects $G/(H \\cap K) \\hookrightarrow G/H \\times G/K$, so $[G : H \\cap K] \\le mn$.'
                    ]
                  },
                  {
                    id: 'q373-4',
                    type: 'numeric',
                    topic: 'Union of Two Subgroups',
                    prompt: 'Suppose $H_1, H_2 \\le G$ are proper subgroups of a group $G$. What is the minimum number of proper subgroups required so that their set-theoretic union can equal all of $G$? (Hint: $H_1 \\cup H_2 = G$ is impossible; consider the Klein $4$-group $V_4 = \\mathbb{Z}/2\\mathbb{Z} \\times \\mathbb{Z}/2\\mathbb{Z}$.)',
                    equation: 'G = \\bigcup_{i=1}^{k} H_i \\quad (H_i \\lneq G) \\implies k_{\\min} = \\text{?}',
                    inputPrefix: 'k_min =',
                    correctAnswer: '3',
                    explanation: 'A group is never the union of 2 proper subgroups (if h_1 in H_1 \\ H_2 and h_2 in H_2 \\ H_1, then h_1 h_2 cannot lie in either). However, the Klein 4-group V_4 is the union of its 3 proper subgroups of order 2!',
                    hints: [
                      'First verify $k=2$ is impossible: if $G = H_1 \\cup H_2$ with $H_1, H_2 \\lneq G$, pick $x \\in H_1 \\setminus H_2$ and $y \\in H_2 \\setminus H_1$. Then $xy \\notin H_1$ and $xy \\notin H_2$.',
                      'Now test $k=3$ using $G = \\mathbb{Z}/2\\mathbb{Z} \\times \\mathbb{Z}/2\\mathbb{Z} = \\{e, a, b, ab\\}$.',
                      'The three subgroups $\\langle a \\rangle, \\langle b \\rangle, \\langle ab \\rangle$ of order $2$ cover all $4$ elements of $V_4$.'
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'm373k-u2',
        number: 2,
        title: 'Unit 2: Cyclic Groups, Permutations & Alternating Groups $A_n$',
        description: 'Classification of cyclic groups, Euler’s totient $\\varphi(n)$, cycle decomposition in $S_n$, sign homomorphism $\\text{sgn}: S_n \\to \\{\\pm 1\\}$, and simplicity of $A_n$.',
        totalPoints: 850,
        earnedPoints: 500,
        skills: [
          { id: 's373-4', name: 'Subgroup Lattice of $\\mathbb{Z}/n\\mathbb{Z}$ & Generators', level: 3 },
          { id: 's373-5', name: 'Disjoint Cycle Decomposition & Conjugacy in $S_n$', level: 2 },
          { id: 's373-6', name: 'Parity, Transpositions & Alternating Group $A_n$', level: 2 }
        ],
        lessons: [
          {
            id: 'l373-2',
            title: 'Cycle Structure & Conjugacy Classes in $S_n$',
            lecture: {
              id: 'lec-sn-conj',
              title: 'Conjugation in $S_n$: $\\tau (i_1 \\dots i_k) \\tau^{-1} = (\\tau(i_1) \\dots \\tau(i_k))$',
              duration: '10:15',
              completed: true,
              points: 150,
              description: 'We prove that two permutations in $S_n$ are conjugate if and only if they have the exact same cycle type, establishing a bijection between conjugacy classes of $S_n$ and integer partitions of $n$.',
              steps: [
                {
                  time: 0,
                  text: '\\text{Proposition: For } \\sigma = (i_1 \\; i_2 \\; \\dots \\; i_k) \\in S_n \\text{ and } \\tau \\in S_n,',
                  color: '#38bdf8',
                  sub: '\\tau \\sigma \\tau^{-1} = (\\tau(i_1) \\; \\tau(i_2) \\; \\dots \\; \\tau(i_k)).'
                },
                {
                  time: 18,
                  text: '(\\tau \\sigma \\tau^{-1})(\\tau(i_r)) = \\tau(\\sigma(i_r)) = \\tau(i_{r+1})',
                  color: '#facc15',
                  sub: 'Proof: Evaluate directly on elements of the form \\tau(i_r) and on fixed points.'
                },
                {
                  time: 34,
                  text: '\\sigma_1 \\sim \\sigma_2 \\text{ in } S_n \\iff \\text{cycleType}(\\sigma_1) = \\text{cycleType}(\\sigma_2)',
                  color: '#4ade80',
                  sub: 'Since conjugation is a ring/group automorphism of S_n, it commutes with products of disjoint cycles.'
                },
                {
                  time: 48,
                  text: '|\\text{Cl}(S_n)| = p(n) \\quad (\\text{number of partitions of } n) \\quad \\blacksquare',
                  color: '#f472b6',
                  sub: 'Example: S_4 has p(4) = 5 conjugacy classes corresponding to 1+1+1+1, 2+1+1, 2+2, 3+1, 4.'
                }
              ],
              transcript: [
                {
                  time: 0,
                  speaker: 'Conjugating a Cycle',
                  text: 'Let $\\sigma = (i_1 \\; i_2 \\; \\dots \\; i_k)$ be a $k$-cycle in $S_n$ and let $\\tau \\in S_n$ be any permutation. How does $\\tau \\sigma \\tau^{-1}$ act on $\{1, \\dots, n\}$?'
                },
                {
                  time: 18,
                  speaker: 'Direct Verification',
                  text: 'If we feed $\\tau(i_r)$ into $\\tau \\sigma \\tau^{-1}$, the $\\tau^{-1}$ maps it back to $i_r$, $\\sigma$ sends $i_r \\mapsto i_{r+1}$, and $\\tau$ sends $i_{r+1} \\mapsto \\tau(i_{r+1})$.'
                },
                {
                  time: 34,
                  speaker: 'Cycle Type Invariance',
                  text: 'Because conjugation $g \\mapsto \\tau g \\tau^{-1}$ is an automorphism, a product of disjoint cycles of lengths $\\lambda_1, \\dots, \\lambda_m$ conjugates to another product of disjoint cycles of the exact same lengths.'
                },
                {
                  time: 48,
                  speaker: 'Partitions of n',
                  text: 'Conversely, any two permutations with the same cycle type can be conjugated into each other by aligning their cycle entries and defining $\\tau$ accordingly.'
                }
              ]
            },
            exercises: [
              {
                id: 'ex-373-u2',
                title: 'Cyclic Generators, Cycle Types & Centralizers in $S_n$',
                status: 'Proficient',
                level: 2,
                points: 120,
                questions: [
                  {
                    id: 'q373-u2-1',
                    type: 'numeric',
                    topic: 'Generators of Subgroups of Cyclic Groups',
                    prompt: 'Let $G = \\langle g \\rangle$ be a cyclic group of order $36$. How many elements of $G$ have order strictly equal to $12$?',
                    equation: '|\\{x \\in C_{36} : |x| = 12\\}| = \\varphi(12) = \\text{?}',
                    inputPrefix: 'Count =',
                    correctAnswer: '4',
                    explanation: 'A cyclic group of order n has a unique subgroup of order d for each divisor d | n, which is itself cyclic of order d and therefore contains φ(d) elements of order d. Here φ(12) = 12(1 - 1/2)(1 - 1/3) = 4.',
                    hints: [
                      'In a cyclic group $C_{36}$, there is a unique subgroup $H$ of order $12$, generated by $g^{36/12} = g^3$.',
                      'Every element of order $12$ in $C_{36}$ must generate $H \\cong C_{12}$.',
                      'The number of generators of $C_{12}$ is Euler’s totient $\\varphi(12) = 12(1 - \\frac{1}{2})(1 - \\frac{1}{3})$.'
                    ]
                  },
                  {
                    id: 'q373-u2-2',
                    type: 'numeric',
                    topic: 'Maximal Order in Symmetric Group S_n (Landau’s Function)',
                    prompt: 'What is the maximum possible order of an element $\\sigma \\in S_7$?',
                    equation: '\\max_{\\sigma \\in S_7} |\\sigma| = \\max_{\\sum \\lambda_i = 7} \\text{lcm}(\\lambda_1, \\dots, \\lambda_k) = \\text{?}',
                    inputPrefix: 'Max order =',
                    correctAnswer: '12',
                    explanation: 'The order of a permutation is the lcm of its disjoint cycle lengths. Partitioning 7 = 3 + 4 gives lcm(3, 4) = 12, which is the maximum over all partitions of 7.',
                    hints: [
                      'If $\\sigma$ has disjoint cycle lengths $\\lambda_1, \\dots, \\lambda_k$ with $\\sum \\lambda_i \\le 7$, then $|\\sigma| = \\text{lcm}(\\lambda_1, \\dots, \\lambda_k)$.',
                      'Compare the partitions of $7$: $7$ gives $7$; $6+1$ gives $6$; $5+2$ gives $10$; $4+3$ gives $\\text{lcm}(4,3) = 12$.'
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'm373k-u3',
        number: 3,
        title: 'Unit 3: Normal Subgroups, Quotients & Isomorphism Theorems',
        description: 'Normal subgroups $N \\trianglelefteq G$, quotient groups $G/N$, kernels and images, and the First, Second, Third, and Lattice (Fourth) Isomorphism Theorems.',
        totalPoints: 1000,
        earnedPoints: 420,
        skills: [
          { id: 's373-7', name: 'Normal Subgroup Equivalences ($gNg^{-1} = N$)', level: 2 },
          { id: 's373-8', name: 'First Isomorphism Theorem ($G/\\ker \\varphi \\cong \\text{Im}\\,\\varphi$)', level: 2 },
          { id: 's373-9', name: 'Correspondence (Lattice) & Third Isomorphism Theorem', level: 1 }
        ],
        lessons: [
          {
            id: 'l373-3',
            title: 'The First Isomorphism Theorem & Universal Property of Quotients',
            lecture: {
              id: 'lec-iso1',
              title: 'First Isomorphism Theorem: $G/\\ker(\\varphi) \\cong \\text{Im}(\\varphi)$',
              duration: '14:05',
              completed: false,
              points: 150,
              description: 'We prove that for any group homomorphism $\\varphi: G \\to H$, the kernel $K = \\ker(\\varphi)$ is a normal subgroup of $G$ and the induced map $\\overline{\\varphi}: G/K \\to \\text{Im}(\\varphi)$ is a well-defined isomorphism.',
              steps: [
                {
                  time: 0,
                  text: '\\text{Theorem: Let } \\varphi: G \\to H \\text{ be a homomorphism and } K = \\ker(\\varphi).',
                  color: '#38bdf8',
                  sub: 'Then K \\trianglelefteq G and \\overline{\\varphi}(gK) = \\varphi(g) defines an isomorphism G/K \\cong \\text{Im}(\\varphi).'
                },
                {
                  time: 16,
                  text: 'gK = g\'K \\iff g^{-1}g\' \\in K \\iff \\varphi(g^{-1}g\') = e_H \\iff \\varphi(g) = \\varphi(g\')',
                  color: '#facc15',
                  sub: 'Crucial Equivalence: Going left-to-right proves \\overline{\\varphi} is well-defined; right-to-left proves injectivity!'
                },
                {
                  time: 32,
                  text: '\\overline{\\varphi}((g_1 K)(g_2 K)) = \\overline{\\varphi}(g_1 g_2 K) = \\varphi(g_1 g_2) = \\varphi(g_1)\\varphi(g_2)',
                  color: '#4ade80',
                  sub: 'Homomorphism property of \\overline{\\varphi} follows immediately from the definition of coset multiplication.'
                },
                {
                  time: 48,
                  text: 'G / \\ker(\\varphi) \\xrightarrow{\\;\\sim\\;} \\text{Im}(\\varphi) \\le H \\quad \\blacksquare',
                  color: '#f472b6',
                  sub: 'Surjectivity onto Im(\\varphi) is immediate. Thus \\overline{\\varphi} is a bijective homomorphism.'
                }
              ],
              transcript: [
                {
                  time: 0,
                  speaker: 'Setup',
                  text: 'Let $\\varphi: G \\to H$ be a group homomorphism with kernel $K = \\ker(\\varphi) = \\{k \\in G : \\varphi(k) = e_H\\}$. Since $\\varphi(gkg^{-1}) = \\varphi(g)e_H\\varphi(g)^{-1} = e_H$, $K$ is automatically normal in $G$.'
                },
                {
                  time: 16,
                  speaker: 'Well-Definedness & Injectivity',
                  text: 'Look at the chain of if-and-only-if statements: $gK = g\'K \\iff g^{-1}g\' \\in \\ker(\\varphi) \\iff \\varphi(g) = \\varphi(g\')$. Reading rightward proves $\\overline{\\varphi}$ is independent of coset representative; reading leftward proves $\\overline{\\varphi}$ is injective!'
                },
                {
                  time: 32,
                  speaker: 'Homomorphism Check',
                  text: 'Because $K \\trianglelefteq G$, the product of cosets $(g_1K)(g_2K)$ is $g_1g_2K$, and $\\overline{\\varphi}(g_1g_2K) = \\varphi(g_1g_2) = \\varphi(g_1)\\varphi(g_2) = \\overline{\\varphi}(g_1K)\\overline{\\varphi}(g_2K)$.'
                },
                {
                  time: 48,
                  speaker: 'Canonical Decomposition',
                  text: 'Every group homomorphism $\\varphi: G \\to H$ factors canonically through the quotient projection $\\pi: G \\twoheadrightarrow G/\\ker(\\varphi)$ followed by an isomorphism onto $\\text{Im}(\\varphi)$.'
                }
              ]
            },
            exercises: [
              {
                id: 'ex-373-u3',
                title: 'Quotient Groups & Isomorphism Theorem Proofs',
                status: 'Familiar',
                level: 1,
                points: 100,
                questions: [
                  {
                    id: 'q373-u3-1',
                    type: 'multiple-choice',
                    topic: 'G/Z(G) Cyclic Implies G Abelian',
                    prompt: 'Let $G$ be a group with center $Z(G)$. Suppose the quotient group $G / Z(G)$ is cyclic. Which statement must hold?',
                    equation: 'G / Z(G) = \\langle g Z(G) \\rangle \\implies \\text{?}',
                    options: [
                      { id: 'a', label: 'G must be abelian (so Z(G) = G and G/Z(G) is actually trivial).' },
                      { id: 'b', label: 'G must be cyclic.' },
                      { id: 'c', label: 'G can be non-abelian of order p^3.' },
                      { id: 'd', label: 'Z(G) must be trivial.' }
                    ],
                    correctAnswer: 'a',
                    explanation: 'If G/Z(G) = <gZ(G)>, every element of G has the form g^k z for some integer k and z in Z(G). Any two elements g^a z_1 and g^b z_2 commute because powers of g commute with each other and z_1, z_2 commute with everything!',
                    hints: [
                      'Let $G/Z(G) = \\langle g Z(G) \\rangle$. Then every coset is $(gZ(G))^k = g^k Z(G)$ for some $k \\in \\mathbb{Z}$.',
                      'Hence any two elements $x, y \\in G$ can be written as $x = g^a z_1$ and $y = g^b z_2$ with $z_1, z_2 \\in Z(G)$.',
                      'Compute $xy = (g^a z_1)(g^b z_2) = g^{a+b} z_1 z_2 = (g^b z_2)(g^a z_1) = yx$. Therefore $G$ is abelian!'
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'm373k-u4',
        number: 4,
        title: 'Unit 4: Group Actions, Class Equation, Sylow Theorems & Rings',
        description: 'Orbit-Stabilizer Theorem, the Class Equation, $p$-groups have non-trivial center, Sylow’s Three Theorems ($n_p \\equiv 1 \\pmod p$), and Ring Ideals.',
        totalPoints: 1100,
        earnedPoints: 200,
        skills: [
          { id: 's373-10', name: 'Orbit-Stabilizer & Class Equation ($|G| = |Z(G)| + \\sum [G:C_G(x_i)]$)', level: 1 },
          { id: 's373-11', name: 'Sylow’s Theorems & Simple Group Classification', level: 0 },
          { id: 's373-12', name: 'Rings, Maximal/Prime Ideals & Quotient Fields $R/M$', level: 0 }
        ],
        lessons: [
          {
            id: 'l373-4',
            title: 'Sylow’s Theorems & Proving Groups Are Not Simple',
            lecture: {
              id: 'lec-sylow',
              title: 'Sylow’s Theorems: $n_p \\equiv 1 \\pmod p$ and $n_p \\mid m$',
              duration: '15:30',
              completed: false,
              points: 150,
              description: 'Let $|G| = p^k m$ with $p \\nmid m$. We analyze the action of $G$ by conjugation on the set $\\text{Syl}_p(G)$ of Sylow $p$-subgroups and show how $n_p = 1$ forces a unique normal Sylow $p$-subgroup.',
              steps: [
                {
                  time: 0,
                  text: '\\text{Let } |G| = p^k m \\text{ with } p \\nmid m, \\text{ and } n_p = |\\text{Syl}_p(G)|.',
                  color: '#38bdf8',
                  sub: 'Sylow I: Syl_p(G) is non-empty. Sylow II: All Sylow p-subgroups are conjugate in G.'
                },
                {
                  time: 16,
                  text: 'n_p \\equiv 1 \\pmod p \\quad \\text{and} \\quad n_p = [G : N_G(P)] \\mid m',
                  color: '#facc15',
                  sub: 'Sylow III gives tight arithmetic constraints on the number n_p of Sylow p-subgroups.'
                },
                {
                  time: 32,
                  text: 'n_p = 1 \\iff P \\trianglelefteq G \\quad (\\text{for } P \\in \\text{Syl}_p(G))',
                  color: '#4ade80',
                  sub: 'Because gPg^{-1} is also a Sylow p-subgroup, uniqueness forces gPg^{-1} = P for all g \\in G.'
                },
                {
                  time: 48,
                  text: '\\text{Example: } |G| = 15 = 3 \\cdot 5 \\implies n_5 = 1 \\text{ and } n_3 = 1 \\implies G \\cong \\mathbb{Z}/15\\mathbb{Z} \\;\\blacksquare',
                  color: '#f472b6',
                  sub: 'Since n_5 | 3 and n_5 = 1 (mod 5), n_5 = 1; similarly n_3 | 5 and n_3 = 1 (mod 3), so n_3 = 1.'
                }
              ],
              transcript: [
                {
                  time: 0,
                  speaker: 'Sylow Setup',
                  text: 'Write the order of a finite group $G$ as $|G| = p^k m$ where $p$ is prime and $p \\nmid m$. A subgroup of order $p^k$ is called a Sylow $p$-subgroup.'
                },
                {
                  time: 16,
                  speaker: 'Arithmetic Constraints',
                  text: 'By Sylow’s Third Theorem, the number $n_p$ of Sylow $p$-subgroups satisfies $n_p \\equiv 1 \\pmod p$ and $n_p$ divides $m = |G|/p^k$.'
                },
                {
                  time: 32,
                  speaker: 'Normality Criterion',
                  text: 'Since all Sylow $p$-subgroups are conjugate to one another, $P \\in \\text{Syl}_p(G)$ is normal in $G$ if and only if $n_p = 1$.'
                },
                {
                  time: 48,
                  speaker: 'Groups of Order pq',
                  text: 'For $|G| = 15 = 3 \\cdot 5$, $n_5 \\mid 3$ and $n_5 \\equiv 1 \\pmod 5 \\implies n_5 = 1$. Likewise $n_3 = 1$. Thus $G \\cong C_3 \\times C_5 \\cong C_{15}$.'
                }
              ]
            },
            exercises: [
              {
                id: 'ex-373-u4',
                title: 'Sylow Counting & Maximal/Prime Ideals in Rings',
                status: 'Not started',
                level: 0,
                points: 100,
                questions: [
                  {
                    id: 'q373-u4-1',
                    type: 'numeric',
                    topic: 'Sylow p-Subgroups of Simple Group of Order 60',
                    prompt: 'Suppose $G$ is a simple group of order $60 = 2^2 \\cdot 3 \\cdot 5$ (such as $A_5$). How many Sylow $5$-subgroups ($n_5$) must $G$ have?',
                    equation: 'n_5 \\equiv 1 \\pmod 5, \\quad n_5 \\mid 12, \\quad n_5 > 1 \\implies n_5 = \\text{?}',
                    inputPrefix: 'n_5 =',
                    correctAnswer: '6',
                    explanation: 'By Sylow III, n_5 divides 12 and n_5 ≡ 1 (mod 5). The divisors of 12 are 1, 2, 3, 4, 6, 12. Only 1 and 6 are ≡ 1 (mod 5). Since G is simple, n_5 cannot be 1, so n_5 = 6.',
                    hints: [
                      'Write $60 = 5^1 \\cdot 12$. By Sylow’s Third Theorem, $n_5 \\mid 12$ and $n_5 \\equiv 1 \\pmod 5$.',
                      'List the divisors of $12$: $1, 2, 3, 4, 6, 12$. Which of these leave remainder $1$ when divided by $5$?',
                      'Only $1$ and $6$ satisfy both conditions. Since $G$ is simple, $n_5 \\neq 1$, leaving $n_5 = 6$.'
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'm367k',
    code: 'M 367K',
    title: 'Topology I (Point-Set & Algebraic Intro)',
    category: 'Topology',
    level: 'Upper-Division Proof-Based',
    description: 'Topological spaces, bases and subbases, closure and interior, continuous maps, product and quotient topologies, connectedness, compactness, and separation axioms ($T_0$ through $T_4$).',
    units: [
      {
        id: 'm367k-u1',
        number: 1,
        title: 'Unit 1: Topological Spaces, Bases, Closure & Limit Points',
        description: 'Open sets, basis criterion, standard vs. lower-limit ($\\mathbb{R}_\\ell$) vs. Zariski topologies, closure $\\overline{A} = A \\cup A\'$, and Hausdorff ($T_2$) spaces.',
        totalPoints: 750,
        earnedPoints: 300,
        skills: [
          { id: 's367-1', name: 'Basis Recognition Criterion ($B_3 \\subseteq B_1 \\cap B_2$)', level: 2 },
          { id: 's367-2', name: 'Closure, Limit Points $A\'$ & Dense Subsets', level: 2 },
          { id: 's367-3', name: 'Sorgenfrey Line $\\mathbb{R}_\\ell$ & Co-finite Topology', level: 1 }
        ],
        lessons: [
          {
            id: 'l367-1',
            title: 'Bases for a Topology & Comparing Finer/Coarser Topologies',
            lecture: {
              id: 'lec-topo-basis',
              title: 'Basis Criterion & Comparing $\\mathbb{R}_{\\text{std}}$ vs. Sorgenfrey Line $\\mathbb{R}_\\ell$',
              duration: '11:45',
              completed: true,
              points: 150,
              description: 'We characterize when a collection $\\mathcal{B} \\subseteq \\mathcal{P}(X)$ is a basis for a topology on $X$ and prove that the lower-limit topology $\\mathbb{R}_\\ell$ is strictly finer than the standard Euclidean topology on $\\mathbb{R}$.',
              steps: [
                {
                  time: 0,
                  text: '\\text{Basis Axioms: (1) } X = \\bigcup_{B \\in \\mathcal{B}} B, \\quad (2) \\; x \\in B_1 \\cap B_2 \\implies \\exists B_3 \\in \\mathcal{B}, \\; x \\in B_3 \\subseteq B_1 \\cap B_2.',
                  color: '#38bdf8',
                  sub: 'The topology \\mathcal{T}_{\\mathcal{B}} generated by \\mathcal{B} consists of all arbitrary unions of elements of \\mathcal{B}.'
                },
                {
                  time: 18,
                  text: '\\mathcal{T}\' \\text{ is finer than } \\mathcal{T} \\iff \\forall x \\in B \\in \\mathcal{B}, \\; \\exists B\' \\in \\mathcal{B}\' \\text{ with } x \\in B\' \\subseteq B',
                  color: '#facc15',
                  sub: 'Munkres Lemma 13.3: Local basis containment is equivalent to global topology inclusion \\mathcal{T} \\subseteq \\mathcal{T}\'.'
                },
                {
                  time: 34,
                  text: '\\mathcal{B}_\\ell = \\{[a, b) : a < b\\} \\implies [x, b) \\subseteq (a, b) \\text{ for } x \\in (a, b)',
                  color: '#4ade80',
                  sub: 'Hence every standard open interval (a, b) is open in \\mathbb{R}_\\ell, so \\mathcal{T}_{\\text{std}} \\subseteq \\mathcal{T}_\\ell.'
                },
                {
                  time: 48,
                  text: '[a, b) \\notin \\mathcal{T}_{\\text{std}} \\implies \\mathcal{T}_{\\text{std}} \\subsetneq \\mathcal{T}_\\ell \\quad \\blacksquare',
                  color: '#f472b6',
                  sub: 'Because the point a \\in [a, b) admits no open interval (c, d) with a \\in (c, d) \\subseteq [a, b).'
                }
              ],
              transcript: [
                {
                  time: 0,
                  speaker: 'Basis Definition',
                  text: 'A collection $\\mathcal{B}$ of subsets of $X$ is a basis for a topology if it covers $X$ and for any intersection $B_1 \\cap B_2$ containing $x$, there is a basis element $B_3$ with $x \\in B_3 \\subseteq B_1 \\cap B_2$.'
                },
                {
                  time: 18,
                  speaker: 'Comparing Topologies',
                  text: 'Given two bases $\\mathcal{B}$ and $\\mathcal{B}\'$, the topology $\\mathcal{T}\'$ is finer than $\\mathcal{T}$ if and only if for every $B \\in \\mathcal{B}$ and $x \\in B$, we can fit a $B\' \\in \\mathcal{B}\'$ inside: $x \\in B\' \\subseteq B$.'
                },
                {
                  time: 34,
                  speaker: 'Sorgenfrey Line',
                  text: 'On the Sorgenfrey line $\\mathbb{R}_\\ell$, the basis consists of half-open intervals $[a, b)$. Given $x \\in (a, b)$, we have $x \\in [x, b) \\subseteq (a, b)$.'
                },
                {
                  time: 48,
                  speaker: 'Strict Inclusion',
                  text: 'However, no open interval $(c, d)$ containing $a$ can fit inside $[a, b)$. Thus $\\mathbb{R}_\\ell$ is strictly finer than $\\mathbb{R}_{\\text{std}}$.'
                }
              ]
            },
            exercises: [
              {
                id: 'ex-367-u1',
                title: 'Closure, Limit Points & Topological Counterexamples',
                status: 'Proficient',
                level: 2,
                points: 120,
                questions: [
                  {
                    id: 'q367-1',
                    type: 'multiple-choice',
                    topic: 'Closure vs. Limit Points in General Topological Spaces',
                    prompt: 'Let $X$ be a topological space and let $A \\subseteq X$. Which identity always holds for the closure $\\overline{A}$ in ANY topological space?',
                    equation: 'x \\in \\overline{A} \\iff \\text{?}',
                    options: [
                      { id: 'a', label: 'Every open neighborhood U of x intersects A (i.e., U \\cap A \\neq \\emptyset).' },
                      { id: 'b', label: 'There exists a sequence (x_n) in A converging to x.' },
                      { id: 'c', label: 'Every neighborhood of x contains infinitely many points of A.' },
                      { id: 'd', label: 'The closure of an open ball B_r(x) always equals the closed ball \\overline{B}_r(x).' }
                    ],
                    correctAnswer: 'a',
                    explanation: 'By definition, x is in the closure of A iff x is not in the interior of X \\ A, meaning every open neighborhood U of x has U ∩ A ≠ ∅. Sequence convergence only characterizes closure in first-countable (or sequential) spaces!',
                    hints: [
                      'Recall that $\\overline{A}$ is the intersection of all closed sets containing $A$.',
                      'Taking complements, $x \\notin \\overline{A}$ if and only if there is an open set $U$ containing $x$ such that $U \\cap A = \\emptyset$.',
                      'Negating this gives: $x \\in \\overline{A} \\iff \\forall \\text{ open } U \\ni x, \\; U \\cap A \\neq \\emptyset$.'
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'm367k-u2',
        number: 2,
        title: 'Unit 2: Continuity, Product/Quotient Topologies & Compactness',
        description: 'Universal property of product & quotient topologies, connectedness, intermediate value theorem, Heine-Borel, and compact-to-Hausdorff closed map theorem.',
        totalPoints: 900,
        earnedPoints: 0,
        skills: [
          { id: 's367-4', name: 'Box vs. Product Topology on $\\mathbb{R}^\\omega$', level: 0 },
          { id: 's367-5', name: 'Compactness, Tube Lemma & Compact $\\to$ Hausdorff', level: 0 }
        ],
        lessons: [
          {
            id: 'l367-2',
            title: 'Bijective Continuous Maps from Compact to Hausdorff Spaces',
            lecture: {
              id: 'lec-comp-haus',
              title: 'Theorem: Continuous Bijection $f: X_{\\text{compact}} \\to Y_{\\text{Hausdorff}}$ is a Homeomorphism',
              duration: '9:50',
              completed: false,
              points: 150,
              description: 'One of the most useful tools in topology: to prove a continuous bijection from a compact space to a Hausdorff space has a continuous inverse, we need only trace closed subsets through the chain Closed $\\implies$ Compact $\\implies$ Compact Image $\\implies$ Closed.',
              steps: [
                {
                  time: 0,
                  text: '\\text{Theorem: Let } f: X \\to Y \\text{ be a continuous bijection, } X \\text{ compact, } Y \\text{ Hausdorff. }',
                  color: '#38bdf8',
                  sub: 'Then f is a homeomorphism (i.e., f^{-1} is automatically continuous).'
                },
                {
                  time: 16,
                  text: 'C \\subseteq X \\text{ closed } \\underset{X \\text{ compact}}{\\Longrightarrow} C \\text{ compact}',
                  color: '#facc15',
                  sub: 'Step 1: Every closed subspace of a compact space is compact.'
                },
                {
                  time: 32,
                  text: 'C \\text{ compact } \\underset{f \\text{ continuous}}{\\Longrightarrow} f(C) \\subseteq Y \\text{ compact}',
                  color: '#4ade80',
                  sub: 'Step 2: The continuous image of a compact space is compact.'
                },
                {
                  time: 48,
                  text: 'f(C) \\text{ compact } \\underset{Y \\text{ Hausdorff}}{\\Longrightarrow} f(C) \\text{ closed in } Y \\quad \\blacksquare',
                  color: '#f472b6',
                  sub: 'Step 3: Every compact subspace of a Hausdorff space is closed. Thus f is a closed map, hence a homeomorphism!'
                }
              ],
              transcript: [
                {
                  time: 0,
                  speaker: 'Goal',
                  text: 'Let $f: X \\to Y$ be a continuous bijection where $X$ is compact and $Y$ is Hausdorff. To show $f^{-1}$ is continuous, it suffices to show $f$ maps closed sets in $X$ to closed sets in $Y$.'
                },
                {
                  time: 16,
                  speaker: 'Closed in Compact',
                  text: 'Let $C \\subseteq X$ be closed. Because $X$ is compact, any open cover of $C$ can be augmented by $X \\setminus C$ to cover $X$, so $C$ is compact.'
                },
                {
                  time: 32,
                  speaker: 'Continuous Image',
                  text: 'Because $f: X \\to Y$ is continuous, the image $f(C)$ is a compact subspace of $Y$.'
                },
                {
                  time: 48,
                  speaker: 'Compact in Hausdorff',
                  text: 'Finally, in any Hausdorff space $Y$, every compact subset is closed. Hence $f(C)$ is closed in $Y$, proving $f$ is a homeomorphism!'
                }
              ]
            },
            exercises: [
              {
                id: 'ex-367-u2',
                title: 'Compactness, Connectedness & Product Topologies',
                status: 'Not started',
                level: 0,
                points: 100,
                questions: [
                  {
                    id: 'q367-2',
                    type: 'multiple-choice',
                    topic: 'Closed Subsets & Compactness in Hausdorff Spaces',
                    prompt: 'Let $Y$ be a topological space in which every compact subspace is closed. Which separation axiom is the classic sufficient condition guaranteeing this property?',
                    equation: 'K \\subseteq Y \\text{ compact } \\implies K \\text{ closed in } Y',
                    options: [
                      { id: 'a', label: 'Y is Hausdorff (T_2).' },
                      { id: 'b', label: 'Y is T_0 (Kolmogorov).' },
                      { id: 'c', label: 'Y is connected.' },
                      { id: 'd', label: 'Y is separable.' }
                    ],
                    correctAnswer: 'a',
                    explanation: 'In a Hausdorff (T_2) space, for any y not in K and each x in K, we can separate x and y by disjoint neighborhoods U_x and V_x. Finitely many U_{x_i} cover K, and the intersection of the corresponding V_{x_i} is an open neighborhood of y disjoint from K.',
                    hints: [
                      'To prove $Y \\setminus K$ is open for $K$ compact, pick $y \\notin K$ and separate $y$ from each $x \\in K$ by disjoint open sets $U_x \\ni x$ and $V_x \\ni y$.',
                      'Which axiom guarantees any two distinct points $x \\neq y$ admit disjoint open neighborhoods?'
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'm365c',
    code: 'M 365C',
    title: 'Real Analysis I (Metric Spaces & Measure Intro)',
    category: 'Analysis',
    level: 'Upper-Division Proof-Based',
    description: 'Completeness in metric spaces, Cauchy sequences, Baire Category Theorem, Contraction Mapping Principle, Arzelà-Ascoli Theorem, and Stone-Weierstrass.',
    units: [
      {
        id: 'm365c-u1',
        number: 1,
        title: 'Unit 1: Complete Metric Spaces & Contraction Mapping Theorem',
        description: 'Cauchy sequences, completion of a metric space, Banach Fixed-Point Theorem, and applications to Picard-Lindelöf ODE existence.',
        totalPoints: 600,
        earnedPoints: 100,
        skills: [
          { id: 's365-1', name: 'Banach Fixed-Point Theorem ($d(Tx, Ty) \\le c\\,d(x,y)$)', level: 1 },
          { id: 's365-2', name: 'Uniform Convergence & Equicontinuity (Arzelà-Ascoli)', level: 0 }
        ],
        lessons: [
          {
            id: 'l365-1',
            title: 'Banach Contraction Mapping Principle',
            lecture: {
              id: 'lec-banach',
              title: 'Banach Fixed-Point Theorem on Complete Metric Spaces',
              duration: '10:30',
              completed: true,
              points: 100,
              description: 'We prove that every contraction $T: (X, d) \\to (X, d)$ on a non-empty complete metric space admits a unique fixed point $x^* = T(x^*)$.',
              steps: [
                {
                  time: 0,
                  text: 'd(T(x), T(y)) \\le c \\cdot d(x, y) \\quad \\text{with } 0 \\le c < 1',
                  color: '#38bdf8',
                  sub: 'Let (X, d) be a non-empty complete metric space and pick any seed x_0 \\in X.'
                },
                {
                  time: 18,
                  text: 'd(x_{n+1}, x_n) \\le c^n d(x_1, x_0) \\implies d(x_m, x_n) \\le \\frac{c^n}{1 - c} d(x_1, x_0)',
                  color: '#facc15',
                  sub: 'By the triangle inequality and geometric series bound, (x_n) is a Cauchy sequence.'
                },
                {
                  time: 38,
                  text: 'x^* = \\lim_{n \\to \\infty} x_n \\implies T(x^*) = \\lim_{n \\to \\infty} T(x_n) = x^* \\quad \\blacksquare',
                  color: '#4ade80',
                  sub: 'Uniqueness follows since d(x^*, y^*) = d(Tx^*, Ty^*) \\le c d(x^*, y^*) forces d(x^*, y^*) = 0.'
                }
              ],
              transcript: [
                {
                  time: 0,
                  speaker: 'Contraction Definition',
                  text: 'Let $(X, d)$ be a complete metric space and $T: X \\to X$ satisfy $d(Tx, Ty) \\le c\\,d(x,y)$ for some Lipschitz constant $0 \\le c < 1$.'
                },
                {
                  time: 18,
                  speaker: 'Cauchy Estimates',
                  text: 'Defining $x_{n+1} = T(x_n)$, induction gives $d(x_{n+1}, x_n) \\le c^n d(x_1, x_0)$. Summing the geometric series shows $d(x_m, x_n) \\le \\frac{c^n}{1-c} d(x_1, x_0) \\to 0$.'
                },
                {
                  time: 38,
                  speaker: 'Existence & Uniqueness',
                  text: 'By completeness of $X$, $x_n \\to x^* \\in X$, and continuity of $T$ yields $T(x^*) = x^*$.'
                }
              ]
            },
            exercises: [
              {
                id: 'ex-365-u1',
                title: 'Contractions & Counterexamples on Incomplete Spaces',
                status: 'Familiar',
                level: 1,
                points: 100,
                questions: [
                  {
                    id: 'q365-1',
                    type: 'multiple-choice',
                    topic: 'Strict Contraction vs. Weak Inequality d(Tx, Ty) < d(x, y)',
                    prompt: 'Consider $X = [1, \\infty) \\subset \\mathbb{R}$ (which is closed in $\\mathbb{R}$ and hence complete) and the map $T(x) = x + \\frac{1}{x}$. Why does $T$ have NO fixed point despite satisfying $|T(x) - T(y)| < |x - y|$ for all $x \\neq y$?',
                    equation: 'T(x) = x + \\frac{1}{x} \\quad \\text{on } [1, \\infty)',
                    options: [
                      { id: 'a', label: 'Because sup_{x != y} |T(x) - T(y)| / |x - y| = 1, so there is no uniform constant c < 1.' },
                      { id: 'b', label: 'Because [1, \\infty) is not a complete metric space.' },
                      { id: 'c', label: 'Because T is not continuous on [1, \\infty).' },
                      { id: 'd', label: 'Because T does not map [1, \\infty) into [1, \\infty).' }
                    ],
                    correctAnswer: 'a',
                    explanation: 'Since T\'(x) = 1 - 1/x^2 approaches 1 as x -> ∞, the Lipschitz ratio approaches 1. Banach’s theorem strictly requires a uniform constant c < 1 (unless X is compact, where Edelstein’s theorem applies).',
                    hints: [
                      'Compute the derivative $T\'(x) = 1 - \\frac{1}{x^2}$ on $[1, \\infty)$.',
                      'By the Mean Value Theorem, $|T(x) - T(y)| = |1 - \\frac{1}{\\xi^2}| |x - y| < |x - y|$, but as $x, y \\to \\infty$, $1 - \\frac{1}{\\xi^2} \\to 1$.',
                      'Thus there is no uniform $c < 1$ bounding the contraction factor!'
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

// --- HELPER COMPONENT: MASTERY CROWN ---
const MasteryCrown = ({ level, size = 'md', onClick }) => {
  const sizeClasses = size === 'sm' ? 'w-6 h-7' : 'w-8 h-9';
  const iconSize = size === 'sm' ? 12 : 15;

  const getStyles = () => {
    switch (level) {
      case 3:
        return {
          bg: 'bg-[#4c1d95] border-[#4c1d95] text-white shadow-sm',
          fill: 'h-full bg-[#6d28d9]',
          label: 'Mastered (Q.E.D. • 100%)'
        };
      case 2:
        return {
          bg: 'bg-white border-[#6d28d9] text-[#6d28d9]',
          fill: 'h-2/3 bg-[#ede9fe]',
          label: 'Proficient (80%)'
        };
      case 1:
        return {
          bg: 'bg-white border-[#d97706] text-[#d97706]',
          fill: 'h-1/3 bg-[#fef3c7]',
          label: 'Familiar (50%)'
        };
      default:
        return {
          bg: 'bg-white border-slate-300 text-slate-300 hover:border-slate-400',
          fill: 'h-0 bg-transparent',
          label: 'Unproven / Not started (0%)'
        };
    }
  };

  const style = getStyles();

  return (
    <button
      onClick={onClick}
      title={`${style.label} — Click to practice proofs`}
      className={`relative ${sizeClasses} rounded-t-sm rounded-b-md border-2 flex items-center justify-center overflow-hidden transition-transform hover:scale-110 focus:outline-none ${style.bg}`}
    >
      <div className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${style.fill}`} />
      <Crown size={iconSize} className="relative z-10" fill={level === 3 ? 'currentColor' : 'none'} />
    </button>
  );
};

// --- MAIN APPLICATION ---
export default function App() {
  // Load Courses from localStorage or fall back to INITIAL_COURSES
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('axiom_academy_courses_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // Fallback to default
    }
    return INITIAL_COURSES;
  });

  // Save courses to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('axiom_academy_courses_v1', JSON.stringify(courses));
    } catch (e) {
      // Ignore storage quota errors
    }
  }, [courses]);

  // Global Navigation State
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'course' | 'lesson' | 'exercise' | 'studio'
  const [dashboardTab, setDashboardTab] = useState('courses'); // 'courses' | 'progress' | 'badges'
  const [activeCourseId, setActiveCourseId] = useState('m373k');
  const [selectedUnitId, setSelectedUnitId] = useState('m373k-u1');
  const [activeLessonObj, setActiveLessonObj] = useState(null);
  const [activeExerciseObj, setActiveExerciseObj] = useState(null);

  // Top Bar Menus
  const [coursesMenuOpen, setCoursesMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // User Gamification Stats
  const [qedPoints, setQedPoints] = useState(18450);
  const [streakDays, setStreakDays] = useState(19);
  const [toastMessage, setToastMessage] = useState(null);

  // Blackboard Lecture Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoTime, setVideoTime] = useState(0);
  const [videoTab, setVideoTab] = useState('transcript'); // 'transcript' | 'notes' | 'qa'
  const [videoAwarded, setVideoAwarded] = useState(false);
  const [qaList, setQaList] = useState([
    {
      id: 1,
      author: 'Noether_E',
      timeAgo: '3 days ago',
      votes: 47,
      question: 'Why does the First Isomorphism Theorem require K to be normal, whereas Lagrange’s Theorem works for any subgroup H ≤ G?',
      answerAuthor: 'Bourbaki Mentor',
      answer: 'Lagrange’s Theorem only treats G/H as a set of left cosets (partitioning G as a set). To endow G/K with a well-defined group binary operation (aK)(bK) = (ab)K, we need aKbK = abK, which holds if and only if b⁻¹Kb = K for all b ∈ G (i.e., K ◁ G).'
    }
  ]);
  const [newQuestionText, setNewQuestionText] = useState('');

  // Exercise Engine State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [questionResults, setQuestionResults] = useState([]);
  const [feedbackStatus, setFeedbackStatus] = useState(null); // null | 'correct' | 'incorrect' | 'completed'
  const [hintsShown, setHintsShown] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Scratchpad Canvas State
  const [scratchpadOpen, setScratchpadOpen] = useState(false);
  const [scratchpadGrid, setScratchpadGrid] = useState(true);
  const [penColor, setPenColor] = useState('#1d4ed8');
  const [penSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);

  // --- COURSE STUDIO (CMS BACK-END) STATE ---
  const [studioTab, setStudioTab] = useState('claude-import'); // 'claude-import' | 'visual-builder' | 'manage-json'
  const [jsonInputText, setJsonInputText] = useState('');
  const [importTargetMode, setImportTargetMode] = useState('auto'); // 'auto' | 'append-unit'
  const [targetCourseForUnit, setTargetCourseForUnit] = useState('m373k');

  // Visual Builder Form State
  const [newCourseCode, setNewCourseCode] = useState('M 375T');
  const [newCourseTitle, setNewCourseTitle] = useState('Algebraic Topology: Fundamental Group & Covering Spaces');
  const [newCourseCategory, setNewCourseCategory] = useState('Topology');
  const [newCourseDesc, setNewCourseDesc] = useState('Homotopy of paths, the fundamental group π₁(X, x₀), Seifert-van Kampen theorem, and classification of covering spaces via Galois correspondence.');

  // Quick Unit & Exercise Adder in Visual Builder
  const [builderCourseId, setBuilderCourseId] = useState('m373k');
  const [newUnitTitle, setNewUnitTitle] = useState('');
  const [newUnitDesc, setNewUnitDesc] = useState('');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newTheoremStatement, setNewTheoremStatement] = useState('');
  const [newProofStep1, setNewProofStep1] = useState('');
  const [newProofStep2, setNewProofStep2] = useState('');
  const [newExPrompt, setNewExPrompt] = useState('');
  const [newExEquation, setNewExEquation] = useState('');
  const [newExAnswer, setNewExAnswer] = useState('');
  const [newExHint, setNewExHint] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Resolve active course & unit safely
  const currentCourse = courses.find((c) => c.id === activeCourseId) || courses[0];
  const currentUnit =
    currentCourse.units.find((u) => u.id === selectedUnitId) || currentCourse.units[0];

  // Ensure activeLessonObj and activeExerciseObj have defaults
  const currentLecture =
    activeLessonObj ||
    currentUnit?.lessons?.[0]?.lecture ||
    INITIAL_COURSES[0].units[0].lessons[0].lecture;

  const currentExercise =
    activeExerciseObj ||
    currentUnit?.lessons?.[0]?.exercises?.[0] ||
    INITIAL_COURSES[0].units[0].lessons[0].exercises[0];

  // Select a course and jump to Course View
  const selectCourse = (courseId, unitId = null) => {
    const found = courses.find((c) => c.id === courseId) || courses[0];
    setActiveCourseId(found.id);
    setSelectedUnitId(unitId || found.units[0]?.id || '');
    setCoursesMenuOpen(false);
    setActiveView('course');
  };

  // Open a specific lecture on the blackboard
  const openLecture = (lectureObj, courseId = activeCourseId, unitId = selectedUnitId) => {
    if (courseId) setActiveCourseId(courseId);
    if (unitId) setSelectedUnitId(unitId);
    setActiveLessonObj(lectureObj);
    setVideoTime(0);
    setIsPlaying(false);
    setVideoAwarded(false);
    setActiveView('lesson');
  };

  // Open a specific proof/concept exercise
  const openExercise = (exerciseObj, courseId = activeCourseId, unitId = selectedUnitId) => {
    if (courseId) setActiveCourseId(courseId);
    if (unitId) setSelectedUnitId(unitId);
    setActiveExerciseObj(exerciseObj);
    setCurrentQuestionIdx(0);
    setUserAnswer('');
    setQuestionResults(new Array(exerciseObj.questions.length).fill(null));
    setFeedbackStatus(null);
    setHintsShown(0);
    setScratchpadOpen(false);
    setActiveView('exercise');
  };

  // Blackboard Playback Timer
  useEffect(() => {
    let interval = null;
    if (isPlaying && activeView === 'lesson') {
      interval = setInterval(() => {
        setVideoTime((prev) => {
          if (prev >= 60) {
            setIsPlaying(false);
            if (!videoAwarded) {
              setVideoAwarded(true);
              setQedPoints((pts) => pts + 150);
              triggerToast('∎ +150 Q.E.D. Points earned for completing the theorem proof lecture!');
            }
            return 60;
          }
          return prev + 1;
        });
      }, 420);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeView, videoAwarded]);

  // Scratchpad Canvas Sizing
  useEffect(() => {
    if (scratchpadOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const parent = canvas.parentElement;
      if (parent && canvas.width !== parent.clientWidth) {
        canvas.width = parent.clientWidth;
        canvas.height = Math.max(520, parent.clientHeight);
      }
    }
  }, [scratchpadOpen, currentQuestionIdx, hintsShown]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e) => {
    if (!scratchpadOpen) return;
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    isDrawingRef.current = true;
  };

  const draw = (e) => {
    if (!isDrawingRef.current || !scratchpadOpen) return;
    if (e.cancelable) e.preventDefault();
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineWidth = isEraser ? 26 : penSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    ctx.strokeStyle = penColor;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearScratchpad = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Exercise Engine Logic
  const questionsList = currentExercise?.questions || [];
  const currentQuestion = questionsList[currentQuestionIdx] || questionsList[0];

  const handleCheckAnswer = () => {
    if (!userAnswer.trim() || !currentQuestion) return;
    const normalizedUser = userAnswer.trim().toLowerCase();
    const normalizedCorrect = String(currentQuestion.correctAnswer).trim().toLowerCase();

    if (normalizedUser === normalizedCorrect) {
      setFeedbackStatus('correct');
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2200);

      const updated = [...questionResults];
      if (updated[currentQuestionIdx] === null) {
        updated[currentQuestionIdx] = 'correct';
        setQuestionResults(updated);
        setQedPoints((p) => p + 150);
      }
    } else {
      setFeedbackStatus('incorrect');
      const updated = [...questionResults];
      if (updated[currentQuestionIdx] === null) {
        updated[currentQuestionIdx] = 'incorrect';
        setQuestionResults(updated);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < questionsList.length - 1) {
      setCurrentQuestionIdx((idx) => idx + 1);
      setUserAnswer('');
      setFeedbackStatus(null);
      setHintsShown(0);
      clearScratchpad();
    } else {
      setFeedbackStatus('completed');
      setQedPoints((p) => p + 300);

      // Update mastery level in courses state
      setCourses((prevCourses) =>
        prevCourses.map((c) => {
          if (c.id !== activeCourseId) return c;
          return {
            ...c,
            units: c.units.map((u) => {
              if (u.id !== selectedUnitId) return u;
              return {
                ...u,
                earnedPoints: Math.min(u.totalPoints, u.earnedPoints + 150),
                skills: u.skills.map((s, idx) =>
                  idx === 0 ? { ...s, level: Math.min(3, s.level + 1) } : s
                ),
                lessons: u.lessons.map((l) => ({
                  ...l,
                  exercises: l.exercises.map((ex) =>
                    ex.id === currentExercise.id
                      ? { ...ex, level: Math.min(3, (ex.level || 0) + 1), status: 'Mastered' }
                      : ex
                  )
                }))
              };
            })
          };
        })
      );
      triggerToast('👑 Theorem Skill Mastered! +300 Bonus Q.E.D. Points awarded!');
    }
  };

  // --- COURSE STUDIO HANDLERS (CLAUDE JSON IMPORT & VISUAL BUILDER) ---
  const handleCopyClaudePrompt = () => {
    navigator.clipboard?.writeText(CLAUDE_PROMPT_TEMPLATE);
    triggerToast('📋 Claude System Prompt copied! Paste it into Claude with your math topic.');
  };

  const handleImportClaudeJson = () => {
    if (!jsonInputText.trim()) {
      triggerToast('⚠️ Please paste a JSON course or unit payload first.');
      return;
    }
    try {
      // Strip accidental markdown fences if present
      const cleaned = jsonInputText
        .trim()
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
        .trim();
      const parsed = JSON.parse(cleaned);

      // Case 1: Full Course Object (has "units" array)
      if (parsed.units && Array.isArray(parsed.units)) {
        const courseObj = {
          id: parsed.id || `course-${Date.now()}`,
          code: parsed.code || 'M 380',
          title: parsed.title || 'Imported Pure Math Course',
          category: parsed.category || 'Pure Mathematics',
          level: parsed.level || 'Upper-Division Proof-Based',
          description: parsed.description || 'Imported via Claude JSON Engine.',
          units: parsed.units
        };
        setCourses((prev) => {
          const exists = prev.some((c) => c.id === courseObj.id);
          if (exists) {
            return prev.map((c) => (c.id === courseObj.id ? courseObj : c));
          }
          return [...prev, courseObj];
        });
        setActiveCourseId(courseObj.id);
        setSelectedUnitId(courseObj.units[0]?.id || '');
        setJsonInputText('');
        triggerToast(`✅ Imported Course "${courseObj.code}: ${courseObj.title}"!`);
        setActiveView('course');
        return;
      }

      // Case 2: Single Unit Object (has "lessons" array)
      if (parsed.lessons && Array.isArray(parsed.lessons)) {
        const targetId = importTargetMode === 'append-unit' ? targetCourseForUnit : activeCourseId;
        setCourses((prev) =>
          prev.map((c) => {
            if (c.id !== targetId) return c;
            const unitNumber = parsed.number || c.units.length + 1;
            const newUnit = {
              id: parsed.id || `unit-${Date.now()}`,
              number: unitNumber,
              title: parsed.title || `Unit ${unitNumber}: Imported Unit`,
              description: parsed.description || '',
              totalPoints: parsed.totalPoints || 800,
              earnedPoints: parsed.earnedPoints || 0,
              skills: parsed.skills || [
                { id: `sk-${Date.now()}`, name: parsed.title || 'Core Proof Skill', level: 0 }
              ],
              lessons: parsed.lessons
            };
            return { ...c, units: [...c.units, newUnit] };
          })
        );
        setJsonInputText('');
        triggerToast(`✅ Appended Unit "${parsed.title}" to course!`);
        setActiveView('course');
        return;
      }

      triggerToast('⚠️ JSON parsed, but needs either a "units" array (Course) or "lessons" array (Unit).');
    } catch (err) {
      triggerToast(`❌ JSON Syntax Error: ${err.message}`);
    }
  };

  const handleCreateVisualCourse = (e) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;
    const newId = `course-${Date.now()}`;
    const newUnitId = `u-${Date.now()}`;
    const createdCourse = {
      id: newId,
      code: newCourseCode.trim() || 'M 390',
      title: newCourseTitle.trim(),
      category: newCourseCategory.trim() || 'Pure Mathematics',
      level: 'Upper-Division Proof-Based',
      description: newCourseDesc.trim(),
      units: [
        {
          id: newUnitId,
          number: 1,
          title: 'Unit 1: Foundations & Core Definitions',
          description: 'Initial unit created in Course Studio. Add lectures and exercises below or via JSON.',
          totalPoints: 600,
          earnedPoints: 0,
          skills: [{ id: `sk-${Date.now()}`, name: 'Foundational Definitions & Lemmas', level: 0 }],
          lessons: [
            {
              id: `les-${Date.now()}`,
              title: 'Introduction & Fundamental Definitions',
              lecture: {
                id: `lec-${Date.now()}`,
                title: `Introduction to ${newCourseTitle.trim()}`,
                duration: '10:00',
                completed: false,
                points: 150,
                description: newCourseDesc.trim(),
                steps: [
                  {
                    time: 0,
                    text: `\\text{Course: ${newCourseCode.trim()} — ${newCourseTitle.trim()}}`,
                    color: '#38bdf8',
                    sub: 'Add custom theorem steps in the Course Studio!'
                  },
                  {
                    time: 25,
                    text: '\\forall \\varepsilon > 0, \\; \\exists \\delta > 0 \\text{ s.t. } d_X(x,y) < \\delta \\implies d_Y(f(x), f(y)) < \\varepsilon',
                    color: '#4ade80',
                    sub: 'LaTeX equations render natively on the blackboard.'
                  }
                ],
                transcript: [
                  {
                    time: 0,
                    speaker: 'Overview',
                    text: `Welcome to **${newCourseCode}: ${newCourseTitle}**. Use the Course Studio to append new units or import JSON generated with Claude.`
                  }
                ]
              },
              exercises: []
            }
          ]
        }
      ]
    };

    setCourses((prev) => [...prev, createdCourse]);
    setBuilderCourseId(newId);
    setActiveCourseId(newId);
    setSelectedUnitId(newUnitId);
    triggerToast(`🎉 Created new course "${createdCourse.code}: ${createdCourse.title}"!`);
  };

  const handleAddVisualUnit = (e) => {
    e.preventDefault();
    if (!newUnitTitle.trim()) return;

    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== builderCourseId) return c;
        const nextNum = c.units.length + 1;
        const unitId = `u-${Date.now()}`;
        const newUnit = {
          id: unitId,
          number: nextNum,
          title: newUnitTitle.startsWith('Unit') ? newUnitTitle : `Unit ${nextNum}: ${newUnitTitle}`,
          description: newUnitDesc || 'Rigorous definitions, theorems, and proof exercises.',
          totalPoints: 800,
          earnedPoints: 0,
          skills: [
            { id: `sk-${Date.now()}`, name: newLessonTitle || newUnitTitle, level: 0 }
          ],
          lessons: [
            {
              id: `les-${Date.now()}`,
              title: newLessonTitle || 'Core Theorem & Proof',
              lecture: {
                id: `lec-${Date.now()}`,
                title: newLessonTitle || newUnitTitle,
                duration: '12:00',
                completed: false,
                points: 150,
                description: newUnitDesc || 'Interactive blackboard proof walkthrough.',
                steps: [
                  {
                    time: 0,
                    text: newTheoremStatement || '\\text{Theorem: Let } G \\text{ be a group and } H \\le G.',
                    color: '#38bdf8',
                    sub: 'Statement of the Theorem'
                  },
                  {
                    time: 20,
                    text: newProofStep1 || '\\text{Step 1: Verify the hypothesis and construct the canonical map.}',
                    color: '#facc15',
                    sub: 'First key deduction in the proof'
                  },
                  {
                    time: 40,
                    text: (newProofStep2 || '\\text{Conclusion holds as claimed.}') + ' \\quad \\blacksquare',
                    color: '#4ade80',
                    sub: 'Q.E.D.'
                  }
                ],
                transcript: [
                  {
                    time: 0,
                    speaker: 'Theorem',
                    text: `We state and prove: $${newTheoremStatement || 'G/\\ker(\\varphi) \\cong \\text{Im}(\\varphi)'}$.`
                  },
                  {
                    time: 20,
                    speaker: 'Proof Step 1',
                    text: newProofStep1 || 'Establish well-definedness and injectivity.'
                  },
                  {
                    time: 40,
                    speaker: 'Q.E.D.',
                    text: newProofStep2 || 'This completes the proof.'
                  }
                ]
              },
              exercises: newExPrompt.trim()
                ? [
                    {
                      id: `ex-${Date.now()}`,
                      title: `Proof Practice: ${newLessonTitle || newUnitTitle}`,
                      status: 'Not started',
                      level: 0,
                      points: 100,
                      questions: [
                        {
                          id: `q-${Date.now()}`,
                          type: 'numeric',
                          topic: newUnitTitle,
                          prompt: newExPrompt,
                          equation: newExEquation || '\\text{Evaluate invariant}',
                          inputPrefix: 'Answer =',
                          correctAnswer: newExAnswer || '1',
                          explanation: newExHint || 'Verified directly from the theorem.',
                          hints: [newExHint || 'Apply the theorem from the lecture above.']
                        }
                      ]
                    }
                  ]
                : []
            }
          ]
        };
        return { ...c, units: [...c.units, newUnit] };
      })
    );

    setNewUnitTitle('');
    setNewUnitDesc('');
    setNewLessonTitle('');
    setNewTheoremStatement('');
    setNewProofStep1('');
    setNewProofStep2('');
    setNewExPrompt('');
    setNewExEquation('');
    setNewExAnswer('');
    setNewExHint('');
    triggerToast('✅ Added new Unit, Blackboard Proof, and Exercise to course!');
  };

  const handleExportFullCurriculum = () => {
    const dataStr = JSON.stringify(courses, null, 2);
    navigator.clipboard?.writeText(dataStr);
    triggerToast('📦 Full Curriculum JSON copied to clipboard!');
  };

  const handleResetToDefaults = () => {
    localStorage.removeItem('axiom_academy_courses_v1');
    setCourses(INITIAL_COURSES);
    setActiveCourseId('m373k');
    setSelectedUnitId('m373k-u1');
    triggerToast('🔄 Reset curriculum to default M 373K, M 367K & M 365C courses.');
  };

  // Build dynamic search suggestions across all courses, units, lectures, and exercises
  const allSearchItems = [];
  courses.forEach((course) => {
    allSearchItems.push({
      title: `${course.code}: ${course.title}`,
      type: `Course • ${course.category}`,
      action: () => selectCourse(course.id)
    });
    course.units.forEach((u) => {
      allSearchItems.push({
        title: u.title,
        type: `Unit • ${course.code}`,
        action: () => selectCourse(course.id, u.id)
      });
      u.lessons.forEach((l) => {
        if (l.lecture) {
          allSearchItems.push({
            title: l.lecture.title,
            type: `Theorem Lecture • ${course.code}`,
            action: () => openLecture(l.lecture, course.id, u.id)
          });
        }
        (l.exercises || []).forEach((ex) => {
          allSearchItems.push({
            title: ex.title,
            type: `Proof Exercise • ${course.code}`,
            action: () => openExercise(ex, course.id, u.id)
          });
        });
      });
    });
  });

  const filteredSuggestions = allSearchItems
    .filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 7);

  // Course mastery totals
  const totalCoursePoints = currentCourse.units.reduce((acc, u) => acc + u.totalPoints, 0) || 1;
  const earnedCoursePoints = currentCourse.units.reduce((acc, u) => acc + u.earnedPoints, 0);
  const overallMasteryPct = Math.round((earnedCoursePoints / totalCoursePoints) * 100);

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900 flex flex-col font-sans selection:bg-[#1865f2] selection:text-white">
      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b2149] text-white px-5 py-3.5 rounded-lg shadow-xl border border-blue-400/30 flex items-center gap-3">
          <Sparkles className="text-amber-400 shrink-0" size={20} />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP NAVIGATION BAR (AXIOM ACADEMY) */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Courses Dropdown & Search */}
          <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-md">
            <div className="relative">
              <button
                onClick={() => {
                  setCoursesMenuOpen(!coursesMenuOpen);
                  setProfileMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 font-bold text-sm px-3 py-2 rounded-md transition-colors ${
                  coursesMenuOpen
                    ? 'bg-blue-50 text-[#1865f2]'
                    : 'text-[#1865f2] hover:bg-slate-100'
                }`}
              >
                <span>Courses</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${coursesMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Courses Mega Dropdown */}
              {coursesMenuOpen && (
                <div className="absolute left-0 mt-2 w-[92vw] sm:w-[640px] bg-white rounded-xl shadow-2xl border border-slate-200 p-6 z-50 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Pure Mathematics Curriculum
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Select an active course or open Course Studio to import new topics via Claude
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setCoursesMenuOpen(false);
                        setActiveView('studio');
                      }}
                      className="px-3 py-1.5 bg-[#0b2149] hover:bg-slate-800 text-white text-xs font-bold rounded-md flex items-center gap-1.5"
                    >
                      <Plus size={14} />
                      <span>Add / Import Course</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {courses.map((c) => {
                      const isCurrent = c.id === activeCourseId;
                      return (
                        <button
                          key={c.id}
                          onClick={() => selectCourse(c.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all ${
                            isCurrent
                              ? 'border-[#1865f2] bg-blue-50/50 ring-1 ring-[#1865f2]'
                              : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#1865f2] bg-blue-100/80 px-2 py-0.5 rounded">
                              {c.code}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400">
                              {c.units.length} {c.units.length === 1 ? 'Unit' : 'Units'}
                            </span>
                          </div>
                          <div className="font-serif font-bold text-base text-[#0b2149] mt-1.5">
                            {c.title}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                            {c.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="relative flex-1">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  placeholder="Search theorems, M 373K, Sylow, Topology..."
                  className="w-full pl-3.5 pr-9 py-1.5 text-sm bg-slate-100 hover:bg-slate-200/70 focus:bg-white rounded-md border border-transparent focus:border-[#1865f2] focus:outline-none transition-all text-slate-800 placeholder:text-slate-500"
                />
                <Search size={16} className="absolute right-3 text-slate-500 pointer-events-none" />
              </div>

              {searchFocused && (
                <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Curriculum Search
                  </div>
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery('');
                          item.action();
                        }}
                        className="w-full px-3.5 py-2 text-left hover:bg-blue-50 flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="text-sm font-medium text-slate-800 group-hover:text-[#1865f2]">
                            <MathText text={item.title} />
                          </div>
                          <div className="text-xs text-slate-400">{item.type}</div>
                        </div>
                        <ArrowRight size={14} className="text-slate-300 group-hover:text-[#1865f2]" />
                      </button>
                    ))
                  ) : (
                    <div className="px-3.5 py-3 text-xs text-slate-500">
                      No matches found for "{searchQuery}".
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Center: Axiom Academy Branding */}
          <button
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2.5 group focus:outline-none shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0b2149] border border-blue-400/30 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              {/* Commutative Diagram / Geometric Torus Emblem */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[#38bdf8] fill-none" strokeWidth="2.2">
                <polygon points="12 3 20 8 20 16 12 21 4 16 4 8" />
                <line x1="12" y1="3" x2="12" y2="21" />
                <line x1="4" y1="8" x2="20" y2="16" />
              </svg>
            </div>
            <div className="text-left">
              <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-[#0b2149] block leading-none">
                Axiom Academy
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 hidden sm:block">
                Pure Mathematics
              </span>
            </div>
          </button>

          {/* Right: View Switcher, Course Studio Back-End Button, Streak, QED Points */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 flex-1">
            {/* Desktop Quick Switcher */}
            <div className="hidden xl:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/80">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  activeView === 'dashboard'
                    ? 'bg-white text-[#1865f2] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveView('course')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  activeView === 'course'
                    ? 'bg-white text-[#1865f2] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {currentCourse.code}
              </button>
              <button
                onClick={() => openLecture(currentLecture)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  activeView === 'lesson'
                    ? 'bg-white text-[#1865f2] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Blackboard
              </button>
              <button
                onClick={() => openExercise(currentExercise)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  activeView === 'exercise'
                    ? 'bg-white text-[#1865f2] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Proof Quiz
              </button>
            </div>

            {/* Course Studio / Back-End CMS Button */}
            <button
              onClick={() => setActiveView('studio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                activeView === 'studio'
                  ? 'bg-[#6d28d9] text-white border-[#6d28d9] shadow-xs'
                  : 'bg-purple-50 text-[#4c1d95] border-purple-200 hover:bg-purple-100'
              }`}
              title="Open Course Studio Back-End to add or import courses from Claude"
            >
              <Database size={14} />
              <span className="hidden sm:inline">Course Studio</span>
            </button>

            {/* Streak Counter */}
            <div
              title={`${streakDays}-day proof streak!`}
              onClick={() =>
                triggerToast(`🔥 ${streakDays}-day proof streak! Complete 1 lemma or exercise today.`)
              }
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 font-bold text-xs cursor-pointer"
            >
              <Flame size={14} className="text-orange-500 fill-orange-500" />
              <span>{streakDays}</span>
            </div>

            {/* QED Points Badge */}
            <div
              title="Total Q.E.D. Mastery Points"
              onClick={() => triggerToast(`∎ You have ${qedPoints.toLocaleString()} Q.E.D. Points!`)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0b2149] text-white font-mono font-bold text-xs shadow-xs cursor-pointer"
            >
              <span className="text-sky-400">∎</span>
              <span>{qedPoints.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Mobile Quick View Bar */}
        <div className="xl:hidden bg-slate-50 border-t border-slate-200 px-4 py-1.5 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md shrink-0 ${
              activeView === 'dashboard' ? 'bg-[#1865f2] text-white' : 'text-slate-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('course')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md shrink-0 ${
              activeView === 'course' ? 'bg-[#1865f2] text-white' : 'text-slate-600'
            }`}
          >
            {currentCourse.code} Course
          </button>
          <button
            onClick={() => openLecture(currentLecture)}
            className={`px-2.5 py-1 text-xs font-bold rounded-md shrink-0 ${
              activeView === 'lesson' ? 'bg-[#1865f2] text-white' : 'text-slate-600'
            }`}
          >
            Blackboard Lecture
          </button>
          <button
            onClick={() => openExercise(currentExercise)}
            className={`px-2.5 py-1 text-xs font-bold rounded-md shrink-0 ${
              activeView === 'exercise' ? 'bg-[#1865f2] text-white' : 'text-slate-600'
            }`}
          >
            Proof Exercise
          </button>
          <button
            onClick={() => setActiveView('studio')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md shrink-0 ${
              activeView === 'studio' ? 'bg-[#6d28d9] text-white' : 'text-purple-800 bg-purple-50'
            }`}
          >
            + Course Studio (Back-End)
          </button>
        </div>
      </header>

      {/* 2. LEARNER DASHBOARD VIEW */}
      {activeView === 'dashboard' && (
        <div className="flex-1 flex flex-col">
          {/* Deep Navy Banner */}
          <div className="bg-[#0b2149] text-white py-8 px-4 sm:px-6 border-b border-blue-900">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1865f2] to-[#14bf96] p-0.5 shadow-lg">
                  <div className="w-full h-full bg-[#0b2149] rounded-[14px] flex items-center justify-center font-mono font-bold text-xl text-sky-300">
                    G/N
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight">
                      Axiom Academy Scholar
                    </h1>
                    <span className="bg-blue-500/20 border border-blue-400/30 text-sky-300 text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold">
                      Bourbaki Fellow • {courses.length} Courses Active
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mt-1">
                    <MathText text='"In mathematics, the art of proposing a question must be held of higher value than solving it." — Georg Cantor' />
                  </p>
                </div>
              </div>

              {/* Quick Action to Course Studio Back-End */}
              <div className="w-full md:w-auto bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-4 flex flex-wrap items-center justify-between gap-5">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-sky-300">
                    Claude Course Back-End
                  </div>
                  <div className="text-sm font-semibold text-white mt-0.5">
                    Ready to expand M 373K or Topology?
                  </div>
                </div>
                <button
                  onClick={() => setActiveView('studio')}
                  className="px-4 py-2 bg-[#14bf96] hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Database size={14} />
                  <span>Open Course Studio</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Dashboard Layout */}
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row gap-8 flex-1">
            {/* Left Sidebar */}
            <aside className="w-full md:w-64 shrink-0 space-y-6">
              <nav className="space-y-1">
                <div className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Pure Math Workspace
                </div>
                {[
                  { id: 'courses', label: 'My Courses', icon: BookOpen },
                  { id: 'progress', label: 'Proof Mastery Log', icon: BarChart2 },
                  { id: 'badges', label: 'Fields & Bourbaki Badges', icon: Award }
                ].map((item) => {
                  const Icon = item.icon;
                  const active = dashboardTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setDashboardTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                        active
                          ? 'bg-blue-50 text-[#1865f2] border-l-4 border-[#1865f2]'
                          : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                      }`}
                    >
                      <Icon size={18} className={active ? 'text-[#1865f2]' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                <button
                  onClick={() => setActiveView('studio')}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-semibold text-sm text-[#4c1d95] hover:bg-purple-50 transition-colors mt-2"
                >
                  <Database size={18} className="text-[#6d28d9]" />
                  <span>Course Studio (Back-End)</span>
                </button>
              </nav>

              {/* Daily Theorem Challenge Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4c1d95]">
                  <Crown size={14} />
                  <span>Daily Proof Challenge</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <MathText text="Prove that if $G/Z(G)$ is cyclic, then $G$ is abelian, and test counterexamples to the converse of Lagrange’s Theorem in $A_4$." />
                </p>
                <button
                  onClick={() =>
                    openExercise(
                      courses[0].units[0].lessons[0].exercises[0],
                      courses[0].id,
                      courses[0].units[0].id
                    )
                  }
                  className="w-full py-2 px-3 bg-[#1865f2] hover:bg-blue-700 text-white font-bold text-xs rounded-md transition-colors"
                >
                  Launch Proof Set
                </button>
              </div>
            </aside>

            {/* Right Main Content */}
            <main className="flex-1 space-y-6">
              {dashboardTab === 'courses' && (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="font-serif font-bold text-2xl text-[#0b2149]">
                        My Pure Mathematics Courses
                      </h2>
                      <p className="text-xs text-slate-500">
                        Click any course or unit to study blackboard proofs and practice exercises
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveView('studio')}
                      className="px-4 py-2 text-xs font-bold text-white bg-[#6d28d9] hover:bg-purple-800 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
                    >
                      <Plus size={15} />
                      <span>Add / Import Course via Claude</span>
                    </button>
                  </div>

                  {/* Render All Courses */}
                  {courses.map((course) => {
                    const totalPts = course.units.reduce((a, u) => a + u.totalPoints, 0) || 1;
                    const earnedPts = course.units.reduce((a, u) => a + u.earnedPoints, 0);
                    const pct = Math.round((earnedPts / totalPts) * 100);

                    return (
                      <div
                        key={course.id}
                        className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden"
                      >
                        {/* Course Card Header */}
                        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white to-blue-50/40">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#0b2149] text-sky-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-xs px-1 text-center">
                              {course.code}
                            </div>
                            <div>
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <h3
                                  onClick={() => selectCourse(course.id)}
                                  className="font-serif font-bold text-xl text-[#0b2149] hover:text-[#1865f2] cursor-pointer transition-colors"
                                >
                                  {course.code}: {course.title}
                                </h3>
                                <span className="bg-purple-100 text-[#4c1d95] text-xs font-bold px-2.5 py-0.5 rounded-full">
                                  {pct}% Mastered
                                </span>
                                <span className="bg-slate-100 text-slate-600 text-[11px] font-semibold px-2 py-0.5 rounded">
                                  {course.category}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                                <MathText text={course.description} />
                              </p>
                              <div className="w-full sm:w-72 h-2 bg-slate-100 rounded-full mt-2.5 overflow-hidden">
                                <div
                                  className="h-full bg-[#4c1d95] rounded-full transition-all duration-500"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0">
                            <button
                              onClick={() => selectCourse(course.id)}
                              className="px-4 py-2 text-xs font-bold text-white bg-[#1865f2] hover:bg-blue-700 rounded-md transition-colors shadow-xs flex items-center gap-1.5"
                            >
                              <span>Open Curriculum ({course.units.length} Units)</span>
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Units Grid inside Course Card */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {course.units.map((unit) => {
                            const uPct = Math.round(
                              (unit.earnedPoints / (unit.totalPoints || 1)) * 100
                            );
                            const firstEx = unit.lessons?.[0]?.exercises?.[0];
                            const firstLec = unit.lessons?.[0]?.lecture;

                            return (
                              <div
                                key={unit.id}
                                className="p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between bg-slate-50/40"
                              >
                                <div>
                                  <div className="flex items-start justify-between gap-2">
                                    <button
                                      onClick={() => selectCourse(course.id, unit.id)}
                                      className="font-bold text-sm text-slate-800 hover:text-[#1865f2] text-left transition-colors"
                                    >
                                      <MathText text={unit.title} />
                                    </button>
                                    <span className="text-xs font-bold text-[#4c1d95] shrink-0">
                                      {uPct}%
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                    <MathText text={unit.description} />
                                  </p>
                                  <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2.5 mb-3 overflow-hidden">
                                    <div
                                      className="h-full bg-[#14bf96] rounded-full"
                                      style={{ width: `${uPct}%` }}
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-200/70">
                                  <div className="flex items-center gap-1.5">
                                    {(unit.skills || []).map((s) => (
                                      <MasteryCrown
                                        key={s.id}
                                        level={s.level}
                                        size="sm"
                                        onClick={() => {
                                          if (firstEx) openExercise(firstEx, course.id, unit.id);
                                          else selectCourse(course.id, unit.id);
                                        }}
                                      />
                                    ))}
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {firstLec && (
                                      <button
                                        onClick={() => openLecture(firstLec, course.id, unit.id)}
                                        className="text-xs font-bold text-slate-600 hover:text-[#1865f2] flex items-center gap-1"
                                      >
                                        <Play size={12} />
                                        <span>Lecture</span>
                                      </button>
                                    )}
                                    <button
                                      onClick={() => selectCourse(course.id, unit.id)}
                                      className="text-xs font-bold text-[#1865f2] hover:underline flex items-center gap-0.5"
                                    >
                                      <span>Unit</span>
                                      <ChevronRight size={14} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {dashboardTab === 'progress' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
                  <h2 className="font-serif font-bold text-2xl text-[#0b2149]">
                    Proof Mastery & Verification Log
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
                      <div className="text-xs font-bold uppercase text-slate-500">Theorems Studied</div>
                      <div className="text-2xl font-bold text-[#0b2149] mt-1">14 Proofs</div>
                      <div className="text-xs text-emerald-600 font-semibold mt-1">
                        Lagrange, Isomorphism I, Sorgenfrey
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100">
                      <div className="text-xs font-bold uppercase text-slate-500">Active Courses</div>
                      <div className="text-2xl font-bold text-[#4c1d95] mt-1">{courses.length} Courses</div>
                      <div className="text-xs text-purple-700 font-semibold mt-1">
                        Persisted in LocalStorage
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-100">
                      <div className="text-xs font-bold uppercase text-slate-500">Q.E.D. Points</div>
                      <div className="text-2xl font-bold text-teal-800 mt-1">
                        {qedPoints.toLocaleString()}
                      </div>
                      <div className="text-xs text-teal-700 font-semibold mt-1">
                        {streakDays}-day active streak
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {dashboardTab === 'badges' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
                  <h2 className="font-serif font-bold text-2xl text-[#0b2149]">
                    Pure Mathematics Honors & Badges
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      {
                        name: 'Noether Ring Medal',
                        desc: 'Master Normal Subgroups & Quotient Rings in M 373K',
                        color: 'from-indigo-600 to-purple-700'
                      },
                      {
                        name: 'Galois Resolver',
                        desc: 'Prove the First Isomorphism Theorem & Sylow Counting',
                        color: 'from-blue-600 to-cyan-500'
                      },
                      {
                        name: 'Hausdorff Separator',
                        desc: 'Master Compact-to-Hausdorff Homeomorphism Proofs',
                        color: 'from-emerald-500 to-teal-700'
                      },
                      {
                        name: 'Bourbaki Architect',
                        desc: 'Build or import a custom course in Course Studio',
                        color: 'from-amber-500 to-rose-600'
                      }
                    ].map((b, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl border border-slate-200 bg-white text-center flex flex-col items-center"
                      >
                        <div
                          className={`w-14 h-14 rounded-full bg-gradient-to-br ${b.color} text-white flex items-center justify-center shadow-md mb-3`}
                        >
                          <Medal size={26} />
                        </div>
                        <div className="font-bold text-sm text-slate-800">{b.name}</div>
                        <div className="text-xs text-slate-500 mt-1">{b.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* 3. COURSE & UNIT VIEW (e.g., M 373K OR M 367K) */}
      {activeView === 'course' && (
        <div className="flex-1 flex flex-col">
          {/* Course Header Banner */}
          <div className="bg-[#0b2149] text-white py-7 px-4 sm:px-6 border-b border-blue-900">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-300 mb-1">
                  <button onClick={() => setActiveView('dashboard')} className="hover:underline">
                    Pure Mathematics
                  </button>
                  <ChevronRight size={13} />
                  <span>{currentCourse.category}</span>
                  <ChevronRight size={13} />
                  <span className="font-mono">{currentCourse.code}</span>
                </div>
                <h1 className="font-serif font-bold text-2xl sm:text-4xl">
                  {currentCourse.code}: {currentCourse.title}
                </h1>
                <p className="text-slate-300 text-sm mt-1.5 max-w-3xl">
                  <MathText text={currentCourse.description} />
                </p>
              </div>

              {/* Course Mastery Progress Card */}
              <div className="bg-white/10 border border-white/15 rounded-xl p-4 min-w-[260px] shrink-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                    <Crown size={15} className="text-amber-400" />
                    Course Mastery
                  </span>
                  <span className="text-lg font-bold">{overallMasteryPct}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900/70 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-[#14bf96] rounded-full transition-all duration-500"
                    style={{ width: `${overallMasteryPct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-300 mt-2">
                  <span>
                    {earnedCoursePoints.toLocaleString()} / {totalCoursePoints.toLocaleString()} pts
                  </span>
                  <button
                    onClick={() => {
                      setBuilderCourseId(currentCourse.id);
                      setTargetCourseForUnit(currentCourse.id);
                      setActiveView('studio');
                    }}
                    className="text-sky-300 hover:underline font-bold"
                  >
                    + Add Unit in Studio
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Course Body: Left Unit List + Right Selected Unit Details */}
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8 flex-1">
            {/* Left Sidebar: Units in Course */}
            <aside className="w-full lg:w-72 shrink-0 space-y-2">
              <div className="px-3 pb-1 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {currentCourse.code} Units ({currentCourse.units.length})
                </span>
                <button
                  onClick={() => {
                    setBuilderCourseId(currentCourse.id);
                    setActiveView('studio');
                  }}
                  className="text-xs font-bold text-[#1865f2] hover:underline"
                >
                  + New Unit
                </button>
              </div>

              {currentCourse.units.map((u) => {
                const isSelected = u.id === currentUnit?.id;
                const pct = Math.round((u.earnedPoints / (u.totalPoints || 1)) * 100);
                return (
                  <button
                    key={u.id}
                    onClick={() => setSelectedUnitId(u.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-white border-[#1865f2] shadow-sm ring-1 ring-[#1865f2]'
                        : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Unit {u.number}
                      </span>
                      <span className="text-xs font-bold text-[#4c1d95]">{pct}%</span>
                    </div>
                    <div
                      className={`font-bold text-sm mt-0.5 ${
                        isSelected ? 'text-[#1865f2]' : 'text-slate-800'
                      }`}
                    >
                      <MathText text={u.title.replace(/^Unit \d+:\s*/i, '')} />
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-[#4c1d95] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </button>
                );
              })}
            </aside>

            {/* Right Main Column: Selected Unit Breakdown */}
            <main className="flex-1 space-y-6">
              {currentUnit && (
                <div className="space-y-6">
                  {/* Unit Overview Header Card */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                      <div>
                        <h2 className="font-serif font-bold text-2xl text-[#0b2149]">
                          <MathText text={currentUnit.title} />
                        </h2>
                        <p className="text-sm text-slate-600 mt-1">
                          <MathText text={currentUnit.description} />
                        </p>
                      </div>
                      <div className="shrink-0 bg-purple-50 border border-purple-200 rounded-lg px-4 py-2.5 text-center">
                        <div className="text-xs font-bold text-[#4c1d95] uppercase">Unit Mastery</div>
                        <div className="text-lg font-bold text-[#0b2149]">
                          {currentUnit.earnedPoints} / {currentUnit.totalPoints} pts
                        </div>
                      </div>
                    </div>

                    {/* Unit Skills Crowns */}
                    <div className="pt-4 flex flex-wrap items-center gap-2.5">
                      <span className="text-xs font-bold text-slate-500 mr-1">Theorem Skills:</span>
                      {(currentUnit.skills || []).map((skill) => (
                        <div
                          key={skill.id}
                          className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80"
                        >
                          <MasteryCrown
                            level={skill.level}
                            size="sm"
                            onClick={() => {
                              const firstEx = currentUnit.lessons?.[0]?.exercises?.[0];
                              if (firstEx) openExercise(firstEx, currentCourse.id, currentUnit.id);
                            }}
                          />
                          <span className="text-xs font-medium text-slate-800">
                            <MathText text={skill.name} />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lessons inside Unit */}
                  {(currentUnit.lessons || []).map((lesson) => (
                    <div
                      key={lesson.id}
                      className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden"
                    >
                      <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
                        <h3 className="font-serif font-bold text-lg text-[#0b2149]">
                          <MathText text={lesson.title} />
                        </h3>
                        <span className="text-xs font-semibold text-slate-400">
                          Theorem Exposition & Proof Practice
                        </span>
                      </div>

                      <div className="divide-y divide-slate-100">
                        {/* Blackboard Lecture Row */}
                        {lesson.lecture && (
                          <div
                            onClick={() =>
                              openLecture(lesson.lecture, currentCourse.id, currentUnit.id)
                            }
                            className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-blue-50/40 cursor-pointer group transition-colors"
                          >
                            <div className="flex items-center gap-3.5">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                  lesson.lecture.completed
                                    ? 'bg-blue-100 text-[#1865f2]'
                                    : 'bg-slate-100 text-slate-700 group-hover:bg-[#1865f2] group-hover:text-white'
                                }`}
                              >
                                <Play size={16} fill="currentColor" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-800 group-hover:text-[#1865f2] transition-colors flex items-center gap-2">
                                  <MathText text={lesson.lecture.title} />
                                  {lesson.lecture.completed && (
                                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                                  )}
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5">
                                  Blackboard Proof Walkthrough • {lesson.lecture.duration || '12:00'}
                                </div>
                              </div>
                            </div>

                            <button className="px-3.5 py-1.5 text-xs font-bold text-[#1865f2] bg-blue-50 group-hover:bg-[#1865f2] group-hover:text-white rounded-md transition-colors shrink-0">
                              Open Blackboard
                            </button>
                          </div>
                        )}

                        {/* Proof & Counterexample Exercises Rows */}
                        {(lesson.exercises || []).map((ex) => (
                          <div
                            key={ex.id}
                            className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-purple-50/15 hover:bg-purple-50/40 transition-colors"
                          >
                            <div className="flex items-center gap-3.5">
                              <MasteryCrown
                                level={ex.level || 0}
                                size="md"
                                onClick={() => openExercise(ex, currentCourse.id, currentUnit.id)}
                              />
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span
                                    onClick={() => openExercise(ex, currentCourse.id, currentUnit.id)}
                                    className="text-sm font-bold text-slate-900 hover:text-[#1865f2] cursor-pointer"
                                  >
                                    <MathText text={`Proof Exercise: ${ex.title}`} />
                                  </span>
                                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                    {ex.status || 'Practice'}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5">
                                  {ex.questions?.length || 1} rigorous problems • Scratchpad enabled
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => openExercise(ex, currentCourse.id, currentUnit.id)}
                              className="px-5 py-2 text-xs font-bold text-white bg-[#1865f2] hover:bg-blue-700 rounded-md transition-colors shadow-2xs self-start sm:self-center shrink-0"
                            >
                              Start Proof Set
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* 4. INTERACTIVE BLACKBOARD / THEOREM PROOF PLAYER VIEW */}
      {activeView === 'lesson' && (
        <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar Outline */}
          <aside className="w-full lg:w-72 shrink-0 bg-white rounded-xl border border-slate-200 p-4 h-fit space-y-3">
            <button
              onClick={() => setActiveView('course')}
              className="text-xs font-bold text-[#1865f2] hover:underline flex items-center gap-1"
            >
              ← Back to {currentCourse.code}
            </button>
            <div className="font-serif font-bold text-base text-[#0b2149] border-b border-slate-100 pb-2">
              <MathText text={currentUnit?.title} />
            </div>
            <div className="space-y-1.5">
              {(currentUnit?.lessons || []).map((les) => (
                <div key={les.id} className="space-y-1">
                  {les.lecture && (
                    <button
                      onClick={() => openLecture(les.lecture, currentCourse.id, currentUnit.id)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 ${
                        currentLecture.id === les.lecture.id
                          ? 'bg-blue-50 text-[#1865f2] font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Play size={14} className="shrink-0" />
                      <span className="truncate">
                        <MathText text={les.lecture.title} />
                      </span>
                    </button>
                  )}
                  {(les.exercises || []).map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => openExercise(ex, currentCourse.id, currentUnit.id)}
                      className="w-full text-left p-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-[#4c1d95] flex items-center gap-2.5"
                    >
                      <Edit3 size={14} className="shrink-0 text-[#6d28d9]" />
                      <span className="truncate">
                        <MathText text={ex.title} />
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </aside>

          {/* Main Theorem Chalkboard Player */}
          <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-5 sm:px-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono font-bold text-[#1865f2] uppercase">
                  {currentCourse.code} • Formal Proof Exposition
                </div>
                <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#0b2149] mt-0.5">
                  <MathText text={currentLecture.title} />
                </h1>
              </div>
              <div className="flex items-center gap-2 bg-sky-50 border border-sky-200 text-[#0b2149] px-3 py-1.5 rounded-full text-xs font-bold">
                <span className="text-[#1865f2] font-mono">∎</span>
                <span>{videoAwarded ? '150 Q.E.D. Points Awarded!' : '+150 Q.E.D. Points'}</span>
              </div>
            </div>

            {/* Interactive Mathematical Blackboard */}
            <div className="bg-[#0d1117] relative select-none">
              <div
                onClick={() => setIsPlaying(!isPlaying)}
                className="min-h-[360px] sm:min-h-[420px] p-6 sm:p-10 flex flex-col justify-between cursor-pointer relative overflow-hidden"
                style={{
                  backgroundImage:
                    'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 0)',
                  backgroundSize: '24px 24px'
                }}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>AXIOM BLACKBOARD • {currentCourse.code}</span>
                  <span className="text-emerald-400">
                    {isPlaying ? '● PROVING THEOREM...' : '⏸ CLICK BOARD OR PLAY TO STEP THROUGH PROOF'}
                  </span>
                </div>

                {/* Animated KaTeX Proof Steps */}
                <div className="my-auto space-y-6 py-6">
                  {(currentLecture.steps || []).map((step, index) => {
                    const visible = videoTime >= step.time;
                    const isCurrent =
                      videoTime >= step.time &&
                      (index === currentLecture.steps.length - 1 ||
                        videoTime < currentLecture.steps[index + 1].time);
                    return (
                      <div
                        key={index}
                        className={`transition-all duration-500 p-3 rounded-lg ${
                          visible
                            ? 'opacity-100 translate-y-0 bg-white/[0.03] border border-white/10'
                            : 'opacity-20 translate-y-2'
                        }`}
                      >
                        <div
                          className="text-lg sm:text-xl font-semibold tracking-wide flex items-center justify-between gap-3 overflow-x-auto"
                          style={{ color: step.color || '#38bdf8' }}
                        >
                          <MathText text={`$$${step.text}$$`} />
                          {isCurrent && isPlaying && (
                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                          )}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-300 mt-1 font-sans">
                          <MathText text={step.sub} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!isPlaying && videoTime === 0 && (
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#1865f2] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                      <Play size={28} fill="currentColor" className="ml-1" />
                    </div>
                  </div>
                )}
              </div>

              {/* Scrubber Bar */}
              <div className="bg-slate-900 px-4 py-3 border-t border-slate-800 flex flex-wrap items-center gap-3 text-white">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3.5 py-1.5 rounded bg-[#1865f2] hover:bg-blue-600 text-xs font-bold"
                >
                  {isPlaying ? 'Pause' : 'Play Proof'}
                </button>

                <button
                  onClick={() => {
                    const nextStep = (currentLecture.steps || []).find((s) => s.time > videoTime);
                    setVideoTime(nextStep ? nextStep.time : 60);
                  }}
                  className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold"
                >
                  Next Step →
                </button>

                <input
                  type="range"
                  min={0}
                  max={60}
                  value={videoTime}
                  onChange={(e) => setVideoTime(Number(e.target.value))}
                  className="flex-1 accent-[#1865f2] cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                />

                <span className="text-xs font-mono text-slate-300 shrink-0">
                  Step Time: {videoTime}s / 60s
                </span>

                {currentUnit?.lessons?.[0]?.exercises?.[0] && (
                  <button
                    onClick={() =>
                      openExercise(
                        currentUnit.lessons[0].exercises[0],
                        currentCourse.id,
                        currentUnit.id
                      )
                    }
                    className="px-3 py-1.5 rounded bg-[#14bf96] hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1"
                  >
                    <span>Practice Proof Set</span>
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Tabs below Blackboard */}
            <div className="border-b border-slate-200 px-6 flex items-center gap-6 bg-slate-50/50">
              {[
                { id: 'transcript', label: 'Formal Proof Steps & Transcript' },
                { id: 'notes', label: 'Mathematical Context' },
                { id: 'qa', label: `Seminar Discussion (${qaList.length})` }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setVideoTab(t.id)}
                  className={`py-3.5 text-sm font-bold border-b-2 transition-colors ${
                    videoTab === t.id
                      ? 'border-[#1865f2] text-[#1865f2]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {videoTab === 'transcript' && (
                <div className="space-y-2.5">
                  <p className="text-xs text-slate-400 mb-2">
                    Click any deduction step below to jump the blackboard to that stage of the proof:
                  </p>
                  {(currentLecture.transcript || []).map((item, idx) => {
                    const activeLine =
                      videoTime >= item.time &&
                      (idx === currentLecture.transcript.length - 1 ||
                        videoTime < currentLecture.transcript[idx + 1].time);
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setVideoTime(item.time);
                          setIsPlaying(true);
                        }}
                        className={`w-full text-left p-3.5 rounded-lg transition-colors flex items-start gap-4 ${
                          activeLine
                            ? 'bg-blue-50 border border-blue-200 text-[#0b2149]'
                            : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                        }`}
                      >
                        <span className="text-xs font-mono font-bold text-[#1865f2] px-2.5 py-1 bg-blue-100/70 rounded shrink-0">
                          {item.speaker || `Step ${idx + 1}`}
                        </span>
                        <div className="text-sm leading-relaxed">
                          <MathText text={item.text} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {videoTab === 'notes' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800">Exposition & Intuition</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <MathText text={currentLecture.description} />
                  </p>
                </div>
              )}

              {videoTab === 'qa' && (
                <div className="space-y-5">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newQuestionText.trim()) return;
                      setQaList([
                        {
                          id: Date.now(),
                          author: 'You (Scholar)',
                          timeAgo: 'Just now',
                          votes: 1,
                          question: newQuestionText.trim(),
                          answerAuthor: null,
                          answer: null
                        },
                        ...qaList
                      ]);
                      setNewQuestionText('');
                      triggerToast('💬 Posted to Seminar Discussion!');
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      placeholder="Ask a question about this proof or share a corollary (LaTeX $...$ supported)..."
                      className="flex-1 px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:border-[#1865f2] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#1865f2] text-white text-xs font-bold rounded-lg hover:bg-blue-700"
                    >
                      Post
                    </button>
                  </form>

                  <div className="space-y-3">
                    {qaList.map((thread) => (
                      <div key={thread.id} className="p-4 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-700">
                            {thread.author} • {thread.timeAgo}
                          </span>
                          <span className="text-xs font-bold text-slate-500">
                            ▲ {thread.votes}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-900">
                          <MathText text={thread.question} />
                        </p>
                        {thread.answer && (
                          <div className="pl-3 border-l-2 border-[#14bf96] bg-teal-50/30 p-2.5 rounded-r text-xs text-slate-700">
                            <strong className="text-teal-900 block mb-0.5">
                              {thread.answerAuthor}:
                            </strong>
                            <MathText text={thread.answer} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. RIGOROUS PROOF & COUNTEREXAMPLE EXERCISE VIEW */}
      {activeView === 'exercise' && currentQuestion && (
        <div className="flex-1 flex flex-col">
          {/* Exercise Sub-Header */}
          <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3">
            <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveView('course')}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                >
                  <X size={20} />
                </button>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#4c1d95]">
                    {currentCourse.code} • Proof & Counterexample Verification
                  </div>
                  <h2 className="font-bold text-sm sm:text-base text-[#0b2149]">
                    <MathText text={currentExercise.title} />
                  </h2>
                </div>
              </div>

              {/* Scratchpad Toggle & Progress Dots */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setScratchpadOpen(!scratchpadOpen)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    scratchpadOpen
                      ? 'bg-[#1865f2] text-white border-[#1865f2]'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <PenTool size={14} />
                  <span>{scratchpadOpen ? 'Hide Proof Scratchpad' : 'Open Proof Scratchpad'}</span>
                </button>

                <div className="flex items-center gap-2">
                  {questionsList.map((q, idx) => {
                    const res = questionResults[idx];
                    const isCurrent = idx === currentQuestionIdx && feedbackStatus !== 'completed';
                    return (
                      <div
                        key={q.id || idx}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                          res === 'correct'
                            ? 'bg-emerald-500 border-emerald-600 text-white'
                            : res === 'incorrect'
                            ? 'bg-amber-500 border-amber-600 text-white'
                            : isCurrent
                            ? 'border-2 border-[#1865f2] text-[#1865f2] bg-blue-50'
                            : 'border-slate-300 bg-slate-100 text-slate-400'
                        }`}
                      >
                        {res === 'correct' ? <Check size={13} /> : idx + 1}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Exercise Body */}
          <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col">
            {feedbackStatus === 'completed' ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 text-center max-w-xl mx-auto my-auto space-y-6">
                <div className="w-20 h-20 rounded-2xl bg-[#4c1d95] text-white flex items-center justify-center mx-auto shadow-md">
                  <Crown size={42} className="text-amber-300 fill-amber-300" />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-[#4c1d95] text-xs font-mono font-bold uppercase">
                    Q.E.D. • Skill Mastered
                  </span>
                  <h2 className="font-serif font-bold text-3xl text-[#0b2149] mt-2">
                    Proof Set Verified!
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    You completed <strong>{currentExercise.title}</strong> and leveled up your unit mastery.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => openExercise(currentExercise, currentCourse.id, currentUnit.id)}
                    className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 flex items-center gap-2"
                  >
                    <RotateCcw size={16} />
                    <span>Re-Solve Set</span>
                  </button>
                  <button
                    onClick={() => setActiveView('course')}
                    className="px-6 py-2.5 rounded-lg bg-[#1865f2] hover:bg-blue-700 text-white font-bold text-sm shadow-sm"
                  >
                    Return to {currentCourse.code}
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="relative bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex-1 flex flex-col justify-between min-h-[500px]"
                style={
                  scratchpadOpen && scratchpadGrid
                    ? {
                        backgroundImage:
                          'radial-gradient(#cbd5e1 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                      }
                    : {}
                }
              >
                {/* Scratchpad Toolbar */}
                {scratchpadOpen && (
                  <div className="bg-slate-900 text-white px-4 py-2 flex flex-wrap items-center justify-between gap-3 z-30 border-b border-slate-700">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <PenTool size={14} className="text-sky-400" />
                      <span>Scratchpad Active — Sketch commutative diagrams or scratch proofs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {[
                        { color: '#1d4ed8', name: 'Blue' },
                        { color: '#e11d48', name: 'Red' },
                        { color: '#15803d', name: 'Green' },
                        { color: '#0f172a', name: 'Black' }
                      ].map((c) => (
                        <button
                          key={c.color}
                          onClick={() => {
                            setPenColor(c.color);
                            setIsEraser(false);
                          }}
                          className={`w-5 h-5 rounded-full border-2 ${
                            penColor === c.color && !isEraser ? 'border-white scale-110' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: c.color }}
                        />
                      ))}
                      <button
                        onClick={() => setScratchpadGrid(!scratchpadGrid)}
                        className="px-2 py-1 rounded bg-slate-800 text-xs font-semibold text-slate-200"
                      >
                        {scratchpadGrid ? 'Hide Grid' : 'Dot Grid'}
                      </button>
                      <button
                        onClick={() => setIsEraser(!isEraser)}
                        className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                          isEraser ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-200'
                        }`}
                      >
                        <Eraser size={13} />
                        <span>Eraser</span>
                      </button>
                      <button
                        onClick={clearScratchpad}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-red-600 text-xs font-bold flex items-center gap-1"
                      >
                        <Trash2 size={13} />
                        <span>Clear</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* HTML5 Canvas Scratchpad */}
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className={`absolute inset-0 z-20 ${
                    scratchpadOpen ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none hidden'
                  }`}
                />

                {/* Problem Content */}
                <div className="p-6 sm:p-10 space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Problem {currentQuestionIdx + 1} of {questionsList.length} •{' '}
                      {currentQuestion.topic}
                    </span>
                    {showCelebration && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                        ∎ Correct! +150 Q.E.D. Points
                      </span>
                    )}
                  </div>

                  {/* Prompt & Displayed LaTeX Equation */}
                  <div className="space-y-4">
                    <div className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed">
                      <MathText text={currentQuestion.prompt} />
                    </div>
                    {currentQuestion.equation && (
                      <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 text-[#0b2149] overflow-x-auto">
                        <MathText text={`$$${currentQuestion.equation}$$`} />
                      </div>
                    )}
                  </div>

                  {/* Answer Input: Numeric/Symbolic or Multiple Choice */}
                  <div className="pt-2 relative z-30">
                    {currentQuestion.type === 'numeric' ? (
                      <div className="flex items-center gap-3 max-w-sm">
                        <span className="font-mono font-bold text-base text-slate-700 shrink-0">
                          {currentQuestion.inputPrefix || 'Value ='}
                        </span>
                        <input
                          type="text"
                          value={userAnswer}
                          onChange={(e) => {
                            setUserAnswer(e.target.value);
                            if (feedbackStatus === 'incorrect') setFeedbackStatus(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              feedbackStatus === 'correct' ? handleNextQuestion() : handleCheckAnswer();
                            }
                          }}
                          disabled={feedbackStatus === 'correct'}
                          placeholder="Enter exact value..."
                          className="w-full px-4 py-2.5 text-lg font-mono font-bold rounded-lg border-2 border-slate-300 focus:border-[#1865f2] focus:outline-none disabled:bg-emerald-50 disabled:border-emerald-500"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-w-2xl">
                        <div className="text-xs font-bold uppercase text-slate-400 mb-1">
                          Select the rigorous statement that holds:
                        </div>
                        {(currentQuestion.options || []).map((opt) => {
                          const selected = userAnswer === opt.id;
                          return (
                            <button
                              key={opt.id}
                              disabled={feedbackStatus === 'correct'}
                              onClick={() => {
                                setUserAnswer(opt.id);
                                if (feedbackStatus === 'incorrect') setFeedbackStatus(null);
                              }}
                              className={`w-full p-3.5 rounded-xl border-2 text-left flex items-start gap-3.5 transition-all ${
                                selected
                                  ? 'border-[#1865f2] bg-blue-50/60 text-[#0b2149]'
                                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                              }`}
                            >
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold uppercase shrink-0 mt-0.5 ${
                                  selected
                                    ? 'border-[#1865f2] bg-[#1865f2] text-white'
                                    : 'border-slate-300 text-slate-500'
                                }`}
                              >
                                {opt.id}
                              </div>
                              <span className="text-sm sm:text-base font-medium leading-snug">
                                <MathText text={opt.label} />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Step-by-Step Proof Hints */}
                  <div className="pt-4 space-y-3 relative z-30">
                    {hintsShown > 0 && (
                      <div className="space-y-2.5 bg-amber-50/70 border border-amber-200 rounded-xl p-4">
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                          <Lightbulb size={15} className="text-amber-600" />
                          <span>
                            Proof Hints ({hintsShown} of {(currentQuestion.hints || []).length})
                          </span>
                        </div>
                        {(currentQuestion.hints || []).slice(0, hintsShown).map((hint, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg bg-white border border-amber-200/80 text-sm text-slate-800 leading-relaxed"
                          >
                            <span className="font-bold text-amber-700 mr-2">Lemma Hint {idx + 1}:</span>
                            <MathText text={hint} />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      {hintsShown < (currentQuestion.hints || []).length && (
                        <button
                          onClick={() => setHintsShown((h) => h + 1)}
                          className="text-xs font-bold text-[#1865f2] hover:underline flex items-center gap-1.5"
                        >
                          <Lightbulb size={14} />
                          <span>
                            {hintsShown === 0 ? 'Request a proof hint' : 'Reveal next step in proof'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sticky Verification Bar */}
                <div
                  className={`px-6 py-4 border-t flex flex-wrap items-center justify-between gap-4 relative z-30 ${
                    feedbackStatus === 'correct'
                      ? 'bg-emerald-50 border-emerald-200'
                      : feedbackStatus === 'incorrect'
                      ? 'bg-rose-50 border-rose-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="max-w-xl">
                    {feedbackStatus === 'correct' && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-emerald-900">
                            Q.E.D. — Verified!
                          </div>
                          <div className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                            <MathText text={currentQuestion.explanation} />
                          </div>
                        </div>
                      </div>
                    )}

                    {feedbackStatus === 'incorrect' && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                          <X size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-rose-900">
                            Counterexample detected — check the hypotheses and try again!
                          </div>
                          <button
                            onClick={() => setHintsShown((h) => Math.max(1, h))}
                            className="text-xs font-bold text-rose-700 underline"
                          >
                            Inspect proof hint
                          </button>
                        </div>
                      </div>
                    )}

                    {!feedbackStatus && (
                      <span className="text-xs text-slate-500">
                        Verify your deduction before submitting.
                      </span>
                    )}
                  </div>

                  <div>
                    {feedbackStatus === 'correct' ? (
                      <button
                        onClick={handleNextQuestion}
                        className="px-6 py-2.5 bg-[#1865f2] hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-xs flex items-center gap-2"
                      >
                        <span>
                          {currentQuestionIdx < questionsList.length - 1
                            ? 'Next Problem'
                            : 'Complete Proof Set'}
                        </span>
                        <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={handleCheckAnswer}
                        disabled={!userAnswer.trim()}
                        className="px-6 py-2.5 bg-[#1865f2] hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold text-sm rounded-lg shadow-xs"
                      >
                        Verify Answer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. COURSE STUDIO / ADMIN BACK-END (FOR ADDING COURSES & CLAUDE JSON WORKFLOW) */}
      {activeView === 'studio' && (
        <div className="flex-1 flex flex-col">
          {/* Studio Header */}
          <div className="bg-[#0b2149] text-white py-7 px-4 sm:px-6 border-b border-blue-900">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-300">
                  <Database size={14} />
                  <span>Axiom Academy Curriculum Back-End</span>
                </div>
                <h1 className="font-serif font-bold text-2xl sm:text-3xl mt-1">
                  Course Studio & Claude JSON Importer
                </h1>
                <p className="text-slate-300 text-sm mt-1">
                  Generate rigorous courses or units in Claude using our schema prompt, paste the JSON below, or build courses visually. All changes persist automatically in your browser.
                </p>
              </div>
              <button
                onClick={() => setActiveView('course')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg border border-white/15 self-start md:self-center shrink-0"
              >
                ← Back to {currentCourse.code}
              </button>
            </div>
          </div>

          {/* Studio Body */}
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6 flex-1">
            {/* Studio Sub-Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 w-fit">
              {[
                { id: 'claude-import', label: '1. Claude Prompt & JSON Importer', icon: Terminal },
                { id: 'visual-builder', label: '2. Visual Course & Unit Builder', icon: FolderPlus },
                { id: 'manage-json', label: '3. Manage / Export Curriculum DB', icon: FileJson }
              ].map((t) => {
                const Icon = t.icon;
                const active = studioTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setStudioTab(t.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                      active
                        ? 'bg-[#1865f2] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon size={15} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: CLAUDE PROMPT & JSON IMPORTER */}
            {studioTab === 'claude-import' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 5 Cols: Copy Claude Prompt Template */}
                <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-4 h-fit">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-purple-100 text-[#4c1d95] text-xs font-bold">
                      Step 1: Generate in Claude
                    </span>
                    <button
                      onClick={handleCopyClaudePrompt}
                      className="px-3 py-1.5 bg-[#0b2149] hover:bg-slate-800 text-white text-xs font-bold rounded-md flex items-center gap-1.5"
                    >
                      <Copy size={13} />
                      <span>Copy Claude Prompt</span>
                    </button>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-[#0b2149]">
                    Claude Curriculum Architect Prompt
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Copy this prompt and paste it into Claude along with any textbook syllabus or lecture notes (e.g., <em>"Create Unit 5 of M 373K on PID, UFD, and Euclidean Domains"</em> or <em>"Create M 367L Algebraic Topology"</em>). Claude will output ready-to-import JSON with KaTeX math.
                  </p>

                  <pre className="p-3.5 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-72 leading-relaxed">
                    {CLAUDE_PROMPT_TEMPLATE}
                  </pre>
                </div>

                {/* Right 7 Cols: Paste & Import JSON Payload */}
                <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 text-xs font-bold">
                      Step 2: Paste Claude’s JSON Output
                    </span>
                    <div className="flex items-center gap-2">
                      <select
                        value={importTargetMode}
                        onChange={(e) => setImportTargetMode(e.target.value)}
                        className="text-xs font-semibold border border-slate-300 rounded-md px-2.5 py-1.5 bg-white"
                      >
                        <option value="auto">Auto-Detect (Full Course or Unit)</option>
                        <option value="append-unit">Append Unit to Specific Course</option>
                      </select>

                      {importTargetMode === 'append-unit' && (
                        <select
                          value={targetCourseForUnit}
                          onChange={(e) => setTargetCourseForUnit(e.target.value)}
                          className="text-xs font-bold border border-blue-300 rounded-md px-2.5 py-1.5 bg-blue-50 text-[#0b2149]"
                        >
                          {courses.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.code}: {c.title}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-[#0b2149]">
                    Import Course or Unit JSON
                  </h3>

                  <textarea
                    rows={12}
                    value={jsonInputText}
                    onChange={(e) => setJsonInputText(e.target.value)}
                    placeholder={`Paste the JSON object from Claude here...\n{\n  "id": "m373l-galois",\n  "code": "M 373L",\n  "title": "Fields & Galois Theory",\n  "units": [ ... ]\n}`}
                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-300 font-mono text-xs text-slate-800 focus:bg-white focus:border-[#1865f2] focus:outline-none"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => {
                        // Load sample Galois Theory Course JSON so user can test immediately
                        const sampleJson = CLAUDE_PROMPT_TEMPLATE.slice(
                          CLAUDE_PROMPT_TEMPLATE.indexOf('{'),
                          CLAUDE_PROMPT_TEMPLATE.lastIndexOf('}') + 1
                        );
                        setJsonInputText(sampleJson);
                        triggerToast('Loaded sample M 373L Galois Theory JSON! Click "Import JSON Now" to test.');
                      }}
                      className="text-xs font-bold text-[#1865f2] hover:underline"
                    >
                      Load Sample M 373L (Galois Theory) JSON to Test
                    </button>

                    <button
                      onClick={handleImportClaudeJson}
                      className="px-6 py-2.5 bg-[#1865f2] hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2"
                    >
                      <Upload size={15} />
                      <span>Import JSON into Curriculum</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: VISUAL COURSE & UNIT BUILDER */}
            {studioTab === 'visual-builder' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Create New Course Shell */}
                <form
                  onSubmit={handleCreateVisualCourse}
                  className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 h-fit"
                >
                  <h3 className="font-serif font-bold text-lg text-[#0b2149]">
                    Create New Course Shell
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Course Code (e.g., M 375T)
                      </label>
                      <input
                        type="text"
                        value={newCourseCode}
                        onChange={(e) => setNewCourseCode(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={newCourseCategory}
                        onChange={(e) => setNewCourseCategory(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Course Title
                    </label>
                    <input
                      type="text"
                      value={newCourseTitle}
                      onChange={(e) => setNewCourseTitle(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Syllabus Description (LaTeX $...$ supported)
                    </label>
                    <textarea
                      rows={3}
                      value={newCourseDesc}
                      onChange={(e) => setNewCourseDesc(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#0b2149] hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    + Create Course
                  </button>
                </form>

                {/* Add Unit, Blackboard Theorem & Exercise to Existing Course */}
                <form
                  onSubmit={handleAddVisualUnit}
                  className="bg-white rounded-xl border border-slate-200 p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-lg text-[#0b2149]">
                      Append Unit + Blackboard Proof to Course
                    </h3>
                    <select
                      value={builderCourseId}
                      onChange={(e) => setBuilderCourseId(e.target.value)}
                      className="text-xs font-bold border border-blue-300 rounded-md px-2.5 py-1.5 bg-blue-50 text-[#0b2149]"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.code}: {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Unit Title
                      </label>
                      <input
                        type="text"
                        required
                        value={newUnitTitle}
                        onChange={(e) => setNewUnitTitle(e.target.value)}
                        placeholder="e.g., Connectedness & Path Components"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Lecture / Theorem Title
                      </label>
                      <input
                        type="text"
                        value={newLessonTitle}
                        onChange={(e) => setNewLessonTitle(e.target.value)}
                        placeholder="e.g., Topologist's Sine Curve is Connected"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Blackboard Theorem Statement (LaTeX without $$)
                    </label>
                    <input
                      type="text"
                      value={newTheoremStatement}
                      onChange={(e) => setNewTheoremStatement(e.target.value)}
                      placeholder="A \subseteq X \text{ connected } \implies \overline{A} \text{ connected}"
                      className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Blackboard Proof Step 1 (LaTeX)
                      </label>
                      <input
                        type="text"
                        value={newProofStep1}
                        onChange={(e) => setNewProofStep1(e.target.value)}
                        placeholder="\text{Suppose } \overline{A} = U \sqcup V \text{ separation}"
                        className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Blackboard Proof Conclusion (LaTeX)
                      </label>
                      <input
                        type="text"
                        value={newProofStep2}
                        onChange={(e) => setNewProofStep2(e.target.value)}
                        placeholder="A \subseteq U \implies \overline{A} \subseteq \overline{U}, \text{ so } V = \emptyset"
                        className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3 space-y-3">
                    <div className="text-xs font-bold uppercase text-[#4c1d95]">
                      Optional Practice Problem for this Unit
                    </div>
                    <input
                      type="text"
                      value={newExPrompt}
                      onChange={(e) => setNewExPrompt(e.target.value)}
                      placeholder="Problem prompt (e.g., How many connected components does GL_n(R) have?)"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={newExEquation}
                        onChange={(e) => setNewExEquation(e.target.value)}
                        placeholder="LaTeX equation: |\pi_0(\text{GL}_n(\mathbb{R}))| = ?"
                        className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300"
                      />
                      <input
                        type="text"
                        value={newExAnswer}
                        onChange={(e) => setNewExAnswer(e.target.value)}
                        placeholder="Exact Answer (e.g., 2)"
                        className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#1865f2] hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    + Add Unit to Selected Course
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: MANAGE / EXPORT CURRICULUM DB */}
            {studioTab === 'manage-json' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#0b2149]">
                      Installed Courses & LocalStorage Backup
                    </h3>
                    <p className="text-xs text-slate-500">
                      Export your entire curriculum JSON to back it up or restore defaults.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleExportFullCurriculum}
                      className="px-4 py-2 bg-[#1865f2] hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
                    >
                      <Copy size={14} />
                      <span>Copy Full Curriculum JSON</span>
                    </button>
                    <button
                      onClick={handleResetToDefaults}
                      className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-lg flex items-center gap-1.5"
                    >
                      <RefreshCw size={14} />
                      <span>Reset to Default Courses</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {courses.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4"
                    >
                      <div>
                        <div className="font-bold text-sm text-[#0b2149]">
                          {c.code}: {c.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          ID: <code className="font-mono">{c.id}</code> • {c.units.length} Units
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => selectCourse(c.id)}
                          className="px-3 py-1.5 bg-blue-50 text-[#1865f2] text-xs font-bold rounded-md"
                        >
                          View Course
                        </button>
                        {courses.length > 1 && (
                          <button
                            onClick={() => {
                              const filtered = courses.filter((item) => item.id !== c.id);
                              setCourses(filtered);
                              if (activeCourseId === c.id) setActiveCourseId(filtered[0].id);
                              triggerToast(`Removed course ${c.code}`);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                            title="Delete course"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}