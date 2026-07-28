export const prerender = false;
import nodemailer from 'nodemailer';

export const POST = async ({ request }) => {
  try {
    const data = await request.formData();
    const name = data.get('name');
    const email = data.get('email');
    const message = data.get('message');
    const privacy = data.get('privacy');
    const commercial = data.get('commercial');
    const honeypot = data.get('bot_field'); // simple honeypot anti-spam

    // Basic Validation
    if (!name || !email || !message || privacy !== 'on') {
      return new Response(JSON.stringify({ error: 'Missing required fields or privacy policy not accepted.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Anti-spam (if honeypot field is filled, ignore silently)
    if (honeypot) {
      return new Response(JSON.stringify({ success: true, message: 'Message sent.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create a Nodemailer transporter using SMTP
    // You must set these environment variables in your server or .env file
    const transporter = nodemailer.createTransport({
      host: import.meta.env.SMTP_HOST || 'smtp.example.com',
      port: import.meta.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: import.meta.env.SMTP_USER || 'info@incoltec.com',
        pass: import.meta.env.SMTP_PASS || 'your_password',
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"${name}" <${email}>`, // sender address
      to: import.meta.env.CONTACT_EMAIL || 'info@incoltec.com', // list of receivers
      subject: "New Contact Form Submission - Incoltec",
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nCommercial Comms Accepted: ${commercial === 'on' ? 'Yes' : 'No'}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong></p>
             <p>${message.replace(/\n/g, '<br/>')}</p>
             <p><strong>Commercial Comms Accepted:</strong> ${commercial === 'on' ? 'Yes' : 'No'}</p>`,
    });

    return new Response(JSON.stringify({ success: true, message: 'Message sent successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal server error while sending email.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
