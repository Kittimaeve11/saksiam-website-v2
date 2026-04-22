"use client";

/* ====================================================== */
import { Box, Typography, Collapse } from "@mui/material";
import { FaChevronDown } from "react-icons/fa";

/* 🔥 i18n */
import { useLocale } from "@/app/providers/LocaleContext";

/* ====================================================== */
type FAQ = {
  id: number;
  category: "loan" | "contact";
  questionTH: string;
  questionEN: string;
  answerTH: string;
  answerEN: string;
};

type Props = {
  item: FAQ;
  isOpen: boolean;
  onToggle: (id: number) => void;
  isLast?: boolean;
};

/* ====================================================== */
export default function FaqCard({
  item,
  isOpen,
  onToggle,
  isLast,
}: Props) {
  const { messages, locale } = useLocale();

  /* ======================================================
     🔥 เลือกภาษา
  ====================================================== */
  const question =
    locale === "en" ? item.questionEN : item.questionTH;

  const answer =
    locale === "en" ? item.answerEN : item.answerTH;

  return (
    <Box
      sx={{
        mb: isLast ? 0 : 3,
        borderRadius: "20px",
        background: "#fff",

        boxShadow: isLast
          ? "none"
          : "0 12px 30px rgba(0,0,0,0.08)",

        border: "1px solid var(--gray-100)",
        boxSizing: "border-box",
        overflow: "hidden",
        transition: "0.3s",
      }}
    >
      {/* ======================================================
         🔥 HEADER
      ====================================================== */}
      <Box
        onClick={() => onToggle(item.id)}
        sx={{
          px: 4,
          py: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "18px",
            color: "var(--light-blue-700)",
          }}
        >
          {question}
        </Typography>

        {/* 🔥 ICON */}
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "var(--light-blue-400)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaChevronDown
            size={16}
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </Box>
      </Box>

      {/* ======================================================
         🔥 BODY
      ====================================================== */}
      <Collapse in={isOpen} timeout={300} unmountOnExit>
        <Box
          sx={{
            px: 4,
            pb: 3,
            pt: 1,
          }}
        >
          <Typography
            sx={{
              color: "var(--gray-500)",
              lineHeight: 1.7,
              whiteSpace: "pre-line", // 🔥 สำคัญ (ขึ้นบรรทัด)
            }}
          >
            <Box
              component="span"
              sx={{
                color: "var(--gray-500)",
                mr: 1,
              }}
            >
              {messages.faq.ask} :
            </Box>
            {answer}
          </Typography>
        </Box>
      </Collapse>
    </Box>
  );
}