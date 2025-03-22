import config from "#lib/config.js";
import path from "path";
import fs from "fs";
import PdfPrinter from "pdfmake";
import moment from "moment";

const __dirname = path.resolve("");

class Pdf {
  http;
  printer;

  async setup() {
    let assetPath = path.join(__dirname, "public", "inter");

    var fonts = {
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

  async createInvoice(workspace, invoice) {
    let billingAddress = ``;
    let tax = ``;
    let companyName = workspace.companyName || workspace.admin.name;

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

    //let fileName = path.join(path.dirname(require.main.filename), 'invoice.json');
    let logoName = path.join(__dirname, "public", "logo.png");
    //let invoice = await fs.promises.readFile(fileName, 'utf-8');
    //invoice = JSON.parse(invoice);
    let printer = this.printer;

    let createDate = moment().format("DD-MM-YYYY");

    let invoiceName = `${workspace.id}-${createDate}-invoice.pdf`;

    let startDate = moment.unix(invoice.period_start);
    let endDate = moment.unix(invoice.period_end);
    let dateIssue = startDate.clone();

    startDate = startDate.format("Do MMM, YYYY");
    endDate = endDate.format("Do MMM, YYYY");
    dateIssue = dateIssue.format("Do MMM, YYYY");

    let address = `118 Kavanagh Street\nMelbourne\nVictoria 3006\nAustralia\n+61 422 025 973\nshash@operational.co`;

    let baseMargin = [0, 5, 0, 5];

    let total = invoice.total / 100;
    let subtotal = invoice.subtotal / 100;
    let amount_due = invoice.amount_due / 100;

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
              ["Invoice Number", `${invoice.number}`],
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
        // {
        // 	text: 'Pay Online',
        // 	link: `${invoice.invoice_pdf}`,
        // 	bold: true,
        // 	margin: [0, 20],
        // 	decoration: 'underline',
        // },
        {
          layout: "lightHorizontalLines",
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ["*", "*", "*", 100],

            body: [
              [
                { text: "Description", fontSize: 12, margin: baseMargin },
                { text: "Quantity", fontSize: 12, margin: baseMargin },
                { text: "Unit Price", fontSize: 12, margin: baseMargin },
                { text: "Amount", fontSize: 12, margin: baseMargin },
              ],
              [
                { text: `Operational logging\n${startDate} - ${endDate}`, margin: baseMargin },
                { text: "1", margin: baseMargin },
                { text: `$${amount_due}`, margin: baseMargin },
                { text: `$${subtotal}`, margin: baseMargin },
              ],
              [``, { text: "Subtotal", bold: true, margin: baseMargin }, ``, `$${subtotal}`],
              [``, { text: "Total", bold: true, margin: baseMargin }, ``, `$${total}`],
              [``, { text: "Amount Due", bold: true, margin: baseMargin }, ``, `$${total}`],
            ],
          },
        },
      ],
      defaultStyle: {
        font: "Inter",
        fontSize: 14,
      },
    };

    let options = {};

    let pdfDoc = printer.createPdfKitDocument(docDefinition, options);

    //let filePath = path.join(path.dirname(require.main.filename), invoiceName);

    let chunks = [];
    let result;

    let outputPath = path.join(__dirname, "public", "test.pdf");

    pdfDoc.pipe(fs.createWriteStream(outputPath));
    pdfDoc.end();
  }

  async createPdf(name) {
    let pdf = await this.createInvoice();
  }
}

export default new Pdf();
