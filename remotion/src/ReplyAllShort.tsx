import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, GOLD, GREEN, INK, RED, lerp, pop} from './WatermelonShort';
import {ChannelStamp, Pill, ease} from './PlanKit';

/*
 * W30 "Reply-all storm" (visuals/reply-all.md), schránka a počítadlo.
 * Mřížka ~840 000 schránek -> testovací e-mail -> odpovědi se množí -> počítadlo ~500 mil. -> zpomalené servery -> "remove me" všem -> IT: "do not reply all" -> několik "Reply all".
 */

const NAVY = '#243A66';
const GRAY = '#7B8498';

const Envelope: React.FC<{x: number; y: number; s?: number; color?: string; o?: number}> = ({x, y, s = 1, color = '#fff', o = 1}) => (
	<g opacity={o} transform={`translate(${x} ${y}) scale(${s})`}>
		<rect x="-40" y="-28" width="80" height="56" rx="6" fill={color} stroke={INK} strokeWidth="4" />
		<polyline points="-40,-28 0,6 40,-28" fill="none" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
	</g>
);

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tTest = cue(segs, /^It was a test/);
	const tRep = cue(segs, /^Someone replied/);
	const tEvery = cue(segs, /^That reply went/);
	const tAgain = cue(segs, /^So someone replied/);
	const tWithin = cue(segs, /^Within about two/);
	const tDelay = cue(segs, /^Mail delays/);
	const tPeople = cue(segs, /^Staff did what/);
	const tWrote = cue(segs, /^please remove me/);
	const tEveryone = cue(segs, /^To everyone/);
	const tIt = cue(segs, /^IT sent a calm/);
	const tNoReply = cue(segs, /^please do not reply all/);
	const tSeveral = cue(segs, /^Several people/);

	const gridO = 1 - ease(t, tRep - 0.3, tRep);
	const mailO = ease(t, tTest, tTest + 0.3) * (1 - ease(t, tRep - 0.3, tRep));
	const storm = ease(t, tRep, tRep + 0.3) * (1 - ease(t, tDelay - 0.3, tDelay));
	const count = Math.round(lerp(0, 500, ease(t, tWithin, tWithin + 3.5)));
	const countShown = t >= tWithin ? count : 0;
	const delayO = ease(t, tDelay, tDelay + 0.3) * (1 - ease(t, tPeople - 0.3, tPeople));
	const rmO = ease(t, tPeople, tPeople + 0.3) * (1 - ease(t, tIt - 0.3, tIt));
	const itO = ease(t, tIt, tIt + 0.3);

	// exponenciální množení obálek
	const level = t < tRep ? 0 : t < tEvery ? 1 : t < tAgain ? 2 : t < tWithin ? 3 : 4;
	const envCount = [1, 6, 18, 48, 90][level];

	return (
		<Svg>
			{gridO > 0.01 ? (
				<g opacity={gridO}>
					<rect x="100" y="400" width="880" height="760" rx="26" fill="#fff" stroke={INK} strokeWidth="5" />
					<text x="540" y="470" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="36" letterSpacing="3" fill={NAVY}>
						NHS · NOVEMBER 2016
					</text>
					{Array.from({length: 400}, (_, i) => (
						<circle key={i} cx={150 + (i % 25) * 33} cy={520 + Math.floor(i / 25) * 28} r="9" fill={BLUE} opacity={ease(t, 0.2 + i * 0.004, 0.5 + i * 0.004) * (t >= tTest && i === 188 ? 0.2 : 0.8)} />
					))}
					<Pill y={1010} w={700} label="≈ 840,000 INBOXES" color={BLUE} fs={40} o={ease(t, 0.8, 1.2)} />
					{mailO > 0.01 ? (
						<g opacity={mailO}>
							<Envelope x={540} y={1090} s={1.3} color="#FFF3C4" />
							<text x="540" y="1160" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={INK}>
								TEST MESSAGE
							</text>
						</g>
					) : null}
				</g>
			) : null}

			{storm > 0.01 ? (
				<g opacity={storm}>
					<rect x="100" y="400" width="880" height="760" rx="26" fill="#F4F6FB" stroke={INK} strokeWidth="5" />
					{Array.from({length: envCount}, (_, i) => {
						const a = i * 2.399;
						const r = 40 + Math.sqrt(i) * 38;
						const x = 540 + Math.cos(a) * r * 0.95;
						const y = 700 + Math.sin(a) * r * 0.62;
						return <Envelope key={i} x={x} y={y} s={0.55} color={i === 0 ? '#FFF3C4' : '#fff'} o={ease(t, [tRep, tRep, tEvery, tAgain, tWithin][Math.min(4, level)] + (i % 7) * 0.05, [tRep, tRep, tEvery, tAgain, tWithin][Math.min(4, level)] + 0.3 + (i % 7) * 0.05)} />;
					})}
					<Pill y={470} w={640} label={level <= 1 ? 'SOMEONE REPLIED' : level === 2 ? 'REPLY WENT TO EVERYONE' : 'SO SOMEONE REPLIED TO THAT'} color={RED} fs={30} o={1} />
					{countShown > 0 ? (
						<g>
							<text x="540" y="1040" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="120" fill={RED}>
								{countShown},000,000
							</text>
							<text x="540" y="1110" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="3" fill={GRAY}>
								EMAILS · ABOUT 2 HOURS
							</text>
						</g>
					) : null}
				</g>
			) : null}

			{delayO > 0.01 ? (
				<g opacity={delayO}>
					<rect x="100" y="400" width="880" height="760" rx="26" fill="#fff" stroke={INK} strokeWidth="5" />
					<Pill y={470} w={640} label="MAIL DELAYS" color={RED} fs={40} o={1} />
					{[0, 1, 2].map((i) => (
						<g key={i} transform={`translate(${250 + i * 290} 700)`}>
							<rect x="-100" y="-120" width="200" height="240" rx="16" fill="#8A93A6" stroke={INK} strokeWidth="5" />
							{[0, 1, 2].map((k) => (
								<rect key={k} x="-80" y={-100 + k * 70} width="160" height="50" rx="8" fill="#5C6678" />
							))}
							<circle cx="60" cy="-75" r="10" fill={RED} opacity={0.5 + 0.5 * Math.sin(t * (6 - i * 2))} />
							<g transform="translate(0 170)">
								<rect x="-90" y="-16" width="180" height="32" rx="16" fill="#E2E7F1" stroke={INK} strokeWidth="3" />
								<rect x="-90" y="-16" width={180 * ((t * (0.35 - i * 0.1)) % 0.8) * 1.2} height="32" rx="16" fill={GOLD} />
							</g>
						</g>
					))}
					<text x="540" y="1060" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" fill={GRAY}>
						… waiting for the mail server
					</text>
				</g>
			) : null}

			{rmO > 0.01 ? (
				<g opacity={rmO}>
					<rect x="100" y="400" width="880" height="760" rx="26" fill="#fff" stroke={INK} strokeWidth="5" />
					<rect x="100" y="400" width="880" height="80" rx="26" fill={NAVY} />
					<rect x="100" y="450" width="880" height="30" fill={NAVY} />
					<text x="140" y="455" fontFamily={font} fontWeight="900" fontSize="30" letterSpacing="3" fill="#fff">
						NEW MESSAGE
					</text>
					<text x="140" y="560" fontFamily={font} fontWeight="800" fontSize="32" fill={GRAY}>
						TO:
					</text>
					<g opacity={ease(t, tEveryone, tEveryone + 0.3)}>
						<rect x="220" y="520" width="360" height="56" rx="28" fill="#FFE3E3" stroke={RED} strokeWidth="4" />
						<text x="400" y="560" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={RED}>
							EVERYONE
						</text>
					</g>
					<text x="140" y="680" fontFamily={font} fontWeight="900" fontSize="46" fill={INK} opacity={ease(t, tWrote, tWrote + 0.3)}>
						Please remove me
					</text>
					<text x="140" y="745" fontFamily={font} fontWeight="900" fontSize="46" fill={INK} opacity={ease(t, tWrote + 0.4, tWrote + 0.7)}>
						from this list.
					</text>
					<rect x="140" y="1020" width="260" height="80" rx="40" fill={BLUE} />
					<text x="270" y="1072" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" fill="#fff">
						SEND
					</text>
				</g>
			) : null}

			{itO > 0.01 ? (
				<g opacity={itO}>
					<rect x="100" y="400" width="880" height="760" rx="26" fill="#fff" stroke={INK} strokeWidth="5" />
					<rect x="140" y="440" width="800" height="230" rx="18" fill="#E3F6EC" stroke={GREEN} strokeWidth="5" />
					<text x="170" y="500" fontFamily={font} fontWeight="900" fontSize="30" letterSpacing="3" fill={GREEN}>
						IT · CALM MESSAGE
					</text>
					<text x="170" y="580" fontFamily={font} fontWeight="900" fontSize="46" fill={INK} opacity={ease(t, tNoReply, tNoReply + 0.3)}>
						Please do not
					</text>
					<text x="170" y="640" fontFamily={font} fontWeight="900" fontSize="46" fill={INK} opacity={ease(t, tNoReply, tNoReply + 0.3)}>
						reply all.
					</text>
					{[0, 1, 2, 3, 4].map((i) => {
						const at = tSeveral + i * 0.18;
						const o = pop(t, at, 0.25);
						return o > 0 ? (
							<g key={i} transform={`translate(${290 + (i % 2) * 400} ${760 + Math.floor(i / 2) * 120}) scale(${Math.min(o, 1.05)})`}>
								<rect x="-150" y="-40" width="300" height="80" rx="16" fill="#FFE3E3" stroke={RED} strokeWidth="4" />
								<text x="0" y="12" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={RED}>
									RE: RE: REPLY ALL
								</text>
							</g>
						) : null;
					})}
				</g>
			) : null}
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const ReplyAllShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#16213E" vig={0.45}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
