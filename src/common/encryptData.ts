import * as Crypto from 'crypto';

// * 암호화(SHA256)
export const convertTextToSHA256 = (text: string): string => {
  const key = Crypto.scryptSync(process.env.DB_SHA256_PW, 'salt', 32);

  const iv = Buffer.from(process.env.DB_SHA256_IV);
  const ivString = iv.toString('hex').slice(0, 16);

  const cipher = Crypto.createCipheriv('aes-256-cbc', key, ivString);

  let encryptText: string = cipher.update(text, 'utf8', 'base64');
  encryptText += cipher.final('base64');

  return encryptText;
};

// * 복호화(SHA256)
export const convertSHA256ToText = (text: string): string => {
  const key = Crypto.scryptSync(process.env.DB_SHA256_PW, 'salt', 32);

  const iv = Buffer.from(process.env.DB_SHA256_IV);
  const ivString = iv.toString('hex').slice(0, 16);

  const decipher = Crypto.createDecipheriv('aes-256-cbc', key, ivString);
  let deCrypted: string = decipher.update(text, 'base64', 'utf-8');
  deCrypted += decipher.final('utf8');

  return deCrypted;
};
