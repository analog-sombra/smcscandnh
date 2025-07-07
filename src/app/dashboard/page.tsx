/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import DashBoardCount from "@/actions/dashboard/count";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Chart, ArcElement } from "chart.js";

import {
  CarbonAlignBoxTopCenter,
  CircumHome,
  Fa6SolidXmark,
  FluentAppsListDetail24Regular,
  FluentGlobeLocation24Regular,
  FluentMdl2Search,
  MaterialSymbolsBook5,
} from "@/components/icons";
import VillagesFile from "@/actions/dashboard/villagefile";
import TypesFile from "@/actions/dashboard/typefile";
import YearsFileType from "@/actions/dashboard/yearsfiletypes";
import villageFileType from "@/actions/dashboard/villagesfiletypes";
import Link from "next/link";
import Pagination from "@/components/pagination";
import { Card, CardHeader } from "@/components/ui/card";
import { usePagination } from "@/hooks/usepagination";
import { toast } from "react-toastify";
import { ApiResponseType } from "@/models/response";
import { file } from "@prisma/client";
import fileSearch from "@/actions/searchfile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DepartmentFile from "@/actions/dashboard/departmentfile";
Chart.register(ArcElement);
const Dashboard = () => {
  // const doughnutoption: any = {
  //   responsive: true,
  //   plugins: {
  //     datalabels: {
  //       anchor: "center",
  //       align: "center",
  //       color: "#ffffff",
  //       font: {
  //         size: 20,
  //       },
  //       formatter: function (value: any) {
  //         return value;
  //       },
  //     },
  //     legend: {
  //       position: "right",
  //       labels: {
  //         usePointStyle: true,
  //         boxWidth: 6,
  //         font: {
  //           size: 12,
  //         },
  //       },
  //     },
  //   },
  // };

  const dynamicColors = (numColors: any) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      const color = `rgba(${r}, ${g}, ${b}, 0.75)`;
      colors.push(color);
    }
    return colors;
  };

  const doughnutdata: any = {
    labels: ["Officer 1", "Officer 2", "Officer 3", "Officer 4", "Officer 5"],
    datasets: [
      {
        data: [300, 50, 100, 40, 120],
        backgroundColor: dynamicColors(5),
      },
    ],
  };

  const [isLoading, setLoading] = useState<boolean>(true);
  const [count, setCount] = useState<any>({});
  // const [villageFile, setVillageFile] = useState<any>([]);
  const [typeFile, setTypeFile] = useState<any>([]);
  const [departmentFile, setDepartmentFile] = useState<any>([]);

  const [yeartype, setYearType] = useState<any>([]);
  const [villagetype, setVillageType] = useState<any>([]);
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const response = await DashBoardCount({});
      if (response.status) {
        setCount(response.data!);
      }

      // const villagesfile = await VillagesFile({});
      // if (villagesfile.status) {
      //   setVillageFile(villagesfile.data!);
      // }
      const departmentfile = await DepartmentFile({});
      if (departmentfile.status) {
        setDepartmentFile(departmentfile.data!);
      }

      const typessfile = await TypesFile({});
      if (typessfile.status) {
        const data: any[] = typessfile.data!;

        data.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        setTypeFile(data);
      }

      const years_filetypes = await YearsFileType({});
      if (years_filetypes.status) {
        setYearType(years_filetypes.data!);
      }

      const village_type = await villageFileType({});
      if (village_type.status) {
        const data: any[] = village_type.data!;

        data.sort((a, b) => {
          if (a.village < b.village) return -1;
          if (a.village > b.village) return 1;
          return 0;
        });

        setVillageType(data);

        console.log(data);
      }

      setLoading(false);
    };
    init();
  }, []);

  const yearsearch = async (year: string) => {
    const filesearch: ApiResponseType<file[] | null> = await fileSearch({
      year: year,
    });

    if (filesearch.status) {
      setSearchData(filesearch.data!);
      setSearch(true);
      setTimeout(() => {
        window.scrollTo({
          top: 800,
          behavior: "smooth",
        });
      }, 200);
    } else {
      toast.error(filesearch.message);
    }
  };

  const villagesearch = async (villageid: number) => {
    const filesearch: ApiResponseType<file[] | null> = await fileSearch({
      villageId: villageid,
    });

    if (filesearch.status) {
      setSearchData(filesearch.data!);
      setSearch(true);
      setTimeout(() => {
        window.scrollTo({
          top: 800,
          behavior: "smooth",
        });
      }, 200);
    } else {
      toast.error(filesearch.message);
    }
  };
  const filetypesearch = async (typeid: number) => {
    const filesearch: ApiResponseType<file[] | null> = await fileSearch({
      typeId: typeid,
    });

    if (filesearch.status) {
      setSearchData(filesearch.data!);
      setSearch(true);
      setTimeout(() => {
        window.scrollTo({
          top: 800,
          behavior: "smooth",
        });
      }, 200);
    } else {
      toast.error(filesearch.message);
    }
  };

  const [search, setSearch] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<any[]>([]);

  const pagination = usePagination(searchData);

  const searchRef = useRef<HTMLInputElement>(null);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  const [searchresult, setSearchresult] = useState<any[]>([]);

  const paginationsearch = usePagination(searchresult);

  const searchchange = (e: ChangeEvent<HTMLInputElement>) => {
    if (searchRef.current) {
      if (searchRef.current.value.length > 0) {
        setIsSearch(true);

        setSearchresult(
          searchData.filter(
            (property) =>
              property.applicant_name
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              property.survey_number
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              property.year
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              property.type.name
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              property.village.name
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                )
          )
        );
      } else {
        setIsSearch(false);
      }
    }
  };

  const clearsearch = async () => {
    setIsSearch((val) => false);
    searchRef.current!.value = "";
  };

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-100">
        Loading...
      </div>
    );
  return (
    <div className="p-6">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:grid-row-3">
        <div className="bg-white rounded">
          <h1 className="text-sm text-gray-500 p-1 px-2">Village</h1>
          <div className="w-full h-[1px] bg-gray-200"></div>
          <div className="flex gap-2 items-center px-2">
            <div className="grid place-items-start my-2">
              <p className="text-xl text-gray-600">{count.village}</p>
              <span className="text-xs text-gray-400">Total village Count</span>
            </div>
            <div className="grow"></div>
            <div>
              <div className="rounded-full p-2 bg-blue-500">
                <CircumHome className="text-xl text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded">
          <h1 className="text-sm text-gray-500 p-1 px-2">File Type</h1>
          <div className="w-full h-[1px] bg-gray-200"></div>
          <div className="flex gap-2 items-center px-2">
            <div className="grid place-items-start my-2">
              <p className="text-xl text-gray-600">{count.type}</p>
              <span className="text-xs text-gray-400">
                Total File Type Count
              </span>
            </div>
            <div className="grow"></div>
            <div>
              <div className="rounded-full p-2 bg-rose-500">
                <FluentAppsListDetail24Regular className="text-xl text-white" />
              </div>
            </div>
          </div>
        </div>

        <Link href={"/dashboard/allfiles"}>
          <div className="bg-white rounded">
            <h1 className="text-sm text-gray-500 p-1 px-2">Files</h1>
            <div className="w-full h-[1px] bg-gray-200"></div>
            <div className="flex gap-2 items-center px-2">
              <div className="grid place-items-start my-2">
                <p className="text-xl text-gray-600">{count.file}</p>
                <span className="text-xs text-gray-400">Total Files Count</span>
              </div>
              <div className="grow"></div>
              <div>
                <div className="rounded-full p-2 bg-orange-500">
                  <MaterialSymbolsBook5 className="text-xl text-white" />
                </div>
              </div>
            </div>
          </div>
        </Link>

        <Link href={"/dashboard/allfiles"}>
          <div className="bg-white rounded">
            <h1 className="text-sm text-gray-500 p-1 px-2">Total Pages</h1>
            <div className="w-full h-[1px] bg-gray-200"></div>
            <div className="flex gap-2 items-center px-2">
              <div className="grid place-items-start my-2">
                <p className="text-xl text-gray-600">{count.page}</p>
                <span className="text-xs text-gray-400">Total Page Count</span>
              </div>
              <div className="grow"></div>
              <div>
                <div className="rounded-full p-2 bg-emerald-500">
                  <CarbonAlignBoxTopCenter className="text-xl text-white" />
                </div>
              </div>
            </div>
          </div>
        </Link>
        <Link href={"/dashboard/allfiles"}>
          <div className="bg-white rounded">
            <h1 className="text-sm text-gray-500 p-1 px-2">Total Maps</h1>
            <div className="w-full h-[1px] bg-gray-200"></div>
            <div className="flex gap-2 items-center px-2">
              <div className="grid place-items-start my-2">
                <p className="text-xl text-gray-600">{count.map}</p>
                <span className="text-xs text-gray-400">Total Maps Count</span>
              </div>
              <div className="grow"></div>
              <div>
                <div className="rounded-full p-2 bg-cyan-500">
                  <FluentGlobeLocation24Regular className="text-xl text-white" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div className="grid grid-cols-6 gap-4 mt-4">
        {/* <div className="flex-1 bg-white p-2 rounded col-span-4">
          <h3 className="text-lg text-center">Years & File Types</h3>
          <div className="w-full h-[1px] bg-gray-200 mt-1"></div>
          <Table className="relative">
            <TableHeader className="">
              <TableRow>
                <TableHead className="w-[30px] p-1 h-8">No</TableHead>
                <TableHead className="p-1 w-40 h-8">Year</TableHead>
                {yeartype.length > 0 &&
                  yeartype[0].filetypelist.map(
                    (filetype: any, index: number) => (
                      <TableHead
                        key={`header-filetype-${index}`}
                        className="p-1 w-40 h-8 text-xs text-center"
                      >
                        {filetype.name}
                      </TableHead>
                    )
                  )}
              </TableRow>
            </TableHeader>
          </Table>
          <div className="max-h-[360px] overflow-y-scroll">
            <Table className="relative">
              <TableBody className="">
                {yeartype.map((year: any, index: number) => (
                  <TableRow
                    key={index}
                    className="cursor-pointer hover:bg-gray-100"
                    // onClick={async () => yearsearch(year.year)}
                  >
                    <TableCell className="font-medium p-1 w-[30px]">
                      {index + 1}
                    </TableCell>
                    <TableCell className="p-1 w-40">{year.year}</TableCell>
                    {year.filetypelist.map(
                      (filetype: any, filetypeIndex: number) => (
                        <TableCell
                          key={`year-${index}-filetype-${filetypeIndex}`}
                          className="p-1 w-40 text-center"
                        >
                          {filetype.filecount}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div> */}
        <div className="flex-1 bg-white p-2 rounded col-span-3 relative">
          <h3 className="text-lg bg-white text-center">
            Villages & File Count
          </h3>
          <div className="w-full h-[1px] bg-gray-200 mt-1"></div>
          <Table className="relative w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20px] p-1 h-8">No</TableHead>
                <TableHead className="p-1 w-40 h-8">Department Name</TableHead>
                <TableHead className="w-28 text-right bg p-1 h-8">
                  File-count
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          <div className="max-h-[360px] overflow-y-scroll">
            <Table className="relative w-full">
              <TableBody className="">
                {departmentFile.map((department: any, index: number) => (
                  <TableRow
                    key={index}
                    // onClick={() => departmentsearch(department.id)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <TableCell className="font-medium p-1 w-[20px]">
                      {index + 1}
                    </TableCell>
                    <TableCell className="p-1 w-40">
                      {department.name}
                    </TableCell>
                    <TableCell className="p-1 text-right w-28">
                      {department.filecount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex-1 bg-white p-2 rounded col-span-3">
          <h3 className="text-lg text-center">File Type & File Count</h3>
          <div className="w-full h-[1px] bg-gray-200 mt-1"></div>
          <Table className="relative">
            <TableHeader className="">
              <TableRow>
                <TableHead className="w-[20px] p-1 h-8">No</TableHead>
                <TableHead className="p-1 w-40 h-8">Name</TableHead>
                <TableHead className="w-28 text-right bg p-1 h-8">
                  File-count
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          <div className="max-h-[360px] overflow-y-scroll">
            <Table className="relative">
              <TableBody className="">
                {typeFile
                  .filter((types: any) => types.id !== 11)
                  .map((types: any, index: number) => (
                    <TableRow
                      key={types.id}
                      // onClick={() => filetypesearch(types.id)}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <TableCell className="font-medium p-1">
                        {index + 1}
                      </TableCell>
                      <TableCell className="p-1">{types.name}</TableCell>
                      <TableCell className="p-1 text-right">
                        {types.filecount}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-4 mt-4">
        <div className="flex-1 bg-white p-2 rounded col-span-6">
          <h3 className="text-lg text-center">Village & File Types</h3>
          <div className="w-full h-[1px] bg-gray-200 mt-1"></div>
          <Table className="relative">
            <TableHeader className="">
              <TableRow>
                <TableHead className="w-[30px] p-1 h-8">No</TableHead>
                <TableHead className="p-1 w-40 h-8 whitespace-nowrap">
                  File Type
                </TableHead>
                {villagetype.length > 0 &&
                  villagetype[0].villagefiletypelist.map(
                    (filetype: any, index: number) => (
                      <TableHead
                        key={`village-header-filetype-${index}`}
                        className="p-1 w-40 h-8 text-xs text-center"
                      >
                        {filetype.name}
                      </TableHead>
                    )
                  )}
              </TableRow>
            </TableHeader>
          </Table>
          <div className="max-h-[360px] overflow-y-scroll">
            <Table className="relative">
              <TableBody className="">
                {villagetype.map((village: any, index: number) => (
                  <TableRow
                    key={index}
                    className="cursor-pointer hover:bg-gray-100"
                    // onClick={() => villagesearch(village.id)}
                  >
                    <TableCell className="font-medium p-1 w-[30px]">
                      {index + 1}
                    </TableCell>
                    <TableCell className="p-1 w-40">
                      {village.filetype}
                    </TableCell>
                    {village.villagefiletypelist.map(
                      (filetype: any, filetypeIndex: number) => (
                        <TableCell
                          key={`village-${index}-filetype-${filetypeIndex}`}
                          className="p-1 w-40 text-center"
                        >
                          {filetype.filecount}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {search && (
        <Card className="mt-6">
          <CardHeader className="py-2 px-4 flex flex-row items-center">
            <h1 className="text-xl">File Result</h1>
            <div className="grow"></div>

            <div className="flex items-center bg-gray-100 rounded-md pl-2">
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
            </div>
          </CardHeader>
          {isSearch ? (
            paginationsearch.paginatedItems.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">File Id</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Survey Number</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>File Type</TableHead>
                      <TableHead>Village</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginationsearch.paginatedItems.map((val: any) => (
                      <TableRow key={val.id}>
                        <TableCell className="font-medium">
                          {val.file_id}
                        </TableCell>
                        <TableCell>{val.applicant_name}</TableCell>
                        <TableCell>{val.survey_number}</TableCell>
                        <TableCell>{val.year}</TableCell>
                        <TableCell>{val.type.name}</TableCell>
                        <TableCell>{val.village.name}</TableCell>
                        <TableCell>
                          <Link
                            target="_blank"
                            className="py-1 px-4 bg-[#172f57] text-white text-lg rounded-md"
                            href={`/dashboard/viewfile/${val.id}`}
                          >
                            View
                          </Link>
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
          ) : search && searchData.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">File Id</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Survey Number</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>File Type</TableHead>
                    <TableHead>Village</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagination.paginatedItems.map((val: any) => (
                    <TableRow key={val.id}>
                      <TableCell className="font-medium">
                        {val.file_id}
                      </TableCell>
                      <TableCell>{val.applicant_name}</TableCell>
                      <TableCell>{val.survey_number}</TableCell>
                      <TableCell>{val.year}</TableCell>
                      <TableCell>{val.type.name}</TableCell>
                      <TableCell>{val.village.name}</TableCell>
                      <TableCell>
                        <Link
                          target="_blank"
                          className="py-1 px-4 bg-[#172f57] text-white text-lg rounded-md"
                          href={`/dashboard/viewfile/${val.id}`}
                        >
                          View
                        </Link>
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
          )}

          {isSearch
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
              )}
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
