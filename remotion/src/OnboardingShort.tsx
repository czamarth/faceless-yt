import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, Bean, GOLD, GREEN, INK, RED, pop} from './WatermelonShort';
import {ChannelStamp, Pill, PunchStamp, ease} from './PlanKit';

/*
 * W31 "Onboarding day one" (visuals/onboarding-day-one.md), checklist + scény.
 * Welcome -> laptop den 9 -> odznak den 12 + Gary -> e-mail, který nikdo nemá -> kamarád odešel -> checklist 3 kroků -> manager na dovolené -> "complete onboarding".
 */

const NAVY = '#243A66';
const GRAY = '#7B8498';
const MONO = "Consolas, 'Courier New', monospace";

const Palm: React.FC<{x: number; y: number}> = ({x, y}) => (
	<g transform={`translate(${x} ${y})`}>
		<path d="M 0 0 Q 18 -90 -6 -190" fill="none" stroke="#8A5A2B" strokeWidth="18" strokeLinecap="round" />
		{[-70, -30, 20, 65].map((a, i) => (
			<path key={i} d="M -6 -190 Q 40 -250 100 -200" fill="none" stroke="#2FB67C" strokeWidth="22" strokeLinecap="round" transform={`rotate(${a} -6 -190)`} />
		))}
	</g>
);

