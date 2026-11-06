import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, GOLD, GREEN, INK, RED, lerp, pop} from './WatermelonShort';
import {ChannelStamp, Pill, PunchStamp, ease} from './PlanKit';

/*
 * W29 "Four-day week" (visuals/four-day-week.md), týdenní kalendář.
 * 61 firem (56 + 18) -> méně vyhoření -> pátek se zhroutí do čtvrtka -> Monday sync / review / preparation -> produktivita beze změny.
 */

const NAVY = '#243A66';
const GRAY = '#7B8498';
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tFifty = cue(segs, /^Fifty-six/);
	const tEight = cue(segs, /^Eighteen/);
	const tStaff = cue(segs, /^Staff reported/);
	const tQuestion = cue(segs, /^One question/);
	const tFit = cue(segs, /^how do you fit/);
	const tEasy = cue(segs, /^Easy/);
	const tComp = cue(segs, /^You compress/);
	const tSync = cue(segs, /^The Monday sync is now/);
	const tRev = cue(segs, /^The Monday sync review is/);
	const tPrep = cue(segs, /^The Monday sync review prep/);
	const tProd = cue(segs, /^Productivity/);
	const tUnch = cue(segs, /^unchanged/);
	const tSimply = cue(segs, /^The five days of meetings/);

	const gridO = pop(t, 0.1, 0.4) * (1 - ease(t, tQuestion - 0.3, tQuestion));
	const calO = ease(t, tQuestion, tQuestion + 0.4);
	const fri = ease(t, tEasy, tEasy + 1.2);
	const thuOver = ease(t, tEasy + 0.6, tEasy + 1.6);
	const monZoom = ease(t, tSync - 0.3, tSync + 0.4) * (1 - ease(t, tProd - 0.3, tProd));
	const prodO = ease(t, tProd, tProd + 0.3);

	// 61 ikon: 56 zelených, 18 z nich zlatý rámeček
	const icons = Array.from({length: 61}, (_, i) => i);

	const dx = (i: number) => 175 + i * 165;
	const blocks: [number, number, string][] = [
		[0, 0, BLUE],
		[0, 1, GREEN],
		[1, 0, GOLD],
		[1, 2, BLUE],
		[2, 1, RED],
		[2, 2, GREEN],
		[3, 0, BLUE],
		[4, 0, GOLD],
		[4, 1, RED],
		[4, 2, GREEN],
	];

	return (
		<Svg>
			{gridO > 0.01 ? (
				<g opacity={Math.min(1, gridO)}>
					<rect x="100" y="400" width="880" height="760" rx="26" fill="#fff" stroke={INK} strokeWidth="5" />
					<text x="540" y="470" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="40" letterSpacing="3" fill={NAVY}>
						UK 2022 · 61 COMPANIES
					</text>
					{icons.map((i) => {
						const c = i % 9;
						const r = Math.floor(i / 9);
						const x = 190 + c * 90;
						const y = 540 + r * 80;
						const kept = i < 56 && t >= tFifty;
						const perm = i < 18 && t >= tEight;
						const dropped = i >= 56 && t >= tFifty;
						return (
							<g key={i} opacity={ease(t, 0.3 + i * 0.03, 0.6 + i * 0.03)}>
								<rect x={x - 30} y={y - 28} width="60" height="56" rx="10" fill={dropped ? '#E2E7F1' : kept ? GREEN : '#B8C2DB'} stroke={perm ? GOLD : INK} strokeWidth={perm ? 8 : 3} />
								<rect x={x - 12} y={y - 12} width="24" height="10" rx="3" fill="#fff" opacity="0.7" />
							</g>
						);
					})}
					<Pill y={1110} w={0} label="" o={0} />
					<g opacity={ease(t, tFifty, tFifty + 0.3)}>
						<rect x="140" y="1085" width="360" height="56" rx="28" fill={GREEN} />
						<text x="320" y="1124" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill="#fff">
							56 KEPT IT
						</text>
					</g>
					<g opacity={ease(t, tEight, tEight + 0.3)}>
						<rect x="540" y="1085" width="380" height="56" rx="28" fill="#fff" stroke={GOLD} strokeWidth="7" />
						<text x="730" y="1124" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={INK}>
							18 PERMANENT
						</text>
					</g>
					<Pill y={1200} w={0} label="" o={0} />
				</g>
			) : null}
			<Pill y={1215} w={820} label="LESS BURNOUT · STABLE REVENUE" color={GREEN} fs={30} o={ease(t, tStaff, tStaff + 0.3) * (1 - ease(t, tQuestion - 0.3, tQuestion))} />

			{/* kalendář */}
			{calO > 0.01 ? (
				<g opacity={calO}>
					<rect x="100" y="400" width="880" height="760" rx="26" fill="#fff" stroke={INK} strokeWidth="5" />
					{DAYS.map((d, i) => {
						const x = i === 4 ? lerp(dx(4), dx(3), fri) : dx(i);
						const o = i === 4 ? 1 - ease(t, tEasy + 1.0, tEasy + 1.5) : 1;
						return (
							<g key={d} opacity={o}>
								<text x={x} y="460" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" letterSpacing="2" fill={i === 4 ? RED : NAVY}>
									{d}
								</text>
								<rect x={x - 70} y="490" width="140" height="500" rx="12" fill="#F4F6FB" stroke="#D5DBE8" strokeWidth="3" />
							</g>
						);
					})}
					{blocks.map(([col, row, color], i) => {
						const isFri = col === 4;
						const x = isFri ? lerp(dx(4), dx(3), fri) : dx(col);
						const y = isFri ? lerp(510 + row * 90, 510 + (row + 3 + (thuOver > 0 ? 0 : 0)) * 90, fri) : 510 + row * 90;
						const o = isFri ? 1 - ease(t, tEasy + 1.4, tEasy + 1.7) * 0 : 1;
						return <rect key={i} x={x - 60} y={y} width="120" height="74" rx="10" fill={color} opacity={0.9 * o} />;
					})}
					{fri > 0.2 ? (
						<g opacity={ease(t, tEasy + 0.9, tEasy + 1.4)}>
							<rect x={dx(3) - 70} y="490" width="140" height="500" rx="12" fill="none" stroke={RED} strokeWidth="6" />
						</g>
					) : null}
					<Pill y={1060} w={760} label="5 DAYS OF WORK → 4 DAYS" color={BLUE} fs={32} o={ease(t, tFit, tFit + 0.3) * (1 - ease(t, tComp - 0.2, tComp))} />
					<Pill y={1060} w={760} label="COMPRESS THE MEETINGS" color={RED} fs={32} o={ease(t, tComp, tComp + 0.3) * (1 - ease(t, tSync - 0.2, tSync))} />
					{prodO > 0.01 ? (
						<g opacity={prodO}>
							<rect x="150" y="1040" width="780" height="100" rx="50" fill="#fff" stroke={GOLD} strokeWidth="7" />
							<text x="540" y="1105" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="44" fill={INK}>
								PRODUCTIVITY: UNCHANGED
							</text>
						</g>
					) : null}
				</g>
			) : null}

			{/* Monday sync */}
			{monZoom > 0.01 ? (
				<g opacity={monZoom}>
					<rect x="150" y="470" width="780" height="540" rx="26" fill="#fff" stroke={INK} strokeWidth="6" />
					<text x="540" y="545" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="40" letterSpacing="4" fill={NAVY}>
						MONDAY
					</text>
					{[
						['9:00', 'SYNC', tSync, BLUE],
						['9:15', 'SYNC REVIEW', tRev, GOLD],
						['9:30', 'SYNC REVIEW PREPARATION', tPrep, RED],
					].map(([time, label, at, color], i) => (
						<g key={i} opacity={ease(t, at as number, (at as number) + 0.3)} transform={`translate(0 ${i * 120})`}>
							<rect x="190" y="590" width="700" height="96" rx="14" fill={color as string} />
							<text x="220" y="650" fontFamily={font} fontWeight="900" fontSize="38" fill={i === 1 ? INK : '#fff'}>
								{time}
							</text>
							<text x="350" y="650" fontFamily={font} fontWeight="900" fontSize={i === 2 ? 26 : 34} fill={i === 1 ? INK : '#fff'}>
								{label}
							</text>
						</g>
					))}
				</g>
			) : null}
			<PunchStamp t={t} at={tSimply + 0.2} lines={['5 DAYS OF MEETINGS', 'IN 4 DAYS']} color={RED} y={800} size={56} />
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const FourDayWeekShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#C6D3EA" vig={0.3}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
