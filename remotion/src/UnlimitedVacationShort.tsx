import React from 'react';
import type {Segment, ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, Bean, GOLD, GREEN, INK, RED, cueAt, lerp, pop} from './WatermelonShort';
import {ChannelStamp, PunchStamp, ease} from './PlanKit';

/*
 * W08 "Unlimited vacation" (visuals/unlimited-vacation.md).
 * Kalendář (∞, otazníky, přesně 20 dnů) -> pět fazolek se sledují -> "two weeks" -> dva sloupce studií -> razítko.
 */

const CARD = {x: 100, y: 330, w: 880, h: 900, head: 110};
const COLS = 7;
const ROWS = 6;
const CELL = 108;
const GX = 150;
const GY = 500;
const TIES = [BLUE, GOLD, GREEN, RED, BLUE];
const BX = [180, 360, 540, 720, 900];
const LIGHT_GREEN = '#BFEBD3';
const LIGHT_BLUE = '#B9CBFF';

const Eyes: React.FC<{dx: number; dy?: number}> = ({dx, dy = 0}) => (
	<g>
		{[-16, 16].map((ex) => (
			<g key={ex}>
				<circle cx={ex} cy="-174" r="11" fill="#fff" stroke={INK} strokeWidth="2.5" />
				<circle cx={ex + dx} cy={-174 + dy} r="5.5" fill={INK} />
			</g>
		))}
	</g>
);

const Suitcase: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<path d="M -14 -52 V -64 H 14 V -52" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
		<rect x="-38" y="-52" width="76" height="52" rx="8" fill="#B07A4A" stroke={INK} strokeWidth="5" />
		<rect x="-38" y="-30" width="76" height="8" fill="#8A5C34" />
	</g>
);

