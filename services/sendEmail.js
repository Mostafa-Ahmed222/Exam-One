import nodeoutlook from "nodejs-nodemailer-outlook";

const sendMail = (dest, message) => {
  nodeoutlook.sendEmail({
    auth: {
      user: `${process.env.adminEmail}`,
      pass: `${process.env.adminPassword}`,
    },
    from: `${process.env.adminEmail}`,
    to: dest,
    subject: "Hey you, awesome!",
    html: message,
    text: "This is text version!",
    tls: {
      rejectUnauthorized: false,
    },
    onError: (e) => console.log(e),
    onSuccess: (i) => console.log(i),
  });
};
export default sendMail