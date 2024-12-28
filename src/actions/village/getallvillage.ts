"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";
import { village } from "@prisma/client";

const GetVillage = async (): Promise<ApiResponseType<village[] | null>> => {
  const functionname: string = GetVillage.name;
  try {
    const village = await prisma.village.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: "asc",
      },
    });

    if (!village) {
      return createResponse({
        functionname: functionname,
        message: "No village found",
      });
    }

    return createResponse({
      functionname: functionname,
      message: "Village found",
      data: village,
    });
  } catch (e) {
    return createResponse({
      message: errorToString(e),
      functionname: functionname,
    });
  }
};

export default GetVillage;
