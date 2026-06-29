"use client";

import { Box, Typography, Collapse } from "@mui/material";
import { FaChevronDown } from "react-icons/fa";
import type { FaqItem } from "@/app/Utils/type";
import { useLocale } from "@/app/providers/LocaleContext";

type Props = {
  item: FaqItem;
  isOpen: boolean;
  onToggle: (id: string) => void;
  isLast?: boolean;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const hasHtml = (value: string) => /<\/?[a-z][\s\S]*>/i.test(value);

const withAnswerPrefix = (answer: string, label: string) => {
  const prefix = `<span class="faq-answer-prefix">${escapeHtml(label)} : </span>`;

  if (!answer) return prefix;

  if (!hasHtml(answer)) {
    return `<p>${prefix}${escapeHtml(answer).replace(/\n/g, "<br />")}</p>`;
  }

  if (/<p(\s[^>]*)?>/i.test(answer)) {
    return answer.replace(/<p(\s[^>]*)?>/i, (match) => `${match}${prefix}`);
  }

  return `<p>${prefix}</p>${answer}`;
};

export default function FaqCard({
  item,
  isOpen,
  onToggle,
  isLast,
}: Props) {
  const { messages, locale } = useLocale();

  const question = locale === "en" ? item.questionEN : item.questionTH;
  const answer = locale === "en" ? item.answersEN : item.answersTH;
  const answerHtml = withAnswerPrefix(answer, messages.faq.ask);

  return (
    <Box
      sx={{
        mb: isLast ? 0 : { xs: 1.75, sm: 2.25, md: 3 },
        borderRadius: { xs: "16px", sm: "18px", md: "20px" },
        background: "#fff",
        boxShadow: isLast
          ? "none"
          : {
              xs: "0 8px 18px rgba(16,24,40,0.07)",
              md: "0 12px 30px rgba(0,0,0,0.08)",
            },
        border: "1px solid rgba(216, 218, 220, 0.9)",
        boxSizing: "border-box",
        overflow: "hidden",
        transition: "box-shadow .3s ease, transform .3s ease, border-color .3s ease",
        "&:hover": {
          borderColor: "rgba(91, 141, 237, 0.42)",
          boxShadow: isLast
            ? "none"
            : "0 16px 34px rgba(20, 52, 104, 0.12)",
        },
      }}
    >
      <Box
        onClick={() => onToggle(item.id)}
        sx={{
          px: { xs: 2, sm: 2.5, md: 4 },
          py: { xs: 2, sm: 2.25, md: 3 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: { xs: 1.5, sm: 2, md: 3 },
          cursor: "pointer",
          minHeight: { xs: 72, sm: 82, md: 92 },
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: { xs: 15.5, sm: 16.5, md: 18 },
            color: "var(--light-blue-700)",
            lineHeight: { xs: 1.55, md: 1.6 },
            pr: { xs: 0.5, md: 2 },
            flex: 1,
            overflowWrap: "anywhere",
          }}
        >
          {question}
        </Typography>

        <Box
          sx={{
            width: { xs: 36, sm: 40, md: 42 },
            height: { xs: 36, sm: 40, md: 42 },
            minWidth: { xs: 36, sm: 40, md: 42 },
            borderRadius: "50%",
            background: "var(--light-blue-400)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 18px rgba(91, 141, 237, 0.24)",
            flexShrink: 0,
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

      <Collapse in={isOpen} timeout={300} unmountOnExit>
        <Box
          sx={{
            px: { xs: 2, sm: 2.5, md: 4 },
            pb: { xs: 2.25, sm: 2.5, md: 3 },
            pt: { xs: 0, md: 1 },
          }}
        >
          <Box
            className="faq-rich-text"
            dangerouslySetInnerHTML={{ __html: answerHtml }}
            sx={{
              color: "var(--gray-500)",
              lineHeight: { xs: 1.75, md: 1.7 },
              fontSize: { xs: 15, sm: 15.5, md: 16 },
              overflowWrap: "anywhere",
              "& .faq-answer-prefix": {
                color: "var(--gray-500)",
                fontWeight: 600,
              },
              "& p": {
                mt: 0,
                mb: 1.25,
              },
              "& p:last-child": {
                mb: 0,
              },
              "& ol, & ul": {
                mt: 0.5,
                mb: 0,
                pl: 3,
              },
              "& li": {
                mb: 0.6,
              },
              "& li p": {
                display: "inline",
                m: 0,
              },
              "& a": {
                color: "var(--color-primary)",
                fontWeight: 700,
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                transition: "color .2s ease",
              },
              "& a:hover": {
                color: "var(--color-primary-hover)",
              },
            }}
          />
        </Box>
      </Collapse>
    </Box>
  );
}
