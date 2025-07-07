"use server";

enum SearchType {
  VILLAGE_USER,
  VILLAGE_SURVAY,
  FILETYPE_VILLAGE,
  FILETYPE_USER,
  FILETEYPE_YEAR,
  VILLAGE_YEAR,
}

interface ASearchFilePayload {
  searchtype: SearchType;
  file_no?: string;
  file_id?: string;
  applicant_name?: string;
  survey_number?: string;
  year?: string;
  remarks?: string;
  typeId?: number;
  villageId?: number;
}

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { file } from "@prisma/client";

const ASearchFile = async (
  payload: ASearchFilePayload
): Promise<ApiResponseType<file[] | null>> => {
  try {
    let files: file[] = [];
    // year search
    if (payload.year) {
      const year = await prisma.file.findMany({
        where: {
          deletedAt: null,
          year: payload.year,
        },
        include: {
          village: true,
          file_type: true,
        },
      });

      if (year) {
        files = [...files, ...year];
      }
    }

    // file number search
    if (payload.file_no) {
      const file_no = await prisma.file.findMany({
        where: {
          deletedAt: null,
          file_no: payload.file_no,
        },
        include: {
          village: true,
          file_type: true,
        },
      });

      if (file_no) {
        files = [...files, ...file_no];
      }
    }
    // file id search
    if (payload.file_id) {
      const file_id = await prisma.file.findMany({
        where: {
          deletedAt: null,
          fileid: payload.file_id,
        },
        include: {
          village: true,
          file_type: true,
        },
      });

      if (file_id) {
        files = [...files, ...file_id];
      }
    }

    // remarks search
    if (payload.remarks) {
      const remarks = await prisma.file.findMany({
        where: {
          deletedAt: null,
          remarks: {
            contains: payload.remarks,
          },
        },
        include: {
          village: true,
          file_type: true,
        },
      });

      if (remarks) {
        files = [...files, ...remarks];
      }
    }

    // type search

    if (payload.typeId) {
      const type = await prisma.file.findMany({
        where: {
          deletedAt: null,
          file_typeId: parseInt(payload.typeId.toString() ?? "0"),
        },
        include: {
          village: true,
          file_type: true,
        },
      });

      if (type) {
        files = [...files, ...type];
      }
    }

    // village search
    if (payload.villageId) {
      const village = await prisma.file.findMany({
        where: {
          deletedAt: null,
          villageId: parseInt(payload.villageId.toString() ?? "0"),
        },
        include: {
          village: true,
          file_type: true,
        },
      });

      if (village) {
        files = [...files, ...village];
      }
    }

    // search name

    if (payload.applicant_name) {
      const filename = await prisma.file.findMany({
        where: {
          deletedAt: null,
          filename: {
            contains: payload.applicant_name,
          },
        },
        include: {
          village: true,
          file_type: true,
        },
      });

      if (filename) {
        files = [...files, ...filename];
      }

      const name = await prisma.file_name.findMany({
        where: {
          deletedAt: null,
          name: {
            contains: payload.applicant_name,
          },
        },
        include: {
          file: {
            include: {
              village: true,
              file_type: true,
            },
          },
        },
      });
      if (name) {
        files = [...files, ...name.map((n) => n.file)];
      }
    }

    // search survey number
    if (payload.survey_number) {
      const surveyfiles = await prisma.file_survey.findMany({
        where: {
          deletedAt: null,
          survey_number: {
            contains: payload.survey_number,
          },
        },
        include: {
          file: {
            include: {
              village: true,
              file_type: true,
            },
          },
        },
      });

      if (surveyfiles) {
        files = [...files, ...surveyfiles.map((s) => s.file)];
      }

      const survey = await prisma.file_survey.findMany({
        where: {
          deletedAt: null,
          survey_number: {
            contains: payload.survey_number,
          },
        },
        include: {
          file: {
            include: {
              village: true,
              file_type: true,
            },
          },
        },
      });

      if (survey) {
        files = [...files, ...survey.map((s) => s.file)];
      }
    }

    if (payload.searchtype == SearchType.FILETYPE_USER) {
      // done
      const search_files = await prisma.file_name.findMany({
        where: {
          deletedAt: null,
          name: {
            contains: payload.applicant_name,
          },
        },
        include: {
          file: {
            include: {
              file_type: true,
              village: true,
            },
          },
        },
      });

      const search_files2 = await prisma.file.findMany({
        where: {
          deletedAt: null,
          filename: {
            contains: payload.applicant_name,
          },
        },
        include: {
          file_type: true,
          village: true,
        },
      });

      const all_search_file = [
        ...search_files2,
        ...search_files.map((f) => f.file),
      ];

      files = all_search_file.filter((f) => f.file_typeId == payload.typeId);
    } else if (payload.searchtype == SearchType.FILETYPE_VILLAGE) {
      // done
      files = files.filter(
        (f) =>
          f.file_typeId == payload.typeId && f.villageId == payload.villageId
      );
    } else if (payload.searchtype == SearchType.VILLAGE_USER) {
      // done
      const search_files = await prisma.file_name.findMany({
        where: {
          deletedAt: null,
          name: {
            contains: payload.applicant_name,
          },
        },
        include: {
          file: {
            include: {
              file_type: true,
              village: true,
            },
          },
        },
      });

      const search_files2 = await prisma.file.findMany({
        where: {
          deletedAt: null,
          filename: {
            contains: payload.applicant_name,
          },
        },
        include: {
          file_type: true,
          village: true,
        },
      });
      const all_search_file = [
        ...search_files2,
        ...search_files.map((f) => f.file),
      ];

      files = all_search_file.filter((f) => f.villageId == payload.villageId);
    } else if (payload.searchtype == SearchType.VILLAGE_SURVAY) {
      // done
      const search_files = await prisma.file_survey.findMany({
        where: {
          deletedAt: null,
          survey_number: payload.survey_number,
        },
        include: {
          file: {
            include: {
              file_type: true,
              village: true,
            },
          },
        },
      });

      const search_files2 = await prisma.file.findMany({
        where: {
          deletedAt: null,
          survey_no: payload.survey_number,
        },
        include: {
          file_type: true,
          village: true,
        },
      });
      const all_search_file = [
        ...search_files2,
        ...search_files.map((f) => f.file),
      ];

      files = all_search_file.filter((f) => f.villageId == payload.villageId);
    } else if (payload.searchtype == SearchType.VILLAGE_YEAR) {
      // done
      files = files.filter(
        (f) => f.villageId == payload.villageId && f.year == payload.year
      );
    } else if (payload.searchtype == SearchType.FILETEYPE_YEAR) {
      // done
      files = files.filter(
        (f) => f.file_typeId == payload.typeId && f.year == payload.year
      );
    }

    files = files.filter(
      (v, i, a) => a.findIndex((t) => t.fileid === v.fileid) === i
    );

    return {
      status: true,
      data: files,
      message: "File data get successfully",
      functionname: "ASearchFile",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "ASearchFile",
    };
    return response;
  }
};

export default ASearchFile;
