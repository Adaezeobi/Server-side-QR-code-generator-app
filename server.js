const express = require('express');
const qrcode = require('qrcode');
const nodemailer = require('nodemailer');
const app = express();
const port = 3001;
  

const customers = [];

app.use(express.json());

app.post('/register', async (req, res) => {
   
  try {
    
    const customerId = customers.length + 1;
    const {name, email} = req.body
    console.log(name, email)

    // Create a QR code with the customer's data.
    const qrCodeData = JSON.stringify({ customerId,...req.body });
    console.log(qrCodeData)
    const qrCode = await qrcode.toDataURL(qrCodeData);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'adaeze.i.obiokoye@gmail.com',  
          pass: 'ayhglwwwzalsnmez'         
        }
      })
      
    
    customers.push({ customerId, qrCode,email });


    res.json({ qrCode });
    
    
    const mailOptions = {
        from: 'adaeze.i.obiokoye@gmail.com',
        to: email,  
        subject: 'QR Code for Registration',
       text: 'Thank you for registering! Please find your QR code attached.',
       attachments: [
          {
            filename: 'qrcode.png',
            content: qrCode.split(';base64,').pop(),
            encoding: 'base64'
          }
        ]
      };
 
 
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ qrCode });
    }
  });
   
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
