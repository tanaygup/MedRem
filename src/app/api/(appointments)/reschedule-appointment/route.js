import { NextResponse } from 'next/server';
import { db } from '@/db';
import { appointments } from '@/db/schema';
import { eq } from 'drizzle-orm';


export async function PUT(request) {
  try {
    const data = await request.json();
    const {
      appointmentId,
      appointmentDate,
      appointmentTime,
      location,
      status,
      details,
    } = data;

    await db.update(appointments)
      .set({
        appointmentDate: appointmentDate,
        appointmentTime: appointmentTime,
        location:location,
        status:status,
        details:details,
      })
      .where(eq(appointments.appointmentId, Number(appointmentId)));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Error updating appointment:', err);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}
