"use client";

/* ====================================================== */
import Pagination from "@/app/components/ui/Pagination/Pagination";

/* ====================================================== */
type Props = {
  page: number;
  totalPages: number;
  setPage: (val: number) => void;
};

/* ====================================================== */
export default function NewsPagination({
  page,
  totalPages,
  setPage,
}: Props) {
  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      onChange={setPage}
    />
  );
}