"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType } from "@/models/response";

interface villageFileTypePayload {}

const villageFileType = async (
  payload: villageFileTypePayload
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
        functionname: "villageFileType",
      };
    }

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
        functionname: "villageFileType",
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

      if (filecount > 0) {
        filetypelist.push({
          id: filetype[i].id,
          name: filetype[i].name,
          filecount: filecount,
        });
      }
    }

    // short accourding to file count
    filetypelist.sort((a, b) => b.filecount - a.filecount);

    // take only top 5

    // filetypelist = filetypelist.slice(0, 5);

    const villages = await prisma.village.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: "asc",
      },
    });

    interface villlagelist {
      id: number;
      name: string;
      filecount: number;
    }
    let villagelist: villlagelist[] = [];

    for (let i = 0; i < villages.length; i++) {
      let filecount = 0;
      for (let j = 0; j < file.length; j++) {
        if (villages[i].id === file[j].villageId) {
          filecount++;
        }
      }

      // Only add villages that have files
      if (filecount > 0) {
        villagelist.push({
          id: villages[i].id,
          name: villages[i].name,
          filecount: filecount,
        });
      }
    }

    // short accourding to file count
    villagelist.sort((a, b) => b.filecount - a.filecount);

    // take only top 15

    villagelist = villagelist.slice(0, 8);

    let village_filetype: any[] = [];

    // // now village wise file type count
    // for (let i = 0; i < villagelist.length; i++) {
    //   let village = villagelist[i].name;
    //   let filetypelistvillagewise: any[] = [];
    //   for (let j = 0; j < filetypelist.length; j++) {
    //     let filecount = 0;
    //     for (let k = 0; k < file.length; k++) {
    //       if (
    //         file[k].villageId === villagelist[i].id &&
    //         file[k].file_typeId === filetypelist[j].id
    //       ) {
    //         filecount++;
    //       }
    //     }
    //     filetypelistvillagewise.push({
    //       name: filetypelist[j].name,
    //       filecount: filecount,
    //     });
    //   }
    //   village_filetype.push({
    //     id: villagelist[i].id,
    //     village: village,
    //     filetypelist: filetypelistvillagewise,
    //   });
    // }

    // now file type wise village count
    for (let i = 0; i < filetypelist.length; i++) {
      let filetype = filetypelist[i].name;
      let villagefiletypelist: any[] = [];
      for (let j = 0; j < villagelist.length; j++) {
        let filecount = 0;
        for (let k = 0; k < file.length; k++) {
          if (
            file[k].villageId === villagelist[j].id &&
            file[k].file_typeId === filetypelist[i].id
          ) {
            filecount++;
          }
        }
        villagefiletypelist.push({
          name: villagelist[j].name,
          filecount: filecount,
        });
      }
      village_filetype.push({
        id: filetypelist[i].id,
        filetype: filetype,
        villagefiletypelist: villagefiletypelist,
      });
    }

    return {
      status: true,
      data: village_filetype,
      message: "File data get successfully",
      functionname: "villageFileType",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "villageFileType",
    };
    return response;
  }
};

export default villageFileType;
