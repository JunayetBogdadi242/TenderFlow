(() => {
  "use strict";

  const { PDFDocument, rgb, StandardFonts } = window.PDFLib || {};
  const state = {
    lang: "en",
    requirements: null,
    files: [],
    matches: {},
    expiryDates: {},
    generatedBytes: null,
    generatedInfo: null
  };

  const I18N = {
    en: {
      appSubtitle:"Tender Document Package Builder", requirements:"Requirements", documents:"Documents", matching:"Matching", verification:"Verification", package:"Package",
      heroTitle:"Build a submission-ready tender package.", heroText:"Upload requirements, add PDFs, match every requirement, resolve verification issues, and generate one final PDF — entirely in your browser.",
      uploadRequirements:"Upload Tender Requirements", requirementsHint:"Upload your requirements.json file to begin.", chooseRequirements:"Choose requirements.json", localOnly:"Files are processed locally. Nothing is uploaded.",
      expectedFormat:"Expected JSON:", step1:"STEP 1", requiredDocuments:"Required Documents", step2:"STEP 2", uploadedDocuments:"Uploaded PDF Files",
      dropPdf:"Drop your PDF files here", orBrowse:"or click to browse", browseFiles:"Browse files", pdfLimits:"Maximum 30 files · Maximum 50 MB total", noPdfs:"No PDF files uploaded yet.",
      step3:"STEP 3", matchDocuments:"Match Documents", suggestMatches:"Suggest matches", step4:"STEP 4", step5:"STEP 5",
      privacyTitle:"Private by design", privacyText:"Tender PDFs stay on this device. No server upload, database, or external storage is used for your documents.",
      helpTitle:"How it works", help1:"Upload a valid requirements.json file.", help2:"Add the tender PDFs. Duplicate content is detected automatically.", help3:"Match each requirement to one PDF. Suggestions are never applied without your confirmation.", help4:"Enter expiry dates where required and resolve every blocking issue.", help5:"Generate the final PDF. The cover is always English and the original PDF content is preserved.",
      mandatory:"Mandatory", optional:"Optional", expiryRequired:"Expiry required", noExpiry:"No expiry", notMatched:"Not matched", change:"Change", remove:"Remove",
      duplicate:"Duplicate", pages:"pages", matched:"Matched", totalDocuments:"Total Documents", missing:"Missing", expired:"Expired", expiryNeeded:"Expiry Dates Needed", optionalNotProvided:"Optional Not Provided",
      packageCannot:"Package cannot be generated", issues:"issues must be fixed before generating the package.", packageReady:"Your package is ready", generate:"Generate Package", generating:"Generating package…",
      expiryDate:"Expiry Date", selectPdf:"Select a PDF…", noFiles:"No unused PDF files available", suggestion:"Match suggestion", confirmSuggestion:"Apply suggestion",
      invalidPdf:"Invalid file — Please upload PDF files only.", corruptPdf:"This PDF could not be read. It may be corrupted or password protected.", totalSize:"Total upload size exceeds 50 MB.",
      tooMany:"You can upload a maximum of 30 PDF files.", duplicateExplain:"This file has the same content as another uploaded PDF.", expiryNeededStatus:"Expiry date needed",
      expiredStatus:"Expired", notProvided:"Not provided", ok:"OK", missingStatus:"Missing", packageCannot2:"Please resolve all blocking issues first.",
      packageCreated:"Package Ready", includedDocuments:"Included Documents", creationDate:"Creation Date", totalPages:"Total Pages", download:"Download Package", noOptional:"Optional document not provided",
      generated:"Package generated successfully.", invalidJson:"Could not read requirements.json. Please check that it is valid JSON.", noRequirements:"The JSON must contain a requirements array.",
      invalidRequirement:"Each requirement needs an id, title_en, order, and mandatory flag.", deadlineInvalid:"Submission deadline is missing or invalid.", duplicateRequirement:"Duplicate requirement IDs were found.",
      loaded:"Requirements loaded.", removed:"File removed.", matchedToast:"Document matched.", unmatchedToast:"Match removed.", suggestionApplied:"Suggested match applied.", noSuggestions:"No confident filename matches found.",
      help:"Help", browse:"Browse"
    },
    bn: {
      appSubtitle:"টেন্ডার ডকুমেন্ট প্যাকেজ বিল্ডার", requirements:"রিকোয়ারমেন্টস", documents:"ডকুমেন্টস", matching:"ম্যাচিং", verification:"ভেরিফিকেশন", package:"প্যাকেজ",
      heroTitle:"সাবমিশনের জন্য প্রস্তুত টেন্ডার প্যাকেজ তৈরি করুন।", heroText:"রিকোয়ারমেন্ট আপলোড করুন, PDF যোগ করুন, প্রতিটি ডকুমেন্ট মিলিয়ে নিন, সমস্যা ঠিক করুন এবং ব্রাউজারেই একটি ফাইনাল PDF তৈরি করুন।",
      uploadRequirements:"টেন্ডার রিকোয়ারমেন্টস আপলোড", requirementsHint:"শুরু করতে requirements.json আপলোড করুন।", chooseRequirements:"requirements.json নির্বাচন করুন", localOnly:"ফাইল এই ডিভাইসেই প্রসেস হয়। কোথাও আপলোড হয় না।",
      expectedFormat:"প্রত্যাশিত JSON:", step1:"ধাপ ১", requiredDocuments:"প্রয়োজনীয় ডকুমেন্ট", step2:"ধাপ ২", uploadedDocuments:"আপলোড করা PDF",
      dropPdf:"আপনার PDF এখানে ছেড়ে দিন", orBrowse:"অথবা ব্রাউজ করতে ক্লিক করুন", browseFiles:"ফাইল নির্বাচন করুন", pdfLimits:"সর্বোচ্চ ৩০টি ফাইল · মোট ৫০ MB", noPdfs:"এখনও কোনো PDF আপলোড করা হয়নি।",
      step3:"ধাপ ৩", matchDocuments:"ডকুমেন্ট ম্যাচ করুন", suggestMatches:"ম্যাচ সাজেস্ট করুন", step4:"ধাপ ৪", step5:"ধাপ ৫",
      privacyTitle:"গোপনীয়তা সুরক্ষিত", privacyText:"টেন্ডারের PDF এই ডিভাইসেই থাকে। কোনো সার্ভার, ডেটাবেস বা এক্সটার্নাল স্টোরেজ ব্যবহার করা হয় না।",
      helpTitle:"কীভাবে কাজ করে", help1:"একটি বৈধ requirements.json আপলোড করুন।", help2:"টেন্ডারের PDF যোগ করুন। একই কনটেন্টের ডুপ্লিকেট স্বয়ংক্রিয়ভাবে ধরা হবে।", help3:"প্রতিটি রিকোয়ারমেন্টে একটি PDF ম্যাচ করুন। সাজেশন আপনার অনুমতি ছাড়া প্রয়োগ হবে না।", help4:"প্রয়োজনীয় হলে expiry date দিন এবং সব সমস্যা সমাধান করুন।", help5:"ফাইনাল PDF তৈরি করুন। কভার সবসময় ইংরেজিতে থাকবে এবং মূল PDF কনটেন্ট সংরক্ষিত থাকবে।",
      mandatory:"আবশ্যিক", optional:"ঐচ্ছিক", expiryRequired:"Expiry প্রয়োজন", noExpiry:"Expiry নেই", notMatched:"ম্যাচ করা হয়নি", change:"পরিবর্তন", remove:"সরান",
      duplicate:"ডুপ্লিকেট", pages:"পৃষ্ঠা", matched:"ম্যাচড", totalDocuments:"মোট ডকুমেন্ট", missing:"নেই", expired:"মেয়াদ শেষ", expiryNeeded:"Expiry Date প্রয়োজন", optionalNotProvided:"ঐচ্ছিকভাবে দেওয়া হয়নি",
      packageCannot:"প্যাকেজ তৈরি করা যাবে না", issues:"টি সমস্যা সমাধান করতে হবে।", packageReady:"আপনার প্যাকেজ প্রস্তুত", generate:"প্যাকেজ তৈরি করুন", generating:"প্যাকেজ তৈরি হচ্ছে…",
      expiryDate:"Expiry Date", selectPdf:"একটি PDF নির্বাচন করুন…", noFiles:"ব্যবহারযোগ্য PDF নেই", suggestion:"ম্যাচ সাজেশন", confirmSuggestion:"সাজেশন প্রয়োগ করুন",
      duplicateExplain:"এই ফাইলটির কনটেন্ট অন্য একটি আপলোড করা PDF-এর সঙ্গে একই।", expiryNeededStatus:"Expiry Date প্রয়োজন",
      expiredStatus:"মেয়াদ শেষ", notProvided:"দেওয়া হয়নি", ok:"ঠিক আছে", missingStatus:"নেই", packageCannot2:"আগে সব সমস্যা সমাধান করুন।",
      packageCreated:"প্যাকেজ প্রস্তুত", includedDocuments:"অন্তর্ভুক্ত ডকুমেন্ট", creationDate:"তৈরির তারিখ", totalPages:"মোট পৃষ্ঠা", download:"প্যাকেজ ডাউনলোড", noOptional:"ঐচ্ছিক ডকুমেন্ট দেওয়া হয়নি",
      generated:"প্যাকেজ সফলভাবে তৈরি হয়েছে।", invalidJson:"requirements.json পড়া যায়নি। বৈধ JSON কিনা দেখুন।", noRequirements:"JSON-এ requirements array থাকতে হবে।",
      invalidRequirement:"প্রতিটি requirement-এ id, title_en, order এবং mandatory থাকতে হবে।", deadlineInvalid:"Submission deadline অনুপস্থিত বা ভুল।", duplicateRequirement:"একই requirement ID একাধিকবার আছে।",
      loaded:"রিকোয়ারমেন্টস লোড হয়েছে।", removed:"ফাইল সরানো হয়েছে।", matchedToast:"ডকুমেন্ট ম্যাচ হয়েছে।", unmatchedToast:"ম্যাচ সরানো হয়েছে।", suggestionApplied:"সাজেস্টেড ম্যাচ প্রয়োগ হয়েছে।", noSuggestions:"ফাইলনেম থেকে নির্ভরযোগ্য ম্যাচ পাওয়া যায়নি।",
      help:"সহায়তা", browse:"ব্রাউজ"
    }
  };

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const t = k => I18N[state.lang][k] ?? I18N.en[k] ?? k;
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function toast(message, type="") {
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.textContent = message;
    $("#toastRoot").appendChild(el);
    setTimeout(() => el.remove(), 3600);
  }

  function setLanguage(lang) {
    state.lang = lang;
    document.documentElement.lang = lang === "bn" ? "bn" : "en";
    $$(".lang-btn").forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
    $$("[data-i18n]").forEach(el => el.textContent = t(el.dataset.i18n));
    renderAll();
  }

  function parseDeadline(value) {
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function normalizeRequirements(data) {
    if (!data || typeof data !== "object" || !Array.isArray(data.requirements)) throw new Error(t("noRequirements"));
    const tender = {
      tender_id: data.tender_id ?? data.tenderId ?? "",
      tender_title: data.tender_title ?? data.tenderTitle ?? "",
      procuring_entity: data.procuring_entity ?? data.procuringEntity ?? "",
      bidder: data.bidder ?? data.bidder_name ?? "",
      submission_deadline: data.submission_deadline ?? data.submissionDeadline ?? ""
    };
    if (!tender.tender_id || !tender.tender_title || !parseDeadline(tender.submission_deadline)) throw new Error(t("deadlineInvalid"));
    const seen = new Set();
    const requirements = data.requirements.map((r, i) => {
      const id = r.id ?? r.requirement_id ?? r.requirementId;
      const titleEn = r.title_en ?? r.title ?? r.name_en ?? "";
      const titleBn = r.title_bn ?? titleEn;
      const order = Number(r.order);
      const mandatory = Boolean(r.mandatory);
      const hasExpiry = Boolean(r.has_expiry ?? r.hasExpiry ?? false);
      if (!id || !titleEn || !Number.isFinite(order) || typeof r.mandatory !== "boolean") throw new Error(`${t("invalidRequirement")} (#${i+1})`);
      if (seen.has(String(id))) throw new Error(t("duplicateRequirement"));
      seen.add(String(id));
      return { ...r, id:String(id), title_en:String(titleEn), title_bn:String(titleBn), order, mandatory, has_expiry:hasExpiry };
    }).sort((a,b) => a.order-b.order);
    return { tender, requirements };
  }

  async function sha256(file) {
    const buffer = await file.arrayBuffer();
    const hash = await crypto.subtle.digest("SHA-256", buffer);
    return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("");
  }

  async function inspectPdf(file) {
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: false });
      return { bytes, pages: doc.getPageCount(), hash: await sha256(file) };
    } catch (err) {
      throw new Error(t("corruptPdf"));
    }
  }

  async function handleRequirements(file) {
    try {
      if (!file || !file.name.toLowerCase().endsWith(".json")) throw new Error(t("invalidJson"));
      const data = JSON.parse(await file.text());
      state.requirements = normalizeRequirements(data);
      state.files = [];
      state.matches = {};
      state.expiryDates = {};
      state.generatedBytes = null;
      state.generatedInfo = null;
      $("#landing").classList.add("hidden");
      $("#workspace").classList.remove("hidden");
      renderAll();
      toast(t("loaded"), "success");
      $("#workspace").scrollIntoView({behavior:"smooth", block:"start"});
    } catch(err) {
      toast(err.message || t("invalidJson"), "error");
    }
  }

  function totalBytes() { return state.files.reduce((s,f)=>s+f.file.size,0); }

  async function addPdfFiles(fileList) {
    const incoming = [...fileList];
    if (!incoming.length) return;
    const existingNames = new Set(state.files.map(x=>x.file.name + "|" + x.file.size));
    if (state.files.length + incoming.length > 30) { toast(t("tooMany"), "error"); return; }
    const accepted = [];
    for (const file of incoming) {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        toast(`${file.name}: ${t("invalidPdf")}`, "error"); continue;
      }
      if (existingNames.has(file.name + "|" + file.size)) continue;
      if (totalBytes() + accepted.reduce((s,x)=>s+x.file.size,0) + file.size > 50*1024*1024) {
        toast(t("totalSize"), "error"); break;
      }
      try {
        const info = await inspectPdf(file);
        accepted.push({id: crypto.randomUUID(), file, pages:info.pages, hash:info.hash, duplicate:false, error:null});
      } catch(err) {
        accepted.push({id: crypto.randomUUID(), file, pages:0, hash:null, duplicate:false, error:err.message});
      }
    }
    state.files.push(...accepted);
    markDuplicates();
    renderAll();
  }

  function markDuplicates() {
    const seen = new Map();
    state.files.forEach(f => { f.duplicate = false; });
    state.files.forEach(f => {
      if (!f.hash) return;
      if (seen.has(f.hash)) {
        f.duplicate = true;
        seen.get(f.hash).duplicate = true;
      } else seen.set(f.hash, f);
    });
    for (const reqId of Object.keys(state.matches)) {
      const f = state.files.find(x=>x.id===state.matches[reqId]);
      if (f?.duplicate) delete state.matches[reqId];
    }
  }

  function getFile(id) { return state.files.find(f=>f.id===id); }
  function getReq(id) { return state.requirements?.requirements.find(r=>r.id===id); }
  function titleFor(r) { return state.lang === "bn" ? r.title_bn : r.title_en; }

  function statusFor(r) {
    const fileId = state.matches[r.id];
    const file = getFile(fileId);
    if (!file) return r.mandatory ? "missing" : "not-provided";
    if (file.error || file.duplicate) return "missing";
    if (r.has_expiry) {
      const date = state.expiryDates[r.id];
      if (!date) return "expiry-needed";
      const expiry = new Date(date + "T23:59:59");
      const deadline = parseDeadline(state.requirements.tender.submission_deadline);
      if (!deadline || expiry < deadline) return "expired";
    }
    return "ok";
  }

  function statusBadge(status) {
    const map = {
      missing:["badge-missing",t("missingStatus")], "expiry-needed":["badge-expiry",t("expiryNeededStatus")],
      expired:["badge-expired",t("expiredStatus")], "not-provided":["badge-optional",t("notProvided")], ok:["badge-ok",t("ok")]
    };
    const [cls,label]=map[status]; return `<span class="badge ${cls}">${esc(label)}</span>`;
  }

  function statusLabel(status) { return statusBadge(status); }

  function renderTenderSummary() {
    const {tender} = state.requirements;
    const deadline = parseDeadline(tender.submission_deadline);
    $("#tenderSummary").innerHTML = `
      <div class="tender-head">
        <div><div class="tender-id">${esc(tender.tender_id)}</div><h2>${esc(tender.tender_title)}</h2><div style="color:var(--muted);font-size:11px">${esc(tender.procuring_entity)}</div></div>
        <span class="badge badge-ok">${esc(t("localOnly"))}</span>
      </div>
      <div class="tender-grid">
        <div class="info-box"><div class="info-label">Tender ID</div><div class="info-value">${esc(tender.tender_id)}</div></div>
        <div class="info-box"><div class="info-label">Procuring Entity</div><div class="info-value">${esc(tender.procuring_entity || "—")}</div></div>
        <div class="info-box"><div class="info-label">Bidder</div><div class="info-value">${esc(tender.bidder || "—")}</div></div>
        <div class="info-box"><div class="info-label">Submission Deadline</div><div class="info-value">${deadline ? deadline.toLocaleString(state.lang==="bn"?"bn-BD":"en-US",{dateStyle:"medium",timeStyle:"short"}) : "—"}</div></div>
        <div class="info-box"><div class="info-label">Requirements</div><div class="info-value">${state.requirements.requirements.length}</div></div>
      </div>`;
  }

  function renderRequirements() {
    const reqs = state.requirements.requirements;
    $("#reqCountBadge").textContent = `${reqs.length} ${t("documents")}`;
    $("#requirementsList").innerHTML = reqs.map(r => {
      const s=statusFor(r);
      return `<div class="req-row">
        <div class="order-box">${String(r.order).padStart(2,"0")}</div>
        <div><div class="req-title">${esc(titleFor(r))}</div><div class="req-meta">${r.mandatory?t("mandatory"):t("optional")} · ${r.has_expiry?t("expiryRequired"):t("noExpiry")}</div></div>
        ${statusLabel(s)}
      </div>`;
    }).join("");
  }

  function renderFiles() {
    $("#fileCount").textContent = state.files.length;
    const root=$("#filesList");
    if (!state.files.length) {
      root.className="files-list empty-state"; root.innerHTML=`<div class="empty-icon">PDF</div><p>${esc(t("noPdfs"))}</p>`; return;
    }
    root.className="files-list";
    root.innerHTML=state.files.map(f=>`
      <div class="file-row">
        <div class="pdf-icon">PDF</div>
        <div>
          <div class="file-name" title="${esc(f.file.name)}">${esc(f.file.name)}</div>
          <div class="file-meta">${f.error ? esc(f.error) : `${f.pages} ${t("pages")} · ${formatBytes(f.file.size)}`}</div>
          ${f.duplicate ? `<div style="margin-top:5px"><span class="badge badge-duplicate">${esc(t("duplicate"))}</span> <span style="font-size:10px;color:#8b42a6">${esc(t("duplicateExplain"))}</span></div>` : ""}
        </div>
        <div class="file-actions"><button class="danger-btn remove-file" data-id="${f.id}">${esc(t("remove"))}</button></div>
      </div>`).join("");
  }

  function availableFilesFor(reqId) {
    const used = new Set(Object.entries(state.matches).filter(([id])=>id!==reqId).map(([,fid])=>fid));
    return state.files.filter(f=>!used.has(f.id) && !f.duplicate && !f.error);
  }

  function suggestionFor(r) {
    const candidates=availableFilesFor(r.id);
    const tokens = s => s.toLowerCase().replace(/\.pdf$/,"").replace(/[^a-z0-9\u0980-\u09ff]+/g," ").split(/\s+/).filter(x=>x.length>2);
    const reqTokens=tokens(r.title_en);
    let best=null;
    for(const f of candidates){
      const name=tokens(f.file.name);
      let score=0;
      for(const a of reqTokens) for(const b of name) if(a===b) score+=2; else if(a.includes(b)||b.includes(a)) score+=1;
      if(score>0 && (!best || score>best.score)) best={file:f,score};
    }
    return best && best.score>=2 ? best : null;
  }

  function renderMatching() {
    const reqs=state.requirements.requirements;
    $("#matchingList").innerHTML=reqs.map(r=>{
      const file=getFile(state.matches[r.id]);
      const sug=!file?suggestionFor(r):null;
      const options=availableFilesFor(r.id);
      return `<div class="match-row">
        <div><div class="match-title">${String(r.order).padStart(2,"0")}. ${esc(titleFor(r))}</div><div class="match-meta">${r.mandatory?t("mandatory"):t("optional")} · ${r.has_expiry?t("expiryRequired"):t("noExpiry")} · ${file?esc(file.file.name):t("notMatched")}</div>
        ${sug?`<div class="suggestion">${esc(t("suggestion"))}: <strong>${esc(sug.file.file.name)}</strong> <button class="ghost-btn apply-suggestion" data-req="${r.id}" data-file="${sug.file.id}" style="padding:4px 7px;margin-left:5px">${esc(t("confirmSuggestion"))}</button></div>`:""}</div>
        <select class="match-select match-change" data-req="${r.id}">
          <option value="">${esc(t("selectPdf"))}</option>
          ${file?`<option selected value="${file.id}">${esc(file.file.name)}</option>`:""}
          ${options.filter(x=>x.id!==file?.id).map(x=>`<option value="${x.id}">${esc(x.file.name)}${x.duplicate?` — ${esc(t("duplicate"))}`:""}</option>`).join("")}
        </select>
        <button class="danger-btn unmatch" data-req="${r.id}" ${file?"":"disabled"}>${esc(t("remove"))}</button>
      </div>`;
    }).join("");
  }

  function renderVerification() {
    const reqs=state.requirements.requirements.filter(r=>r.has_expiry && state.matches[r.id]);
    if(!reqs.length){ $("#verificationList").innerHTML=`<div class="empty-state"><p>${esc(t("noPdfs"))}</p></div>`; return; }
    $("#verificationList").innerHTML=reqs.map(r=>{
      const f=getFile(state.matches[r.id]), s=statusFor(r), date=state.expiryDates[r.id]||"";
      return `<div class="verification-row">
        <div><div class="verification-name">${esc(titleFor(r))}</div><div class="verification-file">${esc(f?.file.name||"")}</div></div>
        <input class="date-input expiry-input" data-req="${r.id}" type="date" value="${esc(date)}" aria-label="${esc(t("expiryDate"))}">
        <div>${statusLabel(s)}</div>
      </div>`;
    }).join("");
  }

  function getSummary() {
    const reqs=state.requirements.requirements;
    const counts={total:reqs.length,matched:0,missing:0,expired:0,expiryNeeded:0,optionalNotProvided:0};
    const issues=[];
    reqs.forEach(r=>{
      const s=statusFor(r);
      if(s==="ok") counts.matched++;
      if(s==="missing"){counts.missing++; if(r.mandatory) issues.push(`${String(r.order).padStart(2,"0")}. ${titleFor(r)} — ${t("missingStatus")}`);}
      if(s==="expired"){counts.expired++; issues.push(`${String(r.order).padStart(2,"0")}. ${titleFor(r)} — ${t("expiredStatus")}`);}
      if(s==="expiry-needed"){counts.expiryNeeded++; issues.push(`${String(r.order).padStart(2,"0")}. ${titleFor(r)} — ${t("expiryNeededStatus")}`);}
      if(s==="not-provided") counts.optionalNotProvided++;
    });
    return {counts,issues};
  }

  function renderReadiness() {
    const {counts,issues}=getSummary();
    const blocked=issues.length>0;
    $("#readinessPanel").innerHTML=`
      <div class="readiness-title">${esc(blocked?t("packageCannot"):t("packageReady"))}</div>
      <div class="readiness-sub">${blocked?`${issues.length} ${esc(t("issues"))}`:esc(t("matched"))}</div>
      <div class="${blocked?"readiness-warning":"readiness-ok"}">${blocked?`⚠ ${esc(t("packageCannot2"))}`:`✓ ${esc(t("packageReady"))}`}</div>
      <div class="counter-grid">
        <div class="counter"><strong>${counts.total}</strong><span>${esc(t("totalDocuments"))}</span></div>
        <div class="counter"><strong>${counts.matched}</strong><span>${esc(t("matched"))}</span></div>
        <div class="counter"><strong>${counts.missing}</strong><span>${esc(t("missing"))}</span></div>
        <div class="counter"><strong>${counts.expired}</strong><span>${esc(t("expired"))}</span></div>
        <div class="counter"><strong>${counts.expiryNeeded}</strong><span>${esc(t("expiryNeeded"))}</span></div>
        <div class="counter"><strong>${counts.optionalNotProvided}</strong><span>${esc(t("optionalNotProvided"))}</span></div>
      </div>
      ${blocked?`<ul class="issues">${issues.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}
      <button class="primary-btn readiness-action" id="generateBtn" ${blocked?"disabled":""}>${esc(t("generate"))}</button>`;
  }

  function renderPackageAction() {
    if(state.generatedInfo){
      $("#packageAction").innerHTML=`<div class="success-screen">
        <div class="success-icon">✓</div><h2>${esc(t("packageCreated"))}</h2><p>${esc(t("generated"))}</p>
        <div class="success-meta">
          <div><strong>${state.generatedInfo.pages}</strong><span>${esc(t("totalPages"))}</span></div>
          <div><strong>${state.generatedInfo.included}</strong><span>${esc(t("includedDocuments"))}</span></div>
          <div><strong>${esc(state.generatedInfo.date)}</strong><span>${esc(t("creationDate"))}</span></div>
        </div>
        <button class="primary-btn" id="downloadBtn">${esc(t("download"))}</button>
      </div>`;
    } else {
      const {issues}=getSummary();
      $("#packageAction").innerHTML=`<div class="package-ready"><div><h3>${esc(issues.length?t("packageCannot"):t("packageReady"))}</h3><p>${esc(issues.length?`${issues.length} ${t("issues")}`:t("packageReady"))}</p></div><button class="primary-btn" id="packageGenerateBtn" ${issues.length?"disabled":""}>${esc(t("generate"))}</button></div>`;
    }
  }

  function updateWorkflow() {
    const {issues}=getSummary();
    let current=1;
    if(state.requirements) current=2;
    if(state.files.length) current=3;
    if(state.requirements && Object.keys(state.matches).length) current=4;
    if(state.requirements && Object.keys(state.matches).length && issues.length===0) current=5;
    $$(".step").forEach(el=>{
      const n=Number(el.dataset.step);
      el.classList.toggle("active",n===current);
      el.classList.toggle("done",n<current);
    });
  }

  function renderAll() {
    if(!state.requirements) return;
    renderTenderSummary(); renderRequirements(); renderFiles(); renderMatching(); renderVerification(); renderReadiness(); renderPackageAction(); updateWorkflow();
    bindDynamic();
  }

  function formatBytes(n){ if(n<1024) return `${n} B`; if(n<1024*1024) return `${(n/1024).toFixed(1)} KB`; return `${(n/1024/1024).toFixed(2)} MB`; }

  function bindDynamic() {
    $$(".remove-file").forEach(b=>b.onclick=()=>{
      const id=b.dataset.id;
      for(const reqId of Object.keys(state.matches)) if(state.matches[reqId]===id) delete state.matches[reqId];
      state.files=state.files.filter(f=>f.id!==id); renderAll(); toast(t("removed"));
    });
    $$(".match-change").forEach(s=>s.onchange=()=>{
      const req=s.dataset.req;
      if(s.value) { state.matches[req]=s.value; toast(t("matchedToast"),"success"); }
      else { delete state.matches[req]; toast(t("unmatchedToast")); }
      state.generatedInfo=null; state.generatedBytes=null; renderAll();
    });
    $$(".unmatch").forEach(b=>b.onclick=()=>{delete state.matches[b.dataset.req]; state.generatedInfo=null; state.generatedBytes=null; renderAll(); toast(t("unmatchedToast"));});
    $$(".apply-suggestion").forEach(b=>b.onclick=()=>{state.matches[b.dataset.req]=b.dataset.file; state.generatedInfo=null; state.generatedBytes=null; renderAll(); toast(t("suggestionApplied"),"success");});
    $$(".expiry-input").forEach(i=>i.onchange=()=>{state.expiryDates[i.dataset.req]=i.value; state.generatedInfo=null; state.generatedBytes=null; renderAll();});
    const gen=$("#generateBtn"); if(gen) gen.onclick=generatePackage;
    const gen2=$("#packageGenerateBtn"); if(gen2) gen2.onclick=generatePackage;
    const dl=$("#downloadBtn"); if(dl) dl.onclick=downloadPackage;
  }

  function matchSuggestions() {
    let count=0;
    state.requirements.requirements.forEach(r=>{ if(!state.matches[r.id]) {const s=suggestionFor(r); if(s){state.matches[r.id]=s.file.id;count++;}}});
    if(!count) toast(t("noSuggestions")); else {renderAll();toast(`${count} ${t("suggestionApplied")}`,"success");}
  }

  function dateText(d){return new Intl.DateTimeFormat("en-US",{dateStyle:"medium"}).format(d);}

  async function buildPackage() {
    const finalDoc=await PDFDocument.create();
    const font=await finalDoc.embedFont(StandardFonts.Helvetica);
    const bold=await finalDoc.embedFont(StandardFonts.HelveticaBold);
    const tender=state.requirements.tender;
    const reqs=state.requirements.requirements;
    const included=reqs.filter(r=>state.matches[r.id] && statusFor(r)==="ok");
    const footerH=30;
    const margin=44;

    // Cover page
    const coverW=595.28, coverH=841.89;
    const cover=finalDoc.addPage([coverW,coverH]);
    cover.drawRectangle({x:0,y:coverH-8,width:coverW,height:8,color:rgb(.07,.20,.36)});
    cover.drawText("TENDER DOCUMENT PACKAGE",{x:margin,y:coverH-105,size:26,font:bold,color:rgb(.07,.20,.36)});
    cover.drawText(String(tender.tender_id),{x:margin,y:coverH-132,size:11,font:bold,color:rgb(.09,.41,.88)});
    let y=coverH-185;
    const fields=[
      ["Tender Title",tender.tender_title],["Procuring Entity",tender.procuring_entity],["Bidder Name",tender.bidder],
      ["Submission Deadline",parseDeadline(tender.submission_deadline)?.toLocaleString("en-US",{dateStyle:"medium",timeStyle:"short"})||String(tender.submission_deadline)],
      ["Package Created",new Date().toLocaleString("en-US",{dateStyle:"medium",timeStyle:"short"})]
    ];
    for(const [label,val] of fields){
      cover.drawText(label.toUpperCase(),{x:margin,y,size:8,font:bold,color:rgb(.43,.49,.57)});
      cover.drawText(String(val||"—"),{x:margin,y:y-16,size:11,font,color:rgb(.10,.14,.20),maxWidth:coverW-2*margin});
      y-=48;
    }
    y-=6; cover.drawText("INCLUDED DOCUMENTS",{x:margin,y,size:12,font:bold,color:rgb(.07,.20,.36)}); y-=25;
    for(const r of included){
      cover.drawText(`${String(r.order).padStart(2,"0")}. ${r.title_en}`,{x:margin,y,size:10,font,color:rgb(.18,.23,.30),maxWidth:coverW-2*margin-40});
      y-=18; if(y<footerH+50) break;
    }
    cover.drawText("Prepared by TenderFlow — browser-only document processing",{x:margin,y:footerH+12,size:7,font,color:rgb(.48,.53,.60)});

    // Document pages are recreated with a reserved footer strip, keeping original visual content clear.
    for(const r of included){
      const f=getFile(state.matches[r.id]);
      const src=await PDFDocument.load(await f.file.arrayBuffer());
      for(let i=0;i<src.getPageCount();i++){
        const srcPage=src.getPage(i);
        const {width,height}=srcPage.getSize();
        const page=finalDoc.addPage([width,height+footerH]);
        const embedded=await finalDoc.embedPage(srcPage);
        page.drawPage(embedded,{x:0,y:footerH,width,height});
      }
    }

    // Add footers after final page count is known.
    const total=finalDoc.getPageCount();
    const pages=finalDoc.getPages();
    pages.forEach((p,idx)=>{
      const {width,height}=p.getSize();
      p.drawRectangle({x:0,y:0,width,height:footerH,color:rgb(1,1,1)});
      p.drawLine({start:{x:18,y:footerH-1},end:{x:width-18,y:footerH-1},thickness:.5,color:rgb(.84,.87,.91)});
      p.drawText(`${tender.tender_id} | Page ${idx+1} of ${total}`,{x:18,y:9,size:8,font,color:rgb(.36,.42,.49)});
    });
    return {bytes:await finalDoc.save(),pages:total,included:included.length};
  }

  async function generatePackage() {
    const {issues}=getSummary();
    if(issues.length){toast(t("packageCannot2"),"error");return;}
    const btn=$("#generateBtn")||$("#packageGenerateBtn");
    if(btn){btn.disabled=true;btn.textContent=t("generating");}
    try{
      const result=await buildPackage();
      state.generatedBytes=result.bytes;
      state.generatedInfo={pages:result.pages,included:result.included,date:dateText(new Date())};
      renderAll();
      $("#packageSection").scrollIntoView({behavior:"smooth",block:"center"});
    }catch(err){
      console.error(err); toast(err.message||"PDF generation failed.","error"); renderAll();
    }
  }

  function downloadPackage() {
    if(!state.generatedBytes) return;
    const id=state.requirements.tender.tender_id.replace(/[^\w.-]+/g,"_");
    const blob=new Blob([state.generatedBytes],{type:"application/pdf"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a"); a.href=url; a.download=`${id}_Package.pdf`; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  // Events
  $("#chooseRequirements").onclick=()=>$("#requirementsInput").click();
  $("#requirementsInput").onchange=e=>handleRequirements(e.target.files[0]);
  $("#browsePdf").onclick=()=>$("#pdfInput").click();
  $("#pdfInput").onchange=e=>addPdfFiles(e.target.files);
  ["dragenter","dragover"].forEach(ev=>$("#pdfDrop").addEventListener(ev,e=>{e.preventDefault();$("#pdfDrop").classList.add("drag")}));
  ["dragleave","drop"].forEach(ev=>$("#pdfDrop").addEventListener(ev,e=>{e.preventDefault();$("#pdfDrop").classList.remove("drag")}));
  $("#pdfDrop").addEventListener("drop",e=>addPdfFiles(e.dataTransfer.files));
  $("#requirementsDrop").addEventListener("dragover",e=>{e.preventDefault();$("#requirementsDrop").style.borderColor="var(--blue)"});
  $("#requirementsDrop").addEventListener("dragleave",()=>$("#requirementsDrop").style.borderColor="");
  $("#requirementsDrop").addEventListener("drop",e=>{e.preventDefault();$("#requirementsDrop").style.borderColor="";handleRequirements(e.dataTransfer.files[0])});
  $("#suggestAllBtn").onclick=matchSuggestions;
  $$(".lang-btn").forEach(b=>b.onclick=()=>setLanguage(b.dataset.lang));
  $("#helpBtn").onclick=()=>$("#helpModal").classList.remove("hidden");
  $("#closeHelp").onclick=()=>$("#helpModal").classList.add("hidden");
  $("#helpModal").addEventListener("click",e=>{if(e.target.id==="helpModal")$("#helpModal").classList.add("hidden")});

  // Prevent accidental navigation while dragging files.
  window.addEventListener("dragover",e=>e.preventDefault());
  window.addEventListener("drop",e=>e.preventDefault());
})();
