import React from 'react';
import type {Segment, ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font, ramp, sm, NEVER} from './ConceptShorts';

/*
 * W01 "Watermelon status" (visuals/watermelon-status.md).
 * Dashboard na bílé kartě: zelená RAG tečka -> meloun -> bubliny -> Dave váhá -> nůž -> všichni v šoku -> pointa.
 * Gag: pilulka "STATUS: GREEN" zůstane zelená i při rozpůlení karty.
 */

export const GREEN = '#2FB67C';
export const RED = '#E5484D';
export const INK = '#1B1F2A';
export const BLUE = '#2F5BFF';
export const GOLD = '#E0A800';

const CARD = {x: 100, y: 330, w: 880, h: 880, head: 110};
const DOT_Y = 690;
const MID = CARD.x + CARD.w / 2;
const BOTTOM = CARD.y + CARD.h;

const back = (x: number) => {
	const c1 = 1.70158;
	const c3 = c1 + 1;
	return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
export const pop = (t: number, a: number, d = 0.35) => {
	const x = ramp(t, a, a + d);
	return x <= 0 ? 0 : back(x);
};
export const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const mix = (a: string, b: string, x: number) => {
	const [r1, g1, b1] = rgb(a);
	const [r2, g2, b2] = rgb(b);
	return `rgb(${Math.round(lerp(r1, r2, x))},${Math.round(lerp(g1, g2, x))},${Math.round(lerp(b1, b2, x))})`;
};
// čas uvnitř věty: podíl `frac` mezi začátkem a koncem segmentu
export const cueAt = (segs: Segment[], re: RegExp, frac: number) => {
	const s = segs.find((x) => re.test(x.text));
	return s ? s.start + (s.end - s.start) * frac : NEVER;
};

export const Bean: React.FC<{
	x: number;
	y: number;
	s?: number;
	tie: string;
	jump?: number;
	shout?: number;
	hat?: 'bowler' | 'cap';
}> = ({x, y, s = 1, tie, jump = 0, shout = 0, hat}) => (
	<g transform={`translate(${x} ${y - jump}) scale(${s})`}>
		<ellipse cx="0" cy={jump} rx="55" ry="10" fill="rgba(27,31,42,0.12)" transform={`translate(0 ${jump}) scale(${1 - jump / 400} 1)`} />
		<rect x="-48" y="-125" width="96" height="125" rx="44" fill="#6F7A93" />
		<polygon points="0,-120 -13,-96 0,-52 13,-96" fill={tie} />
		<circle cx="0" cy="-168" r="48" fill="#F2C9A0" />
		{hat === 'bowler' ? (
			<g fill={INK}>
				<ellipse cx="0" cy="-204" rx="34" ry="30" />
				<ellipse cx="0" cy="-182" rx="58" ry="10" />
			</g>
		) : null}
		{hat === 'cap' ? (
			<g fill={RED}>
				<path d="M -46 -178 A 46 46 0 0 1 46 -178 Z" />
				<rect x="8" y="-186" width="62" height="12" rx="6" fill="#B83238" />
			</g>
		) : null}
		<circle cx="-16" cy="-174" r="6" fill={INK} />
		<circle cx="16" cy="-174" r="6" fill={INK} />
		{shout > 0 ? (
			<text
				x="0"
				y="-250"
				textAnchor="middle"
				fontFamily={font}
				fontWeight="900"
				fontSize="84"
				fill={RED}
				transform={`translate(0 -250) scale(${shout}) translate(0 250)`}
			>
				!
			</text>
		) : null}
	</g>
);

const Melon: React.FC<{cx: number; cy: number; s: number; inside: number}> = ({cx, cy, s, inside}) => (
	<g transform={`translate(${cx} ${cy}) scale(${s})`}>
		<path d="M -170 -60 A 170 170 0 0 0 170 -60 Z" fill="#1F8F5F" />
		<path d="M -150 -60 A 150 150 0 0 0 150 -60 Z" fill="#D8F1DF" />
		<path d="M -136 -60 A 136 136 0 0 0 136 -60 Z" fill={mix('#9ADBB1', '#EE4D58', inside)} />
		{[-70, -20, 30, 80, -40, 55].map((sx, i) => (
			<ellipse
				key={i}
				cx={sx}
				cy={i < 4 ? 10 + (i % 2) * 6 : 62}
				rx="8"
				ry="13"
				fill={INK}
				opacity={inside}
				transform={`rotate(${(i - 2) * 12} ${sx} 20)`}
			/>
		))}
	</g>
);

const Bubble: React.FC<{y: number; label: string; color: string; o: number; dx?: number; dashed?: boolean; arrow?: boolean}> = ({
	y,
	label,
	color,
	o,
	dx = 0,
	dashed,
	arrow,
}) => (
	<g opacity={o} transform={`translate(${(1 - Math.min(1, o)) * -80 + dx} 0)`}>
		<rect
			x={MID - 350}
			y={y}
			width="700"
			height="84"
			rx="42"
			fill="#fff"
			stroke={color}
			strokeWidth="6"
			strokeDasharray={dashed ? '14 10' : undefined}
		/>
		<text x={MID - (arrow ? 40 : 0)} y={y + 56} textAnchor="middle" fontFamily={font} fontWeight="800" fontSize="36" fill={INK}>
			{label}
		</text>
		{arrow ? (
			<g transform={`translate(${MID + 270} ${y + 42})`}>
				<path d="M -40 0 H 30 M 8 -22 L 34 0 L 8 22" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
			</g>
		) : null}
	</g>
);

const Calendar: React.FC<{cx: number; cy: number; s: number}> = ({cx, cy, s}) => (
	<g transform={`translate(${cx} ${cy}) scale(${s})`}>
		<rect x="-100" y="-90" width="200" height="180" rx="20" fill="#fff" stroke={INK} strokeWidth="6" />
		<path d="M -100 -60 A 20 20 0 0 1 -80 -90 H 80 A 20 20 0 0 1 100 -60 V -40 H -100 Z" fill={RED} />
		<rect x="-60" y="-110" width="12" height="36" rx="6" fill={INK} />
		<rect x="48" y="-110" width="12" height="36" rx="6" fill={INK} />
		{[0, 1, 2].map((r) =>
			[0, 1, 2].map((c) => (
				<rect key={`${r}${c}`} x={-70 + c * 50} y={-20 + r * 36} width="36" height="24" rx="5" fill={INK} opacity={r === 1 && c === 1 ? 1 : 0.16} />
			)),
		)}
	</g>
);

const Pill: React.FC<{x: number; y: number; w: number; h: number; size: number}> = ({x, y, w, h, size}) => (
	<g>
		<rect x={x} y={y} width={w} height={h} rx={h / 2} fill={GREEN} />
		<circle cx={x + h / 2} cy={y + h / 2} r={h * 0.24} fill="#fff" />
		<text x={x + h * 0.85} y={y + h / 2 + size * 0.35} fontFamily={font} fontWeight="900" fontSize={size} fill="#fff" letterSpacing={size * 0.04}>
			STATUS: GREEN
		</text>
	</g>
);

// Karta dashboardu. Obsah těla se předává zvenku, aby šlo kartu vykreslit i ve dvou půlkách.
const Card: React.FC<{children: React.ReactNode}> = ({children}) => (
	<g>
		<rect x={CARD.x + 8} y={CARD.y + 14} width={CARD.w} height={CARD.h} rx="36" fill="rgba(27,31,42,0.12)" />
		<rect x={CARD.x} y={CARD.y} width={CARD.w} height={CARD.h} rx="36" fill="#fff" stroke={INK} strokeWidth="5" />
		<path
			d={`M ${CARD.x} ${CARD.y + CARD.head} V ${CARD.y + 36} A 36 36 0 0 1 ${CARD.x + 36} ${CARD.y} H ${CARD.x + CARD.w - 36} A 36 36 0 0 1 ${CARD.x + CARD.w} ${CARD.y + 36} V ${CARD.y + CARD.head} Z`}
			fill="#EDEAE0"
		/>
		<line x1={CARD.x} y1={CARD.y + CARD.head} x2={CARD.x + CARD.w} y2={CARD.y + CARD.head} stroke={INK} strokeWidth="4" />
		<text x={CARD.x + 40} y={CARD.y + 70} fontFamily={font} fontWeight="900" fontSize="32" letterSpacing="4" fill={INK}>
			PROJECT ATLAS
		</text>
		<Pill x={CARD.x + CARD.w - 360} y={CARD.y + 25} w={330} h={60} size={26} />
		{children}
	</g>
);

const Bar: React.FC<{label: string; x: number; y: number; o: number; s: number}> = ({label, x, y, o, s}) => (
	<g opacity={Math.min(1, o)} transform={`translate(${x} ${y}) scale(${s})`}>
		<circle cx="0" cy="0" r="38" fill={GREEN} />
		<text x="0" y="82" textAnchor="middle" fontFamily={font} fontWeight="800" fontSize="28" letterSpacing="3" fill={INK}>
			{label}
		</text>
	</g>
);

const Scene: React.FC<{t: number; segs: Segment[]; total: number}> = ({t, segs, total}) => {
	const tWeek = cue(segs, /last week/);
	const tMonth = cue(segs, /last month/);
	const tYear = cue(segs, /entire year/);
	const tWM = cue(segs, /^A watermelon/);
	const tInside = cueAt(segs, /green on the outside/, 0.55);
	const tSlide = cue(segs, /slide says/);
	const tTeam = cue(segs, /team says/);
	const tBudget = cue(segs, /budget says/);
	const tNobody = cue(segs, /Nobody lies/);
	const tFirst = cue(segs, /first to turn/);
	const tRed = cue(segs, /Red means/);
	const tMeet = cue(segs, /Questions mean/);
	const tSo = cue(segs, /^So the dashboard/);
	const tCut = cueAt(segs, /^So the dashboard/, 0.7);
	const tVeryRed = cue(segs, /very red/);
	const tShock = cue(segs, /shocked/);
	const tFair = cue(segs, /To be fair/);

	// --- velká RAG tečka -------------------------------------------------------
	const phaseD = t >= tNobody && t < tSo;
	const dotX = phaseD ? lerp(MID, 650, sm(ramp(t, tNobody, tNobody + 0.5))) : lerp(650, MID, sm(ramp(t, tSo, tSo + 0.4)));
	const dotXFinal = t < tNobody ? MID : t < tSo ? dotX : dotX;
	const dotR = lerp(130, 105, sm(ramp(t, tNobody, tNobody + 0.5)) - sm(ramp(t, tSo, tSo + 0.4)));
	const redAmt = Math.max(sm(ramp(t, tRed, tRed + 0.15)) - sm(ramp(t, tSo, tSo + 0.2)), 0) +
		0.35 * Math.max(0, Math.sin(ramp(t, tFirst, tRed) * Math.PI * 3)) * (t < tRed ? 1 : 0);
	// tečka mizí jen po dobu melounu a bublin, ve fázi s Davem je zase vidět
	const dotOpacity = 1 - sm(ramp(t, tWM, tWM + 0.25)) * (1 - sm(ramp(t, tNobody + 0.1, tNobody + 0.4)));
	const dotPop = pop(t, 0.05);

	// --- meloun a bubliny -----------------------------------------------------
	const melonVis = sm(ramp(t, tWM, tWM + 0.3)) * (1 - sm(ramp(t, tNobody - 0.2, tNobody + 0.2)));
	const melonS = pop(t, tWM, 0.45) * lerp(1, 0.68, sm(ramp(t, tSlide - 0.5, tSlide)));
	const melonY = lerp(DOT_Y, 600, sm(ramp(t, tSlide - 0.5, tSlide)));
	const bubO = 1 - sm(ramp(t, tNobody - 0.1, tNobody + 0.3));
	const budgetGone = sm(ramp(t, tBudget + 1.4, tBudget + 2.4)) * 900;

	// --- Dave, otazníky, kalendář ----------------------------------------------
	const daveO = sm(ramp(t, tNobody + 0.2, tNobody + 0.6)) * (1 - sm(ramp(t, tSo - 0.2, tSo + 0.1)));
	const sweat = ramp((t * 1.2) % 1, 0, 1);
	const qs = [-70, 0, 70].map((dx, i) => {
		const q = ramp(t, tRed + i * 0.18, tRed + i * 0.18 + 1.3);
		return q > 0 && t < tSo ? (
			<text
				key={i}
				x={dotXFinal + dx}
				y={DOT_Y - dotR - 25 - q * 60}
				textAnchor="middle"
				fontFamily={font}
				fontWeight="900"
				fontSize={78 + i * 6}
				fill={INK}
				opacity={1 - q * q}
			>
				?
			</text>
		) : null;
	});
	const calS = pop(t, tMeet, 0.4) * (1 - sm(ramp(t, tSo - 0.2, tSo + 0.1)));

	// --- nůž a rozříznutí ------------------------------------------------------
	const knifeY = lerp(CARD.y - 260, BOTTOM + 40, sm(ramp(t, tCut - 0.6, tCut + 0.15)));
	const knifeO = t >= tCut - 0.6 ? 1 - sm(ramp(t, tCut + 0.35, tCut + 0.7)) : 0;
	const gap = 70 * sm(ramp(t, tCut, tCut + 0.5)) + 130 * sm(ramp(t, tVeryRed, tVeryRed + 0.6));
	const tilt = 3.5 * (gap / 200);
	const crack = ramp(t, tCut - 0.2, tCut + 0.1);
	const cut = t >= tCut;
	const flash = t >= tVeryRed && t < tVeryRed + 0.9 ? 0.5 + 0.5 * Math.sin((t - tVeryRed) * 22) : 0;

	// --- šok a pointa -----------------------------------------------------------
	const cardS = lerp(1, 0.85, sm(ramp(t, tShock - 0.5, tShock)));
	const beanBase = 1405;
	const beans = [
		{x: 190, s: 1, tie: BLUE},
		{x: 365, s: 1, tie: RED},
		{x: 540, s: 1.28, tie: GOLD},
		{x: 715, s: 0.8, tie: GREEN},
		{x: 890, s: 1, tie: '#9B5DE5'},
	];
	const finale = sm(ramp(t, tFair, tFair + 0.3));
	const sceneO = 1 - 0.75 * finale;
	const bigPill = pop(t, tFair, 0.45);
	const stampT = total - 0.1;
	const stamp = pop(t, stampT, 0.3);

	const body = (
		<>
			{/* velká tečka (zelená -> červená) */}
			<g opacity={dotOpacity} transform={`translate(${dotXFinal} ${DOT_Y}) scale(${dotPop})`}>
				<circle cx="0" cy="0" r={dotR} fill={mix(GREEN, RED, Math.min(1, redAmt))} />
				<circle cx="0" cy="0" r={dotR + 22} fill="none" stroke={mix(GREEN, RED, Math.min(1, redAmt))} strokeWidth="6" opacity="0.3" />
			</g>
			{/* týden / měsíc / rok */}
			<g opacity={(1 - sm(ramp(t, tWM - 0.1, tWM + 0.2))) + sm(ramp(t, tSo, tSo + 0.3))}>
				<Bar label="WEEK" x={MID - 230} y={1010} o={ramp(t, tWeek, tWeek + 0.1)} s={pop(t, tWeek, 0.3)} />
				<Bar label="MONTH" x={MID} y={1010} o={ramp(t, tMonth, tMonth + 0.1)} s={pop(t, tMonth, 0.3)} />
				<Bar label="YEAR" x={MID + 230} y={1010} o={ramp(t, tYear, tYear + 0.1)} s={pop(t, tYear, 0.3)} />
			</g>
			{/* meloun a tři bubliny */}
			<g opacity={melonVis}>
				<Melon cx={MID} cy={melonY} s={melonS} inside={sm(ramp(t, tInside, tInside + 0.7))} />
			</g>
			<g opacity={bubO}>
				<Bubble y={790} label="SLIDE: ON TRACK" color={GREEN} o={ramp(t, tSlide, tSlide + 0.3)} />
				<Bubble y={910} label="TEAM: NOT STARTED" color={RED} o={ramp(t, tTeam, tTeam + 0.3)} />
				<Bubble
					y={1030}
					label="BUDGET: LEFT THE BUILDING"
					color={INK}
					dashed
					arrow
					o={ramp(t, tBudget, tBudget + 0.3)}
					dx={budgetGone}
				/>
			</g>
			{/* otazníky + kalendář */}
			{qs}
			<g transform={`translate(0 0)`}>
				<Calendar cx={810} cy={1010} s={calS} />
			</g>
		</>
	);

	// Dave stojí vedle tečky a nechce přepnout na červenou
	const dave = daveO > 0 ? (
		<g opacity={daveO}>
			<Bean x={290} y={1140} s={1.25} tie={BLUE} />
			<g transform={`translate(345 ${900 + sweat * 40})`} opacity={1 - sweat}>
				<path d="M 0 -22 C 14 -2 14 14 0 14 C -14 14 -14 -2 0 -22 Z" fill="#6EC3FF" />
			</g>
		</g>
	) : null;

	const cardShift = cut ? gap / 2 : 0;
	const halves = (
		<>
			<defs>
				<clipPath id="wm-left">
					<rect x="0" y="0" width={MID} height="1920" />
				</clipPath>
				<clipPath id="wm-right">
					<rect x={MID} y="0" width={MID} height="1920" />
				</clipPath>
			</defs>
			{/* červený střed pod půlkami */}
			<rect x={MID - gap / 2 - 2} y={CARD.y + 6} width={gap + 4} height={CARD.h - 8} fill={mix('#C2272F', '#FF3B45', flash)} />
			<g transform={`translate(${-cardShift} 0) rotate(${-tilt} ${MID} ${BOTTOM})`}>
				<g clipPath="url(#wm-left)">
					<Card>{body}</Card>
				</g>
			</g>
			<g transform={`translate(${cardShift} 0) rotate(${tilt} ${MID} ${BOTTOM})`}>
				<g clipPath="url(#wm-right)">
					<Card>{body}</Card>
				</g>
			</g>
		</>
	);

	return (
		<>
			<Svg>
				<g opacity={sceneO} transform={`translate(${MID} ${CARD.y}) scale(${cardS}) translate(${-MID} ${-CARD.y})`}>
					{cut ? halves : <Card>{body}</Card>}
					{dave}
					{/* prasklina před řezem */}
					{!cut && crack > 0 ? (
						<line x1={MID} y1={CARD.y} x2={MID} y2={lerp(CARD.y, knifeY, crack)} stroke={INK} strokeWidth="4" strokeDasharray="10 8" />
					) : null}
					{/* nůž */}
					<g opacity={knifeO} transform={`translate(${MID} ${knifeY})`}>
						<polygon points="-10,-300 10,-300 10,-24 0,6 -10,-24" fill="#D9DEE8" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
						<rect x="-22" y="-470" width="44" height="180" rx="14" fill={INK} />
					</g>
				</g>
				{/* pět fazolek v šoku */}
				<g opacity={sceneO}>
					{beans.map((b, i) => {
						const a = tShock + i * 0.09;
						const p = pop(t, a, 0.3);
						const jump = p > 0 ? Math.abs(Math.sin(ramp(t, a, a + 0.5) * Math.PI)) * 40 : 0;
						return p > 0 ? (
							<g key={i} transform={`translate(${b.x} ${beanBase}) scale(${Math.min(1.05, p)}) translate(${-b.x} ${-beanBase})`}>
								<Bean x={b.x} y={beanBase} s={b.s} tie={b.tie} jump={jump} shout={pop(t, a + 0.1, 0.25)} />
							</g>
						) : null;
					})}
				</g>
				{/* pointa: STATUS: GREEN v původním stavu */}
				{bigPill > 0 ? (
					<g transform={`translate(${MID} 760) scale(${bigPill}) translate(${-MID} -760)`}>
						<Pill x={MID - 400} y={680} w={800} h={160} size={72} />
					</g>
				) : null}
				{/* razítko */}
				{stamp > 0 ? (
					<g transform={`translate(${MID} 1010) rotate(-6) scale(${stamp})`}>
						<rect x="-440" y="-62" width="880" height="124" rx="16" fill="#fff" stroke={BLUE} strokeWidth="8" />
						<text x="0" y="16" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="46" letterSpacing="4" fill={BLUE}>
							THIS COULD HAVE BEEN A SHORT
						</text>
					</g>
				) : null}
			</Svg>
		</>
	);
};

export const WatermelonShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#F4F1EA" vig={0.1}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
