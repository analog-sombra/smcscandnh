"use server";
interface ResolveProblmeFilePayload {
  id: number;
  remark: string;
  created_by: number;
}

import { errorToString } from "@/utils/methods";
import { file } from "@prisma/client";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";

const ResolveProblmeFile = async (
  payload: ResolveProblmeFilePayload
): Promise<ApiResponseType<file | null>> => {
  const functionname: string = ResolveProblmeFile.name;

  try {
    const is_exist = await prisma.file.findFirst({
      where: {
        status: "ACTIVE",
        id: payload.id,
      },
      include: {
        filebase: true,
      },
    });

    if (!is_exist) {
      return createResponse({
        functionname: functionname,
        message: "File not found",
      });
    }

    const update_response = await prisma.file_base.update({
      where: {
        id: payload.id,
      },
      data: {
        // qc_start: new Date(),
        qc_end: new Date(),
        // qcid: payload.created_by,
      },
    });

    // const file_response = await prisma.problem_file.updateMany({
    //   where: {
    //     fileId: is_exist.id,
    //   },
    //   data: {
    //     remarks: payload.remark,
    //     status: "COMPLETED",
    //   },
    // });

    if (!update_response) {
      return createResponse({
        functionname: functionname,
        message: "File problem not updated",
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

export default ResolveProblmeFile;
