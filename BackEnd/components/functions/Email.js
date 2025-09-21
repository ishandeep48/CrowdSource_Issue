import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const MAIL = process.env.EMAIL;
const PASS = process.env.PASS;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAIL,
    pass: PASS,
  },
})

export async function sendEmail(to, subject, text){
    console.log(MAIL,PASS)
    const mailOptions = {
        from: MAIL,
        to: to,
        subject: subject,
        text: text,
    }
    try{
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    }catch(err){
        console.log('Error sending email:', err);
    }
}

export async function warnMail(sendTo,issueID){
    const subject = `Warning for post ID ${issueID}`;
    const text =`This to inform you that you have been warned for your recent post ID ${issueID} If you think this was a mistake then please contact the authority`;
    await sendEmail(sendTo,subject,text);
}

export async function banMail(sendTo,issueID){
    const subject = `Banned Account for post ID ${issueID}`;
    const text =`This to inform you that you have been banned for your recent post ID ${issueID} and repetitive offensice/spam actions .If you think this was a mistake then please contact the authority`;
    await sendEmail(sendTo,subject,text);
}

export async function forwardedMail(sendTo,issueID){
    const subject = `Issue ID ${issueID} has been forwarded`
    const text = `The recent Issue with ID ${issueID} has been forwarded by the department`
    await sendEmail(sendTo,subject,text);
}

export async function resolvedMail(sendTo,issueID){
    const subject = `Issue ID ${issueID} has been resolved`
    const text = `The Issue ID ${issueID} you posted/subscribed has been resolved by the department`
    await sendEmail(sendTo,subject,text);
}

export async function priorityChangeMail(sendTo , issueID , oldPriority , newPriority) {
    const subject =`Priority Changed for issueID ${issueID}`;
    const text = `The Priority of the Issue you Reported / Upvoted with ID ${issueID} has been changed from ${oldPriority} to ${newPriority}`;
    await sendEmail(sendTo,subject,text);
}