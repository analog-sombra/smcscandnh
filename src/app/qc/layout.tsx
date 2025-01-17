/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Logout from "@/actions/user/logout";
import { FluentPerson20Filled } from "@/components/icons";
import { Role } from "@prisma/client";
import { Button } from "antd";
import { getCookie, hasCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
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

  const logout = async () => {
    await Logout();
    router.replace("/login");
  };
  useEffect(() => {
    if (hasCookie("id") && hasCookie("role")) {
      const role = getCookie("role");

      if (role != Role.QC) {
        const rolePath = role ? roletopage(role as Role) : "/user";
        router.push(rolePath);
      }
    } else {
      router.push("/login");
    }
  }, []);

  return (
    <>
      <div className="bg-gray-100 w-full min-h-screen p-4">
        <div className="w-full md:mx-auto md:w-4/6 flex p-2 bg-white border gap-4 items-center rounded">
          <FluentPerson20Filled className="text-3xl text-gray-400" />

          <p>{getCookie("username")} (QC)</p>
          <div className="grow"></div>
          <Button size="small" type="primary" danger onClick={logout}>
            Logout
          </Button>
        </div>

        {children}
      </div>
    </>
  );
}
