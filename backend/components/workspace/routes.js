import express from "express";
import multer from "multer";
import component from "./index.js";
import middlewareSchema from "#components/middleware/schema.js";
import middlewareAuth from "#components/middleware/auth.js";
import accessCheck from "#lib/access-check.js";

// Create a new router instance
const router = express.Router();

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

const activate = async (req, res) => {
  let form = {
    code: req.body.code,
  };
  if (!req.body.code) {
    return res.status(400).send({ message: `No code passed` });
  }

  try {
    let user = await component.activate(form);
    return res.status(201).send({
      ...user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      message: err,
    });
  }
};

const update = async (req, res) => {
  let form = {
    ...req.body,
    id: res.locals.user.primaryWorkspace,
  };

  // Access file data as buffer and get the file name
  // if (req.file) {
  // 	const fileBuffer = req.file.buffer;
  // 	const fileName = req.file.originalname;

  // 	// You can now use fileBuffer and fileName as needed
  // 	console.log("File name:", fileName);
  // 	console.log("File buffer:", fileBuffer);

  // 	let filePath = await File.saveImage(fileName, fileBuffer).catch((err) => {
  // 		console.log(err);
  // 	});

  // 	if (filePath) {
  // 		form.avatar = req.file.originalname;
  // 	}
  // }

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

const create = async (req, res) => {
  let form = {
    ...req.body,

    userId: res.locals.user.id,
  };

  try {
    const jwt = await component.create(form);

    res.header("x-token", jwt);

    return res.send({});
  } catch (err) {
    return res.status(400).send({
      message: err,
    });
  }
};

const invite = async (req, res) => {
  const form = {
    firstName: req.body.firstName || req.body.name,
    email: req.body.email,
  };

  const result = await accessCheck(req.body.email);

  if (!result.allow) {
    return res.status(400).send({
      message: `Email is invalid or not allowed`,
    });
  }

  try {
    const users = await component.invite(
      form,
      res.locals.user.id,
      res.locals.user.primaryWorkspace,
    );

    return res.status(201).send(users);
  } catch (err) {
    return res.status(400).send({
      message: err,
    });
  }
};

const removeUser = async (req, res) => {
  const form = {
    userId: req.body.userId,
  };

  try {
    const users = await component.removeUser(
      form,
      res.locals.user.id,
      res.locals.user.primaryWorkspace,
    );

    return res.status(201).send(users);
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      message: err,
    });
  }
};

const checkInvite = async (req, res) => {
  const form = {
    inviteCode: req.body.inviteCode,
  };

  await new Promise((r) => setTimeout(r, 200));

  try {
    const user = await component.checkInvite(form);

    if (user) {
      return res.status(200).send(user);
    } else {
      return res.status(404).send({
        message: "No user found with this invite code",
      });
    }
  } catch (err) {
    console.log(err);
    // mask errors
    return res.status(404).send({
      message: "No user found with this invite code",
    });
  }
};

const acceptInvite = async (req, res) => {
  const form = {
    inviteCode: req.body.inviteCode,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
  };

  await new Promise((r) => setTimeout(r, 200));

  try {
    const data = await component.acceptInvite(form);

    res.header("x-token", data.jwt);

    return res.send(data.user);
  } catch (err) {
    console.log(err);
    // mask errors
    return res.status(404).send({
      message: "No user found with this invite code",
    });
  }
};

const activateSchema = {
  schema: {
    id: {
      type: "number",
    },
    code: {
      type: "string",
    },
  },
};

const createSchema = {
  schema: {
    name: {
      type: "string",
    },
  },
};

const updateSchema = {
  name: {
    type: "string",
  },
  meta: {
    type: "object",
  },
};

const inviteSchema = {
  firstName: {
    type: "string",
  },
  email: {
    type: "string",
    format: "email",
  },
};

const removeUserSchema = {
  userId: {
    type: "number",
    convert: true,
  },
};

const checkInviteSchema = {
  inviteCode: {
    type: "string",
  },
};

const acceptInviteSchema = {
  inviteCode: {
    type: "string",
  },
  firstName: {
    type: "string",
  },
  lastName: {
    type: "string",
  },
  password: { type: "string", minLength: 8, maxLength: 50 },
};

router.post("/activate", middlewareSchema(activateSchema), activate);

router.post("/check-invite", middlewareSchema(checkInviteSchema), checkInvite);

router.post("/invite-user", middlewareAuth, middlewareSchema(inviteSchema), invite);
router.post("/accept-invite", middlewareSchema(acceptInviteSchema), acceptInvite);
router.post("/remove-user", middlewareAuth, middlewareSchema(removeUserSchema), removeUser);

router.post("/", middlewareAuth, middlewareSchema(createSchema), create);

router.put("/", middlewareAuth, upload.single("avatar"), middlewareSchema(updateSchema), update);

// Export the router
export default router;
