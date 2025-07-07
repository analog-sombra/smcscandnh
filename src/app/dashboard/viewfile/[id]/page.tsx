"use server";

import { cookies } from "next/headers";
import ViewFile from "./viewfile";

const ViewFilePage = ({ params }: any) => {
  const fileid = params.id;

  return <ViewFile fileid={fileid} />;
};
export default ViewFilePage;
