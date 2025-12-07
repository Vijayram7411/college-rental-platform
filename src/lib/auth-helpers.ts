import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Role = "USER" | "OWNER" | "ADMIN";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(roles: Role | Role[]) {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  const user = await requireUser();

  if (!allowedRoles.includes(user.role as Role)) {
    throw new Error("Forbidden");
  }

  return user;
}
