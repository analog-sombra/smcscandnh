/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import GetModCount from "@/actions/mod/getmodcount";
import GetModRequest from "@/actions/mod/getmodrequest";
import ModGiveFiles from "@/actions/mod/givefiles";
import ModTakeFiles from "@/actions/mod/takefiles";
import { formateDate } from "@/utils/methods";
import { file_base } from "@prisma/client";
import { Button, Drawer, Switch } from "antd";
import { Input } from "antd";
import { getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
const { Search } = Input;

const ScannerPage = () => {
  const router = useRouter();

  interface ResponseType {
    in_scan: number;
    pending_take: number;
    pending_give: number;
  }

  const [counts, setCounts] = useState<ResponseType>({
    in_scan: 0,
    pending_take: 0,
    pending_give: 0,
  });

  const [loading, setLoading] = useState(true);
  const [userid, setUserid] = useState<number>(0);

  const columns: string[] = [
    "Scanner Name",
    "Date",
    "File Requested/Given/Taken",
    "Action",
  ];

  const init = async () => {
    const response = await GetModCount({
      userid: userid,
    });
    if (response.data && response.status) {
      setCounts(response.data);
    }

    const get_file_response = await GetModRequest({
      userid: userid,
    });

    if (get_file_response.data && get_file_response.status) {
      setFiles(get_file_response.data);
    } else {
      toast.error(get_file_response.message);
    }
    setGiveBool([]);
    setTakeBool([]);
  };

  interface ModFileRequestResponse {
    count: number;
    files: file_base[];
    date: Date;
    name: string;
    given: number;
    taken: number;
  }

  const [files, setFiles] = useState<ModFileRequestResponse[]>([]);

  useEffect(() => {
    const id = getCookie("id");

    if (id == null) {
      toast.error("User not found");
      return router.push("/login");
    }
    setUserid(parseInt(id));

    const init = async () => {
      setLoading(true);

      const response = await GetModCount({
        userid: parseInt(id),
      });
      console.log(response);
      if (response.data && response.status) {
        setCounts(response.data);
      }

      const get_file_response = await GetModRequest({
        userid: parseInt(id),
      });

      if (get_file_response.data && get_file_response.status) {
        setFiles(get_file_response.data);
      } else {
        toast.error(get_file_response.message);
      }
      setLoading(false);
    };

    init();
  }, []);

  // take section start here
  const [takeBool, setTakeBool] = useState<boolean[]>([]);
  const [takeBox, setTakeBox] = useState(false);

  const openTake = (index: number) => {
    setIndex(index);

    setTakeBool((prev) => {
      const newTakeBool = [...prev];
      while (newTakeBool.length < files[index].files.length) {
        newTakeBool.push(false);
      }
      return newTakeBool;
    });

    setTakeBox(true);
  };

  const closeTake = () => {
    setTakeBox(false);
  };
  const handleTakeSwitchChange = (switchIndex: number, checked: boolean) => {
    setTakeBool((prev) => {
      const updatedTakeBool = [...prev];
      updatedTakeBool[switchIndex] = checked;
      return updatedTakeBool;
    });
  };

  const handleTakeSubmit = async () => {
    // Example: Filter files where the switch is true
    const selectedFiles: file_base[] = files[index].files.filter(
      (_, fileIndex) => takeBool[fileIndex]
    );

    const response = await ModTakeFiles({
      files: selectedFiles,
    });

    if (response.status && response.data) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }

    await init();

    // Close the drawer
    closeTake();
  };

  // take section end here

  // give section start here
  const [giveBool, setGiveBool] = useState<boolean[]>([]);

  const [giveBox, setGiveBox] = useState(false);
  const openGive = (index: number) => {
    setIndex(index);
    // Initialize `giveBool` for the files being opened, if not already initialized
    setGiveBool((prev) => {
      const newGiveBool = [...prev];
      while (newGiveBool.length < files[index].files.length) {
        newGiveBool.push(false); // Default to `false`
      }
      return newGiveBool;
    });
    setGiveBox(true);
  };

  const closeGive = () => {
    setGiveBox(false);
  };

  const handleGiveSwitchChange = (switchIndex: number, checked: boolean) => {
    setGiveBool((prev) => {
      const updatedGiveBool = [...prev];
      updatedGiveBool[switchIndex] = checked;
      return updatedGiveBool;
    });
  };

  const handleGiveSubmit = async () => {
    // Example: Filter files where the switch is true
    const selectedFiles: file_base[] = files[index].files.filter(
      (_, fileIndex) => giveBool[fileIndex]
    );

    const response = await ModGiveFiles({
      files: selectedFiles,
    });

    if (response.status && response.data) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }

    await init();

    // Close the drawer
    closeGive();
  };

  // give section  end here

  const [index, setIndex] = useState(0);

  if (loading) {
    return (
      <div className="grid place-items-center h-screen w-full font-semibold text-3xl">
        Loading..
      </div>
    );
  }

  return (
    <>
      <Drawer closeIcon={null} onClose={closeTake} open={takeBox}>
        <div className="flex gap-2 items-center justify-between">
          <p className="text-xl font-semibold">File Take</p>
          <Button type="primary" size="small" onClick={handleTakeSubmit}>
            Submit
          </Button>
        </div>
        <div className="overflow-y-auto h-[86vh] mt-1">
          {files.length > 0 &&
            files[index].files
              .filter((val) => val.scan_end != null && val.mod_end == null)
              .map((file, index) => {
                return (
                  <div
                    key={index}
                    className="flex border p-1 items-center justify-between"
                  >
                    <p className="text-lg">{file.fileid}</p>
                    <Switch
                      checked={takeBool[index] || false}
                      onChange={(checked) =>
                        handleTakeSwitchChange(index, checked)
                      }
                    />
                  </div>
                );
              })}
        </div>
      </Drawer>
      <Drawer closeIcon={null} onClose={closeGive} open={giveBox}>
        <div className="flex gap-2 items-center justify-between">
          <p className="text-xl font-semibold">File Give</p>
          <Button type="primary" size="small" onClick={handleGiveSubmit}>
            Submit
          </Button>
        </div>
        <div className="overflow-y-auto h-[86vh] mt-1">
          {files.length > 0 &&
            files[index].files
              .filter((val) => !val.is_scan)
              .map((file, index) => {
                return (
                  <div
                    key={index}
                    className="flex border p-1 items-center justify-between"
                  >
                    <p className="text-lg">{file.fileid}</p>
                    <Switch
                      checked={giveBool[index] || false}
                      onChange={(checked) =>
                        handleGiveSwitchChange(index, checked)
                      }
                    />
                  </div>
                );
              })}
        </div>
      </Drawer>
      <div className="w-full md:mx-auto md:w-4/6 grid grid-cols-3 gap-2 items-center mt-2">
        <div className="bg-white border  rounded p-2">
          <p className="text-left text-sm">Pending to give</p>
          <p className="text-left text-xl">{counts.pending_give}</p>
        </div>
        <div className="bg-white border  rounded p-2">
          <p className="text-left text-sm">Pending to take</p>
          <p className="text-left text-xl">{counts.pending_take}</p>
        </div>
        <div className="bg-white border  rounded p-2">
          <p className="text-left text-sm">In Scan</p>
          <p className="text-left text-xl">
            {counts.in_scan}
            {/* {files.reduce((total, file) => total + file.count, 0)} */}
          </p>
        </div>
      </div>

      <div className="w-full md:mx-auto md:w-4/6 mt-2 flex items-center gap-2">
        <p className="text-lg md:text-2xl">Requested Files</p>
        <div className="grow"></div>
        <Search
          className="w-40"
          placeholder="input search text"
          loading={false}
        />
      </div>
      <div className="w-full md:mx-auto md:w-4/6  p-2 bg-white border rounded mt-2">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="py-2 text-sm font-semibold  whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {files.map((file: ModFileRequestResponse, index: number) => (
                <tr key={index} className="border-y py-2">
                  <td className="text-center py-2 w-20 whitespace-nowrap">
                    {file.name}
                  </td>
                  <td className="text-center px-1 md:px-4 whitespace-nowrap">
                    {formateDate(file.date)}
                  </td>
                  <td className="text-center px-1 md:px-4">
                    {file.count}/{file.given}/{file.taken}
                  </td>
                  <td className="text-center grid grid-cols-2 py-2 gap-2">
                    {/* if the count is 0 then dont show give and take button */}
                    {files[index].files.filter((val) => !val.is_scan).length >
                      0 && (
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => openGive(index)}
                      >
                        Give
                      </Button>
                    )}

                    {files.length > 0 &&
                      files[index].files.filter(
                        (val) => val.scan_end != null && val.mod_end == null
                      ).length > 0 && (
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => openTake(index)}
                        >
                          Take
                        </Button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ScannerPage;
