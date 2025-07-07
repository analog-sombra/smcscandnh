"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { file_type } from "@prisma/client";

interface TypesFilePayload {}

const TypesFile = async (
  payload: TypesFilePayload
): Promise<ApiResponseType<file_type[] | null>> => {
  try {
    // get all types with file count of each types files

    const file_type = await prisma.file_type.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        file: {
          select: {
            id: true,
          },
        },
      },
    });

    let typessresponse: any = file_type;
    for (let i = 0; i < file_type.length; i++) {
      typessresponse[i].filecount = file_type[i].file.length;
      delete typessresponse[i].file;
    }

    return {
      status: true,
      data: typessresponse,
      message: "File data get successfully",
      functionname: "TypesFile",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "TypesFile",
    };
    return response;
  }
};

export default TypesFile;
