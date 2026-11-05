import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, Bean, GOLD, GREEN, INK, RED, lerp, pop} from './WatermelonShort';
import {ChannelStamp, Pill, PunchStamp, ease} from './PlanKit';

/*
 * W14 "Love contract" (visuals/love-contract.md), formulář HR.
 * Dvě fazolky + srdce -> dokument "Consensual Relationship Agreement" -> 4 oddíly (checkbox, tiskárna, podání ruky, stupnice 1-5) -> tři kopie do HR.
 */

const PINK = '#E8546F';
const GRAY = '#7B8498';
const DOC = {x: 120, y: 350, w: 840, h: 800};

const Heart: React.FC<{x: number; y: number; s: number; c?: string; o?: number}> = ({x, y, s, c = PINK, o = 1}) => (
	<path
		transform={`translate(${x} ${y}) scale(${s})`}
		d="M 0 22 C -40 -6 -26 -34 -10 -30 C -4 -29 0 -24 0 -20 C 0 -24 4 -29 10 -30 C 26 -34 40 -6 0 22 Z"
		fill={c}
		stroke={INK}
		strokeWidth="2.5"
		opacity={o}
	/>
);

const Row: React.FC<{y: number; n: number; label: string; o: number; children?: React.ReactNode}> = ({y, n, label, o, children}) =>
	o > 0.01 ? (
		<g opacity={Math.min(1, o)} transform={`translate(0 ${y + (1 - Math.min(1, o)) * 16})`}>
			<rect x={DOC.x + 30} y="-50" width={DOC.w - 60} height="104" rx="14" fill="#F6F8FC" stroke={INK} strokeWidth="3" />
			<circle cx={DOC.x + 82} cy="2" r="28" fill={BLUE} />
			<text x={DOC.x + 82} y="14" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" fill="#fff">
				{n}
			</text>
			<text x={DOC.x + 130} y="2" fontFamily={font} fontWeight="900" fontSize="28" letterSpacing="1" fill={INK}>
				{label.split('|')[0]}
			</text>
			<text x={DOC.x + 130} y="38" fontFamily={font} fontWeight="800" fontSize="26" fill={GRAY}>
				{label.split('|')[1]}
			</text>
			{children}
		</g>
	) : null;

