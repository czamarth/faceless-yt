import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, GOLD, GREEN, INK, RED, lerp, pop} from './WatermelonShort';
import {ChannelStamp, Pill, PunchStamp, ease} from './PlanKit';

/*
 * W13 "Fire ticket" (visuals/fire-ticket.md), ticketovací systém + okno s hořící budovou.
 * Karta tiketu INC-1042 -> komentáře naskakují, oheň roste -> SLA 5d -> 9 dní, budova zmizela -> Resolved + dotazník spokojenosti.
 */

const MONO = "Consolas, 'Courier New', monospace";
const WIN = {x: 100, y: 350, w: 880, h: 380};
const CARD = {x: 100, y: 760, w: 880, h: 470};
const GRAY = '#7B8498';

const Flame: React.FC<{x: number; y: number; s: number; t: number; ph: number}> = ({x, y, s, t, ph}) => {
	const k = 1 + 0.18 * Math.sin(t * 9 + ph);
	return (
		<g transform={`translate(${x} ${y}) scale(${s} ${s * k})`}>
			<path d="M 0 0 C -34 -26 -18 -62 0 -120 C 18 -62 34 -26 0 0 Z" fill="#FF6A1A" />
			<path d="M 0 0 C -18 -16 -8 -40 0 -70 C 8 -40 18 -16 0 0 Z" fill="#FFD23F" />
		</g>
	);
};

const Cloud: React.FC<{x: number; y: number; r: number; o: number}> = ({x, y, r, o}) => (
	<g opacity={o} fill="#5C6272">
		<circle cx={x} cy={y} r={r} />
		<circle cx={x + r * 0.9} cy={y + r * 0.2} r={r * 0.8} />
		<circle cx={x - r * 0.9} cy={y + r * 0.3} r={r * 0.7} />
	</g>
);

