/* eslint-disable no-undef */
import jwt from "jsonwebtoken";

class JWT {
  static sign(payload: any, expiresIn: string = '24h') {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    return token;
  }

  static verify(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  }
}

export default JWT;
