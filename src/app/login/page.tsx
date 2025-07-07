/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import login from "@/actions/user/login";
import {
  Fa6RegularEye,
  Fa6RegularEyeSlash,
  FluentKey16Filled,
  FluentPerson20Filled,
} from "@/components/icons";
import { LoginSchema } from "@/schemas/login";
import { Button, Input, InputRef } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";
import { getCookie, hasCookie } from "cookies-next/client";
import { Role } from "@prisma/client";

const LoginPage = () => {
  const router = useRouter();
  const username = useRef<InputRef>(null);
  const password = useRef<InputRef>(null);

  const [isShow, setShow] = useState<boolean>(false);

  const roletopage = (role: Role): string => {
    switch (role) {
      case Role.SYSTEM:
        return "/system";
      case Role.ADMIN:
        return "/admin";
      case Role.DEPARTMENT:
        return "/dashboard";
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
    const result = safeParse(LoginSchema, {
      username: username.current?.input?.value,
      password: password.current?.input?.value,
    });

    if (result.success) {
      const registerrespone = await login({
        password: result.output.password,
        username: result.output.username,
      });

      if (registerrespone.status && registerrespone.data) {
        const rolePath = roletopage(registerrespone.data.role as Role);
        router.push(rolePath);
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
      <div className="px-20 py-10 rounded-md min-h-screen w-full bg-[#f5f6f8] grid grid-cols-5 bg-gradient-to-tr from-[#2350f0] to-blue-400 relative">
        <div className="col-span-3 relative bg-gradient-to-tr from-[#2350f0] to-blue-400  grid place-items-center  rounded-l-md shadow-2xl">
          <div></div>
          <div>
            <p className="text-white text-3xl text-center leading-relaxed font-bold">
              SMC DNH
            </p>
            <p className="text-white text-sm text-center font-medium">
              Preserving the Past, Securing the Future
            </p>
          </div>
          <div className="w-[28rem] h-64 relative">
            <Image
              fill={true}
              src="/login.png"
              alt="error"
              className=" object-cover object-center rounded-sm"
            />
          </div>
          <div></div>
        </div>

        <div className="col-span-2 grid place-items-center bg-white  rounded-r-md relative">
          <div className="bg-[#5ca0f9] absolute left-0 top-10 rounded-r-md">
            <p className="text-white px-4 py-2 text-2xl">Welcome Back</p>
          </div>
          <div>
            <p className="text-center text-2xl font-semibold text-blue-500">
              Login to your Account
            </p>
            <div className="h-4"></div>
            <label htmlFor="username" className="text-gray-500 text-sm">
              Username
            </label>
            <div></div>
            <Input
              variant="outlined"
              placeholder="Username"
              id="password"
              name="password"
              ref={username}
              prefix={
                <FluentPerson20Filled className="text-gray-400 text-lg" />
              }
              className={"bg-white px-2"}
            />
            <label htmlFor="username" className="text-gray-500 text-sm mt-2">
              Password
            </label>
            <div></div>
            <div>
              <Input
                prefix={<FluentKey16Filled className="text-gray-400 text-lg" />}
                variant="outlined"
                placeholder="Password"
                suffix={
                  isShow ? (
                    <Fa6RegularEyeSlash onClick={() => setShow(false)} />
                  ) : (
                    <Fa6RegularEye onClick={() => setShow(true)} />
                  )
                }
                id="password"
                name="password"
                ref={password}
                className={"bg-white px-2"}
              />
            </div>

            <div className="h-4"></div>
            <div className="w-full">
              <Button className="w-full" type="primary" onClick={onSubmit}>
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
