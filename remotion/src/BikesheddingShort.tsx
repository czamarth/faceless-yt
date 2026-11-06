import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, GOLD, GREEN, INK, RED, lerp, pop} from './WatermelonShort';
import {ChannelStamp, Pill, ease} from './PlanKit';

/*
 * W19 "Bikeshedding" (visuals/bikeshedding.md), agenda se dvěma položkami a časovými pruhy.
 * Reaktor: 2 min, schválen -> kolárna: bar roste na 45 min, barvy, střecha "?" -> zákon triviality -> kávovar + reorganizace -> APPROVED / UNDER REVIEW.
 */

const CARD = {x: 100, y: 330, w: 880, h: 900};
const NAVY = '#243A66';
const PAPER = '#F7F9FC';
const GRAY = '#7B8498';

const Reactor: React.FC<{x: number; y: number}> = ({x, y}) => (
	<g transform={`translate(${x} ${y})`}>
		<path d="M -50 40 Q -30 -10 -34 -50 H 34 Q 30 -10 50 40 Z" fill="#B8BDC9" stroke={INK} strokeWidth="5" />
		<circle cx="-6" cy="-70" r="20" fill="#E8EAF0" />
		<circle cx="22" cy="-86" r="16" fill="#E8EAF0" />
	</g>
);

