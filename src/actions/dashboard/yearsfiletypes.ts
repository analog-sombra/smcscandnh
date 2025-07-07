"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType } from "@/models/response";

interface YearsFileTypePayload {}

const YearsFileType = async (
  payload: YearsFileTypePayload
): Promise<ApiResponseType<any | null>> => {
  try {
    const file = await prisma.file.findMany({
      where: {
        deletedAt: null,
      },
    });

    if (!file) {
      return {
        status: false,
        data: null,
        message: "No data found",
        functionname: "YearsFileType",
      };
    }

    interface yearfilecount {
      year: number;
      filecount: number;
    }
    let years: yearfilecount[] = [];

    for (let i = 0; i < file.length; i++) {
      let yearindex = years.findIndex(
        (x) => x.year === parseInt(file[i].year ?? "0")
      );
      if (yearindex === -1) {
        years.push({
          year: parseInt(file[i].year ?? "0") ?? 0,
          filecount: 1,
        });
      } else {
        years[yearindex].filecount++;
      }
    }

    // short accourding to file count
    years.sort((a, b) => b.filecount - a.filecount);

    // take only top 15
    years = years.slice(0, 15);

    // sort accourding to year
    years.sort((a, b) => a.year - b.year);

    const filetype = await prisma.file_type.findMany({
      where: {
        deletedAt: null,
      },
    });

    if (!filetype) {
      return {
        status: false,
        data: null,
        message: "No data found",
        functionname: "YearsFileType",
      };
    }

    interface filetypelist {
      id: number;
      name: string;
      filecount: number;
    }
    let filetypelist: filetypelist[] = [];

    for (let i = 0; i < filetype.length; i++) {
      let filecount = 0;
      for (let j = 0; j < file.length; j++) {
        if (filetype[i].id === file[j].file_typeId) {
          filecount++;
        }
      }

      filetypelist.push({
        id: filetype[i].id,
        name: filetype[i].name,
        filecount: filecount,
      });
    }

    // short accourding to file count
    filetypelist.sort((a, b) => b.filecount - a.filecount);

    // take only top 5

    filetypelist = filetypelist.slice(0, 5);

    let year_filetype: any[] = [];

    // now year wise file type count
    for (let i = 0; i < years.length; i++) {
      let year = years[i].year;
      let filetypelistyearwise: any[] = [];
      for (let j = 0; j < filetypelist.length; j++) {
        let filecount = 0;
        for (let k = 0; k < file.length; k++) {
          if (
            parseInt(file[i].year ?? "0") === year &&
            file[k].file_typeId === filetypelist[j].id
          ) {
            filecount++;
          }
        }
        filetypelistyearwise.push({
          name: filetypelist[j].name,
          filecount: filecount,
        });
      }
      year_filetype.push({
        year: year,
        filetypelist: filetypelistyearwise,
      });
    }

    return {
      status: true,
      data: year_filetype,
      message: "File data get successfully",
      functionname: "YearsFileType",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "YearsFileType",
    };
    return response;
  }
};

export default YearsFileType;
