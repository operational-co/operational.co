import bcrypt from "bcrypt";

async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

export default comparePassword;