const Shed: React.FC<{x: number; y: number; wall: string; roofQ: number}> = ({x, y, wall, roofQ}) => (
	<g transform={`translate(${x} ${y})`}>
		<rect x="-48" y="-30" width="96" height="70" fill={wall} stroke={INK} strokeWidth="5" />
		<polygon points="-62,-30 0,-70 62,-30" fill="#8A6B47" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
		<rect x="-14" y="2" width="28" height="38" fill="#6B5A3E" />
		{roofQ > 0 ? (
			<text x="0" y="-84" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize={64 * Math.min(roofQ, 1.1)} fill={RED}>
				?
			</text>
		) : null}
	</g>
);

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tFirst = cue(segs, /^The first is/);
	const tMill = cue(segs, /^It costs millions/);
	const tApp = cue(segs, /^Nobody in the room/);
	const tSecond = cue(segs, /^The second is/);
	const tFew = cue(segs, /^It costs a few/);
	const tEvery = cue(segs, /^And everybody/);
	const tForty = cue(segs, /^So the committee/);
	const tAlu = cue(segs, /^Aluminum/);
	const tGreen = cue(segs, /^Green, or/);
	const tRoof = cue(segs, /^Whether the roof/);
	const tAuthor = cue(segs, /^The author/);
	const tLaw = cue(segs, /^Northcote/);
	const tPop = cue(segs, /^the time spent/);
	const tCoffee = cue(segs, /^Which explains/);
	const tEnd = cue(segs, /^In the end/);
	const tRea = cue(segs, /^The reactor was/);
	const tShed = cue(segs, /^The shed is still/);

	const row1O = pop(t, 0.3, 0.4);
	const row2O = pop(t, 1.2, 0.4);
	const reaBar = ease(t, tApp, tApp + 0.5) * 40;
	const shedBar = ease(t, tForty, tForty + 3.0);
	const mins = Math.round(shedBar * 45);
	const wall = t >= tGreen + 0.9 ? '#52C98C' : t >= tGreen ? '#2FB67C' : t >= tAlu + 1.0 ? '#8FA0B8' : t >= tAlu ? '#B8BDC9' : '#E4D6B0';
	const roofQ = pop(t, tRoof, 0.35);

	const lowO = ease(t, tAuthor, tAuthor + 0.3) * (1 - ease(t, tCoffee - 0.3, tCoffee));
	const coffeeO = ease(t, tCoffee, tCoffee + 0.3);
	const stampRea = pop(t, tRea, 0.35);
	const stampShed = pop(t, tShed, 0.35);

	return (
		<Svg>
			<rect x={CARD.x + 8} y={CARD.y + 14} width={CARD.w} height={CARD.h} rx="32" fill="rgba(0,0,0,0.3)" />
			<rect x={CARD.x} y={CARD.y} width={CARD.w} height={CARD.h} rx="32" fill={PAPER} stroke={INK} strokeWidth="5" />
			<path d={`M ${CARD.x} ${CARD.y + 80} V ${CARD.y + 32} A 32 32 0 0 1 ${CARD.x + 32} ${CARD.y} H ${CARD.x + CARD.w - 32} A 32 32 0 0 1 ${CARD.x + CARD.w} ${CARD.y + 32} V ${CARD.y + 80} Z`} fill={NAVY} />
			<text x="540" y={CARD.y + 56} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="36" letterSpacing="6" fill="#fff">
				COMMITTEE AGENDA
			</text>

			{/* 1. reaktor */}
			<g opacity={Math.min(1, row1O)}>
				<rect x="130" y="430" width="820" height="190" rx="18" fill="#fff" stroke={INK} strokeWidth="4" />
				<Reactor x={215} y={540} />
				<text x="300" y="480" fontFamily={font} fontWeight="900" fontSize="38" fill={INK}>
					1. NUCLEAR REACTOR
				</text>
				<g opacity={ease(t, tMill, tMill + 0.25)}>
					<rect x="720" y="452" width="210" height="48" rx="24" fill={GOLD} />
					<text x="825" y="486" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="28" fill={INK}>
						$ MILLIONS
					</text>
				</g>
				<rect x="300" y="530" width="620" height="38" rx="19" fill="#E2E7F1" stroke={INK} strokeWidth="3" />
				<rect x="300" y="530" width={Math.max(0, reaBar)} height="38" rx="19" fill={GREEN} />
				<text x="920" y="598" textAnchor="end" fontFamily={font} fontWeight="900" fontSize="28" fill={INK} opacity={ease(t, tApp, tApp + 0.3)}>
					2 MIN
				</text>
				{stampRea > 0 ? (
					<g transform={`translate(780 560) rotate(-8) scale(${Math.min(stampRea, 1.05)})`}>
						<rect x="-140" y="-34" width="280" height="68" rx="12" fill="#fff" stroke={GREEN} strokeWidth="7" />
						<text x="0" y="12" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="38" letterSpacing="2" fill={GREEN}>
							APPROVED
						</text>
					</g>
				) : null}
			</g>

			{/* 2. kolárna */}
			<g opacity={Math.min(1, row2O)}>
				<rect x="130" y="640" width="820" height="230" rx="18" fill="#fff" stroke={INK} strokeWidth="4" />
				<Shed x={215} y={780} wall={wall} roofQ={roofQ} />
				<text x="300" y="690" fontFamily={font} fontWeight="900" fontSize="38" fill={INK}>
					2. BICYCLE SHED
				</text>
				<g opacity={ease(t, tFew, tFew + 0.25)}>
					<rect x="650" y="662" width="280" height="48" rx="24" fill="#E4E7EE" stroke={INK} strokeWidth="3" />
					<text x="790" y="696" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="26" fill={INK}>
						$ A FEW HUNDRED
					</text>
				</g>
				<rect x="300" y="740" width="620" height="38" rx="19" fill="#E2E7F1" stroke={INK} strokeWidth="3" />
				<rect x="300" y="740" width={Math.max(0, 620 * shedBar)} height="38" rx="19" fill={shedBar > 0.5 ? RED : GOLD} />
				<text x="920" y="808" textAnchor="end" fontFamily={font} fontWeight="900" fontSize="28" fill={INK} opacity={ease(t, tForty, tForty + 0.3)}>
					{mins} MIN
				</text>
				<g opacity={ease(t, tEvery, tEvery + 0.25) * (1 - ease(t, tForty - 0.2, tForty))}>
					<text x="300" y="830" fontFamily={font} fontWeight="800" fontSize="28" fill={GRAY}>
						EVERYBODY UNDERSTANDS IT
					</text>
				</g>
				{t >= tAlu && t < tGreen ? (
					<text x="300" y="830" fontFamily={font} fontWeight="900" fontSize="30" fill={NAVY}>
						ALUMINUM OR STEEL?
					</text>
				) : null}
				{t >= tGreen && t < tRoof ? (
					<g>
						<rect x="300" y="805" width="40" height="30" rx="6" fill="#2FB67C" stroke={INK} strokeWidth="3" />
						<rect x="350" y="805" width="40" height="30" rx="6" fill="#52C98C" stroke={INK} strokeWidth="3" />
						<text x="405" y="830" fontFamily={font} fontWeight="900" fontSize="28" fill={NAVY}>
							GREEN OR GREEN?
						</text>
					</g>
				) : null}
				{stampShed > 0 ? (
					<g transform={`translate(740 770) rotate(-8) scale(${Math.min(stampShed, 1.05)})`}>
						<rect x="-170" y="-34" width="340" height="68" rx="12" fill="#fff" stroke={GOLD} strokeWidth="7" />
						<text x="0" y="12" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="36" letterSpacing="2" fill={GOLD}>
							UNDER REVIEW
						</text>
					</g>
				) : null}
			</g>

			{/* spodní zóna: zákon triviality */}
			{lowO > 0.01 ? (
				<g opacity={lowO}>
					<rect x="130" y="900" width="820" height="290" rx="22" fill="#fff" stroke={INK} strokeWidth="5" />
					<text x="540" y="960" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="32" letterSpacing="3" fill={GRAY}>
						C. NORTHCOTE PARKINSON
					</text>
					<text x="540" y="1030" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="46" fill={NAVY}>
						LAW OF TRIVIALITY
					</text>
					<text x="540" y="1130" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="64" fill={RED} opacity={ease(t, tPop, tPop + 0.3)}>
						TIME ∝ 1 / COST
					</text>
				</g>
			) : null}
			{coffeeO > 0.01 ? (
				<g opacity={coffeeO}>
					<rect x="130" y="900" width="820" height="290" rx="22" fill="#fff" stroke={INK} strokeWidth="5" />
					<rect x="130" y="900" width="820" height="70" rx="22" fill={RED} />
					<rect x="130" y="940" width="820" height="30" fill={RED} />
					<text x="540" y="950" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="32" letterSpacing="3" fill="#fff">
						MEETING: COFFEE MACHINE
					</text>
					<g transform="translate(260 1080)">
						<rect x="-50" y="-50" width="100" height="110" rx="12" fill="#8A93A6" stroke={INK} strokeWidth="5" />
						<rect x="-26" y="10" width="52" height="40" fill="#5C3D1E" />
						<circle cx="0" cy="-20" r="14" fill={RED} />
					</g>
					<g opacity={ease(t, tCoffee + 1.2, tCoffee + 1.5)}>
						<rect x="400" y="1015" width="500" height="84" rx="18" fill="#FFF3C4" stroke={INK} strokeWidth="4" />
						<text x="650" y="1068" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={INK}>
							APPROVED: REORGANIZATION
						</text>
					</g>
				</g>
			) : null}
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const BikesheddingShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#16213E" vig={0.45}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
