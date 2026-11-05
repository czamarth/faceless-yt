import React from 'react';
import type {Segment} from './CorporateShort';
import {NEVER, font, ramp, sm} from './ConceptShorts';
import {BLUE, INK, pop} from './WatermelonShort';

// Sdílené kousky pro díly ročního plánu (W03+).

export const ease = (t: number, a: number, b: number) => sm(ramp(t, a, b));

// n-tý výskyt věty (0 = první), když se text segmentu v díle opakuje
export const nthCue = (segs: Segment[], re: RegExp, n: number) => segs.filter((s) => re.test(s.text))[n]?.start ?? NEVER;

// Závěrečné razítko kanálu (poslední ~0,6 s)
export const ChannelStamp: React.FC<{t: number; total: number; y?: number}> = ({t, total, y = 1290}) => {
	const s = pop(t, total - 0.1, 0.3);
	if (s <= 0) return null;
	return (
		<g transform={`translate(540 ${y}) rotate(-6) scale(${s * 0.7})`}>
			<rect x="-440" y="-62" width="880" height="124" rx="16" fill="#fff" stroke={BLUE} strokeWidth="8" />
			<text x="0" y="16" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="46" letterSpacing="4" fill={BLUE}>
				THIS COULD HAVE BEEN A SHORT
			</text>
		</g>
	);
};

// Razítko pointy: jeden nebo dva řádky, pop při času `at`
export const PunchStamp: React.FC<{t: number; at: number; lines: string[]; color: string; y?: number; size?: number; rot?: number}> = ({
	t,
	at,
	lines,
	color,
	y = 800,
	size = 84,
	rot = -5,
}) => {
	const s = pop(t, at, 0.45);
	if (s <= 0) return null;
	const h = lines.length * size * 1.15 + 90;
	const w = Math.max(...lines.map((l) => l.length)) * size * 0.64 + 90;
	return (
		<g transform={`translate(540 ${y}) rotate(${rot}) scale(${Math.min(s, 1.08)})`}>
			<rect x={-w / 2} y={-h / 2} width={w} height={h} rx="26" fill="#fff" stroke={color} strokeWidth="12" />
			{lines.map((l, i) => (
				<text
					key={l}
					x="0"
					y={-h / 2 + 45 + size * 0.95 + i * size * 1.15}
					textAnchor="middle"
					fontFamily={font}
					fontWeight="900"
					fontSize={size}
					letterSpacing="2"
					fill={color}
				>
					{l}
				</text>
			))}
		</g>
	);
};

// Zaoblená štítek-pilulka (sdílená)
export const Pill: React.FC<{x?: number; y: number; w: number; label: string; color?: string; fill?: string; o?: number; fs?: number; textColor?: string}> = ({
	x = 540,
	y,
	w,
	label,
	color = INK,
	fill = '#F4F1EA',
	o = 1,
	fs = 34,
	textColor,
}) =>
	o > 0.01 ? (
		<g opacity={o} transform={`translate(${x} ${y})`}>
			<rect x={-w / 2} y="-34" width={w} height="68" rx="34" fill={fill} stroke={color} strokeWidth="5" />
			<text x="0" y={fs * 0.36} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize={fs} letterSpacing="3" fill={textColor ?? color}>
				{label}
			</text>
		</g>
	) : null;

export const Sticky: React.FC<{
	x: number;
	y: number;
	w: number;
	rot?: number;
	color?: string;
	text?: string;
	fs?: number;
	o?: number;
	s?: number;
	ring?: string;
}> = ({x, y, w, rot = 0, color = '#FFD84D', text, fs = 30, o = 1, s = 1, ring}) => (
	<g opacity={o} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
		<rect x={-w / 2 + 5} y={-w / 2 + 9} width={w} height={w} rx="5" fill="rgba(27,31,42,0.2)" />
		<rect x={-w / 2} y={-w / 2} width={w} height={w} rx="5" fill={color} stroke={ring} strokeWidth={ring ? 6 : 0} />
		<rect x={-w * 0.16} y={-w / 2 - 8} width={w * 0.32} height="18" rx="4" fill="rgba(255,255,255,0.55)" />
		{text ? (
			<text x="0" y={fs * 0.35} textAnchor="middle" fontFamily="'Segoe Print', 'Comic Sans MS', cursive" fontWeight="700" fontSize={fs} fill={INK}>
				{text}
			</text>
		) : (
			[-0.14, 0.04, 0.2].map((k, i) => (
				<rect key={i} x={-w * 0.32} y={w * k} width={w * (i === 2 ? 0.34 : 0.64)} height={Math.max(4, w * 0.06)} rx="3" fill={INK} opacity="0.22" />
			))
		)}
	</g>
);
