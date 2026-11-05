import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {Bean, GOLD, GREEN, INK, RED, BLUE, lerp, pop} from './WatermelonShort';
import {ChannelStamp, Pill, ease} from './PlanKit';

/*
 * W10 "Goodhart / OKR" (visuals/goodhart-okr.md), dashboard podpory.
 * Objective + KR 0/40 -> týdny 40, 42 -> ticket se štěpí na pět -> 160/40, dashboard svítí -> fronta zákazníků -> citát -> KR ✔ / Objective beze změny.
 */

const CARD = {x: 100, y: 330, w: 880, h: 900};
const NAVY = '#1F2E55';
const PAPER = '#F7F9FC';
const GRAY = '#7B8498';

const Ticket: React.FC<{x: number; y: number; s?: number; label: string; done?: number; o?: number}> = ({x, y, s = 1, label, done = 0, o = 1}) => (
	<g opacity={o} transform={`translate(${x} ${y}) scale(${s})`}>
		<rect x="-62" y="-44" width="124" height="88" rx="10" fill="#fff" stroke={INK} strokeWidth="5" />
		<rect x="-62" y="-44" width="124" height="22" rx="10" fill={done > 0 ? GREEN : BLUE} />
		<text x="0" y="14" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="28" fill={INK}>
			{label}
		</text>
		{done > 0 ? <path d="M -22 24 L -8 34 L 22 6" fill="none" stroke={GREEN} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" transform={`scale(${0.7})`} /> : null}
	</g>
);

const Clock: React.FC<{x: number; y: number; t: number}> = ({x, y, t}) => (
	<g transform={`translate(${x} ${y})`}>
		<circle r="58" fill="#fff" stroke={INK} strokeWidth="6" />
		<line x1="0" y1="0" x2="0" y2="-40" stroke={INK} strokeWidth="6" strokeLinecap="round" transform={`rotate(${t * 140})`} />
		<line x1="0" y1="0" x2="0" y2="-26" stroke={RED} strokeWidth="7" strokeLinecap="round" transform={`rotate(${t * 12})`} />
	</g>
);

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tObj = cue(segs, /^improve customer/);
	const tKr = cue(segs, /^The key result/);
	const tW1 = cue(segs, /^forty tickets closed/);
	const tW2 = cue(segs, /^forty-two/);
	const tDisc = cue(segs, /^By week three/);
	const tClosed = cue(segs, /^A ticket can be closed/);
	const tSplit = cue(segs, /^Or one ticket/);
	const tSoon = cue(segs, /^Soon they/);
	const tGlow = cue(segs, /^The dashboard glows/);
	const tWait = cue(segs, /^Customers are still/);
	const tEcon = cue(segs, /^An economist/);
	const tPop = cue(segs, /^when a measure/);
	const tAch = cue(segs, /^achieved/);
	const tUnch = cue(segs, /^unchanged/);

	// čítač a bar
	const n =
		t < tW1 ? 0 : t < tW2 ? lerp(0, 40, ease(t, tW1, tW1 + 0.7)) : t < tSoon ? lerp(40, 42, ease(t, tW2, tW2 + 0.4)) : lerp(42, 160, ease(t, tSoon, tSoon + 1.8));
	const barW = Math.min(1, n / 40) * 760;
	const over = Math.max(0, n / 40 - 1);
	const glow = ease(t, tGlow - 0.6, tGlow) * (0.6 + 0.4 * Math.sin(t * 6));

	const tkO = ease(t, tDisc, tDisc + 0.3) * (1 - ease(t, tWait - 0.3, tWait));
	const closeP = ease(t, tClosed + 0.3, tClosed + 0.7);
	const split = ease(t, tSplit + 0.2, tSplit + 1.0);
	const waitO = ease(t, tWait, tWait + 0.3) * (1 - ease(t, tEcon - 0.3, tEcon));
	const quoteO = ease(t, tEcon, tEcon + 0.35);
	const stampA = pop(t, tAch, 0.35);
	const stampU = pop(t, tUnch, 0.35);

	return (
		<Svg>
			<rect x={CARD.x + 8} y={CARD.y + 14} width={CARD.w} height={CARD.h} rx="32" fill="rgba(0,0,0,0.3)" />
			{glow > 0 ? <rect x={CARD.x - 14} y={CARD.y - 14} width={CARD.w + 28} height={CARD.h + 28} rx="42" fill={GOLD} opacity={0.55 * glow} /> : null}
			<rect x={CARD.x} y={CARD.y} width={CARD.w} height={CARD.h} rx="32" fill={PAPER} stroke={INK} strokeWidth="5" />
			<path d={`M ${CARD.x} ${CARD.y + 80} V ${CARD.y + 32} A 32 32 0 0 1 ${CARD.x + 32} ${CARD.y} H ${CARD.x + CARD.w - 32} A 32 32 0 0 1 ${CARD.x + CARD.w} ${CARD.y + 32} V ${CARD.y + 80} Z`} fill={NAVY} />
			<text x="540" y={CARD.y + 56} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="36" letterSpacing="6" fill="#fff">
				SUPPORT DASHBOARD
			</text>

			{/* Objective */}
			<g opacity={pop(t, 0.1, 0.4)}>
				<rect x="130" y="430" width="820" height="110" rx="18" fill="#fff" stroke={INK} strokeWidth="4" />
				<text x="160" y="470" fontFamily={font} fontWeight="800" fontSize="26" letterSpacing="4" fill={GRAY}>
					OBJECTIVE
				</text>
				<text x="160" y="520" fontFamily={font} fontWeight="900" fontSize="42" fill={INK}>
					IMPROVE CUSTOMER SUPPORT
				</text>
				{stampU > 0 ? (
					<g transform={`translate(790 452) rotate(-6) scale(${Math.min(stampU, 1.05)})`}>
						<rect x="-120" y="-26" width="240" height="52" rx="10" fill="#fff" stroke={GRAY} strokeWidth="5" />
						<text x="0" y="10" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" letterSpacing="2" fill={GRAY}>
							UNCHANGED
						</text>
					</g>
				) : null}
			</g>

			{/* Key result */}
			{t >= tKr - 0.1 ? (
				<g opacity={pop(t, tKr, 0.35)}>
					<rect x="130" y="560" width="820" height="200" rx="18" fill="#fff" stroke={INK} strokeWidth="4" />
					<text x="160" y="600" fontFamily={font} fontWeight="800" fontSize="26" letterSpacing="4" fill={GRAY}>
						KEY RESULT
					</text>
					<text x="160" y="645" fontFamily={font} fontWeight="900" fontSize="38" fill={INK}>
						CLOSE 40 TICKETS / WEEK
					</text>
					<rect x="160" y="668" width="760" height="38" rx="19" fill="#E2E7F1" stroke={INK} strokeWidth="3" />
					<rect x="160" y="668" width={Math.max(0, barW)} height="38" rx="19" fill={over > 0 ? GOLD : GREEN} />
					{over > 0 ? <rect x="160" y="668" width="760" height="38" rx="19" fill="none" stroke={RED} strokeWidth="6" opacity={Math.min(1, over)} /> : null}
					<text x="160" y="743" fontFamily={font} fontWeight="900" fontSize="34" fill={over > 0 ? RED : INK}>
						{Math.round(n)} / 40
					</text>
					{over > 0 ? (
						<text x="920" y="743" textAnchor="end" fontFamily={font} fontWeight="900" fontSize="34" fill={RED}>
							{Math.round((n / 40) * 100)} %
						</text>
					) : null}
					{stampA > 0 ? (
						<g transform={`translate(770 586) rotate(-6) scale(${Math.min(stampA, 1.05)})`}>
							<rect x="-150" y="-26" width="300" height="52" rx="10" fill="#fff" stroke={GREEN} strokeWidth="5" />
							<text x="0" y="10" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" letterSpacing="2" fill={GREEN}>
								✔ ACHIEVED
							</text>
						</g>
					) : null}
				</g>
			) : null}

			{/* týdny */}
			<Pill x={240} y={825} w={250} label="WEEK 1 · 40" color={GREEN} fs={27} o={Math.min(1, pop(t, tW1 + 0.2, 0.3))} />
			<Pill x={540} y={825} w={250} label="WEEK 2 · 42" color={GREEN} fs={27} o={Math.min(1, pop(t, tW2 + 0.1, 0.3))} />
			<Pill x={840} y={825} w={250} label={t >= tSoon ? `WEEK 3 · ${Math.round(n)}` : 'WEEK 3 · ?'} color={t >= tSoon ? RED : GRAY} fs={27} o={Math.min(1, pop(t, tDisc, 0.3))} />

			{/* tickety */}
			{tkO > 0.01 ? (
				<g opacity={tkO}>
					{t < tSplit + 0.2 ? (
						<>
							<Ticket x={240} y={990} label="#1042" done={closeP} o={1} />
							<Ticket x={540} y={990} label="#1043" done={0} o={t >= tClosed + 0.7 ? Math.min(1, pop(t, tClosed + 0.7, 0.3)) : 0} />
							{t >= tClosed + 0.7 ? (
								<path d="M 330 960 Q 390 900 450 960" fill="none" stroke={INK} strokeWidth="5" strokeDasharray="10 8" opacity="0.5" />
							) : null}
							<Ticket x={840} y={990} label="#1044" />
						</>
					) : null}
					{t >= tSplit + 0.2
						? [0, 1, 2, 3, 4].map((i) => {
								const tx = lerp(540, 210 + i * 165, split);
								const ty = lerp(990, 990 + (i % 2) * 50 - 25, split);
								return <Ticket key={i} x={tx} y={ty} s={lerp(1, 0.78, split)} label={`#${1100 + i}`} done={ease(t, tSplit + 1.0 + i * 0.25, tSplit + 1.3 + i * 0.25)} />;
							})
						: null}
				</g>
			) : null}

			{/* fronta zákazníků */}
			{waitO > 0.01 ? (
				<g opacity={waitO}>
					<rect x="130" y="880" width="820" height="310" rx="22" fill="#DCE8F7" stroke={INK} strokeWidth="5" />
					<rect x="150" y="900" width="560" height="270" rx="12" fill="#B9D0EE" stroke={INK} strokeWidth="4" />
					<Pill x={430} y={950} w={400} label="STILL WAITING" color={RED} fs={34} />
					{[0, 1, 2, 3].map((i) => (
						<Bean key={i} x={215 + i * 125} y={1150 + Math.sin(t * 2 + i) * 3} s={0.45} tie={[BLUE, GREEN, RED, GOLD][i]} />
					))}
					<Clock x={830} y={1030} t={Math.max(0, t - tWait)} />
					<text x="830" y="1130" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={INK}>
						DAY {Math.min(9, 1 + Math.floor(Math.max(0, t - tWait) * 2.5))}
					</text>
				</g>
			) : null}

			{/* citát */}
			{quoteO > 0.01 ? (
				<g opacity={quoteO} transform={`translate(0 ${(1 - quoteO) * 24})`}>
					<rect x="130" y="880" width="820" height="310" rx="22" fill="#fff" stroke={INK} strokeWidth="5" />
					<text x="540" y="940" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" letterSpacing="3" fill={GRAY}>
						CHARLES GOODHART · 1975
					</text>
					<g opacity={ease(t, tPop, tPop + 0.3)}>
						{['WHEN A MEASURE BECOMES A TARGET,', 'IT STOPS BEING', 'A GOOD MEASURE.'].map((l, i) => (
							<text key={l} x="540" y={1020 + i * 60} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="40" fill={i === 0 ? INK : RED}>
								{l}
							</text>
						))}
					</g>
				</g>
			) : null}
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const GoodhartOkrShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#16213E" vig={0.45}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
