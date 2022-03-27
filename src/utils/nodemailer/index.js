const nodemailer = require("nodemailer")

/**
  host: "qreativeweb.solutions",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'fos@qreativeweb.solutions',
    pass: '123#Difisil'
  }
 */

class Nodemailer {

  constructor(host, port, auth) {
    this.host = host 
    this.port = port
    this.auth = auth
  
    this.transporter = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      secure: true,
      auth: this.auth,
    })
  }

  sendEmail(data) {    
    return this.transporter.sendMail({
      from: data.from,
      to: data.to,
      subject: data.subject,
      html: data.html
    })
  }
}

module.exports = {
  Nodemailer
}