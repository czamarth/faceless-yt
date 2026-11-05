import React from 'react';
import type {Segment, ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, Bean, GOLD, GREEN, INK, RED, cueAt, lerp, pop} from './WatermelonShort';
import {ChannelStamp, PunchStamp, ease} from './PlanKit';

/*
 * W04 "Use it or lose it" (visuals/use-it-or-lose-it.md).
 * Donut rozpočtu (11 % zbývá) -> kalendář přeskočí na leden -> účtenka nákupů -> výbor nad "40 chairs" -> razítko.
 */

const CARD = {x: 100, y: 330, w: 880, h: 900, head: 110};
const MID = 540;
const USED = '#8E97AB';
const R = 190;
const CIRC = 2 * Math.PI * R;

const Calendar: React.FC<{x: number; y: number; month: string; flip: number}> = ({x, y, month, flip}) => {
	// flip: 0 -> 1 otočí stránku (scaleY klesne na 0 a vrátí se s novým měsícem)
	const sy = Math.abs(Math.cos(flip * Math.PI));
	return (
		<g transform={`translate(${x} ${y}) scale(1 ${Math.max(0.04, sy)})`}>
			<rect x="-90" y="-80" width="180" height="160" rx="18" fill="#fff" stroke={INK} strokeWidth="6" />
			<path d="M -90 -50 A 18 18 0 0 1 -72 -80 H 72 A 18 18 0 0 1 90 -50 V -28 H -90 Z" fill={RED} />
			<text x="0" y="-38" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" letterSpacing="3" fill="#fff">
				{month === 'DEC' ? 'DECEMBER' : 'JANUARY'}
			</text>
			<text x="0" y="48" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="64" fill={INK}>
				{month === 'DEC' ? '31' : '1'}
			</text>
		</g>
	);
};

const Row: React.FC<{y: number; label: string; note?: string; o: number}> = ({y, label, note, o}) => (
	<g opacity={o} transform={`translate(0 ${(1 - o) * 30})`}>
		<rect x="170" y={y - 44} width="740" height="88" rx="14" fill="#fff" stroke={INK} strokeWidth="4" />
		<text x="200" y={y + 4} fontFamily="Consolas, monospace" fontWeight="900" fontSize="36" fill={INK}>
			{label}
		</text>
		{note ? (
			<text x="200" y={y + 36} fontFamily="Consolas, monospace" fontWeight="700" fontSize="22" fill={INK} opacity="0.6">
				{note}
			</text>
		) : null}
	</g>
);

