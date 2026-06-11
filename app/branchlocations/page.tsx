"use client";

import { Box, Container, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Breadcrumb from '../components/ui/Breadcrumb/Breadcrumb';
import { useLocale } from '../providers/LocaleContext';
import Gym from '../views/branchlocations/Gym';
import GoogleMapView from '../views/branchlocations/GoogleMapView';
import EachBanner from '../components/ui/Banner/EachBanner';
import { branchlocationsItem } from '../Utils/type';
import { apiFetch } from '../api/client';
import { logAction } from '../api/logAction';


const page = () => {
  const { messages } = useLocale();
  // selete Branch
  const [selectedBranch, setSelectedBranch] = useState<number | null>(0);
  // use location near
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  // check status between branch and location
  const [branches, setBranches] = useState<branchlocationsItem[]>([]);

  const [selectedMarker, setSelectedMarker] = useState<branchlocationsItem | null>(null);

  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================================
  // 🔥 function check
  // =========================================
  const buildQuery = () => {
    if (selectedBranch) {
      return `provinceid=${selectedBranch}`;
    }

    if (userLocation?.lat && userLocation?.lng) {
      return `lat=${userLocation.lat}&lng=${userLocation.lng}`;
    }

    return null;
  };

  // =========================================
  // 🔥 useEffect เดียว
  // =========================================
  useEffect(() => {
    const fetchData = async () => {
      const query = buildQuery();
      if (!query) return;
      setHasSearched(true);
      setLoading(true);
      try {
        const res = await apiFetch<any>(
          `/api/branchdataapi?${query}`
        );

        if (!res.status) {
          throw new Error(res.message || "API error");
        }

        setBranches(res.data?.data || []);
      } catch (err) {
        console.error("fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedBranch, userLocation]);

  // =========================================
  // 🔥 selected provinceid
  // =========================================
const handleSelectBranch = async (id: number | null) => {
  setBranches([]);
  setSelectedBranch(id);
  setUserLocation(null);
  setSelectedMarker(null);

  // 🔥 LOG
  await logAction({
    actionType: "2",
    actionDetail: `หน้าค้นหาสาขา เลือกจังหวัด ${id ?? "-"}`,
    typeUser: "ผู้เยี่ยมชมเว็บไซต์",
    datatype: "หน้าค้นหาสาขา",
    dataID: String(id ?? 0),
    dataname: String(id ?? "-"),
  });
};

  // =========================================
  // 🔥 Search Branch Near
  // =========================================
const handleSearchNear = () => {
  setSelectedMarker(null);

  if (!navigator.geolocation) {
    alert("Browser does not support Geolocation");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      setSelectedBranch(null);

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      setUserLocation({ lat, lng });

      // 🔥 LOG
      await logAction({
        actionType: "2",
        actionDetail: `หน้าค้นหาสาขา กดปุ่มใกล้ฉัน พิกัด (${lat}, ${lng})`,
        typeUser: "ผู้เยี่ยมชมเว็บไซต์",
        datatype: "หน้าค้นหาสาขา",
        dataID: "0",
        dataname: `lat:${lat},lng:${lng}`,
      });
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        alert("กรุณาเปิด Location ใน Browser");
      }
    }
  );
};

  return (
    <Box sx={{
      backgroundColor: 'white',
      minHeight: "100vh",
      backgroundSize: "100% auto",
    }}>

      <EachBanner
        num={1}
      />

      <Container maxWidth='xl'>

        <Breadcrumb
          items={[
            { label: messages.menu.home, type: "link", href: "/" },
            { label: messages.menu.back, type: "back" },
            { label: messages.menu.branch_finder, type: "current" },
          ]}

        />

        <Box sx={{ m: 2,mb:6 }}>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Gym
                selectedBranch={selectedBranch}
                setSelectedBranch={handleSelectBranch}
                branches={branches}
                onSearchNear={handleSearchNear}
                onSelectItem={setSelectedMarker}
                hasSearched={hasSearched}
                loading={loading}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 9 }}>
              <GoogleMapView
                branches={branches}
                selectedMarker={selectedMarker}
                onSelectMarker={setSelectedMarker}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}

export default page
