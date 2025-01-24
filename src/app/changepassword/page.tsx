"use client";

import ChangePassword from "@/actions/user/chnagepassword";
import { ChangepasswordSchema } from "@/schemas/chamgepassword";
import { Button, Input } from "antd";
import { getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";

export default function Home() {
  const router = useRouter();
  const [pasword, setPassword] = useState<string>("");
  const [repassword, setRePassword] = useState<string>("");

  const [isCahanging, setIsChanging] = useState<boolean>(false);

  const changePassword = async () => {
    setIsChanging(true);

    const result = safeParse(ChangepasswordSchema, {
      password: pasword,
      repassword: repassword,
    });

    if (result.success) {
      const passwordrespone = await ChangePassword({
        id: parseInt(getCookie("id") ?? "0"),
        password: result.output.password,
      });

      if (passwordrespone.status) {
        toast.success(passwordrespone.message);
        setPassword("");
        setRePassword("");
        router.back();
      } else {
        toast.error(passwordrespone.message);
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
    setIsChanging(false);
    return;
  };

  return (
    <>
      <div className="p-10 rounded-md min-h-screen w-full bg-[#f5f6f8] grid place-items-center">
        <div className="  bg-white rounded-r-md p-2 rounded shadow">
          <div>
            <div className="flex items-center gap-2 border-b border-gray-300">
              <h1 className="text-xl font-semibold  pb-2">Change Password</h1>
              <div className="grow"></div>
              <Button size="small" type="primary" onClick={() => router.back()}>
                Close
              </Button>
            </div>
            <div className="grid max-w-sm items-center gap-1 w-80">
              <div>
                <label htmlFor="password">Password</label>
                <Input
                  id="firstname"
                  type="text"
                  value={pasword}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="repassword">Re-Password</label>
                <Input
                  id="repassword"
                  type="text"
                  value={repassword}
                  onChange={(e) => setRePassword(e.target.value)}
                />
              </div>

              {isCahanging ? (
                <Button className=" text-center font-semibold text-white bg-black rounded-md block w-full ">
                  Changing Password...
                </Button>
              ) : (
                <Button
                  onClick={changePassword}
                  className="text-center font-semibold text-white bg-[#172e57] hover:bg-[#224688] rounded-md block w-full "
                >
                  Change Password
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
