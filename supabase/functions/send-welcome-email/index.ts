import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

serve(async (req) => {
  const { email, name } = await req.json();

  const msgToUser = {
    to: email,
    from: 'noreply@nuveuu.com',
    subject: 'Welcome to nuveuu 🌸',
    html: `
      <h1 style="color:#db2777;">Welcome to nuveuu, ${name}!</h1>
      <p>We’re excited to have you here. Your profile is live and you're ready to explore everything nuveuu offers.</p>
      <p>Jump in, connect with creators, launch challenges, and get inspired.</p>
      <br />
      <p style="color:#aaa;">- The nuveuu team</p>
    `
  };

  const msgToMatt = {
    to: 'mattordeshook@gmail.com',
    from: 'noreply@nuveuu.com',
    subject: '🎉 New Profile Created on nuveuu',
    html: `
      <p><strong>${name}</strong> just created a profile!</p>
      <p>Email: ${email}</p>
    `
  };

  const resUser = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(msgToUser),
  });

  const resMatt = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(msgToMatt),
  });

  return new Response(JSON.stringify({
    success: true,
    userEmailStatus: resUser.status,
    adminEmailStatus: resMatt.status
  }), { status: 200 });
});
