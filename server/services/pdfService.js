const PDFDocument = require('pdfkit');
const { DISCLAIMER, RESULT_NOTE } = require('../utils/insights');

const NAVY = '#0f3157';
const MUTED = '#55657a';
const RISK_COLOR = { Low: '#14916c', Moderate: '#b9740a', High: '#c93d3d' };

function formatValue(feature, value) {
  if (!feature) return String(value);
  if (feature.type === 'boolean') return Number(value) === 1 ? 'Yes' : 'No';
  if (feature.type === 'select') {
    const option = (feature.options || []).find((o) => Math.abs(Number(o.value) - Number(value)) < 1e-9);
    return option ? option.label : String(value);
  }
  return `${value}${feature.unit ? ` ${feature.unit}` : ''}`;
}

exports.buildReport = ({ assessment, user, features, insights }) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50, info: { Title: 'HealthPredict assessment report' } });
  const left = doc.page.margins.left;
  const width = doc.page.width - left - doc.page.margins.right;
  const ensureSpace = (needed) => { if (doc.y + needed > doc.page.height - 80) doc.addPage(); };
  const heading = (text) => {
    ensureSpace(60);
    doc.moveDown(0.8).font('Helvetica-Bold').fontSize(13).fillColor(NAVY).text(text, left, doc.y);
    doc.moveTo(left, doc.y + 3).lineTo(left + width, doc.y + 3).strokeColor('#e1e7ef').stroke();
    doc.moveDown(0.6).font('Helvetica').fontSize(10.5).fillColor('#0f1f33');
  };

  // Header band
  doc.rect(0, 0, doc.page.width, 78).fill(NAVY);
  doc.font('Helvetica-Bold').fontSize(20).fillColor('#ffffff').text('HealthPredict', left, 26);
  doc.font('Helvetica').fontSize(10).fillColor('#b8c6d9').text('Understand Your Health Risks. Make Informed Decisions.', left, 51);
  doc.y = 100;

  doc.font('Helvetica-Bold').fontSize(17).fillColor(NAVY).text('Health risk assessment report', left, doc.y);
  doc.moveDown(0.5).font('Helvetica').fontSize(10.5).fillColor(MUTED);
  doc.text(`Prepared for: ${user.name}`);
  doc.text(`Assessment date: ${new Date(assessment.createdAt).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })}`);
  doc.text(`Condition: ${assessment.diseaseName}`);

  heading('Estimated risk');
  const color = RISK_COLOR[assessment.riskLevel] || NAVY;
  doc.font('Helvetica-Bold').fontSize(22).fillColor(color).text(`${assessment.riskLevel} risk`, left, doc.y);
  doc.font('Helvetica').fontSize(10.5).fillColor('#0f1f33');
  doc.text(`Estimated probability: ${assessment.probability}%`);
  doc.text(`Model outcome: ${assessment.prediction}`);
  if (assessment.explanation) doc.moveDown(0.4).fillColor(MUTED).text(assessment.explanation, { width });

  heading('Information entered');
  const byKey = Object.fromEntries((features || []).map((f) => [f.key, f]));
  Object.entries(assessment.inputData || {}).forEach(([key, value]) => {
    ensureSpace(20);
    const feature = byKey[key];
    const y = doc.y;
    doc.fillColor(MUTED).text(feature?.label || key, left, y, { width: width * 0.6 });
    doc.fillColor('#0f1f33').text(formatValue(feature, value), left + width * 0.62, y, { width: width * 0.38 });
    doc.y = Math.max(doc.y, y + 16);
  });

  heading(`General information: ${insights.title}`);
  [...insights.points, ...insights.general].forEach((point) => {
    ensureSpace(32);
    doc.fillColor('#0f1f33').text(`•  ${point}`, left, doc.y, { width, indent: 0 });
    doc.moveDown(0.25);
  });

  heading('Important notice');
  doc.fillColor(MUTED).text(RESULT_NOTE, left, doc.y, { width });
  doc.moveDown(0.5).text(DISCLAIMER, left, doc.y, { width });

  doc.end();
  return doc;
};
