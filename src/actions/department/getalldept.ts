"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";
import { department } from "@prisma/client";

const GetAllDepartment = async (): Promise<
  ApiResponseType<department[] | null>
> => {
  const functionname: string = GetAllDepartment.name;
  try {
    const department = await prisma.department.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: "asc",
      },
    });

    if (!department) {
      return createResponse({
        functionname: functionname,
        message: "No department found",
      });
    }

    return createResponse({
      functionname: functionname,
      message: "department found",
      data: department,
    });
  } catch (e) {
    return createResponse({
      message: errorToString(e),
      functionname: functionname,
    });
  }
};

export default GetAllDepartment;
