import config from "#lib/config.js";
import path from "path";
import fs from "fs";
import PdfPrinter from "pdfmake";
import moment from "moment";

const __dirname = path.resolve("");

class Pdf {
  printer;

  async setup() {
    let assetPath = path.join(__dirname, "public", "inter");

    let fonts = {
      Inter: {
        normal: `${assetPath}/Inter-Regular.otf`,
        bold: `${assetPath}/Inter-SemiBold.otf`,
        italics: `${assetPath}/Inter-Italic.otf`,
        bolditalics: `${assetPath}/Inter-SemiBoldItalic.otf`,
      },
      Courier: {
        normal: "Courier",
        bold: "Courier-Bold",
        italics: "Courier-Oblique",
        bolditalics: "Courier-BoldOblique",
      },
      Helvetica: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique",
      },
      Times: {
        normal: "Times-Roman",
        bold: "Times-Bold",
        italics: "Times-Italic",
        bolditalics: "Times-BoldItalic",
      },
      Symbol: {
        normal: "Symbol",
      },
      ZapfDingbats: {
        normal: "ZapfDingbats",
      },
    };

    this.printer = new PdfPrinter(fonts);
  }

  async test() {
    return true;
  }

  async getBase64Image(filePath) {
    const fileData = await fs.promises.readFile(filePath);
    return fileData.toString("base64");
  }

  async createInvoice(workspace, invoice, res) {
    let billingAddress = ``;
    let tax = ``;
    let companyName = workspace.name || workspace.admin.firstName;

    if (!workspace.address) {
      billingAddress = ``;
    } else {
      billingAddress = workspace.address.autocompleteText.split(",").join(`,\n`);
      if (workspace.address.postal_code) {
        billingAddress = `${billingAddress}\n${workspace.address.postal_code}`;
      }
    }

    if (workspace.taxId && workspace.taxType) {
      tax = `${workspace.taxType} ${workspace.taxId}`;
    }

    let logoName = path.join(__dirname, "public", "logo.png");

    let printer = this.printer;

    let invoiceName = `${invoice.code}.pdf`;

    let startDate = moment(invoice.periodStart);
    let endDate = moment(invoice.periodEnd);
    let dateIssue = moment(invoice.createdAt);

    startDate = startDate.format("Do MMM, YYYY");
    endDate = endDate.format("Do MMM, YYYY");
    dateIssue = dateIssue.format("Do MMM, YYYY");

    let address = `118 Kavanagh Street\nMelbourne\nVictoria 3006\nAustralia\n+61 422 025 973\nshash@operational.co`;

    let baseMargin = [0, 5, 0, 5];

    let total = invoice.total;
    let subtotal = invoice.subTotal;
    let amount_due = invoice.total;

    let lineItems = invoice.lineItems.map((item) => {
      return [
        {
          text: `${item.name}\n${item.description}\n${item.quantity}`,
        },
        { text: item.quantity, margin: baseMargin },
        {
          text: `${item.amount}`,
        },
      ];
    });

    let body = [
      [
        { text: "Description", fontSize: 12, margin: baseMargin },
        { text: "Quantity", fontSize: 12, margin: baseMargin },
        { text: "Amount", fontSize: 12, margin: baseMargin },
      ],
      ...lineItems,
      [``, { text: "Subtotal", bold: true, margin: baseMargin }, `$${subtotal}`],
      [``, { text: "Total", bold: true, margin: baseMargin }, `$${total}`],
      [``, { text: "Amount Due", bold: true, margin: baseMargin }, `$${total}`],
    ];

    let docDefinition = {
      pageSize: "A4",
      content: [
        {
          layout: "noBorders",
          table: {
            widths: ["*", "*"],
            body: [
              [
                {
                  text: `Operational`,
                },
                {
                  text: "",
                },
              ],
              [
                {
                  text: `Invoice`,
                  fontSize: 20,
                  bold: true,
                },

                {
                  alignment: "right",
                  image: logoName,
                  width: 64,
                  height: 64,
                },
              ],
            ],
          },
        },
        {
          margin: [0, 40, 0, 0],
          layout: "noBorders",
          table: {
            widths: ["auto", "auto"],
            body: [
              ["Invoice code", `${invoice.code}`],
              ["Date of issue", dateIssue],
              ["Date due", endDate],
            ],
          },
        },
        {
          margin: [0, 40, 0, 0],
          columns: [
            [
              {
                width: `40%`,
                text: `Operational`,
                bold: true,
              },
              {
                width: `40%`,
                text: `${address}`,
              },
            ],
            [
              {
                width: `40%`,
                text: "Bill to",
                bold: true,
              },
              {
                width: `40%`,
                text: `${companyName}`,
              },
              {
                width: `40%`,
                text: billingAddress,
              },
              {
                width: `40%`,
                text: workspace.admin.email,
              },
              {
                width: `40%`,
                text: tax,
              },
            ],
          ],
        },
        {
          margin: [0, 20, 0, 20],
          text: `$${amount_due} due ${endDate}`,
          bold: true,
          fontSize: 18,
        },
        {
          layout: "lightHorizontalLines",
          table: {
            headerRows: 1,
            widths: ["*", 80, 80],

            body: body,
          },
        },
      ],
      defaultStyle: {
        font: "Inter",
        fontSize: 14,
        color: "#000000",
      },
    };

    let options = {};

    let pdfDoc = printer.createPdfKitDocument(docDefinition, options);

    const savePath = path.join(__dirname, invoiceName);

    let chunks = [];
    let result;

    res.setHeader("Content-Disposition", `attachment; filename="${invoiceName}.pdf"`);
    res.contentType("application/pdf");

    // Pipe PDF directly to HTTP response
    pdfDoc.pipe(res);

    // End the PDF stream
    pdfDoc.end();
  }

  async createPdf(name) {
    let pdf = await this.createInvoice();
  }
}

export default new Pdf();
