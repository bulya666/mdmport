const nodemailer = require('nodemailer');

exports.sendMail = async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ status: 'error', message: 'Hiányzó mezők' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.rackhost.hu',
      port: 465,
      secure: true,
      auth: {
        user: 'mdmport@kemenesklima.hu',
        pass: 'mdmport2026'
      }
    });

    await transporter.sendMail({
      from: `"${name}" <mdmport@kemenesklima.hu>`,
      replyTo: email,
      to: 'mdmport@kemenesklima.hu',
      subject,
      text: `Név: ${name}\nE-mail: ${email}\n\nÜzenet:\n${message}`
    });

    res.json({ status: 'ok' });
  } catch (err) {
    console.error('SMTP hiba:', err);
    res.status(500).json({ status: 'error', message: 'Levélküldési hiba' });
  }
};