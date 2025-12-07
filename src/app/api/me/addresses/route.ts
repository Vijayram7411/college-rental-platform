import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import {
  createAddressSchema,
  updateAddressSchema,
  deleteAddressSchema,
  setDefaultAddressSchema,
} from "@/lib/validation";

export async function GET() {
  const user = await requireUser();

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
  });

  return NextResponse.json(addresses);
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const parsed = createAddressSchema.parse(body);

    const hasDefault = await prisma.address.findFirst({
      where: { userId: user.id, isDefault: true },
    });

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        line1: parsed.line1,
        line2: parsed.line2 ?? null,
        city: parsed.city,
        state: parsed.state,
        postalCode: parsed.postalCode,
        country: parsed.country,
        isDefault: !hasDefault,
      },
    });

    return NextResponse.json(address, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error in /api/me/addresses (POST)", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const parsed = updateAddressSchema.parse(body);

    const existing = await prisma.address.findUnique({
      where: { id: parsed.id },
    });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { id, ...rest } = parsed;

    const address = await prisma.address.update({
      where: { id },
      data: {
        line1: rest.line1 ?? undefined,
        line2: rest.line2 ?? undefined,
        city: rest.city ?? undefined,
        state: rest.state ?? undefined,
        postalCode: rest.postalCode ?? undefined,
        country: rest.country ?? undefined,
      },
    });

    return NextResponse.json(address);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error in /api/me/addresses (PATCH)", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const parsed = deleteAddressSchema.parse(body);

    const existing = await prisma.address.findUnique({
      where: { id: parsed.id },
    });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.address.delete({ where: { id: parsed.id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error in /api/me/addresses (DELETE)", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  // Set default address
  try {
    const user = await requireUser();
    const body = await request.json();
    const parsed = setDefaultAddressSchema.parse(body);

    const existing = await prisma.address.findUnique({
      where: { id: parsed.id },
    });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.address.updateMany({
      where: { userId: user.id },
      data: { isDefault: false },
    });

    const updated = await prisma.address.update({
      where: { id: parsed.id },
      data: { isDefault: true },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error in /api/me/addresses (PUT)", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
