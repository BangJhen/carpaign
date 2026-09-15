"use server";

import { db } from "@/db/db";
import { vehicles } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";

export type AddVehicleInput = {
  name: string;
  year: number;
  color: string;
  location: string;
  status?: "available" | "in_use";
  image?: string;
};

export async function addVehicle(input: AddVehicleInput) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user || session.user.role !== "dealership") {
    throw new Error("Unauthorized");
  }

  await db.insert(vehicles).values({
    dealerId: session.user.id,
    name: input.name,
    year: input.year,
    color: input.color,
    location: input.location,
    status: input.status || "available",
    image: input.image || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80",
  });

  revalidatePath("/dealer/inventory");
  revalidatePath("/dealer/dashboard");
  return { success: true };
}

export async function updateVehicle(id: string, input: Partial<AddVehicleInput>) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user || session.user.role !== "dealership") {
    throw new Error("Unauthorized");
  }

  const updateData: Record<string, any> = {};
  if (input.name !== undefined) updateData.name = input.name;
  if (input.year !== undefined) updateData.year = input.year;
  if (input.color !== undefined) updateData.color = input.color;
  if (input.location !== undefined) updateData.location = input.location;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.image !== undefined) updateData.image = input.image;

  await db
    .update(vehicles)
    .set(updateData)
    .where(and(eq(vehicles.id, id), eq(vehicles.dealerId, session.user.id)));

  revalidatePath("/dealer/inventory");
  revalidatePath("/dealer/dashboard");
  return { success: true };
}

export async function deleteVehicle(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user || session.user.role !== "dealership") {
    throw new Error("Unauthorized");
  }

  await db
    .delete(vehicles)
    .where(and(eq(vehicles.id, id), eq(vehicles.dealerId, session.user.id)));

  revalidatePath("/dealer/inventory");
  revalidatePath("/dealer/dashboard");
  return { success: true };
}
