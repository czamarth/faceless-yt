import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Sequence,
	interpolate,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

export type Segment = {
	text: string;
	start: number;
	end: number;
	para: number;
	last: boolean;
};

export type ShortProps = {
	totalSeconds: number;
	audio: string;
	segments: Segment[];
};

const font = 'Segoe UI, Arial, sans-serif';
const NAVY = '#0a1a33';
const TEAL = '#2dd4bf';

// Korporátní pozadí: tmavě modrý přechod, pomalu plující záře, jemná mřížka a diagonální tvary.
const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const t = frame / 30;
	const glow = (cx: number, cy: number, r: number, color: string, ax: number, ay: number, ph: number) => (
		<div
			style={{
				position: 'absolute',
				left: cx + Math.sin(t * ax + ph) * 120 - r,
				top: cy + Math.cos(t * ay + ph) * 160 - r,
				width: r * 2,
				height: r * 2,
				borderRadius: '50%',
				background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
			}}
		/>
	);
	const drift = (t * 12) % 120;
	return (
		<AbsoluteFill style={{background: `linear-gradient(160deg, ${NAVY} 0%, #10305a 55%, #0b2a4a 100%)`}}>
			{glow(width * 0.8, height * 0.2, 520, 'rgba(45,212,191,0.22)', 0.25, 0.19, 0)}
			{glow(width * 0.1, height * 0.75, 620, 'rgba(59,130,246,0.28)', 0.17, 0.23, 2)}
			<svg width={width} height={height} style={{position: 'absolute', inset: 0, opacity: 0.12}}>
				<defs>
					<pattern id="g" width="120" height="120" patternUnits="userSpaceOnUse">
						<path d="M 120 0 L 0 0 0 120" fill="none" stroke="#9ec5ff" strokeWidth="1" />
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill="url(#g)" transform={`translate(0 ${drift})`} />
			</svg>
			<div
				style={{
					position: 'absolute',
					left: -200,
					top: height * 0.55 + Math.sin(t * 0.3) * 30,
					width: width + 400,
					height: 260,
					background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.05), rgba(255,255,255,0))',
					transform: 'rotate(-14deg)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: -200,
					top: height * 0.18 + Math.cos(t * 0.25) * 30,
					width: width + 400,
					height: 140,
					background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(45,212,191,0.06), rgba(255,255,255,0))',
					transform: 'rotate(-14deg)',
				}}
			/>
		</AbsoluteFill>
	);
};

const Caption: React.FC<{seg: Segment}> = ({seg}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
	const y = interpolate(frame, [0, 10], [22, 0], {extrapolateRight: 'clamp'});
	const hook = seg.para <= 2;
	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 140}}>
			<div
				style={{
					width: 880,
					textAlign: 'center',
					fontFamily: font,
					fontWeight: 700,
					fontSize: hook ? 96 : seg.text.length > 110 ? 62 : 74,
					lineHeight: 1.22,
					color: seg.last ? TEAL : 'white',
					opacity: o,
					transform: `translateY(${y}px)`,
					textShadow: '0 4px 24px rgba(0,0,0,0.45)',
				}}
			>
				{seg.text}
			</div>
		</AbsoluteFill>
	);
};

const Progress: React.FC<{total: number}> = ({total}) => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	const w = Math.min(1, frame / total) * width;
	return (
		<div style={{position: 'absolute', left: 0, top: 0, width: w, height: 8, background: TEAL}} />
	);
};

export const CorporateShort: React.FC<ShortProps> = ({totalSeconds, audio, segments}) => {
	const fps = 30;
	return (
		<AbsoluteFill>
			<Background />
			{segments.map((s, i) => {
				const from = Math.round(s.start * fps);
				const nextStart = i < segments.length - 1 ? segments[i + 1].start : totalSeconds + 0.5;
				const dur = Math.max(1, Math.round(nextStart * fps) - from);
				return (
					<Sequence key={i} from={from} durationInFrames={dur}>
						<Caption seg={s} />
					</Sequence>
				);
			})}
			<Progress total={totalSeconds * fps} />
			{audio ? <Audio src={staticFile(audio)} /> : null}
		</AbsoluteFill>
	);
};
