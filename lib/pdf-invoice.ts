import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface CompanyProfile {
  name: string;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  logo_url?: string | null;
  vat_exempt?: boolean;
  vat_number?: string | null;
  legal_mention?: string | null;
}

interface Client {
  name: string;
  client_type?: "person" | "company";
  contact_name?: string | null;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  siret?: string | null;
}

interface Line {
  description: string;
  quantity: number;
  unit_price: number;
}

interface DocData {
  number: string;
  issue_date: string;
  due_date: string;
  vat_rate: number;
  note?: string | null;
  type: "invoice" | "quote";
  company: CompanyProfile;
  client: Client;
  lines: Line[];
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

function formatCurrency(value: number): string {
  const parts = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).formatToParts(value);
  return parts
    .map((p) => (p.type === "group" ? " " : p.value))
    .join("");
}

export function generatePdf(data: DocData): jsPDF {
  const doc = new jsPDF({ format: "a4", unit: "mm" });
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Logo (placeholder si pas d'URL)
  if (data.company.logo_url) {
    try {
      doc.addImage(data.company.logo_url, "PNG", 20, 15, 35, 15);
    } catch {
      doc.setFontSize(16).setFont("helvetica", "bold").text(data.company.name, 20, 22);
    }
    y = 35;
  } else {
    doc.setFontSize(16).setFont("helvetica", "bold").text(data.company.name, 20, y);
    y += 8;
  }

  // En-tête entreprise
  doc.setFontSize(10).setFont("helvetica", "normal");
  if (data.company.address) {
    doc.text(data.company.address, 20, y);
    y += 5;
  }
  if (data.company.email) {
    doc.text(data.company.email, 20, y);
    y += 5;
  }
  if (data.company.phone) {
    doc.text(data.company.phone, 20, y);
    y += 5;
  }
  if (data.company.vat_number && !data.company.vat_exempt) {
    doc.text(`TVA : ${data.company.vat_number}`, 20, y);
    y += 5;
  }
  if (data.company.vat_exempt) {
    doc.text("TVA non applicable, art. 293 B du CGI", 20, y);
    y += 5;
  }
  y += 5;

  // Numéro et type à droite
  const typeLabel = data.type === "invoice" ? "FACTURE" : "DEVIS";
  doc.setFont("helvetica", "bold").setFontSize(14).text(typeLabel, pageWidth - 20, 25, { align: "right" });
  doc.setFont("helvetica", "normal").setFontSize(10).text(data.number, pageWidth - 20, 32, { align: "right" });
  doc.text(`Date : ${formatDate(data.issue_date)}`, pageWidth - 20, 38, { align: "right" });
  if (data.type === "invoice") {
    doc.text(`Échéance : ${formatDate(data.due_date)}`, pageWidth - 20, 44, { align: "right" });
  }

  // Bloc client
  y = Math.max(y, 50);
  const isCompany = data.client.client_type === "company";
  doc.setFont("helvetica", "bold").setFontSize(10).text("Client", 20, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  if (isCompany) {
    doc.setFont("helvetica", "bold").text(data.client.name, 20, y);
    y += 5;
    if (data.client.contact_name) {
      doc.setFont("helvetica", "normal").text(`À l'attention de : ${data.client.contact_name}`, 20, y);
      y += 5;
    }
    doc.setFont("helvetica", "normal");
  } else {
    doc.text(data.client.name, 20, y);
    y += 5;
  }
  if (data.client.address) {
    doc.text(data.client.address, 20, y);
    y += 5;
  }
  if (data.client.email) {
    doc.text(data.client.email, 20, y);
    y += 5;
  }
  if (data.client.phone) {
    doc.text(data.client.phone, 20, y);
    y += 5;
  }
  if (data.client.siret) {
    doc.text(`SIRET : ${data.client.siret}`, 20, y);
    y += 5;
  }
  y += 10;

  // Tableau des lignes
  const tableData = data.lines.map((l) => [
    l.description,
    String(l.quantity),
    formatCurrency(l.unit_price),
    formatCurrency(l.quantity * l.unit_price),
  ]);
  autoTable(doc, {
    startY: y,
    head: [["Description", "Quantité", "Prix unitaire HT", "Total HT"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129], textColor: 255 },
    margin: { left: 20, right: 20 },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // Totaux
  const subtotalHT = data.lines.reduce((s, l) => s + l.quantity * l.unit_price, 0);
  const tva = (subtotalHT * data.vat_rate) / 100;
  const totalTTC = subtotalHT + tva;
  const totalsX = pageWidth - 20;
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(`Sous-total HT : ${formatCurrency(subtotalHT)}`, totalsX, y, { align: "right" });
  y += 6;
  doc.text(`TVA (${data.vat_rate}%) : ${formatCurrency(tva)}`, totalsX, y, { align: "right" });
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text(`Total TTC : ${formatCurrency(totalTTC)}`, totalsX, y, { align: "right" });
  y += 12;

  if (data.note) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text("Notes / conditions :", 20, y);
    y += 5;
    const split = doc.splitTextToSize(data.note, pageWidth - 40);
    doc.text(split, 20, y);
    y += split.length * 5 + 8;
  }

  // Mentions légales en bas
  if (data.company.legal_mention) {
    doc.setFontSize(8).setTextColor(100, 100, 100);
    const splitLegal = doc.splitTextToSize(data.company.legal_mention, pageWidth - 40);
    const legalY = doc.internal.pageSize.getHeight() - 20;
    doc.text(splitLegal, 20, legalY);
  }

  return doc;
}
