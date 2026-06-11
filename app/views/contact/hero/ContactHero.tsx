"use client";

import { Box } from "@mui/material";
import ContactForm from "../form/ContactForm";

type Props = {
    onErrorChange?: (count: number) => void;
};

export default function ContactHero({ onErrorChange }: Props) {
    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                overflow: "hidden",
                minHeight: { xs: "auto", md: 1100, lg: 1100, xl: 1050 },
                pb: { xs: 4, md: 0 },
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    height: { xs: "auto", md: "100%" },
                    position: { xs: "relative", md: "absolute" },
                    inset: { md: 0 },
                    top: { md: 0 },
                    bottom: { md: 0 },
                    overflow: "hidden",
                    aspectRatio: { xs: "2530 / 1412", md: "auto" },
                    backgroundColor: "#d8e2ee",
                    backgroundImage: "url('/company/SAKsiam.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                    backgroundRepeat: "no-repeat",
                }}
            />

            <Box
                sx={{
                    maxWidth: "lg",
                    mx: "auto",
                    position: "relative",
                    zIndex: 1,
                    px: { xs: 4, md: 6 },
                    pt: { xs: 0, md: "90px" },
                    minHeight: { md: "100%" },
                }}
            >
                <ContactForm onErrorChange={onErrorChange} />
            </Box>
        </Box>
    );
}
