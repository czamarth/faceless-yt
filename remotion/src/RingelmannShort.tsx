import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, Bean, GOLD, GREEN, INK, RED, lerp, pop} from './WatermelonShort';
import {ChannelStamp, Pill, PunchStamp, ease} from './PlanKit';

/*
 * W15 "Ringelmann effect" (visuals/ringelmann-effect.md), přetahování lanem.
 * 1 fazolka 63 kg -> 3 fazolky 189 -> 160 (-29) -> social loafing -> sloupce klesají -> 8 fazolek táhne jako 4, bubliny výmluv.
 */

const PANEL = {x: 70, y: 330, w: 940, h: 900};
const BG = '#EFE6D4';
const NAVY = '#243A66';
const GRAY = '#7B8498';
const ROPE_Y = 930;
const TIES = [BLUE, GREEN, RED, GOLD, '#8A5CD6', '#2FB6B6', '#E07A3C', '#5C6A8C'];
const EXCUSES = ['BUSY', 'NEXT SPRINT', 'BLOCKED', 'NOT MY AREA'];

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tOne = cue(segs, /^As later/);
	const tThree = cue(segs, /^So three/);
	const tPulled = cue(segs, /^They pulled/);
	const tNobody = cue(segs, /^Nobody slacked/);
	const tSimply = cue(segs, /^It simply/);
	const tPsych = cue(segs, /^Psychologists/);
	const tAdd = cue(segs, /^Add more/);
	const tEight = cue(segs, /^Which is why/);

	// kolik fazolek táhne (viditelných) a efektivní síla
	const n = t >= tEight ? 8 : t >= tThree ? 3 : 1;
	const eff = t >= tEight ? 4 : t >= tPulled ? 2.6 : t >= tThree ? 3 : 1;
	// poloha praporku na laně (integrace rychlosti)
	let dist = 0;
	for (let s = 0; s < t; s += 0.1) {
		const e = s >= tEight ? 4 : s >= tPulled ? 2.6 : s >= tThree ? 3 : 1;
		dist += e * 6 * 0.1;
	}
	const flagX = 250 + ((dist * 3) % 560);
	const lean = -9 + Math.sin(t * 5) * 1.5;

	const beanX = (i: number, count: number) => {
		const span = count === 8 ? 100 : count === 3 ? 150 : 150;
		return 930 - i * span;
	};
	const loaf = t >= tSimply && t < tAdd + 0.5 ? 1 : 0;

	const chipTxt = t >= tEight ? 'TEAM OF 8' : t >= tThree ? '3 × 63 = 189 KG' : t >= tOne ? '1 PERSON · 63 KG' : 'MAX RINGELMANN · c. 1900';
	const chipCol = t >= tEight ? RED : t >= tThree ? NAVY : t >= tOne ? GREEN : NAVY;

	const showNums = t >= tPulled && t < tNobody;
	const barO = ease(t, tAdd, tAdd + 0.3) * (1 - ease(t, tEight - 0.2, tEight));
	const bars = [63, 55, 50, 45, 42, 39];

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
				<rect x={PANEL.x} y="1030" width={PANEL.w} height="200" fill="#CDB98F" />
				{/* kotva vlevo */}
				<rect x="90" y={ROPE_Y - 70} width="26" height="150" rx="8" fill="#6B5A3E" stroke={INK} strokeWidth="4" />
				{/* lano */}
				<line x1="110" y1={ROPE_Y} x2="990" y2={ROPE_Y} stroke="#8A6B47" strokeWidth="18" strokeLinecap="round" />
				<line x1="110" y1={ROPE_Y} x2="990" y2={ROPE_Y} stroke="#B89A6A" strokeWidth="6" strokeDasharray="14 14" />
				<g transform={`translate(${flagX} ${ROPE_Y})`}>
					<rect x="-8" y="-10" width="16" height="20" fill={RED} />
					<polygon points="0,-10 0,-70 50,-52 0,-34" fill={RED} stroke={INK} strokeWidth="3" />
				</g>
				{/* fazolky */}
				{Array.from({length: n}, (_, i) => {
					const x = beanX(i, n);
					const loafing = loaf && n === 3 && i === 1 ? 1 : t >= tSimply && t < tAdd && n === 3 && i === 1 ? 1 : 0;
					const rot = loafing ? 0 : lean;
					const idle = n === 8 && i % 2 === 1;
					const pull = pop(t, (n === 8 ? tEight : n === 3 ? tThree : 0.1) + i * 0.12, 0.3);
					return (
						<g key={`${n}-${i}`} opacity={Math.min(1, pull)}>
							<g transform={`rotate(${idle ? rot * 0.3 : rot} ${x} 1015)`}>
								<Bean x={x} y={1015} s={0.62} tie={TIES[i % TIES.length]} />
								{!loafing && !idle ? <line x1={x - 18} y1="940" x2={x - 52} y2={ROPE_Y + 4} stroke="#F2C9A0" strokeWidth="11" strokeLinecap="round" /> : null}
							</g>
							{loafing && n === 3 ? (
								<g transform={`translate(${x} 790)`} opacity={ease(t, tSimply, tSimply + 0.3)}>
									<rect x="-170" y="-34" width="340" height="68" rx="34" fill="#fff" stroke={INK} strokeWidth="4" />
									<text x="0" y="12" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={INK}>
										SOMEONE ELSE WILL
									</text>
								</g>
							) : null}
							{idle && n === 8 ? (
								<g transform={`translate(${x} ${820 + (i % 4) * 0})`} opacity={ease(t, tEight + 0.6 + i * 0.15, tEight + 0.9 + i * 0.15)}>
									<rect x="-82" y="-26" width="164" height="52" rx="26" fill="#fff" stroke={INK} strokeWidth="3" />
									<text x="0" y="9" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="22" fill={INK}>
										{EXCUSES[(i - 1) / 2]}
									</text>
								</g>
							) : null}
						</g>
					);
				})}

				{/* čísla */}
				<Pill y={420} w={760} label={chipTxt} color={chipCol} fs={36} o={1} />
				{t >= tOne && t < tPulled ? (
					<text x="540" y="720" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="190" fill={t >= tThree ? NAVY : GREEN} opacity={ease(t, t >= tThree ? tThree : tOne, (t >= tThree ? tThree : tOne) + 0.3)}>
						{t >= tThree ? '189 KG' : '63 KG'}
					</text>
				) : null}
				{showNums ? (
					<g transform="translate(540 600)">
						<text x="-120" y="40" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="120" fill={GRAY}>
							189
						</text>
						<line x1="-230" y1="20" x2={-230 + 220 * ease(t, tPulled + 0.2, tPulled + 0.5)} y2="20" stroke={RED} strokeWidth="12" strokeLinecap="round" />
						<g opacity={pop(t, tPulled + 0.5, 0.3) > 0 ? Math.min(1, pop(t, tPulled + 0.5, 0.3)) : 0}>
							<text x="150" y="40" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="120" fill={GREEN}>
								160
							</text>
						</g>
						<g opacity={ease(t, tPulled + 1.0, tPulled + 1.3)}>
							<rect x="-100" y="80" width="200" height="64" rx="32" fill="#fff" stroke={RED} strokeWidth="5" />
							<text x="0" y="125" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="42" fill={RED}>
								−29 KG
							</text>
						</g>
					</g>
				) : null}
				<Pill y={560} w={720} label="NOBODY SLACKED ON PURPOSE" color={GRAY} fs={32} o={ease(t, tNobody, tNobody + 0.25) * (1 - ease(t, tPsych - 0.2, tPsych))} />
				<Pill y={560} w={620} label="SOCIAL LOAFING" color={RED} fs={42} o={ease(t, tPsych, tPsych + 0.25) * (1 - ease(t, tAdd - 0.2, tAdd))} />

				{/* sloupce: každý táhne méně */}
				{barO > 0.01 ? (
					<g opacity={barO}>
						<rect x="150" y="470" width="780" height="360" rx="24" fill="#fff" stroke={INK} strokeWidth="5" />
						<text x="540" y="525" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="32" letterSpacing="3" fill={NAVY}>
							PULL PER PERSON
						</text>
						{bars.map((b, i) => {
							const h = (b / 63) * 220 * ease(t, tAdd + 0.3 + i * 0.4, tAdd + 0.7 + i * 0.4);
							return (
								<g key={i}>
									<rect x={200 + i * 120} y={800 - h} width="80" height={h} rx="8" fill={i === 0 ? GREEN : lerp(0, 1, 0) === 0 ? GOLD : GOLD} opacity={1 - i * 0.1} />
									<text x={240 + i * 120} y="822" textAnchor="middle" fontFamily={font} fontWeight="800" fontSize="24" fill={INK}>
										{i === 0 ? '1' : i + 1}
									</text>
								</g>
							);
						})}
					</g>
				) : null}
			</g>
			<PunchStamp t={t} at={tEight + 1.8} lines={['TEAM OF 8:', 'EFFORT OF 4']} color={RED} y={640} size={70} />
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const RingelmannShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#D9CCB1" vig={0.3}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
