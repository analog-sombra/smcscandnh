/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import GetfileById from "@/actions/file/getfilebyid";
import GetFileType from "@/actions/filetype/getallfiletype";
import SubmitMetaFile from "@/actions/meta/submitmeta";
import GetVillage from "@/actions/village/getallvillage";
import { decryptURLData } from "@/utils/methods";
import { file, file_type, village } from "@prisma/client";
import { Button, DatePicker, Divider, Input, Select } from "antd";
import { getCookie } from "cookies-next/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export interface OptionValue {
  value: string;
  label: string;
}

const MetaFilePage = () => {
  const router = useRouter();

  const { id } = useParams<{ id: string | string[] }>();
  const idString = Array.isArray(id) ? id[0] : id;
  const fileid: number = parseInt(decryptURLData(idString, router));

  const [isLoading, setLoading] = useState<boolean>(true);
  const [villages, setVillages] = useState<village[]>([]);
  const [fileTypes, setFileTypes] = useState<file_type[]>([]);

  const [villageid, setVillageid] = useState<number>(0);
  const [villageName, setVillageName] = useState<string | undefined>(undefined);
  const [filetypeid, setFiletypeid] = useState<number>(0);
  const [filetypeName, setFiletypeName] = useState<string | undefined>(
    undefined
  );

  interface DataInterface {
    file_color: string;
    file_name: string;
    applicant_name: string;
    fts_no: string;
    file_ref_no: string;
    file_subject: string;
    survery_no: string;
    plot_no: string;
    order_no: string;
    file_head: string;
    file_start: string;
    file_end: string;
    order_date: string;
    issue_date: string;
    c_no_end: string;
    n_no_end: string;
    year: string;
    book_no: string;
    agreement_no: string;
    tender_agency_name: string;
    complaint_no: string;
    complaint_date: string;
    old_file_no: string;
    remarks: string;
  }

  const [data, setData] = useState<DataInterface>({
    file_color: "",
    file_name: "",
    applicant_name: "",
    fts_no: "",
    file_ref_no: "",
    file_subject: "",
    survery_no: "",
    plot_no: "",
    order_no: "",
    file_head: "",
    file_start: "",
    file_end: "",
    order_date: "",
    issue_date: "",
    c_no_end: "",
    n_no_end: "",
    year: "",
    book_no: "",
    agreement_no: "",
    tender_agency_name: "",
    complaint_no: "",
    complaint_date: "",
    old_file_no: "",
    remarks: "",
  });

  const servalue = (key: string, value: string) => {
    setData({ ...data, [key]: value });
  };

  const [file, setFile] = useState<file | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const file_response = await GetfileById({
        id: fileid,
      });

      if (file_response.status && file_response.data) {
        setFile(file_response.data);
      }

      const villages_response = await GetVillage();
      if (villages_response.status) {
        setVillages(villages_response.data!);
      }

      const file_type_response = await GetFileType();
      if (file_type_response.status) {
        setFileTypes(file_type_response.data!);
      }
      setLoading(false);
    };
    init();
  }, []);

  const submitfile = async () => {
    const id = getCookie("id");

    if (id == null) {
      toast.error("User not found");
      return router.push("/login");
    }
    if (villageid == 0) {
      return toast.error("Select Village Id");
    }

    if (filetypeid == 0) {
      return toast.error("Select File Type");
    }

    const response = await SubmitMetaFile({
      created_by: parseInt(id),
      filetypeId: filetypeid,
      villageId: villageid,
      id: fileid,
      ...data,
    });

    if (response.data && response.status) {
      toast.success(response.message);
      router.back();
    } else {
      return toast.error(response.message);
    }
  };

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600">
        Loading...
      </div>
    );

  return (
    <div className="w-full md:mx-auto md:w-4/6 p-2 bg-white border rounded mt-2">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold text-left">Add Meta Data</p>
        <div className="grow"></div>
        <Button
          onClick={() => {
            router.back();
          }}
        >
          Back
        </Button>
      </div>
      <Divider dashed className="my-2" />
      <div className="grid grid-cols-4 place-items-stretch gap-4">
        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">Id</p>
          <p className="text-lg">{file?.fileid}</p>
        </div>
        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">Small Size</p>
          <p className="text-lg">{file?.small_page_count}</p>
        </div>
        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">Mid Size</p>
          <p className="text-lg">{file?.mid_page_count}</p>
        </div>
        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">Large Size</p>
          <p className="text-lg">{file?.large_page_count}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 place-items-stretch gap-4 mt-2">
        <div className="grid place-items-start">
          <p className="text-sm">
            File Type <span className="text-rose-500">*</span>
          </p>

          <Select
            className="w-full"
            showSearch={true}
            onChange={(value) => {
              setFiletypeid(parseInt(value.toString()));
              const fileType = fileTypes.find(
                (files) => files.id === parseInt(value.toString())
              );
              if (!fileType) return;
              setFiletypeName(fileType.name);
            }}
            value={filetypeName ?? undefined}
            placeholder="Enter File Type"
            options={fileTypes.map((files) => ({
              value: files.id.toString(),
              label: files.name,
            }))}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </div>
        <div className="grid place-items-start">
          <p className="text-sm">File Color</p>
          <Select
            className="w-full"
            showSearch={true}
            onChange={(value) => {
              servalue("file_color", value.toString());
            }}
            value={data.file_color ?? undefined}
            placeholder="Enter File Color"
            options={[
              {
                value: "DARK_BLUE",
                label: "Dark Blue",
              },
              {
                value: "YELLOW",
                label: "Yellow",
              },
              {
                value: "GREEN",
                label: "Green",
              },
              {
                value: "RED",
                label: "Red",
              },
              {
                value: "PINK",
                label: "Pink",
              },
              {
                value: "LIGHT_BLUE",
                label: "Light Blue",
              },
              {
                value: "ORANGE",
                label: "Orange",
              },
              {
                value: "BROWN",
                label: "Brown",
              },
              {
                value: "GREY",
                label: "Grey",
              },
              {
                value: "PURPLE",
                label: "Purple",
              },
              {
                value: "WHITE",
                label: "White",
              },
            ].map((files) => ({
              value: files.value,
              label: files.label,
            }))}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 place-items-stretch gap-4 mt-2">
        <div className="grid place-items-start">
          <p className="text-sm">File Name</p>
          <Input
            placeholder="Enter file name"
            className="w-full"
            onChange={(e) => servalue("file_name", e.target.value)}
            value={data.file_name}
          />
        </div>
        <div className="grid place-items-start">
          <p className="text-sm">Applicant Name</p>
          <Input
            placeholder="Enter applicant name"
            className="w-full"
            onChange={(e) => servalue("applicant_name", e.target.value)}
            value={data.applicant_name}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 place-items-stretch gap-4 mt-2">
        <div className="grid place-items-start">
          <p className="text-sm">FTS No</p>
          <Input
            placeholder="Enter FTS no"
            className="w-full"
            onChange={(e) => servalue("fts_no", e.target.value)}
            value={data.fts_no}
          />
        </div>
        <div className="grid place-items-start">
          <p className="text-sm">File Ref No</p>
          <Input
            placeholder="Enter file ref no"
            className="w-full"
            onChange={(e) => servalue("file_ref_no", e.target.value)}
            value={data.file_ref_no}
          />
        </div>
        <div className="grid place-items-start">
          <p className="text-sm">Old File No</p>
          <Input
            placeholder="Enter old file no"
            className="w-full"
            onChange={(e) => servalue("old_file_no", e.target.value)}
            value={data.old_file_no}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 place-items-stretch gap-4 mt-2">
        <div className="grid place-items-start">
          <p className="text-sm">File Head</p>
          <Input
            placeholder="Enter File head"
            className="w-full"
            onChange={(e) => servalue("file_head", e.target.value)}
            value={data.file_head}
          />
        </div>
        <div className="grid place-items-start">
          <p className="text-sm">File Start Date</p>
          {/* stop max date in future using dayjs */}
          <DatePicker
            placeholder="Enter File Start Date"
            className="w-full"
            maxDate={dayjs(new Date())}
            format="DD-MM-YYYY"
            onChange={(date) => {
              if (date) {
                servalue("file_start", date.format("YYYY-MM-DD"));
              }
            }}
            value={data.file_start ? dayjs(data.file_start) : undefined}
          />
        </div>
        <div className="grid place-items-start">
          <p className="text-sm">File End Date</p>
          <DatePicker
            placeholder="Enter File End Date"
            className="w-full"
            format="DD-MM-YYYY"
            maxDate={dayjs(new Date())}
            onChange={(date) => {
              if (date) {
                servalue("file_end", date.format("YYYY-MM-DD"));
              }
            }}
            value={data.file_end ? dayjs(data.file_end) : undefined}
          />
        </div>
      </div>
      <div className="grid place-items-start mt-2">
        <p className="text-sm">File Subject</p>
        <Input
          placeholder="Enter file subject"
          className="w-full"
          onChange={(e) => servalue("file_subject", e.target.value)}
          value={data.file_subject}
        />
      </div>

      <div className="grid grid-cols-3 place-items-stretch gap-4 mt-2">
        <div className="grid place-items-start">
          <p className="text-sm">
            Village <span className="text-rose-500">*</span>
          </p>
          <Select
            showSearch={true}
            className="w-full"
            onChange={(value) => {
              setVillageid(parseInt(value.toString()));
              const village = villages.find(
                (village) => village.id === parseInt(value.toString())
              );
              if (!village) return;
              setVillageName(village.name);
            }}
            value={villageName ?? undefined}
            placeholder="Enter village"
            options={villages.map((village) => ({
              value: village.id.toString(),
              label: village.name,
            }))}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </div>
        <div className="grid place-items-start">
          <p className="text-sm">Survey No</p>
          <Input
            placeholder="Enter Survey No"
            className="w-full"
            onChange={(e) => servalue("survery_no", e.target.value)}
            value={data.survery_no}
          />
        </div>
        <div className="grid place-items-start">
          <p className="text-sm">Plot No</p>
          <Input
            placeholder="Enter plot no"
            className="w-full"
            onChange={(e) => servalue("plot_no", e.target.value)}
            value={data.plot_no}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 place-items-stretch gap-4 mt-2">
        <div className="grid place-items-start">
          <p className="text-sm">Order No</p>
          <Input
            placeholder="Enter Order No"
            className="w-full"
            onChange={(e) => servalue("order_no", e.target.value)}
            value={data.order_no}
          />
        </div>
        <div className="grid place-items-start">
          <p className="text-sm">Order Date</p>
          {/* stop max date in future using dayjs */}
          <DatePicker
            placeholder="Enter Order Date"
            className="w-full"
            format="DD-MM-YYYY"
            maxDate={dayjs(new Date())}
            onChange={(date) => {
              if (date) {
                servalue("order_date", date.format("YYYY-MM-DD"));
              }
            }}
            value={data.order_date ? dayjs(data.order_date) : undefined}
          />
        </div>
        <div className="grid place-items-start">
          <p className="text-sm">Issue Date</p>
          <DatePicker
            placeholder="Enter Issue Date"
            className="w-full"
            format="DD-MM-YYYY"
            maxDate={dayjs(new Date())}
            onChange={(date) => {
              if (date) {
                servalue("issue_date", date.format("YYYY-MM-DD"));
              }
            }}
            value={data.issue_date ? dayjs(data.issue_date) : undefined}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 place-items-stretch gap-4 mt-2">
        <div className="grid place-items-start">
          <p className="text-sm">C No END</p>
          <Input
            placeholder="Enter C No end"
            className="w-full"
            onChange={(e) => servalue("c_no_end", e.target.value)}
            value={data.c_no_end}
          />
        </div>
        <div className="grid place-items-start">
          <p className="text-sm">N No End</p>
          <Input
            placeholder="Enter N No end"
            className="w-full"
            onChange={(e) => servalue("n_no_end", e.target.value)}
            value={data.n_no_end}
          />
        </div>
        <div className="grid place-items-start">
          <p className="text-sm">Year</p>
          <Input
            placeholder="Enter Year"
            className="w-full"
            onChange={(e) => servalue("year", e.target.value)}
            value={data.year}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 place-items-stretch gap-4 mt-2">
        <div className="grid place-items-start">
          <p className="text-sm">Book No</p>
          <Input
            placeholder="Enter Book No"
            className="w-full"
            onChange={(e) => servalue("book_no", e.target.value)}
            value={data.book_no}
          />
        </div>
        <div className="grid place-items-start">
          <p className="text-sm">Agreement No</p>
          <Input
            placeholder="Enter Agreement No"
            className="w-full"
            onChange={(e) => servalue("agreement_no", e.target.value)}
            value={data.agreement_no}
          />
        </div>
        <div className="grid place-items-start">
          <p className="text-sm">Tender Agency Name</p>
          <Input
            placeholder="Enter tender agency name"
            className="w-full"
            onChange={(e) => servalue("tender_agency_name", e.target.value)}
            value={data.tender_agency_name}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 place-items-stretch gap-4 mt-2">
        <div className="grid place-items-start">
          <p className="text-sm">Complaint No</p>
          <Input
            placeholder="Enter Complaint No"
            className="w-full"
            onChange={(e) => servalue("complaint_no", e.target.value)}
            value={data.complaint_no}
          />
        </div>
        <div className="grid place-items-start">
          <p className="text-sm">Complaint Date</p>
          <DatePicker
            placeholder="Enter Complaint Date"
            className="w-full"
            format="DD-MM-YYYY"
            maxDate={dayjs(new Date())}
            onChange={(date) => {
              if (date) {
                servalue("complaint_date", date.format("YYYY-MM-DD"));
              }
            }}
            value={data.complaint_date ? dayjs(data.complaint_date) : undefined}
          />
        </div>
      </div>

      <div className="grid place-items-start mt-2">
        <p className="text-sm">Remarks</p>
        <Input
          placeholder="Enter remarks"
          className="w-full"
          onChange={(e) => servalue("remarks", e.target.value)}
          value={data.remarks}
        />
      </div>

      <div className="w-full flex items-center mt-2">
        <Button type="primary" size="small" onClick={submitfile}>
          Complete
        </Button>
      </div>
    </div>
  );
};
export default MetaFilePage;
