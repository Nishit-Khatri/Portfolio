import { ImageResponse } from "next/og";
import { portfolioData } from "@/data/portfolioData";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  const { profile } = portfolioData;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0C0C0E",
          color: "#F4F4F2",
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            background: "#6C8BFF",
            color: "#0C0C0E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            fontWeight: 800,
          }}
        >
          NK
        </div>
        <div style={{ fontSize: 84, fontWeight: 800, marginTop: 40, letterSpacing: -3 }}>
          {profile.name}
        </div>
        <div style={{ fontSize: 40, color: "#8C8C94", marginTop: 12 }}>
          {profile.title}
        </div>
      </div>
    ),
    size
  );
}