const Scene: React.FC<{t: number; segs: Segment[]; total: number}> = ({t, segs, total}) => {
	const tEleven = cueAt(segs, /^A department has eleven/, 0.55);
	const tRule = cue(segs, /^money that is not spent/);
	const tNext = cueAt(segs, /^money that is not spent/, 0.62);
	const tSpends = cue(segs, /^It spends/);
	const tChairs = cue(segs, /^Forty new chairs/);
	const tSoft = cue(segs, /^A software/);
	const tMon = cue(segs, /^Three monitors/);
	const tWork = cue(segs, /^A workshop/);
	const tJan = cue(segs, /^In January/);
	const tForty = cueAt(segs, /^In January/, 0.8);
	const tConc = cue(segs, /^the department clearly/);

	// ---- donut ---------------------------------------------------------------
	const donutIn = pop(t, 0.3, 0.5);
	const donutOut = ease(t, tNext + 0.2, tNext + 0.7);
	const hi = ease(t, tEleven, tEleven + 0.4);
	const leftPct = Math.round(11 * (1 - ease(t, tSpends + 0.3, tWork + 1.2)));

	// ---- kalendář -------------------------------------------------------------
	const flip = ease(t, tNext, tNext + 0.7);
	const month = flip < 0.5 ? 'DEC' : 'JAN';

	// ---- účtenka ------------------------------------------------------------------
	const recO = ease(t, tSpends, tSpends + 0.4) * (1 - ease(t, tJan - 0.3, tJan));
	const binS = pop(t, tWork + 1.0, 0.35);
	const tRational = cue(segs, /^So the department does/);
	const plaqueO = ease(t, tRule, tRule + 0.3) * (1 - ease(t, tRational - 0.2, tRational + 0.1));
	const zero = ease(t, tNext + 0.3, tNext + 0.6);
	const thinkO = ease(t, tRational, tRational + 0.3) * (1 - ease(t, tSpends + 0.2, tSpends + 0.5));
	const calO = 1 - ease(t, tJan - 0.3, tJan);

	// ---- výbor ----------------------------------------------------------------------
	const comO = ease(t, tJan, tJan + 0.4);
	const chairsS = pop(t, tForty, 0.35);
	const tIncreased = tConc + 1.2;

	return (
		<Svg>
			<g opacity={1 - ease(t, tConc + 1.5, tConc + 1.9) * 0.8}>
				<rect x={CARD.x + 8} y={CARD.y + 14} width={CARD.w} height={CARD.h} rx="36" fill="rgba(27,31,42,0.12)" />
				<rect x={CARD.x} y={CARD.y} width={CARD.w} height={CARD.h} rx="36" fill="#fff" stroke={INK} strokeWidth="5" />
				<path
					d={`M ${CARD.x} ${CARD.y + CARD.head} V ${CARD.y + 36} A 36 36 0 0 1 ${CARD.x + 36} ${CARD.y} H ${CARD.x + CARD.w - 36} A 36 36 0 0 1 ${CARD.x + CARD.w} ${CARD.y + 36} V ${CARD.y + CARD.head} Z`}
					fill="#EDEAE0"
				/>
				<line x1={CARD.x} y1={CARD.y + CARD.head} x2={CARD.x + CARD.w} y2={CARD.y + CARD.head} stroke={INK} strokeWidth="4" />
				<text x={CARD.x + 40} y={CARD.y + 70} fontFamily={font} fontWeight="900" fontSize="32" letterSpacing="4" fill={INK}>
					DEPT. BUDGET
				</text>
				<g transform={`translate(${CARD.x + CARD.w - 250} ${CARD.y + 25})`}>
					<rect x="0" y="0" width="220" height="60" rx="30" fill={leftPct > 0 ? GREEN : RED} />
					<text x="110" y="42" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill="#fff">
						{t < tNext + 0.7 ? `LEFT: ${leftPct}%` : `LEFT: ${leftPct}%`}
					</text>
				</g>

				{/* donut */}
				<g opacity={(1 - donutOut) * Math.min(1, donutIn)} transform={`translate(${MID} 760) scale(${Math.min(donutIn, 1.05)})`}>
					<circle r={R} fill="none" stroke={USED} strokeWidth="74" />
					<circle
						r={R}
						fill="none"
						stroke={GREEN}
						strokeWidth={74 + 14 * hi}
						strokeDasharray={`${CIRC * 0.11} ${CIRC}`}
						transform="rotate(-90)"
					/>
					<text x="0" y="22" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="86" fill={INK}>
						{hi > 0.1 ? '11%' : '89%'}
					</text>
					<text x="0" y="86" textAnchor="middle" fontFamily={font} fontWeight="800" fontSize="30" letterSpacing="3" fill={INK} opacity="0.7">
						{hi > 0.1 ? 'LEFT' : 'SPENT'}
					</text>
				</g>

				{/* kalendář */}
				<g opacity={calO}>
					<Calendar x={780} y={1090} month={month} flip={flip} />
				</g>

				{/* pravidlo */}
				{plaqueO > 0 ? (
					<g opacity={plaqueO} transform={`translate(${MID} 740)`}>
						<rect x="-360" y="-150" width="720" height="300" rx="28" fill="#fff" stroke={RED} strokeWidth="10" />
						<text x="0" y="-60" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="54" letterSpacing="2" fill={INK}>
							UNSPENT BUDGET
						</text>
						<text x="0" y="20" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="64" fill={RED} opacity={zero}>
							→ NEXT YEAR: $0
						</text>
						<text x="0" y="100" textAnchor="middle" fontFamily={font} fontWeight="800" fontSize="34" letterSpacing="3" fill={INK} opacity={0.6 * zero}>
							USE IT OR LOSE IT
						</text>
					</g>
				) : null}

				{/* "rational organization" */}
				{thinkO > 0 ? (
					<g opacity={thinkO}>
						<Bean x={420} y={1130} s={1.6} tie={BLUE} />
						<g transform="translate(640 760)">
							<ellipse cx="0" cy="0" rx="230" ry="100" fill="#fff" stroke={INK} strokeWidth="6" />
							<text x="0" y="16" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="56" fill={INK}>
								SPEND IT.
							</text>
							<circle cx="-190" cy="140" r="16" fill="#fff" stroke={INK} strokeWidth="5" />
							<circle cx="-250" cy="190" r="9" fill="#fff" stroke={INK} strokeWidth="5" />
						</g>
					</g>
				) : null}

				{/* účtenka */}
				{recO > 0 ? (
					<g opacity={recO}>
						<Row y={530} label="40× CHAIR" o={ease(t, tChairs, tChairs + 0.25)} />
						<Row y={640} label="SOFTWARE SUBSCRIPTION" note="(ordered by: unknown)" o={ease(t, tSoft, tSoft + 0.25)} />
						<Row y={750} label="3× MONITOR" note="team size: 2" o={ease(t, tMon, tMon + 0.25)} />
						<Row y={860} label="WORKSHOP: REDUCING WASTE" o={ease(t, tWork, tWork + 0.25)} />
						{binS > 0 ? (
							<g transform={`translate(540 1060) scale(${binS})`}>
								<path d="M -50 -60 H 50 L 40 70 H -40 Z" fill="#D9DEE8" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
								<rect x="-62" y="-80" width="124" height="18" rx="6" fill="#D9DEE8" stroke={INK} strokeWidth="6" />
								<path d="M -70 -90 L 70 80 M 70 -90 L -70 80" stroke={RED} strokeWidth="14" strokeLinecap="round" />
							</g>
						) : null}
					</g>
				) : null}

				{/* výbor */}
				{comO > 0 ? (
					<g opacity={comO}>
						<rect x="190" y="1020" width="700" height="40" rx="10" fill="#B07A4A" />
						<rect x="230" y="1060" width="22" height="130" fill="#8A5C34" />
						<rect x="828" y="1060" width="22" height="130" fill="#8A5C34" />
						<Bean x={300} y={1020} s={1.05} tie={BLUE} />
						<Bean x={540} y={1020} s={1.05} tie={GOLD} />
						<Bean x={780} y={1020} s={1.05} tie={RED} />
						{chairsS > 0 ? (
							<g transform={`translate(540 ${1000 - 0}) scale(${Math.min(chairsS, 1.05)})`}>
								<g transform="translate(0 -420)">
									<rect x="-300" y="-60" width="600" height="120" rx="20" fill="#fff" stroke={INK} strokeWidth="6" />
									<text x="0" y="22" textAnchor="middle" fontFamily="Consolas, monospace" fontWeight="900" fontSize="64" fill={INK}>
										40 CHAIRS
									</text>
								</g>
							</g>
						) : null}
					</g>
				) : null}
			</g>

			<PunchStamp t={t} at={tIncreased} lines={['CHAIR BUDGET:', 'INCREASED']} color={GREEN} y={800} size={92} />
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const UseItOrLoseItShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#F4F1EA" vig={0.1}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
