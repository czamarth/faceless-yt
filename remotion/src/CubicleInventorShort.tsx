import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, GOLD, GREEN, INK, RED, lerp, pop} from './WatermelonShort';
import {ChannelStamp, Pill, ease} from './PlanKit';

/*
 * W25 "Cubicle inventor" (visuals/cubicle-inventor.md), půdorys kanceláře shora.
 * Volné panely (Action Office) -> počet míst roste -> panely vyšší, stoly blíž -> citát -> bludiště s myšmi -> plakát orla "TEAMWORK".
 */

const PANEL = {x: 70, y: 330, w: 940, h: 900};
const NAVY = '#243A66';
const GRAY = '#7B8498';

const Desk: React.FC<{x: number; y: number; o: number; s?: number}> = ({x, y, o, s = 1}) =>
	o > 0.01 ? (
		<g opacity={o} transform={`translate(${x} ${y}) scale(${s})`}>
			<rect x="-34" y="-22" width="68" height="44" rx="5" fill="#B8935F" stroke={INK} strokeWidth="3" />
			<rect x="-12" y="-12" width="24" height="16" rx="2" fill="#7FE0FF" />
			<circle cx="0" cy="34" r="14" fill="#5C6A8C" stroke={INK} strokeWidth="3" />
		</g>
	) : null;