const Chair: React.FC<{x: number; y: number; ghost?: boolean}> = ({x, y, ghost}) => (
	<g transform={`translate(${x} ${y})`} opacity={ghost ? 0.5 : 1}>
		<rect x="-40" y="-10" width="80" height="16" rx="6" fill="#5C6A8C" stroke={INK} strokeWidth="4" />
		<rect x="-40" y="-90" width="16" height="84" rx="6" fill="#5C6A8C" stroke={INK} strokeWidth="4" />
		<rect x="-6" y="6" width="12" height="60" fill="#5C6A8C" />
		<ellipse cx="0" cy="68" rx="40" ry="8" fill="#5C6A8C" />
	</g>
);

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tExcited = cue(segs, /^We are so excited/);
	const tLaptop = cue(segs, /^Your laptop/);
	const tBadge = cue(segs, /^Your badge/);
	const tGary = cue(segs, /^Until then/);
	const tMail = cue(segs, /^Your email address/);
	const tNobody = cue(segs, /^Unfortunately/);
	const tBuddy = cue(segs, /^Your buddy/);
	const tMeet = cue(segs, /^Your first meeting/);
	const tList = cue(segs, /^On day one/);
	const t1 = cue(segs, /^log in to the portal/);
	const t2 = cue(segs, /^reset your password/);
	const t3 = cue(segs, /^ask your manager/);
	const tMgr = cue(segs, /^Your manager is on/);
	const tFirst = cue(segs, /^Your first task/);
	const tDone = cue(segs, /^complete onboarding/);

	const w = (a: number, b: number) => ease(t, a - 0.1, a + 0.3) * (1 - ease(t, b - 0.3, b));
	const welcomeO = pop(t, 0.1, 0.4) * (1 - ease(t, tLaptop - 0.3, tLaptop));
	const laptopO = w(tLaptop, tBadge);
	const badgeO = w(tBadge, tMail);
	const mailO = w(tMail, tBuddy);
	const buddyO = w(tBuddy, tList);
	const listO = ease(t, tList, tList + 0.35);
	const mgrO = ease(t, tMgr, tMgr + 0.35);

	return (
		<Svg>
			{welcomeO > 0.01 ? (
				<g opacity={Math.min(1, welcomeO)}>
					<rect x="100" y="420" width="880" height="740" rx="30" fill="#FFF4D6" stroke={INK} strokeWidth="5" />
					{Array.from({length: 18}, (_, i) => (
						<rect key={i} x={140 + i * 46} y={450 + ((t * 140 + i * 83) % 640)} width="18" height="26" rx="3" fill={[GOLD, RED, BLUE, GREEN][i % 4]} transform={`rotate(${(t * 90 + i * 40) % 360} ${150 + i * 46} ${465})`} />
					))}
					<text x="540" y="740" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="120" fill={NAVY}>
						WELCOME!
					</text>
					<text x="540" y="850" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="44" fill={GREEN} opacity={ease(t, tExcited, tExcited + 0.3)}>
						we are so excited
					</text>
					<Bean x={540} y={1130} s={0.9} tie={BLUE} />
				</g>
			) : null}

			{laptopO > 0.01 ? (
				<g opacity={laptopO}>
					<rect x="100" y="420" width="880" height="740" rx="30" fill="#fff" stroke={INK} strokeWidth="5" />
					<rect x="100" y="420" width="880" height="90" rx="30" fill={RED} />
					<rect x="100" y="480" width="880" height="30" fill={RED} />
					<text x="540" y="482" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="40" letterSpacing="5" fill="#fff">
						YOUR FIRST WEEKS
					</text>
					{Array.from({length: 14}, (_, i) => {
						const d = i + 1;
						const x = 180 + (i % 7) * 105;
						const y = 590 + Math.floor(i / 7) * 120;
						const hit = d === 9;
						return (
							<g key={i} opacity={ease(t, tLaptop + i * 0.08, tLaptop + 0.3 + i * 0.08)}>
								<rect x={x - 42} y={y - 42} width="84" height="84" rx="10" fill={hit && t >= tLaptop + 1.2 ? GOLD : '#F1F4FA'} stroke={INK} strokeWidth="3" />
								<text x={x} y={y + 12} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" fill={INK}>
									{d}
								</text>
							</g>
						);
					})}
					<g opacity={ease(t, tLaptop + 1.2, tLaptop + 1.6)} transform="translate(540 960)">
						<rect x="-70" y="-60" width="140" height="90" rx="8" fill="#2B2F3A" stroke={INK} strokeWidth="5" />
						<rect x="-90" y="36" width="180" height="16" rx="6" fill="#9AA3B8" stroke={INK} strokeWidth="4" />
						<text x="0" y="140" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="44" fill={NAVY}>
							LAPTOP · DAY 9
						</text>
					</g>
				</g>
			) : null}

			{badgeO > 0.01 ? (
				<g opacity={badgeO}>
					<rect x="100" y="420" width="880" height="740" rx="30" fill="#E3EEF2" stroke={INK} strokeWidth="5" />
					<rect x="560" y="520" width="300" height="540" rx="14" fill="#8A6B47" stroke={INK} strokeWidth="6" />
					<circle cx="600" cy="800" r="14" fill={GOLD} />
					<Bean x={400} y={1070} s={1.05} tie={BLUE} hat="cap" />
					<g transform="translate(300 600)">
						<rect x="-110" y="-70" width="220" height="140" rx="14" fill="#fff" stroke={INK} strokeWidth="5" />
						<rect x="-40" y="-92" width="80" height="26" rx="8" fill={GRAY} />
						<text x="0" y="-8" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" letterSpacing="3" fill={NAVY}>
							BADGE
						</text>
						<text x="0" y="40" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="40" fill={RED}>
							DAY 12
						</text>
					</g>
					<g opacity={ease(t, tGary, tGary + 0.3)}>
						<Pill x={560} y={1120} w={440} label="GARY · SECURITY" color={BLUE} fs={30} o={1} />
						<g transform="translate(300 880)">
							<rect x="-160" y="-40" width="320" height="80" rx="40" fill="#fff" stroke={INK} strokeWidth="5" />
							<text x="0" y="12" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" fill={RED}>
								…AND WHY?
							</text>
						</g>
					</g>
				</g>
			) : null}

			{mailO > 0.01 ? (
				<g opacity={mailO}>
					<rect x="100" y="420" width="880" height="740" rx="30" fill="#fff" stroke={INK} strokeWidth="5" />
					<rect x="180" y="560" width="720" height="400" rx="20" fill="#F8F5E8" stroke={INK} strokeWidth="6" />
					<text x="230" y="650" fontFamily={font} fontWeight="900" fontSize="44" fill={INK}>
						NEW EMPLOYEE
					</text>
					<text x="230" y="740" fontFamily={font} fontWeight="800" fontSize="30" letterSpacing="3" fill={GRAY}>
						EMAIL
					</text>
					<rect x="230" y="760" width="600" height="70" rx="10" fill="#fff" stroke={INK} strokeWidth="4" strokeDasharray="12 8" />
					<text x="260" y="808" fontFamily={MONO} fontWeight="700" fontSize="32" fill="#C5CCDA">
						{t >= tNobody ? '— — —' : 'ready'}
					</text>
					<Pill y={1060} w={700} label="READY. NOBODY HAS IT." color={RED} fs={32} o={ease(t, tNobody, tNobody + 0.3)} />
				</g>
			) : null}

			{buddyO > 0.01 ? (
				<g opacity={buddyO}>
					<rect x="100" y="420" width="880" height="740" rx="30" fill="#EEF1F8" stroke={INK} strokeWidth="5" />
					<Chair x={380} y={820} ghost />
					<Chair x={700} y={820} ghost />
					<Pill x={380} y={600} w={340} label="YOUR BUDDY" color={BLUE} fs={28} o={1} />
					<Pill x={700} y={600} w={340} label="1ST MEETING" color={GOLD} fs={28} o={ease(t, tMeet, tMeet + 0.3)} />
					<g opacity={ease(t, tBuddy + 0.4, tBuddy + 0.7)} transform="translate(380 1000)">
						<rect x="-150" y="-40" width="300" height="80" rx="40" fill="#FFE3E3" stroke={RED} strokeWidth="5" />
						<text x="0" y="12" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={RED}>
							LEFT IN MARCH
						</text>
					</g>
					<g opacity={ease(t, tMeet + 0.4, tMeet + 0.7)} transform="translate(700 1000)">
						<rect x="-150" y="-40" width="300" height="80" rx="40" fill="#FFE3E3" stroke={RED} strokeWidth="5" />
						<text x="0" y="12" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={RED}>
							ALSO MARCH
						</text>
					</g>
				</g>
			) : null}

			{listO > 0.01 ? (
				<g opacity={listO}>
					<rect x="100" y="420" width="880" height="740" rx="30" fill="#fff" stroke={INK} strokeWidth="5" />
					<rect x="100" y="420" width="880" height="90" rx="30" fill={NAVY} />
					<rect x="100" y="480" width="880" height="30" fill={NAVY} />
					<text x="540" y="482" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="40" letterSpacing="5" fill="#fff">
						DAY ONE CHECKLIST
					</text>
					{[
						['1', 'LOG IN TO THE PORTAL', t1, false],
						['2', 'RESET YOUR PASSWORD', t2, false],
						['3', 'ASK YOUR MANAGER FOR ACCESS', t3, true],
					].map(([n, label, at, red], i) => (
						<g key={i} opacity={ease(t, (at as number) - 0.2, (at as number) + 0.2)}>
							<rect x="140" y={560 + i * 120} width="800" height="96" rx="16" fill={red ? '#FFE3E3' : '#F1F4FA'} stroke={red ? RED : INK} strokeWidth="4" />
							<circle cx="205" cy={608 + i * 120} r="30" fill={red ? RED : BLUE} />
							<text x="205" y={620 + i * 120} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" fill="#fff">
								{n as string}
							</text>
							<text x="260" y={620 + i * 120} fontFamily={font} fontWeight="900" fontSize={i === 2 ? 28 : 32} fill={INK}>
								{label as string}
							</text>
						</g>
					))}
					{mgrO > 0.01 ? (
						<g opacity={mgrO * (1 - ease(t, tFirst - 0.2, tFirst))}>
							<rect x="140" y="930" width="800" height="200" rx="16" fill="#FFF4D6" stroke={INK} strokeWidth="4" />
							<g transform="scale(0.5)"><Palm x={520} y={2180} /></g>
							<text x="400" y="1010" fontFamily={font} fontWeight="900" fontSize="38" fill={INK}>
								MANAGER:
							</text>
							<text x="400" y="1070" fontFamily={font} fontWeight="900" fontSize="38" fill={GREEN}>
								ON VACATION
							</text>
						</g>
					) : null}
					{t >= tFirst ? (
						<g opacity={ease(t, tFirst, tFirst + 0.3)}>
							<rect x="140" y="930" width="800" height="200" rx="16" fill="#fff" stroke={RED} strokeWidth="6" />
							<text x="540" y="1000" textAnchor="middle" fontFamily={font} fontWeight="800" fontSize="30" letterSpacing="3" fill={GRAY}>
								YOUR FIRST TASK
							</text>
							<text x="540" y="1080" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="56" fill={RED} opacity={ease(t, tDone, tDone + 0.3)}>
								COMPLETE ONBOARDING
							</text>
						</g>
					) : null}
				</g>
			) : null}
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const OnboardingShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#C6D3EA" vig={0.3}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
