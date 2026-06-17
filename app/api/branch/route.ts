export const dataBranchType = [
  { id: 1, valuename: 'branch', labelname: 'สาขา' },
  { id: 2, valuename: 'agency', labelname: 'หน่วย' },
  { id: 3, valuename: 'office', labelname: 'สำนักงาน' },
]

export async function GET() {
  return Response.json({ data: dataBranchType });
}
