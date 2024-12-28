"use server";
import { ApiResponseType, createResponse } from "@/models/response";
import { errorToString } from "@/utils/methods";
import { cookies } from "next/headers";
const Logout = async (): Promise<ApiResponseType<null>> => {
  const functionname: string = Logout.name;
  try {
    const cookieStore = await cookies();
    cookieStore.delete("id");

    return createResponse({
      message: "User logout successfully",
      functionname: functionname,
    });
  } catch (e) {
    return createResponse({
      message: errorToString(e),
      functionname: functionname,
    });
  }
};

export default Logout;
