/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Register from "@/actions/user/register";
import { RegisterSchema } from "@/schemas/register";
import { Role } from "@prisma/client";
import { Button, Input, InputRef } from "antd";
import { getCookie, hasCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";

export default function Home() {
  const router = useRouter();
  const username = useRef<InputRef>(null);
  const password = useRef<InputRef>(null);
  const repassword = useRef<InputRef>(null);

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

  useEffect(() => {
    if (hasCookie("id") && hasCookie("role")) {
      const role = getCookie("role");
      const rolePath = role ? roletopage(role as Role) : "/user";
      router.push(rolePath);
    }
  }, []);


  const onSubmit = async () => {
    const result = safeParse(RegisterSchema, {
      username: username.current?.input?.value,
      password: password.current?.input?.value,
      repassword: repassword.current?.input?.value,
    });

    if (result.success) {
      const registerrespone = await Register({
        password: result.output.password,
        username: result.output.username,
      });
      if (registerrespone.status) {
        router.push("/home");
      } else {
        toast.error(registerrespone.message);
      }
    } else {
      let errorMessage = "";
      if (result.issues[0].input) {
        errorMessage = result.issues[0].message;
      } else {
        errorMessage = result.issues[0].path![0].key + " is required";
      }
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div className="grid place-items-center min-h-screen bg-gray-100">
        <div className="w-72 border  bg-white p-4 rounded-md shadow">
          <h1 className="text-center text-2xl font-semibold">Register</h1>
          <p className="text-center text-sm mt-2">
            Register to start your sesstion
          </p>
          <div className="mt-4"></div>
          <label htmlFor="username">Username</label>
          <Input
            placeholder="username"
            id="password"
            name="password"
            ref={username}
          />
          <div className="h-4"></div>
          <label htmlFor="password">Password</label>
          <Input
            placeholder="password"
            id="password"
            name="password"
            ref={password}
          />
          <div className="h-4"></div>
          <label htmlFor="repassword">Re-Password</label>
          <Input
            placeholder="repassword"
            id="repassword"
            name="repassword"
            ref={repassword}
          />

          <Button type="primary" className="w-full mt-2" onClick={onSubmit}>
            Register
          </Button>
        </div>
      </div>
    </>
  );
}
