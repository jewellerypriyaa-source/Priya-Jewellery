import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// PUT /api/settings/password — Change Admin Password
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({
      where: { email: session.user.email },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin account not found" }, { status: 404 });
    }

    // Verify current password
    const passwordValid = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!passwordValid) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
    }

    // Hash and update to new password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { email: session.user.email },
      data: { passwordHash },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PUT /api/settings/password]", error);
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}
