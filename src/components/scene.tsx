import Image from "next/image";
import type { SceneTheme } from "@/data/types";
import { cx } from "@/lib/format";

/**
 * Generated cover art. The agency has no photo library yet, so every card
 * renders a layered SVG landscape keyed to its theme rather than a grey box.
 * Swap in a real photograph by giving the card an `image` path — the components
 * prefer it and fall back to this.
 */

type ShapeFamily = "waves" | "peaks" | "skyline";

const SHAPES: Record<ShapeFamily, { back: string; front: string }> = {
  waves: {
    back: "M0 300 L0 252 C 70 240, 130 266, 205 253 C 275 241, 340 262, 400 248 L400 300 Z",
    front:
      "M0 300 L0 268 C 62 258, 118 282, 186 270 C 258 257, 328 280, 400 266 L400 300 Z",
  },
  peaks: {
    back: "M0 300 L0 238 L64 170 L104 208 L156 138 L212 204 L252 176 L306 218 L356 184 L400 228 L400 300 Z",
    front:
      "M0 300 L0 266 L48 222 L92 254 L142 206 L196 252 L244 224 L298 258 L348 230 L400 262 L400 300 Z",
  },
  skyline: {
    back: "M0 300 L0 214 L30 214 L30 178 L58 178 L58 208 L92 208 L92 152 L120 152 L120 192 L150 192 L150 166 L182 166 L182 202 L214 202 L214 146 L240 146 L240 196 L272 196 L272 172 L302 172 L302 206 L336 206 L336 182 L366 182 L366 212 L400 212 L400 300 Z",
    front:
      "M0 300 L0 250 L44 250 L44 226 L76 226 L76 254 L112 254 L112 232 L146 232 L146 258 L188 258 L188 228 L222 228 L222 252 L262 252 L262 234 L296 234 L296 256 L338 256 L338 238 L372 238 L372 258 L400 258 L400 300 Z",
  },
};

type ThemeSpec = {
  shape: ShapeFamily;
  sky: [string, string];
  sun: string;
  back: string;
  front: string;
  /** Horizontal sun position as a fraction of the viewBox width. */
  sunX: number;
  sunY: number;
};

const THEMES: Record<SceneTheme, ThemeSpec> = {
  coast: {
    shape: "waves",
    sky: ["#7dd3e8", "#d9f1f6"],
    sun: "#fff3d6",
    back: "#2775aa",
    front: "#154a73",
    sunX: 0.74,
    sunY: 0.28,
  },
  riviera: {
    shape: "waves",
    sky: ["#4bb6d6", "#bdeadf"],
    sun: "#ffe9b0",
    back: "#1b8fa8",
    front: "#12617a",
    sunX: 0.24,
    sunY: 0.24,
  },
  sunset: {
    shape: "waves",
    sky: ["#f7a94b", "#f6d9b4"],
    sun: "#fff1cf",
    back: "#d4620f",
    front: "#8d3c13",
    sunX: 0.62,
    sunY: 0.42,
  },
  alpine: {
    shape: "peaks",
    sky: ["#8fc6e8", "#e4f1f8"],
    sun: "#fdfaf0",
    back: "#4a92c5",
    front: "#154a73",
    sunX: 0.2,
    sunY: 0.22,
  },
  nordic: {
    shape: "peaks",
    sky: ["#9db6cc", "#e8eef3"],
    sun: "#f4f7fa",
    back: "#5d7c96",
    front: "#123c5d",
    sunX: 0.78,
    sunY: 0.3,
  },
  city: {
    shape: "skyline",
    sky: ["#f6c07a", "#fae6cd"],
    sun: "#fff6e3",
    back: "#b06a3a",
    front: "#123c5d",
    sunX: 0.7,
    sunY: 0.34,
  },
  metropolis: {
    shape: "skyline",
    sky: ["#3f6f9e", "#a8c6dd"],
    sun: "#ffe6b8",
    back: "#25547d",
    front: "#0f3049",
    sunX: 0.28,
    sunY: 0.26,
  },
};

export function Scene({
  theme,
  className,
  rounded = true,
}: {
  theme: SceneTheme;
  className?: string;
  rounded?: boolean;
}) {
  const spec = THEMES[theme];
  const shape = SHAPES[spec.shape];
  const id = `scene-${theme}`;

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={cx("h-full w-full", rounded && "rounded-[inherit]", className)}
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={spec.sky[0]} />
          <stop offset="100%" stopColor={spec.sky[1]} />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0%" stopColor={spec.sun} stopOpacity="0.95" />
          <stop offset="100%" stopColor={spec.sun} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="300" fill={`url(#${id}-sky)`} />
      <circle
        cx={400 * spec.sunX}
        cy={300 * spec.sunY}
        r="78"
        fill={`url(#${id}-glow)`}
      />
      <circle
        cx={400 * spec.sunX}
        cy={300 * spec.sunY}
        r="24"
        fill={spec.sun}
        opacity="0.9"
      />
      <path d={shape.back} fill={spec.back} opacity="0.85" />
      <path d={shape.front} fill={spec.front} />
    </svg>
  );
}

/** Scene plus a bottom scrim, so white text stays legible over any theme. */
export function SceneCover({
  theme,
  image,
  alt,
  className,
}: {
  theme: SceneTheme;
  image?: string;
  alt?: string;
  className?: string;
}) {
  return (
    <div className={cx("relative overflow-hidden bg-ocean-100", className)}>
      {image ? (
        // `fill` because the agency drops photos into /public at whatever size
        // they come out of the camera — we never know the intrinsic dimensions.
        <Image
          src={image}
          alt={alt ?? ""}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      ) : (
        <Scene theme={theme} rounded={false} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/70 via-ocean-950/10 to-transparent" />
    </div>
  );
}
