import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { createClient } from '@/lib/supabase/server'

export async function generateCertificate({
  studentId,
  studentName,
  courseId,
  courseTitle,
}: {
  studentId: string
  studentName: string
  courseId: string
  courseTitle: string
}) {
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('certificates')
    .select('id, certificate_url')
    .eq('student_id', studentId)
    .eq('course_id', courseId)
    .maybeSingle()

  if (existing) return existing

  const { data: certRow, error: insertError } = await supabase
    .from('certificates')
    .insert({ student_id: studentId, course_id: courseId })
    .select()
    .single()

  if (insertError || !certRow) return null

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([842, 595])

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const brandGreen = rgb(0.02, 0.4, 0.35)
  const gold = rgb(0.96, 0.62, 0.04)

  page.drawRectangle({
    x: 20,
    y: 20,
    width: 802,
    height: 555,
    borderColor: brandGreen,
    borderWidth: 3,
  })
  page.drawRectangle({
    x: 32,
    y: 32,
    width: 778,
    height: 531,
    borderColor: gold,
    borderWidth: 1,
  })

  page.drawText('M.S SULTAN ACADEMY', {
    x: 842 / 2 - font.widthOfTextAtSize('M.S SULTAN ACADEMY', 20) / 2,
    y: 480,
    size: 20,
    font,
    color: brandGreen,
  })

  page.drawText('CERTIFICATE OF COMPLETION', {
    x: 842 / 2 - font.widthOfTextAtSize('CERTIFICATE OF COMPLETION', 28) / 2,
    y: 420,
    size: 28,
    font,
    color: rgb(0.1, 0.1, 0.1),
  })

  page.drawText('This certifies that', {
    x: 842 / 2 - regularFont.widthOfTextAtSize('This certifies that', 14) / 2,
    y: 370,
    size: 14,
    font: regularFont,
    color: rgb(0.3, 0.3, 0.3),
  })

  page.drawText(studentName, {
    x: 842 / 2 - font.widthOfTextAtSize(studentName, 32) / 2,
    y: 325,
    size: 32,
    font,
    color: brandGreen,
  })

  page.drawText('has successfully completed the course', {
    x:
      842 / 2 -
      regularFont.widthOfTextAtSize('has successfully completed the course', 14) / 2,
    y: 285,
    size: 14,
    font: regularFont,
    color: rgb(0.3, 0.3, 0.3),
  })

  page.drawText(courseTitle, {
    x: 842 / 2 - font.widthOfTextAtSize(courseTitle, 22) / 2,
    y: 245,
    size: 22,
    font,
    color: rgb(0.1, 0.1, 0.1),
  })

  const issueDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  page.drawText(`Issued on ${issueDate}`, {
    x: 100,
    y: 90,
    size: 11,
    font: regularFont,
    color: rgb(0.4, 0.4, 0.4),
  })

  page.drawText(`Certificate ID: ${certRow.id}`, {
    x: 842 - 100 - regularFont.widthOfTextAtSize(`Certificate ID: ${certRow.id}`, 10),
    y: 90,
    size: 10,
    font: regularFont,
    color: rgb(0.4, 0.4, 0.4),
  })

  const pdfBytes = await pdfDoc.save()

  const filePath = `${certRow.id}.pdf`
  const { error: uploadError } = await supabase.storage
    .from('certificates')
    .upload(filePath, pdfBytes, { contentType: 'application/pdf', upsert: true })

  if (uploadError) return null

  const { data: urlData } = supabase.storage.from('certificates').getPublicUrl(filePath)

  await supabase
    .from('certificates')
    .update({ certificate_url: urlData.publicUrl })
    .eq('id', certRow.id)

  return { id: certRow.id, certificate_url: urlData.publicUrl }
}
