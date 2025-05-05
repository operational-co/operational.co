import express from "express";

import component from "./index.js";
import middlewareSchema from "#components/middleware/schema.js";
import middlewareAuth from "#components/middleware/auth.js";
import middlewareAccess from "#components/middleware/access.js";
import model from "./model.js";
import Storage from "#services/storage/index.js";

import multer from "multer";
import path from "path";
import config from "#lib/config.js";

const __dirname = path.resolve("");

const fileFilter = (req, file, cb) => {
  // Check the file type
  const mimeType = file.mimetype;
  if (mimeType === "image/jpeg" || mimeType === "image/png") {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only .jpeg and .png files are allowed"), false); // Reject file
  }
};

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

async function emailValidation(email) {
  // let splits = email.split("@");

  // let name = splits[0];

  // let domain = splits[1];

  // let testEmail = config.email.TEST_EMAIL;

  // if (testEmail && domain === testEmail) {
  // 	let tempName = testEmail.split(".")[0];
  // 	tempName = tempName.split("-")[0];
  // 	tempName = `${tempName}.com`;

  // 	return `${name}@${tempName}`;
  // }

  // check for malicious users

  return email;
}

// Create a new router instance
const router = express.Router();

const login = async (req, res) => {
  // see if user can login

  const form = {
    email: req.body.email,
    password: req.body.password,
    userAgent: req.body.userAgent,
  };

  let data = null;

  try {
    data = await component.login(form);
  } catch (err) {
    console.log(err);
    return res.status(401).send({
      message: err,
    });
  }

  res.header("x-token", data.jwt);

  return res.send({
    ...data.user,
  });
};

const signup = async (req, res) => {
  let data = null;

  let email = req.body.email || null;

  if (!email) {
    res.status(401);
    return {
      message: "No email found",
    };
  }

  let newEmail = await emailValidation(email).catch((err) => {});

  if (!newEmail) {
    res.status(401);
    return res.send({ message: "Your email seems to be invalid" });
  }

  req.body.email = newEmail;

  let form = {
    ...req.body,
  };

  try {
    data = await component.signup(form);
  } catch (err) {
    console.log(err);
    res.status(401);
    return res.send({ message: err });
  }

  res.header("x-token", data.jwt);

  return res.status(201).send({
    ...data.user,
  });
};

const headlessLogin = async (req, res) => {
  if (res.locals.user) {
    const pie = await model.getPie(res.locals.user.id);
    res.status(200);
    res.send(pie);
  } else {
    res.status(401);
    res.send("Unauthorized");
  }
};

const logout = async (req, res) => {
  if (res.locals.user) {
    const authorizationHeader = req.headers.authorization;

    const [bearer, token] = authorizationHeader.split(" ");

    await component.logout(token);

    return res.status(200).send("Logged out");
  } else {
    return res.status(401).send("Unauthorized");
  }
};

const switchWorkspace = async (req, res) => {
  const newWorkspace = req.params.id;

  const sid = res.locals.sid;

  let jwt = await component.switchWorkspace(res.locals.user, newWorkspace, sid);

  res.header("x-token", jwt);

  return res.send({});
};

const update = async (req, res) => {
  let form = {
    ...req.body,
    id: res.locals.user.id,
    workspaceId: res.locals.user.primaryWorkspace,
  };

  // Access file data as buffer and get the file name
  if (req.file) {
    const existingUser = await model.findById(res.locals.user.id);

    console.log(existingUser);
    if (existingUser.avatar) {
      //remove existing avatar
      try {
        await Storage.deleteFile(existingUser.avatar, "uploads");
      } catch (err) {
        console.log(err);
      }
    }
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;

    let filePath = await Storage.upload(fileBuffer, fileName, "uploads").catch((err) => {
      console.log(err);
    });

    if (filePath) {
      form.avatar = req.file.originalname;
    }
  }

  let data = null;

  try {
    data = await component.update(form);
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      message: err,
    });
  }

  return res.status(201).send({
    ...data,
  });
};

const updatePassword = async (req, res) => {
  let form = {
    id: res.locals.user.id,
    ...req.body,
  };

  let data = null;

  try {
    data = await component.updatePassword(form, reply.locals.user);
  } catch (err) {
    return res.status(401).send({
      message: err,
    });
  }

  return res.status(201).send({
    ...data,
  });
};

