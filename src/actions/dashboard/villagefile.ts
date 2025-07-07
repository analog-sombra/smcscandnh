"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { village } from "@prisma/client";

interface VillagesFilePayload {}

const VillagesFile = async (
  payload: VillagesFilePayload
): Promise<ApiResponseType<village[] | null>> => {
  try {
    // get all village with file count of each village files

    const village = await prisma.village.findMany({
      include: {
        file: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    let villagesresponse: any = village;
    for (let i = 0; i < village.length; i++) {
      villagesresponse[i].filecount = village[i].file.length;
      delete villagesresponse[i].file;
    }

    return {
      status: true,
      data: villagesresponse,
      message: "File data get successfully",
      functionname: "VillagesFile",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "VillagesFile",
    };
    return response;
  }
};

export default VillagesFile;
