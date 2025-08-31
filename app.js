// Minimal SPA router using hash routes (#step1, #review, #export)
const routes = {
  '#step1': renderStep1,
  '#step2': renderStep2,
  '#step3': renderStep3,
  '#step4': renderStep4,
  '#review': renderReview,
  '#export': renderExport,
};
const stateKey = 'ein_answers_v1';

const defaultAnswers = {
  entityType: '',
  reason: '',
  responsibleName: '',
  responsibleSSN_ITIN: '',
  legalName: '',
  dbaName: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  email: '',
  formationState: '',
  startDate: '',
  industry: '',
  employeesThisYear: '',
  firstPayrollMonth: '',
  exciseSpecial: { heavyVehicle:false, gambling:false, atf:false, quarterlyExcise:false }
};

let answers = load();

function load() {
  try {
    const raw = localStorage.getItem(stateKey);
    return raw ? { ...defaultAnswers, ...JSON.parse(raw) } : { ...defaultAnswers };
  } catch { return { ...defaultAnswers }; }
}
function save(partial) {
  answers = { ...answers, ...partial };
  localStorage.setItem(stateKey, JSON.stringify(answers));
  computeProgress();
}
function computeProgress() {
  const fields = [
    answers.entityType, answers.reason, answers.responsibleName, answers.legalName,
    answers.address, answers.city, answers.state, answers.zip, answers.formationState,
    answers.startDate, answers.industry, answers.employeesThisYear
  ];
  const filled = fields.filter(Boolean).length;
  const pct = Math.round((filled / fields.length) * 100);
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressText').textContent = pct + '% ready';
}

function render(root, html) { root.innerHTML = html; }
function control(label, example, inner) {
  return `
  <div class="card">
    <label><strong>${label}</strong></label>
    <div class="helper">Example: ${example}</div>
    <div class="row" style="margin-top:8px">${inner}</div>
  </div>`;
}

function renderStep1(root) {
  render(root, `
    ${control('What kind of business is this legally?', 'Single‑member LLC', `
      <select id="entityType">
        <option value="">Select...</option>
        <option value="sole_prop">Sole proprietor</option>
        <option value="llc_single">LLC (single‑member)</option>
        <option value="llc_multi">LLC (multi‑member)</option>
        <option value="partnership">Partnership</option>
        <option value="corporation">Corporation</option>
        <option value="s_corporation">S‑Corporation</option>
        <option value="nonprofit">Nonprofit</option>
        <option value="trust">Trust</option>
        <option value="estate">Estate</option>
        <option value="other">Other</option>
      </select>
    `)}
    ${control('Why do you need an EIN right now?', 'Starting a new business and opening a bank account', `
      <select id="reason">
        <option value="">Select...</option>
        <option value="started_new_business">Starting a new business</option>
        <option value="hired_employees">Hired employees</option>
        <option value="banking">Opening a bank account</option>
        <option value="compliance">Compliance</option>
        <option value="changed_structure">Changed ownership/structure</option>
      </select>
    `)}
    ${control('What’s the legal name? Any trade name (DBA)?', 'Legal: Steel City Goods LLC; DBA: Steel City Goods', `
      <input id="legalName" placeholder="Legal name"/>
      <input id="dbaName" placeholder="DBA (optional)"/>
    `)}
    <div class="row">
      <a class="btn" href="#step2">Next</a>
    </div>
  `);
  document.getElementById('entityType').value = answers.entityType;
  document.getElementById('reason').value = answers.reason;
  document.getElementById('legalName').value = answers.legalName;
  document.getElementById('dbaName').value = answers.dbaName;
  document.getElementById('entityType').onchange = e => save({ entityType: e.target.value });
  document.getElementById('reason').onchange = e => save({ reason: e.target.value });
  document.getElementById('legalName').oninput = e => save({ legalName: e.target.value });
  document.getElementById('dbaName').oninput = e => save({ dbaName: e.target.value });
}

function renderStep2(root) {
  render(root, `
    ${control('Who runs the show and controls the money?', 'Alex Kim, SSN ending 1234', `
      <input id="responsibleName" placeholder="Responsible party full name"/>
      <input id="responsibleSSN_ITIN" placeholder="SSN/ITIN (not uploaded)"/>
    `)}
    <div class="row">
      <a class="btn secondary" href="#step1">Back</a>
      <a class="btn" href="#step3">Next</a>
    </div>
  `);
  document.getElementById('responsibleName').value = answers.responsibleName;
  document.getElementById('responsibleSSN_ITIN').value = answers.responsibleSSN_ITIN;
  document.getElementById('responsibleName').oninput = e => save({ responsibleName: e.target.value });
  document.getElementById('responsibleSSN_ITIN').oninput = e => save({ responsibleSSN_ITIN: e.target.value });
}

function renderStep3(root) {
  render(root, `
    ${control('Where should official mail go?', '123 Penn Ave, Pittsburgh, PA 15222; 412‑555‑0199', `
      <input id="address" placeholder="Street address"/>
      <div class="grid2">
        <input id="city" placeholder="City"/>
        <input id="state" placeholder="State"/>
      </div>
      <div class="grid2">
        <input id="zip" placeholder="ZIP"/>
        <input id="phone" placeholder="Phone"/>
      </div>
      <input id="email" placeholder="Email for PDF delivery"/>
    `)}
    <div class="row">
      <a class="btn secondary" href="#step2">Back</a>
      <a class="btn" href="#step4">Next</a>
    </div>
  `);
  ['address','city','state','zip','phone','email'].forEach(id=>{
    document.getElementById(id).value = answers[id] || '';
    document.getElementById(id).oninput = e => save({ [id]: e.target.value });
  });
}

