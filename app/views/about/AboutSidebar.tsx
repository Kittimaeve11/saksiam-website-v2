"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, ClickAwayListener, Paper, Typography } from "@mui/material";
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { useLocale } from "@/app/providers/LocaleContext";

export type AboutTabId =
  | "history"
  | "vision"
  | "org"
  | "board"
  | "subcommittee"
  | "skills";

type AboutSidebarProps = {
  active: AboutTabId;
  onChange: (id: AboutTabId) => void;
};

const menu: Array<{
  label: string;
  id: Exclude<AboutTabId, "subcommittee">;
  hasDropdown?: boolean;
}> = [
    { label: "ประวัติสินเชื่อศักดิ์สยาม", id: "history" },
    { label: "วิสัยทัศน์ และพันธกิจ", id: "vision" },
    { label: "โครงสร้างองค์กร", id: "org" },
    { label: "คณะกรรมการบริษัท", id: "board", hasDropdown: true },
    { label: "Board Skills Matrix", id: "skills" },
  ];

const mobileMenu: Array<{ label: string; id: AboutTabId }> = [
  { label: "ประวัติสินเชื่อศักดิ์สยาม", id: "history" },
  { label: "วิสัยทัศน์ และพันธกิจ", id: "vision" },
  { label: "โครงสร้างองค์กร", id: "org" },
  { label: "คณะกรรมการบริษัท", id: "board" },
  { label: "คณะกรรมการชุดย่อย", id: "subcommittee" },
  { label: "Board Skills Matrix", id: "skills" },
];

const getLineActiveId = (active: AboutTabId) =>
  active === "subcommittee" ? "board" : active;

