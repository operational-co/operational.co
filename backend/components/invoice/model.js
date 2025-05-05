import prisma from "#lib/prisma.js";
import Model from "#lib/class-model.js";

class Invoice extends Model {
  async findByWorkspaceId(workspaceId) {
    const invoices = await prisma.$queryRawUnsafe(
      `
      SELECT *
      FROM Invoice
      WHERE workspaceId = ?
    `,
      workspaceId,
    );

    return invoices;
  }

  async findById(invoiceId) {
    const invoice = await prisma.$queryRaw`
    SELECT *
    FROM Invoice
    WHERE id = ${invoiceId}
    LIMIT 1
  `;

    return invoice[0] || null;
  }
}

export default new Invoice("invoice", prisma);
