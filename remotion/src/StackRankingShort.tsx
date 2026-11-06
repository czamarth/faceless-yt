import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, Bean, GOLD, GREEN, INK, RED, lerp, pop} from './WatermelonShort';
import {ChannelStamp, Pill, PunchStamp, ease} from './PlanKit';

/*
 * W32 "Stack ranking" (visuals/stack-ranking.md), deset fazolek.
 * 10 výborných -> dvě musí být "poor" -> Microsoft/2013 -> ostatní se odtahují od hvězdy -> "hire someone slightly worse" -> SAFEST CAREER MOVE.
 */

const NAVY = '#243A66';
const GRAY = '#7B8498';

const Star: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
	<polygon transform={`translate(${x} ${y}) scale(${s})`} points="0,-30 9,-10 30,-9 14,5 19,27 0,15 -19,27 -14,5 -30,-9 -9,-10" fill={GOLD} stroke={INK} strokeWidth="3" />
);

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tAll = cue(segs, /^All excellent/);
	const tRule = cue(segs, /^Now imagine/);
	const tPoor = cue(segs, /^every year, two/);
	const tPolicy = cue(segs, /^By policy/);
	const tMs = cue(segs, /^Microsoft used/);
	const tRep = cue(segs, /^Reporters later/);
	const tDrop = cue(segs, /^The company dropped/);
	const tClever = cue(segs, /^It also teaches/);
	const tHire = cue(segs, /^Do not hire/);
	const tFriend = cue(segs, /^Do not befriend/);
	const tSit = cue(segs, /^Do not sit next/);
	const tInstead = cue(segs, /^Instead, find/);
	const tSafe = cue(segs, /^The safest career/);
	const tWorse = cue(segs, /^hire someone slightly/);

	const teamO = pop(t, 0.1, 0.4);
	const poor = ease(t, tPoor, tPoor + 0.6);
	const avoid = ease(t, tRep, tRep + 1.2) * (1 - ease(t, tClever - 0.3, tClever));
	const clever = ease(t, tClever, tClever + 0.3);
	const pull = ease(t, tInstead, tInstead + 1.5);

	// pozice deseti fazolek: 2 řady po 5
	const pos = (i: number) => [110 + (i % 5) * 190, 640 + Math.floor(i / 5) * 240];
	const starIdx = 7;

	return (
		<Svg>
			<rect x="70" y="330" width="940" height="900" rx="36" fill="#E8EEF8" stroke={INK} strokeWidth="5" />
			<Pill y={410} w={760} label={t >= tRule ? 'RULE: 2 OF 10 MUST BE "POOR"' : 'TEAM OF 10 · ALL EXCELLENT'} color={t >= tRule ? RED : GREEN} fs={32} o={teamO} />
			{/* tým */}
			<g opacity={Math.min(1, teamO)}>
				{Array.from({length: 10}, (_, i) => {
					const [bx, by] = pos(i);
					const isPoor = i === 2 || i === 8;
					const isStar = i === starIdx;
					const away = isStar ? 0 : avoid * (bx < 540 ? -38 : 38) * (clever > 0.5 ? 0 : 1);
					const x = bx + away;
					const mood = isPoor ? poor : 0;
					return (
						<g key={i} opacity={ease(t, 0.2 + i * 0.12, 0.5 + i * 0.12) * (clever > 0.9 ? 0.0 : 1)}>
							<Bean x={x + 50} y={by + 90} s={isStar ? 0.72 : 0.62} tie={mood > 0.5 ? RED : GREEN} />
							{mood > 0.5 ? (
								<g transform={`translate(${x + 50} ${by - 100})`} opacity={mood}>
									<rect x="-55" y="-22" width="110" height="44" rx="22" fill={RED} />
									<text x="0" y="9" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="26" fill="#fff">
										POOR
									</text>
								</g>
							) : null}
							{isStar && t >= tRep ? <Star x={x + 50} y={by - 110} s={1.5} /> : null}
						</g>
					);
				})}
			</g>
			{t >= tPolicy ? (
				<g opacity={ease(t, tPolicy, tPolicy + 0.3) * (1 - ease(t, tMs - 0.3, tMs))}>
					<rect x="240" y="1040" width="600" height="80" rx="40" fill="#fff" stroke={INK} strokeWidth="5" />
					<text x="540" y="1095" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="40" letterSpacing="4" fill={RED}>
						BY POLICY
					</text>
				</g>
			) : null}
			<g opacity={ease(t, tMs, tMs + 0.3) * (1 - ease(t, tClever - 0.3, tClever))}>
				<rect x="140" y="1040" width="800" height="100" rx="50" fill="#fff" stroke={INK} strokeWidth="5" />
				<text x="540" y="1104" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" fill={NAVY}>
					{t >= tDrop ? 'MICROSOFT · DROPPED 2013' : 'MICROSOFT · USED IT FOR YEARS'}
				</text>
			</g>
			{t >= tRep && t < tClever ? (
				<g opacity={ease(t, tRep + 1.0, tRep + 1.4)} transform="translate(540 520)">
					<rect x="-400" y="-36" width="800" height="72" rx="36" fill="#fff" stroke={GOLD} strokeWidth="6" />
					<text x="0" y="12" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="32" fill={INK}>
						STARS MAKE EVERYONE ELSE LOOK WORSE
					</text>
				</g>
			) : null}

			{/* strategie */}
			{clever > 0.01 ? (
				<g opacity={clever}>
					{[
						['DO NOT HIRE THE BEST PERSON', tHire],
						['DO NOT BEFRIEND THE BEST PERSON', tFriend],
						['DO NOT SIT NEXT TO THE BEST PERSON', tSit],
					].map(([label, at], i) => (
						<g key={i} opacity={ease(t, (at as number) - 0.1, (at as number) + 0.3)} transform={`translate(0 ${i * 120})`}>
							<rect x="120" y="460" width="840" height="96" rx="48" fill="#fff" stroke={RED} strokeWidth="5" />
							<circle cx="190" cy="508" r="30" fill={RED} />
							<path d="M 176 494 L 204 522 M 204 494 L 176 522" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
							<text x="250" y="520" fontFamily={font} fontWeight="900" fontSize="28" fill={INK}>
								{label as string}
							</text>
						</g>
					))}
					{t >= tInstead ? (
						<g>
							<Bean x={lerp(300, 440, pull)} y={1130} s={0.9} tie={BLUE} />
							<Bean x={lerp(820, 640, pull)} y={1130} s={0.6} tie={GREEN} />
							<line x1="480" y1="1000" x2="610" y2="1020" stroke="#F2C9A0" strokeWidth="12" strokeLinecap="round" opacity={pull} />
							<Pill y={880} w={820} label="FIND SOMEONE SLIGHTLY WORSE" color={GREEN} fs={32} o={ease(t, tInstead, tInstead + 0.3)} />
							<Pill y={970} w={620} label="…AND HAVE HIM JOIN YOUR TEAM" color={BLUE} fs={28} o={ease(t, tInstead + 1.5, tInstead + 1.8)} />
						</g>
					) : null}
				</g>
			) : null}
			<PunchStamp t={t} at={tWorse + 0.6} lines={['SAFEST', 'CAREER MOVE']} color={GREEN} y={700} size={80} />
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const StackRankingShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#C6D3EA" vig={0.3}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
