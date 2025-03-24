/**
 * Base class Model
 * Add methods in here to make them available across all models
 */
class Model {
	name = "";
	prisma = null;
	include = {};

	constructor(name, prisma) {
		this.name = name;
		this.prisma = prisma;
		this.tableName = name;

		this.idField = "id";

		//this.include = {};

		this.client = this.prisma[this.tableName];
	}

	captureException(err) {
		console.log(err);
	}
}

export default Model;
