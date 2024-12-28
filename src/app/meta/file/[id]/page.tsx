/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import GetfileById from "@/actions/file/getfilebyid";
import GetFileType from "@/actions/filetype/getallfiletype";
import SubmitMetaFile from "@/actions/meta/submitmeta";
import GetVillage from "@/actions/village/getallvillage";
import { decryptURLData } from "@/utils/methods";
import { file, file_type, village } from "@prisma/client";
import { Button, Divider, Input, InputRef, Select } from "antd";
import { getCookie } from "cookies-next/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

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

  const yearRef = useRef<InputRef>(null);
  const nameRef = useRef<InputRef>(null);

  const [villageid, setVillageid] = useState<number>(0);
  const [villageName, setVillageName] = useState<string | undefined>(undefined);
  const [filetypeid, setFiletypeid] = useState<number>(0);
  const [filetypeName, setFiletypeName] = useState<string | undefined>(
    undefined
  );

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

    if (
      yearRef == null ||
      yearRef == undefined ||
      yearRef.current == null ||
      yearRef.current == undefined ||
      yearRef.current.input == null ||
      yearRef.current.input == undefined ||
      yearRef.current.input.value == "" ||
      yearRef.current.input.value == undefined ||
      yearRef.current.input.value == null
    ) {
      return toast.error("Enter year");
    }

    if (
      nameRef == null ||
      nameRef == undefined ||
      nameRef.current == null ||
      nameRef.current == undefined ||
      nameRef.current.input == null ||
      nameRef.current.input == undefined ||
      nameRef.current.input.value == "" ||
      nameRef.current.input.value == undefined ||
      nameRef.current.input.value == null
    ) {
      return toast.error("Enter Applicant Name");
    }

    const response = await SubmitMetaFile({
      created_by: parseInt(id),
      filetypeId: filetypeid,
      name: nameRef.current.input.value,
      villageId: villageid,
      year: yearRef.current.input.value,
      id: fileid,
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
      <p className="text-2xl font-semibold text-left">Add Meta Data</p>
      <Divider dashed className="my-2" />
      <div className="flex mt-3">
        <p className="w-60">File Id:</p>
        <p className="grow">{file?.fileid}</p>
      </div>
      <div className="flex mt-3">
        <p className="w-60">Small Size:</p>
        <p className="grow">{file?.small_page_count}</p>
      </div>
      <div className="flex mt-3">
        <p className="w-60">Mid Size:</p>
        <p className="grow">{file?.mid_page_count}</p>
      </div>
      <div className="flex mt-3">
        <p className="w-60">Large Size:</p>
        <p className="grow">{file?.large_page_count}</p>
      </div>
      <div className="flex mt-3">
        <p className="w-60">File Type:</p>
        <div>
          <Select
            showSearch={true}
            className="w-60"
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
      </div>
      <div className="flex mt-3">
        <p className="w-60">Year:</p>
        <div>
          <Input placeholder="Select Year" className="w-60" ref={yearRef} />
        </div>
      </div>
      <div className="flex mt-3">
        <p className="w-60">Applicant Name:</p>
        <div>
          <Input
            placeholder="Enter applicant name"
            className="w-60"
            ref={nameRef}
          />
        </div>
      </div>
      <div className="flex mt-3">
        <p className="w-60">Village:</p>
        <div>
          <Select
            showSearch={true}
            className="w-60"
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
