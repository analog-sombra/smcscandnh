/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import GetScanerCount from "@/actions/scaner/getscanercount";
import GetScanFile from "@/actions/scaner/getscanfile";
import ScaneerRequestFile from "@/actions/scaner/scanerreqfile";
import SubmitScan from "@/actions/scaner/submitscan";
import { file_base } from "@prisma/client";
import { Button, InputRef, Popover } from "antd";
import { Input } from "antd";
import { getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
const { Search } = Input;

const ScannerPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userid, setUserid] = useState<number>(0);

  const [count, setCount] = useState<number | undefined>(undefined);

  const columns: string[] = [
    "File ID",
    "Small Size",
    "Med Size",
    "Large Size",
    "Action",
  ];

  const [popOpen, setPopOpen] = useState(false);

  const requestfile = async () => {
    const id = getCookie("id");

    if (id == null) {
      toast.error("User not found");
      return router.push("/login");
    }

    if (count == 0 || count == null || count == undefined) {
      return toast.error("Please enter count");
    }

    if (count >= 26) {
      return toast.error("Count should be less than 25.");
    }

    const request_file_response = await ScaneerRequestFile({
      count,
      created_by: parseInt(id),
    });

    if (request_file_response.data && request_file_response.status) {
      toast.success(request_file_response.message);
    } else {
      toast.error(request_file_response.message);
    }
    await init();
    setPopOpen(false);
  };

  interface ResponseType {
    filecount: number;
    pagecount: number;
  }

  const [counts, setCounts] = useState<ResponseType>({
    filecount: 0,
    pagecount: 0,
  });

  const [files, setFiles] = useState<file_base[]>([]);

  const init = async () => {
    const response = await GetScanerCount({
      userid: userid,
    });
    if (response.data && response.status) {
      setCounts(response.data);
    }
    const get_file_response = await GetScanFile({
      userid: userid,
    });

    if (get_file_response.data && get_file_response.status) {
      setFiles(get_file_response.data);
    } else {
      toast.error(get_file_response.message);
    }
    resetInput();
  };

  useEffect(() => {
    const id = getCookie("id");

    if (id == null) {
      toast.error("User not found");
      return router.push("/login");
    }

    setUserid(parseInt(id));

    const init = async () => {
      setLoading(true);

      const response = await GetScanerCount({
        userid: parseInt(id),
      });
      if (response.data && response.status) {
        setCounts(response.data);
      }
      const get_file_response = await GetScanFile({
        userid: parseInt(id),
      });

      if (get_file_response.data && get_file_response.status) {
        setFiles(get_file_response.data);
      } else {
        toast.error(get_file_response.message);
      }
      setLoading(false);
      resetInput();
    };

    init();
  }, []);

  const [pageSizes, setPageSizes] = useState<
    Record<number, { small: string; medium: string; large: string }>
  >({});

  const handleInputChange = (
    id: number,
    size: "small" | "medium" | "large",
    value: string
  ) => {
    // only number input
    const onlyNumbersRegex = /^[0-9]*$/;

    if (!onlyNumbersRegex.test(value)) {
      return;
    }

    setPageSizes((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [size]: value,
      },
    }));
  };

  const resetInput = () => {
    setPageSizes({});
  };

  const submitfile = async (id: number) => {
    const fileSizes = pageSizes[id];

    if (!fileSizes?.small || !fileSizes?.medium || !fileSizes?.large) {
      return toast.error("Please enter all sizes");
    }

    const update_response = await SubmitScan({
      id,
      size1: fileSizes?.small,
      size2: fileSizes?.medium,
      size3: fileSizes?.large,
      created_by: userid,
    });

    if (update_response.data && update_response.status) {
      toast.success(update_response.message);
    } else {
      toast.error(update_response.message);
    }

    await init();
  };

  // search start form here
  const searchRef = useRef<InputRef>(null);
  const [issearch, setIssearch] = useState(false);
  const [searchfiles, setSearchFiles] = useState<file_base[]>([]);

  const searchfile = async () => {
    if (
      searchRef.current == null ||
      searchRef.current.input == null ||
      searchRef.current.input.value == ""
    ) {
      return toast.error("Please enter file id");
    }

    const fileid = searchRef.current.input.value;

    const search_response = files.filter((file) => file.fileid == fileid);

    if (search_response.length == 0) {
      return toast.error("No file found");
    }

    setSearchFiles(search_response);
    setIssearch(true);
  };

  const resetSearch = () => {
    setIssearch(false);
    setSearchFiles([]);
  };

  // search end here

  const handleNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setCount: Dispatch<SetStateAction<number | undefined>>
  ) => {
    const onlyNumbersRegex = /^[0-9]*$/;
    const { value } = event.target;

    if (onlyNumbersRegex.test(value)) {
      // Parse value and handle empty case
      const adddata = value === "" ? undefined : parseInt(value, 10);
      setCount(adddata);
    }
  };

  if (loading) {
    return (
      <div className="grid place-items-center h-screen w-full font-semibold text-3xl">
        Loading..
      </div>
    );
  }

  return (
    <>
      <div className="w-full md:mx-auto md:w-4/6 grid grid-cols-3 gap-2 items-center mt-2">
        <div className="bg-white border  rounded p-2">
          <p className="text-left text-sm">Todays File Count</p>
          <p className="text-left text-xl">{counts.filecount}</p>
        </div>
        <div className="bg-white border  rounded p-2">
          <p className="text-left text-sm">Todays Page Count</p>
          <p className="text-left text-xl">{counts.pagecount}</p>
        </div>
        <div className="bg-white border  rounded p-2">
          <p className="text-left text-sm">Pending File Count</p>
          <p className="text-left text-xl">{files.length}</p>
        </div>
      </div>

      <div className="w-full md:mx-auto md:w-4/6 mt-2 flex items-center gap-2">
        <p className="text-lg md:text-2xl">
          Your Running Files {issearch ? searchfiles.length : null}
        </p>
        <div className="grow"></div>
        <Popover
          open={popOpen}
          trigger="click"
          content={
            <div className="flex flex-col gap-1">
              <Input
                value={count === undefined ? "" : count.toString()} // Controlled input
                onChange={(e) => handleNumberChange(e, setCount)}
                placeholder="Enter Count"
                className="w-full"
              />
              <Button type="primary" size="small" onClick={requestfile}>
                Request
              </Button>
            </div>
          }
          title="Request File"
        >
          <Button type="primary" onClick={() => setPopOpen(true)}>
            Request File
          </Button>
        </Popover>
        <Search
          className="w-40"
          placeholder="Enter File ID"
          loading={false}
          ref={searchRef}
          onSearch={searchfile}
          disabled={issearch}
        />
        {issearch && (
          <Button type="primary" onClick={resetSearch}>
            Reset Search
          </Button>
        )}
      </div>
      <div className="w-full md:mx-auto md:w-4/6  p-2 bg-white border rounded mt-2">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col} className="py-2 text-sm font-semibold min-w-20">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            {issearch ? (
              <>
                <tbody>
                  {searchfiles.map((file: file_base, index: number) => (
                    <tr key={index} className="border-y py-2">
                      <td className="text-center py-2 w-20">{file.fileid}</td>
                      <td className="text-center px-1 md:px-4">
                        <Input
                          placeholder="Enter Small Size"
                          value={pageSizes[file.id]?.small || ""}
                          onChange={(e) =>
                            handleInputChange(file.id, "small", e.target.value)
                          }
                        />
                      </td>
                      <td className="text-center px-1 md:px-4">
                        <Input
                          placeholder="Enter Med Size"
                          value={pageSizes[file.id]?.medium || ""}
                          onChange={(e) =>
                            handleInputChange(file.id, "medium", e.target.value)
                          }
                        />
                      </td>
                      <td className="text-center px-1 md:px-4">
                        <Input
                          placeholder="Enter Large Size"
                          value={pageSizes[file.id]?.large || ""}
                          onChange={(e) =>
                            handleInputChange(file.id, "large", e.target.value)
                          }
                        />
                      </td>
                      <td className="text-center">
                        {file.is_scan && (
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => submitfile(file.id)}
                          >
                            complete
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            ) : (
              <tbody>
                {files.map((file: file_base, index: number) => (
                  <tr key={index} className="border-y py-2">
                    <td className="text-center py-2 w-20">{file.fileid}</td>
                    <td className="text-center px-1 md:px-4">
                      <Input
                        placeholder="Enter Small Size"
                        value={pageSizes[file.id]?.small || ""}
                        onChange={(e) =>
                          handleInputChange(file.id, "small", e.target.value)
                        }
                      />
                    </td>
                    <td className="text-center px-1 md:px-4">
                      <Input
                        placeholder="Enter Med Size"
                        value={pageSizes[file.id]?.medium || ""}
                        onChange={(e) =>
                          handleInputChange(file.id, "medium", e.target.value)
                        }
                      />
                    </td>
                    <td className="text-center px-1 md:px-4">
                      <Input
                        placeholder="Enter Large Size"
                        value={pageSizes[file.id]?.large || ""}
                        onChange={(e) =>
                          handleInputChange(file.id, "large", e.target.value)
                        }
                      />
                    </td>
                    <td className="text-center">
                      {file.is_scan && (
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => submitfile(file.id)}
                        >
                          complete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

export default ScannerPage;
