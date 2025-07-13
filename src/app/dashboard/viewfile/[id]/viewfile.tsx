"use client";

import GetFile from "@/actions/file/getfile";
import GetPdfFiles from "@/actions/file/getpdflist";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formateDate } from "@/utils/methods";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface filedata {
  id: number;
  name: string;
  path: string;
}

interface ViewFileProps {
  fileid: number;
}
const ViewFile = (props: ViewFileProps) => {
  const router = useRouter();

  const [showimage, setShowImage] = useState<boolean>(false);
  const [image, setImage] = useState<string>("/img.jpg");

  const [isLoading, setLoading] = useState<boolean>(true);
  const [filedata, setFileData] = useState<any>(null);
  // const [files, setFiles] = useState<filedata[]>([]);

  // const [pdffile, setPdffile] = useState<string | null>(null);

  interface filedata {
    id: number;
    name: string;
    path: string;
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const response = await GetFile({ id: props.fileid });

      if (response.status) {
        console.log(response.data);
        setFileData((val: any) => response.data);
        // const responsefile = await GetPdfFiles({
        //   location: response.data?.physical_file_locationId?.toString() ?? "",
        // });
        // if (responsefile.data) {
        //   setFiles(responsefile.data);
        // }
      } else {
        toast.error(response.message);
      }

      setLoading(false);
    };
    init();
  }, [props.fileid]);

  const color = [
    { name: "DARK_BLUE", value: "Dark Blue" },
    { name: "YELLOW", value: "Yellow" },
    { name: "GREEN", value: "Green" },
    { name: "RED", value: "Red" },
    { name: "PINK", value: "Pink" },
    { name: "LIGHT_BLUE", value: "Light Blue" },
    { name: "ORANGE", value: "Orange" },
    { name: "BROWN", value: "Brown" },
    { name: "GREY", value: "Grey" },
    { name: "PURPLE", value: "Purple" },
    { name: "WHITE", value: "White" },
  ];

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <>
      <div className="min-h-screen p-2 mx-auto px-4">
        <Card className=" h-full p-2 px-6 text-sm">
          <div className="flex gap-4 items-center">
            <h1 className="text-left text-2xl font-medium">File Details</h1>
          </div>
          <div className="flex gap-2 items-center mt-2">
            <label htmlFor="fileid" className="w-60">
              File No :
            </label>
            <p>{filedata.fileid}</p>
          </div>
          <div className="flex gap-2 items-center mt-2">
            <label htmlFor="fileid" className="w-60">
              File Type :
            </label>
            <p>{filedata.file_type.name}</p>
          </div>
          <div className="flex gap-2 items-center mt-2">
            <label htmlFor="fileid" className="w-60">
              File Title :
            </label>
            <p>{filedata.file_no}</p>
          </div>
          <div className="flex gap-2 items-center  mt-2">
            <label htmlFor="name" className="w-60">
              File Name :
            </label>
            <p>{filedata.filename}</p>
          </div>

          <div className="flex gap-2 items-center mt-2">
            <label htmlFor="fileid" className="w-60">
              Village :
            </label>
            <p>{filedata.village.name}</p>
          </div>
          <div className="flex gap-2 items-center mt-2">
            <label htmlFor="fileid" className="w-60">
              Survey No :
            </label>
            <p>{filedata.survey_no}</p>
          </div>
          <div className="flex gap-2 items-center mt-2">
            <label htmlFor="fileid" className="w-60">
              Plot No :
            </label>
            <p>{filedata.plot_no}</p>
          </div>

          <div className="flex gap-2 items-center  mt-2">
            <label htmlFor="survey" className="w-60">
              File Color :
            </label>
            {/* <p>{filedata.file_color}</p> */}
            <p>
              {color.find((val) => val.name === filedata.file_color)?.value}
            </p>
          </div>
          <div className="flex gap-2 items-center  mt-2">
            <label htmlFor="year" className="w-60">
              Year :
            </label>
            <p>{filedata.year}</p>
          </div>
          <div className="flex gap-2 items-center  mt-2">
            <label htmlFor="year" className="w-60">
              Agreement No :
            </label>
            <p>{filedata.agreement_no}</p>
          </div>
          <div className="flex gap-2 items-center  mt-2">
            <label htmlFor="year" className="w-60">
              C Side end :
            </label>
            <p>{filedata.c_no_end}</p>
          </div>
          <div className="flex gap-2 items-center  mt-2">
            <label htmlFor="year" className="w-60">
              N Side end :
            </label>
            <p>{filedata.n_no_end}</p>
          </div>
          <div className="flex gap-2 items-center  mt-2">
            <label htmlFor="year" className="w-60">
              Order Date :
            </label>
            <p>{formateDate(new Date(filedata.order_date.toString()))}</p>
          </div>
          <div className="flex gap-2 items-center  mt-2">
            <label htmlFor="year" className="w-60">
              Order no :
            </label>
            <p>{filedata.order_no}</p>
          </div>
          <div className="flex gap-2 items-center  mt-2">
            <label htmlFor="year" className="w-60">
              Subject :
            </label>
            <p>{filedata.subject}</p>
          </div>
          <div className="flex gap-2 items-center  mt-2">
            <label htmlFor="year" className="w-60">
              Tender agency name :
            </label>
            <p>{filedata.tender_agency_name}</p>
          </div>

          {filedata.remarks && (
            <div className="flex gap-2 items-start  mt-2">
              <label htmlFor="remark" className="w-60">
                Remarks :
              </label>
              <p>{filedata.remarks}</p>
            </div>
          )}
          {filedata.physicalFileLocationId ? (
            <div className="flex gap-2 items-start  mt-2">
              <label htmlFor="remark" className="w-60">
                File Location :
              </label>
              <div className="flex gap-4">
                <p>
                  {filedata.physical_file_location.cupboard_numer}-
                  {filedata.physical_file_location.shelf_number} (
                  {filedata.physical_file_location.shelf_location})
                </p>
                {/* <button
                  className="bg-gray-200 p-1 px-4 rounded-sm"
                  onClick={() => {
                    // setImage(`/location/${filedata.file_location}${filedata.physical_file_location.cupboard_number}_${filedata.physical_file_location.shelf_number}.jpg`);
                    setImage(`/location/test.jpg`);
                    setShowImage(!showimage);
                  }}
                >
                  View
                </button> */}
              </div>
            </div>
          ) : (
            <div className="flex gap-2 items-start  mt-2">
              <label htmlFor="remark" className="w-60">
                File Location :
              </label>
              <div className="flex gap-4">
                <p>99-A (work in progress)</p>
                {/* <button
                  className="bg-gray-200 p-1 px-4 rounded-sm"
                  onClick={() => {
                    setImage(`/location/test.jpg`);
                    setShowImage(!showimage);
                  }}
                >
                  View
                </button> */}
              </div>
            </div>
          )}

          {filedata.verifiedAt && (
            <div className="flex gap-2 items-start  mt-4">
              <label htmlFor="remark" className="w-60">
                Verified At:
              </label>
              <p>{new Date(filedata.verifiedAt).toDateString()}</p>
            </div>
          )}
        </Card>
        {showimage && (
          <div className="bg-white rounded-md p-10 mt-4 shadow h-[500px]">
            <div className="relative h-[420px] w-full">
              <Image
                src={image}
                alt="error"
                fill={true}
                className="border border-black"
              />
            </div>
          </div>
        )}

        {/* <div className="flex gap-4 mt-4 w-full flex-wrap">
          <ScrollArea className="p-2 min-w-60 flex-1 max-h-60 bg-white rounded-lg shadow">
            <h1 className="text-center text-lg font-semibold">Names</h1>
            {filedata.file_name.length > 0 ? (
              <div>
                {filedata.file_name.map((val: any, index: number) => (
                  <h1 key={index} className="text-sm">
                    {index + 1}. {val.name}
                  </h1>
                ))}
              </div>
            ) : (
              <h1 className="text-center mt-2">No File Name</h1>
            )}
          </ScrollArea>

          <ScrollArea className="p-2 min-w-60 flex-1 max-h-60 bg-white rounded-lg shadow">
            <h1 className="text-center text-lg font-semibold">Survey No</h1>
            {filedata.file_survey.length > 0 ? (
              <div>
                {filedata.file_survey.map((val: any, index: number) => (
                  <h1 key={index} className="text-sm">
                    {index + 1}. {val.survey_number}
                  </h1>
                ))}
              </div>
            ) : (
              <h1 className="text-center mt-2">No Survey no. found.</h1>
            )}
          </ScrollArea>
        </div> */}
        {/* <Card className="bg-white mt-2 p-3 flex flex-col">
          <p className="text-lg font-semibold">Files</p>
          <Separator />
          {files.map((file: filedata, index: number) => {
            return (
              <button
                key={index}
                onClick={() => {
                  setPdffile(`/files/${filedata.file_location}/${file.name}`);
                  setTimeout(() => {
                    window.scrollTo({
                      top: document.documentElement.scrollHeight,
                      behavior: "smooth",
                    });
                  }, 500);
                }}
                className="text-xs hover:bg-gray-100 rounded-sm p-1 cursor-pointer flex gap-4 items-center"
              >
                <p>
                  {index + 1}. {file.name}
                </p>
                <div className="grow"></div>
                <p className="bg-gray-200 p-1 px-4 rounded-sm">View</p>
              </button>
            );
          })}
        </Card>
        {pdffile !== null && (
          <>
            <div className="w-full my-4">
              <embed
                src={pdffile}
                className="w-full h-[calc(100vh-50px)]"
                type="application/pdf"
              />
            </div>
          </>
        )} */}
      </div>
    </>
  );
};

export default ViewFile;
