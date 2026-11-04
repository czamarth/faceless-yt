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
import type {Segment, ShortProps} from './CorporateShort';

const font = 'Segoe UI, Arial, sans-serif';

const PEOPLE = [
	{x: 235, shirt: '#5b7a99', skin: '#e8c4a0', hair: '#4a3728'},
	{x: 420, shirt: '#a65d57', skin: '#c68e6b', hair: '#1f1a17'},
	{x: 660, shirt: '#6f8f6a', skin: '#8d5a3b', hair: '#17120f'},
	{x: 845, shirt: '#b08a4a', skin: '#f0d2b4', hair: '#8a6a3c'},
];

type Timing = {tTalk: number; tManager: number; tEnd: number};

const findTiming = (segments: Segment[], total: number): Timing => {
	const talk = segments.find((s) => /everybody talked/i.test(s.text));
	const mgr = segments.find((s) => /most productive/i.test(s.text));
	const last = segments.find((s) => s.para === Math.max(...segments.map((x) => x.para)));
	return {
		tTalk: talk ? talk.start : total * 0.4,
		tManager: mgr ? mgr.start : total * 0.8,
		tEnd: last ? last.start : total,
	};
};

// Kolikrát už někdo promluvil: pomalu před zavedením metriky, pak prudce.
const spoken = (t: number, tm: Timing) =>
	Math.floor(0.4 * Math.min(t, tm.tTalk) + 7 * Math.max(0, Math.min(t, tm.tEnd) - tm.tTalk));

const Clock: React.FC<{minutes: number}> = ({minutes}) => {
	const min = minutes * 6;
	const hour = 270 + (minutes / 60) * 30;
	return (
		<g transform="translate(540 165)">
			<circle r="78" fill="#f5f1e8" stroke="#2b2b2b" strokeWidth="7" />
			{Array.from({length: 12}).map((_, i) => (
				<line key={i} x1="0" y1="-62" x2="0" y2="-70" stroke="#2b2b2b" strokeWidth="4" transform={`rotate(${i * 30})`} />
			))}
			<line x1="0" y1="6" x2="0" y2="-40" stroke="#2b2b2b" strokeWidth="7" strokeLinecap="round" transform={`rotate(${hour})`} />
			<line x1="0" y1="8" x2="0" y2="-58" stroke="#c0392b" strokeWidth="4" strokeLinecap="round" transform={`rotate(${min})`} />
			<circle r="6" fill="#2b2b2b" />
		</g>
	);
};

const Person: React.FC<{i: number; t: number; tm: Timing}> = ({i, t, tm}) => {
	const p = PEOPLE[i];
	const talking = t >= tm.tTalk && t < tm.tEnd;
	const bob = Math.sin(t * (talking ? 9 + i : 1.1) + i * 1.7) * (talking ? 5 : 2);
	const rate = talking ? 0.9 + i * 0.13 : 0.12 + i * 0.03;
	const phase = (t * rate + i * 0.31) % 1;
	const bubble = t < tm.tEnd && phase < (talking ? 0.6 : 0.25);
	return (
		<g transform={`translate(${p.x} ${bob})`}>
			<rect x="-92" y="1015" width="184" height="190" rx="46" fill="#2a3b4d" />
			<rect x="-72" y="1068" width="144" height="150" rx="52" fill={p.shirt} />
			<circle cx="0" cy="1018" r="46" fill={p.skin} />
			<path d="M -46 1010 Q -40 960 0 962 Q 40 960 46 1010 Q 20 984 -46 1010 Z" fill={p.hair} />
			<circle cx="-16" cy="1022" r="4" fill="#222" />
			<circle cx="16" cy="1022" r="4" fill="#222" />
			<ellipse cx="0" cy="1042" rx="9" ry={talking ? 7 : 2.5} fill="#7a2f2f" />
			{bubble ? (
				<g>
					<rect x="30" y="905" width="104" height="56" rx="28" fill="#ffffff" />
					<path d="M 44 958 L 36 984 L 68 960 Z" fill="#ffffff" />
					{[0, 1, 2].map((d) => (
						<circle key={d} cx={58 + d * 22} cy="933" r="6" fill="#33414f" />
					))}
				</g>
			) : null}
		</g>
	);
};

