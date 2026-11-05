import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, Bean, GOLD, GREEN, INK, RED, pop} from './WatermelonShort';
import {ChannelStamp, Pill, PunchStamp, ease} from './PlanKit';

/*
 * W09 "Resolutions vs. roadmap" (visuals/resolutions-roadmap.md), zimní modrá.
 * 1.1. -> slide vs. posilovna -> graf docházky (den 2. týdne se posouvá) -> prázdná posilovna a sál -> svítí jen slide.
 */

const PANEL = {x: 70, y: 330, w: 940, h: 900};
const BG = '#E6EEF9';
const WHITE = '#FFFFFF';
const NAVY = '#243A66';

const Slide: React.FC<{x: number; y: number; w: number; h: number; ticks?: number; glow?: number; fs?: number}> = ({
	x,
	y,
	w,
	h,
	ticks = 0,
	glow = 0,
	fs = 34,
}) => (
	<g transform={`translate(${x} ${y})`}>
		{glow > 0 ? <rect x={-w / 2 - 18} y={-h / 2 - 18} width={w + 36} height={h + 36} rx="26" fill="#FFF3B0" opacity={0.85 * glow} /> : null}
		<rect x={-w / 2} y={-h / 2} width={w} height={h} rx="14" fill={WHITE} stroke={INK} strokeWidth="5" />
		<rect x={-w / 2} y={-h / 2} width={w} height="62" rx="14" fill={NAVY} />
		<text x="0" y={-h / 2 + 43} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize={fs} letterSpacing="3" fill="#fff">
			Q1 PRIORITIES
		</text>
		{[0, 1, 2].map((i) => (
			<g key={i} transform={`translate(${-w / 2 + 36} ${-h / 2 + 108 + (i * (h - 130)) / 3})`}>
				<rect x="-14" y="-18" width="36" height="36" rx="7" fill="none" stroke={INK} strokeWidth="4" />
				{ticks > i ? <path d="M -8 0 L 0 10 L 16 -12" fill="none" stroke={GREEN} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" /> : null}
				<rect x="44" y="-9" width={w * (i === 1 ? 0.5 : 0.6)} height="16" rx="8" fill={INK} opacity="0.25" />
			</g>
		))}
	</g>
);

const Dumbbell: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 0}) => (
	<g transform={`translate(${x} ${y}) rotate(${r})`}>
		<rect x="-70" y="-7" width="140" height="14" rx="6" fill="#3A3F4D" />
		{[-62, 62].map((px) => (
			<rect key={px} x={px - 14} y="-34" width="28" height="68" rx="8" fill="#4A5160" stroke={INK} strokeWidth="4" />
		))}
	</g>
);

