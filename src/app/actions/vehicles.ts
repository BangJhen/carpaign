"use server";

import { db } from "@/db/db";
import { vehicles } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

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
    image: input.image || "https://picsum.photos/seed/default-car/400/240",
  });

  revalidatePath("/dealer/inventory");
  revalidatePath("/dealer/dashboard");
  return { success: true };
}
