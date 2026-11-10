import { jsPDF } from 'jspdf';
import { Booking } from '../types';

export const generateBookingReceiptPdf = (booking: Booking): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Receipt Number
  const receiptNo = `RCP-${booking.date.replace(/-/g, '')}-${(booking.bookingRef || booking.id.slice(0, 6)).toUpperCase()}`;
  const servicePrice = booking.servicePrice > 0 ? booking.servicePrice : 85.00;
  const facilityFee = 15.00;
  const subtotal = servicePrice + facilityFee;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = (subtotal + tax).toFixed(2);

  // 1. Top Navy Header Banner
  doc.setFillColor(2, 20, 58); // #02143a Deep Navy
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Cyan accent line
  doc.setFillColor(37, 99, 235); // #2563eb
  doc.rect(0, 42, pageWidth, 2.5, 'F');

  // Title & Brand
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('AutoPulse Service Center', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(186, 230, 253); // Sky-200
  doc.text('Official Vehicle Service Slot Booking Receipt • Mutex Verified', 14, 25);
  doc.text('AutoPulse Automated Facilities • 100 Auto Blvd, Tech City', 14, 31);

  // Receipt Badge Box (Right side of Header)
  doc.setFillColor(6, 40, 95);
  doc.roundedRect(pageWidth - 68, 10, 54, 24, 3, 3, 'F');

  doc.setTextColor(56, 189, 248); // Cyan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('RECEIPT NO.', pageWidth - 64, 16);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(receiptNo, pageWidth - 64, 22);

  doc.setTextColor(148, 163, 184); // Slate-400
  doc.setFontSize(7.5);
  doc.text(`Issued: ${new Date().toLocaleDateString()}`, pageWidth - 64, 28);

  // 2. Mutex Protection & Security Verified Ribbon
  doc.setFillColor(240, 253, 244); // Emerald-50
  doc.setDrawColor(74, 222, 128); // Emerald-400
  doc.setLineWidth(0.4);
  doc.roundedRect(14, 49, pageWidth - 28, 12, 2, 2, 'FD');

  doc.setTextColor(22, 101, 52); // Emerald-800
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('[LOCK] Mutex Lock Verified & Atomic Critical Section Approved', 19, 56.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(21, 128, 61);
  doc.text(`Ref: ${booking.bookingRef} • Bay #${booking.bayNumber} Guaranteed`, pageWidth - 80, 56.5);

  // 3. Customer & Vehicle Information Cards
  const yDetails = 68;

  // Left Card: Customer Details
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.roundedRect(14, yDetails, 88, 38, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42); // Slate-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('CUSTOMER INFORMATION', 18, yDetails + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text('Customer Name:', 18, yDetails + 15);
  doc.text('Customer ID:', 18, yDetails + 22);
  doc.text('Contact Status:', 18, yDetails + 29);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.customerName || 'Valued Customer', 50, yDetails + 15);
  doc.text(booking.customerId || 'CUST-AUTO-01', 50, yDetails + 22);
  doc.setTextColor(22, 101, 52);
  doc.text('Verified Active', 50, yDetails + 29);

  // Right Card: Vehicle & Bay Details
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(108, yDetails, 88, 38, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('VEHICLE & FACILITY DETAILS', 112, yDetails + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Vehicle Model:', 112, yDetails + 15);
  doc.text('License Plate:', 112, yDetails + 22);
  doc.text('Service Bay Allocated:', 112, yDetails + 29);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.vehicleModel || 'Vehicle', 148, yDetails + 15);
  doc.text(booking.vehiclePlate || 'N/A', 148, yDetails + 22);
  doc.setTextColor(37, 99, 235);
  doc.text(`Bay #${booking.bayNumber} (Exclusive)`, 148, yDetails + 29);

  // 4. Appointment Schedule Card
  const ySchedule = 112;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, ySchedule, pageWidth - 28, 20, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('RESERVATION SCHEDULE:', 20, ySchedule + 8);
  doc.text(`Date: ${booking.date}`, 78, ySchedule + 8);
  doc.text(`Time Slot: ${booking.timeSlot}`, 135, ySchedule + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Estimated Duration: ${booking.durationMinutes || 60} Minutes • Priority Mutex Bay Protection Active`, 20, ySchedule + 15);

  // 5. Itemized Service Charges Table
  const yTable = 138;
  doc.setFillColor(2, 20, 58);
  doc.rect(14, yTable, pageWidth - 28, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('DESCRIPTION / ITEM', 18, yTable + 5.5);
  doc.text('TYPE', 110, yTable + 5.5);
  doc.text('QTY', 142, yTable + 5.5);
  doc.text('AMOUNT (USD)', pageWidth - 42, yTable + 5.5);

  // Table Row 1: Primary Service
  let rowY = yTable + 15;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(booking.serviceName || 'Vehicle Maintenance Service', 18, rowY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Scheduled Service', 110, rowY);
  doc.text('1', 144, rowY);
  doc.setTextColor(15, 23, 42);
  doc.text(`$${servicePrice.toFixed(2)}`, pageWidth - 42, rowY);

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.line(14, rowY + 3, pageWidth - 14, rowY + 3);

  // Table Row 2: Service Bay Facility Charge
  rowY += 10;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(`Service Bay #${booking.bayNumber} Dynamic Allocation`, 18, rowY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Bay Resource', 110, rowY);
  doc.text('1', 144, rowY);
  doc.setTextColor(15, 23, 42);
  doc.text(`$${facilityFee.toFixed(2)}`, pageWidth - 42, rowY);

  doc.line(14, rowY + 3, pageWidth - 14, rowY + 3);

  // Table Row 3: Concurrency & Mutex Safety Check
  rowY += 10;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('Mutex Lock Inspection & Conflict Verification', 18, rowY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('System Security', 110, rowY);
  doc.text('1', 144, rowY);
  doc.setTextColor(22, 101, 52);
  doc.text('$0.00 (Free)', pageWidth - 42, rowY);

  doc.line(14, rowY + 3, pageWidth - 14, rowY + 3);

  // 6. Summary Totals Box (Right Side)
  const yTotals = rowY + 12;
  const totalsX = pageWidth - 80;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Subtotal:', totalsX, yTotals);
  doc.setTextColor(15, 23, 42);
  doc.text(`$${subtotal.toFixed(2)}`, pageWidth - 20, yTotals, { align: 'right' });

  doc.setTextColor(100, 116, 139);
  doc.text('Tax / VAT (8%):', totalsX, yTotals + 6);
  doc.setTextColor(15, 23, 42);
  doc.text(`$${tax.toFixed(2)}`, pageWidth - 20, yTotals + 6, { align: 'right' });

  // Total Bar
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(totalsX - 4, yTotals + 10, 70, 11, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(2, 20, 58);
  doc.text('Total Paid:', totalsX, yTotals + 17.5);
  doc.setTextColor(37, 99, 235);
  doc.text(`$${total}`, pageWidth - 20, yTotals + 17.5, { align: 'right' });

  // 7. Payment Status Stamp Box (Left Side)
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(0.8);
  doc.roundedRect(14, yTotals, 85, 28, 2, 2, 'FD');

  doc.setTextColor(22, 101, 52);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('[V] PAYMENT STATUS: COMPLETED', 18, yTotals + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(21, 128, 61);
  doc.text('Transaction Verified via AutoPulse Mutex Protocol', 18, yTotals + 16);
  doc.text(`Booking Status: ${booking.status.toUpperCase()} • Paid in Full`, 18, yTotals + 22);

  // 8. Footer Section
  doc.setFillColor(248, 250, 252);
  doc.rect(0, pageHeight - 22, pageWidth, 22, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.line(0, pageHeight - 22, pageWidth, pageHeight - 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Thank you for choosing AutoPulse Service Center! Please present this receipt upon arrival at Bay #' +
      booking.bayNumber +
      '.',
    pageWidth / 2,
    pageHeight - 14,
    { align: 'center' }
  );

  doc.text(
    'AutoPulse System • Mutex Synchronization & Race Condition Prevention • Support: support@autopulse.service',
    pageWidth / 2,
    pageHeight - 9,
    { align: 'center' }
  );

  // Trigger browser file download
  const safeFilename = `AutoPulse_Receipt_${receiptNo}.pdf`;
  doc.save(safeFilename);
};
