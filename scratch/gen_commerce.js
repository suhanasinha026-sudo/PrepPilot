// Comprehensive Commerce Stream Dataset (15 Subjects)
const commerceSubjects = [
  {
    id: "com_fin_acc",
    name: "Financial Accounting",
    stream: "commerce",
    degree: "B.Com",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [1, 2],
    description: "Accounting principles, journal, ledger, trial balance, final accounts, depreciation, hire purchase, and consignment.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Accounting Principles, Concepts & Conventions", desc: "Entity, money measurement, going concern, periodicity, accrual concepts, double entry system, and accounting standards." },
        { num: 2, title: "Recording of Transactions: Journal & Ledger", desc: "Rules of debit and credit for personal, real, and nominal accounts, compound journal entries, ledger posting, and balancing." },
        { num: 3, title: "Trial Balance & Bank Reconciliation Statement (BRS)", desc: "Preparation of trial balance, errors not affecting trial balance, causes of difference between cash book and pass book, and BRS preparation." },
        { num: 4, title: "Depreciation Accounting (AS-10)", desc: "Causes of depreciation, Straight Line Method (SLM), Written Down Value (WDV), change in method, and disposal of fixed assets." },
        { num: 5, title: "Final Accounts of Sole Proprietorship", desc: "Trading account, profit and loss account, balance sheet with adjustments (outstanding, prepaid, bad debts, provision for doubtful debts)." }
      ],
      2: [
        { num: 1, title: "Consignment Accounts", desc: "Consignor and consignee relationship, proforma invoice, account sales, normal and abnormal loss calculation, and valuation of unsold stock." },
        { num: 2, title: "Joint Venture Accounts", desc: "Features of joint venture vs partnership, maintenance of separate books, recording in existing books, and memorandum joint venture." },
        { num: 3, title: "Hire Purchase and Installment Purchase Systems", desc: "Cash price calculation, interest computation, accounting in buyer's and seller's books, repossession of goods (default cases)." },
        { num: 4, title: "Branch Accounting & Single Entry System", desc: "Dependent vs independent branches, debtors method, stock and debtors method, and conversion of single entry to double entry." }
      ]
    }
  },
  {
    id: "com_biz_econ",
    name: "Business Economics",
    stream: "commerce",
    degree: "B.Com",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [1],
    description: "Microeconomic principles, consumer demand theory, production functions, cost-volume-profit analysis, and market pricing.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Scope of Business Economics & Demand Analysis", desc: "Nature and scope of managerial economics, law of demand, demand schedule and curve, and shift vs movement along demand curve." },
        { num: 2, title: "Elasticity of Demand & Forecasting", desc: "Price, income, and cross elasticity of demand, measurement methods, and business demand forecasting techniques." },
        { num: 3, title: "Theory of Consumer Behavior & Indifference Curves", desc: "Marginal utility analysis, law of diminishing marginal utility, indifference curve properties, budget line, and consumer equilibrium." },
        { num: 4, title: "Theory of Production & Law of Variable Proportions", desc: "Short-run production function, total, average, and marginal product, three stages of production, isoquants, and returns to scale." },
        { num: 5, title: "Cost and Revenue Analysis", desc: "Short-run and long-run cost curves (TFC, TVC, TC, AFC, AVC, MC), economies and diseconomies of scale, and break-even analysis." },
        { num: 6, title: "Market Structures & Pricing Strategies", desc: "Price and output determination under perfect competition, monopoly, monopolistic competition, oligopoly (kinked demand curve), and price discrimination." }
      ]
    }
  },
  {
    id: "com_biz_law",
    name: "Business Law",
    stream: "commerce",
    degree: "B.Com",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [3],
    description: "Indian Contract Act 1872, Sale of Goods Act 1930, Negotiable Instruments Act 1881, and Consumer Protection Act 2019.",
    chaptersBySemester: {
      3: [
        { num: 1, title: "Indian Contract Act: Formation & Essentials", desc: "Definition of contract, proposal and acceptance, legal intention, capacity of parties (minors, persons of unsound mind), and consideration." },
        { num: 2, title: "Free Consent & Void Agreements", desc: "Coercion, undue influence, fraud, misrepresentation, mistake of fact and law, legality of object, and agreements opposed to public policy." },
        { num: 3, title: "Performance, Discharge & Breach of Contract", desc: "Modes of discharge (performance, mutual agreement, frustration/impossibility), anticipatory and actual breach, and remedies for breach." },
        { num: 4, title: "Special Contracts: Indemnity, Guarantee, Bailment", desc: "Contract of indemnity vs guarantee, rights and discharge of surety, rights and duties of bailor and bailee, and pledge." },
        { num: 5, title: "Sale of Goods Act 1930", desc: "Sale vs agreement to sell, conditions and warranties, doctrine of Caveat Emptor with exceptions, transfer of title, and unpaid seller's rights." },
        { num: 6, title: "Negotiable Instruments & Consumer Protection", desc: "Promissory notes, bills of exchange, cheques, crossing and dishonor, Consumer Protection Act 2019 rights, and dispute redressal forums." }
      ]
    }
  },
  {
    id: "com_biz_math",
    name: "Business Mathematics",
    stream: "commerce",
    degree: "B.Com",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [1],
    description: "Commercial arithmetic, annuities, matrices, differential calculus in business, linear programming, and transportation models.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Commercial Mathematics: Interest & Annuities", desc: "Simple and compound interest, effective rate of interest, ordinary annuities, annuities due, present value, and sinking funds." },
        { num: 2, title: "Matrices and Determinants in Business", desc: "Matrix operations, determinants, Cramer's rule, matrix inversion, and Leontief input-output economic models." },
        { num: 3, title: "Differential Calculus in Commerce", desc: "Derivatives of algebraic functions, marginal cost, marginal revenue, average cost, elasticity of demand, and profit maximization." },
        { num: 4, title: "Linear Programming: Graphical Method", desc: "Formulation of business linear programming problems (LPP), feasible region, corner point method, and unbounded/infeasible solutions." },
        { num: 5, title: "Transportation & Assignment Problems", desc: "Initial basic feasible solution using North-West Corner, Least Cost, and Vogel's Approximation Method (VAM), Hungarian assignment method." }
      ]
    }
  },
  {
    id: "com_biz_stat",
    name: "Business Statistics",
    stream: "commerce",
    degree: "B.Com",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [2],
    description: "Data presentation, measures of central tendency, dispersion, correlation, regression analysis, and time series.",
    chaptersBySemester: {
      2: [
        { num: 1, title: "Data Collection, Classification & Tabulation", desc: "Primary vs secondary data, frequency distribution tables, histograms, frequency polygons, and ogives." },
        { num: 2, title: "Measures of Central Tendency", desc: "Arithmetic mean, weighted mean, median, mode, empirical relationship (Mode = 3 Median - 2 Mean), and geometric mean." },
        { num: 3, title: "Measures of Dispersion & Skewness", desc: "Range, quartile deviation, standard deviation, variance, coefficient of variation (CV) for consistency, and Karl Pearson's skewness." },
        { num: 4, title: "Correlation Analysis", desc: "Scatter diagrams, Karl Pearson's coefficient of correlation (r), properties of r, and Spearman's rank correlation for ranked attributes." },
        { num: 5, title: "Linear Regression Analysis", desc: "Regression equations of Y on X and X on Y, regression coefficients (byx, bxy), angle between regression lines, and standard error of estimate." },
        { num: 6, title: "Time Series Analysis & Index Numbers", desc: "Components of time series (trend, seasonal, cyclical, irregular), moving averages method, Laspeyres, Paasche, and Fisher's ideal index." }
      ]
    }
  },
  {
    id: "com_cost_acc",
    name: "Cost Accounting",
    stream: "commerce",
    degree: "B.Com",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [3, 4],
    description: "Elements of cost, cost sheets, material control (EOQ), labor incentive schemes, overhead allocation, and process costing.",
    chaptersBySemester: {
      3: [
        { num: 1, title: "Introduction to Cost Accounting & Cost Sheet", desc: "Cost concepts, direct vs indirect costs, fixed vs variable costs, preparation of detailed cost sheets, and tender pricing." },
        { num: 2, title: "Material Cost Control & Inventory Valuation", desc: "Economic Order Quantity (EOQ), reorder level, minimum/maximum stock levels, ABC analysis, and pricing of issues (FIFO, LIFO, Weighted Average)." },
        { num: 3, title: "Labor Cost Control & Incentive Wage Plans", desc: "Time keeping and time booking, idle time, overtime, labor turnover, Halsey premium plan, and Rowan incentive scheme." },
        { num: 4, title: "Overheads Allocation and Apportionment", desc: "Classification of overheads, primary distribution, secondary redistribution (repeated distribution, simultaneous equations), and machine hour rate." }
      ],
      4: [
        { num: 1, title: "Unit Costing, Job & Batch Costing", desc: "Accumulation of direct material, labor, and overhead costs for unique job orders, batch economic batch quantity (EBQ), and cost ledgers." },
        { num: 2, title: "Contract Costing & Work-in-Progress", desc: "Cost of contract, work certified, work uncertified, retention money, escalation clause, and calculation of notional profit to transfer to P&L." },
        { num: 3, title: "Process Costing & Equivalent Production", desc: "Features of continuous process manufacturing, normal and abnormal loss/gain, scrap value accounting, and equivalent production units." },
        { num: 4, title: "Marginal Costing & CVP Decision Making", desc: "Contribution, Profit-Volume (P/V) ratio, Break-Even Point (BEP), Margin of Safety, and short-term decision making (make or buy, key factor)." }
      ]
    }
  },
  {
    id: "com_corp_acc",
    name: "Corporate Accounting",
    stream: "commerce",
    degree: "B.Com",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [3, 4],
    description: "Issue of shares, debentures, company final accounts (Schedule III), valuation of shares and goodwill, and amalgamations.",
    chaptersBySemester: {
      3: [
        { num: 1, title: "Issue and Forfeiture of Shares & Debentures", desc: "Issue of equity and preference shares at par, premium, pro-rata allotment, forfeiture and reissue of shares, and issue/redemption of debentures." },
        { num: 2, title: "Redemption of Preference Shares", desc: "Legal provisions under Companies Act 2013, redemption out of divisible profits vs fresh issue, and Capital Redemption Reserve (CRR)." },
        { num: 3, title: "Company Final Accounts (Schedule III)", desc: "Statutory provisions, preparation of statement of profit and loss and balance sheet in vertical format with explanatory notes." }
      ],
      4: [
        { num: 1, title: "Valuation of Goodwill and Shares", desc: "Average profit, super profit, and capitalization methods of goodwill valuation, intrinsic value, yield value, and fair value of shares." },
        { num: 2, title: "Amalgamation, Absorption & Reconstruction (AS-14)", desc: "Purchase consideration calculation (net assets, net payments methods), accounting entries in the books of transferor and transferee companies." },
        { num: 3, title: "Internal Reconstruction & Capital Reduction", desc: "Alteration of share capital, capital reduction schemes, accounting entries, and post-reconstruction balance sheet preparation." }
      ]
    }
  },
  {
    id: "com_mgmt_acc",
    name: "Management Accounting",
    stream: "commerce",
    degree: "B.Com",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [5],
    description: "Financial statement analysis, ratio analysis, funds flow, cash flow statement (AS-3), and budgetary control systems.",
    chaptersBySemester: {
      5: [
        { num: 1, title: "Management Accounting Scope & Financial Analysis", desc: "Role of management accountant, comparative financial statements, common-size statements, and trend percentage analysis." },
        { num: 2, title: "Ratio Analysis for Decision Making", desc: "Liquidity ratios (current, quick), solvency ratios (debt-equity, interest coverage), turnover ratios (debtors, inventory), and profitability ratios (NPR, ROI)." },
        { num: 3, title: "Cash Flow Statement (AS-3)", desc: "Classification of cash flows into operating, investing, and financing activities, indirect method of calculating cash from operations." },
        { num: 4, title: "Budgetary Control & Standard Costing", desc: "Budget manual, functional budgets (sales, production, cash budget), flexible budgets, standard costing, and variance analysis (material and labor)." },
        { num: 5, title: "Working Capital Management", desc: "Concepts of gross and net working capital, operating cycle calculation, estimation of working capital requirements, and cash management models." }
      ]
    }
  },
  {
    id: "com_fin_mgmt",
    name: "Financial Management",
    stream: "commerce",
    degree: "B.Com",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [4],
    description: "Capital budgeting, cost of capital, capital structure theories, leverages, and dividend policy decisions.",
    chaptersBySemester: {
      4: [
        { num: 1, title: "Financial Objectives & Time Value of Money", desc: "Profit maximization vs wealth maximization, financial risk and return, compounding, discounting, and future/present value factors." },
        { num: 2, title: "Capital Budgeting: Investment Appraisal", desc: "Non-discounting methods (Payback Period, Accounting Rate of Return) and discounting methods (Net Present Value NPV, Internal Rate of Return IRR, PI)." },
        { num: 3, title: "Cost of Capital & WACC", desc: "Measurement of cost of debt (Kd), cost of preference shares (Kp), cost of equity (Ke via CAPM and dividend growth), and Weighted Average Cost of Capital." },
        { num: 4, title: "Capital Structure Theories & Leverages", desc: "Net Income (NI), Net Operating Income (NOI), Traditional, and Modigliani-Miller (MM) hypotheses, operating, financial, and combined leverages." },
        { num: 5, title: "Dividend Policies & Models", desc: "Determinants of dividend policy, Walter's model, Gordon's growth model, and Modigliani-Miller dividend irrelevance theory." }
      ]
    }
  },
  {
    id: "com_income_tax",
    name: "Income Tax",
    stream: "commerce",
    degree: "B.Com",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [5, 6],
    description: "Income Tax Act 1961, heads of income (salaries, house property, business, capital gains, other sources), and deductions.",
    chaptersBySemester: {
      5: [
        { num: 1, title: "Basic Concepts & Residential Status", desc: "Assessment year, previous year, person, assessee, gross total income, agricultural income, and residential status determination of individuals." },
        { num: 2, title: "Income from Salaries", desc: "Allowances (HRA, conveyance), perquisites valuation (rent-free accommodation, car), standard deduction u/s 16, and retirement benefits." },
        { num: 3, title: "Income from House Property", desc: "Determination of Gross Annual Value (GAV), municipal taxes deduction, Net Annual Value (NAV), and statutory deductions u/s 24 (standard 30%, interest on loan)." },
        { num: 4, title: "Profits and Gains of Business or Profession (PGBP)", desc: "Admissible and inadmissible deductions, depreciation rules, general deductions u/s 37, maintenance of books, and tax audit criteria." }
      ],
      6: [
        { num: 1, title: "Capital Gains: Short-Term & Long-Term", desc: "Capital assets definition, transfer of capital asset, cost of acquisition, indexation benefit, and exemptions under sections 54, 54EC, and 54F." },
        { num: 2, title: "Income from Other Sources", desc: "Dividend income, interest on securities, lottery winnings, family pension deductions, and gifts received by individuals." },
        { num: 3, title: "Deductions under Chapter VI-A (80C to 80U)", desc: "Section 80C investments, 80D medical insurance, 80E education loan interest, 80G donations, and 80U disability deductions." },
        { num: 4, title: "Computation of Total Income & Tax Liability", desc: "Rebate u/s 87A, surcharge, health and education cess, TDS, advance tax payment schedules, and filing of Income Tax Returns (ITR)." }
      ]
    }
  },
  {
    id: "com_auditing",
    name: "Auditing",
    stream: "commerce",
    degree: "B.Com",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [6],
    description: "Auditing standards, audit planning, internal check and control, vouching, verification of assets, and company auditor duties.",
    chaptersBySemester: {
      6: [
        { num: 1, title: "Nature, Scope and Objectives of Auditing", desc: "Detection and prevention of errors and frauds, basic principles governing an audit, auditing standards, and audit independence." },
        { num: 2, title: "Audit Planning, Program & Working Papers", desc: "Audit engagement letter, audit plan, audit program, ownership and custody of audit working papers, and audit evidence gathering." },
        { num: 3, title: "Internal Check, Internal Control & Audit Risk", desc: "Evaluation of internal control systems, internal check for cash and purchases, test checking, audit sampling, and control risk." },
        { num: 4, title: "Vouching of Trading and Cash Transactions", desc: "Importance of vouchers, audit of cash receipts, cash payments, credit purchases, sales, and treatment of deferred revenue expenditures." },
        { num: 5, title: "Verification and Valuation of Assets & Liabilities", desc: "Audit procedures for verifying title, existence, and valuation of fixed assets, stock-in-trade, debtors, creditors, and contingent liabilities." },
        { num: 6, title: "Company Auditor: Appointment & Reporting", desc: "Qualifications, disqualifications, appointment, removal, rights, duties under Companies Act 2013, clean vs qualified auditor's report (CARO)." }
      ]
    }
  },
  {
    id: "com_biz_mgmt",
    name: "Business Management",
    stream: "commerce",
    degree: "B.Com",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [2],
    description: "Management principles, planning, organizing, staffing, directing, motivation theories, leadership, and control mechanisms.",
    chaptersBySemester: {
      2: [
        { num: 1, title: "Evolution of Management Thought", desc: "Taylor's scientific management, Fayol's 14 administrative principles, Hawthorne experiments (human relations), and modern systems approach." },
        { num: 2, title: "Planning & Strategic Management", desc: "Nature and process of planning, types of plans (strategic, tactical, operational), Management by Objectives (MBO), and SWOT analysis." },
        { num: 3, title: "Organizing & Organizational Structures", desc: "Line, functional, line and staff, matrix structures, span of management, delegation of authority, and centralization vs decentralization." },
        { num: 4, title: "Directing, Motivation & Leadership", desc: "Maslow's hierarchy of needs, Herzberg's two-factor theory, McGregor's Theory X and Y, leadership styles (autocratic, democratic, laissez-faire)." },
        { num: 5, title: "Controlling Techniques & Communication", desc: "Steps in the control process, budgetary and non-budgetary control, management audit, communication process, and communication barriers." }
      ]
    }
  },
  {
    id: "com_mktg_mgmt",
    name: "Marketing Management",
    stream: "commerce",
    degree: "B.Com",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [5],
    description: "Marketing concepts, consumer buying behavior, market segmentation (STP), product life cycle, pricing, distribution, and promotion.",
    chaptersBySemester: {
      5: [
        { num: 1, title: "Marketing Concepts & Environment", desc: "Production, product, selling, marketing, and societal marketing concepts, macro and micro marketing environmental factors." },
        { num: 2, title: "Consumer Behavior & Market Segmentation (STP)", desc: "Consumer decision making process, factors influencing buying behavior, geographic, demographic, psychographic segmentation, and positioning." },
        { num: 3, title: "Product Decisions & Product Life Cycle (PLC)", desc: "Product mix decisions, new product development stages, Product Life Cycle phases (introduction, growth, maturity, decline), and branding/packaging." },
        { num: 4, title: "Pricing Strategies & Distribution Channels", desc: "Pricing methods (cost-based, value-based, competitor-based), skimming vs penetration pricing, channel levels, and channel conflict." },
        { num: 5, title: "Promotion Mix & Digital Marketing", desc: "Advertising objectives, sales promotion tools, public relations, personal selling process, social media marketing, and SEO marketing." }
      ]
    }
  },
  {
    id: "com_banking_ins",
    name: "Banking and Insurance",
    stream: "commerce",
    degree: "B.Com",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [5],
    description: "Banking operations, RBI central banking, digital banking (UPI, NEFT), principles of insurance, life, fire, and marine insurance.",
    chaptersBySemester: {
      5: [
        { num: 1, title: "Commercial Banking & Central Banking (RBI)", desc: "Functions of commercial banks, credit creation process, RBI monetary policy instruments (Repo, Reverse Repo, CRR, SLR), and Basel norms." },
        { num: 2, title: "Banker-Customer Relationship & Electronic Banking", desc: "General and special relationships, banker's lien, right of set-off, KYC norms, NEFT, RTGS, IMPS, UPI, and cybersecurity in e-banking." },
        { num: 3, title: "Principles of Insurance Law", desc: "Nature of insurance contracts, insurable interest, utmost good faith (Uberrima Fides), indemnity, subrogation, contribution, and proximate cause." },
        { num: 4, title: "Life Insurance Policies & Underwriting", desc: "Term insurance, endowment policies, whole life, ULIPs, mortality tables, premium calculations, and insurance claim settlement." },
        { num: 5, title: "General Insurance: Fire, Marine & Health", desc: "Fire insurance policies, average clause, marine insurance cargo policies, general and particular average, health insurance, and IRDAI role." }
      ]
    }
  },
  {
    id: "com_entrepreneurship",
    name: "Entrepreneurship Development",
    stream: "commerce",
    degree: "B.Com",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [6],
    description: "Entrepreneurial traits, project identification, business plan preparation, institutional financing, MSME policies, and startup ecosystem.",
    chaptersBySemester: {
      6: [
        { num: 1, title: "Entrepreneurship Concept, Types & Motivation", desc: "Characteristics of successful entrepreneurs, Schumpeter's innovation theory, McClelland's need for achievement, and intrapreneurship." },
        { num: 2, title: "Project Identification & Feasibility Studies", desc: "Business idea generation techniques, environmental scanning, market feasibility, technical feasibility, financial viability, and SWOT analysis." },
        { num: 3, title: "Business Plan Formulation", desc: "Executive summary, marketing plan, production/operations plan, financial projections (cash flow, break-even), and investor pitch decks." },
        { num: 4, title: "Institutional Support & MSME Schemes", desc: "Role of SIDBI, NABARD, District Industries Centers (DIC), Startup India initiatives, Standup India, and Mudra loan schemes." },
        { num: 5, title: "Startup Ecosystem, Funding & Incubation", desc: "Stages of startup funding (Bootstrapping, Seed capital, Angel investors, Venture capital), business incubators, accelerators, and exit strategies." }
      ]
    }
  }
];

module.exports = commerceSubjects;
