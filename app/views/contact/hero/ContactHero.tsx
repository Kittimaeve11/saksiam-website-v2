"use client";

import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import {
    getCachedContactCoverImage,
    getContactCoverImage,
} from "@/app/Utils/contactHero";
import ContactForm from "../form/ContactForm";

type Props = {
    onErrorChange?: (count: number) => void;
};

export default function ContactHero({ onErrorChange }: Props) {
    const [coverImage, setCoverImage] = useState(getCachedContactCoverImage);

    useEffect(() => {
        let active = true;

        getContactCoverImage().then((image) => {
            if (active) setCoverImage(image);
        });

        return () => {
            active = false;
        };
    }, []);

    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                overflow: "hidden",
                minHeight: { xs: "auto", lg: 1100, xl: 1050 },
                pb: { xs: 4, lg: 0 },
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    height: { xs: "auto", lg: "100%" },
                    position: { xs: "relative", lg: "absolute" },
                    inset: { lg: 0 },
                    top: { lg: 0 },
                    bottom: { lg: 0 },
                    overflow: "hidden", 
                    aspectRatio: { xs: "2530 / 1412", lg: "auto" },

                    backgroundColor: "#d8e2ee",
                }}
            >
                <Box
                    component="img"
                    src={coverImage}
                    alt=""
                    draggable={false}
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "left top",
                        display: "block",
                        userSelect: "none",
                        WebkitUserDrag: "none",
                    }}
                />
            </Box>

            <Box
                sx={{
                    maxWidth: "lg",
                    mx: "auto",
                    position: "relative",
                    zIndex: 1,
                    px: { xs: 3, sm: 4, lg: 6 },
                    pt: { xs: 0, lg: "90px" },
                    minHeight: { lg: "100%" },
                }}
            >
                <ContactForm onErrorChange={onErrorChange} />
            </Box>
        </Box>
    );
}
