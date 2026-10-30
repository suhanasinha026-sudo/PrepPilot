-- ============================================================================
-- EduPrep — Development & Demo Seed Data (supabase/seed.sql)
-- NOTE: All sample papers, questions, and opportunities are explicitly tagged
-- with verification_status = 'sample' so students never confuse demo content
-- with official university publications.
-- ============================================================================

INSERT INTO public.universities (id, name, short_name, slug, state, city, location, type, is_autonomous)
VALUES
  ('mu', 'University of Mumbai (Mumbai University)', 'MU', 'mumbai-university', 'Maharashtra', 'Mumbai', 'Mumbai, Maharashtra', 'Public State University', FALSE),
  ('sppu', 'Savitribai Phule Pune University (Pune University)', 'SPPU', 'pune-university', 'Maharashtra', 'Pune', 'Pune, Maharashtra', 'Public State University', FALSE),
  ('dbatu', 'Dr. Babasaheb Ambedkar Technological University', 'DBATU', 'dbatu-lonere', 'Maharashtra', 'Lonere', 'Lonere, Raigad', 'State Technological University', FALSE),
  ('coep', 'COEP Technological University Pune', 'COEP', 'coep-pune', 'Maharashtra', 'Pune', 'Shivajinagar, Pune', 'Unitary Autonomous University', TRUE),
  ('vjti', 'Veermata Jijabai Technological Institute', 'VJTI', 'vjti-mumbai', 'Maharashtra', 'Mumbai', 'Matunga, Mumbai', 'Autonomous Institute (MU)', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.colleges (id, university_id, name, short_name, code, city, state, location, is_autonomous, category, badge)
VALUES
  ('vit_wadala', 'mu', 'Vidyalankar Institute of Technology', 'VIT', '3139', 'Mumbai', 'Maharashtra', 'Wadala, Mumbai', TRUE, 'Autonomous Institution', 'NAAC A+ • Autonomous'),
  ('dmce_airoli', 'mu', 'Datta Meghe College of Engineering', 'DMCE', '3187', 'Navi Mumbai', 'Maharashtra', 'Airoli, Navi Mumbai', FALSE, 'Affiliated College', 'MU Affiliated • NBA'),
  ('vjti_matunga', 'mu', 'Veermata Jijabai Technological Institute', 'VJTI', '3012', 'Mumbai', 'Maharashtra', 'Matunga, Mumbai', TRUE, 'Autonomous Institution', 'Govt. Aided Autonomous'),
  ('spit_andheri', 'mu', 'Sardar Patel Institute of Technology', 'SPIT', '3215', 'Mumbai', 'Maharashtra', 'Andheri West, Mumbai', TRUE, 'Autonomous Institution', 'Autonomous • NAAC A+'),
  ('pict_pune', 'sppu', 'Pune Institute of Computer Technology', 'PICT', '6271', 'Pune', 'Maharashtra', 'Dhankawadi, Pune', TRUE, 'Autonomous Institution', 'SPPU Autonomous'),
  ('pccoe_pune', 'sppu', 'Pimpri Chinchwad College of Engineering', 'PCCOE', '6175', 'Pune', 'Maharashtra', 'Nigdi, Pune', TRUE, 'Autonomous Institution', 'NAAC A • Autonomous')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.degrees (id, name, short_name, duration_years, total_semesters, category)
VALUES
  ('btech', 'B.Tech / B.E.', 'B.Tech', 4, 8, 'engineering'),
  ('bsc', 'B.Sc. (Computer Science / IT)', 'B.Sc.', 3, 6, 'computing'),
  ('bca', 'BCA (Computer Applications)', 'BCA', 3, 6, 'computing'),
  ('mca', 'MCA (Master of Computer Applications)', 'MCA', 2, 4, 'computing_pg'),
  ('mtech', 'M.Tech / M.E.', 'M.Tech', 2, 4, 'engineering_pg')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.branches (id, degree_id, name, short_name, code, category)
VALUES
  ('comp', 'btech', 'Computer Engineering', 'COMP', 'CSC', 'Core Computing'),
  ('it', 'btech', 'Information Technology', 'IT', 'ITC', 'Core Computing'),
  ('aiml', 'btech', 'CSE (Artificial Intelligence & Machine Learning)', 'CSE-AIML', 'CSM', 'AI & Data'),
  ('ds', 'btech', 'CSE (Data Science)', 'CSE-DS', 'CSD', 'AI & Data'),
  ('extc', 'btech', 'Electronics & Telecommunication Engineering', 'EXTC', 'ECC', 'Electronics')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.subjects (id, university_id, degree_id, branch_id, semester_number, code, name, credits, teaching_hours, units_count, is_core, description)
VALUES
  ('CSC401', 'mu', 'btech', 'comp', 4, 'CSC401', 'Operating Systems', 4.0, 48, 6, TRUE, 'Process scheduling, synchronization, deadlocks, virtual memory, and file systems.'),
  ('CSC402', 'mu', 'btech', 'comp', 4, 'CSC402', 'Computer Networks', 4.0, 48, 6, TRUE, 'OSI/TCP-IP stack, data link control, subnetting, routing algorithms, and transport layer.'),
  ('CSC403', 'mu', 'btech', 'comp', 4, 'CSC403', 'Database Management Systems', 4.0, 48, 6, TRUE, 'ER modeling, SQL, relational algebra, normalization (1NF-BCNF), and ACID transactions.'),
  ('CSC404', 'mu', 'btech', 'comp', 4, 'CSC404', 'Analysis of Algorithms', 4.0, 48, 6, TRUE, 'Asymptotic notation, divide and conquer, greedy methods, dynamic programming, and NP-completeness.'),
  ('CSC405', 'mu', 'btech', 'comp', 4, 'CSC405', 'Microprocessor & Interfacing', 4.0, 48, 6, TRUE, '8086 architecture, instruction set, memory segmentation, and 8255/8259 interfacing.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.units (id, subject_id, unit_number, title, summary, weightage, estimated_hours)
VALUES
  ('CSC401-U1', 'CSC401', 1, 'Operating System Overview & Structures', 'Kernel architectures, system calls, dual-mode execution', '12M', 6),
  ('CSC401-U2', 'CSC401', 2, 'Process Management & CPU Scheduling', 'Process states, PCB, FCFS, SJF, SRTF, Round Robin', '16M', 9),
  ('CSC401-U3', 'CSC401', 3, 'Process Synchronization & Deadlocks', 'Critical section, semaphores, mutex, Banker algorithm', '18M', 10),
  ('CSC401-U4', 'CSC401', 4, 'Memory Management & Virtual Memory', 'Paging, TLB, FIFO, Optimal, LRU page replacement', '18M', 10)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.question_papers (id, university_id, degree_id, branch_id, subject_id, semester_number, exam_year, exam_session, paper_code, title, solution_notes, marks, duration_minutes, verification_status)
VALUES
  ('pyq-os-2024-may', 'mu', 'btech', 'comp', 'CSC401', 4, 2024, 'May / June', 'CSC401-MAY24', 'Operating Systems — End Semester Theory Paper (May 2024)', 'Includes step-by-step Banker Algorithm safety sequence and LRU page replacement trace.', 80, 180, 'sample'),
  ('pyq-cn-2024-may', 'mu', 'btech', 'comp', 'CSC402', 4, 2024, 'May / June', 'CSC402-MAY24', 'Computer Networks — End Semester Theory Paper (May 2024)', 'Includes CIDR subnet mask calculation and TCP 3-way handshake state diagram.', 80, 180, 'sample'),
  ('pyq-dbms-2023-dec', 'mu', 'btech', 'comp', 'CSC403', 4, 2023, 'Nov / Dec', 'CSC403-DEC23', 'Database Management Systems — End Semester Theory Paper (Dec 2023)', 'Includes BCNF lossless join decomposition and conflict serializability precedence graph.', 80, 180, 'sample')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.questions (id, subject_id, unit_id, question_type, difficulty, marks, question_text, explanation, source_year, verification_status)
VALUES
  ('mcq-os-1', 'CSC401', 'CSC401-U3', 'mcq', 'medium', 2, 'Which of the following four conditions is NOT a necessary Coffman condition for a deadlock to occur in an Operating System?', 'Deadlock requires Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Starvation is a side effect of scheduling, not a Coffman deadlock condition.', 2024, 'sample'),
  ('mcq-os-2', 'CSC401', 'CSC401-U4', 'mcq', 'hard', 2, 'In virtual memory paging, which page replacement algorithm suffers from Belady''s Anomaly (more frames causing more page faults)?', 'FIFO (First-In-First-Out) can experience more page faults when allocated frames increase. Stack algorithms like LRU and Optimal never suffer from Belady''s Anomaly.', 2023, 'sample')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.question_options (id, question_id, option_label, option_text, is_correct, sort_order)
VALUES
  ('mcq-os-1-a', 'mcq-os-1', 'A', 'Mutual Exclusion', FALSE, 1),
  ('mcq-os-1-b', 'mcq-os-1', 'B', 'Hold and Wait', FALSE, 2),
  ('mcq-os-1-c', 'mcq-os-1', 'C', 'Process Starvation', TRUE, 3),
  ('mcq-os-1-d', 'mcq-os-1', 'D', 'Circular Wait', FALSE, 4),
  ('mcq-os-2-a', 'mcq-os-2', 'A', 'Least Recently Used (LRU)', FALSE, 1),
  ('mcq-os-2-b', 'mcq-os-2', 'B', 'First-In-First-Out (FIFO)', TRUE, 2),
  ('mcq-os-2-c', 'mcq-os-2', 'C', 'Optimal Page Replacement', FALSE, 3),
  ('mcq-os-2-d', 'mcq-os-2', 'D', 'Least Frequently Used (LFU)', FALSE, 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.flashcards (id, subject_id, unit_id, front_text, back_text, hint, difficulty, sort_order)
VALUES
  ('fc-os-1', 'CSC401', 'CSC401-U3', 'What are the 4 Coffman conditions required for Deadlock?', '1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait\nAll four must hold simultaneously.', 'Think MHNC', 'easy', 1),
  ('fc-os-2', 'CSC401', 'CSC401-U4', 'Formula for Effective Memory Access Time (EMAT) with TLB', 'EMAT = h * (t_tlb + t_mem) + (1 - h) * (t_tlb + 2 * t_mem), where h is TLB hit ratio.', 'Include 1 memory access on TLB hit and 2 on TLB miss', 'medium', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.opportunities (id, title, organization, opportunity_type, location, mode, eligibility, deadline, apply_url, description, stipend_or_prize, verification_status)
VALUES
  ('opp-sample-1', 'Smart India Hackathon (SIH) — Internal Campus Screening (Sample)', 'AICTE & MoE Innovation Cell (Demo Listing)', 'hackathon', 'Pan-India', 'hybrid', 'B.E./B.Tech/BCA/MCA Students (Teams of 6)', '2026-11-30', 'https://www.sih.gov.in', 'Sample listing demonstrating student hackathon discovery. Verify official dates with your college nodal officer.', '₹1,00,000 National Prize Pool', 'sample'),
  ('opp-sample-2', 'Open Source Summer Coding Fellowship (Sample)', 'Academic Open Source Consortium (Demo Listing)', 'fellowship', 'Remote', 'online', '2nd & 3rd Year Engineering / CS Students', '2026-12-15', 'https://summerofcode.withgoogle.com', 'Sample remote engineering fellowship listing for student portfolio preparation.', 'Stipend + Mentorship Certificate', 'sample')
ON CONFLICT (id) DO NOTHING;
