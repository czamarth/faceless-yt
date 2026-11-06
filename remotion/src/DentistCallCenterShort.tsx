import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, GOLD, GREEN, INK, RED, pop} from './WatermelonShort';
import {ChannelStamp, Pill, PunchStamp, ease} from './PlanKit';

/*
 * W36 "Dentist as call center" (visuals/dentist-call-center.md), telefon s IVR.
 * Zlatý zub -> press 1/2/3 -> graf bolesti -> fronta zubů #412 -> app -> REC (čelist) -> odhad čekání 6-8 pracovních dní.
 */

const NAVY = '#243A66';
const GRAY = '#7B8498';

const Tooth: React.FC<{x: number; y: number; s?: number; fill?: string; stroke?: string}> = ({x, y, s = 1, fill = '#fff', stroke = INK}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<path d="M -50 -40 Q -52 -80 -20 -80 Q 0 -70 20 -80 Q 52 -80 50 -40 Q 50 0 36 20 Q 30 70 18 70 Q 8 70 4 20 Q 0 14 -4 20 Q -8 70 -18 70 Q -30 70 -36 20 Q -50 0 -50 -40 Z" fill={fill} stroke={stroke} strokeWidth="6" strokeLinejoin="round" />
	</g>
);

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tImp = cue(segs, /^Your root canal is/);
	const tOne = cue(segs, /^To schedule/);
	const tTwo = cue(segs, /^To reschedule/);
	const tThree = cue(segs, /^To report/);
	const tPain = cue(segs, /^Due to high volume/);
	const tQueue = cue(segs, /^Your tooth is currently/);
	const tApp = cue(segs, /^Did you know/);
	const tDl = cue(segs, /^Just download/);
	const tRec = cue(segs, /^For quality/);
	const tJaw = cue(segs, /^So may your jaw/);
	const tStay = cue(segs, /^Please stay/);
	const tOrder = cue(segs, /^Your call will be/);
	const tWait = cue(segs, /^Your estimated/);

	const keyHit = (k: number) => (k === 1 ? t >= tOne && t < tTwo : k === 2 ? t >= tTwo && t < tThree : k === 3 ? t >= tThree && t < tPain : false);
	const toothO = pop(t, 0.2, 0.4) * (1 - ease(t, tOne - 0.3, tOne));
	const menuO = ease(t, tOne - 0.1, tOne + 0.3) * (1 - ease(t, tPain - 0.3, tPain));
	const painO = ease(t, tPain, tPain + 0.3) * (1 - ease(t, tQueue - 0.3, tQueue));
	const queueO = ease(t, tQueue, tQueue + 0.3) * (1 - ease(t, tApp - 0.3, tApp));
	const appO = ease(t, tApp, tApp + 0.3) * (1 - ease(t, tRec - 0.3, tRec));
	const recO = ease(t, tRec, tRec + 0.3) * (1 - ease(t, tStay - 0.3, tStay));
	const waitO = ease(t, tStay, tStay + 0.3);

	return (
		<Svg>
			{/* displej */}
			<rect x="110" y="350" width="860" height="480" rx="26" fill="#0F1A2E" stroke={INK} strokeWidth="6" />
			<text x="150" y="400" fontFamily={font} fontWeight="900" fontSize="26" letterSpacing="4" fill="#7FE0FF">
				DENTAL CARE · CALL CENTER
			</text>

			{toothO > 0.01 ? (
				<g opacity={Math.min(1, toothO)}>
					<circle cx="540" cy="620" r="170" fill={GOLD} opacity="0.5" />
					<Tooth x={540} y={620} s={1.7} />
					<text x="540" y="810" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill="#fff" opacity={ease(t, tImp, tImp + 0.3)}>
						YOUR ROOT CANAL IS VERY IMPORTANT
					</text>
				</g>
			) : null}

			{menuO > 0.01 ? (
				<g opacity={menuO}>
					{[
						['1', 'SCHEDULE A ROOT CANAL', tOne],
						['2', 'RESCHEDULE YOUR ROOT CANAL', tTwo],
						['3', 'REPORT A NEW TOOTH', tThree],
					].map(([k, label, at], i) => (
						<g key={k as string} opacity={ease(t, at as number, (at as number) + 0.25)} transform={`translate(0 ${i * 120})`}>
							<rect x="150" y="440" width="780" height="96" rx="16" fill={keyHit(i + 1) ? '#1E4A66' : '#1B2A44'} stroke={keyHit(i + 1) ? '#7FE0FF' : '#33466F'} strokeWidth="4" />
							<circle cx="215" cy="488" r="34" fill="#7FE0FF" />
							<text x="215" y="502" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="40" fill={NAVY}>
								{k}
							</text>
							<text x="275" y="500" fontFamily={font} fontWeight="900" fontSize="28" fill="#fff">
								{label as string}
							</text>
						</g>
					))}
				</g>
			) : null}

			{painO > 0.01 ? (
				<g opacity={painO}>
					<text x="540" y="470" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" letterSpacing="3" fill="#fff">
						PAIN LEVEL
					</text>
					{[40, 70, 110, 160, 220, 290].map((h, i) => (
						<rect key={i} x={190 + i * 110} y={790 - h * ease(t, tPain + 0.2 + i * 0.25, tPain + 0.6 + i * 0.25)} width="80" height={h * ease(t, tPain + 0.2 + i * 0.25, tPain + 0.6 + i * 0.25)} rx="8" fill={i > 3 ? RED : GOLD} />
					))}
					<text x="540" y="425" textAnchor="middle" fontFamily={font} fontWeight="800" fontSize="24" fill="#9AA3B8">
						PRIORITIZED BY SEVERITY
					</text>
				</g>
			) : null}

			{queueO > 0.01 ? (
				<g opacity={queueO}>
					{Array.from({length: 12}, (_, i) => {
						const x = 190 + (i % 6) * 120;
						const y = 560 + Math.floor(i / 6) * 120;
						const you = i === 8;
						return (
							<g key={i} opacity={ease(t, tQueue + i * 0.07, tQueue + 0.3 + i * 0.07)}>
								<Tooth x={x} y={y} s={0.48} fill={you ? GOLD : '#E8EEF8'} />
							</g>
						);
					})}
					<text x="540" y="810" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="44" fill="#fff" opacity={ease(t, tQueue + 0.8, tQueue + 1.1)}>
						QUEUE POSITION: #412
					</text>
				</g>
			) : null}

			{appO > 0.01 ? (
				<g opacity={appO}>
					<text x="540" y="470" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill="#fff">
						MANAGE YOUR TOOTH ONLINE
					</text>
					<rect x="440" y="520" width="200" height="200" rx="44" fill={BLUE} stroke="#fff" strokeWidth="6" />
					<Tooth x={540} y={625} s={0.9} />
					<g opacity={ease(t, tDl, tDl + 0.3)}>
						<rect x="340" y="750" width="400" height="60" rx="30" fill={GREEN} />
						<text x="540" y="792" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill="#fff">
							DOWNLOAD OUR APP
						</text>
					</g>
				</g>
			) : null}

			{recO > 0.01 ? (
				<g opacity={recO}>
					<circle cx="190" cy="460" r="16" fill={RED} opacity={0.5 + 0.5 * Math.sin(t * 8)} />
					<text x="225" y="472" fontFamily={font} fontWeight="900" fontSize="32" letterSpacing="3" fill={RED}>
						REC · CALL RECORDED
					</text>
					<g opacity={ease(t, tJaw, tJaw + 0.3)} transform="translate(540 640)">
						<path d="M -150 -40 Q -150 120 0 130 Q 150 120 150 -40" fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" />
						{[-90, -45, 0, 45, 90].map((x) => (
							<rect key={x} x={x - 16} y={x === 0 ? 70 : 62 - Math.abs(x) * 0.2} width="32" height="40" rx="8" fill="#fff" />
						))}
						<circle cx="190" cy="-60" r="16" fill={RED} opacity={0.5 + 0.5 * Math.sin(t * 8)} />
					</g>
				</g>
			) : null}

			{waitO > 0.01 ? (
				<g opacity={waitO}>
					<text x="540" y="480" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" letterSpacing="3" fill="#9AA3B8">
						PLEASE STAY ON THE LINE
					</text>
					{[0, 1, 2].map((i) => (
						<text key={i} x={400 + i * 140} y={620 + Math.sin(t * 3 + i) * 14} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="80" fill={GOLD}>
							♪
						</text>
					))}
					<text x="540" y="730" textAnchor="middle" fontFamily={font} fontWeight="800" fontSize="28" fill="#fff" opacity={ease(t, tOrder, tOrder + 0.3)}>
						answered in the order received
					</text>
				</g>
			) : null}

			{/* klávesnice */}
			{Array.from({length: 12}, (_, i) => {
				const label = i < 9 ? String(i + 1) : i === 9 ? '*' : i === 10 ? '0' : '#';
				const x = 250 + (i % 3) * 290;
				const y = 910 + Math.floor(i / 3) * 90;
				const hit = (i === 0 && keyHit(1)) || (i === 1 && keyHit(2)) || (i === 2 && keyHit(3));
				return (
					<g key={i}>
						<rect x={x - 120} y={y - 36} width="240" height="72" rx="36" fill={hit ? GOLD : '#E8EEF8'} stroke={INK} strokeWidth="4" />
						<text x={x} y={y + 14} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="44" fill={INK}>
							{label}
						</text>
					</g>
				);
			})}
			<PunchStamp t={t} at={tWait + 0.4} lines={['WAIT: 6–8', 'BUSINESS DAYS']} color={RED} y={640} size={78} />
			<ChannelStamp t={t} total={total} y={1320} />
		</Svg>
	);
};

export const DentistCallCenterShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#C6D3EA" vig={0.3}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