const Room: React.FC<{x: number; w: number; dark: number; children: React.ReactNode; label: string; id: string}> = ({x, w, dark, children, label, id}) => (
	<g>
		<clipPath id={`rc-${id}`}>
			<rect x={x} y="500" width={w} height="540" rx="22" />
		</clipPath>
		<rect x={x} y="500" width={w} height="540" rx="22" fill="#F2E9D6" stroke={INK} strokeWidth="5" />
		<g clipPath={`url(#rc-${id})`}>
			<rect x={x} y="900" width={w} height="140" fill="#CBB892" />
			{children}
			<rect x={x} y="500" width={w} height="540" fill="#0B1220" opacity={dark} />
		</g>
		<text x={x + w / 2} y="1090" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="4" fill={INK}>
			{label}
		</text>
	</g>
);

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tNewYear = cue(segs, /^A new year/);
	const tTeam = cue(segs, /^Every team/);
	const tPerson = cue(segs, /^Every person/);
	const tApp = cue(segs, /^One fitness/);
	const tWeek2 = cue(segs, /^It falls/);
	const tExact = cue(segs, /^The exact date/);
	const tFebGym = cue(segs, /^By February, the gym/);
	const tFebRoad = cue(segs, /^By February, so is/);
	const tLaunched = cue(segs, /^Both were launched/);
	const tAnnounced = cue(segs, /^Both were announced/);
	const tQuiet = cue(segs, /^Both quietly/);
	const tGymEmpties = cue(segs, /^The gym empties/);
	const tRoadEmpties = cue(segs, /^The roadmap empties/);
	const tSlides = cue(segs, /^Only the slides/);

	const bigO = (1 - ease(t, tTeam - 0.3, tTeam)) * pop(t, 0.05, 0.4);
	const splitO = ease(t, tTeam, tTeam + 0.3) * (1 - ease(t, tApp - 0.3, tApp));
	const pushUp = Math.abs(Math.sin(t * 3.2)) * 55;
	const ticks = t > tTeam + 2.2 ? 3 : t > tTeam + 1.6 ? 2 : t > tTeam + 1.0 ? 1 : 0;
	const chartO = ease(t, tApp, tApp + 0.35) * (1 - ease(t, tFebGym - 0.3, tFebGym));
	const att = (w: number) => 0.92 * Math.exp(-0.55 * (w - 1)) + 0.06;
	const drawn = ease(t, tApp + 0.2, tApp + 3.2);
	const flagO = pop(t, tWeek2, 0.3);
	const flagJit = t > tExact ? Math.sin((t - tExact) * 2.4) * 50 : 0;
	const dates = ['JAN 9', 'JAN 14', 'JAN 11'];
	const dateIdx = t < tExact ? 0 : Math.floor(((t - tExact) / 1.4) % 3);
	const roadO = ease(t, tExact + 0.2, tExact + 0.5) * (1 - ease(t, tFebGym - 0.3, tFebGym));
	const slideDates = ['LAUNCH: MARCH', 'LAUNCH: APRIL', 'LAUNCH: Q3'];
	const sdIdx = t < tExact + 0.4 ? 0 : Math.min(2, Math.floor((t - tExact - 0.4) / 1.3));
	const roomsO = ease(t, tFebGym - 0.1, tFebGym + 0.3);
	const gymDark = 0.15 + 0.2 * ease(t, tFebGym, tFebGym + 1.5) + 0.6 * ease(t, tGymEmpties, tGymEmpties + 0.7);
	const confDark = 0.15 + 0.2 * ease(t, tFebRoad, tFebRoad + 1.5) + 0.6 * ease(t, tRoadEmpties, tRoadEmpties + 0.7);
	const bothTxt = t >= tQuiet ? 'NO LONGER MENTIONED' : t >= tAnnounced ? 'ANNOUNCED TO EVERYONE' : t >= tLaunched ? 'LAUNCHED WITH ENTHUSIASM' : '';
	const bothCol = t >= tQuiet ? '#6B7385' : t >= tAnnounced ? BLUE : GREEN;
	const glow = ease(t, tSlides, tSlides + 0.5) * (0.75 + 0.25 * Math.sin(t * 5));

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
				{bigO > 0.01 ? (
					<g opacity={Math.min(1, bigO)} transform={`translate(540 760) scale(${Math.min(bigO, 1.05)})`}>
						<text x="0" y="0" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="300" fill={NAVY}>
							1.1.
						</text>
						<g opacity={ease(t, tNewYear, tNewYear + 0.3)}>
							<rect x="-390" y="70" width="780" height="84" rx="42" fill={WHITE} stroke={INK} strokeWidth="5" />
							<text x="0" y="127" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="40" letterSpacing="2" fill={INK}>
								NEW YEAR · NEW ROADMAP
							</text>
						</g>
						{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
							<circle key={i} cx={-360 + i * 100 + (i % 2) * 30} cy={-300 + ((t * 70 + i * 90) % 520)} r="9" fill={[GOLD, RED, BLUE, GREEN][i % 4]} />
						))}
					</g>
				) : null}

				{splitO > 0.01 ? (
					<g opacity={splitO}>
						<line x1="540" y1="420" x2="540" y2="1190" stroke={INK} strokeWidth="4" strokeDasharray="14 12" opacity="0.4" />
						<text x="305" y="450" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="40" letterSpacing="4" fill={NAVY}>
							TEAM
						</text>
						<text x="775" y="450" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="40" letterSpacing="4" fill={NAVY}>
							PERSON
						</text>
						<g opacity={Math.min(1, pop(t, tTeam + 0.1, 0.4))}>
							<Slide x={305} y={760} w={390} h={310} ticks={ticks} fs={32} />
						</g>
						<Pill x={305} y={1000} w={380} label="BOLD PRIORITIES" color={NAVY} fs={30} o={pop(t, tTeam + 0.4, 0.3)} />
						<g opacity={Math.min(1, pop(t, tPerson, 0.4))}>
							<Dumbbell x={775} y={700 - pushUp} r={-6} />
							<Bean x={775} y={950} s={0.95} tie={RED} />
						</g>
						<Pill x={775} y={1040} w={290} label="THE GYM" color={NAVY} fs={32} o={pop(t, tPerson + 0.3, 0.3)} />
					</g>
				) : null}

				{chartO > 0.01 ? (
					<g opacity={chartO}>
						<rect x="110" y="430" width="860" height="470" rx="26" fill={WHITE} stroke={INK} strokeWidth="5" />
						<text x="150" y="490" fontFamily={font} fontWeight="900" fontSize="36" letterSpacing="3" fill={INK}>
							GYM ATTENDANCE · JANUARY
						</text>
						<line x1="160" y1="840" x2="930" y2="840" stroke={INK} strokeWidth="4" />
						{[1, 2, 3, 4, 5, 6].map((w) => (
							<text key={w} x={190 + (w - 1) * 140} y="878" textAnchor="middle" fontFamily={font} fontWeight="800" fontSize="28" fill={INK} opacity="0.7">
								W{w}
							</text>
						))}
						<polyline
							points={Array.from({length: 31}, (_, i) => {
								const f = (i / 30) * drawn;
								const w = 1 + f * 5;
								return `${190 + (w - 1) * 140},${840 - att(w) * 300}`;
							}).join(' ')}
							fill="none"
							stroke={RED}
							strokeWidth="12"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						{flagO > 0 ? (
							<g transform={`translate(${190 + 140 + flagJit} 0)`} opacity={Math.min(1, flagO)}>
								<line x1="0" y1="584" x2="0" y2="840" stroke={BLUE} strokeWidth="6" strokeDasharray="12 10" />
								<rect x="-100" y="520" width="200" height="64" rx="12" fill={BLUE} />
								<text x="0" y="565" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" fill="#fff">
									{t >= tExact ? dates[dateIdx] : 'QUIT DAY'}
								</text>
							</g>
						) : null}
					</g>
				) : null}
				{roadO > 0.01 ? (
					<g opacity={roadO}>
						<Pill x={540} y={1010} w={640} label={slideDates[sdIdx]} color={NAVY} fs={42} />
						<text x="540" y="1100" textAnchor="middle" fontFamily={font} fontWeight="800" fontSize="32" fill={INK} opacity="0.7">
							THE ROADMAP DATE MOVES TOO
						</text>
					</g>
				) : null}

				{roomsO > 0.01 ? (
					<g opacity={roomsO}>
						<text x="540" y="455" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="46" letterSpacing="6" fill={NAVY}>
							FEBRUARY
						</text>
						<Room x={100} w={420} dark={gymDark} label="GYM" id="gym">
							<rect x="150" y="840" width="300" height="34" rx="10" fill="#555B6B" />
							<rect x="170" y="700" width="14" height="150" fill="#555B6B" />
							<rect x="140" y="690" width="120" height="22" rx="10" fill={INK} />
							<Dumbbell x={390} y={890} r={-4} />
							<circle cx="400" cy="590" r="40" fill={WHITE} stroke={INK} strokeWidth="5" />
							<line x1="400" y1="590" x2="400" y2="562" stroke={INK} strokeWidth="5" />
							<line x1="400" y1="590" x2="420" y2="598" stroke={INK} strokeWidth="5" />
						</Room>
						<Room x={560} w={420} dark={confDark} label="ROADMAP ROOM" id="conf">
							<ellipse cx="770" cy="930" rx="170" ry="40" fill="#8A6B47" />
							{[640, 720, 820, 900].map((cx) => (
								<rect key={cx} x={cx - 28} y="965" width="56" height="60" rx="14" fill="#5C6A8C" />
							))}
						</Room>
						<Slide x={770} y={700} w={330} h={220} ticks={3} glow={glow} fs={26} />
						<Pill y={1170} w={800} label={bothTxt} color={bothCol} fs={32} o={ease(t, tLaunched, tLaunched + 0.25)} />
					</g>
				) : null}
			</g>
			<PunchStamp t={t} at={tSlides + 0.7} lines={['ONLY THE SLIDES', 'SURVIVE']} color={RED} y={935} size={56} />
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const ResolutionsRoadmapShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#C9D9EF" vig={0.3}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
