let validators = {
  maxLength: (value, params, message) => {
    if (value.length > params) {
      return message || `Input length should be less than ${params}`;
    }
    return;
  },
  minLength: (value, params, message) => {
    if (!value) {
      return;
    }
    if (typeof value === "number") {
      value += "";
    }

    if (value.length < params) {
      return message || `Input length should be more than ${params}`;
    }
    return;
  },
  required: (value, params, message) => {
    if (!value) {
      return message || `Input is required`;
    }
    if (typeof value === "string" && value.length === 0) {
      return message || `Input is required`;
    }
    return;
  },
  // Checks for a specific value which is passes in params
  isValue: (value, params, message) => {
    if (value === params) {
      return;
    }

    return message || `Value is required`;
  },
  // The inverse of the above validator
  isNotValue: (value, params, message) => {
    if (value !== params) {
      return;
    }

    return message || `Value is required`;
  },
  url: (value, params, message) => {
    if (!value) {
      return;
    }
    if (!value.includes(".")) {
      return message || "url is required";
    }
    return;
  },
  email: (value, params, message) => {
    if (!value) {
      return;
    }

    const reg = new RegExp("^[^@]+@[^@]+.[^@]+$");

    if (reg.test(value)) {
      return;
    }

    return message || "Needs a valid email";
  },
  numeric: (value, params, message) => {
    if (!value) {
      return;
    }

    const reg = new RegExp("^[0-9]+$");

    if (reg.test(value)) {
      return;
    }

    return message || "Numeric only";
  }
};

function validate(key, value, validation) {
  if (!validation) {
    return;
  }

  if (!validation.validations) {
    return;
  }

  if (typeof validation.validations !== "object") {
    return;
  }

  let errorMessage = "";
  let pass = true;

  for (const type in validation.validations) {
    if (!validators[type]) {
      console.warn(`Type ${type} doesn't exist in form error handler`);
      continue;
    }
    let validationObject = validation.validations[type];

    let params = validationObject.params || null;
    let message = validationObject.message || null;

    let res = validators[type](value, params, message);

    if (res) {
      errorMessage = res;
      pass = false;
      break;
    }
  }

  if (pass) {
    return;
  } else {
    return errorMessage;
  }
}

/**
 * Example input
 * values = {
 * name : 'shash'
 * }
 * schema = {
 * validations : {
 *  required  : {
 *    params : true
 *   }
 *  }
 * }
 * @param {*} values
 * @param {*} schema
 * @returns
 */
// function errorHandler(values, schema) {
//   let errors = {};

//   for (const p in values) {
//     let result = validate(p, values[p], schema[p]);

//     if (result) {
//       errors[p] = result;
//     }
//   }

//   return errors;
// }

function errorHandler(validations, value) {
  let message = true;

  for (const key in validations) {
    let temp = null;
    if (validators[key]) {
      temp = validators[key](value, validations[key].params, validations[key].message);

      if (typeof temp === "string") {
        message = temp;
      }
    }
  }

  if (typeof message !== "string") {
    message = true;
  }

  return message;
}

export default errorHandler;
