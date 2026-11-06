import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, GOLD, GREEN, INK, RED, pop} from './WatermelonShort';
import {ChannelStamp, Pill, PunchStamp, ease} from './PlanKit';

/*
 * W35 "Out-of-office loop" (visuals/out-of-office-loop.md), sled e-mailů.
 * Tři automatické odpovědi (Dana, Chris, "osoba, která mě kontaktovala") -> šipky uzavřou smyčku -> "1 new message".
 */

const NAVY = '#243A66';
const GRAY = '#7B8498';
const CARD_Y = [360, 650, 940];
const CARD_H = 250;

const Card: React.FC<{y: number; o: number; body: [string, string]; urgent: string; who: string; color: string}> = ({y, o, body, urgent, who, color}) =>
	o > 0.01 ? (
		<g opacity={Math.min(1, o)} transform={`translate(0 ${(1 - Math.min(1, o)) * 30})`}>
			<rect x="100" y={y} width="780" height={CARD_H} rx="22" fill="#fff" stroke={INK} strokeWidth="5" />
			<rect x="100" y={y} width="780" height="56" rx="22" fill={NAVY} />
			<rect x="100" y={y + 30} width="780" height="26" fill={NAVY} />
			<text x="130" y={y + 40} fontFamily={font} fontWeight="900" fontSize="26" letterSpacing="3" fill="#fff">
				SUBJECT: AUTOMATIC REPLY
			</text>
			<text x="130" y={y + 105} fontFamily={font} fontWeight="800" fontSize="28" fill={INK}>
				{body[0]}
			</text>
			<text x="130" y={y + 148} fontFamily={font} fontWeight="800" fontSize="28" fill={INK}>
				{body[1]}
			</text>
			<rect x="130" y={y + 178} width="720" height="56" rx="28" fill="#FFF3C4" stroke={color} strokeWidth="4" />
			<text x="150" y={y + 216} fontFamily={font} fontWeight="900" fontSize="28" fill={INK}>
				{urgent}
			</text>
			<text x="830" y={y + 216} textAnchor="end" fontFamily={font} fontWeight="900" fontSize={who.length > 12 ? 22 : 30} fill={color}>
				{who}
			</text>
		</g>
	) : null;

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const t1 = cue(segs, /^Automatic reply/);
	const tDana = cue(segs, /^For urgent matters, please contact my colleague Dana/);
	const t2 = 12.37;
	const tChris = cue(segs, /^For urgent matters, please contact my colleague Chris/);
	const tThird = cue(segs, /^Thank you for your email/);
	const tOut = cue(segs, /^I am out of the office\./);
	const tLast = cue(segs, /^For urgent matters, please contact the person/);
	const starts = segs.filter((s) => /^Subject/.test(s.text)).map((s) => s.start);
	const s1 = starts[0] ?? 0;
	const s2 = starts[1] ?? 11.76;
	const s3 = starts[2] ?? 21.95;

	const loopP = ease(t, tLast, tLast + 1.6);
	const hl = (at: number) => ease(t, at, at + 0.3);

	return (
		<Svg>
			<Card y={CARD_Y[0]} o={pop(t, s1 + 0.1, 0.4)} body={['Thank you for your email. I am out', 'of the office until the twelfth.']} urgent="CONTACT:" who="DANA" color={BLUE} />
			<Card y={CARD_Y[1]} o={pop(t, s2 + 0.1, 0.4)} body={['Thank you for your email. I am', 'also out until the twelfth.']} urgent="CONTACT:" who="CHRIS" color={GREEN} />
			<Card y={CARD_Y[2]} o={pop(t, s3 + 0.1, 0.4)} body={['Thank you for your email.', 'I am out of the office.']} urgent="CONTACT:" who="THE PERSON WHO CONTACTED ME" color={RED} />
			{/* šipky smyčky */}
			<g fill="none" stroke={RED} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" opacity={0.9}>
				{t >= tChris - 0.5 ? <path d="M 890 505 Q 960 570 890 680" opacity={ease(t, tChris - 0.5, tChris)} /> : null}
				{t >= tLast - 0.5 ? <path d="M 890 795 Q 960 860 890 970" opacity={ease(t, tLast - 0.5, tLast)} /> : null}
				{loopP > 0 ? <path d="M 890 1100 Q 1040 1100 1040 800 Q 1040 500 890 460" opacity={loopP} strokeDasharray="1200" strokeDashoffset={1200 * (1 - loopP)} /> : null}
			</g>
			{loopP > 0.6 ? <polygon points="890,460 925,470 905,500" fill={RED} opacity={ease(t, tLast + 1.0, tLast + 1.4)} /> : null}
			<g opacity={ease(t, tLast + 1.6, tLast + 2.0)} transform="translate(540 1290)">
				<rect x="-190" y="-34" width="380" height="68" rx="34" fill={RED} />
				<text x="0" y="12" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="2" fill="#fff">
					● 1 NEW MESSAGE
				</text>
			</g>
			<ChannelStamp t={t} total={total - 0.4} y={1340} />
		</Svg>
	);
};

export const OutOfOfficeLoopShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#1F2E55" vig={0.4}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
