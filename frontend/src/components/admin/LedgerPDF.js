import jsPDF from "jspdf";

export function generateLedgerPDF({ customer, ledger, getTimeline }) {
  if (!customer || !ledger) return;
  const doc = new jsPDF();
  let y = 20;
  const leftMargin = 15;
  const rightMargin = 200;
  const tableWidth = rightMargin - leftMargin;
  // Adjusted column widths for better spacing
  const colDate = leftMargin + 2;
  const colDesc = colDate + 30;
  const colCredit = colDesc + 52;
  const colDebit = colCredit + 28;
  const colBalance = colDebit + 28;
  const colNotes = colBalance + 28;
  const accentColor = [30, 80, 180]; // blue accent

  // Draw page border
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.5);
  doc.rect(8, 8, 194, 281, 'S');

  // Try to add logo (if available)
  try {
    // You can replace this with your actual logo path and base64 if needed
    // doc.addImage('/public/hero.png', 'PNG', leftMargin, y - 5, 18, 18);
  } catch (e) {
    // If logo fails, skip
  }

  // Header: two columns
  // Left: Company Info
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Nayak Enterprises", leftMargin + 2, y);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Wholesale Distribution", leftMargin + 2, y + 4);
  doc.text("info@nayakenterprises.com", leftMargin + 2, y + 8);
  // Right: Title and date
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...accentColor);
  doc.text("LEDGER STATEMENT", rightMargin, y, { align: "right" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, rightMargin, y + 7, { align: "right" });
  doc.setTextColor(0, 0, 0);
  y += 20;

  // Accent bar
  doc.setFillColor(...accentColor);
  doc.rect(leftMargin, y - 6, tableWidth, 2, 'F');
  y += 4;

  // Customer Info Card
  doc.setFillColor(240, 245, 255);
  doc.roundedRect(leftMargin, y, tableWidth, 18, 2, 2, 'F');
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Customer Information", leftMargin + 2, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Name: ${customer.businessName || "-"}`, leftMargin + 2, y + 12);
  doc.text(`Email: ${customer.email || "-"}`, leftMargin + 60, y + 12);
  doc.text(`Phone: ${customer.phone || "-"}`, leftMargin + 120, y + 12);
  y += 22;

  // Table header background
  doc.setFillColor(...accentColor);
  doc.rect(leftMargin, y - 5, tableWidth, 8, 'F');
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("Date", colDate, y);
  doc.text("Description", colDesc, y);
  doc.text("Credit", colCredit + 25, y, { align: "right" });
  doc.text("Debit", colDebit + 25, y, { align: "right" });
  doc.text("Balance", colBalance + 25, y, { align: "right" });
  doc.text("Notes", colNotes, y);
  doc.setTextColor(0, 0, 0);
  y += 5;
  doc.setLineWidth(0.2);
  doc.line(leftMargin, y, rightMargin, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  // Table rows with grid lines and alternating background
  let balance = 0;
  const rows = getTimeline(ledger.orders, ledger.payments);
  rows.forEach((tx, idx) => {
    if (y > 265) {
      doc.addPage();
      y = 20;
    }
    // Alternating row color
    if (idx % 2 === 1) {
      doc.setFillColor(245, 248, 255);
      doc.rect(leftMargin, y - 3, tableWidth, 7, 'F');
    }
    // Grid lines
    doc.setDrawColor(220, 220, 220);
    doc.line(leftMargin, y + 4, rightMargin, y + 4);
    const dateStr = tx.date ? new Date(tx.date).toLocaleDateString() : "-";
    let credit = "", debit = "";
    if (tx.type === "credit") {
      credit = `Rs. ${tx.amount.toLocaleString()}`;
      balance += tx.amount;
    } else {
      debit = `Rs. ${tx.amount.toLocaleString()}`;
      balance -= tx.amount;
    }
    // Truncate/wrap description and notes if too long
    const desc = String(tx.label).length > 28 ? String(tx.label).slice(0, 25) + '…' : String(tx.label);
    const notes = (tx.notes || "").length > 22 ? (tx.notes || "").slice(0, 19) + '…' : (tx.notes || "");
    doc.setTextColor(30, 30, 30);
    doc.text(dateStr, colDate, y);
    doc.text(desc, colDesc, y, { maxWidth: 50 });
    doc.text(credit, colCredit + 25, y, { align: "right" });
    doc.text(debit, colDebit + 25, y, { align: "right" });
    doc.text(`Rs. ${balance.toLocaleString()}`, colBalance + 25, y, { align: "right" });
    doc.text(notes, colNotes, y, { maxWidth: 40 });
    y += 7;
  });
  y += 2;
  doc.setLineWidth(0.5);
  doc.setDrawColor(...accentColor);
  doc.line(leftMargin, y, rightMargin, y);
  y += 8;
  // Summary/Final Balance
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...accentColor);
  doc.text(`Final Balance: Rs. ${(
    ledger.orders.reduce((sum, o) => sum + (o.total ?? 0), 0) -
    ledger.payments.reduce((sum, p) => sum + (p.type === 'debit' ? p.amount ?? 0 : 0), 0) +
    ledger.payments.reduce((sum, p) => sum + (p.type === 'credit' ? p.amount ?? 0 : 0), 0)
  ).toLocaleString()}`, leftMargin, y);
  doc.setTextColor(0, 0, 0);
  y += 12;
  // Signature/Footer
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Authorised Signatory", rightMargin, y, { align: "right" });
  y += 6;
  doc.text("For Nayak Enterprises", rightMargin, y, { align: "right" });
  y += 2;
  doc.setDrawColor(120, 120, 120);
  doc.line(rightMargin - 40, y + 10, rightMargin, y + 10); // signature line
  y += 18;
  // Footer with page number and contact
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(120, 120, 120);
  doc.text("Generated by Nayak Enterprises Admin Panel", leftMargin, 285);
  doc.text(`Page 1`, rightMargin, 285, { align: "right" });
  doc.save(`ledger-${customer.businessName || customer._id}.pdf`);
} 