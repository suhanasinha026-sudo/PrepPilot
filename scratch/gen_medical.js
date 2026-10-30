// Comprehensive Medical Stream Dataset (15 Subjects)
const medicalSubjects = [
  {
    id: "med_anatomy",
    name: "Anatomy",
    stream: "medical",
    degree: "MBBS",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    primarySemesters: [1, 2],
    description: "Gross human anatomy, embryology, histology, neuroanatomy, osteology, and clinical anatomical correlations.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "General Anatomy, Tissues & Embryology", desc: "Anatomical terminology, bone classification, cartilage types, gametogenesis, fertilization, germ layers, and early embryonic development." },
        { num: 2, title: "Gross Anatomy of the Upper Limb", desc: "Pectoral region, axilla, brachial plexus, arm, cubital fossa, forearm flexor/extensor compartments, carpal tunnel, and hand spaces." },
        { num: 3, title: "Thoracic Cage, Lungs & Mediastinum", desc: "Intercostal spaces, pleural cavities, lung bronchopulmonary segments, mediastinum divisions, pericardium, and coronary circulation." },
        { num: 4, title: "Gross Anatomy of the Lower Limb", desc: "Femoral triangle, adductor canal, gluteal region, sciatic nerve, popliteal fossa, knee joint stability, and arches of the foot." },
        { num: 5, title: "Abdominal Viscera, Peritoneum & Pelvis", desc: "Anterior abdominal wall, inguinal canal, stomach, liver, pancreas, kidneys, peritoneal folds, and pelvic organs." },
        { num: 6, title: "Head, Neck & Neuroanatomy", desc: "Triangles of the neck, cranial nerves, Circle of Willis, brainstem internal architecture, cerebral cortex functional areas, and ventricles." }
      ]
    }
  },
  {
    id: "med_physiology",
    name: "Physiology",
    stream: "medical",
    degree: "MBBS",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    primarySemesters: [1, 2],
    description: "Cell physiology, blood, cardiovascular, respiratory, renal, neurophysiology, and endocrine system functions.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "General Physiology & Cell Membrane Transport", desc: "Homeostasis, resting membrane potential, active and passive transport mechanisms, ion channels, and Nernst equation." },
        { num: 2, title: "Blood Physiology & Immunity", desc: "Erythropoiesis, hemoglobin synthesis, blood groups (ABO and Rh system), platelets, coagulation cascade, and immune cells." },
        { num: 3, title: "Cardiovascular System & Hemodynamics", desc: "Cardiac cycle phases, electrical conduction system, ECG leads interpretation, cardiac output regulation, and blood pressure control." },
        { num: 4, title: "Respiratory Mechanics & Gas Exchange", desc: "Mechanics of breathing, surfactant, lung compliance, pulmonary volumes and capacities, oxygen-hemoglobin dissociation curve." },
        { num: 5, title: "Renal Physiology & Fluid Balance", desc: "Glomerular filtration rate (GFR), tubular reabsorption and secretion, countercurrent multiplier mechanism, and micturition reflex." },
        { num: 6, title: "Neurophysiology & Endocrine Regulation", desc: "Action potentials, synaptic transmission, motor and sensory pathways, hypothalamus-pituitary axis, thyroid, and adrenal cortex hormones." }
      ]
    }
  },
  {
    id: "med_biochemistry",
    name: "Biochemistry",
    stream: "medical",
    degree: "MBBS",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    primarySemesters: [1, 2],
    description: "Metabolism of carbohydrates, lipids, proteins, enzymes, vitamins, clinical biochemistry, and molecular biology.",
    chaptersBySemester: {
      1: [
        { num: 1, title: "Enzymology & Bioenergetics", desc: "Enzyme kinetics, Michaelis-Menten equation, Lineweaver-Burk plot, competitive and non-competitive enzyme inhibition, and coenzymes." },
        { num: 2, title: "Carbohydrate Metabolism", desc: "Glycolysis, Krebs citric acid cycle, HMP shunt pathway, glycogen storage and breakdown, gluconeogenesis, and diabetes mellitus regulation." },
        { num: 3, title: "Lipid Metabolism & Transport", desc: "Beta-oxidation of fatty acids, ketogenesis, cholesterol biosynthesis, lipoprotein classes (chylomicrons, VLDL, LDL, HDL), and atherosclerosis." },
        { num: 4, title: "Amino Acid & Protein Metabolism", desc: "Transamination, deamination, urea cycle disorders, synthesis of specialized products, and inborn errors of metabolism (PKU, albinism)." },
        { num: 5, title: "Molecular Biology & Genetics", desc: "DNA replication, transcription, translation, genetic code, gene expression regulation (Lac operon), and Polymerase Chain Reaction (PCR)." },
        { num: 6, title: "Clinical Biochemistry & Organ Function Tests", desc: "Liver function tests (bilirubin, SGOT, SGPT), kidney function tests (BUN, creatinine clearance), and clinical diagnostic biomarkers." }
      ]
    }
  },
  {
    id: "med_pathology",
    name: "Pathology",
    stream: "medical",
    degree: "MBBS",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    primarySemesters: [3, 4, 5],
    description: "General pathology, cell injury, inflammation, tissue repair, neoplasia, hematology, and systemic organ pathology.",
    chaptersBySemester: {
      3: [
        { num: 1, title: "Cell Injury, Necrosis & Apoptosis", desc: "Etiology of cell injury, reversible vs irreversible cellular adaptations (hypertrophy, atrophy, metaplasia), types of necrosis, and apoptosis." },
        { num: 2, title: "Inflammation & Wound Healing", desc: "Acute inflammation vascular and cellular events, chemical mediators, chronic inflammation, granulomas, and primary/secondary wound repair." },
        { num: 3, title: "Hemodynamic Disorders & Thromboembolism", desc: "Hyperemia, congestion, edema mechanisms, Virchow's triad, thrombosis pathogenesis, embolism, infarction types, and shock stages." },
        { num: 4, title: "Neoplasia: Benign and Malignant Tumors", desc: "Nomenclature, hallmarks of cancer, proto-oncogenes, tumor suppressor genes (p53, Rb), chemical and viral carcinogenesis, and metastasis." },
        { num: 5, title: "Hematology: Anemias & Leukemias", desc: "Iron deficiency anemia, megaloblastic anemia, hemolytic anemias, acute and chronic leukemias (ALL, AML, CLL, CML), and lymphomas." },
        { num: 6, title: "Systemic Cardiovascular & Renal Pathology", desc: "Atherosclerosis plaques, myocardial infarction complications, rheumatic heart disease, nephritic vs nephrotic syndromes, glomerulonephritis." }
      ]
    }
  },
  {
    id: "med_pharmacology",
    name: "Pharmacology",
    stream: "medical",
    degree: "MBBS",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    primarySemesters: [3, 4, 5],
    description: "Pharmacokinetics, pharmacodynamics, autonomic nervous system, cardiovascular, CNS, and antimicrobial chemotherapy.",
    chaptersBySemester: {
      3: [
        { num: 1, title: "General Pharmacology: ADME & Receptors", desc: "Drug absorption, bioavailability, volume of distribution, cytochrome P450 metabolism, clearance, half-life, and G-protein coupled receptors." },
        { num: 2, title: "Autonomic Nervous System Drugs", desc: "Cholinergic agonists, anticholinergics (atropine), adrenergic agonists (adrenaline, noradrenaline), alpha blockers, and beta blockers." },
        { num: 3, title: "Cardiovascular System Drugs", desc: "Antihypertensive classes (ACE inhibitors, ARBs, CCBs, diuretics), antianginal nitrates, antiarrhythmics, and heart failure inotropes." },
        { num: 4, title: "Central Nervous System Pharmacology", desc: "Sedative-hypnotics (benzodiazepines), antiepileptic drugs, antidepressants (SSRIs), antipsychotics, and opioid analgesics." },
        { num: 5, title: "Chemotherapy of Infectious Diseases", desc: "Beta-lactam penicillins and cephalosporins, aminoglycosides, macrolides, fluoroquinolones, antitubercular DOTS regimen, and antivirals." },
        { num: 6, title: "Endocrine & Autacoid Pharmacology", desc: "Insulin regimens, oral hypoglycemic agents (metformin, sulfonylureas), corticosteroids, thyroid medications, and NSAIDs." }
      ]
    }
  },
  {
    id: "med_microbiology",
    name: "Microbiology",
    stream: "medical",
    degree: "MBBS",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    primarySemesters: [3, 4, 5],
    description: "General bacteriology, immunology, systemic bacteriology, virology, mycology, and medical parasitology.",
    chaptersBySemester: {
      3: [
        { num: 1, title: "General Bacteriology & Sterilization", desc: "Bacterial cell wall, Gram-positive vs Gram-negative staining, bacterial growth kinetics, sterilization methods (autoclaving), and disinfectants." },
        { num: 2, title: "Immunology & Immune Responses", desc: "Innate vs adaptive immunity, antigen processing, antibody structure (IgG, IgM, IgA, IgE), complement pathways, and Hypersensitivity I-IV." },
        { num: 3, title: "Systemic Gram-Positive & Negative Bacteria", desc: "Staphylococcus aureus, Streptococcus pyogenes, Enterobacteriaceae (Salmonella, Shigella), Vibrio cholerae, and Mycobacterium tuberculosis." },
        { num: 4, title: "Medical Virology", desc: "Viral replication, Hepatitis A, B, C viruses, Human Immunodeficiency Virus (HIV) pathogenesis, Influenza, Rabies, and COVID-19." },
        { num: 5, title: "Medical Mycology & Fungal Infections", desc: "Dermatophytosis, opportunistic fungi (Candida albicans, Aspergillus, Mucormycosis), and antifungal susceptibility testing." },
        { num: 6, title: "Medical Parasitology", desc: "Protozoa life cycles (Entamoeba histolytica, Plasmodium malaria), helminths (Ascaris lumbricoides, Taenia solium), and diagnostic stool microscopy." }
      ]
    }
  },
  {
    id: "med_forensic",
    name: "Forensic Medicine",
    stream: "medical",
    degree: "MBBS",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    primarySemesters: [6, 7],
    description: "Medical jurisprudence, thanatology, forensic traumatology, mechanical injuries, firearm wounds, and clinical toxicology.",
    chaptersBySemester: {
      6: [
        { num: 1, title: "Legal Procedures & Medical Jurisprudence", desc: "Indian courts system, inquest types (police and magistrate), legal duties of medical practitioners, professional negligence, and consent." },
        { num: 2, title: "Thanatology & Post-Mortem Changes", desc: "Signs of death, cooling of body (algor mortis), post-mortem lividity (hypostasis), rigor mortis timeline, putrefaction, and estimation of time since death." },
        { num: 3, title: "Forensic Traumatology & Mechanical Injuries", desc: "Abrasions, contusions, lacerations, incised wounds, stab wounds, defense injuries, and differences between ante-mortem and post-mortem wounds." },
        { num: 4, title: "Firearm Wounds & Blast Injuries", desc: "Classification of firearms, smoothbore vs rifled weapons, entry and exit wound characteristics, powder tattooing, and range of firing." },
        { num: 5, title: "Asphyxial Deaths", desc: "Mechanical asphyxia forms: hanging vs strangulation (ligature and manual), drowning signs (diatom test), and smothering." },
        { num: 6, title: "Clinical Forensic Toxicology", desc: "General management of poisoning, corrosives, heavy metals (arsenic, lead), organophosphates, snakebite envenomation, and plant poisons." }
      ]
    }
  },
  {
    id: "med_community",
    name: "Community Medicine",
    stream: "medical",
    degree: "MBBS",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    primarySemesters: [6, 7],
    description: "Epidemiology, biostatistics, public health, communicable diseases, maternal and child health, and healthcare delivery systems.",
    chaptersBySemester: {
      6: [
        { num: 1, title: "Concepts of Health, Disease & Prevention", desc: "Definitions of health, natural history of disease, epidemiological triad, iceberg phenomenon of disease, and levels of prevention (primordial to tertiary)." },
        { num: 2, title: "Epidemiological Methods & Study Designs", desc: "Descriptive studies, analytical studies (Case-Control, Cohort studies, Odds Ratio, Relative Risk), and randomized controlled trials (RCT)." },
        { num: 3, title: "Biostatistics in Medical Practice", desc: "Measures of central tendency and dispersion, normal distribution curve, tests of significance (Student's t-test, Chi-square), and p-value." },
        { num: 4, title: "Epidemiology of Communicable Diseases", desc: "Transmission dynamics, surveillance, eradication vs elimination, tuberculosis (NTEP), malaria, vector-borne diseases, and vaccine preventable diseases." },
        { num: 5, title: "Maternal, Child Health & Nutrition", desc: "Antenatal care guidelines, High-Risk pregnancy indicators, infant mortality rate (IMR), maternal mortality ratio (MMR), and malnutrition." },
        { num: 6, title: "National Health Programs & Healthcare Delivery", desc: "Ayushman Bharat PMJAY, National Health Mission (NHM), primary health center (PHC) setup, and universal health coverage." }
      ]
    }
  },
  {
    id: "med_general_med",
    name: "General Medicine",
    stream: "medical",
    degree: "MBBS",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    primarySemesters: [8, 9],
    description: "Cardiology, pulmonology, gastroenterology, nephrology, neurology, infectious diseases, and endocrine disorders.",
    chaptersBySemester: {
      8: [
        { num: 1, title: "Cardiovascular Medicine & Hypertension", desc: "Etiology, clinical presentation, and management of systemic hypertension, acute coronary syndromes, valvular diseases, and congestive heart failure." },
        { num: 2, title: "Pulmonology & Respiratory Disorders", desc: "Community-acquired pneumonia, chronic obstructive pulmonary disease (COPD), bronchial asthma management, pleural effusions, and pulmonary embolism." },
        { num: 3, title: "Gastroenterology & Hepatology", desc: "Peptic ulcer disease, gastrointestinal bleeding, cirrhosis complications (ascites, hepatic encephalopathy, varices), and inflammatory bowel disease." },
        { num: 4, title: "Nephrology & Acid-Base Disorders", desc: "Acute kidney injury (AKI) RIFLE criteria, chronic kidney disease (CKD) staging, nephrotic syndrome, and metabolic acidosis/alkalosis." },
        { num: 5, title: "Endocrine & Metabolic Disorders", desc: "Type 1 and Type 2 diabetes mellitus guidelines, diabetic ketoacidosis (DKA) management, hypothyroidism, hyperthyroidism, and Cushing's syndrome." },
        { num: 6, title: "Neurology & Infectious Diseases", desc: "Acute ischemic and hemorrhagic stroke management, bacterial and viral meningitis, status epilepticus, sepsis protocols, and dengue fever." }
      ]
    }
  },
  {
    id: "med_general_surg",
    name: "General Surgery",
    stream: "medical",
    degree: "MBBS",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    primarySemesters: [8, 9],
    description: "Preoperative care, wound management, burns, gastrointestinal surgery, hernias, and surgical oncology.",
    chaptersBySemester: {
      8: [
        { num: 1, title: "Surgical Principles, Fluids & Shock", desc: "Metabolic response to trauma, fluid and electrolyte resuscitation, blood transfusion hazards, surgical shock classification, and asepsis." },
        { num: 2, title: "Wounds, Burns & Surgical Infections", desc: "Classification of wounds, debridement, skin grafting techniques, Wallace rule of nines for burn surface area, fluid formula, and necrotizing fasciitis." },
        { num: 3, title: "Abdominal Emergencies & Acute Abdomen", desc: "Differential diagnosis of acute abdomen, acute appendicitis signs, perforated peptic ulcer, mechanical intestinal obstruction, and peritonitis." },
        { num: 4, title: "Hernias of the Abdominal Wall", desc: "Anatomy of inguinal canal, direct vs indirect inguinal hernias, femoral hernia, strangulated hernia emergency, and open/laparoscopic mesh repair." },
        { num: 5, title: "Hepatobiliary, Pancreas & Spleen Surgery", desc: "Gallstone disease, acute and chronic cholecystitis, acute pancreatitis Atlanta classification, obstructive jaundice, and splenectomy." },
        { num: 6, title: "Thyroid & Breast Surgical Diseases", desc: "Solitary thyroid nodule evaluation, multinodular goiter, thyroid malignancies, benign breast diseases (fibroadenoma), and breast carcinoma staging." }
      ]
    }
  },
  {
    id: "med_obgyn",
    name: "Obstetrics and Gynaecology",
    stream: "medical",
    degree: "MBBS",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    primarySemesters: [8, 9],
    description: "Antenatal care, normal and abnormal labor, obstetric complications, menstrual disorders, contraception, and gynecological oncology.",
    chaptersBySemester: {
      8: [
        { num: 1, title: "Antenatal Physiology & Normal Pregnancy", desc: "Diagnosis of pregnancy, physiological adaptations, routine antenatal screening, fetal growth monitoring, and nutritional requirements." },
        { num: 2, title: "Mechanisms of Normal Labor & Partograph", desc: "Four stages of labor, vertex presentation cardinal movements, WHO modified partograph plotting, and active management of third stage." },
        { num: 3, title: "High-Risk Obstetric Complications", desc: "Hypertensive disorders of pregnancy (preeclampsia, eclampsia), gestational diabetes mellitus, preterm labor, and antepartum hemorrhage (abruptio vs placenta previa)." },
        { num: 4, title: "Postpartum Hemorrhage & Puerperium", desc: "Primary and secondary postpartum hemorrhage (4 Ts: Tone, Tissue, Trauma, Thrombin), medical and surgical management, and puerperal sepsis." },
        { num: 5, title: "Gynaecological Disorders & Infertility", desc: "Abnormal uterine bleeding (PALM-COEIN classification), endometriosis, polycystic ovarian syndrome (PCOS), and male/female infertility workup." },
        { num: 6, title: "Gynecological Cancers & Contraception", desc: "Cervical cancer screening (Pap smear, HPV testing), endometrial cancer, ovarian tumors, barrier, hormonal, and permanent contraceptive methods." }
      ]
    }
  },
  {
    id: "med_pediatrics",
    name: "Pediatrics",
    stream: "medical",
    degree: "MBBS",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    primarySemesters: [8, 9],
    description: "Child growth, developmental milestones, neonatal resuscitation, pediatric infections, malnutrition, and pediatric emergencies.",
    chaptersBySemester: {
      8: [
        { num: 1, title: "Growth, Development & Milestones", desc: "Physical growth assessment (weight, height, head circumference), WHO growth charts, motor, adaptive, language, and social developmental milestones." },
        { num: 2, title: "Neonatal Care & Resuscitation", desc: "Neonatal resuscitation algorithm, APGAR scoring, care of low birth weight neonates, neonatal jaundice, and respiratory distress syndrome." },
        { num: 3, title: "Nutritional Disorders & Micronutrient Deficiencies", desc: "Severe acute malnutrition (SAM) WHO management protocols, marasmus, kwashiorkor, rickets, scurvy, and vitamin A deficiency." },
        { num: 4, title: "National Immunization Schedule (NIS)", desc: "Vaccines against childhood diseases, cold chain maintenance, contraindications, and adverse events following immunization (AEFI)." },
        { num: 5, title: "Common Pediatric Infections & Emergencies", desc: "Acute diarrheal diseases and ORS hydration therapy, acute lower respiratory tract infections (pneumonia, bronchiolitis), and febrile seizures." },
        { num: 6, title: "Congenital Anomalies & Pediatric Cardiology", desc: "Acyanotic congenital heart diseases (VSD, ASD, PDA), cyanotic defects (Tetralogy of Fallot), genetic syndromes (Down syndrome), and neural tube defects." }
      ]
    }
  },
  {
    id: "med_ophthalmology",
    name: "Ophthalmology",
    stream: "medical",
    degree: "MBBS",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    primarySemesters: [6, 7],
    description: "Ocular anatomy, refraction, cataract, glaucoma, corneal diseases, retinal pathologies, and blindness prevention.",
    chaptersBySemester: {
      6: [
        { num: 1, title: "Ocular Anatomy & Errors of Refraction", desc: "Anatomy of the orbit, eyeball coats, optical system, myopia, hypermetropia, astigmatism, presbyopia, and spectacle corrections." },
        { num: 2, title: "Diseases of Conjunctiva and Cornea", desc: "Bacterial, viral, allergic conjunctivitis, trachoma, corneal ulcer classification (bacterial vs fungal), and corneal blindness." },
        { num: 3, title: "Cataract & Lens Disorders", desc: "Etiology of senile, congenital, traumatic cataracts, clinical stages, intraocular lens (IOL) power calculation, and phacoemulsification surgery." },
        { num: 4, title: "Glaucoma Pathophysiology & Management", desc: "Aqueous humor dynamics, primary open-angle glaucoma (POAG), acute angle-closure glaucoma emergency, tonometry, and visual field defects." },
        { num: 5, title: "Retinal Pathologies & Vitreous Disorders", desc: "Diabetic retinopathy staging, hypertensive retinopathy Keith-Wagener classification, retinal detachment (rhegmatogenous), and fundoscopy." },
        { num: 6, title: "Ocular Emergencies & Community Ophthalmology", desc: "Chemical eye burns management, blunt ocular trauma, hyphema, National Program for Control of Blindness (NPCB), and vision screening." }
      ]
    }
  },
  {
    id: "med_ent",
    name: "Otorhinolaryngology",
    stream: "medical",
    degree: "MBBS",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    primarySemesters: [6, 7],
    description: "Diseases of the ear, hearing loss, nasal cavity, paranasal sinuses, pharynx, larynx, and vocal cord pathologies.",
    chaptersBySemester: {
      6: [
        { num: 1, title: "Anatomy and Physiology of the Ear", desc: "External, middle, inner ear anatomy, Eustachian tube functions, physiology of hearing and equilibrium, tuning fork tests (Rinne, Weber), and audiometry." },
        { num: 2, title: "Diseases of External & Middle Ear", desc: "Otitis externa, Acute Suppurative Otitis Media (ASOM), Chronic Suppurative Otitis Media (tubotympanic vs atticoantral type), and cholesteatoma." },
        { num: 3, title: "Inner Ear Disorders & Vertigo", desc: "Conductive vs sensorineural hearing loss, otosclerosis, Meniere's disease pathophysiology, Benign Paroxysmal Positional Vertigo (BPPV), and Dix-Hallpike." },
        { num: 4, title: "Diseases of Nose and Paranasal Sinuses", desc: "Deviated nasal septum (DNS) and submucous resection, acute and chronic rhinosinusitis, nasal polyps (ethmoidal vs antrochoanal), and FESS." },
        { num: 5, title: "Epistaxis & Facial Trauma", desc: "Etiology, vascular supply of Little's area (Kiesselbach's plexus), anterior vs posterior nasal packing, and nasal bone fractures." },
        { num: 6, title: "Pharynx, Larynx & Airway Obstruction", desc: "Acute and chronic tonsillitis, adenoid hypertrophy, stridor differential diagnosis, vocal cord nodules/polyps, and tracheostomy procedure." }
      ]
    }
  },
  {
    id: "med_orthopedics",
    name: "Orthopedics",
    stream: "medical",
    degree: "MBBS",
    availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    primarySemesters: [8, 9],
    description: "Fractures, dislocations, joint infections, bone tumors, osteoarthritis, spinal deformities, and pediatric orthopedics.",
    chaptersBySemester: {
      8: [
        { num: 1, title: "Fracture Principles & Healing Mechanisms", desc: "Fracture classifications, stages of bone healing, primary vs secondary healing, principles of closed reduction, cast application, and internal fixation." },
        { num: 2, title: "Upper Extremity Fractures & Dislocations", desc: "Fracture clavicle, humeral shaft fracture with radial nerve injury, supracondylar fracture of humerus in children, Colles' fracture, and shoulder dislocation." },
        { num: 3, title: "Lower Extremity & Pelvic Fractures", desc: "Femoral neck fractures, intertrochanteric fractures, femoral shaft fractures, tibia fractures, compartment syndrome, and hip dislocations." },
        { num: 4, title: "Bone and Joint Infections", desc: "Acute hematogenous osteomyelitis etiology and staging, chronic osteomyelitis (sequestrum, involucrum), septic arthritis, and tuberculosis of spine (Pott's spine)." },
        { num: 5, title: "Degenerative Joint Diseases & Spine", desc: "Osteoarthritis of knee joint pathogenesis and management, rheumatoid arthritis deformities, intervertebral disc prolapse (IVDP), and sciatica." },
        { num: 6, title: "Congenital Anomalies & Bone Tumors", desc: "Congenital Talipes Equinovarus (CTEV/clubfoot) Ponseti technique, Developmental Dysplasia of Hip (DDH), osteosarcoma, and giant cell tumor." }
      ]
    }
  }
];

module.exports = medicalSubjects;
