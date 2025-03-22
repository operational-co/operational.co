import bcrypt from "bcrypt";

async function hashPassword(password) {
  const hash = bcrypt.hash(password, 10);

  return hash;
}

export default hashPassword;
