import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {Bean, GOLD, GREEN, INK, RED, BLUE, lerp, pop} from './WatermelonShort';
import {ChannelStamp, Pill, PunchStamp, ease} from './PlanKit';

/*
 * W12 "Peter principle" (visuals/peter-principle.md), schody + org chart.
 * Fazolka povýšená krok za krokem, výkon klesá -> citát Laurence Peter 1969 -> nejvyšší schod s "?" -> org chart s bývalými řemesly -> poslední dovednost: povýšení.
 */

const PANEL = {x: 70, y: 330, w: 940, h: 900};
const BG = '#F4E9D8';
const NAVY = '#243A66';
const GRAY = '#7B8498';
const ROLES = ['JUNIOR', 'SENIOR', 'LEAD', 'MANAGER', 'DIRECTOR', 'VP'];
const SX = (i: number) => 175 + i * 148;
const SY = (i: number) => 1130 - i * 82;

const Star: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
	<polygon
		transform={`translate(${x} ${y}) scale(${s})`}
		points="0,-30 9,-10 30,-9 14,5 19,27 0,15 -19,27 -14,5 -30,-9 -9,-10"
		fill={GOLD}
		stroke={INK}
		strokeWidth="3"
	/>
);

const Box: React.FC<{x: number; y: number; label: string; ex: string; o: number; exO: number}> = ({x, y, label, ex, o, exO}) =>
	o > 0.01 ? (
		<g opacity={o} transform={`translate(${x} ${y})`}>
			<rect x="-95" y="-44" width="190" height="88" rx="14" fill="#fff" stroke={INK} strokeWidth="5" />
			<text x="0" y="-4" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={INK}>
				{label}
			</text>
			<g opacity={exO} transform="translate(0 66)">
				<rect x="-92" y="-24" width="184" height="48" rx="24" fill={GOLD} stroke={INK} strokeWidth="3" />
				<text x="0" y="8" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="22" fill={INK}>
					{ex}
				</text>
			</g>
		</g>
	) : null;

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tGreat = 0;
	const tPromo = cue(segs, /^So they promoted/);
	const tWorse = cue(segs, /^You are slightly worse/);
	const tNoComp = cue(segs, /^Nobody complains/);
	const tPeter = cue(segs, /^In nineteen sixty-nine/);
	const tRise = cue(segs, /^in a hierarchy/);
	const tThink = cue(segs, /^Think about it/);
	const tBad = cue(segs, /^Nobody is promoted/);
	const tGood = cue(segs, /^They are promoted/);
	const tStay = cue(segs, /^And then they stay/);
	const tDemote = cue(segs, /^Because nobody gets/);
	const tOrg = cue(segs, /^Look at any/);
	const tBoxes = cue(segs, /^Every box/);
	const tLast = cue(segs, /^The last thing/);

	// schod, na kterém fazolka stojí
	let step = 0;
	if (t >= tPromo) step = 1;
	if (t >= tRise) step = 1 + Math.min(4, Math.floor((t - tRise) / 1.0) + 1);
	// plynulý skok mezi schody
	const hopStart = t >= tRise ? tRise + (step - 2) * 1.0 : tPromo;
	const hopP = ease(t, hopStart, hopStart + 0.35);
	const prev = Math.max(0, step - 1);
	const bx = lerp(SX(prev), SX(step), hopP);
	const by = lerp(SY(prev), SY(step), hopP) - Math.sin(hopP * Math.PI) * 70;
	const perf = t < tWorse ? 1 : t < tRise ? 0.7 : Math.max(0.1, 0.7 - 0.6 * ease(t, tRise, tRise + 4));
	const stairsO = pop(t, 0, 0.4) * (1 - ease(t, tOrg - 0.3, tOrg));
	const topO = stairsO;
	const orgO = ease(t, tOrg, tOrg + 0.35);

	const qO = ease(t, tPeter, tPeter + 0.3) * (1 - ease(t, tThink - 0.2, tThink + 0.1));
	const qText = ease(t, tRise, tRise + 0.3);

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
				{/* schody */}
				{stairsO > 0.01 ? (
					<g opacity={Math.min(1, stairsO)}>
						{ROLES.map((r, i) => (
							<g key={r}>
								<rect x={SX(i) - 74} y={SY(i)} width="148" height={1240 - SY(i)} fill={i % 2 ? '#C9B28A' : '#D8C49C'} stroke={INK} strokeWidth="4" />
								<text x={SX(i)} y={SY(i) + 40} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="22" letterSpacing="1" fill={INK}>
									{r}
								</text>
							</g>
						))}
						<g opacity={0.45 + 0.55 * perf}>
							<Bean x={bx} y={by} s={0.62} tie={BLUE} jump={0} />
						</g>
						{/* ✔ / ? nad hlavou */}
						{t < tWorse ? (
							<g transform={`translate(${bx + 60} ${by - 150}) scale(${Math.min(1, pop(t, tGreat + 0.3, 0.3))})`}>
								<circle r="34" fill={GREEN} stroke={INK} strokeWidth="4" />
								<path d="M -16 2 L -5 14 L 17 -12" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
							</g>
						) : null}
						{step >= 5 ? (
							<text x={bx} y={by - 150} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="110" fill={RED} opacity={pop(t, tRise + 4.4, 0.3)}>
								?
							</text>
						) : null}
					</g>
				) : null}

				{/* horní zóna: výkon + citát + pilulky */}
				{topO > 0.01 ? (
					<g opacity={topO}>
						<text x="110" y="408" fontFamily={font} fontWeight="900" fontSize="28" letterSpacing="3" fill={NAVY}>
							PERFORMANCE
						</text>
						<rect x="400" y="380" width="520" height="36" rx="18" fill="#fff" stroke={INK} strokeWidth="4" />
						<rect x="400" y="380" width={520 * perf} height="36" rx="18" fill={perf > 0.55 ? GREEN : perf > 0.3 ? GOLD : RED} />
						<Pill x={540} y={490} w={560} label="PROMOTED" color={GREEN} fs={34} o={pop(t, tPromo + 0.1, 0.3) * (1 - ease(t, tPeter - 0.2, tPeter))} />
						<Pill x={540} y={490} w={600} label="COMPLAINTS: 0" color={GRAY} fs={34} o={ease(t, tNoComp, tNoComp + 0.25) * (1 - ease(t, tPeter - 0.2, tPeter))} />
						{qO > 0.01 ? (
							<g opacity={qO}>
								<rect x="120" y="450" width="840" height="130" rx="18" fill="#fff" stroke={INK} strokeWidth="4" />
								<text x="540" y="500" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" letterSpacing="3" fill={GRAY}>
									LAURENCE PETER · 1969
								</text>
								<text x="540" y="550" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="36" fill={INK} opacity={qText}>
									RISE UNTIL INCOMPETENT
								</text>
							</g>
						) : null}
						<Pill x={540} y={490} w={820} label="BAD AT THE JOB → PROMOTED" color={RED} fs={30} o={ease(t, tBad, tBad + 0.25) * (1 - ease(t, tGood - 0.2, tGood))} />
						{ease(t, tBad + 0.9, tBad + 1.2) > 0 && t < tGood ? (
							<line x1="140" y1="490" x2={140 + 800 * ease(t, tBad + 0.9, tBad + 1.2)} y2="490" stroke={RED} strokeWidth="9" strokeLinecap="round" />
						) : null}
						<Pill x={540} y={490} w={820} label="GOOD AT THE JOB → PROMOTED" color={GREEN} fs={30} o={ease(t, tGood, tGood + 0.25) * (1 - ease(t, tStay - 0.2, tStay))} />
						<Pill x={540} y={490} w={560} label="THEN THEY STAY" color={NAVY} fs={34} o={ease(t, tStay, tStay + 0.25) * (1 - ease(t, tDemote - 0.2, tDemote))} />
						<Pill x={540} y={490} w={780} label="DEMOTED: 0 (EXCELLENT AT THE WRONG JOB)" color={GRAY} fs={26} o={ease(t, tDemote, tDemote + 0.25)} />
					</g>
				) : null}

				{/* org chart */}
				{orgO > 0.01 ? (
					<g opacity={orgO}>
						<text x="540" y="410" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="38" letterSpacing="5" fill={NAVY}>
							ORG CHART
						</text>
						{[
							[540, 540, 280, 720],
							[540, 540, 800, 720],
							[280, 720, 170, 900],
							[280, 720, 390, 900],
							[800, 720, 690, 900],
							[800, 720, 910, 900],
						].map(([x1, y1, x2, y2], i) => (
							<line key={i} x1={x1} y1={y1 + 44} x2={x2} y2={y2 - 44} stroke={INK} strokeWidth="5" opacity={ease(t, tOrg + 0.2 + i * 0.08, tOrg + 0.5 + i * 0.08)} />
						))}
						{(
							[
								[540, 540, 'CEO', 'ex-salesman'],
								[280, 720, 'VP A', 'ex-engineer'],
								[800, 720, 'VP B', 'ex-designer'],
								[170, 900, 'MGR', 'ex-accountant'],
								[390, 900, 'MGR', 'ex-chef'],
								[690, 900, 'MGR', 'ex-pilot'],
								[910, 900, 'MGR', 'ex-DJ'],
							] as [number, number, string, string][]
						).map(([x, y, label, ex], i) => (
							<Box key={i} x={x} y={y} label={label} ex={ex} o={pop(t, tOrg + 0.1 + i * 0.1, 0.3)} exO={ease(t, tBoxes + i * 0.35, tBoxes + 0.25 + i * 0.35)} />
						))}
						<Star x={540} y={450} s={pop(t, tLast + 0.2, 0.4) * 1.4} />
					</g>
				) : null}
			</g>
			<PunchStamp t={t} at={tLast + 0.7} lines={['LAST SKILL:', 'GETTING PROMOTED']} color={RED} y={1118} size={56} />
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const PeterPrincipleShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#E2D3B8" vig={0.3}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
