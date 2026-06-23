import { createInsforgeServer } from "@/lib/insforge-server";

export class AuthError extends Error {
  name = "AuthError";

  constructor(
    message: string,
    public status: number = 401,
  ) {
    super(message);
  }
}

type InsforgeClient = Awaited<ReturnType<typeof createInsforgeServer>>;

export async function requireUser(): Promise<{
  user: NonNullable<
    Awaited<ReturnType<InsforgeClient["auth"]["getCurrentUser"]>>["data"]["user"]
  >;
  insforge: InsforgeClient;
}> {
  const insforge = await createInsforgeServer();

  const { data: authData, error: authError } =
    await insforge.auth.getCurrentUser();

  if (authError || !authData?.user) {
    throw new AuthError("Authentication required");
  }

  return { user: authData.user!, insforge };
}