export default function AboutSidebar({ active, onChange }: AboutSidebarProps) {
  const { messages } = useLocale();
  const [line, setLine] = useState({ left: 0, width: 0 });
  const lineRef = useRef(line);
  const previousActiveRef = useRef(active);
  const internalLineMoveRef = useRef(false);
  const [lineRounded, setLineRounded] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [dropdownX, setDropdownX] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const desktopScrollRef = useRef<HTMLDivElement | null>(null);
  const tablistRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const activeRef = useRef(active);
  const aboutLabels = messages.about;
  const menuItems = useMemo(
    () =>
      menu.map((item) => ({
        ...item,
        label:
          item.id === "history"
            ? aboutLabels.history
            : item.id === "vision"
              ? aboutLabels.vision_mission
              : item.id === "org"
                ? aboutLabels.organization_structure
                : item.id === "board"
                  ? aboutLabels.board_of_directors
                  : aboutLabels.board_skills_matrix,
      })),
    [aboutLabels]
  );
  const mobileMenuItems = useMemo(
    () =>
      mobileMenu.map((item) => ({
        ...item,
        label:
          item.id === "history"
            ? aboutLabels.history
            : item.id === "vision"
              ? aboutLabels.vision_mission
              : item.id === "org"
                ? aboutLabels.organization_structure
                : item.id === "board"
                  ? aboutLabels.board_of_directors
                  : item.id === "subcommittee"
                    ? aboutLabels.board_committees
                    : aboutLabels.board_skills_matrix,
      })),
    [aboutLabels]
  );
  const lineActiveId = getLineActiveId(active);
  const activeIndex = menuItems.findIndex((item) => item.id === lineActiveId);
  const isFirstActive = activeIndex === 0;
  const isLastActive = activeIndex === menuItems.length - 1;
  const activeMobileLabel =
    mobileMenuItems.find((item) => item.id === active)?.label || mobileMenuItems[0].label;

  const getTabLine = useCallback((index: number) => {
    const node = tabRefs.current[index];
    if (!node) return null;

    return {
      left: node.offsetLeft,
      width: node.offsetWidth,
    };
  }, []);

  const updateDropdownPosition = useCallback(() => {
    const boardIndex = menuItems.findIndex((item) => item.id === "board");
    const node = tabRefs.current[boardIndex];
    const tablist = tablistRef.current;
    const scroller = desktopScrollRef.current;
    if (!node) return;

    setDropdownX(
      (tablist?.offsetLeft || 0) +
      node.offsetLeft +
      node.offsetWidth / 2 -
      (scroller?.scrollLeft || 0)
    );
  }, [menuItems]);

  const updateScrollState = useCallback(() => {
    const scroller = desktopScrollRef.current;
    if (!scroller) return;

    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
    setCanScrollLeft(scroller.scrollLeft > 2);
    setCanScrollRight(scroller.scrollLeft < maxScrollLeft - 2);
    updateDropdownPosition();
  }, [updateDropdownPosition]);

  const scrollDesktopMenu = (direction: "left" | "right") => {
    const scroller = desktopScrollRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left: direction === "left" ? -260 : 260,
      behavior: "smooth",
    });
  };

  const clearLineTimers = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const setLineState = (nextLine: { left: number; width: number }) => {
    lineRef.current = nextLine;
    setLine(nextLine);
  };

  useEffect(() => {
    const previousActive = previousActiveRef.current;
    activeRef.current = active;

    const tablist = tablistRef.current;
    const scroller = desktopScrollRef.current;
    let frame = 0;
    let syncFrame = 0;

    const updateCurrentLine = () => {
      const currentId = getLineActiveId(activeRef.current);
      const currentIndex = menuItems.findIndex((item) => item.id === currentId);
      const nextLine = getTabLine(currentIndex);

      if (nextLine && (!internalLineMoveRef.current || !lineRef.current.width)) {
        setLineState(nextLine);
        updateDropdownPosition();
      }
    };

    frame = requestAnimationFrame(() => {
      const nextLine = getTabLine(activeIndex);
      const activeNode = tabRefs.current[activeIndex];

      if (nextLine) {
        const shouldSnapLine =
          !lineRef.current.width ||
          (previousActive !== active && !internalLineMoveRef.current);

        if (shouldSnapLine) {
          clearLineTimers();
          setLineState(nextLine);
          setLineRounded(true);
        }
      }

      activeNode?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });

      updateDropdownPosition();
      updateScrollState();
    });

    const observer = tablist ? new ResizeObserver(updateCurrentLine) : null;

    if (tablist) {
      observer?.observe(tablist);
      syncFrame = requestAnimationFrame(updateCurrentLine);
    }

    scroller?.addEventListener("scroll", updateScrollState, {
      passive: true,
    });
    window.addEventListener("resize", updateScrollState);
    updateScrollState();
    previousActiveRef.current = active;

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(syncFrame);
      observer?.disconnect();
      scroller?.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [active, activeIndex, getTabLine, menuItems, updateDropdownPosition, updateScrollState]);

  const moveLine = (nextIndex: number) => {
    const currentId = getLineActiveId(active);
    const currentIndex = menuItems.findIndex((item) => item.id === currentId);
    if (nextIndex === -1 || currentIndex === -1 || nextIndex === currentIndex) {
      return;
    }

    clearLineTimers();
    internalLineMoveRef.current = true;
    setLineRounded(false);

    const currentLine = line.width ? line : getTabLine(currentIndex);
    const nextLine = getTabLine(nextIndex);

    if (!currentLine || !nextLine) return;

    const currentRight = currentLine.left + currentLine.width;
    const nextRight = nextLine.left + nextLine.width;

    setLineState(
      nextIndex > currentIndex
        ? {
          left: currentLine.left,
          width: nextRight - currentLine.left,
        }
        : {
          left: nextLine.left,
          width: currentRight - nextLine.left,
        }
    );

    timeoutsRef.current.push(
      setTimeout(() => {
        setLineState(nextLine);
      }, 210),
      setTimeout(() => {
        setLineRounded(true);
      }, 430),
      setTimeout(() => {
        internalLineMoveRef.current = false;
      }, 460)
    );
  };

  const handleClick = (id: Exclude<AboutTabId, "subcommittee">) => {
    const nextIndex = menuItems.findIndex((item) => item.id === id);
    const item = menuItems[nextIndex];

    if (item?.hasDropdown) {
      updateDropdownPosition();
      setDropdownOpen((current) => !current);
      return;
    }

    setDropdownOpen(false);
    moveLine(nextIndex);
    onChange(id);
  };

  const handleSubCommitteeClick = () => {
    const boardIndex = menuItems.findIndex((item) => item.id === "board");
    moveLine(boardIndex);
    onChange("subcommittee");
    setDropdownOpen(false);
  };

  const handleBoardCommitteeClick = () => {
    const boardIndex = menuItems.findIndex((item) => item.id === "board");
    moveLine(boardIndex);
    onChange("board");
    setDropdownOpen(false);
  };

  const handleMobileClick = (id: AboutTabId) => {
    onChange(id);
    setMobileDropdownOpen(false);
  };

  return (
    <Box
      sx={{
        width: "100%",
        mb: { xs: 4, md: 6 },
        overflowX: "visible",
        pb: 1,
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <ClickAwayListener onClickAway={() => setMobileDropdownOpen(false)}>
        <Box
          sx={{
            display: "block",
            "@media (min-width:768px)": {
              display: "none",
            },
            width: "100%",
            maxWidth: { xs: 320, sm: 360 },
            mx: "auto",
            position: "relative",
            overflow: "visible",
          }}
        >
          <Box
            component="button"
            type="button"
            aria-expanded={mobileDropdownOpen}
            onClick={() => setMobileDropdownOpen((current) => !current)}
            sx={{
              width: "100%",
              minHeight: { xs: 48, sm: 52 },
              appearance: "none",
              border: "1px solid rgba(228, 231, 236, 0.9)",
              borderRadius: "999px",
              bgcolor: "#fff",
              // boxShadow: "0 10px 28px rgba(16, 24, 40, 0.12)",
              px: { xs: 2.5, sm: 3 },
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1.5,
              color: "var(--color-primary)",
              fontFamily: "inherit",
              fontSize: { xs: 15, sm: 16 },
              fontWeight: 800,
              lineHeight: 1.2,
              textAlign: "left",
            }}
          >
            <Box
              component="span"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {activeMobileLabel}
            </Box>
            <Box
              component={IoIosArrowDown}
              aria-hidden
              sx={{
                flex: "0 0 auto",
                fontSize: { xs: 16, sm: 18 },
                color: "var(--color-primary)",
                transform: mobileDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform .2s ease",
              }}
            />
          </Box>

          {mobileDropdownOpen && (
            <Paper
              elevation={0}
              sx={{
                position: "absolute",
                top: { xs: 56, sm: 60 },
                left: 0,
                right: 0,
                zIndex: 60,
                borderRadius: "16px",
                bgcolor: "#fff",
                border: "1px solid rgba(228, 231, 236, 0.76)",
                boxShadow: "0 18px 36px rgba(16, 24, 40, 0.16)",
                overflow: "hidden",
                py: 0.75,
              }}
            >
              {mobileMenuItems.map((item) => {
                const isActive = active === item.id;

                return (
                  <Box
                    key={item.id}
                    component="button"
                    type="button"
                    onClick={() => handleMobileClick(item.id)}
                    sx={{
                      width: "100%",
                      appearance: "none",
                      border: 0,
                      bgcolor: isActive ? "#EEF5FF" : "#fff",
                      color: isActive ? "var(--color-primary)" : "#2F2F2F",
                      cursor: "pointer",
                      px: { xs: 2.25, sm: 2.75 },
                      py: { xs: 1.35, sm: 1.5 },
                      fontFamily: "inherit",
                      fontSize: { xs: 14, sm: 15 },
                      fontWeight: isActive ? 800 : 600,
                      lineHeight: 1.35,
                      textAlign: "left",
                      transition: "background .2s ease, color .2s ease",
                      "&:hover": {
                        bgcolor: "#EEF5FF",
                        color: "var(--color-primary)",
                      },
                    }}
                  >
                    {item.label}
                  </Box>
                );
              })}
            </Paper>
          )}
        </Box>
      </ClickAwayListener>

      <ClickAwayListener onClickAway={() => setDropdownOpen(false)}>
        <Box
          sx={{
            display: "none",
            "@media (min-width:768px)": {
              display: "block",
            },
            position: "relative",
            overflow: "visible",
            px: {
              xs: canScrollLeft || canScrollRight ? 4.5 : 0,
              lg: 0,
            },
          }}
        >
          {canScrollLeft && (
            <Box
              component="button"
              type="button"
              aria-label="เลื่อนเมนูไปทางซ้าย"
              onClick={() => scrollDesktopMenu("left")}
              sx={{
                position: "absolute",
                left: 0,
                top: "50%",
                zIndex: 6,
                width: 34,
                height: 34,
                transform: "translateY(-50%)",
                border: 0,
                borderRadius: "50%",
                bgcolor: "#fff",
                color: "var(--color-primary)",
                boxShadow: "0 10px 24px rgba(16, 24, 40, 0.16)",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                "@media (min-width:1200px)": {
                  display: "none",
                },
              }}
            >
              <Box component={IoIosArrowBack} sx={{ fontSize: 20 }} />
            </Box>
          )}

          {canScrollRight && (
            <Box
              component="button"
              type="button"
              aria-label="เลื่อนเมนูไปทางขวา"
              onClick={() => scrollDesktopMenu("right")}
              sx={{
                position: "absolute",
                right: 0,
                top: "50%",
                zIndex: 6,
                width: 34,
                height: 34,
                transform: "translateY(-50%)",
                border: 0,
                borderRadius: "50%",
                bgcolor: "#fff",
                color: "var(--color-primary)",
                boxShadow: "0 10px 24px rgba(16, 24, 40, 0.16)",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                "@media (min-width:1200px)": {
                  display: "none",
                },
              }}
            >
              <Box component={IoIosArrowForward} sx={{ fontSize: 20 }} />
            </Box>
          )}

          <Box
            ref={desktopScrollRef}
            onScroll={updateScrollState}
            sx={{
              width: "100%",
              maxWidth: "100%",
              overflowX: "auto",
              overflowY: "hidden",
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <Box
              ref={tablistRef}
              role="tablist"
              sx={{
                width: { xs: "max-content", lg: "100%" },
                minWidth: { xs: "860px", lg: 0 },
                minHeight: { xs: 56, md: 64 },
                mx: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                overflow: "hidden",
                borderRadius: "999px",
                bgcolor: "#FFFFFF",
                border: "1px solid rgba(228, 231, 236, 0.72)",
                // boxShadow: "0 18px 40px rgba(16, 24, 40, 0.12)",
                position: "relative",
              }}
            >
              <Box
                aria-hidden
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: line.width,
                  transform: `translateX(${line.left}px)`,
                  borderBottom: "3px solid var(--color-info)",
                  borderRadius:
                    lineRounded && isFirstActive
                      ? "999px 0 0 999px"
                      : lineRounded && isLastActive
                        ? "0 999px 999px 0"
                        : 0,
                  opacity: line.width ? 1 : 0,
                  transition:
                    "transform .42s cubic-bezier(.22,1,.36,1), width .42s cubic-bezier(.22,1,.36,1), border-radius .34s ease",
                  zIndex: 3,
                  pointerEvents: "none",
                }}
              />

            {menuItems.map((item, index) => {
              const isActive = lineActiveId === item.id;
              const isFirst = index === 0;
              const isLast = index === menuItems.length - 1;

              return (
                <Box
                  key={item.id}
                  component="button"
                  ref={(node: HTMLButtonElement | null) => {
                    tabRefs.current[index] = node;
                  }}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleClick(item.id)}
                  sx={{
                    appearance: "none",
                    border: 0,
                    background: isActive ? "#FFFFFF" : "transparent",
                    flex: 1,
                    alignSelf: "stretch",
                    minWidth: 0,
                    px: { xs: 2.5, md: 3 },
                    cursor: "pointer",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background .25s ease, color .25s ease",
                    borderRadius: isActive
                      ? isFirst
                        ? "999px 0 0 999px"
                        : isLast
                          ? "0 999px 999px 0"
                          : 0
                      : 0,
                    "&:hover": {
                      background: "#FFFFFF",
                    },
                    "&:focus-visible": {
                      outline: "3px solid rgba(47, 128, 237, 0.25)",
                      outlineOffset: "-3px",
                    },
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      color: isActive ? "var(--color-primary)" : "#2F2F2F",
                      fontSize: { xs: 15, md: 18 },
                      fontWeight: 700,
                      lineHeight: 1.2,
                      whiteSpace: "nowrap",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <Box
                        component={IoIosArrowDown}
                        aria-hidden
                        sx={{
                          fontSize: { xs: 14, md: 16 },
                          transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform .2s ease",
                        }}
                      />
                    )}
                  </Typography>

                  {index !== menuItems.length - 1 && (
                    <Box
                      aria-hidden
                      sx={{
                        position: "absolute",
                        right: 0,
                        top: "50%",
                        width: "1px",
                        height: { xs: 24, md: 28 },
                        transform: "translateY(-50%)",
                        bgcolor: "#D8DADC",
                      }}
                    />
                  )}
                </Box>
              );
            })}
            </Box>
          </Box>

          {dropdownOpen && (
            <Box
              sx={{
                position: "absolute",
                top: { xs: 68, md: 76 },
                left: dropdownX,
                transform: "translateX(-50%)",
                zIndex: 50,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -10,
                  left: "50%",
                  width: 0,
                  height: 0,
                  transform: "translateX(-50%)",
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderBottom: "13px solid #fff",
                  filter: "drop-shadow(0 -2px 1px rgba(16,24,40,0.03))",
                },
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  width: { xs: 230, md: 220 },
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  p: 1,
                  borderRadius: "14px",
                  bgcolor: "#fff",
                  textAlign: "left",
                  boxShadow: "0 20px 45px rgba(16,24,40,0.16)",
                  animation: "dropdownFade .18s ease-out",
                  "@keyframes dropdownFade": {
                    from: {
                      opacity: 0,
                      transform: "translateY(-6px)",
                    },
                    to: {
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                  },
                }}
              >
                <Box
                  component="button"
                  onClick={handleBoardCommitteeClick}
                  sx={{
                    width: "100%",
                    appearance: "none",
                    border: 0,
                    borderRadius: "10px",
                    bgcolor: active === "board" ? "#F0F0FD" : "transparent",
                    cursor: "pointer",
                    py: 1.5,
                    px: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    color: "var(--color-primary)",
                    fontSize: { xs: 16, md: 16 },
                    fontWeight: 700,
                    fontFamily: "inherit",
                    lineHeight: 1.3,
                    transition: "background .2s ease",
                    "&:hover": {
                      bgcolor: "#F0F0FD",
                    },
                  }}
                >
                  {aboutLabels.board_of_directors}
                </Box>

                <Box
                  component="button"
                  onClick={handleSubCommitteeClick}
                  sx={{
                    width: "100%",
                    appearance: "none",
                    border: 0,
                    borderRadius: "10px",
                    bgcolor: active === "subcommittee" ? "#F0F0FD" : "transparent",
                    cursor: "pointer",
                    py: 1.5,
                    px: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    color: "var(--color-primary)",
                    fontSize: { xs: 16, md: 16 },
                    fontWeight: 700,
                    fontFamily: "inherit",
                    lineHeight: 1.3,
                    transition: "background .2s ease",
                    "&:hover": {
                      bgcolor: "#F0F0FD",
                    },
                  }}
                >
                  {aboutLabels.board_committees}
                </Box>
              </Paper>
            </Box>
          )}
        </Box>
      </ClickAwayListener>
    </Box>
  );
}
