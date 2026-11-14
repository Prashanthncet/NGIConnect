import ExcelJS from "exceljs";
import { IRegistration } from "../models/Registration";
import { Form } from "../models/Form";

export async function generateRegistrationsExcelBuffer(
  registrations: IRegistration[],
  institution?: string,
  adminName: string = "Administrator"
): Promise<Buffer> {
  const forms = await Form.find({});
  const questionMap = new Map<string, string>(); // questionId -> label

  forms.forEach((f) => {
    f.fields.forEach((field) => {
      if (!questionMap.has(field.id) && field.type !== "section_heading" && field.type !== "description") {
        questionMap.set(field.id, field.label);
      }
    });
  });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Nagarjuna Connect Backend REST API";
  workbook.lastModifiedBy = adminName;
  workbook.created = new Date();
  workbook.modified = new Date();

  const sheetName = institution && institution !== "ALL" ? `${institution} Submissions` : "All Registrations";
  const worksheet = workbook.addWorksheet(sheetName, {
    views: [{ state: "frozen", ySplit: 1, xSplit: 0 }],
    properties: { tabColor: { argb: "FF102B46" } },
  });

  // Base Columns
  const columns: Partial<ExcelJS.Column>[] = [
    { header: "Registration ID", key: "registrationId", width: 24 },
    { header: "Full Name", key: "candidateName", width: 24 },
    { header: "Email Address", key: "candidateEmail", width: 30 },
    { header: "Phone / WhatsApp", key: "candidatePhone", width: 18 },
    { header: "Institution", key: "institutionShortName", width: 14 },
    { header: "Department / Program", key: "department", width: 32 },
    { header: "Category", key: "category", width: 18 },
    { header: "Status", key: "status", width: 14 },
    { header: "Submitted At", key: "submittedAt", width: 22 },
  ];

  // Dynamic Columns
  const dynamicKeys: string[] = [];
  questionMap.forEach((label, id) => {
    if (!["full_name", "email", "phone", "department", "category"].includes(id)) {
      columns.push({
        header: label,
        key: `dyn_${id}`,
        width: Math.max(label.length + 4, 20),
      });
      dynamicKeys.push(id);
    }
  });

  worksheet.columns = columns;

  // Header styling
  const headerRow = worksheet.getRow(1);
  headerRow.height = 30;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF102B46" },
    };
    cell.font = {
      name: "Arial",
      size: 11,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FF2A6496" } },
      bottom: { style: "medium", color: { argb: "FFF28C28" } },
    };
  });

  // Populate data
  registrations.forEach((reg) => {
    const rowData: Record<string, any> = {
      registrationId: reg.registrationId,
      candidateName: reg.candidateName,
      candidateEmail: reg.candidateEmail,
      candidatePhone: reg.candidatePhone || "—",
      institutionShortName: reg.institutionShortName,
      department: reg.department || "—",
      category: reg.category || "Student",
      status: reg.status,
      submittedAt: new Date(reg.submittedAt).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    dynamicKeys.forEach((key) => {
      const val = reg.responses ? reg.responses[key] : undefined;
      if (Array.isArray(val)) {
        rowData[`dyn_${key}`] = val.join("; ");
      } else if (val !== undefined && val !== null && val !== "") {
        rowData[`dyn_${key}`] = String(val);
      } else {
        rowData[`dyn_${key}`] = "—";
      }
    });

    const row = worksheet.addRow(rowData);
    row.height = 22;
    row.alignment = { vertical: "middle" };
  });

  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: columns.length },
  };

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

