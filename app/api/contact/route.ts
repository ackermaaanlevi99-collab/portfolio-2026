import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, service, message } = body ?? {};

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 });
    }

    // TODO: conecta aquí un proveedor de email real —Resend, SendGrid o Nodemailer—.
    // Ejemplo con Resend (npm install resend, y RESEND_API_KEY en .env.local):
    //
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'Sitio Web <onboarding@resend.dev>',
    //   to: 'tu-correo@gmail.com',
    //   subject: `Nuevo mensaje de ${name} — ${service}`,
    //   text: message,
    // });

    console.log('Nuevo mensaje de contacto:', { name, email, service, message });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'No se pudo procesar la solicitud.' }, { status: 500 });
  }
}
