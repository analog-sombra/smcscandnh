"use server";
import { ApiResponseType } from "@/models/response";
import { errorToString } from "@/utils/methods";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
interface LogoutPayload {}
const logout = async (
  payload: LogoutPayload
): Promise<ApiResponseType<null>> => {
  try {
    (await cookies()).delete("id");
    revalidatePath("/home");
    return {
      status: true,
      data: null,
      message: "User logout successfully",
      functionname: "logout",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "logout",
    };
    return response;
  }
};

export default logout;
