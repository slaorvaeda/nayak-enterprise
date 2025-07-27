import jsPDF from "jspdf";

export function generateInvoicePDF(order) {
  const doc = new jsPDF();
  const leftMargin = 20;
  const rightMargin = 200;
  let y = 20;

  // Draw page border
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.5);
  doc.rect(8, 8, 194, 281, 'S');

  // Company Info (left)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Nayak Enterprises", leftMargin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Wholesale Distribution", leftMargin, y + 6);
  doc.text("123 Business District, City, State 12345", leftMargin, y + 12);
  doc.text("Phone: +91 98765 43210", leftMargin, y + 18);
  doc.text("Email: info@nayakenterprises.com", leftMargin, y + 24);

  // Invoice Title (top right)
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", rightMargin, y, { align: "right" });

  // Invoice No, Date, Bill To (right block)
  let yRight = y + 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice #: ${order.orderNumber || order._id}`, rightMargin, yRight, { align: "right" });
  yRight += 7;
  doc.text(`Date: ${order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "-"}`, rightMargin, yRight, { align: "right" });
  yRight += 7;
  doc.text("Bill To:", rightMargin, yRight, { align: "right" });
  yRight += 6;
  doc.text(order.customer?.businessName || "", rightMargin, yRight, { align: "right" });
  yRight += 6;
  doc.text(order.customer?.email || "", rightMargin, yRight, { align: "right" });
  yRight += 6;
  doc.text(order.customer?.phone || "", rightMargin, yRight, { align: "right" });

  // Move y below both blocks
  y = Math.max(y + 36, yRight + 8);

  // Table Header Background
  doc.setFillColor(230, 230, 230);
  doc.rect(leftMargin - 2, y - 6, 170, 9, 'F');

  // Items Table Header
  const colProduct = leftMargin;
  const colQty = 100;
  const colUnit = 130;
  const colTotal = 170;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Product", colProduct, y);
  doc.text("Qty", colQty, y, { align: "right" });
  doc.text("Unit Price", colUnit, y, { align: "right" });
  doc.text("Total", colTotal, y, { align: "right" });
  y += 3;
  doc.setDrawColor(180, 180, 180);
  doc.line(leftMargin - 2, y, leftMargin + 168, y);
  y += 7;

  // Items Table Rows
  doc.setFont("helvetica", "normal");
  order.items?.forEach((item, idx) => {
    doc.setFontSize(12);
    doc.text(item.name || "", colProduct, y);
    doc.text(String(item.quantity ?? 0), colQty, y, { align: "right" });
    doc.text(`Rs. ${(item.unitPrice ?? item.price ?? 0).toLocaleString()}`, colUnit, y, { align: "right" });
    doc.text(`Rs. ${(item.totalPrice ?? item.total ?? 0).toLocaleString()}`, colTotal, y, { align: "right" });
    y += 7;
    if (y > 260) {
      doc.addPage();
      // Draw border on new page
      doc.setDrawColor(60, 60, 60);
      doc.setLineWidth(0.5);
      doc.rect(8, 8, 194, 281, 'S');
      y = 20;
    }
  });
  y += 2;
  doc.setDrawColor(180, 180, 180);
  doc.line(leftMargin - 2, y, leftMargin + 168, y);
  y += 10;

  // Totals
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Subtotal:`, colUnit, y, { align: "right" });
  doc.text(`Rs. ${(order.subtotal ?? 0).toLocaleString()}`, colTotal, y, { align: "right" });
  y += 7;
  doc.text(`Tax:`, colUnit, y, { align: "right" });
  doc.text(`Rs. ${(order.tax ?? 0).toLocaleString()}`, colTotal, y, { align: "right" });
  y += 7;
  doc.text(`Shipping:`, colUnit, y, { align: "right" });
  doc.text(`Rs. ${(order.shippingCost ?? order.shipping ?? 0).toLocaleString()}`, colTotal, y, { align: "right" });
  y += 7;
  doc.setFontSize(14);
  doc.text(`Total:`, colUnit, y, { align: "right" });
  doc.text(`Rs. ${(order.total ?? 0).toLocaleString()}`, colTotal, y, { align: "right" });
  y += 14;

  // Footer
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for your business!", leftMargin, y);
  doc.text("For any queries, contact us at info@nayakenterprises.com", leftMargin, y + 6);

  // Signature section
  y += 22;
  doc.setFontSize(12);
  doc.text("Authorised Signatory", colTotal, y, { align: "right" });
  y += 6;
  doc.text("For Nayak Enterprises", colTotal, y, { align: "right" });
  y += 2;
  doc.setDrawColor(120, 120, 120);
  doc.line(colTotal - 40, y + 10, colTotal, y + 10); // signature line

  doc.save(`invoice-${order.orderNumber || order._id}.pdf`);
} 