import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, Bean, GOLD, GREEN, INK, RED, pop} from './WatermelonShort';
import {ChannelStamp, Pill, ease} from './PlanKit';

/*
 * W21 "End of meetings" (visuals/end-of-meetings.md), e-mail + kalendář.
 * E-mail "big news" -> kalendář se čistí -> fazolka objímá tiskárnu -> 30. 3. -> bubliny ?? -> pozvánka na oslavu konce schůzek.
 */

const NAVY = '#243A66';
const GRAY = '#7B8498';
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const BLOCKS: [number, number, number, string][] = [
	[0, 0, 1, BLUE],
	[0, 2, 1, GREEN],
	[1, 1, 2, RED],
	[1, 3, 1, GOLD],
	[2, 0, 1, GREEN],
	[2, 2, 2, BLUE],
	[3, 1, 1, RED],
	[3, 3, 1, GREEN],
	[4, 0, 2, GOLD],
	[4, 3, 1, BLUE],
];

const Printer: React.FC<{x: number; y: number}> = ({x, y}) => (
	<g transform={`translate(${x} ${y})`}>
		<rect x="-50" y="-74" width="100" height="36" rx="5" fill="#fff" stroke={INK} strokeWidth="4" />
		<rect x="-80" y="-42" width="160" height="80" rx="12" fill="#9AA3B8" stroke={INK} strokeWidth="5" />
		<rect x="-52" y="22" width="104" height="30" rx="4" fill="#fff" stroke={INK} strokeWidth="4" />
	</g>
);

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tBig = cue(segs, /^big news/);
	const tEff = cue(segs, /^Effective immediately/);
	const tErupt = cue(segs, /^The office erupted/);
	const tCried = cue(segs, /^Someone cried/);
	const tHug = cue(segs, /^Someone hugged/);
	const tMon = cue(segs, /^The Monday sync/);
	const tCheck = cue(segs, /^Then an employee/);
	const tNotApr = cue(segs, /^It was not April/);
	const tMar = cue(segs, /^It was March/);
	const tMist = cue(segs, /^Either this was/);
	const tInv = cue(segs, /^Fifteen minutes later/);
	const tSubj = cue(segs, /^meeting to celebrate/);
	const tDur = cue(segs, /^Duration/);
	const tAtt = cue(segs, /^Attendance/);
	const tAgenda = cue(segs, /^Agenda/);

	const emailO = pop(t, 0.1, 0.4) * (1 - ease(t, tCheck - 0.3, tCheck));
	const calO = ease(t, tEff - 0.2, tEff + 0.2) * (1 - ease(t, tErupt - 0.2, tErupt)) + ease(t, tMon - 0.1, tMon + 0.2) * (1 - ease(t, tCheck - 0.3, tCheck));
	const eruptO = ease(t, tErupt, tErupt + 0.3) * (1 - ease(t, tMon - 0.2, tMon));
	const dateO = ease(t, tCheck, tCheck + 0.3) * (1 - ease(t, tMist - 0.2, tMist));
	const mistO = ease(t, tMist, tMist + 0.3) * (1 - ease(t, tInv - 0.2, tInv));
	const invO = ease(t, tInv, tInv + 0.35);

	return (
		<Svg>
			{/* e-mail */}
			{emailO > 0.01 ? (
				<g opacity={Math.min(1, emailO)}>
					<rect x="100" y="340" width="880" height="300" rx="26" fill="#fff" stroke={INK} strokeWidth="5" />
					<rect x="100" y="340" width="880" height="70" rx="26" fill={NAVY} />
					<rect x="100" y="380" width="880" height="30" fill={NAVY} />
					<text x="140" y="387" fontFamily={font} fontWeight="900" fontSize="30" letterSpacing="3" fill="#fff">
						FROM: LEADERSHIP
					</text>
					<text x="140" y="470" fontFamily={font} fontWeight="800" fontSize="28" fill={GRAY}>
						SUBJECT:
					</text>
					<text x="300" y="470" fontFamily={font} fontWeight="900" fontSize="44" fill={RED} opacity={ease(t, tBig, tBig + 0.25)}>
						BIG NEWS
					</text>
					<g opacity={ease(t, tEff, tEff + 0.3)}>
						<text x="140" y="545" fontFamily={font} fontWeight="800" fontSize="34" fill={INK}>
							Effective immediately:
						</text>
						<text x="140" y="595" fontFamily={font} fontWeight="900" fontSize="38" fill={INK}>
							all recurring meetings are canceled.
						</text>
					</g>
				</g>
			) : null}

			{/* kalendář */}
			{calO > 0.01 ? (
				<g opacity={Math.min(1, calO)}>
					<rect x="100" y="680" width="880" height="520" rx="26" fill="#fff" stroke={INK} strokeWidth="5" />
					{DAYS.map((d, i) => (
						<g key={d}>
							<text x={190 + i * 165} y="735" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="28" letterSpacing="2" fill={NAVY}>
								{d}
							</text>
							<line x1={115 + i * 165 + 75} y1="750" x2={115 + i * 165 + 75} y2="1180" stroke="#DDE2EE" strokeWidth="3" />
						</g>
					))}
					{BLOCKS.map(([col, row, h, color], i) => {
						const isMon = col === 0 && row === 0;
						const killAt = isMon ? tMon : tEff + 0.3 + i * 0.3;
						const o = 1 - ease(t, killAt, killAt + (isMon ? 0.12 : 0.3));
						return (
							<g key={i}>
								{isMon && t > tMon ? <rect x="120" y={770} width="140" height="70" rx="10" fill="none" stroke={GRAY} strokeWidth="4" strokeDasharray="10 8" /> : null}
								<rect x={120 + col * 165} y={770 + row * 105} width="140" height={h * 90 + (h - 1) * 15} rx="10" fill={color} opacity={o * 0.9} />
							</g>
						);
					})}
					{t >= tMon ? (
						<text x="190" y="1000" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="26" fill={RED} opacity={ease(t, tMon, tMon + 0.3)}>
							DELETED
						</text>
					) : null}
				</g>
			) : null}

			{/* oslava */}
			{eruptO > 0.01 ? (
				<g opacity={eruptO}>
					<rect x="100" y="680" width="880" height="520" rx="26" fill="#FFF4D6" stroke={INK} strokeWidth="5" />
					{Array.from({length: 14}, (_, i) => (
						<circle key={i} cx={150 + i * 62} cy={720 + ((t * 120 + i * 77) % 420)} r="9" fill={[GOLD, RED, BLUE, GREEN][i % 4]} />
					))}
					<Printer x={640} y={1010} />
					<Bean x={470} y={1090} s={0.9} tie={BLUE} />
					<line x1="520" y1="960" x2="580" y2="985" stroke="#F2C9A0" strokeWidth="14" strokeLinecap="round" opacity={ease(t, tHug, tHug + 0.3)} />
					<Pill y={760} w={560} label="THE OFFICE ERUPTED" color={GOLD} fs={32} o={ease(t, tErupt, tErupt + 0.25) * (1 - ease(t, tCried, tCried + 0.1))} />
					<Pill y={760} w={560} label="SOMEONE CRIED" color={BLUE} fs={32} o={ease(t, tCried, tCried + 0.25) * (1 - ease(t, tHug, tHug + 0.1))} />
					<Pill y={760} w={640} label="SOMEONE HUGGED A PRINTER" color={GREEN} fs={32} o={ease(t, tHug, tHug + 0.25)} />
				</g>
			) : null}

			{/* datum */}
			{dateO > 0.01 ? (
				<g opacity={dateO}>
					<rect x="200" y="440" width="680" height="560" rx="30" fill="#fff" stroke={INK} strokeWidth="6" />
					<rect x="200" y="440" width="680" height="130" rx="30" fill={RED} />
					<rect x="200" y="520" width="680" height="50" fill={RED} />
					<text x="540" y="530" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="64" letterSpacing="8" fill="#fff">
						MARCH
					</text>
					<text x="540" y="810" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="260" fill={INK} opacity={ease(t, tMar, tMar + 0.3)}>
						30
					</text>
					<g opacity={ease(t, tNotApr, tNotApr + 0.3) * (1 - ease(t, tMar, tMar + 0.1))}>
						<text x="540" y="780" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="150" fill={GRAY}>
							APR 1
						</text>
						<line x1="260" y1="700" x2="820" y2="800" stroke={RED} strokeWidth="14" strokeLinecap="round" />
					</g>
					<Pill y={940} w={440} label="NOT APRIL 1" color={RED} fs={34} o={ease(t, tNotApr, tNotApr + 0.3)} />
				</g>
			) : null}

			{/* bubliny */}
			{mistO > 0.01 ? (
				<g opacity={mistO}>
					<Bean x={540} y={1100} s={1.1} tie={BLUE} />
					{[
						[330, 650, 'MISTAKE?'],
						[760, 600, 'JOKE?'],
					].map(([x, y, label], i) => (
						<g key={i} transform={`translate(${x} ${y}) scale(${Math.min(pop(t, tMist + 0.2 + i * 0.6, 0.35), 1.05)})`}>
							<rect x="-170" y="-60" width="340" height="120" rx="60" fill="#fff" stroke={INK} strokeWidth="6" />
							<text x="0" y="16" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="46" fill={RED}>
								{label}
							</text>
						</g>
					))}
				</g>
			) : null}

			{/* pozvánka */}
			{invO > 0.01 ? (
				<g opacity={invO} transform={`translate(0 ${(1 - invO) * 30})`}>
					<rect x="100" y="380" width="880" height="800" rx="30" fill="#fff" stroke={INK} strokeWidth="6" />
					<rect x="100" y="380" width="880" height="110" rx="30" fill={BLUE} />
					<rect x="100" y="450" width="880" height="40" fill={BLUE} />
					<text x="540" y="450" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="40" letterSpacing="4" fill="#fff">
						CALENDAR INVITATION
					</text>
					<g opacity={ease(t, tSubj, tSubj + 0.3)}>
						<text x="150" y="560" fontFamily={font} fontWeight="800" fontSize="28" fill={GRAY}>
							SUBJECT
						</text>
						<text x="150" y="620" fontFamily={font} fontWeight="900" fontSize="40" fill={INK}>
							Meeting to Celebrate
						</text>
						<text x="150" y="672" fontFamily={font} fontWeight="900" fontSize="40" fill={INK}>
							the End of Meetings
						</text>
					</g>
					<g opacity={ease(t, tDur, tDur + 0.3)}>
						<rect x="150" y="730" width="360" height="90" rx="16" fill="#F1F4FA" stroke={INK} strokeWidth="3" />
						<text x="330" y="788" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="38" fill={INK}>
							DURATION: 2 H
						</text>
					</g>
					<g opacity={ease(t, tAtt, tAtt + 0.3)}>
						<rect x="540" y="730" width="390" height="90" rx="16" fill="#FFE3E3" stroke={RED} strokeWidth="4" />
						<text x="735" y="788" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" fill={RED}>
							MANDATORY
						</text>
					</g>
					<g opacity={ease(t, tAgenda, tAgenda + 0.3)}>
						<rect x="150" y="870" width="780" height="230" rx="16" fill="#FFF4D6" stroke={INK} strokeWidth="3" />
						<text x="190" y="930" fontFamily={font} fontWeight="900" fontSize="30" letterSpacing="3" fill={GRAY}>
							AGENDA
						</text>
						<text x="190" y="990" fontFamily={font} fontWeight="900" fontSize="36" fill={INK}>
							How to schedule meetings
						</text>
						<text x="190" y="1040" fontFamily={font} fontWeight="900" fontSize="36" fill={INK}>
							without meetings
						</text>
					</g>
				</g>
			) : null}
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const EndOfMeetingsShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#C6D3EA" vig={0.3}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
