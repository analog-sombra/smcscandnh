"use server";
interface GetProblmefileByIdPayload {
  id: number;
}

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";
import { file, file_type, problem_file, village } from "@prisma/client";

const GetProblmefileById = async (
  payload: GetProblmefileByIdPayload
): Promise<
  ApiResponseType<
    | (file & {
        village: village | null;
        file_type: file_type | null;
        problem_file: problem_file[] | null;
      })
    | null
  >
> => {
  const functionname: string = GetProblmefileById.name;

  try {
    const file_response = await prisma.file.findFirst({
      where: {
        id: payload.id,
        status: "ACTIVE",
      },
      include: {
        problem_file: true,
        village: true,
        file_type: true,
      },
    });

    if (!file_response) {
      return createResponse({
        message: "No file found",
        functionname: functionname,
      });
    }

    return createResponse({
      message: "File found",
      functionname: functionname,
      data: file_response,
    });
  } catch (e) {
    return createResponse({
      message: errorToString(e),
      functionname: functionname,
    });
  }
};

export default GetProblmefileById;
