import React from 'react';
import type {Segment, ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, Bean, GOLD, GREEN, INK, RED, lerp, pop} from './WatermelonShort';
import {ChannelStamp, ease} from './PlanKit';

/*
 * W07 "Skeleton crew" (visuals/skeleton-crew.md), tmavě modrá kancelář.
 * Prázdné stoly -> 3 fazolky -> prázdný kalendář a mizející notifikace -> bary na 100 % -> graf -> otazníky -> STUDY + schůzka.
 */

const PANEL = {x: 70, y: 330, w: 940, h: 900};
const DX = [150, 345, 540, 735, 930];
const ROW = [950, 1140];
const OCC = [
	{c: 1, r: 0, tie: BLUE},
	{c: 3, r: 0, tie: GREEN},
	{c: 2, r: 1, tie: RED},
];
const BG = '#2B3C66';
const WHITE = '#F4F1EA';

const Desk: React.FC<{x: number; y: number; on: boolean}> = ({x, y, on}) => (
	<g transform={`translate(${x} ${y})`}>
		<rect x="-82" y="0" width="164" height="24" rx="6" fill={on ? '#A9B5D1' : '#5A6788'} />
		<rect x="-72" y="24" width="144" height="46" rx="4" fill={on ? '#7B87A6' : '#47536F'} />
		<rect x="38" y="-56" width="54" height="44" rx="5" fill={on ? '#7FE0FF' : '#34405E'} stroke={on ? '#C7F1FF' : '#44506E'} strokeWidth="3" />
		<rect x="60" y="-12" width="10" height="12" fill={on ? '#A9B5D1' : '#47536F'} />
	</g>
);

const Chip: React.FC<{x?: number; y: number; w: number; label: string; color?: string; fill?: string; o?: number; fs?: number}> = ({
	x = 540,
	y,
	w,
	label,
	color = INK,
	fill = WHITE,
	o = 1,
	fs = 34,
}) =>
	o > 0 ? (
		<g opacity={o} transform={`translate(${x} ${y})`}>
			<rect x={-w / 2} y="-34" width={w} height="68" rx="34" fill={fill} stroke={color} strokeWidth="5" />
			<text x="0" y={fs * 0.36} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize={fs} letterSpacing="3" fill={color}>
				{label}
			</text>
		</g>
	) : null;

const PINGS = [
	[230, 600],
	[850, 610],
	[250, 770],
	[860, 770],
	[165, 690],
	[915, 700],
	[300, 540],
	[800, 540],
];

