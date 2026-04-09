import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun } from "docx";
import { saveAs } from "file-saver";

/**
 * Basic markdown to docx converter.
 * For a production app, a more robust parser like 'remark' would be used.
 * Here we do a simple line-by-line conversion for the demo.
 */
export async function exportToDocx(title: string, markdown: string, imageUrl?: string) {
  const lines = markdown.split('\n');
  const children: any[] = [];

  // Add Title
  children.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  // Add Image if exists
  if (imageUrl) {
    try {
      // Convert data URL to array buffer
      const response = await fetch(imageUrl);
      const buffer = await response.arrayBuffer();
      
      children.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: buffer,
              transformation: {
                width: 600,
                height: 337, // 16:9 ratio
              },
            } as any),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        })
      );
    } catch (e) {
      console.error("Failed to add image to docx", e);
    }
  }

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) {
      children.push(new Paragraph({ text: "" }));
      return;
    }

    if (trimmed.startsWith('# ')) {
      children.push(new Paragraph({ text: trimmed.replace('# ', ''), heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }));
    } else if (trimmed.startsWith('## ')) {
      children.push(new Paragraph({ text: trimmed.replace('## ', ''), heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 150 } }));
    } else if (trimmed.startsWith('### ')) {
      children.push(new Paragraph({ text: trimmed.replace('### ', ''), heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 100 } }));
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      children.push(new Paragraph({ text: trimmed.substring(2), bullet: { level: 0 } }));
    } else if (/^\d+\. /.test(trimmed)) {
      children.push(new Paragraph({ text: trimmed, spacing: { after: 120 } }));
    } else {
      // Basic bold handling
      const parts = trimmed.split(/(\*\*.*?\*\*)/g);
      const textRuns = parts.map(part => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return new TextRun({ text: part.slice(2, -2), bold: true });
        }
        return new TextRun(part);
      });

      children.push(new Paragraph({
        children: textRuns,
        spacing: { after: 200 }
      }));
    }
  });

  const doc = new Document({
    sections: [{
      properties: {},
      children: children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx`);
}
