import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, Bean, GOLD, GREEN, INK, RED, lerp, pop} from './WatermelonShort';
import {ChannelStamp, Pill, PunchStamp, ease} from './PlanKit';

/*
 * W20 "You're on mute" (visuals/youre-on-mute.md), video grid 3x3.
 * Zoom na grid -> řečník s mikrofonem přeškrtnutým -> publikum (kývají, píšou, kytka) -> 6:00 -> bublina "you are on mute" -> stejný úsměv, jiný projekt.
 */

const BG = '#1D2330';
const TILE = {w: 290, h: 250};
const COLS = [95, 395, 695];
const ROWS = [470, 740, 1010];
const TIES = [BLUE, GREEN, RED, GOLD, '#8A5CD6', '#2FB6B6', '#E07A3C', '#5C6A8C'];
const TILE_BG = ['#3B4A6B', '#4B3B6B', '#3B6B5A', '#6B4B3B', '#2F4F6B', '#5A3B6B', '#3B5A6B', '#6B3B4B'];

const Mic: React.FC<{x: number; y: number; slash: number}> = ({x, y, slash}) => (
	<g transform={`translate(${x} ${y})`}>
		<circle r="26" fill={slash > 0.5 ? RED : GREEN} />
		<rect x="-7" y="-14" width="14" height="22" rx="7" fill="#fff" />
		<path d="M -13 2 A 13 13 0 0 0 13 2" fill="none" stroke="#fff" strokeWidth="3" />
		{slash > 0.5 ? <line x1="-18" y1="-18" x2="18" y2="18" stroke="#fff" strokeWidth="5" strokeLinecap="round" /> : null}
	</g>
);

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tConf = cue(segs, /^It begins/);
	const tTalk = cue(segs, /^The speaker begins/);
	const tSlide = cue(segs, /^A slide is shared/);
	const tAud = cue(segs, /^Around the video grid/);
	const tNod = cue(segs, /^Some nod/);
	const tType = cue(segs, /^Some pretend/);
	const tPlant = cue(segs, /^One has turned/);
	const tNobody = cue(segs, /^Nobody speaks/);
	const tSix = cue(segs, /^Six minutes/);
	const tFin = cue(segs, /^Finally/);
	const tMute = cue(segs, /^you are on mute/);
	const tAgain = cue(segs, /^The speaker unmutes/);
	const tDiff = cue(segs, /^He is now/);

	const zoom = lerp(1.25, 1, ease(t, 0, 2.5));
	const gridO = ease(t, 0, 0.5);
	const talk = t >= tTalk && t < tFin ? (Math.sin(t * 16) > 0 ? 1 : 0.2) : t >= tAgain ? (Math.sin(t * 16) > 0 ? 1 : 0.2) : 0;
	const slashed = !(t >= tAgain && t < tAgain + 5);
	const slideIn = ease(t, tSlide, tSlide + 0.35);
	const slideText = t >= tDiff ? 'PROJECT Y' : 'Q3 UPDATE';
	const nodding = t >= tNod && t < tNobody;
	const typing = t >= tType && t < tNobody;
	const still = t >= tNobody && t < tFin;

	const timer = t >= tSix ? Math.min(6, (t - tSix) / 1.6 * 6) : 0;
	const timerTxt = `${Math.floor(timer)}:${String(Math.floor((timer % 1) * 60)).padStart(2, '0')}`;

	// rozložení dlaždic: střed (1,1) je řečník
	const tiles: {c: number; r: number; k: number}[] = [];
	let k = 0;
	for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) tiles.push({c, r, k: r === 1 && c === 1 ? -1 : k++});

	return (
		<Svg>
			<g transform={`translate(540 960) scale(${zoom}) translate(-540 -960)`} opacity={gridO}>
				<rect x="70" y="330" width="940" height="900" rx="36" fill={BG} stroke={INK} strokeWidth="5" />
				<Pill y={410} w={620} label={timer > 0 ? `MUTED FOR ${timerTxt}` : 'TEAM CALL · 9 PEOPLE'} color={timer > 0 ? RED : '#9AA6C4'} fill={BG} fs={30} />
				{tiles.map(({c, r, k: kk}) => {
					const x = COLS[c];
					const y = ROWS[r];
					const speaker = kk === -1;
					const plant = kk === 5;
					const bob = nodding && kk % 2 === 0 ? Math.sin(t * 6 + kk) * 6 : 0;
					const bg = speaker ? '#2F4F6B' : TILE_BG[kk % TILE_BG.length];
					return (
						<g key={`${c}${r}`}>
							<clipPath id={`tile-${c}${r}`}>
								<rect x={x} y={y} width={TILE.w} height={TILE.h} rx="18" />
							</clipPath>
							<rect x={x} y={y} width={TILE.w} height={TILE.h} rx="18" fill={bg} />
							<g clipPath={`url(#tile-${c}${r})`}>
								{plant && t >= tPlant ? (
									<g transform={`translate(${x + TILE.w / 2} ${y + TILE.h})`} opacity={ease(t, tPlant, tPlant + 0.3)}>
										<rect x="-45" y="-80" width="90" height="80" rx="10" fill="#B8693F" />
										{[-40, -15, 15, 40].map((a, i) => (
											<ellipse key={i} cx={a} cy="-130" rx="22" ry="50" fill="#2FB67C" transform={`rotate(${a * 0.6} ${a} -90)`} />
										))}
									</g>
								) : (
									<Bean x={x + TILE.w / 2} y={y + TILE.h + 12 + bob} s={0.74} tie={speaker ? RED : TIES[kk % TIES.length]} />
								)}
								{speaker ? (
									<ellipse cx={x + TILE.w / 2} cy={y + TILE.h + 12 - 132 * 0.74 - 6} rx="12" ry={3 + talk * 8} fill={INK} opacity={t >= tTalk ? 1 : 0} />
								) : null}
								{speaker && t >= tConf ? (
									<path d={`M ${x + TILE.w / 2 - 16} ${y + TILE.h + 12 - 132 * 0.74 - 8} Q ${x + TILE.w / 2} ${y + TILE.h + 12 - 132 * 0.74 + 4} ${x + TILE.w / 2 + 16} ${y + TILE.h + 12 - 132 * 0.74 - 8}`} fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" opacity={t < tTalk || t >= tAgain ? 1 : 0} />
								) : null}
								{typing && kk % 2 === 1 ? (
									<g transform={`translate(${x + 60} ${y + TILE.h - 22})`}>
										<rect x="0" y="0" width="170" height="22" rx="6" fill="#222B3C" />
										{[0, 1, 2, 3, 4].map((i) => (
											<rect key={i} x={10 + i * 30} y={Math.sin(t * 20 + i * 2) > 0.3 ? 4 : 8} width="22" height="8" rx="3" fill="#7B879F" />
										))}
									</g>
								) : null}
							</g>
							{speaker ? <rect x={x} y={y} width={TILE.w} height={TILE.h} rx="18" fill="none" stroke={slashed ? RED : GREEN} strokeWidth="7" /> : null}
							{speaker ? <Mic x={x + 40} y={y + 40} slash={slashed ? 1 : 0} /> : null}
							{speaker && slideIn > 0 ? (
								<g opacity={slideIn} transform={`translate(${x + TILE.w - 100} ${y + 44})`}>
									<rect x="-82" y="-34" width="164" height="68" rx="8" fill="#fff" stroke={INK} strokeWidth="3" />
									<text x="0" y="8" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="22" fill={INK}>
										{slideText}
									</text>
								</g>
							) : null}
							{still && kk === 2 ? (
								<g transform={`translate(${x + 40} ${y + 40})`}>
									<text x="0" y="0" fontFamily={font} fontWeight="900" fontSize="30" fill="#9AA6C4">
										…
									</text>
								</g>
							) : null}
						</g>
					);
				})}
				{/* bublina z okénka vpravo nahoře */}
				{t >= tMute ? (
					<g opacity={ease(t, tMute, tMute + 0.2)} transform={`translate(700 ${ROWS[0] + 20}) scale(${Math.min(pop(t, tMute, 0.35), 1.05)})`}>
						<rect x="-290" y="-40" width="560" height="84" rx="42" fill="#fff" stroke={INK} strokeWidth="5" />
						<text x="-10" y="16" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="38" fill={RED}>
							YOU ARE ON MUTE
						</text>
					</g>
				) : null}
			</g>
			<PunchStamp t={t} at={tDiff + 0.5} lines={['SAME SMILE.', 'NEW PROJECT.']} color={BLUE} y={1130} size={54} />
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const OnMuteShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#10141D" vig={0.5}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
