import { NextResponse } from "next/server";
import { dataBranchType } from "@/app/Utils/branchType";

export function GET() {
  return NextResponse.json({ status: true, data: dataBranchType });
}
