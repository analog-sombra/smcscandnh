"use server";
interface SubmitMetaFilePayload {
  id: number;
  created_by: number;
  villageId?: number;
  filetypeId?: number;
  file_color?: string;
  file_name?: string;
  applicant_name?: string;
  fts_no?: string;
  file_ref_no?: string;
  file_subject?: string;
  survery_no?: string;
  plot_no?: string;
  order_no?: string;
  order_date?: string;
  issue_date?: string;
  c_no_end?: string;
  n_no_end?: string;
  year?: string;
  book_no?: string;
  agreement_no?: string;
  tender_agency_name?: string;
  complaint_no?: string;
  complaint_date?: string;
  old_file_no?: string;
  remarks?: string;
}

import { errorToString } from "@/utils/methods";
import { file, File_Color } from "@prisma/client";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";

const SubmitMetaFile = async (
  payload: SubmitMetaFilePayload
): Promise<ApiResponseType<file | null>> => {
  const functionname: string = SubmitMetaFile.name;

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

    const file_response = await prisma.file.update({
      where: {
        id: is_exist.id,
      },
      data: {
        ...(payload.year && { year: payload.year }),
        ...(payload.villageId && { villageId: payload.villageId }),
        ...(payload.filetypeId && { file_typeId: payload.filetypeId }),
        ...(payload.applicant_name && { filename: payload.applicant_name }),
        ...(payload.created_by && { updatedById: payload.created_by }),
        ...(payload.file_name && { file_no: payload.file_name }),
        ...(payload.fts_no && { fts_no: payload.fts_no }),
        ...(payload.file_ref_no && { file_ref_no: payload.file_ref_no }),
        ...(payload.survery_no && { survey_no: payload.survery_no }),
        ...(payload.plot_no && { plot_no: payload.plot_no }),
        ...(payload.order_no && { order_no: payload.order_no }),
        ...(payload.order_date && { order_date: new Date(payload.order_date) }),
        ...(payload.complaint_no && { complaint_no: payload.complaint_no }),
        ...(payload.complaint_date && {
          complaint_date: new Date(payload.complaint_date),
        }),
        ...(payload.issue_date && { issue_date: new Date(payload.issue_date) }),
        ...(payload.file_subject && { subject: payload.file_subject }),
        ...(payload.book_no && { book_no: payload.book_no }),
        ...(payload.file_color && {
          file_color: payload.file_color as File_Color,
        }),
        ...(payload.agreement_no && { agreement_no: payload.agreement_no }),
        ...(payload.tender_agency_name && {
          tender_agency_name: payload.tender_agency_name,
        }),
        ...(payload.n_no_end && { n_no_end: payload.n_no_end }),
        ...(payload.c_no_end && { c_no_end: payload.c_no_end }),
        ...(payload.old_file_no && { old_file_no: payload.old_file_no }),
        ...(payload.remarks && { remarks: payload.remarks }),
      },
    });

    if (!file_response) {
      return createResponse({
        functionname: functionname,
        message: "File not updated",
      });
    }

    if (!file_response) {
      return createResponse({
        message: "Failed to update files.",
        functionname: functionname,
      });
    }

    const update_file_base = await prisma.file_base.update({
      where: {
        id: payload.id,
      },
      data: {
        meta_end: new Date(),
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

export default SubmitMetaFile;
