import type { User } from "better-auth/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function downloadCertificate(
  user: User,
  registration: UserRegistration & {
    event: {
      user: {
        name: string;
      };
    };
  },
) {
  const pdf = await PDFDocument.create();

  // A4 Landscape
  const page = pdf.addPage([842, 595]);

  const titleFont = await pdf.embedFont(StandardFonts.HelveticaBold);
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();

  const center = (text: string, size: number, bold = false) => {
    const f = bold ? titleFont : font;
    return (width - f.widthOfTextAtSize(text, size)) / 2;
  };
  const eventDate = new Date(registration.event.eventDate).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  // Border
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: rgb(0, 0, 0),
    borderWidth: 2,
  });

  // Title
  page.drawText("CERTIFICATE OF PARTICIPATION", {
    x: center("CERTIFICATE OF PARTICIPATION", 28, true),
    y: height - 80,
    size: 28,
    font: titleFont,
  });
  // Start Text
  page.drawText("This certificate is proudly presented to", {
    x: center("This certificate is proudly presented to", 16),
    y: height - 130,
    size: 16,
    font,
  });

  // Participant name
  page.drawText(user.name, {
    x: center(user.name, 30, true),
    y: height - 180,
    size: 30,
    font: titleFont,
  });

  // End Text
  page.drawText("for successfully participating in", {
    x: center("for successfully participating in", 16),
    y: height - 235,
    size: 16,
    font,
  });

  // Event
  page.drawText(registration.event.title, {
    x: center(registration.event.title, 22, true),
    y: height - 275,
    size: 22,
    font: titleFont,
  });

  // Event Location
  page.drawText(registration.event.location, {
    x: center(registration.event.location, 16),
    y: height - 315,
    size: 16,
    font,
  });

  // Event Date
  page.drawText(eventDate, {
    x: center(eventDate, 16),
    y: height - 345,
    size: 16,
    font,
  });

  // Certificate ID
  page.drawText(`Certificate ID: ${registration.id}`, {
    x: 40,
    y: 50,
    size: 12,
    font,
  });

  // Organizer
  const organizerX = width - 220;

  // Event User Name
  page.drawText(registration.event.user.name, {
    x: organizerX,
    y: 80,
    size: 16,
    font: titleFont,
  });

  page.drawLine({
    start: { x: organizerX, y: 72 },
    end: { x: organizerX + 150, y: 72 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  page.drawText("Organizer", {
    x: organizerX + 35,
    y: 55,
    size: 12,
    font,
  });

  const bytes = await pdf.save();

  const blob = new Blob([bytes as BlobPart], {
    type: "application/pdf",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${registration.event.title}-Certificate.pdf`;
  a.click();

  URL.revokeObjectURL(url);
}
