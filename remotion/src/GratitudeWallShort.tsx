import React from 'react';
import type {Segment, ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {Bean, GOLD, GREEN, INK, RED, cueAt, lerp, pop} from './WatermelonShort';
import {ChannelStamp, PunchStamp, Sticky, ease, nthCue} from './PlanKit';

/*
 * W03 "Gratitude wall" (visuals/gratitude-wall.md).
 * Korková nástěnka: tři sticky -> 40 lístků -> 31x FRIDAY / 6x team / 2x this job / 1x anonymní -> sloupcový graf.
 */

const BOARD = {x: 70, y: 330, w: 940, h: 900};
const COLS = 8;
const FRI = 31;
const TEAM_END = 37;
const JOB_END = 39;
const BLUE_NOTE = '#9CC8FF';
const GREEN_NOTE = '#9FE3B8';

const gridPos = (i: number) => ({x: 190 + (i % COLS) * 100, y: 610 + Math.floor(i / COLS) * 120});
const jitter = (i: number) => (((i * 37) % 11) - 5) * 1.3;

const Scene: React.FC<{t: number; segs: Segment[]; total: number}> = ({t, segs, total}) => {
	const tAnonW = cue(segs, /^Anonymously/);
	const tVol = cue(segs, /^Voluntarily/);
	const tByFri = cue(segs, /^By Friday/);
	const tTue = cue(segs, /^By Tuesday/);
	const tFri = cue(segs, /^Friday\.$/);
	const tTeam = cue(segs, /^my team/);
	const tJob = cue(segs, /^this job/);
	const tSame = cue(segs, /^Both were/);
	const tAnon = nthCue(segs, /^that this is anonymous/, 0);
	const tEnc = cue(segs, /^Management reviewed/);
	const tPerm = cue(segs, /^The wall is now/);
	const tTop = cue(segs, /^Top answer/);
	const tFri2 = nthCue(segs, /^Friday\.$/, 1);
	const tAnon2 = nthCue(segs, /^that this is anonymous/, 1);

	const tGrid = tTue + 0.35;
	const count = Math.min(40, Math.max(0, Math.floor((t - tGrid) / 0.045)));
	const boardDim = 1 - 0.97 * ease(t, tTop - 0.2, tTop + 0.2);

	const chip =
		t < tGrid
			? null
			: t >= tAnon
				? '1 × THAT THIS IS ANONYMOUS'
				: t >= tJob
					? '2 × THIS JOB'
					: t >= tTeam
						? '6 × MY TEAM'
						: t >= tFri
							? '31 × FRIDAY'
							: `${count} NOTES`;

	const notes = Array.from({length: 40}, (_, i) => {
		const born = tGrid + i * 0.045;
		const p = pop(t, born, 0.3);
		if (p <= 0) return null;
		const {x, y} = gridPos(i);
		let color = '#FFD84D';
		let text: string | undefined;
		let s = p;
		let o = 1;
		let rot = jitter(i);
		let ring: string | undefined;
		let dx = 0;
		const friday = i < FRI;
		const team = i >= FRI && i < TEAM_END;
		const job = i >= TEAM_END && i < JOB_END;
		const anon = i === JOB_END;
		if (friday && t >= tFri) text = 'FRI';
		if (team && t >= tTeam) {
			color = BLUE_NOTE;
			text = 'TEAM';
		}
		if (job && t >= tJob) {
			color = GREEN_NOTE;
			text = 'JOB';
			const h = ease(t, tJob, tJob + 0.3) * (1 - ease(t, tAnon - 0.1, tAnon + 0.1));
			s *= 1 + 0.22 * h;
			ring = h > 0.5 ? GREEN : undefined;
		}
		if (anon && t >= tAnon) {
			const h = ease(t, tAnon, tAnon + 0.4);
			color = mixRed(h);
			text = '?';
			s *= 1 + 0.55 * h;
			rot = jitter(i) + Math.sin(t * 30) * 2.2 * h;
			ring = RED;
		}
		// ostatní lístky ztmavnou, když se řeší konkrétní skupina
		const focusJob = t >= tJob && t < tAnon - 0.1;
		const focusAnon = t >= tAnon && t < tEnc;
		if (focusJob && !job) o = 0.45;
		if (focusAnon && !anon) o = 0.3;
		if (t >= tTeam && t < tJob && !team) o = 0.55;
		return <Sticky key={i} x={x + dx} y={y} w={88} rot={rot} color={color} text={text} fs={26} o={o} s={s} ring={ring} />;
	});

	// tři velké sticky v úvodu
	const big = [
		{label: 'ANONYMOUSLY', at: tAnonW, x: 260, rot: -4},
		{label: 'VOLUNTARILY', at: tVol, x: 540, rot: 3},
		{label: 'BY FRIDAY', at: tByFri, x: 820, rot: -2},
	];
	const bigOut = 1 - ease(t, tTue - 0.1, tTue + 0.25);

	const mgr = ease(t, tSame - 0.2, tSame + 0.3) * (1 - ease(t, tAnon - 0.2, tAnon + 0.1));
	const encO = ease(t, tEnc + 1.6, tEnc + 1.9) * (1 - ease(t, tTop - 0.2, tTop));
	const permS = pop(t, tPerm, 0.35) * (1 - ease(t, tTop - 0.3, tTop));

	// graf pointy
	const chartO = ease(t, tTop, tTop + 0.3);
	const bar1 = ease(t, tFri2, tFri2 + 0.5);
	const bar2 = ease(t, tAnon2, tAnon2 + 0.5);
	const base = 1090;

	return (
		<Svg>
			<g opacity={boardDim}>
				<rect x={BOARD.x} y={BOARD.y} width={BOARD.w} height={BOARD.h} rx="30" fill="#D1A06B" stroke="#8A5C34" strokeWidth="18" />
				{Array.from({length: 60}, (_, i) => (
					<circle key={i} cx={BOARD.x + 40 + ((i * 137) % 860)} cy={BOARD.y + 40 + ((i * 89) % 820)} r={3 + (i % 4)} fill="#B98650" opacity="0.6" />
				))}
				<g transform={`translate(540 395) scale(${pop(t, 0.1, 0.4)})`}>
					<rect x="-300" y="-52" width="600" height="104" rx="12" fill="#fff" stroke={INK} strokeWidth="5" />
					<text x="0" y="22" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="58" letterSpacing="5" fill={INK}>
						GRATITUDE WALL
					</text>
					<circle cx="-280" cy="-32" r="9" fill={RED} />
					<circle cx="280" cy="-32" r="9" fill={RED} />
				</g>
				{big.map((b) => {
					const p = pop(t, b.at, 0.3);
					return p > 0 ? <Sticky key={b.label} x={b.x} y={720} w={250} rot={b.rot} text={b.label} fs={32} s={p * bigOut} o={bigOut} /> : null;
				})}
				{chip ? (
					<g transform={`translate(540 505)`}>
						<rect x="-300" y="-30" width="600" height="60" rx="30" fill="#fff" stroke={INK} strokeWidth="4" />
						<text x="0" y="12" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="2" fill={INK}>
							{chip}
						</text>
					</g>
				) : null}
				{notes}
				<g opacity={mgr} transform={`translate(${lerp(1230, 930, mgr)} 0)`}>
					<Bean x={0} y={1230} s={1.7} tie={GOLD} />
				</g>
				{encO > 0 ? (
					<g opacity={encO} transform="translate(540 1160)">
						<rect x="-330" y="-46" width="660" height="92" rx="46" fill={GREEN} />
						<text x="0" y="16" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="44" letterSpacing="3" fill="#fff">
							VERY ENCOURAGING ✔
						</text>
					</g>
				) : null}
				{permS > 0 ? (
					<g transform={`translate(540 860) rotate(-9) scale(${Math.min(permS, 1.08)})`}>
						<rect x="-330" y="-88" width="660" height="176" rx="16" fill="rgba(255,255,255,0.92)" stroke={RED} strokeWidth="12" />
						<text x="0" y="30" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="92" letterSpacing="6" fill={RED}>
							PERMANENT
						</text>
					</g>
				) : null}
			</g>

			{/* pointa: žebříček odpovědí */}
			{chartO > 0 ? (
				<g opacity={chartO}>
					<rect x="110" y="400" width="860" height="780" rx="36" fill="#fff" stroke={INK} strokeWidth="6" />
					<text x="540" y="490" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="46" letterSpacing="6" fill={INK}>
						TOP ANSWERS
					</text>
					<line x1="170" y1={base} x2="910" y2={base} stroke={INK} strokeWidth="6" />
					<rect x="230" y={base - 440 * bar1} width="260" height={440 * bar1} rx="10" fill={GREEN} />
					<rect x="590" y={base - 300 * bar2} width="260" height={300 * bar2} rx="10" fill={RED} />
					<text x="360" y={base + 50} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="38" fill={INK}>
						FRIDAY
					</text>
					<text x="720" y={base + 46} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="26" fill={INK}>
						THAT THIS IS ANONYMOUS
					</text>
					{bar1 > 0.6 ? (
						<text x="360" y={base - 440 * bar1 - 20} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="60" fill={INK}>
							1st
						</text>
					) : null}
					{bar2 > 0.6 ? (
						<text x="720" y={base - 300 * bar2 - 20} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="60" fill={INK}>
							2nd
						</text>
					) : null}
				</g>
			) : null}
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

function mixRed(h: number) {
	const a = [255, 216, 77];
	const b = [255, 140, 135];
	return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], h))).join(',')})`;
}

export const GratitudeWallShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#F4F1EA" vig={0.1}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
