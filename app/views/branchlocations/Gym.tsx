import { dataBranchType } from '@/app/Utils/branchType';
import { logAction } from '@/app/api/logAction';
import BasicDropDownselete from '@/app/components/form/BasicDropDownselete'
import TextButton from '@/app/components/ui/Button/TextButton';
import { useLocale } from '@/app/providers/LocaleContext';
import { formatDistance } from '@/app/Utils/Format/format-distance';
import { branchlocationsItem } from '@/app/Utils/type';
import { Box, Card, Typography } from '@mui/material'
import React, { useState } from 'react'

interface GymProps {
  selectedBranch: number | null;
  setSelectedBranch: (id: number | null) => void;
  branches: branchlocationsItem[];
  onSearchNear: () => void;
  onSelectItem: (branch: branchlocationsItem) => void;
  hasSearched: boolean;
  loading: boolean;
}

const Gym: React.FC<GymProps> = ({
  selectedBranch,
  setSelectedBranch,
  branches,
  onSearchNear,
  onSelectItem,
  hasSearched,
  loading
}) => {
  const { messages } = useLocale();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const getTitle = (item: branchlocationsItem) => {
    const type = Number(item.type);

    const label = dataBranchType.find(t => t.id === type)?.labelname || "";

    return type === 1 || type === 2
      ? `${label}${item.name}`.trim()
      : item.name;
  };
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}

    >
      <BasicDropDownselete
        selecte={selectedBranch}
        setSelected={(value) => {
          // 🔥 รองรับทั้ง function และ value
          const newValue =
            typeof value === "function" ? value(selectedBranch) : value;

          setSelectedBranch(newValue);
        }}
        nameroutes="branchapi"
        topon={1}
        titlename={messages.branch.province}
      />

      <Typography
        variant="body1"
        sx={{ my: 1, textAlign: "center" }}
      >
        {messages.branch.or}
      </Typography>

      <TextButton
        onClick={onSearchNear}
      >
        {messages.branch.search}
      </TextButton>

      <Box
        sx={{
          mt: 2,
          maxHeight: 500,
          overflowY: "auto",
          overscrollBehavior: "contain",

          // 🔥 Chrome, Edge, Safari
          "&::-webkit-scrollbar": {
            width: "6px", // 👉 ปรับขนาดตรงนี้
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(0,0,0,0.4)",
          },

          // 🔥 Firefox
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0,0,0,0.2) transparent",
        }}
      >
        {/* 🔄 Loading */}
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <Box key={i} sx={{ p: 1, borderBottom: '1px solid #eee' }}>
                <Typography sx={{ bgcolor: '#eee', height: 20, mb: 1 }} />
                <Typography sx={{ bgcolor: '#eee', height: 15, width: '70%' }} />
              </Box>
            ))}
          </>
        ) : !hasSearched ? (
          ''
        ) : branches.length > 0 ? (
          // ✅ มีข้อมูล
          branches.map((item) => (
            // <Card
            //   variant="outlined"
            //   sx={{
            //     borderRadius: 7,
            //     display: 'flex',
            //     flexDirection: 'column',
            //     boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            //     overflow: 'hidden',
            //     transition: 'transform 0.2s, box-shadow 0.2s',
            //     border: 'transparent',
            //     gap: 1,
            //     width: '100%',
            //     position: 'relative',
            //     cursor: "pointer",

            //   }}
            //   onClick={() => {
            //     onSelectItem({
            //       ...item,
            //       lat: Number(item.lat),
            //       lng: Number(item.lng),
            //     });
            //   }}
            // >
            //   <Box
            //     sx={{
            //       position: "relative",
            //       width: "100%",

            //     }}
            //   >
            //     <Image
            //       src="/Branch/town.png"
            //       alt="Branch"
            //       width={80}
            //       height={120}
            //       priority   // 🔥 ตัวนี้สำคัญ

            //     />
            //   </Box>
            //   {/* <Typography>{item.name}</Typography>
            //   <Typography variant="body2">{item.address}</Typography> */}
            // </Card>
            <Card
              tabIndex={-1}
              variant="outlined"
              key={item.id}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                setSelectedId(item.id);

                onSelectItem({
                  ...item,
                  lat: Number(item.lat),
                  lng: Number(item.lng),
                });

                // 🔥 LOG
                await logAction({
                  actionType: "3",
                  actionDetail: `คลิกเลือกสาขา ${item.name}`,
                  typeUser: "ผู้เยี่ยมชมเว็บไซต์",
                  datatype: "สาขา",
                  dataID: String(item.id),
                  dataname: item.name,
                });
              }}
              sx={{
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: "0px 4px 12px rgba(0,0,0,0.12)",
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                alignItems: "flex-start",

                gap: 1,
                width: '100%',
                border: '1px solid  "var(--color-disabled-border)"',
                borderRadius: 3,
                position: "relative",
                mb: 1,
                cursor: "pointer"
                // backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
              }}
            >
              <Box sx={{
                display: "flex",
                px: 1,
                position: "relative",
              }}>
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: 24,
                    bottom: 24,
                    width: 4,
                    borderRadius: 2,
                    opacity: selectedId === item.id ? 1 : 0,
                    backgroundColor: "var(--main-yellow-500)", // เหลือง
                  }}
                />
                <Box
                  component="img"
                  src="/Branch/town.png" // 👉 เปลี่ยน path รูป
                  sx={{
                    width: 'auto',
                    height: 150,
                    objectFit: "contain",
                  }}
                />

                <Box sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  my: 2,
                  gap: 0.5, // 🔥 ระยะชิดขึ้น
                }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between", // 🔥 ดันไปขวา
                    }}
                  >
                    {/* 🔹 ชื่อ */}
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: "var(--light-blue-700)",
                        lineHeight: 1.2,
                      }}
                    >
                      {getTitle(item)}
                    </Typography>

                    {/* 🔹 ระยะทาง */}
                    {item.distance && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "var(--color-text-secondary)",
                          fontSize: 11,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatDistance(Number(item.distance))}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="caption" sx={{ color: "var(--color-text-secondary)", lineHeight: 1.2, }}>
                    {item.detail}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "var(--color-text-secondary)", lineHeight: 1.2, }}>
                    {item.address} ต.{item.districtname}  อ.{item.amphurname}  จ.{item.provincename} {item.zipcode}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <i
                      className="fi fi-sr-phone-call"
                      style={{
                        fontSize: 14,
                        color: "var(--light-blue-500)",

                        marginRight: 8,
                        display: "flex",
                        alignItems: "center",
                      }}
                    />
                    <Typography variant='body2' sx={{
                      color: "var(--light-blue-500)"
                      , fontWeight: 600, lineHeight: 1.2,
                    }}>
                      {item.tel}
                    </Typography>
                  </Box>

                </Box>

              </Box>
            </Card>
          ))
        ) : (
          // ❌ ค้นหาแล้วแต่ไม่มีข้อมูล
          <Typography align="center">ไม่พบข้อมูล</Typography>
        )}
      </Box>
    </Box>
  )
}

export default Gym
