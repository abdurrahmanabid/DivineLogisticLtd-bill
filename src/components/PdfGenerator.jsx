import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";

if (pdfFonts?.pdfMake?.vfs) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
}

function formatMoney(value) {
  if (value === undefined || value === null) return "";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return String(value);
  }
  return numeric.toFixed(2);
}

function formatDisplayDate(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${value.slice(8, 10)}-${value.slice(5, 7)}-${value.slice(0, 4)}`;
  }
  return value;
}

export default async function generatePdf(data) {
  const {
    billNo,
    date,
    toName,
    address,
    containerInfo,
    beNo,
    blNo,
    beDate,
    assessableValue,
    charges,
    adjustments = [],
    subtotal,
    gTotal,
    balance,
    dues,
  } = data;

  const tableBody = [
    [
      { text: "SL.", bold: true, alignment: "center" },
      { text: "Details", bold: true },
      { text: "Amount", bold: true, alignment: "right" },
    ],
  ];

  charges.forEach((charge, index) => {
    tableBody.push([
      {
        text: charge.sl ?? String(index + 1).padStart(2, "0"),
        alignment: "center",
      },
      { text: charge.details || "" },
      { text: formatMoney(charge.amount ?? 0), alignment: "right" },
    ]);
  });

  tableBody.push([
    { text: "Total", colSpan: 2, alignment: "right", bold: true },
    {},
    { text: formatMoney(subtotal), alignment: "right", bold: true },
  ]);

  let nextSerial = charges.length + 1;
  const serial = () => String(nextSerial++).padStart(2, "0");

  const additionRows = adjustments.filter((row) => row.type === "addition");
  const deductionRows = adjustments.filter((row) => row.type === "deduction");

  additionRows.forEach((row) => {
    tableBody.push([
      { text: serial(), alignment: "center" },
      { text: row.label },
      { text: formatMoney(row.amount), alignment: "right" },
    ]);
  });

  tableBody.push([
    "",
    { text: "G. Total", alignment: "right", bold: true },
    { text: formatMoney(gTotal), alignment: "right", bold: true },
  ]);

  deductionRows.forEach((row, index) => {
    tableBody.push([
      "",
      { text: row.label, alignment: "right" },
      { text: formatMoney(row.amount), alignment: "right" },
    ]);

    if (index === 0) {
      tableBody.push([
        "",
        { text: "Balance", alignment: "right" },
        { text: formatMoney(balance), alignment: "right" },
      ]);
    }
  });

  tableBody.push([
    "",
    { text: "Dues", alignment: "right", bold: true },
    { text: formatMoney(dues), alignment: "right", bold: true },
  ]);

  const docDefinition = {
    pageSize: "A4",
    pageMargins: [40, 210, 40, 20],
    content: [
      { text: "BILL", style: "header" },
      {
        columns: [
          {
            width: "*",
            stack: [
              { text: "To", margin: [0, 0, 0, 4] },
              { text: toName, bold: true, margin: [0, 0, 0, 4] },
              ...(() => {
                const lastComma = address.lastIndexOf(",");
                if (lastComma === -1) {
                  return [{ text: address }];
                }
                const firstLine = `${address.slice(0, lastComma).trim()},`;
                const secondLine = address.slice(lastComma + 1).trim();
                return [{ text: firstLine }, { text: secondLine }];
              })(),
            ],
            margin: [0, 10, 0, 10],
          },
          {
            width: "auto",
            stack: [
              { text: `Bill NO. ${billNo}`, alignment: "right" },
              { text: `Date: ${formatDisplayDate(date)}`, alignment: "right" },
            ],
          },
        ],
      },
      { text: "\n" },
      {
        text: `Being the amount charges against ${containerInfo} under B/E NO. ${beNo} Dt. ${formatDisplayDate(
          beDate
        )} B/L NO. ${blNo} Assessable Value TK. ${assessableValue}`,
        alignment: "justify",
        margin: [0, 0, 0, 10],
      },
      { text: "\n" },
      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto"],
          body: tableBody,
        },
        layout: {
          fillColor(rowIndex) {
            return rowIndex === 0 ? "#eeeeee" : null;
          },
          hLineWidth(i, node) {
            if (i === 0 || i === node.table.body.length) {
              return 1;
            }
            return 0.5;
          },
          vLineWidth() {
            return 0.5;
          },
          hLineColor() {
            return "#444";
          },
          vLineColor() {
            return "#444";
          },
        },
      },
      { text: "\n" },
      {
        margin: [0, 70, 0, 0],
        stack: [
          { text: "Divine Logistic Ltd.", bold: true },
          { text: "" },
          { text: "Md. Saiful Islam" },
          { text: "Mob. 01719537893" },
        ],
      },
    ],
    styles: {
      header: {
        fontSize: 16,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 10],
      },
    },
    defaultStyle: {
      fontSize: 10,
    },
  };

  pdfMake.createPdf(docDefinition).download(`invoice_${billNo || "bill"}.pdf`);
}
