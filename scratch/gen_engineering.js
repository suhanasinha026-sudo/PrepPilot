// Comprehensive Engineering Stream Dataset (25 Subjects)
const engineeringSubjects = [
  {
    id: "eng_math",
    name: "Engineering Mathematics",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [1, 2, 3, 4],
    description: "Calculus, linear algebra, differential equations, complex variables, Fourier analysis, and probability distributions.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Matrices, Rank & Systems of Linear Equations", desc: "Elementary row transformations, echelon form, rank, consistency criteria, Gauss elimination and Gauss-Jordan methods." },
        { num: 2, title: "Differential Calculus & Successive Differentiation", desc: "Higher order derivatives, nth derivative formulas, Leibnitz theorem for product of two functions and applications." },
        { num: 3, title: "Partial Differentiation & Euler's Theorem", desc: "Multivariable functions, partial derivatives, chain rule, homogeneous functions, and Euler's theorem with corollaries." },
        { num: 4, title: "Maxima, Minima & Lagrange Multipliers", desc: "Extreme values of functions of two variables, stationary points, saddle points, and constrained optimization using Lagrange multipliers." },
        { num: 5, title: "Complex Numbers & De Moivre's Theorem", desc: "Cartesian, polar, and exponential forms, De Moivre's theorem, roots of unity, and expansions of trigonometric powers." }
      ],
      2: [
        { num: 1, title: "First Order Ordinary Differential Equations", desc: "Exact equations, integrating factors, linear differential equations, Bernoulli's equation, and orthogonal trajectories." },
        { num: 2, title: "Higher Order Linear Differential Equations", desc: "Complementary functions, particular integrals, method of variation of parameters, and Cauchy-Euler differential equations." },
        { num: 3, title: "Beta and Gamma Functions & DUIS", desc: "Definitions, symmetry, recurrence relations, relation between Beta and Gamma functions, and Differentiation Under Integral Sign." },
        { num: 4, title: "Multiple Integrals: Double & Triple Integrals", desc: "Evaluation in Cartesian and polar coordinates, change of order of integration, area and volume calculations." },
        { num: 5, title: "Vector Differentiation & Gradient, Divergence, Curl", desc: "Vector differential operator del, scalar and vector fields, directional derivatives, solenoidal and irrotational fields." }
      ],
      3: [
        { num: 1, title: "Laplace Transforms & Properties", desc: "Piecewise continuous functions, shifting theorems, transforms of derivatives and integrals, unit step and Dirac delta." },
        { num: 2, title: "Inverse Laplace Transforms & Convolution Theorem", desc: "Partial fractions method, convolution theorem for inverse transforms, and solving linear ODE initial value problems." },
        { num: 3, title: "Fourier Series & Harmonic Analysis", desc: "Dirichlet's conditions, Euler's formulas, half-range expansions, Parseval's identity, and practical harmonic analysis." },
        { num: 4, title: "Partial Differential Equations", desc: "Formation of PDEs, Lagrange's linear equation, separation of variables method for wave and heat conduction equations." }
      ],
      4: [
        { num: 1, title: "Probability Distributions & Random Variables", desc: "Probability density functions, mathematical expectation, variance, Binomial, Poisson, and Normal distributions." },
        { num: 2, title: "Sampling Theory & Hypothesis Testing", desc: "Sampling distributions, standard error, large sample tests for mean and proportions, Null and Alternative hypotheses." },
        { num: 3, title: "Small Sample Tests (t-test, F-test, Chi-square)", desc: "Student's t-test for difference of means, paired t-test, Snedecor's F-test for variances, and Chi-square goodness-of-fit." },
        { num: 4, title: "Complex Analysis & Contour Integration", desc: "Analytic functions, Cauchy-Riemann equations, Cauchy's integral theorem, Taylor and Laurent series expansions, residues." }
      ]
    }
  },
  {
    id: "eng_physics",
    name: "Engineering Physics",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [1, 2],
    description: "Quantum mechanics, wave optics, lasers, fiber optics, electromagnetics, and nanotechnology.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Quantum Physics & Wave Mechanics", desc: "De Broglie hypothesis, Heisenberg uncertainty principle, wave function ψ interpretation, and 1D Schrodinger equation." },
        { num: 2, title: "Wave Optics: Interference in Thin Films", desc: "Interference in films of uniform and wedge thickness, Newton's rings experiment, and determination of wavelength." },
        { num: 3, title: "Diffraction of Light & Polarization", desc: "Fraunhofer diffraction by single slit and grating, dispersive and resolving power, Brewster's law and Nicol prism." },
        { num: 4, title: "Lasers and Holography Principles", desc: "Stimulated absorption, spontaneous emission, population inversion, Ruby laser, He-Ne laser, and industrial applications." },
        { num: 5, title: "Fiber Optics & Optical Communication", desc: "Total internal reflection, numerical aperture, acceptance angle, step-index and graded-index fibers, attenuation." },
        { num: 6, title: "Superconductivity & Nanomaterials", desc: "Meissner effect, Type I and II superconductors, BCS theory overview, carbon nanotubes, synthesis, and characterization." }
      ]
    }
  },
  {
    id: "eng_chemistry",
    name: "Engineering Chemistry",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [1, 2],
    description: "Water treatment, polymers, corrosion, electrochemistry, fuels, and engineering materials.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Water Treatment Technology", desc: "Hardness estimation by EDTA method, boiler troubles (scales, sludges, priming, foaming, caustic embrittlement), and zeolites." },
        { num: 2, title: "Polymers and Composites", desc: "Classification, mechanisms of polymerization, thermoplastics, thermosetting resins, conducting polymers, and fiber reinforced plastics." },
        { num: 3, title: "Corrosion Science and Engineering", desc: "Dry and wet electrochemical corrosion, galvanic series, Pilling-Bedworth rule, cathodic protection, and sacrificial anodes." },
        { num: 4, title: "Fuels and Combustion", desc: "Gross and net calorific values, Bomb calorimeter, proximate and ultimate analysis of coal, liquid fuels, and octane number." },
        { num: 5, title: "Phase Rule & Alloy Systems", desc: "Gibbs phase rule, one-component water system, two-component lead-silver eutectic system, and metallurgical applications." },
        { num: 6, title: "Green Chemistry & Environmental Science", desc: "Twelve principles of green chemistry, atom economy, green solvents, supercritical CO2, and environmental waste minimization." }
      ]
    }
  },
  {
    id: "eng_mechanics",
    name: "Engineering Mechanics",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [1, 2],
    description: "Statics, dynamics, equilibrium of rigid bodies, friction, kinematics, and kinetics of particles.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Coplanar Force Systems & Resultants", desc: "Resolution and composition of forces, Varignon's theorem, moment of a force, and couples in coplanar systems." },
        { num: 2, title: "Equilibrium of Rigid Bodies", desc: "Free body diagrams, equations of equilibrium, Lami's theorem, types of supports, and beam reaction forces." },
        { num: 3, title: "Centroid and Moment of Inertia", desc: "Centroid of composite plane laminae, parallel and perpendicular axis theorems, and mass moment of inertia." },
        { num: 4, title: "Friction & Mechanical Drives", desc: "Coulomb's laws of dry friction, angle of repose, cone of friction, wedge friction, screw jacks, and flat belt drives." },
        { num: 5, title: "Kinematics of Particles", desc: "Rectilinear motion with variable acceleration, curvilinear motion in Cartesian and polar coordinates, projectile motion." },
        { num: 6, title: "Kinetics of Particles & Work-Energy", desc: "Newton's second law, D'Alembert's principle, work-energy theorem, impulse-momentum principle, and elastic impact." }
      ]
    }
  },
  {
    id: "basic_electrical",
    name: "Basic Electrical Engineering",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [1, 2],
    description: "DC circuits, AC circuits, transformers, three-phase systems, electrical machines, and safety.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "DC Circuits & Network Theorems", desc: "Mesh and nodal analysis, Thevenin's, Norton's, Superposition, and Maximum Power Transfer theorems." },
        { num: 2, title: "Single-Phase AC Fundamentals", desc: "Sinusoidal waveforms, phasor representation, impedance, power factor, active, reactive, and apparent power in RLC circuits." },
        { num: 3, title: "Three-Phase AC Balanced Systems", desc: "Star and delta connections, relation between line and phase voltages and currents, and two-wattmeter power measurement." },
        { num: 4, title: "Single-Phase Transformers", desc: "Construction, EMF equation, ideal vs practical transformer, phasor diagrams on load, equivalent circuits, and efficiency." },
        { num: 5, title: "DC Machines & Induction Motors", desc: "Operating principles of DC motors, back EMF, torque equation, three-phase induction motor rotating magnetic field and slip." },
        { num: 6, title: "Electrical Safety & Domestic Wiring", desc: "Fuses, Miniature Circuit Breakers (MCB), Earth Leakage Circuit Breakers (ELCB), earthing systems, and energy tariffs." }
      ]
    }
  },
  {
    id: "basic_electronics",
    name: "Basic Electronics Engineering",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [1, 2],
    description: "Semiconductor diodes, bipolar junction transistors, field effect transistors, operational amplifiers, and digital logic.",
    chaptersBySemester: {
      2: [
        { num: 1, title: "Semiconductor Diodes & Applications", desc: "P-N junction forward and reverse characteristics, Zener voltage regulator, half-wave and full-wave bridge rectifiers with filters." },
        { num: 2, title: "Bipolar Junction Transistors (BJT)", desc: "Transistor operation in CB, CE, CC configurations, input/output characteristics, DC load line, Q-point stability, and bias circuits." },
        { num: 3, title: "Field Effect Transistors (FET & MOSFET)", desc: "JFET construction, pinch-off voltage, transfer characteristics, Enhancement and Depletion MOSFETs, and CMOS switches." },
        { num: 4, title: "Operational Amplifiers (Op-Amps)", desc: "Ideal op-amp characteristics, inverting, non-inverting, summing amplifiers, differentiators, integrators, and comparators." },
        { num: 5, title: "Digital Logic Fundamentals", desc: "Number systems, Boolean algebra theorems, De Morgan's laws, universal logic gates (NAND, NOR), and logic minimization." }
      ]
    }
  },
  {
    id: "eng_graphics",
    name: "Engineering Graphics",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [1, 2],
    description: "Orthographic projections, projections of solids, sections, development of surfaces, and isometric drawings.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Engineering Curves & Scales", desc: "Conic sections (ellipse, parabola, hyperbola), cycloidal curves, involutes of polygons, and representative fraction scales." },
        { num: 2, title: "Projections of Points and Straight Lines", desc: "First and third angle projections, true length and true inclinations of straight lines inclined to both reference planes." },
        { num: 3, title: "Projections of Planes and Laminae", desc: "Projections of regular circular, triangular, rectangular, and hexagonal surfaces inclined to both HP and VP." },
        { num: 4, title: "Projections of Solids", desc: "Prisms, pyramids, cylinders, and cones with axis inclined to one reference plane and parallel to the other." },
        { num: 5, title: "Section of Solids and Development of Surfaces", desc: "Section planes perpendicular to VP and inclined to HP, true shape of sections, and parallel/radial development methods." },
        { num: 6, title: "Isometric Projections & Views", desc: "Isometric scale, isometric axes, isometric views of composite solids, cylinders with holes, and machine components." }
      ]
    }
  },
  {
    id: "prog_problem_solving",
    name: "Programming for Problem Solving",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [1, 2],
    description: "C programming fundamentals, control structures, arrays, pointers, functions, recursion, and file input/output.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Introduction to Algorithms & Problem Solving", desc: "Problem solving paradigms, pseudo-code, flowcharts, compilation, linking, execution phases, and syntax errors." },
        { num: 2, title: "Data Types, Operators & Expressions", desc: "Primitive data types, constants, variables, arithmetic, relational, logical, bitwise operators, and type conversions." },
        { num: 3, title: "Control Structures: Branching & Looping", desc: "Conditional branching (if-else, nested if, switch-case), iteration (while, for, do-while), break, and continue statements." },
        { num: 4, title: "Arrays and String Manipulation", desc: "One-dimensional and multi-dimensional arrays, matrix operations, string handling functions (strlen, strcpy, strcmp), and character arrays." },
        { num: 5, title: "Functions, Recursion & Storage Classes", desc: "Modular programming, function prototypes, call-by-value vs call-by-reference, recursive functions, auto, extern, static, register." },
        { num: 6, title: "Pointers, Structures & File I/O", desc: "Pointer arithmetic, dynamic memory allocation (malloc, calloc, free), user-defined structures, unions, and sequential file handling." }
      ]
    }
  },
  {
    id: "oop",
    name: "Object-Oriented Programming",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [3],
    description: "Encapsulation, inheritance, polymorphism, abstraction, templates, exception handling, and standard template library in C++ / Java.",
    chaptersBySemester: {
      3: [
        { num: 1, title: "Core OOP Principles & Classes", desc: "Objects, classes, encapsulation, data abstraction, access specifiers (public, private, protected), and inline methods." },
        { num: 2, title: "Constructors, Destructors & Memory", desc: "Default, parameterized, copy constructors, dynamic initialization of objects, destructors, and this pointer." },
        { num: 3, title: "Inheritance & Reusability", desc: "Single, multilevel, multiple, hierarchical, hybrid inheritance, virtual base classes, and constructor delegation." },
        { num: 4, title: "Polymorphism & Virtual Functions", desc: "Function overloading, operator overloading, run-time polymorphism, virtual functions, pure virtual functions, and abstract classes." },
        { num: 5, title: "Generic Programming: Templates & STL", desc: "Function templates, class templates, Standard Template Library containers (vector, list, map), iterators, and algorithms." },
        { num: 6, title: "Exception Handling & Streams I/O", desc: "Try, catch, throw mechanics, standard exceptions, custom exception classes, and formatted file stream operations." }
      ]
    }
  },
  {
    id: "data_structures",
    name: "Data Structures",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [3],
    description: "Algorithm complexity, stacks, queues, linked lists, trees, graphs, sorting, searching, and hashing techniques.",
    chaptersBySemester: {
      3: [
        { num: 1, title: "Algorithm Analysis & Complexity Bounds", desc: "Time and space complexity, asymptotic notations (Big-O, Omega, Theta), Master Theorem, and iterative/recursive trade-offs." },
        { num: 2, title: "Linear Structures: Stacks & Queues", desc: "LIFO and FIFO operations, expression conversions (infix, prefix, postfix), circular queues, double-ended queues (deque), and priority queues." },
        { num: 3, title: "Linked Lists Implementation", desc: "Singly linked lists, doubly linked lists, circular lists, memory allocation, list reversal, and polynomial manipulation." },
        { num: 4, title: "Trees & Binary Search Trees (BST)", desc: "Binary tree representations, traversals (pre, in, post, level order), BST search, insertion, deletion, and height-balanced AVL trees." },
        { num: 5, title: "Graph Algorithms: Traversals & Pathfinding", desc: "Adjacency matrix and list representations, Breadth-First Search (BFS), Depth-First Search (DFS), and topological sorting." },
        { num: 6, title: "Searching, Sorting & Hashing", desc: "Quick sort, merge sort, heap sort, linear and binary search, hash functions, collision resolution (chaining, open addressing)." }
      ]
    }
  },
  {
    id: "discrete_math",
    name: "Discrete Mathematics",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [3],
    description: "Set theory, relations, functions, propositional logic, algebraic structures, posets, lattices, and graph theory.",
    chaptersBySemester: {
      3: [
        { num: 1, title: "Set Theory & Relations", desc: "Set identities, Cartesian products, equivalence relations, partitions, transitive closure, and Warshall's algorithm." },
        { num: 2, title: "Mathematical Logic & Predicates", desc: "Propositions, truth tables, tautologies, logical equivalences, predicate calculus, universal and existential quantifiers." },
        { num: 3, title: "Functions & Pigeonhole Principle", desc: "Injective, surjective, bijective functions, inverse functions, composition, and generalized pigeonhole principle applications." },
        { num: 4, title: "Algebraic Structures & Groups", desc: "Semigroups, monoids, groups, subgroups, Lagrange's theorem, cyclic groups, cosets, and introduction to rings." },
        { num: 5, title: "Posets, Hasse Diagrams & Lattices", desc: "Partial ordering relations, Hasse diagrams, maximal/minimal elements, lattices as algebraic systems, and Boolean algebra." },
        { num: 6, title: "Graph Theory & Combinatorics", desc: "Isomorphic graphs, Eulerian and Hamiltonian paths, planar graphs, Kuratowski's theorem, chromatic numbers, and tree properties." }
      ]
    }
  },
  {
    id: "digital_logic",
    name: "Digital Logic Design",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [3],
    description: "Number systems, Boolean algebra, combinational logic circuits, sequential flip-flops, registers, counters, and FSMs.",
    chaptersBySemester: {
      3: [
        { num: 1, title: "Number Systems & Boolean Minimization", desc: "Binary, octal, hex representations, 1's and 2's complements, Boolean theorems, and Karnaugh maps (2, 3, 4 variables)." },
        { num: 2, title: "Combinational Circuit Design", desc: "Half and full adders, carry lookahead adders, code converters, multiplexers, demultiplexers, encoders, and priority encoders." },
        { num: 3, title: "Sequential Logic: Flip-Flops", desc: "Latches, SR, JK, D, and T flip-flops, race-around condition, master-slave configuration, and excitation tables." },
        { num: 4, title: "Registers and Synchronous Counters", desc: "SISO, SIPO, PISO, PIPO shift registers, universal shift registers, asynchronous ripple counters, and synchronous up/down counters." },
        { num: 5, title: "Finite State Machines & Memory Devices", desc: "Mealy and Moore state machine models, state reduction, state assignment, ROM, PROM, PLA, and PAL architectures." }
      ]
    }
  },
  {
    id: "dbms",
    name: "Database Management Systems",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [4],
    description: "Database models, ER diagrams, relational algebra, SQL, normal forms, transaction ACID properties, and concurrency control.",
    chaptersBySemester: {
      4: [
        { num: 1, title: "Database Architecture & ER Modeling", desc: "Three-schema architecture, data independence, Entity-Relationship (ER) model, strong/weak entities, and ER-to-relational mapping." },
        { num: 2, title: "Relational Algebra & Structured Query Language", desc: "Relational operators (select, project, join, set operations), SQL DDL/DML, nested subqueries, views, and aggregate functions." },
        { num: 3, title: "Relational Database Design & Normalization", desc: "Functional dependencies, inference rules (Armstrong's axioms), 1NF, 2NF, 3NF, BCNF, lossless join, and dependency preservation." },
        { num: 4, title: "Transaction Management & Concurrency Control", desc: "ACID properties, serializability (conflict and view), lock-based protocols (2PL, strict 2PL), and timestamp ordering protocols." },
        { num: 5, title: "Crash Recovery & Storage Indexing", desc: "Failure classification, log-based recovery (WAL), checkpointing, RAID levels, primary/secondary indexing, and B/B+ trees." }
      ]
    }
  },
  {
    id: "coa",
    name: "Computer Organization and Architecture",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [4],
    description: "Instruction set architecture, CPU datapath, computer arithmetic, control unit design, memory hierarchy, and I/O organization.",
    chaptersBySemester: {
      4: [
        { num: 1, title: "Computer Architecture Evolution & CPU Basics", desc: "Von Neumann vs Harvard architectures, system bus standards, instruction cycle, fetch-decode-execute, and register transfers." },
        { num: 2, title: "Instruction Formats & Addressing Modes", desc: "Zero, one, two, three-address instructions, direct, indirect, register, indexed, base-register addressing modes, and CISC vs RISC." },
        { num: 3, title: "Computer Arithmetic Operations", desc: "Fixed-point addition and subtraction, Booth's multiplication algorithm for signed numbers, and restoring/non-restoring division." },
        { num: 4, title: "Control Unit Design & Pipelining", desc: "Hardwired control unit vs microprogrammed control unit, micro-instructions, instruction pipelining, hazards (data, structural, control)." },
        { num: 5, title: "Memory Hierarchy & Cache Design", desc: "Locality of reference, cache mapping functions (direct, associative, set-associative), replacement policies, and virtual memory paging." },
        { num: 6, title: "Input-Output & Interrupt Handling", desc: "Programmed I/O, interrupt-driven I/O, Direct Memory Access (DMA) controller operation, and bus arbitration schemes." }
      ]
    }
  },
  {
    id: "os",
    name: "Operating Systems",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [4],
    description: "Processes, threads, CPU scheduling, synchronization, deadlocks, virtual memory management, and file systems.",
    chaptersBySemester: {
      4: [
        { num: 1, title: "OS Structures, System Calls & Process Concept", desc: "Dual mode operations, kernel architectures (monolithic vs microkernel), system call traps, PCB, and process life cycle." },
        { num: 2, title: "Process Scheduling Algorithms", desc: "Scheduling queues, preemptive vs non-preemptive schedulers, FCFS, SJF, Priority, Round Robin, and Multi-Level Feedback Queues." },
        { num: 3, title: "Inter-Process Communication & Synchronization", desc: "Race conditions, critical section problem, Peterson's algorithm, hardware instructions (TestAndSet), semaphores, and monitors." },
        { num: 4, title: "Deadlock Characterization & Banker's Algorithm", desc: "Coffman conditions, resource allocation graphs, deadlock prevention, detection, recovery, and Banker's safety algorithm." },
        { num: 5, title: "Memory Management & Virtual Memory", desc: "Logical vs physical address space, contiguous allocation, paging, TLB, segmentation, demand paging, and page replacement (FIFO, LRU, Optimal)." },
        { num: 6, title: "File Systems & Disk Scheduling", desc: "File access methods, directory structures, allocation methods (contiguous, linked, indexed), and disk scheduling (FCFS, SCAN, C-SCAN)." }
      ]
    }
  },
  {
    id: "computer_networks",
    name: "Computer Networks",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [4],
    description: "Layered network models, data link protocols, routing algorithms, transport protocols (TCP/UDP), and application layer services.",
    chaptersBySemester: {
      4: [
        { num: 1, title: "Network Architectures & Physical Layer", desc: "OSI 7-layer reference model vs TCP/IP protocol suite, transmission media (guided/unguided), packet vs circuit switching." },
        { num: 2, title: "Data Link Layer & Error Control", desc: "Framing techniques, error detection (Parity, Checksum, CRC), Sliding Window flow control (Stop-and-Wait, Go-Back-N, Selective Repeat)." },
        { num: 3, title: "Medium Access Control (MAC) Sublayer", desc: "Random access protocols (Pure ALOHA, Slotted ALOHA, CSMA/CD, CSMA/CA), Ethernet IEEE 802.3 standards, and switching devices." },
        { num: 4, title: "Network Layer & IPv4/IPv6 Addressing", desc: "Classful and classless IPv4 addressing, CIDR, subnetting, NAT, ARP, ICMP, and transition to IPv6 protocol format." },
        { num: 5, title: "Routing Protocols & Algorithms", desc: "Distance Vector routing (Bellman-Ford), Link State routing (Dijkstra's shortest path), OSPF, BGP, and congestion control." },
        { num: 6, title: "Transport & Application Protocols", desc: "TCP 3-way handshake, TCP flow and congestion control algorithms, UDP differences, DNS, HTTP/HTTPS, FTP, and SMTP." }
      ]
    }
  },
  {
    id: "daa",
    name: "Design and Analysis of Algorithms",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [5],
    description: "Divide and conquer, greedy method, dynamic programming, backtracking, branch and bound, and NP-completeness.",
    chaptersBySemester: {
      5: [
        { num: 1, title: "Algorithm Framework & Divide-and-Conquer", desc: "Asymptotic analysis of recurrences, Master Theorem, Merge Sort, Quick Sort, Strassen's matrix multiplication, and convex hull." },
        { num: 2, title: "Greedy Method & Optimization", desc: "Greedy choice property, Fractional Knapsack, Prim's and Kruskal's Minimum Spanning Tree algorithms, and Huffman optimal prefix coding." },
        { num: 3, title: "Dynamic Programming Strategy", desc: "Principle of optimality, 0/1 Knapsack, Longest Common Subsequence (LCS), Matrix Chain Multiplication, and Floyd-Warshall all-pairs shortest paths." },
        { num: 4, title: "Backtracking & State Space Trees", desc: "N-Queens problem, Sum of Subsets, Graph Coloring, and Hamiltonian cycle exploration." },
        { num: 5, title: "Branch and Bound & NP-Completeness", desc: "15-Puzzle problem, Traveling Salesperson Problem (TSP), Polynomial time reductions, classes P, NP, NP-Complete, and Cook's theorem." }
      ]
    }
  },
  {
    id: "software_engineering",
    name: "Software Engineering",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [5],
    description: "Software process models, requirements engineering, UML modeling, architectural design, testing, and agile methodologies.",
    chaptersBySemester: {
      5: [
        { num: 1, title: "Software Lifecycle Models & Agile", desc: "Waterfall model, Prototyping, Spiral risk-driven model, Agile manifesto, Scrum framework, sprint cycles, and Extreme Programming." },
        { num: 2, title: "Requirements Engineering & SRS Document", desc: "Requirements elicitation, functional vs non-functional requirements, IEEE 830 standard SRS specification, and feasibility studies." },
        { num: 3, title: "System Design & UML Modeling", desc: "Architectural patterns, cohesion, coupling, UML structural diagrams (Class, Component) and behavioral diagrams (Use-Case, Sequence, State)." },
        { num: 4, title: "Software Verification, Validation & Testing", desc: "Black-box testing (boundary value analysis, equivalence partitioning), white-box testing (basis path, cyclomatic complexity), and regression testing." },
        { num: 5, title: "Project Estimation & Quality Assurance", desc: "COCOMO estimation models, function point analysis, CMMI maturity levels, ISO 9001 standards, and software maintenance." }
      ]
    }
  },
  {
    id: "theory_of_computation",
    name: "Theory of Computation",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [5],
    description: "Finite automata, regular expressions, context-free grammars, pushdown automata, Turing machines, and undecidability.",
    chaptersBySemester: {
      5: [
        { num: 1, title: "Finite Automata & Regular Languages", desc: "Deterministic Finite Automata (DFA), NFA with and without ε-moves, subset construction algorithm, and DFA state minimization." },
        { num: 2, title: "Regular Expressions & Pumping Lemma", desc: "Equivalence of regular expressions and finite automata, Arden's theorem, closure properties, and Pumping Lemma for regular languages." },
        { num: 3, title: "Context-Free Grammars & Languages", desc: "Chomsky hierarchy, derivation trees, ambiguity in CFGs, simplification (null, unit, useless symbols), and Chomsky Normal Form (CNF)." },
        { num: 4, title: "Pushdown Automata (PDA)", desc: "Formal definition of PDA, acceptance by empty stack vs final state, equivalence of PDA and CFG, and deterministic PDAs." },
        { num: 5, title: "Turing Machines & Decidability", desc: "Turing machine formal model, instantaneous descriptions, multi-track TMs, Church-Turing thesis, halting problem, and Post Correspondence Problem (PCP)." }
      ]
    }
  },
  {
    id: "compiler_design",
    name: "Compiler Design",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [6],
    description: "Phases of a compiler, lexical analysis, top-down and bottom-up parsing, intermediate code generation, optimization, and code generation.",
    chaptersBySemester: {
      6: [
        { num: 1, title: "Compiler Structure & Lexical Analysis", desc: "Phases of compiler pipeline, token, lexeme, pattern, finite automata implementation, and LEX generator tool." },
        { num: 2, title: "Syntax Analysis & Top-Down Parsers", desc: "Context-free grammars, FIRST and FOLLOW sets, non-recursive predictive LL(1) parsing tables, and left-recursion elimination." },
        { num: 3, title: "Bottom-Up LR Parsing Techniques", desc: "Shift-reduce parsing, handles, LR(0), Simple LR (SLR(1)), Canonical LR (CLR(1)), and Look-Ahead LR (LALR(1)) parsers." },
        { num: 4, title: "Syntax-Directed Translation & Intermediate Code", desc: "Syntax-directed definitions (SDD), S-attributed and L-attributed definitions, three-address code (quadruples, triples), and syntax trees." },
        { num: 5, title: "Code Optimization & Code Generation", desc: "Basic blocks, control flow graphs, loop optimizations, dead code elimination, register allocation algorithms, and target assembly generation." }
      ]
    }
  },
  {
    id: "artificial_intelligence",
    name: "Artificial Intelligence",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [6],
    description: "Search algorithms, heuristic searches, game playing, knowledge representation, inference engines, and expert systems.",
    chaptersBySemester: {
      6: [
        { num: 1, title: "Intelligent Agents & Problem Formulation", desc: "PEAS descriptions, agent environments, state-space representations, uninformed search strategies (BFS, DFS, Uniform Cost Search)." },
        { num: 2, title: "Informed Search & Heuristic Methods", desc: "Greedy Best-First Search, A* search algorithm admissibility and consistency, Hill Climbing, and Simulated Annealing." },
        { num: 3, title: "Adversarial Search & Game Playing", desc: "Game trees, Minimax decision rule, Alpha-Beta pruning algorithm, evaluation functions, and game-theoretic complexity." },
        { num: 4, title: "Knowledge Representation & Logical Inference", desc: "First-Order Predicate Logic (FOPL), unification, forward and backward chaining, and resolution refutation in Horn clauses." },
        { num: 5, title: "Probabilistic Reasoning & Expert Systems", desc: "Handling uncertainty, Bayes' rule, Bayesian belief networks, architecture of expert systems, and inference engines." }
      ]
    }
  },
  {
    id: "machine_learning",
    name: "Machine Learning",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [7],
    description: "Supervised and unsupervised learning, regression, classification, support vector machines, neural networks, and model validation.",
    chaptersBySemester: {
      7: [
        { num: 1, title: "Supervised Learning: Regression Models", desc: "Linear regression, gradient descent optimization, cost functions, Ridge and Lasso L1/L2 regularization, and polynomial regression." },
        { num: 2, title: "Classification & Decision Tree Algorithms", desc: "Logistic regression, decision trees (ID3, C4.5, CART), information gain, Gini impurity, random forests, and ensemble methods." },
        { num: 3, title: "Support Vector Machines & Kernel Methods", desc: "Maximal margin hyperplane, soft-margin SVM, slack variables, and kernel trick (Linear, Polynomial, Radial Basis Function RBF)." },
        { num: 4, title: "Unsupervised Learning & Clustering", desc: "K-Means clustering algorithm, optimal k elbow method, Hierarchical clustering, and Principal Component Analysis (PCA) dimensionality reduction." },
        { num: 5, title: "Neural Networks & Evaluation Metrics", desc: "Artificial neurons, multi-layer perceptrons, backpropagation algorithm, cross-validation, confusion matrices, ROC-AUC, and precision-recall." }
      ]
    }
  },
  {
    id: "web_technology",
    name: "Web Technology",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [6],
    description: "Frontend HTML5/CSS3/JS, asynchronous web requests, Node.js server architectures, RESTful APIs, and database connectivity.",
    chaptersBySemester: {
      6: [
        { num: 1, title: "Modern HTML5, CSS3 & Responsive Design", desc: "Semantic markup, CSS Grid and Flexbox layouts, media queries, mobile-first responsive paradigms, and CSS variables." },
        { num: 2, title: "JavaScript ES6+ & DOM Manipulation", desc: "Arrow functions, destructuring, promises, async/await, DOM tree traversal, event delegation, and browser storage (localStorage, sessionStorage)." },
        { num: 3, title: "Asynchronous Web & Fetch API", desc: "AJAX principles, XMLHttpRequest vs Fetch API, JSON parsing, handling CORS headers, and client-side form validation." },
        { num: 4, title: "Server-Side Development with Node.js & Express", desc: "Node event loop, non-blocking I/O, npm package ecosystem, Express router middleware, and RESTful CRUD API endpoints." },
        { num: 5, title: "Database Connectivity & Web Security", desc: "Connecting Express to MongoDB/PostgreSQL, password hashing (bcrypt), JSON Web Token (JWT) authentication, and XSS/CSRF prevention." }
      ]
    }
  },
  {
    id: "information_security",
    name: "Information Security",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [7],
    description: "Cryptography, symmetric and asymmetric ciphers, hash functions, digital signatures, network security protocols, and firewalls.",
    chaptersBySemester: {
      7: [
        { num: 1, title: "Security Concepts & Classical Ciphers", desc: "Confidentiality, Integrity, Availability (CIA) triad, passive vs active attacks, substitution, and transposition ciphers." },
        { num: 2, title: "Symmetric Encryption (DES & AES)", desc: "Feistel cipher structure, Data Encryption Standard (DES), Advanced Encryption Standard (AES) rounds, and block cipher modes (ECB, CBC, CTR)." },
        { num: 3, title: "Asymmetric Cryptography & Key Exchange", desc: "Number theory foundations (Euler's totient, modular arithmetic), RSA encryption/decryption, and Diffie-Hellman key exchange protocol." },
        { num: 4, title: "Integrity, Hashes & Digital Signatures", desc: "Cryptographic hash functions (SHA-256), HMAC, digital signature standards, public key certificates, and X.509 PKI." },
        { num: 5, title: "Network & System Security Mechanisms", desc: "IPsec protocol suite, SSL/TLS handshake protocol, firewall packet filtering vs stateful inspection, and Intrusion Detection Systems (IDS)." }
      ]
    }
  },
  {
    id: "cloud_computing",
    name: "Cloud Computing",
    stream: "engineering",
    degree: "B.E. / B.Tech",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
    primarySemesters: [8],
    description: "Cloud service models, hypervisors, virtualization, containerization, distributed storage, and cloud security architectures.",
    chaptersBySemester: {
      8: [
        { num: 1, title: "Cloud Architecture Principles & Service Models", desc: "NIST cloud definitions, essential characteristics, service models (IaaS, PaaS, SaaS), and deployment models (Public, Private, Hybrid)." },
        { num: 2, title: "Virtualization & Hypervisor Technologies", desc: "Hardware virtualization, Type 1 and Type 2 hypervisors, VM migration, containerization fundamentals, and Docker container architecture." },
        { num: 3, title: "Cloud Storage Systems & Distributed Data", desc: "Object storage (S3), block vs file storage, Hadoop Distributed File System (HDFS), CAP theorem, and eventual consistency models." },
        { num: 4, title: "Cloud Networking & Resource Management", desc: "Virtual Private Cloud (VPC), software-defined networking, load balancing algorithms, auto-scaling groups, and SLA guarantees." },
        { num: 5, title: "Cloud Security, Compliance & Serverless", desc: "Shared responsibility security model, Identity and Access Management (IAM), encryption at rest/transit, serverless computing (AWS Lambda), and microservices." }
      ]
    }
  }
];

module.exports = engineeringSubjects;
