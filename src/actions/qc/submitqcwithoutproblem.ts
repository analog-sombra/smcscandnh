"use server";
interface SubmitQcFileWithoutProblemPayload {
  id: number;
  created_by: number;
}

import { errorToString } from "@/utils/methods";
import { file } from "@prisma/client";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";

const SubmitQcFileWithoutProblem = async (
  payload: SubmitQcFileWithoutProblemPayload
): Promise<ApiResponseType<file | null>> => {
  const functionname: string = SubmitQcFileWithoutProblem.name;

  try {
    const is_exist = await prisma.file.findFirst({
      where: {
        status: "ACTIVE",
        id: payload.id,
      },
    });

    if (!is_exist) {
      return createResponse({
        functionname: functionname,
        message: "File not found",
      });
    }

    const update_file_base = await prisma.file_base.update({
      where: {
        id: payload.id,
      },
      data: {
        qc_end: new Date(),
        updatedById: payload.created_by,
      },
    });

    if (!update_file_base) {
      return createResponse({
        message: "Failed to update files.",
        functionname: functionname,
      });
    }

    return createResponse({
      message: "Files updated successfully.",
      functionname: functionname,
      data: is_exist,
    });
  } catch (e) {
    return createResponse({
      message: errorToString(e),
      functionname: functionname,
    });
  }
};

export default SubmitQcFileWithoutProblem;
