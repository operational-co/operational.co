export default class CrudStore {
	constructor(opts, api) {
		this.state = {
			resources: [],
			resource: null,
		};
	}

	exportState() {
		return this.state;
	}

	exportGetters() {
		return {
			all(state) {
				if (state.isSingleton) {
					return state.resource;
				}
				return state.resources;
			},
			filtered(state) {
				if (state.isSingleton) {
					return state.resource;
				}
				return state.resources;
			},
			one(state) {
				if (state.isSingleton) {
					return state.resource;
				}
				return (id) => {
					let resource = null;
					for (let i = 0; i < state.resources.length; i++) {
						if (state.resources[i].id === id) {
							resource = state.resources[i];
							break;
						}
					}

					return resource;
				};
			},
		};
	}

	exportActions() {
		return {
			init: async function () {},

			/**
			 * Clears ALL current data, and loads fresh new data from the server
			 */
			refresh: async function () {
				this.resource = null;
				this.resources = [];

				console.log("NOT IMPLEMENTED");
			},

			/**
			 * Just a boilerplate. Integration is specific to the store
			 */
			consumePie: async function (pie = {}) {},
		};
	}
}