const COMMENTS: [string, string, RegExp][] = [
	['FACILITIES', 'More details? Which building?', /^please provide more/],
	['REPORTER', 'This one. Please hurry.', /^Comment from reporter/],
	['FACILITIES', 'SLA for medium: 5 business days.', /^the S-L-A/],
	['SECURITY', 'Can we get a screenshot?', /^can we get/],
	['FINANCE', 'Is this in the budget?', /^is this in/],
];
const WHO = {FACILITIES: BLUE, REPORTER: GOLD, SECURITY: '#8A5CD6', FINANCE: GREEN};

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tTitle = cue(segs, /^building on fire/);
	const tAssign = cue(segs, /^assigned to/);
	const tSla = cue(segs, /^the S-L-A/);
	const tNine = cue(segs, /^Nine days/);
	const tRes = cue(segs, /^resolved/);
	const tGone = cue(segs, /^Building no longer/);
	const tClosed = cue(segs, /^Ticket closed/);
	const tSurvey = cue(segs, /^A satisfaction/);
	const tRate = cue(segs, /^Please rate/);
	const cTimes = COMMENTS.map(([, , re]) => cue(segs, re));

	const cardO = pop(t, 0.05, 0.4);
	const level = [tTitle, ...cTimes].filter((c) => t >= c + 0.2).length; // 0..6
	const collapse = ease(t, tNine + 0.3, tNine + 1.6);
	const buildH = 300 * (1 - collapse);
	const fireK = Math.min(1.9, 0.5 + level * 0.3) * (1 - ease(t, tNine + 0.2, tNine + 1.0));
	const smokeO = ease(t, tTitle, tTitle + 1.5) * 0.9;
	const darkness = Math.min(0.55, level * 0.1);
	const slaO = ease(t, tSla, tSla + 0.3);
	const days = t < tNine ? 5 : 9;
	const surveyO = ease(t, tSurvey - 0.3, tSurvey + 0.2);
	const listO = 1 - surveyO;
	const stars = [0, 1, 2, 3, 4].map((i) => pop(t, tRate + 0.1 + i * 0.12, 0.25));

	return (
		<Svg>
			<defs>
				<clipPath id="wclip">
					<rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} rx="26" />
				</clipPath>
			</defs>
			{/* okno s budovou */}
			<rect x={WIN.x + 8} y={WIN.y + 14} width={WIN.w} height={WIN.h} rx="26" fill="rgba(0,0,0,0.3)" />
			<rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} rx="26" fill="#9FC3E8" />
			<g clipPath="url(#wclip)">
				<rect x={WIN.x} y={WIN.y + 300} width={WIN.w} height="80" fill="#6E7E5C" />
				{/* budova */}
				<g transform={`translate(0 ${WIN.y + 330})`}>
					<g transform={`scale(1 ${Math.max(0.001, 1 - collapse)})`}>
						<rect x="360" y="-300" width="360" height="300" fill="#8A93A6" stroke={INK} strokeWidth="5" />
						{[0, 1, 2, 3].map((r) =>
							[0, 1, 2].map((c) => (
								<rect key={`${r}${c}`} x={395 + c * 105} y={-275 + r * 70} width="62" height="44" fill={level > 0 ? '#FFB347' : '#DCE6F5'} stroke={INK} strokeWidth="3" />
							)),
						)}
						{[0, 1, 2, 3, 4].map((i) => {
							const fx = 395 + (i % 3) * 105 + 31;
							const fy = -275 + Math.floor(i / 3 + (i % 2)) * 70 + 44;
							const vis = fireK * (i < level + 1 ? 1 : 0);
							return vis > 0.02 ? <Flame key={i} x={fx} y={fy} s={vis * 0.9} t={t} ph={i * 1.7} /> : null;
						})}
						{level >= 3 && fireK > 0.05 ? <Flame x={540} y={-300} s={fireK * 1.1} t={t} ph={5} /> : null}
					</g>
				</g>
				{t >= tNine + 1.0 ? <rect x="360" y={WIN.y + 322} width="360" height="14" fill="#4A4F5C" opacity={ease(t, tNine + 1.0, tNine + 1.4)} /> : null}
				<Cloud x={540} y={WIN.y + 130} r={50} o={smokeO * (1 - 0.5 * collapse)} />
				<Cloud x={600} y={WIN.y + 80 - 20 * Math.sin(t * 1.5)} r={60} o={smokeO * Math.min(1, level * 0.25)} />
				<rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} fill="#1B0F08" opacity={darkness * (1 - collapse)} />
			</g>
			<rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} rx="26" fill="none" stroke={INK} strokeWidth="6" />
			<Pill x={235} y={405} w={250} label={`SLA: ${days} DAYS`} color={days === 9 ? RED : GRAY} fill="#fff" fs={27} o={slaO} />
			{t >= tNine ? <Pill x={845} y={405} w={220} label="DAY +9" color={RED} fill="#fff" fs={30} o={ease(t, tNine, tNine + 0.25)} /> : null}

			{/* karta tiketu */}
			<g opacity={Math.min(1, cardO)}>
				<rect x={CARD.x + 8} y={CARD.y + 14} width={CARD.w} height={CARD.h} rx="26" fill="rgba(0,0,0,0.3)" />
				<rect x={CARD.x} y={CARD.y} width={CARD.w} height={CARD.h} rx="26" fill="#fff" stroke={INK} strokeWidth="5" />
				<path d={`M ${CARD.x} ${CARD.y + 78} V ${CARD.y + 26} A 26 26 0 0 1 ${CARD.x + 26} ${CARD.y} H ${CARD.x + CARD.w - 26} A 26 26 0 0 1 ${CARD.x + CARD.w} ${CARD.y + 26} V ${CARD.y + 78} Z`} fill="#243A66" />
				<text x="130" y={CARD.y + 54} fontFamily={MONO} fontWeight="700" fontSize="38" fill="#fff">
					INC-1042
				</text>
				<rect x="440" y={CARD.y + 22} width="200" height="40" rx="20" fill={GOLD} />
				<text x="540" y={CARD.y + 51} textAnchor="middle" fontFamily={MONO} fontWeight="700" fontSize="26" fill={INK}>
					MEDIUM
				</text>
				{t >= tTitle - 0.2 ? (
					<g opacity={ease(t, tTitle - 0.2, tTitle + 0.2)}>
						<text x="130" y={CARD.y + 130} fontFamily={MONO} fontWeight="700" fontSize="40" fill={INK}>
							BUILDING ON FIRE
						</text>
					</g>
				) : null}
				<g opacity={pop(t, tAssign, 0.3) > 0 ? Math.min(1, pop(t, tAssign, 0.3)) : 0}>
					<rect x="690" y={CARD.y + 22} width="260" height="40" rx="20" fill={BLUE} />
					<text x="820" y={CARD.y + 51} textAnchor="middle" fontFamily={MONO} fontWeight="700" fontSize="24" fill="#fff">
						→ FACILITIES
					</text>
				</g>
				{/* komentáře */}
				<g opacity={listO}>
					{COMMENTS.map(([who, txt], i) => {
						const o = pop(t, cTimes[i], 0.25);
						if (o <= 0) return null;
						return (
							<g key={i} opacity={Math.min(1, o)} transform={`translate(0 ${CARD.y + 165 + i * 58 + (1 - Math.min(1, o)) * 14})`}>
								<circle cx="146" cy="0" r="16" fill={WHO[who as keyof typeof WHO]} />
								<text x="176" y="9" fontFamily={MONO} fontWeight="700" fontSize="24" fill={INK}>
									<tspan fill={GRAY}>{who}: </tspan>
									{txt}
								</text>
							</g>
						);
					})}
				</g>
				{/* dotazník */}
				{surveyO > 0.01 ? (
					<g opacity={surveyO}>
						<text x="540" y={CARD.y + 195} textAnchor="middle" fontFamily={MONO} fontWeight="700" fontSize="34" fill={INK}>
							SATISFACTION SURVEY
						</text>
						<text x="540" y={CARD.y + 250} textAnchor="middle" fontFamily={MONO} fontWeight="700" fontSize="30" fill={GRAY}>
							Rate your experience
						</text>
						{stars.map((s, i) => (
							<polygon
								key={i}
								transform={`translate(${290 + i * 125} ${CARD.y + 355}) scale(${Math.min(s, 1.1) * 1.7})`}
								points="0,-30 9,-10 30,-9 14,5 19,27 0,15 -19,27 -14,5 -30,-9 -9,-10"
								fill={s > 0.1 ? GOLD : '#E4E7EE'}
								stroke={INK}
								strokeWidth="3"
							/>
						))}
					</g>
				) : null}
			</g>
			{t < tSurvey - 0.3 ? <PunchStamp t={t} at={tRes} lines={['RESOLVED:', 'BUILDING GONE']} color={GREEN} y={1000} size={62} rot={-6} /> : null}
			<ChannelStamp t={t} total={total} y={1300} />
		</Svg>
	);
};

export const FireTicketShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#2B3550" vig={0.4}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
