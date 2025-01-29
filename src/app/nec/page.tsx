"use client";
import GetNECCount from "@/actions/nec/getneccount";
import NECCompFiles from "@/actions/nec/neccompfile";
import { encryptURLData } from "@/utils/methods";
import { file_base } from "@prisma/client";
import { Divider } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";

const QcPage = () => {
  interface ResponseType {
    runing_file: number;
    completed_file: number;
    scansmall: number;
    scanmed: number;
    scanlarge: number;
    metasmall: number;
    metamed: number;
    metalarge: number;
    inscansmall: number;
    inscanmed: number;
    inscanlarge: number;
    scaned_file: number;
    meta_file: number;
  }

  const [counts, setCounts] = useState<ResponseType>({
    completed_file: 0,
    runing_file: 0,
    scanlarge: 0,
    scanmed: 0,
    scansmall: 0,
    metasmall: 0,
    metamed: 0,
    metalarge: 0,
    inscansmall: 0,
    inscanmed: 0,
    meta_file: 0,
    scaned_file: 0,
    inscanlarge: 0,
  });

  const [files, setFiles] = useState<file_base[]>([]);

  useEffect(() => {
    const init = async () => {
      const response = await GetNECCount();
      if (response.data && response.status) {
        setCounts(response.data);
      }

      const file_response = await NECCompFiles();
      if (file_response.data && file_response.status) {
        setFiles(file_response.data);
      }
    };
    init();
  }, []);

  return (
    <>
      <div className="w-full md:mx-auto md:w-4/6 grid grid-cols-3 gap-2 items-center mt-2">
        <div className="bg-white border  rounded p-2">
          <p className="text-left text-sm">Scan Completed</p>
          <p className="text-left text-xl">{counts.scaned_file}</p>
        </div>
        <div className="bg-white border  rounded p-2">
          <p className="text-left text-sm">Meta Completed</p>
          <p className="text-left text-xl">{counts.meta_file}</p>
        </div>
        <div className="bg-white border  rounded p-2">
          <p className="text-left text-sm">Verifed Completed</p>
          <p className="text-left text-xl">{counts.completed_file}</p>
        </div>
      </div>
      <div className="w-full md:mx-auto md:w-4/6 grid grid-cols-3 gap-2 items-center mt-2">
        <div className="bg-white border  rounded p-2">
          <p className="text-left text-sm">Scan Count</p>
          <p className="text-left text-xl">
            {counts.inscansmall}/{counts.inscanmed}/{counts.inscanlarge}
          </p>
        </div>
        <div className="bg-white border  rounded p-2">
          <p className="text-left text-sm">Meta Count</p>
          <p className="text-left text-xl">
            {counts.metasmall}/{counts.metamed}/{counts.metalarge}
          </p>
        </div>
        <div className="bg-white border  rounded p-2">
          <p className="text-left text-sm">Verifed Page Count</p>
          <p className="text-left text-xl">
            {counts.scansmall}/{counts.scanmed}/{counts.scanlarge}
          </p>
        </div>
      </div>

      <div className="w-full md:mx-auto md:w-4/6  mt-2">
        <Divider className="m-1 p-0" style={{ borderColor: "#00000044" }}>
          Completed Files
        </Divider>
        <div className="grid grid-cols-10 gap-1 ">
          {files.length == 0 && (
            <div className="col-span-10 text-center bg-rose-500 bg-opacity-10 rounded border border-rose-500 p-2 text-rose-500 text-sm">
              No files found
            </div>
          )}
          {files.map((file, index) => (
            <div key={index} className="border p-2 bg-white rounded">
              <Link
                href={`/nec/file/${encryptURLData(file.id.toString())}`}
                key={index}
              >
                <p className="text-xs text-center">{file.fileid}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default QcPage;
