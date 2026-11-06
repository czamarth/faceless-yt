import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, Bean, GREEN, INK, RED, GOLD, lerp, pop} from './WatermelonShort';
import {ChannelStamp, Pill, PunchStamp, ease} from './PlanKit';

/*
 * W18 "Daylight saving 02:30 meeting" (visuals/daylight-saving-meeting.md), hodiny a kalendář.
 * Ručička skočí 2:00 -> 3:00 -> 02:xx bliká a mizí -> pozvánka 2:30 -> tři stavy -> Evropa -> prázdný seznam účastníků.
 */

const PANEL = {x: 70, y: 330, w: 940, h: 900};
const NAVY = '#243A66';
const GRAY = '#7B8498';
const MONO = "Consolas, 'Courier New', monospace";

const Clock: React.FC<{x: number; y: number; r: number; hour: number; min: number}> = ({x, y, r, hour, min}) => (
	<g transform={`translate(${x} ${y})`}>
		<circle r={r} fill="#fff" stroke={INK} strokeWidth="8" />
		{Array.from({length: 12}, (_, i) => (
			<line key={i} x1="0" y1={-r + 12} x2="0" y2={-r + (i % 3 === 0 ? 40 : 26)} stroke={INK} strokeWidth={i % 3 === 0 ? 8 : 4} transform={`rotate(${i * 30})`} />
		))}
		<line x1="0" y1="0" x2="0" y2={-r * 0.5} stroke={INK} strokeWidth="14" strokeLinecap="round" transform={`rotate(${(hour % 12) * 30 + min * 0.5})`} />
		<line x1="0" y1="0" x2="0" y2={-r * 0.78} stroke={RED} strokeWidth="9" strokeLinecap="round" transform={`rotate(${min * 6})`} />
		<circle r="12" fill={INK} />
	</g>
);

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tStraight = cue(segs, /^straight to three/);
	const tNot = cue(segs, /^The time in between/);
	const tGlobal = cue(segs, /^So when someone/);
	const tImp = cue(segs, /^that night/);
	const tCal = cue(segs, /^The calendar says/);
	const tAcc = cue(segs, /^accepted/);
	const tSoon = cue(segs, /^starting soon/);
	const tNo = cue(segs, /^no\./);
	const tEu = cue(segs, /^Somewhere in Europe/);
	const tHeld = cue(segs, /^The meeting is held/);
	const tCant = cue(segs, /^Nobody can join/);
	const tNoone = cue(segs, /^Nobody notices/);
	const tAtt = cue(segs, /^Attendance matched/);

	// hodiny: 1:30 -> 2:00 -> skok na 3:00
	const base = lerp(1.5, 2, ease(t, 0.3, tStraight - 0.3));
	const jumped = t >= tStraight;
	const hour = jumped ? 3 : Math.floor(base);
	const min = jumped ? 0 : (base % 1) * 60;
	const clockO = 1 - ease(t, tGlobal - 0.3, tGlobal);
	const digital = jumped ? '03:00' : `0${Math.floor(base)}:${String(Math.floor((base % 1) * 60)).padStart(2, '0')}`;
	const blink = t >= tNot && t < tGlobal ? (Math.sin(t * 14) > 0 ? 1 : 0.2) * (1 - ease(t, tNot + 1.5, tGlobal - 0.3)) : 0;

	const inviteO = ease(t, tGlobal, tGlobal + 0.35) * (1 - ease(t, tEu - 0.3, tEu));
	const euO = ease(t, tEu, tEu + 0.35) * (1 - ease(t, tHeld - 0.2, tHeld));
	const roomO = ease(t, tHeld, tHeld + 0.35);

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
				{/* hodiny */}
				{clockO > 0.01 ? (
					<g opacity={clockO}>
						<Pill y={440} w={760} label="USA · A SUNDAY IN MARCH" color={NAVY} fs={34} o={1} />
						<Clock x={540} y={760} r={230} hour={hour} min={min} />
						<g transform="translate(540 1110)">
							<rect x="-170" y="-60" width="340" height="120" rx="16" fill="#0E1A2E" stroke={INK} strokeWidth="5" />
							<text x="0" y="28" textAnchor="middle" fontFamily={MONO} fontWeight="700" fontSize="84" fill="#7FE0FF" opacity={t >= tNot ? 0 : 1}>
								{digital}
							</text>
							{t >= tNot ? (
								<text x="0" y="28" textAnchor="middle" fontFamily={MONO} fontWeight="700" fontSize="84" fill="#FF6B6B" opacity={blink}>
									02:30
								</text>
							) : null}
						</g>
						{t >= tNot ? (
							<g opacity={ease(t, tNot + 0.2, tNot + 0.5)} transform="translate(540 590)">
								<rect x="-330" y="-40" width="660" height="80" rx="40" fill="#fff" stroke={RED} strokeWidth="6" />
								<text x="0" y="14" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="38" fill={RED}>
									02:30 DOES NOT EXIST
								</text>
							</g>
						) : null}
					</g>
				) : null}

				{/* pozvánka a stavy */}
				{inviteO > 0.01 ? (
					<g opacity={inviteO}>
						<rect x="130" y="440" width="820" height="720" rx="26" fill="#fff" stroke={INK} strokeWidth="5" />
						<rect x="130" y="440" width="820" height="110" rx="26" fill={BLUE} />
						<rect x="130" y="510" width="820" height="40" fill={BLUE} />
						<text x="540" y="508" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="44" letterSpacing="3" fill="#fff">
							GLOBAL SYNC
						</text>
						<text x="540" y="680" textAnchor="middle" fontFamily={MONO} fontWeight="700" fontSize="110" fill={INK} opacity={ease(t, tImp - 0.8, tImp - 0.4)}>
							2:30 AM
						</text>
						<text x="540" y="740" textAnchor="middle" fontFamily={font} fontWeight="800" fontSize="30" fill={GRAY} opacity={ease(t, tImp, tImp + 0.3)}>
							THAT NIGHT · TECHNICALLY IMPOSSIBLE
						</text>
						<Pill y={850} w={560} label="CALENDAR: ACCEPTED" color={GREEN} fs={32} o={ease(t, tAcc, tAcc + 0.25)} />
						<Pill y={950} w={560} label="VIDEO APP: STARTING SOON" color={BLUE} fs={30} o={ease(t, tSoon, tSoon + 0.25)} />
						<Pill y={1050} w={560} label="THE CLOCK: NO" color={RED} fs={34} o={ease(t, tNo, tNo + 0.25)} />
					</g>
				) : null}

				{/* Evropa */}
				{euO > 0.01 ? (
					<g opacity={euO}>
						<Pill y={440} w={760} label="EUROPE · CLOCKS CHANGE 2 WEEKS LATER" color={NAVY} fs={28} o={1} />
						<Clock x={540} y={760} r={190} hour={2} min={30} />
						<rect x="260" y="1000" width="560" height="160" rx="20" fill="#fff" stroke={INK} strokeWidth="5" />
						<Bean x={540} y={1150} s={0.55} tie={BLUE} />
						<Pill x={540} y={1010} w={540} label="WRONG HOUR" color={RED} fs={30} o={ease(t, tEu + 0.8, tEu + 1.1)} />
					</g>
				) : null}

				{/* prázdná zasedačka */}
				{roomOn(roomO) ? (
					<g opacity={roomO}>
						<rect x="130" y="440" width="820" height="520" rx="26" fill="#fff" stroke={INK} strokeWidth="5" />
						<text x="170" y="505" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="3" fill={NAVY}>
							MEETING · IN PROGRESS
						</text>
						<ellipse cx="540" cy="740" rx="300" ry="90" fill="#8A6B47" />
						{[300, 420, 540, 660, 780].map((cx) => (
							<rect key={cx} x={cx - 26} y="830" width="52" height="60" rx="14" fill="#5C6A8C" />
						))}
						<Pill y={560} w={620} label="NOBODY CAN JOIN" color={RED} fs={34} o={ease(t, tCant, tCant + 0.25)} />
						<rect x="130" y="990" width="820" height="170" rx="22" fill="#F4F6FB" stroke={INK} strokeWidth="5" />
						<text x="170" y="1050" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="3" fill={INK}>
							ATTENDEES: 0
						</text>
						<text x="170" y="1110" fontFamily={font} fontWeight="800" fontSize="32" fill={GRAY} opacity={ease(t, tNoone, tNoone + 0.3)}>
							NOBODY NOTICES
						</text>
					</g>
				) : null}
			</g>
			<PunchStamp t={t} at={tAtt + 0.3} lines={['ATTENDANCE:', 'USUAL']} color={GOLD} y={760} size={78} />
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};
const roomOn = (o: number) => o > 0.01;

export const DaylightMeetingShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#C6D3EA" vig={0.3}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
