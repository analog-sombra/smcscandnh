"use server";
interface GetfileByIdPayload {
  id: number;
}

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";
import { department, file, file_type, village } from "@prisma/client";

const GetfileById = async (
  payload: GetfileByIdPayload
): Promise<
  ApiResponseType<
    | (file & {
        village: village | null;
        file_type: file_type | null;
        department: department | null;
      })
    | null
  >
> => {
  const functionname: string = GetfileById.name;

  try {
    const file_response = await prisma.file.findFirst({
      where: {
        id: payload.id,
        status: "ACTIVE",
      },
      include: {
        village: true,
        file_type: true,
        department: true,
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

export default GetfileById;
