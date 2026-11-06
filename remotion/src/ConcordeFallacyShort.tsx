import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, GOLD, GREEN, INK, RED, lerp, pop} from './WatermelonShort';
import {ChannelStamp, Pill, PunchStamp, ease} from './PlanKit';

/*
 * W37 "Concorde fallacy" (visuals/concorde-fallacy.md), ocelová modrá.
 * Dvě země -> rostoucí rozpočet -> letadlo letí do rostoucí díry -> Dawkins & Carlisle 1976 -> sunk cost: mince v kaluži -> "we've come too far" -> "wrong for too long to say so".
 */

const PANEL = {x: 70, y: 330, w: 940, h: 900};
const STEEL = '#DCE6F2';
const NAVY = '#243A66';
const GRAY = '#7B8498';

const Jet: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
	<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
		<path d="M -180 0 L -40 -14 L 120 -90 L 130 -86 L 60 -12 L 190 -4 L 200 0 L 190 4 L 60 12 L 130 86 L 120 90 L -40 14 Z" fill="#fff" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
		<path d="M -180 0 L -230 -6 L -230 6 Z" fill="#fff" stroke={INK} strokeWidth="5" />
		<circle cx="150" cy="0" r="6" fill={INK} />
	</g>
);

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tCost = cue(segs, /^Very quickly/);
	const tKept = cue(segs, /^They kept going/);
	const tSpent = cue(segs, /^Because they had/);
	const tFlew = cue(segs, /^It flew/);
	const tBeaut = cue(segs, /^It was beautiful/);
	const tNever = cue(segs, /^It never paid/);
	const tDawk = cue(segs, /^And in nineteen/);
	const tName = cue(segs, /^the Concorde fallacy/);
	const tSunk = cue(segs, /^It is also called/);
	const tCont = cue(segs, /^you continue something/);
	const tMeet = cue(segs, /^You have heard/);
	const tFar = cue(segs, /^We've come too far/);
	const tMeans = cue(segs, /^Which means/);
	const tWrong = cue(segs, /^we've been wrong/);

	const flagsO = pop(t, 0.2, 0.4) * (1 - ease(t, tCost - 0.3, tCost));
	const budgetO = ease(t, tCost - 0.1, tCost + 0.3) * (1 - ease(t, tKept - 0.3, tKept));
	const holeO = ease(t, tKept, tKept + 0.3) * (1 - ease(t, tFlew - 0.2, tFlew + 0.1));
	const jetO = ease(t, tFlew, tFlew + 0.4) * (1 - ease(t, tDawk - 0.3, tDawk));
	const dawkO = ease(t, tDawk, tDawk + 0.3) * (1 - ease(t, tSunk - 0.3, tSunk));
	const sunkO = ease(t, tSunk, tSunk + 0.3) * (1 - ease(t, tMeet - 0.3, tMeet));
	const meetO = ease(t, tMeet, tMeet + 0.3);

	const hole = ease(t, tKept, tKept + 4.0);
	const jetX = lerp(200, 700, ease(t, tKept, tKept + 4.0));

	return (
		<Svg>
			<defs>
				<clipPath id="pclip">
					<rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx="36" />
				</clipPath>
			</defs>
			<rect x={PANEL.x + 8} y={PANEL.y + 14} width={PANEL.w} height={PANEL.h} rx="36" fill="rgba(0,0,0,0.3)" />
			<rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx="36" fill={STEEL} stroke={INK} strokeWidth="5" />
			<g clipPath="url(#pclip)">
				{flagsO > 0.01 ? (
					<g opacity={Math.min(1, flagsO)}>
						<g transform="translate(300 640)">
							<rect x="-130" y="-90" width="86" height="180" fill="#2848C8" />
							<rect x="-44" y="-90" width="88" height="180" fill="#fff" />
							<rect x="44" y="-90" width="86" height="180" fill="#E5484D" />
							<rect x="-130" y="-90" width="260" height="180" fill="none" stroke={INK} strokeWidth="6" />
						</g>
						<g transform="translate(780 640)">
							<rect x="-130" y="-90" width="260" height="180" fill="#1F3A8A" />
							<path d="M -130 -90 L 130 90 M 130 -90 L -130 90" stroke="#fff" strokeWidth="26" />
							<rect x="-14" y="-90" width="28" height="180" fill="#fff" />
							<rect x="-130" y="-14" width="260" height="28" fill="#fff" />
							<rect x="-8" y="-90" width="16" height="180" fill="#E5484D" />
							<rect x="-130" y="-8" width="260" height="16" fill="#E5484D" />
							<rect x="-130" y="-90" width="260" height="180" fill="none" stroke={INK} strokeWidth="6" />
						</g>
						<Jet x={540} y={900} s={0.9} />
						<Pill y={430} w={760} label="1960s · BRITAIN + FRANCE" color={NAVY} fs={32} o={ease(t, 0.5, 0.8)} />
						<Pill y={1060} w={760} label="A SUPERSONIC PASSENGER JET" color={BLUE} fs={30} o={ease(t, 1.0, 1.4)} />
					</g>
				) : null}

				{budgetO > 0.01 ? (
					<g opacity={budgetO}>
						<Pill y={430} w={640} label="IT WOULD COST FAR MORE" color={RED} fs={34} o={1} />
						<line x1="170" y1="1100" x2="930" y2="1100" stroke={INK} strokeWidth="6" />
						{[
							['PLAN', 160, GREEN],
							['COST', 520, RED],
						].map(([label, h, c], i) => {
							const grow = ease(t, tCost + 0.4 + i * 0.8, tCost + 1.4 + i * 0.8);
							return (
								<g key={label as string}>
									<rect x={270 + i * 340} y={1100 - (h as number) * grow} width="190" height={(h as number) * grow} rx="10" fill={c as string} stroke={INK} strokeWidth="5" />
									<text x={365 + i * 340} y="1150" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" fill={INK}>
										{label as string}
									</text>
								</g>
							);
						})}
						<text x="540" y="560" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="46" fill={GRAY} opacity={ease(t, tCost + 3.0, tCost + 3.5)}>
							…AND MIGHT NEVER MAKE MONEY
						</text>
					</g>
				) : null}

				{holeO > 0.01 ? (
					<g opacity={holeO}>
						<rect x="110" y="800" width="820" height="260" fill="#B8C7DC" />
						<ellipse cx="700" cy="930" rx={40 + hole * 260} ry={20 + hole * 110} fill="#0B1220" />
						<Jet x={jetX} y={620} s={0.8} rot={6} />
						<Pill y={430} w={760} label="THEY KEPT GOING ANYWAY" color={RED} fs={34} o={1} />
						<Pill y={1130} w={760} label="BECAUSE THEY HAD ALREADY SPENT SO MUCH" color={GRAY} fs={26} o={ease(t, tSpent, tSpent + 0.3)} />
					</g>
				) : null}

				{jetO > 0.01 ? (
					<g opacity={jetO}>
						<Jet x={540} y={740} s={1.3} />
						<Pill y={430} w={600} label={t >= tNever ? 'NEVER PAID BACK' : t >= tBeaut ? 'IT WAS BEAUTIFUL' : 'IT FLEW'} color={t >= tNever ? RED : GREEN} fs={40} o={1} />
						<g opacity={ease(t, tNever, tNever + 0.3)}>
							<rect x="200" y="1000" width="680" height="110" rx="20" fill="#FFE3E3" stroke={RED} strokeWidth="6" />
							<text x="540" y="1070" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="46" fill={RED}>
								COST &gt; REVENUE
							</text>
						</g>
					</g>
				) : null}

				{dawkO > 0.01 ? (
					<g opacity={dawkO}>
						<rect x="130" y="470" width="820" height="620" rx="26" fill="#fff" stroke={INK} strokeWidth="5" />
						<text x="540" y="560" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="36" letterSpacing="3" fill={GRAY}>
							DAWKINS & CARLISLE · 1976
						</text>
						<text x="540" y="790" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="78" fill={NAVY} opacity={ease(t, tName, tName + 0.3)}>
							THE CONCORDE
						</text>
						<text x="540" y="890" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="78" fill={RED} opacity={ease(t, tName, tName + 0.3)}>
							FALLACY
						</text>
					</g>
				) : null}

				{sunkO > 0.01 ? (
					<g opacity={sunkO}>
						<Pill y={430} w={640} label="THE SUNK COST FALLACY" color={NAVY} fs={36} o={1} />
						<ellipse cx="540" cy="940" rx="360" ry="110" fill="#6B9BD1" stroke={INK} strokeWidth="6" />
						<ellipse cx="540" cy="920" rx="260" ry="70" fill="#8DB7E8" />
						<g transform={`translate(540 ${lerp(600, 910, ease(t, tSunk, tSunk + 1.2))}) scale(${lerp(1, 0.7, ease(t, tSunk, tSunk + 1.2))})`}>
							<circle r="100" fill={GOLD} stroke={INK} strokeWidth="8" />
							<text x="0" y="28" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="86" fill={INK}>
								$
							</text>
						</g>
						<g opacity={ease(t, tCont, tCont + 0.3)}>
							<rect x="130" y="1080" width="820" height="110" rx="55" fill="#fff" stroke={INK} strokeWidth="5" />
							<text x="540" y="1148" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="32" fill={INK}>
								WHAT YOU PUT IN, NOT WHAT YOU'D GET OUT
							</text>
						</g>
					</g>
				) : null}

				{meetO > 0.01 ? (
					<g opacity={meetO}>
						<Pill y={430} w={800} label="YOU HAVE HEARD IT IN MEETINGS" color={NAVY} fs={30} o={1} />
						<g opacity={ease(t, tFar, tFar + 0.3)} transform="translate(540 700)">
							<rect x="-400" y="-100" width="800" height="200" rx="60" fill="#fff" stroke={INK} strokeWidth="6" />
							<text x="0" y="-8" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="50" fill={INK}>
								“WE'VE COME TOO FAR
							</text>
							<text x="0" y="56" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="50" fill={INK}>
								TO STOP NOW.”
							</text>
						</g>
						<g opacity={ease(t, tWrong, tWrong + 0.3)} transform="translate(540 1020)">
							<rect x="-420" y="-110" width="840" height="220" rx="30" fill="#FFE3E3" stroke={RED} strokeWidth="7" />
							<text x="0" y="-20" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="44" fill={RED}>
								WE'VE BEEN WRONG
							</text>
							<text x="0" y="40" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="44" fill={RED}>
								FOR TOO LONG TO SAY SO
							</text>
						</g>
					</g>
				) : null}
			</g>
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const ConcordeFallacyShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#9EB4D2" vig={0.35}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
