// app/api/delete-appointment/route.js

import { NextResponse } from 'next/server'
import { db } from '@/db'                 
import { appointments } from '@/db/schema'     
import { eq } from 'drizzle-orm'

export async function DELETE(request) {
  try {
    const { id } = await request.json()
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing appointment id in body' },
        { status: 400 }
      )
    }

    const result = await db
      .delete(appointments)
      .where(eq(appointments.appointmentId, Number(id)))

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: `No appointment found with id ${id}` },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, id }, { status: 200 })
  } catch (error) {
    console.error('DELETE /api/delete-appointment error:', error)
    return NextResponse.json(
      { success: false, error: (error).message },
      { status: 500 }
    )
  }
}
