/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import { envConfig } from "../config/env";
import path from "path";
import ejs from "ejs";
import AppError from "../../errorHelper/appError";
import { StatusCodes } from "http-status-codes";

const transporter = nodemailer.createTransport({
  host: envConfig.EMAIL_SENDER.SMTP_HOST,
  secure: true,
  auth: {
    user: envConfig.EMAIL_SENDER.SMTP_USER,
    pass: envConfig.EMAIL_SENDER.SMTP_PASS,
  },
  port: Number(envConfig.EMAIL_SENDER.SMTP_PORT),
});

interface SendEmail {
  subject: string;
  to: string;
  templateName: string;
  templateData: Record<string, any>;
  attachment?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  subject,
  to,
  templateName,
  templateData,
  attachment,
}: SendEmail) => {
  try {
    const templatePath = path.resolve(
      process.cwd(),
      `src/app/template/${templateName}.ejs`,
    );

    const html = await ejs.renderFile(templatePath, templateData);

    const info = await transporter.sendMail({
      from: envConfig.EMAIL_SENDER.SMTP_FROM,
      to: to,
      subject: subject,
      html: html,
      attachments: attachment?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });
    console.log(`Email sent to ${to} : ${info.messageId}`);
  } catch (error: any) {
    console.log(error);
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to send email",
    );
  }
};