const Printer: React.FC<{x: number; y: number}> = ({x, y}) => (
	<g transform={`translate(${x} ${y})`}>
		<rect x="-34" y="-34" width="68" height="22" rx="4" fill="#fff" stroke={INK} strokeWidth="3" />
		<rect x="-48" y="-14" width="96" height="40" rx="8" fill="#9AA3B8" stroke={INK} strokeWidth="4" />
		<rect x="-30" y="12" width="60" height="22" rx="3" fill="#fff" stroke={INK} strokeWidth="3" />
	</g>
);

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tFall = cue(segs, /^employees are falling/);
	const tProtect = cue(segs, /^To protect everyone/);
	const tLaw = cue(segs, /^Law firms call/);
	const tReal = cue(segs, /^It is a real kind/);
	const tS1 = cue(segs, /^Section one/);
	const tS2 = cue(segs, /^Section two/);
	const tS3 = cue(segs, /^Section three/);
	const tS4 = cue(segs, /^Section four/);
	const tAtt = cue(segs, /^rate the strength/);
	const tSubmit = cue(segs, /^Please submit/);
	const tHr = cue(segs, /^HR would like/);

	// úvod: dvě fazolky a srdce
	const introO = 1 - ease(t, tProtect - 0.2, tProtect + 0.3);
	const heartP = ease(t, tFall, tFall + 1.2);
	// dokument
	const docIn = ease(t, tProtect, tProtect + 0.6);
	const subP = ease(t, tSubmit, tSubmit + 0.6);
	const dScale = lerp(1, 0.5, subP);
	const dX = lerp(0, -170, subP);
	const dY = lerp(0, -120, subP);
	const fly = ease(t, tHr - 0.4, tHr + 0.5);

	const tick = ease(t, tS1 + 0.9, tS1 + 1.2);
	const heartStrike = ease(t, tS2 + 1.0, tS2 + 1.3);
	const shake = Math.sin(Math.max(0, t - tS3 - 0.6) * 14) * 8 * ease(t, tS3 + 0.6, tS3 + 0.8) * (1 - ease(t, tS3 + 2.2, tS3 + 2.5));
	const rating = ease(t, tS4 + 0.5, tS4 + 0.9);

	const Document = (
		<g>
			<rect x={DOC.x + 8} y={DOC.y + 14} width={DOC.w} height={DOC.h} rx="22" fill="rgba(0,0,0,0.25)" />
			<rect x={DOC.x} y={DOC.y} width={DOC.w} height={DOC.h} rx="22" fill="#fff" stroke={INK} strokeWidth="5" />
			<rect x={DOC.x} y={DOC.y} width={DOC.w} height="120" rx="22" fill="#243A66" />
			<rect x={DOC.x} y={DOC.y + 90} width={DOC.w} height="30" fill="#243A66" />
			<text x="540" y={DOC.y + 50} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="26" letterSpacing="6" fill="#9FC3E8">
				HUMAN RESOURCES
			</text>
			<text x="540" y={DOC.y + 96} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="1" fill="#fff">
				CONSENSUAL RELATIONSHIP AGREEMENT
			</text>
			<g opacity={ease(t, tProtect + 0.4, tProtect + 0.7) * (1 - ease(t, tS1 - 0.1, tS1 + 0.2))}>
				{['EMPLOYEE A', 'EMPLOYEE B'].map((l, i) => (
					<g key={l} transform={`translate(0 ${DOC.y + 250 + i * 80})`}>
						<text x={DOC.x + 60} y="0" fontFamily={font} fontWeight="900" fontSize="32" letterSpacing="2" fill={INK}>
							{l}
						</text>
						<line x1={DOC.x + 340} y1="2" x2={DOC.x + DOC.w - 60} y2="2" stroke={INK} strokeWidth="4" />
					</g>
				))}
			</g>
			<Pill x={540} y={DOC.y + 470} w={640} label="A REAL KIND OF DOCUMENT" color={GREEN} fs={32} o={ease(t, tReal, tReal + 0.25) * (1 - ease(t, tS1 + 1.0, tS1 + 1.3))} />
			<Heart x={DOC.x + DOC.w - 50} y={DOC.y + 150} s={0.9} o={ease(t, tLaw, tLaw + 0.3)} />
			<text x="540" y={DOC.y + 160} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={PINK} opacity={ease(t, tLaw, tLaw + 0.3)}>
				a.k.a. LOVE CONTRACT
			</text>
			<Row y={DOC.y + 250} n={1} label="VOLUNTARY|both parties confirm" o={ease(t, tS1, tS1 + 0.3)}>
				<rect x={DOC.x + DOC.w - 140} y="-28" width="56" height="56" rx="8" fill="#fff" stroke={INK} strokeWidth="5" />
				{tick > 0 ? <path d="M -14 4 L -2 16 L 18 -12" transform={`translate(${DOC.x + DOC.w - 112} 0)`} fill="none" stroke={GREEN} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset={60 * (1 - tick)} /> : null}
			</Row>
			<Row y={DOC.y + 390} n={2} label="NO PDA|near the printer" o={ease(t, tS2, tS2 + 0.3)}>
				<Printer x={DOC.x + DOC.w - 130} y={0} />
				<Heart x={DOC.x + DOC.w - 130} y={-6} s={0.55 * pop(t, tS2 + 0.5, 0.3)} />
				{heartStrike > 0 ? <line x1={DOC.x + DOC.w - 175} y1={-40 + 80 * 0} x2={DOC.x + DOC.w - 175 + 90 * heartStrike} y2={-40 + 80 * heartStrike} stroke={RED} strokeWidth="9" strokeLinecap="round" /> : null}
			</Row>
			<Row y={DOC.y + 530} n={3} label="IF IT ENDS|remain professional" o={ease(t, tS3, tS3 + 0.3)}>
				<g transform={`translate(${DOC.x + DOC.w - 130} 0)`}>
					<circle cx="-30" cy="-6" r="22" fill="#F2C9A0" stroke={INK} strokeWidth="3" />
					<circle cx="30" cy="-6" r="22" fill="#F2C9A0" stroke={INK} strokeWidth="3" />
					<rect x={-26 + shake} y="-16" width="52" height="20" rx="10" fill={INK} />
					<rect x={-40} y="18" width="30" height="12" rx="6" fill="#6F7A93" />
					<rect x={10} y="18" width="30" height="12" rx="6" fill="#6F7A93" />
				</g>
			</Row>
			<Row y={DOC.y + 670} n={4} label="FEELINGS 1–5|attach documents" o={ease(t, tS4, tS4 + 0.3)}>
				{[1, 2, 3, 4, 5].map((k) => (
					<g key={k} transform={`translate(${DOC.x + DOC.w - 330 + k * 46} 0)`}>
						<circle r="18" fill={rating > 0 && k <= 4 ? PINK : '#fff'} stroke={INK} strokeWidth="3" />
						<text y="9" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="22" fill={rating > 0 && k <= 4 ? '#fff' : INK}>
							{k}
						</text>
					</g>
				))}
				{t >= tAtt ? (
					<g transform={`translate(${DOC.x + DOC.w - 70} -4) rotate(-20)`} opacity={ease(t, tAtt, tAtt + 0.3)}>
						<path d="M 0 -26 C 14 -34 18 -12 12 6 C 6 24 -14 28 -10 6 L -4 -24" fill="none" stroke={GRAY} strokeWidth="5" strokeLinecap="round" />
					</g>
				) : null}
			</Row>
		</g>
	);

	return (
		<Svg>
			{/* úvod */}
			{introO > 0.01 ? (
				<g opacity={introO}>
					<rect x="70" y="330" width="940" height="900" rx="36" fill="#F9E3E8" stroke={INK} strokeWidth="5" />
					<Bean x={330} y={1060} s={1.2} tie={BLUE} />
					<Bean x={750} y={1060} s={1.2} tie={RED} />
					{[0, 1, 2, 3, 4].map((i) => {
						const p = Math.min(1, heartP * 1.6 - i * 0.18);
						if (p <= 0) return null;
						return <Heart key={i} x={540 + Math.sin(t * 2 + i * 1.4) * 70 + (i - 2) * 30} y={870 - p * 330 + (i % 2) * 40} s={(1.2 + (i % 3) * 0.3) * (1 - p * 0.2)} o={1 - Math.max(0, p - 0.7) * 3} />;
					})}
					<Pill y={470} w={760} label="HR HAS NOTICED A TREND" color={PINK} fs={34} o={pop(t, 0.2, 0.3)} />
				</g>
			) : null}

			{/* dokument */}
			{docIn > 0.01 ? (
				<g opacity={Math.min(1, docIn)}>
					<rect x="70" y="330" width="940" height="900" rx="36" fill="#F9E3E8" stroke={INK} strokeWidth="5" opacity={1 - introO} />
					<g transform={`translate(${540 + dX} ${750 + dY + (1 - docIn) * 40}) scale(${dScale}) translate(-540 -750)`}>
						{/* kopie */}
						{[2, 1].map((k) =>
							pop(t, tSubmit + 0.4 + (2 - k) * 0.25, 0.3) > 0 ? (
								<g key={k} transform={`translate(${k * 34} ${k * 34}) `} opacity={1 - fly}>
									<rect x={DOC.x + 8} y={DOC.y + 14} width={DOC.w} height={DOC.h} rx="22" fill="#fff" stroke={INK} strokeWidth="5" />
								</g>
							) : null,
						)}
						<g transform={`translate(${540 + fly * 840} ${750 + fly * 760}) scale(${1 - fly * 0.6}) translate(-540 -750)`}>{Document}</g>
					</g>
					{subP > 0.4 ? (
						<Pill x={420} y={1090} w={400} label="IN TRIPLICATE ×3" color={BLUE} fs={30} o={ease(t, tSubmit + 0.5, tSubmit + 0.8) * (1 - fly)} />
					) : null}
					{/* HR přihrádka */}
					{subP > 0.2 ? (
						<g opacity={ease(t, tSubmit + 0.3, tSubmit + 0.6)} transform="translate(790 1010)">
							<rect x="-150" y="-60" width="300" height="140" rx="16" fill="#243A66" stroke={INK} strokeWidth="5" />
							<rect x="-120" y="-30" width="240" height="14" rx="7" fill="#0F1A33" />
							<text x="0" y="52" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="46" letterSpacing="6" fill="#fff">
								HR
							</text>
						</g>
					) : null}
				</g>
			) : null}
			<PunchStamp t={t} at={tHr + 0.5} lines={['FIRST TO', 'CONGRATULATE']} color={GOLD} y={760} size={78} />
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const LoveContractShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#F2C7D1" vig={0.3}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
