"use client";

import { useEffect } from "react";

export default function useLockPageScroll(locked: boolean) {
    useEffect(() => {
        if (!locked) return;

        const scrollY = window.scrollY;
        const body = document.body;
        const html = document.documentElement;
        const previousBodyStyle = {
            overflow: body.style.overflow,
            position: body.style.position,
            top: body.style.top,
            left: body.style.left,
            right: body.style.right,
            width: body.style.width,
        };
        const previousHtmlOverflow = html.style.overflow;

        html.style.overflow = "hidden";
        body.style.overflow = "hidden";
        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.left = "0";
        body.style.right = "0";
        body.style.width = "100%";

        return () => {
            html.style.overflow = previousHtmlOverflow;
            body.style.overflow = previousBodyStyle.overflow;
            body.style.position = previousBodyStyle.position;
            body.style.top = previousBodyStyle.top;
            body.style.left = previousBodyStyle.left;
            body.style.right = previousBodyStyle.right;
            body.style.width = previousBodyStyle.width;
            window.scrollTo(0, scrollY);
        };
    }, [locked]);
}
