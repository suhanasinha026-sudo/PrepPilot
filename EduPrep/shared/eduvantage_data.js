/**
 * EduPrep Platform — Centralized Academic Store & State Engine (v2.0)
 * Controls the entire student learning experience:
 * University -> Institution Type -> College -> Degree Course -> Branch -> Semester -> Subjects -> Units -> Topics
 * Synchronizes client-side state in localStorage across all 17 screens.
 */

const _root = typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this);
if (typeof localStorage === 'undefined' && typeof _root.localStorage === 'undefined') {
  _root.localStorage = {
    _data: {},
    getItem: function (k) { return this._data[k] || null; },
    setItem: function (k, v) { this._data[k] = String(v); },
    removeItem: function (k) { delete this._data[k]; },
    clear: function () { this._data = {}; }
  };
}
if (typeof window === 'undefined') {
  _root.window = _root;
}

const EduPrepCore = (function () {
  'use strict';

  // ----------------------------------------------------
  // 1. UNIVERSITIES DATASET (15 Major Maharashtra Universities)
  // ----------------------------------------------------
  const UNIVERSITIES = [
    {
      id: "mu",
      name: "University of Mumbai",
      shortName: "MU",
      canonicalName: "Mumbai University",
      type: "State Public University",
      location: "Mumbai, Maharashtra",
      established: 1857,
      isAutonomousUniv: false,
      badge: "UGC / NAAC A++ (3.65)",
      logoIcon: "account_balance",
      collegesCount: 68
    },
    {
      id: "sppu",
      name: "Savitribai Phule Pune University",
      shortName: "SPPU",
      canonicalName: "SPPU Pune",
      type: "State Public University",
      location: "Pune, Maharashtra",
      established: 1949,
      isAutonomousUniv: false,
      badge: "UGC / NAAC A+ (3.60)",
      logoIcon: "school",
      collegesCount: 84
    },
    {
      id: "rtmnu",
      name: "Rashtrasant Tukadoji Maharaj Nagpur University",
      shortName: "RTMNU",
      canonicalName: "Nagpur University",
      type: "State Public University",
      location: "Nagpur, Maharashtra",
      established: 1923,
      isAutonomousUniv: false,
      badge: "UGC Accredited",
      logoIcon: "account_balance",
      collegesCount: 42
    },
    {
      id: "suk",
      name: "Shivaji University",
      shortName: "SUK",
      canonicalName: "Shivaji University",
      type: "State Public University",
      location: "Kolhapur, Maharashtra",
      established: 1962,
      isAutonomousUniv: false,
      badge: "UGC / NAAC A++",
      logoIcon: "school",
      collegesCount: 38
    },
    {
      id: "sgbau",
      name: "Sant Gadge Baba Amravati University",
      shortName: "SGBAU",
      canonicalName: "Amravati University",
      type: "State Public University",
      location: "Amravati, Maharashtra",
      established: 1983,
      isAutonomousUniv: false,
      badge: "UGC / NAAC B++",
      logoIcon: "account_balance",
      collegesCount: 26
    },
    {
      id: "bamu",
      name: "Dr. Babasaheb Ambedkar Marathwada University",
      shortName: "BAMU",
      canonicalName: "BAMU Sambhajinagar",
      type: "State Public University",
      location: "Chhatrapati Sambhajinagar, Maharashtra",
      established: 1958,
      isAutonomousUniv: false,
      badge: "UGC / NAAC A",
      logoIcon: "account_balance",
      collegesCount: 28
    },
    {
      id: "kbcnmu",
      name: "Kavayitri Bahinabai Chaudhari North Maharashtra University",
      shortName: "KBCNMU",
      canonicalName: "North Maharashtra University",
      type: "State Public University",
      location: "Jalgaon, Maharashtra",
      established: 1990,
      isAutonomousUniv: false,
      badge: "UGC / NAAC A",
      logoIcon: "school",
      collegesCount: 22
    },
    {
      id: "srtmu",
      name: "Swami Ramanand Teerth Marathwada University",
      shortName: "SRTMU",
      canonicalName: "SRTMU Nanded",
      type: "State Public University",
      location: "Nanded, Maharashtra",
      established: 1994,
      isAutonomousUniv: false,
      badge: "UGC / NAAC B++",
      logoIcon: "school",
      collegesCount: 35
    },
    {
      id: "gondwana",
      name: "Gondwana University",
      shortName: "GU",
      canonicalName: "Gondwana University",
      type: "State Public University",
      location: "Gadchiroli, Maharashtra",
      established: 2011,
      isAutonomousUniv: false,
      badge: "State University",
      logoIcon: "account_balance",
      collegesCount: 18
    },
    {
      id: "pahsus",
      name: "Punyashlok Ahilyadevi Holkar Solapur University",
      shortName: "PAHSUS",
      canonicalName: "Solapur University",
      type: "State Public University",
      location: "Solapur, Maharashtra",
      established: 2004,
      isAutonomousUniv: false,
      badge: "UGC / NAAC B++",
      logoIcon: "account_balance",
      collegesCount: 24
    },
    {
      id: "sndt",
      name: "SNDT Women's University",
      shortName: "SNDT",
      canonicalName: "SNDT Women's University",
      type: "State Public University",
      location: "Mumbai, Maharashtra",
      established: 1916,
      isAutonomousUniv: false,
      badge: "UGC / NAAC A",
      logoIcon: "school",
      collegesCount: 20
    },
    {
      id: "ycmou",
      name: "Yashwantrao Chavan Maharashtra Open University",
      shortName: "YCMOU",
      canonicalName: "YCMOU Nashik",
      type: "State Open University",
      location: "Nashik, Maharashtra",
      established: 1989,
      isAutonomousUniv: false,
      badge: "UGC / DEC Approved",
      logoIcon: "auto_stories",
      collegesCount: 50
    },
    {
      id: "dbatu",
      name: "Dr. Babasaheb Ambedkar Technological University",
      shortName: "DBATU",
      canonicalName: "DBATU Lonere",
      type: "State Public Technological University",
      location: "Lonere, Maharashtra",
      established: 1989,
      isAutonomousUniv: false,
      badge: "AICTE State Tech Univ",
      logoIcon: "engineering",
      collegesCount: 45
    },
    {
      id: "muhs",
      name: "Maharashtra University of Health Sciences",
      shortName: "MUHS",
      canonicalName: "MUHS Nashik",
      type: "State Public University",
      location: "Nashik, Maharashtra",
      established: 1998,
      isAutonomousUniv: false,
      badge: "State Medical Board",
      logoIcon: "medical_services",
      collegesCount: 15
    },
    {
      id: "mafsu",
      name: "Maharashtra Animal & Fishery Sciences University",
      shortName: "MAFSU",
      canonicalName: "MAFSU Nagpur",
      type: "State Public University",
      location: "Nagpur, Maharashtra",
      established: 2000,
      isAutonomousUniv: false,
      badge: "State Veterinary Board",
      logoIcon: "pets",
      collegesCount: 10
    }
  ];

  // ----------------------------------------------------
  // 2. COLLEGES & INSTITUTIONS (Categorized by Parent Univ & Autonomy)
  // ----------------------------------------------------
  const COLLEGES = [
    // --- AUTONOMOUS INSTITUTIONS (Mumbai University Parent) ---
    {
      id: "vit_wadala",
      name: "Vidyalankar Institute of Technology (VIT)",
      abbreviation: "VIT Wadala",
      code: "3139",
      universityId: "mu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Wadala (E), Mumbai",
      city: "Mumbai",
      badge: "NAAC A+ / Autonomous",
      rating: 4.8,
      coursesSupported: ["btech", "be", "mtech", "mca"]
    },
    {
      id: "vjti",
      name: "Veermata Jijabai Technological Institute (VJTI)",
      abbreviation: "VJTI",
      code: "3012",
      universityId: "mu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Matunga, Mumbai",
      city: "Mumbai",
      badge: "Govt. Autonomous / NIRF Top 100",
      rating: 4.9,
      coursesSupported: ["btech", "mtech", "mca"]
    },
    {
      id: "spce",
      name: "Sardar Patel College of Engineering (SPCE)",
      abbreviation: "SPCE",
      code: "3014",
      universityId: "mu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Andheri (W), Mumbai",
      city: "Mumbai",
      badge: "Govt. Aided Autonomous",
      rating: 4.8,
      coursesSupported: ["btech", "mtech"]
    },
    {
      id: "spit",
      name: "Sardar Patel Institute of Technology (SPIT)",
      abbreviation: "SPIT",
      code: "3215",
      universityId: "mu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Andheri (W), Mumbai",
      city: "Mumbai",
      badge: "Autonomous / Bharatiya Vidya Bhavan",
      rating: 4.9,
      coursesSupported: ["btech", "mtech", "mca"]
    },
    {
      id: "kjsce",
      name: "K. J. Somaiya College of Engineering",
      abbreviation: "KJSCE",
      code: "3135",
      universityId: "mu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Vidyavihar, Mumbai",
      city: "Mumbai",
      badge: "Somaiya Vidyavihar Univ / Autonomous",
      rating: 4.8,
      coursesSupported: ["btech", "mtech", "mca", "bca", "bsc_cs", "bsc_it"]
    },
    {
      id: "djsce",
      name: "Dwarkadas J. Sanghvi College of Engineering (DJSCE)",
      abbreviation: "DJSCE",
      code: "3199",
      universityId: "mu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Vile Parle (W), Mumbai",
      city: "Mumbai",
      badge: "SVKM / Autonomous",
      rating: 4.8,
      coursesSupported: ["btech", "mtech"]
    },
    {
      id: "tsec",
      name: "Thadomal Shahani Engineering College (TSEC)",
      abbreviation: "TSEC",
      code: "3182",
      universityId: "mu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Bandra (W), Mumbai",
      city: "Mumbai",
      badge: "HSNC Board / Autonomous",
      rating: 4.7,
      coursesSupported: ["btech", "be", "mtech"]
    },
    {
      id: "crce",
      name: "Fr. Conceicao Rodrigues College of Engineering (CRCE)",
      abbreviation: "CRCE Bandra",
      code: "3184",
      universityId: "mu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Bandstand, Bandra (W), Mumbai",
      city: "Mumbai",
      badge: "Agnel Charities / Autonomous",
      rating: 4.7,
      coursesSupported: ["btech", "mtech"]
    },
    {
      id: "sakec",
      name: "Shah & Anchor Kutchhi Engineering College (SAKEC)",
      abbreviation: "SAKEC",
      code: "3148",
      universityId: "mu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Chembur, Mumbai",
      city: "Mumbai",
      badge: "Autonomous / Mahavir Education",
      rating: 4.6,
      coursesSupported: ["btech", "mtech", "mca"]
    },
    {
      id: "atharva",
      name: "Atharva College of Engineering",
      abbreviation: "Atharva",
      code: "3203",
      universityId: "mu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Malad (W), Mumbai",
      city: "Mumbai",
      badge: "Autonomous / Malad",
      rating: 4.5,
      coursesSupported: ["btech", "be"]
    },
    {
      id: "saraswati",
      name: "Saraswati College of Engineering",
      abbreviation: "SCOE Kharghar",
      code: "3154",
      universityId: "mu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Kharghar, Navi Mumbai",
      city: "Navi Mumbai",
      badge: "Autonomous / NAAC B++",
      rating: 4.5,
      coursesSupported: ["btech", "be", "mtech"]
    },
    {
      id: "slrtce",
      name: "Shree L. R. Tiwari College of Engineering",
      abbreviation: "SLRTCE",
      code: "3423",
      universityId: "mu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Mira Road, Thane",
      city: "Thane",
      badge: "Autonomous / Rahul Education",
      rating: 4.4,
      coursesSupported: ["btech", "be"]
    },
    {
      id: "mpstme",
      name: "Mukesh Patel School of Technology Management (MPSTME)",
      abbreviation: "MPSTME",
      code: "NM-301",
      universityId: "mu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Juhu, Vile Parle, Mumbai",
      city: "Mumbai",
      badge: "NMIMS Deemed University",
      rating: 4.7,
      coursesSupported: ["btech", "mtech", "mca"]
    },

    // --- AFFILIATED COLLEGES (University of Mumbai) ---
    {
      id: "dmce",
      name: "Datta Meghe College of Engineering (DMCE)",
      abbreviation: "DMCE Airoli",
      code: "3187",
      universityId: "mu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Sector 3, Airoli, Navi Mumbai",
      city: "Navi Mumbai",
      badge: "NAAC Accredited / Mumbai Univ",
      rating: 4.6,
      coursesSupported: ["btech", "be", "mtech"]
    },
    {
      id: "apsit",
      name: "A. P. Shah Institute of Technology",
      abbreviation: "APSIT Thane",
      code: "3475",
      universityId: "mu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Kasarvadavali, Ghodbunder Rd, Thane",
      city: "Thane",
      badge: "NAAC A / MU Affiliated",
      rating: 4.5,
      coursesSupported: ["btech", "be"]
    },
    {
      id: "rgit",
      name: "Rajiv Gandhi Institute of Technology",
      abbreviation: "RGIT Andheri",
      code: "3135",
      universityId: "mu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Versova, Andheri (W), Mumbai",
      city: "Mumbai",
      badge: "MU Affiliated",
      rating: 4.5,
      coursesSupported: ["btech", "be", "mtech"]
    },
    {
      id: "xavier",
      name: "Xavier Institute of Engineering",
      abbreviation: "XIE Mahim",
      code: "3214",
      universityId: "mu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Mahim Causeway, Mumbai",
      city: "Mumbai",
      badge: "Jesuit Society / MU Affiliated",
      rating: 4.6,
      coursesSupported: ["btech", "be"]
    },
    {
      id: "rizvi",
      name: "Rizvi College of Engineering",
      abbreviation: "Rizvi Bandra",
      code: "3180",
      universityId: "mu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Carter Road, Bandra (W), Mumbai",
      city: "Mumbai",
      badge: "MU Affiliated",
      rating: 4.4,
      coursesSupported: ["btech", "be"]
    },
    {
      id: "terna",
      name: "Terna Engineering College",
      abbreviation: "Terna Nerul",
      code: "3190",
      universityId: "mu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Sector 22, Nerul, Navi Mumbai",
      city: "Navi Mumbai",
      badge: "NAAC Accredited / MU",
      rating: 4.5,
      coursesSupported: ["btech", "be", "mtech"]
    },
    {
      id: "dbit",
      name: "Don Bosco Institute of Technology (DBIT)",
      abbreviation: "DBIT Kurla",
      code: "3208",
      universityId: "mu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Premier Automobiles Rd, Kurla (W), Mumbai",
      city: "Mumbai",
      badge: "Don Bosco Society / MU",
      rating: 4.6,
      coursesSupported: ["btech", "be"]
    },
    {
      id: "pillai",
      name: "Pillai College of Engineering (PCE)",
      abbreviation: "PCE Panvel",
      code: "3207",
      universityId: "mu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Dr. K. M. Vasudevan Pillai Campus, Panvel",
      city: "Navi Mumbai",
      badge: "NAAC A+ / MU Affiliated",
      rating: 4.7,
      coursesSupported: ["btech", "be", "mtech"]
    },
    {
      id: "bvcoe",
      name: "Bharati Vidyapeeth College of Engineering",
      abbreviation: "BVCOE Belapur",
      code: "3189",
      universityId: "mu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Sector 7, CBD Belapur, Navi Mumbai",
      city: "Navi Mumbai",
      badge: "MU Affiliated / NAAC A",
      rating: 4.5,
      coursesSupported: ["btech", "be", "mtech"]
    },
    {
      id: "sfit",
      name: "St. Francis Institute of Technology (SFIT)",
      abbreviation: "SFIT Borivali",
      code: "3204",
      universityId: "mu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Mount Poinsur, Borivali (W), Mumbai",
      city: "Mumbai",
      badge: "NAAC A / MU Affiliated",
      rating: 4.6,
      coursesSupported: ["btech", "be", "mtech"]
    },
    {
      id: "ltce",
      name: "Lokmanya Tilak College of Engineering (LTCE)",
      abbreviation: "LTCE Navi Mumbai",
      code: "3196",
      universityId: "mu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Sector 4, Koparkhairane, Navi Mumbai",
      city: "Navi Mumbai",
      badge: "MU Affiliated",
      rating: 4.4,
      coursesSupported: ["btech", "be", "mtech"]
    },
    {
      id: "mhssce",
      name: "M. H. Saboo Siddik College of Engineering",
      abbreviation: "Saboo Siddik Byculla",
      code: "3183",
      universityId: "mu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "8 Shepard Road, Byculla, Mumbai",
      city: "Mumbai",
      badge: "Anjuman-I-Islam / MU",
      rating: 4.5,
      coursesSupported: ["btech", "be"]
    },
    {
      id: "ucoe",
      name: "Universal College of Engineering",
      abbreviation: "UCoE Kaman",
      code: "3460",
      universityId: "mu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Kaman-Bhiwandi Rd, Vasai, Palghar",
      city: "Palghar",
      badge: "MU Affiliated",
      rating: 4.3,
      coursesSupported: ["btech", "be"]
    },
    {
      id: "gmvit",
      name: "G. M. Vedak Institute of Technology",
      abbreviation: "GMVIT Tala",
      code: "3447",
      universityId: "mu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Tala, Mangaon, Raigad",
      city: "Raigad",
      badge: "MU Affiliated",
      rating: 4.2,
      coursesSupported: ["btech", "be"]
    },
    {
      id: "famt",
      name: "Finolex Academy of Management and Technology",
      abbreviation: "FAMT Ratnagiri",
      code: "3200",
      universityId: "mu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "MIDC Mirjole, Ratnagiri",
      city: "Ratnagiri",
      badge: "NAAC A / MU Affiliated",
      rating: 4.5,
      coursesSupported: ["btech", "be", "mtech", "mca"]
    },
    {
      id: "dilkap",
      name: "Dilkap College of Engineering and Polytechnic",
      abbreviation: "Dilkap Neral",
      code: "3462",
      universityId: "mu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Mamdapur, Neral, Karjat",
      city: "Raigad",
      badge: "MU Affiliated",
      rating: 4.2,
      coursesSupported: ["btech", "be"]
    },
    {
      id: "tcet",
      name: "Thakur College of Engineering and Technology (TCET)",
      abbreviation: "TCET Kandivali",
      code: "3176",
      universityId: "mu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Thakur Village, Kandivali (E), Mumbai",
      city: "Mumbai",
      badge: "Autonomous / NAAC A",
      rating: 4.7,
      coursesSupported: ["btech", "mtech"]
    },
    {
      id: "vesit",
      name: "Vivekanand Education Society's Institute of Tech (VESIT)",
      abbreviation: "VESIT Chembur",
      code: "3185",
      universityId: "mu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Collector's Colony, Chembur, Mumbai",
      city: "Mumbai",
      badge: "Autonomous / VES Trust",
      rating: 4.8,
      coursesSupported: ["btech", "mtech", "mca"]
    },

    // --- AUTONOMOUS INSTITUTIONS (SPPU Parent) ---
    {
      id: "vit_pune",
      name: "Vishwakarma Institute of Technology (VIT Pune)",
      abbreviation: "VIT Pune",
      code: "6273",
      universityId: "sppu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Bibwewadi, Pune",
      city: "Pune",
      badge: "Autonomous / Bansilal Ramnath",
      rating: 4.8,
      coursesSupported: ["btech", "mtech", "mca"]
    },
    {
      id: "viit_pune",
      name: "Vishwakarma Institute of Information Tech (VIIT)",
      abbreviation: "VIIT Pune",
      code: "6283",
      universityId: "sppu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Kondhwa (Bk), Pune",
      city: "Pune",
      badge: "Autonomous / NAAC A+",
      rating: 4.7,
      coursesSupported: ["btech", "mtech", "mca"]
    },
    {
      id: "pccoe",
      name: "Pimpri Chinchwad College of Engineering (PCCOE)",
      abbreviation: "PCCOE Nigdi",
      code: "6175",
      universityId: "sppu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Sector 26, Pradhikaran, Nigdi, Pune",
      city: "Pune",
      badge: "Autonomous / PCET",
      rating: 4.8,
      coursesSupported: ["btech", "mtech", "mca"]
    },
    {
      id: "mitaoe",
      name: "MIT Academy of Engineering (MITAOE)",
      abbreviation: "MITAOE Alandi",
      code: "6146",
      universityId: "sppu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Dehu Phata, Alandi, Pune",
      city: "Pune",
      badge: "Autonomous / MAEER",
      rating: 4.7,
      coursesSupported: ["btech", "mtech"]
    },
    {
      id: "cummins_pune",
      name: "MKSSS Cummins College of Engineering for Women",
      abbreviation: "Cummins Pune",
      code: "6276",
      universityId: "sppu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Karvenagar, Pune",
      city: "Pune",
      badge: "Autonomous / MKSSS Trust",
      rating: 4.8,
      coursesSupported: ["btech", "mtech"]
    },
    {
      id: "pict",
      name: "Pune Institute of Computer Technology (PICT)",
      abbreviation: "PICT Pune",
      code: "6207",
      universityId: "sppu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Dhankawadi, Pune",
      city: "Pune",
      badge: "Premier CS/IT / Autonomous",
      rating: 4.9,
      coursesSupported: ["btech", "mtech"]
    },
    {
      id: "ghrcem_pune",
      name: "G. H. Raisoni College of Engineering and Management",
      abbreviation: "GHRCEM Wagholi",
      code: "6155",
      universityId: "sppu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Wagholi, Pune",
      city: "Pune",
      badge: "Autonomous / Raisoni Group",
      rating: 4.6,
      coursesSupported: ["btech", "mtech", "mca"]
    },
    {
      id: "ghriet_pune",
      name: "G. H. Raisoni Institute of Engineering and Technology",
      abbreviation: "GHRIET Wagholi",
      code: "6224",
      universityId: "sppu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Wagholi, Pune",
      city: "Pune",
      badge: "Autonomous / Raisoni",
      rating: 4.5,
      coursesSupported: ["btech", "mtech"]
    },
    {
      id: "jspm_rscoe",
      name: "JSPM's Rajarshi Shahu College of Engineering",
      abbreviation: "RSCOE Tathawade",
      code: "6179",
      universityId: "sppu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Tathawade, Pimpri-Chinchwad, Pune",
      city: "Pune",
      badge: "Autonomous / JSPM",
      rating: 4.6,
      coursesSupported: ["btech", "mtech", "mca"]
    },
    {
      id: "sanjivani",
      name: "Sanjivani College of Engineering",
      abbreviation: "Sanjivani Kopargaon",
      code: "5160",
      universityId: "sppu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Kopargaon, Ahmednagar",
      city: "Ahmednagar",
      badge: "Autonomous / NAAC A",
      rating: 4.6,
      coursesSupported: ["btech", "mtech", "mca"]
    },
    {
      id: "kkwagh",
      name: "K. K. Wagh Institute of Engineering Education & Research",
      abbreviation: "KK Wagh Nashik",
      code: "5121",
      universityId: "sppu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Hirabai Haridas Vidyanagari, Amrutdham, Nashik",
      city: "Nashik",
      badge: "Autonomous / NAAC A",
      rating: 4.7,
      coursesSupported: ["btech", "mtech", "mca"]
    },
    {
      id: "gcoear_avasari",
      name: "Government College of Engineering & Research, Avasari",
      abbreviation: "GCOEAR Avasari",
      code: "6004",
      universityId: "sppu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Avasari Khurd, Ambegaon, Pune",
      city: "Pune",
      badge: "Govt. Autonomous / SPPU",
      rating: 4.6,
      coursesSupported: ["btech"]
    },

    // --- AFFILIATED COLLEGES (SPPU Pune) ---
    {
      id: "aissms",
      name: "AISSMS College of Engineering",
      abbreviation: "AISSMS Pune",
      code: "6278",
      universityId: "sppu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "1 Kennedy Road, Near RTO, Shivajinagar, Pune",
      city: "Pune",
      badge: "Historic / NAAC A+",
      rating: 4.6,
      coursesSupported: ["btech", "be", "mtech"]
    },
    {
      id: "dyp_akurdi",
      name: "D. Y. Patil College of Engineering, Akurdi",
      abbreviation: "DYP Akurdi",
      code: "6272",
      universityId: "sppu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Sector 29, Nigdi Pradhikaran, Akurdi, Pune",
      city: "Pune",
      badge: "D.Y. Patil Pratishthan / SPPU",
      rating: 4.6,
      coursesSupported: ["btech", "be", "mtech"]
    },
    {
      id: "icem",
      name: "Indira College of Engineering and Management",
      abbreviation: "ICEM Parandwadi",
      code: "6145",
      universityId: "sppu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Parandwadi, Maval, Pune",
      city: "Pune",
      badge: "Indira Group / SPPU",
      rating: 4.5,
      coursesSupported: ["btech", "be", "mtech", "mca"]
    },
    {
      id: "scoe_sinhgad",
      name: "Sinhgad College of Engineering (SCOE)",
      abbreviation: "SCOE Vadgaon",
      code: "6178",
      universityId: "sppu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "44/1 Vadgaon (Bk), Off Sinhgad Rd, Pune",
      city: "Pune",
      badge: "STES / SPPU Affiliated",
      rating: 4.5,
      coursesSupported: ["btech", "be", "mtech"]
    },
    {
      id: "saoe_sinhgad",
      name: "Sinhgad Academy of Engineering",
      abbreviation: "SAOE Kondhwa",
      code: "6187",
      universityId: "sppu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Kondhwa (Saswad Rd), Pune",
      city: "Pune",
      badge: "STES / SPPU",
      rating: 4.4,
      coursesSupported: ["btech", "be"]
    },
    {
      id: "mescoe",
      name: "Modern Education Society's College of Engineering",
      abbreviation: "MESCOE Pune",
      code: "6281",
      universityId: "sppu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "19 Late V. K. Joag Path, Wadia College Campus, Pune",
      city: "Pune",
      badge: "MES / SPPU Affiliated",
      rating: 4.5,
      coursesSupported: ["btech", "be", "mtech"]
    },
    {
      id: "trinity_pune",
      name: "Trinity College of Engineering and Research",
      abbreviation: "Trinity Yewalewadi",
      code: "6184",
      universityId: "sppu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Near Bopdev Ghat, Yewalewadi, Pune",
      city: "Pune",
      badge: "KJ's Educational / SPPU",
      rating: 4.3,
      coursesSupported: ["btech", "be"]
    },
    {
      id: "zeal_pune",
      name: "Zeal College of Engineering and Research",
      abbreviation: "Zeal Narhe",
      code: "6298",
      universityId: "sppu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Survey No. 39, Narhe, Pune",
      city: "Pune",
      badge: "NAAC A / SPPU Affiliated",
      rating: 4.4,
      coursesSupported: ["btech", "be", "mtech"]
    },
    {
      id: "jspm_icoer",
      name: "JSPM's Imperial College of Engineering and Research",
      abbreviation: "ICOER Wagholi",
      code: "6160",
      universityId: "sppu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Gat No. 720, Pune-Nagar Rd, Wagholi, Pune",
      city: "Pune",
      badge: "JSPM / SPPU",
      rating: 4.4,
      coursesSupported: ["btech", "be", "mtech"]
    },
    {
      id: "pdea_manjari",
      name: "PDEA's College of Engineering, Manjari",
      abbreviation: "PDEA Manjari",
      code: "6206",
      universityId: "sppu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Manjari (Bk), Hadapsar, Pune",
      city: "Pune",
      badge: "PDEA / SPPU",
      rating: 4.3,
      coursesSupported: ["btech", "be"]
    },
    {
      id: "dypit_pimpri",
      name: "Dr. D. Y. Patil Institute of Technology",
      abbreviation: "DYPIT Pimpri",
      code: "6277",
      universityId: "sppu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Sant Tukaram Nagar, Pimpri, Pune",
      city: "Pune",
      badge: "NAAC A / SPPU",
      rating: 4.6,
      coursesSupported: ["btech", "be", "mtech"]
    },
    {
      id: "pccoer_ravet",
      name: "Pimpri Chinchwad College of Engineering & Research",
      abbreviation: "PCCOER Ravet",
      code: "6822",
      universityId: "sppu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Plot No. B, Sector No. 110, Gate No. 1, Ravet, Pune",
      city: "Pune",
      badge: "PCET / SPPU",
      rating: 4.5,
      coursesSupported: ["btech", "be"]
    },
    {
      id: "isbm_pune",
      name: "ISBM College of Engineering",
      abbreviation: "ISBM Nande",
      code: "6622",
      universityId: "sppu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "S. No. 242/1, Nande Village, Pashan Sus Rd, Pune",
      city: "Pune",
      badge: "SPPU Affiliated",
      rating: 4.3,
      coursesSupported: ["btech", "be"]
    },
    {
      id: "moze_pune",
      name: "Genba Sopanrao Moze College of Engineering",
      abbreviation: "GSMCOE Balewadi",
      code: "6228",
      universityId: "sppu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Survey No. 25/1/1, Balewadi, Pune",
      city: "Pune",
      badge: "SPPU Affiliated",
      rating: 4.2,
      coursesSupported: ["btech", "be", "mtech"]
    },
    {
      id: "alard_pune",
      name: "Alard College of Engineering and Management",
      abbreviation: "Alard Hinjewadi",
      code: "6325",
      universityId: "sppu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Near Rajiv Gandhi Infotech Park, Hinjewadi, Pune",
      city: "Pune",
      badge: "SPPU Affiliated",
      rating: 4.3,
      coursesSupported: ["btech", "be", "mtech", "mca"]
    },
    {
      id: "alameen_pune",
      name: "Al-Ameen Educational and Medical Foundation COET",
      abbreviation: "Al-Ameen Koregaon",
      code: "6640",
      universityId: "sppu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Koregaon Bhima, Tal. Shirur, Pune",
      city: "Pune",
      badge: "SPPU Affiliated",
      rating: 4.1,
      coursesSupported: ["btech", "be"]
    },

    // --- SHIVAJI UNIVERSITY (Kolhapur / Sangli / Satara) ---
    {
      id: "walchand",
      name: "Walchand College of Engineering (WCE)",
      abbreviation: "WCE Sangli",
      code: "6268",
      universityId: "suk",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Vishrambag, Sangli",
      city: "Sangli",
      badge: "Govt. Aided Autonomous / Tier-1",
      rating: 4.9,
      coursesSupported: ["btech", "mtech"]
    },
    {
      id: "gce_karad",
      name: "Government College of Engineering, Karad",
      abbreviation: "GCE Karad",
      code: "6005",
      universityId: "suk",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Vidyanagar, Karad, Satara",
      city: "Karad",
      badge: "Govt. Autonomous / SUK",
      rating: 4.8,
      coursesSupported: ["btech", "mtech", "mca"]
    },
    {
      id: "dkte",
      name: "DKTE Society's Textile and Engineering Institute",
      abbreviation: "DKTE Ichalkaranji",
      code: "6222",
      universityId: "suk",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Rajwada, Ichalkaranji, Kolhapur",
      city: "Ichalkaranji",
      badge: "Autonomous / NAAC A+",
      rating: 4.7,
      coursesSupported: ["btech", "mtech"]
    },
    {
      id: "kit_kolhapur",
      name: "KIT's College of Engineering (Autonomous)",
      abbreviation: "KIT Kolhapur",
      code: "6267",
      universityId: "suk",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Gokul Shirgaon, Kolhapur",
      city: "Kolhapur",
      badge: "Autonomous / NAAC A",
      rating: 4.6,
      coursesSupported: ["btech", "mtech"]
    },
    {
      id: "bvcoek_kolhapur",
      name: "Bharati Vidyapeeth's College of Engineering",
      abbreviation: "BVCOE Kolhapur",
      code: "6288",
      universityId: "suk",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Near Chitranagari, Morewadi, Kolhapur",
      city: "Kolhapur",
      badge: "SUK Affiliated",
      rating: 4.4,
      coursesSupported: ["btech", "be"]
    },

    // --- RTMNU NAGPUR ---
    {
      id: "ycce",
      name: "Yeshwantrao Chavan College of Engineering (YCCE)",
      abbreviation: "YCCE Nagpur",
      code: "4118",
      universityId: "rtmnu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Hingna Road, Wanadongri, Nagpur",
      city: "Nagpur",
      badge: "Autonomous / Meghe Group",
      rating: 4.8,
      coursesSupported: ["btech", "mtech", "mca"]
    },
    {
      id: "rcoem",
      name: "Shri Ramdeobaba College of Engineering (RCOEM / RBU)",
      abbreviation: "RCOEM Nagpur",
      code: "4115",
      universityId: "rtmnu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Katol Road, Gittikhadan, Nagpur",
      city: "Nagpur",
      badge: "Ramdeobaba University / Autonomous",
      rating: 4.9,
      coursesSupported: ["btech", "mtech", "mca"]
    },
    {
      id: "ghraisoni",
      name: "G. H. Raisoni College of Engineering (GHRCE)",
      abbreviation: "GHRCE Nagpur",
      code: "4116",
      universityId: "rtmnu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "CRPF Digdoh Hills, Hingna Rd, Nagpur",
      city: "Nagpur",
      badge: "Autonomous / Raisoni Group",
      rating: 4.7,
      coursesSupported: ["btech", "mtech", "mca"]
    },
    {
      id: "priyadarshini",
      name: "Priyadarshini College of Engineering",
      abbreviation: "PCE Nagpur",
      code: "4123",
      universityId: "rtmnu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Hingna Road, Digdoh Hills, Nagpur",
      city: "Nagpur",
      badge: "LTJSS / RTMNU Affiliated",
      rating: 4.5,
      coursesSupported: ["btech", "be", "mtech"]
    },
    {
      id: "pallotti_nagpur",
      name: "St. Vincent Pallotti College of Engineering & Tech",
      abbreviation: "SVPCET Nagpur",
      code: "4174",
      universityId: "rtmnu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Gavsi Manapur, Wardha Road, Nagpur",
      city: "Nagpur",
      badge: "NAAC A / RTMNU",
      rating: 4.5,
      coursesSupported: ["btech", "be"]
    },

    // --- BAMU (Chhatrapati Sambhajinagar) ---
    {
      id: "gce_aurangabad",
      name: "Government College of Engineering, Chhatrapati Sambhajinagar",
      abbreviation: "GECA Sambhajinagar",
      code: "2008",
      universityId: "bamu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Station Road, Chhatrapati Sambhajinagar",
      city: "Chhatrapati Sambhajinagar",
      badge: "Govt. Autonomous / BAMU",
      rating: 4.8,
      coursesSupported: ["btech", "mtech", "mca"]
    },
    {
      id: "jnec_sambhajinagar",
      name: "Jawaharlal Nehru Engineering College (JNEC)",
      abbreviation: "JNEC Sambhajinagar",
      code: "2007",
      universityId: "bamu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "MGM Campus, N-6, CIDCO, Sambhajinagar",
      city: "Chhatrapati Sambhajinagar",
      badge: "MGM University / Autonomous",
      rating: 4.7,
      coursesSupported: ["btech", "mtech", "mca", "bca"]
    },

    // --- SGBAU (Amravati) ---
    {
      id: "gce_amravati",
      name: "Government College of Engineering, Amravati",
      abbreviation: "GCE Amravati",
      code: "1002",
      universityId: "sgbau",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Kathora Naka, VMV Road, Amravati",
      city: "Amravati",
      badge: "Govt. Autonomous / SGBAU",
      rating: 4.7,
      coursesSupported: ["btech", "mtech"]
    },
    {
      id: "prmitr_badnera",
      name: "Prof. Ram Meghe Institute of Technology & Research",
      abbreviation: "PRMITR Badnera",
      code: "1105",
      universityId: "sgbau",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Anjangaon Bari Road, Badnera, Amravati",
      city: "Amravati",
      badge: "NAAC A / SGBAU",
      rating: 4.5,
      coursesSupported: ["btech", "be", "mtech", "mca"]
    },

    // --- KBC NMU (Jalgaon) ---
    {
      id: "gce_jalgaon",
      name: "Government College of Engineering, Jalgaon",
      abbreviation: "GCE Jalgaon",
      code: "1011",
      universityId: "kbcnmu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "National Highway 6, Jalgaon",
      city: "Jalgaon",
      badge: "Govt. Autonomous / KBCNMU",
      rating: 4.6,
      coursesSupported: ["btech"]
    },
    {
      id: "ssbt_jalgaon",
      name: "SSBT's College of Engineering & Technology",
      abbreviation: "SSBT Bambhori",
      code: "5104",
      universityId: "kbcnmu",
      isAutonomous: false,
      category: "Affiliated College",
      location: "Bambhori, Post Box No. 94, Jalgaon",
      city: "Jalgaon",
      badge: "NAAC A / KBCNMU",
      rating: 4.5,
      coursesSupported: ["btech", "be", "mtech", "mca"]
    },

    // --- SRTMUN (Nanded) ---
    {
      id: "sggsiet",
      name: "Shri Guru Gobind Singhji Institute of Engg & Tech (SGGSIE&T)",
      abbreviation: "SGGSIE&T Nanded",
      code: "2020",
      universityId: "bamu",
      isAutonomous: true,
      category: "Autonomous Institution",
      location: "Vishnupuri, Nanded",
      city: "Nanded",
      badge: "Govt. Aided Autonomous / Tier-1",
      rating: 4.8,
      coursesSupported: ["btech", "mtech"]
    }
  ];

  // ----------------------------------------------------
  // 3. DEGREE PROGRAMS / COURSES & BRANCHES
  // ----------------------------------------------------
  const COURSES = [
    { id: "btech", name: "Bachelor of Technology (B.Tech)", duration: "4 Years", semesters: 8, category: "engineering" },
    { id: "be", name: "Bachelor of Engineering (B.E.)", duration: "4 Years", semesters: 8, category: "engineering" },
    { id: "bca", name: "Bachelor of Computer Applications (BCA)", duration: "3 Years", semesters: 6, category: "computing" },
    { id: "bsc_cs", name: "B.Sc. Computer Science", duration: "3 Years", semesters: 6, category: "computing" },
    { id: "bsc_it", name: "B.Sc. Information Technology", duration: "3 Years", semesters: 6, category: "computing" },
    { id: "bba", name: "Bachelor of Business Administration (BBA)", duration: "3 Years", semesters: 6, category: "management" },
    { id: "bcom", name: "Bachelor of Commerce (B.Com)", duration: "3 Years", semesters: 6, category: "commerce" },
    { id: "mca", name: "Master of Computer Applications (MCA)", duration: "2 Years", semesters: 4, category: "computing_pg" },
    { id: "mtech", name: "Master of Technology (M.Tech)", duration: "2 Years", semesters: 4, category: "engineering_pg" },
    { id: "msc_cs", name: "M.Sc. Computer Science", duration: "2 Years", semesters: 4, category: "computing_pg" },
    { id: "msc_it", name: "M.Sc. Information Technology", duration: "2 Years", semesters: 4, category: "computing_pg" }
  ];

  // 24 Engineering Branches + Non-Engineering Specializations
  const BRANCHES = [
    // Core Engineering Disciplines
    { id: "ce", name: "Computer Engineering", short: "Comp Engg", code: "CE", category: "engineering", icon: "computer" },
    { id: "it", name: "Information Technology", short: "IT", code: "IT", category: "engineering", icon: "terminal" },
    { id: "aids", name: "Artificial Intelligence & Data Science", short: "AI & DS", code: "AIDS", category: "engineering", icon: "psychology" },
    { id: "aiml", name: "Artificial Intelligence & Machine Learning", short: "AI & ML", code: "AIML", category: "engineering", icon: "smart_toy" },
    { id: "ds", name: "Data Science", short: "Data Science", code: "DS", category: "engineering", icon: "insights" },
    { id: "cse", name: "Computer Science & Engineering", short: "CSE", code: "CSE", category: "engineering", icon: "laptop_chromebook" },
    { id: "cse_aiml", name: "CSE (Artificial Intelligence & ML)", short: "CSE AI/ML", code: "CS-AI", category: "engineering", icon: "psychology_alt" },
    { id: "cse_ds", name: "CSE (Data Science)", short: "CSE Data Sci", code: "CS-DS", category: "engineering", icon: "query_stats" },
    { id: "extc", name: "Electronics & Telecommunication", short: "EXTC", code: "EXTC", category: "engineering", icon: "settings_input_antenna" },
    { id: "etx", name: "Electronics Engineering", short: "Electronics", code: "ETX", category: "engineering", icon: "memory" },
    { id: "ee", name: "Electrical Engineering", short: "Electrical", code: "EE", category: "engineering", icon: "bolt" },
    { id: "me", name: "Mechanical Engineering", short: "Mechanical", code: "ME", category: "engineering", icon: "precision_manufacturing" },
    { id: "civil", name: "Civil Engineering", short: "Civil", code: "CIVIL", category: "engineering", icon: "architecture" },
    { id: "chem", name: "Chemical Engineering", short: "Chemical", code: "CHEM", category: "engineering", icon: "science" },
    { id: "auto", name: "Automobile Engineering", short: "Automobile", code: "AUTO", category: "engineering", icon: "directions_car" },
    { id: "inst", name: "Instrumentation Engineering", short: "Instrumentation", code: "INST", category: "engineering", icon: "speed" },
    { id: "prod", name: "Production Engineering", short: "Production", code: "PROD", category: "engineering", icon: "factory" },
    { id: "robotics", name: "Robotics & Automation", short: "Robotics", code: "ROBOT", category: "engineering", icon: "precision_manufacturing" },
    { id: "biomed", name: "Biomedical Engineering", short: "Biomedical", code: "BIOMED", category: "engineering", icon: "monitor_heart" },
    { id: "biotech", name: "Biotechnology", short: "Biotech", code: "BIOTECH", category: "engineering", icon: "biotech" },
    { id: "aero", name: "Aerospace Engineering", short: "Aerospace", code: "AERO", category: "engineering", icon: "flight" },
    { id: "mechatronics", name: "Mechatronics Engineering", short: "Mechatronics", code: "MECHAT", category: "engineering", icon: "hardware" },
    { id: "iot", name: "Internet of Things (IoT)", short: "IoT", code: "IOT", category: "engineering", icon: "sensors" },
    { id: "cyber", name: "Cyber Security", short: "Cyber Sec", code: "CYBER", category: "engineering", icon: "security" },

    // Management Tracks (BBA)
    { id: "fin_mgmt", name: "Financial Management", short: "Finance", code: "FIN", category: "management", icon: "payments" },
    { id: "mktg_mgmt", name: "Marketing & Digital Strategy", short: "Marketing", code: "MKTG", category: "management", icon: "campaign" },
    { id: "biz_analytics", name: "Business Analytics", short: "Analytics", code: "BA", category: "management", icon: "analytics" },
    { id: "hr_mgmt", name: "Human Resource Management", short: "HR", code: "HR", category: "management", icon: "badge" },

    // Commerce Tracks (B.Com)
    { id: "acc_fin", name: "Accounting & Finance (BAF)", short: "Accounting", code: "BAF", category: "commerce", icon: "receipt_long" },
    { id: "bank_ins", name: "Banking & Insurance (BBI)", short: "Banking", code: "BBI", category: "commerce", icon: "account_balance" },
    { id: "fin_markets", name: "Financial Markets (BFM)", short: "Fin Markets", code: "BFM", category: "commerce", icon: "trending_up" },

    // Computing Tracks (BCA / B.Sc CS / B.Sc IT)
    { id: "app_dev", name: "Application Development Track", short: "App Dev", code: "DEV", category: "computing", icon: "code" },
    { id: "cloud_web", name: "Cloud Computing & Web Tech", short: "Cloud Web", code: "CLOUD", category: "computing", icon: "cloud" },
    { id: "data_analytics", name: "Data Science & Big Data", short: "Data Analytics", code: "DATA", category: "computing", icon: "pie_chart" },
    { id: "cyber_ops", name: "Cyber Security & Forensics", short: "Cyber Ops", code: "SEC", category: "computing", icon: "shield" }
  ];

  // ----------------------------------------------------
  // 3B. ACADEMIC STREAM SUBJECT CATALOGS (Single Source of Truth)
  // ----------------------------------------------------
  const STREAM_SUBJECTS = {
    "engineering": [
      "Engineering Mathematics",
      "Engineering Physics",
      "Engineering Chemistry",
      "Engineering Mechanics",
      "Basic Electrical Engineering",
      "Basic Electronics Engineering",
      "Engineering Graphics",
      "Programming for Problem Solving",
      "Object-Oriented Programming",
      "Data Structures",
      "Discrete Mathematics",
      "Digital Logic Design",
      "Database Management Systems",
      "Computer Organization and Architecture",
      "Operating Systems",
      "Computer Networks",
      "Design and Analysis of Algorithms",
      "Software Engineering",
      "Theory of Computation",
      "Compiler Design",
      "Artificial Intelligence",
      "Machine Learning",
      "Web Technology",
      "Information Security",
      "Cloud Computing"
    ],
    "medical": [
      "Anatomy",
      "Physiology",
      "Biochemistry",
      "Pathology",
      "Pharmacology",
      "Microbiology",
      "Forensic Medicine",
      "Community Medicine",
      "General Medicine",
      "General Surgery",
      "Obstetrics and Gynaecology",
      "Pediatrics",
      "Ophthalmology",
      "Otorhinolaryngology",
      "Orthopedics"
    ],
    "commerce": [
      "Financial Accounting",
      "Business Economics",
      "Business Law",
      "Business Mathematics",
      "Business Statistics",
      "Cost Accounting",
      "Corporate Accounting",
      "Management Accounting",
      "Financial Management",
      "Income Tax",
      "Auditing",
      "Business Management",
      "Marketing Management",
      "Banking and Insurance",
      "Entrepreneurship Development"
    ],
    "arts": [
      "English Literature",
      "History",
      "Political Science",
      "Sociology",
      "Psychology",
      "Economics",
      "Philosophy",
      "Geography",
      "Marathi Literature",
      "Hindi Literature",
      "Sanskrit",
      "Public Administration",
      "Education",
      "Journalism and Mass Communication",
      "Linguistics"
    ]
  };

  // ----------------------------------------------------
  // 4. DETAILED SUBJECTS & CURRICULUM CATALOG
  // ----------------------------------------------------
  const SUBJECTS_CATALOG = {
    // Computer Engineering (CE) - Semesters 1 to 8
    "ce": {
      1: [
        { code: "FEC101", name: "Engineering Mathematics I", short: "Maths I", isCore: true, units: 5, hours: 48, status: "completed", progress: 100, isFeatured: true, badge: "Foundation", color: "primary" },
        { code: "FEC102", name: "Engineering Physics", short: "Physics", isCore: true, units: 4, hours: 36, status: "completed", progress: 95, isFeatured: true, badge: "Basic Science", color: "secondary" },
        { code: "FEC103", name: "Engineering Chemistry", short: "Chemistry", isCore: true, units: 4, hours: 36, status: "completed", progress: 90, isFeatured: true, badge: "Basic Science", color: "tertiary" },
        { code: "FEC104", name: "Engineering Mechanics", short: "Mechanics", isCore: true, units: 5, hours: 48, status: "completed", progress: 88, isFeatured: true, badge: "Core Engineering", color: "primary" },
        { code: "FEC105", name: "Basic Electrical Engineering", short: "BEE", isCore: true, units: 5, hours: 48, status: "completed", progress: 92, isFeatured: true, badge: "Core Engineering", color: "secondary" },
        { code: "FEC106", name: "Programming Fundamentals", short: "Programming", isCore: false, units: 5, hours: 50, status: "completed", progress: 98, isFeatured: true, badge: "High Scoring", color: "primary" },
        { code: "FEC107", name: "Engineering Graphics", short: "Graphics", isCore: false, units: 4, hours: 40, status: "completed", progress: 85, isFeatured: false, badge: "Practical Lab", color: "surface-variant" },
        { code: "FEC108", name: "Communication Skills", short: "Comm Skills", isCore: false, units: 3, hours: 30, status: "completed", progress: 95, isFeatured: false, badge: "Soft Skills", color: "surface-variant" },
        { code: "FEC109", name: "Environmental Studies", short: "EVS", isCore: false, units: 2, hours: 24, status: "completed", progress: 100, isFeatured: false, badge: "Mandatory Audit", color: "surface-variant" }
      ],
      2: [
        { code: "FEC201", name: "Engineering Mathematics II", short: "Maths II", isCore: true, units: 5, hours: 48, status: "completed", progress: 92, isFeatured: true, badge: "Foundation", color: "primary" },
        { code: "FEC202", name: "Applied Physics", short: "Applied Physics", isCore: true, units: 4, hours: 36, status: "completed", progress: 88, isFeatured: true, badge: "Basic Science", color: "secondary" },
        { code: "FEC203", name: "Applied Chemistry", short: "Applied Chem", isCore: true, units: 4, hours: 36, status: "completed", progress: 85, isFeatured: true, badge: "Basic Science", color: "tertiary" },
        { code: "FEC204", name: "Basic Electronics Engineering", short: "Electronics", isCore: true, units: 4, hours: 42, status: "completed", progress: 90, isFeatured: true, badge: "Core Engineering", color: "primary" },
        { code: "FEC205", name: "Engineering Workshop", short: "Workshop", isCore: false, units: 3, hours: 32, status: "completed", progress: 95, isFeatured: false, badge: "Hands-on Lab", color: "surface-variant" },
        { code: "FEC206", name: "Object-Oriented Programming", short: "OOP", isCore: true, units: 5, hours: 52, status: "completed", progress: 96, isFeatured: true, badge: "Core Coding", color: "primary" },
        { code: "FEC207", name: "Communication Skills", short: "Comm Skills II", isCore: false, units: 3, hours: 30, status: "completed", progress: 90, isFeatured: false, badge: "Soft Skills", color: "surface-variant" },
        { code: "FEC208", name: "Engineering Graphics", short: "Graphics II", isCore: false, units: 4, hours: 40, status: "completed", progress: 88, isFeatured: false, badge: "Practical Lab", color: "surface-variant" },
        { code: "FEC209", name: "Professional Skills", short: "Prof Skills", isCore: false, units: 2, hours: 24, status: "completed", progress: 92, isFeatured: false, badge: "Humanities", color: "surface-variant" }
      ],
      3: [
        { code: "CSC301", name: "Engineering Mathematics III", short: "Maths III", isCore: true, units: 5, hours: 48, status: "completed", progress: 90, isFeatured: true, badge: "Mathematics", color: "primary" },
        { code: "CSC302", name: "Data Structures", short: "Data Structures", isCore: true, units: 5, hours: 56, status: "completed", progress: 88, isFeatured: true, badge: "Coding Foundation", color: "primary" },
        { code: "CSC303", name: "Digital Logic Design", short: "DLD", isCore: true, units: 4, hours: 44, status: "completed", progress: 82, isFeatured: true, badge: "Digital Hardware", color: "secondary" },
        { code: "CSC304", name: "Computer Organization & Architecture", short: "COA", isCore: true, units: 5, hours: 48, status: "completed", progress: 80, isFeatured: true, badge: "Architecture", color: "tertiary" },
        { code: "CSC305", name: "Database Management Systems", short: "DBMS", isCore: true, units: 5, hours: 50, status: "completed", progress: 85, isFeatured: true, badge: "High Demand", color: "primary" },
        { code: "CSC306", name: "Object-Oriented Programming", short: "OOP", isCore: false, units: 4, hours: 42, status: "completed", progress: 85, isFeatured: false, badge: "Programming", color: "primary-container" },
        { code: "CSC307", name: "Discrete Mathematics", short: "Discrete Maths", isCore: false, units: 4, hours: 42, status: "completed", progress: 86, isFeatured: false, badge: "Theoretical", color: "secondary" },
        { code: "CSC308", name: "Operating Systems Fundamentals", short: "OS Intro", isCore: false, units: 4, hours: 40, status: "completed", progress: 80, isFeatured: false, badge: "Systems", color: "surface-variant" }
      ],
      4: [
        // THE 5 CORE DEMO SUBJECTS (CLICKABLE & CONNECTED)
        {
          code: "CSC401",
          name: "Operating Systems",
          short: "OS",
          isCore: true,
          units: 5,
          hours: 52,
          status: "in_progress",
          progress: 68,
          isFeatured: true,
          badge: "Core Systems Subject",
          desc: "Processes, thread concurrency, mutual exclusion, deadlock characterization, virtual memory paging, and storage disk scheduling.",
          color: "primary",
          examRelevance: "Highest University Weightage (80 Marks)",
          topicsCount: 20
        },
        {
          code: "CSC402",
          name: "Computer Networks",
          short: "CN",
          isCore: true,
          units: 5,
          hours: 48,
          status: "in_progress",
          progress: 54,
          isFeatured: true,
          badge: "Core Networking",
          desc: "OSI and TCP/IP protocol stacks, IP subnetting, routing algorithms, transport flow control (TCP/UDP), and socket network programming.",
          color: "secondary",
          examRelevance: "Essential Engineering Core",
          topicsCount: 18
        },
        {
          code: "CSC403",
          name: "Theory of Computation",
          short: "TOC",
          isCore: true,
          units: 5,
          hours: 46,
          status: "in_progress",
          progress: 45,
          isFeatured: true,
          badge: "Automata Theory",
          desc: "Finite automata, regular expressions, context-free grammars, pushdown automata, Turing machines, and decidability reductions.",
          color: "tertiary",
          examRelevance: "Analytical & Problem Solving",
          topicsCount: 16
        },
        {
          code: "CSC404",
          name: "Microprocessor & Microcontroller",
          short: "MPMC",
          isCore: true,
          units: 5,
          hours: 44,
          status: "in_progress",
          progress: 38,
          isFeatured: true,
          badge: "Hardware & Assembly",
          desc: "8086 microprocessor internal architecture, assembly programming, 8051 microcontroller, memory interfacing, and hardware timer interrupts.",
          color: "primary-container",
          examRelevance: "10-Mark Architecture Diagrams",
          topicsCount: 15
        },
        {
          code: "CSC405",
          name: "Software Engineering",
          short: "SE",
          isCore: true,
          units: 5,
          hours: 42,
          status: "in_progress",
          progress: 60,
          isFeatured: true,
          badge: "Industry Practices",
          desc: "Software process models, Agile Scrum methodologies, SRS documentation, UML architectural design, and modern software testing.",
          color: "surface-variant",
          examRelevance: "Case Studies & Viva Essential",
          topicsCount: 15
        }
      ],
      5: [
        { code: "CSC501", name: "Web Technology", short: "Web Tech", isCore: true, units: 5, hours: 48, status: "pending", progress: 0, isFeatured: true, badge: "Full Stack", color: "primary" },
        { code: "CSC502", name: "Design & Analysis of Algorithms", short: "DAA", isCore: true, units: 5, hours: 52, status: "pending", progress: 0, isFeatured: true, badge: "Algorithms", color: "secondary" },
        { code: "CSC503", name: "Artificial Intelligence", short: "AI", isCore: true, units: 5, hours: 48, status: "pending", progress: 0, isFeatured: true, badge: "AI Track", color: "tertiary" },
        { code: "CSC504", name: "Computer Graphics", short: "Graphics", isCore: true, units: 4, hours: 40, status: "pending", progress: 0, isFeatured: false, badge: "Visualization", color: "surface-variant" },
        { code: "CSC505", name: "Advanced Database Management Systems", short: "Adv DBMS", isCore: true, units: 4, hours: 44, status: "pending", progress: 0, isFeatured: false, badge: "Distributed DB", color: "primary-container" },
        { code: "CSC506", name: "Information Security", short: "InfoSec", isCore: false, units: 4, hours: 42, status: "pending", progress: 0, isFeatured: false, badge: "Security", color: "secondary" },
        { code: "CSC507", name: "Software Testing", short: "Software Testing", isCore: false, units: 3, hours: 36, status: "pending", progress: 0, isFeatured: false, badge: "QA Automation", color: "surface-variant" },
        { code: "CSC508", name: "Professional Elective I", short: "Elective I", isCore: false, units: 4, hours: 40, status: "pending", progress: 0, isFeatured: false, badge: "Elective", color: "primary" }
      ],
      6: [
        { code: "CSC601", name: "Machine Learning", short: "ML", isCore: true, units: 5, hours: 52, status: "pending", progress: 0, isFeatured: true, badge: "Machine Learning", color: "primary" },
        { code: "CSC602", name: "Cloud Computing", short: "Cloud", isCore: true, units: 5, hours: 48, status: "pending", progress: 0, isFeatured: true, badge: "AWS / Azure", color: "secondary" },
        { code: "CSC603", name: "Compiler Design", short: "Compiler", isCore: true, units: 5, hours: 50, status: "pending", progress: 0, isFeatured: false, badge: "Systems", color: "tertiary" },
        { code: "CSC604", name: "Distributed Systems", short: "Distributed Sys", isCore: true, units: 4, hours: 44, status: "pending", progress: 0, isFeatured: false, badge: "Scale", color: "primary-container" },
        { code: "CSC605", name: "Mobile Application Development", short: "Mobile Dev", isCore: true, units: 4, hours: 42, status: "pending", progress: 0, isFeatured: false, badge: "Android / Flutter", color: "primary" },
        { code: "CSC606", name: "Cyber Security", short: "Cyber Sec", isCore: false, units: 5, hours: 48, status: "pending", progress: 0, isFeatured: true, badge: "Defense", color: "secondary" },
        { code: "CSC607", name: "Data Mining", short: "Data Mining", isCore: false, units: 4, hours: 40, status: "pending", progress: 0, isFeatured: false, badge: "Data Ops", color: "surface-variant" },
        { code: "CSC608", name: "Professional Elective II", short: "Elective II", isCore: false, units: 4, hours: 40, status: "pending", progress: 0, isFeatured: false, badge: "Elective", color: "tertiary" }
      ],
      7: [
        { code: "CSC701", name: "Big Data Analytics", short: "Big Data", isCore: true, units: 5, hours: 50, status: "pending", progress: 0, isFeatured: true, badge: "Analytics", color: "primary" },
        { code: "CSC702", name: "Internet of Things", short: "IoT", isCore: true, units: 4, hours: 42, status: "pending", progress: 0, isFeatured: false, badge: "Hardware & IoT", color: "secondary" },
        { code: "CSC703", name: "Deep Learning", short: "Deep Learning", isCore: true, units: 5, hours: 52, status: "pending", progress: 0, isFeatured: true, badge: "Deep Learning", color: "tertiary" },
        { code: "CSC704", name: "Blockchain Technology", short: "Blockchain", isCore: true, units: 4, hours: 40, status: "pending", progress: 0, isFeatured: false, badge: "Web3", color: "primary-container" },
        { code: "CSC705", name: "Advanced Computer Networks", short: "Adv Networks", isCore: true, units: 4, hours: 42, status: "pending", progress: 0, isFeatured: false, badge: "SDN / 5G", color: "surface-variant" },
        { code: "CSC706", name: "Professional Elective III", short: "Elective III", isCore: false, units: 4, hours: 40, status: "pending", progress: 0, isFeatured: false, badge: "Specialization", color: "primary" },
        { code: "CSP707", name: "Project Phase I", short: "Project I", isCore: false, units: 6, hours: 60, status: "pending", progress: 0, isFeatured: true, badge: "Capstone", color: "secondary" },
        { code: "CSS708", name: "Seminar", short: "Seminar", isCore: false, units: 2, hours: 24, status: "pending", progress: 0, isFeatured: false, badge: "Research", color: "surface-variant" }
      ],
      8: [
        { code: "CSP801", name: "Major Project", short: "Major Project", isCore: true, units: 8, hours: 96, status: "pending", progress: 0, isFeatured: true, badge: "Graduation Capstone", color: "primary" },
        { code: "CSP802", name: "Project Phase II", short: "Project Phase II", isCore: true, units: 8, hours: 96, status: "pending", progress: 0, isFeatured: true, badge: "Graduation Capstone", color: "primary-container" },
        { code: "CSC803", name: "Professional Elective IV", short: "Elective IV", isCore: false, units: 4, hours: 44, status: "pending", progress: 0, isFeatured: false, badge: "Specialization", color: "secondary" },
        { code: "CSC804", name: "Artificial Intelligence Applications", short: "AI Apps", isCore: false, units: 4, hours: 42, status: "pending", progress: 0, isFeatured: false, badge: "SecOps", color: "tertiary" },
        { code: "CSC805", name: "Advanced Cyber Security", short: "Adv Cyber Sec", isCore: false, units: 4, hours: 42, status: "pending", progress: 0, isFeatured: false, badge: "SecOps", color: "secondary" },
        { code: "CSC806", name: "Cloud & DevOps", short: "Cloud DevOps", isCore: false, units: 4, hours: 44, status: "pending", progress: 0, isFeatured: true, badge: "CI/CD Kubernetes", color: "primary-container" },
        { code: "CSC807", name: "Entrepreneurship & Innovation", short: "Entrepreneurship", isCore: false, units: 3, hours: 32, status: "pending", progress: 0, isFeatured: false, badge: "Startups", color: "surface-variant" },
        { code: "CSI808", name: "Industry Internship", short: "Internship", isCore: false, units: 6, hours: 80, status: "pending", progress: 0, isFeatured: true, badge: "Industry Placement", color: "primary" }
      ]
    },

    // Information Technology (IT) - Sem 4
    "it": {
      4: [
        { code: "ITC401", name: "Operating Systems Architecture", short: "OS", units: 5, hours: 50, status: "in_progress", progress: 65, isFeatured: true, badge: "Systems Core", color: "primary" },
        { code: "ITC402", name: "Computer Network Security", short: "CNS", units: 5, hours: 48, status: "in_progress", progress: 50, isFeatured: true, badge: "Networking", color: "secondary" },
        { code: "ITC403", name: "Database Management & NoSQL", short: "DBMS", units: 5, hours: 52, status: "in_progress", progress: 60, isFeatured: true, badge: "Databases", color: "tertiary" },
        { code: "ITC404", name: "Automata Theory & Languages", short: "Automata", units: 4, hours: 44, status: "in_progress", progress: 40, isFeatured: false, badge: "Theoretical", color: "primary-container" },
        { code: "ITC405", name: "Web Development Frameworks", short: "Web Dev", units: 4, hours: 42, status: "in_progress", progress: 70, isFeatured: true, badge: "Full Stack", color: "surface-variant" }
      ]
    },

    // AI & Data Science (AIDS) - Sem 4
    "aids": {
      4: [
        { code: "ADC401", name: "Machine Learning Fundamentals", short: "ML Intro", units: 5, hours: 52, status: "in_progress", progress: 70, isFeatured: true, badge: "AI Core", color: "primary" },
        { code: "ADC402", name: "Operating Systems with Linux", short: "OS Linux", units: 5, hours: 50, status: "in_progress", progress: 62, isFeatured: true, badge: "Systems", color: "secondary" },
        { code: "ADC403", name: "Database Systems & Data Warehousing", short: "Data Warehousing", units: 5, hours: 48, status: "in_progress", progress: 55, isFeatured: true, badge: "Data Systems", color: "tertiary" },
        { code: "ADC404", name: "Applied Probability & Statistics", short: "Stats for DS", units: 4, hours: 44, status: "in_progress", progress: 48, isFeatured: false, badge: "Maths Core", color: "primary-container" },
        { code: "ADC405", name: "Data Analytics & Visualization", short: "Data Analytics", units: 4, hours: 42, status: "in_progress", progress: 65, isFeatured: true, badge: "Python / PowerBI", color: "surface-variant" }
      ]
    },

    // Electronics & Telecommunication (EXTC) - Sem 4
    "extc": {
      4: [
        { code: "ECC401", name: "Microprocessors & Microcontrollers", short: "MPMC", units: 5, hours: 50, status: "in_progress", progress: 55, isFeatured: true, badge: "Hardware", color: "primary" },
        { code: "ECC402", name: "Analog Circuits & Linear ICs", short: "Analog Circuits", units: 5, hours: 48, status: "in_progress", progress: 50, isFeatured: true, badge: "Circuits", color: "secondary" },
        { code: "ECC403", name: "Signals & Systems", short: "Signals", units: 5, hours: 52, status: "in_progress", progress: 42, isFeatured: true, badge: "Signal Theory", color: "tertiary" },
        { code: "ECC404", name: "Principles of Communication Engineering", short: "Comm Engg", units: 4, hours: 44, status: "in_progress", progress: 48, isFeatured: false, badge: "Telecom", color: "primary-container" },
        { code: "ECC405", name: "Numerical Methods & Probability", short: "Maths IV", units: 4, hours: 40, status: "in_progress", progress: 58, isFeatured: false, badge: "Maths", color: "surface-variant" }
      ]
    },

    // Electrical Engineering (EE) - Sem 4
    "ee": {
      4: [
        { code: "EEC401", name: "Electrical Machines I", short: "Machines I", units: 5, hours: 50, status: "in_progress", progress: 60, isFeatured: true, badge: "Core Power", color: "primary" },
        { code: "EEC402", name: "Power Electronics & Converters", short: "Power Electronics", units: 5, hours: 48, status: "in_progress", progress: 52, isFeatured: true, badge: "Electronics", color: "secondary" },
        { code: "EEC403", name: "Control Systems Engineering", short: "Control Systems", units: 5, hours: 50, status: "in_progress", progress: 45, isFeatured: true, badge: "Systems", color: "tertiary" },
        { code: "EEC404", name: "Electromagnetic Field Theory", short: "EMFT", units: 4, hours: 42, status: "in_progress", progress: 40, isFeatured: false, badge: "Physics", color: "primary-container" },
        { code: "EEC405", name: "Digital Electronics & Logic Design", short: "Digital Logic", units: 4, hours: 40, status: "in_progress", progress: 65, isFeatured: false, badge: "Digital", color: "surface-variant" }
      ]
    },

    // Mechanical Engineering (ME) - Sem 4
    "me": {
      4: [
        { code: "MEC401", name: "Fluid Mechanics & Hydraulics", short: "Fluid Mech", units: 5, hours: 50, status: "in_progress", progress: 58, isFeatured: true, badge: "Thermal Core", color: "primary" },
        { code: "MEC402", name: "Kinematics of Machinery", short: "KOM", units: 5, hours: 52, status: "in_progress", progress: 50, isFeatured: true, badge: "Design Core", color: "secondary" },
        { code: "MEC403", name: "Applied Thermodynamics", short: "Applied Thermo", units: 5, hours: 48, status: "in_progress", progress: 44, isFeatured: true, badge: "Thermodynamics", color: "tertiary" },
        { code: "MEC404", name: "Manufacturing Processes II", short: "Manufacturing", units: 4, hours: 42, status: "in_progress", progress: 62, isFeatured: false, badge: "Production", color: "primary-container" },
        { code: "MEC405", name: "Strength of Materials (Solid Mech)", short: "SOM", units: 4, hours: 44, status: "in_progress", progress: 46, isFeatured: false, badge: "Structures", color: "surface-variant" }
      ]
    },

    // Civil Engineering (CIVIL) - Sem 4
    "civil": {
      4: [
        { code: "CEC401", name: "Structural Analysis I", short: "Structures I", units: 5, hours: 50, status: "in_progress", progress: 52, isFeatured: true, badge: "Structures Core", color: "primary" },
        { code: "CEC402", name: "Surveying II (Advanced)", short: "Surveying", units: 5, hours: 48, status: "in_progress", progress: 60, isFeatured: true, badge: "Site Core", color: "secondary" },
        { code: "CEC403", name: "Concrete Technology & Mix Design", short: "Concrete Tech", units: 4, hours: 42, status: "in_progress", progress: 65, isFeatured: true, badge: "Materials", color: "tertiary" },
        { code: "CEC404", name: "Fluid Mechanics II", short: "Fluid Mech II", units: 5, hours: 48, status: "in_progress", progress: 48, isFeatured: false, badge: "Hydraulics", color: "primary-container" },
        { code: "CEC405", name: "Building Planning & Design CAD", short: "Building CAD", units: 4, hours: 40, status: "in_progress", progress: 70, isFeatured: false, badge: "Design CAD", color: "surface-variant" }
      ]
    },

    // Cyber Security (CYBER) - Sem 4
    "cyber": {
      4: [
        { code: "CYC401", name: "Operating Systems & Kernel Security", short: "OS Security", units: 5, hours: 52, status: "in_progress", progress: 65, isFeatured: true, badge: "System Security", color: "primary" },
        { code: "CYC402", name: "Cryptography & Network Security", short: "Cryptography", units: 5, hours: 50, status: "in_progress", progress: 54, isFeatured: true, badge: "Core Crypto", color: "secondary" },
        { code: "CYC403", name: "Computer Networks & Threat Vectors", short: "Networks", units: 5, hours: 48, status: "in_progress", progress: 58, isFeatured: true, badge: "Network Def", color: "tertiary" },
        { code: "CYC404", name: "Database Security & Access Control", short: "DB Security", units: 4, hours: 42, status: "in_progress", progress: 50, isFeatured: false, badge: "Data Defense", color: "primary-container" },
        { code: "CYC405", name: "Python for Ethical Hacking", short: "Ethical Hacking", units: 4, hours: 44, status: "in_progress", progress: 72, isFeatured: true, badge: "Offensive Sec", color: "surface-variant" }
      ]
    }
  };

  // ----------------------------------------------------
  // 5. STRUCTURED UNITS & TOPIC SYSTEM (Clickable Learning Hubs)
  // ----------------------------------------------------
  const SUBJECT_UNITS_DATA = {
    // Detailed Unit & Topic Breakdown for Operating Systems (CSC401)
    "CSC401": [
      {
        unitNum: 1,
        title: "Unit 1 — Introduction",
        weightage: "12 Marks",
        progress: 85,
        topics: [
          {
            id: "t_os_1_1",
            title: "OS Fundamentals",
            hours: "3 hrs",
            summary: "An Operating System acts as an intermediary between users and computer hardware, responsible for resource allocation, hardware abstraction, and user isolation.",
            keyFormulaOrRule: "Kernel Mode (Ring 0) vs User Mode (Ring 3) hardware bit protection.",
            pyqMentions: "May 2023 Q1(a), Dec 2022 Q2(b)",
            flashcardsCount: 3,
            mcqsCount: 4,
            aiPrompt: "Explain the fundamentals of operating systems, hardware abstraction, and kernel vs user mode."
          },
          {
            id: "t_os_1_2",
            title: "OS Services",
            hours: "2 hrs",
            summary: "Services include program execution, I/O operations, file manipulation, communications, and error detection, guarded via Dual-Mode operation using a mode bit.",
            keyFormulaOrRule: "Mode bit = 0 (Kernel/Supervisor mode), Mode bit = 1 (User mode).",
            pyqMentions: "Dec 2023 Q1(c)",
            flashcardsCount: 2,
            mcqsCount: 3,
            aiPrompt: "How does the operating system provide services to user programs while maintaining protection?"
          },
          {
            id: "t_os_1_3",
            title: "System Calls",
            hours: "3 hrs",
            summary: "System calls provide an interface to operating system services. Three methods to pass parameters: registers, block/table in memory, or pushed onto stack.",
            keyFormulaOrRule: "Trap instruction generates a software interrupt switching execution to kernel space.",
            pyqMentions: "May 2024 Q2(a), May 2022 Q1(b)",
            flashcardsCount: 3,
            mcqsCount: 5,
            aiPrompt: "Explain how fork(), exec(), and wait() work together in Unix systems."
          },
          {
            id: "t_os_1_4",
            title: "OS Structures",
            hours: "2 hrs",
            summary: "Kernel design patterns trading off raw execution speed (monolithic) against modularity, fault tolerance, and security (microkernel).",
            keyFormulaOrRule: "Mach, QNX = Microkernels; Linux, BSD = Monolithic; Windows, macOS = Hybrid.",
            pyqMentions: "Dec 2022 Q3(a)",
            flashcardsCount: 2,
            mcqsCount: 3,
            aiPrompt: "Compare Monolithic, Layered, and Microkernel OS structures with architectural diagrams."
          }
        ]
      },
      {
        unitNum: 2,
        title: "Unit 2 — Processes",
        weightage: "18 Marks",
        progress: 75,
        topics: [
          {
            id: "t_os_2_1",
            title: "Process Concept",
            hours: "3 hrs",
            summary: "A process is a program in execution containing Text, Data, Heap, and Stack. Managed via Process Control Block (PCB) tracking PID, PC, registers, and open files.",
            keyFormulaOrRule: "5 State Lifecycle: New -> Ready <-> Running -> Terminated (and Waiting/Blocked).",
            pyqMentions: "May 2023 Q2(a), Dec 2023 Q1(a)",
            flashcardsCount: 4,
            mcqsCount: 6,
            aiPrompt: "Draw and explain the 5-state process transition diagram and the role of Process Control Block (PCB)."
          },
          {
            id: "t_os_2_2",
            title: "Process Scheduling",
            hours: "4 hrs",
            summary: "Preemptive and non-preemptive schedulers (FCFS, SJF, SRTF, Round Robin, Priority) aiming to minimize Average Turnaround Time and Waiting Time.",
            keyFormulaOrRule: "Turnaround Time = Completion - Arrival. Waiting Time = Turnaround - Burst Time.",
            pyqMentions: "May 2024 Q3 (Numerical 10M), Dec 2022 Q2(a)",
            flashcardsCount: 5,
            mcqsCount: 8,
            aiPrompt: "Solve CPU scheduling numerical: Calculate average waiting time under Round Robin with Quantum=2."
          },
          {
            id: "t_os_2_3",
            title: "Inter-Process Communication",
            hours: "2 hrs",
            summary: "Shared memory offers fast zero-copy memory buffers; message passing provides distributed safety via send() and receive() primitives.",
            keyFormulaOrRule: "Direct vs Indirect communication (mailboxes/ports), blocking vs non-blocking synchronization.",
            pyqMentions: "May 2022 Q3(b)",
            flashcardsCount: 3,
            mcqsCount: 4,
            aiPrompt: "Compare Shared Memory and Message Passing IPC mechanisms with code examples."
          },
          {
            id: "t_os_2_4",
            title: "Threads",
            hours: "3 hrs",
            summary: "Threads are lightweight dispatchable units sharing code, data, and OS resources, with independent Program Counters, registers, and stacks.",
            keyFormulaOrRule: "Thread context switch overhead is ~10x lower than process context switch.",
            pyqMentions: "Dec 2023 Q2(b)",
            flashcardsCount: 3,
            mcqsCount: 5,
            aiPrompt: "Explain user threads vs kernel threads and multithreading models (Many-to-One, One-to-One, Many-to-Many)."
          }
        ]
      },
      {
        unitNum: 3,
        title: "Unit 3 — Process Synchronization",
        weightage: "20 Marks",
        progress: 60,
        topics: [
          {
            id: "t_os_3_1",
            title: "Critical Section",
            hours: "3 hrs",
            summary: "Requires Mutual Exclusion, Progress, and Bounded Waiting to avoid race conditions during concurrent data access. Solved via Peterson's solution.",
            keyFormulaOrRule: "Peterson's 2-process solution using flag[2] boolean array and integer turn variable.",
            pyqMentions: "May 2023 Q3(a), May 2022 Q4(a)",
            flashcardsCount: 3,
            mcqsCount: 5,
            aiPrompt: "Prove that Peterson's Algorithm satisfies Mutual Exclusion, Progress, and Bounded Waiting."
          },
          {
            id: "t_os_3_2",
            title: "Semaphores",
            hours: "3 hrs",
            summary: "Integer variables accessed only through atomic wait() (P) and signal() (V) routines. Solves Bounded Buffer and Readers-Writers synchronization.",
            keyFormulaOrRule: "wait(S): S <= 0 ? block() : S--; signal(S): S++; unblock() waiting process.",
            pyqMentions: "May 2024 Q4(a) (10M), Dec 2023 Q3(a)",
            flashcardsCount: 4,
            mcqsCount: 6,
            aiPrompt: "Write pseudocode solving the Producer-Consumer problem using counting and binary semaphores."
          },
          {
            id: "t_os_3_3",
            title: "Monitors",
            hours: "2 hrs",
            summary: "High-level synchronization construct encapsulating shared variables and condition variables (cwait, csignal) ensuring only one process is active inside at a time.",
            keyFormulaOrRule: "Condition variables: x.wait() suspends process, x.signal() resumes one suspended process.",
            pyqMentions: "Dec 2022 Q4(b)",
            flashcardsCount: 3,
            mcqsCount: 4,
            aiPrompt: "Explain how Monitors prevent semaphore synchronization errors with the Dining Philosophers problem."
          },
          {
            id: "t_os_3_4",
            title: "Deadlocks",
            hours: "3 hrs",
            summary: "Deadlock occurs when every process in a set waits for an event only another process in the set can cause. Solved via Banker's algorithm and RAG cycle detection.",
            keyFormulaOrRule: "4 Coffman Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.",
            pyqMentions: "May 2024 Q4(b), Dec 2023 Q4(a)",
            flashcardsCount: 4,
            mcqsCount: 6,
            aiPrompt: "Explain Coffman's 4 conditions and trace the Banker's safety algorithm on a resource allocation matrix."
          }
        ]
      },
      {
        unitNum: 4,
        title: "Unit 4 — Memory Management",
        weightage: "18 Marks",
        progress: 55,
        topics: [
          {
            id: "t_os_4_1",
            title: "Paging",
            hours: "4 hrs",
            summary: "Non-contiguous memory allocation dividing logical space into Pages and physical space into Frames. TLB acts as an associative high-speed hardware cache.",
            keyFormulaOrRule: "Effective Access Time (EAT) = (Hit Ratio * (tlb_time + mem_time)) + ((1 - Hit) * (tlb_time + 2*mem_time)).",
            pyqMentions: "May 2024 Q5(a) (Numerical 10M), Dec 2023 Q5(a)",
            flashcardsCount: 5,
            mcqsCount: 8,
            aiPrompt: "Calculate Effective Access Time (EAT) with TLB hit ratio 95%, TLB search time 10ns, and main memory access 100ns."
          },
          {
            id: "t_os_4_2",
            title: "Segmentation",
            hours: "2 hrs",
            summary: "Segmentation reflects user logical view of programs (code, stack, heap, symbol table) using Segment Table (Base, Limit), avoiding internal fragmentation.",
            keyFormulaOrRule: "Segment offset check: d < Limit ? Base + d : Trap (Addressing Error).",
            pyqMentions: "May 2023 Q5(b)",
            flashcardsCount: 3,
            mcqsCount: 4,
            aiPrompt: "Compare Paging and Segmentation across fragmentation, address translation, and sharing."
          },
          {
            id: "t_os_4_3",
            title: "Virtual Memory",
            hours: "3 hrs",
            summary: "Pages loaded on demand. Missing page triggers a Page Fault interrupt to load frame from swap disk into RAM without requiring entire process in memory.",
            keyFormulaOrRule: "Page Fault Sequence: Trap -> Save context -> Find frame -> Read disk -> Update Page Table -> Restart instruction.",
            pyqMentions: "May 2023 Q5(a), Dec 2022 Q5(b)",
            flashcardsCount: 4,
            mcqsCount: 6,
            aiPrompt: "Detail the 6-step hardware and OS sequence for handling a page fault interrupt."
          },
          {
            id: "t_os_4_4",
            title: "Page Replacement",
            hours: "3 hrs",
            summary: "Decides victim frame when all frames are full: FIFO, Belady's anomaly, Optimal, and LRU algorithms.",
            keyFormulaOrRule: "Reference string page fault counting: Optimal = lookahead; LRU = least recently used lookback.",
            pyqMentions: "May 2024 Q5(b) (Numerical 10M), Dec 2023 Q5(b)",
            flashcardsCount: 5,
            mcqsCount: 8,
            aiPrompt: "Given reference string: 7,0,1,2,0,3,0,4,2,3,0,3,2, calculate page faults for FIFO and LRU with 3 frames."
          }
        ]
      },
      {
        unitNum: 5,
        title: "Unit 5 — File & Storage Management",
        weightage: "12 Marks",
        progress: 60,
        topics: [
          {
            id: "t_os_5_1",
            title: "File Systems",
            hours: "2 hrs",
            summary: "Files are logical collections of contiguous byte sequences. Single-level, two-level, tree-structured, and acyclic graph directory architectures with Inodes.",
            keyFormulaOrRule: "Inode structure: Direct blocks, Single Indirect, Double Indirect, Triple Indirect blocks.",
            pyqMentions: "May 2023 Q6(a)",
            flashcardsCount: 2,
            mcqsCount: 4,
            aiPrompt: "Explain the Unix Inode file representation and how large file sizes are supported through indirect pointers."
          },
          {
            id: "t_os_5_2",
            title: "Disk Scheduling",
            hours: "3 hrs",
            summary: "Optimizes read/write disk head movement across tracks to minimize total seek time: FCFS, SSTF, SCAN, C-SCAN, LOOK.",
            keyFormulaOrRule: "Total Head Movement (Cylinders) = sum of absolute track differences traversed.",
            pyqMentions: "May 2024 Q6 (Numerical 10M), Dec 2022 Q6(b)",
            flashcardsCount: 4,
            mcqsCount: 6,
            aiPrompt: "Calculate total track movements for SSTF and SCAN given track queue: 98, 183, 37, 122, 14, 124, 65, 67 with initial head at 53."
          },
          {
            id: "t_os_5_3",
            title: "File Allocation",
            hours: "3 hrs",
            summary: "Contiguous, Linked, and Indexed allocation methods balancing sequential access speed, external fragmentation, and pointer overhead.",
            keyFormulaOrRule: "FAT (File Allocation Table) in MS-DOS is an in-memory cache of linked pointers.",
            pyqMentions: "Dec 2023 Q6(a), May 2022 Q6(a)",
            flashcardsCount: 3,
            mcqsCount: 5,
            aiPrompt: "Compare Contiguous, Linked, and Indexed file allocation methods with pros and cons."
          },
          {
            id: "t_os_5_4",
            title: "Storage Management",
            hours: "2 hrs",
            summary: "Techniques employed by file systems to manage unallocated disk blocks: Bit Vectors, Linked Free Lists, Grouping, and Counting.",
            keyFormulaOrRule: "Bit Vector: Block i is free if bit[i] == 1; requires memory proportional to disk size.",
            pyqMentions: "Dec 2022 Q6(a)",
            flashcardsCount: 2,
            mcqsCount: 3,
            aiPrompt: "Explain Bit Vector vs Linked List free space management and memory overheads in storage systems."
          }
        ]
      }
    ]
  };

  // ----------------------------------------------------
  // 6. FLASHCARDS DATASET — Subject-Specific Decks
  // ----------------------------------------------------
  const FLASHCARDS = [
    // --- OPERATING SYSTEMS FLASHCARDS (15 cards) ---
    {
      id: "fc_os_1",
      subject: "Operating Systems",
      topic: "Process Management",
      unit: "Unit 2",
      q: "What is the crucial difference between a Process and a Thread?",
      a: "A process is an executing program instance with its own private address space and resources. A thread is a lightweight unit within a process that shares code, data, and open files with peer threads, enabling low-overhead context switching.",
      difficulty: "Medium",
      examRelevance: "High (Asked in May 2023, Dec 2022)"
    },
    {
      id: "fc_os_2",
      subject: "Operating Systems",
      topic: "Deadlocks",
      unit: "Unit 3",
      q: "What are Coffman's 4 Necessary Conditions for a Deadlock?",
      a: "1. Mutual Exclusion (non-shareable resources)\n2. Hold and Wait (processes hold resources while requesting more)\n3. No Preemption (resources cannot be forcibly taken)\n4. Circular Wait (a closed chain of processes each waiting for the next).",
      difficulty: "High",
      examRelevance: "Guaranteed 10-Mark Question"
    },
    {
      id: "fc_os_3",
      subject: "Operating Systems",
      topic: "Memory Management",
      unit: "Unit 4",
      q: "What is Belady's Anomaly and in which algorithm is it observed?",
      a: "Belady's Anomaly is the phenomenon where increasing the number of page frames results in MORE page faults. It is observed in FIFO page replacement. Stack-based algorithms like LRU and Optimal never exhibit this anomaly.",
      difficulty: "Medium",
      examRelevance: "Popular 5-Mark Theory / MCQ"
    },
    {
      id: "fc_os_4",
      subject: "Operating Systems",
      topic: "CPU Scheduling",
      unit: "Unit 2",
      q: "What is the Convoy Effect in FCFS Scheduling?",
      a: "The Convoy Effect occurs when a long CPU-burst process monopolizes the CPU, forcing short I/O-bound processes to wait behind it in the ready queue. This severely degrades overall CPU and device utilization.",
      difficulty: "Low",
      examRelevance: "5 Marks Theory"
    },
    {
      id: "fc_os_5",
      subject: "Operating Systems",
      topic: "Synchronization",
      unit: "Unit 3",
      q: "What is a Semaphore and how does Counting differ from Binary Semaphore?",
      a: "A semaphore is a synchronization primitive with atomic wait() (P) and signal() (V) operations. A Binary Semaphore takes values 0 or 1 (mutual exclusion). A Counting Semaphore takes non-negative integer values to control access to a finite resource pool.",
      difficulty: "Medium",
      examRelevance: "Theory & Code (10 Marks)"
    },
    {
      id: "fc_os_6",
      subject: "Operating Systems",
      topic: "Process States",
      unit: "Unit 2",
      q: "What are the 5 primary states in a Process Life Cycle?",
      a: "1. New (being created)\n2. Ready (waiting for CPU assignment)\n3. Running (instructions being executed)\n4. Waiting/Blocked (waiting for an I/O or event)\n5. Terminated (finished execution).",
      difficulty: "Low",
      examRelevance: "5 Marks Diagram Question"
    },
    {
      id: "fc_os_7",
      subject: "Operating Systems",
      topic: "CPU Scheduling",
      unit: "Unit 2",
      q: "How does Round Robin (RR) scheduling prevent process starvation?",
      a: "Round Robin assigns a fixed time quantum to each ready process in cyclic order. Preemption occurs when the quantum expires, guaranteeing that every process gets a share of CPU time, completely preventing starvation.",
      difficulty: "Medium",
      examRelevance: "Numerical / 10 Marks"
    },
    {
      id: "fc_os_8",
      subject: "Operating Systems",
      topic: "Deadlock Avoidance",
      unit: "Unit 3",
      q: "How does Banker's Algorithm ensure a Safe State?",
      a: "Banker's Algorithm simulates resource allocation by testing if there exists a safe sequence where every process can satisfy its maximum remaining need using available resources and completed processes' released resources.",
      difficulty: "High",
      examRelevance: "10 Marks Numerical & Theory"
    },
    {
      id: "fc_os_9",
      subject: "Operating Systems",
      topic: "Virtual Memory",
      unit: "Unit 4",
      q: "What is Thrashing and how can the Operating System resolve it?",
      a: "Thrashing occurs when the system spends more time servicing page faults and swapping pages than executing actual instructions. It is resolved by reducing the degree of multiprogramming using the Working Set Model or Page Fault Frequency strategy.",
      difficulty: "Medium",
      examRelevance: "5 Marks Short Note"
    },
    {
      id: "fc_os_10",
      subject: "Operating Systems",
      topic: "Memory Management",
      unit: "Unit 4",
      q: "What is the difference between Internal and External Fragmentation?",
      a: "Internal Fragmentation occurs in fixed partitioning when allocated memory block exceeds requested size (unused space inside partition). External Fragmentation occurs in dynamic partitioning when total free memory exists but is non-contiguous.",
      difficulty: "Low",
      examRelevance: "5 Marks Comparison"
    },
    {
      id: "fc_os_11",
      subject: "Operating Systems",
      topic: "Paging & Hardware",
      unit: "Unit 4",
      q: "What role does the TLB (Translation Lookaside Buffer) play in Paging?",
      a: "TLB is an associative high-speed hardware cache that stores recent virtual-to-physical page frame translations. A TLB hit avoids accessing the main memory page table, drastically reducing Effective Access Time (EAT).",
      difficulty: "Medium",
      examRelevance: "10 Marks Numerical on EAT"
    },
    {
      id: "fc_os_12",
      subject: "Operating Systems",
      topic: "File Systems",
      unit: "Unit 5",
      q: "What is an Inode in Unix-like file systems?",
      a: "An Inode (Index Node) is a filesystem data structure storing file metadata (permissions, owner, size, timestamps) and pointers to data blocks (direct, single indirect, double indirect, and triple indirect block pointers).",
      difficulty: "Medium",
      examRelevance: "5 Marks Architecture"
    },
    {
      id: "fc_os_13",
      subject: "Operating Systems",
      topic: "Disk Scheduling",
      unit: "Unit 5",
      q: "Why is SCAN (Elevator Algorithm) preferred over Shortest Seek Time First (SSTF)?",
      a: "SSTF can cause starvation for distant disk tracks when requests continuously arrive near the current head position. SCAN moves continuously in one direction servicing requests until the end track, ensuring fair access without starvation.",
      difficulty: "Medium",
      examRelevance: "10 Marks Numerical"
    },
    {
      id: "fc_os_14",
      subject: "Operating Systems",
      topic: "IPC",
      unit: "Unit 2",
      q: "What are the primary Inter-Process Communication (IPC) models?",
      a: "1. Shared Memory: processes map a common memory segment (highest speed, requires synchronization).\n2. Message Passing: processes communicate via OS kernel primitives like send() and receive() (distributed friendly, no memory conflicts).",
      difficulty: "Medium",
      examRelevance: "5 Marks Short Note"
    },
    {
      id: "fc_os_15",
      subject: "Operating Systems",
      topic: "Synchronization",
      unit: "Unit 3",
      q: "What are the 3 critical section requirements for synchronization solutions?",
      a: "1. Mutual Exclusion (only one process in critical section at a time)\n2. Progress (selection of next process cannot be postponed indefinitely)\n3. Bounded Waiting (a limit must exist on the number of times others enter before a waiting process).",
      difficulty: "High",
      examRelevance: "10 Marks Theory (Petersons / Semaphores)"
    },

    // --- DATA STRUCTURES & ALGORITHMS FLASHCARDS (15 cards) ---
    {
      id: "fc_dsa_1",
      subject: "Data Structures & Algorithms",
      topic: "Arrays & Searching",
      unit: "Unit 1",
      q: "What is the precondition and time complexity of Binary Search?",
      a: "Precondition: The array must be sorted in monotonic order. Time Complexity: O(log n) best/average/worst case because the search space is halved at each comparison step. Space complexity is O(1) iterative or O(log n) recursive.",
      difficulty: "Low",
      examRelevance: "Core Algorithm Question"
    },
    {
      id: "fc_dsa_2",
      subject: "Data Structures & Algorithms",
      topic: "Linked Lists",
      unit: "Unit 2",
      q: "How does a Doubly Linked List differ from a Singly Linked List in deletion?",
      a: "In a Singly Linked List, deleting a given node requires finding its predecessor (O(n)). In a Doubly Linked List, having a pointer to the node allows O(1) deletion by linking node->prev->next = node->next directly.",
      difficulty: "Low",
      examRelevance: "5 Marks Comparison"
    },
    {
      id: "fc_dsa_3",
      subject: "Data Structures & Algorithms",
      topic: "Stacks",
      unit: "Unit 2",
      q: "What is the standard algorithm for Infix to Postfix expression conversion?",
      a: "Shunting-Yard algorithm using an Operator Stack. Operands are directly appended to output; operators are pushed based on precedence and associativity; parentheses define sub-expression evaluation boundaries. Time complexity: O(n).",
      difficulty: "Medium",
      examRelevance: "10 Marks Expression Evaluation"
    },
    {
      id: "fc_dsa_4",
      subject: "Data Structures & Algorithms",
      topic: "Queues",
      unit: "Unit 2",
      q: "Why is a Circular Queue preferred over a Linear Queue using an array?",
      a: "In a linear queue, deleted spaces at the front cannot be reused once rear reaches array capacity (false overflow). A circular queue connects rear back to front using modulo arithmetic ((rear + 1) % MAX), efficiently utilizing all space.",
      difficulty: "Low",
      examRelevance: "5 Marks Theory & Code"
    },
    {
      id: "fc_dsa_5",
      subject: "Data Structures & Algorithms",
      topic: "Trees",
      unit: "Unit 3",
      q: "What is the relationship between Inorder traversal and a Binary Search Tree (BST)?",
      a: "An Inorder Traversal (Left, Root, Right) of a Binary Search Tree always visits nodes in strictly non-decreasing sorted order. Time complexity is O(n) to traverse all n nodes.",
      difficulty: "Low",
      examRelevance: "5 Marks Concept"
    },
    {
      id: "fc_dsa_6",
      subject: "Data Structures & Algorithms",
      topic: "Balanced Trees",
      unit: "Unit 3",
      q: "What is the Balance Factor in an AVL Tree and what are the 4 rotation types?",
      a: "Balance Factor = Height(Left Subtree) - Height(Right Subtree) ∈ {-1, 0, 1}. The 4 self-balancing rotations are:\n1. Left-Left (LL) -> Single Right Rotation\n2. Right-Right (RR) -> Single Left Rotation\n3. Left-Right (LR) -> Left then Right Rotation\n4. Right-Left (RL) -> Right then Left Rotation.",
      difficulty: "High",
      examRelevance: "10 Marks Numerical Construction"
    },
    {
      id: "fc_dsa_7",
      subject: "Data Structures & Algorithms",
      topic: "Heaps",
      unit: "Unit 3",
      q: "What are the properties of a Max-Heap and what is the time complexity of Heapify?",
      a: "A Max-Heap is a complete binary tree where every parent node has a key ≥ keys of its children. Building a heap of n elements takes O(n) time using bottom-up Heapify. Extracting the maximum and inserting both take O(log n).",
      difficulty: "Medium",
      examRelevance: "Heap Sort (10 Marks)"
    },
    {
      id: "fc_dsa_8",
      subject: "Data Structures & Algorithms",
      topic: "Hashing",
      unit: "Unit 4",
      q: "What is Open Addressing vs Separate Chaining in Hash Collisions?",
      a: "Separate Chaining: each bucket holds a linked list of collided keys (unbounded capacity). Open Addressing: all keys stored in the hash table array itself using probing (Linear Probing, Quadratic Probing, Double Hashing) until an empty slot is found.",
      difficulty: "Medium",
      examRelevance: "10 Marks Comparison"
    },
    {
      id: "fc_dsa_9",
      subject: "Data Structures & Algorithms",
      topic: "Graphs",
      unit: "Unit 5",
      q: "Compare Breadth-First Search (BFS) and Depth-First Search (DFS) data structures and applications.",
      a: "BFS uses a Queue (FIFO) exploring neighbor by neighbor; finds shortest path in unweighted graphs. DFS uses a Stack / Recursion (LIFO) exploring as deep as possible; used in topological sorting, cycle detection, and strongly connected components. Both run in O(V + E).",
      difficulty: "Medium",
      examRelevance: "10 Marks Graph Traversal"
    },
    {
      id: "fc_dsa_10",
      subject: "Data Structures & Algorithms",
      topic: "Graph Algorithms",
      unit: "Unit 5",
      q: "What is the difference between Dijkstra's and Bellman-Ford algorithms?",
      a: "Dijkstra uses a greedy approach with a min-priority queue (O((V+E) log V)) but fails with negative edge weights. Bellman-Ford uses dynamic programming relaxing all edges V-1 times (O(V*E)) and successfully detects negative weight cycles.",
      difficulty: "High",
      examRelevance: "10 Marks Shortest Path"
    },
    {
      id: "fc_dsa_11",
      subject: "Data Structures & Algorithms",
      topic: "Minimum Spanning Tree",
      unit: "Unit 5",
      q: "How do Prim's and Kruskal's algorithms construct a Minimum Spanning Tree (MST)?",
      a: "Prim's grows a single tree vertex-by-vertex picking the lowest-weight connecting cut edge. Kruskal's sorts all graph edges globally and adds edges greedily using Disjoint Set Union (DSU) to avoid creating cycles. Both find MST in O(E log V).",
      difficulty: "Medium",
      examRelevance: "10 Marks Numerical / Code"
    },
    {
      id: "fc_dsa_12",
      subject: "Data Structures & Algorithms",
      topic: "Sorting",
      unit: "Unit 4",
      q: "Why is QuickSort preferred over MergeSort for arrays, and vice-versa for linked lists?",
      a: "QuickSort sorts in-place with O(1) auxiliary space and excellent cache locality. MergeSort requires O(n) extra space for arrays, but on linked lists MergeSort requires O(1) extra space because node pointers can be rearranged directly without array copy.",
      difficulty: "Medium",
      examRelevance: "Analysis & Comparison"
    },
    {
      id: "fc_dsa_13",
      subject: "Data Structures & Algorithms",
      topic: "Sorting Complexity",
      unit: "Unit 4",
      q: "What is the worst-case time complexity of QuickSort and how can it be mitigated?",
      a: "Worst-case is O(n²) when the pivot selected is always the minimum or maximum element (e.g., sorted array with first element as pivot). It is mitigated using Randomized Pivot selection or the Median-of-Three pivot strategy.",
      difficulty: "Medium",
      examRelevance: "5 Marks Complexity"
    },
    {
      id: "fc_dsa_14",
      subject: "Data Structures & Algorithms",
      topic: "Dynamic Programming",
      unit: "Unit 6",
      q: "What are the two key properties required for a problem to be solved via Dynamic Programming?",
      a: "1. Optimal Substructure: the optimal solution to the problem contains optimal solutions to its subproblems.\n2. Overlapping Subproblems: recursive algorithms revisit the same subproblems repeatedly rather than generating new subproblems.",
      difficulty: "Medium",
      examRelevance: "5 Marks Concept"
    },
    {
      id: "fc_dsa_15",
      subject: "Data Structures & Algorithms",
      topic: "Complexity Analysis",
      unit: "Unit 1",
      q: "What do Big-O (O), Big-Omega (Ω), and Big-Theta (Θ) notations represent?",
      a: "Big-O (O): Asymptotic upper bound (worst-case growth rate).\nBig-Omega (Ω): Asymptotic lower bound (best-case lower limit).\nBig-Theta (Θ): Asymptotically tight bound (both upper and lower bound within constant factors).",
      difficulty: "Low",
      examRelevance: "Core Exam Foundation"
    },

    // --- COMPUTER NETWORKS FLASHCARDS (15 cards) ---
    {
      id: "fc_cn_1",
      subject: "Computer Networks",
      topic: "Network Models",
      unit: "Unit 1",
      q: "What are the 7 layers of the OSI Reference Model from bottom to top?",
      a: "1. Physical (bits)\n2. Data Link (frames)\n3. Network (packets)\n4. Transport (segments)\n5. Session (dialog control)\n6. Presentation (syntax/encryption)\n7. Application (network services).",
      difficulty: "Low",
      examRelevance: "10 Marks OSI vs TCP/IP"
    },
    {
      id: "fc_cn_2",
      subject: "Computer Networks",
      topic: "Transport Layer",
      unit: "Unit 4",
      q: "How does TCP 3-Way Handshake establish a reliable connection?",
      a: "1. Client sends SYN (seq = x)\n2. Server responds with SYN-ACK (seq = y, ack = x + 1)\n3. Client sends ACK (seq = x + 1, ack = y + 1).\nConnection is now ESTABLISHED and data transfer begins.",
      difficulty: "Medium",
      examRelevance: "10 Marks Protocol Flow"
    },
    {
      id: "fc_cn_3",
      subject: "Computer Networks",
      topic: "Transport Protocols",
      unit: "Unit 4",
      q: "What are the core differences between TCP and UDP?",
      a: "TCP: Connection-oriented, reliable, ordered delivery, flow control (sliding window), congestion control, 20-60 byte header. UDP: Connectionless, unreliable (best-effort), no ordering, no flow control, minimal 8-byte header (ideal for DNS, VoIP, streaming).",
      difficulty: "Low",
      examRelevance: "5 Marks Comparison"
    },
    {
      id: "fc_cn_4",
      subject: "Computer Networks",
      topic: "Network Layer",
      unit: "Unit 3",
      q: "What is IPv4 Subnetting and what is the formula for usable host addresses?",
      a: "Subnetting divides a large network into smaller sub-networks using a subnet mask. The formula for usable hosts per subnet is 2^(32 - prefix_length) - 2 (subtracting 2 for the Network ID and Broadcast Address).",
      difficulty: "Medium",
      examRelevance: "10 Marks Subnetting Numerical"
    },
    {
      id: "fc_cn_5",
      subject: "Computer Networks",
      topic: "IPv4 vs IPv6",
      unit: "Unit 3",
      q: "What are the key differences between IPv4 and IPv6?",
      a: "IPv4: 32-bit addresses (dotted decimal, ~4.3 billion addresses), manual/DHCP config, checksum in header, fragmentation by routers. IPv6: 128-bit addresses (hexadecimal notation), stateless autoconfiguration (SLAAC), fixed 40-byte base header, fragmentation by sender only.",
      difficulty: "Medium",
      examRelevance: "5 Marks Comparison"
    },
    {
      id: "fc_cn_6",
      subject: "Computer Networks",
      topic: "Data Link Layer",
      unit: "Unit 2",
      q: "What is the role of ARP (Address Resolution Protocol)?",
      a: "ARP translates a known logical IP address (32-bit) to a physical MAC address (48-bit) on the local Ethernet segment by broadcasting an ARP Request and receiving a unicast ARP Reply.",
      difficulty: "Low",
      examRelevance: "5 Marks Protocol Note"
    },
    {
      id: "fc_cn_7",
      subject: "Computer Networks",
      topic: "Error Detection",
      unit: "Unit 2",
      q: "How does Cyclic Redundancy Check (CRC) detect bit errors in transmission?",
      a: "The sender appends k zeros to the message bitstream and performs modulo-2 binary division using a predetermined generator polynomial. The remainder is attached as the FCS (Frame Check Sequence). The receiver divides the frame; a non-zero remainder indicates transmission error.",
      difficulty: "Medium",
      examRelevance: "10 Marks Numerical CRC"
    },
    {
      id: "fc_cn_8",
      subject: "Computer Networks",
      topic: "Flow Control",
      unit: "Unit 2",
      q: "What is the difference between Go-Back-N and Selective Repeat ARQ?",
      a: "Go-Back-N: Receiver accepts frames only in strict sequential order (window size = 1); sender retransmits all frames from the lost frame onward. Selective Repeat: Receiver buffers out-of-order frames (window size > 1); sender retransmits ONLY the specific unacknowledged frame.",
      difficulty: "High",
      examRelevance: "10 Marks ARQ Analysis"
    },
    {
      id: "fc_cn_9",
      subject: "Computer Networks",
      topic: "Routing Algorithms",
      unit: "Unit 3",
      q: "What is the Count-to-Infinity Problem in Distance Vector Routing and its solution?",
      a: "When a link goes down, routing loops cause distance metrics to increment infinitely step-by-step between neighboring nodes. Solutions include Split Horizon (never advertise route back to neighbor who provided it) and Poison Reverse (advertise cost as infinity).",
      difficulty: "High",
      examRelevance: "10 Marks Routing Theory"
    },
    {
      id: "fc_cn_10",
      subject: "Computer Networks",
      topic: "Application Layer",
      unit: "Unit 5",
      q: "How does DNS (Domain Name System) resolve a domain name hierarchically?",
      a: "1. Local DNS Resolver checks cache\n2. Queries Root DNS Server ('.')\n3. Queries TLD DNS Server (e.g. '.com')\n4. Queries Authoritative DNS Server for domain\n5. Returns IP address and caches locally. Uses UDP port 53 for queries.",
      difficulty: "Medium",
      examRelevance: "5 Marks Architecture"
    },
    {
      id: "fc_cn_11",
      subject: "Computer Networks",
      topic: "Application Layer",
      unit: "Unit 5",
      q: "What is the difference between HTTP/1.1 and HTTP/2?",
      a: "HTTP/1.1 uses text-based protocol and suffers from Head-of-Line blocking (one request per TCP connection at a time). HTTP/2 uses binary framing, multiplexes multiple concurrent streams over a single TCP connection, supports header compression (HPACK), and server push.",
      difficulty: "Medium",
      examRelevance: "5 Marks Modern Protocols"
    },
    {
      id: "fc_cn_12",
      subject: "Computer Networks",
      topic: "Congestion Control",
      unit: "Unit 4",
      q: "What are the 4 phases of TCP Congestion Control?",
      a: "1. Slow Start (cwnd doubles every RTT until ssthresh)\n2. Congestion Avoidance (cwnd increases linearly by 1 MSS per RTT)\n3. Fast Retransmit (retransmits on 3 duplicate ACKs before timeout)\n4. Fast Recovery (ssthresh = cwnd/2, avoids dropping back to 1 MSS).",
      difficulty: "High",
      examRelevance: "10 Marks Graph & Explanation"
    },
    {
      id: "fc_cn_13",
      subject: "Computer Networks",
      topic: "Network Devices",
      unit: "Unit 1",
      q: "Compare Hubs, Switches, and Routers in the networking stack.",
      a: "Hub: Physical layer (Layer 1), broadcasts bits to all ports (single collision domain). Switch: Data Link layer (Layer 2), forwards frames based on MAC addresses (separate collision domains per port). Router: Network layer (Layer 3), routes packets based on IP addresses (separate broadcast domains).",
      difficulty: "Low",
      examRelevance: "5 Marks Comparison"
    },
    {
      id: "fc_cn_14",
      subject: "Computer Networks",
      topic: "Application Layer",
      unit: "Unit 5",
      q: "How does DHCP (Dynamic Host Configuration Protocol) assign IP addresses (DORA)?",
      a: "1. Discover: Client broadcasts DHCPDISCOVER looking for servers\n2. Offer: DHCP server broadcasts DHCPOFFER with available IP\n3. Request: Client broadcasts DHCPREQUEST accepting the offer\n4. Acknowledge: Server sends DHCPACK confirming IP lease parameters.",
      difficulty: "Medium",
      examRelevance: "5 Marks Protocol Flow"
    },
    {
      id: "fc_cn_15",
      subject: "Computer Networks",
      topic: "Medium Access",
      unit: "Unit 2",
      q: "What is CSMA/CD vs CSMA/CA and where is each used?",
      a: "CSMA/CD (Collision Detection): Transmitters listen while sending; on collision, send jam signal and back off exponentially. Used in wired Ethernet. CSMA/CA (Collision Avoidance): Uses RTS/CTS handshake and inter-frame spacing before sending because radios cannot detect collisions while transmitting. Used in Wi-Fi (802.11).",
      difficulty: "Medium",
      examRelevance: "10 Marks MAC Protocols"
    },

    // --- DBMS FLASHCARDS (15 cards) ---
    {
      id: "fc_dbms_1",
      subject: "Database Management Systems",
      topic: "Relational Keys",
      unit: "Unit 2",
      q: "What is the difference between Primary Key, Candidate Key, and Foreign Key?",
      a: "Candidate Key: Minimal set of attributes that uniquely identifies every tuple in a table.\nPrimary Key: The specific candidate key chosen by database designer (cannot be NULL).\nForeign Key: Attribute in a child table referencing the Primary Key of a parent table to enforce referential integrity.",
      difficulty: "Low",
      examRelevance: "Core Exam Definition"
    },
    {
      id: "fc_dbms_2",
      subject: "Database Management Systems",
      topic: "Transactions",
      unit: "Unit 4",
      q: "What are the ACID Properties in Database Transactions?",
      a: "1. Atomicity: All operations in the transaction succeed or all are rolled back ('all-or-nothing').\n2. Consistency: Database transitions only between valid states satisfying all constraints.\n3. Isolation: Concurrent transactions execute without interfering with one another.\n4. Durability: Committed updates survive system crashes permanently.",
      difficulty: "Low",
      examRelevance: "10 Marks Theory Question"
    },
    {
      id: "fc_dbms_3",
      subject: "Database Management Systems",
      topic: "Normalization",
      unit: "Unit 3",
      q: "What is First Normal Form (1NF) and Second Normal Form (2NF)?",
      a: "1NF: All attribute values must be atomic (no multi-valued or composite attributes) and each row must be unique.\n2NF: Relation must be in 1NF AND have no partial dependency (no non-prime attribute may depend on a proper subset of any candidate key).",
      difficulty: "Medium",
      examRelevance: "10 Marks Normalization"
    },
    {
      id: "fc_dbms_4",
      subject: "Database Management Systems",
      topic: "Normalization",
      unit: "Unit 3",
      q: "What is Third Normal Form (3NF) vs Boyce-Codd Normal Form (BCNF)?",
      a: "3NF: For every functional dependency X -> Y, either X is a superkey OR Y is a prime attribute (eliminates transitive dependencies).\nBCNF: Strictly requires that for EVERY functional dependency X -> Y, X MUST be a superkey (eliminates anomalies from overlapping candidate keys).",
      difficulty: "High",
      examRelevance: "10 Marks Comparison & Decomposition"
    },
    {
      id: "fc_dbms_5",
      subject: "Database Management Systems",
      topic: "Concurrency Control",
      unit: "Unit 4",
      q: "What is Two-Phase Locking (2PL) and how does it guarantee Serializability?",
      a: "2PL has two phases:\n1. Growing Phase: Locks acquired, no locks released.\n2. Shrinking Phase: Locks released, no new locks acquired.\nGuaranteeing the lock point sequence ensures conflict serializability, but standard 2PL can still cause deadlocks.",
      difficulty: "High",
      examRelevance: "10 Marks Concurrency Protocol"
    },
    {
      id: "fc_dbms_6",
      subject: "Database Management Systems",
      topic: "SQL Joins",
      unit: "Unit 2",
      q: "Explain INNER JOIN, LEFT JOIN, and FULL OUTER JOIN in SQL.",
      a: "INNER JOIN: Returns rows where matching keys exist in both tables.\nLEFT JOIN: Returns all rows from left table and matched rows from right (NULL if no match).\nFULL OUTER JOIN: Returns all rows when there is a match in either left or right table.",
      difficulty: "Low",
      examRelevance: "5 Marks SQL Practice"
    },
    {
      id: "fc_dbms_7",
      subject: "Database Management Systems",
      topic: "Indexing",
      unit: "Unit 5",
      q: "Why are B+ Trees favored over Binary Search Trees for database disk indexing?",
      a: "B+ Trees have high fan-out (large branching factor), keeping tree height low (typically 3-4 levels for millions of records). This minimizes costly disk I/O operations. In addition, all leaf nodes are linked in a linked list for rapid range scans.",
      difficulty: "High",
      examRelevance: "10 Marks Indexing Architecture"
    },
    {
      id: "fc_dbms_8",
      subject: "Database Management Systems",
      topic: "Relational Algebra",
      unit: "Unit 2",
      q: "What are the fundamental operators in Relational Algebra?",
      a: "1. Selection (σ): Filters rows satisfying predicate\n2. Projection (π): Selects specific columns\n3. Union (∪): Combines tuples from two union-compatible relations\n4. Set Difference (-): Tuples in relation 1 but not relation 2\n5. Cartesian Product (✕): Pairs all rows from two relations\n6. Rename (ρ): Renames relation/attributes.",
      difficulty: "Medium",
      examRelevance: "10 Marks Query Translation"
    },
    {
      id: "fc_dbms_9",
      subject: "Database Management Systems",
      topic: "Database Architecture",
      unit: "Unit 1",
      q: "What is the 3-Tier ANSI-SPARC Architecture and Data Independence?",
      a: "Three levels: External (User views), Conceptual (Logical entity-relationship schema), Internal (Physical storage structures). Logical Data Independence: ability to modify conceptual schema without altering external views. Physical Data Independence: ability to alter physical storage without altering conceptual schema.",
      difficulty: "Low",
      examRelevance: "5 Marks Diagram"
    },
    {
      id: "fc_dbms_10",
      subject: "Database Management Systems",
      topic: "Concurrency Anomalies",
      unit: "Unit 4",
      q: "What are Dirty Read, Non-Repeatable Read, and Phantom Read?",
      a: "Dirty Read: Transaction reads uncommitted data written by another transaction (which may abort).\nNon-Repeatable Read: Transaction re-reads a row and finds altered column values.\nPhantom Read: Transaction re-executes a range query and finds newly inserted rows matching predicate.",
      difficulty: "Medium",
      examRelevance: "5 Marks Isolation Levels"
    },
    {
      id: "fc_dbms_11",
      subject: "Database Management Systems",
      topic: "Recovery Management",
      unit: "Unit 4",
      q: "How does Write-Ahead Logging (WAL) and Checkpointing support Crash Recovery?",
      a: "WAL rule dictates that log records describing data modifications must be written to stable storage BEFORE the modified page is written to disk. Checkpoints flush all dirty buffers to disk, allowing the recovery engine to avoid scanning log records prior to the checkpoint.",
      difficulty: "High",
      examRelevance: "10 Marks Recovery / ARIES"
    },
    {
      id: "fc_dbms_12",
      subject: "Database Management Systems",
      topic: "ER Modeling",
      unit: "Unit 1",
      q: "What is a Weak Entity Set and how is it identified in an ER diagram?",
      a: "A Weak Entity Set is an entity that does not possess sufficient attributes to form its own primary key. It depends on an identifying owner entity via an identifying relationship. Represented as double rectangles in ER diagrams; identified using owner's primary key + discriminator (partial key).",
      difficulty: "Low",
      examRelevance: "5 Marks ER Concept"
    },
    {
      id: "fc_dbms_13",
      subject: "Database Management Systems",
      topic: "Indexing",
      unit: "Unit 5",
      q: "What is the difference between Dense Index and Sparse Index?",
      a: "Dense Index: Contains an index record for EVERY search key value in the data file (faster search, larger index size). Sparse Index: Contains index records only for SOME search key values (typically one per disk block; smaller index size, requires searching within block).",
      difficulty: "Medium",
      examRelevance: "5 Marks Comparison"
    },
    {
      id: "fc_dbms_14",
      subject: "Database Management Systems",
      topic: "SQL Aggregation",
      unit: "Unit 2",
      q: "What is the difference between WHERE and HAVING clauses in SQL?",
      a: "WHERE filters individual rows BEFORE grouping is performed and cannot contain aggregate functions (COUNT, SUM, AVG). HAVING filters aggregated groups AFTER GROUP BY execution and evaluates conditions on aggregate results.",
      difficulty: "Low",
      examRelevance: "5 Marks SQL Rule"
    },
    {
      id: "fc_dbms_15",
      subject: "Database Management Systems",
      topic: "View Management",
      unit: "Unit 2",
      q: "What is a Materialized View vs a Virtual View in DBMS?",
      a: "Virtual View: A saved SQL query; the underlying query executes on the fly every time the view is referenced (always fresh data, zero storage). Materialized View: Physical table storing the precomputed query result on disk (instant queries, requires periodic refresh/maintenance overhead).",
      difficulty: "Medium",
      examRelevance: "5 Marks Concept"
    }
  ];

  // ----------------------------------------------------
  // 7. MCQ QUESTION BANK — Subject-Specific 15-Question Datasets
  // ----------------------------------------------------
  const MCQ_BANK = [
    // --- OPERATING SYSTEMS MCQS (15 Questions) ---
    {
      id: "mcq_os_1",
      subject: "Operating Systems",
      topic: "Page Replacement",
      unit: "Unit 4",
      q: "Which page replacement algorithm can exhibit Belady's Anomaly where increasing the number of frames increases page faults?",
      options: [
        "LRU (Least Recently Used)",
        "FIFO (First In First Out)",
        "Optimal Page Replacement",
        "LFU (Least Frequently Used)"
      ],
      answer: 1, // B
      explanation: "FIFO can exhibit Belady's Anomaly because it replaces the oldest loaded page without considering reference frequency or locality. Stack algorithms like LRU and Optimal never exhibit Belady's Anomaly.",
      difficulty: "Medium"
    },
    {
      id: "mcq_os_2",
      subject: "Operating Systems",
      topic: "Deadlocks",
      unit: "Unit 3",
      q: "Which of the following is NOT one of Coffman's four necessary conditions for deadlock occurrence?",
      options: [
        "Mutual Exclusion",
        "Hold and Wait",
        "Preemptive Resource Allocation",
        "Circular Wait"
      ],
      answer: 2, // C
      explanation: "The condition required for deadlock is 'No Preemption' (resources cannot be forcibly taken from a process). Preemption prevents deadlocks.",
      difficulty: "Low"
    },
    {
      id: "mcq_os_3",
      subject: "Operating Systems",
      topic: "Process Scheduling",
      unit: "Unit 2",
      q: "Which CPU scheduling algorithm achieves the minimum average waiting time for a given set of stationary processes?",
      options: [
        "First-Come, First-Served (FCFS)",
        "Round Robin (RR)",
        "Shortest Job First (SJF)",
        "Priority Scheduling"
      ],
      answer: 2, // C
      explanation: "SJF (and preemptive SJF/SRTF) is provably optimal for minimizing average waiting time by executing shorter jobs first, reducing queue wait times.",
      difficulty: "Medium"
    },
    {
      id: "mcq_os_4",
      subject: "Operating Systems",
      topic: "Process Synchronization",
      unit: "Unit 3",
      q: "If a counting semaphore S is initialized to 7, and 12 wait() operations and 8 signal() operations are performed, what is the final value of S?",
      options: [
        "3",
        "5",
        "2",
        "0"
      ],
      answer: 0, // A
      explanation: "Initial value = 7. Each wait() decrements by 1 (12 * -1 = -12). Each signal() increments by 1 (8 * +1 = +8). Final value = 7 - 12 + 8 = 3.",
      difficulty: "Medium"
    },
    {
      id: "mcq_os_5",
      subject: "Operating Systems",
      topic: "Memory Management",
      unit: "Unit 4",
      q: "In a paging system with a 32-bit virtual address and 4 KB page size, how many entries are present in a single-level Page Table?",
      options: [
        "2^10 entries (1,024)",
        "2^20 entries (1,048,576)",
        "2^12 entries (4,096)",
        "2^16 entries (65,536)"
      ],
      answer: 1, // B
      explanation: "Page size = 4 KB = 2^12 bytes, so offset = 12 bits. Number of page number bits = 32 - 12 = 20 bits. Total entries in page table = 2^20 = 1,048,576.",
      difficulty: "High"
    },
    {
      id: "mcq_os_6",
      subject: "Operating Systems",
      topic: "Deadlock Avoidance",
      unit: "Unit 3",
      q: "Banker's algorithm is primarily used in operating systems for which purpose?",
      options: [
        "Deadlock Prevention",
        "Deadlock Avoidance",
        "Deadlock Detection & Recovery",
        "Deadlock Ignorance"
      ],
      answer: 1, // B
      explanation: "Banker's Algorithm dynamically inspects resource requests against maximum claims to ensure the system never leaves a Safe State (Deadlock Avoidance).",
      difficulty: "Low"
    },
    {
      id: "mcq_os_7",
      subject: "Operating Systems",
      topic: "Threads & Concurrency",
      unit: "Unit 2",
      q: "Which resource is NOT shared among peer threads belonging to the same process?",
      options: [
        "Heap memory segment",
        "Global variables",
        "Program Counter and Stack",
        "Open file descriptors"
      ],
      answer: 2, // C
      explanation: "Each thread has its own private Program Counter, Register Set, and Call Stack to manage independent execution sequences. Heap and globals are shared.",
      difficulty: "Medium"
    },
    {
      id: "mcq_os_8",
      subject: "Operating Systems",
      topic: "Virtual Memory",
      unit: "Unit 4",
      q: "What causes Thrashing in an operating system?",
      a: 1,
      options: [
        "High CPU utilization and low I/O activity",
        "Processes spending more time servicing page faults than executing instructions",
        "A deadlock among multi-threaded processes",
        "Too many print jobs queued in spoolers"
      ],
      answer: 1, // B
      explanation: "Thrashing occurs when the sum of working set sizes exceeds available physical memory frames, causing endless page fault and swap cycles.",
      difficulty: "Low"
    },
    {
      id: "mcq_os_9",
      subject: "Operating Systems",
      topic: "Disk Scheduling",
      unit: "Unit 5",
      q: "Which disk scheduling algorithm moves the disk arm from one end of the disk to the other, servicing requests along the way, then reverses direction?",
      options: [
        "FCFS",
        "SSTF (Shortest Seek Time First)",
        "SCAN (Elevator Algorithm)",
        "C-LOOK"
      ],
      answer: 2, // C
      explanation: "The SCAN algorithm services requests while moving across cylinders in one direction until reaching the end, then reverses direction (like an elevator).",
      difficulty: "Low"
    },
    {
      id: "mcq_os_10",
      subject: "Operating Systems",
      topic: "Memory Management",
      unit: "Unit 4",
      q: "Given a TLB access time of 20 ns, main memory access time of 100 ns, and a TLB hit ratio of 90%, what is the Effective Memory Access Time (EAT)?",
      options: [
        "120 ns",
        "130 ns",
        "140 ns",
        "110 ns"
      ],
      answer: 1, // B
      explanation: "EAT = Hit_Ratio * (TLB + Mem) + (1 - Hit_Ratio) * (TLB + 2*Mem) = 0.90 * (20 + 100) + 0.10 * (20 + 200) = 0.90 * 120 + 0.10 * 220 = 108 + 22 = 130 ns.",
      difficulty: "High"
    },
    {
      id: "mcq_os_11",
      subject: "Operating Systems",
      topic: "File Systems",
      unit: "Unit 5",
      q: "In a Unix inode, if there are 12 direct block pointers and each block is 4 KB, what is the maximum file size accessible using ONLY direct pointers?",
      options: [
        "48 KB",
        "64 KB",
        "256 KB",
        "512 KB"
      ],
      answer: 0, // A
      explanation: "12 direct pointers * 4 KB per block = 48 KB accessible directly from the inode without indirect pointer lookups.",
      difficulty: "Medium"
    },
    {
      id: "mcq_os_12",
      subject: "Operating Systems",
      topic: "Process Scheduling",
      unit: "Unit 2",
      q: "In Round Robin scheduling, if the time quantum is chosen to be extremely large (larger than the longest burst time), the algorithm degrades to which policy?",
      options: [
        "Shortest Job First (SJF)",
        "First-Come, First-Served (FCFS)",
        "Priority Scheduling",
        "Multilevel Feedback Queue"
      ],
      answer: 1, // B
      explanation: "If the quantum exceeds all burst times, no process is ever preempted mid-burst, so processes complete strictly in arrival order (FCFS).",
      difficulty: "Low"
    },
    {
      id: "mcq_os_13",
      subject: "Operating Systems",
      topic: "Synchronization",
      unit: "Unit 3",
      q: "Which hardware instruction is widely supported by modern CPUs to implement atomic lock acquisition without race conditions?",
      options: [
        "Shift Arithmetic Right",
        "Test-and-Set / Compare-and-Swap (CAS)",
        "Branch if Greater Than",
        "Load Accumulator"
      ],
      answer: 1, // B
      explanation: "Test-and-Set and Compare-and-Swap (CAS) execute atomically in hardware, reading the lock status and updating it in a single indivisible memory cycle.",
      difficulty: "Medium"
    },
    {
      id: "mcq_os_14",
      subject: "Operating Systems",
      topic: "Virtual Memory",
      unit: "Unit 4",
      q: "What is the primary function of the Translation Lookaside Buffer (TLB)?",
      options: [
        "To store disk sector buffers in RAM",
        "To cache virtual page-to-physical frame address mappings in hardware",
        "To hold process control blocks",
        "To manage virtual page swaps on disk"
      ],
      answer: 1, // B
      explanation: "The TLB is an associative high-speed hardware cache in the MMU storing the most recently accessed page-to-frame translations.",
      difficulty: "Low"
    },
    {
      id: "mcq_os_15",
      subject: "Operating Systems",
      topic: "File Allocation",
      unit: "Unit 5",
      q: "Which file allocation method completely eliminates external fragmentation and supports fast direct/random access?",
      options: [
        "Contiguous Allocation",
        "Linked List Allocation",
        "Indexed Allocation",
        "Bit Vector Allocation"
      ],
      answer: 2, // C
      explanation: "Indexed allocation brings all block pointers together into an Index Block, allowing direct block computation without external fragmentation.",
      difficulty: "Medium"
    },

    // --- DATA STRUCTURES & ALGORITHMS MCQS (15 Questions) ---
    {
      id: "mcq_dsa_1",
      subject: "Data Structures & Algorithms",
      topic: "Time Complexity",
      unit: "Unit 1",
      q: "What is the worst-case time complexity of QuickSort when the pivot chosen is always the minimum or maximum element?",
      options: [
        "O(n log n)",
        "O(n²)",
        "O(n)",
        "O(log n)"
      ],
      answer: 1, // B
      explanation: "When partitions are maximally unbalanced (0 and n-1 elements), the recurrence is T(n) = T(n-1) + O(n), which solves to O(n²).",
      difficulty: "Low"
    },
    {
      id: "mcq_dsa_2",
      subject: "Data Structures & Algorithms",
      topic: "Stacks",
      unit: "Unit 2",
      q: "What is the postfix evaluation of the arithmetic expression: '6 3 2 + * 5 -' ?",
      options: [
        "25",
        "30",
        "35",
        "20"
      ],
      answer: 0, // A
      explanation: "Step 1: Push 6, 3, 2. Step 2: '+' pops 2, 3 -> (3+2)=5, push 5. Step 3: '*' pops 5, 6 -> (6*5)=30, push 30. Step 4: Push 5. Step 5: '-' pops 5, 30 -> (30-5)=25.",
      difficulty: "Medium"
    },
    {
      id: "mcq_dsa_3",
      subject: "Data Structures & Algorithms",
      topic: "Binary Search Trees",
      unit: "Unit 3",
      q: "Which tree traversal yields the elements of a Binary Search Tree (BST) in sorted ascending order?",
      options: [
        "Preorder Traversal (Root, Left, Right)",
        "Postorder Traversal (Left, Right, Root)",
        "Inorder Traversal (Left, Root, Right)",
        "Level Order Traversal"
      ],
      answer: 2, // C
      explanation: "By definition, left subtree keys < root < right subtree keys. Visiting Left, Root, Right (Inorder) guarantees strict ascending sorted output in O(n) time.",
      difficulty: "Low"
    },
    {
      id: "mcq_dsa_4",
      subject: "Data Structures & Algorithms",
      topic: "AVL Trees",
      unit: "Unit 3",
      q: "In an AVL tree, what is the valid range of balance factors permitted for any node?",
      options: [
        "{0, 1, 2}",
        "{-1, 0, 1}",
        "{-2, 0, 2}",
        "{-1, 1}"
      ],
      answer: 1, // B
      explanation: "An AVL tree enforces that for every node, |Height(Left) - Height(Right)| ≤ 1, meaning balance factors must be in {-1, 0, 1}.",
      difficulty: "Low"
    },
    {
      id: "mcq_dsa_5",
      subject: "Data Structures & Algorithms",
      topic: "Hashing",
      unit: "Unit 4",
      q: "In a hash table with m slots and n stored keys, what is the Load Factor (α)?",
      options: [
        "m / n",
        "n / m",
        "n * m",
        "log(n / m)"
      ],
      answer: 1, // B
      explanation: "The Load Factor α = n / m represents the average number of elements stored per bucket/slot in the hash table.",
      difficulty: "Low"
    },
    {
      id: "mcq_dsa_6",
      subject: "Data Structures & Algorithms",
      topic: "Graph Algorithms",
      unit: "Unit 5",
      q: "Dijkstra's Single-Source Shortest Path algorithm fails or produces incorrect results under which condition?",
      options: [
        "Directed Acyclic Graphs",
        "Graphs containing negative weight edges",
        "Dense graphs with many edges",
        "Unweighted graphs"
      ],
      answer: 1, // B
      explanation: "Dijkstra's algorithm greedily assumes that once a vertex is finalized, its shortest distance cannot decrease. Negative edge weights violate this greedy invariant. Bellman-Ford should be used instead.",
      difficulty: "Medium"
    },
    {
      id: "mcq_dsa_7",
      subject: "Data Structures & Algorithms",
      topic: "Minimum Spanning Tree",
      unit: "Unit 5",
      q: "Which data structure is used by Kruskal's algorithm to efficiently detect cycles when adding edges to an MST?",
      options: [
        "Segment Tree",
        "Disjoint Set Union (DSU / Union-Find)",
        "Priority Queue alone",
        "Red-Black Tree"
      ],
      answer: 1, // B
      explanation: "Kruskal's algorithm uses Disjoint Set Union (DSU) with path compression and union by rank to check if two vertices belong to the same component in nearly O(1) amortized time.",
      difficulty: "Medium"
    },
    {
      id: "mcq_dsa_8",
      subject: "Data Structures & Algorithms",
      topic: "Heaps",
      unit: "Unit 3",
      q: "What is the time complexity to build a Max-Heap of n elements from an unordered array using bottom-up Heapify?",
      options: [
        "O(n log n)",
        "O(n²)",
        "O(n)",
        "O(log n)"
      ],
      answer: 2, // C
      explanation: "Building a heap bottom-up involves summing node heights across levels: Σ (h * n / 2^(h+1)), which asymptotically converges to O(n) linear time.",
      difficulty: "High"
    },
    {
      id: "mcq_dsa_9",
      subject: "Data Structures & Algorithms",
      topic: "Linked Lists",
      unit: "Unit 2",
      q: "What algorithm is used to detect a cycle/loop in a Singly Linked List in O(n) time and O(1) auxiliary space?",
      options: [
        "Floyd's Cycle-Finding Algorithm (Tortoise and Hare)",
        "Dijkstra's Algorithm",
        "Kadane's Algorithm",
        "KMP String Search Algorithm"
      ],
      answer: 0, // A
      explanation: "Floyd's algorithm uses two pointers: slow moving 1 step and fast moving 2 steps. If a cycle exists, fast will catch up and match slow inside the loop in O(n) time without extra memory.",
      difficulty: "Low"
    },
    {
      id: "mcq_dsa_10",
      subject: "Data Structures & Algorithms",
      topic: "Sorting",
      unit: "Unit 4",
      q: "Which of the following sorting algorithms is Stable and has O(n log n) worst-case time complexity?",
      options: [
        "QuickSort",
        "HeapSort",
        "MergeSort",
        "Selection Sort"
      ],
      answer: 2, // C
      explanation: "MergeSort is guaranteed O(n log n) in all cases (best/average/worst) and is Stable (preserves the relative order of duplicate elements). QuickSort and HeapSort are unstable.",
      difficulty: "Medium"
    },
    {
      id: "mcq_dsa_11",
      subject: "Data Structures & Algorithms",
      topic: "Graph Traversal",
      unit: "Unit 5",
      q: "Topological sorting can be performed on which class of graphs?",
      options: [
        "Undirected Connected Graphs",
        "Directed Acyclic Graphs (DAG)",
        "Graphs with Negative Cycles",
        "Complete Bipartite Graphs"
      ],
      answer: 1, // B
      explanation: "Topological sorting provides a linear ordering of vertices such that for every directed edge u -> v, u appears before v. It is only possible on Directed Acyclic Graphs (DAGs).",
      difficulty: "Low"
    },
    {
      id: "mcq_dsa_12",
      subject: "Data Structures & Algorithms",
      topic: "Dynamic Programming",
      unit: "Unit 6",
      q: "What is the time complexity of the Dynamic Programming solution for the 0/1 Knapsack problem with n items and capacity W?",
      options: [
        "O(2^n)",
        "O(n * W)",
        "O(n log W)",
        "O(n²)"
      ],
      answer: 1, // B
      explanation: "The standard DP table has dimensions (n+1) x (W+1), requiring O(n * W) pseudo-polynomial time and space.",
      difficulty: "Medium"
    },
    {
      id: "mcq_dsa_13",
      subject: "Data Structures & Algorithms",
      topic: "Queues",
      unit: "Unit 2",
      q: "How many stacks are minimum required to implement a standard FIFO Queue?",
      options: [
        "1 stack",
        "2 stacks",
        "3 stacks",
        "4 stacks"
      ],
      answer: 1, // B
      explanation: "Two stacks are required: an input stack for enqueue and an output stack for dequeue. Reversing the elements from stack 1 into stack 2 restores FIFO order.",
      difficulty: "Low"
    },
    {
      id: "mcq_dsa_14",
      subject: "Data Structures & Algorithms",
      topic: "Binary Trees",
      unit: "Unit 3",
      q: "A strictly binary (full) tree with n leaf nodes contains how many total nodes?",
      options: [
        "2n",
        "2n - 1",
        "2n + 1",
        "n² - 1"
      ],
      answer: 1, // B
      explanation: "In a full binary tree where every internal node has 2 children, internal nodes = n - 1. Total nodes = leaves + internal = n + (n - 1) = 2n - 1.",
      difficulty: "Medium"
    },
    {
      id: "mcq_dsa_15",
      subject: "Data Structures & Algorithms",
      topic: "Complexity Analysis",
      unit: "Unit 1",
      q: "According to the Master Theorem, what is the time complexity of the recurrence T(n) = 2T(n/2) + O(n)?",
      options: [
        "O(n)",
        "O(n log n)",
        "O(n²)",
        "O(log n)"
      ],
      answer: 1, // B
      explanation: "Here a = 2, b = 2, f(n) = n. Since n^(log_b a) = n^(log_2 2) = n^1 = f(n), Case 2 of Master Theorem applies, yielding T(n) = Θ(n log n).",
      difficulty: "High"
    },

    // --- COMPUTER NETWORKS MCQS (15 Questions) ---
    {
      id: "mcq_cn_1",
      subject: "Computer Networks",
      topic: "OSI Model",
      unit: "Unit 1",
      q: "Which layer of the OSI model is responsible for logical IP addressing and path determination across heterogeneous networks?",
      options: [
        "Data Link Layer",
        "Transport Layer",
        "Network Layer",
        "Session Layer"
      ],
      answer: 2, // C
      explanation: "The Network Layer (Layer 3) handles logical end-to-end addressing (IPv4/IPv6), subnet routing, and packet forwarding.",
      difficulty: "Low"
    },
    {
      id: "mcq_cn_2",
      subject: "Computer Networks",
      topic: "Transport Layer",
      unit: "Unit 4",
      q: "How many packets are exchanged in total during a standard TCP 3-Way Handshake connection establishment?",
      options: [
        "2 (SYN, ACK)",
        "3 (SYN, SYN-ACK, ACK)",
        "4 (SYN, ACK, SYN, ACK)",
        "1 (SYN-ACK broadcast)"
      ],
      answer: 1, // B
      explanation: "The 3-way handshake exchanges: 1. SYN (from client) -> 2. SYN-ACK (from server) -> 3. ACK (from client) to establish a reliable synchronized connection.",
      difficulty: "Low"
    },
    {
      id: "mcq_cn_3",
      subject: "Computer Networks",
      topic: "IP Subnetting",
      unit: "Unit 3",
      q: "Given the CIDR network prefix 192.168.10.0/27, how many usable host IP addresses are available per subnet?",
      options: [
        "32 hosts",
        "30 hosts",
        "62 hosts",
        "14 hosts"
      ],
      answer: 1, // B
      explanation: "Prefix /27 leaves 32 - 27 = 5 host bits. Total addresses = 2^5 = 32. Subtracting Network ID and Broadcast address gives 32 - 2 = 30 usable host addresses.",
      difficulty: "Medium"
    },
    {
      id: "mcq_cn_4",
      subject: "Computer Networks",
      topic: "Data Link Protocols",
      unit: "Unit 2",
      q: "Which protocol translates a known 32-bit IP address into a 48-bit physical MAC address on a local area network?",
      options: [
        "DNS (Domain Name System)",
        "DHCP (Dynamic Host Configuration Protocol)",
        "ARP (Address Resolution Protocol)",
        "ICMP (Internet Control Message Protocol)"
      ],
      answer: 2, // C
      explanation: "ARP broadcasts a query asking 'Who has IP x.x.x.x? Tell me your MAC', and the destination replies with its 48-bit MAC address.",
      difficulty: "Low"
    },
    {
      id: "mcq_cn_5",
      subject: "Computer Networks",
      topic: "Transport Protocols",
      unit: "Unit 4",
      q: "What is the standard header size of a minimal User Datagram Protocol (UDP) segment?",
      options: [
        "8 bytes",
        "20 bytes",
        "32 bytes",
        "40 bytes"
      ],
      answer: 0, // A
      explanation: "UDP has a compact fixed header of 8 bytes: Source Port (2B), Destination Port (2B), Length (2B), and Checksum (2B).",
      difficulty: "Low"
    },
    {
      id: "mcq_cn_6",
      subject: "Computer Networks",
      topic: "Application Protocols",
      unit: "Unit 5",
      q: "DNS queries between a client resolver and DNS servers primarily use which transport protocol and default port?",
      options: [
        "TCP Port 80",
        "UDP Port 53",
        "TCP Port 443",
        "UDP Port 67"
      ],
      answer: 1, // B
      explanation: "DNS uses UDP on port 53 for standard lightweight lookups because of speed and low overhead. TCP 53 is used for zone transfers or large responses > 512 bytes.",
      difficulty: "Low"
    },
    {
      id: "mcq_cn_7",
      subject: "Computer Networks",
      topic: "IPv6 Architecture",
      unit: "Unit 3",
      q: "What is the total address length of an Internet Protocol Version 6 (IPv6) address?",
      options: [
        "32 bits",
        "64 bits",
        "128 bits",
        "256 bits"
      ],
      answer: 2, // C
      explanation: "IPv6 uses 128-bit addresses (16 bytes) represented as 8 groups of 4 hexadecimal digits, providing 2^128 unique addresses.",
      difficulty: "Low"
    },
    {
      id: "mcq_cn_8",
      subject: "Computer Networks",
      topic: "Flow Control",
      unit: "Unit 2",
      q: "In the Go-Back-N ARQ protocol with an m-bit sequence number, what is the maximum sender window size?",
      options: [
        "2^m",
        "2^m - 1",
        "2^(m-1)",
        "m"
      ],
      answer: 1, // B
      explanation: "In Go-Back-N, the sender window size cannot exceed 2^m - 1 to prevent ambiguity between duplicate ACKs and newly transmitted frames.",
      difficulty: "High"
    },
    {
      id: "mcq_cn_9",
      subject: "Computer Networks",
      topic: "Routing Protocols",
      unit: "Unit 3",
      q: "Open Shortest Path First (OSPF) routing protocol is based on which algorithm?",
      options: [
        "Bellman-Ford Distance Vector algorithm",
        "Dijkstra's Link-State algorithm",
        "Floyd-Warshall All-Pairs algorithm",
        "Ford-Fulkerson Max Flow algorithm"
      ],
      answer: 1, // B
      explanation: "OSPF is a Link-State routing protocol that floods link state advertisements (LSAs) and builds a shortest-path tree using Dijkstra's algorithm.",
      difficulty: "Medium"
    },
    {
      id: "mcq_cn_10",
      subject: "Computer Networks",
      topic: "Error Control",
      unit: "Unit 2",
      q: "In Cyclic Redundancy Check (CRC), if the generator polynomial has degree r, how many zero bits are appended to the data bits before division?",
      options: [
        "r - 1 bits",
        "r bits",
        "r + 1 bits",
        "2r bits"
      ],
      answer: 1, // B
      explanation: "For a generator polynomial G(x) of degree r, exactly r zeros are appended to the data unit. The resulting r-bit remainder becomes the checksum (FCS).",
      difficulty: "Medium"
    },
    {
      id: "mcq_cn_11",
      subject: "Computer Networks",
      topic: "Medium Access",
      unit: "Unit 2",
      q: "Why is CSMA/CA (Collision Avoidance) used in wireless Wi-Fi (802.11) instead of CSMA/CD?",
      options: [
        "Wi-Fi networks have no collisions",
        "Wireless transceivers cannot reliably detect collisions while transmitting due to signal attenuation (Hidden Terminal Problem)",
        "Wi-Fi operates exclusively on full duplex cables",
        "CSMA/CD requires satellite connectivity"
      ],
      answer: 1, // B
      explanation: "In wireless transmission, the transmitted signal power drowns out any incoming collision signal, and hidden terminals cannot be sensed, making collision avoidance (RTS/CTS) essential.",
      difficulty: "High"
    },
    {
      id: "mcq_cn_12",
      subject: "Computer Networks",
      topic: "Application Protocols",
      unit: "Unit 5",
      q: "What is the correct 4-step message exchange sequence in DHCP address allocation?",
      options: [
        "Discover, Offer, Request, Acknowledge (DORA)",
        "Request, Discover, Acknowledge, Offer",
        "SYN, SYN-ACK, ACK, FIN",
        "Query, Response, Authorize, Bind"
      ],
      answer: 0, // A
      explanation: "DHCP follows the DORA sequence: DHCPDISCOVER (client) -> DHCPOFFER (server) -> DHCPREQUEST (client) -> DHCPACK (server).",
      difficulty: "Low"
    },
    {
      id: "mcq_cn_13",
      subject: "Computer Networks",
      topic: "Network Security & Protocols",
      unit: "Unit 5",
      q: "Which protocol provides secure encrypted web communication over port 443 using TLS/SSL?",
      options: [
        "HTTP",
        "HTTPS",
        "FTP",
        "Telnet"
      ],
      answer: 1, // B
      explanation: "HTTPS (Hypertext Transfer Protocol Secure) layers HTTP over TLS/SSL cryptographic protocols to secure data transmission on TCP port 443.",
      difficulty: "Low"
    },
    {
      id: "mcq_cn_14",
      subject: "Computer Networks",
      topic: "Congestion Control",
      unit: "Unit 4",
      q: "During the Slow Start phase of TCP Reno, how does the Congestion Window (cwnd) grow?",
      options: [
        "Linearly by 1 MSS per RTT",
        "Exponentially (doubles every RTT)",
        "Logarithmically",
        "Stays constant at ssthresh"
      ],
      answer: 1, // B
      explanation: "In Slow Start, cwnd increases by 1 MSS for each acknowledged segment, effectively doubling cwnd every Round-Trip Time (exponential growth) until reaching ssthresh.",
      difficulty: "Medium"
    },
    {
      id: "mcq_cn_15",
      subject: "Computer Networks",
      topic: "Network Layer",
      unit: "Unit 3",
      q: "Which protocol is used by network diagnostic tools like 'ping' and 'traceroute' to report errors and connectivity?",
      options: [
        "IGMP",
        "ICMP (Internet Control Message Protocol)",
        "SNMP",
        "BGP"
      ],
      answer: 1, // B
      explanation: "ICMP generates error messages (Destination Unreachable, Time Exceeded for TTL=0) and Echo Request/Echo Reply messages used by ping.",
      difficulty: "Low"
    },

    // --- DBMS MCQS (15 Questions) ---
    {
      id: "mcq_dbms_1",
      subject: "Database Management Systems",
      topic: "Transactions",
      unit: "Unit 4",
      q: "Which ACID property guarantees that all operations in a database transaction are completed successfully or none take effect?",
      options: [
        "Consistency",
        "Atomicity",
        "Isolation",
        "Durability"
      ],
      answer: 1, // B
      explanation: "Atomicity ensures 'all-or-nothing' execution: if any statement within a transaction fails, all previously executed changes are rolled back completely.",
      difficulty: "Low"
    },
    {
      id: "mcq_dbms_2",
      subject: "Database Management Systems",
      topic: "Normalization",
      unit: "Unit 3",
      q: "A relation is in Second Normal Form (2NF) if and only if it is in 1NF and contains NO:",
      options: [
        "Transitive dependencies",
        "Partial functional dependencies on any candidate key",
        "Multi-valued dependencies",
        "Foreign keys"
      ],
      answer: 1, // B
      explanation: "2NF requires eliminating partial dependencies where a non-prime attribute depends on a proper subset of a composite candidate key.",
      difficulty: "Low"
    },
    {
      id: "mcq_dbms_3",
      subject: "Database Management Systems",
      topic: "Normalization",
      unit: "Unit 3",
      q: "In Boyce-Codd Normal Form (BCNF), for every non-trivial functional dependency X -> Y, what condition must hold for X?",
      options: [
        "X must be a prime attribute",
        "X must be a Super Key",
        "Y must be a Super Key",
        "X and Y must belong to the same domain"
      ],
      answer: 1, // B
      explanation: "BCNF is a stricter version of 3NF requiring that the determinant X in every functional dependency X -> Y must strictly be a Super Key.",
      difficulty: "Medium"
    },
    {
      id: "mcq_dbms_4",
      subject: "Database Management Systems",
      topic: "Relational Keys",
      unit: "Unit 2",
      q: "Which integrity constraint enforces that a foreign key value in a child table must match a primary key value in the referenced parent table (or be NULL)?",
      options: [
        "Entity Integrity Constraint",
        "Referential Integrity Constraint",
        "Domain Integrity Constraint",
        "Key Integrity Constraint"
      ],
      answer: 1, // B
      explanation: "Referential Integrity ensures consistency between related tables by forbidding foreign key references to non-existent parent primary key tuples.",
      difficulty: "Low"
    },
    {
      id: "mcq_dbms_5",
      subject: "Database Management Systems",
      topic: "Concurrency Control",
      unit: "Unit 4",
      q: "Under the Strict Two-Phase Locking (Strict 2PL) protocol, when are all Exclusive (write) locks held by a transaction released?",
      options: [
        "As soon as the write operation finishes",
        "Only after the transaction commits or aborts",
        "At the start of the shrinking phase",
        "When requested by another transaction"
      ],
      answer: 1, // B
      explanation: "Strict 2PL holds all exclusive locks until transaction commit/abort to prevent Cascading Aborts and ensure strict recoverability.",
      difficulty: "High"
    },
    {
      id: "mcq_dbms_6",
      subject: "Database Management Systems",
      topic: "SQL Queries",
      unit: "Unit 2",
      q: "What is the primary difference between the WHERE and HAVING clauses in SQL?",
      options: [
        "WHERE is used for numbers, HAVING is used for strings",
        "WHERE filters rows before grouping; HAVING filters groups after aggregation",
        "HAVING is used before GROUP BY, WHERE is used after",
        "WHERE can use aggregate functions, HAVING cannot"
      ],
      answer: 1, // B
      explanation: "WHERE applies conditions to individual table tuples before aggregation. HAVING evaluates conditions on aggregated summary values produced by GROUP BY.",
      difficulty: "Low"
    },
    {
      id: "mcq_dbms_7",
      subject: "Database Management Systems",
      topic: "Indexing",
      unit: "Unit 5",
      q: "In a B+ tree index of order p, where are the actual data record pointers or records stored?",
      options: [
        "Evenly distributed across all internal and leaf nodes",
        "Exclusively in the leaf nodes",
        "Only in the root node",
        "In a separate bitmap vector"
      ],
      answer: 1, // B
      explanation: "In a B+ Tree, all data pointers/records reside exclusively in the leaf nodes (which are doubly linked for range scans). Internal nodes hold only search router keys.",
      difficulty: "Medium"
    },
    {
      id: "mcq_dbms_8",
      subject: "Database Management Systems",
      topic: "Relational Algebra",
      unit: "Unit 2",
      q: "Which relational algebra operator selects specific columns/attributes from a relation and eliminates duplicate rows?",
      options: [
        "Selection (σ)",
        "Projection (π)",
        "Cartesian Product (✕)",
        "Join (⋈)"
      ],
      answer: 1, // B
      explanation: "Projection (π) extracts specified attribute columns from a relation, and standard relational algebra automatically eliminates duplicate tuples.",
      difficulty: "Low"
    },
    {
      id: "mcq_dbms_9",
      subject: "Database Management Systems",
      topic: "Concurrency Anomalies",
      unit: "Unit 4",
      q: "A transaction T1 reads data that has been modified by an uncommitted transaction T2 which subsequently aborts. What is this phenomenon called?",
      options: [
        "Lost Update",
        "Dirty Read (Uncommitted Dependency)",
        "Non-Repeatable Read",
        "Phantom Read"
      ],
      answer: 1, // B
      explanation: "A Dirty Read occurs when a transaction reads intermediate uncommitted modifications of another transaction that eventually rolls back.",
      difficulty: "Medium"
    },
    {
      id: "mcq_dbms_10",
      subject: "Database Management Systems",
      topic: "Database Architecture",
      unit: "Unit 1",
      q: "The ability to modify the physical storage structures or devices without altering the conceptual/logical schema is known as:",
      options: [
        "Logical Data Independence",
        "Physical Data Independence",
        "View Materialization",
        "Schema Normalization"
      ],
      answer: 1, // B
      explanation: "Physical Data Independence decouples conceptual database logic from internal storage representations like file structures, indexes, and block sizes.",
      difficulty: "Low"
    },
    {
      id: "mcq_dbms_11",
      subject: "Database Management Systems",
      topic: "SQL Joins",
      unit: "Unit 2",
      q: "If Table A has 5 rows and Table B has 4 rows, how many rows are produced by a CROSS JOIN (Cartesian Product) between A and B?",
      options: [
        "9 rows",
        "20 rows",
        "1 row",
        "5 rows"
      ],
      answer: 1, // B
      explanation: "A Cartesian Product pairs every tuple of Table A with every tuple of Table B: 5 * 4 = 20 total result rows.",
      difficulty: "Low"
    },
    {
      id: "mcq_dbms_12",
      subject: "Database Management Systems",
      topic: "Deadlock Handling",
      unit: "Unit 4",
      q: "In deadlock prevention, the 'Wait-Die' scheme is based on transaction timestamps. If an older transaction T_old requests a resource held by a younger transaction T_young, what happens?",
      options: [
        "T_old dies (aborts)",
        "T_old is allowed to wait",
        "T_young is aborted immediately (wounded)",
        "Both transactions rollback"
      ],
      answer: 1, // B
      explanation: "In Wait-Die (non-preemptive): older transactions wait for younger ones (T_old is allowed to wait), while younger transactions requesting from older ones die immediately.",
      difficulty: "High"
    },
    {
      id: "mcq_dbms_13",
      subject: "Database Management Systems",
      topic: "Crash Recovery",
      unit: "Unit 4",
      q: "In Write-Ahead Logging (WAL), what must be written to stable storage before a database page modification is flushed to disk?",
      options: [
        "The entire database backup",
        "The corresponding log record containing undo and redo information",
        "The primary key index",
        "The schema DDL definition"
      ],
      answer: 1, // B
      explanation: "WAL protocol mandates writing the log record to stable disk before the dirty database page is written to disk, ensuring recovery is always possible.",
      difficulty: "Medium"
    },
    {
      id: "mcq_dbms_14",
      subject: "Database Management Systems",
      topic: "Normalization",
      unit: "Unit 3",
      q: "What is a Transitive Dependency in relational database design?",
      options: [
        "A -> B and B -> C, where non-prime attribute C indirectly depends on primary key A through non-prime B",
        "A composite key where all attributes depend on each other",
        "A dependency between two primary keys in different tables",
        "A relationship between tables without a foreign key"
      ],
      answer: 0, // A
      explanation: "A transitive dependency occurs when X -> Y and Y -> Z hold, making non-prime attribute Z depend on X through intermediate attribute Y. 3NF eliminates this.",
      difficulty: "Medium"
    },
    {
      id: "mcq_dbms_15",
      subject: "Database Management Systems",
      topic: "ER Modeling",
      unit: "Unit 1",
      q: "In an Entity-Relationship (ER) diagram, how is a Multi-Valued Attribute (such as multiple phone numbers) represented?",
      options: [
        "Dashed Ellipse",
        "Double Ellipse",
        "Double Rectangle",
        "Diamond Box"
      ],
      answer: 1, // B
      explanation: "In Chen's ER notation, a double ellipse denotes a multi-valued attribute; a dashed ellipse denotes a derived attribute, and a double rectangle denotes a weak entity.",
      difficulty: "Low"
    }
  ];


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
    const activePersona = persona || "socratic";
    const activeMode = mode || "explain";

    // 1. Check if the student is responding to a Socratic check-in question or conversational turn
    const isStudentAnswer = /^(yes|no|because|i think|my answer|the answer|it is|it will|it means|due to|option|correct|true|false)\b/i.test(q.trim()) ||
      (q.trim().length < 80 && (q.includes("because") || q.includes("increases") || q.includes("decreases") || q.includes("constant") || q.includes("zero") || q.includes("depends on")));

    if (isStudentAnswer) {
      return (
        "<div class=\"space-y-2.5 text-xs sm:text-sm leading-relaxed\">" +
          "<div class=\"p-3 rounded-xl bg-primary/10 border border-primary/30 text-xs\">" +
            "<div class=\"flex items-center gap-1.5 text-primary font-bold mb-1\">" +
              "<span class=\"material-symbols-outlined text-sm\">psychology_alt</span>" +
              "<span>Socratic Coach Evaluation:</span>" +
            "</div>" +
            "<p class=\"text-on-surface mb-2\">Excellent active engagement! Your reasoning: <em>\"" + String(query).replace(/[<>]/g, "") + "\"</em> shows you are analyzing the underlying mechanics.</p>" +
            "<p class=\"text-on-surface-variant mb-2\"><strong>Tutor Analysis:</strong> In university assessments, remember to anchor your explanation in first principles (state the governing equation, draw the state graph, and specify the physical or computational constraints).</p>" +
            "<div class=\"mt-2 pt-2 border-t border-primary/20 text-primary font-semibold flex items-center gap-1\">" +
              "<span class=\"material-symbols-outlined text-xs\">help</span>" +
              "<span>Next Step: Would you like to see a 5-mark university rubric, or test another concept?</span>" +
            "</div>" +
          "</div>" +
        "</div>"
      );
    }

    // 2. Direct AI_KNOWLEDGE match
    let matched = null;
    if (q.includes("process") || q.includes("thread") || q.includes("pcb")) matched = AI_KNOWLEDGE["process vs thread"];
    else if (q.includes("deadlock") || q.includes("banker") || q.includes("coffman") || q.includes("semaphore") || q.includes("peterson")) matched = AI_KNOWLEDGE["deadlock"];
    else if (q.includes("page") || q.includes("paging") || q.includes("tlb") || q.includes("memory") || q.includes("belady") || q.includes("lru")) matched = AI_KNOWLEDGE["paging"];
    else if (q.includes("subnet") || q.includes("cidr") || q.includes("ip") || q.includes("routing") || q.includes("ospf")) matched = AI_KNOWLEDGE["subnet"];
    else if (q.includes("tcp") || q.includes("handshake") || q.includes("congestion") || q.includes("osi") || q.includes("sliding")) matched = AI_KNOWLEDGE["tcp"];
    else if (q.includes("bcnf") || q.includes("normal") || q.includes("3nf") || q.includes("acid") || q.includes("sql") || q.includes("dbms")) matched = AI_KNOWLEDGE["bcnf"];

    // 3. Dynamic lookup across all 70 subjects & chapters in ChaptersEngine
    if (!matched) {
      let engine = null;
      if (typeof window !== "undefined" && window.EduPrep && window.EduPrep.chaptersEngine) {
        engine = window.EduPrep.chaptersEngine;
      } else if (typeof global !== "undefined" && global.ChaptersEngine) {
        engine = global.ChaptersEngine;
      } else if (typeof require === "function") {
        try { engine = require("./eduprep_chapters_data.js"); } catch (e) {}
      }

      if (engine && engine.rawCatalog) {
        const words = q.split(/[\s,._\-:;?!]+/).filter(function (w) { return w.length > 2; });
        let bestChapter = null;
        let bestScore = 0;

        for (const subId in engine.rawCatalog) {
          const sems = engine.rawCatalog[subId];
          for (const s in sems) {
            const chList = sems[s];
            if (!Array.isArray(chList)) continue;
            for (let i = 0; i < chList.length; i++) {
              const ch = chList[i];
              let score = 0;
              const chTitleLower = (ch.title || "").toLowerCase();
              const subNameLower = (ch.subjectName || "").toLowerCase();
              if (q.includes(chTitleLower) && chTitleLower.length > 3) score += 50;
              if (q.includes(subNameLower) && subNameLower.length > 3) score += 30;

              words.forEach(function (w) {
                if (chTitleLower.includes(w)) score += 10;
                if (subNameLower.includes(w)) score += 6;
              });

              if (ch.notes && ch.notes.keyDefinitions) {
                ch.notes.keyDefinitions.forEach(function (kd) {
                  const tLower = (kd.term || "").toLowerCase();
                  if (q.includes(tLower) && tLower.length > 2) score += 25;
                  words.forEach(function (w) {
                    if (tLower.includes(w)) score += 8;
                  });
                });
              }

              if (score > bestScore) {
                bestScore = score;
                bestChapter = ch;
              }
            }
          }
        }

        if (bestChapter && bestScore >= 12) {
          const notes = bestChapter.notes || {};
          const keyDefs = notes.keyDefinitions || [];
          const concepts = notes.conceptualExplanations || [];
          const formulas = notes.formulasOrRules || [];
          const examTips = notes.examTips || [];

          const points = [];
          if (keyDefs.length > 0) {
            points.push("Definition & Core Term: " + keyDefs[0].term + " — " + keyDefs[0].definition);
          }
          if (concepts.length > 0) {
            points.push("Mechanism & Working: " + concepts[0].content);
          }
          if (concepts.length > 1) {
            points.push("Analytical Context: " + concepts[1].content);
          }
          if (keyDefs.length > 1 && points.length < 3) {
            points.push("Fundamental Property: " + keyDefs[1].term + " — " + keyDefs[1].definition);
          }

          let formStr = formulas.length > 0 ? (formulas[0].name ? formulas[0].name + ": " : "") + formulas[0].formula : "Key Standard: " + (bestChapter.description || "Follow standard university derivation framework.");
          let tipStr = examTips.length > 0 ? examTips[0] : "For high marks, state the technical definition, draw the architectural/flow diagram, and provide a concrete numerical or clinical example.";

          matched = {
            title: bestChapter.title + " (" + bestChapter.subjectName + " — " + (bestChapter.periodLabel || "Syllabus") + ")",
            summary: bestChapter.description || notes.attribution || "Core university curriculum topic in " + bestChapter.subjectName + ".",
            keyPoints: points.length > 0 ? points : [
              "Key Definition: Foundational principle in " + bestChapter.subjectName + ".",
              "Working Steps: Step-by-step analytical derivation and practical applications.",
              "Exam Weightage: High frequency theory and numerical question in university finals."
            ],
            formula: formStr,
            examTip: tipStr,
            socraticQuestion: "Now that you understand " + bestChapter.title + ", can you explain what happens when the main operating parameters change? Reply with your thoughts and we'll analyze it together!"
          };
        }
      }
    }

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
        examTip: "University examiners award full marks when you underline key technical terms and include a neat labeled diagram or trace table.",
        socraticQuestion: "Before moving to the next topic: Can you state the primary condition or equation for " + cleanTopic + " in your own words? Reply below and let's check!"
      };
    }

    let introPrefix = "";
    if (activePersona === "socratic" || activePersona === "encouraging") {
      introPrefix = "<p class=\"text-xs text-primary font-semibold mb-2 flex items-center gap-1.5\"><span class=\"material-symbols-outlined text-sm\">psychology</span> Socratic Academic Tutor: Great inquiry! Let's explore this step-by-step so you gain deep conceptual mastery:</p>";
    } else if (activePersona === "technical") {
      introPrefix = "<p class=\"text-xs text-secondary font-semibold mb-2 flex items-center gap-1.5\"><span class=\"material-symbols-outlined text-sm\">precision_manufacturing</span> Technical Expert: Rigorous formal definition, algorithmic invariants, and system architecture:</p>";
    } else if (activePersona === "concise") {
      introPrefix = "<p class=\"text-xs text-tertiary font-semibold mb-2 flex items-center gap-1.5\"><span class=\"material-symbols-outlined text-sm\">bolt</span> Concise Revision Coach: High-yield bullet checklist for rapid recall before exams:</p>";
    } else {
      introPrefix = "<p class=\"text-xs text-primary font-semibold mb-2 flex items-center gap-1.5\"><span class=\"material-symbols-outlined text-sm\">school</span> University Exam Coach: Structured breakdown aligned with university marking patterns:</p>";
    }

    let modeBadge = "";
    if (activeMode === "five_mark" || activeMode === "5mark") {
      modeBadge = "<div class=\"mb-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider\"><span class=\"material-symbols-outlined text-xs\">assignment</span> 5-Mark University Rubric (Definition + Working + Diagram/Formula + 1 Application)</div>";
    } else if (activeMode === "ten_mark" || activeMode === "10mark") {
      modeBadge = "<div class=\"mb-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-wider\"><span class=\"material-symbols-outlined text-xs\">menu_book</span> 10-Mark Blueprint (Introduction + System Architecture + Step-by-Step Derivation + Examiner Warning)</div>";
    } else if (activeMode === "quiz_me" || activeMode === "quiz") {
      modeBadge = "<div class=\"mb-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary/10 border border-tertiary/20 text-tertiary text-[10px] font-bold uppercase tracking-wider\"><span class=\"material-symbols-outlined text-xs\">help_center</span> Socratic Diagnostic Checkpoint</div>";
    } else {
      modeBadge = "<div class=\"mb-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high border border-outline-variant/40 text-on-surface-variant text-[10px] font-bold uppercase tracking-wider\"><span class=\"material-symbols-outlined text-xs\">auto_stories</span> Socratic Conceptual Walkthrough</div>";
    }

    const bulletsHtml = matched.keyPoints.map(function (pt) {
      return "<li class=\"mb-1.5\">" + pt + "</li>";
    }).join("");

    const socraticQText = matched.socraticQuestion || ("To test your conceptual clarity: How would you explain the core mechanism of " + matched.title + " if asked in a 2-mark viva? Reply to me, and we'll refine it together!");

    const socraticCardHtml =
      "<div class=\"mt-3 p-3 rounded-xl bg-surface-container border border-primary/30 text-xs shadow-sm\">" +
        "<div class=\"flex items-center gap-1.5 text-primary font-bold mb-1.5\">" +
          "<span class=\"material-symbols-outlined text-sm\">psychology_alt</span>" +
          "<span>Interactive Socratic Check-In:</span>" +
        "</div>" +
        "<p class=\"text-on-surface mb-2 leading-relaxed\">" + socraticQText + "</p>" +
        "<div class=\"text-[11px] text-on-surface-variant flex items-center gap-1\">" +
          "<span class=\"material-symbols-outlined text-xs text-primary\">edit_note</span>" +
          "<span>Type your answer in the chatbox below — I'll evaluate your response and give you instant feedback!</span>" +
        "</div>" +
      "</div>";

    return (
      "<div class=\"space-y-2.5 text-xs sm:text-sm leading-relaxed\">" +
        introPrefix +
        modeBadge +
        "<h4 class=\"font-bold text-on-surface text-sm\">" + matched.title + "</h4>" +
        "<p class=\"text-on-surface-variant\">" + matched.summary + "</p>" +
        "<ul class=\"list-disc pl-5 text-on-surface space-y-1\">" + bulletsHtml + "</ul>" +
        "<div class=\"p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 font-mono text-xs text-amber-900 dark:text-amber-200\">" +
          "<strong>Formula / Key Rule:</strong> " + matched.formula +
        "</div>" +
        "<div class=\"p-2.5 rounded-lg bg-primary-fixed/30 border border-primary/20 text-xs text-on-surface\">" +
          "<strong class=\"text-primary\">Exam Scoring Tip:</strong> " + matched.examTip +
        "</div>" +
        socraticCardHtml +
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
      id: null,
      name: "Student Learner",
      email: "",
      role: "student",
      authMode: "unauthenticated",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKTVTYsIgi8LHdNnRRuWq7WIQKHVif0TlNP2ZGt5StF7Jud3Gs6vJQFkiI_qUrzoEb70z07NIkSS2_FPOt1QOJAbG_z1UCQF3WZREwn8LQ303AF2KGL_FvIsWwcEBv_58SCacYxsAa4LwQhFIaWqE0p3A6nQmz2-PaZX8Kg5GnREbykYMsqeY9iQUPepRuFz-BLvUMNC7zQs_yEkbyzAAZa8CifAo7-8Qk5s6x_H8lKuQkdoWTzOKzRA",
      dailyGoal: "3.5 Hours",
      streakDays: 0
    },
    profile: {
      name: "Student Learner",
      email: "",
      role: "student",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKTVTYsIgi8LHdNnRRuWq7WIQKHVif0TlNP2ZGt5StF7Jud3Gs6vJQFkiI_qUrzoEb70z07NIkSS2_FPOt1QOJAbG_z1UCQF3WZREwn8LQ303AF2KGL_FvIsWwcEBv_58SCacYxsAa4LwQhFIaWqE0p3A6nQmz2-PaZX8Kg5GnREbykYMsqeY9iQUPepRuFz-BLvUMNC7zQs_yEkbyzAAZa8CifAo7-8Qk5s6x_H8lKuQkdoWTzOKzRA",
      bio: "Second-year Computer Engineering student preparing for Semester 4 university examinations.",
      studyGoalHours: 4,
      difficultyPreference: "Standard",
      streakDays: 0,
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
      completedChapters: ["eng_os_sem4_ch1", "eng_os_sem4_ch2"],
      lastActiveSubject: "Operating Systems",
      lastActiveChapter: "eng_os_sem4_ch3",
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

    streamSubjects: STREAM_SUBJECTS,

    getStreamSubjects: function (streamKeyOrName) {
      if (!streamKeyOrName) return [];
      let key = String(streamKeyOrName).trim().toLowerCase();
      if (key === "biology" || key === "biology/medical" || key === "biology / medical" || key === "med") {
        key = "medical";
      }
      return STREAM_SUBJECTS[key] || [];
    },

    getStreams: function () {
      return [
        { id: "engineering", name: "Engineering", count: STREAM_SUBJECTS.engineering.length },
        { id: "medical", name: "Biology / Medical", count: STREAM_SUBJECTS.medical.length },
        { id: "commerce", name: "Commerce", count: STREAM_SUBJECTS.commerce.length },
        { id: "arts", name: "Arts", count: STREAM_SUBJECTS.arts.length }
      ];
    },

    getStreamName: function (streamKey) {
      const k = String(streamKey || "").trim().toLowerCase();
      if (k === "medical" || k === "biology" || k === "biology/medical") return "Biology / Medical";
      if (k === "engineering") return "Engineering";
      if (k === "commerce") return "Commerce";
      if (k === "arts") return "Arts";
      return streamKey || "";
    },

    getDefaultAvatar: function () {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuDKTVTYsIgi8LHdNnRRuWq7WIQKHVif0TlNP2ZGt5StF7Jud3Gs6vJQFkiI_qUrzoEb70z07NIkSS2_FPOt1QOJAbG_z1UCQF3WZREwn8LQ303AF2KGL_FvIsWwcEBv_58SCacYxsAa4LwQhFIaWqE0p3A6nQmz2-PaZX8Kg5GnREbykYMsqeY9iQUPepRuFz-BLvUMNC7zQs_yEkbyzAAZa8CifAo7-8Qk5s6x_H8lKuQkdoWTzOKzRA";
    },

    searchCurriculum: function (rawQuery, options) {
      if (!rawQuery || typeof rawQuery !== "string") {
        return {
          query: "",
          totalMatches: 0,
          subjects: [],
          chapters: [],
          allResults: [],
          hasMatches: false
        };
      }

      // 1. Normalize query: trim, collapse repeated whitespace, lowercase
      const normalized = rawQuery.trim().replace(/\s+/g, " ");
      if (!normalized) {
        return {
          query: "",
          totalMatches: 0,
          subjects: [],
          chapters: [],
          allResults: [],
          hasMatches: false
        };
      }

      const queryLower = normalized.toLowerCase();
      const queryAlphaNum = queryLower.replace(/[^a-z0-9]/g, "");

      const opts = options || {};
      const filterStream = opts.stream ? String(opts.stream).toLowerCase() : null;
      const filterSem = opts.semester ? parseInt(opts.semester, 10) : null;
      const maxResults = opts.limit || 30;

      const subjectResults = [];
      const chapterResults = [];
      const seenSubjectKeys = new Set();
      const seenChapterIds = new Set();

      const chaptersEngine = api.chaptersEngine || 
        (typeof EduPrepChapters !== "undefined" ? EduPrepChapters : null) ||
        (typeof window !== "undefined" && window.EduPrep && window.EduPrep.chaptersEngine) ||
        (typeof global !== "undefined" && global.EduPrep && global.EduPrep.chaptersEngine);

      const streamMap = {
        engineering: "Engineering",
        medical: "Biology / Medical",
        commerce: "Commerce",
        arts: "Arts"
      };

      // 2. Comprehensive Academic Abbreviations & Aliases Map
      const ALIASES = {
        // Engineering
        "os": "Operating Systems",
        "operating system": "Operating Systems",
        "dbms": "Database Management Systems",
        "database": "Database Management Systems",
        "databases": "Database Management Systems",
        "cn": "Computer Networks",
        "computer network": "Computer Networks",
        "networks": "Computer Networks",
        "networking": "Computer Networks",
        "dsa": "Data Structures",
        "ds": "Data Structures",
        "data structure": "Data Structures",
        "ai": "Artificial Intelligence",
        "ml": "Machine Learning",
        "coa": "Computer Organization and Architecture",
        "toc": "Theory of Computation",
        "automata": "Theory of Computation",
        "daa": "Design and Analysis of Algorithms",
        "algo": "Design and Analysis of Algorithms",
        "algorithms": "Design and Analysis of Algorithms",
        "se": "Software Engineering",
        "cd": "Compiler Design",
        "compiler": "Compiler Design",
        "wt": "Web Technology",
        "web tech": "Web Technology",
        "bee": "Basic Electrical Engineering",
        "electrical": "Basic Electrical Engineering",
        "electronics": "Basic Electronics Engineering",
        "em": "Engineering Mathematics",
        "math": "Engineering Mathematics",
        "maths": "Engineering Mathematics",
        "m1": "Engineering Mathematics",
        "m2": "Engineering Mathematics",
        "m3": "Engineering Mathematics",
        "m4": "Engineering Mathematics",
        "physics": "Engineering Physics",
        "chemistry": "Engineering Chemistry",
        "mechanics": "Engineering Mechanics",
        "graphics": "Engineering Graphics",
        "eg": "Engineering Graphics",
        "pps": "Programming for Problem Solving",
        "oop": "Object-Oriented Programming",
        "oops": "Object-Oriented Programming",
        "java": "Object-Oriented Programming",
        "cpp": "Object-Oriented Programming",
        "discrete": "Discrete Mathematics",
        "dm": "Discrete Mathematics",
        "dld": "Digital Logic Design",
        "is": "Information Security",
        "cc": "Cloud Computing",
        "cloud": "Cloud Computing",

        // Biology / Medical
        "anatomy": "Anatomy",
        "physio": "Physiology",
        "physiology": "Physiology",
        "biochem": "Biochemistry",
        "biochemistry": "Biochemistry",
        "patho": "Pathology",
        "pathology": "Pathology",
        "pharma": "Pharmacology",
        "pharmacology": "Pharmacology",
        "micro": "Microbiology",
        "microbio": "Microbiology",
        "microbiology": "Microbiology",
        "forensic": "Forensic Medicine",
        "fmt": "Forensic Medicine",
        "psm": "Community Medicine",
        "cm": "Community Medicine",
        "community med": "Community Medicine",
        "med": "General Medicine",
        "medicine": "General Medicine",
        "surgery": "General Surgery",
        "surg": "General Surgery",
        "obgyn": "Obstetrics and Gynaecology",
        "obg": "Obstetrics and Gynaecology",
        "gynec": "Obstetrics and Gynaecology",
        "peds": "Pediatrics",
        "pediatrics": "Pediatrics",
        "optha": "Ophthalmology",
        "eye": "Ophthalmology",
        "ent": "Otorhinolaryngology",
        "ear nose throat": "Otorhinolaryngology",
        "ortho": "Orthopedics",
        "orthopedics": "Orthopedics",

        // Commerce
        "fa": "Financial Accounting",
        "accounts": "Financial Accounting",
        "accounting": "Financial Accounting",
        "be": "Business Economics",
        "bl": "Business Law",
        "law": "Business Law",
        "bm": "Business Mathematics",
        "bs": "Business Statistics",
        "stats": "Business Statistics",
        "statistics": "Business Statistics",
        "ca": "Cost Accounting",
        "costing": "Cost Accounting",
        "cost acc": "Cost Accounting",
        "corp acc": "Corporate Accounting",
        "ma": "Management Accounting",
        "fm": "Financial Management",
        "tax": "Income Tax",
        "taxation": "Income Tax",
        "direct tax": "Income Tax",
        "audit": "Auditing",
        "auditing": "Auditing",
        "banking": "Banking and Insurance",
        "insurance": "Banking and Insurance",
        "ed": "Entrepreneurship Development",
        "entrepreneurship": "Entrepreneurship Development",
        "startup": "Entrepreneurship Development",

        // Arts
        "lit": "English Literature",
        "english": "English Literature",
        "hist": "History",
        "history": "History",
        "pol": "Political Science",
        "pol sci": "Political Science",
        "politics": "Political Science",
        "soc": "Sociology",
        "sociology": "Sociology",
        "psych": "Psychology",
        "psychology": "Psychology",
        "econ": "Economics",
        "economics": "Economics",
        "microeconomics": "Economics",
        "macroeconomics": "Economics",
        "phil": "Philosophy",
        "philosophy": "Philosophy",
        "geog": "Geography",
        "geography": "Geography",
        "marathi": "Marathi Literature",
        "hindi": "Hindi Literature",
        "sanskrit": "Sanskrit",
        "pa": "Public Administration",
        "pub ad": "Public Administration",
        "public administration": "Public Administration",
        "edu": "Education",
        "education": "Education",
        "journalism": "Journalism and Mass Communication",
        "media": "Journalism and Mass Communication",
        "ling": "Linguistics",
        "linguistics": "Linguistics"
      };

      const matchedAliasTarget = ALIASES[queryLower] || ALIASES[queryAlphaNum];
      const queryWords = queryLower.split(/[\s\-]+/).filter(Boolean);

      // 3. Search across all 70 subjects in the four streams
      Object.keys(STREAM_SUBJECTS).forEach(function (streamKey) {
        if (filterStream) {
          const normFilterStream = (filterStream === "biology" || filterStream === "biology/medical") ? "medical" : filterStream;
          if (normFilterStream !== streamKey) return;
        }
        const streamName = streamMap[streamKey] || streamKey;
        const list = STREAM_SUBJECTS[streamKey] || [];

        list.forEach(function (subjName) {
          const nameLower = subjName.toLowerCase();
          if (seenSubjectKeys.has(nameLower)) return;

          const meta = chaptersEngine && typeof chaptersEngine.getSubjectMeta === "function" ? chaptersEngine.getSubjectMeta(subjName) : null;
          const semList = meta && meta.primarySemesters ? meta.primarySemesters : (meta && meta.availableSemesters ? meta.availableSemesters : [1]);
          const defaultSem = semList[0] || 1;

          if (filterSem && !semList.includes(filterSem)) return;

          const nameClean = nameLower.replace(/[^a-z0-9]/g, "");
          const nameWords = nameLower.split(/[\s\-]+/).filter(Boolean);
          const acronym = nameWords.map(function (w) { return w[0]; }).join("");

          let matchRank = -1;
          let matchType = "";

          // Exact alias match
          if (matchedAliasTarget && matchedAliasTarget.toLowerCase() === nameLower) {
            matchRank = 99;
            matchType = "alias_exact";
          } else if (nameLower === queryLower || nameClean === queryAlphaNum) {
            matchRank = 100;
            matchType = "exact";
          } else if (queryAlphaNum.length >= 2 && (acronym === queryAlphaNum || (acronym.length >= 2 && acronym.startsWith(queryAlphaNum)))) {
            matchRank = 95;
            matchType = "acronym";
          } else if (nameLower.startsWith(queryLower)) {
            matchRank = 85;
            matchType = "prefix";
          } else if (nameWords.some(function (w) { return w.startsWith(queryLower); })) {
            matchRank = 80;
            matchType = "word_prefix";
          } else if (queryWords.length > 1 && queryWords.every(function (w) { return nameLower.includes(w); })) {
            matchRank = 70;
            matchType = "multi_word";
          } else if (queryLower.length >= 3 && nameLower.includes(queryLower)) {
            matchRank = 60;
            matchType = "partial";
          } else if (meta && meta.description && meta.description.toLowerCase().includes(queryLower)) {
            matchRank = 30;
            matchType = "topic";
          }

          if (matchRank > 0) {
            seenSubjectKeys.add(nameLower);
            subjectResults.push({
              type: "subject",
              rank: matchRank,
              matchType: matchType,
              id: meta ? meta.id : nameLower.replace(/[^a-z0-9]/g, "_"),
              title: subjName,
              name: subjName,
              code: meta ? meta.id.toUpperCase() : "",
              stream: streamKey,
              streamName: streamName,
              semester: defaultSem,
              semesterLabel: streamKey === "medical" ? "Phase " + (defaultSem <= 2 ? "I" : (defaultSem <= 5 ? "II" : "III")) : "Semester " + defaultSem,
              url: "subject_details_os/code.html?subject=" + encodeURIComponent(subjName) + "&stream=" + encodeURIComponent(streamKey) + "&sem=" + defaultSem
            });
          }
        });
      });

      // Also search engineering branch catalog codes (e.g., CSC401)
      Object.keys(SUBJECTS_CATALOG).forEach(function (bKey) {
        const semMap = SUBJECTS_CATALOG[bKey] || {};
        Object.keys(semMap).forEach(function (sNum) {
          const semVal = parseInt(sNum, 10);
          if (filterSem && filterSem !== semVal) return;
          (semMap[sNum] || []).forEach(function (subj) {
            const key = (subj.name || "").toLowerCase();
            const codeLower = (subj.code || "").toLowerCase();
            const codeClean = codeLower.replace(/[^a-z0-9]/g, "");

            if (seenSubjectKeys.has(key)) {
              const existing = subjectResults.find(function (r) { return r.title.toLowerCase() === key; });
              if (existing && subj.code && !existing.code) existing.code = subj.code;
              return;
            }

            let matchRank = -1;
            let matchType = "";

            if (codeLower && (codeLower === queryLower || codeClean === queryAlphaNum)) {
              matchRank = 97;
              matchType = "code";
            } else if (key === queryLower) {
              matchRank = 100;
              matchType = "exact";
            } else if (codeLower && (codeLower.startsWith(queryLower) || codeClean.startsWith(queryAlphaNum))) {
              matchRank = 85;
              matchType = "code_prefix";
            } else if (key.startsWith(queryLower)) {
              matchRank = 80;
              matchType = "prefix";
            } else if (queryLower.length >= 3 && key.includes(queryLower)) {
              matchRank = 60;
              matchType = "partial";
            } else if (queryLower.length >= 3 && codeLower.includes(queryLower)) {
              matchRank = 70;
              matchType = "code_partial";
            }

            if (matchRank > 0) {
              seenSubjectKeys.add(key);
              subjectResults.push({
                type: "subject",
                rank: matchRank,
                matchType: matchType,
                id: subj.code || key.replace(/[^a-z0-9]/g, "_"),
                title: subj.name,
                name: subj.name,
                code: subj.code || "",
                stream: "engineering",
                streamName: "Engineering",
                semester: semVal,
                semesterLabel: "Semester " + semVal,
                url: "subject_details_os/code.html?subject=" + encodeURIComponent(subj.name) + "&stream=engineering&sem=" + semVal
              });
            }
          });
        });
      });

      // 4. Search chapters in catalog across all 70 subjects
      if (chaptersEngine && chaptersEngine.rawCatalog) {
        const rawCat = chaptersEngine.rawCatalog;
        Object.keys(rawCat).forEach(function (subjKey) {
          const meta = chaptersEngine.getSubjectMeta ? chaptersEngine.getSubjectMeta(subjKey) : null;
          const subjName = meta ? meta.name : subjKey;
          const streamKey = meta ? meta.stream : "engineering";
          if (filterStream) {
            const normFilterStream = (filterStream === "biology" || filterStream === "biology/medical") ? "medical" : filterStream;
            if (normFilterStream !== streamKey) return;
          }
          const streamName = streamMap[streamKey] || streamKey;

          const semCatalog = rawCat[subjKey] || {};
          Object.keys(semCatalog).forEach(function (semStr) {
            const semNum = parseInt(semStr, 10);
            if (filterSem && filterSem !== semNum) return;

            const chaptersList = semCatalog[semStr] || [];
            chaptersList.forEach(function (ch, idx) {
              if (!ch || seenChapterIds.has(ch.id)) return;

              const chTitleLower = (ch.title || "").toLowerCase();
              const chTitleWords = chTitleLower.split(/[\s\-]+/).filter(Boolean);
              const chNum = idx + 1;
              let matchRank = -1;
              let matchType = "";

              const allWordsInCh = queryWords.length > 1 && queryWords.every(function (w) { return chTitleLower.includes(w); });

              if (chTitleLower === queryLower) {
                matchRank = 90;
                matchType = "chapter_exact";
              } else if (chTitleLower.startsWith(queryLower)) {
                matchRank = 80;
                matchType = "chapter_prefix";
              } else if (chTitleWords.some(function (w) { return w.startsWith(queryLower); })) {
                matchRank = 75;
                matchType = "chapter_word_prefix";
              } else if (allWordsInCh) {
                matchRank = 70;
                matchType = "chapter_multi_word";
              } else if (queryLower === ("chapter " + chNum) || queryLower === ("ch " + chNum) || queryLower === ("unit " + chNum)) {
                matchRank = 65;
                matchType = "chapter_number";
              } else if (queryLower.length >= 3 && chTitleLower.includes(queryLower)) {
                matchRank = 55;
                matchType = "chapter_partial";
              } else if (Array.isArray(ch.topics) && ch.topics.some(function (t) { return String(t).toLowerCase().includes(queryLower); })) {
                matchRank = 45;
                matchType = "chapter_topic";
              }

              if (matchRank > 0) {
                seenChapterIds.add(ch.id);
                chapterResults.push({
                  type: "chapter",
                  rank: matchRank,
                  matchType: matchType,
                  id: ch.id,
                  title: ch.title,
                  chapterNumber: chNum,
                  subjectName: subjName,
                  stream: streamKey,
                  streamName: streamName,
                  semester: semNum,
                  semesterLabel: streamKey === "medical" ? "Phase " + (semNum <= 2 ? "I" : (semNum <= 5 ? "II" : "III")) : "Semester " + semNum,
                  url: "subject_details_os/code.html?subject=" + encodeURIComponent(subjName) + "&stream=" + encodeURIComponent(streamKey) + "&sem=" + semNum + "&ch=" + encodeURIComponent(ch.id)
                });
              }
            });
          });
        });
      }

      // 5. Also search unit topics from SUBJECT_UNITS_DATA
      if (typeof SUBJECT_UNITS_DATA !== "undefined") {
        Object.keys(SUBJECT_UNITS_DATA).forEach(function (subjKey) {
          const units = SUBJECT_UNITS_DATA[subjKey] || [];
          units.forEach(function (u, uIdx) {
            (u.topics || []).forEach(function (t) {
              const tTitle = (t.title || "").toLowerCase();
              let tRank = -1;
              if (tTitle === queryLower) {
                tRank = 85;
              } else if (tTitle.startsWith(queryLower)) {
                tRank = 75;
              } else if (queryLower.length >= 3 && tTitle.includes(queryLower)) {
                tRank = 50;
              }

              if (tRank > 0) {
                const chId = "topic_" + (t.id || (subjKey + "_" + uIdx));
                if (!seenChapterIds.has(chId)) {
                  seenChapterIds.add(chId);
                  const subjObj = api.getSubjectByCode(subjKey);
                  const sName = subjObj ? subjObj.name : "Operating Systems";
                  const sStream = subjObj ? (subjObj.stream || "engineering") : "engineering";
                  const sSem = subjObj ? (subjObj.semester || 4) : 4;
                  const sStreamName = streamMap[sStream] || "Engineering";
                  chapterResults.push({
                    type: "chapter",
                    rank: tRank,
                    matchType: "topic",
                    id: chId,
                    title: t.title + " (" + (u.title || "Unit " + (uIdx + 1)) + ")",
                    chapterNumber: uIdx + 1,
                    subjectName: sName,
                    stream: sStream,
                    streamName: sStreamName,
                    semester: sSem,
                    semesterLabel: sStream === "medical" ? "Phase " + (sSem <= 2 ? "I" : (sSem <= 5 ? "II" : "III")) : "Semester " + sSem,
                    url: "subject_details_os/code.html?subject=" + encodeURIComponent(sName) + "&stream=" + encodeURIComponent(sStream) + "&sem=" + sSem
                  });
                }
              }
            });
          });
        });
      }

      // 6. Sort results: rank descending, then alphabetical
      subjectResults.sort(function (a, b) {
        if (b.rank !== a.rank) return b.rank - a.rank;
        return a.title.localeCompare(b.title);
      });

      chapterResults.sort(function (a, b) {
        if (b.rank !== a.rank) return b.rank - a.rank;
        return a.title.localeCompare(b.title);
      });

      const combined = [].concat(subjectResults, chapterResults);
      combined.sort(function (a, b) {
        if (b.rank !== a.rank) return b.rank - a.rank;
        return a.title.localeCompare(b.title);
      });

      return {
        query: normalized,
        totalMatches: combined.length,
        subjects: subjectResults.slice(0, maxResults),
        chapters: chapterResults.slice(0, maxResults),
        allResults: combined.slice(0, maxResults),
        hasMatches: combined.length > 0
      };
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

      // Check all 70 subjects across Engineering, Medical, Commerce, Arts
      const normCode = String(code || "").trim().toLowerCase();
      for (const streamKey in STREAM_SUBJECTS) {
        const list = STREAM_SUBJECTS[streamKey] || [];
        const foundName = list.find(function(s) {
          return s.toLowerCase() === normCode || s.replace(/[^a-z0-9]/g, "").toLowerCase() === normCode.replace(/[^a-z0-9]/g, "");
        });
        if (foundName) {
          const meta = (api.chaptersEngine && api.chaptersEngine.getSubjectMeta) ? api.chaptersEngine.getSubjectMeta(foundName) : null;
          const semVal = meta && meta.primarySemesters ? meta.primarySemesters[0] : 1;
          return {
            code: meta ? meta.id.toUpperCase() : foundName.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase(),
            name: foundName,
            short: foundName,
            isCore: true,
            stream: streamKey,
            semester: semVal
          };
        }
      }

      if (api.chaptersEngine && api.chaptersEngine.rawMetadata) {
        for (const metaKey in api.chaptersEngine.rawMetadata) {
          const meta = api.chaptersEngine.rawMetadata[metaKey];
          if (meta.id.toLowerCase() === normCode || meta.name.toLowerCase() === normCode) {
            const semVal = meta.primarySemesters ? meta.primarySemesters[0] : 1;
            return {
              code: meta.id.toUpperCase(),
              name: meta.name,
              short: meta.name,
              isCore: true,
              stream: meta.stream || "engineering",
              semester: semVal
            };
          }
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

    toggleChapterCompleted: function (chapterId) {
      if (!Array.isArray(currentState.progress.completedChapters)) {
        currentState.progress.completedChapters = [];
      }
      const set = new Set(currentState.progress.completedChapters);
      if (set.has(chapterId)) {
        set.delete(chapterId);
      } else {
        set.add(chapterId);
      }
      currentState.progress.completedChapters = Array.from(set);
      saveState(currentState);
      return set.has(chapterId);
    },

    completeChapter: function (chapterId) {
      if (!Array.isArray(currentState.progress.completedChapters)) {
        currentState.progress.completedChapters = [];
      }
      const set = new Set(currentState.progress.completedChapters);
      set.add(chapterId);
      currentState.progress.completedChapters = Array.from(set);
      saveState(currentState);
      return true;
    },

    restartChapter: function (chapterId) {
      if (!Array.isArray(currentState.progress.completedChapters)) {
        currentState.progress.completedChapters = [];
      }
      const set = new Set(currentState.progress.completedChapters);
      set.delete(chapterId);
      currentState.progress.completedChapters = Array.from(set);
      saveState(currentState);
      return true;
    },

    isChapterCompleted: function (chapterId) {
      const list = currentState.progress.completedChapters || [];
      return list.includes(chapterId);
    },

    setLastActiveChapter: function (subject, chapterId) {
      if (!currentState.progress) currentState.progress = {};
      currentState.progress.lastActiveSubject = subject;
      currentState.progress.lastActiveChapter = chapterId;
      saveState(currentState);
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
        return "<div style=\"margin-bottom:18px;padding:14px;border:1px solid #d1d5db;border-radius:8px;\">" +
          "<div style=\"display:flex;justify-content:space-between;font-weight:bold;margin-bottom:8px;\">" +
            "<span>" + sec.qNo + " — " + sec.title + "</span>" +
            "<span>[" + sec.marks + "]</span>" +
          "</div>" +
          "<ul style=\"margin:0;padding-left:20px;line-height:1.6;\">" +
            sec.items.map(function (it) { return "<li>" + it + "</li>"; }).join("") +
          "</ul>" +
        "</div>";
      }).join("");

      win.document.write(
        "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>" + paper.subject + " (" + paper.session + " " + paper.year + ") — EduPrep Sample Paper</title>" +
        "<style>body{font-family:Inter,Arial,sans-serif;max-width:800px;margin:24px auto;padding:0 16px;color:#111827;} .badge{display:inline-block;padding:4px 10px;background:#fef3c7;color:#92400e;border:1px solid #f59e0b;border-radius:999px;font-size:12px;font-weight:bold;margin-bottom:12px;}</style></head><body>" +
        "<div class=\"badge\">SAMPLE / DEMO PRACTICE QUESTION PAPER — NOT AN OFFICIAL UNIVERSITY PUBLICATION</div>" +
        "<h1 style=\"margin:0 0 4px 0;font-size:22px;\">" + paper.subject + " (" + (paper.subjectCode || paper.code) + ")</h1>" +
        "<p style=\"margin:0 0 16px 0;color:#4b5563;font-size:14px;\">Session: " + paper.session + " " + paper.year + " • Semester " + paper.semester + " • Duration: 3 Hours • Max Marks: 80</p>" +
        "<hr style=\"border:none;border-top:2px solid #111827;margin-bottom:20px;\"/>" +
        sectionsHtml +
        "<div style=\"margin-top:24px;text-align:center;\"><button onclick=\"window.print()\" style=\"padding:10px 20px;background:#4648d4;color:#fff;border:none;border-radius:8px;font-weight:bold;cursor:pointer;\">Print / Save as PDF</button></div>" +
        "</body></html>"
      );
      win.document.close();
    },

    // Navigation helper (supports query strings cleanly)
    navigateTo: function (pageFolderAndQuery) {
      const raw = String(pageFolderAndQuery || "home_dashboard");
      const parts = raw.split("?");
      const folder = parts[0].replace(/^\/+|\/+$/g, "");
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

      toast.innerHTML = "<div class=\"flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-xs sm:text-sm font-medium " + bgClass + "\">" +
        "<span class=\"material-symbols-outlined text-base " + iconColor + "\">" + icon + "</span>" +
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

      modal.innerHTML = "<div class=\"bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-surface-variant/80 p-6 transform scale-95 transition-transform duration-200 max-h-[90vh] overflow-y-auto\" id=\"topicModalCard\">" +
        "<div class=\"flex items-start justify-between pb-4 mb-4 border-b border-surface-variant\">" +
          "<div>" +
            "<div class=\"flex items-center gap-2 mb-1\">" +
              "<span class=\"text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20\">" +
                details.unitTitle + " • " + details.weightage +
              "</span>" +
              (isCompleted ? "<span class=\"text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1\"><span class=\"material-symbols-outlined text-xs\">check_circle</span> Completed</span>" : "") +
            "</div>" +
            "<h3 class=\"font-extrabold text-lg sm:text-xl text-on-surface leading-snug\">" + details.topic.title + "</h3>" +
            "<p class=\"text-xs text-on-surface-variant mt-1 flex items-center gap-2\">" +
              "<span class=\"material-symbols-outlined text-sm text-primary\">schedule</span>" +
              "<span>Teaching Duration: " + details.topic.hours + "</span>" +
              "<span>•</span>" +
              "<span class=\"material-symbols-outlined text-sm text-amber-500\">history_edu</span>" +
              "<span>PYQ: " + details.topic.pyqMentions + "</span>" +
            "</p>" +
          "</div>" +
          "<button onclick=\"EduPrep.closeTopicModal()\" class=\"p-1.5 rounded-lg hover:bg-surface-variant text-on-surface-variant transition-colors\">" +
            "<span class=\"material-symbols-outlined text-xl\">close</span>" +
          "</button>" +
        "</div>" +
        "<div class=\"space-y-4 mb-6\">" +
          "<div class=\"p-4 rounded-xl bg-surface-container-low border border-surface-variant/60\">" +
            "<h4 class=\"text-xs font-bold uppercase tracking-wider text-primary mb-1 flex items-center gap-1.5\">" +
              "<span class=\"material-symbols-outlined text-sm\">menu_book</span> Core Concept Notes" +
            "</h4>" +
            "<p class=\"text-xs sm:text-sm text-on-surface leading-relaxed\">" + details.topic.summary + "</p>" +
          "</div>" +
          "<div class=\"p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30\">" +
            "<h4 class=\"text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 mb-1 flex items-center gap-1.5\">" +
              "<span class=\"material-symbols-outlined text-sm\">bolt</span> High-Yield Exam Formula / Takeaway" +
            "</h4>" +
            "<p class=\"text-xs sm:text-sm font-mono text-amber-900 dark:text-amber-100 font-semibold\">" + details.topic.keyFormulaOrRule + "</p>" +
          "</div>" +
        "</div>" +
        "<div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6\">" +
          "<button onclick=\"EduPrep.closeTopicModal(); EduPrep.navigateTo('mcq_practice_exam')\" class=\"p-3 rounded-xl border border-surface-variant hover:border-primary/50 bg-surface flex flex-col items-center text-center transition-all group\">" +
            "<span class=\"material-symbols-outlined text-primary text-xl mb-1 group-hover:scale-110 transition-transform\">quiz</span>" +
            "<span class=\"text-xs font-bold text-on-surface\">Practice Topic MCQs</span>" +
            "<span class=\"text-[10px] text-on-surface-variant\">" + details.topic.mcqsCount + " Questions</span>" +
          "</button>" +
          "<button onclick=\"EduPrep.closeTopicModal(); EduPrep.navigateTo('revision_flashcards')\" class=\"p-3 rounded-xl border border-surface-variant hover:border-primary/50 bg-surface flex flex-col items-center text-center transition-all group\">" +
            "<span class=\"material-symbols-outlined text-primary text-xl mb-1 group-hover:scale-110 transition-transform\">style</span>" +
            "<span class=\"text-xs font-bold text-on-surface\">Topic Flashcards</span>" +
            "<span class=\"text-[10px] text-on-surface-variant\">" + details.topic.flashcardsCount + " Memory Cards</span>" +
          "</button>" +
          "<button onclick=\"EduPrep.closeTopicModal(); EduPrep.navigateTo('study_ai_assistant')\" class=\"p-3 rounded-xl border border-surface-variant hover:border-primary/50 bg-surface flex flex-col items-center text-center transition-all group\">" +
            "<span class=\"material-symbols-outlined text-primary text-xl mb-1 group-hover:scale-110 transition-transform\">smart_toy</span>" +
            "<span class=\"text-xs font-bold text-on-surface\">Ask Study AI</span>" +
            "<span class=\"text-[10px] text-on-surface-variant\">Instant Socratic Explanation</span>" +
          "</button>" +
        "</div>" +
        "<div class=\"flex items-center justify-between pt-4 border-t border-surface-variant\">" +
          "<button onclick=\"EduPrep.toggleTopicCompletedAndRefresh('" + details.topic.id + "', '" + subjectCode + "')\" class=\"px-4 py-2 rounded-xl border border-outline-variant text-xs font-semibold text-on-surface hover:bg-surface-variant flex items-center gap-1.5 transition-colors\">" +
            "<span class=\"material-symbols-outlined text-sm\">" + (isCompleted ? "check_box" : "check_box_outline_blank") + "</span>" +
            "<span>" + (isCompleted ? "Mark as Incomplete" : "Mark Topic as Completed") + "</span>" +
          "</button>" +
          "<button onclick=\"EduPrep.closeTopicModal()\" class=\"px-5 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-container shadow-md transition-all\">" +
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
        gridButtons += "<button onclick=\"EduPrep.selectSemesterFromModal(" + s + ")\" class=\"h-12 rounded-xl text-sm font-bold border transition-all flex flex-col items-center justify-center " +
          (isCurrent ? "bg-primary text-white border-primary shadow-md scale-105 ring-2 ring-primary/20" : "bg-surface hover:bg-surface-variant text-on-surface border-surface-variant hover:border-primary/40") + "\">" +
          "<span class=\"text-[10px] font-normal uppercase opacity-70\">Sem</span>" +
          "<span>" + s + "</span>" +
          "</button>";
      });

      modal.innerHTML = "<div class=\"bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-surface-variant/80 p-6 transform scale-95 transition-transform duration-200\" id=\"semModalCard\">" +
        "<div class=\"flex justify-between items-center mb-4 pb-3 border-b border-surface-variant\">" +
          "<div class=\"flex items-center gap-2\">" +
            "<span class=\"material-symbols-outlined text-primary text-2xl\">calendar_month</span>" +
            "<div>" +
              "<h3 class=\"font-bold text-base text-on-surface\">Switch Current Active Semester</h3>" +
              "<p class=\"text-xs text-on-surface-variant\">" + (currentState.academic.branchName || "Computer Engineering") + "</p>" +
            "</div>" +
          "</div>" +
          "<button onclick=\"EduPrep.closeSemesterModal()\" class=\"p-1.5 rounded-lg hover:bg-surface-variant text-on-surface-variant transition-colors\">" +
            "<span class=\"material-symbols-outlined text-xl\">close</span>" +
          "</button>" +
        "</div>" +
        "<p class=\"text-xs text-on-surface-variant mb-4 leading-relaxed\">" +
          "Selecting a new semester immediately recalculates your enrolled subjects, curriculum blueprint, practice question banks, and finals timetable." +
        "</p>" +
        "<div class=\"grid grid-cols-4 gap-2.5 mb-6\" id=\"semesterGridOptions\">" +
          gridButtons +
        "</div>" +
        "<div class=\"flex justify-end gap-2 pt-3 border-t border-surface-variant/60\">" +
          "<button onclick=\"EduPrep.closeSemesterModal()\" class=\"px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-variant transition-colors\">" +
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

      modal.innerHTML = "<div class=\"bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-surface-variant/80 p-6 transform scale-95 transition-transform duration-200\" id=\"instModalCard\">" +
        "<div class=\"flex justify-between items-center mb-4 pb-3 border-b border-surface-variant\">" +
          "<div class=\"flex items-center gap-2\">" +
            "<span class=\"material-symbols-outlined text-primary text-2xl\">corporate_fare</span>" +
            "<div>" +
              "<h3 class=\"font-bold text-base text-on-surface\">EduPrep Campus & Department Directory</h3>" +
              "<p class=\"text-xs text-on-surface-variant\">Request New College or Syllabus Addition</p>" +
            "</div>" +
          "</div>" +
          "<button onclick=\"EduPrep.closeInstitutionModal()\" class=\"p-1.5 rounded-lg hover:bg-surface-variant text-on-surface-variant transition-colors\">" +
            "<span class=\"material-symbols-outlined text-xl\">close</span>" +
          "</button>" +
        "</div>" +
        "<p class=\"text-xs text-on-surface-variant mb-4 leading-relaxed\">" +
          "Submit your college or autonomous syllabus details below, or use the Admin Content Manager to add institutions and curriculum modules directly." +
        "</p>" +
        "<form onsubmit=\"EduPrep.submitInstitutionInquiry(event)\" class=\"space-y-3 text-xs\">" +
          "<div>" +
            "<label class=\"block font-semibold text-on-surface mb-1\">Institution / College Name</label>" +
            "<input type=\"text\" required placeholder=\"e.g. Vidyalankar Institute of Technology\" class=\"w-full px-3 py-2 rounded-xl border border-surface-variant focus:border-primary outline-none text-on-surface bg-surface\" />" +
          "</div>" +
          "<div class=\"grid grid-cols-2 gap-3\">" +
            "<div>" +
              "<label class=\"block font-semibold text-on-surface mb-1\">Contact Person</label>" +
              "<input type=\"text\" required placeholder=\"Student Rep / Faculty Name\" class=\"w-full px-3 py-2 rounded-xl border border-surface-variant focus:border-primary outline-none text-on-surface bg-surface\" />" +
            "</div>" +
            "<div>" +
              "<label class=\"block font-semibold text-on-surface mb-1\">Official Email</label>" +
              "<input type=\"email\" required placeholder=\"contact@college.ac.in\" class=\"w-full px-3 py-2 rounded-xl border border-surface-variant focus:border-primary outline-none text-on-surface bg-surface\" />" +
            "</div>" +
          "</div>" +
          "<div class=\"pt-2 flex justify-end gap-2\">" +
            "<button type=\"button\" onclick=\"EduPrep.closeInstitutionModal()\" class=\"px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-variant transition-colors\">" +
              "Cancel" +
            "</button>" +
            "<button type=\"submit\" class=\"px-5 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-container shadow-md transition-all\">" +
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
    signOut: async function () {
      if (typeof window !== "undefined") {
        if (window.EduPrepSupabase && window.EduPrepSupabase.auth) {
          try {
            await window.EduPrepSupabase.auth.signOut();
          } catch (_) {}
        }
        api.updateProfile({ id: null, authMode: "unauthenticated", name: "Student Learner", email: "" });
        window.location.href = "../login_registration/code.html";
      }
    },
    logout: async function () {
      await api.signOut();
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
      document.addEventListener("DOMContentLoaded", async function () {
        const path = (window.location && window.location.pathname) || "";
        
        // Synchronize Supabase authentication session if client is available
        if (typeof window !== "undefined" && window.EduPrepSupabase) {
          try {
            const { session } = await window.EduPrepSupabase.getSession();
            if (session && session.user) {
              const u = session.user;
              const name = (u.user_metadata && u.user_metadata.full_name) || u.email.split("@")[0];
              api.updateProfile({
                id: u.id,
                name: name,
                email: u.email,
                authMode: "supabase"
              });
            }
            if (window.EduPrepSupabase.auth && typeof window.EduPrepSupabase.auth.onAuthStateChange === "function") {
              window.EduPrepSupabase.auth.onAuthStateChange(function (event, updatedSession) {
                if (event === "SIGNED_IN" && updatedSession && updatedSession.user) {
                  const u = updatedSession.user;
                  const name = (u.user_metadata && u.user_metadata.full_name) || u.email.split("@")[0];
                  api.updateProfile({
                    id: u.id,
                    name: name,
                    email: u.email,
                    authMode: "supabase"
                  });
                } else if (event === "SIGNED_OUT") {
                  api.updateProfile({
                    id: null,
                    name: "Student Learner",
                    email: "",
                    authMode: "unauthenticated"
                  });
                }
              });
            }
          } catch (_) {}
        }

        // NEVER inject student navigation on public authentication, admin, or marketing pages
        if (/login|register|forgot|reset|admin|index.html/i.test(path)) {
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
        navBar.className = "w-full bg-white text-slate-800 border-b border-slate-200 text-xs z-40 shadow-xs";
        const links = [
          { label: "Home", href: "../index.html", key: "index.html" },
          { label: "Dashboard", href: "../home_dashboard/code.html", key: "home_dashboard" },
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
            (active ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900") + '">' + l.label + "</a>";
        }).join("");

        navBar.innerHTML =
          '<div class="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between gap-3 overflow-x-auto">' +
            '<a href="../index.html" class="font-bold text-primary flex items-center gap-1.5 shrink-0">' +
              '<span class="material-symbols-outlined text-sm text-primary">school</span>' +
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
  try {
    const ChaptersEngine = require("./eduprep_chapters_data.js");
    if (ChaptersEngine) {
      EduPrepCore.chaptersEngine = ChaptersEngine;
      EduPrepCore.getSubjectMeta = ChaptersEngine.getSubjectMeta.bind(ChaptersEngine);
      EduPrepCore.getSubjectPeriods = ChaptersEngine.getSubjectPeriods.bind(ChaptersEngine);
      EduPrepCore.getChapters = ChaptersEngine.getChapters.bind(ChaptersEngine);
      EduPrepCore.getChapterById = ChaptersEngine.getChapterById.bind(ChaptersEngine);
      EduPrepCore.getChapterNotes = ChaptersEngine.getChapterNotes.bind(ChaptersEngine);
      EduPrepCore.getChapterVideos = ChaptersEngine.getChapterVideos.bind(ChaptersEngine);
      EduPrepCore.getYouTubeSearchUrl = ChaptersEngine.getYouTubeSearchUrl.bind(ChaptersEngine);
      EduPrepCore.getReferenceBookUrl = ChaptersEngine.getReferenceBookUrl.bind(ChaptersEngine);
      EduPrepCore.hasChapters = ChaptersEngine.hasChapters.bind(ChaptersEngine);
    }
  } catch (e) {}
  module.exports = EduPrepCore;
}