const Scene: React.FC<{t: number; segs: Segment[]; total: number}> = ({t, segs, total}) => {
	const tUnl = cue(segs, /^unlimited vacation/);
	const tNoCap = cue(segs, /^No cap/);
	const tNoTrack = cue(segs, /^No tracking/);
	const tTake = cue(segs, /^Take as much as you need/);
	const tNormal = cue(segs, /^how much is normal/);
	const tOld = cue(segs, /^Under the old policy/);
	const tTook = cue(segs, /^You took the number/);
	const tNewPol = cue(segs, /^Under the new policy/);
	const tWatch = cue(segs, /^So everyone watches/);
	const tFirst = cue(segs, /^Nobody wants to be the first/);
	const tMost = cue(segs, /^Nobody wants to be the one/);
	const tStud = cue(segs, /^Studies on this/);
	const tLess = cue(segs, /^Some find/);
	const tMore = cue(segs, /^Others find/);
	const tAgree = cue(segs, /^Everyone agrees/);
	const tMay = cue(segs, /^You may take/);

	const cardO = 1;
	const calO = pop(t, 0.15, 0.4) * (1 - ease(t, tWatch - 0.3, tWatch));
	const beansO = ease(t, tWatch - 0.1, tWatch + 0.3) * (1 - ease(t, tStud - 0.3, tStud));
	const chartO = ease(t, tStud, tStud + 0.3) * (1 - ease(t, tMay - 0.3, tMay));

	// ---- stav buněk kalendáře ---------------------------------------------------------------------------------
	const cells = Array.from({length: COLS * ROWS}, (_, i) => {
		const col = i % COLS;
		const row = Math.floor(i / COLS);
		const x = GX + col * CELL + CELL / 2;
		const y = GY + row * 100 + 45;
		let fill = '#fff';
		let label: string = String(i + 1);
		let fg = INK;
		if (t >= tTake) {
			const g = ease(t, tTake + i * 0.03, tTake + i * 0.03 + 0.2);
			if (g > 0.5 && t < tNormal) fill = LIGHT_GREEN;
		}
		if (t >= tNormal && t < tOld) {
			label = '?';
			fg = RED;
		}
		if (t >= tOld && t < tNewPol) {
			const k = ease(t, tOld + 0.1 + i * 0.045, tOld + 0.3 + i * 0.045);
			if (i < 20) fill = k > 0.5 ? LIGHT_BLUE : '#fff';
			else fill = k > 0.5 ? '#E4E2DA' : '#fff';
			if (i >= 20 && k > 0.5) fg = '#9AA0AD';
		}
		if (t >= tNewPol) {
			label = '?';
			fg = RED;
		}
		const fade = 1 - row * 0.13;
		return (
			<g key={i} opacity={fade}>
				<rect x={x - 46} y={y - 38} width="92" height="84" rx="12" fill={fill} stroke={INK} strokeWidth="3" />
				<text x={x} y={y + 14} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize={label === '?' ? 46 : 30} fill={fg}>
					{label}
				</text>
			</g>
		);
	});

	const pillText = t >= tNewPol ? 'NO NUMBER' : t >= tOld ? '20 DAYS' : t >= tUnl ? '∞ DAYS' : 'NEW POLICY';
	const pillColor = t >= tNewPol ? RED : t >= tOld ? BLUE : t >= tUnl ? GREEN : INK;
	const infS = pop(t, tUnl, 0.45) * (1 - ease(t, tUnl + 1.3, tUnl + 1.7));
	const capO = ease(t, tNoCap, tNoCap + 0.2) * (1 - ease(t, tTake - 0.1, tTake + 0.2));
	const trkO = ease(t, tNoTrack, tNoTrack + 0.2) * (1 - ease(t, tTake - 0.1, tTake + 0.2));
	const tookO = ease(t, tTook, tTook + 0.3) * (1 - ease(t, tNewPol - 0.1, tNewPol + 0.1));

	// ---- fazolky ------------------------------------------------------------------------------------------------------------------
	const jump = 120 * ease(t, tFirst + 0.5, tFirst + 1.1) * (1 - ease(t, tMost - 0.2, tMost + 0.2));
	const raised = t >= tFirst + 0.5 && t < tMost + 0.2;
	const bobJ = Math.abs(Math.sin(t * 8)) * 14 * (jump > 5 ? 1 : 0);
	const mostO = ease(t, tMost, tMost + 0.3);
	const beans = BX.map((x, i) => {
		const dir = i % 2 === 0 ? 1 : -1;
		const side = i < 2 ? -1 : 1;
		let dx = dir * 4.5;
		let dy = 0;
		if (t >= tFirst + 0.5) {
			dx = i === 2 ? 0 : side * 5;
			dy = i === 2 ? 0 : -3;
		}
		const p = pop(t, tWatch + i * 0.12, 0.3);
		const hero = i === 2;
		return (
			<g key={i} opacity={Math.min(1, p)}>
				<g transform={`translate(${x} ${1060 - (hero ? jump + bobJ : 0)}) scale(${0.85 * Math.min(p, 1.05)})`}>
					<Bean x={0} y={0} tie={TIES[i]} />
					<Eyes dx={dx} dy={dy} />
				</g>
				{hero && raised ? <Suitcase x={x + 70} y={1060 - jump - bobJ} s={0.85} /> : null}
			</g>
		);
	});

	// ---- sloupce studií -------------------------------------------------------------------------------------------------------------
	const base = 1110;
	const bLess = ease(t, tLess, tLess + 0.5);
	const bMore = ease(t, tMore, tMore + 0.5);
	const qS = pop(t, tAgree, 0.4);

	// ---- závěrečná fazolka s kufrem -----------------------------------------------------------------------------------------------
	const sneakO = ease(t, tMay - 0.2, tMay + 0.2);
	const sneakX = 540 + Math.sin(t * 2.2) * 12;

	return (
		<Svg>
			<g opacity={cardO}>
				<rect x={CARD.x + 8} y={CARD.y + 14} width={CARD.w} height={CARD.h} rx="36" fill="rgba(27,31,42,0.12)" />
				<rect x={CARD.x} y={CARD.y} width={CARD.w} height={CARD.h} rx="36" fill="#fff" stroke={INK} strokeWidth="5" />
				<path
					d={`M ${CARD.x} ${CARD.y + CARD.head} V ${CARD.y + 36} A 36 36 0 0 1 ${CARD.x + 36} ${CARD.y} H ${CARD.x + CARD.w - 36} A 36 36 0 0 1 ${CARD.x + CARD.w} ${CARD.y + 36} V ${CARD.y + CARD.head} Z`}
					fill="#EDEAE0"
				/>
				<line x1={CARD.x} y1={CARD.y + CARD.head} x2={CARD.x + CARD.w} y2={CARD.y + CARD.head} stroke={INK} strokeWidth="4" />
				<text x={CARD.x + 40} y={CARD.y + 70} fontFamily={font} fontWeight="900" fontSize="32" letterSpacing="4" fill={INK}>
					VACATION POLICY
				</text>
				<g transform={`translate(${CARD.x + CARD.w - 290} ${CARD.y + 25})`}>
					<rect x="0" y="0" width="260" height="60" rx="30" fill={pillColor} />
					<text x="130" y="42" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" letterSpacing="2" fill="#fff">
						{pillText}
					</text>
				</g>

				{/* kalendář */}
				<g opacity={Math.min(1, calO)}>{cells}</g>
				{infS > 0 ? (
					<g transform={`translate(540 800) scale(${Math.min(infS, 1.05)})`}>
						<circle r="190" fill="rgba(255,255,255,0.93)" stroke={GREEN} strokeWidth="10" />
						<text x="0" y="68" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="260" fill={GREEN}>
							∞
						</text>
					</g>
				) : null}
				{capO > 0 ? (
					<g opacity={capO} transform="translate(300 1180)">
						<rect x="-130" y="-34" width="260" height="68" rx="34" fill="#fff" stroke={INK} strokeWidth="5" />
						<text x="0" y="13" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="3" fill={INK}>
							CAP
						</text>
						<line x1="-110" y1="0" x2="110" y2="0" stroke={RED} strokeWidth="9" strokeLinecap="round" />
					</g>
				) : null}
				{trkO > 0 ? (
					<g opacity={trkO} transform="translate(640 1180)">
						<rect x="-170" y="-34" width="340" height="68" rx="34" fill="#fff" stroke={INK} strokeWidth="5" />
						<text x="0" y="13" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="3" fill={INK}>
							TRACKING
						</text>
						<line x1="-150" y1="0" x2="150" y2="0" stroke={RED} strokeWidth="9" strokeLinecap="round" />
					</g>
				) : null}
				{tookO > 0 ? (
					<g opacity={tookO} transform="translate(540 1190)">
						<rect x="-210" y="-34" width="420" height="68" rx="34" fill={BLUE} />
						<text x="0" y="13" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="3" fill="#fff">
							TOOK: 20 / 20
						</text>
					</g>
				) : null}

				{/* fazolky se sledují */}
				{beansO > 0 ? (
					<g opacity={beansO}>
						<rect x={CARD.x + 20} y="1062" width={CARD.w - 40} height="10" rx="5" fill="#EDEAE0" />
						{beans}
						{mostO > 0 ? (
							<g opacity={mostO * (raised ? 1 : 0.9)}>
								<g transform="translate(540 700)">
									<rect x="-190" y="-40" width="380" height="80" rx="40" fill="#fff" stroke={RED} strokeWidth="7" />
									<text x="0" y="14" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="40" fill={RED}>
										MOST DAYS: 14
									</text>
									<polygon points="-24,40 24,40 0,80" fill={RED} />
								</g>
							</g>
						) : null}
						{t >= tFirst + 0.5 && mostO === 0 ? (
							<g transform="translate(540 700)">
								<rect x="-190" y="-40" width="380" height="80" rx="40" fill="#fff" stroke={INK} strokeWidth="6" />
								<text x="0" y="14" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="40" fill={INK}>
									TWO WEEKS?
								</text>
								<polygon points="-24,40 24,40 0,80" fill={INK} />
							</g>
						) : null}
					</g>
				) : null}

				{/* studie */}
				{chartO > 0 ? (
					<g opacity={chartO}>
						<text x="540" y="520" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="46" letterSpacing="6" fill={INK}>
							STUDIES: MIXED
						</text>
						<line x1="170" y1={base} x2="910" y2={base} stroke={INK} strokeWidth="6" />
						<rect x="250" y={base - 280 * bLess} width="220" height={280 * bLess} rx="10" fill={BLUE} />
						<rect x="610" y={base - 360 * bMore} width="220" height={360 * bMore} rx="10" fill={GOLD} />
						<text x="360" y={base + 48} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={INK}>
							SLIGHTLY LESS
						</text>
						<text x="720" y={base + 48} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={INK}>
							SLIGHTLY MORE
						</text>
						{qS > 0 ? (
							<text x="540" y="780" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize={220 * Math.min(qS, 1.05)} fill={RED}>
								?
							</text>
						) : null}
					</g>
				) : null}

				{/* pointa: kufr po špičkách */}
				{sneakO > 0 ? (
					<g opacity={sneakO}>
						<rect x={CARD.x + 20} y="1062" width={CARD.w - 40} height="10" rx="5" fill="#EDEAE0" />
						<g transform={`translate(${sneakX} 1060) scale(1.05)`}>
							<Bean x={0} y={0} tie={BLUE} />
							<Eyes dx={Math.sin(t * 3) > 0 ? 5 : -5} />
						</g>
						<Suitcase x={sneakX + 85} y={1060} s={1.05} />
					</g>
				) : null}
			</g>

			<PunchStamp t={t} at={tMay + 0.9} lines={['AS LONG AS', 'NOBODY NOTICES']} color={RED} y={760} size={78} />
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const UnlimitedVacationShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#F4F1EA" vig={0.1}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