const updateEmail = async (req, res) => {
  let form = {
    id: res.locals.user.id,
    ...req.body,
  };

  let data = null;

  try {
    data = await component.updateEmail(form, reply.locals.user);
  } catch (err) {
    return res.status(401).send({
      message: err,
    });
  }

  return res.status(201).send({
    ...data,
  });
};

const createIntent = async (req, res) => {
  try {
    const data = await component.createIntent(res.locals.user);
    return res.status(201).send(data);
  } catch (err) {
    console.log(err);
    return res.status(401).send({
      message: err,
    });
  }
};

const getBillingData = async (req, res) => {
  try {
    const billingData = await component.getBillingData(res.locals.user);
    if (billingData) {
      return res.status(200).send(billingData);
    } else {
      return res.status(401).send({
        message: `No customerId`,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(401).send({
      message: err,
    });
  }
};

const cancelSubscription = async (req, res) => {
  try {
    const setupIntents = await component.cancelSubscription(res.locals.user);
    return res.status(200).send(setupIntents);
  } catch (err) {
    console.log(err);
    return res.status(401).send({
      message: err,
    });
  }
};

const demoLogin = async (req, res) => {
  let data = null;

  try {
    data = await component.demoLogin(req.body);
  } catch (err) {
    console.log(err);
    return res.status(401).send({
      message: err,
    });
  }

  res.header("x-token", data.jwt);

  return res.send({
    ...data.user,
  });
};

const setup = async (req, res) => {
  let data = null;

  await new Promise((r) => setTimeout(r, 3000));

  try {
    data = await component.setup(req.body);
  } catch (err) {
    console.log(err);
    return res.status(401).send({
      message: err,
    });
  }

  res.header("x-token", data.jwt);

  return res.send({
    ...data.user,
  });
};

const loginSchema = {
  schema: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 8, maxLength: 50 },
    userAgent: {
      type: "string",
      optional: true,
    },
  },
};

const signupSchema = {
  schema: {
    firstName: {
      type: "string",
    },
    lastName: {
      type: "string",
    },
    companyUrl: {
      type: "string",
    },
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 8, maxLength: 50 },
    meta: {
      type: "object",
    },
  },
};

const updatePasswordSchema = {
  currentPassword: { type: "string", minLength: 8 },
  password1: { type: "string", minLength: 8 },
  password2: { type: "string", minLength: 8 },
};

const updateEmailSchema = {
  email: { type: "string", minLength: 4 },
};

const updateSchema = {
  notify: {
    type: "boolean",
    default: false,
  },
  firstName: {
    type: "string",
  },
  lastName: {
    type: "string",
  },
  onboardingStep: {
    type: "string",
  },
  avatar: {
    type: "file",
  },
};

const demoLoginSchema = {
  name: {
    type: "string",
    default: "",
  },
};

const setupSchema = {
  firstName: {
    type: "string",
  },
  lastName: {
    type: "string",
  },
  email: {
    type: "string",
    format: "email",
  },
  password: {
    type: "string",
    minLength: 8,
    maxLength: 50,
  },
  projectName: {
    type: "string",
    minLength: 4,
  },
};

router.post("/setup", middlewareSchema(setupSchema), setup);
router.post("/demo-login", middlewareSchema(demoLoginSchema), demoLogin);
router.post("/signup", middlewareSchema(signupSchema), middlewareAccess, signup);
router.post("/login", middlewareSchema(loginSchema), middlewareAccess, login);
router.post("/headless-login", middlewareAuth, headlessLogin);
router.put("/password", middlewareAuth, middlewareSchema(updatePasswordSchema), updatePassword);
router.put("/email", middlewareAuth, middlewareSchema(updateEmailSchema), updateEmail);
router.put("/", middlewareAuth, upload.single("avatar"), middlewareSchema(updateSchema), update);

// Billing routes
router.post("/create-intent", middlewareAuth, createIntent);
router.post("/get-billing-data", middlewareAuth, getBillingData);
router.post("/cancel-subscription", middlewareAuth, cancelSubscription);

router.post("/switch-workspace/:id", middlewareAuth, switchWorkspace);
router.post("/logout", middlewareAuth, logout);

// Export the router
export default router;
