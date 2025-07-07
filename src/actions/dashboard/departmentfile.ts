"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { village } from "@prisma/client";

interface DepartmentFilePayload {}

const DepartmentFile = async (
  payload: DepartmentFilePayload
): Promise<ApiResponseType<village[] | null>> => {
  try {
    // get all village with file count of each village files

    const department = await prisma.department.findMany({
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

    let departmentsresponse: any = department;
    for (let i = 0; i < department.length; i++) {
      departmentsresponse[i].filecount = department[i].file.length;
      delete departmentsresponse[i].file;
    }

    return {
      status: true,
      data: departmentsresponse,
      message: "File data get successfully",
      functionname: "DepartmentFile",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "DepartmentFile",
    };
    return response;
  }
};

export default DepartmentFile;
