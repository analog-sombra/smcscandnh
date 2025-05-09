/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import GetAllDepartment from "@/actions/department/getalldept";
import CollectFile from "@/actions/supervisor/collectfile";
import CompFiles from "@/actions/supervisor/compfile";
import GetCompFile from "@/actions/supervisor/getcompfile";
import GetSupervisorCount from "@/actions/supervisor/getcounts";
import GetSupervisorFiles from "@/actions/supervisor/getsupervisorfiles";
import GetUserFileData from "@/actions/supervisor/getuserfiledata";
// import { formateDate } from "@/utils/methods";
import { department, file_base, user } from "@prisma/client";
import { format } from "date-fns";
import {
  Button,
  DatePicker,
  Divider,
  Drawer,
  Popover,
  Select,
  Switch,
} from "antd";
import { Input } from "antd";
import { getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const QcPage = () => {
  const router = useRouter();

  // const countRef = useRef<InputRef>(null);

  const [count, setCount] = useState<number | undefined>(undefined);
  const [deptTypes, setDeptTypes] = useState<department[]>([]);
  const [compFile, setCompFile] = useState<file_base[]>([]);

  const collectfile = async () => {
    const id = getCookie("id");

    if (id == null) {
      toast.error("User not found");
      return router.push("/login");
    }

    if (count == 0 || count == null || count == undefined) {
      return toast.error("Please enter count");
    }

    if (depttypeid == 0) {
      return toast.error("Please select department");
    }

    const collect_file_response = await CollectFile({
      count,
      created_by: parseInt(id),
      deptid: depttypeid,
    });

    if (collect_file_response.data && collect_file_response.status) {
      toast.success(collect_file_response.message);
    } else {
      toast.error(collect_file_response.message);
    }
    setPopOpen(false);
  };

  const [popOpen, setPopOpen] = useState(false);

  interface SizeData {
    count: number;
    small: number;
    med: number;
    large: number;
  }

  interface ResponseType {
    fileinhand: number;
    scancount: SizeData;
    qccount: SizeData;
    metacount: SizeData;
  }

  const [counts, setCounts] = useState<ResponseType>({
    fileinhand: 0,
    scancount: {
      count: 0,
      small: 0,
      med: 0,
      large: 0,
    },
    qccount: {
      count: 0,
      small: 0,
      med: 0,
      large: 0,
    },
    metacount: {
      count: 0,
      small: 0,
      med: 0,
      large: 0,
    },
  });

  interface FileResponseType {
    qcfiles: Array<file_base & { qc: user | null }>;
    metafiles: Array<file_base & { meta: user | null }>;
    scanefiles: Array<file_base & { scan: user | null }>;
    modfiles: Array<file_base & { scan: user | null }>;
  }

  const [files, setFiles] = useState<FileResponseType>({
    qcfiles: [],
    metafiles: [],
    scanefiles: [],
    modfiles: [],
  });

  interface UserResponseFile {
    username: string;
    role: string;
    filecount: number;
    smallpagecount: number;
    medpagecount: number;
    largepagecount: number;
    totalpagecount: number;
  }

  const [userFiles, setUserFiles] = useState<UserResponseFile[]>();

  const current_date = new Date();

  const [date, setDate] = useState<string | undefined>();

  const onChange = async (date: any) => {
    const fordate = format(date, "yyyy-MM-dd");
    setDate(fordate);

    const user_response = await GetUserFileData({
      date: new Date(date),
    });
    if (user_response.data && user_response.status) {
      setUserFiles(user_response.data);
    }
  };

  // const searchDate = async () => {
  //   if (date == undefined) return;
  //   const user_response = await GetUserFileData({
  //     date: new Date(date),
  //   });
  //   if (user_response.data && user_response.status) {
  //     setUserFiles(user_response.data);
  //   }
  // };

  useEffect(() => {
    const init = async () => {
      const response = await GetSupervisorCount();
      if (response.data && response.status) {
        setCounts(response.data);
      }

      const file_response = await GetSupervisorFiles();
      if (file_response.data && file_response.status) {
        setFiles(file_response.data);
      }
      const user_response = await GetUserFileData({
        date: date ? new Date(date) : current_date,
      });
      if (user_response.data && user_response.status) {
        setUserFiles(user_response.data);
      }
      const dept_response = await GetAllDepartment();
      if (dept_response.data && dept_response.status) {
        setDeptTypes(dept_response.data);
      }

      const comp_file = await GetCompFile();
      if (comp_file.data && comp_file.status) {
        setCompFile(comp_file.data);
      }
    };
    init();
  }, []);

  const [open, setOpen] = useState(false);

  const columns: string[] = [
    "User Name",
    "Role",
    "File Count",
    "Page Number",
    "Total",
    "Smart Total",
  ];

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

  const [depttypeid, setDepttypeid] = useState<number>(0);
  const [depttypeName, setDepttypeName] = useState<string | undefined>(
    undefined
  );

  const [takeBool, setTakeBool] = useState<boolean[]>([]);
  const [takeBox, setTakeBox] = useState(false);

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
    const selectedFiles: file_base[] = compFile.filter(
      (_, fileIndex) => takeBool[fileIndex]
    );

    const response = await CompFiles({
      files: selectedFiles,
    });

    if (response.status && response.data) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }

    closeTake();
  };

  // take section end here

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
          {compFile.length > 0 &&
            compFile.map((file, index) => {
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
      <div className="w-full md:mx-auto md:w-4/6 grid grid-cols-4 gap-2 items-center mt-2">
        <div className="bg-white border  rounded p-2">
          <p className="text-left text-sm">Total file in hand</p>
          <p className="text-left text-xl">{counts.fileinhand}</p>
        </div>
        <div className="bg-white border  rounded p-2">
          <p className="text-left text-sm">
            Todays Scan Count ({counts.scancount.count})
          </p>
          <p className="text-left text-xl">
            {counts.scancount.small}/{counts.scancount.med}/
            {counts.scancount.large}
          </p>
        </div>
        <div className="bg-white border  rounded p-2">
          <p className="text-left text-sm">
            Today QC Count ({counts.qccount.count})
          </p>
          <p className="text-left text-xl">
            {counts.qccount.small}/{counts.qccount.med}/{counts.qccount.large}
          </p>
        </div>
        <div className="bg-white border  rounded p-2">
          <p className="text-left text-sm">
            Today Meta Count ({counts.metacount.count})
          </p>
          <p className="text-left text-xl">
            {counts.metacount.small}/{counts.metacount.med}/
            {counts.metacount.large}
          </p>
        </div>
      </div>

      <div className="w-full md:mx-auto md:w-4/6 mt-2 flex items-center gap-2">
        <p className="text-lg md:text-2xl">Your Running Files</p>
        <div className="grow"></div>
        <Popover
          open={popOpen}
          trigger="click"
          content={
            <div className="flex flex-col gap-1">
              <Input
                placeholder="Enter Count"
                className="w-full"
                value={count === undefined ? "" : count.toString()} // Controlled input
                onChange={(e) => handleNumberChange(e, setCount)}
              />
              <Select
                showSearch={true}
                className="w-60"
                onChange={(value) => {
                  setDepttypeid(parseInt(value.toString()));
                  const fileType = deptTypes.find(
                    (files) => files.id === parseInt(value.toString())
                  );
                  if (!fileType) return;
                  setDepttypeName(fileType.name);
                }}
                value={depttypeName ?? undefined}
                placeholder="Enter File Type"
                options={deptTypes.map((files) => ({
                  value: files.id.toString(),
                  label: files.name,
                }))}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
              <Button type="primary" size="small" onClick={collectfile}>
                Request
              </Button>
            </div>
          }
          title="Collect File From Department"
        >
          <Button type="primary" onClick={() => setPopOpen(true)}>
            Collect File Dept
          </Button>
        </Popover>
        <Button type="primary" onClick={() => setOpen(true)}>
          Daily File
        </Button>
        <Button
          type="primary"
          onClick={() => {
            setTakeBox(true);
          }}
        >
          Give File Dept
        </Button>
      </div>

      <div className="w-full md:mx-auto md:w-4/6  mt-2">
        <Divider className="m-1 p-0" style={{ borderColor: "#00000044" }}>
          Qc
        </Divider>
        <div className="grid grid-cols-10 gap-1 ">
          {files.qcfiles.length == 0 && (
            <div className="col-span-10 text-center bg-rose-500 bg-opacity-10 rounded border border-rose-500 p-2 text-rose-500 text-sm">
              No files QC found
            </div>
          )}
          {files.qcfiles.map((file, index) => (
            <div key={index} className="border p-2 bg-white rounded">
              <p className="text-xs text-center">{file.fileid}</p>
              <p className="text-xs text-center">{file.qc?.username}</p>
              <p className="text-xs text-center">({file.qc?.role})</p>
            </div>
          ))}
        </div>
        <Divider className="m-1 p-0" style={{ borderColor: "#00000044" }}>
          Meta
        </Divider>
        <div className="grid grid-cols-10 gap-1 ">
          {files.metafiles.length == 0 && (
            <div className="col-span-10 text-center bg-rose-500 bg-opacity-10 rounded border border-rose-500 p-2 text-rose-500 text-sm">
              No files Meta found
            </div>
          )}
          {files.metafiles.map((file, index) => (
            <div key={index} className="border p-2 bg-white rounded">
              <p className="text-xs text-center">{file.fileid}</p>
              <p className="text-xs text-center">{file.meta?.username}</p>
              <p className="text-xs text-center">({file.meta?.role})</p>
            </div>
          ))}
        </div>
        <Divider className="m-1 p-0" style={{ borderColor: "#00000044" }}>
          Mod
        </Divider>
        <div className="grid grid-cols-10 gap-1 ">
          {files.scanefiles.length == 0 && (
            <div className="col-span-10 text-center bg-rose-500 bg-opacity-10 rounded border border-rose-500 p-2 text-rose-500 text-sm">
              No files Mods found
            </div>
          )}

          {files.modfiles.map((file, index) => (
            <div key={index} className="border p-2 bg-white rounded">
              <p className="text-xs text-center">{file.fileid}</p>
              <p className="text-xs text-center">{file.scan?.username}</p>
              <p className="text-xs text-center">({file.scan?.role})</p>
            </div>
          ))}
        </div>
        <Divider className="m-1 p-0" style={{ borderColor: "#00000044" }}>
          Scanner
        </Divider>
        <div className="grid grid-cols-10 gap-1 ">
          {files.scanefiles.length == 0 && (
            <div className="col-span-10 text-center bg-rose-500 bg-opacity-10 rounded border border-rose-500 p-2 text-rose-500 text-sm">
              No files Scan found
            </div>
          )}

          {files.scanefiles.map((file, index) => (
            <div key={index} className="border p-2 bg-white rounded">
              <p className="text-xs text-center">{file.fileid}</p>
              <p className="text-xs text-center">{file.scan?.username}</p>
              <p className="text-xs text-center">({file.scan?.role})</p>
            </div>
          ))}
        </div>
      </div>

      <Drawer
        closeIcon={null}
        onClose={() => setOpen(false)}
        open={open}
        size="large"
      >
        <div className="text-lg font-semibold text-center flex justify-between">
          <p>{format(date ?? current_date, "yyyy-MM-dd")}</p>
          <div className="grow"></div>
          <DatePicker
            format="DD-MM-YYYY"
            onChange={onChange}
            maxDate={dayjs(new Date(), "yyyy-MM-dd")}
          />
        </div>
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
              {userFiles?.map((file, index) => (
                <tr key={index} className="border-y py-2">
                  <td className="text-center py-2 w-20 whitespace-nowrap">
                    {file.username}
                  </td>
                  <td className="text-center px-1 md:px-4 whitespace-nowrap">
                    {file.role}
                  </td>
                  <td className="text-center px-1 md:px-4">{file.filecount}</td>
                  <td className="text-center px-1 md:px-4">
                    {file.smallpagecount}/{file.medpagecount}/
                    {file.largepagecount}
                  </td>
                  <td className="text-center px-1 md:px-4">
                    {file.totalpagecount}
                  </td>
                  <td className="text-center px-1 md:px-4">
                    {Math.round(
                      file.smallpagecount +
                        1.25 * file.medpagecount +
                        2 * file.largepagecount
                    )}
                  </td>
                </tr>
              ))}

              {/* {files.map((file: ModFileRequestResponse, index: number) => (
                <tr key={index} className="border-y py-2">
                  <td className="text-center py-2 w-20 whitespace-nowrap">
                    {file.name}
                  </td>
                  <td className="text-center px-1 md:px-4 whitespace-nowrap">
                    {formateDate(file.date)}
                  </td>
                  <td className="text-center px-1 md:px-4">{file.count}</td>
                  <td className="text-center grid grid-cols-2 py-2 gap-2">
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => openGive(index)}
                    >
                      Give
                    </Button>
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => openTake(index)}
                    >
                      Take
                    </Button>
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
      </Drawer>
    </>
  );
};

export default QcPage;