const Scene: React.FC<{t: number; segs: Segment[]; total: number}> = ({t, segs, total}) => {
	const tThree = cue(segs, /^Three employees/);
	const tCareful = cue(segs, /^They move carefully/);
	const tNoMeet = cue(segs, /^No meetings/);
	const tMinute = cue(segs, /^Nobody asking/);
	const tStrange = cue(segs, /^And something strange/);
	const tDone = cue(segs, /^Work gets done/);
	const tMgmt = cue(segs, /^Management notices/);
	const tOutput = cue(segs, /^Output has never/);
	const tKnow = cue(segs, /^Nobody knows why/);
	const tStudy = cue(segs, /^A study has/);
	const tMeet = cue(segs, /^It will begin/);

	const pan = lerp(70, 0, ease(t, 0, tThree + 0.4));
	const beansO = pop(t, tThree, 0.4);

	// ---- prázdný kalendář + pingy ------------------------------------------------------------------
	const calO = ease(t, tNoMeet, tNoMeet + 0.3) * (1 - ease(t, tDone - 0.3, tDone));
	const pings = PINGS.map(([px, py], k) => {
		const st = tNoMeet + 0.25 + k * 0.42;
		const s = pop(t, st, 0.15) * (1 - ease(t, st + 0.4, st + 0.65));
		if (s <= 0.01 || t > tStrange) return null;
		return (
			<g key={k} transform={`translate(${px} ${py}) scale(${s})`}>
				<circle r="30" fill={RED} stroke="#fff" strokeWidth="4" />
				<text x="0" y="12" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" fill="#fff">
					{(k % 4) + 1}
				</text>
			</g>
		);
	});
	const minuteO = ease(t, tMinute, tMinute + 0.25) * (1 - ease(t, tStrange - 0.3, tStrange));
	const strike = ease(t, tMinute + 0.9, tMinute + 1.2);

	// ---- bary, graf, otazníky ----------------------------------------------------------------------------------
	const barsO = ease(t, tDone - 0.1, tDone + 0.2) * (1 - ease(t, tOutput - 0.3, tOutput - 0.05));
	const chartO = ease(t, tOutput, tOutput + 0.3) * (1 - ease(t, tKnow - 0.3, tKnow));
	const gp = ease(t, tOutput + 0.1, tOutput + 1.5);
	const mgmtX = lerp(1060, 930, ease(t, tMgmt, tMgmt + 0.4));
	const mgmtO = ease(t, tMgmt, tMgmt + 0.2) * (1 - ease(t, tOutput + 0.8, tOutput + 1.1));

	// ---- STUDY -----------------------------------------------------------------------------------------------------
	const docO = ease(t, tStudy, tStudy + 0.35);
	const row2 = ease(t, tMeet, tMeet + 0.3);

	return (
		<Svg>
			<defs>
				<clipPath id="pclip">
					<rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx="36" />
				</clipPath>
			</defs>
			<rect x={PANEL.x + 8} y={PANEL.y + 14} width={PANEL.w} height={PANEL.h} rx="36" fill="rgba(27,31,42,0.18)" />
			<rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx="36" fill={BG} stroke={INK} strokeWidth="5" />
			<g clipPath="url(#pclip)">
				<rect x={PANEL.x} y="1050" width={PANEL.w} height="200" fill="#233256" opacity="0.6" />
				<g transform={`translate(${pan} 0)`}>
					{ROW.map((ry, r) =>
						DX.map((dx, c) => {
							const occ = OCC.findIndex((o) => o.c === c && o.r === r);
							return occ >= 0 ? null : <Desk key={`${r}-${c}`} x={dx} y={ry} on={false} />;
						}),
					)}
				</g>

				{/* vedení: stojí za stolem */}
				{mgmtO > 0 ? (
					<g opacity={mgmtO}>
						<Bean x={mgmtX} y={985} s={0.62} tie={GOLD} shout={pop(t, tMgmt + 0.25, 0.3)} />
					</g>
				) : null}

				{/* zaměstnanci, kteří zůstali */}
				{OCC.map((o, i) => {
					const x = DX[o.c];
					const y = ROW[o.r];
					const sway = Math.sin(t * 0.9 + i * 2) * 10 * ease(t, tThree + 0.4, tThree + 1);
					const bob = Math.abs(Math.sin(t * 2.6 + i)) * 3 * (t >= tCareful && t < tNoMeet ? 1 : 0);
					const q = pop(t, tKnow + i * 0.15, 0.3);
					return (
						<g key={i}>
							{beansO > 0 ? (
								<g opacity={Math.min(1, beansO)}>
									<Bean x={x - 25 + sway} y={y + 30 - bob} s={0.62 * Math.min(beansO, 1.05)} tie={o.tie} />
								</g>
							) : null}
							<g transform={`translate(${pan * 0} 0)`}>
								<Desk x={x} y={y} on={beansO > 0.3} />
							</g>
							{q > 0 ? (
								<text x={x - 25} y="835" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize={86 * Math.min(q, 1.05)} fill={GOLD}>
									?
								</text>
							) : null}
						</g>
					);
				})}

				{/* prázdný kalendář */}
				{calO > 0 ? (
					<g opacity={calO} transform="translate(540 650)">
						<rect x="-170" y="-118" width="340" height="236" rx="20" fill={WHITE} stroke={INK} strokeWidth="5" />
						<path d="M -170 -76 V -98 A 20 20 0 0 1 -150 -118 H 150 A 20 20 0 0 1 170 -98 V -76 Z" fill={RED} />
						<text x="0" y="-86" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="26" letterSpacing="4" fill="#fff">
							THIS WEEK
						</text>
						{Array.from({length: 14}, (_, i) => (
							<rect key={i} x={-142 + (i % 7) * 42} y={-52 + Math.floor(i / 7) * 46} width="34" height="36" rx="5" fill="none" stroke="#B8B4A8" strokeWidth="3" />
						))}
						<text x="0" y="82" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="3" fill={INK}>
							NO EVENTS
						</text>
					</g>
				) : null}
				{pings}
				{minuteO > 0 ? (
					<g opacity={minuteO} transform="translate(540 810)">
						<rect x="-250" y="-36" width="500" height="72" rx="36" fill={WHITE} stroke={INK} strokeWidth="5" />
						<text x="0" y="13" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="36" fill={INK}>
							GOT A MINUTE?
						</text>
						<line x1="-230" y1="-26" x2={-230 + 460 * strike} y2={-26 + 52 * strike} stroke={RED} strokeWidth="10" strokeLinecap="round" />
					</g>
				) : null}

				{/* progress bary */}
				{barsO > 0 ? (
					<g opacity={barsO}>
						{OCC.map((o, i) => {
							const x = DX[o.c];
							const f = ease(t, tDone + 0.15 + i * 0.25, tDone + 0.85 + i * 0.25);
							return (
								<g key={i} transform={`translate(${x - 25} 790)`}>
									<rect x="-95" y="-20" width="190" height="40" rx="20" fill={WHITE} stroke={INK} strokeWidth="4" />
									<rect x="-90" y="-15" width={Math.max(0, 180 * f)} height="30" rx="15" fill={GREEN} />
									<text x="0" y="-34" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="26" fill={WHITE}>
										{Math.round(f * 100)}%
									</text>
								</g>
							);
						})}
					</g>
				) : null}

				{/* graf do nebe */}
				{chartO > 0 ? (
					<g opacity={chartO}>
						<rect x="160" y="470" width="760" height="380" rx="26" fill={WHITE} stroke={INK} strokeWidth="5" />
						<text x="200" y="525" fontFamily={font} fontWeight="900" fontSize="38" letterSpacing="4" fill={INK}>
							OUTPUT
						</text>
						<line x1="210" y1="800" x2="880" y2="800" stroke={INK} strokeWidth="4" />
						<polyline
							points={Array.from({length: 31}, (_, i) => {
								const f = (i / 30) * gp;
								return `${220 + f * 640},${790 - 270 * Math.pow(f, 3)}`;
							}).join(' ')}
							fill="none"
							stroke={GREEN}
							strokeWidth="12"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<circle cx={220 + gp * 640} cy={790 - 270 * Math.pow(gp, 3)} r="14" fill={GREEN} stroke={INK} strokeWidth="4" />
						{gp > 0.85 ? (
							<text x="880" y="525" textAnchor="end" fontFamily={font} fontWeight="900" fontSize="38" fill={GREEN}>
								RECORD HIGH
							</text>
						) : null}
					</g>
				) : null}

				{/* STUDY */}
				{docO > 0 ? (
					<g opacity={docO} transform={`translate(0 ${(1 - docO) * 30})`}>
						<rect x="190" y="470" width="700" height="340" rx="18" fill={WHITE} stroke={INK} strokeWidth="5" />
						<text x="540" y="545" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="60" letterSpacing="6" fill={INK}>
							STUDY
						</text>
						<text x="540" y="590" textAnchor="middle" fontFamily={font} fontWeight="700" fontSize="28" fill={INK} opacity="0.65">
							WHY IS OUTPUT UP? · DUE: JANUARY
						</text>
						<rect x="230" y="625" width="620" height="68" rx="12" fill="#fff" stroke={INK} strokeWidth="3" />
						<text x="255" y="670" fontFamily={font} fontWeight="800" fontSize="32" fill={INK}>
							1. COLLECT DATA
						</text>
						<g opacity={row2}>
							<rect x="230" y="715" width="620" height="68" rx="12" fill="#FFE3E3" stroke={RED} strokeWidth="5" />
							<text x="255" y="760" fontFamily={font} fontWeight="900" fontSize="32" fill={RED}>
								2. MEETING (ALL HANDS)
							</text>
						</g>
					</g>
				) : null}
			</g>

			<Chip y={485} w={600} label="LAST WEEK OF DECEMBER" o={1 - ease(t, tThree + 0.8, tThree + 1.1)} fs={34} />
			<Chip y={485} w={360} label="STAFF: 3" o={ease(t, tThree + 1.0, tThree + 1.3) * (1 - ease(t, tNoMeet - 0.3, tNoMeet))} fs={38} />
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const SkeletonCrewShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#1E2A47" vig={0.35}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
