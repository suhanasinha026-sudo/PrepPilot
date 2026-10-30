/**
 * EduPrep — Centralized PYQ & University Question Papers Engine
 * Covers all 70 subjects across Engineering (25), Medical (15), Commerce (15), Arts (15).
 * Features structured 2-mark, 5-mark & 10-mark questions, chapter mappings,
 * real-time weightage calculation, and pure-JS standard PDF 1.4 document generation.
 */

(function () {
  'use strict';

  const FIELD_METADATA = {
    engineering: {
      id: "engineering",
      label: "Engineering",
      shortLabel: "Engineering",
      degree: "B.E. / B.Tech",
      icon: "engineering",
      university: "State Technological University"
    },
    medical: {
      id: "medical",
      label: "Medical",
      shortLabel: "Medical",
      degree: "MBBS / Allied Health",
      icon: "medical_services",
      university: "National Medical Sciences Board"
    },
    commerce: {
      id: "commerce",
      label: "Commerce",
      shortLabel: "Commerce",
      degree: "B.Com / BBA / BMS",
      icon: "monitoring",
      university: "Apex Board of Commerce & Management"
    },
    arts: {
      id: "arts",
      label: "Arts",
      shortLabel: "Arts",
      degree: "B.A. / Humanities",
      icon: "palette",
      university: "Central Humanities & Arts Council"
    }
  };

  const PyqEngine = {
    fields: ["engineering", "medical", "commerce", "arts"],
    fieldMetadata: FIELD_METADATA,

    getFieldMeta: function (field) {
      const key = (field || "engineering").toLowerCase();
      return FIELD_METADATA[key] || FIELD_METADATA.engineering;
    },

    getSubjectsForField: function (field) {
      const f = (field || "engineering").toLowerCase();
      const root = typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this);
      if (root.EduPrep && typeof root.EduPrep.getStreamSubjects === 'function') {
        return root.EduPrep.getStreamSubjects(f);
      }
      if (root.EduPrep && root.EduPrep.STREAM_SUBJECTS && root.EduPrep.STREAM_SUBJECTS[f]) {
        return root.EduPrep.STREAM_SUBJECTS[f];
      }
      return [];
    },

    getChaptersForSubject: function (subjectName) {
      if (!subjectName) return [];
      const root = typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this);
      let ce = (root.EduPrep && root.EduPrep.chaptersEngine) ||
                 root.EduPrepChapters ||
                 root.ChaptersEngine;
      if (!ce && typeof require === 'function') {
        try {
          ce = require('./eduprep_chapters_data.js');
        } catch (e) {}
      }
      if (ce && typeof ce.getChapters === 'function') {
        return ce.getChapters(subjectName);
      }
      if (root.EduPrep && typeof root.EduPrep.getChapters === 'function') {
        return root.EduPrep.getChapters(subjectName);
      }
      return [];
    },

    /**
     * Synthesize or retrieve structured question papers for any subject
     */
    getPapersForSubject: function (subjectName, chapterId, yearFilter) {
      if (!subjectName) return [];

      const root = typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this);
      let ce = (root.EduPrep && root.EduPrep.chaptersEngine) ||
                 root.EduPrepChapters ||
                 root.ChaptersEngine;
      if (!ce && typeof require === 'function') {
        try {
          ce = require('./eduprep_chapters_data.js');
        } catch (e) {}
      }

      const meta = (ce && ce.getSubjectMeta) ? ce.getSubjectMeta(subjectName) : null;
      let field = meta ? meta.stream : null;
      if (!field && root.EduPrep && root.EduPrep.STREAM_SUBJECTS) {
        const streams = ["engineering", "medical", "commerce", "arts"];
        for (let i = 0; i < streams.length; i++) {
          const sList = root.EduPrep.STREAM_SUBJECTS[streams[i]] || [];
          if (sList.some(function (s) { return s.toLowerCase() === subjectName.toLowerCase(); })) {
            field = streams[i];
            break;
          }
        }
      }
      if (!field) field = "engineering";
      const fieldInfo = this.getFieldMeta(field);
      const subId = meta ? meta.id : subjectName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const semester = (meta && meta.primarySemesters && meta.primarySemesters.length > 0) ? meta.primarySemesters[0] : 4;
      const chapters = this.getChaptersForSubject(subjectName);

      // Check if existing static papers in EduPrep.pyqPapers match this subject
      const existingPapers = (root.EduPrep && root.EduPrep.pyqPapers) ? root.EduPrep.pyqPapers.filter(function (p) {
        return p.subject && p.subject.toLowerCase() === subjectName.toLowerCase();
      }) : [];

      const years = ["2024", "2023", "2022"];
      const papers = [];

      years.forEach(function (yr) {
        if (yearFilter && yearFilter !== "all" && String(yearFilter) !== yr) {
          return;
        }

        // Look for existing static paper matching this year
        const matchExisting = existingPapers.find(function (p) { return String(p.year) === yr; });

        if (matchExisting && matchExisting.questions && matchExisting.questions.length >= 2) {
          // Enhance existing static paper with structured 2M, 5M, 10M sections and chapter mapping
          const enhanced = Object.assign({}, matchExisting);
          enhanced.stream = field;
          enhanced.field = field;
          enhanced.sections = PyqEngine._normalizeExistingSections(enhanced, chapters);
          enhanced.allQuestions = PyqEngine._flattenSections(enhanced.sections);
          enhanced.questionsCount = enhanced.allQuestions.length;
          enhanced.maxMarks = enhanced.allQuestions.reduce(function (sum, q) { return sum + q.marks; }, 0) || 80;

          // If filtering by chapter, check if any questions match
          if (chapterId && chapterId !== "all") {
            const hasCh = enhanced.allQuestions.some(function (q) { return q.chapterId === chapterId; });
            if (!hasCh) return;
          }

          papers.push(enhanced);
          return;
        }

        // Generate authentic syllabus-derived paper
        const paperId = "pyq_" + subId + "_" + yr;
        const session = yr === "2024" ? "May / June 2024" : (yr === "2023" ? "Nov / Dec 2023" : "May / June 2022");
        const sections = PyqEngine._generateStructuredSections(subjectName, chapters, yr, subId);
        const allQuestions = PyqEngine._flattenSections(sections);

        // If filtering by chapter, check if any questions match
        if (chapterId && chapterId !== "all") {
          const hasCh = allQuestions.some(function (q) { return q.chapterId === chapterId; });
          if (!hasCh) return;
        }

        papers.push({
          id: paperId,
          university: fieldInfo.university,
          universityId: "board_" + field,
          subject: subjectName,
          subjectCode: meta ? (meta.degree.split(' ')[0] + "-" + subId.toUpperCase().slice(0, 6)) : "CSC401",
          code: meta ? subId.toUpperCase().slice(0, 6) : "CSC401",
          course: meta ? meta.degree : "Degree Program",
          semester: semester,
          year: yr,
          session: session,
          examPeriod: session,
          duration: "3 Hours",
          maxMarks: 80,
          marks: 80,
          stream: field,
          field: field,
          verificationStatus: "sample",
          isSample: true,
          questionsCount: allQuestions.length,
          sections: sections,
          allQuestions: allQuestions
        });
      });

      return papers;
    },

    _normalizeExistingSections: function (paper, chapters) {
      const sections = [];
      const chList = (chapters && chapters.length > 0) ? chapters : [
        { id: "ch_core_1", chapterNum: 1, title: "Foundations & Principles" }
      ];

      // Section A: 2-Mark Short Questions (10 questions = 20 Marks)
      const secAQuestions = [];
      for (let i = 0; i < 10; i++) {
        const ch = chList[i % chList.length];
        const def = (ch.notes && ch.notes.keyDefinitions && ch.notes.keyDefinitions[i % ch.notes.keyDefinitions.length]) || null;
        const qText = def ? `Define "${def.term}" and explain its academic significance in ${ch.title}.`
                          : `State the fundamental core principle of ${ch.title} and give a practical example.`;
        secAQuestions.push({
          id: `q_${paper.year}_secA_${i + 1}`,
          qNo: `1(${String.fromCharCode(97 + i)})`,
          marks: 2,
          section: "Section A (2 Marks)",
          chapterId: ch.id,
          chapterTitle: `Unit ${ch.chapterNum || (i % chList.length + 1)}: ${ch.title}`,
          q: qText
        });
      }
      sections.push({
        title: "Section A — Short Conceptual Questions [2 Marks each]",
        marksPerQuestion: 2,
        totalMarks: 20,
        instructions: "Answer all TEN questions. Each question carries 2 marks.",
        questions: secAQuestions
      });

      // Section B: 5-Mark Analytical Questions (4 questions = 20 Marks)
      const secBQuestions = [];
      for (let i = 0; i < 4; i++) {
        const ch = chList[i % chList.length];
        const exp = (ch.notes && ch.notes.conceptualExplanations && ch.notes.conceptualExplanations[i % ch.notes.conceptualExplanations.length]) || null;
        const qText = exp ? `Explain the core mechanism, architecture, and workflow of ${(exp.heading || '').replace(/^\d+\.\s*/, '')} with an illustrative diagram.`
                          : `Compare primary methods and state their operational trade-offs in ${ch.title}.`;
        secBQuestions.push({
          id: `q_${paper.year}_secB_${i + 1}`,
          qNo: `2(${String.fromCharCode(97 + i)})`,
          marks: 5,
          section: "Section B (5 Marks)",
          chapterId: ch.id,
          chapterTitle: `Unit ${ch.chapterNum || (i % chList.length + 1)}: ${ch.title}`,
          q: qText
        });
      }
      sections.push({
        title: "Section B — Analytical & Core Problems [5 Marks each]",
        marksPerQuestion: 5,
        totalMarks: 20,
        instructions: "Attempt all FOUR questions. Each question carries 5 marks.",
        questions: secBQuestions
      });

      // Section C: 10-Mark In-Depth Questions (4 questions = 40 Marks)
      const secCQuestions = [];
      for (let i = 0; i < 4; i++) {
        const ch = chList[(i + 1) % chList.length];
        const prob = (ch.notes && ch.notes.examplesOrProblems && ch.notes.examplesOrProblems[0]) || null;
        const qText = prob ? `Analyze the step-by-step problem-solving derivation for "${prob.title || ch.title}". Show full mathematical/algorithmic steps and discuss edge cases.`
                           : `Derive the complete architectural workflow for high-weightage topics in ${ch.title}. Design and explain with a neat labeled block diagram.`;
        secCQuestions.push({
          id: `q_${paper.year}_secC_${i + 1}`,
          qNo: `${i < 2 ? '3' : '4'}(${String.fromCharCode(97 + (i % 2))})`,
          marks: 10,
          section: "Section C (10 Marks)",
          chapterId: ch.id,
          chapterTitle: `Unit ${ch.chapterNum || ((i + 1) % chList.length + 1)}: ${ch.title}`,
          q: qText
        });
      }
      sections.push({
        title: "Section C — Comprehensive / In-Depth Questions [10 Marks each]",
        marksPerQuestion: 10,
        totalMarks: 40,
        instructions: "Attempt any FOUR questions. Each question carries 10 marks.",
        questions: secCQuestions
      });

      return sections;
    },

    _generateStructuredSections: function (subjectName, chapters, year) {
      return PyqEngine._normalizeExistingSections({ year: year, subject: subjectName }, chapters);
    },

    _flattenSections: function (sections) {
      const list = [];
      (sections || []).forEach(function (sec) {
        (sec.questions || []).forEach(function (q) {
          list.push(q);
        });
      });
      return list;
    },

    /**
     * Compute real-time weightage distribution based on active questions
     */
    calculateWeightage: function (papers, selectedChapterId) {
      if (!papers || papers.length === 0) {
        return {
          totalMarks: 0,
          totalQuestions: 0,
          marksCategories: {
            twoMarks: { count: 0, marks: 0, pct: 0 },
            fiveMarks: { count: 0, marks: 0, pct: 0 },
            tenMarks: { count: 0, marks: 0, pct: 0 }
          },
          chapterWeightage: []
        };
      }

      // Collect all questions across matching papers
      const allQ = [];
      papers.forEach(function (p) {
        const qList = p.allQuestions || PyqEngine._flattenSections(p.sections);
        qList.forEach(function (q) {
          if (!selectedChapterId || selectedChapterId === "all" || q.chapterId === selectedChapterId) {
            allQ.push(q);
          }
        });
      });

      let m2Count = 0, m2Marks = 0;
      let m5Count = 0, m5Marks = 0;
      let m10Count = 0, m10Marks = 0;
      const chMap = {};

      allQ.forEach(function (q) {
        const m = q.marks || 2;
        if (m === 2) {
          m2Count++;
          m2Marks += 2;
        } else if (m === 5) {
          m5Count++;
          m5Marks += 5;
        } else if (m === 10) {
          m10Count++;
          m10Marks += 10;
        }

        const chKey = q.chapterId || "other";
        if (!chMap[chKey]) {
          chMap[chKey] = {
            chapterId: chKey,
            chapterTitle: q.chapterTitle || "General Curriculum",
            questionCount: 0,
            marks: 0
          };
        }
        chMap[chKey].questionCount++;
        chMap[chKey].marks += m;
      });

      const totalMarks = m2Marks + m5Marks + m10Marks;
      const totalQuestions = m2Count + m5Count + m10Count;

      const chList = Object.keys(chMap).map(function (k) {
        const item = chMap[k];
        item.pct = totalMarks > 0 ? Math.round((item.marks / totalMarks) * 1000) / 10 : 0;
        return item;
      }).sort(function (a, b) { return b.marks - a.marks; });

      return {
        totalMarks: totalMarks,
        totalQuestions: totalQuestions,
        marksCategories: {
          twoMarks: {
            count: m2Count,
            marks: m2Marks,
            pct: totalMarks > 0 ? Math.round((m2Marks / totalMarks) * 1000) / 10 : 0
          },
          fiveMarks: {
            count: m5Count,
            marks: m5Marks,
            pct: totalMarks > 0 ? Math.round((m5Marks / totalMarks) * 1000) / 10 : 0
          },
          tenMarks: {
            count: m10Count,
            marks: m10Marks,
            pct: totalMarks > 0 ? Math.round((m10Marks / totalMarks) * 1000) / 10 : 0
          }
        },
        chapterWeightage: chList
      };
    },

    /**
     * Pure-JS Standard PDF 1.4 Document Generator
     */
    generatePdfBuffer: function (paper) {
      const escapePdf = function (text) {
        return String(text || '')
          .replace(/\\/g, '\\\\')
          .replace(/\(/g, '\\(')
          .replace(/\)/g, '\\)')
          .replace(/[\r\n\t]/g, ' ');
      };

      const objects = [];
      objects.push(null); // 1: Catalog
      objects.push(null); // 2: Pages
      objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'); // 3: Font Regular
      objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>'); // 4: Font Bold
      objects.push('<< /Font << /F1 3 0 R /F2 4 0 R >> >>'); // 5: Resources

      const pageIds = [];
      const linesPerPage = 38;
      const allLines = [];

      allLines.push({ text: 'EDUPREP ACADEMIC EXAMINATION ARCHIVE', bold: true, size: 14 });
      allLines.push({ text: `${paper.subject || 'Subject'} (${paper.subjectCode || 'CSC401'}) — ${paper.year || '2024'} Examination`, bold: true, size: 12 });
      allLines.push({ text: `${paper.university || 'State University'} • Semester ${paper.semester || 4} • Duration: ${paper.duration || '3 Hours'} • Max Marks: ${paper.maxMarks || 80}`, bold: false, size: 9 });
      allLines.push({ text: 'SAMPLE / REFERENCE EXAMINATION PAPER — SYLLABUS ALIGNED', bold: true, size: 9 });
      allLines.push({ text: '----------------------------------------------------------------------------------------------------------------------', bold: false, size: 8 });
      allLines.push({ text: 'INSTRUCTIONS: (1) Figures to the right indicate full marks. (2) Answer all questions in Section A. (3) Attempt options as noted.', bold: false, size: 8.5 });
      allLines.push({ text: '----------------------------------------------------------------------------------------------------------------------', bold: false, size: 8 });

      (paper.sections || []).forEach(function (sec) {
        allLines.push({ text: '', bold: false, size: 8 });
        allLines.push({ text: (sec.title || '').toUpperCase(), bold: true, size: 10 });
        if (sec.instructions) {
          allLines.push({ text: sec.instructions, bold: false, size: 8.5 });
        }
        (sec.questions || []).forEach(function (q) {
          const qText = `${q.qNo || 'Q'} [${q.marks} Marks]  ${q.q || q.text || ''}`;
          if (qText.length > 90) {
            allLines.push({ text: qText.slice(0, 90), bold: false, size: 8.5 });
            allLines.push({ text: '     ' + qText.slice(90, 180), bold: false, size: 8.5 });
            if (qText.length > 180) {
              allLines.push({ text: '     ' + qText.slice(180, 270), bold: false, size: 8.5 });
            }
          } else {
            allLines.push({ text: qText, bold: false, size: 8.5 });
          }
        });
      });

      const pagesData = [];
      let curPage = [];
      for (let i = 0; i < allLines.length; i++) {
        curPage.push(allLines[i]);
        if (curPage.length >= linesPerPage) {
          pagesData.push(curPage);
          curPage = [];
        }
      }
      if (curPage.length > 0) pagesData.push(curPage);

      pagesData.forEach(function (pLines, pNum) {
        let streamText = '';
        let y = 800;
        pLines.forEach(function (l) {
          const font = l.bold ? '/F2' : '/F1';
          const size = l.size || 9;
          streamText += `BT ${font} ${size} Tf 40 ${y} Td (${escapePdf(l.text)}) Tj ET\n`;
          y -= (size + 6);
        });
        streamText += `BT /F1 8 Tf 40 25 Td (Page ${pNum + 1} of ${pagesData.length}  |  EduPrep Academic Study Platform  |  Sample Reference Sheet) Tj ET\n`;

        const pageObjIdx = objects.length + 1;
        const streamObjIdx = objects.length + 2;
        pageIds.push(pageObjIdx);

        let len = 0;
        for (let j = 0; j < streamText.length; j++) {
          const code = streamText.charCodeAt(j);
          if (code <= 0x7f) len += 1;
          else if (code <= 0x7ff) len += 2;
          else len += 3;
        }

        objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources 5 0 R /Contents ${streamObjIdx} 0 R >>`);
        objects.push(`<< /Length ${len} >>\nstream\n${streamText}endstream`);
      });

      objects[0] = `<< /Type /Catalog /Pages 2 0 R >>`;
      objects[1] = `<< /Type /Pages /Kids [${pageIds.map(function (id) { return id + ' 0 R'; }).join(' ')}] /Count ${pageIds.length} >>`;

      let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
      const offsets = [0];

      for (let k = 0; k < objects.length; k++) {
        let curLen = 0;
        for (let m = 0; m < pdf.length; m++) {
          const c = pdf.charCodeAt(m);
          if (c <= 0x7f) curLen += 1;
          else if (c <= 0x7ff) curLen += 2;
          else curLen += 3;
        }
        offsets.push(curLen);
        pdf += `${k + 1} 0 obj\n${objects[k]}\nendobj\n`;
      }

      let xrefOff = 0;
      for (let n = 0; n < pdf.length; n++) {
        const c2 = pdf.charCodeAt(n);
        if (c2 <= 0x7f) xrefOff += 1;
        else if (c2 <= 0x7ff) xrefOff += 2;
        else xrefOff += 3;
      }

      pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
      for (let q = 1; q <= objects.length; q++) {
        const offStr = String(offsets[q]).padStart(10, '0');
        pdf += `${offStr} 00000 n \n`;
      }
      pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOff}\n%%EOF\n`;
      return pdf;
    },

    downloadPdf: function (paper) {
      if (!paper) return;
      const pdfText = this.generatePdfBuffer(paper);
      const blob = new Blob([pdfText], { type: "application/pdf" });
      const safeSubj = (paper.subject || "Subject").replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `${safeSubj}_${paper.year || '2024'}_PYQ.pdf`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 200);

      const root = typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this);
      if (root.EduPrep && typeof root.EduPrep.showToast === 'function') {
        root.EduPrep.showToast(`Downloaded ${filename} successfully!`, "success");
      }
    }
  };

  // Attach to global scope
  const root = typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this);
  root.EduPrepPyqs = PyqEngine;
  if (root.EduPrep) {
    root.EduPrep.pyqEngine = PyqEngine;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PyqEngine;
  }
})();
