import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, Bean, GOLD, GREEN, INK, RED, lerp, pop} from './WatermelonShort';
import {ChannelStamp, Pill, ease} from './PlanKit';

/*
 * W22 "Brooks's law" (visuals/brooks-law.md), progress bar + tým.
 * Bar 60 % -> dva noví inženýři -> jedna fazolka je učí a přestane pracovat -> 3 uzly/3 čáry -> 5 uzlů/10 čar -> citát Brooks 1975 -> bar couvne na 55 %.
 */

const NAVY = '#243A66';
const GRAY = '#7B8498';
const TIES = [BLUE, GREEN, GOLD, RED, '#8A5CD6'];

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tMore = cue(segs, /^So management/);
	const tTwo = cue(segs, /^Two new engineers/);
	const tTeach = cue(segs, /^Someone must teach/);
	const tDoing = cue(segs, /^That someone/);
	const tTeamNow = cue(segs, /^The team now has/);
	const tThree = cue(segs, /^Three people/);
	const tFive = cue(segs, /^Five need ten/);
	const tBrooks = cue(segs, /^In nineteen seventy-five/);
	const tLater = cue(segs, /^adding people/);
	const tBar = cue(segs, /^On the progress bar/);
	const tAfter = cue(segs, /^After onboarding/);

	const progress = t >= tAfter ? lerp(60, 55, ease(t, tAfter, tAfter + 1.2)) : 60;
	const teamO = 1 - ease(t, tTeamNow - 0.3, tTeamNow);
	const netO = ease(t, tTeamNow, tTeamNow + 0.3) * (1 - ease(t, tBrooks - 0.3, tBrooks));
	const quoteO = ease(t, tBrooks, tBrooks + 0.3) * (1 - ease(t, tBar - 0.3, tBar));
	const bigO = ease(t, tBar, tBar + 0.3);

	const nodes = (n: number, cx: number, cy: number, r: number) => Array.from({length: n}, (_, i) => [cx + r * Math.sin((i / n) * 2 * Math.PI), cy - r * Math.cos((i / n) * 2 * Math.PI)]);
	const nodesN = t >= tFive ? 5 : 3;
	const pts = nodes(nodesN, 540, 930, 200);
	const lines: [number[], number[]][] = [];
	for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) lines.push([pts[i], pts[j]]);

	const newcomerX = (i: number) => lerp(1200, 800 + i * 130, ease(t, tTwo + i * 0.3, tTwo + 0.9 + i * 0.3));
	return (
		<Svg>
			{/* bar */}
			<rect x="100" y="340" width="880" height="170" rx="26" fill="#fff" stroke={INK} strokeWidth="5" />
			<text x="140" y="395" fontFamily={font} fontWeight="900" fontSize="30" letterSpacing="3" fill={NAVY}>
				PROJECT PROGRESS
			</text>
			<g opacity={pop(t, 0.5, 0.3) > 0 ? Math.min(1, pop(t, 0.5, 0.3)) : 0}>
				<rect x="520" y="365" width="160" height="44" rx="22" fill={RED} />
				<text x="600" y="397" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="26" fill="#fff">
					LATE
				</text>
			</g>
			<rect x="140" y="430" width="800" height="48" rx="24" fill="#E2E7F1" stroke={INK} strokeWidth="3" />
			<rect x="140" y="430" width={800 * (progress / 100)} height="48" rx="24" fill={t >= tAfter ? RED : GOLD} />
			<text x="940" y="410" textAnchor="end" fontFamily={font} fontWeight="900" fontSize="34" fill={INK}>
				{Math.round(progress)}%
			</text>

			<rect x="100" y="540" width="880" height="660" rx="26" fill="#F0F3FA" stroke={INK} strokeWidth="5" />
			{/* tým */}
			{teamO > 0.01 ? (
				<g opacity={teamO}>
					<rect x="100" y="1080" width="880" height="120" fill="#D5DCEC" />
					{[0, 1, 2].map((i) => {
						const x = 220 + i * 170;
						const teaching = i === 0 && t >= tTeach;
						return (
							<g key={i}>
								<g transform={teaching ? `translate(${x} 0) scale(-1 1) translate(${-x} 0)` : undefined}>
									<Bean x={x} y={1110} s={0.8} tie={TIES[i]} />
								</g>
								<g transform={`translate(${x} 820)`}>
									<rect x="-62" y="-26" width="124" height="52" rx="26" fill={teaching ? '#FFE3E3' : '#E3F6EC'} stroke={teaching ? RED : GREEN} strokeWidth="4" />
									<text x="0" y="9" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="24" fill={teaching ? RED : GREEN}>
										{teaching ? 'TEACHING' : 'WORKING'}
									</text>
								</g>
							</g>
						);
					})}
					{[0, 1].map((i) => (
						<g key={`n${i}`} opacity={t >= tTwo ? 1 : 0}>
							<Bean x={newcomerX(i)} y={1110} s={0.8} tie={TIES[3 + i]} />
							<g transform={`translate(${newcomerX(i)} 820)`}>
								<rect x="-44" y="-26" width="88" height="52" rx="26" fill="#FFF3C4" stroke={GOLD} strokeWidth="4" />
								<text x="0" y="9" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="24" fill={INK}>
									NEW
								</text>
							</g>
						</g>
					))}
					<Pill y={620} w={720} label="ADD MORE PEOPLE" color={BLUE} fs={34} o={ease(t, tMore, tMore + 0.25) * (1 - ease(t, tTwo, tTwo + 0.1))} />
					<Pill y={620} w={720} label="2 NEW ENGINEERS · MONDAY" color={GREEN} fs={32} o={ease(t, tTwo, tTwo + 0.25) * (1 - ease(t, tTeach - 0.1, tTeach))} />
					<Pill y={620} w={760} label="SOMEONE MUST TEACH THEM" color={GOLD} fs={32} o={ease(t, tTeach, tTeach + 0.25) * (1 - ease(t, tDoing - 0.1, tDoing))} />
					<Pill y={620} w={760} label="...THE PERSON DOING THE WORK" color={RED} fs={30} o={ease(t, tDoing, tDoing + 0.25)} />
				</g>
			) : null}

			{/* síť */}
			{netO > 0.01 ? (
				<g opacity={netO}>
					<Pill y={620} w={620} label={nodesN === 3 ? '3 PEOPLE · 3 CONVERSATIONS' : '5 PEOPLE · 10 CONVERSATIONS'} color={nodesN === 3 ? GREEN : RED} fs={30} o={ease(t, tThree, tThree + 0.25)} />
					{lines.map(([a, b], i) => (
						<line key={`${nodesN}-${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={nodesN === 3 ? GREEN : RED} strokeWidth="6" opacity={0.85 * ease(t, (nodesN === 3 ? tThree : tFive) + i * 0.12, (nodesN === 3 ? tThree : tFive) + 0.3 + i * 0.12)} />
					))}
					{pts.map(([x, y], i) => (
						<circle key={i} cx={x} cy={y} r="30" fill={TIES[i % 5]} stroke={INK} strokeWidth="5" />
					))}
				</g>
			) : null}

			{/* citát */}
			{quoteO > 0.01 ? (
				<g opacity={quoteO}>
					<text x="540" y="700" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="3" fill={GRAY}>
						FRED BROOKS · 1975
					</text>
					{['ADDING PEOPLE TO A', 'LATE SOFTWARE PROJECT', 'MAKES IT LATER.'].map((l, i) => (
						<text key={l} x="540" y={820 + i * 90} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="58" fill={i === 2 ? RED : INK} opacity={ease(t, tLater + i * 0.6, tLater + 0.3 + i * 0.6)}>
							{l}
						</text>
					))}
				</g>
			) : null}

			{/* velké číslo */}
			{bigO > 0.01 ? (
				<g opacity={bigO}>
					<text x="540" y="930" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="260" fill={t >= tAfter ? RED : GOLD}>
						{Math.round(progress)}%
					</text>
					<Pill y={1050} w={640} label={t >= tAfter ? 'AFTER ONBOARDING' : 'BEFORE'} color={t >= tAfter ? RED : GRAY} fs={34} o={1} />
				</g>
			) : null}
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const BrooksLawShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#16213E" vig={0.45}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