const Mouse: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => (
	<g transform={`translate(${x} ${y}) rotate(${r})`}>
		<ellipse cx="0" cy="0" rx="22" ry="14" fill="#C9CFDC" stroke={INK} strokeWidth="3" />
		<circle cx="-14" cy="-10" r="8" fill="#C9CFDC" stroke={INK} strokeWidth="3" />
		<circle cx="22" cy="0" r="4" fill={RED} />
		<path d="M -22 4 Q -40 14 -34 -6" fill="none" stroke={INK} strokeWidth="3" />
	</g>
);

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tIdea = cue(segs, /^an office where/);
	const tShift = cue(segs, /^Panels you could shift/);
	const tAdj = cue(segs, /^Desks you could adjust/);
	const tRoom = cue(segs, /^Room to think/);
	const tAction = cue(segs, /^He called it/);
	const tLove = cue(segs, /^Companies loved/);
	const tFit = cue(segs, /^how many people/);
	const tTall = cue(segs, /^The panels got taller/);
	const tClose = cue(segs, /^The desks got closer/);
	const tFree = cue(segs, /^The freedom was removed/);
	const tMono = cue(segs, /^Years later/);
	const tDesign = cue(segs, /^He designed an office/);
	const tMaze = cue(segs, /^They built a maze/);
	const tPoster = cue(segs, /^They kept the walls/);
	const tEagle = cue(segs, /^The eagle said/);
	const tTeam = cue(segs, /^teamwork/);

	// počet stolů a rozestup
	const count = t < tFit ? 4 : Math.round(lerp(4, 24, ease(t, tFit, tFit + 2.2)));
	const spacing = lerp(1, 0.62, ease(t, tClose, tClose + 1.4));
	const wallH = ease(t, tTall, tTall + 1.4);
	const mazeP = ease(t, tMaze, tMaze + 1.6);
	const planO = 1 - ease(t, tMono - 0.2, tMono) + ease(t, tDesign, tDesign + 0.3) * (1 - ease(t, tPoster - 0.2, tPoster));
	const quoteO = ease(t, tMono, tMono + 0.3) * (1 - ease(t, tDesign - 0.2, tDesign));
	const posterO = ease(t, tPoster, tPoster + 0.4);

	const shiftA = ease(t, tShift, tShift + 0.8) * 70;
	const shiftB = ease(t, tAdj, tAdj + 0.8) * 40;

	// pozice stolů v mřížce 6 sloupců
	const cols = 6;
	const dx = 140 * spacing;
	const dy = 170 * spacing;
	const gridX = 540 - ((cols - 1) * dx) / 2;
	const gridY = 700 - (3 * dy) / 2 + 40;

	return (
		<Svg>
			<defs>
				<clipPath id="pclip">
					<rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx="36" />
				</clipPath>
			</defs>
			<rect x={PANEL.x + 8} y={PANEL.y + 14} width={PANEL.w} height={PANEL.h} rx="36" fill="rgba(27,31,42,0.18)" />
			<rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx="36" fill="#F2E9D6" stroke={INK} strokeWidth="5" />
			<g clipPath="url(#pclip)">
				{/* parkety */}
				{Array.from({length: 12}, (_, i) => (
					<line key={i} x1={PANEL.x + i * 80} y1="330" x2={PANEL.x + i * 80} y2="1230" stroke="#E3D7BD" strokeWidth="3" />
				))}
				{planO > 0.01 ? (
					<g opacity={Math.min(1, planO)}>
						{/* stoly */}
						{Array.from({length: count}, (_, i) => {
							const c = i % cols;
							const r = Math.floor(i / cols);
							const base = i < 4 ? [ [320, 640], [760, 640], [320, 900], [760, 900] ][i] : [gridX + c * dx, gridY + r * dy];
							const x = i < 4 && t < tFit ? base[0] + (i % 2 ? shiftB : -shiftB) : lerp(base[0], gridX + c * dx, ease(t, tFit, tFit + 0.8));
							const y = i < 4 && t < tFit ? base[1] : lerp(base[1], gridY + r * dy, ease(t, tFit, tFit + 0.8));
							return <Desk key={i} x={x} y={y} o={i < 4 ? 1 : ease(t, tFit + i * 0.07, tFit + 0.3 + i * 0.07)} />;
						})}
						{/* volné panely */}
						{t < tFit + 1.5 ? (
							<g opacity={1 - ease(t, tFit + 0.5, tFit + 1.5)}>
								<rect x={470 - shiftA} y="560" width="14" height="190" rx="4" fill="#8A93A6" stroke={INK} strokeWidth="3" />
								<rect x={620 + shiftA} y="810" width="190" height="14" rx="4" fill="#8A93A6" stroke={INK} strokeWidth="3" />
								<rect x="440" y="900" width="190" height="14" rx="4" fill="#8A93A6" stroke={INK} strokeWidth="3" />
							</g>
						) : null}
						{/* vysoké stěny po stolech */}
						{wallH > 0.01
							? Array.from({length: 5}, (_, c) => (
									<rect key={`v${c}`} x={gridX + c * dx + dx / 2 - 6} y={gridY - 80} width="12" height={(3 * dy + 160) * wallH} rx="3" fill="#6B7285" stroke={INK} strokeWidth="3" />
								))
							: null}
						{wallH > 0.01
							? Array.from({length: 3}, (_, r) => (
									<rect key={`h${r}`} x={gridX - 80} y={gridY + r * dy + dy / 2 - 6} width={(5 * dx + 160) * wallH} height="12" rx="3" fill="#6B7285" stroke={INK} strokeWidth="3" />
								))
							: null}
						{/* bludiště */}
						{mazeP > 0.01 ? (
							<g opacity={mazeP}>
								<rect x="130" y="400" width="820" height="780" rx="10" fill="none" stroke="#4A5160" strokeWidth="14" />
								{[
									[130, 560, 700, 560],
									[250, 720, 950, 720],
									[130, 880, 800, 880],
									[330, 1040, 950, 1040],
									[700, 560, 700, 720],
									[350, 720, 350, 880],
									[800, 880, 800, 1040],
								].map(([x1, y1, x2, y2], i) => (
									<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4A5160" strokeWidth="14" strokeLinecap="round" />
								))}
								<Mouse x={820 + Math.sin(t * 2) * 30} y={480} r={0} />
								<Mouse x={200 + Math.sin(t * 2.4) * 40} y={640} r={180} />
								<Mouse x={860} y={800 + Math.sin(t * 3) * 30} r={90} />
								<Mouse x={260 + Math.sin(t * 2.2) * 30} y={960} r={0} />
								<Mouse x={620} y={1110 + Math.sin(t * 2.6) * 10} r={180} />
							</g>
						) : null}
					</g>
				) : null}

				<Pill y={400} w={760} label="1960s · ROBERT PROPST" color={NAVY} fs={32} o={ease(t, 0.3, 0.6) * (1 - ease(t, tAction - 0.2, tAction))} />
				<Pill y={400} w={760} label="THE ACTION OFFICE" color={GREEN} fs={36} o={ease(t, tAction, tAction + 0.3) * (1 - ease(t, tFit - 0.2, tFit))} />
				<Pill y={400} w={760} label={`HOW MANY CAN WE FIT? ${count}`} color={BLUE} fs={32} o={ease(t, tFit, tFit + 0.3) * (1 - ease(t, tTall - 0.2, tTall))} />
				<Pill y={400} w={760} label="FREEDOM: REMOVED" color={RED} fs={34} o={ease(t, tFree, tFree + 0.3) * (1 - ease(t, tMono - 0.2, tMono))} />
				<Pill y={400} w={760} label="A MAZE FOR MICE" color={RED} fs={34} o={ease(t, tMaze, tMaze + 0.3) * (1 - ease(t, tPoster - 0.2, tPoster))} />

				{quoteO > 0.01 ? (
					<g opacity={quoteO}>
						<rect x="130" y="520" width="820" height="560" rx="30" fill="#fff" stroke={INK} strokeWidth="5" />
						<text x="540" y="620" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="3" fill={GRAY}>
							PROPST, YEARS LATER (REPORTEDLY)
						</text>
						<text x="540" y="780" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="64" fill={RED}>
							“MONOLITHIC
						</text>
						<text x="540" y="870" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="64" fill={RED}>
							INSANITY”
						</text>
					</g>
				) : null}

				{/* plakát */}
				{posterO > 0.01 ? (
					<g opacity={posterO} transform={`translate(540 ${760 + (1 - posterO) * 40})`}>
						<rect x="-290" y="-330" width="580" height="660" rx="12" fill="#fff" stroke={INK} strokeWidth="8" />
						<rect x="-262" y="-302" width="524" height="470" fill="#9FC3E8" />
						<path d="M -140 90 Q -80 -60 0 -80 Q 80 -60 140 90 Q 60 40 0 120 Q -60 40 -140 90 Z" fill="#6B4A2A" stroke={INK} strokeWidth="5" />
						<circle cx="0" cy="-100" r="40" fill="#fff" stroke={INK} strokeWidth="5" />
						<polygon points="10,-100 70,-90 10,-76" fill={GOLD} stroke={INK} strokeWidth="4" />
						<circle cx="-6" cy="-110" r="7" fill={INK} />
						<text x="0" y="265" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="76" letterSpacing="6" fill={NAVY} opacity={ease(t, tTeam, tTeam + 0.3)}>
							TEAMWORK
						</text>
					</g>
				) : null}
			</g>
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const CubicleInventorShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#D9CCB1" vig={0.3}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
