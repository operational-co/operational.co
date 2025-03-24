import prisma from "#lib/prisma.js";

const component = {
  async find(params) {
    console.time('Start');
    const widgets = await prisma.widget.findMany({
      where: {
        workspaceId: params.workspaceId,
      },
      include: {
        widgetCache: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });
    console.timeEnd('Start');
    return widgets;
  },
};

export default component;
