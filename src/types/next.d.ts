import "next/server";
import type { User } from "@/types/user";

declare module "next/server" {
  interface NextRequest {
    user?: User;
  }
}
