import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, Bean, GOLD, GREEN, INK, RED, lerp, pop} from './WatermelonShort';
import {ChannelStamp, Pill, PunchStamp, ease} from './PlanKit';

/*
 * W26 "Standup" (visuals/standup-meeting.md), konferenční místnost.
 * Stojící fazolky, 15:00, XP -> notebook, káva, "conversation" -> židle, gauč, svačina -> 40:00 a výhled -> sedící fazolky, stejný nápis STANDUP.
 */

const PANEL = {x: 70, y: 330, w: 940, h: 900};
const NAVY = '#243A66';
const TIES = [BLUE, GREEN, GOLD, RED, '#8A5CD6'];
const FLOOR = 1110;

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tXp = cue(segs, /^It comes from/);
	const tFifteen = cue(segs, /^Fifteen minutes/);
	const tThreeQ = cue(segs, /^Three questions/);
	const tComfy = cue(segs, /^Nobody gets comfortable/);
	const tWorked = cue(segs, /^It worked/);
	const tLaptop = cue(segs, /^Then someone brought a laptop/);
	const tCoffee = cue(segs, /^Someone brought coffee/);
	const tConv = cue(segs, /^this is more of a/);
	const tChairs = cue(segs, /^Chairs arrived/);
	const tSofa = cue(segs, /^Then a sofa/);
	const tSnacks = cue(segs, /^Then snacks/);
	const tToday = cue(segs, /^Today, the daily/);
	const tStood = cue(segs, /^They stood up/);
	const tNow = cue(segs, /^Now they sit/);

	const timer = t < tToday ? (t >= tFifteen ? 15 : 15) : lerp(15, 40, ease(t, tToday + 0.3, tToday + 3.0));
	const timerTxt = `${String(Math.round(timer)).padStart(2, '0')}:00`;
	const timerCol = timer > 16 ? RED : GREEN;
	const sitting = ease(t, tChairs, tChairs + 0.8);
	const sofaO = pop(t, tSofa, 0.4);
	const snackO = pop(t, tSnacks, 0.4);
	const windowO = ease(t, tToday, tToday + 0.5);

	return (
		<Svg>
			<defs>
				<clipPath id="pclip">
					<rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx="36" />
				</clipPath>
			</defs>
			<rect x={PANEL.x + 8} y={PANEL.y + 14} width={PANEL.w} height={PANEL.h} rx="36" fill="rgba(27,31,42,0.18)" />
			<rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx="36" fill="#E8EEF8" stroke={INK} strokeWidth="5" />
			<g clipPath="url(#pclip)">
				<rect x={PANEL.x} y={FLOOR} width={PANEL.w} height="130" fill="#C9B88F" />
				{/* výhled */}
				{windowO > 0.01 ? (
					<g opacity={windowO}>
						<rect x="700" y="470" width="260" height="300" rx="14" fill="#9FC3E8" stroke={INK} strokeWidth="6" />
						<polygon points="710,770 710,640 760,640 760,700 820,700 820,580 880,580 880,770" fill="#6B7A99" />
						<circle cx="900" cy="520" r="26" fill={GOLD} />
						<text x="830" y="800" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="26" letterSpacing="3" fill={NAVY}>
							VIEW
						</text>
					</g>
				) : null}

				{/* nápis + timer */}
				<rect x="110" y="380" width="460" height="100" rx="22" fill={NAVY} stroke={INK} strokeWidth="5" />
				<text x="340" y="450" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="58" letterSpacing="8" fill="#fff">
					STANDUP
				</text>
				<g transform="translate(850 430)">
					<rect x="-120" y="-50" width="240" height="100" rx="20" fill="#0E1A2E" stroke={INK} strokeWidth="5" />
					<text x="0" y="22" textAnchor="middle" fontFamily="Consolas, 'Courier New', monospace" fontWeight="700" fontSize="70" fill={timerCol}>
						{timerTxt}
					</text>
				</g>

				{/* nábytek */}
				{sofaO > 0 ? (
					<g opacity={Math.min(1, sofaO)} transform={`translate(0 ${(1 - Math.min(1, sofaO)) * 40})`}>
						<rect x="160" y="1010" width="360" height="110" rx="26" fill="#B8693F" stroke={INK} strokeWidth="5" />
						<rect x="140" y="990" width="60" height="130" rx="22" fill="#9C5530" stroke={INK} strokeWidth="5" />
						<rect x="480" y="990" width="60" height="130" rx="22" fill="#9C5530" stroke={INK} strokeWidth="5" />
					</g>
				) : null}
				{snackO > 0 ? (
					<g transform={`translate(780 ${1100}) scale(${Math.min(snackO, 1.05)})`}>
						<rect x="-110" y="-60" width="220" height="14" rx="6" fill="#8A6B47" stroke={INK} strokeWidth="4" />
						<rect x="-90" y="-46" width="14" height="46" fill="#8A6B47" />
						<rect x="76" y="-46" width="14" height="46" fill="#8A6B47" />
						{[-60, -15, 30, 70].map((x, i) => (
							<circle key={i} cx={x} cy="-76" r="14" fill={[GOLD, RED, '#E07A3C', GREEN][i]} stroke={INK} strokeWidth="3" />
						))}
					</g>
				) : null}

				{/* fazolky */}
				{[0, 1, 2, 3, 4].map((i) => {
					const x = 230 + i * 150;
					const drop = sitting * 34;
					const inSofa = i < 2 && sitting > 0.5;
					const bx = inSofa ? 230 + i * 130 : x;
					return (
						<g key={i}>
							<Bean x={lerp(x, bx, sitting)} y={FLOOR + 10 + drop * (inSofa ? 0.3 : 1)} s={lerp(0.85, 0.78, sitting)} tie={TIES[i]} />
							{sitting > 0.1 && !inSofa ? (
								<g opacity={sitting}>
									<rect x={x - 46} y={FLOOR - 40 + drop} width="92" height="14" rx="6" fill="#5C6A8C" stroke={INK} strokeWidth="3" />
									<rect x={x - 6} y={FLOOR - 26 + drop} width="12" height="60" fill="#5C6A8C" />
								</g>
							) : null}
							{t >= tLaptop && i === 3 ? (
								<g transform={`translate(${x + 60} ${lerp(600, FLOOR - 110, ease(t, tLaptop, tLaptop + 0.5))})`}>
									<rect x="-34" y="-40" width="68" height="44" rx="4" fill="#2B2F3A" stroke={INK} strokeWidth="3" />
									<rect x="-44" y="6" width="88" height="10" rx="4" fill="#9AA3B8" stroke={INK} strokeWidth="3" />
								</g>
							) : null}
							{t >= tCoffee && i === 1 ? (
								<g transform={`translate(${x + 54} ${lerp(600, FLOOR - 100, ease(t, tCoffee, tCoffee + 0.5))})`}>
									<rect x="-18" y="-30" width="36" height="42" rx="6" fill="#fff" stroke={INK} strokeWidth="3" />
									<rect x="-18" y="-22" width="36" height="10" fill="#8A5A2B" />
								</g>
							) : null}
						</g>
					);
				})}

				{/* texty */}
				<Pill y={560} w={760} label="STAND UP → KEEP IT SHORT" color={GREEN} fs={32} o={ease(t, 0.8, 1.1) * (1 - ease(t, tXp - 0.1, tXp))} />
				<Pill y={560} w={760} label="XP · EXTREME PROGRAMMING" color={BLUE} fs={32} o={ease(t, tXp, tXp + 0.25) * (1 - ease(t, tFifteen - 0.1, tFifteen))} />
				<Pill y={560} w={760} label="15 MINUTES" color={GREEN} fs={34} o={ease(t, tFifteen, tFifteen + 0.25) * (1 - ease(t, tThreeQ - 0.1, tThreeQ))} />
				<Pill y={560} w={760} label="3 QUESTIONS" color={GREEN} fs={34} o={ease(t, tThreeQ, tThreeQ + 0.25) * (1 - ease(t, tComfy - 0.1, tComfy))} />
				<Pill y={560} w={760} label="NOBODY GETS COMFORTABLE" color={RED} fs={30} o={ease(t, tComfy, tComfy + 0.25) * (1 - ease(t, tWorked - 0.1, tWorked))} />
				<Pill y={560} w={760} label="IT WORKED. FOR A WHILE." color={GREEN} fs={32} o={ease(t, tWorked, tWorked + 0.25) * (1 - ease(t, tLaptop, tLaptop + 0.1))} />
				{t >= tConv ? (
					<g opacity={ease(t, tConv, tConv + 0.3) * (1 - ease(t, tChairs - 0.1, tChairs))} transform="translate(480 700)">
						<rect x="-330" y="-40" width="660" height="80" rx="40" fill="#fff" stroke={INK} strokeWidth="4" />
						<text x="0" y="12" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={INK}>
							“THIS IS MORE OF A CONVERSATION”
						</text>
					</g>
				) : null}
				<Pill y={620} w={760} label="TODAY: 40 MINUTES · WITH A VIEW" color={RED} fs={30} o={ease(t, tToday, tToday + 0.25) * (1 - ease(t, tStood - 0.1, tStood))} />
			</g>
			<PunchStamp t={t} at={tNow + 0.2} lines={['LONGEST MEETING', 'OF THE DAY']} color={RED} y={760} size={62} />
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const StandupShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#C6D3EA" vig={0.3}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
