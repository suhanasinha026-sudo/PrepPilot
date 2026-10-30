// EduPrep - Engineering Stream Chapters & Notes Dataset (25 Subjects)
module.exports = {
  stream: "engineering",
  streamName: "Engineering",
  subjects: [
    {
      id: "eng_math",
      name: "Engineering Mathematics",
      stream: "engineering",
      degree: "B.E. / B.Tech",
      availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8],
      primarySemesters: [1, 2, 3, 4],
      description: "Foundation mathematics covering linear algebra, calculus, differential equations, Fourier analysis, probability and numerical techniques.",
      semesters: {
        1: [
          {
            id: "ch_em1_1",
            chapterNum: 1,
            title: "Matrices, Rank & System of Linear Equations",
            description: "Matrix operations, row echelon form, normal form, rank of a matrix, and consistency of non-homogeneous and homogeneous linear systems.",
            isVerified: true,
            videos: [
              {
                id: "fNk_zzaMoSs",
                title: "Vectors and Linear Transformations - Linear Algebra",
                channel: "3Blue1Brown",
                url: "https://www.youtube.com/watch?v=fNk_zzaMoSs",
                embedUrl: "https://www.youtube-nocookie.com/embed/fNk_zzaMoSs",
                thumbnail: "https://img.youtube.com/vi/fNk_zzaMoSs/mqdefault.jpg"
              },
              {
                id: "vC4NfWq68kM",
                title: "Rank of Matrix & Echelon Form Engineering Mathematics",
                channel: "Gate Smashers",
                url: "https://www.youtube.com/watch?v=vC4NfWq68kM",
                embedUrl: "https://www.youtube-nocookie.com/embed/vC4NfWq68kM",
                thumbnail: "https://img.youtube.com/vi/vC4NfWq68kM/mqdefault.jpg"
              }
            ],
            notes: {
              learningObjectives: [
                "Understand matrix representations and elementary row operations",
                "Compute matrix rank using row echelon and canonical normal forms",
                "Apply Rouche-Capelli theorem to test consistency of AX = B",
                "Solve systems of linear equations using Gauss Elimination and Gauss-Jordan methods"
              ],
              keyDefinitions: [
                { term: "Rank of a Matrix (ρ)", definition: "The maximum number of linearly independent row or column vectors in the matrix, or the order of the highest non-zero minor." },
                { term: "Row Echelon Form", definition: "A stepped staircase matrix format where leading entries (pivots) move strictly rightward and all-zero rows reside at the bottom." },
                { term: "Consistent System", definition: "A linear system AX = B having either a unique solution (rank(A) = rank([A|B]) = n) or infinitely many solutions (rank < n)." }
              ],
              conceptualExplanations: [
                {
                  heading: "Elementary Transformations and Row Echelon Form",
                  content: "Elementary row operations preserve the solution space of linear systems: (1) Swapping two rows Ri ↔ Rj, (2) Multiplying a row by non-zero scalar Ri → kRi, and (3) Adding a multiple of one row to another Ri → Ri + kRj. By applying these operations iteratively, any matrix can be reduced to row echelon form where the number of non-zero rows equals the rank ρ(A)."
                },
                {
                  heading: "Consistency Criteria: Rouche-Capelli Theorem",
                  content: "For a linear system AX = B with n variables, form the augmented matrix [A|B]. If ρ(A) ≠ ρ([A|B]), the system is inconsistent (no solution). If ρ(A) = ρ([A|B]) = r, the system is consistent: if r = n, there is a unique solution; if r < n, there are infinitely many solutions parameterized by (n - r) free variables."
                }
              ],
              formulasOrRules: [
                { name: "Consistency Test", formula: "ρ(A) = ρ([A|B]) = r (Unique if r = n, Infinitely many if r < n)" },
                { name: "Homogeneous System AX = 0", formula: "Non-trivial solution exists if and only if |A| = 0 (i.e., rank < n)" }
              ],
              examplesOrProblems: [
                {
                  title: "Testing System Consistency",
                  problem: "Investigate for what values of λ and μ the system x + y + z = 6, x + 2y + 3z = 10, x + 2y + λz = μ has: (i) No solution, (ii) A unique solution, (iii) Infinitely many solutions.",
                  solution: "Augmented matrix [A|B] reduces via R2→R2-R1, R3→R3-R2 to [1, 1, 1 | 6; 0, 1, 2 | 4; 0, 0, λ-3 | μ-10]. (i) No solution: λ = 3 and μ ≠ 10 (rank A = 2, rank [A|B] = 3). (ii) Unique solution: λ ≠ 3, μ can be any real number (rank A = rank [A|B] = 3). (iii) Infinite solutions: λ = 3 and μ = 10 (rank A = rank [A|B] = 2 < 3)."
                }
              ],
              practicalApplications: [
                "Computer graphics 3D vertex transformations and projection mapping",
                "Electrical network circuit solving using Kirchhoff's voltage and current nodal equations",
                "Finite element analysis stress distribution across structural nodes"
              ],
              summary: "Matrix rank provides the mathematical criterion for testing whether engineering linear models have unique, indeterminate, or impossible states.",
              revisionPoints: [
                "Rank is invariant under elementary row and column operations",
                "For homogeneous systems AX = 0, rank < n implies non-trivial solutions exist",
                "Always check row operations carefully to avoid sign errors in back-substitution"
              ]
            }
          },
          {
            id: "ch_em1_2",
            chapterNum: 2,
            title: "Differential Calculus & Successive Differentiation",
            description: "Successive derivatives, nth derivative formulas of standard functions, Leibnitz theorem for the product of two functions.",
            isVerified: true,
            videos: [
              {
                id: "WUvTyaaNjfo",
                title: "Essence of Calculus - Chapter 1",
                channel: "3Blue1Brown",
                url: "https://www.youtube.com/watch?v=WUvTyaaNjfo",
                embedUrl: "https://www.youtube-nocookie.com/embed/WUvTyaaNjfo",
                thumbnail: "https://img.youtube.com/vi/WUvTyaaNjfo/mqdefault.jpg"
              }
            ],
            notes: {
              learningObjectives: [
                "Calculate nth derivatives of rational, exponential, and trigonometric functions",
                "Apply Leibnitz's Theorem to find the nth derivative of products of two functions",
                "Formulate differential equations satisfied by functions and differentiate n times"
              ],
              keyDefinitions: [
                { term: "Successive Differentiation", definition: "The process of repeatedly differentiating a given function y = f(x) with respect to x to obtain higher-order derivatives." },
                { term: "Leibnitz's Theorem", definition: "A general formula for the nth derivative of the product of two functions u(x) and v(x): (uv)_n = ∑ (nCr * u_(n-r) * v_r)." }
              ],
              conceptualExplanations: [
                {
                  heading: "Standard nth Derivatives",
                  content: "Key standard forms include: d^n/dx^n [e^(ax)] = a^n * e^(ax); d^n/dx^n [sin(ax + b)] = a^n * sin(ax + b + nπ/2); d^n/dx^n [(ax + b)^(-1)] = (-1)^n * n! * a^n * (ax + b)^(-(n+1))."
                },
                {
                  heading: "Application of Leibnitz Theorem",
                  content: "When differentiating y = x^2 * sin(x) n times, let u = sin(x) (infinitely differentiable standard form) and v = x^2 (finite derivatives: v' = 2x, v'' = 2, v''' = 0). The expansion truncates after three terms, simplifying calculation."
                }
              ],
              formulasOrRules: [
                { name: "Leibnitz Formula", formula: "(uv)_n = u_n*v + nC1*u_(n-1)*v_1 + nC2*u_(n-2)*v_2 + ... + u*v_n" }
              ],
              examplesOrProblems: [
                {
                  title: "nth Derivative of Product",
                  problem: "Find the nth derivative of y = x^3 * e^(2x).",
                  solution: "Let u = e^(2x) so u_n = 2^n * e^(2x). Let v = x^3, v_1 = 3x^2, v_2 = 6x, v_3 = 6. By Leibnitz rule: y_n = 2^n * e^(2x) * x^3 + n * 2^(n-1) * e^(2x) * 3x^2 + [n(n-1)/2] * 2^(n-2) * e^(2x) * 6x + [n(n-1)(n-2)/6] * 2^(n-3) * e^(2x) * 6."
                }
              ],
              practicalApplications: [
                "Taylor series expansions used in flight control approximation algorithms",
                "Curvature and acceleration jerk profiles in mechanical cam and robotics design"
              ],
              summary: "Successive differentiation and Leibnitz theorem yield exact formulas for higher-order derivatives of complex composite engineering signals.",
              revisionPoints: [
                "Always assign v to the polynomial term whose derivatives terminate",
                "Remember the phase shift +nπ/2 in sine and cosine nth derivatives"
              ]
            }
          },
          {
            id: "ch_em1_3",
            chapterNum: 3,
            title: "Partial Differentiation & Euler's Theorem",
            description: "Partial derivatives of multivariable functions, chain rule, homogeneous functions, and Euler's theorem on homogeneous functions.",
            isVerified: true,
            videos: [
              {
                id: "TrcCbdWwCBc",
                title: "Partial Derivatives - Visual Multivariable Calculus",
                channel: "Khan Academy",
                url: "https://www.youtube.com/watch?v=TrcCbdWwCBc",
                embedUrl: "https://www.youtube-nocookie.com/embed/TrcCbdWwCBc",
                thumbnail: "https://img.youtube.com/vi/TrcCbdWwCBc/mqdefault.jpg"
              }
            ],
            notes: {
              learningObjectives: [
                "Calculate first and higher order partial derivatives",
                "Apply multivariable chain rule for composite functions",
                "Verify degree of homogeneity of functions",
                "Utilize Euler's Theorem and its corollaries to evaluate algebraic expressions"
              ],
              keyDefinitions: [
                { term: "Partial Derivative", definition: "The derivative of a multivariable function with respect to one variable while holding all other independent variables constant." },
                { term: "Homogeneous Function", definition: "A function f(x, y) where f(tx, ty) = t^n * f(x, y) for all t > 0, where n is the degree of homogeneity." }
              ],
              conceptualExplanations: [
                {
                  heading: "Euler's Theorem for Homogeneous Functions",
                  content: "If u = f(x, y) is a homogeneous function of x and y of degree n, then x*(∂u/∂x) + y*(∂u/∂y) = n*u. Furthermore, for second-order partial derivatives: x^2*(∂^2u/∂x^2) + 2xy*(∂^2u/∂x∂y) + y^2*(∂^2u/∂y^2) = n(n - 1)u."
                }
              ],
              formulasOrRules: [
                { name: "Euler's Theorem (1st Order)", formula: "x(∂u/∂x) + y(∂u/∂y) = n*u" },
                { name: "Euler's Corollary (2nd Order)", formula: "x^2(∂^2u/∂x^2) + 2xy(∂^2u/∂x∂y) + y^2(∂^2u/∂y^2) = n(n-1)u" }
              ],
              examplesOrProblems: [
                {
                  title: "Applying Euler's Theorem",
                  problem: "If u = sin^(-1)[(x^2 + y^2)/(x + y)], prove that x(∂u/∂x) + y(∂u/∂y) = tan(u).",
                  solution: "Let z = sin(u) = (x^2 + y^2)/(x + y). Here z is homogeneous of degree n = 2 - 1 = 1. By Euler's theorem: x(∂z/∂x) + y(∂z/∂y) = 1*z. Since z = sin(u), ∂z/∂x = cos(u)(∂u/∂x). Substituting gives cos(u)[x(∂u/∂x) + y(∂u/∂y)] = sin(u) ⇒ x(∂u/∂x) + y(∂u/∂y) = tan(u)."
                }
              ],
              practicalApplications: [
                "Thermodynamics state functions (enthalpy, entropy, Gibbs free energy)",
                "Fluid dynamics velocity potentials and stream functions"
              ],
              summary: "Partial differentiation allows modeling physical quantities that depend simultaneously on spatial coordinates and time.",
              revisionPoints: [
                "If u is not homogeneous but f(u) is homogeneous, apply Euler's theorem on f(u)",
                "Differentiate chain rules carefully along all independent paths"
              ]
            }
          },
          {
            id: "ch_em1_4",
            chapterNum: 4,
            title: "Maxima, Minima & Lagrange Multipliers",
            description: "Extreme values of functions of two variables, Taylor's expansion for two variables, and constrained optimization using Lagrange multipliers.",
            isVerified: true,
            videos: [
              {
                id: "5A344xxo9_g",
                title: "Lagrange Multipliers and Constrained Optimization",
                channel: "MIT OpenCourseWare",
                url: "https://www.youtube.com/watch?v=5A344xxo9_g",
                embedUrl: "https://www.youtube-nocookie.com/embed/5A344xxo9_g",
                thumbnail: "https://img.youtube.com/vi/5A344xxo9_g/mqdefault.jpg"
              }
            ],
            notes: {
              learningObjectives: [
                "Determine stationary points of two-variable functions f(x, y)",
                "Classify extrema using second-order discriminant (rt - s^2)",
                "Solve constrained optimization problems with Lagrange multipliers"
              ],
              keyDefinitions: [
                { term: "Stationary Point", definition: "A point (a, b) where fx = 0 and fy = 0 simultaneously." },
                { term: "Saddle Point", definition: "A critical point that is neither a local maximum nor a local minimum because the surface curves upward in one direction and downward in another." }
              ],
              conceptualExplanations: [
                {
                  heading: "Second Derivative Test for Functions of Two Variables",
                  content: "Let r = fxx, s = fxy, t = fyy evaluated at a critical point (a, b). Compute discriminant D = rt - s^2. (1) If rt - s^2 > 0 and r < 0: Local Maximum. (2) If rt - s^2 > 0 and r > 0: Local Minimum. (3) If rt - s^2 < 0: Saddle point. (4) If rt - s^2 = 0: Test is inconclusive."
                }
              ],
              formulasOrRules: [
                { name: "Extrema Discriminant", formula: "D = rt - s^2, where r = ∂^2f/∂x^2, s = ∂^2f/∂x∂y, t = ∂^2f/∂y^2" },
                { name: "Lagrange Auxiliary Function", formula: "L(x, y, z, λ) = f(x, y, z) + λ*φ(x, y, z)" }
              ],
              examplesOrProblems: [
                {
                  title: "Rectangular Box Optimization",
                  problem: "Find the dimensions of a rectangular box open at the top of maximum volume for a given surface area S = 108 sq cm.",
                  solution: "Maximize V = xyz subject to xy + 2yz + 2zx = 108. Form Lagrange function L = xyz + λ(xy + 2yz + 2zx - 108). Setting partials to zero yields x = 2y = 2z. Substituting into constraint gives 4z^2 + 4z^2 + 4z^2 = 108 ⇒ 12z^2 = 108 ⇒ z = 3 cm, y = 3 cm, x = 6 cm. Max Volume = 54 cm^3."
                }
              ],
              practicalApplications: [
                "Material cost minimization for container and heat exchanger designs",
                "Machine learning loss function minimization during gradient descent"
              ],
              summary: "Lagrange multipliers turn constrained multivariable optimization into an unconstrained problem by balancing gradients.",
              revisionPoints: [
                "Always check sign of r only after confirming rt - s^2 > 0",
                "Ensure constraint equations are fully satisfied by all roots"
              ]
            }
          },
          {
            id: "ch_em1_5",
            chapterNum: 5,
            title: "Complex Numbers & De Moivre's Theorem",
            description: "Cartesian and polar forms, De Moivre's theorem, roots of complex numbers, and expansion of sin(nθ), cos(nθ) in powers of trigonometric functions.",
            isVerified: true,
            videos: [
              {
                id: "6gI_WkI4BGs",
                title: "De Moivre's Theorem and Roots of Complex Numbers",
                channel: "Khan Academy",
                url: "https://www.youtube.com/watch?v=6gI_WkI4BGs",
                embedUrl: "https://www.youtube-nocookie.com/embed/6gI_WkI4BGs",
                thumbnail: "https://img.youtube.com/vi/6gI_WkI4BGs/mqdefault.jpg"
              }
            ],
            notes: {
              learningObjectives: [
                "Convert complex numbers between Cartesian, polar, and Euler exponential forms",
                "Apply De Moivre's Theorem for integral and fractional exponents",
                "Determine the nth roots of unity and locate them on the complex plane"
              ],
              keyDefinitions: [
                { term: "De Moivre's Theorem", definition: "(cos θ + i sin θ)^n = cos(nθ) + i sin(nθ) for any rational number n." },
                { term: "Roots of Unity", definition: "Solutions to the equation z^n = 1, given by e^(i*2kπ/n) for k = 0, 1, ..., n-1, forming vertices of a regular polygon on the unit circle." }
              ],
              conceptualExplanations: [
                {
                  heading: "Powers and Expansion of Trigonometric Terms",
                  content: "Using x = cos θ + i sin θ, we have x^n + 1/x^n = 2 cos(nθ) and x^n - 1/x^n = 2i sin(nθ). Expanding (x + 1/x)^n via binomial theorem expresses powers of cos^n(θ) as sum of multiple angles, essential for calculus integration."
                }
              ],
              formulasOrRules: [
                { name: "De Moivre's Equation", formula: "(cos θ + i sin θ)^n = cos(nθ) + i sin(nθ)" },
                { name: "Euler Identity", formula: "e^(iθ) = cos θ + i sin θ" }
              ],
              examplesOrProblems: [
                {
                  title: "Cube Roots of Unity",
                  problem: "Find all roots of z^3 + 1 = 0.",
                  solution: "z^3 = -1 = cos(π) + i sin(π). By De Moivre's theorem, z = cos[(2k+1)π/3] + i sin[(2k+1)π/3] for k = 0, 1, 2. Roots are: z0 = cos(π/3) + i sin(π/3) = 1/2 + i√3/2; z1 = cos(π) + i sin(π) = -1; z2 = cos(5π/3) + i sin(5π/3) = 1/2 - i√3/2."
                }
              ],
              practicalApplications: [
                "AC electrical circuit impedance calculations (phasor domain)",
                "Signal processing Discrete Fourier Transforms (roots of unity kernel)"
              ],
              summary: "Complex number geometry translates rotation and scaling into simple algebraic multiplication.",
              revisionPoints: [
                "Remember that roots always appear symmetrically spaced by 2π/n",
                "Sum of all nth roots of unity always equals 0"
              ]
            }
          }
        ],
        2: [
          {
            id: "ch_em2_1",
            chapterNum: 1,
            title: "First Order Ordinary Differential Equations",
            description: "Exact differential equations, integrating factors, linear differential equations, and Bernoulli's equation with applications.",
            isVerified: true,
            videos: [
              {
                id: "p_di4Zn4wDg",
                title: "First Order Linear Differential Equations",
                channel: "Khan Academy",
                url: "https://www.youtube.com/watch?v=p_di4Zn4wDg",
                embedUrl: "https://www.youtube-nocookie.com/embed/p_di4Zn4wDg",
                thumbnail: "https://img.youtube.com/vi/p_di4Zn4wDg/mqdefault.jpg"
              }
            ],
            notes: {
              learningObjectives: [
                "Identify and solve exact differential equations M dx + N dy = 0",
                "Find integrating factors by inspection and rules",
                "Solve linear differential equations dy/dx + Py = Q using integrating factor e^(∫P dx)"
              ],
              keyDefinitions: [
                { term: "Exact Differential Equation", definition: "An equation M dx + N dy = 0 where ∂M/∂y = ∂N/∂x everywhere in the domain." },
                { term: "Integrating Factor (IF)", definition: "A multiplier μ(x, y) that transforms a non-exact equation into an exact differential equation." }
              ],
              conceptualExplanations: [
                {
                  heading: "Exact Equations and Solution Method",
                  content: "When ∂M/∂y = ∂N/∂x, the solution is obtained by integrating M with respect to x treating y as constant, plus integrating only those terms of N that do not contain x with respect to y, set equal to constant C."
                }
              ],
              formulasOrRules: [
                { name: "Exactness Condition", formula: "∂M/∂y = ∂N/∂x" },
                { name: "Linear Equation IF", formula: "IF = e^(∫P dx); Solution: y * IF = ∫(Q * IF)dx + C" }
              ],
              examplesOrProblems: [
                {
                  title: "Solving Exact ODE",
                  problem: "Solve (2xy + cos y)dx + (x^2 - x sin y)dy = 0.",
                  solution: "M = 2xy + cos y, N = x^2 - x sin y. ∂M/∂y = 2x - sin y = ∂N/∂x (Exact). Integrate M wrt x treating y constant: x^2 y + x cos y. Terms in N free of x: none (0). Solution: x^2 y + x cos y = C."
                }
              ],
              practicalApplications: [
                "Newton's Law of Cooling temperature decay curves",
                "RL and RC transient circuit current and voltage discharge rates"
              ],
              summary: "First order differential equations model physical rates of change in dynamical systems.",
              revisionPoints: [
                "Always check exactness before looking for an integrating factor",
                "In Bernoulli equations, divide by y^n and substitute v = y^(1-n)"
              ]
            }
          },
          {
            id: "ch_em2_2",
            chapterNum: 2,
            title: "Higher Order Linear Differential Equations",
            description: "Homogeneous and non-homogeneous linear differential equations with constant coefficients, complementary functions, and particular integrals.",
            isVerified: true,
            videos: [
              {
                id: "10y8cW7aHjg",
                title: "Second Order Linear Differential Equations",
                channel: "MIT OpenCourseWare",
                url: "https://www.youtube.com/watch?v=10y8cW7aHjg",
                embedUrl: "https://www.youtube-nocookie.com/embed/10y8cW7aHjg",
                thumbnail: "https://img.youtube.com/vi/10y8cW7aHjg/mqdefault.jpg"
              }
            ],
            notes: {
              learningObjectives: [
                "Find the complementary function (CF) from the auxiliary equation roots",
                "Calculate particular integrals (PI) for e^(ax), sin(ax), cos(ax), and x^m",
                "Apply the Method of Variation of Parameters"
              ],
              keyDefinitions: [
                { term: "General Solution", definition: "The complete solution y = CF + PI, where CF satisfies the homogeneous equation and PI satisfies the driving function." }
              ],
              conceptualExplanations: [
                {
                  heading: "Complementary Function from Auxiliary Roots",
                  content: "For (D^2 + a1 D + a2)y = 0: (1) Real distinct roots m1, m2: CF = c1 e^(m1 x) + c2 e^(m2 x). (2) Real equal roots m1 = m2 = m: CF = (c1 + c2 x)e^(mx). (3) Complex roots α ± iβ: CF = e^(αx)[c1 cos(βx) + c2 sin(βx)]."
                }
              ],
              formulasOrRules: [
                { name: "Short Method for PI (e^ax)", formula: "1/f(D) [e^(ax)] = (1/f(a)) * e^(ax) provided f(a) ≠ 0" },
                { name: "Short Method for PI (sin ax)", formula: "1/f(D^2) [sin ax] = (1/f(-a^2)) * sin ax provided f(-a^2) ≠ 0" }
              ],
              examplesOrProblems: [
                {
                  title: "Solving Damped Vibration ODE",
                  problem: "Solve (D^2 + 4D + 4)y = e^(-2x).",
                  solution: "Auxiliary: m^2 + 4m + 4 = 0 ⇒ (m+2)^2 = 0 ⇒ m = -2, -2. CF = (c1 + c2 x)e^(-2x). PI = 1/(D+2)^2 [e^(-2x)]. Since f(-2) = 0, apply x/(2(D+2)) [e^(-2x)] = x^2/2 * e^(-2x). General Solution: y = (c1 + c2 x)e^(-2x) + (x^2/2)e^(-2x)."
                }
              ],
              practicalApplications: [
                "Mechanical spring-mass-damper oscillations (resonance and damping)",
                "LCR resonance circuits in telecommunications"
              ],
              summary: "Second-order linear ODEs model all oscillatory physical phenomena in nature.",
              revisionPoints: [
                "In case of failure (f(a) = 0), multiply by x and differentiate denominator wrt D",
                "Never substitute D = -a^2, only substitute D^2 = -a^2"
              ]
            }
          }
        ],
        3: [
          {
            id: "ch_em3_1",
            chapterNum: 1,
            title: "Laplace Transforms & Inverse Transforms",
            description: "Definition of Laplace transform, shifting theorems, transforms of derivatives and integrals, convolution theorem, and solving ODEs.",
            isVerified: true,
            videos: [
              {
                id: "6MXUEU_buqY",
                title: "Laplace Transform Explained Visually",
                channel: "3Blue1Brown",
                url: "https://www.youtube.com/watch?v=6MXUEU_buqY",
                embedUrl: "https://www.youtube-nocookie.com/embed/6MXUEU_buqY",
                thumbnail: "https://img.youtube.com/vi/6MXUEU_buqY/mqdefault.jpg"
              }
            ],
            notes: {
              learningObjectives: [
                "Compute Laplace transforms of basic functions and Dirac delta",
                "Apply first and second shifting properties",
                "Use the convolution theorem to find inverse Laplace transforms",
                "Solve initial value ODE problems using s-domain algebra"
              ],
              keyDefinitions: [
                { term: "Laplace Transform", definition: "An integral transform L{f(t)} = F(s) = ∫[0 to ∞] e^(-st) f(t) dt for s > 0." },
                { term: "Convolution (f * g)", definition: "(f * g)(t) = ∫[0 to t] f(u) g(t - u) du; L{f * g} = F(s) * G(s)." }
              ],
              conceptualExplanations: [
                {
                  heading: "Transforming Differential Equations into Algebraic Equations",
                  content: "L{y'(t)} = s Y(s) - y(0) and L{y''(t)} = s^2 Y(s) - s y(0) - y'(0). This converts differential equations with initial values into straightforward algebraic equations in s, eliminating the need to solve CF and PI separately."
                }
              ],
              formulasOrRules: [
                { name: "Laplace Integral", formula: "L{f(t)} = ∫[0 to ∞] e^(-st) f(t) dt" },
                { name: "Derivative Transform", formula: "L{f'(t)} = s F(s) - f(0)" }
              ],
              examplesOrProblems: [
                {
                  title: "Solving IVP via Laplace",
                  problem: "Solve y'' + y = t with y(0) = 1, y'(0) = 0.",
                  solution: "Apply L: [s^2 Y(s) - s(1) - 0] + Y(s) = 1/s^2 ⇒ Y(s)(s^2 + 1) = s + 1/s^2 ⇒ Y(s) = s/(s^2 + 1) + 1/[s^2 (s^2 + 1)]. Taking inverse: y(t) = cos(t) + (t - sin(t)) = cos(t) - sin(t) + t."
                }
              ],
              practicalApplications: [
                "Control systems transfer function analysis and stability",
                "Signal filtering in analog and digital electronics"
              ],
              summary: "Laplace transforms map time-domain calculus into s-domain algebraic manipulations.",
              revisionPoints: [
                "Remember to subtract initial conditions y(0) when transforming derivatives",
                "Convolution theorem is especially helpful when partial fractions are tedious"
              ]
            }
          }
        ],
        4: [
          {
            id: "ch_em4_1",
            chapterNum: 1,
            title: "Probability Distributions & Statistics",
            description: "Discrete and continuous random variables, Binomial, Poisson, and Normal distributions with engineering reliability applications.",
            isVerified: true,
            videos: [
              {
                id: "b4mQ_h7WvYg",
                title: "Normal Distribution and Central Limit Theorem",
                channel: "Khan Academy",
                url: "https://www.youtube.com/watch?v=b4mQ_h7WvYg",
                embedUrl: "https://www.youtube-nocookie.com/embed/b4mQ_h7WvYg",
                thumbnail: "https://img.youtube.com/vi/b4mQ_h7WvYg/mqdefault.jpg"
              }
            ],
            notes: {
              learningObjectives: [
                "Differentiate between discrete and continuous probability mass/density functions",
                "Calculate expectations, variance, and standard deviations",
                "Model rare events using Poisson distribution",
                "Standardize normal variables into Z-scores and read standard normal tables"
              ],
              keyDefinitions: [
                { term: "Poisson Distribution", definition: "P(X = k) = (λ^k * e^(-λ)) / k!, modeling rare occurrences per unit interval where mean = variance = λ." },
                { term: "Standard Normal Variable (Z)", definition: "Z = (X - μ) / σ, with mean 0 and variance 1." }
              ],
              conceptualExplanations: [
                {
                  heading: "Normal Distribution in Engineering Tolerances",
                  content: "The bell curve f(x) = [1/(σ√(2π))] * e^(-(x-μ)^2/(2σ^2)) governs natural variations in manufacturing tolerances. By 68-95-99.7 rule, 99.7% of measurements fall within ±3σ of the mean."
                }
              ],
              formulasOrRules: [
                { name: "Binomial Formula", formula: "P(X = r) = nCr * p^r * q^(n-r)" },
                { name: "Standardized Normal", formula: "Z = (X - μ) / σ" }
              ],
              examplesOrProblems: [
                {
                  title: "Defect Rate in Manufacturing",
                  problem: "A factory produces components with a 2% defect rate. In a sample of 100 items, find the probability of finding exactly 2 defective items using Poisson approximation.",
                  solution: "λ = n*p = 100 * 0.02 = 2. P(X = 2) = (2^2 * e^(-2)) / 2! = (4 * 0.1353) / 2 = 0.2707 or 27.07%."
                }
              ],
              practicalApplications: [
                "Six-sigma manufacturing quality assurance",
                "Network packet loss and queuing arrival rates"
              ],
              summary: "Probability distributions quantify uncertainty in experimental and manufacturing processes.",
              revisionPoints: [
                "For Poisson distribution, variance always equals the mean λ",
                "Total area under any probability density function is strictly 1"
              ]
            }
          }
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
      description: "Quantum physics, wave optics, lasers, fiber optics, electromagnetics, and nanotechnology for engineering applications.",
      semesters: {
        1: [
          {
            id: "ch_ep1_1",
            chapterNum: 1,
            title: "Quantum Physics & Wave Mechanics",
            description: "De Broglie hypothesis, Heisenberg uncertainty principle, wave function properties, and Schrodinger time-independent wave equation.",
            isVerified: true,
            videos: [
              {
                id: "qO_W70EjiiQ",
                title: "Quantum Mechanics Concepts Explained Simply",
                channel: "MIT OpenCourseWare",
                url: "https://www.youtube.com/watch?v=qO_W70EjiiQ",
                embedUrl: "https://www.youtube-nocookie.com/embed/qO_W70EjiiQ",
                thumbnail: "https://img.youtube.com/vi/qO_W70EjiiQ/mqdefault.jpg"
              }
            ],
            notes: {
              learningObjectives: [
                "Formulate de Broglie wavelength for matter waves",
                "Understand physical interpretation of wave function ψ and probability density |ψ|^2",
                "Derive and solve Schrodinger equation for a particle in an infinite 1D potential well"
              ],
              keyDefinitions: [
                { term: "Wave-Particle Duality", definition: "Particles of matter exhibit wave-like characteristics with wavelength λ = h/p." },
                { term: "Born's Interpretation", definition: "The quantity |ψ(x, t)|^2 dV represents the probability of locating the particle in volume dV at time t." }
              ],
              conceptualExplanations: [
                {
                  heading: "Particle in a 1D Infinite Potential Box",
                  content: "A particle of mass m confined between x = 0 and x = L has standing wave solutions. Boundary conditions ψ(0) = ψ(L) = 0 force quantization of wave number k = nπ/L. The energy levels are discrete: En = (n^2 h^2)/(8m L^2), proving energy quantization arises naturally from spatial boundary confinement."
                }
              ],
              formulasOrRules: [
                { name: "de Broglie Wavelength", formula: "λ = h / p = h / √(2mE)" },
                { name: "Energy Levels in 1D Well", formula: "En = (n^2 * h^2) / (8 * m * L^2), n = 1, 2, 3..." }
              ],
              examplesOrProblems: [
                {
                  title: "Electron in Potential Well",
                  problem: "Find the lowest energy (ground state) of an electron confined in a 1D box of width 0.1 nm (10^-10 m).",
                  solution: "E1 = (1^2 * (6.626*10^-34)^2) / (8 * 9.1*10^-31 * (10^-10)^2) = 6.03 * 10^-18 J = 37.7 eV."
                }
              ],
              practicalApplications: [
                "Semiconductor quantum dots for high-resolution displays",
                "Scanning tunneling microscopes (STM) utilizing quantum barrier tunneling"
              ],
              summary: "Quantum confinement restricts energy to discrete quantized values, fundamental to modern semiconductor electronics.",
              revisionPoints: [
                "Ground state energy n = 1 is strictly greater than zero (Zero Point Energy)",
                "Wave functions must be continuous and normalized: ∫ |ψ|^2 dx = 1"
              ]
            }
          },
          {
            id: "ch_ep1_2",
            chapterNum: 2,
            title: "Wave Optics: Interference & Diffraction",
            description: "Interference in thin films of uniform and wedge thickness, Newton's rings experiment, and Fraunhofer diffraction through single and double slits.",
            isVerified: true,
            videos: [
              {
                id: "Iuv6hY6zsd0",
                title: "Wave Interference and Diffraction in Optics",
                channel: "Khan Academy",
                url: "https://www.youtube.com/watch?v=Iuv6hY6zsd0",
                embedUrl: "https://www.youtube-nocookie.com/embed/Iuv6hY6zsd0",
                thumbnail: "https://img.youtube.com/vi/Iuv6hY6zsd0/mqdefault.jpg"
              }
            ],
            notes: {
              learningObjectives: [
                "Derive conditions for constructive and destructive interference in thin films",
                "Explain formation of Newton's rings and determine wavelength of light",
                "Distinguish between Fresnel and Fraunhofer diffraction regimes"
              ],
              keyDefinitions: [
                { term: "Stokes' Phase Shift", definition: "A phase change of π radians (path difference λ/2) occurs upon reflection from a medium of higher refractive index." },
                { term: "Newton's Rings", definition: "Circular interference fringes formed by air film enclosed between a plano-convex lens and an optically flat glass plate." }
              ],
              conceptualExplanations: [
                {
                  heading: "Newton's Rings Diameter Proportions",
                  content: "The path difference in reflected light is 2μt + λ/2. For destructive interference (dark rings), 2μt + λ/2 = (2n + 1)λ/2 ⇒ 2t = nλ. From geometry, t = r^2 / (2R). Thus D_n^2 = 4nλR. Therefore, diameters of dark rings are proportional to square roots of natural numbers: D_n ∝ √n."
                }
              ],
              formulasOrRules: [
                { name: "Newton's Dark Rings Diameter", formula: "Dn^2 = 4 * n * λ * R" },
                { name: "Wedge Film Fringe Width", formula: "β = λ / (2 * μ * θ)" }
              ],
              examplesOrProblems: [
                {
                  title: "Wavelength from Newton's Rings",
                  problem: "In a Newton's rings experiment, the diameter of the 4th and 16th dark rings are 0.4 cm and 0.8 cm. Lens radius of curvature R = 100 cm. Find wavelength λ.",
                  solution: "D_m^2 - D_n^2 = 4(m - n)λR. (0.8)^2 - (0.4)^2 = 4(16 - 4)λ(100) ⇒ 0.64 - 0.16 = 4800 λ ⇒ 0.48 = 4800 λ ⇒ λ = 10^-4 cm = 5000 Å (500 nm)."
                }
              ],
              practicalApplications: [
                "Anti-reflective coatings on camera lenses and eyewear",
                "Optical flatness testing of precision glass and silicon wafers"
              ],
              summary: "Interference phenomena allow optical metrology with precision down to nanometer fractions of light wavelengths.",
              revisionPoints: [
                "Central ring in reflected light is dark due to the extra λ/2 phase jump",
                "Rings get closer together as order n increases because Dn ∝ √n"
              ]
            }
          }
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
      description: "Linear and non-linear data structures, asymptotic analysis, stacks, queues, linked lists, trees, graphs, hashing, and sorting algorithms.",
      semesters: {
        3: [
          {
            id: "ch_ds3_1",
            chapterNum: 1,
            title: "Analysis of Algorithms & Asymptotic Notations",
            description: "Time and space complexity, Big-O, Omega, and Theta notations, and worst, average, and best-case analysis of algorithms.",
            isVerified: true,
            videos: [
              {
                id: "bum_19JhyCD",
                title: "Introduction to Data Structures & Algorithms",
                channel: "Gate Smashers",
                url: "https://www.youtube.com/watch?v=bum_19JhyCD",
                embedUrl: "https://www.youtube-nocookie.com/embed/bum_19JhyCD",
                thumbnail: "https://img.youtube.com/vi/bum_19JhyCD/mqdefault.jpg"
              }
            ],
            notes: {
              learningObjectives: [
                "Evaluate computational time and space complexity of code",
                "Formally define Big-O (upper bound), Big-Omega (lower bound), and Big-Theta (tight bound)",
                "Solve recurrence relations using substitution and Master Theorem"
              ],
              keyDefinitions: [
                { term: "Big-O Notation O(g(n))", definition: "f(n) = O(g(n)) if there exist positive constants c and n0 such that 0 ≤ f(n) ≤ c * g(n) for all n ≥ n0." },
                { term: "Space Complexity", definition: "The total memory space required by an algorithm during execution, consisting of fixed instructional memory plus dynamic input/auxiliary memory." }
              ],
              conceptualExplanations: [
                {
                  heading: "Asymptotic Growth Rates Hierarchy",
                  content: "O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(n^3) < O(2^n) < O(n!). An algorithm with logarithmic time O(log n) scales gracefully to billions of items, whereas exponential O(2^n) algorithms become computationally infeasible for n > 40."
                }
              ],
              formulasOrRules: [
                { name: "Master Theorem", formula: "T(n) = aT(n/b) + f(n); compare f(n) with n^(log_b a)" }
              ],
              examplesOrProblems: [
                {
                  title: "Binary Search Complexity",
                  problem: "Analyze recurrence T(n) = T(n/2) + 1.",
                  solution: "Here a = 1, b = 2, f(n) = 1 = n^0. n^(log_b a) = n^(log_2 1) = n^0 = 1. Since f(n) = Θ(n^(log_b a)), Master Theorem Case 2 applies: T(n) = Θ(log n)."
                }
              ],
              practicalApplications: [
                "Database query execution planner time bounds",
                "Resource budgeting for embedded real-time systems"
              ],
              summary: "Asymptotic analysis isolates the fundamental growth rate of an algorithm from hardware variations.",
              revisionPoints: [
                "Big-O gives an asymptotic upper bound, not necessarily the exact running time",
                "Drop lower-order terms and constant coefficients when stating complexity"
              ]
            }
          },
          {
            id: "ch_ds3_2",
            chapterNum: 2,
            title: "Linear Data Structures: Stacks & Queues",
            description: "LIFO vs FIFO principles, array and linked implementations, infix to postfix conversion, circular queues, and priority queues.",
            isVerified: true,
            videos: [
              {
                id: "sFVxsatSlic",
                title: "Stack Data Structure - Implementation & Operations",
                channel: "Gate Smashers",
                url: "https://www.youtube.com/watch?v=sFVxsatSlic",
                embedUrl: "https://www.youtube-nocookie.com/embed/sFVxsatSlic",
                thumbnail: "https://img.youtube.com/vi/sFVxsatSlic/mqdefault.jpg"
              }
            ],
            notes: {
              learningObjectives: [
                "Implement push, pop, and peek operations on stacks with overflow/underflow checks",
                "Convert infix expressions to postfix and evaluate postfix using stack",
                "Overcome linear queue array boundary limitations using Circular Queues"
              ],
              keyDefinitions: [
                { term: "Stack (LIFO)", definition: "A linear data structure where elements are added and removed only from one end, designated as top." },
                { term: "Circular Queue", definition: "A linear data structure where rear connects back to front modulo capacity: rear = (rear + 1) % MAX, preventing wasted memory." }
              ],
              conceptualExplanations: [
                {
                  heading: "Infix to Postfix Shunting-Yard Algorithm",
                  content: "Operands output directly. Operators push onto stack after popping any existing operators with greater or equal precedence (taking associativity into account). Opening parentheses push unconditionally; closing parentheses trigger pops until matching opening parenthesis is removed."
                }
              ],
              formulasOrRules: [
                { name: "Circular Queue Full Check", formula: "(rear + 1) % MAX == front" },
                { name: "Circular Queue Empty Check", formula: "front == -1" }
              ],
              examplesOrProblems: [
                {
                  title: "Infix to Postfix Conversion",
                  problem: "Convert A + B * (C - D) / E to postfix.",
                  solution: "Parentheses evaluated first: (C - D) → CD-. Multiply: B * CD- → BCD-*. Divide: BCD-* / E → BCD-*E/. Add: A + ... → ABCD-*E/+."
                }
              ],
              practicalApplications: [
                "Function call call-stack and recursion management in CPU architectures",
                "Browser back/forward history tracking and editor undo/redo buffers"
              ],
              summary: "Stacks enforce last-in-first-out order essential for nested syntax and backtracking.",
              revisionPoints: [
                "Always check for Stack Overflow before Push and Stack Underflow before Pop",
                "Circular queues require special front == -1 reset when the last element is removed"
              ]
            }
          },
          {
            id: "ch_ds3_3",
            chapterNum: 3,
            title: "Linked Lists: Singly, Doubly & Circular",
            description: "Dynamic memory allocation, node structures, insertion and deletion operations, reversing linked lists, and circular list traversal.",
            isVerified: true,
            videos: [
              {
                id: "nobKP_eS5vE",
                title: "Linked List in C/C++ - Data Structures",
                channel: "Gate Smashers",
                url: "https://www.youtube.com/watch?v=nobKP_eS5vE",
                embedUrl: "https://www.youtube-nocookie.com/embed/nobKP_eS5vE",
                thumbnail: "https://img.youtube.com/vi/nobKP_eS5vE/mqdefault.jpg"
              }
            ],
            notes: {
              learningObjectives: [
                "Construct node structures using dynamic memory pointers",
                "Execute O(1) insertions at the head and O(n) insertions at arbitrary positions",
                "Reverse a singly linked list iteratively in O(n) time and O(1) extra space"
              ],
              keyDefinitions: [
                { term: "Singly Linked List", definition: "A sequence of nodes where each node contains data and a pointer (next) to the subsequent node in memory." },
                { term: "Doubly Linked List", definition: "A bidirectional node chain where each node holds pointers to both next and prev nodes, facilitating O(1) bidirectional deletions." }
              ],
              conceptualExplanations: [
                {
                  heading: "Reversing a Linked List",
                  content: "Maintain three pointers: prev = NULL, curr = head, next = NULL. In each step: next = curr->next; curr->next = prev; prev = curr; curr = next. Loop until curr == NULL, then set head = prev."
                }
              ],
              formulasOrRules: [
                { name: "Node Memory (C)", formula: "struct Node* temp = (struct Node*)malloc(sizeof(struct Node));" }
              ],
              examplesOrProblems: [
                {
                  title: "Detecting Loop in Linked List",
                  problem: "Explain Floyd's Cycle Detection (Tortoise and Hare) algorithm.",
                  solution: "Initialize two pointers slow = head, fast = head. Advance slow by 1 step (slow = slow->next) and fast by 2 steps (fast = fast->next->next). If slow == fast at any time, a loop exists. If fast reaches NULL, no cycle exists. Time complexity O(n), Space O(1)."
                }
              ],
              practicalApplications: [
                "Operating system free memory block tracking via linked free-lists",
                "Music playlist next/previous track navigation using doubly linked circular lists"
              ],
              summary: "Linked lists bypass contiguous memory allocation constraints, enabling dynamic runtime resizing.",
              revisionPoints: [
                "Never dereference a pointer after freeing its allocated memory (dangling pointer)",
                "Always check if head is NULL before accessing head->next"
              ]
            }
          },
          {
            id: "ch_ds3_4",
            chapterNum: 4,
            title: "Non-Linear Structures: Trees & Binary Search Trees",
            description: "Binary tree properties, in-order, pre-order, and post-order traversals, BST insertion, deletion, and height-balanced AVL trees.",
            isVerified: true,
            videos: [
              {
                id: "jmy0LaGET1I",
                title: "Binary Tree Traversals - Preorder, Inorder, Postorder",
                channel: "Gate Smashers",
                url: "https://www.youtube.com/watch?v=jmy0LaGET1I",
                embedUrl: "https://www.youtube-nocookie.com/embed/jmy0LaGET1I",
                thumbnail: "https://img.youtube.com/vi/jmy0LaGET1I/mqdefault.jpg"
              }
            ],
            notes: {
              learningObjectives: [
                "Perform recursive and iterative tree traversals (In-order, Pre-order, Post-order)",
                "Implement search, insert, and delete in a Binary Search Tree (BST)",
                "Identify balance factor and execute AVL rotations (LL, RR, LR, RL)"
              ],
              keyDefinitions: [
                { term: "Binary Search Tree (BST)", definition: "A binary tree where the key in every node is strictly greater than all keys in its left subtree and strictly less than all keys in its right subtree." },
                { term: "AVL Tree", definition: "A self-balancing BST where the balance factor (Height(Left) - Height(Right)) of every node is in {-1, 0, +1}." }
              ],
              conceptualExplanations: [
                {
                  heading: "In-Order Traversal Property of BST",
                  content: "Visiting a BST in the order Left -> Root -> Right yields keys in strictly ascending sorted order in O(n) time. This property enables O(log n) binary search in balanced configurations."
                }
              ],
              formulasOrRules: [
                { name: "Max Nodes at Level i", formula: "2^i (root at level 0)" },
                { name: "AVL Balance Factor", formula: "BF(node) = Height(Left) - Height(Right) ∈ {-1, 0, 1}" }
              ],
              examplesOrProblems: [
                {
                  title: "BST Node Deletion Cases",
                  problem: "Explain the three cases of deleting a node in a BST.",
                  solution: "Case 1: Node is a leaf (no children) - simply remove node and set parent's pointer to NULL. Case 2: Node has one child - link parent directly to child and free node. Case 3: Node has two children - find in-order successor (minimum node in right subtree), copy its value to the target node, and recursively delete the in-order successor."
                }
              ],
              practicalApplications: [
                "File system directory hierarchies",
                "Database indexing structures (B-Trees and AVL trees for range queries)"
              ],
              summary: "Hierarchical tree structures provide logarithmic time operations for searching and sorting data.",
              revisionPoints: [
                "In a degenerate BST (skewed tree), search time degrades from O(log n) to O(n)",
                "Post-order traversal is used for bottom-up cleanup like calculating folder sizes or deleting trees"
              ]
            }
          }
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
      description: "Process management, CPU scheduling, synchronization, deadlocks, memory management, virtual memory, and file systems.",
      semesters: {
        4: [
          {
            id: "ch_os4_1",
            chapterNum: 1,
            title: "Introduction to Operating Systems & System Calls",
            description: "OS functions, dual-mode operation, system architectures, system call execution mechanism, and process creation.",
            isVerified: true,
            videos: [
              {
                id: "26QPDBe-NB8",
                title: "Introduction to Operating Systems",
                channel: "Gate Smashers",
                url: "https://www.youtube.com/watch?v=26QPDBe-NB8",
                embedUrl: "https://www.youtube-nocookie.com/embed/26QPDBe-NB8",
                thumbnail: "https://img.youtube.com/vi/26QPDBe-NB8/mqdefault.jpg"
              }
            ],
            notes: {
              learningObjectives: [
                "Understand the role of the operating system as an extended machine and resource manager",
                "Differentiate user mode (Ring 3) from kernel mode (Ring 0)",
                "Trace system call transitions using software interrupts / traps"
              ],
              keyDefinitions: [
                { term: "Dual Mode Operation", definition: "A hardware architecture protection providing User Mode (mode bit 1) for applications and Kernel/Supervisor Mode (mode bit 0) for privileged OS operations." },
                { term: "System Call", definition: "The programmatic interface by which an application requests services from the operating system kernel." }
              ],
              conceptualExplanations: [
                {
                  heading: "System Call Invocation and Mode Switching",
                  content: "When a user program calls open() or read(), the C runtime library places the system call number in a designated CPU register (e.g., EAX) and executes a trap instruction (e.g., syscall / int 0x80). Hardware switches the CPU mode bit to 0, saves program counter and registers on the kernel stack, and jumps to the system call interrupt dispatch table."
                }
              ],
              formulasOrRules: [
                { name: "CPU Mode Bit", formula: "1 = User Mode (unprivileged), 0 = Kernel Mode (privileged)" }
              ],
              examplesOrProblems: [
                {
                  title: "Fork System Call Process Tree",
                  problem: "How many total processes are created by executing: fork(); fork(); fork(); ?",
                  solution: "Each fork() call doubles the number of existing processes. Total processes = 2^n = 2^3 = 8 processes (1 parent + 7 child processes created)."
                }
              ],
              practicalApplications: [
                "Container isolation mechanisms (cgroups and namespaces in Linux)",
                "Virtualization hypervisors managing privileged hardware instructions"
              ],
              summary: "Hardware privilege modes and system calls form the boundary between user code safety and hardware control.",
              revisionPoints: [
                "Privileged instructions (like disabling interrupts) can only execute in Kernel Mode",
                "fork() returns 0 to the child process and the child's PID to the parent process"
              ]
            }
          },
          {
            id: "ch_os4_2",
            chapterNum: 2,
            title: "Process Scheduling & CPU Scheduling Algorithms",
            description: "Process states, Process Control Block (PCB), preemptive vs non-preemptive scheduling, FCFS, SJF, Round Robin, and Priority scheduling.",
            isVerified: true,
            videos: [
              {
                id: "ewnk_W1b6j8",
                title: "CPU Scheduling Algorithms - FCFS, SJF, Round Robin",
                channel: "Gate Smashers",
                url: "https://www.youtube.com/watch?v=ewnk_W1b6j8",
                embedUrl: "https://www.youtube-nocookie.com/embed/ewnk_W1b6j8",
                thumbnail: "https://img.youtube.com/vi/ewnk_W1b6j8/mqdefault.jpg"
              }
            ],
            notes: {
              learningObjectives: [
                "Understand PCB data structures and context switching overhead",
                "Calculate turnaround time, waiting time, and response time",
                "Construct Gantt charts for FCFS, SJF, SRTF, and Round Robin algorithms"
              ],
              keyDefinitions: [
                { term: "Turnaround Time (TAT)", definition: "TAT = Completion Time (CT) - Arrival Time (AT)." },
                { term: "Waiting Time (WT)", definition: "WT = Turnaround Time (TAT) - Burst Time (BT)." },
                { term: "Convoy Effect", definition: "A phenomenon where short processes wait behind a long CPU-bound process in non-preemptive FCFS scheduling." }
              ],
              conceptualExplanations: [
                {
                  heading: "Shortest Job First (SJF) vs Round Robin (RR)",
                  content: "SJF provides the mathematically minimum average waiting time among all scheduling algorithms, but requires predicting future burst times. Round Robin uses time quantum slices to ensure interactive responsiveness, balancing throughput and fairness."
                }
              ],
              formulasOrRules: [
                { name: "Turnaround Time", formula: "TAT = Completion Time - Arrival Time" },
                { name: "Waiting Time", formula: "WT = TAT - Burst Time" }
              ],
              examplesOrProblems: [
                {
                  title: "Round Robin Gantt Chart",
                  problem: "Processes P1(BT=5), P2(BT=3), P3(BT=1) arrive at time 0 with Quantum = 2. Compute average waiting time.",
                  solution: "Gantt Chart: P1 [0-2], P2 [2-4], P3 [4-5], P1 [5-7], P2 [7-8], P1 [8-9]. Completion times: P3=5, P2=8, P1=9. TAT: P1=9, P2=8, P3=5. WT: P1=9-5=4, P2=8-3=5, P3=5-1=4. Average WT = (4 + 5 + 4) / 3 = 4.33 ms."
                }
              ],
              practicalApplications: [
                "Multi-threaded application CPU dispatching in Linux Completely Fair Scheduler (CFS)",
                "Real-time task scheduling in automotive ECUs and robotics"
              ],
              summary: "CPU schedulers balance throughput, fairness, and response latency across competing processes.",
              revisionPoints: [
                "Preemptive SJF is also called Shortest Remaining Time First (SRTF)",
                "If Round Robin time quantum is too large, it degenerates to FCFS; if too small, context switch overhead dominates"
              ]
            }
          },
          {
            id: "ch_os4_3",
            chapterNum: 3,
            title: "Synchronization & Deadlock Avoidance",
            description: "Critical section problem, Peterson's algorithm, semaphores, mutexes, deadlock conditions, and Banker's algorithm.",
            isVerified: true,
            videos: [
              {
                id: "T0FXvTHcYi4",
                title: "Banker's Algorithm for Deadlock Avoidance",
                channel: "Gate Smashers",
                url: "https://www.youtube.com/watch?v=T0FXvTHcYi4",
                embedUrl: "https://www.youtube-nocookie.com/embed/T0FXvTHcYi4",
                thumbnail: "https://img.youtube.com/vi/T0FXvTHcYi4/mqdefault.jpg"
              }
            ],
            notes: {
              learningObjectives: [
                "Identify race conditions and the three criteria of the critical section problem",
                "Implement mutual exclusion using counting and binary semaphores",
                "Apply Banker's Algorithm to verify system safety and grant resource requests"
              ],
              keyDefinitions: [
                { term: "Critical Section", definition: "A code segment that accesses shared resources (memory, files) that must not be concurrently executed by more than one process." },
                { term: "Four Coffman Conditions", definition: "Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait; all four must hold simultaneously for deadlock to occur." }
              ],
              conceptualExplanations: [
                {
                  heading: "Banker's Safety Algorithm",
                  content: "Given Allocation, Max, and Available matrices, calculate Need = Max - Allocation. Find a process whose Need ≤ Available. Assume it finishes, releasing its allocated resources: Available = Available + Allocation. If all processes complete, a Safe Sequence exists and no deadlock can occur."
                }
              ],
              formulasOrRules: [
                { name: "Need Matrix Formula", formula: "Need[i][j] = Max[i][j] - Allocation[i][j]" }
              ],
              examplesOrProblems: [
                {
                  title: "Banker's Algorithm Safe Sequence",
                  problem: "Total resources = (10, 5, 7). Allocated = (7, 2, 5). Available = (3, 3, 2). Processes P0, P1, P2 have Needs (7,4,3), (1,2,2), (6,0,0). Is system safe?",
                  solution: "Step 1: P1 Need (1,2,2) ≤ Available (3,3,2). P1 executes and releases. New Available = (3,3,2) + Allocation(P1) = (5,3,2). Step 2: P0 or P2 tested. Safe sequence <P1, P0, P2> successfully executes. System is in a SAFE state."
                }
              ],
              practicalApplications: [
                "Database transaction lock managers avoiding circular table locks",
                "Operating system driver resource allocation preventing hardware lockups"
              ],
              summary: "Synchronization primitives prevent race conditions while Banker's safety checks guarantee avoidance of system deadlocks.",
              revisionPoints: [
                "A safe state is not deadlocked, and from a safe state the system can allocate resources without deadlocking",
                "Binary semaphores take values 0 and 1, whereas counting semaphores can take any non-negative integer"
              ]
            }
          }
        ]
      }
    }
  ]
};