function renderStep4(root) {
  render(root, `
    ${control('Which state did you form in and when does the business start?', 'Formed in Pennsylvania; starting August 2025', `
      <input id="formationState" placeholder="Formation state"/>
      <input id="startDate" type="month" placeholder="Start month"/>
    `)}
    ${control('What do you mostly do?', 'Retail—selling branded merchandise online', `
      <input id="industry" placeholder="Industry / principal activity"/>
    `)}
    ${control('Will you pay any employees this year? If yes, when does payroll start?', 'Yes; first wages in October 2025', `
      <select id="employeesThisYear">
        <option value="">Select...</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
      <input id="firstPayrollMonth" placeholder="First payroll month (e.g., 2025-10)"/>
    `)}
    ${control('Any of these special taxes apply?', 'No to all', `
      <label><input type="checkbox" id="heavyVehicle"> Heavy highway vehicles</label>
      <label><input type="checkbox" id="gambling"> Gambling / wagering</label>
      <label><input type="checkbox" id="atf"> Alcohol / Tobacco / Firearms</label>
      <label><input type="checkbox" id="quarterlyExcise"> Quarterly excise taxes</label>
    `)}
    <div class="row">
      <a class="btn secondary" href="#step3">Back</a>
      <a class="btn" href="#review">Review</a>
    </div>
  `);
  document.getElementById('formationState').value = answers.formationState;
  document.getElementById('startDate').value = answers.startDate;
  document.getElementById('industry').value = answers.industry;
  document.getElementById('employeesThisYear').value = answers.employeesThisYear;
  document.getElementById('firstPayrollMonth').value = answers.firstPayrollMonth;

  document.getElementById('formationState').oninput = e => save({ formationState: e.target.value });
  document.getElementById('startDate').oninput = e => save({ startDate: e.target.value });
  document.getElementById('industry').oninput = e => save({ industry: e.target.value });
  document.getElementById('employeesThisYear').onchange = e => save({ employeesThisYear: e.target.value });
  document.getElementById('firstPayrollMonth').oninput = e => save({ firstPayrollMonth: e.target.value });

  ['heavyVehicle','gambling','atf','quarterlyExcise'].forEach(key=>{
    const el = document.getElementById(key);
    el.checked = !!answers.exciseSpecial[key];
    el.onchange = e => save({ exciseSpecial: { ...answers.exciseSpecial, [key]: el.checked }});
  });
}

function renderReview(root) {
  render(root, `
    <div class="card">
      <h2>Paste Sheet</h2>
      <pre>
Entity type: ${answers.entityType}
Reason: ${answers.reason}
Responsible party: ${answers.responsibleName} ${answers.responsibleSSN_ITIN ? '(SSN/ITIN ready)' : ''}
Legal name: ${answers.legalName}
DBA: ${answers.dbaName}
Address: ${answers.address}, ${answers.city}, ${answers.state} ${answers.zip}
Phone: ${answers.phone}
Email: ${answers.email}
Formation state: ${answers.formationState}
Start date: ${answers.startDate}
Industry: ${answers.industry}
Employees this year: ${answers.employeesThisYear}
First payroll month: ${answers.firstPayrollMonth}
Special taxes: ${Object.entries(answers.exciseSpecial).filter(([,v])=>v).map(([k])=>k).join(', ') || 'None'}
      </pre>
      <div class="helper">IRS Online EIN Assistant typically available 7:00 a.m.–10:00 p.m. ET, Mon–Fri.</div>
      <div class="row">
        <a class="btn secondary" href="#step4">Back</a>
        <a class="btn" href="#export">Export SS‑4 PDF</a>
      </div>
    </div>
  `);
}

function renderExport(root) {
  render(root, `
    <div class="card">
      <h2>Export SS‑4 PDF</h2>
      <p>Generates a prefilled SS‑4 for fax/mail. Verify all fields before sending.</p>
      <button class="btn" id="downloadBtn">Download PDF</button>
      <a class="btn secondary" href="#review" style="margin-left:8px">Back</a>
    </div>
  `);
  document.getElementById('downloadBtn').onclick = downloadPDF;
}

async function downloadPDF() {
  const url = 'ss4.pdf'; // served from same folder or /ss4.pdf if under a server root
  const existingPdfBytes = await fetch(url).then(r => r.arrayBuffer());

  const { PDFDocument, StandardFonts } = window['PDFLib'];
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const page = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const draw = (text, x, y) => page.drawText(text || '', { x, y, size: 10, font });

  draw(answers.legalName, 80, 695);
  draw(answers.dbaName, 80, 677);
  draw(answers.address, 80, 661);
  draw(`${answers.city}, ${answers.state} ${answers.zip}`, 80, 645);
  draw(answers.responsibleName, 340, 610);
  draw(answers.responsibleSSN_ITIN, 470, 610);
  draw((answers.reason || '').replaceAll('_',' '), 120, 515);
  draw(answers.startDate, 470, 495);
  draw(answers.industry, 120, 420);
  draw(answers.phone, 470, 565);

  const bytes = await pdfDoc.save(); // Uint8Array
  const blob = await new Response(bytes).blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = 'SS-4_prefilled.pdf';
  a.click();
  URL.revokeObjectURL(blobUrl);
}

// Router bootstrap
function mount() {
  const root = document.getElementById('view');
  const hash = location.hash || '#step1';
  const view = routes[hash] || renderStep1;
  view(root);
  computeProgress();
}
window.addEventListener('hashchange', mount);
window.addEventListener('DOMContentLoaded', mount);
