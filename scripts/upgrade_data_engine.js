// ============================================================================
// EduPrep — Upgrade Script for Shared Data & State Engine
// Builds EduPrep/shared/eduprep_data.js (and syncs eduvantage_data.js)
// ============================================================================
const fs = require("fs");
const path = require("path");

const srcPath = path.join(__dirname, "..", "EduPrep", "shared", "eduvantage_data.js");
const dstPath = path.join(__dirname, "..", "EduPrep", "shared", "eduprep_data.js");

const rawLines = fs.readFileSync(srcPath, "utf8").split(/\r?\n/);

// Keep lines 1..3473 (Universities, Colleges, Courses, Branches, Subjects, Units/Topics, Flashcards, MCQ_BANK)
let catalogLines = rawLines.slice(0, 3474).join("\n");

// Replace any visible EduVantage branding in the top header comments/strings with EduPrep
catalogLines = catalogLines
  .replace(/EduVantage/g, "EduPrep")
  .replace(/(?:window|_root)\.EduPrep\s*=\s*\(function\s*\(\)\s*\{/, "const EduPrepCore = (function () {");

const tailCode = `
  // Normalize MCQ_BANK so both .answer and .ans are always defined
  MCQ_BANK.forEach(function (m) {
    if (m.answer !== undefined && m.ans === undefined) m.ans = m.answer;
    if (m.ans !== undefined && m.answer === undefined) m.answer = m.ans;
    if (!m.verificationStatus) m.verificationStatus = "sample";
  });

  // ----------------------------------------------------
  // 8. PREVIOUS YEAR QUESTIONS (PYQs) — Normalized Schema
  // Explicitly marked as sample/demo reference papers
  // ----------------------------------------------------
  const PYQ_PAPERS = [
    {
      id: "pyq_mu_os_may24",
      university: "University of Mumbai",
      universityId: "mu",
      subject: "Operating Systems",
      subjectCode: "CSC401",
      code: "CSC401",
      course: "B.Tech Computer Engineering",
      semester: 4,
      year: "2024",
      session: "May",
      examPeriod: "May / June 2024",
      regulation: "Rev-2019 'C' Scheme",
      paperCode: "CSC401-MAY24",
      maxMarks: 80,
      marks: 80,
      duration: "3 Hours",
      downloadSize: "Sample Printable Sheet",
      isSolved: true,
      solved: true,
      verificationStatus: "sample",
      isSample: true,
      questionsCount: 6,
      bookmarked: true,
      questions: [
        { qNo: "Q.1", marks: "20 Marks", title: "Compulsory — Answer any FOUR (5 Marks each)", items: [
          "(a) Compare monolithic kernel and microkernel Operating System architectures with neat diagrams.",
          "(b) Differentiate between Preemptive and Non-Preemptive CPU scheduling with examples.",
          "(c) Define Thrashing. How does the Working-Set model prevent thrashing?",
          "(d) Compare Contiguous, Linked, and Indexed file allocation techniques.",
          "(e) State and verify Peterson's two-process solution for the Critical Section Problem."
        ]},
        { qNo: "Q.2", marks: "20 Marks", title: "Attempt any TWO (10 Marks each)", items: [
          "(a) Five processes P1–P5 arrive at t = 0, 1, 2, 3, 4 ms with burst times 8, 4, 9, 5, 2 ms. Draw Gantt charts and compute Average Turnaround & Waiting Time for SRTF and Round Robin (Q = 3 ms).",
          "(b) Consider 5 processes P0–P4 and 3 resource types A(10), B(5), C(7). Apply Banker's Algorithm to verify if the system is in a safe state and derive the safe execution sequence."
        ]},
        { qNo: "Q.3", marks: "20 Marks", title: "Attempt any TWO (10 Marks each)", items: [
          "(a) Explain Paging hardware with Translation Lookaside Buffer (TLB). Calculate Effective Memory Access Time (EMAT) for 20 ns TLB lookup, 100 ns main memory access, and 85% TLB hit ratio.",
          "(b) For page reference string 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2 with 3 frames, compute total page faults using FIFO, Optimal, and LRU replacement policies."
        ]}
      ]
    },
    {
      id: "pyq_mu_os_dec23",
      university: "University of Mumbai",
      universityId: "mu",
      subject: "Operating Systems",
      subjectCode: "CSC401",
      code: "CSC401",
      course: "B.Tech Computer Engineering",
      semester: 4,
      year: "2023",
      session: "Dec",
      examPeriod: "Nov / Dec 2023",
      regulation: "Rev-2019 'C' Scheme",
      paperCode: "CSC401-DEC23",
      maxMarks: 80,
      marks: 80,
      duration: "3 Hours",
      downloadSize: "Sample Printable Sheet",
      isSolved: true,
      solved: true,
      verificationStatus: "sample",
      isSample: true,
      questionsCount: 6,
      bookmarked: false,
      questions: [
        { qNo: "Q.1", marks: "20 Marks", title: "Compulsory — Answer any FOUR (5 Marks each)", items: [
          "(a) Explain the five-state process transition diagram and Process Control Block (PCB) fields.",
          "(b) What are the four necessary Coffman conditions for a Deadlock?",
          "(c) Explain Internal vs External Fragmentation and how Compaction/Paging addresses them.",
          "(d) Describe UNIX Inode block addressing structure."
        ]},
        { qNo: "Q.2", marks: "20 Marks", title: "Attempt any TWO (10 Marks each)", items: [
          "(a) Write semaphore pseudocode for the Dining Philosophers Problem and explain how deadlock is prevented.",
          "(b) Given disk queue 98, 183, 37, 122, 14, 124, 65, 67 with head at 53 (0–199 cylinders), calculate total head movement for FCFS, SSTF, SCAN, and C-SCAN."
        ]}
      ]
    },
    {
      id: "pyq_mu_os_may23",
      university: "University of Mumbai",
      universityId: "mu",
      subject: "Operating Systems",
      subjectCode: "CSC401",
      code: "CSC401",
      course: "B.Tech Computer Engineering",
      semester: 4,
      year: "2023",
      session: "May",
      examPeriod: "May / June 2023",
      regulation: "Rev-2019 'C' Scheme",
      paperCode: "CSC401-MAY23",
      maxMarks: 80,
      marks: 80,
      duration: "3 Hours",
      downloadSize: "Sample Printable Sheet",
      isSolved: true,
      solved: true,
      verificationStatus: "sample",
      isSample: true,
      questionsCount: 6,
      bookmarked: false
    },
    {
      id: "pyq_mu_cn_may24",
      university: "University of Mumbai",
      universityId: "mu",
      subject: "Computer Networks",
      subjectCode: "CSC402",
      code: "CSC402",
      course: "B.Tech Computer Engineering",
      semester: 4,
      year: "2024",
      session: "May",
      examPeriod: "May / June 2024",
      regulation: "Rev-2019 'C' Scheme",
      paperCode: "CSC402-MAY24",
      maxMarks: 80,
      marks: 80,
      duration: "3 Hours",
      downloadSize: "Sample Printable Sheet",
      isSolved: true,
      solved: true,
      verificationStatus: "sample",
      isSample: true,
      questionsCount: 6,
      bookmarked: false,
      questions: [
        { qNo: "Q.1", marks: "20 Marks", title: "Compulsory — Answer any FOUR (5 Marks each)", items: [
          "(a) Compare OSI 7-Layer Reference Model and TCP/IP Protocol Suite.",
          "(b) Explain CSMA/CD binary exponential backoff algorithm in IEEE 802.3 Ethernet.",
          "(c) Explain the count-to-infinity problem in Distance Vector Routing and how Split Horizon mitigates it.",
          "(d) Illustrate TCP 3-Way Handshake connection establishment and termination."
        ]},
        { qNo: "Q.2", marks: "20 Marks", title: "Attempt any TWO (10 Marks each)", items: [
          "(a) An organization is granted block 192.168.10.0/24 and needs 4 subnets. Determine subnet mask, network address, broadcast address, and usable host IP range for each subnet.",
          "(b) Compare Go-Back-N ARQ and Selective Repeat ARQ sliding window protocols with timeline diagrams."
        ]}
      ]
    },
    {
      id: "pyq_mu_cn_dec23",
      university: "University of Mumbai",
      universityId: "mu",
      subject: "Computer Networks",
      subjectCode: "CSC402",
      code: "CSC402",
      course: "B.Tech Computer Engineering",
      semester: 4,
      year: "2023",
      session: "Dec",
      examPeriod: "Nov / Dec 2023",
      regulation: "Rev-2019 'C' Scheme",
      paperCode: "CSC402-DEC23",
      maxMarks: 80,
      marks: 80,
      duration: "3 Hours",
      downloadSize: "Sample Printable Sheet",
      isSolved: true,
      solved: true,
      verificationStatus: "sample",
      isSample: true,
      questionsCount: 6,
      bookmarked: false
    },
    {
      id: "pyq_mu_dbms_may24",
      university: "University of Mumbai",
      universityId: "mu",
      subject: "Database Management Systems",
      subjectCode: "CSC403",
      code: "CSC403",
      course: "B.Tech Computer Engineering",
      semester: 4,
      year: "2024",
      session: "May",
      examPeriod: "May / June 2024",
      regulation: "Rev-2019 'C' Scheme",
      paperCode: "CSC403-MAY24",
      maxMarks: 80,
      marks: 80,
      duration: "3 Hours",
      downloadSize: "Sample Printable Sheet",
      isSolved: true,
      solved: true,
      verificationStatus: "sample",
      isSample: true,
      questionsCount: 6,
      bookmarked: false,
      questions: [
        { qNo: "Q.1", marks: "20 Marks", title: "Compulsory — Answer any FOUR (5 Marks each)", items: [
          "(a) Explain three-schema database architecture and logical vs physical data independence.",
          "(b) Define 1NF, 2NF, 3NF, and BCNF with functional dependency rules.",
          "(c) Explain ACID properties of transactions with state transition diagram.",
          "(d) Compare B-Tree and B+ Tree indexing structures."
        ]},
        { qNo: "Q.2", marks: "20 Marks", title: "Attempt any TWO (10 Marks each)", items: [
          "(a) Given relation R(A, B, C, D, E) with FDs {A -> BC, CD -> E, B -> D, E -> A}, compute candidate keys and check if R is in BCNF.",
          "(b) Explain Two-Phase Locking (2PL) protocol and test conflict serializability using precedence graphs."
        ]}
      ]
    },
    {
      id: "pyq_mu_dbms_dec23",
      university: "University of Mumbai",
      universityId: "mu",
      subject: "Database Management Systems",
      subjectCode: "CSC403",
      code: "CSC403",
      course: "B.Tech Computer Engineering",
      semester: 4,
      year: "2023",
      session: "Dec",
      examPeriod: "Nov / Dec 2023",
      regulation: "Rev-2019 'C' Scheme",
      paperCode: "CSC403-DEC23",
      maxMarks: 80,
      marks: 80,
      duration: "3 Hours",
      downloadSize: "Sample Printable Sheet",
      isSolved: true,
      solved: true,
      verificationStatus: "sample",
      isSample: true,
      questionsCount: 6,
      bookmarked: false
    },
    {
      id: "pyq_mu_aoa_may24",
      university: "University of Mumbai",
      universityId: "mu",
      subject: "Analysis of Algorithms",
      subjectCode: "CSC404",
      code: "CSC404",
      course: "B.Tech Computer Engineering",
      semester: 4,
      year: "2024",
      session: "May",
      examPeriod: "May / June 2024",
      regulation: "Rev-2019 'C' Scheme",
      paperCode: "CSC404-MAY24",
      maxMarks: 80,
      marks: 80,
      duration: "3 Hours",
      downloadSize: "Sample Printable Sheet",
      isSolved: true,
      solved: true,
      verificationStatus: "sample",
      isSample: true,
      questionsCount: 6,
      bookmarked: false
    },
    {
      id: "pyq_mu_aoa_dec22",
      university: "University of Mumbai",
      universityId: "mu",
      subject: "Analysis of Algorithms",
      subjectCode: "CSC404",
      code: "CSC404",
      course: "B.Tech Computer Engineering",
      semester: 4,
      year: "2022",
      session: "Dec",
      examPeriod: "Nov / Dec 2022",
      regulation: "Rev-2019 'C' Scheme",
      paperCode: "CSC404-DEC22",
      maxMarks: 80,
      marks: 80,
      duration: "3 Hours",
      downloadSize: "Sample Printable Sheet",
      isSolved: true,
      solved: true,
      verificationStatus: "sample",
      isSample: true,
      questionsCount: 6,
      bookmarked: false
    },
    {
      id: "pyq_mu_mp_may24",
      university: "University of Mumbai",
      universityId: "mu",
      subject: "Microprocessor & Interfacing",
      subjectCode: "CSC405",
      code: "CSC405",
      course: "B.Tech Computer Engineering",
      semester: 4,
      year: "2024",
      session: "May",
      examPeriod: "May / June 2024",
      regulation: "Rev-2019 'C' Scheme",
      paperCode: "CSC405-MAY24",
      maxMarks: 80,
      marks: 80,
      duration: "3 Hours",
      downloadSize: "Sample Printable Sheet",
      isSolved: true,
      solved: true,
      verificationStatus: "sample",
      isSample: true,
      questionsCount: 6,
      bookmarked: false
    }
  ];

  // ----------------------------------------------------
  // 9. STUDENT OPPORTUNITIES (Sample / Demo Labeled)
  // ----------------------------------------------------
  const OPPORTUNITIES = [
    {
      id: "opp_1",
      title: "Smart India Hackathon (SIH 2026) — Campus Screening",
      organizer: "Ministry of Education & AICTE (Sample Listing)",
      category: "Hackathon",
      deadline: "Nov 30, 2026",
      deadlineDate: "2026-11-30",
      prize: "₹1,00,000 per Problem Statement",
      location: "Nationwide / Maharashtra Nodal Centers",
      mode: "Hybrid",
      eligibility: "Engineering UG Students (Teams of 6)",
      verificationStatus: "sample",
      isSample: true,
      applyUrl: "https://www.sih.gov.in",
      tags: ["Sample Listing", "AICTE", "National"]
    },
    {
      id: "opp_2",
      title: "Summer Software Engineering Intern Track",
      organizer: "Enterprise Cloud Systems Lab (Sample Listing)",
      category: "Internship",
      deadline: "Dec 05, 2026",
      deadlineDate: "2026-12-05",
      prize: "Stipend + Mentorship Track",
      location: "Pune & Mumbai, Maharashtra",
      mode: "Hybrid",
      eligibility: "B.Tech/BE Computer & IT (3rd Year)",
      verificationStatus: "sample",
      isSample: true,
      applyUrl: "https://internships.aicte-india.org",
      tags: ["Sample Listing", "Summer Intern", "Systems"]
    },
    {
      id: "opp_3",
      title: "MahaDBT Post-Matric Scholarship Portal Window",
      organizer: "Directorate of Technical Education (Sample Listing)",
      category: "Scholarship",
      deadline: "Dec 20, 2026",
      deadlineDate: "2026-12-20",
      prize: "Tuition & Exam Fee Reimbursement",
      location: "Maharashtra DTE Approved Colleges",
      mode: "Online",
      eligibility: "Domicile of Maharashtra, Eligible Category Students",
      verificationStatus: "sample",
      isSample: true,
      applyUrl: "https://mahadbt.maharashtra.gov.in",
      tags: ["Sample Listing", "Scholarship", "DTE"]
    },
    {
      id: "opp_4",
      title: "Inter-Collegiate Technical Paper & Project Symposium",
      organizer: "Autonomous Engineering Consortium (Sample Listing)",
      category: "Workshop",
      deadline: "Nov 18, 2026",
      deadlineDate: "2026-11-18",
      prize: "Merit Certificates & Publication Guidance",
      location: "Mumbai & Pune Campuses",
      mode: "Offline",
      eligibility: "Open to all Engineering, BCA & MCA students",
      verificationStatus: "sample",
      isSample: true,
      applyUrl: "https://www.acm.org",
      tags: ["Sample Listing", "Paper Presentation", "Project Expo"]
    }
  ];

  // ----------------------------------------------------
  // 10. AI TUTOR CURATED KNOWLEDGEBASE & RESPONSE FORMATTER
  // ----------------------------------------------------
  const AI_KNOWLEDGE = {
    "process vs thread": {
      title: "Process vs. Thread Architecture (Unit 2 — Operating Systems)",
      summary: "A Process is an independent program in execution with its own isolated virtual address space, whereas a Thread is a lightweight unit of CPU utilization within a process that shares code, data, and heap segments with peer threads.",
      keyPoints: [
        "Memory Isolation: Processes have separate address spaces (PCB); peer threads share code, data, heap, and open files while maintaining private stacks and registers (TCB).",
        "Context Switch Overhead: Switching between processes requires flushing the TLB and updating page table base registers (heavyweight). Thread switching within the same process preserves the address space (lightweight).",
        "Communication: Inter-Process Communication (IPC) requires pipes, shared memory, or message queues via system calls. Threads communicate directly through shared global variables (requiring synchronization like mutexes)."
      ],
      formula: "T_switch(Thread) << T_switch(Process) because Page Table & TLB remain valid.",
      examTip: "For a 5-mark university answer, include a 5-point comparison table (Address Space, Context Switch, IPC, Creation Overhead, Fault Isolation) and a diagram showing Single-Threaded vs. Multi-Threaded Processes."
    },
    "deadlock": {
      title: "Deadlocks & Banker's Safety Algorithm (Unit 3 — Operating Systems)",
      summary: "A Deadlock is a permanent blocking state where a set of processes each hold at least one non-shareable resource and wait circularly for resources held by other processes in the same set.",
      keyPoints: [
        "Four Necessary Coffman Conditions: (1) Mutual Exclusion, (2) Hold and Wait, (3) No Preemption, (4) Circular Wait. All four must hold simultaneously.",
        "Banker's Avoidance Algorithm: Computes Need[i] = Max[i] - Allocation[i]. A state is SAFE if there exists an execution sequence <P_i1, P_i2, ..., P_in> where Need[ik] <= Work.",
        "Deadlock Recovery: Process termination (abort all or one at a time) or Resource preemption (rollback to safe checkpoint, guarding against starvation)."
      ],
      formula: "Need[i][j] = Max[i][j] - Allocation[i][j]; Safe if Need[i] <= Work (Available)",
      examTip: "In 10-mark Banker's Algorithm numericals, always draw the Need Matrix first (2 marks), explicitly show step-by-step Work = Work + Allocation[i] updates (6 marks), and box the final Safe Sequence (2 marks)."
    },
    "paging": {
      title: "Virtual Memory Paging, TLB & Belady's Anomaly (Unit 4 — Operating Systems)",
      summary: "Paging divides logical memory into fixed-size Pages and physical memory into equal-sized Frames, eliminating external fragmentation and enabling non-contiguous allocation via a Page Table and TLB hardware cache.",
      keyPoints: [
        "Address Translation: Logical Address = <Page Number (p), Page Offset (d)>. Page Table maps p -> Frame Number (f); Physical Address = <f, d>.",
        "Translation Lookaside Buffer (TLB): Associative high-speed hardware cache storing recent page-to-frame translations to avoid double memory access.",
        "Page Replacement & Belady's Anomaly: FIFO can suffer more page faults when frame count increases (Belady's Anomaly). LRU and Optimal are stack algorithms and never suffer from Belady's Anomaly."
      ],
      formula: "EMAT = h * (T_tlb + T_mem) + (1 - h) * (T_tlb + 2 * T_mem)",
      examTip: "Always state the unit (nanoseconds) and show both the TLB Hit term and TLB Miss term (2 memory accesses: 1 for page table + 1 for data word)."
    },
    "subnet": {
      title: "IPv4 Subnetting & CIDR Addressing (Unit 3 — Computer Networks)",
      summary: "Classless Inter-Domain Routing (CIDR) and Subnetting partition a single IP network block into smaller logical broadcast domains by borrowing bits from the host portion of the IP address.",
      keyPoints: [
        "Borrowed Bits: Borrowing k bits creates 2^k subnets.",
        "Usable Hosts per Subnet: With h remaining host bits (h = 32 - prefix), each subnet supports (2^h - 2) usable hosts (excluding Network ID all-0s and Broadcast Address all-1s).",
        "Block Size / Stride: 256 - Subnet_Octet_Value gives the increment between consecutive subnet network addresses."
      ],
      formula: "Subnets = 2^k  |  Usable Hosts = 2^(32 - prefix) - 2",
      examTip: "In 10-mark subnetting problems, draw a 4-column table listing: (1) Subnet Number, (2) Network ID, (3) First–Last Usable Host IP, and (4) Direct Broadcast IP."
    },
    "tcp": {
      title: "TCP 3-Way Handshake & Congestion Control (Unit 4 — Computer Networks)",
      summary: "Transmission Control Protocol (TCP) is a connection-oriented, reliable, byte-stream transport layer protocol using a 3-way handshake, sliding window flow control, and AIMD congestion control.",
      keyPoints: [
        "Step 1 (SYN): Client sends SYN segment (SYN=1, Seq=x) to synchronize sequence numbers.",
        "Step 2 (SYN-ACK): Server replies with SYN-ACK (SYN=1, ACK=1, Seq=y, Ack=x+1).",
        "Step 3 (ACK): Client sends ACK (ACK=1, Seq=x+1, Ack=y+1) and enters ESTABLISHED state.",
        "Congestion Control Phases: Slow Start (exponential cwnd growth up to ssthresh), Congestion Avoidance (linear additive increase), and Fast Recovery (on 3 duplicate ACKs)."
      ],
      formula: "Throughput ≈ MSS / (RTT * sqrt(p))  |  Effective Window = min(cwnd, rwnd)",
      examTip: "Draw the time-sequence ladder diagram clearly labeling SYN, SYN+ACK, and ACK along with sequence and acknowledgment numbers."
    },
    "bcnf": {
      title: "Database Normalization: 1NF, 2NF, 3NF & BCNF (Unit 2 — DBMS)",
      summary: "Normalization systematically decomposes relational schemas based on Functional Dependencies (FDs) to eliminate redundancy and insertion, update, and deletion anomalies.",
      keyPoints: [
        "1NF: Atomic attribute domains (no repeating groups or multi-valued attributes).",
        "2NF: In 1NF + no Partial Dependency (no non-prime attribute depends on a proper subset of a candidate key).",
        "3NF: In 2NF + no Transitive Dependency (for every non-trivial FD X -> A, either X is a superkey OR A is a prime attribute).",
        "BCNF (Boyce-Codd Normal Form): Stronger than 3NF; for every non-trivial FD X -> A, X MUST be a superkey."
      ],
      formula: "Lossless Join Check: (R1 ∩ R2) -> R1 or (R1 ∩ R2) -> R2 must hold in F+",
      examTip: "When decomposing into BCNF, always verify whether the decomposition is Lossless-Join (mandatory) and whether it preserves all functional dependencies."
    }
  };

  function formatAiResponseHtml(query, persona, mode) {
    const q = (query || "").toLowerCase();
    const activePersona = persona || "encouraging";
    const activeMode = mode || "explain";

    let matched = null;
    if (q.includes("process") || q.includes("thread") || q.includes("pcb")) matched = AI_KNOWLEDGE["process vs thread"];
    else if (q.includes("deadlock") || q.includes("banker") || q.includes("coffman") || q.includes("semaphore") || q.includes("peterson")) matched = AI_KNOWLEDGE["deadlock"];
    else if (q.includes("page") || q.includes("paging") || q.includes("tlb") || q.includes("memory") || q.includes("belady") || q.includes("lru")) matched = AI_KNOWLEDGE["paging"];
    else if (q.includes("subnet") || q.includes("cidr") || q.includes("ip") || q.includes("routing") || q.includes("ospf")) matched = AI_KNOWLEDGE["subnet"];
    else if (q.includes("tcp") || q.includes("handshake") || q.includes("congestion") || q.includes("osi") || q.includes("sliding")) matched = AI_KNOWLEDGE["tcp"];
    else if (q.includes("bcnf") || q.includes("normal") || q.includes("3nf") || q.includes("acid") || q.includes("sql") || q.includes("dbms")) matched = AI_KNOWLEDGE["bcnf"];

    if (!matched) {
      const cleanTopic = String(query || "Core Syllabus Concept").replace(/[<>]/g, "");
      matched = {
        title: "Syllabus Concept Breakdown: " + cleanTopic,
        summary: "Structured university exam revision guide for '" + cleanTopic + "'. Focus on core definitions, architectural workflow, mathematical formulation, and standard university marking rubrics.",
        keyPoints: [
          "Definition & Principle (1–2 Marks): State the formal textbook definition and primary design objective of the concept.",
          "Architecture / Algorithm Steps (3–5 Marks): Break the mechanism into numbered steps, state transitions, or a labeled block diagram.",
          "Complexity / Trade-offs (2–3 Marks): Compare best-case vs. worst-case behavior and cite one practical system implementation."
        ],
        formula: "Structure your answer as: Definition -> Diagram/Algorithm -> Numerical Example -> Applications.",
        examTip: "University examiners award full marks when you underline key technical terms and include a neat labeled diagram or trace table."
      };
    }

    let introPrefix = "";
    if (activePersona === "encouraging") {
      introPrefix = "<p class=\\"text-xs text-primary font-semibold mb-2\\">✨ Encouraging Coach: Great exam topic! Let's break this down clearly so you can score full marks:</p>";
    } else if (activePersona === "technical") {
      introPrefix = "<p class=\\"text-xs text-secondary font-semibold mb-2\\">⚙️ Technical Expert: Formal specification, invariant conditions, and algorithmic analysis:</p>";
    } else if (activePersona === "concise") {
      introPrefix = "<p class=\\"text-xs text-tertiary font-semibold mb-2\\">⚡ Concise Planner: High-yield bullet checklist for rapid revision:</p>";
    }

    let modeBadge = "";
    if (activeMode === "five_mark" || activeMode === "5mark") {
      modeBadge = "<div class=\\"mb-2 inline-block px-2 py-0.5 rounded bg-primary-fixed text-primary text-[10px] font-bold uppercase\\">5-Mark Exam Answer Structure (4 Key Points + Formula)</div>";
    } else if (activeMode === "ten_mark" || activeMode === "10mark") {
      modeBadge = "<div class=\\"mb-2 inline-block px-2 py-0.5 rounded bg-secondary-fixed text-secondary text-[10px] font-bold uppercase\\">10-Mark Comprehensive Blueprint (Definition + Trace + Proof + Diagram)</div>";
    } else if (activeMode === "quiz_me" || activeMode === "quiz") {
      modeBadge = "<div class=\\"mb-2 inline-block px-2 py-0.5 rounded bg-tertiary-fixed text-tertiary text-[10px] font-bold uppercase\\">Self-Test Checkpoint Included Below</div>";
    }

    const bulletsHtml = matched.keyPoints.map(function (pt) {
      return "<li class=\\"mb-1.5\\">" + pt + "</li>";
    }).join("");

    let extraQuizHtml = "";
    if (activeMode === "quiz_me" || activeMode === "quiz") {
      extraQuizHtml =
        "<div class=\\"mt-3 p-3 rounded-xl bg-surface-container border border-outline-variant/40 text-xs\\">" +
          "<strong class=\\"text-primary block mb-1\\">Quick Self-Check Question:</strong>" +
          "<p class=\\"mb-1\\">Can you state the core formula or invariant condition for <em>" + matched.title + "</em> without looking at your notes, and explain what happens in the boundary case?</p>" +
        "</div>";
    }

    return (
      "<div class=\\"space-y-2.5 text-xs sm:text-sm leading-relaxed\\">" +
        introPrefix +
        modeBadge +
        "<h4 class=\\"font-bold text-on-surface text-sm\\">" + matched.title + "</h4>" +
        "<p class=\\"text-on-surface-variant\\">" + matched.summary + "</p>" +
        "<ul class=\\"list-disc pl-5 text-on-surface space-y-1\\">" + bulletsHtml + "</ul>" +
        "<div class=\\"p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 font-mono text-xs text-amber-900 dark:text-amber-200\\">" +
          "<strong>Formula / Key Rule:</strong> " + matched.formula +
        "</div>" +
        "<div class=\\"p-2.5 rounded-lg bg-primary-fixed/30 border border-primary/20 text-xs text-on-surface\\">" +
          "<strong class=\\"text-primary\\">Exam Scoring Tip:</strong> " + matched.examTip +
        "</div>" +
        extraQuizHtml +
      "</div>"
    );
  }

  // ----------------------------------------------------
  // 11. LOCAL STATE PERSISTENCE, ADMIN CATALOG & USER PROFILE
  // ----------------------------------------------------
  const STORAGE_KEY = "eduprep_user_state_v1";
  const LEGACY_STORAGE_KEY = "eduvantage_user_state_v1";
  const ADMIN_CATALOG_KEY = "eduprep_admin_catalog_v1";
  const CONTENT_REPORTS_KEY = "eduprep_content_reports_v1";

  const DEFAULT_STATE = {
    user: {
      id: "demo-student-1",
      name: "Aryan Sharma",
      email: "aryan.sharma@student.edu",
      role: "student",
      authMode: "demo",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6mxs9Gz3aSLuuGjLHKo9nGd0spgtVMCUpkbwkCtZ3R4atfdBMiBU_lFwaaWXEagFPqX2I4WPqhs6q2VBXtLcJ0AgkP318xV5hl03jmDrQUvQ5t7SA-SqZkGgY0Mz-uoCL1zEjOnGqSYkH7Qpmq-BoZGuAdslpd4mvQlYepQGoOpSKweXQK8rbQRDTyluy1FhyN5EoR0ZI5JPredSaI7K2Yo71QSHeJI-6xcxhY1RDFqmoG-bmEJuSiA",
      dailyGoal: "3.5 Hours",
      streakDays: 1
    },
    profile: {
      name: "Aryan Sharma",
      email: "aryan.sharma@student.edu",
      role: "student",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6mxs9Gz3aSLuuGjLHKo9nGd0spgtVMCUpkbwkCtZ3R4atfdBMiBU_lFwaaWXEagFPqX2I4WPqhs6q2VBXtLcJ0AgkP318xV5hl03jmDrQUvQ5t7SA-SqZkGgY0Mz-uoCL1zEjOnGqSYkH7Qpmq-BoZGuAdslpd4mvQlYepQGoOpSKweXQK8rbQRDTyluy1FhyN5EoR0ZI5JPredSaI7K2Yo71QSHeJI-6xcxhY1RDFqmoG-bmEJuSiA",
      bio: "Second-year Computer Engineering student preparing for Semester 4 university examinations.",
      studyGoalHours: 4,
      difficultyPreference: "Standard",
      streakDays: 1,
      completedResources: 3,
      totalBookmarks: 1,
      totalStudyHours: 2
    },
    academic: {
      universityId: "mu",
      university: "University of Mumbai",
      universityName: "University of Mumbai",
      institutionType: "autonomous",
      collegeId: "vit_wadala",
      college: "Vidyalankar Institute of Technology (VIT)",
      collegeName: "Vidyalankar Institute of Technology (VIT)",
      collegeLocation: "Wadala (E), Mumbai",
      isAutonomous: true,
      courseId: "btech",
      course: "B.Tech",
      courseName: "Bachelor of Technology (B.Tech)",
      branchId: "ce",
      branch: "Computer Engineering",
      branchName: "Computer Engineering",
      semester: 4,
      activeSubject: "CSC401",
      regulation: "Rev-2019 'C' Scheme"
    },
    aiTutorPersona: "encouraging",
    aiTutor: {
      persona: "encouraging",
      name: "Encouraging Coach",
      promptCount: 0
    },
    progress: {
      overallPercentage: 25,
      completedTopics: ["t_os_1_1", "t_os_1_2", "t_os_2_1"],
      masteredFlashcards: ["fc_1", "fc_4"],
      reviewFlashcards: ["fc_2"],
      bookmarkedPapers: ["pyq_mu_os_may24"],
      bookmarkedQuestions: [],
      quizScores: []
    },
    savedOpportunities: []
  };

  function normalizeAcademicFields(acad) {
    const a = Object.assign({}, DEFAULT_STATE.academic, acad || {});
    if (a.university && !acad?.universityName) a.universityName = a.university;
    if (a.universityName && !acad?.university) a.university = a.universityName;
    if (a.college && !acad?.collegeName) a.collegeName = a.college;
    if (a.collegeName && !acad?.college) a.college = a.collegeName;
    if (a.branch && !acad?.branchName) a.branchName = a.branch;
    if (a.branchName && !acad?.branch) a.branch = a.branchName;
    if (a.course && !acad?.courseName) a.courseName = a.course;
    if (a.courseName && !acad?.course) a.course = a.courseName;
    const sem = parseInt(a.semester, 10);
    a.semester = Number.isInteger(sem) && sem >= 1 && sem <= 8 ? sem : 4;
    return a;
  }

  function loadState() {
    try {
      if (typeof localStorage === "undefined") {
        return JSON.parse(JSON.stringify(DEFAULT_STATE));
      }
      let serialized = localStorage.getItem(STORAGE_KEY);
      if (!serialized) {
        const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacy) {
          serialized = legacy;
        }
      }
      let state;
      if (!serialized) {
        state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        saveState(state);
      } else {
        state = JSON.parse(serialized);
      }
      if (!state.user && state.profile) {
        state.user = Object.assign({}, DEFAULT_STATE.user, state.profile);
      }
      if (!state.profile && state.user) {
        state.profile = Object.assign({}, DEFAULT_STATE.profile, state.user);
      }
      state.user = Object.assign({}, DEFAULT_STATE.user, state.user || {});
      state.profile = Object.assign({}, DEFAULT_STATE.profile, state.profile || {});
      state.academic = normalizeAcademicFields(state.academic);
      state.progress = Object.assign({}, DEFAULT_STATE.progress, state.progress || {});
      if (!Array.isArray(state.savedOpportunities)) {
        state.savedOpportunities = [];
      }
      return state;
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  }

  function saveState(state) {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch (e) {}
  }

  function loadAdminCatalog() {
    try {
      if (typeof localStorage === "undefined") {
        return { universities: [], colleges: [], subjects: [], papers: [], mcqs: [], flashcards: [], opportunities: [] };
      }
      const raw = localStorage.getItem(ADMIN_CATALOG_KEY);
      if (!raw) {
        return { universities: [], colleges: [], subjects: [], papers: [], mcqs: [], flashcards: [], opportunities: [] };
      }
      const parsed = JSON.parse(raw);
      return {
        universities: Array.isArray(parsed.universities) ? parsed.universities : [],
        colleges: Array.isArray(parsed.colleges) ? parsed.colleges : [],
        subjects: Array.isArray(parsed.subjects) ? parsed.subjects : [],
        papers: Array.isArray(parsed.papers) ? parsed.papers : [],
        mcqs: Array.isArray(parsed.mcqs) ? parsed.mcqs : [],
        flashcards: Array.isArray(parsed.flashcards) ? parsed.flashcards : [],
        opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities : []
      };
    } catch (_) {
      return { universities: [], colleges: [], subjects: [], papers: [], mcqs: [], flashcards: [], opportunities: [] };
    }
  }

  function saveAdminCatalog(cat) {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(ADMIN_CATALOG_KEY, JSON.stringify(cat));
      }
    } catch (_) {}
  }

  let currentState = loadState();

  function getMergedUniversities() {
    const custom = loadAdminCatalog().universities;
    return custom.concat(UNIVERSITIES);
  }

  function getMergedColleges() {
    const custom = loadAdminCatalog().colleges;
    return custom.concat(COLLEGES);
  }

  function getMergedPapers() {
    const custom = loadAdminCatalog().papers;
    return custom.concat(PYQ_PAPERS);
  }

  function getMergedMcqs() {
    const custom = loadAdminCatalog().mcqs;
    return custom.concat(MCQ_BANK);
  }

  function getMergedFlashcards() {
    const custom = loadAdminCatalog().flashcards;
    return custom.concat(FLASHCARDS);
  }

  function getMergedOpportunities() {
    const custom = loadAdminCatalog().opportunities;
    return custom.concat(OPPORTUNITIES);
  }

  // ----------------------------------------------------
  // 12. PUBLIC CONTROLLER API (EduPrep & EduVantage alias)
  // ----------------------------------------------------
  const api = {
    appName: "EduPrep",
    get universities() { return getMergedUniversities(); },
    get colleges() { return getMergedColleges(); },
    courses: COURSES,
    branches: BRANCHES,
    get pyqPapers() { return getMergedPapers(); },
    get opportunities() { return getMergedOpportunities(); },
    semesters: [
      { number: 1, label: "Semester 1", year: "First Year (FE)" },
      { number: 2, label: "Semester 2", year: "First Year (FE)" },
      { number: 3, label: "Semester 3", year: "Second Year (SE)" },
      { number: 4, label: "Semester 4", year: "Second Year (SE)" },
      { number: 5, label: "Semester 5", year: "Third Year (TE)" },
      { number: 6, label: "Semester 6", year: "Third Year (TE)" },
      { number: 7, label: "Semester 7", year: "Final Year (BE)" },
      { number: 8, label: "Semester 8", year: "Final Year (BE)" }
    ],

    getUniversities: function (searchQuery, filterCategory) {
      const q = (searchQuery || "").toLowerCase().trim();
      const cat = filterCategory || "all";
      return getMergedUniversities().filter(function (u) {
        const matchesQuery = !q || u.name.toLowerCase().includes(q) || (u.canonicalName && u.canonicalName.toLowerCase().includes(q)) || (u.shortName && u.shortName.toLowerCase().includes(q)) || u.location.toLowerCase().includes(q);
        let matchesCat = true;
        if (cat === "state") {
          matchesCat = u.type.includes("State") || u.type.includes("Technological") || u.type.includes("Technical");
        } else if (cat === "autonomous") {
          matchesCat = u.isAutonomousUniv || u.type.includes("Private") || u.type.includes("Deemed") || u.type.includes("Autonomous");
        }
        return matchesQuery && matchesCat;
      });
    },

    getColleges: function (universityId, institutionType, searchQuery) {
      const q = (searchQuery || "").toLowerCase().trim();
      const instType = institutionType || "all";
      let list = getMergedColleges();

      if (universityId) {
        list = list.filter(function (c) {
          return c.universityId === universityId;
        });
      }

      if (instType === "autonomous" || instType === "Autonomous") {
        list = list.filter(function (c) { return c.isAutonomous; });
      } else if (instType === "affiliated" || instType === "Affiliated") {
        list = list.filter(function (c) { return !c.isAutonomous; });
      }

      if (q) {
        list = list.filter(function (c) {
          return c.name.toLowerCase().includes(q) ||
                 (c.abbreviation && c.abbreviation.toLowerCase().includes(q)) ||
                 c.location.toLowerCase().includes(q) ||
                 (c.city && c.city.toLowerCase().includes(q)) ||
                 (c.code && c.code.toLowerCase().includes(q));
        });
      }

      return list;
    },

    getCourses: function (searchQuery) {
      const q = (searchQuery || "").toLowerCase().trim();
      if (!q) return COURSES;
      return COURSES.filter(function (c) {
        return c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
      });
    },

    getBranches: function (courseId, searchQuery) {
      const q = (searchQuery || "").toLowerCase().trim();
      const course = COURSES.find(function (c) { return c.id === courseId || c.name === courseId; }) || COURSES[0];
      let list = BRANCHES.filter(function (b) {
        if (!course) return true;
        if (course.category === "engineering" || course.category === "engineering_pg" || course.category === "diploma") {
          return b.category.includes("Engineering") || b.category.includes("Computing") || b.category.includes("AI") || b.category.includes("Core") || b.category.includes("Emerging") || b.category.includes("Electronics");
        }
        if (course.category === "computing" || course.category === "computing_pg") {
          return b.category.includes("Computing") || b.category.includes("AI") || b.category.includes("IT");
        }
        if (course.category === "management") {
          return b.category.includes("Management");
        }
        if (course.category === "commerce") {
          return b.category.includes("Commerce");
        }
        return true;
      });
      if (list.length === 0) list = BRANCHES;
      if (q) {
        list = list.filter(function (b) {
          return b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q);
        });
      }
      return list;
    },

    getSemesters: function (courseId) {
      const course = COURSES.find(function (c) { return c.id === courseId || c.name === courseId; });
      const maxSem = (course && course.semesters) ? course.semesters : 8;
      return api.semesters.slice(0, maxSem);
    },

    resolveBranchId: function (branchIdOrName) {
      if (!branchIdOrName) return "ce";
      if (SUBJECTS_CATALOG[branchIdOrName]) return branchIdOrName;
      const lower = String(branchIdOrName).toLowerCase().trim();
      const found = BRANCHES.find(function (b) {
        return b.id.toLowerCase() === lower || b.name.toLowerCase() === lower || b.code.toLowerCase() === lower;
      });
      if (found && SUBJECTS_CATALOG[found.id]) return found.id;
      if (lower.includes("info") || lower === "it") return "it";
      if (lower.includes("data") || lower.includes("ds")) return "cs_ds";
      if (lower.includes("ai") || lower.includes("machine")) return "cs_aiml";
      if (lower.includes("cyber")) return "cs_cyber";
      if (lower.includes("iot")) return "cs_iot";
      if (lower.includes("elec") || lower.includes("extc")) return "extc";
      if (lower.includes("mech")) return "mech";
      if (lower.includes("civil")) return "civil";
      return "ce";
    },

    getSubjects: function (branchIdOrName, semesterNumber) {
      const bKey = api.resolveBranchId(branchIdOrName || currentState.academic.branchId || currentState.academic.branch);
      const semKey = parseInt(semesterNumber || currentState.academic.semester || 4, 10);
      const branchCatalog = SUBJECTS_CATALOG[bKey] || SUBJECTS_CATALOG["ce"];
      const baseList = branchCatalog[semKey] || branchCatalog[4] || [];
      const customSubs = loadAdminCatalog().subjects.filter(function (s) {
        return (!s.semester || Number(s.semester) === semKey);
      });
      return customSubs.concat(baseList);
    },

    getCoreSubjects: function (branchIdOrName, semesterNumber) {
      const all = api.getSubjects(branchIdOrName, semesterNumber);
      const core = all.filter(function (s) { return s.isCore !== false; });
      return core.slice(0, 5);
    },

    getOtherSubjects: function (branchIdOrName, semesterNumber) {
      const bKey = api.resolveBranchId(branchIdOrName || currentState.academic.branchId || currentState.academic.branch);
      const semKey = parseInt(semesterNumber || currentState.academic.semester || 4, 10);
      const currentCoreCodes = new Set(api.getCoreSubjects(bKey, semKey).map(function (s) { return s.code; }));
      const others = [];
      const branchCatalog = SUBJECTS_CATALOG[bKey] || SUBJECTS_CATALOG["ce"];
      Object.keys(branchCatalog).forEach(function (sNum) {
        (branchCatalog[sNum] || []).forEach(function (subj) {
          if (!currentCoreCodes.has(subj.code) && !others.some(function (o) { return o.code === subj.code; })) {
            others.push(Object.assign({}, subj, { isCore: false, semester: parseInt(sNum, 10) }));
          }
        });
      });
      return others;
    },

    getAllTopicsForSubject: function (subjectCode) {
      const units = api.getUnitsForSubject(subjectCode);
      const topicsList = [];
      units.forEach(function (unit, uIdx) {
        (unit.topics || []).forEach(function (topic, tIdx) {
          topicsList.push({
            id: topic.id,
            title: topic.title,
            unitNum: unit.unitNum,
            unitTitle: unit.title,
            unitIndex: uIdx,
            topicIndex: tIdx,
            hours: topic.hours,
            pyqMentions: topic.pyqMentions,
            summary: topic.summary,
            keyFormulaOrRule: topic.keyFormulaOrRule,
            isCompleted: (currentState.progress.completedTopics || []).includes(topic.id),
            topic: topic
          });
        });
      });
      return topicsList;
    },

    getLastUnfinishedTopic: function (subjectCode) {
      const allTopics = api.getAllTopicsForSubject(subjectCode);
      const completedSet = new Set(currentState.progress.completedTopics || []);
      const unfinished = allTopics.find(function (t) { return !completedSet.has(t.id); });
      return unfinished || allTopics[0] || null;
    },

    getSubjectByCode: function (code) {
      const custom = loadAdminCatalog().subjects.find(function (s) {
        return s.code && s.code.toLowerCase() === String(code || "").toLowerCase();
      });
      if (custom) return custom;
      for (const branch in SUBJECTS_CATALOG) {
        for (const sem in SUBJECTS_CATALOG[branch]) {
          const found = SUBJECTS_CATALOG[branch][sem].find(function (s) {
            return s.code.toLowerCase() === (code || "").toLowerCase() ||
                   (s.short && s.short.toLowerCase() === (code || "").toLowerCase()) ||
                   s.name.toLowerCase() === (code || "").toLowerCase();
          });
          if (found) return found;
        }
      }
      return SUBJECTS_CATALOG["ce"][4][0];
    },

    getUnitsForSubject: function (subjectCode) {
      const code = (subjectCode || "CSC401").toUpperCase();
      if (SUBJECT_UNITS_DATA[code]) {
        return SUBJECT_UNITS_DATA[code];
      }
      return SUBJECT_UNITS_DATA["CSC401"];
    },

    getTopicDetails: function (subjectCode, unitIndex, topicIndex) {
      const units = api.getUnitsForSubject(subjectCode);
      const uIdx = Math.max(0, Math.min(unitIndex || 0, units.length - 1));
      const unit = units[uIdx];
      const tIdx = Math.max(0, Math.min(topicIndex || 0, unit.topics.length - 1));
      return {
        unitNum: unit.unitNum,
        unitTitle: unit.title,
        weightage: unit.weightage,
        topic: unit.topics[tIdx]
      };
    },

    getFlashcards: function (subjectFilter) {
      const allCards = getMergedFlashcards();
      if (!subjectFilter || subjectFilter === "all" || subjectFilter === "ALL") return allCards;
      const q = subjectFilter.toLowerCase();
      return allCards.filter(function (f) {
        const s = (f.subject || "").toLowerCase();
        if (s.includes(q)) return true;
        if ((q === "dsa" || q === "algo" || q === "algorithms") && s.includes("data structures")) return true;
        if ((q === "os" || q === "operating") && s.includes("operating systems")) return true;
        if ((q === "cn" || q === "networks" || q === "network") && s.includes("computer networks")) return true;
        if ((q === "dbms" || q === "database" || q === "db") && s.includes("database management")) return true;
        return false;
      });
    },

    getMcqBank: function (subjectFilter) {
      const allMcqs = getMergedMcqs();
      if (!subjectFilter || subjectFilter === "all" || subjectFilter === "ALL") return allMcqs;
      const q = subjectFilter.toLowerCase();
      return allMcqs.filter(function (m) {
        const s = (m.subject || "").toLowerCase();
        if (s.includes(q)) return true;
        if ((q === "dsa" || q === "algo" || q === "algorithms") && s.includes("data structures")) return true;
        if ((q === "os" || q === "operating") && s.includes("operating systems")) return true;
        if ((q === "cn" || q === "networks" || q === "network") && s.includes("computer networks")) return true;
        if ((q === "dbms" || q === "database" || q === "db") && s.includes("database management")) return true;
        return false;
      });
    },

    getPyqPapers: function () { return getMergedPapers(); },
    getOpportunities: function () { return getMergedOpportunities(); },

    getAiKnowledge: function (query) {
      const q = (query || "").toLowerCase();
      if (q.includes("process") || q.includes("thread")) return AI_KNOWLEDGE["process vs thread"].summary;
      if (q.includes("deadlock") || q.includes("banker")) return AI_KNOWLEDGE["deadlock"].summary;
      if (q.includes("page") || q.includes("memory")) return AI_KNOWLEDGE["paging"].summary;
      return "Hello! I am your EduPrep AI Study Assistant. Ask me any concept from your syllabus, algorithm step-by-step explanations, or exam question solutions.";
    },

    getAiResponse: function (query, persona, mode) {
      return formatAiResponseHtml(query, persona || currentState.aiTutorPersona, mode || "explain");
    },

    // State & Profile Operations
    getState: function () {
      currentState.academic = normalizeAcademicFields(currentState.academic);
      return currentState;
    },

    saveState: function (stateToSave) {
      if (stateToSave) {
        currentState = stateToSave;
        currentState.academic = normalizeAcademicFields(currentState.academic);
      }
      saveState(currentState);
      return currentState;
    },

    setState: function (updates) {
      currentState = Object.assign({}, currentState, updates);
      currentState.academic = normalizeAcademicFields(currentState.academic);
      saveState(currentState);
      return currentState;
    },

    updateAcademic: function (academicUpdates) {
      const updates = Object.assign({}, academicUpdates || {});
      const oldUniv = currentState.academic.universityId;
      const newUniv = updates.universityId || oldUniv;

      // If university changed and college was not explicitly passed, reset invalid child college
      if (newUniv !== oldUniv && updates.collegeId === undefined && updates.college === undefined) {
        const currentColId = currentState.academic.collegeId;
        if (currentColId) {
          const col = getMergedColleges().find(function (c) { return c.id === currentColId; });
          if (col && col.universityId !== newUniv) {
            const firstValid = getMergedColleges().find(function (c) { return c.universityId === newUniv; });
            updates.collegeId = firstValid ? firstValid.id : "";
            updates.college = firstValid ? firstValid.name : "";
            updates.collegeName = updates.college;
          }
        }
      }

      if (updates.university && !updates.universityName) updates.universityName = updates.university;
      if (updates.universityName && !updates.university) updates.university = updates.universityName;
      if (updates.college && !updates.collegeName) updates.collegeName = updates.college;
      if (updates.collegeName && !updates.college) updates.college = updates.collegeName;
      if (updates.branch && !updates.branchName) updates.branchName = updates.branch;
      if (updates.branchName && !updates.branch) updates.branch = updates.branchName;
      if (updates.course && !updates.courseName) updates.courseName = updates.course;
      if (updates.courseName && !updates.course) updates.course = updates.courseName;

      currentState.academic = normalizeAcademicFields(Object.assign({}, currentState.academic, updates));
      saveState(currentState);
      if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
        window.dispatchEvent(new CustomEvent("eduprep:academicUpdated", { detail: currentState.academic }));
        window.dispatchEvent(new CustomEvent("eduvantage:academicUpdated", { detail: currentState.academic }));
      }
      return currentState.academic;
    },

    updateProfile: function (profileData) {
      currentState.profile = Object.assign({}, currentState.profile, profileData);
      currentState.user = Object.assign({}, currentState.user, profileData);
      saveState(currentState);
      return currentState.profile;
    },

    setSemester: function (semesterNumber) {
      const sem = parseInt(semesterNumber, 10);
      if (sem >= 1 && sem <= 8) {
        currentState.academic.semester = sem;
        saveState(currentState);
        if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
          window.dispatchEvent(new CustomEvent("eduprep:semesterChanged", { detail: { semester: sem } }));
          window.dispatchEvent(new CustomEvent("eduvantage:semesterChanged", { detail: { semester: sem } }));
        }
      }
      return currentState.academic.semester;
    },

    toggleTopicCompleted: function (topicId) {
      const completed = new Set(currentState.progress.completedTopics || []);
      if (completed.has(topicId)) {
        completed.delete(topicId);
      } else {
        completed.add(topicId);
      }
      currentState.progress.completedTopics = Array.from(completed);
      saveState(currentState);
      return completed.has(topicId);
    },

    toggleFlashcardMastered: function (cardId) {
      const mastered = new Set(currentState.progress.masteredFlashcards || []);
      const review = new Set(currentState.progress.reviewFlashcards || []);
      if (mastered.has(cardId)) {
        mastered.delete(cardId);
      } else {
        mastered.add(cardId);
        review.delete(cardId);
      }
      currentState.progress.masteredFlashcards = Array.from(mastered);
      currentState.progress.reviewFlashcards = Array.from(review);
      saveState(currentState);
      return { isMastered: mastered.has(cardId) };
    },

    toggleFlashcardReview: function (cardId) {
      const review = new Set(currentState.progress.reviewFlashcards || []);
      const mastered = new Set(currentState.progress.masteredFlashcards || []);
      if (review.has(cardId)) {
        review.delete(cardId);
      } else {
        review.add(cardId);
        mastered.delete(cardId);
      }
      currentState.progress.reviewFlashcards = Array.from(review);
      currentState.progress.masteredFlashcards = Array.from(mastered);
      saveState(currentState);
      return { isReview: review.has(cardId) };
    },

    toggleBookmark: function (type, id) {
      if (type === "question") {
        const qBookmarks = new Set(currentState.progress.bookmarkedQuestions || []);
        if (qBookmarks.has(id)) qBookmarks.delete(id);
        else qBookmarks.add(id);
        currentState.progress.bookmarkedQuestions = Array.from(qBookmarks);
        saveState(currentState);
        return qBookmarks.has(id);
      }
      const bookmarks = new Set(currentState.progress.bookmarkedPapers || []);
      if (bookmarks.has(id)) {
        bookmarks.delete(id);
      } else {
        bookmarks.add(id);
      }
      currentState.progress.bookmarkedPapers = Array.from(bookmarks);
      currentState.profile.totalBookmarks = currentState.progress.bookmarkedPapers.length;
      saveState(currentState);
      return bookmarks.has(id);
    },

    recordQuizResult: function (score, total, extraMeta) {
      const safeTotal = Math.max(1, Number(total) || 1);
      const safeScore = Math.max(0, Number(score) || 0);
      const pct = Math.round((safeScore / safeTotal) * 100);
      const accuracy = pct + "%";
      const meta = typeof extraMeta === "string" ? { subject: extraMeta } : (extraMeta || {});
      if (!Array.isArray(currentState.progress.quizScores)) {
        currentState.progress.quizScores = [];
      }
      currentState.progress.quizScores.unshift({
        id: meta.id || ("att_" + Date.now()),
        subject: meta.subject || "Operating Systems",
        mode: meta.mode || "practice",
        date: new Date().toISOString().split("T")[0],
        score: safeScore,
        total: safeTotal,
        answered: meta.answered !== undefined ? meta.answered : safeTotal,
        unanswered: meta.unanswered !== undefined ? meta.unanswered : 0,
        scorePercent: pct,
        accuracy: accuracy,
        durationSeconds: meta.durationSeconds || 180
      });
      saveState(currentState);
      return currentState.progress.quizScores[0];
    },

    // Real calculated metrics (no fake counters)
    getComputedMetrics: function () {
      const progress = currentState.progress || {};
      const completedTopics = (progress.completedTopics || []).length;
      const masteredCards = (progress.masteredFlashcards || []).length;
      const reviewCards = (progress.reviewFlashcards || []).length;
      const quizScores = progress.quizScores || [];
      const testsTaken = quizScores.length;
      const bookmarksCount =
        (progress.bookmarkedPapers || []).length +
        (progress.bookmarkedQuestions || []).length +
        (currentState.savedOpportunities || []).length;

      let avgScore = 0;
      let quizSeconds = 0;
      if (testsTaken > 0) {
        const totalPct = quizScores.reduce(function (acc, q) {
          const pct = q.scorePercent !== undefined ? q.scorePercent : Math.round(((q.score || 0) / (q.total || 1)) * 100);
          quizSeconds += Number(q.durationSeconds || 180);
          return acc + pct;
        }, 0);
        avgScore = Math.round(totalPct / testsTaken);
      }

      const studyMins = completedTopics * 25 + masteredCards * 2 + Math.round(quizSeconds / 60);
      const studyHoursLabel = studyMins >= 60 ? (studyMins / 60).toFixed(1) + "h" : studyMins + "m";

      return {
        completedTopics: completedTopics,
        masteredFlashcards: masteredCards,
        reviewFlashcards: reviewCards,
        testsTaken: testsTaken,
        averageQuizScore: avgScore,
        totalBookmarks: bookmarksCount,
        studyTimeLabel: studyHoursLabel,
        studyMinutes: studyMins
      };
    },

    // Admin Content Management Operations
    getAdminCatalog: function () {
      return loadAdminCatalog();
    },

    addAdminItem: function (categoryKey, item) {
      const cat = loadAdminCatalog();
      if (!cat[categoryKey]) {
        return { ok: false, error: "Unknown catalog category: " + categoryKey };
      }
      cat[categoryKey].unshift(item);
      saveAdminCatalog(cat);
      return { ok: true, item: item };
    },

    deleteAdminItem: function (categoryKey, id) {
      const cat = loadAdminCatalog();
      if (!cat[categoryKey]) return false;
      cat[categoryKey] = cat[categoryKey].filter(function (x) { return x.id !== id && x.code !== id; });
      saveAdminCatalog(cat);
      return true;
    },

    reportContent: function (itemType, itemId, reason, details) {
      try {
        const raw = (typeof localStorage !== "undefined" && localStorage.getItem(CONTENT_REPORTS_KEY)) || "[]";
        const list = JSON.parse(raw);
        const entry = {
          id: "rep_" + Date.now(),
          itemType: itemType,
          itemId: itemId,
          reason: reason,
          details: details || "",
          status: "open",
          createdAt: new Date().toISOString()
        };
        list.unshift(entry);
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(CONTENT_REPORTS_KEY, JSON.stringify(list));
        }
        return entry;
      } catch (_) {
        return null;
      }
    },

    getContentReports: function () {
      try {
        const raw = (typeof localStorage !== "undefined" && localStorage.getItem(CONTENT_REPORTS_KEY)) || "[]";
        return JSON.parse(raw);
      } catch (_) {
        return [];
      }
    },

    // Printable Sample Question Paper Generator
    openPrintablePaper: function (paperId) {
      const paper = getMergedPapers().find(function (p) { return p.id === paperId; }) || getMergedPapers()[0];
      if (!paper) return;
      const win = window.open("", "_blank");
      if (!win) {
        api.showToast("Please allow pop-ups to open the printable question paper sheet.", "warning");
        return;
      }
      const sectionsHtml = (paper.questions || [
        { qNo: "Q.1", marks: "20 Marks", title: "Compulsory — Answer any FOUR (5 Marks each)", items: [
          "(a) Define core architectural models and fundamental principles of " + paper.subject + ".",
          "(b) Compare primary algorithms and state their time/space complexity trade-offs.",
          "(c) Explain fault tolerance, synchronization, or error recovery mechanisms.",
          "(d) Solve a short numerical problem based on Unit 3 & Unit 4 formulas."
        ]},
        { qNo: "Q.2", marks: "20 Marks", title: "Attempt any TWO (10 Marks each)", items: [
          "(a) Derive the complete step-by-step trace for the primary high-weightage algorithm in " + paper.subject + ".",
          "(b) Design and explain the subsystem architecture with a neat labeled block diagram."
        ]}
      ]).map(function (sec) {
        return "<div style=\\"margin-bottom:18px;padding:14px;border:1px solid #d1d5db;border-radius:8px;\\">" +
          "<div style=\\"display:flex;justify-content:space-between;font-weight:bold;margin-bottom:8px;\\">" +
            "<span>" + sec.qNo + " — " + sec.title + "</span>" +
            "<span>[" + sec.marks + "]</span>" +
          "</div>" +
          "<ul style=\\"margin:0;padding-left:20px;line-height:1.6;\\">" +
            sec.items.map(function (it) { return "<li>" + it + "</li>"; }).join("") +
          "</ul>" +
        "</div>";
      }).join("");

      win.document.write(
        "<!DOCTYPE html><html><head><meta charset=\\"utf-8\\"><title>" + paper.subject + " (" + paper.session + " " + paper.year + ") — EduPrep Sample Paper</title>" +
        "<style>body{font-family:Inter,Arial,sans-serif;max-width:800px;margin:24px auto;padding:0 16px;color:#111827;} .badge{display:inline-block;padding:4px 10px;background:#fef3c7;color:#92400e;border:1px solid #f59e0b;border-radius:999px;font-size:12px;font-weight:bold;margin-bottom:12px;}</style></head><body>" +
        "<div class=\\"badge\\">SAMPLE / DEMO PRACTICE QUESTION PAPER — NOT AN OFFICIAL UNIVERSITY PUBLICATION</div>" +
        "<h1 style=\\"margin:0 0 4px 0;font-size:22px;\\">" + paper.subject + " (" + (paper.subjectCode || paper.code) + ")</h1>" +
        "<p style=\\"margin:0 0 16px 0;color:#4b5563;font-size:14px;\\">Session: " + paper.session + " " + paper.year + " • Semester " + paper.semester + " • Duration: 3 Hours • Max Marks: 80</p>" +
        "<hr style=\\"border:none;border-top:2px solid #111827;margin-bottom:20px;\\"/>" +
        sectionsHtml +
        "<div style=\\"margin-top:24px;text-align:center;\\"><button onclick=\\"window.print()\\" style=\\"padding:10px 20px;background:#4648d4;color:#fff;border:none;border-radius:8px;font-weight:bold;cursor:pointer;\\">Print / Save as PDF</button></div>" +
        "</body></html>"
      );
      win.document.close();
    },

    // Navigation helper (supports query strings cleanly)
    navigateTo: function (pageFolderAndQuery) {
      const raw = String(pageFolderAndQuery || "home_dashboard");
      const parts = raw.split("?");
      const folder = parts[0].replace(/^\\/+|\\/+$/g, "");
      const query = parts.length > 1 ? "?" + parts.slice(1).join("?") : "";

      if (typeof window !== "undefined") {
        if (folder === "index" || folder === "home") {
          window.location.href = "../index.html" + query;
          return;
        }
        if (folder === "login" || folder === "signin") {
          window.location.href = "../login_registration/code.html" + query;
          return;
        }
        if (folder === "register" || folder === "signup") {
          window.location.href = "../login_registration/code.html?mode=register";
          return;
        }
        if (folder === "forgot-password" || folder === "reset-password") {
          window.location.href = "../login_registration/code.html?mode=reset";
          return;
        }
        if (folder === "dashboard") {
          window.location.href = "../home_dashboard/code.html" + query;
          return;
        }
        window.location.href = "../" + folder + "/code.html" + query;
      }
    },

    showToast: function (message, type) {
      if (typeof document === "undefined") return;
      const toastType = type || "success";
      let toast = document.getElementById("eduprep-toast");
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "eduprep-toast";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        toast.className = "fixed bottom-6 right-6 z-50 transform transition-all duration-300 pointer-events-none opacity-0 translate-y-4";
        document.body.appendChild(toast);
      }
      const isSuccess = toastType === "success";
      const isWarning = toastType === "warning";
      const isInfo = toastType === "info";

      let bgClass = "bg-slate-900 text-white border-primary/30 shadow-[0_10px_30px_rgba(70,72,212,0.25)]";
      let icon = "check_circle";
      let iconColor = "text-primary";

      if (isWarning) {
        bgClass = "bg-amber-950 text-amber-100 border-amber-600/50 shadow-lg";
        icon = "warning";
        iconColor = "text-amber-400";
      } else if (isInfo) {
        bgClass = "bg-slate-900 text-slate-100 border-blue-500/40 shadow-lg";
        icon = "info";
        iconColor = "text-blue-400";
      } else if (!isSuccess) {
        bgClass = "bg-red-950 text-red-100 border-red-500 shadow-lg";
        icon = "error";
        iconColor = "text-red-400";
      }

      toast.innerHTML = "<div class=\\"flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-xs sm:text-sm font-medium " + bgClass + "\\">" +
        "<span class=\\"material-symbols-outlined text-base " + iconColor + "\\">" + icon + "</span>" +
        "<span>" + message + "</span>" +
        "</div>";
      toast.classList.remove("opacity-0", "translate-y-4");
      toast.classList.add("opacity-100", "translate-y-0");
      setTimeout(function () {
        toast.classList.remove("opacity-100", "translate-y-0");
        toast.classList.add("opacity-0", "translate-y-4");
      }, 2800);
    },

    // Interactive Topic Learning Hub Modal
    openTopicModal: function (subjectCode, unitIndex, topicIndex) {
      let modal = document.getElementById("topic-learning-modal");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "topic-learning-modal";
        modal.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-200 opacity-0 pointer-events-none";
        document.body.appendChild(modal);
      }

      const details = api.getTopicDetails(subjectCode, unitIndex, topicIndex);
      const isCompleted = (currentState.progress.completedTopics || []).includes(details.topic.id);

      modal.innerHTML = "<div class=\\"bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-surface-variant/80 p-6 transform scale-95 transition-transform duration-200 max-h-[90vh] overflow-y-auto\\" id=\\"topicModalCard\\">" +
        "<div class=\\"flex items-start justify-between pb-4 mb-4 border-b border-surface-variant\\">" +
          "<div>" +
            "<div class=\\"flex items-center gap-2 mb-1\\">" +
              "<span class=\\"text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20\\">" +
                details.unitTitle + " • " + details.weightage +
              "</span>" +
              (isCompleted ? "<span class=\\"text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1\\"><span class=\\"material-symbols-outlined text-xs\\">check_circle</span> Completed</span>" : "") +
            "</div>" +
            "<h3 class=\\"font-extrabold text-lg sm:text-xl text-on-surface leading-snug\\">" + details.topic.title + "</h3>" +
            "<p class=\\"text-xs text-on-surface-variant mt-1 flex items-center gap-2\\">" +
              "<span class=\\"material-symbols-outlined text-sm text-primary\\">schedule</span>" +
              "<span>Teaching Duration: " + details.topic.hours + "</span>" +
              "<span>•</span>" +
              "<span class=\\"material-symbols-outlined text-sm text-amber-500\\">history_edu</span>" +
              "<span>PYQ: " + details.topic.pyqMentions + "</span>" +
            "</p>" +
          "</div>" +
          "<button onclick=\\"EduPrep.closeTopicModal()\\" class=\\"p-1.5 rounded-lg hover:bg-surface-variant text-on-surface-variant transition-colors\\">" +
            "<span class=\\"material-symbols-outlined text-xl\\">close</span>" +
          "</button>" +
        "</div>" +
        "<div class=\\"space-y-4 mb-6\\">" +
          "<div class=\\"p-4 rounded-xl bg-surface-container-low border border-surface-variant/60\\">" +
            "<h4 class=\\"text-xs font-bold uppercase tracking-wider text-primary mb-1 flex items-center gap-1.5\\">" +
              "<span class=\\"material-symbols-outlined text-sm\\">menu_book</span> Core Concept Notes" +
            "</h4>" +
            "<p class=\\"text-xs sm:text-sm text-on-surface leading-relaxed\\">" + details.topic.summary + "</p>" +
          "</div>" +
          "<div class=\\"p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30\\">" +
            "<h4 class=\\"text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 mb-1 flex items-center gap-1.5\\">" +
              "<span class=\\"material-symbols-outlined text-sm\\">bolt</span> High-Yield Exam Formula / Takeaway" +
            "</h4>" +
            "<p class=\\"text-xs sm:text-sm font-mono text-amber-900 dark:text-amber-100 font-semibold\\">" + details.topic.keyFormulaOrRule + "</p>" +
          "</div>" +
        "</div>" +
        "<div class=\\"grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6\\">" +
          "<button onclick=\\"EduPrep.closeTopicModal(); EduPrep.navigateTo('mcq_practice_exam')\\" class=\\"p-3 rounded-xl border border-surface-variant hover:border-primary/50 bg-surface flex flex-col items-center text-center transition-all group\\">" +
            "<span class=\\"material-symbols-outlined text-primary text-xl mb-1 group-hover:scale-110 transition-transform\\">quiz</span>" +
            "<span class=\\"text-xs font-bold text-on-surface\\">Practice Topic MCQs</span>" +
            "<span class=\\"text-[10px] text-on-surface-variant\\">" + details.topic.mcqsCount + " Questions</span>" +
          "</button>" +
          "<button onclick=\\"EduPrep.closeTopicModal(); EduPrep.navigateTo('revision_flashcards')\\" class=\\"p-3 rounded-xl border border-surface-variant hover:border-primary/50 bg-surface flex flex-col items-center text-center transition-all group\\">" +
            "<span class=\\"material-symbols-outlined text-primary text-xl mb-1 group-hover:scale-110 transition-transform\\">style</span>" +
            "<span class=\\"text-xs font-bold text-on-surface\\">Topic Flashcards</span>" +
            "<span class=\\"text-[10px] text-on-surface-variant\\">" + details.topic.flashcardsCount + " Memory Cards</span>" +
          "</button>" +
          "<button onclick=\\"EduPrep.closeTopicModal(); EduPrep.navigateTo('study_ai_assistant')\\" class=\\"p-3 rounded-xl border border-surface-variant hover:border-primary/50 bg-surface flex flex-col items-center text-center transition-all group\\">" +
            "<span class=\\"material-symbols-outlined text-primary text-xl mb-1 group-hover:scale-110 transition-transform\\">smart_toy</span>" +
            "<span class=\\"text-xs font-bold text-on-surface\\">Ask Study AI</span>" +
            "<span class=\\"text-[10px] text-on-surface-variant\\">Instant Socratic Explanation</span>" +
          "</button>" +
        "</div>" +
        "<div class=\\"flex items-center justify-between pt-4 border-t border-surface-variant\\">" +
          "<button onclick=\\"EduPrep.toggleTopicCompletedAndRefresh('" + details.topic.id + "', '" + subjectCode + "')\\" class=\\"px-4 py-2 rounded-xl border border-outline-variant text-xs font-semibold text-on-surface hover:bg-surface-variant flex items-center gap-1.5 transition-colors\\">" +
            "<span class=\\"material-symbols-outlined text-sm\\">" + (isCompleted ? "check_box" : "check_box_outline_blank") + "</span>" +
            "<span>" + (isCompleted ? "Mark as Incomplete" : "Mark Topic as Completed") + "</span>" +
          "</button>" +
          "<button onclick=\\"EduPrep.closeTopicModal()\\" class=\\"px-5 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-container shadow-md transition-all\\">" +
            "Done Studying Topic" +
          "</button>" +
        "</div>" +
      "</div>";

      modal.classList.remove("opacity-0", "pointer-events-none");
      modal.classList.add("opacity-100", "pointer-events-auto");
      setTimeout(function () {
        const card = document.getElementById("topicModalCard");
        if (card) card.classList.remove("scale-95");
      }, 50);
    },

    toggleTopicCompletedAndRefresh: function (topicId, subjectCode) {
      const isNowCompleted = api.toggleTopicCompleted(topicId);
      api.showToast(isNowCompleted ? "Topic marked as Completed!" : "Topic marked as Incomplete", "info");
      api.closeTopicModal();
      if (typeof window !== "undefined" && typeof window.renderSubjectHub === "function") {
        window.renderSubjectHub();
      }
    },

    closeTopicModal: function () {
      const modal = document.getElementById("topic-learning-modal");
      if (modal) {
        modal.classList.remove("opacity-100", "pointer-events-auto");
        modal.classList.add("opacity-0", "pointer-events-none");
      }
    },

    // Modal: Universal Interactive Semester Selector
    openSemesterModal: function (onSelectedCallback) {
      let modal = document.getElementById("semester-switcher-modal");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "semester-switcher-modal";
        modal.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-200 opacity-0 pointer-events-none";
        document.body.appendChild(modal);
      }

      const activeSem = currentState.academic.semester || 4;
      let gridButtons = "";
      [1, 2, 3, 4, 5, 6, 7, 8].forEach(function (s) {
        const isCurrent = s === activeSem;
        gridButtons += "<button onclick=\\"EduPrep.selectSemesterFromModal(" + s + ")\\" class=\\"h-12 rounded-xl text-sm font-bold border transition-all flex flex-col items-center justify-center " +
          (isCurrent ? "bg-primary text-white border-primary shadow-md scale-105 ring-2 ring-primary/20" : "bg-surface hover:bg-surface-variant text-on-surface border-surface-variant hover:border-primary/40") + "\\">" +
          "<span class=\\"text-[10px] font-normal uppercase opacity-70\\">Sem</span>" +
          "<span>" + s + "</span>" +
          "</button>";
      });

      modal.innerHTML = "<div class=\\"bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-surface-variant/80 p-6 transform scale-95 transition-transform duration-200\\" id=\\"semModalCard\\">" +
        "<div class=\\"flex justify-between items-center mb-4 pb-3 border-b border-surface-variant\\">" +
          "<div class=\\"flex items-center gap-2\\">" +
            "<span class=\\"material-symbols-outlined text-primary text-2xl\\">calendar_month</span>" +
            "<div>" +
              "<h3 class=\\"font-bold text-base text-on-surface\\">Switch Current Active Semester</h3>" +
              "<p class=\\"text-xs text-on-surface-variant\\">" + (currentState.academic.branchName || "Computer Engineering") + "</p>" +
            "</div>" +
          "</div>" +
          "<button onclick=\\"EduPrep.closeSemesterModal()\\" class=\\"p-1.5 rounded-lg hover:bg-surface-variant text-on-surface-variant transition-colors\\">" +
            "<span class=\\"material-symbols-outlined text-xl\\">close</span>" +
          "</button>" +
        "</div>" +
        "<p class=\\"text-xs text-on-surface-variant mb-4 leading-relaxed\\">" +
          "Selecting a new semester immediately recalculates your enrolled subjects, curriculum blueprint, practice question banks, and finals timetable." +
        "</p>" +
        "<div class=\\"grid grid-cols-4 gap-2.5 mb-6\\" id=\\"semesterGridOptions\\">" +
          gridButtons +
        "</div>" +
        "<div class=\\"flex justify-end gap-2 pt-3 border-t border-surface-variant/60\\">" +
          "<button onclick=\\"EduPrep.closeSemesterModal()\\" class=\\"px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-variant transition-colors\\">" +
            "Cancel" +
          "</button>" +
        "</div>" +
      "</div>";

      modal.classList.remove("opacity-0", "pointer-events-none");
      modal.classList.add("opacity-100", "pointer-events-auto");
      setTimeout(function () {
        const card = document.getElementById("semModalCard");
        if (card) card.classList.remove("scale-95");
      }, 50);

      window._semModalCallback = onSelectedCallback;
    },

    selectSemesterFromModal: function (sem) {
      api.setSemester(sem);
      api.showToast("Active Semester switched to Semester " + sem, "success");
      api.closeSemesterModal();
      if (typeof window._semModalCallback === "function") {
        window._semModalCallback(sem);
      } else {
        window.location.reload();
      }
    },

    closeSemesterModal: function () {
      const modal = document.getElementById("semester-switcher-modal");
      if (modal) {
        modal.classList.remove("opacity-100", "pointer-events-auto");
        modal.classList.add("opacity-0", "pointer-events-none");
      }
    },

    // Modal: College / Institution Onboarding Inquiry
    openInstitutionModal: function () {
      let modal = document.getElementById("institution-inquiry-modal");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "institution-inquiry-modal";
        modal.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-200 opacity-0 pointer-events-none";
        document.body.appendChild(modal);
      }

      modal.innerHTML = "<div class=\\"bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-surface-variant/80 p-6 transform scale-95 transition-transform duration-200\\" id=\\"instModalCard\\">" +
        "<div class=\\"flex justify-between items-center mb-4 pb-3 border-b border-surface-variant\\">" +
          "<div class=\\"flex items-center gap-2\\">" +
            "<span class=\\"material-symbols-outlined text-primary text-2xl\\">corporate_fare</span>" +
            "<div>" +
              "<h3 class=\\"font-bold text-base text-on-surface\\">EduPrep Campus & Department Directory</h3>" +
              "<p class=\\"text-xs text-on-surface-variant\\">Request New College or Syllabus Addition</p>" +
            "</div>" +
          "</div>" +
          "<button onclick=\\"EduPrep.closeInstitutionModal()\\" class=\\"p-1.5 rounded-lg hover:bg-surface-variant text-on-surface-variant transition-colors\\">" +
            "<span class=\\"material-symbols-outlined text-xl\\">close</span>" +
          "</button>" +
        "</div>" +
        "<p class=\\"text-xs text-on-surface-variant mb-4 leading-relaxed\\">" +
          "Submit your college or autonomous syllabus details below, or use the Admin Content Manager to add institutions and curriculum modules directly." +
        "</p>" +
        "<form onsubmit=\\"EduPrep.submitInstitutionInquiry(event)\\" class=\\"space-y-3 text-xs\\">" +
          "<div>" +
            "<label class=\\"block font-semibold text-on-surface mb-1\\">Institution / College Name</label>" +
            "<input type=\\"text\\" required placeholder=\\"e.g. Vidyalankar Institute of Technology\\" class=\\"w-full px-3 py-2 rounded-xl border border-surface-variant focus:border-primary outline-none text-on-surface bg-surface\\" />" +
          "</div>" +
          "<div class=\\"grid grid-cols-2 gap-3\\">" +
            "<div>" +
              "<label class=\\"block font-semibold text-on-surface mb-1\\">Contact Person</label>" +
              "<input type=\\"text\\" required placeholder=\\"Student Rep / Faculty Name\\" class=\\"w-full px-3 py-2 rounded-xl border border-surface-variant focus:border-primary outline-none text-on-surface bg-surface\\" />" +
            "</div>" +
            "<div>" +
              "<label class=\\"block font-semibold text-on-surface mb-1\\">Official Email</label>" +
              "<input type=\\"email\\" required placeholder=\\"contact@college.ac.in\\" class=\\"w-full px-3 py-2 rounded-xl border border-surface-variant focus:border-primary outline-none text-on-surface bg-surface\\" />" +
            "</div>" +
          "</div>" +
          "<div class=\\"pt-2 flex justify-end gap-2\\">" +
            "<button type=\\"button\\" onclick=\\"EduPrep.closeInstitutionModal()\\" class=\\"px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-variant transition-colors\\">" +
              "Cancel" +
            "</button>" +
            "<button type=\\"submit\\" class=\\"px-5 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-container shadow-md transition-all\\">" +
              "Submit Request" +
            "</button>" +
          "</div>" +
        "</form>" +
      "</div>";

      modal.classList.remove("opacity-0", "pointer-events-none");
      modal.classList.add("opacity-100", "pointer-events-auto");
      setTimeout(function () {
        const card = document.getElementById("instModalCard");
        if (card) card.classList.remove("scale-95");
      }, 50);
    },

    submitInstitutionInquiry: function (e) {
      e.preventDefault();
      api.showToast("Institution addition request recorded! You can also add colleges directly in the Admin Panel.", "success");
      api.closeInstitutionModal();
    },

    closeInstitutionModal: function () {
      const modal = document.getElementById("institution-inquiry-modal");
      if (modal) {
        modal.classList.remove("opacity-100", "pointer-events-auto");
        modal.classList.add("opacity-0", "pointer-events-none");
      }
    },

    // Session & Sign-out helper
    signOut: function () {
      if (typeof window !== "undefined") {
        if (window.EduPrepSupabase && window.EduPrepSupabase.auth) {
          window.EduPrepSupabase.auth.signOut();
        }
        api.updateProfile({ authMode: "unauthenticated", name: "", email: "" });
        window.location.href = "../login_registration/code.html";
      }
    },
    logout: function () {
      api.signOut();
    }
  };

  // Auto-load companion service scripts and inject unified student website navigation bar on student sub-pages
  if (typeof document !== "undefined" && document.head) {
    const isSubPage = typeof window !== "undefined" && window.location && window.location.pathname.indexOf("/code.html") !== -1;
    const prefix = isSubPage ? "../shared/" : "shared/";
    ["env_config.js", "supabase_client.js", "eduprep_services.js"].forEach(function (file) {
      if (!document.querySelector('script[src*="' + file + '"]')) {
        const s = document.createElement("script");
        s.src = prefix + file;
        s.async = false;
        document.head.appendChild(s);
      }
    });

    if (isSubPage) {
      document.addEventListener("DOMContentLoaded", function () {
        const path = (window.location && window.location.pathname) || "";
        
        // NEVER inject student navigation on public authentication, admin, or marketing pages
        if (/login|register|forgot|reset|admin|index\.html/i.test(path)) {
          return;
        }

        // Only inject on authenticated student pages
        const studentRoutes = [
          "home_dashboard",
          "subject_details_os",
          "previous_year_papers",
          "mcq_practice_exam",
          "revision_flashcards",
          "academic_setup",
          "user_profile_progress",
          "resources_dashboard",
          "questions_practice",
          "study_ai_assistant",
          "student_opportunities"
        ];
        const isStudentPage = studentRoutes.some(function (r) { return path.indexOf(r) !== -1; });
        if (!isStudentPage) return;

        if (document.getElementById("eduprep-student-subnav")) return;
        const navBar = document.createElement("div");
        navBar.id = "eduprep-student-subnav";
        navBar.className = "w-full bg-slate-900 text-slate-200 border-b border-slate-800 text-xs z-40";
        const links = [
          { label: "Home", href: "../index.html", key: "index.html" },
          { label: "Dashboard", href: "../home_dashboard/code.html", key: "home_dashboard" },
          { label: "My Subjects", href: "../subject_details_os/code.html", key: "subject_details_os" },
          { label: "Question Papers", href: "../previous_year_papers/code.html", key: "previous_year_papers" },
          { label: "Practice Tests", href: "../mcq_practice_exam/code.html", key: "mcq_practice_exam" },
          { label: "Flashcards", href: "../revision_flashcards/code.html", key: "revision_flashcards" },
          { label: "Study Planner", href: "../academic_setup/code.html", key: "academic_setup/" },
          { label: "Progress", href: "../user_profile_progress/code.html#stats", key: "#stats" },
          { label: "Profile", href: "../user_profile_progress/code.html", key: "user_profile_progress" }
        ];
        const navHtml = links.map(function (l) {
          const active = path.indexOf(l.key) !== -1;
          return '<a href="' + l.href + '" class="px-2.5 py-1 rounded-lg font-semibold transition-colors whitespace-nowrap ' +
            (active ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white") + '">' + l.label + "</a>";
        }).join("");

        navBar.innerHTML =
          '<div class="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between gap-3 overflow-x-auto">' +
            '<a href="../index.html" class="font-bold text-white flex items-center gap-1.5 shrink-0">' +
              '<span class="material-symbols-outlined text-sm text-indigo-400">school</span>' +
              '<span>EduPrep</span>' +
            '</a>' +
            '<nav aria-label="Global Student Navigation" class="flex items-center gap-1 shrink-0">' + navHtml + '</nav>' +
          '</div>';

        // Ensure vertical flow if body has flex
        if (document.body && document.body.classList.contains("flex") && !document.body.classList.contains("flex-col")) {
          document.body.classList.add("flex-col");
        }
        document.body.insertBefore(navBar, document.body.firstChild);
      });
    }
  }

  return api;
})();

if (typeof window !== "undefined") {
  window.EduPrep = EduPrepCore;
  window.EduVantage = EduPrepCore;
}
if (typeof globalThis !== "undefined") {
  globalThis.EduPrep = EduPrepCore;
  globalThis.EduVantage = EduPrepCore;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = EduPrepCore;
}
`;

const finalOutput = catalogLines + "\n" + tailCode;
fs.writeFileSync(dstPath, finalOutput, "utf8");
fs.writeFileSync(srcPath, finalOutput, "utf8");
console.log("Successfully generated EduPrep/shared/eduprep_data.js and synced eduvantage_data.js (" + finalOutput.split("\n").length + " lines).");
