import nodemailer from "nodemailer";
import { google } from "googleapis";
import path from "path";
import ejs from "ejs";
import { envVaraibles } from "../env/environmentVar";

const clientID = envVaraibles.CLIENT_ID;
const clientSecret = envVaraibles.CLIENT_SECRET;
const refreshToken = envVaraibles.REFRESH_TOKEN;
const clientRedirect = envVaraibles.CLIENT_REDIRECT;

const Oauth = new google.auth.OAuth2(clientID, clientSecret, clientRedirect);
Oauth.setCredentials({ refresh_token: refreshToken });

const sendMail = async (mailOptions: any) => {
  const accessToken = await Oauth.getAccessToken();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: envVaraibles.user,
      clientId: clientID,
      clientSecret: clientSecret,
      refreshToken: refreshToken,
      accessToken: accessToken?.toString(),
    },
    connectionTimeout: 10000, // Increase timeout to 10 seconds
  });

  await transporter.sendMail(mailOptions);
};

export const SendOtpCode = async (user: any) => {
  try {
    const buildFile = path.join(__dirname, "../view/AccountVerification.ejs");

    const data = await ejs.renderFile(buildFile, {
      firstname: user.firstname,
      email: user.email,
      OtpCode: user.OtpCode,
    });

    const mailOptions = {
      from: "E-shop <your-email@gmail.com>",
      to: user.email,
      subject: "Account Verification",
      html: data,
    };

    await sendMail(mailOptions);
    console.log("✅ OTP Sent Successfully!");
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    const buildFile = path.join(__dirname, "../view/AccountVerification.ejs");

    const data = await ejs.renderFile(buildFile, {
      firstname: user.firstname,
      email: user.email,
      OtpCode: user.OtpCode,
    });
    const mailOptions = {
      from: "E-shop <your-email@gmail.com>",
      to: user.email,
      subject: "Account Verification",
      html: data,
    };
    // Retry logic
    setTimeout(async () => {
      try {
        await sendMail(mailOptions);
        console.log("✅ OTP Sent Successfully on retry!");
      } catch (retryError) {
        console.error("❌ Error sending OTP on retry:", retryError);
        throw retryError;
      }
    }, 5000); // Retry after 5 seconds
  }
};


export const ForgetPasswordEmail = async (user: any) => {
  try {
    const accessToken = await Oauth.getAccessToken();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // ✅ Use host instead of service
      port: 465, // ✅ Secure SMTP port
      secure: true, // ✅ Must be true for port 465
      auth: {
        type: "OAuth2",
        user: envVaraibles.user,
        clientId: clientID,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        accessToken: accessToken?.toString(), // ✅ Ensure correct type
      },
    });

    const buildFile = path.join(__dirname, "../view/ForgetPassword.ejs");

    const data = await ejs.renderFile(buildFile, {
      firstname: user.firstname,
      OtpCode: user.OtpCode,
    });

    const mailOptions = {
      from: "E-shop <your-email@gmail.com>",
      to: user.email,
      subject: "Reset Password",
      html: data,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ OTP Sent Successfully!");
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    throw error;
  }
};
