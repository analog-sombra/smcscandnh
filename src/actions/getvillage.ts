"use server";
interface GetVillagePayload {}

import { errorToString } from "@/utils/methods";
import prisma from "../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { village } from "@prisma/client";

const getVillage = async (
  payload: GetVillagePayload
): Promise<ApiResponseType<village[] | null>> => {
  try {
    const village = await prisma.village.findMany({
      orderBy: {
        name: "asc",
      },
    });

    if (!village)
      return {
        status: false,
        data: null,
        message: "Something want wrong. Please try again.",
        functionname: "getVillage",
      };

    return {
      status: true,
      data: village,
      message: "Village type get successfully",
      functionname: "getVillage",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "getVillage",
    };
    return response;
  }
};

export default getVillage;