const Room: React.FC<{t: number; tm: Timing; para: number}> = ({t, tm, para}) => {
	const count = spoken(t, tm);
	const minutes = interpolate(t, [tm.tTalk, tm.tManager], [0, 58], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const fill = Math.min(1, count / 160);
	const badge = para === 8;
	return (
		<svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
			<defs>
				<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#e3dacb" />
					<stop offset="1" stopColor="#cdbfaa" />
				</linearGradient>
				<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#3d4d60" />
					<stop offset="1" stopColor="#222c38" />
				</linearGradient>
				<linearGradient id="table" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#9a6a47" />
					<stop offset="1" stopColor="#7a4e32" />
				</linearGradient>
				<radialGradient id="lamp" cx="0.5" cy="0.3" r="0.6">
					<stop offset="0" stopColor="#fff6dc" stopOpacity="0.45" />
					<stop offset="1" stopColor="#fff6dc" stopOpacity="0" />
				</radialGradient>
			</defs>
			<rect width="1080" height="1180" fill="url(#wall)" />
			<rect y="880" width="1080" height="300" fill="#bba88d" />
			<rect y="872" width="1080" height="12" fill="#a8957a" />
			<rect y="1170" width="1080" height="750" fill="url(#floor)" />
			<Clock minutes={minutes} />
			{/* Obrazovka s metrikou */}
			<rect x="170" y="255" width="740" height="430" rx="18" fill="#161a21" />
			<rect x="190" y="275" width="700" height="390" rx="8" fill="#0f2742" />
			<text x="225" y="325" fill="#7fb2ff" fontFamily={font} fontSize="28" fontWeight="700" letterSpacing="3">
				WEEKLY TEAM SYNC
			</text>
			<text x="225" y="390" fill="#9fb3c8" fontFamily={font} fontSize="26" letterSpacing="2">
				TIMES SPOKEN
			</text>
			<text x="225" y="500" fill="#ffffff" fontFamily={font} fontSize="118" fontWeight="800">
				{count}
			</text>
			<text x="225" y="545" fill="#9fb3c8" fontFamily={font} fontSize="24" letterSpacing="2">
				ENGAGEMENT
			</text>
			<rect x="225" y="560" width="630" height="26" rx="13" fill="#1d3a5c" />
			<rect x="225" y="560" width={630 * fill} height="26" rx="13" fill={fill > 0.9 ? '#2dd4bf' : '#4aa3ff'} />
			{badge ? (
				<g>
					<rect x="225" y="608" width="630" height="42" rx="8" fill="#2dd4bf" />
					<text x="540" y="638" textAnchor="middle" fill="#06202b" fontFamily={font} fontSize="26" fontWeight="800">
						MOST PRODUCTIVE MEETING EVER
					</text>
				</g>
			) : null}
			{/* Lidé u stolu */}
			{PEOPLE.map((_, i) => (
				<Person key={i} i={i} t={t} tm={tm} />
			))}
			{/* Stůl */}
			<polygon points="255,1195 825,1195 1040,1580 40,1580" fill="url(#table)" />
			<rect x="40" y="1580" width="1000" height="46" fill="#5c3a25" />
			<ellipse cx="540" cy="1330" rx="460" ry="170" fill="url(#lamp)" />
			<g fill="#f4f4f0">
				<rect x="360" y="1330" width="110" height="74" rx="6" />
				<rect x="610" y="1355" width="110" height="74" rx="6" transform="rotate(-6 665 1392)" />
			</g>
			<rect x="0" y="0" width="1080" height="1920" fill="url(#lamp)" opacity="0.35" />
		</svg>
	);
};

const Subtitle: React.FC<{seg: Segment}> = ({seg}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 190, opacity: o}}>
			<div
				style={{
					width: 940,
					boxSizing: 'border-box',
					padding: '26px 34px',
					textAlign: 'center',
					fontFamily: font,
					fontWeight: 700,
					fontSize: seg.text.length > 100 ? 48 : 56,
					lineHeight: 1.25,
					color: 'white',
					background: 'rgba(8,12,18,0.72)',
					borderRadius: 14,
				}}
			>
				{seg.text}
			</div>
		</AbsoluteFill>
	);
};

export const RoomShort: React.FC<ShortProps> = ({totalSeconds, audio, segments}) => {
	const fps = 30;
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const t = frame / fps;
	const tm = findTiming(segments, totalSeconds);
	const active = [...segments].reverse().find((s) => s.start <= t);
	const scale = interpolate(frame, [0, totalSeconds * fps], [1, 1.09], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{background: '#101418'}}>
			<AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: '50% 42%'}}>
				<Room t={t} tm={tm} para={active ? active.para : 0} />
			</AbsoluteFill>
			<AbsoluteFill
				style={{
					background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)',
				}}
			/>
			{segments.map((s, i) => {
				const from = Math.round(s.start * fps);
				const nextStart = i < segments.length - 1 ? segments[i + 1].start : totalSeconds + 0.5;
				const dur = Math.max(1, Math.round(nextStart * fps) - from);
				return (
					<Sequence key={i} from={from} durationInFrames={dur}>
						<Subtitle seg={s} />
					</Sequence>
				);
			})}
			<div style={{position: 'absolute', left: 0, top: 0, height: 8, width: Math.min(1, frame / (totalSeconds * fps)) * width, background: '#f0b429'}} />
			{audio ? <Audio src={staticFile(audio)} /> : null}
			<div style={{display: 'none'}}>{height}</div>
		</AbsoluteFill>
	);
};
