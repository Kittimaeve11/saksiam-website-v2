"use client";

/* ======================================================
   IMPORT
====================================================== */
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

/* ======================================================
   TYPE
====================================================== */
type BreadcrumbItem = {
  label: string;
  type?: "link" | "back" | "current";
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

/* ======================================================
   COMPONENT
====================================================== */
export default function Breadcrumb({ items }: Props) {
  const router = useRouter();

  /* ======================================================
     HANDLER
  ====================================================== */
  const handleClick = (item: BreadcrumbItem) => {
    if (item.type === "back") {
      router.back();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <Box
      sx={{
        px: 20,
        py: 3,
        borderRadius: "8px",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          fontSize: "16px",
          color: "var(--main-blue-400)",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* TEXT */}
              <Box
                component="span"
                onClick={() => handleClick(item)}
                sx={{
                  cursor: item.type !== "current" ? "pointer" : "default",
                  color:
                    item.type === "current"
                      ? "var(--main-blue-300)"
                      : "inherit",
                  fontWeight: item.type === "current" ? 500 : 400,
                }}
              >
                {item.label}
              </Box>

              {/* ARROW */}
              {!isLast && (
                <Box
                  component="span"
                  sx={{ mx: 0.5, opacity: 0.6, display: "flex" }}
                >
                  <MdKeyboardDoubleArrowRight />
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}