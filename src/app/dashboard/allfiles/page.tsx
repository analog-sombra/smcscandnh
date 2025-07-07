"use client";
// import GetAllFilesPageneted from "@/actions/files/filefilepagination";
import {
  CarbonChevronDown,
  CharmChevronLeft,
  CharmChevronRight,
  MaterialSymbolsKeyboardDoubleArrowLeft,
  MaterialSymbolsKeyboardDoubleArrowRight,
} from "@/components/icons";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { KeyboardEvent } from "react";
import Link from "next/link";
import GetAllFilesPageneted from "@/actions/file/filefilepagination";

const AllFiles = () => {
  // paginated section start from here
  const [takefile, setTakefile] = useState<number>(10);
  const [skipfile, setSkipfile] = useState<number>(0);
  const [totalcount, setTotalcount] = useState<number>(0);
  const [isSelectPage, setSelectPage] = useState<boolean>(false);
  // paginated section end here

  const [isLoading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const searchRef = useRef<HTMLInputElement>(null);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  const [files, setFiles] = useState<any[]>([]);

  const [searchresult, setSearchresult] = useState<any[]>([]);

  // const pagination = usePagination(files);

  // const paginationsearch = usePagination(searchresult);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const response = await GetAllFilesPageneted({
        skip: skipfile,
        take: takefile,
      });
      if (response.status) {
        setFiles(response.data.files!);
        setTotalcount(response.data.count);
      }

      setLoading(false);
    };
    init();
  }, [takefile, skipfile]);

  const setfiledata = async () => {
    const response = await GetAllFilesPageneted({
      skip: skipfile,
      take: takefile,
    });
    if (response.status) {
      setFiles(response.data.files!);
    } else {
      toast.error(response.message);
    }
  };

  // const searchchange = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (searchRef.current) {
  //     if (searchRef.current.value.length > 0) {
  //       setIsSearch(true);

  //       setSearchresult(
  //         files.filter(
  //           (property) =>
  //             property.applicant_name
  //               .toString()
  //               .toLowerCase()
  //               .includes(
  //                 searchRef.current?.value.toString().toLowerCase() ?? ""
  //               ) ||
  //             property.survey_number
  //               .toString()
  //               .toLowerCase()
  //               .includes(
  //                 searchRef.current?.value.toString().toLowerCase() ?? ""
  //               ) ||
  //             property.year
  //               .toString()
  //               .toLowerCase()
  //               .includes(
  //                 searchRef.current?.value.toString().toLowerCase() ?? ""
  //               ) ||
  //             property.type.name
  //               .toString()
  //               .toLowerCase()
  //               .includes(
  //                 searchRef.current?.value.toString().toLowerCase() ?? ""
  //               ) ||
  //             property.village.name
  //               .toString()
  //               .toLowerCase()
  //               .includes(
  //                 searchRef.current?.value.toString().toLowerCase() ?? ""
  //               )
  //         )
  //       );
  //     } else {
  //       setIsSearch(false);
  //     }
  //   }
  // };

  const clearsearch = async () => {
    setIsSearch((val) => false);
    searchRef.current!.value = "";
  };

  const renderPageButtons = () => {
    const buttons = [];
    const maxButtonsToShow = 2;

    for (
      let i = Math.max(
        1,
        Math.floor(skipfile / takefile) + 1 - maxButtonsToShow
      );
      i <=
      Math.min(
        Math.ceil(totalcount / takefile),
        Math.floor(skipfile / takefile) + 1 + maxButtonsToShow
      );
      i++
    ) {
      buttons.push(
        <button
          key={i}
          onClick={async () => {
            setSkipfile((i - 1) * takefile);
            await setfiledata();
          }}
          className={`rounded border border-gray-500 hover:border-blue-500 hover:text-blue-500 text-sm text-center min-w-7 h-7 px-1 grid place-items-center ${
            Math.floor(skipfile / takefile) + 1 === i
              ? "bg-blue-500 bg-opacity-25 text-blue-500 border-blue-500"
              : ""
          }`}
        >
          {i}
        </button>
      );
    }

    if (Math.floor(skipfile / takefile) + 1 - maxButtonsToShow > 1) {
      buttons.unshift(
        <button
          key="left-ellipsis"
          disabled
          className="rounded text-sm text-center min-w-4 h-7 px-1 grid place-items-center cursor-not-allowed"
        >
          ...
        </button>
      );
    }

    if (
      Math.floor(skipfile / takefile) + 1 + maxButtonsToShow <
      Math.ceil(totalcount / takefile)
    ) {
      buttons.push(
        <button
          key="right-ellipsis"
          disabled
          className="rounded text-sm text-center min-w-4 h-7 px-1 grid place-items-center cursor-not-allowed"
        >
          ...
        </button>
      );
    }
    return buttons;
  };

  const handelGoTo = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const page: number = parseInt(
        (event.target as HTMLInputElement).value.replace(/\D/g, "")
      );
      if (page <= Math.ceil(totalcount / takefile)) {
        setSkipfile((page - 1) * takefile);
        await setfiledata();
      } else {
        toast.error("Invalid page number");
      }
    }
  };

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-100">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen px-6 mx-auto">
      <Card className="mt-4">
        <CardHeader className="py-2 px-4 flex flex-row items-center gap-2">
          <h1 className="text-xl">All Files</h1>
          <div className="grow"></div>

          {/* <div className="flex items-center bg-gray-100 rounded-md pl-2">
            <FluentMdl2Search />
            <input
              ref={searchRef}
              type="text"
              onChange={searchchange}
              className="bg-transparent outline-none focus:outline-none py-1 px-4"
              placeholder="Enter Search Text.."
            />
            {isSearch && (
              <button onClick={clearsearch} className=" p-2 text-black">
                <Fa6SolidXmark></Fa6SolidXmark>
              </button>
            )}
          </div> */}
        </CardHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-sm font-normal p-2 px-4">
                  File Id
                </TableHead>
                <TableHead className="text-sm font-normal p-2">Name</TableHead>
                <TableHead className="text-sm font-normal p-2">
                  Department
                </TableHead>
                <TableHead className="text-sm font-normal p-2">
                  File Type
                </TableHead>
                <TableHead className="text-sm font-normal p-2">
                  Village
                </TableHead>
                <TableHead className="text-sm font-normal p-2">Year</TableHead>

                <TableHead className="text-sm font-normal p-2">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((val: any) => (
                <TableRow key={val.id}>
                  <TableCell className="text-xs p-2 px-4">
                    {val.fileid}
                  </TableCell>
                  <TableCell className="text-xs p-2">
                    {val.file_no ? val.file_no : "N/A"}
                  </TableCell>
                  <TableCell className="text-xs p-2">
                    {val.department ? val.department.name : "N/A"}
                  </TableCell>
                  <TableCell className="text-xs p-2">
                    {val.file_type.name}
                  </TableCell>
                  <TableCell className="text-xs p-2">
                    {val.village ? val.village.name : "N/A"}
                  </TableCell>
                  <TableCell className="text-xs p-2">{val.year}</TableCell>

                  <TableCell className="p-2">
                    <Link
                      target="_blank"
                      href={`/dashboard/viewfile/${val.id}`}
                      className="bg-[#172e57] text-xs text-white  py-1 px-2 rounded-md hover:bg-[#1a3561] transition-all duration-200 ease-in-out"
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* 
        {isSearch ? (
          paginationsearch.paginatedItems.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] text-sm font-normal p-2 px-4">
                      File Id
                    </TableHead>
                    <TableHead className="text-sm font-normal p-2">
                      Name
                    </TableHead>
                    <TableHead className="text-sm font-normal p-2">
                      Survey Number
                    </TableHead>
                    <TableHead className="text-sm font-normal p-2">
                      Year
                    </TableHead>
                    <TableHead className="text-sm font-normal p-2">
                      File Type
                    </TableHead>
                    <TableHead className="text-sm font-normal p-2">
                      Village
                    </TableHead>
                    <TableHead className="text-sm font-normal p-2">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginationsearch.paginatedItems.map((val: any) => (
                    <TableRow key={val.id}>
                      <TableCell className="text-xs p-2 px-4">
                        {val.id}
                      </TableCell>
                      <TableCell className="text-xs p-2">
                        {val.applicant_name}
                      </TableCell>
                      <TableCell className="text-xs p-2">
                        {val.survey_number}
                      </TableCell>
                      <TableCell className="text-xs p-2">{val.year}</TableCell>
                      <TableCell className="text-xs p-2">
                        {val.type.name}
                      </TableCell>
                      <TableCell className="text-xs p-2">
                        {val.village.name}
                      </TableCell>
                      <TableCell className="p-2">
                        <button
                          className="bg-[#172e57] text-xs text-white  py-1 px-2 rounded-md hover:bg-[#1a3561] transition-all duration-200 ease-in-out"
                          onClick={() =>
                            router.push(`/dashboard/viewfile/${val.id}`)
                          }
                        >
                          View
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center">
              <p>No data found</p>
            </div>
          )
        ) : pagination.paginatedItems.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] text-sm font-normal p-2 px-4">
                    File Id
                  </TableHead>
                  <TableHead className="text-sm font-normal p-2">
                    Name
                  </TableHead>
                  <TableHead className="text-sm font-normal p-2">
                    Survey Number
                  </TableHead>
                  <TableHead className="text-sm font-normal p-2">
                    Year
                  </TableHead>
                  <TableHead className="text-sm font-normal p-2">
                    File Type
                  </TableHead>
                  <TableHead className="text-sm font-normal p-2">
                    Village
                  </TableHead>
                  <TableHead className="text-sm font-normal p-2">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.paginatedItems.map((val: any) => (
                  <TableRow key={val.id}>
                    <TableCell className="text-xs p-2 px-4">
                      {val.file_id}
                    </TableCell>
                    <TableCell className="text-xs p-2">
                      {val.applicant_name}
                    </TableCell>
                    <TableCell className="text-xs  p-2">
                      {val.survey_number}
                    </TableCell>
                    <TableCell className="text-xs p-2">{val.year}</TableCell>
                    <TableCell className="text-xs p-2">
                      {val.type.name}
                    </TableCell>
                    <TableCell className="text-xs p-2">
                      {val.village.name}
                    </TableCell>
                    <TableCell className=" p-2">
                      <button
                        className="bg-[#172e57] text-xs text-white  py-1 px-2 rounded-md hover:bg-[#1a3561] transition-all duration-200 ease-in-out"
                        onClick={() =>
                          router.push(`/dashboard/viewfile/${val.id}`)
                        }
                      >
                        View
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center">
            <p>No data found</p>
          </div>
        )} */}

        {/* {isSearch
          ? paginationsearch.paginatedItems.length > 0 && (
              <div className="p-4">
                <Pagination
                  ChangePerPage={paginationsearch.ChangePerPage}
                  activePage={paginationsearch.activePage}
                  changeActivePage={paginationsearch.changeActivePage}
                  firstPage={paginationsearch.firstPage}
                  getMaxPage={paginationsearch.getMaxPage}
                  getTotalItemsLength={paginationsearch.getTotalItemsLength}
                  goToPage={paginationsearch.goToPage}
                  itemPerPage={paginationsearch.itemPerPage}
                  lastPage={paginationsearch.lastPage}
                  nextPage={paginationsearch.nextPage}
                  paginatedItems={paginationsearch.paginatedItems}
                  prevPage={paginationsearch.prevPage}
                  totalPages={paginationsearch.totalPages}
                ></Pagination>
              </div>
            )
          : pagination.paginatedItems.length > 0 && (
              <div className="p-4">
                <Pagination
                  ChangePerPage={pagination.ChangePerPage}
                  activePage={pagination.activePage}
                  changeActivePage={pagination.changeActivePage}
                  firstPage={pagination.firstPage}
                  getMaxPage={pagination.getMaxPage}
                  getTotalItemsLength={pagination.getTotalItemsLength}
                  goToPage={pagination.goToPage}
                  itemPerPage={pagination.itemPerPage}
                  lastPage={pagination.lastPage}
                  nextPage={pagination.nextPage}
                  paginatedItems={pagination.paginatedItems}
                  prevPage={pagination.prevPage}
                  totalPages={pagination.totalPages}
                ></Pagination>
              </div>
            )} */}

        <div className="flex items-center gap-2 w-full mt-4 flex-wrap justify-between gap-y-4 my-2 px-4 ">
          <div className="flex gap-2 items-center">
            <p className="text-sm text-black font-normal text-left">
              Page {Math.floor(skipfile / takefile) + 1}/
              {Math.ceil(totalcount / takefile)}
            </p>
            <div className="h-5 w-[1px] bg-gray-500"></div>
            <p className="text-sm text-black font-normal text-left">
              Total {totalcount} files
            </p>
          </div>

          <div className="flex gap-1 items-center">
            <button
              onClick={async () => {
                setSkipfile(0);
                await setfiledata();
              }}
              className="rounded border border-gray-500 hover:border-blue-500 hover:text-blue-500 text-sm text-center min-w-7 h-7 px-1 grid place-items-center"
            >
              <MaterialSymbolsKeyboardDoubleArrowLeft></MaterialSymbolsKeyboardDoubleArrowLeft>
            </button>
            <button
              onClick={async () => {
                if (skipfile > 0) {
                  setSkipfile((val) => val - takefile);
                  await setfiledata();
                }
              }}
              className="rounded border border-gray-500 hover:border-blue-500 hover:text-blue-500 text-sm text-center min-w-7 h-7 px-1 grid place-items-center"
            >
              <CharmChevronLeft></CharmChevronLeft>
            </button>
            {renderPageButtons()}
            <button
              onClick={() => {
                if (skipfile < Math.floor(totalcount / takefile) * takefile) {
                  setSkipfile((val) => val + takefile);
                  setfiledata();
                }
              }}
              className="rounded border border-gray-500 hover:border-blue-500 hover:text-blue-500 text-sm text-center min-w-7 h-7 px-1 grid place-items-center"
            >
              <CharmChevronRight></CharmChevronRight>
            </button>
            <button
              onClick={async () => {
                setSkipfile(Math.floor(totalcount / takefile) * takefile);
                await setfiledata();
              }}
              className="rounded border border-gray-500 hover:border-blue-500 hover:text-blue-500 text-sm text-center min-w-7 h-7 px-1 grid place-items-center"
            >
              <MaterialSymbolsKeyboardDoubleArrowRight></MaterialSymbolsKeyboardDoubleArrowRight>
            </button>
          </div>

          <div className="flex gap-2 items-center">
            <div className="relative">
              <div
                onClick={() => setSelectPage((val) => !val)}
                className="px-2 h-7 text-sm text-black font-normal text-center rounded-md border border-gray-500 hover hover:border-blue-500 flex gap-1 items-center w-32 cursor-pointer"
              >
                <p>{takefile} / Page</p>
                <div className="grow"></div>
                <CarbonChevronDown></CarbonChevronDown>
              </div>
              <div
                className={`absolute bottom-0 -translate-y-10 bg-white  left-0 rounded-md shadow-sm w-32 overflow-y-hidden transition-all duration-500 ${
                  isSelectPage ? "block" : "hidden"
                }`}
              >
                {[5, 10, 25, 50, 100, 250].map((val: number, index: number) => (
                  <p
                    key={index}
                    onClick={async () => {
                      setTakefile(val);
                      await setfiledata();
                      setSelectPage(false);
                    }}
                    className="rounded-md hover:bg-blue-500 hover:bg-opacity-25 cursor-pointer px-2 mx-2 my-1 text-sm"
                  >
                    {val} / Page
                  </p>
                ))}
              </div>
            </div>
            <div className="h-5 w-[1px] bg-gray-500"></div>
            <div className="flex gap-2 items-center">
              <p className="text-sm text-black font-normal text-left">go to</p>
              <input
                onKeyDown={handelGoTo}
                type="text"
                pattern="[0-9]*"
                onChange={(event) => {
                  event.target.value = event.target.value.replace(/\D/g, "");
                }}
                className="text-black border border-gray-400 focus:border-blue-500 px-2 rounded-md w-14 outline-none"
              />
              <p className="text-sm text-black font-normal text-left">page</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default AllFiles;
