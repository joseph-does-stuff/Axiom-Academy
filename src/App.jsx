import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  BookOpen, Play, CheckCircle2, Crown, Award, Flame, Search,
  ChevronRight, ChevronDown, Sparkles, Plus, Upload, Download,
  Trash2, Eye, Code, HelpCircle, RotateCcw, ArrowLeft,
  PenTool, Copy, Check, Video, Users, Globe, Lock, Cloud,
  RefreshCw, UserPlus, LogIn, Shield
} from 'lucide-react';

// ============================================================================
// SUPABASE CLOUD CONNECTION & ADMIN PASSCODE
// ============================================================================
const DEFAULT_SUPABASE_URL = "https://msawoptwnzuuicnizhyh.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_d1B8vzB0eP96vIjdI8ywCg_um6x7cpQ";

// Only someone who enters this Admin PIN can edit video links, delete units/courses, or import JSON!
const ADMIN_PASSCODE = "2027";

// ============================================================================
// AUTOMATIC UNIT SORTER (Ensures Unit 0 -> Unit 1 -> Unit 2 -> Unit 3 -> Unit 4)
// ============================================================================
function extractUnitNumber(unit) {
  const titleMatch = String(unit?.title || "").match(/unit\s*(\d+)/i);
  if (titleMatch) return parseInt(titleMatch[1], 10);
  const idMatch = String(unit?.id || "").match(/u(\d+)/i);
  if (idMatch) return parseInt(idMatch[1], 10);
  return 999;
}

function sortUnitsByNumber(units = []) {
  return [...units].sort((a, b) => {
    const numA = extractUnitNumber(a);
    const numB = extractUnitNumber(b);
    if (numA !== numB) return numA - numB;
    return String(a?.title || "").localeCompare(String(b?.title || ""));
  });
}

// Printable lecture notes live in public/notes/, named after the lesson and unit ids.
function lessonNotesUrls(lessonId) {
  if (!/^m373k-u\d+-l\d+$/.test(String(lessonId || ""))) return null;
  return {
    guided: `/notes/${lessonId}-guided-notes.pdf`,
    master: `/notes/${lessonId}-master-notes.pdf`
  };
}

function unitNotesUrls(unitId) {
  const m = String(unitId || "").match(/^m373k-u(\d+)$/);
  if (!m) return null;
  return {
    guided: `/notes/m373k-unit${m[1]}-guided-notes.pdf`,
    master: `/notes/m373k-unit${m[1]}-master-notes.pdf`
  };
}

function normalizeAndSortCourses(courseList = []) {
  return courseList.map((course) => ({
    ...course,
    units: sortUnitsByNumber(course.units || [])
  }));
}

// ============================================================================
// 1. PURE CONTENT SCHEMA (ONLY M 373K ALGEBRAIC STRUCTURES I)
// ============================================================================
const INITIAL_COURSES = [
  {
    "id": "m373k",
    "code": "M 373K",
    "title": "Algebraic Structures I (Vaaler / Artin)",
    "category": "Abstract Algebra",
    "syllabus": "Artin's Algebra / Vaaler UT Austin Syllabus: Toolkit (sets, functions, induction, matrices); Groups, Subgroups, Cosets & Lagrange; Homomorphisms, Quotients & Group Actions; Rings & Ideals; Fields & Extensions.",
    "units": [
      {
        "id": "m373k-u0",
        "title": "Unit 0: Toolkit (Sets, Functions, Induction, Matrices)",
        "description": "The background Artin assumes before Chapter 2: set notation and proof techniques, injective, surjective and bijective maps, induction and division with remainder, and $2\\times 2$ matrices and determinants. Start here if any of it feels rusty.",
        "lessons": [
          {
            "id": "m373k-u0-l01",
            "title": "Sets, Quantifiers and Proof Techniques",
            "duration": "12:00",
            "videoUrl": "",
            "theorem": "Toolkit: To prove $A\\subseteq B$, take an arbitrary $x\\in A$ and show $x\\in B$; to prove $A=B$, prove both inclusions. The negation of $\\forall x,\\,P(x)$ is $\\exists x,\\,\\neg P(x)$, and $P\\Rightarrow Q$ is equivalent to its contrapositive $\\neg Q\\Rightarrow\\neg P$.",
            "steps": [
              {
                "time": "00:00",
                "label": "Set-builder notation",
                "math": "\\mathbb{Z}n=\\{x\\in\\mathbb{Z}: x=kn\\ \\text{for some}\\ k\\in\\mathbb{Z}\\}",
                "caption": "Read $\\{x\\in S: P(x)\\}$ as the set of elements of $S$ with property $P$. Standard sets: $\\mathbb{N}\\subset\\mathbb{Z}\\subset\\mathbb{Q}\\subset\\mathbb{R}\\subset\\mathbb{C}$."
              },
              {
                "time": "02:00",
                "label": "Subsets and equality",
                "math": "A\\subseteq B\\iff(\\forall x)(x\\in A\\Rightarrow x\\in B),\\qquad A=B\\iff A\\subseteq B\\ \\text{and}\\ B\\subseteq A",
                "caption": "Almost every set equality in algebra, such as $S=\\mathbb{Z}a$ in Theorem 2.3.3, is proved as two inclusions."
              },
              {
                "time": "04:00",
                "label": "Unions, intersections, products",
                "math": "A\\cap B,\\quad A\\cup B,\\quad A\\setminus B,\\quad A\\times B=\\{(a,b): a\\in A,\\ b\\in B\\}",
                "caption": "A law of composition is a map out of the product $S\\times S$, whose elements are ordered pairs."
              },
              {
                "time": "06:00",
                "label": "Quantifiers and negation",
                "math": "\\neg(\\forall x\\,P(x))\\equiv\\exists x\\,\\neg P(x),\\qquad \\neg(\\exists x\\,P(x))\\equiv\\forall x\\,\\neg P(x)",
                "caption": "To show a group is not abelian, you need only one pair with $ab\\neq ba$. Order matters: $\\forall a\\,\\exists b$ (every element has an inverse) differs from $\\exists b\\,\\forall a$."
              },
              {
                "time": "08:00",
                "label": "Contrapositive and contradiction",
                "math": "(P\\Rightarrow Q)\\equiv(\\neg Q\\Rightarrow\\neg P)",
                "caption": "The converse $Q\\Rightarrow P$ is a different statement. A proof by contradiction assumes $P$ and $\\neg Q$ and derives something false."
              },
              {
                "time": "10:00",
                "label": "Writing a proof",
                "math": "\\text{Let } x\\in A.\\ \\ \\dots\\ \\ \\text{Hence } x\\in B.\\quad\\blacksquare",
                "caption": "Name the arbitrary element, use the definitions, and say which hypothesis justifies each step."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u0-l01-ex1",
                "type": "mcq",
                "question": "What is the negation of: for every $a\\in G$ there is $b\\in G$ with $ab=1$?",
                "options": [
                  "there exists $a\\in G$ such that $ab\\neq 1$ for every $b\\in G$",
                  "for every $a\\in G$ there is $b\\in G$ with $ab\\neq 1$",
                  "there exist $a,b\\in G$ with $ab\\neq 1$",
                  "for every $b\\in G$ there is $a\\in G$ with $ab=1$"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! Negating swaps each quantifier and negates the inner statement: $\\exists a\\,\\forall b,\\ ab\\neq 1$.",
                  "Incorrect: this only negates the equation; the quantifiers must flip as well.",
                  "Incorrect: one bad pair does not show that $a$ has no right inverse; $a$ might still have a different $b$ that works.",
                  "Incorrect: this swaps the roles of $a$ and $b$ but is not a negation."
                ],
                "hints": [
                  "$\\neg\\forall$ becomes $\\exists\\neg$, and $\\neg\\exists$ becomes $\\forall\\neg$.",
                  "Work from the outside in, one quantifier at a time.",
                  "The final inner statement should be $ab\\neq 1$."
                ]
              },
              {
                "id": "m373k-u0-l01-ex2",
                "type": "mcq",
                "question": "Which statement is the contrapositive of: if $n^2$ is even, then $n$ is even?",
                "options": [
                  "if $n$ is even, then $n^2$ is even",
                  "if $n$ is odd, then $n^2$ is odd",
                  "if $n^2$ is odd, then $n$ is odd",
                  "$n^2$ is even and $n$ is odd"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: that is the converse.",
                  "Correct! The contrapositive of $P\\Rightarrow Q$ is $\\neg Q\\Rightarrow\\neg P$, and it is logically equivalent to the original.",
                  "Incorrect: that is the inverse $\\neg P\\Rightarrow\\neg Q$, which is equivalent to the converse.",
                  "Incorrect: that is the negation of the statement."
                ],
                "hints": [
                  "Identify $P$ and $Q$ in $P\\Rightarrow Q$.",
                  "The contrapositive negates both and reverses the arrow.",
                  "Not even means odd."
                ]
              },
              {
                "id": "m373k-u0-l01-ex3",
                "type": "mcq",
                "question": "Let $A=\\{x\\in\\mathbb{Z}: 6\\mid x\\}$ and $B=\\{x\\in\\mathbb{Z}: 2\\mid x\\ \\text{and}\\ 3\\mid x\\}$. Which is true?",
                "options": [
                  "$A\\subsetneq B$",
                  "$B\\subsetneq A$",
                  "$A=B$",
                  "$A\\cap B=\\emptyset$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: every element of $B$ is also in $A$, so the inclusion is not strict.",
                  "Incorrect: every multiple of $6$ is divisible by $2$ and $3$, so $A\\subseteq B$.",
                  "Correct! $6\\mid x$ gives $2\\mid x$ and $3\\mid x$. Conversely, if $x=2k$ and $3\\mid 2k$, then $3\\mid k$ because $3$ is prime and $3\\nmid 2$, so $6\\mid x$.",
                  "Incorrect: $0$ and $6$ are in both sets."
                ],
                "hints": [
                  "Check both inclusions separately.",
                  "For $B\\subseteq A$, write $x=2k$ and ask what $3\\mid 2k$ says about $k$.",
                  "Use that $3$ is prime."
                ]
              },
              {
                "id": "m373k-u0-l01-ex4",
                "type": "mcq",
                "question": "To prove that a set $H$ equals a set $K$, the standard approach is to show",
                "options": [
                  "$|H|=|K|$",
                  "$H\\subseteq K$ and $K\\subseteq H$",
                  "$H\\cap K\\neq\\emptyset$",
                  "some element of $H$ lies in $K$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: sets of the same size can be different, such as $\\{1\\}$ and $\\{2\\}$. For finite sets, equal size plus one inclusion is enough.",
                  "Correct! Two inclusions, each proved by taking an arbitrary element.",
                  "Incorrect: overlapping sets need not be equal.",
                  "Incorrect: one shared element says very little."
                ],
                "hints": [
                  "What does $H=K$ mean element by element?",
                  "Every element of $H$ is in $K$, and every element of $K$ is in $H$.",
                  "Each of those is a subset statement."
                ]
              },
              {
                "id": "m373k-u0-l01-ex5",
                "type": "proof",
                "question": "Let $A$, $B$, $C$ be sets. Prove that $A\\cap(B\\cup C)=(A\\cap B)\\cup(A\\cap C)$.",
                "hints": [
                  "Prove two inclusions.",
                  "For $\\subseteq$, take $x$ in the left side and split into the cases $x\\in B$ and $x\\in C$.",
                  "For $\\supseteq$, take $x$ in the right side and split into the two parts of the union."
                ],
                "rubric": [
                  "Show $\\subseteq$: if $x\\in A$ and $x\\in B\\cup C$, then $x\\in A\\cap B$ or $x\\in A\\cap C$.",
                  "Handle both cases of $x\\in B\\cup C$ explicitly.",
                  "Show $\\supseteq$: if $x\\in A\\cap B$ or $x\\in A\\cap C$, then $x\\in A$ and $x\\in B\\cup C$.",
                  "Conclude equality from the two inclusions."
                ],
                "modelProof": "($\\subseteq$) Let $x\\in A\\cap(B\\cup C)$. Then $x\\in A$ and $x\\in B\\cup C$. If $x\\in B$, then $x\\in A\\cap B$; if $x\\in C$, then $x\\in A\\cap C$. Either way $x\\in(A\\cap B)\\cup(A\\cap C)$. ($\\supseteq$) Let $x\\in(A\\cap B)\\cup(A\\cap C)$. If $x\\in A\\cap B$, then $x\\in A$ and $x\\in B\\subseteq B\\cup C$; if $x\\in A\\cap C$, then $x\\in A$ and $x\\in C\\subseteq B\\cup C$. Either way $x\\in A\\cap(B\\cup C)$. The two inclusions give equality. $\\blacksquare$"
              },
              {
                "id": "m373k-u0-l01-ex6",
                "type": "proof",
                "question": "Prove by contradiction that $\\sqrt 2$ is irrational.",
                "hints": [
                  "Assume $\\sqrt2=a/b$ in lowest terms.",
                  "Square to get $a^2=2b^2$, so $a^2$ is even. What does that say about $a$?",
                  "Show $b$ is even too, contradicting lowest terms."
                ],
                "rubric": [
                  "Assume $\\sqrt2=a/b$ with integers $a,b$, $b\\neq 0$, and $\\gcd(a,b)=1$.",
                  "Derive $a^2=2b^2$ and conclude $a$ is even (an odd number has an odd square).",
                  "Write $a=2c$, get $b^2=2c^2$, and conclude $b$ is even.",
                  "Note $2$ divides both $a$ and $b$, contradicting $\\gcd(a,b)=1$."
                ],
                "modelProof": "Suppose $\\sqrt2$ is rational, say $\\sqrt2=a/b$ with integers $a,b$, $b\\neq 0$, and the fraction in lowest terms, so $\\gcd(a,b)=1$. Squaring gives $a^2=2b^2$, so $a^2$ is even. If $a$ were odd, $a=2k+1$, then $a^2=4k^2+4k+1$ would be odd; hence $a$ is even, $a=2c$. Then $4c^2=2b^2$, so $b^2=2c^2$ is even and, by the same argument, $b$ is even. Thus $2$ divides both $a$ and $b$, contradicting $\\gcd(a,b)=1$. Therefore $\\sqrt2$ is irrational. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u0-l02",
            "title": "Functions: Injective, Surjective, Bijective",
            "duration": "13:00",
            "videoUrl": "",
            "theorem": "Toolkit: A map $f:S\\to T$ is bijective if and only if it has an inverse map $g:T\\to S$ with $g\\circ f=\\mathrm{id}_S$ and $f\\circ g=\\mathrm{id}_T$. Compositions of injective (surjective, bijective) maps are injective (surjective, bijective).",
            "steps": [
              {
                "time": "00:00",
                "label": "Maps",
                "math": "f:S\\to T,\\qquad s\\longmapsto f(s)",
                "caption": "A map assigns to each $s\\in S$ exactly one $f(s)\\in T$. $S$ is the domain, $T$ the codomain, and $f(S)=\\{f(s): s\\in S\\}$ the image."
              },
              {
                "time": "02:00",
                "label": "Injective",
                "math": "f(s)=f(s')\\implies s=s'",
                "caption": "No two elements collide. To prove injectivity, assume $f(s)=f(s')$ and deduce $s=s'$. $f(x)=x^2$ on $\\mathbb{R}$ is not injective, since $f(1)=f(-1)$."
              },
              {
                "time": "04:00",
                "label": "Surjective",
                "math": "\\forall t\\in T\\ \\exists s\\in S:\\ f(s)=t",
                "caption": "Every element of the codomain is hit. To prove surjectivity, take an arbitrary $t$ and produce an $s$. $e^x:\\mathbb{R}\\to\\mathbb{R}$ is not surjective, but $e^x:\\mathbb{R}\\to\\mathbb{R}_{>0}$ is."
              },
              {
                "time": "06:00",
                "label": "Bijective maps and inverses",
                "math": "g\\circ f=\\mathrm{id}_S,\\qquad f\\circ g=\\mathrm{id}_T",
                "caption": "Bijective means injective and surjective. Then $g(t)$ is the unique $s$ with $f(s)=t$. Permutations are the bijections from a set to itself."
              },
              {
                "time": "08:00",
                "label": "Composition",
                "math": "(g\\circ f)(s)=g(f(s))",
                "caption": "If $f$ and $g$ are injective, so is $g\\circ f$; the same holds for surjective and bijective. The map on the right acts first."
              },
              {
                "time": "10:00",
                "label": "Counting for finite sets",
                "math": "|S|=|T|<\\infty:\\quad f\\ \\text{injective}\\iff f\\ \\text{surjective}\\iff f\\ \\text{bijective}",
                "caption": "This is the pigeonhole principle. It fails for infinite sets: $n\\mapsto 2n$ on $\\mathbb{Z}$ is injective but not surjective."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u0-l02-ex1",
                "type": "mcq",
                "question": "Which map $\\mathbb{Z}\\to\\mathbb{Z}$ is injective but NOT surjective?",
                "options": [
                  "$n\\mapsto n+1$",
                  "$n\\mapsto 2n$",
                  "$n\\mapsto -n$",
                  "$n\\mapsto n^2$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: it is bijective, with inverse $n\\mapsto n-1$.",
                  "Correct! $2n=2m$ gives $n=m$, but the odd integers are never hit.",
                  "Incorrect: it is bijective and is its own inverse.",
                  "Incorrect: it is not injective, since $1$ and $-1$ have the same square."
                ],
                "hints": [
                  "For injectivity, solve $f(n)=f(m)$.",
                  "For surjectivity, ask whether $1$ is in the image.",
                  "Exactly one option fails surjectivity but not injectivity."
                ]
              },
              {
                "id": "m373k-u0-l02-ex2",
                "type": "mcq",
                "question": "Let $f:S\\to T$ and $g:T\\to U$. If $g\\circ f$ is injective, which must be true?",
                "options": [
                  "$f$ is injective",
                  "$g$ is injective",
                  "both $f$ and $g$ are injective",
                  "$f$ is surjective"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! If $f(s)=f(s')$, then $g(f(s))=g(f(s'))$, and injectivity of $g\\circ f$ gives $s=s'$.",
                  "Incorrect: take $S=\\{1\\}$, $T=\\{1,2\\}$, $U=\\{1\\}$; $g\\circ f$ is injective but $g$ is not.",
                  "Incorrect: only $f$ is forced; see the counterexample for $g$.",
                  "Incorrect: with $S=\\{1\\}$ and $T=\\{1,2\\}$, no $f$ is surjective, yet $g\\circ f$ can be injective."
                ],
                "hints": [
                  "Start from $f(s)=f(s')$ and apply $g$.",
                  "Try small sets to test whether $g$ must be injective.",
                  "A one-element domain makes every map injective."
                ]
              },
              {
                "id": "m373k-u0-l02-ex3",
                "type": "mcq",
                "question": "How many bijections are there from $\\{1,2,3,4\\}$ to itself?",
                "options": [
                  "$4$",
                  "$16$",
                  "$24$",
                  "$256$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: that counts only some of them, such as the cyclic shifts.",
                  "Incorrect: $4^2$ has no counting meaning here.",
                  "Correct! There are $4$ choices for the image of $1$, then $3$, $2$, $1$: $4!=24=|S_4|$.",
                  "Incorrect: $4^4$ counts all maps, not just bijections."
                ],
                "hints": [
                  "Choose the image of $1$, then of $2$, and so on.",
                  "Each image must be different from the earlier ones.",
                  "The answer is $|S_4|$."
                ]
              },
              {
                "id": "m373k-u0-l02-ex4",
                "type": "mcq",
                "question": "Let $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=3x-5$. What is $f^{-1}(y)$?",
                "options": [
                  "$3y+5$",
                  "$\\frac{y+5}{3}$",
                  "$\\frac{y-5}{3}$",
                  "$\\frac{1}{3x-5}$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $f(3y+5)=9y+10\\neq y$.",
                  "Correct! Solve $3x-5=y$: $x=\\frac{y+5}{3}$. Check: $f\\!\\left(\\frac{y+5}{3}\\right)=y$.",
                  "Incorrect: $f\\!\\left(\\frac{y-5}{3}\\right)=y-10$.",
                  "Incorrect: that is the reciprocal $1/f(x)$, not the inverse map."
                ],
                "hints": [
                  "Solve $f(x)=y$ for $x$.",
                  "Undo the steps in reverse order: first add $5$, then divide by $3$.",
                  "Check by composing."
                ]
              },
              {
                "id": "m373k-u0-l02-ex5",
                "type": "mcq",
                "question": "Let $S$ and $T$ be finite sets with $|S|=|T|$, and let $f:S\\to T$ be injective. Then $f$ is",
                "options": [
                  "not necessarily surjective",
                  "surjective, hence bijective",
                  "constant",
                  "surjective only if $|S|$ is prime"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: for finite sets of equal size, an injective map hits $|S|=|T|$ distinct elements, which is all of $T$.",
                  "Correct! The image has $|S|$ distinct elements inside $T$, which has the same size, so the image is all of $T$.",
                  "Incorrect: a constant map on a set with more than one element is not injective.",
                  "Incorrect: primality plays no role."
                ],
                "hints": [
                  "How many elements does the image $f(S)$ have?",
                  "An injective map does not merge elements.",
                  "A subset of a finite set with the same size is the whole set."
                ]
              },
              {
                "id": "m373k-u0-l02-ex6",
                "type": "proof",
                "question": "Let $f:S\\to T$ and $g:T\\to U$ be injective. Prove that $g\\circ f$ is injective.",
                "hints": [
                  "Assume $(g\\circ f)(s)=(g\\circ f)(s')$.",
                  "Use injectivity of $g$ first.",
                  "Then use injectivity of $f$."
                ],
                "rubric": [
                  "Assume $g(f(s))=g(f(s'))$ for some $s,s'\\in S$.",
                  "Apply injectivity of $g$ to get $f(s)=f(s')$.",
                  "Apply injectivity of $f$ to get $s=s'$."
                ],
                "modelProof": "Let $s,s'\\in S$ with $(g\\circ f)(s)=(g\\circ f)(s')$, that is, $g(f(s))=g(f(s'))$. Since $g$ is injective, $f(s)=f(s')$. Since $f$ is injective, $s=s'$. Hence $g\\circ f$ is injective. $\\blacksquare$"
              },
              {
                "id": "m373k-u0-l02-ex7",
                "type": "proof",
                "question": "Prove that a map $f:S\\to T$ is bijective if and only if there is a map $g:T\\to S$ with $g\\circ f=\\mathrm{id}_S$ and $f\\circ g=\\mathrm{id}_T$.",
                "hints": [
                  "($\\Leftarrow$) Use $g\\circ f=\\mathrm{id}_S$ for injectivity and $f\\circ g=\\mathrm{id}_T$ for surjectivity.",
                  "($\\Rightarrow$) For each $t\\in T$ there is exactly one $s$ with $f(s)=t$; define $g(t)=s$.",
                  "Check both composites for the $g$ you define."
                ],
                "rubric": [
                  "($\\Leftarrow$) Injective: $f(s)=f(s')$ implies $s=g(f(s))=g(f(s'))=s'$.",
                  "($\\Leftarrow$) Surjective: each $t$ equals $f(g(t))$.",
                  "($\\Rightarrow$) Define $g(t)$ as the unique preimage of $t$, using surjectivity for existence and injectivity for uniqueness.",
                  "Verify $f(g(t))=t$ and $g(f(s))=s$."
                ],
                "modelProof": "($\\Leftarrow$) Suppose such $g$ exists. If $f(s)=f(s')$, then $s=g(f(s))=g(f(s'))=s'$, so $f$ is injective. For $t\\in T$, $t=f(g(t))$, so $f$ is surjective. Hence $f$ is bijective. ($\\Rightarrow$) Suppose $f$ is bijective. For each $t\\in T$ there is some $s$ with $f(s)=t$ by surjectivity, and it is unique by injectivity; define $g(t)$ to be this $s$. Then $f(g(t))=t$ for all $t$, so $f\\circ g=\\mathrm{id}_T$. For $s\\in S$, $g(f(s))$ is the unique element mapping to $f(s)$, and $s$ is such an element, so $g(f(s))=s$; thus $g\\circ f=\\mathrm{id}_S$. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u0-l03",
            "title": "Induction, Well-Ordering and Division with Remainder",
            "duration": "12:00",
            "videoUrl": "",
            "theorem": "Toolkit (Division with remainder): For integers $n$ and $a>0$ there are unique integers $q,r$ with $n=qa+r$ and $0\\le r<a$. It follows from the well-ordering principle: every nonempty set of nonnegative integers has a smallest element.",
            "steps": [
              {
                "time": "00:00",
                "label": "Proof by induction",
                "math": "P(1)\\ \\text{and}\\ \\big(P(k)\\Rightarrow P(k+1)\\big)\\implies P(n)\\ \\text{for all}\\ n\\ge 1",
                "caption": "Prove the base case, then assume $P(k)$ (the induction hypothesis) and prove $P(k+1)$."
              },
              {
                "time": "02:00",
                "label": "Example",
                "math": "1+2+\\cdots+n=\\frac{n(n+1)}{2}",
                "caption": "Adding $k+1$ to $\\frac{k(k+1)}{2}$ gives $\\frac{(k+1)(k+2)}{2}$. Artin uses induction to define powers $x^n$ and to prove the associative law for long products."
              },
              {
                "time": "04:00",
                "label": "Strong induction",
                "math": "\\big(P(1),\\dots,P(k)\\big)\\Rightarrow P(k+1)",
                "caption": "You may assume the statement for all smaller cases. Example: every integer $n\\ge 2$ is a product of primes."
              },
              {
                "time": "06:00",
                "label": "The well-ordering principle",
                "math": "\\emptyset\\neq X\\subseteq\\{0,1,2,\\dots\\}\\implies X\\ \\text{has a least element}",
                "caption": "This is equivalent to induction. Theorem 2.3.3 uses it to pick the smallest positive element of a subgroup of $\\mathbb{Z}^+$."
              },
              {
                "time": "08:00",
                "label": "Division with remainder",
                "math": "n=qa+r,\\qquad 0\\le r<a",
                "caption": "Let $r$ be the least element of $\\{n-qa: q\\in\\mathbb{Z}\\}\\cap\\{0,1,2,\\dots\\}$. If $r\\ge a$, then $r-a$ would be a smaller element. For $n=-17$, $a=5$: $-17=(-4)\\cdot 5+3$."
              },
              {
                "time": "10:00",
                "label": "Uniqueness",
                "math": "qa+r=q'a+r'\\implies a\\mid r-r',\\ |r-r'|<a\\implies r=r'",
                "caption": "The only multiple of $a$ strictly between $-a$ and $a$ is $0$, so $r=r'$ and then $q=q'$."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u0-l03-ex1",
                "type": "mcq",
                "question": "Divide $n=-17$ by $a=5$ with remainder. What are $q$ and $r$?",
                "options": [
                  "$q=-3$, $r=-2$",
                  "$q=-4$, $r=3$",
                  "$q=-3$, $r=2$",
                  "$q=3$, $r=-2$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: the remainder must satisfy $0\\le r<5$.",
                  "Correct! $-17=(-4)\\cdot 5+3$ and $0\\le 3<5$.",
                  "Incorrect: $(-3)\\cdot 5+2=-13$.",
                  "Incorrect: $3\\cdot 5-2=13$, and $r$ must be nonnegative."
                ],
                "hints": [
                  "The remainder must lie in $\\{0,1,2,3,4\\}$.",
                  "Find the largest multiple of $5$ that is at most $-17$.",
                  "That multiple is $-20$."
                ]
              },
              {
                "id": "m373k-u0-l03-ex2",
                "type": "mcq",
                "question": "In a proof by induction of a statement $P(n)$ for $n\\ge 1$, the inductive step proves",
                "options": [
                  "$P(n)$ for all $n$ directly",
                  "$P(k)\\Rightarrow P(k+1)$ for every $k\\ge 1$",
                  "$P(k+1)\\Rightarrow P(k)$",
                  "$P(1)$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: that is the conclusion, not the inductive step.",
                  "Correct! Together with the base case $P(1)$, this gives $P(n)$ for every $n$.",
                  "Incorrect: the implication runs upward.",
                  "Incorrect: that is the base case."
                ],
                "hints": [
                  "There are two parts: a base case and an inductive step.",
                  "The inductive step assumes one case and proves the next.",
                  "Which direction does the domino fall?"
                ]
              },
              {
                "id": "m373k-u0-l03-ex3",
                "type": "mcq",
                "question": "Which subset of $\\mathbb{Z}$ has NO least element?",
                "options": [
                  "$\\{n\\in\\mathbb{Z}: n\\ge 7\\}$",
                  "the positive even integers",
                  "the negative integers",
                  "$\\{n^2: n\\in\\mathbb{Z}\\}$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: its least element is $7$.",
                  "Incorrect: its least element is $2$.",
                  "Correct! For any negative $n$, $n-1$ is smaller. The well-ordering principle applies only to sets of nonnegative integers, or sets bounded below.",
                  "Incorrect: its least element is $0$."
                ],
                "hints": [
                  "Well-ordering is about sets of nonnegative integers.",
                  "Which set is not bounded below?",
                  "Given any element, can you always find a smaller one?"
                ]
              },
              {
                "id": "m373k-u0-l03-ex4",
                "type": "mcq",
                "question": "A student proves that $n^2+n+41$ is prime for $n=1,\\dots,10$ and concludes it holds for all $n$. What is wrong?",
                "options": [
                  "nothing; ten cases are enough",
                  "checking cases is not induction: there is no inductive step, and $n=40$ fails",
                  "the base case should be $n=0$",
                  "induction only works for sums"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: no finite number of examples proves a statement about all $n$.",
                  "Correct! For $n=40$, $40^2+40+41=41^2$. A proof by induction needs $P(k)\\Rightarrow P(k+1)$ for every $k$.",
                  "Incorrect: changing the base case does not fix a missing inductive step.",
                  "Incorrect: induction proves statements of any kind indexed by integers."
                ],
                "hints": [
                  "What part of an induction proof is missing?",
                  "Try $n=40$.",
                  "$40^2+40+41=40\\cdot 41+41$."
                ]
              },
              {
                "id": "m373k-u0-l03-ex5",
                "type": "proof",
                "question": "Prove by induction that $1+2+\\cdots+n=\\frac{n(n+1)}{2}$ for every integer $n\\ge 1$.",
                "hints": [
                  "Check $n=1$.",
                  "Assume the formula for $n=k$.",
                  "Add $k+1$ to both sides and simplify."
                ],
                "rubric": [
                  "Base case: $1=\\frac{1\\cdot 2}{2}$.",
                  "State the induction hypothesis $1+\\cdots+k=\\frac{k(k+1)}{2}$.",
                  "Compute $1+\\cdots+k+(k+1)=\\frac{k(k+1)}{2}+(k+1)=\\frac{(k+1)(k+2)}{2}$.",
                  "Conclude by induction."
                ],
                "modelProof": "For $n=1$ both sides equal $1$. Suppose $1+2+\\cdots+k=\\frac{k(k+1)}{2}$ for some $k\\ge 1$. Then $1+2+\\cdots+k+(k+1)=\\frac{k(k+1)}{2}+(k+1)=\\frac{k(k+1)+2(k+1)}{2}=\\frac{(k+1)(k+2)}{2}$, which is the formula for $n=k+1$. By induction the formula holds for every $n\\ge 1$. $\\blacksquare$"
              },
              {
                "id": "m373k-u0-l03-ex6",
                "type": "proof",
                "question": "(Division with remainder) Let $n\\in\\mathbb{Z}$ and $a$ a positive integer. Prove there exist integers $q,r$ with $n=qa+r$ and $0\\le r<a$, and that they are unique.",
                "hints": [
                  "Existence: apply well-ordering to $X=\\{n-qa: q\\in\\mathbb{Z},\\ n-qa\\ge 0\\}$.",
                  "Show $X$ is nonempty, then show its least element is less than $a$.",
                  "Uniqueness: subtract two such expressions and bound $r-r'$."
                ],
                "rubric": [
                  "Show $X\\neq\\emptyset$, for example using $q=-|n|$.",
                  "Let $r=n-qa$ be the least element of $X$, and show $r<a$ (otherwise $r-a\\in X$ is smaller).",
                  "For uniqueness, from $qa+r=q'a+r'$ get $a\\mid r-r'$ with $|r-r'|<a$.",
                  "Conclude $r=r'$, then $q=q'$ by cancelling $a$."
                ],
                "modelProof": "Existence. Let $X=\\{n-qa: q\\in\\mathbb{Z}\\}\\cap\\{0,1,2,\\dots\\}$. Taking $q=-|n|$ gives $n+|n|a\\ge n+|n|\\ge 0$, so $X\\neq\\emptyset$. By well-ordering $X$ has a least element $r=n-qa\\ge 0$. If $r\\ge a$, then $r-a=n-(q+1)a$ is in $X$ and smaller than $r$, a contradiction. So $n=qa+r$ with $0\\le r<a$. Uniqueness. If also $n=q'a+r'$ with $0\\le r'<a$, then $(q-q')a=r'-r$, so $a$ divides $r'-r$. But $-a<r'-r<a$, and the only multiple of $a$ in that range is $0$. Hence $r=r'$, and then $(q-q')a=0$ with $a>0$ gives $q=q'$. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u0-l04",
            "title": "Matrices, Determinants and Invertibility",
            "duration": "13:00",
            "videoUrl": "",
            "theorem": "Toolkit (Artin Ch. 1): For $n\\times n$ matrices, $\\det(AB)=\\det A\\,\\det B$, and $A$ is invertible if and only if $\\det A\\neq 0$. For $A=\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}$ with $ad-bc\\neq 0$, $A^{-1}=\\frac{1}{ad-bc}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}$.",
            "steps": [
              {
                "time": "00:00",
                "label": "Matrix multiplication",
                "math": "(AB)_{ij}=\\sum_k a_{ik}b_{kj}",
                "caption": "Entry $(i,j)$ of $AB$ is row $i$ of $A$ times column $j$ of $B$. Multiplication is associative but in general not commutative."
              },
              {
                "time": "02:00",
                "label": "Not commutative",
                "math": "\\begin{pmatrix}0&1\\\\0&0\\end{pmatrix}\\begin{pmatrix}0&0\\\\1&0\\end{pmatrix}=\\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}\\neq\\begin{pmatrix}0&0\\\\0&1\\end{pmatrix}",
                "caption": "Reversing the order of the two factors gives a different product. This is the first non-commutative law of composition in Artin."
              },
              {
                "time": "04:00",
                "label": "Identity and inverses",
                "math": "AI=IA=A,\\qquad AA^{-1}=A^{-1}A=I",
                "caption": "Not every nonzero matrix is invertible: $\\begin{pmatrix}1&1\\\\1&1\\end{pmatrix}$ has no inverse."
              },
              {
                "time": "06:00",
                "label": "The 2 by 2 determinant",
                "math": "\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}=ad-bc",
                "caption": "$A$ is invertible exactly when $ad-bc\\neq 0$, and then the inverse is $\\frac{1}{ad-bc}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}$."
              },
              {
                "time": "08:00",
                "label": "Multiplicativity",
                "math": "\\det(AB)=\\det A\\,\\det B,\\qquad \\det(A^{-1})=\\frac{1}{\\det A}",
                "caption": "This one identity explains why the invertible matrices form the group $GL_n$ and why determinant $1$ gives the subgroup $SL_n$."
              },
              {
                "time": "10:00",
                "label": "Matrices as symmetries",
                "math": "R_\\theta=\\begin{pmatrix}\\cos\\theta&-\\sin\\theta\\\\ \\sin\\theta&\\cos\\theta\\end{pmatrix},\\qquad R_\\alpha R_\\beta=R_{\\alpha+\\beta}",
                "caption": "Rotation matrices have determinant $1$ and compose by adding angles, so they form a subgroup of $SL_2(\\mathbb{R})$."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u0-l04-ex1",
                "type": "mcq",
                "question": "Compute $\\det\\begin{pmatrix}2&3\\\\1&4\\end{pmatrix}$.",
                "options": [
                  "$5$",
                  "$8$",
                  "$11$",
                  "$-5$"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! $2\\cdot 4-3\\cdot 1=8-3=5$.",
                  "Incorrect: that is only $ad$; subtract $bc=3$.",
                  "Incorrect: that is $ad+bc$; the determinant is $ad-bc$.",
                  "Incorrect: that is $bc-ad$; the sign is reversed."
                ],
                "hints": [
                  "Use $\\det=ad-bc$.",
                  "Here $a=2$, $b=3$, $c=1$, $d=4$.",
                  "Compute $8-3$."
                ]
              },
              {
                "id": "m373k-u0-l04-ex2",
                "type": "mcq",
                "question": "What is the inverse of $\\begin{pmatrix}2&1\\\\5&3\\end{pmatrix}$?",
                "options": [
                  "$\\begin{pmatrix}3&-1\\\\-5&2\\end{pmatrix}$",
                  "$\\begin{pmatrix}3&1\\\\5&2\\end{pmatrix}$",
                  "$\\begin{pmatrix}\\tfrac12&1\\\\ \\tfrac15&\\tfrac13\\end{pmatrix}$",
                  "it is not invertible"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! $\\det=6-5=1$, so the inverse is $\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}=\\begin{pmatrix}3&-1\\\\-5&2\\end{pmatrix}$.",
                  "Incorrect: the off-diagonal entries must change sign.",
                  "Incorrect: inverting each entry does not give the inverse matrix.",
                  "Incorrect: the determinant is $1\\neq 0$."
                ],
                "hints": [
                  "First compute the determinant.",
                  "Swap the diagonal entries and negate the off-diagonal ones.",
                  "Divide by the determinant, then check by multiplying."
                ]
              },
              {
                "id": "m373k-u0-l04-ex3",
                "type": "mcq",
                "question": "If $A$ and $B$ are $3\\times 3$ matrices with $\\det A=2$ and $\\det B=-3$, what is $\\det(AB^{-1})$?",
                "options": [
                  "$-6$",
                  "$-\\tfrac23$",
                  "$-\\tfrac32$",
                  "$\\tfrac23$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: that is $\\det(AB)$.",
                  "Correct! $\\det(AB^{-1})=\\det A\\cdot\\frac{1}{\\det B}=\\frac{2}{-3}$.",
                  "Incorrect: that is $\\det B/\\det A$.",
                  "Incorrect: the sign of $\\det B$ carries through."
                ],
                "hints": [
                  "Use $\\det(XY)=\\det X\\det Y$.",
                  "$\\det(B^{-1})=1/\\det B$.",
                  "Multiply $2$ by $-\\tfrac13$."
                ]
              },
              {
                "id": "m373k-u0-l04-ex4",
                "type": "mcq",
                "question": "Which statement about $2\\times 2$ real matrices is true?",
                "options": [
                  "$AB=BA$ for all $A,B$",
                  "$AB=0$ implies $A=0$ or $B=0$",
                  "$\\det(A+B)=\\det A+\\det B$",
                  "if $AB=I$ then $BA=I$"
                ],
                "correctIndex": 3,
                "optionExplanations": [
                  "Incorrect: see the example in the lesson, where the two orders give different products.",
                  "Incorrect: $\\begin{pmatrix}0&1\\\\0&0\\end{pmatrix}^2=0$ with a nonzero factor.",
                  "Incorrect: $\\det(I+I)=4$ but $\\det I+\\det I=2$.",
                  "Correct! $AB=I$ gives $\\det A\\det B=1$, so $A$ is invertible, and then $B=A^{-1}(AB)=A^{-1}$, so $BA=I$."
                ],
                "hints": [
                  "Test each statement on simple matrices.",
                  "For the last option, use the determinant to show $A$ is invertible.",
                  "Then multiply $AB=I$ on the left by $A^{-1}$."
                ]
              },
              {
                "id": "m373k-u0-l04-ex5",
                "type": "proof",
                "question": "Let $A=\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}$ with $\\delta=ad-bc\\neq 0$, and $B=\\frac{1}{\\delta}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}$. Prove that $AB=BA=I$.",
                "hints": [
                  "Compute $A\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}$ entry by entry.",
                  "Each diagonal entry should be $\\delta$ and each off-diagonal entry $0$.",
                  "Do the same in the other order, then divide by $\\delta$."
                ],
                "rubric": [
                  "Compute $A\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}=\\begin{pmatrix}ad-bc&-ab+ba\\\\cd-dc&-cb+da\\end{pmatrix}=\\delta I$.",
                  "Compute $\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}A=\\delta I$ similarly.",
                  "Divide by $\\delta\\neq 0$ to get $AB=BA=I$."
                ],
                "modelProof": "Let $C=\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}$. Then $AC=\\begin{pmatrix}ad-bc&-ab+ba\\\\cd-dc&-cb+da\\end{pmatrix}=\\begin{pmatrix}\\delta&0\\\\0&\\delta\\end{pmatrix}=\\delta I$ and $CA=\\begin{pmatrix}da-bc&db-bd\\\\-ca+ac&-cb+ad\\end{pmatrix}=\\delta I$. Since $\\delta\\neq 0$ and $B=\\frac{1}{\\delta}C$, we get $AB=\\frac{1}{\\delta}AC=I$ and $BA=\\frac{1}{\\delta}CA=I$. $\\blacksquare$"
              },
              {
                "id": "m373k-u0-l04-ex6",
                "type": "proof",
                "question": "Using $\\det(AB)=\\det A\\det B$, prove that $SL_2(\\mathbb{R})=\\{A: \\det A=1\\}$ is a subgroup of $GL_2(\\mathbb{R})$.",
                "hints": [
                  "Check that $SL_2(\\mathbb{R})\\subseteq GL_2(\\mathbb{R})$.",
                  "Check closure, identity and inverses.",
                  "For inverses, apply the determinant to $AA^{-1}=I$."
                ],
                "rubric": [
                  "Note $\\det A=1\\neq 0$, so every $A\\in SL_2(\\mathbb{R})$ is invertible.",
                  "Closure: $\\det(AB)=1\\cdot 1=1$.",
                  "Identity: $\\det I=1$.",
                  "Inverses: $\\det A\\det A^{-1}=\\det I=1$ gives $\\det A^{-1}=1$."
                ],
                "modelProof": "If $\\det A=1$, then $\\det A\\neq 0$, so $A$ is invertible and $SL_2(\\mathbb{R})\\subseteq GL_2(\\mathbb{R})$. If $A,B\\in SL_2(\\mathbb{R})$, then $\\det(AB)=\\det A\\det B=1$, so $AB\\in SL_2(\\mathbb{R})$. The identity has $\\det I=1$. If $A\\in SL_2(\\mathbb{R})$, then $1=\\det I=\\det(AA^{-1})=\\det A\\det A^{-1}=\\det A^{-1}$, so $A^{-1}\\in SL_2(\\mathbb{R})$. Hence $SL_2(\\mathbb{R})$ is a subgroup of $GL_2(\\mathbb{R})$. $\\blacksquare$"
              }
            ]
          }
        ]
      },
      {
        "id": "m373k-u1",
        "title": "Unit 1: Groups (Artin 2.1–2.4, 2.7–2.9)",
        "description": "Laws of composition, groups and subgroups, the symmetric group $S_3$, subgroups of $\\mathbb{Z}^+$ and the gcd, cyclic groups, equivalence relations, cosets and Lagrange's theorem, and modular arithmetic. Every lesson includes a narrated lecture episode.",
        "lessons": [
          {
            "id": "m373k-u1-l01",
            "title": "Laws of Composition",
            "duration": "16:11",
            "videoUrl": "",
            "theorem": "Proposition 2.1.4 (Artin): If a law of composition on $S$ is associative, then every way of inserting parentheses into a product $a_1a_2\\cdots a_n$ gives the same element of $S$. A law has at most one identity, and under an associative law with identity, inverses are unique and $(ab)^{-1}=b^{-1}a^{-1}$.",
            "steps": [
              {
                "time": "00:48",
                "label": "Two elements in, one element out",
                "math": "(a,b)\\longmapsto ab",
                "caption": "Addition and multiplication of real numbers, and multiplication of $n\\times n$ matrices, each take two elements of a set and return one element of the same set."
              },
              {
                "time": "01:26",
                "label": "Law of composition",
                "math": "S\\times S\\longrightarrow S,\\qquad (a,b)\\longmapsto ab",
                "caption": "A law of composition on $S$ is a map $S\\times S\\to S$. The output must lie in $S$, and the input is an ordered pair, so $ab$ and $ba$ may differ. Subtraction is not a law of composition on $\\{1,2,3,\\dots\\}$, since $3-5=-2$."
              },
              {
                "time": "02:57",
                "label": "Associative and commutative laws",
                "math": "(ab)c=a(bc)\\qquad\\qquad ab=ba",
                "caption": "Matrix multiplication is associative but not commutative. Subtraction on $\\mathbb{Z}$ is neither: $(5-3)-1=1$ but $5-(3-1)=3$. Under an associative law, parentheses can be dropped (Proposition 2.1.4)."
              },
              {
                "time": "05:28",
                "label": "Composition of maps",
                "math": "(g\\circ f)(t)=g(f(t)),\\qquad (h\\circ g)\\circ f=h\\circ(g\\circ f)",
                "caption": "The map written on the right acts first. Both bracketings send every $t$ to $h(g(f(t)))$, so composition of maps is always associative."
              },
              {
                "time": "07:01",
                "label": "The four maps of a two-element set",
                "math": "\\tau\\circ\\alpha=\\beta,\\qquad \\alpha\\circ\\tau=\\alpha",
                "caption": "On $T=\\{a,b\\}$ let $\\tau$ be the swap and $\\alpha,\\beta$ the constant maps to $a$ and $b$. Composition is not commutative."
              },
              {
                "time": "09:11",
                "label": "Identity",
                "math": "e=ee'=e'",
                "caption": "An identity satisfies $ea=a=ae$ for all $a$. If $e$ and $e'$ are both identities, evaluating $ee'$ in two ways shows $e=e'$. It is written $1$, or $0$ in additive notation."
              },
              {
                "time": "11:06",
                "label": "Inverses",
                "math": "(ab)(b^{-1}a^{-1})=a(bb^{-1})a^{-1}=aa^{-1}=1",
                "caption": "$a$ is invertible if some $b$ has $ab=1$ and $ba=1$. Inverses multiply in the opposite order: $(ab)^{-1}=b^{-1}a^{-1}$."
              },
              {
                "time": "13:07",
                "label": "Worked problem: left and right inverses",
                "math": "l=l\\cdot 1=l(ar)=(la)r=1\\cdot r=r\\quad\\blacksquare",
                "caption": "If $la=1$ and $ar=1$ under an associative law with identity, then $l=r$. So $a$ is invertible, and its inverse is unique."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u1-l01-ex1",
                "type": "mcq",
                "question": "Which of these is NOT a law of composition on the given set?",
                "options": [
                  "Addition on the even integers",
                  "Subtraction on the positive integers",
                  "Matrix multiplication on real $2\\times 2$ matrices",
                  "Composition on the set of maps $T\\to T$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: the sum of two even integers is even, so addition never leaves the set.",
                  "Correct! $3-5=-2$ is not a positive integer. A law of composition must return an element of the set for every ordered pair.",
                  "Incorrect: the product of two $2\\times 2$ matrices is again a $2\\times 2$ matrix.",
                  "Incorrect: if $f,g:T\\to T$, then $g\\circ f$ is again a map $T\\to T$."
                ],
                "hints": [
                  "A law of composition on $S$ must send every pair $(a,b)$ of elements of $S$ to an element of $S$.",
                  "For each option, look for one pair whose output leaves the set.",
                  "Try the pair $(3,5)$ in the positive integers."
                ]
              },
              {
                "id": "m373k-u1-l01-ex2",
                "type": "mcq",
                "question": "On $\\mathbb{R}$ define $a*b=\\frac{a+b}{2}$. This law is",
                "options": [
                  "associative and commutative",
                  "associative but not commutative",
                  "commutative but not associative",
                  "neither associative nor commutative"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: it is commutative, but $(0*0)*4=2$ while $0*(0*4)=1$, so it is not associative.",
                  "Incorrect: $a*b=b*a$ because $a+b=b+a$, and associativity fails: $(0*0)*4=2\\neq 1=0*(0*4)$.",
                  "Correct! $\\frac{a+b}{2}=\\frac{b+a}{2}$, but $(a*b)*c=\\frac{a+b+2c}{4}$ and $a*(b*c)=\\frac{2a+b+c}{4}$; with $a=b=0$, $c=4$ these are $2$ and $1$.",
                  "Incorrect: the law is commutative, since addition of real numbers is."
                ],
                "hints": [
                  "For commutativity, compare $a*b$ with $b*a$.",
                  "Write $(a*b)*c$ and $a*(b*c)$ as fractions with denominator $4$.",
                  "Test the values $a=0$, $b=0$, $c=4$."
                ]
              },
              {
                "id": "m373k-u1-l01-ex3",
                "type": "mcq",
                "question": "Let $T=\\{a,b\\}$, let $\\tau$ be the swap, and let $\\alpha$ be the constant map to $a$. What is $\\tau\\circ\\alpha$?",
                "options": [
                  "the identity $i$",
                  "the swap $\\tau$",
                  "the constant map $\\alpha$",
                  "the constant map $\\beta$ to $b$"
                ],
                "correctIndex": 3,
                "optionExplanations": [
                  "Incorrect: $\\alpha$ sends both elements to $a$, so $\\tau\\circ\\alpha$ is not injective and cannot be the identity.",
                  "Incorrect: $\\tau\\circ\\alpha$ sends both $a$ and $b$ to $\\tau(a)=b$; it is constant, not the swap.",
                  "Incorrect: that is $\\alpha\\circ\\tau$. In $\\tau\\circ\\alpha$ the map $\\alpha$ acts first.",
                  "Correct! $\\alpha$ acts first and sends everything to $a$; then $\\tau$ sends $a$ to $b$. Every element lands on $b$, so $\\tau\\circ\\alpha=\\beta$."
                ],
                "hints": [
                  "In $g\\circ f$, the map written on the right acts first.",
                  "Compute $\\alpha(a)$ and $\\alpha(b)$ first, then apply $\\tau$.",
                  "A map sending every element to $b$ is the constant map $\\beta$."
                ]
              },
              {
                "id": "m373k-u1-l01-ex4",
                "type": "mcq",
                "question": "On $\\mathbb{Z}$ define $a*b=a+b+1$. Which element is the identity for $*$?",
                "options": [
                  "$0$",
                  "$1$",
                  "$-1$",
                  "There is no identity"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: $a*0=a+0+1=a+1\\neq a$.",
                  "Incorrect: $a*1=a+2\\neq a$.",
                  "Correct! $a*(-1)=a-1+1=a$ and $(-1)*a=-1+a+1=a$ for every integer $a$.",
                  "Incorrect: solving $a+e+1=a$ gives $e=-1$, which works for every $a$ on both sides."
                ],
                "hints": [
                  "An identity $e$ must satisfy $a*e=a$ and $e*a=a$ for every $a$.",
                  "Write out $a*e=a+e+1$ and set it equal to $a$.",
                  "Solve for $e$ and check that it does not depend on $a$."
                ]
              },
              {
                "id": "m373k-u1-l01-ex5",
                "type": "mcq",
                "question": "Under an associative law with identity, let $a$ and $b$ be invertible. Then $(ab)^{-1}$ equals",
                "options": [
                  "$a^{-1}b^{-1}$",
                  "$b^{-1}a^{-1}$",
                  "$ab$",
                  "$(ba)^{-1}$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $(ab)(a^{-1}b^{-1})$ does not simplify to $1$ unless $a$ and $b$ commute.",
                  "Correct! $(ab)(b^{-1}a^{-1})=a(bb^{-1})a^{-1}=aa^{-1}=1$, and $(b^{-1}a^{-1})(ab)=1$ in the same way.",
                  "Incorrect: $ab$ is its own inverse only when $(ab)^2=1$.",
                  "Incorrect: $(ba)^{-1}=a^{-1}b^{-1}$, which is not the inverse of $ab$ in general."
                ],
                "hints": [
                  "You need an element $c$ with $(ab)c=1$ and $c(ab)=1$.",
                  "Use associativity to regroup $(ab)c$ as $a(bc)$.",
                  "Socks, then shoes: to undo, take off the shoes first."
                ]
              },
              {
                "id": "m373k-u1-l01-ex6",
                "type": "proof",
                "question": "Let $S$ have an associative law of composition with identity $1$, and let $a\\in S$. Suppose $la=1$ and $ar=1$ for some $l,r\\in S$. Prove that $l=r$.",
                "hints": [
                  "Look at the single product $l\\,a\\,r$.",
                  "Bracket it as $(la)r$ and as $l(ar)$.",
                  "Each bracketing simplifies using one of the two hypotheses."
                ],
                "rubric": [
                  "Write $l=l\\cdot 1$ using that $1$ is an identity.",
                  "Replace $1$ by $ar$ to get $l=l(ar)$.",
                  "Apply the associative law: $l(ar)=(la)r$.",
                  "Use $la=1$ and the identity to conclude $(la)r=1\\cdot r=r$, so $l=r$."
                ],
                "modelProof": "Since $1$ is an identity, $l=l\\cdot 1$. By hypothesis $ar=1$, so $l=l(ar)$. By the associative law, $l(ar)=(la)r$. By hypothesis $la=1$, so $(la)r=1\\cdot r=r$. Hence $l=r$. $\\blacksquare$"
              },
              {
                "id": "m373k-u1-l01-ex7",
                "type": "proof",
                "question": "Let $S$ have an associative law with identity $1$, and let $a$ be invertible. Prove that $a^{-1}$ is invertible and $(a^{-1})^{-1}=a$.",
                "hints": [
                  "Write down the two equations that say $a^{-1}$ is the inverse of $a$.",
                  "Read the same two equations with the roles of $a$ and $a^{-1}$ exchanged.",
                  "Use that an invertible element has only one inverse."
                ],
                "rubric": [
                  "State $aa^{-1}=1$ and $a^{-1}a=1$.",
                  "Observe that these equations say $a$ is an inverse of $a^{-1}$, so $a^{-1}$ is invertible.",
                  "Invoke uniqueness of inverses to conclude $(a^{-1})^{-1}=a$."
                ],
                "modelProof": "Because $a^{-1}$ is the inverse of $a$, we have $aa^{-1}=1$ and $a^{-1}a=1$. Read with $a^{-1}$ in the role of the element and $a$ in the role of the candidate inverse, these equations say exactly that $a^{-1}\\cdot a=1$ and $a\\cdot a^{-1}=1$. So $a^{-1}$ is invertible and $a$ is an inverse of it. Inverses are unique: if $b$ and $b'$ are inverses of the same element $c$, then $b=b(cb')=(bc)b'=b'$. Therefore $(a^{-1})^{-1}=a$. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u1-l02",
            "title": "Groups and Subgroups",
            "duration": "13:11",
            "videoUrl": "",
            "theorem": "Definition (Artin 2.2): A group is a set $G$ with a law of composition that is associative, has an identity $1$, and in which every element has an inverse. Proposition 2.2.3 (Cancellation Law): in a group, $ab=ac$ or $ba=ca$ implies $b=c$.",
            "steps": [
              {
                "time": "00:29",
                "label": "Answer from Episode 1",
                "math": "(2*3)*2=8^2=64\\neq 512=2^9=2*(3*2)",
                "caption": "The law $a*b=a^b$ on the positive integers is not associative. Also $a*1=a$ but $1*a=1$, so $1$ is only a right identity and there is no identity."
              },
              {
                "time": "01:28",
                "label": "Definition of a group",
                "math": "(ab)c=a(bc),\\qquad 1a=a=a1,\\qquad ab=1=ba",
                "caption": "A group has an associative law, an identity and inverses. Closure is part of what a law of composition is. A group is abelian if $ab=ba$ for all $a,b$; its order $|G|$ is its number of elements."
              },
              {
                "time": "02:57",
                "label": "First examples",
                "math": "\\mathbb{Z}^+,\\ \\mathbb{R}^+,\\ \\mathbb{R}^\\times\\ \\text{are groups};\\quad (\\mathbb{R},\\times)\\ \\text{is not}",
                "caption": "$0$ has no multiplicative inverse, and the positive integers under addition have no identity."
              },
              {
                "time": "04:09",
                "label": "The cancellation law",
                "math": "ab=ac\\implies a^{-1}(ab)=a^{-1}(ac)\\implies b=c",
                "caption": "Multiply on the left by $a^{-1}$ and use associativity. Without inverses cancellation fails: $0\\cdot 2=0\\cdot 3$ in $\\mathbb{R}$."
              },
              {
                "time": "05:32",
                "label": "Two families of groups",
                "math": "GL_n=\\{A:\\det A\\neq 0\\},\\qquad |S_n|=n!",
                "caption": "Keep only the invertible elements: invertible $n\\times n$ matrices give the general linear group, bijective maps of $\\{1,\\dots,n\\}$ give the symmetric group $S_n$."
              },
              {
                "time": "06:43",
                "label": "The group of order 2",
                "math": "gg=g=g1\\implies g=1",
                "caption": "In a group $\\{1,g\\}$ with $g\\neq 1$, cancellation rules out $gg=g$, so $gg=1$. There is exactly one group of order $2$."
              },
              {
                "time": "07:48",
                "label": "Subgroups",
                "math": "a,b\\in H\\Rightarrow ab\\in H,\\qquad 1\\in H,\\qquad a\\in H\\Rightarrow a^{-1}\\in H",
                "caption": "Associativity is inherited from $G$. Examples: the even integers in $\\mathbb{Z}^+$, the circle group in $\\mathbb{C}^\\times$, and $SL_n(\\mathbb{R})$ in $GL_n(\\mathbb{R})$."
              },
              {
                "time": "10:16",
                "label": "Worked problem: invertible elements form a group",
                "math": "(ab)^{-1}=b^{-1}a^{-1}\\in G",
                "caption": "The invertible elements of a set with an associative law and identity are closed under products and inverses, so they form a group. This is why $GL_n$ and $S_n$ are groups."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u1-l02-ex1",
                "type": "mcq",
                "question": "Which of these is a group?",
                "options": [
                  "$\\mathbb{Z}$ under multiplication",
                  "$\\mathbb{R}$ under multiplication",
                  "$\\mathbb{R}^\\times$ (nonzero reals) under multiplication",
                  "$\\{1,2,3,\\dots\\}$ under addition"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: $2$ has no inverse, since no integer $b$ has $2b=1$.",
                  "Incorrect: $0$ has no multiplicative inverse.",
                  "Correct! Multiplication of nonzero reals is associative, $1$ is the identity, and $a^{-1}=1/a$ is again a nonzero real.",
                  "Incorrect: there is no identity, because $0$ is not a positive integer."
                ],
                "hints": [
                  "Check associativity, identity and inverses for each option.",
                  "Which options contain an element with no inverse?",
                  "Removing $0$ from $\\mathbb{R}$ fixes the only problem with multiplication."
                ]
              },
              {
                "id": "m373k-u1-l02-ex2",
                "type": "mcq",
                "question": "Which subset of $\\mathbb{Z}^+$ is a subgroup?",
                "options": [
                  "the odd integers",
                  "the positive integers",
                  "the even integers",
                  "$\\{-1,0,1\\}$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: $0$ is not odd, and $1+1=2$ is not odd.",
                  "Incorrect: $0$ is missing, and $-1$, the inverse of $1$, is missing.",
                  "Correct! Even plus even is even, $0$ is even, and the negative of an even integer is even.",
                  "Incorrect: $1+1=2$ is not in the set, so closure fails."
                ],
                "hints": [
                  "In additive notation the conditions are: closed under $+$, contains $0$, closed under negatives.",
                  "Check whether $0$ belongs to each set.",
                  "Then check closure under addition."
                ]
              },
              {
                "id": "m373k-u1-l02-ex3",
                "type": "mcq",
                "question": "Is $\\{1,-1,i,-i\\}$ a group under multiplication of complex numbers?",
                "options": [
                  "Yes, an abelian group of order $4$",
                  "Yes, a non-abelian group of order $4$",
                  "No, it is not closed",
                  "No, $i$ has no inverse in the set"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! It is closed ($i\\cdot i=-1$, $i\\cdot(-i)=1$, $(-1)(-i)=i$, ...), contains $1$, and $i^{-1}=-i$. Complex multiplication is commutative.",
                  "Incorrect: complex multiplication is commutative, so the group is abelian.",
                  "Incorrect: every product of two of these numbers is again one of them.",
                  "Incorrect: $i\\cdot(-i)=1$, so $i^{-1}=-i$ is in the set."
                ],
                "hints": [
                  "These are the powers of $i$: $i^0,i^1,i^2,i^3$.",
                  "Multiply a few pairs and see whether you leave the set.",
                  "What is $i\\cdot(-i)$?"
                ]
              },
              {
                "id": "m373k-u1-l02-ex4",
                "type": "mcq",
                "question": "Which of these is a subgroup of $GL_2(\\mathbb{R})$?",
                "options": [
                  "matrices with determinant $2$",
                  "matrices with determinant $1$",
                  "invertible matrices with integer entries",
                  "all real $2\\times 2$ matrices"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $\\det(AB)=4$ when $\\det A=\\det B=2$, and the identity has determinant $1$.",
                  "Correct! This is $SL_2(\\mathbb{R})$: $\\det(AB)=\\det A\\det B=1$, $\\det I=1$, and $\\det A^{-1}=1/\\det A=1$.",
                  "Incorrect: $\\begin{pmatrix}2&0\\\\0&1\\end{pmatrix}$ is invertible with integer entries, but its inverse has entry $\\tfrac12$.",
                  "Incorrect: singular matrices are not even in $GL_2(\\mathbb{R})$."
                ],
                "hints": [
                  "Use $\\det(AB)=\\det A\\det B$.",
                  "A subgroup must contain the identity matrix. What is $\\det I$?",
                  "For integer matrices, compute the inverse of $\\begin{pmatrix}2&0\\\\0&1\\end{pmatrix}$."
                ]
              },
              {
                "id": "m373k-u1-l02-ex5",
                "type": "mcq",
                "question": "In a group $G$, how many solutions $x\\in G$ does the equation $ax=b$ have?",
                "options": [
                  "none in general",
                  "exactly one, namely $x=a^{-1}b$",
                  "exactly one, namely $x=ba^{-1}$",
                  "exactly two"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $x=a^{-1}b$ always works, since $a(a^{-1}b)=b$.",
                  "Correct! $x=a^{-1}b$ is a solution, and if $ax=ax'$ then $x=x'$ by cancellation.",
                  "Incorrect: $a(ba^{-1})=b$ only when $a$ and $b$ commute. Multiply by $a^{-1}$ on the left.",
                  "Incorrect: two solutions would contradict the cancellation law."
                ],
                "hints": [
                  "Multiply both sides of $ax=b$ by $a^{-1}$, on the correct side.",
                  "Check your solution by substituting it back.",
                  "Use cancellation to show there is no second solution."
                ]
              },
              {
                "id": "m373k-u1-l02-ex6",
                "type": "proof",
                "question": "(Vaaler 1.1) Let $S$ be a set with an associative law of composition and an identity element $1$. Prove that the subset $G$ of invertible elements of $S$ is a group.",
                "hints": [
                  "First check that the law restricts to $G$: is a product of invertible elements invertible?",
                  "Associativity is inherited from $S$.",
                  "Check that $1\\in G$ and that $a\\in G$ implies $a^{-1}\\in G$."
                ],
                "rubric": [
                  "Closure: for $a,b\\in G$, show $(ab)(b^{-1}a^{-1})=1=(b^{-1}a^{-1})(ab)$, so $ab\\in G$.",
                  "Associativity holds in $G$ because it holds for all elements of $S$.",
                  "Identity: $1\\cdot 1=1$, so $1$ is invertible and lies in $G$.",
                  "Inverses: $a^{-1}a=1=aa^{-1}$ shows $a^{-1}$ is invertible, so $a^{-1}\\in G$."
                ],
                "modelProof": "Let $a,b\\in G$. Then $(ab)(b^{-1}a^{-1})=a(bb^{-1})a^{-1}=aa^{-1}=1$ and $(b^{-1}a^{-1})(ab)=b^{-1}(a^{-1}a)b=b^{-1}b=1$, so $ab$ is invertible and $ab\\in G$. Thus the law of $S$ restricts to a law of composition on $G$. It is associative because the associative law holds for all elements of $S$. Since $1\\cdot 1=1$, the identity is invertible, so $1\\in G$, and it is an identity for $G$. Finally, if $a\\in G$, the equations $a^{-1}a=1$ and $aa^{-1}=1$ show that $a^{-1}$ is invertible with inverse $a$, so $a^{-1}\\in G$. Hence $G$ is a group. $\\blacksquare$"
              },
              {
                "id": "m373k-u1-l02-ex7",
                "type": "proof",
                "question": "Let $G$ be a group in which $x^2=1$ for every $x\\in G$. Prove that $G$ is abelian.",
                "hints": [
                  "What does $x^2=1$ say about $x^{-1}$?",
                  "Apply this to the element $ab$.",
                  "Recall that $(ab)^{-1}=b^{-1}a^{-1}$."
                ],
                "rubric": [
                  "Deduce $x^{-1}=x$ for every $x\\in G$ from $x\\cdot x=1$.",
                  "Apply this to $ab$: $ab=(ab)^{-1}$.",
                  "Expand $(ab)^{-1}=b^{-1}a^{-1}=ba$ to conclude $ab=ba$."
                ],
                "modelProof": "For every $x\\in G$ we have $x\\cdot x=1$, so $x$ is its own inverse: $x^{-1}=x$. Let $a,b\\in G$. Applying this to $ab$, $a$ and $b$ gives $ab=(ab)^{-1}=b^{-1}a^{-1}=ba$. Since $a,b$ were arbitrary, $G$ is abelian. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u1-l03",
            "title": "The Symmetric Group $S_3$",
            "duration": "12:31",
            "videoUrl": "",
            "theorem": "Artin (2.2.6)–(2.2.7): With $x=(1\\,2\\,3)$ and $y=(1\\,2)$, the symmetric group is $S_3=\\{1,x,x^2,y,xy,x^2y\\}$, and its multiplication is determined by the relations $x^3=1$, $y^2=1$, $yx=x^2y$.",
            "steps": [
              {
                "time": "00:29",
                "label": "Permutations of {1, 2, 3}",
                "math": "|S_3|=3\\cdot 2\\cdot 1=6",
                "caption": "Cycle notation: $(1\\,2\\,3)$ sends $1\\mapsto 2\\mapsto 3\\mapsto 1$, and $(1\\,2)$ swaps $1$ and $2$. In a product $qp$, the permutation $p$ acts first."
              },
              {
                "time": "02:15",
                "label": "Two elements, x and y",
                "math": "yx=(2\\,3)\\neq(1\\,3)=xy",
                "caption": "With $x=(1\\,2\\,3)$ and $y=(1\\,2)$, the two products differ, so $S_3$ is not abelian."
              },
              {
                "time": "04:14",
                "label": "The defining relations",
                "math": "x^3=1,\\qquad y^2=1,\\qquad yx=x^2y",
                "caption": "Computing $x^2y$ with $x^2=(1\\,3\\,2)$ gives $(2\\,3)=yx$. The third relation moves a $y$ to the right past an $x$."
              },
              {
                "time": "05:31",
                "label": "The six elements",
                "math": "S_3=\\{1,\\ x,\\ x^2,\\ y,\\ xy,\\ x^2y\\}",
                "caption": "$x^2=(1\\,3\\,2)$, $xy=(1\\,3)$ and $x^2y=(2\\,3)$. These six permutations are distinct, so they are the whole group."
              },
              {
                "time": "06:30",
                "label": "Computing with the relations",
                "math": "yx^2=(yx)x=x^2yx=x^2x^2y=x^4y=xy",
                "caption": "Move every $y$ to the right with $yx=x^2y$, then shrink exponents with $x^3=1$ and $y^2=1$. Also $x^{-1}=x^2$ and $y^{-1}=y$."
              },
              {
                "time": "08:17",
                "label": "Subgroups of S3",
                "math": "\\{1\\},\\ \\{1,y\\},\\ \\{1,xy\\},\\ \\{1,x^2y\\},\\ \\{1,x,x^2\\},\\ S_3",
                "caption": "Their orders $1,2,3,6$ all divide $6$; Lagrange's theorem (Lesson 7) explains why."
              },
              {
                "time": "09:35",
                "label": "Worked problem: the center",
                "math": "Z(S_3)=\\{z: zg=gz\\ \\text{for all}\\ g\\}=\\{1\\}",
                "caption": "Each of $x,x^2,y,xy,x^2y$ fails to commute with $x$ or with $y$, so only the identity commutes with everything."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u1-l03-ex1",
                "type": "mcq",
                "question": "With $x=(1\\,2\\,3)$ and $y=(1\\,2)$, what is the product $yx$ (so $x$ acts first)?",
                "options": [
                  "$(2\\,3)$",
                  "$(1\\,3)$",
                  "$(1\\,2)$",
                  "$(1\\,3\\,2)$"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! $1\\mapsto 2\\mapsto 1$, $2\\mapsto 3\\mapsto 3$, $3\\mapsto 1\\mapsto 2$: $1$ is fixed and $2,3$ are swapped.",
                  "Incorrect: $(1\\,3)$ is $xy$, where $y$ acts first.",
                  "Incorrect: $(1\\,2)$ is $y$ itself; $yx$ moves $3$.",
                  "Incorrect: $(1\\,3\\,2)$ is $x^2$; $yx$ has a fixed point."
                ],
                "hints": [
                  "Apply $x$ first, then $y$, to each of $1$, $2$, $3$.",
                  "Track where $1$ goes: $x$ sends it to $2$, then $y$ sends $2$ to ...",
                  "A permutation of $\\{1,2,3\\}$ with exactly one fixed point is a transposition."
                ]
              },
              {
                "id": "m373k-u1-l03-ex2",
                "type": "mcq",
                "question": "Using $x^3=1$, $y^2=1$, $yx=x^2y$, reduce $yx^2$ to normal form.",
                "options": [
                  "$x^2y$",
                  "$xy$",
                  "$y$",
                  "$x$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: that is $yx$, not $yx^2$.",
                  "Correct! $yx^2=(yx)x=x^2(yx)=x^2x^2y=x^4y=xy$.",
                  "Incorrect: the $x$'s do not cancel; moving $y$ past $x$ turns $x$ into $x^2$.",
                  "Incorrect: the normal form must still contain $y$, since $yx^2$ is a transposition."
                ],
                "hints": [
                  "Write $yx^2=(yx)x$ and apply the third relation once.",
                  "You get $x^2yx$; apply the relation again to the $yx$ in the middle.",
                  "Finish with $x^3=1$."
                ]
              },
              {
                "id": "m373k-u1-l03-ex3",
                "type": "mcq",
                "question": "Which subset of $S_3$ is a subgroup?",
                "options": [
                  "$\\{1,x,y\\}$",
                  "$\\{1,y,xy\\}$",
                  "$\\{1,x,x^2\\}$",
                  "$\\{x,x^2\\}$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: $xy$ is not in the set, so it is not closed.",
                  "Incorrect: $y\\cdot xy=x^2$ is not in the set.",
                  "Correct! It is closed since $x^3=1$, contains $1$, and $x^{-1}=x^2$.",
                  "Incorrect: it does not contain the identity."
                ],
                "hints": [
                  "Every subgroup contains $1$.",
                  "Check closure by multiplying pairs, using the relations.",
                  "Powers of a single element are always closed."
                ]
              },
              {
                "id": "m373k-u1-l03-ex4",
                "type": "mcq",
                "question": "Compute $(1\\,2)(2\\,3)$ in $S_3$, with the right factor acting first.",
                "options": [
                  "$(1\\,2\\,3)$",
                  "$(1\\,3\\,2)$",
                  "$(1\\,3)$",
                  "the identity"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! $1\\mapsto 1\\mapsto 2$, $2\\mapsto 3\\mapsto 3$, $3\\mapsto 2\\mapsto 1$.",
                  "Incorrect: that is $(2\\,3)(1\\,2)$, the product in the other order.",
                  "Incorrect: a product of two different transpositions in $S_3$ has no fixed points.",
                  "Incorrect: $(1\\,2)$ and $(2\\,3)$ are different, so they do not cancel."
                ],
                "hints": [
                  "Apply $(2\\,3)$ first, then $(1\\,2)$.",
                  "Track $1$: $(2\\,3)$ fixes it, then $(1\\,2)$ sends it to $2$.",
                  "Track $2$ and $3$ the same way and write the result as a cycle."
                ]
              },
              {
                "id": "m373k-u1-l03-ex5",
                "type": "mcq",
                "question": "Reduce $(x^2y)^2$ to normal form.",
                "options": [
                  "$x$",
                  "$1$",
                  "$x^2y$",
                  "$y$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: the $y$'s pair up and the $x$'s add up to $x^3$.",
                  "Correct! $(x^2y)(x^2y)=x^2(yx^2)y=x^2(xy)y=x^3y^2=1$. This makes sense: $x^2y=(2\\,3)$ is a transposition.",
                  "Incorrect: that would mean $x^2y=1$.",
                  "Incorrect: the result contains $y^2=1$, so no $y$ survives."
                ],
                "hints": [
                  "Write it out: $x^2y\\,x^2y$.",
                  "Use $yx^2=xy$ on the middle factor.",
                  "Which permutation is $x^2y$? What is the square of a transposition?"
                ]
              },
              {
                "id": "m373k-u1-l03-ex6",
                "type": "proof",
                "question": "Using only the relations $x^3=1$, $y^2=1$ and $yx=x^2y$, prove that $yx^2=xy$ and that $yx^{-1}=xy$.",
                "hints": [
                  "Move $y$ past one $x$ at a time.",
                  "After two applications of $yx=x^2y$ you reach $x^4y$.",
                  "For the second part, find $x^{-1}$ from $x^3=1$."
                ],
                "rubric": [
                  "Write $yx^2=(yx)x=(x^2y)x=x^2(yx)$.",
                  "Apply the relation again: $x^2(yx)=x^2x^2y=x^4y$.",
                  "Use $x^3=1$: $x^4y=xy$.",
                  "Since $x\\cdot x^2=x^3=1$, $x^{-1}=x^2$, so $yx^{-1}=yx^2=xy$."
                ],
                "modelProof": "Using associativity and $yx=x^2y$ twice: $yx^2=(yx)x=(x^2y)x=x^2(yx)=x^2(x^2y)=x^4y=x^3\\cdot xy=xy$, since $x^3=1$. Next, $x\\cdot x^2=x^3=1$ and $x^2\\cdot x=1$, so $x^{-1}=x^2$. Therefore $yx^{-1}=yx^2=xy$. $\\blacksquare$"
              },
              {
                "id": "m373k-u1-l03-ex7",
                "type": "proof",
                "question": "Prove that the six elements $1,x,x^2,y,xy,x^2y$ of $S_3$ are distinct.",
                "hints": [
                  "Suppose $x^iy^j=x^ky^l$ with $i,k\\in\\{0,1,2\\}$ and $j,l\\in\\{0,1\\}$.",
                  "Split into the cases $j=l$ and $j\\neq l$.",
                  "In the second case, show $y$ would be a power of $x$."
                ],
                "rubric": [
                  "Case $j=l$: cancel $y^j$ on the right to get $x^i=x^k$.",
                  "Note that $1$, $x=(1\\,2\\,3)$, $x^2=(1\\,3\\,2)$ are different permutations, so $i=k$.",
                  "Case $j\\neq l$: rearrange to express $y$ as a power of $x$.",
                  "Observe $y=(1\\,2)$ is not among $1,(1\\,2\\,3),(1\\,3\\,2)$, a contradiction."
                ],
                "modelProof": "Suppose $x^iy^j=x^ky^l$ with $i,k\\in\\{0,1,2\\}$ and $j,l\\in\\{0,1\\}$. If $j=l$, cancelling $y^j$ on the right gives $x^i=x^k$. The permutations $1$, $x=(1\\,2\\,3)$ and $x^2=(1\\,3\\,2)$ are distinct, so $i=k$. If $j\\neq l$, say $j=1$ and $l=0$ (the other case is symmetric), then $x^iy=x^k$, so $y=x^{-i}x^k=x^{k-i}$ is a power of $x$. But the powers of $x$ are $1,(1\\,2\\,3),(1\\,3\\,2)$, and $y=(1\\,2)$ is none of these, a contradiction. Hence equal products have equal exponents, and the six elements are distinct. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u1-l04",
            "title": "Subgroups of the Integers",
            "duration": "14:59",
            "videoUrl": "",
            "theorem": "Theorem 2.3.3 (Artin): Let $S$ be a subgroup of $\\mathbb{Z}^+$. Either $S=\\{0\\}$, or $S=\\mathbb{Z}a$ where $a$ is the smallest positive integer in $S$. Consequently $\\mathbb{Z}a+\\mathbb{Z}b=\\mathbb{Z}d$ with $d=\\gcd(a,b)$, and $d=ra+sb$ for some integers $r,s$.",
            "steps": [
              {
                "time": "00:28",
                "label": "Answer from Episode 3",
                "math": "\\{6r+10s: r,s\\in\\mathbb{Z}\\}=\\mathbb{Z}2",
                "caption": "Every combination $6r+10s$ is even, and $2=6\\cdot 2+10\\cdot(-1)$, so the combinations are exactly the even integers. Note $2=\\gcd(6,10)$."
              },
              {
                "time": "01:22",
                "label": "The subgroups Za",
                "math": "\\mathbb{Z}a=\\{ka: k\\in\\mathbb{Z}\\}",
                "caption": "The multiples of $a$ form a subgroup of $\\mathbb{Z}^+$: $ka+la=(k+l)a$, $0=0a$, $-(ka)=(-k)a$."
              },
              {
                "time": "02:44",
                "label": "Theorem 2.3.3",
                "math": "n=qa+r,\\quad 0\\le r<a,\\quad r=n-qa\\in S\\implies r=0",
                "caption": "Let $a$ be the smallest positive element of $S$. Every multiple of $a$ is in $S$; conversely, dividing any $n\\in S$ by $a$ leaves a remainder in $S$ that is smaller than $a$, so the remainder is $0$."
              },
              {
                "time": "05:28",
                "label": "Greatest common divisor",
                "math": "\\mathbb{Z}a+\\mathbb{Z}b=\\mathbb{Z}d,\\qquad d=\\gcd(a,b)=ra+sb",
                "caption": "$d$ divides $a$ and $b$, every common divisor of $a$ and $b$ divides $d$, and $d$ is an integer combination of $a$ and $b$ (Proposition 2.3.5)."
              },
              {
                "time": "07:30",
                "label": "The Euclidean algorithm",
                "math": "\\gcd(252,198)=18=4\\cdot 252-5\\cdot 198",
                "caption": "$252=198+54$, $198=3\\cdot 54+36$, $54=36+18$, $36=2\\cdot 18$. Back-substitution writes $18$ as a combination."
              },
              {
                "time": "08:45",
                "label": "Relatively prime integers and primes",
                "math": "p\\mid ab\\implies p\\mid a\\ \\text{or}\\ p\\mid b",
                "caption": "$a,b$ are relatively prime iff $ra+sb=1$ for some $r,s$ (Corollary 2.3.6). If $p\\nmid a$ then $ra+sp=1$; multiplying by $b$ shows $p\\mid b$ (Corollary 2.3.7)."
              },
              {
                "time": "10:33",
                "label": "Least common multiple",
                "math": "\\mathbb{Z}a\\cap\\mathbb{Z}b=\\mathbb{Z}m,\\qquad ab=dm",
                "caption": "The intersection is generated by $m=\\operatorname{lcm}(a,b)$, and for positive $a,b$, $ab=\\gcd(a,b)\\operatorname{lcm}(a,b)$ (Corollary 2.3.9)."
              },
              {
                "time": "12:15",
                "label": "Worked problem",
                "math": "ra+sb=1\\implies c=rac+sbc",
                "caption": "If $\\gcd(a,b)=1$ and $a\\mid bc$, then $a$ divides both $rac$ and $sbc$, so $a\\mid c$."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u1-l04-ex1",
                "type": "mcq",
                "question": "$\\mathbb{Z}12+\\mathbb{Z}18$ equals which subgroup of $\\mathbb{Z}^+$?",
                "options": [
                  "$\\mathbb{Z}2$",
                  "$\\mathbb{Z}6$",
                  "$\\mathbb{Z}30$",
                  "$\\mathbb{Z}36$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: every combination $12r+18s$ is a multiple of $6$, so $2$ is not in the subgroup.",
                  "Correct! The sum is $\\mathbb{Z}d$ with $d=\\gcd(12,18)=6$; for instance $6=18-12$.",
                  "Incorrect: $12+18=30$ is in the subgroup, but so is $6$, which is smaller.",
                  "Incorrect: $36=\\operatorname{lcm}(12,18)$ generates the intersection $\\mathbb{Z}12\\cap\\mathbb{Z}18$, not the sum."
                ],
                "hints": [
                  "$\\mathbb{Z}a+\\mathbb{Z}b$ is generated by $\\gcd(a,b)$.",
                  "Find the smallest positive value of $12r+18s$.",
                  "Try $r=-1$, $s=1$."
                ]
              },
              {
                "id": "m373k-u1-l04-ex2",
                "type": "mcq",
                "question": "$\\mathbb{Z}12\\cap\\mathbb{Z}18$ equals which subgroup of $\\mathbb{Z}^+$?",
                "options": [
                  "$\\mathbb{Z}36$",
                  "$\\mathbb{Z}6$",
                  "$\\mathbb{Z}72$",
                  "$\\mathbb{Z}216$"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! The intersection is $\\mathbb{Z}m$ with $m=\\operatorname{lcm}(12,18)=36$.",
                  "Incorrect: $6$ is not a multiple of $12$. $\\mathbb{Z}6$ is the sum $\\mathbb{Z}12+\\mathbb{Z}18$.",
                  "Incorrect: $72$ is a common multiple, but $36$ is a smaller one.",
                  "Incorrect: $216=12\\cdot 18$ is a common multiple, but not the least."
                ],
                "hints": [
                  "An integer is in both subgroups when it is a multiple of both $12$ and $18$.",
                  "The intersection is generated by the least common multiple.",
                  "Use $ab=\\gcd(a,b)\\operatorname{lcm}(a,b)$: $216=6\\cdot m$."
                ]
              },
              {
                "id": "m373k-u1-l04-ex3",
                "type": "mcq",
                "question": "Compute $\\gcd(1071,462)$.",
                "options": [
                  "$7$",
                  "$21$",
                  "$42$",
                  "$3$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $7$ is a common divisor, but $21$ is a larger one.",
                  "Correct! $1071=2\\cdot 462+147$, $462=3\\cdot 147+21$, $147=7\\cdot 21$.",
                  "Incorrect: $42$ does not divide $1071$, which is odd.",
                  "Incorrect: $3$ is a common divisor, but not the greatest."
                ],
                "hints": [
                  "Use the Euclidean algorithm: divide $1071$ by $462$.",
                  "Continue with $462$ and the remainder $147$.",
                  "The last nonzero remainder is the gcd."
                ]
              },
              {
                "id": "m373k-u1-l04-ex4",
                "type": "mcq",
                "question": "Positive integers $a,b$ have $\\gcd(a,b)=6$ and $\\operatorname{lcm}(a,b)=72$. If $a=18$, what is $b$?",
                "options": [
                  "$12$",
                  "$24$",
                  "$36$",
                  "$72$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $\\operatorname{lcm}(18,12)=36$, not $72$.",
                  "Correct! $ab=\\gcd(a,b)\\operatorname{lcm}(a,b)=6\\cdot 72=432$, so $b=432/18=24$. Check: $\\gcd(18,24)=6$.",
                  "Incorrect: $\\gcd(18,36)=18$, not $6$.",
                  "Incorrect: $\\gcd(18,72)=18$, not $6$."
                ],
                "hints": [
                  "Use Corollary 2.3.9: $ab=dm$.",
                  "Compute $dm=6\\cdot 72$.",
                  "Divide by $a=18$ and check the gcd."
                ]
              },
              {
                "id": "m373k-u1-l04-ex5",
                "type": "mcq",
                "question": "If $6$ divides $ab$, must $6$ divide $a$ or $b$?",
                "options": [
                  "Yes, always",
                  "No: take $a=2$, $b=3$",
                  "Only when $a=b$",
                  "Yes, whenever $a$ and $b$ are positive"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $6\\mid 2\\cdot 3$, but $6\\nmid 2$ and $6\\nmid 3$.",
                  "Correct! Corollary 2.3.7 needs a prime. $6$ is not prime, and $a=2$, $b=3$ is a counterexample.",
                  "Incorrect: the counterexample $a=2$, $b=3$ has $a\\neq b$, and $a=b$ is not what matters.",
                  "Incorrect: $a=2$ and $b=3$ are positive."
                ],
                "hints": [
                  "Corollary 2.3.7 is stated for a prime $p$.",
                  "Factor $6=2\\cdot 3$.",
                  "Look for $a,b$ that each contain only one of the prime factors."
                ]
              },
              {
                "id": "m373k-u1-l04-ex6",
                "type": "proof",
                "question": "(Theorem 2.3.3) Let $S\\neq\\{0\\}$ be a subgroup of $\\mathbb{Z}^+$ and let $a$ be the smallest positive integer in $S$. Prove that $S=\\mathbb{Z}a$.",
                "hints": [
                  "First explain why $S$ contains a positive integer at all.",
                  "Prove two inclusions: $\\mathbb{Z}a\\subseteq S$ and $S\\subseteq\\mathbb{Z}a$.",
                  "For $S\\subseteq\\mathbb{Z}a$, divide $n\\in S$ by $a$ with remainder."
                ],
                "rubric": [
                  "Show $S$ contains a positive integer: some $n\\neq 0$ lies in $S$, and so does $-n$.",
                  "Show $\\mathbb{Z}a\\subseteq S$ using closure (for $ka$, $k>0$), inverses and $0\\in S$.",
                  "For $n\\in S$ write $n=qa+r$ with $0\\le r<a$ and show $r=n-qa\\in S$.",
                  "Use minimality of $a$ to conclude $r=0$, so $n=qa\\in\\mathbb{Z}a$."
                ],
                "modelProof": "Since $S\\neq\\{0\\}$ it contains some $n\\neq 0$, and also $-n$; one of these is positive, so $a$ exists. ($\\mathbb{Z}a\\subseteq S$) For $k>0$, $ka=a+\\dots+a$ ($k$ terms) lies in $S$ by closure and induction; then $-ka\\in S$ because $S$ contains inverses, and $0=0a\\in S$. ($S\\subseteq\\mathbb{Z}a$) Let $n\\in S$ and divide with remainder: $n=qa+r$ with $0\\le r<a$. Since $qa\\in S$ and $S$ is a subgroup, $r=n+(-qa)\\in S$. As $a$ is the smallest positive element of $S$ and $0\\le r<a$, we must have $r=0$. Hence $n=qa\\in\\mathbb{Z}a$, and $S=\\mathbb{Z}a$. $\\blacksquare$"
              },
              {
                "id": "m373k-u1-l04-ex7",
                "type": "proof",
                "question": "Let $a,b,c$ be integers with $a$ and $b$ relatively prime. Prove that if $a$ divides $bc$, then $a$ divides $c$.",
                "hints": [
                  "Relatively prime means $\\gcd(a,b)=1$; use Corollary 2.3.6.",
                  "Multiply the equation $ra+sb=1$ by $c$.",
                  "Show $a$ divides each term on the left."
                ],
                "rubric": [
                  "Write $ra+sb=1$ for some integers $r,s$.",
                  "Multiply by $c$ to get $c=rac+sbc$.",
                  "Note $a\\mid rac$, and $a\\mid sbc$ because $a\\mid bc$.",
                  "Conclude $a$ divides the sum, which is $c$."
                ],
                "modelProof": "Since $\\gcd(a,b)=1$, Corollary 2.3.6 gives integers $r,s$ with $ra+sb=1$. Multiplying by $c$ gives $c=rac+sbc$. The integer $a$ divides $rac$, and since $a\\mid bc$ it also divides $sbc$. Therefore $a$ divides their sum, which is $c$. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u1-l05",
            "title": "Cyclic Groups and the Order of an Element",
            "duration": "11:47",
            "videoUrl": "",
            "theorem": "Proposition 2.4.2 (Artin): Let $x$ be an element of a group and $S=\\{k\\in\\mathbb{Z}: x^k=1\\}$. Then $S$ is a subgroup of $\\mathbb{Z}^+$. If $S=\\mathbb{Z}n$ with $n>0$, the powers $1,x,\\dots,x^{n-1}$ are the distinct elements of $\\langle x\\rangle$, and $\\langle x\\rangle$ has order $n$.",
            "steps": [
              {
                "time": "01:22",
                "label": "The cyclic subgroup generated by x",
                "math": "\\langle x\\rangle=\\{\\dots,x^{-2},x^{-1},1,x,x^2,\\dots\\}",
                "caption": "$\\langle x\\rangle$ is the set of all powers of $x$, the smallest subgroup containing $x$. Different exponents may give the same element: in $\\mathbb{R}^\\times$, $\\langle -1\\rangle=\\{1,-1\\}$."
              },
              {
                "time": "03:05",
                "label": "Exponents that give the identity",
                "math": "S=\\{k\\in\\mathbb{Z}: x^k=1\\}\\le\\mathbb{Z}^+",
                "caption": "If $x^k=1$ and $x^l=1$ then $x^{k+l}=1$; $x^0=1$; and $x^{-k}=(x^k)^{-1}=1$. So $S$ is a subgroup of $\\mathbb{Z}^+$, hence $S=\\{0\\}$ or $S=\\mathbb{Z}n$ by Theorem 2.3.3."
              },
              {
                "time": "04:01",
                "label": "The order of an element",
                "math": "x^r=x^s\\iff x^{r-s}=1\\iff n\\mid r-s",
                "caption": "The order of $x$ is the smallest $n>0$ with $x^n=1$. Then $\\langle x\\rangle=\\{1,x,\\dots,x^{n-1}\\}$ has exactly $n$ elements. If no such $n$ exists, $x$ has infinite order."
              },
              {
                "time": "05:42",
                "label": "Reducing exponents",
                "math": "k=nq+r\\implies x^k=(x^n)^q\\,x^r=x^r",
                "caption": "For $x$ of order $n$: $x^k=x^r$ where $r$ is the remainder of $k$ modulo $n$, and $x^k=1$ if and only if $n\\mid k$ (Proposition 2.4.3)."
              },
              {
                "time": "06:37",
                "label": "The order of a power",
                "math": "\\operatorname{ord}(x^k)=\\frac{n}{\\gcd(k,n)}",
                "caption": "If $x$ has order $n$ and $d=\\gcd(k,n)$, then $x^k$ has order $n/d$. In particular $x^k$ generates $\\langle x\\rangle$ exactly when $\\gcd(k,n)=1$."
              },
              {
                "time": "08:03",
                "label": "Groups that are not cyclic",
                "math": "V=\\left\\{\\begin{pmatrix}\\pm1&0\\\\0&\\pm1\\end{pmatrix}\\right\\}",
                "caption": "In the Klein four group $V$ every element has order $1$ or $2$, so no element generates the whole group. It is the simplest group that is not cyclic."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u1-l05-ex1",
                "type": "mcq",
                "question": "What is the order of $i$ in the group $\\mathbb{C}^\\times$?",
                "options": [
                  "$2$",
                  "$4$",
                  "$8$",
                  "infinite"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $i^2=-1\\neq 1$.",
                  "Correct! $i^1=i$, $i^2=-1$, $i^3=-i$, $i^4=1$, so $\\langle i\\rangle=\\{1,i,-1,-i\\}$ has order $4$.",
                  "Incorrect: $i^4=1$ already, and the order is the smallest positive such exponent.",
                  "Incorrect: some positive power of $i$ equals $1$."
                ],
                "hints": [
                  "List the powers $i^1,i^2,i^3,\\dots$ until you reach $1$.",
                  "$i^2=-1$.",
                  "The order is the first positive exponent that gives $1$."
                ]
              },
              {
                "id": "m373k-u1-l05-ex2",
                "type": "mcq",
                "question": "Let $x$ have order $12$. What is the order of $x^8$?",
                "options": [
                  "$3$",
                  "$4$",
                  "$8$",
                  "$12$"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! $\\operatorname{ord}(x^8)=12/\\gcd(8,12)=12/4=3$. Check: $(x^8)^3=x^{24}=1$, while $(x^8)^1$ and $(x^8)^2=x^{16}=x^4$ are not $1$.",
                  "Incorrect: $4=\\gcd(8,12)$; the order is $12/4$.",
                  "Incorrect: the order of a power is not its exponent.",
                  "Incorrect: $x^8$ generates $\\langle x\\rangle$ only if $\\gcd(8,12)=1$, which is false."
                ],
                "hints": [
                  "Use $\\operatorname{ord}(x^k)=n/\\gcd(k,n)$.",
                  "Compute $\\gcd(8,12)$.",
                  "Check your answer by computing $(x^8)^m$ for small $m$."
                ]
              },
              {
                "id": "m373k-u1-l05-ex3",
                "type": "mcq",
                "question": "Let $x$ have order $12$. Which powers of $x$ generate $\\langle x\\rangle$?",
                "options": [
                  "$x^2$, $x^4$, $x^6$",
                  "$x$, $x^5$, $x^7$, $x^{11}$",
                  "$x^3$, $x^9$",
                  "every odd power $x^k$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: these have orders $6$, $3$ and $2$.",
                  "Correct! $x^k$ generates exactly when $\\gcd(k,12)=1$, that is, $k=1,5,7,11$.",
                  "Incorrect: $x^3$ and $x^9$ have order $12/3=4$.",
                  "Incorrect: $x^3$ is an odd power with order $4$."
                ],
                "hints": [
                  "$x^k$ generates $\\langle x\\rangle$ exactly when its order is $12$.",
                  "Use $\\operatorname{ord}(x^k)=12/\\gcd(k,12)$.",
                  "List the $k$ in $\\{1,\\dots,11\\}$ with $\\gcd(k,12)=1$."
                ]
              },
              {
                "id": "m373k-u1-l05-ex4",
                "type": "mcq",
                "question": "Let $x$ have order $10$. Which element is $x^{37}$?",
                "options": [
                  "$x^3$",
                  "$x^7$",
                  "$1$",
                  "it cannot be simplified"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $x^3=x^{-7}$; reduce $37$, not $-37$, modulo $10$.",
                  "Correct! $37=3\\cdot 10+7$, so $x^{37}=(x^{10})^3x^7=x^7$.",
                  "Incorrect: $x^{37}=1$ would need $10\\mid 37$.",
                  "Incorrect: exponents can always be reduced modulo the order."
                ],
                "hints": [
                  "Divide $37$ by $10$ with remainder.",
                  "$x^{10}=1$.",
                  "Proposition 2.4.3: $x^k=x^r$ for the remainder $r$."
                ]
              },
              {
                "id": "m373k-u1-l05-ex5",
                "type": "mcq",
                "question": "What is the order of $A=\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$ in $GL_2(\\mathbb{R})$?",
                "options": [
                  "$1$",
                  "$2$",
                  "$6$",
                  "infinite"
                ],
                "correctIndex": 3,
                "optionExplanations": [
                  "Incorrect: $A\\neq I$.",
                  "Incorrect: $A^2=\\begin{pmatrix}1&2\\\\0&1\\end{pmatrix}\\neq I$.",
                  "Incorrect: $6$ is the order of $\\begin{pmatrix}1&-1\\\\1&0\\end{pmatrix}$, not of $A$.",
                  "Correct! By induction $A^n=\\begin{pmatrix}1&n\\\\0&1\\end{pmatrix}$, which is never $I$ for $n>0$."
                ],
                "hints": [
                  "Compute $A^2$ and $A^3$.",
                  "Guess a formula for $A^n$ and prove it by induction.",
                  "Is the upper right entry of $A^n$ ever $0$ for $n>0$?"
                ]
              },
              {
                "id": "m373k-u1-l05-ex6",
                "type": "proof",
                "question": "(Vaaler 1.4) Prove that every subgroup of a cyclic group is cyclic.",
                "hints": [
                  "Let $G=\\langle x\\rangle$ and $H\\le G$. Consider $S=\\{k\\in\\mathbb{Z}: x^k\\in H\\}$.",
                  "Show $S$ is a subgroup of $\\mathbb{Z}^+$ and apply Theorem 2.3.3.",
                  "If $S=\\mathbb{Z}m$, show $H=\\langle x^m\\rangle$."
                ],
                "rubric": [
                  "Define $S=\\{k\\in\\mathbb{Z}: x^k\\in H\\}$ and check closure, $0\\in S$, and inverses.",
                  "Conclude $S=\\{0\\}$ or $S=\\mathbb{Z}m$ with $m>0$.",
                  "Handle $S=\\{0\\}$: then $H=\\{1\\}=\\langle 1\\rangle$.",
                  "For $S=\\mathbb{Z}m$: every element of $H$ is $x^k$ with $k=mj$, so $H=\\{(x^m)^j\\}=\\langle x^m\\rangle$."
                ],
                "modelProof": "Let $G=\\langle x\\rangle$ and $H\\le G$. Put $S=\\{k\\in\\mathbb{Z}: x^k\\in H\\}$. If $k,l\\in S$ then $x^{k+l}=x^kx^l\\in H$, so $k+l\\in S$; $x^0=1\\in H$, so $0\\in S$; and $x^{-k}=(x^k)^{-1}\\in H$, so $-k\\in S$. Thus $S$ is a subgroup of $\\mathbb{Z}^+$, and by Theorem 2.3.3 either $S=\\{0\\}$ or $S=\\mathbb{Z}m$ with $m>0$. Every element of $H$ lies in $G$, so it has the form $x^k$, and then $k\\in S$. If $S=\\{0\\}$, then $H=\\{x^0\\}=\\{1\\}=\\langle 1\\rangle$. If $S=\\mathbb{Z}m$, then each element of $H$ is $x^{mj}=(x^m)^j$ for some $j$, so $H\\subseteq\\langle x^m\\rangle$; conversely $x^m\\in H$, so $\\langle x^m\\rangle\\subseteq H$. Hence $H=\\langle x^m\\rangle$ is cyclic. $\\blacksquare$"
              },
              {
                "id": "m373k-u1-l05-ex7",
                "type": "proof",
                "question": "(Vaaler 1.5) Let $G$ be a cyclic group of order $n$, and let $r$ be a positive integer dividing $n$. Prove that $G$ contains exactly one subgroup of order $r$. You may use the previous problem.",
                "hints": [
                  "Existence: try $\\langle x^{n/r}\\rangle$ where $G=\\langle x\\rangle$.",
                  "Uniqueness: a subgroup $H$ of order $r$ is $\\langle x^m\\rangle$, where $\\mathbb{Z}m=\\{k: x^k\\in H\\}$.",
                  "Since $x^n=1\\in H$, $m$ divides $n$; compute the order of $x^m$."
                ],
                "rubric": [
                  "Existence: show $x^{n/r}$ has order $n/\\gcd(n/r,n)=r$, so $\\langle x^{n/r}\\rangle$ has order $r$.",
                  "Uniqueness: write $H=\\langle x^m\\rangle$ with $\\mathbb{Z}m=\\{k: x^k\\in H\\}$, using the previous problem's proof.",
                  "Show $m\\mid n$ because $n\\in\\mathbb{Z}m$, so $\\operatorname{ord}(x^m)=n/m$.",
                  "Conclude $n/m=r$, so $m=n/r$ and $H=\\langle x^{n/r}\\rangle$."
                ],
                "modelProof": "Write $G=\\langle x\\rangle$ with $x$ of order $n$. Existence: $n/r$ divides $n$, so $\\gcd(n/r,n)=n/r$ and $x^{n/r}$ has order $n/(n/r)=r$; thus $\\langle x^{n/r}\\rangle$ is a subgroup of order $r$. Uniqueness: let $H\\le G$ have order $r$. As in the previous problem, $S=\\{k: x^k\\in H\\}$ is a subgroup of $\\mathbb{Z}^+$ and $H=\\langle x^m\\rangle$, where $S=\\mathbb{Z}m$ with $m>0$ (if $S=\\{0\\}$ then $H=\\{1\\}$, but $x^n=1\\in H$ forces $n\\in S$, so $S\\neq\\{0\\}$). Since $n\\in S=\\mathbb{Z}m$, $m$ divides $n$, hence $\\gcd(m,n)=m$ and $x^m$ has order $n/m$. So $r=|H|=n/m$, giving $m=n/r$ and $H=\\langle x^{n/r}\\rangle$. Therefore the subgroup of order $r$ is unique. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u1-l06",
            "title": "Equivalence Relations and Partitions",
            "duration": "9:52",
            "videoUrl": "",
            "theorem": "Proposition 2.7.4 (Artin): An equivalence relation on a set $S$ determines a partition of $S$, and conversely. The parts are the equivalence classes $C_a=\\{b\\in S: a\\sim b\\}$, and two classes are either equal or disjoint (Lemma 2.7.6).",
            "steps": [
              {
                "time": "01:25",
                "label": "Partitions",
                "math": "S=\\bigcup_i U_i,\\qquad U_i\\neq\\emptyset,\\qquad U_i\\cap U_j=\\emptyset\\ (i\\neq j)",
                "caption": "A partition of $S$ divides it into nonempty subsets that do not overlap, such as the even and the odd integers."
              },
              {
                "time": "02:09",
                "label": "Equivalence relations",
                "math": "a\\sim a,\\qquad a\\sim b\\Rightarrow b\\sim a,\\qquad a\\sim b,\\ b\\sim c\\Rightarrow a\\sim c",
                "caption": "Reflexive, symmetric, transitive. Example: conjugacy in a group, where $a\\sim b$ if $b=gag^{-1}$ for some $g\\in G$."
              },
              {
                "time": "03:18",
                "label": "Conjugacy is transitive",
                "math": "c=g_2(g_1ag_1^{-1})g_2^{-1}=(g_2g_1)\\,a\\,(g_2g_1)^{-1}",
                "caption": "If $b=g_1ag_1^{-1}$ and $c=g_2bg_2^{-1}$, then $c$ is conjugate to $a$ by $g_2g_1$."
              },
              {
                "time": "04:17",
                "label": "Classes are equal or disjoint",
                "math": "C_a\\cap C_b\\neq\\emptyset\\implies C_a=C_b",
                "caption": "If $d$ lies in both classes, then $a\\sim d$ and, by symmetry, $d\\sim b$. For any $x\\in C_b$, $b\\sim x$, and transitivity gives $a\\sim x$, so $C_b\\subseteq C_a$; the other inclusion is the same argument."
              },
              {
                "time": "06:33",
                "label": "The set of classes",
                "math": "\\pi:S\\to\\bar S,\\quad \\pi(a)=\\bar a,\\qquad \\bar a=\\bar b\\iff a\\sim b",
                "caption": "The classes become the elements of a new set $\\bar S$. The bar notation says that equivalent elements have been declared equal."
              },
              {
                "time": "07:16",
                "label": "Fibres of a map",
                "math": "f^{-1}(t)=\\{s\\in S: f(s)=t\\}",
                "caption": "Any map $f:S\\to T$ defines $a\\sim b$ if $f(a)=f(b)$. The nonempty fibres are the classes, and they correspond to the elements of the image of $f$."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u1-l06-ex1",
                "type": "mcq",
                "question": "On $\\mathbb{Z}$ define $a\\sim b$ if $a-b$ is even. What are the equivalence classes?",
                "options": [
                  "two classes: the even integers and the odd integers",
                  "one class, all of $\\mathbb{Z}$",
                  "infinitely many classes",
                  "this is not an equivalence relation"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! $a\\sim b$ exactly when $a$ and $b$ have the same parity, so there are two classes.",
                  "Incorrect: $0\\not\\sim 1$, since $0-1=-1$ is odd.",
                  "Incorrect: every integer is equivalent to $0$ or to $1$.",
                  "Incorrect: $a-a=0$ is even; if $a-b$ is even so is $b-a$; and $(a-b)+(b-c)=a-c$."
                ],
                "hints": [
                  "Check reflexive, symmetric, transitive first.",
                  "Which integers are equivalent to $0$?",
                  "Which integers are equivalent to $1$?"
                ]
              },
              {
                "id": "m373k-u1-l06-ex2",
                "type": "mcq",
                "question": "On $\\mathbb{Z}$ define $a\\sim b$ if $a\\le b$. Which property of an equivalence relation fails?",
                "options": [
                  "reflexive",
                  "symmetric",
                  "transitive",
                  "none; it is an equivalence relation"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $a\\le a$ for every $a$.",
                  "Correct! $1\\le 2$ but $2\\not\\le 1$.",
                  "Incorrect: $a\\le b$ and $b\\le c$ imply $a\\le c$.",
                  "Incorrect: symmetry fails."
                ],
                "hints": [
                  "Test each of the three properties.",
                  "Try $a=1$, $b=2$.",
                  "Does $a\\le b$ imply $b\\le a$?"
                ]
              },
              {
                "id": "m373k-u1-l06-ex3",
                "type": "mcq",
                "question": "On $\\mathbb{R}$ define $a\\sim b$ if $|a-b|<1$. Which property fails?",
                "options": [
                  "reflexive",
                  "symmetric",
                  "transitive",
                  "none; it is an equivalence relation"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: $|a-a|=0<1$.",
                  "Incorrect: $|a-b|=|b-a|$.",
                  "Correct! $0\\sim 0.6$ and $0.6\\sim 1.2$, but $|0-1.2|=1.2$, so $0\\not\\sim 1.2$.",
                  "Incorrect: transitivity fails."
                ],
                "hints": [
                  "Reflexivity and symmetry are quick to check.",
                  "For transitivity, chain two small steps.",
                  "Try $0$, $0.6$ and $1.2$."
                ]
              },
              {
                "id": "m373k-u1-l06-ex4",
                "type": "mcq",
                "question": "How many conjugacy classes does $S_3$ have?",
                "options": [
                  "$2$",
                  "$3$",
                  "$4$",
                  "$6$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $\\{1\\}$ is a class on its own, and rotations are never conjugate to transpositions.",
                  "Correct! The classes are $\\{1\\}$, $\\{x,x^2\\}$ and $\\{y,xy,x^2y\\}$. For example $yxy^{-1}=yxy=x^2$.",
                  "Incorrect: $x$ and $x^2$ are conjugate, since $yxy^{-1}=x^2$.",
                  "Incorrect: that would require every element to be conjugate only to itself, which happens only in abelian groups."
                ],
                "hints": [
                  "Conjugate elements have the same order.",
                  "Compute $yxy^{-1}$ using $yx=x^2y$ and $y^{-1}=y$.",
                  "The identity is always a class by itself."
                ]
              },
              {
                "id": "m373k-u1-l06-ex5",
                "type": "mcq",
                "question": "How many different equivalence relations are there on a set with $3$ elements?",
                "options": [
                  "$3$",
                  "$5$",
                  "$6$",
                  "$8$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: there are more partitions than that.",
                  "Correct! Equivalence relations correspond to partitions: $\\{a,b,c\\}$; $\\{a\\},\\{b,c\\}$; $\\{b\\},\\{a,c\\}$; $\\{c\\},\\{a,b\\}$; $\\{a\\},\\{b\\},\\{c\\}$.",
                  "Incorrect: $6$ is the number of permutations, not of partitions.",
                  "Incorrect: $8$ is the number of subsets."
                ],
                "hints": [
                  "By Proposition 2.7.4, count partitions instead.",
                  "Sort partitions by the number of parts: $1$, $2$ or $3$.",
                  "With $2$ parts, one part is a single element."
                ]
              },
              {
                "id": "m373k-u1-l06-ex6",
                "type": "proof",
                "question": "(Lemma 2.7.6) Let $\\sim$ be an equivalence relation on $S$ and $C_a=\\{b\\in S: a\\sim b\\}$. Prove that if $C_a$ and $C_b$ have an element in common, then $C_a=C_b$.",
                "hints": [
                  "Let $d\\in C_a\\cap C_b$. Write down what this means.",
                  "By symmetry of the roles of $a$ and $b$, it suffices to show $C_b\\subseteq C_a$.",
                  "Take $x\\in C_b$ and connect $a$ to $x$ by a chain."
                ],
                "rubric": [
                  "From $d\\in C_a\\cap C_b$, record $a\\sim d$ and $b\\sim d$.",
                  "Use symmetry to get $d\\sim b$.",
                  "For $x\\in C_b$, use $b\\sim x$ and transitivity twice to get $a\\sim x$.",
                  "Conclude $C_b\\subseteq C_a$, and the same argument with $a,b$ exchanged gives equality."
                ],
                "modelProof": "Let $d\\in C_a\\cap C_b$, so $a\\sim d$ and $b\\sim d$; by symmetry $d\\sim b$. Let $x\\in C_b$, so $b\\sim x$. From $a\\sim d$ and $d\\sim b$, transitivity gives $a\\sim b$; with $b\\sim x$, transitivity again gives $a\\sim x$. Hence $x\\in C_a$, and $C_b\\subseteq C_a$. Exchanging the roles of $a$ and $b$ (the hypothesis is symmetric in them) gives $C_a\\subseteq C_b$. Therefore $C_a=C_b$. $\\blacksquare$"
              },
              {
                "id": "m373k-u1-l06-ex7",
                "type": "proof",
                "question": "Let $G$ be a group. Prove that conjugacy, $a\\sim b$ if $b=gag^{-1}$ for some $g\\in G$, is an equivalence relation on $G$.",
                "hints": [
                  "Reflexive: which $g$ conjugates $a$ to itself?",
                  "Symmetric: solve $b=gag^{-1}$ for $a$.",
                  "Transitive: combine the two conjugating elements."
                ],
                "rubric": [
                  "Reflexive: $a=1a1^{-1}$.",
                  "Symmetric: from $b=gag^{-1}$ get $a=g^{-1}bg=g^{-1}b(g^{-1})^{-1}$.",
                  "Transitive: from $b=g_1ag_1^{-1}$ and $c=g_2bg_2^{-1}$ get $c=(g_2g_1)a(g_2g_1)^{-1}$.",
                  "Use $(g_2g_1)^{-1}=g_1^{-1}g_2^{-1}$ to justify the last step."
                ],
                "modelProof": "Reflexive: $a=1\\,a\\,1^{-1}$, so $a\\sim a$. Symmetric: if $b=gag^{-1}$, multiply on the left by $g^{-1}$ and on the right by $g$ to get $a=g^{-1}bg=(g^{-1})\\,b\\,(g^{-1})^{-1}$, so $b\\sim a$. Transitive: if $b=g_1ag_1^{-1}$ and $c=g_2bg_2^{-1}$, then $c=g_2g_1ag_1^{-1}g_2^{-1}=(g_2g_1)\\,a\\,(g_2g_1)^{-1}$, using $(g_2g_1)^{-1}=g_1^{-1}g_2^{-1}$. So $a\\sim c$. Hence conjugacy is an equivalence relation. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u1-l07",
            "title": "Cosets and Lagrange's Theorem",
            "duration": "9:06",
            "videoUrl": "",
            "theorem": "Theorem 2.8.9 (Lagrange): Let $H$ be a subgroup of a finite group $G$. Then $|G|=|H|\\,[G:H]$, where $[G:H]$ is the number of left cosets of $H$. In particular the order of $H$ divides the order of $G$.",
            "steps": [
              {
                "time": "01:11",
                "label": "Left cosets",
                "math": "aH=\\{ah: h\\in H\\}",
                "caption": "In $S_3$ with $H=\\langle y\\rangle=\\{1,y\\}$, the left cosets are $H$, $xH=\\{x,xy\\}$ and $x^2H=\\{x^2,x^2y\\}$."
              },
              {
                "time": "01:51",
                "label": "Cosets are equivalence classes",
                "math": "a\\equiv b\\iff b=ah\\ \\text{for some}\\ h\\in H\\iff a^{-1}b\\in H\\iff aH=bH",
                "caption": "Reflexivity uses $1\\in H$, symmetry uses inverses, and transitivity uses closure. So the left cosets partition $G$ (Corollary 2.8.3)."
              },
              {
                "time": "02:45",
                "label": "All cosets have the same size",
                "math": "H\\longrightarrow aH,\\qquad h\\longmapsto ah",
                "caption": "This map is a bijection: its inverse is multiplication on the left by $a^{-1}$ (Lemma 2.8.7)."
              },
              {
                "time": "03:19",
                "label": "The counting formula",
                "math": "|G|=|H|\\,[G:H]",
                "caption": "$G$ is the disjoint union of $[G:H]$ cosets, each with $|H|$ elements. For $H=\\langle y\\rangle$ in $S_3$: $6=2\\cdot 3$."
              },
              {
                "time": "04:15",
                "label": "Consequences",
                "math": "\\operatorname{ord}(a)\\mid |G|,\\qquad |G|=p\\ \\text{prime}\\implies G=\\langle a\\rangle\\ \\text{for any}\\ a\\neq 1",
                "caption": "The order of an element is the order of the subgroup it generates (Corollary 2.8.10). A group of prime order is cyclic (Corollary 2.8.11)."
              },
              {
                "time": "05:11",
                "label": "Right cosets and normal subgroups",
                "math": "gH=Hg\\ \\text{for all}\\ g\\iff gHg^{-1}=H\\ \\text{for all}\\ g",
                "caption": "In $S_3$, $Hx=\\{x,x^2y\\}\\neq xH$. Left and right cosets agree exactly when $H$ is normal (Proposition 2.8.17)."
              },
              {
                "time": "06:06",
                "label": "The index is multiplicative",
                "math": "[G:K]=[G:H]\\,[H:K]\\qquad (K\\le H\\le G)",
                "caption": "Choosing coset representatives for $H$ in $G$ and for $K$ in $H$ partitions $G$ into the $[G:H][H:K]$ cosets $g_ih_jK$ (Proposition 2.8.14)."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u1-l07-ex1",
                "type": "mcq",
                "question": "Let $H,K$ be subgroups of a finite group $G$ with $|H|=12$ and $|K|=35$. What is $|H\\cap K|$?",
                "options": [
                  "$1$",
                  "$5$",
                  "$6$",
                  "$12$"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! $H\\cap K$ is a subgroup of both $H$ and $K$, so its order divides $\\gcd(12,35)=1$.",
                  "Incorrect: $5$ does not divide $|H|=12$.",
                  "Incorrect: $6$ does not divide $|K|=35$.",
                  "Incorrect: $12$ does not divide $35$."
                ],
                "hints": [
                  "$H\\cap K$ is a subgroup of $H$ and a subgroup of $K$.",
                  "Apply Lagrange's theorem twice.",
                  "Compute $\\gcd(12,35)$."
                ]
              },
              {
                "id": "m373k-u1-l07-ex2",
                "type": "mcq",
                "question": "A group $G$ has order $35$. Which of these CANNOT be the order of an element of $G$?",
                "options": [
                  "$5$",
                  "$7$",
                  "$10$",
                  "$35$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: $5$ divides $35$, so it is allowed.",
                  "Incorrect: $7$ divides $35$, so it is allowed.",
                  "Correct! The order of an element divides $|G|=35$ (Corollary 2.8.10), and $10\\nmid 35$.",
                  "Incorrect: an element of order $35$ would make $G$ cyclic, which Lagrange's theorem does not forbid."
                ],
                "hints": [
                  "The order of $a$ equals $|\\langle a\\rangle|$.",
                  "Apply Lagrange to $\\langle a\\rangle\\le G$.",
                  "Which option does not divide $35$?"
                ]
              },
              {
                "id": "m373k-u1-l07-ex3",
                "type": "mcq",
                "question": "In $S_3$ with $H=\\{1,y\\}$, which set is the left coset $xH$?",
                "options": [
                  "$\\{x,xy\\}$",
                  "$\\{x,x^2y\\}$",
                  "$\\{x,x^2\\}$",
                  "$\\{1,x\\}$"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! $xH=\\{x\\cdot 1,\\ x\\cdot y\\}=\\{x,xy\\}$.",
                  "Incorrect: $\\{x,x^2y\\}=\\{x,yx\\}$ is the right coset $Hx$.",
                  "Incorrect: $x^2$ is not of the form $xh$ with $h\\in H$.",
                  "Incorrect: $1\\in xH$ would need $x^{-1}\\in H$."
                ],
                "hints": [
                  "Multiply each element of $H$ on the left by $x$.",
                  "$H=\\{1,y\\}$ has two elements, so $xH$ does too.",
                  "Compare with the right coset $Hx=\\{x,yx\\}$ and the relation $yx=x^2y$."
                ]
              },
              {
                "id": "m373k-u1-l07-ex4",
                "type": "mcq",
                "question": "For a subgroup $H$ of $G$ and $a,b\\in G$, when is $aH=bH$?",
                "options": [
                  "exactly when $a^{-1}b\\in H$",
                  "exactly when $ab\\in H$",
                  "exactly when $ab^{-1}\\in H$",
                  "only when $a=b$"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! $aH=bH$ iff $b\\in aH$ iff $b=ah$ for some $h\\in H$ iff $a^{-1}b\\in H$ (2.8.5).",
                  "Incorrect: take $a=b=g\\notin H$ with $g^2\\notin H$; then $aH=bH$ but $ab\\notin H$.",
                  "Incorrect: $ab^{-1}\\in H$ is the criterion for right cosets: $Ha=Hb$.",
                  "Incorrect: $aH=(ah)H$ for every $h\\in H$, and $ah\\neq a$ when $h\\neq 1$."
                ],
                "hints": [
                  "$b=b\\cdot 1$ lies in $bH$.",
                  "So $aH=bH$ forces $b\\in aH$.",
                  "Write $b=ah$ and solve for $h$."
                ]
              },
              {
                "id": "m373k-u1-l07-ex5",
                "type": "mcq",
                "question": "Let $G$ be a group of prime order $p$. How many subgroups does $G$ have?",
                "options": [
                  "$1$",
                  "$2$",
                  "$p$",
                  "$p+1$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $\\{1\\}$ and $G$ are different subgroups, since $p>1$.",
                  "Correct! A subgroup has order $1$ or $p$ by Lagrange, so it is $\\{1\\}$ or $G$.",
                  "Incorrect: each non-identity element generates all of $G$ (Corollary 2.8.11).",
                  "Incorrect: there are no subgroups other than $\\{1\\}$ and $G$."
                ],
                "hints": [
                  "What are the divisors of a prime $p$?",
                  "A subgroup of order $p$ inside a group of order $p$ is the whole group.",
                  "Count the subgroups of order $1$ and of order $p$."
                ]
              },
              {
                "id": "m373k-u1-l07-ex6",
                "type": "proof",
                "question": "(Lagrange's Theorem) Let $H$ be a subgroup of a finite group $G$. Prove that $|G|=|H|\\,[G:H]$, and conclude that $|H|$ divides $|G|$.",
                "hints": [
                  "Show the left cosets of $H$ partition $G$.",
                  "Show every left coset $aH$ has exactly $|H|$ elements.",
                  "Add up the sizes of the cosets."
                ],
                "rubric": [
                  "Show $a\\equiv b\\iff b\\in aH$ is an equivalence relation whose classes are the left cosets, so the cosets partition $G$.",
                  "Show $h\\mapsto ah$ is a bijection $H\\to aH$ (inverse: multiply by $a^{-1}$), so $|aH|=|H|$.",
                  "Conclude $|G|$ is the sum of $[G:H]$ terms, each equal to $|H|$."
                ],
                "modelProof": "Define $a\\equiv b$ if $b=ah$ for some $h\\in H$. It is reflexive ($a=a\\cdot 1$), symmetric (if $b=ah$ then $a=bh^{-1}$ with $h^{-1}\\in H$) and transitive (if $b=ah$ and $c=bh'$ then $c=a(hh')$ with $hh'\\in H$). Its class containing $a$ is $aH$, so the left cosets partition $G$. For each $a$, the map $H\\to aH$, $h\\mapsto ah$, is surjective by definition and injective by cancellation, so $|aH|=|H|$. Since $G$ is the disjoint union of its $[G:H]$ left cosets, each with $|H|$ elements, $|G|=|H|\\,[G:H]$. In particular $|H|$ divides $|G|$. $\\blacksquare$"
              },
              {
                "id": "m373k-u1-l07-ex7",
                "type": "proof",
                "question": "(Vaaler 3.3) Let $p$ be a prime and $G$ a group of order $p^e$ with $e\\ge 1$. Prove that $G$ contains an element of order $p$.",
                "hints": [
                  "Pick any $a\\neq 1$ in $G$.",
                  "By Lagrange, the order of $a$ divides $p^e$.",
                  "If $a$ has order $p^k$, which power of $a$ has order $p$?"
                ],
                "rubric": [
                  "Choose $a\\in G$ with $a\\neq 1$, which exists since $|G|=p^e>1$.",
                  "By Corollary 2.8.10, $\\operatorname{ord}(a)=p^k$ with $1\\le k\\le e$.",
                  "Set $b=a^{p^{k-1}}$ and show $b^p=1$ while $b\\neq 1$.",
                  "Conclude $b$ has order $p$, since the order divides the prime $p$ and is not $1$."
                ],
                "modelProof": "Since $|G|=p^e\\ge p>1$, there is an element $a\\neq 1$. Its order divides $|G|=p^e$ (Corollary 2.8.10) and is not $1$, so $\\operatorname{ord}(a)=p^k$ with $1\\le k\\le e$. Let $b=a^{p^{k-1}}$. Then $b^p=a^{p^k}=1$. Also $b\\neq 1$, since $0<p^{k-1}<p^k$ and $p^k$ is the smallest positive exponent with $a^{p^k}=1$. The order of $b$ divides $p$ and is not $1$, so it equals $p$. $\\blacksquare$"
              },
              {
                "id": "m373k-u1-l07-ex8",
                "type": "proof",
                "question": "Let $H$ be a subgroup of $G$ with $[G:H]=2$. Prove that $gH=Hg$ for every $g\\in G$.",
                "hints": [
                  "Treat the cases $g\\in H$ and $g\\notin H$ separately.",
                  "With only two left cosets, what is the left coset other than $H$?",
                  "Right cosets also partition $G$; with two right cosets, what is the other one?"
                ],
                "rubric": [
                  "If $g\\in H$, show $gH=H=Hg$.",
                  "If $g\\notin H$, use that the two left cosets partition $G$ to get $gH=G\\setminus H$.",
                  "Show $Hg\\cap H=\\emptyset$, and for $x\\notin H$ show $gx^{-1}\\in H$ (else $x^{-1}\\in H$), so $x\\in Hg$.",
                  "Conclude $gH=G\\setminus H=Hg$."
                ],
                "modelProof": "If $g\\in H$, then $gH=H$ and $Hg=H$ by closure and inverses, so $gH=Hg$. Suppose $g\\notin H$. The left cosets partition $G$, there are exactly two of them, and $H=1H$ is one; since $g\\in gH$ and $g\\notin H$, the other is $gH$, so $gH=G\\setminus H$. We show $Hg=G\\setminus H$. First, $Hg\\cap H=\\emptyset$: if $hg\\in H$ with $h\\in H$, then $g=h^{-1}(hg)\\in H$, a contradiction. Next, let $x\\notin H$. If $gx^{-1}\\notin H$, then $gx^{-1}\\in G\\setminus H=gH$, so $gx^{-1}=gh$ for some $h\\in H$, giving $x^{-1}=h\\in H$ and $x\\in H$, a contradiction. So $gx^{-1}\\in H$, hence $xg^{-1}=(gx^{-1})^{-1}\\in H$ and $x=(xg^{-1})g\\in Hg$. Therefore $Hg=G\\setminus H=gH$. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u1-l08",
            "title": "Modular Arithmetic",
            "duration": "9:10",
            "videoUrl": "",
            "theorem": "Lemma 2.9.6 (Artin): If $a'\\equiv a$ and $b'\\equiv b$ modulo $n$, then $a'+b'\\equiv a+b$ and $a'b'\\equiv ab$ modulo $n$. Hence $\\bar a+\\bar b=\\overline{a+b}$ and $\\bar a\\,\\bar b=\\overline{ab}$ are well defined on $\\mathbb{Z}/n\\mathbb{Z}$, which has exactly $n$ elements.",
            "steps": [
              {
                "time": "01:18",
                "label": "Congruence modulo n",
                "math": "a\\equiv b\\pmod n\\iff n\\mid b-a",
                "caption": "For example $2\\equiv 17$ modulo $5$. Congruence is an equivalence relation on $\\mathbb{Z}$."
              },
              {
                "time": "01:43",
                "label": "Congruence classes are cosets",
                "math": "\\bar a=a+\\mathbb{Z}n=\\{\\dots,a-n,\\ a,\\ a+n,\\ a+2n,\\dots\\}",
                "caption": "The congruence classes are the cosets of the subgroup $\\mathbb{Z}n$ of $\\mathbb{Z}^+$, written additively. The class $\\bar 0$ is $\\mathbb{Z}n$ itself."
              },
              {
                "time": "02:21",
                "label": "There are n classes",
                "math": "\\mathbb{Z}/n\\mathbb{Z}=\\{\\bar 0,\\bar 1,\\dots,\\overline{n-1}\\},\\qquad [\\mathbb{Z}:\\mathbb{Z}n]=n",
                "caption": "Division with remainder puts every integer in exactly one class $\\bar r$ with $0\\le r<n$ (Proposition 2.9.4)."
              },
              {
                "time": "03:07",
                "label": "Addition and multiplication are well defined",
                "math": "a'b'=(a+rn)(b+sn)=ab+(as+rb+rsn)\\,n",
                "caption": "If $a'=a+rn$ and $b'=b+sn$, then $a'+b'$ and $a'b'$ differ from $a+b$ and $ab$ by multiples of $n$, so the classes of the results do not depend on the representatives."
              },
              {
                "time": "04:24",
                "label": "Computing modulo n",
                "math": "\\overline{35}\\,(\\overline{17}+\\bar 7)=\\bar 6\\cdot\\overline{24}=\\bar 6\\cdot\\overline{-5}=\\overline{-30}=\\overline{-1}\\quad(n=29)",
                "caption": "Reduce early to keep the numbers small; the map $\\mathbb{Z}\\to\\mathbb{Z}/n\\mathbb{Z}$, $a\\mapsto\\bar a$, respects $+$ and $\\times$."
              },
              {
                "time": "05:23",
                "label": "Dropping the bars",
                "math": "a=b\\ \\text{in}\\ \\mathbb{Z}/n\\mathbb{Z}\\iff a\\equiv b\\pmod n",
                "caption": "The associative, commutative and distributive laws hold in $\\mathbb{Z}/n\\mathbb{Z}$ because they hold in $\\mathbb{Z}$."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u1-l08-ex1",
                "type": "mcq",
                "question": "Which integer is congruent to $17$ modulo $5$?",
                "options": [
                  "$-3$",
                  "$3$",
                  "$-2$",
                  "$15$"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! $17-(-3)=20$ is divisible by $5$; both lie in the class $\\bar 2$.",
                  "Incorrect: $17-3=14$ is not divisible by $5$.",
                  "Incorrect: $17-(-2)=19$ is not divisible by $5$; $-2$ is in the class $\\bar 3$.",
                  "Incorrect: $15\\equiv 0$ modulo $5$."
                ],
                "hints": [
                  "$a\\equiv b$ modulo $5$ means $5$ divides $a-b$.",
                  "Find the remainder of $17$ on division by $5$.",
                  "For negative numbers, add $5$ until you reach $0,\\dots,4$."
                ]
              },
              {
                "id": "m373k-u1-l08-ex2",
                "type": "mcq",
                "question": "Compute $3^{100}$ modulo $7$.",
                "options": [
                  "$1$",
                  "$3$",
                  "$4$",
                  "$5$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: $3^{100}\\equiv 1$ would need $6\\mid 100$.",
                  "Incorrect: reduce the exponent first using $3^6\\equiv 1$.",
                  "Correct! $3^6=729\\equiv 1$, and $100=6\\cdot 16+4$, so $3^{100}\\equiv 3^4=81\\equiv 4$ modulo $7$.",
                  "Incorrect: $5\\equiv 3^5$, but the exponent reduces to $4$, not $5$."
                ],
                "hints": [
                  "Compute $3^1,3^2,\\dots$ modulo $7$ until you reach $1$.",
                  "$3^6\\equiv 1$ modulo $7$.",
                  "Divide $100$ by $6$ with remainder."
                ]
              },
              {
                "id": "m373k-u1-l08-ex3",
                "type": "mcq",
                "question": "What is the multiplicative inverse of $\\bar 3$ in $\\mathbb{Z}/7\\mathbb{Z}$?",
                "options": [
                  "$\\bar 2$",
                  "$\\bar 3$",
                  "$\\bar 5$",
                  "$\\bar 6$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: $3\\cdot 2=6\\not\\equiv 1$.",
                  "Incorrect: $3\\cdot 3=9\\equiv 2$.",
                  "Correct! $3\\cdot 5=15=2\\cdot 7+1\\equiv 1$ modulo $7$.",
                  "Incorrect: $3\\cdot 6=18\\equiv 4$."
                ],
                "hints": [
                  "You need $b$ with $3b\\equiv 1$ modulo $7$.",
                  "Try $b=1,2,\\dots,6$.",
                  "Equivalently, write $1=3r+7s$ with the Euclidean algorithm."
                ]
              },
              {
                "id": "m373k-u1-l08-ex4",
                "type": "mcq",
                "question": "What is the last digit of $7^{2026}$?",
                "options": [
                  "$1$",
                  "$3$",
                  "$7$",
                  "$9$"
                ],
                "correctIndex": 3,
                "optionExplanations": [
                  "Incorrect: $7^4\\equiv 1$ modulo $10$, but $2026$ is not divisible by $4$.",
                  "Incorrect: $7^3=343$ ends in $3$, but the exponent reduces to $2$.",
                  "Incorrect: that would need the exponent to reduce to $1$.",
                  "Correct! Modulo $10$: $7^2\\equiv 9$, $7^4\\equiv 1$, and $2026=4\\cdot 506+2$, so $7^{2026}\\equiv 7^2\\equiv 9$."
                ],
                "hints": [
                  "The last digit is the class modulo $10$.",
                  "Compute $7^1,7^2,7^3,7^4$ modulo $10$.",
                  "Divide $2026$ by $4$ with remainder."
                ]
              },
              {
                "id": "m373k-u1-l08-ex5",
                "type": "mcq",
                "question": "Do the nonzero classes of $\\mathbb{Z}/6\\mathbb{Z}$ form a group under multiplication?",
                "options": [
                  "Yes",
                  "No: $\\bar 2\\cdot\\bar 3=\\bar 0$, so the set is not closed",
                  "No: multiplication is not associative",
                  "Yes, with identity $\\bar 0$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: the product of two nonzero classes can be $\\bar 0$.",
                  "Correct! $2\\cdot 3=6\\equiv 0$, so the product leaves the set of nonzero classes. ($\\bar 2$ also has no inverse.)",
                  "Incorrect: multiplication of classes is associative because multiplication of integers is.",
                  "Incorrect: $\\bar 0$ is not an identity for multiplication; $\\bar 1$ is."
                ],
                "hints": [
                  "Check closure first.",
                  "Look for two nonzero classes whose product is $\\bar 0$.",
                  "$6=2\\cdot 3$."
                ]
              },
              {
                "id": "m373k-u1-l08-ex6",
                "type": "proof",
                "question": "(Lemma 2.9.6) Prove that if $a'\\equiv a$ and $b'\\equiv b$ modulo $n$, then $a'+b'\\equiv a+b$ and $a'b'\\equiv ab$ modulo $n$.",
                "hints": [
                  "Write the hypotheses as $a'=a+rn$ and $b'=b+sn$.",
                  "Expand $a'+b'$ and $a'b'$.",
                  "Show each differs from $a+b$, respectively $ab$, by a multiple of $n$."
                ],
                "rubric": [
                  "Translate the hypotheses: $a'=a+rn$, $b'=b+sn$ for integers $r,s$.",
                  "Compute $a'+b'=(a+b)+(r+s)n$.",
                  "Compute $a'b'=ab+(as+rb+rsn)n$.",
                  "Conclude both congruences from the definition $x\\equiv y\\iff n\\mid x-y$."
                ],
                "modelProof": "By hypothesis $n\\mid a'-a$ and $n\\mid b'-b$, so $a'=a+rn$ and $b'=b+sn$ for some integers $r,s$. Then $a'+b'=(a+b)+(r+s)n$, so $n$ divides $(a'+b')-(a+b)$ and $a'+b'\\equiv a+b$. Also $a'b'=(a+rn)(b+sn)=ab+asn+rbn+rsn^2=ab+(as+rb+rsn)n$, so $n$ divides $a'b'-ab$ and $a'b'\\equiv ab$ modulo $n$. $\\blacksquare$"
              },
              {
                "id": "m373k-u1-l08-ex7",
                "type": "proof",
                "question": "Prove that $\\bar a$ has a multiplicative inverse in $\\mathbb{Z}/n\\mathbb{Z}$ if and only if $\\gcd(a,n)=1$.",
                "hints": [
                  "$\\bar a\\,\\bar b=\\bar 1$ means $ab\\equiv 1$ modulo $n$.",
                  "Rewrite $ab\\equiv 1$ as $ab+kn=1$ for some integer $k$.",
                  "Use Corollary 2.3.6: $\\gcd(a,n)=1$ iff $ra+sn=1$ for some integers $r,s$."
                ],
                "rubric": [
                  "Translate: $\\bar a$ is invertible iff there is $b$ with $ab\\equiv 1\\pmod n$.",
                  "($\\Rightarrow$) From $ab=1+kn$, write $1=ab+(-k)n$ and apply Corollary 2.3.6.",
                  "($\\Leftarrow$) From $ra+sn=1$, reduce modulo $n$ to get $\\bar r\\,\\bar a=\\bar 1$.",
                  "Note commutativity, so $\\bar r$ is a two-sided inverse."
                ],
                "modelProof": "($\\Rightarrow$) Suppose $\\bar a\\,\\bar b=\\bar 1$. Then $ab\\equiv 1$ modulo $n$, so $ab=1+kn$ for some integer $k$, i.e. $1=ab+(-k)n$. By Corollary 2.3.6, $a$ and $n$ are relatively prime: $\\gcd(a,n)=1$. ($\\Leftarrow$) If $\\gcd(a,n)=1$, Corollary 2.3.6 gives integers $r,s$ with $ra+sn=1$. Then $ra\\equiv 1$ modulo $n$, so $\\bar r\\,\\bar a=\\bar 1$; since multiplication in $\\mathbb{Z}/n\\mathbb{Z}$ is commutative, also $\\bar a\\,\\bar r=\\bar 1$. Hence $\\bar r$ is the inverse of $\\bar a$. $\\blacksquare$"
              }
            ]
          }
        ]
      },
      {
        "id": "m373k-u2",
        "title": "Unit 2: Homomorphisms, Quotients & Group Actions",
        "description": "Homomorphisms and isomorphisms, normal subgroups, quotient groups and the First Isomorphism Theorem, the Correspondence Theorem, product groups, group operations and the counting formula, the class equation and $p$-groups, and the Sylow theorems (Artin 2.5–2.6, 2.10–2.12, 6.7–6.9, 7.1–7.3, 7.7).",
        "lessons": [
          {
            "id": "m373k-u2-l01",
            "title": "Homomorphisms",
            "duration": "13:00",
            "videoUrl": "",
            "theorem": "Artin 2.5: A homomorphism $\\varphi:G\\to G'$ satisfies $\\varphi(ab)=\\varphi(a)\\varphi(b)$. Then $\\varphi(1)=1$ and $\\varphi(a^{-1})=\\varphi(a)^{-1}$ (Proposition 2.5.3). The kernel $\\ker\\varphi=\\{a:\\varphi(a)=1\\}$ is a normal subgroup (Proposition 2.5.11), and $\\varphi$ is injective if and only if $\\ker\\varphi=\\{1\\}$ (Corollary 2.5.9).",
            "steps": [
              {
                "time": "00:00",
                "label": "Definition",
                "math": "\\varphi(ab)=\\varphi(a)\\,\\varphi(b)\\qquad\\text{for all } a,b\\in G",
                "caption": "The product on the left is taken in $G$, the product on the right in $G'$. A homomorphism is a map that respects the group laws."
              },
              {
                "time": "02:00",
                "label": "Examples",
                "math": "\\det:GL_n(\\mathbb{R})\\to\\mathbb{R}^\\times,\\qquad \\exp:\\mathbb{R}^+\\to\\mathbb{R}^\\times,\\qquad \\mathbb{Z}^+\\to G,\\ k\\mapsto a^k",
                "caption": "$\\det(AB)=\\det A\\det B$; $e^{x+y}=e^xe^y$; $a^{k+l}=a^ka^l$. Also the absolute value $\\mathbb{C}^\\times\\to\\mathbb{R}^\\times$ and the sign of a permutation $S_n\\to\\{\\pm1\\}$."
              },
              {
                "time": "04:00",
                "label": "Identity and inverses",
                "math": "\\varphi(1)=\\varphi(1\\cdot 1)=\\varphi(1)\\varphi(1)\\implies\\varphi(1)=1",
                "caption": "Cancel $\\varphi(1)$ in $G'$. Then $\\varphi(a)\\varphi(a^{-1})=\\varphi(1)=1$ gives $\\varphi(a^{-1})=\\varphi(a)^{-1}$."
              },
              {
                "time": "06:00",
                "label": "Image and kernel",
                "math": "\\operatorname{im}\\varphi=\\{\\varphi(a): a\\in G\\}\\le G',\\qquad \\ker\\varphi=\\{a\\in G:\\varphi(a)=1\\}\\le G",
                "caption": "$\\ker\\det=SL_n(\\mathbb{R})$. The kernel of the sign map is the alternating group $A_n$."
              },
              {
                "time": "08:00",
                "label": "Kernel and fibres",
                "math": "\\varphi(a)=\\varphi(b)\\iff a^{-1}b\\in\\ker\\varphi\\iff b\\in aK",
                "caption": "The fibres of $\\varphi$ are the cosets of $K=\\ker\\varphi$ (Proposition 2.5.8). In particular $\\varphi$ is injective exactly when $K=\\{1\\}$."
              },
              {
                "time": "10:00",
                "label": "The kernel is normal",
                "math": "\\varphi(gkg^{-1})=\\varphi(g)\\cdot 1\\cdot\\varphi(g)^{-1}=1",
                "caption": "If $k\\in K$ and $g\\in G$, then $gkg^{-1}\\in K$. A subgroup with this property is normal."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u2-l01-ex1",
                "type": "mcq",
                "question": "Which map is a homomorphism?",
                "options": [
                  "$\\mathbb{R}^+\\to\\mathbb{R}^+$, $x\\mapsto x+1$",
                  "$\\mathbb{R}^\\times\\to\\mathbb{R}^\\times$, $x\\mapsto x^2$",
                  "$\\mathbb{Z}^+\\to\\mathbb{Z}^+$, $n\\mapsto n^2$",
                  "$GL_2(\\mathbb{R})\\to GL_2(\\mathbb{R})$, $A\\mapsto A+I$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $(x+y)+1\\neq(x+1)+(y+1)$; also $0\\mapsto 1$, but a homomorphism must send the identity to the identity.",
                  "Correct! $(xy)^2=x^2y^2$ because multiplication of reals is commutative.",
                  "Incorrect: $(1+1)^2=4\\neq 2=1^2+1^2$.",
                  "Incorrect: $A+I$ need not be invertible, and $(AB)+I\\neq(A+I)(B+I)$ in general."
                ],
                "hints": [
                  "Check whether the identity goes to the identity.",
                  "Test $\\varphi(ab)=\\varphi(a)\\varphi(b)$, using the right operation on each side.",
                  "For $x\\mapsto x^2$, use commutativity of $\\mathbb{R}^\\times$."
                ]
              },
              {
                "id": "m373k-u2-l01-ex2",
                "type": "mcq",
                "question": "What is the kernel of $\\det:GL_n(\\mathbb{R})\\to\\mathbb{R}^\\times$?",
                "options": [
                  "$\\{I\\}$",
                  "$SL_n(\\mathbb{R})$",
                  "the matrices with determinant $0$",
                  "the diagonal matrices"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: many matrices other than $I$ have determinant $1$, such as $\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$.",
                  "Correct! The kernel is the set of matrices sent to the identity $1$ of $\\mathbb{R}^\\times$, which is $SL_n(\\mathbb{R})$.",
                  "Incorrect: those matrices are not even in $GL_n(\\mathbb{R})$, and $0$ is not the identity of $\\mathbb{R}^\\times$.",
                  "Incorrect: $\\operatorname{diag}(2,1)$ has determinant $2$."
                ],
                "hints": [
                  "The kernel consists of the elements sent to the identity of the target.",
                  "What is the identity of $\\mathbb{R}^\\times$?",
                  "Which matrices have determinant $1$?"
                ]
              },
              {
                "id": "m373k-u2-l01-ex3",
                "type": "mcq",
                "question": "Let $\\varphi:\\mathbb{Z}^+\\to\\mathbb{C}^\\times$ be $\\varphi(k)=i^k$. What is $\\ker\\varphi$?",
                "options": [
                  "$\\{0\\}$",
                  "$\\mathbb{Z}2$",
                  "$\\mathbb{Z}4$",
                  "$\\mathbb{Z}$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: $i^4=1$, so $4\\in\\ker\\varphi$.",
                  "Incorrect: $i^2=-1\\neq 1$.",
                  "Correct! $i^k=1$ exactly when $4\\mid k$, since $i$ has order $4$.",
                  "Incorrect: $i^1=i\\neq 1$."
                ],
                "hints": [
                  "$\\ker\\varphi=\\{k: i^k=1\\}$.",
                  "This is the set $S$ from Proposition 2.4.2.",
                  "What is the order of $i$?"
                ]
              },
              {
                "id": "m373k-u2-l01-ex4",
                "type": "mcq",
                "question": "A homomorphism $\\varphi:G\\to G'$ has kernel $\\{1\\}$. Then $\\varphi$ is",
                "options": [
                  "surjective",
                  "injective",
                  "bijective",
                  "the trivial homomorphism"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: the inclusion $\\mathbb{Z}\\to\\mathbb{R}$ has trivial kernel but is not surjective.",
                  "Correct! If $\\varphi(a)=\\varphi(b)$, then $\\varphi(a^{-1}b)=1$, so $a^{-1}b=1$ and $a=b$ (Corollary 2.5.9).",
                  "Incorrect: injective, but not necessarily surjective.",
                  "Incorrect: the trivial homomorphism has kernel all of $G$."
                ],
                "hints": [
                  "Compare $\\varphi(a)=\\varphi(b)$ with an element of the kernel.",
                  "Compute $\\varphi(a^{-1}b)$.",
                  "Think of the inclusion $\\mathbb{Z}\\subset\\mathbb{R}$."
                ]
              },
              {
                "id": "m373k-u2-l01-ex5",
                "type": "proof",
                "question": "Let $\\varphi:G\\to G'$ be a homomorphism. Prove that $\\varphi(1)=1$ and $\\varphi(a^{-1})=\\varphi(a)^{-1}$ for every $a\\in G$.",
                "hints": [
                  "Apply $\\varphi$ to $1=1\\cdot 1$.",
                  "Cancel in $G'$.",
                  "Apply $\\varphi$ to $aa^{-1}=1$ and $a^{-1}a=1$."
                ],
                "rubric": [
                  "Write $\\varphi(1)=\\varphi(1\\cdot 1)=\\varphi(1)\\varphi(1)$.",
                  "Cancel $\\varphi(1)$ (multiply by $\\varphi(1)^{-1}$) to get $\\varphi(1)=1$.",
                  "Compute $\\varphi(a)\\varphi(a^{-1})=\\varphi(aa^{-1})=\\varphi(1)=1$, and similarly in the other order.",
                  "Conclude by uniqueness of inverses."
                ],
                "modelProof": "Since $1\\cdot 1=1$, we have $\\varphi(1)=\\varphi(1\\cdot 1)=\\varphi(1)\\varphi(1)$. Multiplying on the left by $\\varphi(1)^{-1}$ in $G'$ gives $1=\\varphi(1)$. Next, $\\varphi(a)\\varphi(a^{-1})=\\varphi(aa^{-1})=\\varphi(1)=1$ and $\\varphi(a^{-1})\\varphi(a)=\\varphi(a^{-1}a)=1$. Thus $\\varphi(a^{-1})$ is an inverse of $\\varphi(a)$, and by uniqueness of inverses $\\varphi(a^{-1})=\\varphi(a)^{-1}$. $\\blacksquare$"
              },
              {
                "id": "m373k-u2-l01-ex6",
                "type": "proof",
                "question": "Let $\\varphi:G\\to G'$ be a homomorphism with kernel $K$. Prove that $K$ is a normal subgroup of $G$.",
                "hints": [
                  "Check the three subgroup conditions using the previous problem.",
                  "For normality, take $k\\in K$, $g\\in G$ and compute $\\varphi(gkg^{-1})$.",
                  "Use $\\varphi(g^{-1})=\\varphi(g)^{-1}$."
                ],
                "rubric": [
                  "Closure: $\\varphi(k_1k_2)=\\varphi(k_1)\\varphi(k_2)=1$.",
                  "Identity and inverses: $\\varphi(1)=1$ and $\\varphi(k^{-1})=\\varphi(k)^{-1}=1$.",
                  "Normality: $\\varphi(gkg^{-1})=\\varphi(g)\\varphi(k)\\varphi(g)^{-1}=1$.",
                  "Conclude that $gKg^{-1}\\subseteq K$ for every $g$."
                ],
                "modelProof": "If $k_1,k_2\\in K$, then $\\varphi(k_1k_2)=\\varphi(k_1)\\varphi(k_2)=1\\cdot 1=1$, so $k_1k_2\\in K$. Since $\\varphi(1)=1$, $1\\in K$. If $k\\in K$, then $\\varphi(k^{-1})=\\varphi(k)^{-1}=1$, so $k^{-1}\\in K$. Thus $K$ is a subgroup. Now let $k\\in K$ and $g\\in G$. Then $\\varphi(gkg^{-1})=\\varphi(g)\\varphi(k)\\varphi(g^{-1})=\\varphi(g)\\cdot 1\\cdot\\varphi(g)^{-1}=1$, so $gkg^{-1}\\in K$. Hence $K$ is normal. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u2-l02",
            "title": "Isomorphisms",
            "duration": "12:00",
            "videoUrl": "",
            "theorem": "Artin 2.6: An isomorphism is a bijective homomorphism; its inverse is again an isomorphism (Lemma 2.6.2). Isomorphic groups have the same order, the same number of elements of each order, and one is abelian exactly when the other is. Conjugation $x\\mapsto gxg^{-1}$ is an automorphism of $G$.",
            "steps": [
              {
                "time": "00:00",
                "label": "Definition",
                "math": "\\varphi:G\\xrightarrow{\\ \\sim\\ }G'\\quad\\text{bijective with}\\quad\\varphi(ab)=\\varphi(a)\\varphi(b)",
                "caption": "Isomorphic groups are the same group with the elements renamed. We write $G\\approx G'$."
              },
              {
                "time": "02:00",
                "label": "Examples",
                "math": "\\exp:\\mathbb{R}^+\\xrightarrow{\\sim}\\mathbb{R}_{>0}^\\times,\\qquad \\mathbb{Z}/n\\mathbb{Z}\\xrightarrow{\\sim}\\langle x\\rangle\\ \\ (\\operatorname{ord}x=n)",
                "caption": "Every cyclic group of order $n$ is isomorphic to $\\mathbb{Z}/n\\mathbb{Z}$ via $\\bar k\\mapsto x^k$. $S_3$ is isomorphic to the symmetry group of an equilateral triangle."
              },
              {
                "time": "04:00",
                "label": "The inverse is a homomorphism",
                "math": "\\varphi^{-1}(a'b')=\\varphi^{-1}(a')\\varphi^{-1}(b')",
                "caption": "Apply $\\varphi$ to both sides; both give $a'b'$, and $\\varphi$ is injective."
              },
              {
                "time": "06:00",
                "label": "Invariants",
                "math": "\\operatorname{ord}\\varphi(a)=\\operatorname{ord}a,\\qquad G\\ \\text{abelian}\\iff G'\\ \\text{abelian}",
                "caption": "To show two groups are NOT isomorphic, find a property one has and the other lacks. $\\mathbb{Z}/4\\mathbb{Z}$ has an element of order $4$; the Klein four group does not."
              },
              {
                "time": "08:00",
                "label": "Automorphisms and conjugation",
                "math": "\\varphi_g(x)=gxg^{-1},\\qquad \\varphi_g(xy)=gxg^{-1}\\,gyg^{-1}",
                "caption": "Conjugation by $g$ is an isomorphism from $G$ to itself, with inverse $\\varphi_{g^{-1}}$. Two elements commute exactly when $aba^{-1}=b$ (Lemma 2.6.5)."
              },
              {
                "time": "10:00",
                "label": "Isomorphism classes",
                "math": "G\\approx G',\\ G'\\approx G''\\implies G\\approx G''",
                "caption": "Being isomorphic is an equivalence relation. Classifying groups means listing the isomorphism classes, such as the two classes of groups of order $4$."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u2-l02-ex1",
                "type": "mcq",
                "question": "Which pair of groups is isomorphic?",
                "options": [
                  "$\\mathbb{Z}/4\\mathbb{Z}$ and the Klein four group $V$",
                  "$\\mathbb{Z}/6\\mathbb{Z}$ and $S_3$",
                  "$\\{\\pm1,\\pm i\\}$ and $\\mathbb{Z}/4\\mathbb{Z}$",
                  "$\\mathbb{Z}^+$ and $\\mathbb{Q}^+$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: $\\mathbb{Z}/4\\mathbb{Z}$ has an element of order $4$; every element of $V$ has order at most $2$.",
                  "Incorrect: $\\mathbb{Z}/6\\mathbb{Z}$ is abelian, $S_3$ is not.",
                  "Correct! Both are cyclic of order $4$; $\\bar k\\mapsto i^k$ is an isomorphism.",
                  "Incorrect: $\\mathbb{Z}^+$ is cyclic, generated by $1$, but no single rational generates $\\mathbb{Q}^+$."
                ],
                "hints": [
                  "Look for invariants: order, abelian, element orders, cyclic.",
                  "Which option is a pair of cyclic groups of the same order?",
                  "$i$ has order $4$."
                ]
              },
              {
                "id": "m373k-u2-l02-ex2",
                "type": "mcq",
                "question": "Let $\\varphi:G\\to G'$ be an isomorphism and $a\\in G$ have order $6$. What is the order of $\\varphi(a)$?",
                "options": [
                  "$1$",
                  "$3$",
                  "$6$",
                  "it depends on $\\varphi$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: that would make $\\varphi(a)=1=\\varphi(1)$, contradicting injectivity.",
                  "Incorrect: $\\varphi(a)^3=\\varphi(a^3)\\neq 1$ since $a^3\\neq 1$ and $\\varphi$ is injective.",
                  "Correct! $\\varphi(a)^k=\\varphi(a^k)$, which is $1$ exactly when $a^k=1$, because $\\varphi$ is injective.",
                  "Incorrect: isomorphisms preserve the order of every element."
                ],
                "hints": [
                  "$\\varphi(a)^k=\\varphi(a^k)$.",
                  "$\\varphi(x)=1$ only when $x=1$.",
                  "So $\\varphi(a)^k=1$ exactly when $a^k=1$."
                ]
              },
              {
                "id": "m373k-u2-l02-ex3",
                "type": "mcq",
                "question": "Is $x\\mapsto x^{-1}$ an automorphism of a group $G$?",
                "options": [
                  "always",
                  "never",
                  "exactly when $G$ is abelian",
                  "exactly when $G$ is cyclic"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: in $S_3$, $(xy)^{-1}=y^{-1}x^{-1}\\neq x^{-1}y^{-1}$.",
                  "Incorrect: in abelian groups it is an automorphism.",
                  "Correct! It is always a bijection, and $(ab)^{-1}=b^{-1}a^{-1}$ equals $a^{-1}b^{-1}$ for all $a,b$ exactly when $G$ is abelian.",
                  "Incorrect: it is an automorphism of every abelian group, cyclic or not, such as $V$."
                ],
                "hints": [
                  "Is the map bijective?",
                  "Compare $(ab)^{-1}$ with $a^{-1}b^{-1}$.",
                  "Replace $a,b$ by $a^{-1},b^{-1}$ to translate the condition."
                ]
              },
              {
                "id": "m373k-u2-l02-ex4",
                "type": "mcq",
                "question": "Why is $\\mathbb{R}^\\times$ not isomorphic to $\\mathbb{R}^+$?",
                "options": [
                  "they have different cardinalities",
                  "$\\mathbb{R}^\\times$ has an element of order $2$, namely $-1$, and $\\mathbb{R}^+$ has none",
                  "$\\mathbb{R}^\\times$ is not abelian",
                  "they are isomorphic via $\\exp$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: both have the cardinality of $\\mathbb{R}$.",
                  "Correct! $(-1)^2=1$, while $x+x=0$ in $\\mathbb{R}^+$ forces $x=0$. Isomorphisms preserve element orders.",
                  "Incorrect: both are abelian.",
                  "Incorrect: $\\exp$ maps $\\mathbb{R}^+$ onto the positive reals only, not onto $\\mathbb{R}^\\times$."
                ],
                "hints": [
                  "Look for an invariant that differs.",
                  "Count elements of order $2$ in each group.",
                  "In $\\mathbb{R}^+$, an element of order $2$ satisfies $2x=0$."
                ]
              },
              {
                "id": "m373k-u2-l02-ex5",
                "type": "proof",
                "question": "(Lemma 2.6.2) Let $\\varphi:G\\to G'$ be an isomorphism. Prove that $\\varphi^{-1}:G'\\to G$ is an isomorphism.",
                "hints": [
                  "$\\varphi^{-1}$ is a bijection; you only need the homomorphism property.",
                  "Let $a'=\\varphi(a)$ and $b'=\\varphi(b)$.",
                  "Compute $\\varphi(ab)$."
                ],
                "rubric": [
                  "Note $\\varphi^{-1}$ is bijective because $\\varphi$ is.",
                  "Given $a',b'\\in G'$, write $a=\\varphi^{-1}(a')$ and $b=\\varphi^{-1}(b')$.",
                  "Use $\\varphi(ab)=a'b'$ to get $\\varphi^{-1}(a'b')=ab$.",
                  "Conclude $\\varphi^{-1}(a'b')=\\varphi^{-1}(a')\\varphi^{-1}(b')$."
                ],
                "modelProof": "Since $\\varphi$ is bijective, so is $\\varphi^{-1}$. Let $a',b'\\in G'$ and set $a=\\varphi^{-1}(a')$, $b=\\varphi^{-1}(b')$, so $\\varphi(a)=a'$ and $\\varphi(b)=b'$. Then $\\varphi(ab)=\\varphi(a)\\varphi(b)=a'b'$, so $\\varphi^{-1}(a'b')=ab=\\varphi^{-1}(a')\\varphi^{-1}(b')$. Hence $\\varphi^{-1}$ is a bijective homomorphism, an isomorphism. $\\blacksquare$"
              },
              {
                "id": "m373k-u2-l02-ex6",
                "type": "proof",
                "question": "Prove that any two cyclic groups of the same finite order $n$ are isomorphic.",
                "hints": [
                  "Let $G=\\langle x\\rangle$ and $G'=\\langle y\\rangle$, both of order $n$.",
                  "Define $\\varphi(x^k)=y^k$ and check it is well defined.",
                  "Use that $x^k=x^l$ iff $n\\mid k-l$, and the same for $y$."
                ],
                "rubric": [
                  "Define $\\varphi(x^k)=y^k$.",
                  "Well defined and injective: $x^k=x^l\\iff n\\mid k-l\\iff y^k=y^l$.",
                  "Homomorphism: $\\varphi(x^kx^l)=y^{k+l}=y^ky^l$.",
                  "Surjective: every element of $G'$ is a power of $y$."
                ],
                "modelProof": "Let $G=\\langle x\\rangle$ and $G'=\\langle y\\rangle$, where $x$ and $y$ have order $n$. By Proposition 2.4.3, $x^k=x^l$ iff $n\\mid k-l$ iff $y^k=y^l$. So $\\varphi(x^k)=y^k$ is a well-defined map $G\\to G'$, and it is injective. It is surjective because every element of $G'$ is some $y^k$. Finally $\\varphi(x^kx^l)=\\varphi(x^{k+l})=y^{k+l}=y^ky^l=\\varphi(x^k)\\varphi(x^l)$. Hence $\\varphi$ is an isomorphism. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u2-l03",
            "title": "Normal Subgroups and the Center",
            "duration": "12:00",
            "videoUrl": "",
            "theorem": "Artin 2.5, 2.8.17: A subgroup $N$ of $G$ is normal if $gNg^{-1}\\subseteq N$ for all $g\\in G$. Equivalently $gN=Ng$ for all $g$. Kernels of homomorphisms are normal, every subgroup of an abelian group is normal, every subgroup of index $2$ is normal, and the center $Z(G)$ is normal.",
            "steps": [
              {
                "time": "00:00",
                "label": "Definition",
                "math": "N\\trianglelefteq G\\iff gng^{-1}\\in N\\ \\text{for all}\\ g\\in G,\\ n\\in N",
                "caption": "Normal subgroups are closed under conjugation. In an abelian group $gng^{-1}=n$, so every subgroup is normal."
              },
              {
                "time": "02:00",
                "label": "Left cosets equal right cosets",
                "math": "gNg^{-1}=N\\iff gN=Ng",
                "caption": "Multiply $gNg^{-1}=N$ on the right by $g$. If $gNg^{-1}\\subseteq N$ for all $g$, applying it to $g^{-1}$ gives the reverse inclusion."
              },
              {
                "time": "04:00",
                "label": "An example in S3",
                "math": "\\langle x\\rangle\\trianglelefteq S_3,\\qquad \\langle y\\rangle\\ \\text{not normal: } xyx^{-1}=x^2y\\notin\\langle y\\rangle",
                "caption": "$\\langle x\\rangle=\\{1,x,x^2\\}$ has index $2$, so it is normal. $\\langle y\\rangle=\\{1,y\\}$ is not."
              },
              {
                "time": "06:00",
                "label": "The center",
                "math": "Z(G)=\\{z\\in G: zg=gz\\ \\text{for all}\\ g\\in G\\}",
                "caption": "$Z(G)$ is a normal subgroup, since $gzg^{-1}=z$. $Z(S_3)=\\{1\\}$, and the center of $GL_n(\\mathbb{R})$ is the nonzero scalar matrices."
              },
              {
                "time": "08:00",
                "label": "More normal subgroups",
                "math": "SL_n(\\mathbb{R})=\\ker\\det\\trianglelefteq GL_n(\\mathbb{R}),\\qquad A_n=\\ker(\\operatorname{sign})\\trianglelefteq S_n",
                "caption": "The quickest way to prove a subgroup is normal is often to show it is a kernel."
              },
              {
                "time": "10:00",
                "label": "Normality is not transitive",
                "math": "K\\trianglelefteq H\\trianglelefteq G\\ \\not\\Rightarrow\\ K\\trianglelefteq G",
                "caption": "In $D_4$, a subgroup of order $2$ can be normal in a subgroup of order $4$ without being normal in $D_4$."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u2-l03-ex1",
                "type": "mcq",
                "question": "Which subgroup of $S_3$ is normal?",
                "options": [
                  "$\\{1,y\\}$",
                  "$\\{1,xy\\}$",
                  "$\\{1,x,x^2\\}$",
                  "$\\{1,x^2y\\}$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: $xyx^{-1}=x^2y\\notin\\{1,y\\}$.",
                  "Incorrect: conjugating $xy$ by $x$ gives $x(xy)x^{-1}=x^2yx^2=y\\notin\\{1,xy\\}$.",
                  "Correct! It has index $2$, and it is the kernel of the sign map.",
                  "Incorrect: the three subgroups of order $2$ are conjugate to one another, so none is normal."
                ],
                "hints": [
                  "Subgroups of index $2$ are normal.",
                  "Compute a conjugate like $xyx^{-1}$.",
                  "Use $yx^{-1}=xy$."
                ]
              },
              {
                "id": "m373k-u2-l03-ex2",
                "type": "mcq",
                "question": "What is the center of $S_3$?",
                "options": [
                  "$\\{1\\}$",
                  "$\\{1,x,x^2\\}$",
                  "$\\{1,y\\}$",
                  "$S_3$"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! $x$ and $x^2$ fail to commute with $y$, and each transposition fails to commute with $x$.",
                  "Incorrect: $yx=x^2y\\neq xy$.",
                  "Incorrect: $yx\\neq xy$.",
                  "Incorrect: $S_3$ is not abelian."
                ],
                "hints": [
                  "Check each non-identity element against $x$ and against $y$.",
                  "$yx=x^2y$.",
                  "The center of a non-abelian group is a proper subgroup."
                ]
              },
              {
                "id": "m373k-u2-l03-ex3",
                "type": "mcq",
                "question": "Let $H\\le G$ with $[G:H]=2$. Which is true?",
                "options": [
                  "$H$ is normal in $G$",
                  "$H$ is normal only if $G$ is abelian",
                  "$H$ is never normal",
                  "$H=Z(G)$"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! For $g\\notin H$, both $gH$ and $Hg$ equal $G\\setminus H$, so $gH=Hg$.",
                  "Incorrect: $\\langle x\\rangle\\le S_3$ has index $2$ and is normal, though $S_3$ is not abelian.",
                  "Incorrect: index-$2$ subgroups are always normal.",
                  "Incorrect: $Z(S_3)=\\{1\\}$, but $\\langle x\\rangle$ has index $2$."
                ],
                "hints": [
                  "There are only two left cosets and two right cosets.",
                  "What is the coset other than $H$?",
                  "Compare $gH$ and $Hg$ for $g\\notin H$."
                ]
              },
              {
                "id": "m373k-u2-l03-ex4",
                "type": "mcq",
                "question": "Which subset of $GL_2(\\mathbb{R})$ is a normal subgroup?",
                "options": [
                  "the upper triangular invertible matrices",
                  "the scalar matrices $cI$, $c\\neq 0$",
                  "the diagonal invertible matrices",
                  "the matrices of order $2$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: conjugating $\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$ by $\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$ gives a lower triangular matrix.",
                  "Correct! $P(cI)P^{-1}=cI$, so the scalar matrices form a normal subgroup; in fact they are the center.",
                  "Incorrect: conjugating a diagonal matrix with distinct entries can give a non-diagonal matrix.",
                  "Incorrect: that set does not contain $I$ and is not closed."
                ],
                "hints": [
                  "Which set is closed under every conjugation $A\\mapsto PAP^{-1}$?",
                  "Scalar matrices commute with everything.",
                  "Test the triangular option with a permutation matrix."
                ]
              },
              {
                "id": "m373k-u2-l03-ex5",
                "type": "proof",
                "question": "Prove that the center $Z(G)$ is a normal subgroup of $G$.",
                "hints": [
                  "Check the subgroup conditions.",
                  "For inverses, multiply $zg=gz$ by $z^{-1}$ on both sides.",
                  "Normality is immediate: what is $gzg^{-1}$?"
                ],
                "rubric": [
                  "Closure: if $z_1,z_2\\in Z(G)$ then $z_1z_2g=z_1gz_2=gz_1z_2$.",
                  "$1\\in Z(G)$.",
                  "Inverses: from $zg=gz$ get $gz^{-1}=z^{-1}g$.",
                  "Normality: $gzg^{-1}=zgg^{-1}=z\\in Z(G)$."
                ],
                "modelProof": "Clearly $1\\in Z(G)$. If $z_1,z_2\\in Z(G)$ and $g\\in G$, then $(z_1z_2)g=z_1gz_2=g(z_1z_2)$, so $z_1z_2\\in Z(G)$. If $z\\in Z(G)$, multiplying $zg=gz$ on the left and on the right by $z^{-1}$ gives $gz^{-1}=z^{-1}g$, so $z^{-1}\\in Z(G)$. Thus $Z(G)$ is a subgroup. For $z\\in Z(G)$ and $g\\in G$, $gzg^{-1}=zgg^{-1}=z\\in Z(G)$, so $Z(G)$ is normal. $\\blacksquare$"
              },
              {
                "id": "m373k-u2-l03-ex6",
                "type": "proof",
                "question": "Let $N\\le G$. Prove that $gNg^{-1}\\subseteq N$ for all $g\\in G$ if and only if $gN=Ng$ for all $g\\in G$.",
                "hints": [
                  "($\\Rightarrow$) Show first that $gNg^{-1}=N$, using $g^{-1}$ as well as $g$.",
                  "Multiply $gNg^{-1}=N$ on the right by $g$.",
                  "($\\Leftarrow$) From $gN=Ng$, write $gn=n'g$."
                ],
                "rubric": [
                  "($\\Rightarrow$) Apply the hypothesis to $g^{-1}$: $g^{-1}Ng\\subseteq N$, hence $N\\subseteq gNg^{-1}$, so $gNg^{-1}=N$.",
                  "Deduce $gN=(gNg^{-1})g=Ng$.",
                  "($\\Leftarrow$) For $n\\in N$, $gn\\in gN=Ng$, so $gn=n'g$ for some $n'\\in N$.",
                  "Conclude $gng^{-1}=n'\\in N$."
                ],
                "modelProof": "($\\Rightarrow$) Suppose $gNg^{-1}\\subseteq N$ for all $g$. Applying this to $g^{-1}$ gives $g^{-1}Ng\\subseteq N$, and conjugating by $g$ gives $N\\subseteq gNg^{-1}$. Hence $gNg^{-1}=N$, and multiplying on the right by $g$ gives $gN=Ng$. ($\\Leftarrow$) Suppose $gN=Ng$ for all $g$. For $n\\in N$, $gn\\in gN=Ng$, so $gn=n'g$ for some $n'\\in N$, and then $gng^{-1}=n'\\in N$. Thus $gNg^{-1}\\subseteq N$. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u2-l04",
            "title": "Quotient Groups and the First Isomorphism Theorem",
            "duration": "14:00",
            "videoUrl": "",
            "theorem": "Theorem 2.12.2 (Artin): If $N$ is a normal subgroup of $G$, the cosets of $N$ form a group $\\bar G=G/N$ under $(aN)(bN)=abN$, of order $[G:N]$, and $\\pi:G\\to G/N$, $a\\mapsto aN$, is a surjective homomorphism with kernel $N$. Theorem 2.12.10 (First Isomorphism Theorem): if $\\varphi:G\\to G'$ is surjective with kernel $N$, then $G/N\\approx G'$ via $aN\\mapsto\\varphi(a)$.",
            "steps": [
              {
                "time": "00:00",
                "label": "Multiplying cosets",
                "math": "(aN)(bN)=a(Nb)N=a(bN)N=abN",
                "caption": "This uses $Nb=bN$, so it needs $N$ to be normal (Lemma 2.12.5). The product of two cosets is again a coset."
              },
              {
                "time": "02:00",
                "label": "The quotient group",
                "math": "G/N=\\{aN: a\\in G\\},\\qquad |G/N|=[G:N]=\\frac{|G|}{|N|}",
                "caption": "The identity is $N=1N$, and $(aN)^{-1}=a^{-1}N$. Associativity is inherited from $G$."
              },
              {
                "time": "04:00",
                "label": "The canonical map",
                "math": "\\pi:G\\to G/N,\\quad \\pi(a)=aN,\\qquad \\ker\\pi=N",
                "caption": "$\\pi$ is a surjective homomorphism, so every normal subgroup is a kernel. Normal subgroups and kernels are the same thing."
              },
              {
                "time": "06:00",
                "label": "Example: Z/nZ",
                "math": "\\mathbb{Z}^+/\\mathbb{Z}n=\\mathbb{Z}/n\\mathbb{Z}",
                "caption": "The integers modulo $n$ are the quotient of $\\mathbb{Z}^+$ by the normal subgroup $\\mathbb{Z}n$. Modular arithmetic was a quotient group all along."
              },
              {
                "time": "08:00",
                "label": "First Isomorphism Theorem",
                "math": "\\bar\\varphi:G/\\ker\\varphi\\xrightarrow{\\ \\sim\\ }\\operatorname{im}\\varphi,\\qquad \\bar\\varphi(aN)=\\varphi(a)",
                "caption": "Well defined because $aN=bN$ implies $\\varphi(a)=\\varphi(b)$; injective because $\\varphi(a)=1$ only for $a\\in N$."
              },
              {
                "time": "10:00",
                "label": "Applications",
                "math": "GL_n(\\mathbb{R})/SL_n(\\mathbb{R})\\approx\\mathbb{R}^\\times,\\qquad \\mathbb{C}^\\times/U\\approx\\mathbb{R}_{>0}^\\times,\\qquad S_n/A_n\\approx\\{\\pm1\\}",
                "caption": "Each comes from a surjective homomorphism: $\\det$, the absolute value $|z|$, and the sign. Here $U$ is the unit circle."
              },
              {
                "time": "12:00",
                "label": "Why normality is needed",
                "math": "H=\\langle y\\rangle\\le S_3:\\qquad xH=xyH,\\quad\\text{but}\\quad x\\cdot x=x^2\\notin H,\\ \\ xy\\cdot x=y\\in H",
                "caption": "Multiplying the representatives $x$ or $xy$ of the same coset by $x$ lands in different cosets, $x^2H$ and $H$. Without normality, coset multiplication is not well defined."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u2-l04-ex1",
                "type": "mcq",
                "question": "Let $G=\\mathbb{Z}/12\\mathbb{Z}$ and $N=\\langle\\bar 4\\rangle=\\{\\bar0,\\bar4,\\bar8\\}$. What is the order of $G/N$?",
                "options": [
                  "$3$",
                  "$4$",
                  "$8$",
                  "$12$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $3=|N|$; the quotient has order $|G|/|N|$.",
                  "Correct! $|G/N|=12/3=4$. In fact $G/N\\approx\\mathbb{Z}/4\\mathbb{Z}$.",
                  "Incorrect: $8$ does not divide $12$.",
                  "Incorrect: that is $|G|$."
                ],
                "hints": [
                  "$|G/N|=[G:N]$.",
                  "Use Lagrange: $[G:N]=|G|/|N|$.",
                  "$|N|=3$."
                ]
              },
              {
                "id": "m373k-u2-l04-ex2",
                "type": "mcq",
                "question": "Which isomorphism follows from the First Isomorphism Theorem applied to $\\det:GL_n(\\mathbb{R})\\to\\mathbb{R}^\\times$?",
                "options": [
                  "$GL_n(\\mathbb{R})\\approx\\mathbb{R}^\\times$",
                  "$GL_n(\\mathbb{R})/SL_n(\\mathbb{R})\\approx\\mathbb{R}^\\times$",
                  "$SL_n(\\mathbb{R})\\approx\\mathbb{R}^\\times$",
                  "$GL_n(\\mathbb{R})/\\mathbb{R}^\\times\\approx SL_n(\\mathbb{R})$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $\\det$ is not injective for $n\\ge 2$.",
                  "Correct! $\\det$ is surjective with kernel $SL_n(\\mathbb{R})$, so the quotient by the kernel is isomorphic to the image.",
                  "Incorrect: the kernel is not isomorphic to the image in general.",
                  "Incorrect: the theorem divides by the kernel, not by the image."
                ],
                "hints": [
                  "Identify the kernel and image of $\\det$.",
                  "$G/\\ker\\varphi\\approx\\operatorname{im}\\varphi$.",
                  "$\\det$ is surjective: $\\det\\operatorname{diag}(c,1,\\dots,1)=c$."
                ]
              },
              {
                "id": "m373k-u2-l04-ex3",
                "type": "mcq",
                "question": "In $G/N$, what is the inverse of the coset $aN$?",
                "options": [
                  "$aN$",
                  "$a^{-1}N$",
                  "$Na$",
                  "$N$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $(aN)(aN)=a^2N$, which is $N$ only when $a^2\\in N$.",
                  "Correct! $(aN)(a^{-1}N)=aa^{-1}N=N$, the identity of $G/N$.",
                  "Incorrect: $Na=aN$ when $N$ is normal; it is the same coset, not its inverse.",
                  "Incorrect: $N$ is the identity of $G/N$."
                ],
                "hints": [
                  "The identity of $G/N$ is $N=1N$.",
                  "Use $(aN)(bN)=abN$.",
                  "Choose $b$ so that $ab=1$."
                ]
              },
              {
                "id": "m373k-u2-l04-ex4",
                "type": "mcq",
                "question": "Let $\\varphi:\\mathbb{C}^\\times\\to\\mathbb{R}^\\times$, $\\varphi(z)=|z|$. Its kernel is the unit circle $U$. Then $\\mathbb{C}^\\times/U$ is isomorphic to",
                "options": [
                  "$\\mathbb{R}^\\times$",
                  "the positive reals under multiplication",
                  "$U$",
                  "$\\mathbb{C}^+$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $\\varphi$ is not surjective onto $\\mathbb{R}^\\times$; $|z|$ is never negative.",
                  "Correct! The image of $\\varphi$ is $\\mathbb{R}_{>0}^\\times$, and $G/\\ker\\varphi\\approx\\operatorname{im}\\varphi$.",
                  "Incorrect: the quotient is isomorphic to the image, not to the kernel.",
                  "Incorrect: the operation in $\\mathbb{C}^\\times$ is multiplication."
                ],
                "hints": [
                  "First Isomorphism Theorem: $G/\\ker\\varphi\\approx\\operatorname{im}\\varphi$.",
                  "What values does $|z|$ take for $z\\neq 0$?",
                  "The cosets of $U$ are circles centered at $0$."
                ]
              },
              {
                "id": "m373k-u2-l04-ex5",
                "type": "proof",
                "question": "(Lemma 2.12.5) Let $N$ be a normal subgroup of $G$. Prove that the product set $(aN)(bN)=\\{xy: x\\in aN,\\ y\\in bN\\}$ equals the coset $abN$.",
                "hints": [
                  "Use $Nb=bN$, which holds because $N$ is normal.",
                  "Show $NN=N$.",
                  "Prove the two inclusions, or compute with sets directly."
                ],
                "rubric": [
                  "Note $NN=N$: $NN\\subseteq N$ by closure, and $N=1N\\subseteq NN$.",
                  "Use normality to rewrite $Nb$ as $bN$.",
                  "Compute $(aN)(bN)=a(Nb)N=a(bN)N=ab(NN)=abN$.",
                  "Justify each regrouping by associativity of set products."
                ],
                "modelProof": "Products of subsets of $G$ are associative, since multiplication in $G$ is. Because $N$ is a subgroup, $NN\\subseteq N$, and $N=1\\cdot N\\subseteq NN$; so $NN=N$. Because $N$ is normal, $Nb=bN$. Therefore $(aN)(bN)=a(Nb)N=a(bN)N=ab(NN)=abN$. $\\blacksquare$"
              },
              {
                "id": "m373k-u2-l04-ex6",
                "type": "proof",
                "question": "(First Isomorphism Theorem) Let $\\varphi:G\\to G'$ be a surjective homomorphism with kernel $N$. Prove that $\\bar\\varphi:G/N\\to G'$, $\\bar\\varphi(aN)=\\varphi(a)$, is a well-defined isomorphism.",
                "hints": [
                  "Well defined: if $aN=bN$, show $\\varphi(a)=\\varphi(b)$.",
                  "Check the homomorphism property using $(aN)(bN)=abN$.",
                  "Injective: what is the kernel of $\\bar\\varphi$?"
                ],
                "rubric": [
                  "Well defined: $aN=bN\\Rightarrow b=an$ with $n\\in N\\Rightarrow\\varphi(b)=\\varphi(a)\\varphi(n)=\\varphi(a)$.",
                  "Homomorphism: $\\bar\\varphi(aNbN)=\\bar\\varphi(abN)=\\varphi(ab)=\\varphi(a)\\varphi(b)$.",
                  "Surjective because $\\varphi$ is surjective.",
                  "Injective: $\\bar\\varphi(aN)=1\\Rightarrow a\\in N\\Rightarrow aN=N$, so the kernel is trivial."
                ],
                "modelProof": "If $aN=bN$, then $b=an$ for some $n\\in N$, and $\\varphi(b)=\\varphi(a)\\varphi(n)=\\varphi(a)$. So $\\bar\\varphi$ is well defined. It is a homomorphism: $\\bar\\varphi((aN)(bN))=\\bar\\varphi(abN)=\\varphi(ab)=\\varphi(a)\\varphi(b)=\\bar\\varphi(aN)\\bar\\varphi(bN)$. It is surjective, since every element of $G'$ is some $\\varphi(a)=\\bar\\varphi(aN)$. If $\\bar\\varphi(aN)=1$, then $\\varphi(a)=1$, so $a\\in N$ and $aN=N$, the identity of $G/N$. Thus $\\ker\\bar\\varphi$ is trivial and $\\bar\\varphi$ is injective (Corollary 2.5.9). Hence $\\bar\\varphi$ is an isomorphism. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u2-l05",
            "title": "The Correspondence Theorem",
            "duration": "11:00",
            "videoUrl": "",
            "theorem": "Theorem 2.10.5 (Correspondence Theorem): Let $\\varphi:G\\to\\mathcal{G}$ be a surjective homomorphism with kernel $K$. Then $H\\mapsto\\varphi(H)$ is a bijection from subgroups of $G$ containing $K$ to subgroups of $\\mathcal{G}$, with inverse $\\mathcal{H}\\mapsto\\varphi^{-1}(\\mathcal{H})$. It preserves normality, and $|H|=|\\varphi(H)|\\,|K|$.",
            "steps": [
              {
                "time": "00:00",
                "label": "Images and inverse images",
                "math": "\\varphi(H)=\\{\\varphi(h): h\\in H\\},\\qquad \\varphi^{-1}(\\mathcal{H})=\\{a\\in G:\\varphi(a)\\in\\mathcal{H}\\}",
                "caption": "Both are subgroups. The inverse image of any subgroup always contains $K=\\varphi^{-1}(\\{1\\})$."
              },
              {
                "time": "02:00",
                "label": "The correspondence",
                "math": "\\{H: K\\le H\\le G\\}\\ \\longleftrightarrow\\ \\{\\mathcal{H}\\le\\mathcal{G}\\}",
                "caption": "Subgroups of $\\mathcal{G}$ are the same as subgroups of $G$ that contain $K$. When $\\mathcal{G}=G/K$, the subgroups of the quotient are the $H/K$."
              },
              {
                "time": "04:00",
                "label": "Why inverse image undoes image",
                "math": "K\\le H\\implies\\varphi^{-1}(\\varphi(H))=HK=H",
                "caption": "If $\\varphi(a)=\\varphi(h)$, then $a\\in hK\\subseteq H$. The condition $K\\le H$ is exactly what makes this work."
              },
              {
                "time": "06:00",
                "label": "Counting",
                "math": "|H|=|\\varphi(H)|\\cdot|K|",
                "caption": "$\\varphi$ restricted to $H$ is a surjection onto $\\varphi(H)$ whose fibres are cosets of $K$."
              },
              {
                "time": "08:00",
                "label": "Example: subgroups of Z/nZ",
                "math": "\\mathbb{Z}d\\supseteq\\mathbb{Z}n\\iff d\\mid n",
                "caption": "Applied to $\\pi:\\mathbb{Z}\\to\\mathbb{Z}/n\\mathbb{Z}$: subgroups of $\\mathbb{Z}/n\\mathbb{Z}$ correspond to divisors $d$ of $n$. $\\mathbb{Z}/12\\mathbb{Z}$ has $6$ subgroups, one for each divisor $1,2,3,4,6,12$."
              },
              {
                "time": "10:00",
                "label": "Normality is preserved",
                "math": "H\\trianglelefteq G\\iff\\varphi(H)\\trianglelefteq\\mathcal{G}\\qquad(K\\le H)",
                "caption": "Normal subgroups of $G/K$ correspond to normal subgroups of $G$ containing $K$."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u2-l05-ex1",
                "type": "mcq",
                "question": "How many subgroups does $\\mathbb{Z}/12\\mathbb{Z}$ have?",
                "options": [
                  "$4$",
                  "$6$",
                  "$12$",
                  "$2$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: count the positive divisors of $12$.",
                  "Correct! They correspond to subgroups $\\mathbb{Z}d$ of $\\mathbb{Z}$ containing $\\mathbb{Z}12$, i.e. to divisors $d\\in\\{1,2,3,4,6,12\\}$.",
                  "Incorrect: that is the order of the group, not the number of subgroups.",
                  "Incorrect: $\\mathbb{Z}/12\\mathbb{Z}$ is not of prime order."
                ],
                "hints": [
                  "Use the Correspondence Theorem for $\\pi:\\mathbb{Z}\\to\\mathbb{Z}/12\\mathbb{Z}$.",
                  "Which subgroups $\\mathbb{Z}d$ contain $\\mathbb{Z}12$?",
                  "$\\mathbb{Z}12\\subseteq\\mathbb{Z}d$ iff $d\\mid 12$."
                ]
              },
              {
                "id": "m373k-u2-l05-ex2",
                "type": "mcq",
                "question": "Let $\\varphi:G\\to\\mathcal{G}$ be surjective with kernel $K$, $|K|=4$. If $H\\supseteq K$ and $|\\varphi(H)|=5$, what is $|H|$?",
                "options": [
                  "$5$",
                  "$9$",
                  "$20$",
                  "$\\tfrac54$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: each element of $\\varphi(H)$ has $|K|$ preimages in $H$.",
                  "Incorrect: orders multiply, they do not add.",
                  "Correct! $|H|=|\\varphi(H)|\\cdot|K|=5\\cdot 4$.",
                  "Incorrect: orders are integers."
                ],
                "hints": [
                  "The fibres of $\\varphi$ are cosets of $K$.",
                  "How many elements of $H$ map to each element of $\\varphi(H)$?",
                  "$|H|=|\\varphi(H)|\\,|K|$."
                ]
              },
              {
                "id": "m373k-u2-l05-ex3",
                "type": "mcq",
                "question": "Why does the Correspondence Theorem only use subgroups $H$ that contain $K$?",
                "options": [
                  "otherwise $\\varphi(H)$ is not a subgroup",
                  "otherwise $\\varphi^{-1}(\\varphi(H))=HK$ is bigger than $H$, so the map is not injective",
                  "otherwise $H$ is not normal",
                  "there is no reason"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $\\varphi(H)$ is a subgroup for every subgroup $H$.",
                  "Correct! $H$ and $HK$ have the same image, so different subgroups could collide. Inverse images always contain $K$.",
                  "Incorrect: normality is a separate part of the theorem.",
                  "Incorrect: without the condition the correspondence fails to be a bijection."
                ],
                "hints": [
                  "What is $\\varphi^{-1}(\\{1\\})$?",
                  "Does every inverse image contain $K$?",
                  "Compare $\\varphi(H)$ and $\\varphi(HK)$."
                ]
              },
              {
                "id": "m373k-u2-l05-ex4",
                "type": "mcq",
                "question": "Under $\\pi:\\mathbb{Z}\\to\\mathbb{Z}/12\\mathbb{Z}$, which subgroup of $\\mathbb{Z}$ corresponds to $\\langle\\bar 8\\rangle\\le\\mathbb{Z}/12\\mathbb{Z}$?",
                "options": [
                  "$\\mathbb{Z}8$",
                  "$\\mathbb{Z}4$",
                  "$\\mathbb{Z}24$",
                  "$\\mathbb{Z}2$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $\\mathbb{Z}8$ does not contain $\\mathbb{Z}12$.",
                  "Correct! $\\langle\\bar8\\rangle=\\{\\bar0,\\bar4,\\bar8\\}=\\langle\\bar4\\rangle$, whose inverse image is $\\mathbb{Z}8+\\mathbb{Z}12=\\mathbb{Z}4$.",
                  "Incorrect: $\\mathbb{Z}24$ does not contain $\\mathbb{Z}12$.",
                  "Incorrect: $\\pi(\\mathbb{Z}2)=\\langle\\bar2\\rangle$ has order $6$, but $\\langle\\bar8\\rangle$ has order $3$."
                ],
                "hints": [
                  "List the elements of $\\langle\\bar 8\\rangle$.",
                  "The inverse image is $\\mathbb{Z}8+\\mathbb{Z}12$.",
                  "$\\gcd(8,12)=4$."
                ]
              },
              {
                "id": "m373k-u2-l05-ex5",
                "type": "proof",
                "question": "Let $\\varphi:G\\to G'$ be a homomorphism with kernel $K$, and let $\\mathcal{H}\\le G'$. Prove that $\\varphi^{-1}(\\mathcal{H})$ is a subgroup of $G$ containing $K$.",
                "hints": [
                  "Use $\\varphi(ab)=\\varphi(a)\\varphi(b)$ for closure.",
                  "Use $\\varphi(1)=1$ and $\\varphi(a^{-1})=\\varphi(a)^{-1}$.",
                  "Every element of $K$ maps to $1\\in\\mathcal{H}$."
                ],
                "rubric": [
                  "Closure: $a,b\\in\\varphi^{-1}(\\mathcal{H})\\Rightarrow\\varphi(ab)=\\varphi(a)\\varphi(b)\\in\\mathcal{H}$.",
                  "Identity: $\\varphi(1)=1\\in\\mathcal{H}$.",
                  "Inverses: $\\varphi(a^{-1})=\\varphi(a)^{-1}\\in\\mathcal{H}$.",
                  "Contains $K$: $\\varphi(k)=1\\in\\mathcal{H}$."
                ],
                "modelProof": "Let $H=\\varphi^{-1}(\\mathcal{H})$. If $a,b\\in H$, then $\\varphi(ab)=\\varphi(a)\\varphi(b)\\in\\mathcal{H}$, so $ab\\in H$. Since $\\varphi(1)=1\\in\\mathcal{H}$, $1\\in H$. If $a\\in H$, then $\\varphi(a^{-1})=\\varphi(a)^{-1}\\in\\mathcal{H}$, so $a^{-1}\\in H$. Thus $H$ is a subgroup. If $k\\in K$, then $\\varphi(k)=1\\in\\mathcal{H}$, so $K\\subseteq H$. $\\blacksquare$"
              },
              {
                "id": "m373k-u2-l05-ex6",
                "type": "proof",
                "question": "Let $\\varphi:G\\to\\mathcal{G}$ be a homomorphism with kernel $K$, and let $H$ be a subgroup with $K\\le H$. Prove that $\\varphi^{-1}(\\varphi(H))=H$.",
                "hints": [
                  "One inclusion is automatic.",
                  "For the other, take $a$ with $\\varphi(a)=\\varphi(h)$ for some $h\\in H$.",
                  "Show $h^{-1}a\\in K\\subseteq H$."
                ],
                "rubric": [
                  "Show $H\\subseteq\\varphi^{-1}(\\varphi(H))$ directly from the definitions.",
                  "For $a\\in\\varphi^{-1}(\\varphi(H))$, pick $h\\in H$ with $\\varphi(a)=\\varphi(h)$.",
                  "Compute $\\varphi(h^{-1}a)=1$, so $h^{-1}a\\in K\\subseteq H$.",
                  "Conclude $a=h(h^{-1}a)\\in H$."
                ],
                "modelProof": "If $h\\in H$, then $\\varphi(h)\\in\\varphi(H)$, so $h\\in\\varphi^{-1}(\\varphi(H))$. Conversely, let $a\\in\\varphi^{-1}(\\varphi(H))$. Then $\\varphi(a)=\\varphi(h)$ for some $h\\in H$, so $\\varphi(h^{-1}a)=\\varphi(h)^{-1}\\varphi(a)=1$ and $h^{-1}a\\in K$. Since $K\\le H$, $h^{-1}a\\in H$, and $a=h(h^{-1}a)\\in H$. Hence $\\varphi^{-1}(\\varphi(H))=H$. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u2-l06",
            "title": "Product Groups",
            "duration": "12:00",
            "videoUrl": "",
            "theorem": "Artin 2.11: The product $G\\times G'$ has law $(a,a')(b,b')=(ab,a'b')$. Proposition 2.11.3: if $\\gcd(r,s)=1$, a cyclic group of order $rs$ is isomorphic to $C_r\\times C_s$. Proposition 2.11.4: if $H,K\\le G$ are normal, $H\\cap K=\\{1\\}$ and $HK=G$, then $H\\times K\\to G$, $(h,k)\\mapsto hk$, is an isomorphism. Proposition 2.11.5: every group of order $4$ is $C_4$ or $C_2\\times C_2$.",
            "steps": [
              {
                "time": "00:00",
                "label": "The product group",
                "math": "(a,a')\\cdot(b,b')=(ab,\\ a'b'),\\qquad |G\\times G'|=|G|\\,|G'|",
                "caption": "Identity $(1,1)$, inverse $(a^{-1},a'^{-1})$. The projections to $G$ and $G'$ are surjective homomorphisms."
              },
              {
                "time": "02:00",
                "label": "Orders in a product",
                "math": "\\operatorname{ord}(a,a')=\\operatorname{lcm}(\\operatorname{ord}a,\\operatorname{ord}a')",
                "caption": "$(a,a')^k=(a^k,a'^k)$ is the identity exactly when both orders divide $k$."
              },
              {
                "time": "04:00",
                "label": "When is a product cyclic?",
                "math": "C_r\\times C_s\\approx C_{rs}\\iff\\gcd(r,s)=1",
                "caption": "$(x,y)$ has order $\\operatorname{lcm}(r,s)$, which equals $rs$ exactly when $r,s$ are coprime. So $C_2\\times C_3\\approx C_6$, but $C_2\\times C_2\\not\\approx C_4$."
              },
              {
                "time": "06:00",
                "label": "Recognizing a product inside G",
                "math": "H,K\\trianglelefteq G,\\quad H\\cap K=\\{1\\},\\quad HK=G\\implies G\\approx H\\times K",
                "caption": "First show $hk=kh$: the commutator $hkh^{-1}k^{-1}$ lies in both $H$ and $K$, so it is $1$."
              },
              {
                "time": "08:00",
                "label": "Groups of order 4",
                "math": "|G|=4\\implies G\\approx C_4\\ \\text{or}\\ G\\approx C_2\\times C_2",
                "caption": "If some element has order $4$, $G$ is cyclic. Otherwise every non-identity element has order $2$, $G$ is abelian, and two of them generate subgroups $H,K$ as above."
              },
              {
                "time": "10:00",
                "label": "Example: groups of order 6",
                "math": "S_3\\not\\approx C_2\\times C_3",
                "caption": "$S_3$ has normal subgroup $\\langle x\\rangle$ and a subgroup $\\langle y\\rangle$ meeting it trivially, but $\\langle y\\rangle$ is not normal, so the product criterion fails. Indeed $S_3$ is not abelian."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u2-l06-ex1",
                "type": "mcq",
                "question": "What is the order of the element $(\\bar 2,\\bar 3)$ in $\\mathbb{Z}/4\\mathbb{Z}\\times\\mathbb{Z}/6\\mathbb{Z}$?",
                "options": [
                  "$2$",
                  "$6$",
                  "$12$",
                  "$24$"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! $\\bar2$ has order $2$ in $\\mathbb{Z}/4\\mathbb{Z}$ and $\\bar3$ has order $2$ in $\\mathbb{Z}/6\\mathbb{Z}$; $\\operatorname{lcm}(2,2)=2$.",
                  "Incorrect: compute the order of each coordinate first.",
                  "Incorrect: that is $\\operatorname{lcm}(4,6)$, the largest possible order.",
                  "Incorrect: that is the order of the group."
                ],
                "hints": [
                  "$\\operatorname{ord}(a,b)=\\operatorname{lcm}(\\operatorname{ord}a,\\operatorname{ord}b)$.",
                  "The order of $\\bar k$ in $\\mathbb{Z}/n\\mathbb{Z}$ is $n/\\gcd(k,n)$.",
                  "$2\\cdot\\bar2=\\bar0$ and $2\\cdot\\bar3=\\bar0$."
                ]
              },
              {
                "id": "m373k-u2-l06-ex2",
                "type": "mcq",
                "question": "Which group is cyclic?",
                "options": [
                  "$C_2\\times C_2$",
                  "$C_4\\times C_6$",
                  "$C_5\\times C_7$",
                  "$C_3\\times C_3$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: every element has order at most $2$.",
                  "Incorrect: $\\gcd(4,6)=2$, so the largest order is $12<24$.",
                  "Correct! $\\gcd(5,7)=1$, so $C_5\\times C_7\\approx C_{35}$ (Proposition 2.11.3).",
                  "Incorrect: every element has order dividing $3$."
                ],
                "hints": [
                  "$C_r\\times C_s$ is cyclic iff $\\gcd(r,s)=1$.",
                  "Compute the largest element order, $\\operatorname{lcm}(r,s)$.",
                  "Compare it with $rs$."
                ]
              },
              {
                "id": "m373k-u2-l06-ex3",
                "type": "mcq",
                "question": "Let $G=C_2\\times C_2$. How many subgroups of order $2$ does $G$ have?",
                "options": [
                  "$1$",
                  "$2$",
                  "$3$",
                  "$4$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: there are three elements of order $2$.",
                  "Incorrect: count the elements of order $2$.",
                  "Correct! The non-identity elements $(1,0),(0,1),(1,1)$ each have order $2$ and generate distinct subgroups.",
                  "Incorrect: the identity does not generate a subgroup of order $2$."
                ],
                "hints": [
                  "Each subgroup of order $2$ is $\\{1,a\\}$ with $a$ of order $2$.",
                  "How many non-identity elements are there?",
                  "What is the order of each one?"
                ]
              },
              {
                "id": "m373k-u2-l06-ex4",
                "type": "mcq",
                "question": "Which condition in Proposition 2.11.4 fails for $H=\\langle x\\rangle$, $K=\\langle y\\rangle$ in $S_3$?",
                "options": [
                  "$H\\cap K=\\{1\\}$",
                  "$HK=S_3$",
                  "$K$ is normal",
                  "$H$ is normal"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: $\\{1,x,x^2\\}\\cap\\{1,y\\}=\\{1\\}$.",
                  "Incorrect: $HK=\\{1,x,x^2,y,xy,x^2y\\}=S_3$.",
                  "Correct! $xyx^{-1}=x^2y\\notin K$, so $K$ is not normal. That is why $S_3\\not\\approx C_3\\times C_2$.",
                  "Incorrect: $H$ has index $2$, so it is normal."
                ],
                "hints": [
                  "Check each condition in turn.",
                  "Compute $HK$ by listing products.",
                  "Conjugate $y$ by $x$."
                ]
              },
              {
                "id": "m373k-u2-l06-ex5",
                "type": "proof",
                "question": "Let $H$ and $K$ be normal subgroups of $G$ with $H\\cap K=\\{1\\}$. Prove that $hk=kh$ for all $h\\in H$, $k\\in K$.",
                "hints": [
                  "Consider the commutator $c=hkh^{-1}k^{-1}$.",
                  "Group it as $(hkh^{-1})k^{-1}$ and as $h(kh^{-1}k^{-1})$.",
                  "Use normality of $K$ and of $H$."
                ],
                "rubric": [
                  "Write $c=hkh^{-1}k^{-1}$.",
                  "Show $c\\in K$: $hkh^{-1}\\in K$ since $K$ is normal, and $k^{-1}\\in K$.",
                  "Show $c\\in H$: $kh^{-1}k^{-1}\\in H$ since $H$ is normal, and $h\\in H$.",
                  "Conclude $c\\in H\\cap K=\\{1\\}$, so $hk=kh$."
                ],
                "modelProof": "Let $c=hkh^{-1}k^{-1}$. Since $K$ is normal, $hkh^{-1}\\in K$, so $c=(hkh^{-1})k^{-1}\\in K$. Since $H$ is normal, $kh^{-1}k^{-1}\\in H$, so $c=h(kh^{-1}k^{-1})\\in H$. Hence $c\\in H\\cap K=\\{1\\}$, so $hkh^{-1}k^{-1}=1$, and multiplying on the right by $kh$ gives $hk=kh$. $\\blacksquare$"
              },
              {
                "id": "m373k-u2-l06-ex6",
                "type": "proof",
                "question": "Let $r,s$ be relatively prime positive integers, $C_r=\\langle x\\rangle$, $C_s=\\langle y\\rangle$. Prove that $C_r\\times C_s$ is cyclic of order $rs$.",
                "hints": [
                  "Show $(x,y)$ has order $rs$.",
                  "$(x,y)^k=(x^k,y^k)=(1,1)$ iff $r\\mid k$ and $s\\mid k$.",
                  "Use $\\gcd(r,s)=1$ to conclude $rs\\mid k$."
                ],
                "rubric": [
                  "Note $|C_r\\times C_s|=rs$.",
                  "Show $(x,y)^k=1$ iff $r\\mid k$ and $s\\mid k$.",
                  "Use coprimality: $r\\mid k$ and $s\\mid k$ imply $rs\\mid k$, since $\\operatorname{lcm}(r,s)=rs$.",
                  "Conclude $(x,y)$ has order $rs$, so it generates the whole group."
                ],
                "modelProof": "The group $C_r\\times C_s$ has $rs$ elements. We have $(x,y)^k=(x^k,y^k)$, which is the identity iff $x^k=1$ and $y^k=1$, i.e. iff $r\\mid k$ and $s\\mid k$. Since $\\gcd(r,s)=1$, $\\operatorname{lcm}(r,s)=rs/\\gcd(r,s)=rs$, so this happens iff $rs\\mid k$. Thus $(x,y)$ has order $rs$, and $\\langle(x,y)\\rangle$ is a subgroup with $rs$ elements, the whole group. Hence $C_r\\times C_s$ is cyclic. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u2-l07",
            "title": "Group Operations, Orbits and Stabilizers",
            "duration": "14:00",
            "videoUrl": "",
            "theorem": "Artin 6.7–6.9: An operation of $G$ on a set $S$ satisfies $1s=s$ and $(gh)s=g(hs)$. The orbits partition $S$, the stabilizer $G_s=\\{g: gs=s\\}$ is a subgroup, and $gG_s\\mapsto gs$ is a bijection from left cosets of $G_s$ onto the orbit of $s$. Proposition 6.9.2 (Counting Formula): $|G|=|\\operatorname{Orb}(s)|\\cdot|G_s|$.",
            "steps": [
              {
                "time": "00:00",
                "label": "Operations",
                "math": "G\\times S\\to S,\\qquad 1s=s,\\qquad (gh)s=g(hs)",
                "caption": "Examples: $S_n$ acting on $\\{1,\\dots,n\\}$; $GL_n(\\mathbb{R})$ acting on $\\mathbb{R}^n$; $G$ acting on itself by left multiplication or by conjugation."
              },
              {
                "time": "02:00",
                "label": "Orbits",
                "math": "\\operatorname{Orb}(s)=\\{gs: g\\in G\\}",
                "caption": "$s\\sim t$ if $t=gs$ for some $g$ is an equivalence relation, so the orbits partition $S$. The operation is transitive if there is only one orbit."
              },
              {
                "time": "04:00",
                "label": "Stabilizers",
                "math": "G_s=\\{g\\in G: gs=s\\}\\le G",
                "caption": "In $S_3$ acting on $\\{1,2,3\\}$, the stabilizer of $3$ is $\\{1,(1\\,2)\\}$. Elements of the same orbit have conjugate stabilizers: $G_{gs}=gG_sg^{-1}$."
              },
              {
                "time": "06:00",
                "label": "Orbits are cosets",
                "math": "gs=hs\\iff h^{-1}g\\in G_s\\iff gG_s=hG_s",
                "caption": "So $gG_s\\mapsto gs$ is a well-defined bijection from $G/G_s$ (the set of cosets) to the orbit of $s$."
              },
              {
                "time": "08:00",
                "label": "The counting formula",
                "math": "|G|=|\\operatorname{Orb}(s)|\\cdot|G_s|",
                "caption": "Rotations of a cube: a face can go to any of $6$ faces, and $4$ rotations fix a face, so the group has $6\\cdot 4=24$ elements."
              },
              {
                "time": "10:00",
                "label": "Operation on cosets",
                "math": "g\\cdot(aH)=(ga)H",
                "caption": "$G$ acts transitively on $G/H$, and the stabilizer of $H$ is $H$ itself (Proposition 6.8.1). This gives a homomorphism $G\\to S_n$ with $n=[G:H]$."
              },
              {
                "time": "12:00",
                "label": "Permutation representation",
                "math": "\\varphi:G\\to\\operatorname{Perm}(S),\\qquad \\varphi(g)(s)=gs",
                "caption": "An operation is the same thing as a homomorphism into the permutation group of $S$. Its kernel is the set of elements that fix every point."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u2-l07-ex1",
                "type": "mcq",
                "question": "$S_4$ acts on $\\{1,2,3,4\\}$. What is the order of the stabilizer of $4$?",
                "options": [
                  "$1$",
                  "$4$",
                  "$6$",
                  "$24$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: the stabilizer contains every permutation of $\\{1,2,3\\}$.",
                  "Incorrect: that is the size of the orbit.",
                  "Correct! The orbit of $4$ is all $4$ points, so $|G_4|=24/4=6$; it is a copy of $S_3$.",
                  "Incorrect: not every permutation fixes $4$."
                ],
                "hints": [
                  "Use the counting formula.",
                  "What is the orbit of $4$?",
                  "$|G_s|=|G|/|\\operatorname{Orb}(s)|$."
                ]
              },
              {
                "id": "m373k-u2-l07-ex2",
                "type": "mcq",
                "question": "The rotation group of a cube acts on its $8$ vertices transitively. How many rotations fix a given vertex?",
                "options": [
                  "$1$",
                  "$3$",
                  "$4$",
                  "$8$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: rotations about the diagonal through that vertex fix it.",
                  "Correct! $|G|=24$ and the orbit has $8$ vertices, so the stabilizer has $24/8=3$ elements: rotations by $0$, $120^\\circ$, $240^\\circ$ about the diagonal.",
                  "Incorrect: $4$ rotations fix a face, not a vertex.",
                  "Incorrect: that is the size of the orbit."
                ],
                "hints": [
                  "The rotation group of a cube has order $24$.",
                  "Use the counting formula with an orbit of size $8$.",
                  "Think of the long diagonal through the vertex."
                ]
              },
              {
                "id": "m373k-u2-l07-ex3",
                "type": "mcq",
                "question": "$G$ acts on itself by conjugation, $g\\cdot x=gxg^{-1}$. What is the stabilizer of $x$?",
                "options": [
                  "$\\langle x\\rangle$",
                  "the center $Z(G)$",
                  "the centralizer $Z(x)=\\{g: gx=xg\\}$",
                  "$\\{1\\}$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: $\\langle x\\rangle$ is contained in the stabilizer but may be smaller.",
                  "Incorrect: the center fixes every $x$, but the stabilizer of one $x$ can be bigger.",
                  "Correct! $gxg^{-1}=x$ iff $gx=xg$.",
                  "Incorrect: $x$ itself always commutes with $x$."
                ],
                "hints": [
                  "Write out $g\\cdot x=x$.",
                  "Multiply $gxg^{-1}=x$ on the right by $g$.",
                  "The set of elements commuting with $x$ has a name."
                ]
              },
              {
                "id": "m373k-u2-l07-ex4",
                "type": "mcq",
                "question": "A group of order $15$ acts on a set with $7$ elements. What can be said?",
                "options": [
                  "every orbit has size $1$, $3$, $5$ or $15$, so there is a fixed point",
                  "the action is transitive",
                  "there are no fixed points",
                  "no conclusion is possible"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! Orbit sizes divide $15$ and are at most $7$, so each is $1$, $3$ or $5$. The orbits partition the $7$ points, and $7$ is not a sum of $3$'s and $5$'s, so some orbit has size $1$.",
                  "Incorrect: a transitive action would need an orbit of size $7$, which does not divide $15$.",
                  "Incorrect: some orbit must have size $1$.",
                  "Incorrect: the counting formula restricts the orbit sizes."
                ],
                "hints": [
                  "Orbit sizes divide $|G|$.",
                  "Which divisors of $15$ are at most $7$?",
                  "Can $7$ be written as a sum of $3$'s and $5$'s?"
                ]
              },
              {
                "id": "m373k-u2-l07-ex5",
                "type": "proof",
                "question": "Let $G$ act on $S$ and $s\\in S$. Prove that the stabilizer $G_s$ is a subgroup of $G$.",
                "hints": [
                  "Use the axioms $1s=s$ and $(gh)s=g(hs)$.",
                  "For inverses, apply $g^{-1}$ to $gs=s$.",
                  "Check closure, identity, inverses."
                ],
                "rubric": [
                  "Identity: $1s=s$.",
                  "Closure: $(gh)s=g(hs)=gs=s$.",
                  "Inverses: $g^{-1}s=g^{-1}(gs)=(g^{-1}g)s=1s=s$.",
                  "Conclude $G_s\\le G$."
                ],
                "modelProof": "By the first axiom $1s=s$, so $1\\in G_s$. If $g,h\\in G_s$, then $(gh)s=g(hs)=gs=s$, so $gh\\in G_s$. If $g\\in G_s$, then $g^{-1}s=g^{-1}(gs)=(g^{-1}g)s=1s=s$, so $g^{-1}\\in G_s$. Hence $G_s$ is a subgroup. $\\blacksquare$"
              },
              {
                "id": "m373k-u2-l07-ex6",
                "type": "proof",
                "question": "(Counting Formula) Let a finite group $G$ act on $S$, and $s\\in S$. Prove that $|G|=|\\operatorname{Orb}(s)|\\cdot|G_s|$.",
                "hints": [
                  "Define $\\psi:G/G_s\\to\\operatorname{Orb}(s)$ by $\\psi(gG_s)=gs$.",
                  "Show $gs=hs\\iff gG_s=hG_s$.",
                  "Then apply Lagrange."
                ],
                "rubric": [
                  "Show $gs=hs\\iff h^{-1}gs=s\\iff h^{-1}g\\in G_s\\iff gG_s=hG_s$.",
                  "Conclude $\\psi$ is well defined and injective.",
                  "Note $\\psi$ is surjective by definition of the orbit.",
                  "Use Lagrange: $|G|=[G:G_s]\\,|G_s|=|\\operatorname{Orb}(s)|\\,|G_s|$."
                ],
                "modelProof": "For $g,h\\in G$: $gs=hs$ iff $h^{-1}(gs)=h^{-1}(hs)$ iff $(h^{-1}g)s=s$ iff $h^{-1}g\\in G_s$ iff $gG_s=hG_s$. Hence $\\psi(gG_s)=gs$ is a well-defined injective map from the set of left cosets of $G_s$ to $\\operatorname{Orb}(s)$, and it is surjective because every element of the orbit is some $gs$. So $|\\operatorname{Orb}(s)|=[G:G_s]$, and by Lagrange's theorem $|G|=[G:G_s]\\,|G_s|=|\\operatorname{Orb}(s)|\\,|G_s|$. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u2-l08",
            "title": "The Class Equation and p-Groups",
            "duration": "13:00",
            "videoUrl": "",
            "theorem": "Artin 7.2–7.3: Under conjugation, the orbits of $G$ are its conjugacy classes and the stabilizer of $x$ is its centralizer $Z(x)$, so $|C(x)|=[G:Z(x)]$ divides $|G|$. The class equation is $|G|=\\sum_{C}|C|$, with $|Z(G)|$ classes of size $1$. Proposition 7.3.1: the center of a $p$-group is nontrivial. Proposition 7.3.3: every group of order $p^2$ is abelian.",
            "steps": [
              {
                "time": "00:00",
                "label": "Cayley's theorem",
                "math": "G\\hookrightarrow\\operatorname{Perm}(G),\\qquad g\\mapsto(x\\mapsto gx)",
                "caption": "Left multiplication is a faithful action, so every finite group of order $n$ is isomorphic to a subgroup of $S_n$ (Theorem 7.1.3)."
              },
              {
                "time": "02:00",
                "label": "Conjugacy classes",
                "math": "C(x)=\\{gxg^{-1}: g\\in G\\},\\qquad |C(x)|=[G:Z(x)]",
                "caption": "Apply the counting formula to the conjugation action. Each class size divides $|G|$."
              },
              {
                "time": "04:00",
                "label": "The class equation",
                "math": "|G|=|Z(G)|+\\sum_{|C|>1}|C|",
                "caption": "Classes of size $1$ are exactly the central elements. For $S_3$: $6=1+2+3$."
              },
              {
                "time": "06:00",
                "label": "p-groups have a center",
                "math": "|G|=p^e\\implies p\\ \\Big|\\ |Z(G)|",
                "caption": "Every class size divides $p^e$, so the non-central ones are multiples of $p$. Reducing the class equation mod $p$ gives $|Z(G)|\\equiv 0$, and $|Z(G)|\\ge 1$."
              },
              {
                "time": "08:00",
                "label": "Groups of order p squared",
                "math": "|G|=p^2\\implies G\\approx C_{p^2}\\ \\text{or}\\ C_p\\times C_p",
                "caption": "$Z(G)\\neq\\{1\\}$. If $Z(G)\\neq G$, pick $x\\notin Z(G)$; then $Z(x)$ contains $Z(G)$ and $x$, so $Z(x)=G$ and $x\\in Z(G)$, a contradiction."
              },
              {
                "time": "10:00",
                "label": "Fixed point theorem",
                "math": "|G|=p^e,\\ p\\nmid|S|\\implies\\exists\\,s\\in S:\\ gs=s\\ \\forall g",
                "caption": "Orbit sizes are powers of $p$; if none were $1$, $|S|$ would be divisible by $p$ (Theorem 7.3.2)."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u2-l08-ex1",
                "type": "mcq",
                "question": "Which could be the class equation of a group of order $10$?",
                "options": [
                  "$10=1+2+2+5$",
                  "$10=1+1+3+5$",
                  "$10=1+4+5$",
                  "$10=2+3+5$"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! This is the class equation of the dihedral group $D_5$: the identity, two classes of rotations, and five reflections.",
                  "Incorrect: $3$ does not divide $10$.",
                  "Incorrect: $4$ does not divide $10$.",
                  "Incorrect: the identity always forms a class of size $1$."
                ],
                "hints": [
                  "Each class size divides $|G|$.",
                  "The identity contributes a class of size $1$.",
                  "The number of $1$'s is $|Z(G)|$, which divides $|G|$."
                ]
              },
              {
                "id": "m373k-u2-l08-ex2",
                "type": "mcq",
                "question": "What is the class equation of $S_3$?",
                "options": [
                  "$6=1+1+1+3$",
                  "$6=1+2+3$",
                  "$6=1+1+2+2$",
                  "$6=3+3$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: only the identity is central in $S_3$.",
                  "Correct! The classes are $\\{1\\}$, $\\{x,x^2\\}$ and $\\{y,xy,x^2y\\}$.",
                  "Incorrect: the three transpositions are all conjugate.",
                  "Incorrect: the identity is a class by itself."
                ],
                "hints": [
                  "$Z(S_3)=\\{1\\}$.",
                  "Conjugate elements have the same order.",
                  "Count elements of order $2$ and of order $3$."
                ]
              },
              {
                "id": "m373k-u2-l08-ex3",
                "type": "mcq",
                "question": "A group $G$ has order $27$. Which is necessarily true?",
                "options": [
                  "$G$ is abelian",
                  "$G$ is cyclic",
                  "$|Z(G)|\\in\\{3,9,27\\}$",
                  "$Z(G)=\\{1\\}$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: there are non-abelian groups of order $27=3^3$.",
                  "Incorrect: $C_3\\times C_9$ has order $27$ and is not cyclic.",
                  "Correct! $G$ is a $3$-group, so its center is nontrivial (Proposition 7.3.1), and $|Z(G)|$ divides $27$.",
                  "Incorrect: $p$-groups always have nontrivial center."
                ],
                "hints": [
                  "$27=3^3$, so $G$ is a $p$-group.",
                  "What do we know about the center of a $p$-group?",
                  "Groups of order $p^2$ are abelian; $p^3$ need not be."
                ]
              },
              {
                "id": "m373k-u2-l08-ex4",
                "type": "mcq",
                "question": "In a group of order $p^2$, why must $G$ be abelian?",
                "options": [
                  "by Lagrange, every element has order $p$",
                  "$G/Z(G)$ cyclic forces $G$ abelian, and $|G/Z(G)|\\in\\{1,p\\}$",
                  "every group of prime-power order is abelian",
                  "the class equation has only $1$'s"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $C_{p^2}$ has an element of order $p^2$.",
                  "Correct! $Z(G)\\neq\\{1\\}$, so $|G/Z(G)|$ is $1$ or $p$, hence cyclic, and a group with cyclic $G/Z(G)$ is abelian.",
                  "Incorrect: there are non-abelian groups of order $p^3$, such as the quaternion group of order $8$.",
                  "Incorrect: that is the conclusion, not the reason."
                ],
                "hints": [
                  "Start with Proposition 7.3.1.",
                  "What are the possible orders of $G/Z(G)$?",
                  "If $G/Z(G)$ is cyclic, generated by $xZ(G)$, every element is $x^kz$."
                ]
              },
              {
                "id": "m373k-u2-l08-ex5",
                "type": "proof",
                "question": "(Proposition 7.3.1) Let $G$ be a group of order $p^e$, $e\\ge 1$, $p$ prime. Prove that $Z(G)\\neq\\{1\\}$.",
                "hints": [
                  "Write the class equation.",
                  "Each class size divides $p^e$, so it is $1$ or a multiple of $p$.",
                  "Reduce modulo $p$."
                ],
                "rubric": [
                  "Write $p^e=|Z(G)|+\\sum|C|$, the sum over classes with $|C|>1$.",
                  "Show each such $|C|$ is a power of $p$ greater than $1$, hence divisible by $p$.",
                  "Conclude $p$ divides $|Z(G)|$.",
                  "Since $1\\in Z(G)$, $|Z(G)|\\ge 1$, so $|Z(G)|\\ge p$."
                ],
                "modelProof": "The class equation reads $p^e=|Z(G)|+\\sum|C|$, where the sum runs over the conjugacy classes with more than one element. Each class size divides $|G|=p^e$, so a class with more than one element has size $p^k$ with $k\\ge 1$, divisible by $p$. Since $p\\mid p^e$, it follows that $p\\mid|Z(G)|$. But $1\\in Z(G)$, so $|Z(G)|\\ge 1$, hence $|Z(G)|\\ge p>1$. $\\blacksquare$"
              },
              {
                "id": "m373k-u2-l08-ex6",
                "type": "proof",
                "question": "Let $G$ be a group such that $G/Z(G)$ is cyclic. Prove that $G$ is abelian.",
                "hints": [
                  "Let $xZ$ generate $G/Z$, where $Z=Z(G)$.",
                  "Then every element of $G$ has the form $x^kz$ with $z\\in Z$.",
                  "Multiply two such elements."
                ],
                "rubric": [
                  "Write $G/Z=\\langle xZ\\rangle$.",
                  "Show every $g\\in G$ is $x^kz$ for some $k$ and $z\\in Z$.",
                  "Compute $(x^kz)(x^lw)=x^{k+l}zw$ using that $z,w$ are central.",
                  "Note this is symmetric in the two factors, so $G$ is abelian."
                ],
                "modelProof": "Let $Z=Z(G)$ and suppose $G/Z=\\langle xZ\\rangle$. For $g\\in G$, $gZ=(xZ)^k=x^kZ$ for some $k$, so $g=x^kz$ with $z\\in Z$. Let $g=x^kz$ and $h=x^lw$ with $z,w\\in Z$. Since $z$ and $w$ commute with everything, $gh=x^kzx^lw=x^kx^lzw=x^{k+l}zw$ and $hg=x^lwx^kz=x^{l+k}wz=x^{k+l}zw$. Hence $gh=hg$, and $G$ is abelian. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u2-l09",
            "title": "The Sylow Theorems",
            "duration": "14:00",
            "videoUrl": "",
            "theorem": "Artin 7.7: Let $|G|=p^em$ with $p\\nmid m$. (1) $G$ has a subgroup of order $p^e$, a Sylow $p$-subgroup. (2) All Sylow $p$-subgroups are conjugate, and every $p$-subgroup is contained in one. (3) The number $s$ of Sylow $p$-subgroups divides $m$ and $s\\equiv 1\\pmod p$. A Sylow $p$-subgroup is normal if and only if $s=1$.",
            "steps": [
              {
                "time": "00:00",
                "label": "The setup",
                "math": "|G|=p^e m,\\qquad p\\nmid m",
                "caption": "Lagrange says subgroup orders divide $|G|$. The converse fails in general ($A_4$ has no subgroup of order $6$), but Sylow says it holds for the largest power of each prime."
              },
              {
                "time": "02:00",
                "label": "First Sylow Theorem",
                "math": "\\exists\\,P\\le G,\\quad |P|=p^e",
                "caption": "Artin's proof lets $G$ act on the subsets of order $p^e$ and finds an orbit of size prime to $p$ (Lemmas 7.7.9–7.7.10)."
              },
              {
                "time": "04:00",
                "label": "Second Sylow Theorem",
                "math": "P,P'\\ \\text{Sylow}\\implies P'=gPg^{-1}\\ \\text{for some } g",
                "caption": "A $p$-subgroup $K$ acting on $G/P$ has a fixed point by the fixed point theorem, since $[G:P]=m$ is prime to $p$. So $K\\subseteq gPg^{-1}$."
              },
              {
                "time": "06:00",
                "label": "Third Sylow Theorem",
                "math": "s_p\\mid m,\\qquad s_p\\equiv 1\\pmod p",
                "caption": "$s_p$ is the size of the conjugation orbit of $P$, so it divides $|G|$; it is prime to $p$, so it divides $m$."
              },
              {
                "time": "08:00",
                "label": "Groups of order 15",
                "math": "s_3\\mid 5,\\ s_3\\equiv 1\\ (3)\\implies s_3=1;\\qquad s_5\\mid 3,\\ s_5\\equiv 1\\ (5)\\implies s_5=1",
                "caption": "Both Sylow subgroups are normal and meet trivially, so $G\\approx C_3\\times C_5\\approx C_{15}$. Every group of order $15$ is cyclic."
              },
              {
                "time": "10:00",
                "label": "Groups of order 6",
                "math": "s_3=1,\\qquad s_2\\in\\{1,3\\}",
                "caption": "If $s_2=1$, $G\\approx C_2\\times C_3\\approx C_6$. If $s_2=3$, $G$ acts on its three Sylow $2$-subgroups and $G\\approx S_3$."
              },
              {
                "time": "12:00",
                "label": "Using Sylow",
                "math": "|G|=pq,\\ p<q,\\ p\\nmid q-1\\implies G\\ \\text{cyclic}",
                "caption": "The same counting shows both Sylow subgroups are normal. This is the standard way to prove that no group of a given order is simple."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u2-l09-ex1",
                "type": "mcq",
                "question": "Let $|G|=12$. Which values are possible for the number $s_3$ of Sylow $3$-subgroups?",
                "options": [
                  "$1$ or $4$",
                  "$1$ or $3$",
                  "$1,2$ or $4$",
                  "only $1$"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! $s_3$ divides $4$ and $s_3\\equiv 1\\pmod 3$, leaving $1$ and $4$. $A_4$ has $s_3=4$.",
                  "Incorrect: $3$ does not divide $m=4$.",
                  "Incorrect: $2\\not\\equiv 1\\pmod 3$.",
                  "Incorrect: $A_4$ has four Sylow $3$-subgroups."
                ],
                "hints": [
                  "Write $12=3\\cdot 4$.",
                  "$s_3$ divides $4$: candidates $1,2,4$.",
                  "Keep those congruent to $1$ mod $3$."
                ]
              },
              {
                "id": "m373k-u2-l09-ex2",
                "type": "mcq",
                "question": "How many groups of order $35$ are there, up to isomorphism?",
                "options": [
                  "$1$",
                  "$2$",
                  "$5$",
                  "$7$"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! $s_5\\mid 7$ and $s_5\\equiv 1\\pmod 5$ give $s_5=1$; $s_7\\mid 5$ and $s_7\\equiv 1\\pmod 7$ give $s_7=1$. So $G\\approx C_5\\times C_7\\approx C_{35}$.",
                  "Incorrect: the Sylow counts force both Sylow subgroups to be normal.",
                  "Incorrect: compute $s_5$ and $s_7$.",
                  "Incorrect: compute $s_5$ and $s_7$."
                ],
                "hints": [
                  "$35=5\\cdot 7$.",
                  "Find all $s_5$ and $s_7$ allowed by the Third Sylow Theorem.",
                  "Use Proposition 2.11.4 and 2.11.3."
                ]
              },
              {
                "id": "m373k-u2-l09-ex3",
                "type": "mcq",
                "question": "A Sylow $p$-subgroup $P$ of $G$ is normal if and only if",
                "options": [
                  "$P$ is abelian",
                  "$s_p=1$",
                  "$p$ divides $|G|$ exactly once",
                  "$G$ is abelian"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: the Sylow $2$-subgroups of $S_3$ are abelian but not normal.",
                  "Correct! All Sylow $p$-subgroups are conjugate to $P$, so $P$ is normal iff it is the only one.",
                  "Incorrect: in $S_3$, $2$ divides $6$ exactly once, but $s_2=3$.",
                  "Incorrect: that is sufficient, not necessary; $\\langle x\\rangle$ is a normal Sylow $3$-subgroup of $S_3$."
                ],
                "hints": [
                  "Use the Second Sylow Theorem.",
                  "Normal means $gPg^{-1}=P$ for all $g$.",
                  "The conjugates of $P$ are exactly the Sylow $p$-subgroups."
                ]
              },
              {
                "id": "m373k-u2-l09-ex4",
                "type": "mcq",
                "question": "Let $|G|=20$. Which is necessarily true?",
                "options": [
                  "$G$ is cyclic",
                  "$G$ has a normal subgroup of order $5$",
                  "$G$ has a normal subgroup of order $4$",
                  "$G$ is abelian"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $C_2\\times C_{10}$ has order $20$ and is not cyclic.",
                  "Correct! $s_5\\mid 4$ and $s_5\\equiv 1\\pmod 5$ force $s_5=1$.",
                  "Incorrect: $s_2$ can be $5$ (for example in the group of affine maps $x\\mapsto ax+b$ mod $5$).",
                  "Incorrect: the dihedral group $D_{10}$ of order $20$ is not abelian."
                ],
                "hints": [
                  "$20=4\\cdot 5$.",
                  "Which divisors of $4$ are $\\equiv 1\\pmod 5$?",
                  "A unique Sylow subgroup is normal."
                ]
              },
              {
                "id": "m373k-u2-l09-ex5",
                "type": "proof",
                "question": "Prove that every group of order $15$ is cyclic. You may use the Sylow theorems and Propositions 2.11.3–2.11.4.",
                "hints": [
                  "Compute $s_3$ and $s_5$.",
                  "Let $H$, $K$ be the Sylow $3$- and $5$-subgroups; check the hypotheses of Proposition 2.11.4.",
                  "Then use $C_3\\times C_5\\approx C_{15}$."
                ],
                "rubric": [
                  "Show $s_3=1$ and $s_5=1$ from the Third Sylow Theorem.",
                  "Conclude $H$ and $K$ are normal.",
                  "Show $H\\cap K=\\{1\\}$ by Lagrange and $|HK|=15$, so $HK=G$.",
                  "Apply Proposition 2.11.4 and then 2.11.3."
                ],
                "modelProof": "Let $|G|=15=3\\cdot 5$. By the Third Sylow Theorem, $s_3$ divides $5$ and $s_3\\equiv 1\\pmod 3$, so $s_3=1$; and $s_5$ divides $3$ with $s_5\\equiv 1\\pmod 5$, so $s_5=1$. Let $H$ and $K$ be the unique Sylow $3$- and $5$-subgroups; being unique, they are normal. $H\\cap K$ is a subgroup of both, so its order divides $\\gcd(3,5)=1$, and $H\\cap K=\\{1\\}$. The map $H\\times K\\to G$, $(h,k)\\mapsto hk$, is injective (if $hk=h'k'$ then $h'^{-1}h=k'k^{-1}\\in H\\cap K$), so $|HK|=15$ and $HK=G$. By Proposition 2.11.4, $G\\approx H\\times K\\approx C_3\\times C_5$, which is cyclic of order $15$ by Proposition 2.11.3. $\\blacksquare$"
              },
              {
                "id": "m373k-u2-l09-ex6",
                "type": "proof",
                "question": "Let $|G|=p^em$ with $p\\nmid m$, and let $P$ be a Sylow $p$-subgroup. Using the Second Sylow Theorem, prove that $s_p$ divides $m$.",
                "hints": [
                  "$G$ acts on the set of Sylow $p$-subgroups by conjugation.",
                  "By the Second Sylow Theorem this action is transitive. What is the stabilizer of $P$?",
                  "The stabilizer, the normalizer $N(P)$, contains $P$."
                ],
                "rubric": [
                  "Let $G$ act on the Sylow $p$-subgroups by conjugation; the orbit of $P$ is all of them, so $s_p=[G:N(P)]$.",
                  "Note $P\\le N(P)\\le G$.",
                  "Use multiplicativity of the index: $m=[G:P]=[G:N(P)]\\,[N(P):P]$.",
                  "Conclude $s_p=[G:N(P)]$ divides $m$."
                ],
                "modelProof": "Conjugation sends Sylow $p$-subgroups to Sylow $p$-subgroups, so $G$ acts on the set of them. By the Second Sylow Theorem all Sylow $p$-subgroups are conjugate, so the action is transitive and $s_p$ is the size of the orbit of $P$. The stabilizer of $P$ is its normalizer $N(P)=\\{g: gPg^{-1}=P\\}$, so by the counting formula $s_p=[G:N(P)]$. Since $P\\le N(P)$, the index is multiplicative: $m=[G:P]=[G:N(P)]\\,[N(P):P]$. Hence $s_p=[G:N(P)]$ divides $m$. $\\blacksquare$"
              }
            ]
          }
        ]
      },
      {
        "id": "m373k-u3",
        "title": "Unit 3: Rings & Ideals",
        "description": "Rings, units and fields, polynomial rings and division with remainder, ring homomorphisms and ideals, quotient rings and the First Isomorphism Theorem, adjoining elements, product rings and the Chinese Remainder Theorem, integral domains and fraction fields, and maximal ideals (Artin 11.1–11.8).",
        "lessons": [
          {
            "id": "m373k-u3-l01",
            "title": "Definition of a Ring",
            "duration": "12:00",
            "videoUrl": "",
            "theorem": "Artin 11.1: A ring $R$ (in Artin, commutative with identity) is a set with $+$ and $\\times$ such that $(R,+)$ is an abelian group, multiplication is commutative and associative with identity $1$, and the distributive law $a(b+c)=ab+ac$ holds. A unit is an element with a multiplicative inverse; a field is a ring with $1\\neq 0$ in which every nonzero element is a unit.",
            "steps": [
              {
                "time": "00:00",
                "label": "The axioms",
                "math": "(R,+)\\ \\text{abelian group},\\quad ab=ba,\\quad (ab)c=a(bc),\\quad 1a=a,\\quad a(b+c)=ab+ac",
                "caption": "Examples: $\\mathbb{Z}$, $\\mathbb{Q}$, $\\mathbb{R}$, $\\mathbb{C}$, $\\mathbb{Z}/n\\mathbb{Z}$, polynomial rings. Matrix rings are not commutative, so Artin treats them separately."
              },
              {
                "time": "02:00",
                "label": "Consequences",
                "math": "0\\cdot a=0,\\qquad (-a)b=-(ab)",
                "caption": "$0a=(0+0)a=0a+0a$, then cancel in $(R,+)$. Both rules follow from distributivity."
              },
              {
                "time": "04:00",
                "label": "The zero ring",
                "math": "1=0\\implies a=1a=0a=0\\ \\text{for all } a",
                "caption": "If $1=0$ the ring has a single element. Fields are required to have $1\\neq 0$."
              },
              {
                "time": "06:00",
                "label": "Gaussian integers",
                "math": "\\mathbb{Z}[i]=\\{a+bi: a,b\\in\\mathbb{Z}\\}\\subset\\mathbb{C}",
                "caption": "A subring: closed under $+$, $-$, $\\times$ and containing $1$. Its units are $\\pm1,\\pm i$."
              },
              {
                "time": "08:00",
                "label": "Units and fields",
                "math": "R^\\times=\\{u\\in R: uv=1\\ \\text{for some}\\ v\\},\\qquad \\mathbb{F}_p=\\mathbb{Z}/p\\mathbb{Z}",
                "caption": "$R^\\times$ is a group under multiplication. $\\mathbb{Z}/n\\mathbb{Z}$ is a field exactly when $n$ is prime, since $\\bar a$ is a unit iff $\\gcd(a,n)=1$."
              },
              {
                "time": "10:00",
                "label": "Zero divisors",
                "math": "\\bar2\\cdot\\bar3=\\bar0\\ \\text{in}\\ \\mathbb{Z}/6\\mathbb{Z}",
                "caption": "A nonzero $a$ with $ab=0$ for some nonzero $b$ is a zero divisor. A unit is never a zero divisor: multiply $ab=0$ by $a^{-1}$."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u3-l01-ex1",
                "type": "mcq",
                "question": "Which of these is a field?",
                "options": [
                  "$\\mathbb{Z}$",
                  "$\\mathbb{Z}/8\\mathbb{Z}$",
                  "$\\mathbb{Z}/7\\mathbb{Z}$",
                  "$\\mathbb{Z}[i]$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: $2$ has no inverse in $\\mathbb{Z}$.",
                  "Incorrect: $\\bar2\\cdot\\bar4=\\bar0$, so $\\bar2$ is a zero divisor and not a unit.",
                  "Correct! $7$ is prime, so every $\\bar a\\neq\\bar0$ has $\\gcd(a,7)=1$ and is invertible.",
                  "Incorrect: $2$ is not a unit in $\\mathbb{Z}[i]$, since $1/2\\notin\\mathbb{Z}[i]$."
                ],
                "hints": [
                  "A field needs an inverse for every nonzero element.",
                  "$\\bar a$ is a unit in $\\mathbb{Z}/n\\mathbb{Z}$ iff $\\gcd(a,n)=1$.",
                  "Which modulus is prime?"
                ]
              },
              {
                "id": "m373k-u3-l01-ex2",
                "type": "mcq",
                "question": "What are the units of $\\mathbb{Z}[i]$?",
                "options": [
                  "$\\pm1$",
                  "$\\pm1,\\pm i$",
                  "all nonzero elements",
                  "$\\pm1\\pm i$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $i\\cdot(-i)=1$, so $i$ is a unit too.",
                  "Correct! If $\\alpha\\beta=1$ then $|\\alpha|^2|\\beta|^2=1$ with both integers, so $|\\alpha|^2=a^2+b^2=1$.",
                  "Incorrect: $2$ has no inverse in $\\mathbb{Z}[i]$.",
                  "Incorrect: $|1+i|^2=2$, so $1+i$ is not a unit."
                ],
                "hints": [
                  "Use the norm $N(a+bi)=a^2+b^2$, which is multiplicative.",
                  "A unit must have norm $1$.",
                  "Solve $a^2+b^2=1$ in integers."
                ]
              },
              {
                "id": "m373k-u3-l01-ex3",
                "type": "mcq",
                "question": "In any ring $R$, what is $(-1)(-1)$?",
                "options": [
                  "$-1$",
                  "$1$",
                  "$0$",
                  "it depends on $R$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect in general: $(-1)(-1)=1$, which equals $-1$ only in rings where $1+1=0$.",
                  "Correct! $(-a)(-b)=ab$ follows from distributivity, so $(-1)(-1)=1\\cdot 1=1$.",
                  "Incorrect: $0$ only if $1=0$, the zero ring.",
                  "Incorrect: the identity $(-1)(-1)=1$ holds in every ring."
                ],
                "hints": [
                  "First show $(-a)b=-(ab)$.",
                  "Apply it twice.",
                  "Use $0=0\\cdot b=(a+(-a))b$."
                ]
              },
              {
                "id": "m373k-u3-l01-ex4",
                "type": "mcq",
                "question": "Which element of $\\mathbb{Z}/12\\mathbb{Z}$ is a zero divisor?",
                "options": [
                  "$\\bar1$",
                  "$\\bar5$",
                  "$\\bar 9$",
                  "$\\bar 7$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: $\\bar1$ is a unit.",
                  "Incorrect: $\\gcd(5,12)=1$, so $\\bar5$ is a unit ($5\\cdot5=25\\equiv1$).",
                  "Correct! $\\bar9\\cdot\\bar4=\\overline{36}=\\bar0$.",
                  "Incorrect: $\\gcd(7,12)=1$, so $\\bar7$ is a unit ($7\\cdot 7=49\\equiv 1$)."
                ],
                "hints": [
                  "Units are never zero divisors.",
                  "$\\bar a$ is a unit iff $\\gcd(a,12)=1$.",
                  "Find $b$ with $9b\\equiv 0\\pmod{12}$."
                ]
              },
              {
                "id": "m373k-u3-l01-ex5",
                "type": "proof",
                "question": "Let $R$ be a ring. Prove that $0\\cdot a=0$ and $(-a)b=-(ab)$ for all $a,b\\in R$.",
                "hints": [
                  "Expand $(0+0)a$ by distributivity.",
                  "Cancel in the additive group.",
                  "Expand $(a+(-a))b$."
                ],
                "rubric": [
                  "Write $0a=(0+0)a=0a+0a$.",
                  "Add $-(0a)$ to both sides to get $0=0a$.",
                  "Compute $ab+(-a)b=(a+(-a))b=0b=0$.",
                  "Conclude $(-a)b$ is the additive inverse of $ab$."
                ],
                "modelProof": "By distributivity, $0a=(0+0)a=0a+0a$. Adding $-(0a)$ to both sides in the abelian group $(R,+)$ gives $0=0a$. Next, $ab+(-a)b=(a+(-a))b=0\\cdot b=0$, so $(-a)b$ is an additive inverse of $ab$. Inverses in a group are unique, so $(-a)b=-(ab)$. $\\blacksquare$"
              },
              {
                "id": "m373k-u3-l01-ex6",
                "type": "proof",
                "question": "Prove that the units of a ring $R$ form a group $R^\\times$ under multiplication.",
                "hints": [
                  "Show the product of two units is a unit.",
                  "Identify the identity and inverses.",
                  "Associativity is inherited."
                ],
                "rubric": [
                  "Closure: if $uv=1$ and $u'v'=1$, then $(uu')(vv')=1$.",
                  "Identity: $1\\cdot 1=1$, so $1\\in R^\\times$.",
                  "Inverses: if $uv=1$, then $v$ is a unit with inverse $u$.",
                  "Associativity holds because it holds in $R$."
                ],
                "modelProof": "If $u,u'\\in R^\\times$ with $uv=1$ and $u'v'=1$, then by commutativity and associativity $(uu')(vv')=(uv)(u'v')=1$, so $uu'\\in R^\\times$. Since $1\\cdot 1=1$, $1\\in R^\\times$. If $uv=1$ then $vu=1$ shows $v\\in R^\\times$ with inverse $u$. Multiplication is associative in $R$, hence in $R^\\times$. Thus $R^\\times$ is a group. (This is Vaaler 1.1 applied to $(R,\\times)$.) $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u3-l02",
            "title": "Polynomial Rings",
            "duration": "13:00",
            "videoUrl": "",
            "theorem": "Artin 11.2: $R[x]$ is the ring of polynomials $a_nx^n+\\dots+a_0$ with coefficients in $R$. If $R$ is a domain, $\\deg(fg)=\\deg f+\\deg g$. Division with remainder: if $g$ is monic, then for every $f$ there are unique $q,r$ with $f=gq+r$ and $\\deg r<\\deg g$ (or $r=0$). Over a field, every nonzero $g$ can be divided by.",
            "steps": [
              {
                "time": "00:00",
                "label": "Polynomials",
                "math": "f(x)=a_nx^n+\\cdots+a_1x+a_0,\\qquad \\deg f=n\\ (a_n\\neq 0)",
                "caption": "$f$ is monic if $a_n=1$. Addition and multiplication are the usual ones; $x$ is a formal variable, not a number."
              },
              {
                "time": "02:00",
                "label": "Degree of a product",
                "math": "\\deg(fg)=\\deg f+\\deg g\\quad(R\\ \\text{a domain})",
                "caption": "The leading coefficient of $fg$ is $a_nb_m$, which is nonzero in a domain. In $(\\mathbb{Z}/4\\mathbb{Z})[x]$, $(2x+1)^2=1$, so degrees can drop."
              },
              {
                "time": "04:00",
                "label": "Division with remainder",
                "math": "f=gq+r,\\qquad \\deg r<\\deg g",
                "caption": "Subtract $a_nx^{n-m}g$ to kill the leading term of $f$, and repeat. This needs the leading coefficient of $g$ to be a unit."
              },
              {
                "time": "06:00",
                "label": "Example",
                "math": "x^3+2x+1=(x-1)(x^2+x+3)+4",
                "caption": "Long division in $\\mathbb{Q}[x]$. The remainder is a constant because $\\deg(x-1)=1$."
              },
              {
                "time": "08:00",
                "label": "Substitution and roots",
                "math": "f(x)=(x-a)q(x)+f(a)",
                "caption": "Divide by $x-a$: the remainder is $f(a)$. So $a$ is a root iff $(x-a)\\mid f$, and a nonzero polynomial of degree $n$ over a field has at most $n$ roots."
              },
              {
                "time": "10:00",
                "label": "Several variables",
                "math": "R[x_1,\\dots,x_n]=R[x_1,\\dots,x_{n-1}][x_n]",
                "caption": "Polynomials in several variables can be built one variable at a time. $\\mathbb{C}[x,y]$ is the setting for algebraic geometry in 11.9."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u3-l02-ex1",
                "type": "mcq",
                "question": "Divide $f=x^3-2x^2+4$ by $g=x-3$ in $\\mathbb{Q}[x]$. What is the remainder?",
                "options": [
                  "$4$",
                  "$13$",
                  "$-5$",
                  "$31$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $4=f(0)$; the remainder is $f(3)$.",
                  "Correct! By the remainder theorem $r=f(3)=27-18+4=13$.",
                  "Incorrect: check $f(3)=27-18+4$.",
                  "Incorrect: check the arithmetic: $27-18+4=13$."
                ],
                "hints": [
                  "Dividing by $x-a$ leaves remainder $f(a)$.",
                  "Here $a=3$.",
                  "Compute $3^3-2\\cdot 3^2+4$."
                ]
              },
              {
                "id": "m373k-u3-l02-ex2",
                "type": "mcq",
                "question": "Over a field $F$, how many roots can a nonzero polynomial of degree $5$ have?",
                "options": [
                  "exactly $5$",
                  "at most $5$",
                  "at least $5$",
                  "infinitely many"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $x^5-2$ has only one real root.",
                  "Correct! Each root $a$ gives a factor $x-a$, and degrees add, so there are at most $5$ distinct roots.",
                  "Incorrect: $x^5+1$ has one real root.",
                  "Incorrect: only the zero polynomial has infinitely many roots over an infinite field."
                ],
                "hints": [
                  "If $f(a)=0$, then $f=(x-a)q$ with $\\deg q=4$.",
                  "Use induction on the degree.",
                  "A field has no zero divisors."
                ]
              },
              {
                "id": "m373k-u3-l02-ex3",
                "type": "mcq",
                "question": "In $(\\mathbb{Z}/4\\mathbb{Z})[x]$, what is $(2x+1)(2x+1)$?",
                "options": [
                  "$4x^2+4x+1$",
                  "$1$",
                  "$2x+1$",
                  "$x^2+1$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: reduce the coefficients modulo $4$.",
                  "Correct! $4x^2+4x+1\\equiv 1$ modulo $4$. So $2x+1$ is a unit, and degrees do not add because $\\mathbb{Z}/4\\mathbb{Z}$ has zero divisors.",
                  "Incorrect: expand the product first.",
                  "Incorrect: the $x^2$ coefficient is $4\\equiv 0$."
                ],
                "hints": [
                  "Expand $(2x+1)^2$ over $\\mathbb{Z}$.",
                  "Then reduce each coefficient modulo $4$.",
                  "$4\\equiv 0$."
                ]
              },
              {
                "id": "m373k-u3-l02-ex4",
                "type": "mcq",
                "question": "Which statement about division with remainder in $\\mathbb{Z}[x]$ is true?",
                "options": [
                  "one can always divide $f$ by any nonzero $g$",
                  "one can divide $f$ by $g$ whenever $g$ is monic",
                  "one can divide only by constants",
                  "division never works in $\\mathbb{Z}[x]$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: dividing $x$ by $2x$ would need $q=\\tfrac12$.",
                  "Correct! The algorithm only needs to divide by the leading coefficient of $g$, which is $1$.",
                  "Incorrect: dividing by monic polynomials of any degree works.",
                  "Incorrect: it works for monic divisors."
                ],
                "hints": [
                  "What division does each step of the algorithm need?",
                  "Try dividing $x$ by $2x$ in $\\mathbb{Z}[x]$.",
                  "If the leading coefficient is $1$, nothing needs inverting."
                ]
              },
              {
                "id": "m373k-u3-l02-ex5",
                "type": "proof",
                "question": "Let $F$ be a field, $f\\in F[x]$ and $a\\in F$. Prove that $f(a)=0$ if and only if $x-a$ divides $f$.",
                "hints": [
                  "Divide $f$ by the monic polynomial $x-a$.",
                  "The remainder has degree less than $1$, so it is a constant $r$.",
                  "Substitute $x=a$."
                ],
                "rubric": [
                  "Write $f=(x-a)q+r$ with $r\\in F$.",
                  "Substitute $x=a$ to get $f(a)=r$.",
                  "($\\Rightarrow$) $f(a)=0$ gives $r=0$, so $f=(x-a)q$.",
                  "($\\Leftarrow$) If $f=(x-a)q$, then $f(a)=0\\cdot q(a)=0$."
                ],
                "modelProof": "Since $x-a$ is monic, division with remainder gives $f=(x-a)q+r$ with $\\deg r<1$, so $r$ is a constant. Substitution $x\\mapsto a$ is a ring homomorphism, so $f(a)=(a-a)q(a)+r=r$. If $f(a)=0$ then $r=0$ and $f=(x-a)q$. Conversely, if $f=(x-a)q$ then $f(a)=0\\cdot q(a)=0$. $\\blacksquare$"
              },
              {
                "id": "m373k-u3-l02-ex6",
                "type": "proof",
                "question": "Let $F$ be a field and $f\\in F[x]$ a nonzero polynomial of degree $n$. Prove that $f$ has at most $n$ roots in $F$.",
                "hints": [
                  "Induct on $n$.",
                  "If $f$ has a root $a$, write $f=(x-a)g$.",
                  "Show every other root of $f$ is a root of $g$."
                ],
                "rubric": [
                  "Base case: a nonzero constant has no roots.",
                  "If $a$ is a root, $f=(x-a)g$ with $\\deg g=n-1$.",
                  "If $b\\neq a$ is a root, $0=(b-a)g(b)$ and $b-a\\neq 0$, so $g(b)=0$.",
                  "Apply induction: $g$ has at most $n-1$ roots, so $f$ has at most $n$."
                ],
                "modelProof": "Induct on $n=\\deg f$. If $n=0$, $f$ is a nonzero constant and has no roots. Suppose $n\\ge 1$. If $f$ has no root we are done. Otherwise let $a$ be a root; then $f=(x-a)g$ with $\\deg g=n-1$ (degrees add over a field). If $b$ is a root with $b\\neq a$, then $0=f(b)=(b-a)g(b)$, and since $b-a\\neq 0$ in the field $F$, $g(b)=0$. So every root of $f$ is either $a$ or a root of $g$. By induction $g$ has at most $n-1$ roots, so $f$ has at most $n$. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u3-l03",
            "title": "Ring Homomorphisms and Ideals",
            "duration": "14:00",
            "videoUrl": "",
            "theorem": "Artin 11.3: A ring homomorphism $\\varphi:R\\to R'$ satisfies $\\varphi(a+b)=\\varphi(a)+\\varphi(b)$, $\\varphi(ab)=\\varphi(a)\\varphi(b)$, $\\varphi(1)=1$. Its kernel is an ideal: an additive subgroup $I$ with $ra\\in I$ for all $r\\in R$, $a\\in I$. Proposition 11.3.10: there is exactly one homomorphism $\\mathbb{Z}\\to R$. Every ideal of $\\mathbb{Z}$ and of $F[x]$ ($F$ a field) is principal.",
            "steps": [
              {
                "time": "00:00",
                "label": "Ring homomorphisms",
                "math": "\\varphi(a+b)=\\varphi(a)+\\varphi(b),\\quad \\varphi(ab)=\\varphi(a)\\varphi(b),\\quad \\varphi(1)=1",
                "caption": "Examples: $\\mathbb{Z}\\to\\mathbb{Z}/n\\mathbb{Z}$, complex conjugation $\\mathbb{C}\\to\\mathbb{C}$, and substitution $R[x]\\to R$, $f\\mapsto f(a)$."
              },
              {
                "time": "02:00",
                "label": "Substitution principle",
                "math": "\\varphi:R\\to R',\\ \\alpha\\in R'\\implies \\Phi:R[x]\\to R',\\quad \\textstyle\\sum a_ix^i\\mapsto\\sum\\varphi(a_i)\\alpha^i",
                "caption": "A homomorphism out of a polynomial ring is determined by where the coefficients go and where $x$ goes."
              },
              {
                "time": "04:00",
                "label": "The characteristic",
                "math": "\\mathbb{Z}\\to R,\\quad n\\mapsto n\\cdot 1=1+\\cdots+1",
                "caption": "This is the only homomorphism $\\mathbb{Z}\\to R$. Its kernel is $\\mathbb{Z}n$; $n$ (or $0$) is the characteristic of $R$. $\\mathbb{F}_p$ has characteristic $p$."
              },
              {
                "time": "06:00",
                "label": "Ideals",
                "math": "I\\subseteq R:\\ \\ a,b\\in I\\Rightarrow a+b\\in I,\\quad 0\\in I,\\quad r\\in R,\\ a\\in I\\Rightarrow ra\\in I",
                "caption": "The kernel of a ring homomorphism is an ideal: $\\varphi(ra)=\\varphi(r)\\cdot 0=0$. An ideal containing $1$, or any unit, is all of $R$."
              },
              {
                "time": "08:00",
                "label": "Principal ideals",
                "math": "(a)=aR=\\{ra: r\\in R\\},\\qquad (a_1,\\dots,a_n)=a_1R+\\cdots+a_nR",
                "caption": "$\\ker(\\mathbb{R}[x]\\to\\mathbb{C},\\ f\\mapsto f(i))=(x^2+1)$. In $\\mathbb{Z}[x]$, the ideal $(2,x)$ is not principal."
              },
              {
                "time": "10:00",
                "label": "Ideals of a field",
                "math": "F\\ \\text{field}:\\quad I=\\{0\\}\\ \\text{or}\\ I=F",
                "caption": "A nonzero $a\\in I$ is a unit, so $1=a^{-1}a\\in I$. Consequently every homomorphism from a field to a nonzero ring is injective."
              },
              {
                "time": "12:00",
                "label": "F[x] is a principal ideal ring",
                "math": "I\\neq 0\\implies I=(g),\\quad g\\ \\text{of least degree in } I",
                "caption": "Same proof as Theorem 2.3.3, with division of polynomials in place of division of integers."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u3-l03-ex1",
                "type": "mcq",
                "question": "What is the kernel of $\\varphi:\\mathbb{R}[x]\\to\\mathbb{C}$, $f\\mapsto f(i)$?",
                "options": [
                  "$(x-i)$",
                  "$(x^2+1)$",
                  "$(x^2-1)$",
                  "$\\{0\\}$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $x-i$ is not in $\\mathbb{R}[x]$.",
                  "Correct! A real polynomial with root $i$ also has root $-i$, so it is divisible by $(x-i)(x+i)=x^2+1$.",
                  "Incorrect: $i^2-1=-2\\neq 0$.",
                  "Incorrect: $x^2+1$ is a nonzero element of the kernel."
                ],
                "hints": [
                  "Which real polynomials vanish at $i$?",
                  "Complex conjugation fixes real coefficients.",
                  "The kernel is principal, generated by a polynomial of least degree."
                ]
              },
              {
                "id": "m373k-u3-l03-ex2",
                "type": "mcq",
                "question": "What is the characteristic of $\\mathbb{Z}/6\\mathbb{Z}$?",
                "options": [
                  "$0$",
                  "$2$",
                  "$3$",
                  "$6$"
                ],
                "correctIndex": 3,
                "optionExplanations": [
                  "Incorrect: $6\\cdot\\bar1=\\bar0$.",
                  "Incorrect: $2\\cdot\\bar1=\\bar2\\neq\\bar0$.",
                  "Incorrect: $3\\cdot\\bar1=\\bar3\\neq\\bar0$.",
                  "Correct! The kernel of $\\mathbb{Z}\\to\\mathbb{Z}/6\\mathbb{Z}$ is $\\mathbb{Z}6$."
                ],
                "hints": [
                  "The characteristic generates the kernel of $\\mathbb{Z}\\to R$.",
                  "Find the least $n>0$ with $n\\cdot\\bar1=\\bar0$.",
                  "The order of $\\bar1$ in the additive group is $6$."
                ]
              },
              {
                "id": "m373k-u3-l03-ex3",
                "type": "mcq",
                "question": "Which subset of $\\mathbb{Z}$ is an ideal?",
                "options": [
                  "$\\{0,\\pm1\\}$",
                  "the even integers",
                  "the positive integers",
                  "the odd integers"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $1+1=2$ is not in the set.",
                  "Correct! It is $(2)=2\\mathbb{Z}$: closed under addition, and $r\\cdot 2k$ is even.",
                  "Incorrect: it is not closed under negatives, and $0\\notin$.",
                  "Incorrect: $1+1=2$ is not odd, and $0$ is missing."
                ],
                "hints": [
                  "An ideal is an additive subgroup closed under multiplication by $R$.",
                  "Ideals of $\\mathbb{Z}$ are the subgroups $\\mathbb{Z}n$.",
                  "Which option is of the form $n\\mathbb{Z}$?"
                ]
              },
              {
                "id": "m373k-u3-l03-ex4",
                "type": "mcq",
                "question": "Let $\\varphi:F\\to R$ be a ring homomorphism from a field $F$ to a ring $R$ with $1\\neq 0$. Then $\\varphi$ is",
                "options": [
                  "surjective",
                  "injective",
                  "zero",
                  "an isomorphism"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: the inclusion $\\mathbb{Q}\\subset\\mathbb{R}$ is not surjective.",
                  "Correct! $\\ker\\varphi$ is an ideal of $F$, so it is $\\{0\\}$ or $F$; it is not $F$ because $\\varphi(1)=1\\neq 0$.",
                  "Incorrect: $\\varphi(1)=1\\neq 0$.",
                  "Incorrect: injective but not necessarily surjective."
                ],
                "hints": [
                  "The kernel is an ideal of $F$.",
                  "A field has only two ideals.",
                  "Could the kernel contain $1$?"
                ]
              },
              {
                "id": "m373k-u3-l03-ex5",
                "type": "proof",
                "question": "Let $\\varphi:R\\to R'$ be a ring homomorphism. Prove that $\\ker\\varphi$ is an ideal of $R$.",
                "hints": [
                  "It is an additive subgroup because $\\varphi$ is a homomorphism of additive groups.",
                  "For $r\\in R$ and $a\\in\\ker\\varphi$, compute $\\varphi(ra)$.",
                  "Use $\\varphi(r)\\cdot 0=0$ in $R'$."
                ],
                "rubric": [
                  "Show $\\ker\\varphi$ is closed under addition and negatives, and contains $0$.",
                  "Take $r\\in R$, $a\\in\\ker\\varphi$.",
                  "Compute $\\varphi(ra)=\\varphi(r)\\varphi(a)=\\varphi(r)0=0$.",
                  "Conclude $ra\\in\\ker\\varphi$."
                ],
                "modelProof": "Since $\\varphi$ is a homomorphism of additive groups, its kernel $K=\\{a:\\varphi(a)=0\\}$ is an additive subgroup of $R$: $\\varphi(0)=0$, $\\varphi(a+b)=0+0=0$, and $\\varphi(-a)=-\\varphi(a)=0$ for $a,b\\in K$. If $r\\in R$ and $a\\in K$, then $\\varphi(ra)=\\varphi(r)\\varphi(a)=\\varphi(r)\\cdot 0=0$, so $ra\\in K$. Hence $K$ is an ideal. $\\blacksquare$"
              },
              {
                "id": "m373k-u3-l03-ex6",
                "type": "proof",
                "question": "Let $F$ be a field. Prove that every ideal $I$ of $F[x]$ is principal.",
                "hints": [
                  "If $I=\\{0\\}$, then $I=(0)$.",
                  "Otherwise choose $g\\in I$ nonzero of least degree.",
                  "Divide any $f\\in I$ by $g$ and look at the remainder."
                ],
                "rubric": [
                  "Handle $I=\\{0\\}$.",
                  "Pick nonzero $g\\in I$ of minimal degree; note $(g)\\subseteq I$.",
                  "For $f\\in I$, write $f=gq+r$ with $r=0$ or $\\deg r<\\deg g$, and show $r\\in I$.",
                  "Conclude $r=0$ by minimality, so $f\\in(g)$."
                ],
                "modelProof": "If $I=\\{0\\}$ then $I=(0)$. Otherwise let $g$ be a nonzero element of $I$ of least degree. Since $I$ is an ideal, $(g)=\\{qg\\}\\subseteq I$. Let $f\\in I$. Since $F$ is a field, we may divide by $g$: $f=gq+r$ with $r=0$ or $\\deg r<\\deg g$. Then $r=f-gq\\in I$. By minimality of $\\deg g$, $r$ cannot be a nonzero element of smaller degree, so $r=0$ and $f=gq\\in(g)$. Thus $I=(g)$. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u3-l04",
            "title": "Quotient Rings",
            "duration": "13:00",
            "videoUrl": "",
            "theorem": "Artin 11.4: If $I$ is an ideal of $R$, the cosets $\\bar a=a+I$ form a ring $\\bar R=R/I$ with $\\bar a+\\bar b=\\overline{a+b}$ and $\\bar a\\,\\bar b=\\overline{ab}$, and $\\pi:R\\to R/I$ is a surjective homomorphism with kernel $I$. First Isomorphism Theorem: if $\\varphi:R\\to R'$ is surjective with kernel $I$, then $R/I\\approx R'$. Correspondence: ideals of $R/I$ correspond to ideals of $R$ containing $I$.",
            "steps": [
              {
                "time": "00:00",
                "label": "Cosets of an ideal",
                "math": "\\bar a=a+I,\\qquad \\bar a=\\bar b\\iff a-b\\in I",
                "caption": "$(R,+)$ is abelian, so $I$ is a normal subgroup and $R/I$ is already an additive group."
              },
              {
                "time": "02:00",
                "label": "Multiplication is well defined",
                "math": "(a+u)(b+v)=ab+(av+ub+uv),\\quad u,v\\in I",
                "caption": "The extra terms lie in $I$ because $I$ absorbs multiplication by $R$. This is exactly why ideals, not just subrings, are needed."
              },
              {
                "time": "04:00",
                "label": "First Isomorphism Theorem",
                "math": "\\bar\\varphi:R/\\ker\\varphi\\xrightarrow{\\ \\sim\\ }\\operatorname{im}\\varphi,\\qquad \\bar a\\mapsto\\varphi(a)",
                "caption": "The ring version of Theorem 2.12.10: the group isomorphism also respects multiplication."
              },
              {
                "time": "06:00",
                "label": "Example: the complex numbers",
                "math": "\\mathbb{R}[x]/(x^2+1)\\approx\\mathbb{C},\\qquad \\bar x\\mapsto i",
                "caption": "Substitution $x\\mapsto i$ is surjective with kernel $(x^2+1)$. In the quotient, $\\bar x^2=-1$."
              },
              {
                "time": "08:00",
                "label": "Killing a variable",
                "math": "R[x]/(x-a)\\approx R,\\qquad \\mathbb{Z}[x]/(2,x)\\approx\\mathbb{F}_2",
                "caption": "Setting $x=a$ is the substitution map, whose kernel is $(x-a)$. Then reducing coefficients mod $2$ kills $2$."
              },
              {
                "time": "10:00",
                "label": "Correspondence Theorem for rings",
                "math": "\\{J: I\\subseteq J\\subseteq R\\}\\longleftrightarrow\\{\\text{ideals of } R/I\\}",
                "caption": "$J\\mapsto J/I$. For example, the ideals of $\\mathbb{Z}/12\\mathbb{Z}$ correspond to divisors of $12$."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u3-l04-ex1",
                "type": "mcq",
                "question": "Which ring is isomorphic to $\\mathbb{Z}[x]/(x)$?",
                "options": [
                  "$\\mathbb{Z}[x]$",
                  "$\\mathbb{Z}$",
                  "$\\mathbb{Q}$",
                  "$\\mathbb{Z}/2\\mathbb{Z}$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $x$ becomes $0$ in the quotient.",
                  "Correct! $f\\mapsto f(0)$ is surjective onto $\\mathbb{Z}$ with kernel $(x)$.",
                  "Incorrect: the image of substitution $x\\mapsto 0$ is $\\mathbb{Z}$, not $\\mathbb{Q}$.",
                  "Incorrect: that would be $\\mathbb{Z}[x]/(2,x)$."
                ],
                "hints": [
                  "Use the First Isomorphism Theorem.",
                  "Find a surjection $\\mathbb{Z}[x]\\to ?$ with kernel $(x)$.",
                  "Set $x=0$."
                ]
              },
              {
                "id": "m373k-u3-l04-ex2",
                "type": "mcq",
                "question": "In $\\mathbb{Q}[x]/(x^2-2)$, what is $\\bar x^3$?",
                "options": [
                  "$\\bar 8$",
                  "$2\\bar x$",
                  "$\\bar 2$",
                  "$\\bar x$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $\\bar x$ is not $2$.",
                  "Correct! $\\bar x^2=\\bar 2$, so $\\bar x^3=\\bar 2\\bar x$. The quotient is $\\mathbb{Q}(\\sqrt2)$ with $\\bar x=\\sqrt2$.",
                  "Incorrect: that is $\\bar x^2$.",
                  "Incorrect: $\\bar x^3=\\bar x$ would need $\\bar x^2=\\bar 1$."
                ],
                "hints": [
                  "In the quotient, $x^2-2=0$.",
                  "So $\\bar x^2=\\bar 2$.",
                  "Multiply by $\\bar x$."
                ]
              },
              {
                "id": "m373k-u3-l04-ex3",
                "type": "mcq",
                "question": "Why must we divide by an ideal, rather than any subring, to form a quotient ring?",
                "options": [
                  "so that addition of cosets is well defined",
                  "so that multiplication of cosets is well defined",
                  "so that the quotient is a field",
                  "there is no reason"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: addition is well defined for any additive subgroup, since $(R,+)$ is abelian.",
                  "Correct! $(a+u)(b+v)-ab=av+ub+uv$ must lie in $I$, which requires $I$ to absorb multiplication by $R$.",
                  "Incorrect: quotients by ideals are rarely fields.",
                  "Incorrect: for a subring like $\\mathbb{Z}\\subset\\mathbb{Q}$, products of cosets are not well defined."
                ],
                "hints": [
                  "Expand $(a+u)(b+v)$ with $u,v\\in I$.",
                  "Which terms must lie in $I$?",
                  "$av$ with $a\\in R$ arbitrary."
                ]
              },
              {
                "id": "m373k-u3-l04-ex4",
                "type": "mcq",
                "question": "How many ideals does $\\mathbb{Z}/12\\mathbb{Z}$ have?",
                "options": [
                  "$2$",
                  "$4$",
                  "$6$",
                  "$12$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: $\\mathbb{Z}/12\\mathbb{Z}$ is not a field.",
                  "Incorrect: count divisors of $12$.",
                  "Correct! They correspond to ideals $(d)\\supseteq(12)$ of $\\mathbb{Z}$, i.e. $d\\in\\{1,2,3,4,6,12\\}$.",
                  "Incorrect: that is the number of elements."
                ],
                "hints": [
                  "Use the Correspondence Theorem for $\\mathbb{Z}\\to\\mathbb{Z}/12\\mathbb{Z}$.",
                  "Ideals of $\\mathbb{Z}$ are $(d)$.",
                  "$(12)\\subseteq(d)$ iff $d\\mid 12$."
                ]
              },
              {
                "id": "m373k-u3-l04-ex5",
                "type": "proof",
                "question": "Let $I$ be an ideal of $R$. Prove that multiplication of cosets, $\\bar a\\,\\bar b=\\overline{ab}$, is well defined on $R/I$.",
                "hints": [
                  "Suppose $\\bar a=\\bar a'$ and $\\bar b=\\bar b'$.",
                  "Write $a'=a+u$, $b'=b+v$ with $u,v\\in I$.",
                  "Expand $a'b'$."
                ],
                "rubric": [
                  "Write $a'=a+u$ and $b'=b+v$ with $u,v\\in I$.",
                  "Expand $a'b'=ab+av+ub+uv$.",
                  "Show $av,ub,uv\\in I$ using the ideal property.",
                  "Conclude $a'b'-ab\\in I$, so $\\overline{a'b'}=\\overline{ab}$."
                ],
                "modelProof": "Suppose $\\bar a=\\bar a'$ and $\\bar b=\\bar b'$, so $a'=a+u$ and $b'=b+v$ with $u,v\\in I$. Then $a'b'=ab+av+ub+uv$. Since $I$ is an ideal, $av\\in I$, $ub=bu\\in I$ and $uv\\in I$, and their sum is in $I$. Hence $a'b'-ab\\in I$, so $\\overline{a'b'}=\\overline{ab}$. The product does not depend on the representatives. $\\blacksquare$"
              },
              {
                "id": "m373k-u3-l04-ex6",
                "type": "proof",
                "question": "Prove that $\\mathbb{R}[x]/(x^2+1)$ is isomorphic to $\\mathbb{C}$.",
                "hints": [
                  "Use the substitution homomorphism $\\varphi(f)=f(i)$.",
                  "Show $\\varphi$ is surjective.",
                  "Show $\\ker\\varphi=(x^2+1)$ and apply the First Isomorphism Theorem."
                ],
                "rubric": [
                  "Define $\\varphi:\\mathbb{R}[x]\\to\\mathbb{C}$, $f\\mapsto f(i)$, a ring homomorphism.",
                  "Surjective: $a+bx\\mapsto a+bi$.",
                  "Kernel: divide $f$ by $x^2+1$ to get $f=(x^2+1)q+(a+bx)$; then $f(i)=a+bi=0$ forces $a=b=0$.",
                  "Apply the First Isomorphism Theorem."
                ],
                "modelProof": "Let $\\varphi:\\mathbb{R}[x]\\to\\mathbb{C}$ be the substitution $f\\mapsto f(i)$, a ring homomorphism. It is surjective, since $\\varphi(a+bx)=a+bi$. Clearly $x^2+1\\in\\ker\\varphi$, so $(x^2+1)\\subseteq\\ker\\varphi$. Conversely, let $f\\in\\ker\\varphi$. Dividing by the monic $x^2+1$ gives $f=(x^2+1)q+(a+bx)$ with $a,b\\in\\mathbb{R}$. Then $0=f(i)=a+bi$, so $a=b=0$ and $f\\in(x^2+1)$. Hence $\\ker\\varphi=(x^2+1)$, and by the First Isomorphism Theorem $\\mathbb{R}[x]/(x^2+1)\\approx\\mathbb{C}$. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u3-l05",
            "title": "Adjoining Elements",
            "duration": "12:00",
            "videoUrl": "",
            "theorem": "Artin 11.5: To adjoin to $R$ an element $\\alpha$ satisfying $f(\\alpha)=0$, form $R'=R[x]/(f)$ and let $\\alpha=\\bar x$. Proposition 11.5.5: if $f$ is monic of degree $n$, every element of $R'$ is uniquely $c_0+c_1\\alpha+\\cdots+c_{n-1}\\alpha^{n-1}$ with $c_i\\in R$. Adjoining an inverse of $s$ gives $R[x]/(sx-1)$.",
            "steps": [
              {
                "time": "00:00",
                "label": "The construction",
                "math": "R'=R[x]/(f),\\qquad \\alpha=\\bar x,\\qquad f(\\alpha)=0",
                "caption": "This builds a ring in which $f$ has a root, even if no such element existed before."
              },
              {
                "time": "02:00",
                "label": "A basis for R'",
                "math": "R'=\\{c_0+c_1\\alpha+\\cdots+c_{n-1}\\alpha^{n-1}\\}\\quad(f\\ \\text{monic},\\ \\deg f=n)",
                "caption": "Divide any polynomial by $f$: the remainder has degree $<n$ and represents the same coset. Uniqueness: two remainders differing by a multiple of $f$ must be equal."
              },
              {
                "time": "04:00",
                "label": "Example: Z[sqrt(-5)]",
                "math": "\\mathbb{Z}[x]/(x^2+5)\\approx\\mathbb{Z}[\\sqrt{-5}]=\\{a+b\\sqrt{-5}\\}",
                "caption": "Multiplication uses $\\alpha^2=-5$: $(a+b\\alpha)(c+d\\alpha)=(ac-5bd)+(ad+bc)\\alpha$."
              },
              {
                "time": "06:00",
                "label": "Abstract square roots",
                "math": "\\mathbb{F}_5[x]/(x^2-3):\\quad \\alpha^2=3",
                "caption": "$3$ is not a square mod $5$, so this ring has $25$ elements and is in fact a field."
              },
              {
                "time": "08:00",
                "label": "Adjoining an inverse",
                "math": "R[x]/(sx-1):\\quad \\bar s\\,\\bar x=1",
                "caption": "$\\mathbb{Z}[x]/(2x-1)\\approx\\mathbb{Z}[\\tfrac12]$, the rationals with denominator a power of $2$. If $s$ is a zero divisor, the result can collapse."
              },
              {
                "time": "10:00",
                "label": "When the ring collapses",
                "math": "st=0,\\ s\\bar x=1\\implies t=t(s\\bar x)=(ts)\\bar x=0",
                "caption": "Adjoining an inverse of a zero divisor kills the elements it annihilates. In $(\\mathbb{Z}/4\\mathbb{Z})[x]/(2x-1)$, $2\\cdot 2=0$ forces $2=0$, and then $1=2\\bar x=0$: the zero ring."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u3-l05-ex1",
                "type": "mcq",
                "question": "In $R'=\\mathbb{Z}[x]/(x^2+5)$ with $\\alpha=\\bar x$, compute $(1+\\alpha)(2-\\alpha)$.",
                "options": [
                  "$2-\\alpha^2$",
                  "$7+\\alpha$",
                  "$-3+\\alpha$",
                  "$7-\\alpha$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: expand fully and reduce with $\\alpha^2=-5$.",
                  "Correct! $(1+\\alpha)(2-\\alpha)=2+\\alpha-\\alpha^2=2+\\alpha+5=7+\\alpha$.",
                  "Incorrect: $-\\alpha^2=+5$, not $-5$.",
                  "Incorrect: the cross terms give $+2\\alpha-\\alpha=+\\alpha$."
                ],
                "hints": [
                  "Expand the product.",
                  "Replace $\\alpha^2$ by $-5$.",
                  "$-\\alpha^2=5$."
                ]
              },
              {
                "id": "m373k-u3-l05-ex2",
                "type": "mcq",
                "question": "How many elements does $\\mathbb{F}_2[x]/(x^3+x+1)$ have?",
                "options": [
                  "$3$",
                  "$6$",
                  "$8$",
                  "$9$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: count polynomials of degree $<3$ over $\\mathbb{F}_2$.",
                  "Incorrect: each of the $3$ coefficients has $2$ choices.",
                  "Correct! Each element is uniquely $c_0+c_1\\alpha+c_2\\alpha^2$ with $c_i\\in\\mathbb{F}_2$: $2^3=8$.",
                  "Incorrect: the coefficients lie in $\\mathbb{F}_2$, not $\\mathbb{F}_3$."
                ],
                "hints": [
                  "Use Proposition 11.5.5.",
                  "The basis is $1,\\alpha,\\alpha^2$.",
                  "Count the choices of $(c_0,c_1,c_2)$."
                ]
              },
              {
                "id": "m373k-u3-l05-ex3",
                "type": "mcq",
                "question": "What is $\\mathbb{Z}[x]/(2x-1)$ isomorphic to?",
                "options": [
                  "$\\mathbb{Z}$",
                  "$\\mathbb{Q}$",
                  "$\\mathbb{Z}[\\tfrac12]=\\{a/2^k: a\\in\\mathbb{Z},\\ k\\ge0\\}$",
                  "the zero ring"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: $2$ becomes a unit, but $2$ is not a unit in $\\mathbb{Z}$.",
                  "Incorrect: $3$ does not become a unit.",
                  "Correct! $f\\mapsto f(\\tfrac12)$ is surjective onto $\\mathbb{Z}[\\tfrac12]$ with kernel $(2x-1)$.",
                  "Incorrect: $2$ is not a zero divisor in $\\mathbb{Z}$, so nothing collapses."
                ],
                "hints": [
                  "In the quotient, $2\\bar x=1$.",
                  "Substitute $x=\\tfrac12$.",
                  "Which rationals are polynomials in $\\tfrac12$ with integer coefficients?"
                ]
              },
              {
                "id": "m373k-u3-l05-ex4",
                "type": "mcq",
                "question": "In $R'=\\mathbb{Q}[x]/(x^3-2)$, $\\alpha=\\bar x$. Which expression is in normal form $c_0+c_1\\alpha+c_2\\alpha^2$ for $\\alpha^4$?",
                "options": [
                  "$2\\alpha$",
                  "$16$",
                  "$\\alpha$",
                  "$2+\\alpha$"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! $\\alpha^3=2$, so $\\alpha^4=\\alpha\\cdot\\alpha^3=2\\alpha$.",
                  "Incorrect: $\\alpha$ is not $2$.",
                  "Incorrect: that would need $\\alpha^3=1$.",
                  "Incorrect: $\\alpha^4=\\alpha^3\\cdot\\alpha$, a product, not a sum."
                ],
                "hints": [
                  "In $R'$, $\\alpha^3=2$.",
                  "Write $\\alpha^4=\\alpha^3\\alpha$.",
                  "Substitute."
                ]
              },
              {
                "id": "m373k-u3-l05-ex5",
                "type": "proof",
                "question": "(Proposition 11.5.5) Let $f\\in R[x]$ be monic of degree $n$ and $R'=R[x]/(f)$, $\\alpha=\\bar x$. Prove that every element of $R'$ can be written uniquely as $c_0+c_1\\alpha+\\cdots+c_{n-1}\\alpha^{n-1}$ with $c_i\\in R$.",
                "hints": [
                  "Existence: divide a representative $g$ by $f$.",
                  "Uniqueness: if two such expressions are equal, their difference is a multiple of $f$.",
                  "Compare degrees."
                ],
                "rubric": [
                  "Existence: write $g=fq+r$ with $\\deg r<n$; then $\\bar g=\\bar r=r(\\alpha)$.",
                  "Uniqueness: suppose $r(\\alpha)=s(\\alpha)$ with $\\deg r,\\deg s<n$; then $r-s\\in(f)$.",
                  "Write $r-s=fh$; if $h\\neq 0$, the leading coefficient of $fh$ is that of $h$ (since $f$ is monic), so $\\deg(fh)\\ge n$.",
                  "Conclude $h=0$ and $r=s$."
                ],
                "modelProof": "Existence: any element of $R'$ is $\\bar g$ for some $g\\in R[x]$. Since $f$ is monic, $g=fq+r$ with $r=0$ or $\\deg r<n$. Then $\\bar g=\\bar r=c_0+c_1\\alpha+\\cdots+c_{n-1}\\alpha^{n-1}$, where $r=\\sum c_ix^i$. Uniqueness: if $r(\\alpha)=s(\\alpha)$ with $r,s$ of degree $<n$, then $r-s\\in(f)$, say $r-s=fh$. If $h\\neq 0$ with leading coefficient $b$ in degree $m$, then since $f$ is monic, $fh$ has leading coefficient $b\\neq 0$ in degree $n+m\\ge n$. But $\\deg(r-s)<n$. Hence $h=0$, $r=s$, and the coefficients agree. $\\blacksquare$"
              },
              {
                "id": "m373k-u3-l05-ex6",
                "type": "proof",
                "question": "Let $R$ be a ring and $s,t\\in R$ with $st=0$. Prove that in $R'=R[x]/(sx-1)$, the image of $t$ is $0$.",
                "hints": [
                  "In $R'$, $\\bar s\\,\\bar x=1$.",
                  "Multiply $\\bar t$ by $1=\\bar s\\bar x$.",
                  "Use $\\bar t\\,\\bar s=\\overline{ts}=0$."
                ],
                "rubric": [
                  "Note $\\bar s\\bar x=\\overline{sx}=\\bar 1$ in $R'$.",
                  "Write $\\bar t=\\bar t\\cdot\\bar1=\\bar t\\,\\bar s\\,\\bar x$.",
                  "Use $\\bar t\\bar s=\\overline{ts}=\\bar 0$.",
                  "Conclude $\\bar t=\\bar0$."
                ],
                "modelProof": "In $R'$ we have $\\overline{sx-1}=0$, so $\\bar s\\bar x=\\bar1$. Then $\\bar t=\\bar t\\cdot\\bar 1=\\bar t(\\bar s\\bar x)=(\\overline{ts})\\bar x=\\bar 0\\cdot\\bar x=\\bar0$, because $ts=st=0$. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u3-l06",
            "title": "Product Rings and the Chinese Remainder Theorem",
            "duration": "12:00",
            "videoUrl": "",
            "theorem": "Artin 11.6: The product ring $R\\times R'$ has componentwise operations, with idempotents $e=(1,0)$, $e'=(0,1)$ satisfying $e^2=e$, $ee'=0$, $e+e'=1$. Conversely, an idempotent $e$ in $R$ gives $R\\approx eR\\times(1-e)R$. Chinese Remainder Theorem: if $\\gcd(m,n)=1$, then $\\mathbb{Z}/mn\\mathbb{Z}\\approx\\mathbb{Z}/m\\mathbb{Z}\\times\\mathbb{Z}/n\\mathbb{Z}$.",
            "steps": [
              {
                "time": "00:00",
                "label": "Product rings",
                "math": "(a,a')+(b,b')=(a+b,\\ a'+b'),\\qquad (a,a')(b,b')=(ab,\\ a'b')",
                "caption": "The identity is $(1,1)$. A product ring always has zero divisors: $(1,0)(0,1)=(0,0)$."
              },
              {
                "time": "02:00",
                "label": "Idempotents",
                "math": "e^2=e,\\qquad e'=1-e,\\qquad ee'=0",
                "caption": "$e=(1,0)$ and $e'=(0,1)$ in $R\\times R'$. In $\\mathbb{Z}/6\\mathbb{Z}$, $\\bar3^2=\\bar9=\\bar3$ and $\\bar4^2=\\overline{16}=\\bar4$ are idempotents."
              },
              {
                "time": "04:00",
                "label": "Splitting a ring",
                "math": "R\\approx R/(e')\\times R/(e)",
                "caption": "An idempotent $e\\neq 0,1$ splits $R$ into a product (Proposition 11.6.2)."
              },
              {
                "time": "06:00",
                "label": "Chinese Remainder Theorem",
                "math": "\\gcd(m,n)=1\\implies\\mathbb{Z}/mn\\mathbb{Z}\\xrightarrow{\\ \\sim\\ }\\mathbb{Z}/m\\mathbb{Z}\\times\\mathbb{Z}/n\\mathbb{Z}",
                "caption": "$a\\mapsto(a\\bmod m,\\ a\\bmod n)$ has kernel $(m)\\cap(n)=(mn)$, so it is injective, and both sides have $mn$ elements."
              },
              {
                "time": "08:00",
                "label": "Solving simultaneous congruences",
                "math": "x\\equiv 2\\pmod 3,\\quad x\\equiv 3\\pmod 5\\implies x\\equiv 8\\pmod{15}",
                "caption": "Using $1=2\\cdot 3-5$: $x=2\\cdot(-5)+3\\cdot 6=8$. The elements $-5\\equiv 10$ and $6$ are the idempotents of $\\mathbb{Z}/15\\mathbb{Z}$."
              },
              {
                "time": "10:00",
                "label": "Units of a product",
                "math": "(R\\times R')^\\times=R^\\times\\times R'^\\times",
                "caption": "So $|(\\mathbb{Z}/mn\\mathbb{Z})^\\times|=|(\\mathbb{Z}/m\\mathbb{Z})^\\times|\\cdot|(\\mathbb{Z}/n\\mathbb{Z})^\\times|$ when $\\gcd(m,n)=1$: Euler's $\\varphi$ is multiplicative."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u3-l06-ex1",
                "type": "mcq",
                "question": "Find $x$ with $0\\le x<15$, $x\\equiv 1\\pmod 3$ and $x\\equiv 4\\pmod 5$.",
                "options": [
                  "$4$",
                  "$7$",
                  "$13$",
                  "$14$"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! $4\\equiv 1\\pmod 3$ and $4\\equiv 4\\pmod 5$.",
                  "Incorrect: $7\\equiv 2\\pmod 5$.",
                  "Incorrect: $13\\equiv 3\\pmod 5$.",
                  "Incorrect: $14\\equiv 2\\pmod 3$."
                ],
                "hints": [
                  "List the numbers $\\equiv 4\\pmod 5$ below $15$: $4,9,14$.",
                  "Check which is $\\equiv 1\\pmod 3$.",
                  "The answer is unique by the Chinese Remainder Theorem."
                ]
              },
              {
                "id": "m373k-u3-l06-ex2",
                "type": "mcq",
                "question": "Is $\\mathbb{Z}/4\\mathbb{Z}$ isomorphic to $\\mathbb{Z}/2\\mathbb{Z}\\times\\mathbb{Z}/2\\mathbb{Z}$ as rings?",
                "options": [
                  "yes, by the Chinese Remainder Theorem",
                  "no: $\\gcd(2,2)\\neq 1$, and $\\mathbb{Z}/2\\times\\mathbb{Z}/2$ has characteristic $2$ while $\\mathbb{Z}/4$ has characteristic $4$",
                  "yes, both have four elements",
                  "no, because $\\mathbb{Z}/4\\mathbb{Z}$ is a field"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: the theorem requires coprime moduli.",
                  "Correct! Isomorphic rings have the same characteristic. In $\\mathbb{Z}/2\\times\\mathbb{Z}/2$, $1+1=0$; in $\\mathbb{Z}/4$, $1+1\\neq 0$.",
                  "Incorrect: equal size is not enough.",
                  "Incorrect: $\\bar2$ is a zero divisor in $\\mathbb{Z}/4\\mathbb{Z}$."
                ],
                "hints": [
                  "Compare $1+1$ in both rings.",
                  "Isomorphisms send $1$ to $1$.",
                  "CRT needs $\\gcd(m,n)=1$."
                ]
              },
              {
                "id": "m373k-u3-l06-ex3",
                "type": "mcq",
                "question": "Which elements of $\\mathbb{Z}/6\\mathbb{Z}$ are idempotent?",
                "options": [
                  "$\\bar0,\\bar1$",
                  "$\\bar0,\\bar1,\\bar3,\\bar4$",
                  "$\\bar1,\\bar5$",
                  "all of them"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: also check $\\bar3$ and $\\bar4$.",
                  "Correct! $\\bar3^2=\\bar9=\\bar3$ and $\\bar4^2=\\overline{16}=\\bar4$. They correspond to $(1,0)$ and $(0,1)$ in $\\mathbb{Z}/2\\times\\mathbb{Z}/3$.",
                  "Incorrect: $\\bar5^2=\\overline{25}=\\bar1\\neq\\bar5$.",
                  "Incorrect: $\\bar2^2=\\bar4\\neq\\bar2$."
                ],
                "hints": [
                  "Square each element.",
                  "$\\mathbb{Z}/6\\mathbb{Z}\\approx\\mathbb{Z}/2\\times\\mathbb{Z}/3$.",
                  "A product of two rings has idempotents $(0,0),(1,1),(1,0),(0,1)$."
                ]
              },
              {
                "id": "m373k-u3-l06-ex4",
                "type": "mcq",
                "question": "How many units does $\\mathbb{Z}/35\\mathbb{Z}$ have?",
                "options": [
                  "$12$",
                  "$24$",
                  "$34$",
                  "$35$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $|(\\mathbb{Z}/5)^\\times|\\cdot|(\\mathbb{Z}/7)^\\times|=4\\cdot 6$.",
                  "Correct! By CRT, $(\\mathbb{Z}/35)^\\times\\approx(\\mathbb{Z}/5)^\\times\\times(\\mathbb{Z}/7)^\\times$, which has $4\\cdot 6=24$ elements.",
                  "Incorrect: $\\mathbb{Z}/35\\mathbb{Z}$ is not a field; multiples of $5$ and $7$ are not units.",
                  "Incorrect: $\\bar 0$ is not a unit."
                ],
                "hints": [
                  "Use the Chinese Remainder Theorem.",
                  "Units of a product are products of units.",
                  "$\\mathbb{Z}/p\\mathbb{Z}$ has $p-1$ units."
                ]
              },
              {
                "id": "m373k-u3-l06-ex5",
                "type": "proof",
                "question": "(Chinese Remainder Theorem) Let $m,n$ be relatively prime positive integers. Prove that $\\varphi:\\mathbb{Z}/mn\\mathbb{Z}\\to\\mathbb{Z}/m\\mathbb{Z}\\times\\mathbb{Z}/n\\mathbb{Z}$, $\\bar a\\mapsto(a\\bmod m,\\ a\\bmod n)$, is a ring isomorphism.",
                "hints": [
                  "First show $a\\mapsto(a\\bmod m,a\\bmod n)$ is a ring homomorphism from $\\mathbb{Z}$ and find its kernel.",
                  "Use $\\gcd(m,n)=1$ to identify the kernel with $(mn)$.",
                  "Count elements."
                ],
                "rubric": [
                  "Define $\\psi:\\mathbb{Z}\\to\\mathbb{Z}/m\\times\\mathbb{Z}/n$; it is a homomorphism because each coordinate is.",
                  "Show $\\ker\\psi=(m)\\cap(n)=(mn)$, using $\\gcd(m,n)=1$.",
                  "Apply the First Isomorphism Theorem to get an injective $\\varphi$ from $\\mathbb{Z}/mn\\mathbb{Z}$.",
                  "Conclude surjectivity since both sides have $mn$ elements."
                ],
                "modelProof": "Let $\\psi:\\mathbb{Z}\\to\\mathbb{Z}/m\\mathbb{Z}\\times\\mathbb{Z}/n\\mathbb{Z}$, $\\psi(a)=(a\\bmod m,a\\bmod n)$. Each coordinate is a ring homomorphism, so $\\psi$ is one. Its kernel is the set of $a$ divisible by both $m$ and $n$, i.e. $(m)\\cap(n)=(\\operatorname{lcm}(m,n))=(mn)$, since $\\gcd(m,n)=1$. By the First Isomorphism Theorem, $\\psi$ induces an injective homomorphism $\\varphi:\\mathbb{Z}/mn\\mathbb{Z}\\to\\mathbb{Z}/m\\mathbb{Z}\\times\\mathbb{Z}/n\\mathbb{Z}$, $\\bar a\\mapsto\\psi(a)$. Both rings have $mn$ elements, so $\\varphi$ is also surjective, hence an isomorphism. $\\blacksquare$"
              },
              {
                "id": "m373k-u3-l06-ex6",
                "type": "proof",
                "question": "Let $e$ be an idempotent of a ring $R$ and $e'=1-e$. Prove that $e'$ is idempotent and $ee'=0$.",
                "hints": [
                  "Expand $(1-e)^2$.",
                  "Use $e^2=e$.",
                  "Expand $e(1-e)$."
                ],
                "rubric": [
                  "Compute $e'^2=1-2e+e^2$.",
                  "Substitute $e^2=e$ to get $e'^2=1-e=e'$.",
                  "Compute $ee'=e-e^2=e-e=0$."
                ],
                "modelProof": "We have $e'^2=(1-e)^2=1-2e+e^2=1-2e+e=1-e=e'$, so $e'$ is idempotent. Also $ee'=e(1-e)=e-e^2=e-e=0$. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u3-l07",
            "title": "Integral Domains and Fraction Fields",
            "duration": "12:00",
            "videoUrl": "",
            "theorem": "Artin 11.7: An integral domain is a nonzero ring with no zero divisors; in a domain, $ab=ac$ and $a\\neq 0$ imply $b=c$. Every finite domain is a field. Theorem 11.7.2: every domain $R$ embeds in its field of fractions $F$, consisting of classes of $a/b$ ($b\\neq 0$) with $a/b=c/d$ iff $ad=bc$.",
            "steps": [
              {
                "time": "00:00",
                "label": "Integral domains",
                "math": "ab=0\\implies a=0\\ \\text{or}\\ b=0",
                "caption": "$\\mathbb{Z}$, any field, and $F[x]$ are domains. $\\mathbb{Z}/6\\mathbb{Z}$ is not. Every subring of a field is a domain."
              },
              {
                "time": "02:00",
                "label": "Cancellation",
                "math": "ab=ac,\\ a\\neq 0\\implies a(b-c)=0\\implies b=c",
                "caption": "Domains are exactly the rings where nonzero elements can be cancelled."
              },
              {
                "time": "04:00",
                "label": "Finite domains are fields",
                "math": "x\\mapsto ax\\ \\text{injective on finite}\\ R\\implies ax=1\\ \\text{for some}\\ x",
                "caption": "Cancellation makes multiplication by $a\\neq 0$ injective, and an injective self-map of a finite set is surjective."
              },
              {
                "time": "06:00",
                "label": "Fractions",
                "math": "\\frac ab=\\frac cd\\iff ad=bc,\\qquad \\frac ab+\\frac cd=\\frac{ad+bc}{bd},\\qquad \\frac ab\\cdot\\frac cd=\\frac{ac}{bd}",
                "caption": "The relation is an equivalence relation because $R$ is a domain: transitivity uses cancellation."
              },
              {
                "time": "08:00",
                "label": "Examples",
                "math": "\\operatorname{Frac}(\\mathbb{Z})=\\mathbb{Q},\\qquad \\operatorname{Frac}(F[x])=F(x)",
                "caption": "$F(x)$ is the field of rational functions $p(x)/q(x)$. The fraction field of $\\mathbb{Z}[i]$ is $\\mathbb{Q}(i)$."
              },
              {
                "time": "10:00",
                "label": "Universal property",
                "math": "R\\hookrightarrow K\\ \\text{field}\\implies F\\hookrightarrow K,\\quad a/b\\mapsto ab^{-1}",
                "caption": "The fraction field is the smallest field containing $R$."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u3-l07-ex1",
                "type": "mcq",
                "question": "Which ring is an integral domain?",
                "options": [
                  "$\\mathbb{Z}/8\\mathbb{Z}$",
                  "$\\mathbb{Z}\\times\\mathbb{Z}$",
                  "$\\mathbb{Z}[x]$",
                  "$\\mathbb{R}[x]/(x^2)$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: $\\bar2\\cdot\\bar4=\\bar0$.",
                  "Incorrect: $(1,0)(0,1)=(0,0)$.",
                  "Correct! The leading coefficient of a product of nonzero polynomials is the nonzero product of leading coefficients.",
                  "Incorrect: $\\bar x\\cdot\\bar x=\\bar0$ with $\\bar x\\neq 0$."
                ],
                "hints": [
                  "Look for zero divisors.",
                  "Product rings always have them.",
                  "Leading coefficients multiply in $\\mathbb{Z}[x]$."
                ]
              },
              {
                "id": "m373k-u3-l07-ex2",
                "type": "mcq",
                "question": "Which statement is true?",
                "options": [
                  "every domain is a field",
                  "every finite domain is a field",
                  "every field is finite",
                  "$\\mathbb{Z}/n\\mathbb{Z}$ is a domain for every $n$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $\\mathbb{Z}$ is a domain but not a field.",
                  "Correct! Multiplication by $a\\neq 0$ is an injective map of a finite set, hence surjective, so $ax=1$ has a solution.",
                  "Incorrect: $\\mathbb{Q}$ is an infinite field.",
                  "Incorrect: $\\mathbb{Z}/6\\mathbb{Z}$ has zero divisors."
                ],
                "hints": [
                  "$\\mathbb{Z}$ is a domain.",
                  "Use the pigeonhole principle.",
                  "$\\mathbb{Z}/n\\mathbb{Z}$ is a domain iff $n$ is prime."
                ]
              },
              {
                "id": "m373k-u3-l07-ex3",
                "type": "mcq",
                "question": "In the fraction field of $\\mathbb{Z}[x]$, which fraction equals $\\dfrac{x}{x^2+x}$?",
                "options": [
                  "$\\dfrac{1}{x}$",
                  "$\\dfrac{1}{x+1}$",
                  "$\\dfrac{x}{x+1}$",
                  "$1$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: cross-multiply: $x\\cdot x\\neq 1\\cdot(x^2+x)$.",
                  "Correct! $x(x+1)=1\\cdot(x^2+x)$, so the fractions are equal.",
                  "Incorrect: $x(x+1)\\neq x(x^2+x)$.",
                  "Incorrect: $x\\neq x^2+x$."
                ],
                "hints": [
                  "$a/b=c/d$ iff $ad=bc$.",
                  "Factor $x^2+x$.",
                  "Cancel the common factor $x$."
                ]
              },
              {
                "id": "m373k-u3-l07-ex4",
                "type": "mcq",
                "question": "Why must $R$ be a domain to build its fraction field?",
                "options": [
                  "so that addition of fractions is defined",
                  "so that $a/b=c/d\\iff ad=bc$ is transitive and denominators $bd$ stay nonzero",
                  "so that $1\\neq 0$ only",
                  "it is not necessary"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: the formula for addition makes sense in any ring.",
                  "Correct! Transitivity needs cancellation, and $bd\\neq 0$ needs no zero divisors.",
                  "Incorrect: that alone is not enough; $\\mathbb{Z}/6\\mathbb{Z}$ has $1\\neq 0$.",
                  "Incorrect: in $\\mathbb{Z}/6\\mathbb{Z}$, $\\frac12\\cdot\\frac13$ would have denominator $0$."
                ],
                "hints": [
                  "Multiply two fractions: what is the new denominator?",
                  "Prove transitivity: from $ad=bc$ and $cf=de$ deduce $af=be$.",
                  "Where do you cancel?"
                ]
              },
              {
                "id": "m373k-u3-l07-ex5",
                "type": "proof",
                "question": "Prove that every finite integral domain is a field.",
                "hints": [
                  "Fix $a\\neq 0$ and consider $m_a:R\\to R$, $x\\mapsto ax$.",
                  "Show $m_a$ is injective using cancellation.",
                  "Use finiteness to conclude it is surjective."
                ],
                "rubric": [
                  "Define $m_a(x)=ax$ for $a\\neq 0$.",
                  "Injective: $ax=ay\\Rightarrow a(x-y)=0\\Rightarrow x=y$.",
                  "Surjective because $R$ is finite.",
                  "Conclude $ax=1$ for some $x$, so $a$ is a unit."
                ],
                "modelProof": "Let $R$ be a finite domain and $a\\in R$, $a\\neq 0$. Define $m_a:R\\to R$ by $m_a(x)=ax$. If $ax=ay$, then $a(x-y)=0$, and since $R$ has no zero divisors and $a\\neq 0$, $x=y$. So $m_a$ is injective. An injective map from a finite set to itself is surjective, so there is $x$ with $ax=1$. Thus every nonzero element is a unit, and since a domain has $1\\neq 0$, $R$ is a field. $\\blacksquare$"
              },
              {
                "id": "m373k-u3-l07-ex6",
                "type": "proof",
                "question": "Let $R$ be an integral domain. On pairs $(a,b)$ with $b\\neq 0$, define $(a,b)\\sim(c,d)$ if $ad=bc$. Prove that $\\sim$ is transitive.",
                "hints": [
                  "Assume $ad=bc$ and $cf=de$, with $b,d,f\\neq 0$.",
                  "Multiply the first by $f$ and the second by $b$.",
                  "Cancel $d$."
                ],
                "rubric": [
                  "Write the hypotheses $ad=bc$ and $cf=de$.",
                  "Compute $adf=bcf=bde$.",
                  "Rearrange to $d(af-be)=0$.",
                  "Cancel $d\\neq 0$ (domain) to get $af=be$."
                ],
                "modelProof": "Suppose $(a,b)\\sim(c,d)$ and $(c,d)\\sim(e,f)$, so $ad=bc$ and $cf=de$, where $b,d,f\\neq 0$. Then $adf=bcf=b(cf)=b(de)$, so $d(af)=d(be)$ and $d(af-be)=0$. Since $R$ is a domain and $d\\neq 0$, $af-be=0$, i.e. $af=be$. Hence $(a,b)\\sim(e,f)$. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u3-l08",
            "title": "Maximal Ideals",
            "duration": "13:00",
            "videoUrl": "",
            "theorem": "Artin 11.8: An ideal $M\\neq R$ is maximal if no ideal lies strictly between $M$ and $R$. Proposition 11.8.2: $M$ is maximal if and only if $R/M$ is a field. Proposition 11.8.3: the maximal ideals of $\\mathbb{Z}$ are $(p)$, $p$ prime. Proposition 11.8.4: the maximal ideals of $F[x]$ are $(f)$ with $f$ irreducible. Theorem 11.8.6 (Nullstellensatz): the maximal ideals of $\\mathbb{C}[x_1,\\dots,x_n]$ are $(x_1-a_1,\\dots,x_n-a_n)$.",
            "steps": [
              {
                "time": "00:00",
                "label": "Maximal ideals",
                "math": "M\\subsetneq R,\\qquad M\\subseteq J\\subseteq R\\implies J=M\\ \\text{or}\\ J=R",
                "caption": "Example: $(2)$ in $\\mathbb{Z}$. Non-example: $(4)\\subsetneq(2)\\subsetneq\\mathbb{Z}$."
              },
              {
                "time": "02:00",
                "label": "A field has two ideals",
                "math": "F\\ \\text{field}\\iff F\\ \\text{has exactly the ideals}\\ (0)\\ \\text{and}\\ F",
                "caption": "If $a\\neq 0$ and the only ideals are $(0)$ and $R$, then $(a)=R$, so $a$ is a unit."
              },
              {
                "time": "04:00",
                "label": "Maximal iff quotient is a field",
                "math": "M\\ \\text{maximal}\\iff R/M\\ \\text{a field}",
                "caption": "By the Correspondence Theorem, ideals of $R/M$ correspond to ideals between $M$ and $R$."
              },
              {
                "time": "06:00",
                "label": "Maximal ideals of Z",
                "math": "(n)\\ \\text{maximal}\\iff n=p\\ \\text{prime}\\iff\\mathbb{Z}/n\\mathbb{Z}\\ \\text{a field}",
                "caption": "Every ideal of $\\mathbb{Z}$ is $(n)$, and $(n)\\subseteq(m)$ iff $m\\mid n$."
              },
              {
                "time": "08:00",
                "label": "Maximal ideals of F[x]",
                "math": "(f)\\ \\text{maximal}\\iff f\\ \\text{irreducible}",
                "caption": "$x^2+1$ is irreducible over $\\mathbb{R}$, so $\\mathbb{R}[x]/(x^2+1)\\approx\\mathbb{C}$ is a field. Over $\\mathbb{C}$, the irreducibles are linear, so the maximal ideals are $(x-a)$."
              },
              {
                "time": "10:00",
                "label": "Hilbert's Nullstellensatz",
                "math": "\\mathfrak{m}\\subset\\mathbb{C}[x_1,\\dots,x_n]\\ \\text{maximal}\\iff\\mathfrak{m}=(x_1-a_1,\\dots,x_n-a_n)",
                "caption": "Maximal ideals correspond to points of $\\mathbb{C}^n$. This is the bridge from algebra to geometry in Section 11.9."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u3-l08-ex1",
                "type": "mcq",
                "question": "Which ideal of $\\mathbb{Z}$ is maximal?",
                "options": [
                  "$(0)$",
                  "$(6)$",
                  "$(7)$",
                  "$(1)$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: $(0)\\subsetneq(2)\\subsetneq\\mathbb{Z}$.",
                  "Incorrect: $(6)\\subsetneq(2)\\subsetneq\\mathbb{Z}$.",
                  "Correct! $7$ is prime, so $\\mathbb{Z}/7\\mathbb{Z}$ is a field.",
                  "Incorrect: $(1)=\\mathbb{Z}$, and maximal ideals must be proper."
                ],
                "hints": [
                  "$(n)$ is maximal iff $\\mathbb{Z}/n\\mathbb{Z}$ is a field.",
                  "Which $\\mathbb{Z}/n\\mathbb{Z}$ are fields?",
                  "Maximal ideals are proper."
                ]
              },
              {
                "id": "m373k-u3-l08-ex2",
                "type": "mcq",
                "question": "Which ideal of $\\mathbb{Q}[x]$ is maximal?",
                "options": [
                  "$(x^2-4)$",
                  "$(x^2-2)$",
                  "$(x^2)$",
                  "$(0)$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $x^2-4=(x-2)(x+2)$ is reducible.",
                  "Correct! $x^2-2$ has no rational root, so it is irreducible over $\\mathbb{Q}$, and $\\mathbb{Q}[x]/(x^2-2)\\approx\\mathbb{Q}(\\sqrt2)$ is a field.",
                  "Incorrect: $(x^2)\\subsetneq(x)$.",
                  "Incorrect: $(0)\\subsetneq(x)$."
                ],
                "hints": [
                  "$(f)$ is maximal iff $f$ is irreducible.",
                  "A quadratic is irreducible over $\\mathbb{Q}$ iff it has no rational root.",
                  "$\\sqrt2$ is irrational."
                ]
              },
              {
                "id": "m373k-u3-l08-ex3",
                "type": "mcq",
                "question": "Is $(2,x)$ a maximal ideal of $\\mathbb{Z}[x]$?",
                "options": [
                  "yes, since $\\mathbb{Z}[x]/(2,x)\\approx\\mathbb{F}_2$ is a field",
                  "no, since it is not principal",
                  "no, since $(x)\\supsetneq(2,x)$",
                  "yes, since $2$ is prime, and that is the only reason"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! Setting $x=0$ and reducing mod $2$ gives a surjection onto $\\mathbb{F}_2$ with kernel $(2,x)$.",
                  "Incorrect: maximal ideals need not be principal.",
                  "Incorrect: $(x)\\subsetneq(2,x)$, the inclusion goes the other way.",
                  "Incorrect: $(2)$ alone is not maximal in $\\mathbb{Z}[x]$, since $\\mathbb{Z}[x]/(2)\\approx\\mathbb{F}_2[x]$ is not a field."
                ],
                "hints": [
                  "Compute the quotient ring.",
                  "Use $\\mathbb{Z}[x]\\to\\mathbb{F}_2$, $f\\mapsto f(0)\\bmod 2$.",
                  "Is the quotient a field?"
                ]
              },
              {
                "id": "m373k-u3-l08-ex4",
                "type": "mcq",
                "question": "What are the maximal ideals of $\\mathbb{C}[x]$?",
                "options": [
                  "$(x-a)$ for $a\\in\\mathbb{C}$",
                  "$(x^2+1)$ only",
                  "$(f)$ for $f$ of degree $2$",
                  "$(0)$"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! Every non-constant complex polynomial has a root, so the irreducibles are linear. This is the case $n=1$ of the Nullstellensatz.",
                  "Incorrect: $x^2+1=(x-i)(x+i)$ is reducible over $\\mathbb{C}$.",
                  "Incorrect: quadratics factor over $\\mathbb{C}$.",
                  "Incorrect: $\\mathbb{C}[x]$ is not a field."
                ],
                "hints": [
                  "$(f)$ is maximal iff $f$ is irreducible.",
                  "Fundamental Theorem of Algebra.",
                  "Which complex polynomials are irreducible?"
                ]
              },
              {
                "id": "m373k-u3-l08-ex5",
                "type": "proof",
                "question": "(Proposition 11.8.2) Let $M$ be an ideal of $R$. Prove that $M$ is maximal if and only if $R/M$ is a field.",
                "hints": [
                  "A ring $\\bar R\\neq 0$ is a field iff its only ideals are $(0)$ and $\\bar R$.",
                  "Use the Correspondence Theorem for $R\\to R/M$.",
                  "$M\\neq R$ corresponds to $R/M\\neq 0$."
                ],
                "rubric": [
                  "Show a nonzero ring is a field iff its only ideals are $(0)$ and itself.",
                  "Note $R/M$ is the zero ring iff $M=R$.",
                  "Use the Correspondence Theorem: ideals of $R/M$ correspond to ideals $J$ with $M\\subseteq J\\subseteq R$.",
                  "Conclude: $M$ maximal iff $R/M$ has exactly two ideals iff $R/M$ is a field."
                ],
                "modelProof": "First, a nonzero ring $S$ is a field iff its only ideals are $(0)$ and $S$: in a field a nonzero ideal contains a unit, hence $1$; conversely if $a\\neq 0$ then $(a)\\neq 0$ forces $(a)=S$, so $ab=1$ for some $b$. Now $R/M$ is nonzero iff $M\\neq R$. By the Correspondence Theorem, the ideals of $R/M$ are the $J/M$ for ideals $M\\subseteq J\\subseteq R$, with $J/M=0$ iff $J=M$ and $J/M=R/M$ iff $J=R$. So $R/M$ is a nonzero ring with only the ideals $0$ and $R/M$ exactly when $M\\neq R$ and no ideal lies strictly between $M$ and $R$, i.e. when $M$ is maximal. Hence $M$ is maximal iff $R/M$ is a field. $\\blacksquare$"
              },
              {
                "id": "m373k-u3-l08-ex6",
                "type": "proof",
                "question": "Let $F$ be a field and $f\\in F[x]$ irreducible. Prove that $(f)$ is a maximal ideal.",
                "hints": [
                  "Suppose $(f)\\subseteq J\\subseteq F[x]$; $J$ is principal.",
                  "Write $J=(g)$; then $g\\mid f$.",
                  "Use irreducibility of $f$."
                ],
                "rubric": [
                  "Note $(f)\\neq F[x]$ since $f$ is not a unit (it has positive degree).",
                  "Let $J\\supseteq(f)$; write $J=(g)$ since $F[x]$ is a principal ideal ring.",
                  "From $f\\in(g)$ get $f=gh$.",
                  "Irreducibility: $g$ or $h$ is a unit; if $g$ is a unit $J=F[x]$, if $h$ is a unit $J=(f)$."
                ],
                "modelProof": "Since $f$ is irreducible it has positive degree, so it is not a unit and $(f)\\neq F[x]$. Let $J$ be an ideal with $(f)\\subseteq J$. Every ideal of $F[x]$ is principal, so $J=(g)$, and $f\\in(g)$ gives $f=gh$ for some $h$. Because $f$ is irreducible, $g$ or $h$ is a unit. If $g$ is a unit, then $J=(g)=F[x]$. If $h$ is a unit, then $g=fh^{-1}\\in(f)$, so $J=(g)\\subseteq(f)$ and $J=(f)$. Hence $(f)$ is maximal. $\\blacksquare$"
              }
            ]
          }
        ]
      },
      {
        "id": "m373k-u4",
        "title": "Unit 4: Fields & Extensions",
        "description": "Characteristic and prime fields, algebraic and transcendental elements, the degree of an extension and the tower law, finding minimal polynomials, ruler and compass constructions, adjoining roots and splitting fields, and finite fields (Artin 15.1–15.7).",
        "lessons": [
          {
            "id": "m373k-u4-l01",
            "title": "Fields and Characteristic",
            "duration": "11:00",
            "videoUrl": "",
            "theorem": "Artin 15.1: Every field $F$ contains a smallest subfield, its prime field, which is $\\mathbb{Q}$ if $F$ has characteristic $0$ and $\\mathbb{F}_p$ if $F$ has characteristic $p$. The characteristic of a field is $0$ or a prime. A field extension $K/F$ is a field $K$ containing $F$ as a subfield.",
            "steps": [
              {
                "time": "00:00",
                "label": "Three kinds of fields",
                "math": "\\mathbb{Q}\\subset\\mathbb{Q}(\\sqrt2)\\subset\\mathbb{R},\\qquad \\mathbb{F}_p,\\ \\mathbb{F}_{p^r},\\qquad F(x)=\\operatorname{Frac}F[x]",
                "caption": "Number fields (subfields of $\\mathbb{C}$), finite fields, and function fields are the main families."
              },
              {
                "time": "02:00",
                "label": "The characteristic",
                "math": "\\mathbb{Z}\\to F,\\ n\\mapsto n\\cdot 1,\\qquad \\ker=(0)\\ \\text{or}\\ (p)",
                "caption": "The image is a subring of a field, hence a domain, so the kernel is $(0)$ or a prime ideal $(p)$."
              },
              {
                "time": "04:00",
                "label": "Why the characteristic is prime",
                "math": "n=ab,\\ n\\cdot1=0\\implies(a\\cdot1)(b\\cdot1)=0",
                "caption": "In a field one of the factors must be $0$, contradicting the minimality of $n$ unless $n$ is prime."
              },
              {
                "time": "06:00",
                "label": "Prime fields",
                "math": "\\operatorname{char}F=0\\implies\\mathbb{Q}\\subseteq F;\\qquad \\operatorname{char}F=p\\implies\\mathbb{F}_p\\subseteq F",
                "caption": "In characteristic $0$, $\\mathbb{Z}\\hookrightarrow F$ extends to the fraction field $\\mathbb{Q}$."
              },
              {
                "time": "08:00",
                "label": "Freshman's dream",
                "math": "(a+b)^p=a^p+b^p\\quad(\\operatorname{char}F=p)",
                "caption": "The middle binomial coefficients $\\binom pk$, $0<k<p$, are divisible by $p$. So $a\\mapsto a^p$ is a ring homomorphism, the Frobenius map."
              },
              {
                "time": "10:00",
                "label": "Extensions",
                "math": "K/F,\\qquad F\\subseteq K",
                "caption": "$K$ is a vector space over $F$. Its dimension $[K:F]$ will be the main tool of this unit."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u4-l01-ex1",
                "type": "mcq",
                "question": "What is the characteristic of the field $\\mathbb{F}_7(x)$ of rational functions over $\\mathbb{F}_7$?",
                "options": [
                  "$0$",
                  "$7$",
                  "$49$",
                  "infinite"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $7\\cdot 1=0$ already in $\\mathbb{F}_7$.",
                  "Correct! It contains $\\mathbb{F}_7$ as its prime field. An infinite field can have positive characteristic.",
                  "Incorrect: the characteristic is a prime or $0$.",
                  "Incorrect: the characteristic is a nonnegative integer."
                ],
                "hints": [
                  "Compute $1+1+\\cdots+1$ ($7$ times).",
                  "The characteristic is determined by the prime field.",
                  "Infinite fields may have characteristic $p$."
                ]
              },
              {
                "id": "m373k-u4-l01-ex2",
                "type": "mcq",
                "question": "In a field of characteristic $3$, simplify $(a+b)^3$.",
                "options": [
                  "$a^3+3a^2b+3ab^2+b^3$",
                  "$a^3+b^3$",
                  "$a^3-b^3$",
                  "$(a+b)^3$ cannot be simplified"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: that is correct but not simplified; $3=0$ in this field.",
                  "Correct! The coefficients $3$ vanish.",
                  "Incorrect: the sign is $+$.",
                  "Incorrect: the middle terms vanish because $3=0$."
                ],
                "hints": [
                  "Expand with the binomial theorem.",
                  "What is $3$ in a field of characteristic $3$?",
                  "This is the Frobenius map."
                ]
              },
              {
                "id": "m373k-u4-l01-ex3",
                "type": "mcq",
                "question": "Which number can be the characteristic of a field?",
                "options": [
                  "$1$",
                  "$4$",
                  "$11$",
                  "$15$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: characteristic $1$ would mean $1=0$, which fields forbid.",
                  "Incorrect: $(1+1)(1+1)=0$ would give zero divisors.",
                  "Correct! $\\mathbb{F}_{11}$ has characteristic $11$, a prime.",
                  "Incorrect: $15=3\\cdot5$ is not prime."
                ],
                "hints": [
                  "The characteristic is $0$ or prime.",
                  "Fields have no zero divisors.",
                  "Factor each option."
                ]
              },
              {
                "id": "m373k-u4-l01-ex4",
                "type": "mcq",
                "question": "What is the prime field of $\\mathbb{Q}(\\sqrt2)$?",
                "options": [
                  "$\\mathbb{Z}$",
                  "$\\mathbb{Q}$",
                  "$\\mathbb{Q}(\\sqrt2)$",
                  "$\\mathbb{F}_2$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $\\mathbb{Z}$ is not a field.",
                  "Correct! The characteristic is $0$, so the prime field is $\\mathbb{Q}$.",
                  "Incorrect: $\\mathbb{Q}$ is a smaller subfield.",
                  "Incorrect: $1+1\\neq 0$ in $\\mathbb{Q}(\\sqrt2)$."
                ],
                "hints": [
                  "What is the characteristic?",
                  "The prime field is the smallest subfield.",
                  "Every subfield contains $1$ and hence all of $\\mathbb{Q}$."
                ]
              },
              {
                "id": "m373k-u4-l01-ex5",
                "type": "proof",
                "question": "Prove that the characteristic of a field $F$ is either $0$ or a prime.",
                "hints": [
                  "Suppose the characteristic is $n>0$ and $n=ab$ with $1<a,b<n$.",
                  "Then $(a\\cdot 1)(b\\cdot 1)=n\\cdot 1=0$.",
                  "Use that $F$ has no zero divisors and the minimality of $n$."
                ],
                "rubric": [
                  "Note $n\\neq 1$ because $1\\neq 0$ in a field.",
                  "Suppose $n=ab$ with $1<a,b<n$.",
                  "Show $(a\\cdot1)(b\\cdot1)=0$, so one of $a\\cdot1$, $b\\cdot1$ is $0$.",
                  "Contradict the minimality of $n$; conclude $n$ is prime."
                ],
                "modelProof": "Suppose $F$ has positive characteristic $n$, the least positive integer with $n\\cdot 1=0$. Since $1\\neq 0$ in a field, $n\\neq 1$. If $n$ were composite, $n=ab$ with $1<a,b<n$, then by distributivity $(a\\cdot 1)(b\\cdot 1)=(ab)\\cdot 1=0$. A field has no zero divisors, so $a\\cdot 1=0$ or $b\\cdot 1=0$, contradicting the minimality of $n$. Hence $n$ is prime. $\\blacksquare$"
              },
              {
                "id": "m373k-u4-l01-ex6",
                "type": "proof",
                "question": "Let $F$ have characteristic $p$. Prove that $(a+b)^p=a^p+b^p$ for all $a,b\\in F$.",
                "hints": [
                  "Use the binomial theorem.",
                  "Show $p\\mid\\binom pk$ for $0<k<p$.",
                  "$\\binom pk=\\frac{p!}{k!(p-k)!}$, and $p$ does not divide $k!(p-k)!$."
                ],
                "rubric": [
                  "Expand $(a+b)^p=\\sum_k\\binom pka^kb^{p-k}$.",
                  "Show $p\\mid\\binom pk$ for $0<k<p$: $p$ divides $p!$ but not $k!(p-k)!$.",
                  "Conclude those terms vanish since $p\\cdot 1=0$.",
                  "Only the terms $k=0$ and $k=p$ remain."
                ],
                "modelProof": "By the binomial theorem (valid in any commutative ring), $(a+b)^p=\\sum_{k=0}^{p}\\binom pk a^kb^{p-k}$. For $0<k<p$, $\\binom pk=\\frac{p!}{k!(p-k)!}$ is an integer, $p$ divides the numerator, and $p$ does not divide $k!(p-k)!$ since all its factors are less than $p$ and $p$ is prime. So $p\\mid\\binom pk$, and since $p\\cdot 1=0$ in $F$, those terms are $0$. What remains is $a^p+b^p$. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u4-l02",
            "title": "Algebraic and Transcendental Elements",
            "duration": "13:00",
            "videoUrl": "",
            "theorem": "Artin 15.2: $\\alpha\\in K$ is algebraic over $F$ if $f(\\alpha)=0$ for some nonzero $f\\in F[x]$, and transcendental otherwise. If $\\alpha$ is algebraic, the kernel of $F[x]\\to K$, $x\\mapsto\\alpha$, is generated by a unique monic irreducible $f$, the minimal polynomial, and $F[x]/(f)\\approx F(\\alpha)=F[\\alpha]$ (Proposition 15.2.7).",
            "steps": [
              {
                "time": "00:00",
                "label": "Algebraic or transcendental",
                "math": "\\varphi:F[x]\\to K,\\quad x\\mapsto\\alpha,\\qquad \\ker\\varphi=(f)\\ \\text{or}\\ (0)",
                "caption": "$\\sqrt2$, $i$ and $\\sqrt[3]5$ are algebraic over $\\mathbb{Q}$. $\\pi$ and $e$ are transcendental (Lindemann, Hermite)."
              },
              {
                "time": "02:00",
                "label": "The minimal polynomial",
                "math": "f\\ \\text{monic irreducible},\\quad f(\\alpha)=0,\\quad g(\\alpha)=0\\iff f\\mid g",
                "caption": "The kernel is a nonzero ideal of $F[x]$, hence principal. It is prime because $F[\\alpha]\\subseteq K$ is a domain, so the generator is irreducible."
              },
              {
                "time": "04:00",
                "label": "F(alpha) = F[alpha]",
                "math": "F[x]/(f)\\xrightarrow{\\ \\sim\\ }F[\\alpha],\\qquad (f)\\ \\text{maximal}\\implies F[\\alpha]\\ \\text{is a field}",
                "caption": "Because $f$ is irreducible, the quotient is a field. So for algebraic $\\alpha$, the ring generated by $\\alpha$ is already a field: $F[\\alpha]=F(\\alpha)$."
              },
              {
                "time": "06:00",
                "label": "A basis",
                "math": "F(\\alpha)=\\{c_0+c_1\\alpha+\\cdots+c_{n-1}\\alpha^{n-1}\\},\\qquad n=\\deg f",
                "caption": "By Proposition 11.5.5. Example: $\\mathbb{Q}(\\sqrt[3]2)$ has basis $1,\\sqrt[3]2,\\sqrt[3]4$."
              },
              {
                "time": "08:00",
                "label": "Inverting an element",
                "math": "\\frac{1}{1+\\sqrt2}=\\frac{1-\\sqrt2}{(1+\\sqrt2)(1-\\sqrt2)}=\\sqrt2-1",
                "caption": "In general, the inverse of $g(\\alpha)$ comes from writing $1=gu+fv$ in $F[x]$, possible since $\\gcd(g,f)=1$."
              },
              {
                "time": "10:00",
                "label": "Transcendental elements",
                "math": "\\alpha\\ \\text{transcendental}\\implies F(\\alpha)\\approx F(x)",
                "caption": "Substitution is injective, so $F[\\alpha]\\approx F[x]$, which is not a field; $F(\\alpha)$ is its fraction field."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u4-l02-ex1",
                "type": "mcq",
                "question": "What is the minimal polynomial of $\\sqrt2+1$ over $\\mathbb{Q}$?",
                "options": [
                  "$x^2-2$",
                  "$x^2-2x-1$",
                  "$x^2+2x-1$",
                  "$x-\\sqrt2-1$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $(\\sqrt2+1)^2-2=1+2\\sqrt2\\neq 0$.",
                  "Correct! $\\alpha-1=\\sqrt2$ gives $\\alpha^2-2\\alpha+1=2$, i.e. $\\alpha^2-2\\alpha-1=0$; it is irreducible since its roots $1\\pm\\sqrt2$ are irrational.",
                  "Incorrect: its roots are $-1\\pm\\sqrt2$.",
                  "Incorrect: this polynomial does not have rational coefficients."
                ],
                "hints": [
                  "Let $\\alpha=\\sqrt2+1$ and isolate $\\sqrt2$.",
                  "Square both sides.",
                  "Check irreducibility over $\\mathbb{Q}$."
                ]
              },
              {
                "id": "m373k-u4-l02-ex2",
                "type": "mcq",
                "question": "Which number is transcendental over $\\mathbb{Q}$?",
                "options": [
                  "$\\sqrt[5]{7}$",
                  "$i$",
                  "$e$",
                  "$\\frac{1+\\sqrt5}{2}$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: it is a root of $x^5-7$.",
                  "Incorrect: it is a root of $x^2+1$.",
                  "Correct! Hermite proved in 1873 that $e$ is transcendental.",
                  "Incorrect: it is a root of $x^2-x-1$."
                ],
                "hints": [
                  "An algebraic number is a root of a nonzero rational polynomial.",
                  "Three of the options are roots of easy polynomials.",
                  "Which famous constant is left?"
                ]
              },
              {
                "id": "m373k-u4-l02-ex3",
                "type": "mcq",
                "question": "Write $\\dfrac{1}{2+\\sqrt3}$ in the form $a+b\\sqrt3$ with $a,b\\in\\mathbb{Q}$.",
                "options": [
                  "$2+\\sqrt3$",
                  "$2-\\sqrt3$",
                  "$\\tfrac12-\\tfrac13\\sqrt3$",
                  "$-2+\\sqrt3$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $(2+\\sqrt3)^2\\neq 1$.",
                  "Correct! $(2+\\sqrt3)(2-\\sqrt3)=4-3=1$.",
                  "Incorrect: you cannot invert term by term.",
                  "Incorrect: $(2+\\sqrt3)(-2+\\sqrt3)=-1$."
                ],
                "hints": [
                  "Multiply numerator and denominator by the conjugate.",
                  "$(2+\\sqrt3)(2-\\sqrt3)=?$",
                  "The denominator becomes rational."
                ]
              },
              {
                "id": "m373k-u4-l02-ex4",
                "type": "mcq",
                "question": "Let $\\alpha$ be algebraic over $F$ with minimal polynomial $f$, and let $g\\in F[x]$ with $g(\\alpha)=0$. Then",
                "options": [
                  "$g$ divides $f$",
                  "$f$ divides $g$",
                  "$g=f$",
                  "$\\deg g<\\deg f$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $g$ could be $f^2$ or $fh$ for any $h$.",
                  "Correct! $g$ lies in the kernel of $x\\mapsto\\alpha$, which is the ideal $(f)$.",
                  "Incorrect: $g$ could be any multiple of $f$.",
                  "Incorrect: $f$ has the least degree among nonzero polynomials vanishing at $\\alpha$."
                ],
                "hints": [
                  "What is the kernel of substitution $x\\mapsto\\alpha$?",
                  "It is generated by $f$.",
                  "Elements of $(f)$ are multiples of $f$."
                ]
              },
              {
                "id": "m373k-u4-l02-ex5",
                "type": "proof",
                "question": "Let $\\alpha$ be algebraic over $F$ and let $f$ be a monic polynomial of least degree with $f(\\alpha)=0$. Prove that $f$ is irreducible.",
                "hints": [
                  "Suppose $f=gh$ with $\\deg g,\\deg h<\\deg f$.",
                  "Evaluate at $\\alpha$ in the field $K$.",
                  "Contradict the minimality of $\\deg f$."
                ],
                "rubric": [
                  "Assume $f=gh$ with $0<\\deg g,\\deg h<\\deg f$.",
                  "Get $0=f(\\alpha)=g(\\alpha)h(\\alpha)$ in $K$.",
                  "Since $K$ is a field, $g(\\alpha)=0$ or $h(\\alpha)=0$.",
                  "Either case contradicts minimality, so $f$ is irreducible."
                ],
                "modelProof": "Note $\\deg f\\ge 1$, since a nonzero constant does not vanish at $\\alpha$. Suppose $f=gh$ with $g,h\\in F[x]$ of degrees strictly between $0$ and $\\deg f$. Evaluating at $\\alpha$ gives $0=f(\\alpha)=g(\\alpha)h(\\alpha)$ in the field $K$, so $g(\\alpha)=0$ or $h(\\alpha)=0$. Dividing by its leading coefficient, either $g$ or $h$ gives a monic polynomial of smaller degree vanishing at $\\alpha$, contradicting the choice of $f$. Hence $f$ is irreducible. $\\blacksquare$"
              },
              {
                "id": "m373k-u4-l02-ex6",
                "type": "proof",
                "question": "Let $\\alpha$ be algebraic over $F$ with minimal polynomial $f$ of degree $n$, and let $\\beta=g(\\alpha)\\neq 0$ with $g\\in F[x]$. Prove that $\\beta$ has an inverse in $F[\\alpha]$.",
                "hints": [
                  "Show $\\gcd(g,f)=1$ using irreducibility of $f$.",
                  "Write $1=gu+fv$.",
                  "Substitute $x=\\alpha$."
                ],
                "rubric": [
                  "Note $f\\nmid g$ because $g(\\alpha)\\neq 0$.",
                  "Since $f$ is irreducible, the only monic common divisor of $f$ and $g$ is $1$.",
                  "Since $F[x]$ is a principal ideal ring, $(f,g)=(1)$, so $1=gu+fv$.",
                  "Substitute $\\alpha$: $1=g(\\alpha)u(\\alpha)$, so $\\beta^{-1}=u(\\alpha)\\in F[\\alpha]$."
                ],
                "modelProof": "Since $g(\\alpha)\\neq 0$, $f$ does not divide $g$. The ideal $(f,g)$ of $F[x]$ is principal, say $(d)$ with $d$ monic, and $d\\mid f$. As $f$ is irreducible, $d=1$ or $d$ is $f$ up to a unit; the latter is impossible because $d\\mid g$ and $f\\nmid g$. So $(f,g)=(1)$ and $1=g(x)u(x)+f(x)v(x)$ for some $u,v\\in F[x]$. Substituting $x=\\alpha$ and using $f(\\alpha)=0$ gives $1=g(\\alpha)u(\\alpha)=\\beta\\,u(\\alpha)$. Hence $\\beta^{-1}=u(\\alpha)\\in F[\\alpha]$. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u4-l03",
            "title": "The Degree of a Field Extension",
            "duration": "13:00",
            "videoUrl": "",
            "theorem": "Artin 15.3: The degree $[K:F]$ is the dimension of $K$ as an $F$-vector space. If $\\alpha$ is algebraic with minimal polynomial of degree $n$, then $[F(\\alpha):F]=n$. Theorem 15.3.5 (Multiplicative Property): for $F\\subseteq K\\subseteq L$, $[L:F]=[L:K]\\,[K:F]$. Corollary 15.3.6: if $[K:F]$ is finite, the degree of every $\\alpha\\in K$ over $F$ divides $[K:F]$.",
            "steps": [
              {
                "time": "00:00",
                "label": "Degree as dimension",
                "math": "[K:F]=\\dim_F K",
                "caption": "$[\\mathbb{C}:\\mathbb{R}]=2$ with basis $1,i$. $[\\mathbb{R}:\\mathbb{Q}]$ is infinite."
              },
              {
                "time": "02:00",
                "label": "Degree of a simple extension",
                "math": "[F(\\alpha):F]=\\deg f_\\alpha",
                "caption": "The basis is $1,\\alpha,\\dots,\\alpha^{n-1}$. So $[\\mathbb{Q}(\\sqrt[3]2):\\mathbb{Q}]=3$."
              },
              {
                "time": "04:00",
                "label": "The tower law",
                "math": "[L:F]=[L:K]\\,[K:F]",
                "caption": "If $\\{u_i\\}$ is a basis of $K/F$ and $\\{v_j\\}$ of $L/K$, then $\\{u_iv_j\\}$ is a basis of $L/F$."
              },
              {
                "time": "06:00",
                "label": "Example",
                "math": "[\\mathbb{Q}(\\sqrt2,\\sqrt3):\\mathbb{Q}]=[\\mathbb{Q}(\\sqrt2,\\sqrt3):\\mathbb{Q}(\\sqrt2)]\\cdot 2=2\\cdot 2=4",
                "caption": "$\\sqrt3\\notin\\mathbb{Q}(\\sqrt2)$, so $x^2-3$ stays irreducible over $\\mathbb{Q}(\\sqrt2)$."
              },
              {
                "time": "08:00",
                "label": "Degrees divide",
                "math": "\\alpha\\in K\\implies F\\subseteq F(\\alpha)\\subseteq K\\implies \\deg\\alpha\\mid[K:F]",
                "caption": "So $\\sqrt[3]2\\notin\\mathbb{Q}(\\sqrt2,\\sqrt3)$: $3$ does not divide $4$."
              },
              {
                "time": "10:00",
                "label": "Finite implies algebraic",
                "math": "[K:F]=n\\implies 1,\\alpha,\\dots,\\alpha^n\\ \\text{linearly dependent}",
                "caption": "$n+1$ vectors in an $n$-dimensional space are dependent, giving a nonzero polynomial with root $\\alpha$."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u4-l03-ex1",
                "type": "mcq",
                "question": "What is $[\\mathbb{Q}(\\sqrt[4]{2}):\\mathbb{Q}]$?",
                "options": [
                  "$2$",
                  "$4$",
                  "$8$",
                  "infinite"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $\\sqrt[4]2$ is not a root of a rational quadratic; $x^4-2$ is irreducible.",
                  "Correct! The minimal polynomial is $x^4-2$, irreducible by Eisenstein's criterion at $p=2$.",
                  "Incorrect: the degree equals the degree of the minimal polynomial.",
                  "Incorrect: $\\sqrt[4]2$ is algebraic."
                ],
                "hints": [
                  "$[\\mathbb{Q}(\\alpha):\\mathbb{Q}]$ is the degree of the minimal polynomial.",
                  "$\\sqrt[4]2$ is a root of $x^4-2$.",
                  "Eisenstein at $p=2$ shows irreducibility."
                ]
              },
              {
                "id": "m373k-u4-l03-ex2",
                "type": "mcq",
                "question": "Let $[K:F]=6$ and $\\alpha\\in K$. Which cannot be the degree of $\\alpha$ over $F$?",
                "options": [
                  "$1$",
                  "$2$",
                  "$3$",
                  "$4$"
                ],
                "correctIndex": 3,
                "optionExplanations": [
                  "Incorrect: elements of $F$ have degree $1$.",
                  "Incorrect: $2$ divides $6$.",
                  "Incorrect: $3$ divides $6$.",
                  "Correct! $[F(\\alpha):F]$ divides $[K:F]=6$ by the tower law, and $4\\nmid 6$."
                ],
                "hints": [
                  "Use $F\\subseteq F(\\alpha)\\subseteq K$.",
                  "Apply the tower law.",
                  "Which option does not divide $6$?"
                ]
              },
              {
                "id": "m373k-u4-l03-ex3",
                "type": "mcq",
                "question": "What is $[\\mathbb{Q}(\\sqrt2,\\sqrt3):\\mathbb{Q}]$?",
                "options": [
                  "$2$",
                  "$3$",
                  "$4$",
                  "$6$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: $\\sqrt3\\notin\\mathbb{Q}(\\sqrt2)$, so the second step has degree $2$.",
                  "Incorrect: degrees in this tower are powers of $2$.",
                  "Correct! $[\\mathbb{Q}(\\sqrt2):\\mathbb{Q}]=2$ and $[\\mathbb{Q}(\\sqrt2,\\sqrt3):\\mathbb{Q}(\\sqrt2)]=2$, so the total is $4$.",
                  "Incorrect: $2\\cdot 2=4$."
                ],
                "hints": [
                  "Use the tower $\\mathbb{Q}\\subset\\mathbb{Q}(\\sqrt2)\\subset\\mathbb{Q}(\\sqrt2,\\sqrt3)$.",
                  "Is $\\sqrt3$ in $\\mathbb{Q}(\\sqrt2)$?",
                  "If $\\sqrt3=a+b\\sqrt2$, square and compare."
                ]
              },
              {
                "id": "m373k-u4-l03-ex4",
                "type": "mcq",
                "question": "Is $\\sqrt[3]{2}$ in $\\mathbb{Q}(\\sqrt2,\\sqrt3)$?",
                "options": [
                  "yes",
                  "no, because its degree $3$ does not divide $4$",
                  "no, because $\\sqrt[3]2$ is transcendental",
                  "cannot be determined"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: degrees must divide.",
                  "Correct! If it were, $\\mathbb{Q}(\\sqrt[3]2)$ would be an intermediate field of degree $3$ inside an extension of degree $4$.",
                  "Incorrect: it is a root of $x^3-2$.",
                  "Incorrect: the tower law settles it."
                ],
                "hints": [
                  "$[\\mathbb{Q}(\\sqrt[3]2):\\mathbb{Q}]=3$.",
                  "$[\\mathbb{Q}(\\sqrt2,\\sqrt3):\\mathbb{Q}]=4$.",
                  "Does $3$ divide $4$?"
                ]
              },
              {
                "id": "m373k-u4-l03-ex5",
                "type": "proof",
                "question": "(Tower law) Let $F\\subseteq K\\subseteq L$ with $\\{u_1,\\dots,u_m\\}$ a basis of $K$ over $F$ and $\\{v_1,\\dots,v_n\\}$ a basis of $L$ over $K$. Prove that $\\{u_iv_j\\}$ is a basis of $L$ over $F$, so $[L:F]=mn$.",
                "hints": [
                  "Spanning: write $w\\in L$ in terms of the $v_j$, then each coefficient in terms of the $u_i$.",
                  "Independence: group a relation $\\sum c_{ij}u_iv_j=0$ by $j$.",
                  "Use independence of the $v_j$ over $K$, then of the $u_i$ over $F$."
                ],
                "rubric": [
                  "Write $w=\\sum_j b_jv_j$ with $b_j\\in K$, then $b_j=\\sum_i c_{ij}u_i$ with $c_{ij}\\in F$.",
                  "Conclude $w=\\sum c_{ij}u_iv_j$, so the products span.",
                  "If $\\sum_{i,j}c_{ij}u_iv_j=0$, rewrite as $\\sum_j(\\sum_ic_{ij}u_i)v_j=0$ and get $\\sum_ic_{ij}u_i=0$ for each $j$.",
                  "Then $c_{ij}=0$ by independence of the $u_i$."
                ],
                "modelProof": "Spanning: let $w\\in L$. Then $w=\\sum_j b_jv_j$ with $b_j\\in K$, and each $b_j=\\sum_i c_{ij}u_i$ with $c_{ij}\\in F$. So $w=\\sum_{i,j}c_{ij}u_iv_j$. Independence: suppose $\\sum_{i,j}c_{ij}u_iv_j=0$ with $c_{ij}\\in F$. Grouping, $\\sum_j\\big(\\sum_ic_{ij}u_i\\big)v_j=0$, and each $\\sum_ic_{ij}u_i$ lies in $K$. Since the $v_j$ are independent over $K$, $\\sum_ic_{ij}u_i=0$ for every $j$, and since the $u_i$ are independent over $F$, every $c_{ij}=0$. Hence the $mn$ products form a basis and $[L:F]=mn=[L:K][K:F]$. $\\blacksquare$"
              },
              {
                "id": "m373k-u4-l03-ex6",
                "type": "proof",
                "question": "Prove that $\\sqrt3\\notin\\mathbb{Q}(\\sqrt2)$, and deduce $[\\mathbb{Q}(\\sqrt2,\\sqrt3):\\mathbb{Q}]=4$.",
                "hints": [
                  "Suppose $\\sqrt3=a+b\\sqrt2$ with $a,b\\in\\mathbb{Q}$ and square.",
                  "Compare the coefficients of $1$ and $\\sqrt2$.",
                  "Then apply the tower law."
                ],
                "rubric": [
                  "Square: $3=a^2+2b^2+2ab\\sqrt2$.",
                  "Since $1,\\sqrt2$ are independent over $\\mathbb{Q}$, $ab=0$ and $a^2+2b^2=3$.",
                  "Rule out $b=0$ ($a^2=3$) and $a=0$ ($b^2=\\tfrac32$): no rational solutions.",
                  "Conclude $x^2-3$ is irreducible over $\\mathbb{Q}(\\sqrt2)$ and the degree is $2\\cdot 2=4$."
                ],
                "modelProof": "Suppose $\\sqrt3=a+b\\sqrt2$ with $a,b\\in\\mathbb{Q}$. Squaring, $3=(a^2+2b^2)+2ab\\sqrt2$. Since $1$ and $\\sqrt2$ are linearly independent over $\\mathbb{Q}$, $2ab=0$ and $a^2+2b^2=3$. If $b=0$ then $a^2=3$, impossible for rational $a$; if $a=0$ then $b^2=3/2$, i.e. $(2b)^2=6$, also impossible. So $\\sqrt3\\notin\\mathbb{Q}(\\sqrt2)$. Then $x^2-3$ has no root in $\\mathbb{Q}(\\sqrt2)$, so being quadratic it is irreducible there, and $[\\mathbb{Q}(\\sqrt2,\\sqrt3):\\mathbb{Q}(\\sqrt2)]=2$. By the tower law, $[\\mathbb{Q}(\\sqrt2,\\sqrt3):\\mathbb{Q}]=2\\cdot[\\mathbb{Q}(\\sqrt2):\\mathbb{Q}]=2\\cdot2=4$. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u4-l04",
            "title": "Finding the Irreducible Polynomial",
            "duration": "12:00",
            "videoUrl": "",
            "theorem": "Artin 15.4: To find the minimal polynomial of $\\alpha$ over $F$, find a polynomial it satisfies and prove irreducibility, often by computing $[F(\\alpha):F]$ another way. Useful tools: the rational root test, reduction modulo a prime, Eisenstein's criterion (Artin 12.4), and the fact that a polynomial of degree $2$ or $3$ is irreducible over a field iff it has no root there.",
            "steps": [
              {
                "time": "00:00",
                "label": "Example: $\\sqrt2+\\sqrt3$",
                "math": "\\alpha=\\sqrt2+\\sqrt3,\\quad \\alpha^2=5+2\\sqrt6,\\quad (\\alpha^2-5)^2=24",
                "caption": "So $\\alpha$ is a root of $x^4-10x^2+1$."
              },
              {
                "time": "02:00",
                "label": "Irreducibility via degree",
                "math": "\\mathbb{Q}(\\alpha)=\\mathbb{Q}(\\sqrt2,\\sqrt3),\\qquad [\\mathbb{Q}(\\alpha):\\mathbb{Q}]=4",
                "caption": "$\\alpha^3=11\\sqrt2+9\\sqrt3$, so $\\sqrt2=\\frac{\\alpha^3-9\\alpha}{2}\\in\\mathbb{Q}(\\alpha)$. The degree is $4$, so $x^4-10x^2+1$ is the minimal polynomial."
              },
              {
                "time": "04:00",
                "label": "Rational root test",
                "math": "f=a_nx^n+\\cdots+a_0\\in\\mathbb{Z}[x],\\quad f(\\tfrac rs)=0\\implies r\\mid a_0,\\ s\\mid a_n",
                "caption": "Settles irreducibility for degrees $2$ and $3$ over $\\mathbb{Q}$. Example: $x^3-3x-1$ has no root among $\\pm1$, so it is irreducible."
              },
              {
                "time": "06:00",
                "label": "Eisenstein's criterion",
                "math": "p\\mid a_0,\\dots,a_{n-1},\\quad p\\nmid a_n,\\quad p^2\\nmid a_0\\implies f\\ \\text{irreducible over}\\ \\mathbb{Q}",
                "caption": "So $x^n-2$ is irreducible for every $n$, and $\\sqrt[n]2$ has degree $n$."
              },
              {
                "time": "08:00",
                "label": "Reduction mod p",
                "math": "\\bar f\\ \\text{irreducible in}\\ \\mathbb{F}_p[x],\\ \\deg\\bar f=\\deg f\\implies f\\ \\text{irreducible over}\\ \\mathbb{Q}",
                "caption": "$x^3+x+1$ has no root in $\\mathbb{F}_2$, so it is irreducible there and hence over $\\mathbb{Q}$."
              },
              {
                "time": "10:00",
                "label": "Cyclotomic example",
                "math": "\\zeta=e^{2\\pi i/5},\\qquad x^4+x^3+x^2+x+1",
                "caption": "$\\zeta$ is a root of $\\frac{x^5-1}{x-1}$. Substituting $x+1$ and applying Eisenstein at $5$ shows this is the minimal polynomial."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u4-l04-ex1",
                "type": "mcq",
                "question": "What is the minimal polynomial of $\\sqrt2+\\sqrt3$ over $\\mathbb{Q}$?",
                "options": [
                  "$x^2-5$",
                  "$x^4-10x^2+1$",
                  "$x^4-5x^2+6$",
                  "$x^2-2\\sqrt6x-1$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $(\\sqrt2+\\sqrt3)^2=5+2\\sqrt6\\neq 5$.",
                  "Correct! $(\\alpha^2-5)^2=24$ gives this quartic, and $[\\mathbb{Q}(\\alpha):\\mathbb{Q}]=4$ shows it is irreducible.",
                  "Incorrect: that is $(x^2-2)(x^2-3)$, whose roots are $\\pm\\sqrt2,\\pm\\sqrt3$.",
                  "Incorrect: the coefficients are not rational."
                ],
                "hints": [
                  "Square $\\alpha$, isolate the radical, square again.",
                  "$\\alpha^2=5+2\\sqrt6$.",
                  "$(\\alpha^2-5)^2=24$."
                ]
              },
              {
                "id": "m373k-u4-l04-ex2",
                "type": "mcq",
                "question": "Which polynomial is irreducible over $\\mathbb{Q}$?",
                "options": [
                  "$x^3-1$",
                  "$x^3-3x-1$",
                  "$x^3+x^2+x+1$",
                  "$x^2-9$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $1$ is a root.",
                  "Correct! A cubic is reducible over $\\mathbb{Q}$ only if it has a rational root, and $\\pm1$ are not roots.",
                  "Incorrect: $-1$ is a root: $-1+1-1+1=0$.",
                  "Incorrect: $(x-3)(x+3)$."
                ],
                "hints": [
                  "For degree $\\le3$, reducible means there is a root.",
                  "Rational root test: candidates $\\pm1$.",
                  "Evaluate at $1$ and $-1$."
                ]
              },
              {
                "id": "m373k-u4-l04-ex3",
                "type": "mcq",
                "question": "Eisenstein's criterion at which prime shows $x^4+6x^2+12x+3$ is irreducible?",
                "options": [
                  "$2$",
                  "$3$",
                  "$5$",
                  "none"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $2\\nmid 3$.",
                  "Correct! $3$ divides $6$, $12$ and $3$, does not divide the leading coefficient $1$, and $9\\nmid 3$.",
                  "Incorrect: $5\\nmid 6$.",
                  "Incorrect: $p=3$ works."
                ],
                "hints": [
                  "$p$ must divide every non-leading coefficient.",
                  "Common prime factors of $6$, $12$, $3$.",
                  "Check $p^2\\nmid a_0$."
                ]
              },
              {
                "id": "m373k-u4-l04-ex4",
                "type": "mcq",
                "question": "Over $\\mathbb{F}_2$, which polynomial is irreducible?",
                "options": [
                  "$x^2+1$",
                  "$x^2+x$",
                  "$x^2+x+1$",
                  "$x^3+1$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: $x^2+1=(x+1)^2$ over $\\mathbb{F}_2$.",
                  "Incorrect: $x(x+1)$.",
                  "Correct! Neither $0$ nor $1$ is a root, and a quadratic with no root is irreducible.",
                  "Incorrect: $1$ is a root."
                ],
                "hints": [
                  "Check the two elements $0$ and $1$ of $\\mathbb{F}_2$.",
                  "A quadratic or cubic without roots is irreducible.",
                  "In $\\mathbb{F}_2$, $1+1=0$."
                ]
              },
              {
                "id": "m373k-u4-l04-ex5",
                "type": "proof",
                "question": "Let $F$ be a field and $f\\in F[x]$ of degree $2$ or $3$. Prove that $f$ is irreducible if and only if it has no root in $F$.",
                "hints": [
                  "A root $a$ gives a linear factor $x-a$.",
                  "Conversely, a factorization into lower-degree factors must include a factor of degree $1$.",
                  "A degree-$1$ factor $cx+d$ has a root $-d/c$."
                ],
                "rubric": [
                  "($\\Rightarrow$) If $f(a)=0$, then $f=(x-a)g$ with $\\deg g\\ge 1$, so $f$ is reducible.",
                  "($\\Leftarrow$) If $f=gh$ with $\\deg g,\\deg h\\ge1$, then $\\deg g+\\deg h\\le3$.",
                  "So one of $g,h$ has degree $1$.",
                  "A linear factor $cx+d$ gives the root $-d/c$ of $f$."
                ],
                "modelProof": "If $f$ has a root $a\\in F$, then $f=(x-a)g$ with $\\deg g=\\deg f-1\\ge 1$, so $f$ is reducible. Conversely, suppose $f=gh$ with $\\deg g,\\deg h\\ge 1$. Since $\\deg g+\\deg h=\\deg f\\le 3$, one of the factors, say $g=cx+d$ with $c\\neq 0$, has degree $1$. Then $g(-d/c)=0$, so $-d/c$ is a root of $f$. $\\blacksquare$"
              },
              {
                "id": "m373k-u4-l04-ex6",
                "type": "proof",
                "question": "Let $\\alpha=\\sqrt2+\\sqrt3$. Prove that $\\mathbb{Q}(\\alpha)=\\mathbb{Q}(\\sqrt2,\\sqrt3)$, and conclude that $x^4-10x^2+1$ is the minimal polynomial of $\\alpha$.",
                "hints": [
                  "One inclusion is clear.",
                  "Compute $\\alpha^3$ and express $\\sqrt2$ using $\\alpha$ and $\\alpha^3$.",
                  "Use $[\\mathbb{Q}(\\sqrt2,\\sqrt3):\\mathbb{Q}]=4$."
                ],
                "rubric": [
                  "Note $\\mathbb{Q}(\\alpha)\\subseteq\\mathbb{Q}(\\sqrt2,\\sqrt3)$.",
                  "Compute $\\alpha^3=11\\sqrt2+9\\sqrt3$ and $\\alpha^3-9\\alpha=2\\sqrt2$.",
                  "Conclude $\\sqrt2$ and $\\sqrt3=\\alpha-\\sqrt2$ lie in $\\mathbb{Q}(\\alpha)$.",
                  "Then $\\deg\\alpha=4$, and the monic quartic $x^4-10x^2+1$ with root $\\alpha$ must be the minimal polynomial."
                ],
                "modelProof": "Clearly $\\alpha\\in\\mathbb{Q}(\\sqrt2,\\sqrt3)$, so $\\mathbb{Q}(\\alpha)\\subseteq\\mathbb{Q}(\\sqrt2,\\sqrt3)$. Expanding, $\\alpha^3=2\\sqrt2+3\\cdot2\\sqrt3+3\\cdot3\\sqrt2+3\\sqrt3=11\\sqrt2+9\\sqrt3$, so $\\alpha^3-9\\alpha=2\\sqrt2$. Hence $\\sqrt2=\\frac{\\alpha^3-9\\alpha}{2}\\in\\mathbb{Q}(\\alpha)$ and $\\sqrt3=\\alpha-\\sqrt2\\in\\mathbb{Q}(\\alpha)$, giving equality. Therefore $[\\mathbb{Q}(\\alpha):\\mathbb{Q}]=4$ (previous lesson), so the minimal polynomial of $\\alpha$ has degree $4$. Since $\\alpha^2=5+2\\sqrt6$ gives $(\\alpha^2-5)^2=24$, $\\alpha$ is a root of the monic quartic $x^4-10x^2+1$, which is divisible by the minimal polynomial and has the same degree, so they are equal. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u4-l05",
            "title": "Ruler and Compass Constructions",
            "duration": "14:00",
            "videoUrl": "",
            "theorem": "Artin 15.5: Starting from $0$ and $1$, the constructible points are those reached by intersecting lines and circles. Theorem 15.5.6: if $p$ is constructible, there is a chain $\\mathbb{Q}=F_0\\subset F_1\\subset\\cdots\\subset F_n$ with $[F_{i}:F_{i-1}]=2$ and the coordinates of $p$ in $F_n$. Corollary 15.5.7: a constructible real number is algebraic of degree a power of $2$. Hence the cube cannot be doubled, and by Lemma 15.5.8 the $60^\\circ$ angle cannot be trisected.",
            "steps": [
              {
                "time": "00:00",
                "label": "The rules",
                "math": "\\text{lines through two known points},\\quad\\text{circles with known center through a known point}",
                "caption": "New points come from intersecting two such lines or circles. Start from $(0,0)$ and $(1,0)$."
              },
              {
                "time": "02:00",
                "label": "Constructible numbers form a field",
                "math": "a,b\\ \\text{constructible}\\implies a\\pm b,\\ ab,\\ a/b,\\ \\sqrt a\\ \\text{constructible}",
                "caption": "Similar triangles give products and quotients; a semicircle on a segment of length $1+a$ gives $\\sqrt a$."
              },
              {
                "time": "04:00",
                "label": "Each step has degree at most 2",
                "math": "\\text{line}\\cap\\text{line}:\\ \\text{linear},\\quad \\text{line}\\cap\\text{circle},\\ \\text{circle}\\cap\\text{circle}:\\ \\text{quadratic}",
                "caption": "Each new coordinate lies in a field obtained from the previous one by adjoining a square root."
              },
              {
                "time": "06:00",
                "label": "The degree is a power of 2",
                "math": "[\\mathbb{Q}(a):\\mathbb{Q}]\\ \\Big|\\ [F_n:\\mathbb{Q}]=2^n",
                "caption": "By the tower law. This single fact rules out all three classical problems that involve cube roots or cubics."
              },
              {
                "time": "08:00",
                "label": "Doubling the cube",
                "math": "[\\mathbb{Q}(\\sqrt[3]2):\\mathbb{Q}]=3",
                "caption": "A cube of volume $2$ needs side $\\sqrt[3]2$, whose degree is not a power of $2$. Impossible."
              },
              {
                "time": "10:00",
                "label": "Trisecting 60 degrees",
                "math": "\\cos3\\theta=4\\cos^3\\theta-3\\cos\\theta,\\qquad 8c^3-6c-1=0\\ \\ (c=\\cos20^\\circ)",
                "caption": "With $u=2c$: $u^3-3u-1=0$, irreducible over $\\mathbb{Q}$. So $\\cos20^\\circ$ has degree $3$ and is not constructible."
              },
              {
                "time": "12:00",
                "label": "Regular polygons",
                "math": "p\\ \\text{prime},\\ p\\text{-gon constructible}\\implies p=2^{2^k}+1",
                "caption": "$[\\mathbb{Q}(\\zeta_p):\\mathbb{Q}]=p-1$ must be a power of $2$ (Corollary 15.5.9). Gauss constructed the $17$-gon; the $7$-gon is impossible."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u4-l05-ex1",
                "type": "mcq",
                "question": "Which real number is constructible?",
                "options": [
                  "$\\sqrt[3]2$",
                  "$\\sqrt{2+\\sqrt3}$",
                  "$\\cos20^\\circ$",
                  "$\\pi$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: its degree over $\\mathbb{Q}$ is $3$.",
                  "Correct! It is obtained by two square roots, so it lies in a tower of quadratic extensions.",
                  "Incorrect: it has degree $3$ (Lemma 15.5.8).",
                  "Incorrect: $\\pi$ is transcendental, so it is not even algebraic."
                ],
                "hints": [
                  "Constructible numbers come from repeated square roots.",
                  "Their degree over $\\mathbb{Q}$ is a power of $2$.",
                  "Which option uses only square roots?"
                ]
              },
              {
                "id": "m373k-u4-l05-ex2",
                "type": "mcq",
                "question": "Why can the cube not be doubled with ruler and compass?",
                "options": [
                  "$\\sqrt[3]2$ is transcendental",
                  "$[\\mathbb{Q}(\\sqrt[3]2):\\mathbb{Q}]=3$ is not a power of $2$",
                  "$\\sqrt[3]2$ is irrational",
                  "cubes cannot be drawn in the plane"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $\\sqrt[3]2$ is algebraic.",
                  "Correct! Constructible numbers have degree a power of $2$, and $x^3-2$ is irreducible.",
                  "Incorrect: $\\sqrt2$ is irrational but constructible.",
                  "Incorrect: the question is whether the length $\\sqrt[3]2$ can be constructed."
                ],
                "hints": [
                  "What length must be constructed?",
                  "What is its degree over $\\mathbb{Q}$?",
                  "Corollary 15.5.7."
                ]
              },
              {
                "id": "m373k-u4-l05-ex3",
                "type": "mcq",
                "question": "With $u=2\\cos20^\\circ$, which equation does $u$ satisfy?",
                "options": [
                  "$u^3-3u-1=0$",
                  "$u^2-u-1=0$",
                  "$u^3-3u+1=0$",
                  "$u^3-2=0$"
                ],
                "correctIndex": 0,
                "optionExplanations": [
                  "Correct! From $\\cos60^\\circ=\\tfrac12=4c^3-3c$, multiply by $2$ and set $u=2c$: $u^3-3u=1$.",
                  "Incorrect: that is satisfied by the golden ratio, related to the pentagon.",
                  "Incorrect: check the sign: $u^3-3u=2\\cos60^\\circ=1$.",
                  "Incorrect: that is the cube-doubling equation."
                ],
                "hints": [
                  "Use $\\cos3\\theta=4\\cos^3\\theta-3\\cos\\theta$ with $\\theta=20^\\circ$.",
                  "$\\cos60^\\circ=\\tfrac12$.",
                  "Multiply by $2$ and substitute $u=2c$."
                ]
              },
              {
                "id": "m373k-u4-l05-ex4",
                "type": "mcq",
                "question": "For which prime $p$ is the regular $p$-gon constructible?",
                "options": [
                  "$7$",
                  "$11$",
                  "$13$",
                  "$17$"
                ],
                "correctIndex": 3,
                "optionExplanations": [
                  "Incorrect: $p-1=6$ is not a power of $2$.",
                  "Incorrect: $p-1=10$ is not a power of $2$.",
                  "Incorrect: $p-1=12$ is not a power of $2$.",
                  "Correct! $17-1=16=2^4$; Gauss constructed the $17$-gon in 1796."
                ],
                "hints": [
                  "$[\\mathbb{Q}(\\zeta_p):\\mathbb{Q}]=p-1$.",
                  "This degree must be a power of $2$.",
                  "Check $p-1$ for each option."
                ]
              },
              {
                "id": "m373k-u4-l05-ex5",
                "type": "proof",
                "question": "Prove that $\\cos20^\\circ$ is not a constructible number. You may use Corollary 15.5.7.",
                "hints": [
                  "Find a cubic satisfied by $u=2\\cos20^\\circ$.",
                  "Show the cubic is irreducible over $\\mathbb{Q}$ with the rational root test.",
                  "Compute the degree and compare with powers of $2$."
                ],
                "rubric": [
                  "Use $\\cos3\\theta=4\\cos^3\\theta-3\\cos\\theta$ to get $u^3-3u-1=0$.",
                  "Check $\\pm1$ are not roots, so the cubic is irreducible.",
                  "Conclude $[\\mathbb{Q}(u):\\mathbb{Q}]=3$, and $\\mathbb{Q}(u)=\\mathbb{Q}(\\cos20^\\circ)$.",
                  "Since $3$ is not a power of $2$, $\\cos20^\\circ$ is not constructible."
                ],
                "modelProof": "Let $c=\\cos20^\\circ$. Then $\\tfrac12=\\cos60^\\circ=4c^3-3c$, so $u=2c$ satisfies $u^3-3u-1=0$. A rational root of this monic integer cubic would be $\\pm1$, but $1-3-1\\neq0$ and $-1+3-1\\neq0$. A cubic with no root in $\\mathbb{Q}$ is irreducible, so $x^3-3x-1$ is the minimal polynomial of $u$ and $[\\mathbb{Q}(u):\\mathbb{Q}]=3$. Since $\\mathbb{Q}(c)=\\mathbb{Q}(u)$, $c$ has degree $3$. By Corollary 15.5.7 a constructible number has degree a power of $2$, so $\\cos20^\\circ$ is not constructible. Hence the $60^\\circ$ angle cannot be trisected. $\\blacksquare$"
              },
              {
                "id": "m373k-u4-l05-ex6",
                "type": "proof",
                "question": "Let $F\\subseteq\\mathbb{R}$ be a field and let $\\ell$ be a line and $C$ a circle whose equations have coefficients in $F$. Prove that the coordinates of any intersection point lie in $F$ or in $F(\\sqrt d)$ for some $d\\in F$, $d>0$.",
                "hints": [
                  "Write $\\ell$ as $ax+by=c$ and $C$ as $x^2+y^2+ex+fy+g=0$ with coefficients in $F$.",
                  "Solve the linear equation for one variable and substitute.",
                  "Use the quadratic formula."
                ],
                "rubric": [
                  "Assume $b\\neq 0$ (otherwise solve for $x$) and write $y=(c-ax)/b$.",
                  "Substitute into the circle to get a quadratic $Ax^2+Bx+D=0$ with $A,B,D\\in F$.",
                  "By the quadratic formula, $x\\in F(\\sqrt d)$ with $d=B^2-4AD\\in F$, $d\\ge 0$ for a real point.",
                  "Then $y=(c-ax)/b$ lies in the same field."
                ],
                "modelProof": "Write $\\ell$: $ax+by=c$ and $C$: $x^2+y^2+ex+fy+g=0$ with $a,b,c,e,f,g\\in F$. Suppose $b\\neq 0$ (the case $b=0$ is symmetric, with the roles of $x$ and $y$ exchanged). Then $y=(c-ax)/b$, and substituting into the circle gives $Ax^2+Bx+D=0$ with $A=1+a^2/b^2\\neq 0$ and $B,D\\in F$. By the quadratic formula, $x=\\frac{-B\\pm\\sqrt d}{2A}$ with $d=B^2-4AD\\in F$; since the intersection point is real, $d\\ge 0$. So $x\\in F(\\sqrt d)$, which is $F$ if $\\sqrt d\\in F$. Then $y=(c-ax)/b$ is in the same field. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u4-l06",
            "title": "Adjoining Roots and Splitting Fields",
            "duration": "12:00",
            "videoUrl": "",
            "theorem": "Artin 15.6: Kronecker's theorem: if $f\\in F[x]$ is irreducible, then $K=F[x]/(f)$ is a field extension of $F$ of degree $\\deg f$ in which $\\alpha=\\bar x$ is a root of $f$. Repeating, every polynomial of degree $n$ splits into linear factors in some extension of degree at most $n!$. If $\\alpha,\\beta$ are roots of the same irreducible $f$, then $F(\\alpha)\\approx F(\\beta)$ by an isomorphism sending $\\alpha\\mapsto\\beta$ (Proposition 15.2.8).",
            "steps": [
              {
                "time": "00:00",
                "label": "Kronecker's construction",
                "math": "K=F[x]/(f),\\qquad \\alpha=\\bar x,\\qquad f(\\alpha)=0",
                "caption": "$(f)$ is maximal because $f$ is irreducible, so $K$ is a field. $F$ embeds as the constant cosets."
              },
              {
                "time": "02:00",
                "label": "Degree",
                "math": "[K:F]=\\deg f,\\qquad K=F(\\alpha)",
                "caption": "Basis $1,\\alpha,\\dots,\\alpha^{n-1}$ by Proposition 11.5.5."
              },
              {
                "time": "04:00",
                "label": "Every polynomial has a root somewhere",
                "math": "g\\in F[x],\\ \\deg g\\ge1\\implies g\\ \\text{has a root in some}\\ K/F",
                "caption": "Apply Kronecker to an irreducible factor of $g$."
              },
              {
                "time": "06:00",
                "label": "Splitting fields",
                "math": "f=c(x-\\alpha_1)\\cdots(x-\\alpha_n)\\ \\text{in}\\ K=F(\\alpha_1,\\dots,\\alpha_n)",
                "caption": "Adjoin roots one at a time. Each step has degree at most the remaining degree, so $[K:F]\\le n!$."
              },
              {
                "time": "08:00",
                "label": "Example",
                "math": "x^3-2:\\quad \\mathbb{Q}(\\sqrt[3]2,\\omega),\\quad \\omega=e^{2\\pi i/3},\\quad [K:\\mathbb{Q}]=6",
                "caption": "$\\mathbb{Q}(\\sqrt[3]2)\\subset\\mathbb{R}$ contains only one root. Adjoining $\\omega$, a root of $x^2+x+1$, gives the other two."
              },
              {
                "time": "10:00",
                "label": "Conjugate roots give isomorphic fields",
                "math": "F(\\alpha)\\xrightarrow{\\ \\sim\\ }F(\\beta),\\quad \\alpha\\mapsto\\beta",
                "caption": "Both are isomorphic to $F[x]/(f)$. So $\\mathbb{Q}(\\sqrt[3]2)\\approx\\mathbb{Q}(\\omega\\sqrt[3]2)$, even though one is real and the other is not."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u4-l06-ex1",
                "type": "mcq",
                "question": "What is the degree of the splitting field of $x^3-2$ over $\\mathbb{Q}$?",
                "options": [
                  "$2$",
                  "$3$",
                  "$6$",
                  "$9$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: $\\mathbb{Q}(\\sqrt[3]2)$ already has degree $3$.",
                  "Incorrect: $\\mathbb{Q}(\\sqrt[3]2)\\subset\\mathbb{R}$ does not contain the complex roots.",
                  "Correct! $[\\mathbb{Q}(\\sqrt[3]2):\\mathbb{Q}]=3$ and $\\omega\\notin\\mathbb{R}$ has degree $2$ over it: $3\\cdot 2=6$.",
                  "Incorrect: the second step has degree $2$, not $3$."
                ],
                "hints": [
                  "Adjoin $\\sqrt[3]2$ first.",
                  "The other roots are $\\omega\\sqrt[3]2$ and $\\omega^2\\sqrt[3]2$.",
                  "$\\omega$ is a root of $x^2+x+1$."
                ]
              },
              {
                "id": "m373k-u4-l06-ex2",
                "type": "mcq",
                "question": "Let $K=\\mathbb{F}_2[x]/(x^2+x+1)$. Which statement is true?",
                "options": [
                  "$K$ is not a field",
                  "$K$ is a field with $4$ elements",
                  "$K$ is a field with $3$ elements",
                  "$K\\approx\\mathbb{F}_2\\times\\mathbb{F}_2$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $x^2+x+1$ is irreducible over $\\mathbb{F}_2$, so the ideal is maximal.",
                  "Correct! It is a degree-$2$ extension of $\\mathbb{F}_2$, so it has $2^2=4$ elements.",
                  "Incorrect: a vector space of dimension $2$ over $\\mathbb{F}_2$ has $4$ elements.",
                  "Incorrect: a product ring has zero divisors; $K$ is a field."
                ],
                "hints": [
                  "Is $x^2+x+1$ irreducible over $\\mathbb{F}_2$?",
                  "Count elements $c_0+c_1\\alpha$.",
                  "Quotient by a maximal ideal is a field."
                ]
              },
              {
                "id": "m373k-u4-l06-ex3",
                "type": "mcq",
                "question": "Over which field does $x^2+1$ have a root?",
                "options": [
                  "$\\mathbb{Q}$",
                  "$\\mathbb{R}$",
                  "$\\mathbb{F}_3$",
                  "$\\mathbb{F}_5$"
                ],
                "correctIndex": 3,
                "optionExplanations": [
                  "Incorrect: $x^2=-1$ has no rational solution.",
                  "Incorrect: squares of reals are nonnegative.",
                  "Incorrect: the squares mod $3$ are $0,1$, and $-1\\equiv 2$.",
                  "Correct! $2^2=4\\equiv-1\\pmod5$."
                ],
                "hints": [
                  "Look for $a$ with $a^2=-1$.",
                  "In $\\mathbb{F}_p$, test each element.",
                  "$-1\\equiv4\\pmod5$."
                ]
              },
              {
                "id": "m373k-u4-l06-ex4",
                "type": "mcq",
                "question": "Let $f$ be irreducible over $F$ with roots $\\alpha$ and $\\beta$ in some extension. Which is true?",
                "options": [
                  "$F(\\alpha)=F(\\beta)$ always",
                  "$F(\\alpha)\\approx F(\\beta)$ by an isomorphism fixing $F$ and sending $\\alpha\\mapsto\\beta$",
                  "$F(\\alpha)$ and $F(\\beta)$ have different degrees",
                  "$\\alpha=\\beta$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $\\mathbb{Q}(\\sqrt[3]2)\\neq\\mathbb{Q}(\\omega\\sqrt[3]2)$ as subsets of $\\mathbb{C}$.",
                  "Correct! Both are isomorphic to $F[x]/(f)$.",
                  "Incorrect: both have degree $\\deg f$.",
                  "Incorrect: an irreducible polynomial may have several distinct roots."
                ],
                "hints": [
                  "What is $F(\\alpha)$ isomorphic to?",
                  "$F[x]/(f)$ does not depend on which root you choose.",
                  "Think of $\\sqrt[3]2$ and $\\omega\\sqrt[3]2$."
                ]
              },
              {
                "id": "m373k-u4-l06-ex5",
                "type": "proof",
                "question": "(Kronecker) Let $f\\in F[x]$ be irreducible of degree $n$. Prove that $K=F[x]/(f)$ is a field containing a copy of $F$, that $\\alpha=\\bar x$ is a root of $f$, and that $[K:F]=n$.",
                "hints": [
                  "$(f)$ is a maximal ideal.",
                  "The composite $F\\to F[x]\\to K$ is injective because $F$ is a field.",
                  "Compute $f(\\alpha)$ and use Proposition 11.5.5 for the degree."
                ],
                "rubric": [
                  "Show $K$ is a field since $(f)$ is maximal.",
                  "Show $F\\to K$ is injective (a homomorphism from a field), so $F$ embeds in $K$.",
                  "Compute $f(\\alpha)=\\overline{f(x)}=0$.",
                  "Use the basis $1,\\alpha,\\dots,\\alpha^{n-1}$ to get $[K:F]=n$ (taking $f$ monic)."
                ],
                "modelProof": "Since $f$ is irreducible, $(f)$ is a maximal ideal of $F[x]$, so $K=F[x]/(f)$ is a field. The composite $F\\to F[x]\\to K$ is a ring homomorphism from a field to a nonzero ring, hence injective, so $F$ is identified with a subfield of $K$. Writing $f=\\sum a_ix^i$, we get $f(\\alpha)=\\sum a_i\\bar x^i=\\overline{f(x)}=\\bar 0$, so $\\alpha$ is a root of $f$ in $K$. Dividing $f$ by its leading coefficient does not change $(f)$, so we may assume $f$ monic; by Proposition 11.5.5, $1,\\alpha,\\dots,\\alpha^{n-1}$ is a basis of $K$ over $F$, and $[K:F]=n$. $\\blacksquare$"
              },
              {
                "id": "m373k-u4-l06-ex6",
                "type": "proof",
                "question": "Prove that every polynomial $g\\in F[x]$ of degree $n\\ge 1$ splits into linear factors in some extension $K$ of $F$ with $[K:F]\\le n!$.",
                "hints": [
                  "Induct on $n$.",
                  "Adjoin a root $\\alpha$ of an irreducible factor of $g$.",
                  "Factor $g=(x-\\alpha)h$ over $F(\\alpha)$ and apply the induction hypothesis to $h$."
                ],
                "rubric": [
                  "Base case $n=1$: $g$ is already linear, take $K=F$.",
                  "Choose an irreducible factor $p$ of $g$ and $F_1=F[x]/(p)$, so $g$ has a root $\\alpha$ in $F_1$ and $[F_1:F]=\\deg p\\le n$.",
                  "Write $g=(x-\\alpha)h$ in $F_1[x]$ with $\\deg h=n-1$.",
                  "By induction $h$ splits in $K\\supseteq F_1$ with $[K:F_1]\\le(n-1)!$; the tower law gives $[K:F]\\le n!$."
                ],
                "modelProof": "Induct on $n$. If $n=1$, $g$ is linear and $K=F$ works. Let $n\\ge 2$, and let $p$ be an irreducible factor of $g$. By Kronecker's theorem, $F_1=F[x]/(p)$ is an extension of degree $\\deg p\\le n$ containing a root $\\alpha$ of $p$, hence of $g$. In $F_1[x]$, $g=(x-\\alpha)h$ with $\\deg h=n-1$. By the induction hypothesis there is $K\\supseteq F_1$ with $[K:F_1]\\le(n-1)!$ in which $h$ splits into linear factors; then so does $g$. By the tower law, $[K:F]=[K:F_1][F_1:F]\\le(n-1)!\\cdot n=n!$. $\\blacksquare$"
              }
            ]
          },
          {
            "id": "m373k-u4-l07",
            "title": "Finite Fields",
            "duration": "14:00",
            "videoUrl": "",
            "theorem": "Theorem 15.7.3 (Artin): Let $q=p^r$. (a) There is a field of order $q$, and any two are isomorphic; call it $\\mathbb{F}_q$. (b) Its elements are exactly the roots of $x^q-x$, and $x^q-x$ factors over $\\mathbb{F}_p$ as the product of the monic irreducible polynomials whose degree divides $r$. (c) The multiplicative group $\\mathbb{F}_q^\\times$ is cyclic of order $q-1$. Every finite field has order a prime power.",
            "steps": [
              {
                "time": "00:00",
                "label": "The order is a prime power",
                "math": "\\operatorname{char}K=p,\\quad [K:\\mathbb{F}_p]=r\\implies|K|=p^r",
                "caption": "A finite field has characteristic $p$, and as an $\\mathbb{F}_p$-vector space of dimension $r$ it has $p^r$ elements. There is no field with $6$ elements."
              },
              {
                "time": "02:00",
                "label": "Every element is a root of $x^q-x$",
                "math": "a\\in\\mathbb{F}_q^\\times\\implies a^{q-1}=1\\implies a^q=a",
                "caption": "Lagrange's theorem in the group $\\mathbb{F}_q^\\times$ of order $q-1$. Also $0^q=0$. So $x^q-x=\\prod_{a\\in\\mathbb{F}_q}(x-a)$."
              },
              {
                "time": "04:00",
                "label": "Example: F4",
                "math": "\\mathbb{F}_4=\\mathbb{F}_2[x]/(x^2+x+1)=\\{0,1,\\alpha,\\alpha+1\\},\\qquad \\alpha^2=\\alpha+1",
                "caption": "$x^4-x=x(x+1)(x^2+x+1)$ over $\\mathbb{F}_2$: the irreducibles of degree $1$ and $2$."
              },
              {
                "time": "06:00",
                "label": "The multiplicative group is cyclic",
                "math": "\\mathbb{F}_q^\\times\\approx C_{q-1}",
                "caption": "For each $d\\mid q-1$ there are at most $d$ solutions of $x^d=1$; a finite abelian group with this property is cyclic. In $\\mathbb{F}_7$, $3$ generates: $3,2,6,4,5,1$."
              },
              {
                "time": "08:00",
                "label": "Factoring $x^q-x$",
                "math": "x^{p^r}-x=\\prod_{\\substack{g\\ \\text{monic irred.}\\\\ \\deg g\\,\\mid\\, r}}g(x)",
                "caption": "Counting degrees gives the number of irreducible polynomials. Over $\\mathbb{F}_2$: $2^3=2\\cdot1+3\\cdot2$, so there are $2$ irreducible cubics."
              },
              {
                "time": "10:00",
                "label": "Subfields",
                "math": "\\mathbb{F}_{p^s}\\subseteq\\mathbb{F}_{p^r}\\iff s\\mid r",
                "caption": "By the tower law. $\\mathbb{F}_{16}$ contains $\\mathbb{F}_4$ but not $\\mathbb{F}_8$."
              },
              {
                "time": "12:00",
                "label": "Existence and uniqueness",
                "math": "\\mathbb{F}_q=\\{\\text{roots of}\\ x^q-x\\}\\subseteq\\text{splitting field}",
                "caption": "The roots of $x^q-x$ are distinct (its derivative is $-1$) and form a field because $a\\mapsto a^q$ respects $+$ and $\\times$."
              }
            ],
            "exercises": [
              {
                "id": "m373k-u4-l07-ex1",
                "type": "mcq",
                "question": "Which of these is the order of some finite field?",
                "options": [
                  "$6$",
                  "$10$",
                  "$27$",
                  "$12$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: $6=2\\cdot3$ is not a prime power.",
                  "Incorrect: $10=2\\cdot 5$ is not a prime power.",
                  "Correct! $27=3^3$, and $\\mathbb{F}_{27}=\\mathbb{F}_3[x]/(f)$ for an irreducible cubic $f$.",
                  "Incorrect: $12$ is not a prime power."
                ],
                "hints": [
                  "Finite fields have order $p^r$.",
                  "Factor each option.",
                  "Which is a power of a single prime?"
                ]
              },
              {
                "id": "m373k-u4-l07-ex2",
                "type": "mcq",
                "question": "In $\\mathbb{F}_4=\\{0,1,\\alpha,\\alpha+1\\}$ with $\\alpha^2=\\alpha+1$, compute $\\alpha^3$.",
                "options": [
                  "$0$",
                  "$1$",
                  "$\\alpha$",
                  "$\\alpha+1$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: a field has no nonzero nilpotents.",
                  "Correct! $\\alpha^3=\\alpha\\cdot\\alpha^2=\\alpha^2+\\alpha=(\\alpha+1)+\\alpha=1$, since $2\\alpha=0$. Indeed $|\\mathbb{F}_4^\\times|=3$.",
                  "Incorrect: that would mean $\\alpha^2=1$.",
                  "Incorrect: that is $\\alpha^2$."
                ],
                "hints": [
                  "$\\alpha^3=\\alpha\\cdot\\alpha^2$.",
                  "Substitute $\\alpha^2=\\alpha+1$.",
                  "In characteristic $2$, $\\alpha+\\alpha=0$."
                ]
              },
              {
                "id": "m373k-u4-l07-ex3",
                "type": "mcq",
                "question": "Which element generates the cyclic group $\\mathbb{F}_7^\\times$?",
                "options": [
                  "$2$",
                  "$3$",
                  "$6$",
                  "$1$"
                ],
                "correctIndex": 1,
                "optionExplanations": [
                  "Incorrect: $2^3=8\\equiv1$, so $2$ has order $3$.",
                  "Correct! The powers of $3$ are $3,2,6,4,5,1$: all six nonzero classes.",
                  "Incorrect: $6\\equiv-1$ has order $2$.",
                  "Incorrect: $1$ has order $1$."
                ],
                "hints": [
                  "A generator has order $6$.",
                  "Compute successive powers modulo $7$.",
                  "Its order must not divide $2$ or $3$."
                ]
              },
              {
                "id": "m373k-u4-l07-ex4",
                "type": "mcq",
                "question": "How many monic irreducible polynomials of degree $2$ are there over $\\mathbb{F}_3$?",
                "options": [
                  "$1$",
                  "$2$",
                  "$3$",
                  "$9$"
                ],
                "correctIndex": 2,
                "optionExplanations": [
                  "Incorrect: use the factorization of $x^9-x$.",
                  "Incorrect: count with degrees: $9=3\\cdot 1+2\\cdot N$.",
                  "Correct! $x^9-x$ is the product of the $3$ linear monic polynomials and the $N$ irreducible quadratics, so $9=3+2N$ and $N=3$.",
                  "Incorrect: there are $9$ monic quadratics in total, but most are reducible."
                ],
                "hints": [
                  "Factor $x^{3^2}-x$ over $\\mathbb{F}_3$.",
                  "Its irreducible factors have degree $1$ or $2$.",
                  "Compare degrees: $9=1\\cdot3+2N$."
                ]
              },
              {
                "id": "m373k-u4-l07-ex5",
                "type": "proof",
                "question": "Let $K$ be a finite field. Prove that $|K|=p^r$ for some prime $p$ and $r\\ge 1$.",
                "hints": [
                  "The characteristic of $K$ is not $0$, since $\\mathbb{Z}$ does not embed in a finite set.",
                  "So $\\operatorname{char}K=p$ is prime and $\\mathbb{F}_p\\subseteq K$.",
                  "View $K$ as a finite-dimensional $\\mathbb{F}_p$-vector space."
                ],
                "rubric": [
                  "Show $\\operatorname{char}K\\neq 0$ by finiteness, so it is a prime $p$.",
                  "Identify the prime field $\\mathbb{F}_p\\subseteq K$.",
                  "Note $K$ is an $\\mathbb{F}_p$-vector space of some finite dimension $r\\ge1$.",
                  "Count: a basis gives $|K|=p^r$."
                ],
                "modelProof": "Since $K$ is finite, the elements $n\\cdot 1$ cannot all be distinct, so $\\mathbb{Z}\\to K$ has nonzero kernel and $K$ has positive characteristic, which is a prime $p$. Then $K$ contains the prime field $\\mathbb{F}_p$, and $K$ is a vector space over $\\mathbb{F}_p$, finite-dimensional because $K$ is finite. If $v_1,\\dots,v_r$ is a basis ($r\\ge 1$ since $K\\neq 0$), every element is uniquely $c_1v_1+\\cdots+c_rv_r$ with $c_i\\in\\mathbb{F}_p$, so $|K|=p^r$. $\\blacksquare$"
              },
              {
                "id": "m373k-u4-l07-ex6",
                "type": "proof",
                "question": "Let $K$ be a field with $q$ elements. Prove that $a^q=a$ for every $a\\in K$, and hence $x^q-x=\\prod_{a\\in K}(x-a)$ in $K[x]$.",
                "hints": [
                  "Apply Lagrange's theorem to the group $K^\\times$.",
                  "Handle $a=0$ separately.",
                  "A polynomial of degree $q$ with $q$ distinct roots."
                ],
                "rubric": [
                  "For $a\\neq 0$, $|K^\\times|=q-1$ gives $a^{q-1}=1$, so $a^q=a$.",
                  "For $a=0$, $0^q=0$.",
                  "So all $q$ elements of $K$ are roots of $x^q-x$, giving the factor $\\prod(x-a)$.",
                  "Both sides are monic of degree $q$, so they are equal."
                ],
                "modelProof": "The group $K^\\times$ has order $q-1$, so by Lagrange's theorem $a^{q-1}=1$ for every $a\\neq0$, and then $a^q=a$. Also $0^q=0$. Thus every $a\\in K$ is a root of $x^q-x$, so each $x-a$ divides it. The factors $x-a$ for distinct $a$ are pairwise coprime, so $\\prod_{a\\in K}(x-a)$ divides $x^q-x$. Both are monic of degree $q$, so they are equal. $\\blacksquare$"
              }
            ]
          }
        ]
      }
    ]
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
const getClaudePrompt = (targetCourseId = "m373k") => String.raw`You are an expert professor authoring course content for Axiom Academy.

CRITICAL JSON & LATEX ESCAPING RULES:
1. Output ONLY raw, valid JSON. Do NOT wrap in markdown code fences.
2. DOUBLE-ESCAPE ALL BACKSLASHES in JSON strings so JSON.parse() succeeds without turning \t, \f, \n, \b into control characters:
   - Write "\\frac{a}{b}", "\\times", "\\text{im}(\\varphi)", "\\neq", "\\blacksquare", "\\subseteq", "\\trianglelefteq", "\\mathbb{Z}/n\\mathbb{Z}".
3. Start every unit title with "Unit X: ..." (e.g. "Unit 0: ...", "Unit 1: ...") so Axiom Academy automatically sorts units in numerical order.
4. Wrap all inline math in $...$ inside titles, captions, questions, options, optionExplanations, hints, rubric, and modelProof.
5. In each step's "math" field, write pure double-escaped LaTeX WITHOUT $ delimiters.
6. Do NOT include any user progress fields.

VALID JSON SCHEMA EXAMPLE:
{
  "targetCourseId": "${targetCourseId}",
  "unit": {
    "id": "m373k-u3",
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
// 4. SUPABASE SQL SETUP SCRIPT
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
  // Courses state (Always auto-sorted by Unit number!)
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem("axiom_courses_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return normalizeAndSortCourses(parsed);
      } catch {
        return normalizeAndSortCourses(INITIAL_COURSES);
      }
    }
    return normalizeAndSortCourses(INITIAL_COURSES);
  });

  // Cloud configuration
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

  // Admin Mode State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    return localStorage.getItem("axiom_admin_unlocked_v1") === "true";
  });
  const [adminPinInput, setAdminPinInput] = useState("");

  useEffect(() => {
    localStorage.setItem("axiom_admin_unlocked_v1", isAdminUnlocked ? "true" : "false");
  }, [isAdminUnlocked]);

  // Multi-Profile Directory
  const [profilesMap, setProfilesMap] = useState(() => {
    const saved = localStorage.getItem("axiom_profiles_map_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
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
  const [profileMode, setProfileMode] = useState("switch");
  const [newHandle, setNewHandle] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newPin, setNewPin] = useState("");
  const [newIsPublic, setNewIsPublic] = useState(true);
  const [switchPinPromptHandle, setSwitchPinPromptHandle] = useState(null);
  const [switchPinInput, setSwitchPinInput] = useState("");
  const [profileModalMsg, setProfileModalMsg] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);

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
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedCourseId, setSelectedCourseId] = useState("m373k");
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Which units are collapsed on the course page (remembered in this browser).
  const [collapsedUnits, setCollapsedUnits] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("axiom_collapsed_units_v1") || "{}");
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("axiom_collapsed_units_v1", JSON.stringify(collapsedUnits));
    } catch {}
  }, [collapsedUnits]);
  const toggleUnit = (unitId) =>
    setCollapsedUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }));
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
  // SUPABASE REST API HELPERS
  // ==========================================================================
  const getHeaders = (extra = {}) => ({
    apikey: cloudConfig.anonKey.trim(),
    Authorization: `Bearer ${cloudConfig.anonKey.trim()}`,
    "Content-Type": "application/json",
    ...extra
  });

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

  const pullProfileFromCloud = async (handleInput, pinInput) => {
    if (!isCloudConfigured) {
      setProfileModalMsg({
        type: "error",
        text: "Cloud is not configured yet."
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

  const pushCoursesToCloud = async (updatedCourses, force = false) => {
    if (!isCloudConfigured || (!isAdminUnlocked && !force)) return;
    try {
      const sorted = normalizeAndSortCourses(updatedCourses);
      const baseUrl = cloudConfig.url.trim().replace(/\/$/, "");
      await fetch(`${baseUrl}/rest/v1/axiom_courses`, {
        method: "POST",
        headers: getHeaders({ Prefer: "resolution=merge-duplicates" }),
        body: JSON.stringify({
          id: "master_curriculum",
          data: sorted,
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
        setCourses(normalizeAndSortCourses(data[0].data));
      }
    } catch {}
  };

  useEffect(() => {
    if (isCloudConfigured) {
      fetchPublicLeaderboard();
      pullCoursesFromCloud();
    }
  }, [isCloudConfigured]);

  // ==========================================================================
  // ADMIN COURSE & UNIT CLEANUP / DELETION HELPERS
  // ==========================================================================
  // 1-Click: Delete all courses EXCEPT M 373K (Algebra), remove empty units if desired, and sort Unit 0 first!
  const keepOnlyAlgebraAndSort = (removeEmptyUnits = false) => {
    setCourses((prev) => {
      const algebraOnly = prev.filter(
        (c) => c.id === "m373k" || c.code?.toUpperCase().includes("373K")
      );
      const targetList = algebraOnly.length > 0 ? algebraOnly : INITIAL_COURSES;
      const cleaned = targetList.map((c) => {
        const filteredUnits = removeEmptyUnits
          ? (c.units || []).filter((u) => (u.lessons || []).length > 0)
          : c.units || [];
        return {
          ...c,
          units: sortUnitsByNumber(filteredUnits)
        };
      });
      pushCoursesToCloud(cleaned, true);
      return cleaned;
    });
    setSelectedCourseId("m373k");
    setImportStatus({
      type: "success",
      msg: "Cleaned curriculum! Removed other courses, sorted Unit 0 to the top, and synced to Cloud."
    });
  };

  // Delete a specific course (Admin only)
  const deleteCourseById = (courseId) => {
    if (!isAdminUnlocked) return;
    setCourses((prev) => {
      const next = prev.filter((c) => c.id !== courseId);
      const safeNext = next.length > 0 ? next : normalizeAndSortCourses(INITIAL_COURSES);
      pushCoursesToCloud(safeNext, true);
      if (selectedCourseId === courseId) {
        setSelectedCourseId(safeNext[0].id);
      }
      return safeNext;
    });
  };

  // Delete a specific unit (e.g. an empty Unit 4 placeholder) from a course (Admin only)
  const deleteUnitById = (courseId, unitId) => {
    if (!isAdminUnlocked) return;
    setCourses((prev) => {
      const next = prev.map((c) => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          units: sortUnitsByNumber((c.units || []).filter((u) => u.id !== unitId))
        };
      });
      pushCoursesToCloud(next, true);
      return next;
    });
  };

  const activeCourse = useMemo(
    () => courses.find((c) => c.id === selectedCourseId) || courses[0],
    [courses, selectedCourseId]
  );

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

  // ==========================================================================
  // PROGRESS RECORDING & RESET FUNCTIONS
  // ==========================================================================
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

  const clearSingleExerciseProgress = (exId) => {
    resetExerciseInputs();
    setProfilesMap((prev) => {
      const currentProf = prev[activeProfile.handle] || activeProfile;
      const prevProg = currentProf.progress || { exercises: {}, points: 0, streakDays: 0 };
      if (!prevProg.exercises?.[exId]) return prev;

      const nextExercises = { ...prevProg.exercises };
      const oldLevel = nextExercises[exId]?.level;
      delete nextExercises[exId];

      const pointDeduction = oldLevel === "mastered" ? 100 : 50;
      const updatedProf = {
        ...currentProf,
        updatedAt: Date.now(),
        progress: {
          ...prevProg,
          points: Math.max(0, (prevProg.points || 0) - pointDeduction),
          exercises: nextExercises
        }
      };
      pushProfileToCloud(updatedProf);
      return { ...prev, [activeProfile.handle]: updatedProf };
    });
  };

  const clearCourseProgress = (course) => {
    if (!course) return;
    const courseExIds = new Set();
    course.units?.forEach((u) =>
      u.lessons?.forEach((l) =>
        l.exercises?.forEach((ex) => courseExIds.add(ex.id))
      )
    );

    setProfilesMap((prev) => {
      const currentProf = prev[activeProfile.handle] || activeProfile;
      const prevProg = currentProf.progress || { exercises: {}, points: 0, streakDays: 0 };
      const nextExercises = { ...(prevProg.exercises || {}) };
      let pointsRemoved = 0;

      courseExIds.forEach((id) => {
        if (nextExercises[id]) {
          pointsRemoved += nextExercises[id].level === "mastered" ? 100 : 50;
          delete nextExercises[id];
        }
      });

      const updatedProf = {
        ...currentProf,
        updatedAt: Date.now(),
        progress: {
          ...prevProg,
          points: Math.max(0, (prevProg.points || 0) - pointsRemoved),
          exercises: nextExercises
        }
      };
      pushProfileToCloud(updatedProf);
      return { ...prev, [activeProfile.handle]: updatedProf };
    });
    resetExerciseInputs();
  };

  const clearAllProfileProgress = () => {
    setProfilesMap((prev) => {
      const currentProf = prev[activeProfile.handle] || activeProfile;
      const updatedProf = {
        ...currentProf,
        updatedAt: Date.now(),
        progress: { exercises: {}, points: 0, streakDays: 0 }
      };
      pushProfileToCloud(updatedProf);
      return { ...prev, [activeProfile.handle]: updatedProf };
    });
    resetExerciseInputs();
    setProfileModalMsg({
      type: "success",
      text: `Cleared all completed work and reset @${activeProfile.handle} to 0 pts!`
    });
  };

  const deleteActiveProfile = async () => {
    const handleToDelete = activeProfile.handle;
    if (Object.keys(profilesMap).length <= 1) {
      clearAllProfileProgress();
      return;
    }
    if (isCloudConfigured) {
      try {
        const baseUrl = cloudConfig.url.trim().replace(/\/$/, "");
        await fetch(
          `${baseUrl}/rest/v1/axiom_profiles?handle=eq.${encodeURIComponent(handleToDelete)}`,
          { method: "DELETE", headers: getHeaders() }
        );
      } catch {}
    }
    setProfilesMap((prev) => {
      const next = { ...prev };
      delete next[handleToDelete];
      const remainingHandles = Object.keys(next);
      setActiveHandle(remainingHandles[0] || "scholar");
      return next;
    });
    fetchPublicLeaderboard();
    setProfileModalMsg({
      type: "success",
      text: `Deleted profile @${handleToDelete}.`
    });
  };

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
    if (profilesMap[cleanHandle]) {
      setProfileModalMsg({
        type: "error",
        text: `Handle @${cleanHandle} already exists on this device. Choose another or switch to it.`
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

  // Import JSON from Claude & Automatically Sort Units (Unit 0, Unit 1, Unit 2...)
  const handleImportJson = () => {
    if (!isAdminUnlocked) {
      setImportStatus({
        type: "error",
        msg: "Admin Mode is locked. Unlock Admin Mode in your Profile menu first."
      });
      return;
    }
    try {
      const cleaned = jsonInput.trim().replace(/^```json\s*/i, "").replace(/```$/, "");
      const parsed = JSON.parse(cleaned);

      if (parsed.targetCourseId && parsed.unit) {
        setCourses((prev) => {
          const next = prev.map((c) => {
            if (c.id !== parsed.targetCourseId) return c;
            const incomingNum = extractUnitNumber(parsed.unit);
            const exists = c.units.some(
              (u) =>
                u.id === parsed.unit.id ||
                (incomingNum !== 999 && extractUnitNumber(u) === incomingNum)
            );
            const updatedUnits = exists
              ? c.units.map((u) =>
                  u.id === parsed.unit.id ||
                  (incomingNum !== 999 && extractUnitNumber(u) === incomingNum)
                    ? parsed.unit
                    : u
                )
              : [...c.units, parsed.unit];
            return { ...c, units: sortUnitsByNumber(updatedUnits) };
          });
          pushCoursesToCloud(next, true);
          return next;
        });
        setSelectedCourseId(parsed.targetCourseId);
        setImportStatus({
          type: "success",
          msg: `Imported and sorted "${parsed.unit.title}" into ${parsed.targetCourseId.toUpperCase()}! ${
            isCloudConfigured ? "Synced to Cloud for all devices." : "Saved locally."
          }`
        });
      } else if (parsed.id && parsed.title && Array.isArray(parsed.units)) {
        const sortedCourse = {
          ...parsed,
          units: sortUnitsByNumber(parsed.units)
        };
        setCourses((prev) => {
          const exists = prev.some((c) => c.id === sortedCourse.id);
          const next = exists
            ? prev.map((c) => (c.id === sortedCourse.id ? sortedCourse : c))
            : [...prev, sortedCourse];
          pushCoursesToCloud(next, true);
          return next;
        });
        setSelectedCourseId(sortedCourse.id);
        setImportStatus({
          type: "success",
          msg: `Imported and sorted full course "${sortedCourse.code || ""} ${sortedCourse.title}"!`
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
                    Active Curriculum
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
              {isAdminUnlocked && (
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
              )}
            </div>

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
              {isAdminUnlocked && (
                <Shield className="w-3.5 h-3.5 text-purple-600" title="Admin Editor Unlocked" />
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
          PROFILE SWITCHER, RESET WORK & ADMIN LOCK MODAL
         =================================================================== */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  Scholar Identity & Permissions
                </div>
                <h2 className="text-xl font-serif font-bold text-slate-900">
                  Profiles, Reset Work & Admin Lock
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
                    ? "Public: Visible on the Scholars Leaderboard."
                    : "Private: Hidden from the public leaderboard."}
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
                    <Globe className="w-3.5 h-3.5" /> Public (Make Private)
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" /> Private (Make Public)
                  </>
                )}
              </button>
            </div>

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
                Switch
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
                + New
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
                Cloud Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setProfileMode("reset");
                  setProfileModalMsg(null);
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition ${
                  profileMode === "reset"
                    ? "bg-white text-rose-600 shadow-xs"
                    : "text-slate-600"
                }`}
              >
                Reset Work
              </button>
              <button
                type="button"
                onClick={() => {
                  setProfileMode("admin");
                  setProfileModalMsg(null);
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition ${
                  profileMode === "admin"
                    ? "bg-white text-purple-700 shadow-xs"
                    : "text-slate-600"
                }`}
              >
                Admin Lock
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

            {profileMode === "switch" && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500">
                  Profiles on This Device ({Object.keys(profilesMap).length})
                </div>
                {Object.values(profilesMap).map((p) => (
                  <div
                    key={p.handle}
                    className={`p-3.5 rounded-xl border flex flex-col gap-2 ${
                      p.handle === activeProfile.handle
                        ? "bg-blue-50/70 border-blue-500"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
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
                          onClick={() => {
                            if (!p.pin || p.pin === "0000") {
                              setActiveHandle(p.handle);
                              setSwitchPinPromptHandle(null);
                            } else {
                              setSwitchPinPromptHandle(p.handle);
                              setSwitchPinInput("");
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#0b2149] text-white text-xs font-bold"
                        >
                          Switch
                        </button>
                      )}
                    </div>

                    {switchPinPromptHandle === p.handle && (
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <input
                          type="password"
                          value={switchPinInput}
                          onChange={(e) => setSwitchPinInput(e.target.value)}
                          placeholder={`Enter PIN for @${p.handle}...`}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (switchPinInput.trim() === String(p.pin).trim()) {
                              setActiveHandle(p.handle);
                              setSwitchPinPromptHandle(null);
                              setProfileModalMsg(null);
                            } else {
                              setProfileModalMsg({
                                type: "error",
                                text: `Incorrect PIN for @${p.handle}.`
                              });
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold"
                        >
                          Unlock
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

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
                      placeholder="e.g. alex_ut"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      4-Digit PIN (protects your profile)
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

            {profileMode === "cloud-login" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  On your phone or another computer? Enter your Handle and PIN to pull your live progress from the cloud.
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

            {profileMode === "reset" && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-700">
                  Remove / Reset Completed Work for {activeProfile.displayName} (@{activeProfile.handle})
                </div>

                <div className="space-y-2">
                  {courses.map((c) => {
                    const st = getCourseStatsForProgress(c, progress);
                    return (
                      <div
                        key={c.id}
                        className="p-3 rounded-xl border border-slate-200 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-800">
                            {c.code}: {c.title}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Current Mastery: {st.pct}%
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            clearCourseProgress(c);
                            setProfileModalMsg({
                              type: "success",
                              text: `Reset all work in ${c.code} back to 0%!`
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Reset {c.code}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={clearAllProfileProgress}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset All My Progress to 0%
                  </button>
                  {Object.keys(profilesMap).length > 1 && (
                    <button
                      type="button"
                      onClick={deleteActiveProfile}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-rose-700 border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Profile
                    </button>
                  )}
                </div>
              </div>
            )}

            {profileMode === "admin" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-purple-700" />
                      Admin Curriculum & Video Lock
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isAdminUnlocked
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {isAdminUnlocked ? "Unlocked" : "Locked (Visitors View Only)"}
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-900 leading-relaxed">
                    When locked, outside visitors <strong>cannot</strong> see the Lesson Video Source URL input box, cannot open Course Studio, and cannot delete or overwrite courses.
                  </p>

                  {isAdminUnlocked ? (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          keepOnlyAlgebraAndSort(true);
                          setProfileModalMsg({
                            type: "success",
                            text: "Removed all courses except M 373K (Algebra), removed empty unbuilt units, sorted Unit 0 first, and synced to Cloud!"
                          });
                        }}
                        className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                      >
                        Keep Only Algebra (M 373K), Remove Empty Units & Sort Unit 0 First
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAdminUnlocked(false);
                          if (activeView === "studio") setActiveView("dashboard");
                          setProfileModalMsg({
                            type: "success",
                            text: "Locked Admin Mode. Outside visitors can now only view lessons and solve exercises."
                          });
                        }}
                        className="w-full py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                      >
                        Lock Admin Mode Now
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={adminPinInput}
                        onChange={(e) => setAdminPinInput(e.target.value)}
                        placeholder="Enter Admin PIN (default: 2027)"
                        className="flex-1 px-3 py-2 rounded-xl border border-purple-300 bg-white text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (adminPinInput.trim() === ADMIN_PASSCODE) {
                            setIsAdminUnlocked(true);
                            setAdminPinInput("");
                            setProfileModalMsg({
                              type: "success",
                              text: "Admin Mode Unlocked! Click the green button above to clean up courses & sort Unit 0 first."
                            });
                          } else {
                            setProfileModalMsg({
                              type: "error",
                              text: "Incorrect Admin Passcode."
                            });
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                      >
                        Unlock Admin
                      </button>
                    </div>
                  )}
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
                      onClick={() => {
                        setProfileMode("reset");
                        setShowProfileModal(true);
                      }}
                      className="text-xs text-rose-300 hover:underline font-medium"
                    >
                      Reset Work
                    </button>
                    <span className="text-slate-500">·</span>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMode("switch");
                        setShowProfileModal(true);
                      }}
                      className="text-xs text-sky-300 hover:underline font-medium"
                    >
                      Switch Scholar ({syncStatus || (isCloudConfigured ? "Cloud Ready" : "Local Mode")}) →
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
                onClick={() => {
                  setProfileMode("reset");
                  setShowProfileModal(true);
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-lg hover:bg-slate-100 text-slate-700 font-medium text-sm flex items-center gap-2.5"
              >
                <RotateCcw className="w-4 h-4 text-rose-600" /> Reset My Progress
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isAdminUnlocked) {
                    setActiveView("studio");
                  } else {
                    setProfileMode("admin");
                    setShowProfileModal(true);
                  }
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-lg hover:bg-slate-100 text-slate-700 font-medium text-sm flex items-center gap-2.5"
              >
                <Sparkles className="w-4 h-4 text-purple-600" />{" "}
                {isAdminUnlocked ? "Course Studio (Unlocked)" : "Admin Course Studio 🔒"}
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
                {isAdminUnlocked && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => keepOnlyAlgebraAndSort(true)}
                      className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      Keep Only M 373K & Sort Unit 0 First
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveView("studio")}
                      className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-4 h-4" /> Import via Claude
                    </button>
                  </div>
                )}
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

                      <div className="flex sm:flex-col gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCourseId(course.id);
                            setActiveView("course");
                          }}
                          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
                        >
                          Open Curriculum ({course.units?.length || 0} Units) →
                        </button>
                        {stats.pct > 0 && (
                          <button
                            type="button"
                            onClick={() => clearCourseProgress(course)}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold flex items-center justify-center gap-1 transition"
                          >
                            <RotateCcw className="w-3 h-3" /> Reset My {course.code} Work
                          </button>
                        )}
                        {isAdminUnlocked && courses.length > 1 && (
                          <button
                            type="button"
                            onClick={() => deleteCourseById(course.id)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-rose-700 text-[11px] font-bold flex items-center justify-center gap-1 transition"
                          >
                            <Trash2 className="w-3 h-3" /> Delete Course
                          </button>
                        )}
                      </div>
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
          VIEW 2: COURSE CURRICULUM VIEW (Units Always Sorted 0, 1, 2, 3...)
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
              {getCourseStatsForProgress(activeCourse, progress).pct > 0 && (
                <button
                  type="button"
                  onClick={() => clearCourseProgress(activeCourse)}
                  className="w-full py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset My {activeCourse.code} Progress
                </button>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Unit Breakdown (Sorted)
              </div>
              {sortUnitsByNumber(activeCourse.units || []).map((u) => {
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
            <div className="flex justify-end gap-2 -mb-2">
              <button
                type="button"
                onClick={() => setCollapsedUnits({})}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1"
              >
                <ChevronDown className="w-3.5 h-3.5" /> Expand all
              </button>
              <button
                type="button"
                onClick={() =>
                  setCollapsedUnits(
                    Object.fromEntries((activeCourse.units || []).map((u) => [u.id, true]))
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1"
              >
                <ChevronRight className="w-3.5 h-3.5" /> Collapse all
              </button>
            </div>
            {sortUnitsByNumber(activeCourse.units || []).map((unit) => (
              <div
                key={unit.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
              >
                <div className={`bg-slate-50 px-6 py-4 flex items-center justify-between gap-4 ${collapsedUnits[unit.id] ? "" : "border-b border-slate-200"}`}>
                  <div>
                    <h2
                      className="text-lg font-serif font-bold text-slate-900 cursor-pointer select-none"
                      onClick={() => toggleUnit(unit.id)}
                    >
                      <MathText text={unit.title} />
                    </h2>
                    <p className="text-xs text-slate-600 mt-1">
                      <MathText text={unit.description} />
                    </p>
                    {unitNotesUrls(unit.id) && (unit.lessons?.length || 0) > 0 && (
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-semibold">
                        <a
                          href={unitNotesUrls(unit.id).guided}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-700 hover:underline flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" /> All unit notes (PDF)
                        </a>
                        <a
                          href={unitNotesUrls(unit.id).master}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:underline flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" /> Master copies
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {getUnitStats(unit).pct}% Mastered
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleUnit(unit.id)}
                      aria-expanded={!collapsedUnits[unit.id]}
                      title={collapsedUnits[unit.id] ? "Expand this unit" : "Collapse this unit"}
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1"
                    >
                      {collapsedUnits[unit.id] ? (
                        <>
                          <ChevronRight className="w-3.5 h-3.5" /> Expand ({unit.lessons?.length || 0})
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" /> Collapse
                        </>
                      )}
                    </button>
                    {isAdminUnlocked && (
                      <button
                        type="button"
                        onClick={() => deleteUnitById(activeCourse.id, unit.id)}
                        title="Delete this unit (Admin only)"
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {!collapsedUnits[unit.id] && (unit.lessons?.length === 0 ? (
                  <div className="p-6 text-xs text-slate-500 flex items-center justify-between">
                    <span>No lessons in this unit yet.</span>
                    {isAdminUnlocked && (
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => deleteUnitById(activeCourse.id, unit.id)}
                          className="text-rose-600 font-semibold hover:underline"
                        >
                          Remove Empty Unit
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveView("studio")}
                          className="text-blue-600 font-semibold hover:underline"
                        >
                          Import Unit via Claude →
                        </button>
                      </div>
                    )}
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
                ))}
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
                {lessonNotesUrls(selectedLesson.id) && (
                  <div className="bg-white rounded-2xl border border-amber-200 p-5 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-amber-600" /> Lecture Notes (PDF)
                    </h3>
                    <p className="text-xs text-slate-600">
                      Print the guided notes and fill in the blanks while you watch. Check your answers with the master copy.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={lessonNotesUrls(selectedLesson.id).guided}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        <Download className="w-3.5 h-3.5" /> Guided Notes
                      </a>
                      <a
                        href={lessonNotesUrls(selectedLesson.id).master}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        <Download className="w-3.5 h-3.5" /> Master Copy
                      </a>
                    </div>
                  </div>
                )}

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

                {isAdminUnlocked && (
                  <div className="bg-white rounded-2xl border border-purple-200 p-5 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-purple-600" /> Admin Video Source
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                        Admin Only
                      </span>
                    </h3>
                    <input
                      type="text"
                      value={selectedLesson.videoUrl || ""}
                      onChange={(e) => {
                        const rawUrl = e.target.value;
                        const cleanUrl = rawUrl
                          .replace("watch?v=", "embed/")
                          .replace("youtu.be/", "www.youtube.com/embed/");
                        const updatedLesson = { ...selectedLesson, videoUrl: cleanUrl };
                        setSelectedLesson(updatedLesson);
                        const nextCourses = courses.map((c) => ({
                          ...c,
                          units: c.units?.map((u) => ({
                            ...u,
                            lessons: u.lessons?.map((l) =>
                              l.id === updatedLesson.id ? updatedLesson : l
                            )
                          }))
                        }));
                        setCourses(nextCourses);
                        pushCoursesToCloud(nextCourses, true);
                      }}
                      placeholder="Paste YouTube URL or /videos/ep1.mp4..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                    />
                    <label className="block text-center px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer transition">
                      + Load Local .mp4 File (Offline Mode)
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const blobUrl = URL.createObjectURL(file);
                          setSelectedLesson({ ...selectedLesson, videoUrl: blobUrl });
                        }}
                      />
                    </label>
                  </div>
                )}
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
                              <>
                                <span
                                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                    existingStatus === "mastered"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {existingStatus === "mastered" ? "★ Mastered" : "● Familiar"}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => clearSingleExerciseProgress(ex.id)}
                                  title="Clear your saved result for this exercise"
                                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center gap-1"
                                >
                                  <RotateCcw className="w-3 h-3" /> Reset
                                </button>
                              </>
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
                            {(proofText.trim() || selectedOption !== null || numericInput.trim() || isSubmitted) && (
                              <button
                                type="button"
                                onClick={resetExerciseInputs}
                                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold"
                              >
                                Clear Attempt
                              </button>
                            )}

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
          VIEW 4: COURSE STUDIO (PROTECTED BY ADMIN LOCK)
         =================================================================== */}
      {activeView === "studio" && isAdminUnlocked && (
        <div className="max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-600">
                Admin Course Studio Back-End
              </div>
              <h1 className="text-2xl font-serif font-bold text-slate-900">
                Claude Curriculum Importer & Unit Sorter
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Units are automatically sorted in numerical order (Unit 0 → Unit 1 → Unit 2...).
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => keepOnlyAlgebraAndSort(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                Keep Only M 373K & Remove Empty Units
              </button>
              <button
                type="button"
                onClick={() => setStudioTab("claude")}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${
                  studioTab === "claude"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                1. Claude Importer
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
                2. Export / Cloud Sync
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
                    Auto-sorts by Unit number & syncs to Cloud
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
                    <Upload className="w-4 h-4" /> Import & Auto-Sort Unit
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
                  <button
                    type="button"
                    onClick={() => {
                      if (!window.confirm("Replace the current M 373K course with the built-in curriculum (Units 0-4)" + (isCloudConfigured ? " and publish it to the Cloud" : "") + "? Learner progress is kept.")) return;
                      // Keep any YouTube links already set on lessons (e.g. pasted in Admin Video Source).
                      const youtubeById = {};
                      courses.forEach((c) =>
                        c.units?.forEach((u) =>
                          u.lessons?.forEach((l) => {
                            if (/youtube\.com|youtu\.be/.test(l.videoUrl || "")) youtubeById[l.id] = l.videoUrl;
                          })
                        )
                      );
                      const builtIn = normalizeAndSortCourses(INITIAL_COURSES).map((c) => ({
                        ...c,
                        units: c.units.map((u) => ({
                          ...u,
                          lessons: (u.lessons || []).map((l) =>
                            youtubeById[l.id] ? { ...l, videoUrl: youtubeById[l.id] } : l
                          )
                        }))
                      }));
                      setCourses(builtIn);
                      pushCoursesToCloud(builtIn, true);
                      setSelectedCourseId("m373k");
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> Load Built-in Curriculum
                  </button>
                  {isCloudConfigured && (
                    <button
                      type="button"
                      onClick={() => pushCoursesToCloud(courses, true)}
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