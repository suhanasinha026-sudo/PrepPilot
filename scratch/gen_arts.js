// Comprehensive Arts Stream Dataset (15 Subjects)
const artsSubjects = [
  {
    id: "arts_eng_lit",
    name: "English Literature",
    stream: "arts",
    degree: "B.A.",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [1, 2],
    description: "Literary forms, Elizabethan drama, Romantic poetry, Victorian novels, Modernist fiction, and Postcolonial Indian writing.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Forms of Literature & Literary Devices", desc: "Elements of poetry (meter, rhyme, stanza forms), tragedy vs comedy, novella, figures of speech (metaphor, simile, irony, paradox)." },
        { num: 2, title: "Elizabethan and Jacobean Drama", desc: "Shakespearean tragedy (Hamlet, Macbeth), themes of fate, tragic flaw (hamartia), soliloquies, revenge tragedy, and comic relief." },
        { num: 3, title: "Romantic Poetry and Aesthetics", desc: "William Wordsworth's nature poetry, S.T. Coleridge's supernaturalism, John Keats' negative capability, and Percy Bysshe Shelley's idealism." },
        { num: 4, title: "The Victorian Novel & Social Realism", desc: "Industrial Revolution impact on literature, Charles Dickens' social criticism, George Eliot, Charlotte Bronte, and serialization." },
        { num: 5, title: "Modernist Literature & Stream of Consciousness", desc: "T.S. Eliot's The Waste Land, Virginia Woolf, James Joyce, modernist alienation, fragmented narrative, and free verse." },
        { num: 6, title: "Indian Writing in English", desc: "R.K. Narayan's Malgudi stories, Raja Rao, Mulk Raj Anand, Nissim Ezekiel, Kamala Das, and postcolonial identity themes." }
      ]
    }
  },
  {
    id: "arts_history",
    name: "History",
    stream: "arts",
    degree: "B.A.",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [1, 2],
    description: "Ancient Indian civilizations, medieval empires, Maratha history, colonial rule, and the Indian freedom struggle.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Sources of History & Indus Valley Civilization", desc: "Archaeological, epigraphic, numismatic sources, Harappan town planning, drainage systems, trade, seals, and theories of decline." },
        { num: 2, title: "Vedic Period & Religious Movements", desc: "Early and Later Vedic society, polity, economy, emergence of Mahajanapadas, rise of Jainism (Mahavira) and Buddhism (Gautama Buddha)." },
        { num: 3, title: "Mauryan Empire & Ashoka's Dhamma", desc: "Chandragupta Maurya, Kautilya's Arthashastra, Ashoka's rock edicts, administrative machinery, spread of Buddhism, and Mauryan art." },
        { num: 4, title: "Gupta Classical Era & Harsha's Reign", desc: "Gupta administration, agrarian economy, literature (Kalidasa), scientific advancements (Aryabhata), and Nalanda university." },
        { num: 5, title: "Medieval India: Sultanate & Mughal Eras", desc: "Delhi Sultanate administrative reforms, Alauddin Khilji's market control, Akbar's Din-i-Ilahi, Mansabdari system, and Mughal architecture." },
        { num: 6, title: "Chhatrapati Shivaji Maharaj & Modern India", desc: "Shivaji Maharaj's coronation (Rajyabhishek), Ashta Pradhan Mandal, guerrilla warfare (Ganimi Kava), 1857 Revolt, and Mahatma Gandhi's movements." }
      ]
    }
  },
  {
    id: "arts_pol_sci",
    name: "Political Science",
    stream: "arts",
    degree: "B.A.",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [1, 2],
    description: "Political theory, state sovereignty, justice, democracy, Indian constitutional framework, and international relations.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Political Theory: Scope & Approaches", desc: "Meaning, nature and significance of political theory, normative vs empirical approaches, and behavioral revolution." },
        { num: 2, title: "The State: Theories of Origin & Sovereignty", desc: "Divine right theory, Social Contract theory (Hobbes, Locke, Rousseau), Austin's monistic sovereignty, and pluralist critiques." },
        { num: 3, title: "Core Political Concepts: Liberty, Equality, Justice", desc: "Negative and positive liberty (Isaiah Berlin), forms of equality, John Rawls' theory of justice (veil of ignorance), and rights." },
        { num: 4, title: "Major Political Ideologies", desc: "Classical and modern liberalism, scientific socialism/Marxism (historical materialism, surplus value), Gandhian Swaraj, and feminism." },
        { num: 5, title: "Indian Constitutional Framework", desc: "Preamble philosophy, Fundamental Rights (Articles 12-35), Directive Principles of State Policy, and basic structure doctrine." },
        { num: 6, title: "Government Institutions & Federalism", desc: "Presidential powers, Prime Minister and Council of Ministers, parliamentary sovereignty, Supreme Court judicial review, and federalism." }
      ]
    }
  },
  {
    id: "arts_sociology",
    name: "Sociology",
    stream: "arts",
    degree: "B.A.",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [1, 2],
    description: "Sociological concepts, institutions, social stratification, classical thinkers (Marx, Durkheim, Weber), and Indian social change.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Sociological Imagination & Primary Concepts", desc: "Origin of sociology, sociological perspective, definitions of society, community, association, institutions, and social groups." },
        { num: 2, title: "Culture, Socialization & Social Control", desc: "Elements of culture, cultural lag, primary and secondary agencies of socialization, mechanisms of formal and informal social control." },
        { num: 3, title: "Social Stratification: Caste, Class & Gender", desc: "Theories of stratification (functionalist vs conflict), caste system features in India, class mobility, and gender disparity." },
        { num: 4, title: "Classical Thinkers: Marx, Durkheim & Weber", desc: "Karl Marx's class conflict and alienation, Emile Durkheim's division of labor and suicide theory, Max Weber's social action and bureaucracy." },
        { num: 5, title: "Indian Social Institutions: Family & Marriage", desc: "Joint family structure and changes, forms of marriage in India, kinship systems, and legal reforms in personal laws." },
        { num: 6, title: "Social Change in Contemporary India", desc: "Sanskritization, Westernization, Modernization (M.N. Srinivas), globalization impact on rural India, and social reform movements." }
      ]
    }
  },
  {
    id: "arts_psychology",
    name: "Psychology",
    stream: "arts",
    degree: "B.A.",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [1, 2],
    description: "Biological bases of behavior, sensation, perception, learning theories, memory, motivation, and personality assessment.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Introduction to Psychology & Research Methods", desc: "Evolution of psychology as an empirical science, schools of psychology (Structuralism, Functionalism, Behaviorism, Psychoanalysis), and experimental methods." },
        { num: 2, title: "Biological Bases of Human Behavior", desc: "Neuron anatomy, action potential conduction, neurotransmitters (dopamine, serotonin), central and peripheral nervous system, and endocrine glands." },
        { num: 3, title: "Sensation, Attention & Perception", desc: "Absolute and difference sensory thresholds (Weber's law), selective attention factors, Gestalt laws of perceptual organization, and depth cues." },
        { num: 4, title: "Theories of Learning: Conditioning & Modeling", desc: "Pavlov's classical conditioning, Skinner's operant conditioning (reinforcement schedules), and Bandura's observational learning theory." },
        { num: 5, title: "Memory Systems & Theories of Forgetting", desc: "Atkinson-Shiffrin model (Sensory, Short-Term, Long-Term memory), working memory, retrieval cues, Ebbinghaus forgetting curve, and interference." },
        { num: 6, title: "Motivation, Emotion & Personality", desc: "Maslow's hierarchy of needs, James-Lange and Cannon-Bard emotion theories, Freud's psychoanalytic personality structure (Id, Ego, Superego), and Big Five traits." }
      ]
    }
  },
  {
    id: "arts_economics",
    name: "Economics",
    stream: "arts",
    degree: "B.A.",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [1, 2],
    description: "Microeconomic foundations, national income accounting, classical and Keynesian macroeconomics, and public finance.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Scope of Economics & Consumer Theory", desc: "Scarcity and choice, production possibility frontier, cardinal utility, ordinal indifference curve analysis, and price consumption curve." },
        { num: 2, title: "Production, Costs & Market Equilibrium", desc: "Short-run and long-run cost curves, revenue concepts, price determination under perfect competition and pure monopoly." },
        { num: 3, title: "National Income Accounting", desc: "Concepts of GDP, GNP, NNP at factor cost and market price, methods of measuring national income (product, income, expenditure), and circular flow." },
        { num: 4, title: "Classical vs Keynesian Macroeconomics", desc: "Say's law of markets, classical full employment assumption, Keynes' principle of effective demand, and consumption function (MPC, APC)." },
        { num: 5, title: "Money, Banking & Inflation Dynamics", desc: "Functions of money, quantity theory of money (Fisher's equation), demand-pull and cost-push inflation, and central bank repo rate policy." },
        { num: 6, title: "Public Finance & Fiscal Policies", desc: "Public vs private goods, canons of taxation, direct vs indirect taxes, government budget deficits (fiscal, revenue), and fiscal stimulus." }
      ]
    }
  },
  {
    id: "arts_philosophy",
    name: "Philosophy",
    stream: "arts",
    degree: "B.A.",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [1, 2],
    description: "Classical Indian orthodox and heterodox schools, Western rationalism and empiricism, and moral and applied ethics.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Introduction to Philosophical Inquiry", desc: "Branches of philosophy: Epistemology (theory of knowledge), Metaphysics (nature of reality), Ethics, and Logic." },
        { num: 2, title: "Classical Indian Philosophy: Orthodox Schools", desc: "Nyaya epistemology (Pramanas: Pratyaksha, Anumana), Vaisheshika atomism, Samkhya Purusha-Prakriti dualism, and Advaita Vedanta (Shankara)." },
        { num: 3, title: "Heterodox Indian Schools: Charvaka, Jainism, Buddhism", desc: "Charvaka materialism, Jain Syadvada and Anekantavada, Buddhism's Four Noble Truths, Eightfold Path, and Pratityasamutpada (dependent origination)." },
        { num: 4, title: "Western Philosophy: Socrates, Plato & Aristotle", desc: "Socratic method, Plato's Theory of Forms and Allegory of the Cave, Aristotle's four causes, and virtue ethics (golden mean)." },
        { num: 5, title: "Modern Western Epistemology: Rationalism vs Empiricism", desc: "Descartes' Methodic Doubt ('Cogito, ergo sum'), Spinoza, Leibniz, John Locke's tabula rasa, David Hume's skepticism, and Kant's synthesis." },
        { num: 6, title: "Moral Philosophy & Applied Ethics", desc: "Utilitarianism (Bentham and Mill), Kantian deontological categorical imperative, environmental ethics, and bioethical dilemmas." }
      ]
    }
  },
  {
    id: "arts_geography",
    name: "Geography",
    stream: "arts",
    degree: "B.A.",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [1, 2],
    description: "Physical geomorphology, climatology, oceanography, human settlements, economic resources, and regional geography of India.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Geomorphology: Earth Interior & Crustal Movement", desc: "Internal structure of the earth (crust, mantle, core), Wegener's continental drift theory, plate tectonics, earthquakes, and vulcanicity." },
        { num: 2, title: "Weathering & Landform Evolution", desc: "Physical, chemical, and biological weathering, erosional and depositional landforms created by running water (rivers), glaciers, wind, and waves." },
        { num: 3, title: "Climatology: Atmospheric Heat & Wind Systems", desc: "Composition and layers of atmosphere, insolation heat balance, planetary wind belts, Coriolis effect, cyclones, and monsoon mechanisms." },
        { num: 4, title: "Oceanography: Submarine Relief & Tides", desc: "Continental shelf, slope, abyssal plains, ocean trenches, salinity factors, ocean currents of Atlantic and Pacific, and tidal theories." },
        { num: 5, title: "Human Geography & Demographic Transition", desc: "World population distribution, factors affecting population density, Demographic Transition Model (DTM), and rural/urban settlement patterns." },
        { num: 6, title: "Physiographic & Economic Geography of India", desc: "Himalayan ranges, Indo-Gangetic plains, Peninsular plateau, river drainage systems (Ganga, Godavari), soil types, and major mineral reserves." }
      ]
    }
  },
  {
    id: "arts_marathi_lit",
    name: "Marathi Literature",
    stream: "arts",
    degree: "B.A.",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [1, 2],
    description: "Mahanubhav and Sant literature, Shahiri poetry, modern Marathi poetry, novels, drama, and Dalit literary movements.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Prachin Marathi Sahitya: Mahanubhav Panth", desc: "Chakradhar Swami's Leelacharitra, earliest Marathi prose, spiritual philosophy of Mahanubhav sect, and poetic contributions." },
        { num: 2, title: "Sant Sahitya: Dnyaneshwar, Namdev, Eknath, Tukaram", desc: "Bhakti movement poetry, Dnyaneshwari philosophy, Tukaram's Abhangas, social reform messages, and humanitarian ideals." },
        { num: 3, title: "Shahiri Sahitya & Bakhar Wangmay", desc: "Povada heroics, Lavani lyrical aesthetics during Peshwa era, historical Bakhar writing style, and social depictions." },
        { num: 4, title: "Arvachin Marathi Kavita: Keshavsut te Kusumagraj", desc: "Modern Marathi poetry revolution, Keshavsut's romantic revolt, Balkavi's nature poetry, B.S. Mardhekar's modernism, and Kusumagraj's humanist voice." },
        { num: 5, title: "Marathi Kadambari & Katha Sahitya", desc: "Hari Narayan Apte's historical novels, V.S. Khandekar's Yayati, Bhalchandra Nemade's Kosla and Deshivad philosophy." },
        { num: 6, title: "Marathi Natak & Dalit Sahitya Chalwal", desc: "Vijay Tendulkar's dramatic realism (Shantata! Court Chalu Aahe), Mahesh Elkunchwar, Baburao Bagul, Namdeo Dhasal, and Dalit consciousness." }
      ]
    }
  },
  {
    id: "arts_hindi_lit",
    name: "Hindi Literature",
    stream: "arts",
    degree: "B.A.",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [1, 2],
    description: "History of Hindi literature (Adikal to Adhunikkal), Bhaktikal poetry, Chhayavad, Hindi novels, and modern essays.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Hindi Sahitya ka Itihas: Kal Vibhajan", desc: "Chronological classification by Acharya Ramchandra Shukla: Adikal (Veergatha Kal), Bhaktikal, Ritikal, and Adhunikkal overview." },
        { num: 2, title: "Bhaktikal: Nirguna & Saguna Poetry", desc: "Kabir's social reform sakhis, Guru Nanak, Malik Muhammad Jayasi's Padmavat, Surdas's Krishna-Bhakti, and Tulsidas's Ramcharitmanas." },
        { num: 3, title: "Ritikal: Muktak Kavya & Shringar", desc: "Characteristics of Ritikal, Ritibaddha, Ritisiddha, and Ritimukta poets, Bihari Lal's dohas, and Ghananand's love poetry." },
        { num: 4, title: "Adhunik Hindi Kavita & Chhayavad", desc: "Bharatendu era awakening, Dwivedi era idealism, Chhayavad quartet (Jaishankar Prasad, Suryakant Tripathi Nirala, Sumitranandan Pant, Mahadevi Varma)." },
        { num: 5, title: "Hindi Upanyas & Katha Sahitya", desc: "Munshi Premchand's realism in Godan, social themes in short stories (Kafan, Poos ki Raat), Phanishwar Nath Renu's Maila Anchal, and Yashpal." },
        { num: 6, title: "Hindi Natak & Nibandh Sahitya", desc: "Bharatendu Harishchandra's Andher Nagari, Jaishankar Prasad's historical plays (Skandagupta), and Ramchandra Shukla's reflective essays." }
      ]
    }
  },
  {
    id: "arts_sanskrit",
    name: "Sanskrit",
    stream: "arts",
    degree: "B.A.",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [1, 2],
    description: "Sanskrit grammar (Sandhi, Samasa, Karaka), Vedic literature, classical Mahakavyas, drama (Kalidasa, Bhasa), and Niti literature.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Sanskrit Vyakaran: Sandhi, Samasa & Shabdarupa", desc: "Paninian grammatical rules, Svara, Vyanjana, Visarga Sandhi, Tatpurusha, Bahuvrihi, Dvandva Samasa, noun declensions, and verb conjugations (Dhaturupa)." },
        { num: 2, title: "Karaka Prakaranam & Sentence Construction", desc: "Six Karakas and their corresponding Vibhaktis, Upapada Vibhakti rules, active and passive voice constructions (Kartari, Karmani, Bhave prayoga)." },
        { num: 3, title: "Vedic & Upanishadic Literature", desc: "Four Vedas (Rig, Sama, Yajur, Atharva), Samhita, Brahmana, Aranyaka, and philosophical teachings of Ishavasya and Katha Upanishads." },
        { num: 4, title: "Classical Sanskrit Mahakavya Tradition", desc: "Definition of Mahakavya, Kalidasa's Raghuvamsham and Kumarasambhavam, Bharavi's Kiratarjuniyam, and Magha's Shishupalavadham." },
        { num: 5, title: "Classical Sanskrit Drama (Nataka)", desc: "Natya Shastra dramatic conventions, Bhasa's Svapnavasavadattam, Kalidasa's Abhijnanashakuntalam, and Bhavabhuti's Uttararamacharita." },
        { num: 6, title: "Subhashita, Niti & Translation", desc: "Moral maxims from Panchatantra, Hitopadesha, Bhartrihari's Nitisatakam, and translation between Sanskrit and English/Marathi." }
      ]
    }
  },
  {
    id: "arts_pub_admin",
    name: "Public Administration",
    stream: "arts",
    degree: "B.A.",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [1, 2],
    description: "Administrative theories, organizational principles, Indian civil services, central/state machinery, and public financial management.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Scope of Public Administration & New Public Admin", desc: "Meaning, nature, scope, public vs private administration, Woodrow Wilson's politics-administration dichotomy, and Minnowbrook conferences." },
        { num: 2, title: "Classical & Behavioral Administrative Theories", desc: "Henri Fayol's administrative management, Max Weber's bureaucratic model, Elton Mayo's Human Relations approach, and Herbert Simon's decision making." },
        { num: 3, title: "Principles of Organization", desc: "Hierarchy, Unity of Command, Span of Control, Authority and Responsibility, Line and Staff agencies, and centralization." },
        { num: 4, title: "Indian Central Administrative Machinery", desc: "Prime Minister's Office (PMO), Cabinet Secretariat, Central Ministries structure, and role of Cabinet Secretary as civil service head." },
        { num: 5, title: "Personnel Administration & Civil Services", desc: "All India Services (IAS, IPS), role of UPSC in recruitment, training, promotion systems, and administrative integrity (Central Vigilance Commission)." },
        { num: 6, title: "Financial Administration & Budgetary Control", desc: "Budget cycle formulation, enactment, execution, Comptroller and Auditor General (CAG) role, Public Accounts Committee (PAC), and Estimates Committee." }
      ]
    }
  },
  {
    id: "arts_education",
    name: "Education",
    stream: "arts",
    degree: "B.A.",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [1, 2],
    description: "Philosophical foundations, psychological learning principles, sociological functions of education, and national policies (NEP 2020).",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Philosophical Foundations of Education", desc: "Meaning, aims and functions of education, Western philosophical schools (Idealism, Naturalism, Pragmatism), and their curricular implications." },
        { num: 2, title: "Indian Educational Thinkers", desc: "Swami Vivekananda's man-making education, Rabindranath Tagore's natural learning (Shantiniketan), Mahatma Gandhi's Wardha Basic Education, and Sri Aurobindo." },
        { num: 3, title: "Psychological Foundations of Learning", desc: "Theories of cognitive development (Jean Piaget), constructivism (Vygotsky's ZPD), intelligence models (Gardner's Multiple Intelligences), and motivation." },
        { num: 4, title: "Sociological Perspectives & Inclusive Education", desc: "Education as an instrument of social change, equalization of educational opportunity, gender equity, and inclusive education for children with special needs." },
        { num: 5, title: "Historical Commissions & Educational Milestones", desc: "Macaulay's Minute (1835), Wood's Despatch (1854), Radhakrishnan Commission, Secondary Education (Mudaliar) Commission, and Kothari Commission (1964-66)." },
        { num: 6, title: "National Education Policy & Modern Innovations", desc: "National Education Policy (NEP 2020) 5+3+3+4 school structure, experiential learning, multidisciplinary higher education, and ICT in education." }
      ]
    }
  },
  {
    id: "arts_journalism",
    name: "Journalism and Mass Communication",
    stream: "arts",
    degree: "B.A.",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [1, 2],
    description: "Communication models, news reporting and editing, broadcast journalism, digital media, media ethics, and press laws.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Introduction to Communication Models", desc: "Communication process, linear and non-linear models (Lasswell, Shannon-Weaver, Berlo SMCR, Schramm), barriers to effective communication." },
        { num: 2, title: "Print Journalism: News Gathering & Reporting", desc: "News values (proximity, impact, timeliness, prominence), inverted pyramid writing style, lead/intro writing, beat reporting, and investigative journalism." },
        { num: 3, title: "Sub-Editing, Headlines & Page Design", desc: "Role of the copy desk, sub-editor duties, headline writing rules, caption writing, proofreading symbols, and newspaper layout principles." },
        { num: 4, title: "Electronic & Broadcast Media", desc: "Radio broadcasting, news scriptwriting for audio, television news studio production, teleprompter, PTC (Piece to Camera), and documentary filmmaking." },
        { num: 5, title: "New Media, Digital Journalism & Social Platforms", desc: "Online journalism attributes (hypertext, interactivity, multimediality), search engine optimization (SEO) for news, data journalism, and fake news verification." },
        { num: 6, title: "Media Laws, Ethics & Press Council of India", desc: "Freedom of speech (Article 19(1)(a)) with reasonable restrictions, defamation laws, Contempt of Court Act, Official Secrets Act, and PCI code of ethics." }
      ]
    }
  },
  {
    id: "arts_linguistics",
    name: "Linguistics",
    stream: "arts",
    degree: "B.A.",
    availableSemesters: [1, 2, 3, 4, 5, 6],
    primarySemesters: [1, 2],
    description: "Phonetics, phonology, morphology, syntax, transformational generative grammar, semantics, pragmatics, and sociolinguistics.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Nature of Language & Core Branches of Linguistics", desc: "Design features of human language (displacement, arbitrariness, duality of patterning), prescriptive vs descriptive linguistics, and synchronic vs diachronic study." },
        { num: 2, title: "Articulatory Phonetics & IPA", desc: "Vocal tract organs of speech, airstream mechanisms (pulmonic egressive), classification of consonants (place and manner of articulation), cardinal vowels, and IPA transcription." },
        { num: 3, title: "Phonology & Suprasegmental Features", desc: "Phonemes, allophones, minimal pairs, complementary distribution, syllable structure, stress, pitch, intonation patterns, and phonological rules." },
        { num: 4, title: "Morphology & Word Formation Processes", desc: "Morphemes, allomorphs, free vs bound morphemes, inflectional vs derivational morphology, compounding, blending, clipping, and back-formation." },
        { num: 5, title: "Syntax & Transformational Generative Grammar", desc: "Immediate Constituent (IC) analysis, Phrase Structure Grammars (PSG), deep vs surface structures, and Noam Chomsky's Transformational Generative Grammar (TGG)." },
        { num: 6, title: "Semantics, Pragmatics & Sociolinguistics", desc: "Sense and reference, lexical relations (synonymy, antonymy, hyponymy), speech acts theory (Austin and Searle), dialects, registers, and bilingualism." }
      ]
    }
  }
];

module.exports = artsSubjects;
