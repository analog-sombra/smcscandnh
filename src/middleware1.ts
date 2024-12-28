import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const idCookie = request.cookies.get("id");
  const id: string | undefined = idCookie?.value.toString();

  const roleCookie = request.cookies.get("role");
  const role: string | undefined = roleCookie?.value.toString();

  const roletopage = (role: Role): string => {
    switch (role) {
      case Role.SYSTEM:
        return "/system";
      case Role.ADMIN:
        return "/admin";
      case Role.DEPARTMENT:
        return "/department";
      case Role.META:
        return "/meta";
      case Role.MOD:
        return "/mod";
      case Role.NEC:
        return "/nec";
      case Role.QC:
        return "/qc";
      case Role.SCAN:
        return "/scan";
      case Role.SUPERVISOR:
        return "/supervisor";
      case Role.VERIFY:
        return "/verify";
      default:
        return "/user";
    }
  };
  const rolePath = role ? roletopage(role as Role) : "/user";

  // Redirect authenticated users away from login/register to their role's page
  if (
    id &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/register"))
  ) {
    return NextResponse.redirect(new URL(rolePath || "/user", request.url));
  }
  //  else if (id && role && !request.nextUrl.pathname.startsWith(rolePath)) {
  //   // Restrict users to their role-specific paths
  //   return NextResponse.redirect(new URL(rolePath || "/user", request.url));
  // }

  return NextResponse.next();
}
