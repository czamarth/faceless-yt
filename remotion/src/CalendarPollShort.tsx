import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, GOLD, GREEN, INK, RED, pop} from './WatermelonShort';
import {ChannelStamp, Pill, PunchStamp, ease} from './PlanKit';

/*
 * W33 "Calendar poll" (visuals/calendar-poll.md), anketa s mřížkou dnů.
 * 12 lidí x 4 dny -> deadline se posouvá, "please vote"/"I voted" -> jediný termín 14. 3. 2029 -> 11 přijme, jeden navrhne jiný čas -> anketa znovu otevřena.
 */

const NAVY = '#243A66';
const GRAY = '#7B8498';
const COLS = ['MON', 'TUE', 'WED', 'THU'];
const CX = [440, 600, 760, 920];
const TIES = [BLUE, GREEN, GOLD, RED, '#8A5CD6', '#2FB6B6', '#E07A3C', '#5C6A8C'];
// kdo může který den: Po 4, Út 5 (jiných), St všichni kromě #11, Čt nikdo (jiná schůzka)
const OK: Record<number, number[]> = {0: [0, 1, 2, 3], 1: [4, 5, 6, 7, 8], 2: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3: []};

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tQuick = cue(segs, /^Quick poll/);
	const tTwelve = cue(segs, /^Twelve people/);
	const tMon = cue(segs, /^Monday works/);
	const tTue = cue(segs, /^Tuesday works/);
	const tWed = cue(segs, /^Wednesday works/);
	const tThu = cue(segs, /^Thursday is/);
	const tExt = cue(segs, /^The poll is extended/);
	const tAgain = cue(segs, /^Then extended again/);
	const tNote = cue(segs, /^please vote/);
	const tReply = cue(segs, /^Someone replies all/);
	const tVoted = cue(segs, /^I voted/);
	const tEleven = cue(segs, /^By day eleven/);
	const tEveryone = cue(segs, /^Everyone has voted/);
	const tDate = cue(segs, /^The only date/);
	const tInvite = cue(segs, /^The organizer/);
	const tAccept = cue(segs, /^Eleven people/);
	const tProp = cue(segs, /^One person proposes/);
	const tOpen = cue(segs, /^The poll is reopened/);

	const matrixO = pop(t, tQuick, 0.4) * (1 - ease(t, tEleven - 0.3, tEleven));
	const calO = ease(t, tEleven, tEleven + 0.4) * (1 - ease(t, tInvite - 0.2, tInvite));
	const invO = ease(t, tInvite, tInvite + 0.35);
	const dayStart = [tMon, tTue, tWed, tThu];
	const deadline = t >= tAgain ? 'DEADLINE: NEXT MONTH' : t >= tExt ? 'DEADLINE: NEXT WEEK' : 'DEADLINE: FRIDAY';

	return (
		<Svg>
			{matrixO > 0.01 ? (
				<g opacity={Math.min(1, matrixO)}>
					<rect x="100" y="340" width="880" height="880" rx="30" fill="#fff" stroke={INK} strokeWidth="5" />
					<rect x="100" y="340" width="880" height="96" rx="30" fill={NAVY} />
					<rect x="100" y="400" width="880" height="36" fill={NAVY} />
					<text x="540" y="400" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="2" fill="#fff">
						QUICK POLL: WHEN CAN EVERYONE MEET?
					</text>
					{/* stavové pilulky */}
					<Pill y={490} w={620} label={deadline} color={t >= tExt ? RED : GRAY} fs={30} o={ease(t, tExt - 0.3, tExt) * 0 + (t >= tTwelve ? 1 : 0)} />
					{t >= tNote ? (
						<g opacity={ease(t, tNote, tNote + 0.25) * (1 - ease(t, tReply - 0.1, tReply))}>
							<rect x="150" y="545" width="780" height="50" rx="25" fill="#FFF3C4" stroke={GOLD} strokeWidth="4" />
							<text x="540" y="581" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={INK}>
								NOTE: PLEASE VOTE
							</text>
						</g>
					) : null}
					{t >= tReply ? (
						<g opacity={ease(t, tReply, tReply + 0.25) * (1 - ease(t, tEleven - 0.3, tEleven))}>
							<rect x="150" y="545" width="780" height="50" rx="25" fill="#FFE3E3" stroke={RED} strokeWidth="4" />
							<text x="540" y="581" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={RED}>
								REPLY ALL: {t >= tVoted ? '“I VOTED”' : '…'}
							</text>
						</g>
					) : null}
					{/* hlavičky dnů */}
					{COLS.map((c, i) => (
						<text key={c} x={CX[i]} y="640" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" letterSpacing="2" fill={NAVY}>
							{c}
						</text>
					))}
					{/* řádky lidí */}
					{Array.from({length: 12}, (_, r) => {
						const y = 690 + r * 42;
						const o = ease(t, tTwelve + r * 0.06, tTwelve + 0.25 + r * 0.06);
						return (
							<g key={r} opacity={o}>
								<circle cx="150" cy={y - 6} r="14" fill={TIES[r % TIES.length]} />
								<rect x="180" y={y - 12} width={r === 10 ? 80 : 110} height="12" rx="6" fill="#D5DBE8" />
								{r === 10 && t >= tWed ? <text x="280" y={y - 1} fontFamily={font} fontWeight="900" fontSize="22" fill={RED}>OUT</text> : null}
								{COLS.map((c, i) => {
									const show = t >= dayStart[i] + 0.2 + (OK[i].includes(r) ? OK[i].indexOf(r) * 0.12 : 0);
									const ok = OK[i].includes(r);
									if (!show) return <rect key={c} x={CX[i] - 20} y={y - 26} width="40" height="30" rx="6" fill="none" stroke="#E2E7F1" strokeWidth="2" />;
									return ok ? (
										<g key={c}>
											<rect x={CX[i] - 20} y={y - 26} width="40" height="30" rx="6" fill="#E3F6EC" stroke={GREEN} strokeWidth="2" />
											<path d={`M ${CX[i] - 10} ${y - 10} L ${CX[i] - 3} ${y - 3} L ${CX[i] + 11} ${y - 21}`} fill="none" stroke={GREEN} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
										</g>
									) : (
										<rect key={c} x={CX[i] - 20} y={y - 26} width="40" height="30" rx="6" fill="#F1F4FA" stroke="#D5DBE8" strokeWidth="2" />
									);
								})}
							</g>
						);
					})}
					{t >= tThu ? (
						<g opacity={ease(t, tThu, tThu + 0.3)}>
							<rect x={CX[3] - 62} y="660" width="124" height="520" rx="12" fill="#FFE3E3" opacity="0.55" />
							<text x={CX[3]} y="930" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="26" fill={RED} transform={`rotate(-90 ${CX[3]} 930)`}>
								OTHER MEETING
							</text>
						</g>
					) : null}
				</g>
			) : null}

			{/* kalendář: jediný vhodný termín */}
			{calO > 0.01 ? (
				<g opacity={calO}>
					<rect x="100" y="400" width="880" height="780" rx="30" fill="#fff" stroke={INK} strokeWidth="5" />
					<Pill y={460} w={680} label={t >= tEveryone ? 'EVERYONE HAS VOTED' : 'DAY 11 · A CLEAR WINNER'} color={GREEN} fs={32} o={1} />
					<rect x="100" y="510" width="880" height="80" fill={RED} />
					<text x="540" y="565" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="44" letterSpacing="6" fill="#fff">
						MARCH 2029
					</text>
					{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
						<text key={i} x={175 + i * 105} y="635" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="26" fill={GRAY}>
							{d}
						</text>
					))}
					{Array.from({length: 31}, (_, i) => {
						const d = i + 1;
						const slot = i + 3; // 1. března 2029 = čtvrtek
						const x = 175 + (slot % 7) * 105;
						const y = 700 + Math.floor(slot / 7) * 88;
						const hit = d === 14;
						const glow = hit ? ease(t, tDate + 0.6, tDate + 1.2) : 0;
						return (
							<g key={d}>
								<rect x={x - 40} y={y - 36} width="80" height="72" rx="10" fill={hit && glow > 0.1 ? GOLD : '#F1F4FA'} opacity={hit ? 1 : 0.9} stroke={hit && glow > 0.1 ? INK : '#D5DBE8'} strokeWidth={hit ? 5 : 2} />
								<text x={x} y={y + 12} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" fill={INK} opacity={hit ? 1 : 0.55}>
									{d}
								</text>
							</g>
						);
					})}
					<Pill y={1145} w={760} label="THE ONLY DATE THAT WORKS" color={RED} fs={30} o={ease(t, tDate, tDate + 0.3)} />
				</g>
			) : null}

			{invO > 0.01 ? (
				<g opacity={invO}>
					<rect x="100" y="400" width="880" height="780" rx="30" fill="#fff" stroke={INK} strokeWidth="5" />
					<text x="540" y="500" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="44" letterSpacing="4" fill={NAVY}>
						INVITE SENT · 14 MAR 2029
					</text>
					{Array.from({length: 12}, (_, i) => {
						const x = 200 + (i % 6) * 135;
						const y = 650 + Math.floor(i / 6) * 150;
						const acc = i < 11 && t >= tAccept + i * 0.12;
						const prop = i === 11 && t >= tProp;
						return (
							<g key={i} opacity={ease(t, tInvite + i * 0.05, tInvite + 0.3 + i * 0.05)}>
								<circle cx={x} cy={y} r="42" fill={TIES[i % TIES.length]} stroke={INK} strokeWidth="4" />
								{acc ? (
									<g transform={`translate(${x + 30} ${y - 34})`}>
										<circle r="20" fill={GREEN} stroke="#fff" strokeWidth="3" />
										<path d="M -9 1 L -2 8 L 10 -8" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
									</g>
								) : null}
								{prop ? (
									<g transform={`translate(${x + 30} ${y - 34})`}>
										<circle r="20" fill={GOLD} stroke="#fff" strokeWidth="3" />
										<text x="0" y="9" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="26" fill={INK}>
											?
										</text>
									</g>
								) : null}
							</g>
						);
					})}
					<Pill y={940} w={640} label={t >= tAccept ? '11 ACCEPTED' : 'WAITING…'} color={GREEN} fs={34} o={ease(t, tAccept - 0.2, tAccept + 0.1)} />
					<g opacity={ease(t, tProp, tProp + 0.3)}>
						<rect x="150" y="1000" width="780" height="100" rx="50" fill="#FFF3C4" stroke={GOLD} strokeWidth="5" />
						<text x="540" y="1064" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="32" fill={INK}>
							“A MORE CONVENIENT TIME?”
						</text>
					</g>
				</g>
			) : null}
			<PunchStamp t={t} at={tOpen + 0.1} lines={['POLL', 'REOPENED']} color={RED} y={800} size={96} />
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const CalendarPollShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#C6D3EA" vig={0.3}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
