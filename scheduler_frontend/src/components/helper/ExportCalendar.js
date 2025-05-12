// ExportCalendar.js
// A component that handles the export of the calendar content in PDF format.
// It uses html2canvas to capture the calendar as an image and jsPDF to generate the PDF file.
// The component listens for the `format` prop and triggers the export process when it's set to "pdf".

import { useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ExportCalendar = ({ format, onDone }) => {
  const hasExported = useRef(false);

  useEffect(() => {
    const exportAsPDF = async () => {
      if (hasExported.current) return;
      hasExported.current = true;

      const calendarEl = document.getElementById("calendar");
      if (!calendarEl) {
        console.error("Calendar element not found");
        onDone();
        return;
      }

      try {
        // Give time for rendering if this is a hidden calendar
        await new Promise((res) => setTimeout(res, 300));

        const canvas = await html2canvas(calendarEl, {
          scale: 2,
          useCORS: true,
        });

        const imgData = canvas.toDataURL("image/png");

        if (!imgData || !imgData.startsWith("data:image/png")) {
          throw new Error("Failed to generate valid PNG image data.");
        }

        const pdf = new jsPDF("landscape", "mm", "a4");

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pageWidth;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        const yOffset = (pageHeight - pdfHeight) / 2;

        pdf.addImage(imgData, "PNG", 0, yOffset, pdfWidth, pdfHeight);
        pdf.save("calendar.pdf");
      } catch (err) {
        console.error("Export failed:", err);
      } finally {
        onDone();
      }
    };

    if (format === "pdf") {
      exportAsPDF();
    }
  }, [format, onDone]);

  return null;
};

export default ExportCalendar;
