import React from 'react';
import type {Segment, ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, Bean, GOLD, GREEN, INK, RED, cueAt, lerp, pop} from './WatermelonShort';
import {ChannelStamp, ease} from './PlanKit';

/*
 * W05 "Holiday party" (visuals/holiday-party.md), přírodopisný dokument "PLANET OFFICE".
 * Kóje -> fazolky ve společenském -> CEO a "Q4" -> bufet (40 min vs 4 s) -> hodiny 8:00 / 8:15 -> CEO a karaoke.
 */

const PANEL = {x: 70, y: 330, w: 940, h: 900};
const CROWD = [170, 350, 730, 910];
const TIES = [BLUE, GREEN, RED, BLUE];
const DRESS = ['#B03060', '#7A4FC4', '#1F8F8A', '#D97706'];
const GROUND = 1130;

const SantaHat: React.FC = () => (
	<g transform="translate(0 -206)">
		<path d="M -46 -2 Q -34 -82 30 -94 Q 36 -56 46 -2 Z" fill={RED} stroke={INK} strokeWidth="3" />
		<rect x="-54" y="-14" width="108" height="20" rx="10" fill="#fff" stroke={INK} strokeWidth="3" />
		<circle cx="30" cy="-96" r="13" fill="#fff" stroke={INK} strokeWidth="3" />
	</g>
);

const PBean: React.FC<{
	x: number;
	y: number;
	s?: number;
	tie: string;
	santa?: boolean;
	dress?: string;
	outfit?: number;
	elbow?: number;
	o?: number;
	hat?: 'bowler' | 'cap';
}> = ({x, y, s = 1, tie, santa = true, dress = '#B03060', outfit = 0, elbow = 0, o = 1, hat}) => (
	<g opacity={o} transform={`translate(${x} ${y}) scale(${s})`}>
		<Bean x={0} y={0} tie={tie} hat={hat} />
		{outfit > 0 ? (
			<g opacity={outfit}>
				<rect x="-48" y="-125" width="96" height="125" rx="44" fill={dress} />
				<polygon points="-48,-100 -48,-72 48,-34 48,-62" fill={GOLD} opacity="0.9" />
				{[
					[-26, -100],
					[14, -86],
					[-8, -52],
					[28, -26],
					[-30, -18],
				].map(([cx, cy], i) => (
					<circle key={i} cx={cx} cy={cy} r="4.5" fill="#FFF3B0" />
				))}
			</g>
		) : null}
		{elbow > 0
			? [-1, 1].map((k) => (
					<g key={k} transform={`translate(${k * 58} -64) scale(${Math.min(elbow, 1.1)})`}>
						<circle r="17" fill="none" stroke={RED} strokeWidth="5" opacity="0.8" />
						<circle r="10" fill="#F2C9A0" stroke={INK} strokeWidth="3" />
					</g>
				))
			: null}
		{santa ? <SantaHat /> : null}
	</g>
);

const Chip: React.FC<{x?: number; y: number; w: number; label: string; color?: string; fill?: string; o?: number; fs?: number}> = ({
	x = 540,
	y,
	w,
	label,
	color = INK,
	fill = '#fff',
	o = 1,
	fs = 36,
}) =>
	o > 0 ? (
		<g opacity={o} transform={`translate(${x} ${y})`}>
			<rect x={-w / 2} y="-36" width={w} height="72" rx="36" fill={fill} stroke={color} strokeWidth="5" />
			<text x="0" y={fs * 0.36} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize={fs} letterSpacing="3" fill={color}>
				{label}
			</text>
		</g>
	) : null;

const Cubicle: React.FC<{x: number; y: number; o: number}> = ({x, y, o}) => (
	<g opacity={o} transform={`translate(${x} ${y})`}>
		<rect x="-92" y="-190" width="184" height="190" rx="10" fill="#E3D2AE" stroke={INK} strokeWidth="5" />
		<rect x="-92" y="-190" width="14" height="190" fill="#C9B589" />
		<rect x="78" y="-190" width="14" height="190" fill="#C9B589" />
		<rect x="-60" y="-168" width="62" height="40" rx="4" fill="#fff" stroke={INK} strokeWidth="4" />
	</g>
);

const Mic: React.FC<{x: number; y: number; rot?: number}> = ({x, y, rot = 0}) => (
	<g transform={`translate(${x} ${y}) rotate(${rot})`}>
		<rect x="-5" y="0" width="10" height="46" rx="5" fill={INK} />
		<circle cx="0" cy="-8" r="16" fill="#9aa3b8" stroke={INK} strokeWidth="4" />
	</g>
);

const Scene: React.FC<{t: number; segs: Segment[]; total: number}> = ({t, segs, total}) => {
	const tClothes = cueAt(segs, /^Employees emerge/, 0.5);
	const tElbow = cue(segs, /^They have not seen/);
	const tLeader = cue(segs, /^At the center/);
	const tExperts = cue(segs, /^Experts believe/);
	const tActually = cue(segs, /^It is actually/);
	const tBuffet = cue(segs, /^By the buffet/);
	const tFour = cue(segs, /^He will get four/);
	const tThin = cue(segs, /^By eight o'clock/);
	const tFifteen = cue(segs, /^By eight fifteen/);
	const tKaraoke = cueAt(segs, /^the CEO, and the karaoke/, 0.5);

	const crowdO = 1 - ease(t, tBuffet - 0.3, tBuffet);
	const bufO = ease(t, tBuffet - 0.1, tBuffet + 0.3) * (1 - ease(t, tThin - 0.3, tThin));
	const thinO = ease(t, tThin - 0.1, tThin + 0.3);

	// ---- 1) kóje a fazolky ve společenském --------------------------------------------------------
	const cubO = (1 - ease(t, tLeader - 0.3, tLeader + 0.2) * 0.75) * crowdO;
	const crowd = CROWD.map((cx, i) => {
		const born = pop(t, 0.3 + i * 0.12, 0.3);
		if (born <= 0) return null;
		const e = ease(t, 0.9 + i * 0.5, 2.5 + i * 0.5);
		const hop = e > 0 && e < 1 ? Math.abs(Math.sin(e * Math.PI * 3)) * 14 : 0;
		const y = lerp(870, GROUND, e) - hop;
		const outfit = ease(t, tClothes + i * 0.12, tClothes + i * 0.12 + 0.35);
		const elbow = pop(t, tElbow + 0.2 + i * 0.15, 0.3);
		return (
			<PBean
				key={i}
				x={cx}
				y={y}
				s={0.8 * Math.min(born, 1.05)}
				tie={TIES[i]}
				dress={DRESS[i]}
				outfit={outfit}
				elbow={elbow}
				o={crowdO}
			/>
		);
	});

	// ---- 2) CEO, projev, tokeny Q4 --------------------------------------------------------------------
	const ceoS = pop(t, tLeader, 0.4);
	const qActive = ease(t, tLeader + 0.3, tLeader + 0.7) * crowdO;
	const tokens = Array.from({length: 10}, (_, i) => {
		const ph = (((t - tLeader) * 0.9 + i * 0.1) % 1 + 1) % 1;
		const tx = CROWD[i % 4];
		const x = lerp(540, tx, ph);
		const y = lerp(930, 985, ph) - Math.sin(ph * Math.PI) * 130;
		const a = Math.sin(ph * Math.PI) * qActive;
		return a > 0.02 ? (
			<text key={i} x={x} y={y} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="46" fill={RED} opacity={a}>
				Q4
			</text>
		) : null;
	});
	const expO = ease(t, tExperts, tExperts + 0.25) * (1 - ease(t, tActually - 0.05, tActually + 0.1));
	const actO = ease(t, tActually, tActually + 0.25);

	// ---- 3) bufet ---------------------------------------------------------------------------------------
	const waitMin = Math.round(40 * ease(t, tBuffet + 0.3, tFour - 0.3));
	const vipX = lerp(1250, -260, ease(t, tFour + 0.15, tFour + 1.1));
	const hiO = ease(t, tFour + 0.3, tFour + 0.6) * (1 - ease(t, tThin - 0.6, tThin - 0.3));

	// ---- 4) hodiny a odchody -----------------------------------------------------------------------------------
	const mAngle = lerp(0, 90, ease(t, tFifteen - 0.1, tFifteen + 0.5));
	const hAngle = lerp(240, 247.5, ease(t, tFifteen - 0.1, tFifteen + 0.5));
	const quarter = t >= tFifteen + 0.2;
	const leaveOrder = [0, 6, 1, 5, 2, 4];
	const row = Array.from({length: 7}, (_, i) => {
		const x0 = 150 + i * 130;
		if (i === 3) return null;
		const j = leaveOrder.indexOf(i);
		const st = tThin + 0.4 + j * ((tFifteen - tThin - 0.8) / 6);
		const e = ease(t, st, st + 0.6);
		const dir = i < 3 ? -1 : 1;
		return (
			<PBean
				key={i}
				x={x0 + dir * 170 * e}
				y={GROUND}
				s={0.7}
				tie={TIES[i % 4]}
				dress={DRESS[i % 4]}
				outfit={1}
				o={(1 - e) * thinO}
			/>
		);
	});
	const ceoFinal = ease(t, tFifteen, tFifteen + 0.7);
	const ceoX = lerp(540, 400, ceoFinal);
	const ceoS2 = lerp(0.8, 1.35, ceoFinal);
	const machineS = pop(t, tKaraoke, 0.4);
	const spot = ease(t, tFifteen + 0.2, tFifteen + 0.8);

	return (
		<Svg>
			<defs>
				<clipPath id="pclip">
					<rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx="36" />
				</clipPath>
				<linearGradient id="spotg" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#FFF3B0" stopOpacity="0.85" />
					<stop offset="1" stopColor="#FFF3B0" stopOpacity="0.05" />
				</linearGradient>
			</defs>
			<rect x={PANEL.x + 8} y={PANEL.y + 14} width={PANEL.w} height={PANEL.h} rx="36" fill="rgba(27,31,42,0.12)" />
			<rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx="36" fill="#FFF6E5" stroke={INK} strokeWidth="5" />
			<g clipPath="url(#pclip)">
				<rect x={PANEL.x} y={GROUND - 10} width={PANEL.w} height="120" fill="#EAD6AE" />
				<line x1={PANEL.x} y1={GROUND - 10} x2={PANEL.x + PANEL.w} y2={GROUND - 10} stroke="#C9B589" strokeWidth="5" />

				{/* kóje a davy */}
				{CROWD.map((cx, i) => (
					<Cubicle key={i} x={cx} y={880} o={cubO} />
				))}
				{crowd}

				{/* CEO u mikrofonu */}
				{ceoS > 0 ? (
					<g opacity={crowdO}>
						<PBean x={540} y={GROUND} s={1.5 * Math.min(ceoS, 1.05)} tie={GOLD} santa dress="#8A1538" outfit={1} />
						<rect x="470" y="1030" width="140" height="100" rx="10" fill="#B07A4A" stroke={INK} strokeWidth="5" />
						<Mic x={540} y={985} />
					</g>
				) : null}
				{tokens}
				{expO > 0 ? (
					<g opacity={expO * crowdO} transform="translate(540 585)">
						<rect x="-330" y="-55" width="660" height="110" rx="55" fill="#fff" stroke={INK} strokeWidth="5" strokeDasharray="14 10" />
						<text x="0" y="14" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="42" fill={INK}>
							A CALL TO THE GROUP?
						</text>
					</g>
				) : null}
				{actO > 0 ? (
					<g opacity={actO * crowdO} transform={`translate(540 585) scale(${0.9 + 0.1 * actO})`}>
						<rect x="-330" y="-55" width="660" height="110" rx="55" fill="#fff" stroke={RED} strokeWidth="8" />
						<text x="0" y="16" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="46" fill={RED}>
							Q4 TARGETS
						</text>
					</g>
				) : null}

				{/* bufet */}
				{bufO > 0 ? (
					<g opacity={bufO}>
						<rect x="470" y="1040" width="500" height="40" rx="8" fill="#B07A4A" stroke={INK} strokeWidth="5" />
						<rect x="500" y="1080" width="24" height="50" fill="#8A5C34" />
						<rect x="920" y="1080" width="24" height="50" fill="#8A5C34" />
						{[
							[540, '#E5484D'],
							[620, '#F2B84B'],
							[700, '#2FB67C'],
							[780, '#E5484D'],
							[860, '#F2B84B'],
						].map(([cx, c], i) => (
							<g key={i}>
								<ellipse cx={cx as number} cy="1032" rx="34" ry="10" fill="#fff" stroke={INK} strokeWidth="3" />
								<ellipse cx={cx as number} cy="1022" rx="22" ry="14" fill={c as string} />
							</g>
						))}
						<g transform="translate(720 770)">
							<rect x="-110" y="-34" width="220" height="68" rx="12" fill="#fff" stroke={INK} strokeWidth="5" />
							<text x="0" y="14" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="40" letterSpacing="4" fill={INK}>
								BUFFET
							</text>
						</g>
						{/* ti, na kterých záleží */}
						<PBean x={640} y={GROUND} s={0.95} tie={GOLD} />
						<PBean x={830} y={GROUND} s={0.95} tie={GOLD} dress="#8A1538" outfit={1} />
						<PBean x={230} y={GROUND} s={0.9} tie={BLUE} santa={false} hat="cap" />
						{hiO > 0 ? (
							<g opacity={hiO} transform="translate(300 830)">
								<rect x="-90" y="-38" width="180" height="76" rx="38" fill="#fff" stroke={INK} strokeWidth="5" />
								<text x="0" y="14" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="40" fill={INK}>
									Hi! I'm—
								</text>
							</g>
						) : null}
						{vipX < 1200 ? <PBean x={vipX} y={GROUND} s={1.15} tie={GOLD} dress="#1F8F8A" outfit={1} /> : null}
					</g>
				) : null}

				{/* hodiny 8:00 / 8:15 */}
				{thinO > 0 ? (
					<g opacity={thinO}>
						<g transform="translate(540 610)">
							<circle r="104" fill="#fff" stroke={INK} strokeWidth="8" />
							{Array.from({length: 12}, (_, i) => (
								<line key={i} x1="0" y1="-90" x2="0" y2={i % 3 === 0 ? -72 : -80} stroke={INK} strokeWidth={i % 3 === 0 ? 6 : 3} transform={`rotate(${i * 30})`} />
							))}
							<line x1="0" y1="0" x2="0" y2="-48" stroke={INK} strokeWidth="9" strokeLinecap="round" transform={`rotate(${hAngle})`} />
							<line x1="0" y1="0" x2="0" y2="-76" stroke={RED} strokeWidth="6" strokeLinecap="round" transform={`rotate(${mAngle})`} />
							<circle r="8" fill={INK} />
						</g>
						<Chip x={810} y={610} w={200} label={quarter ? '8:15' : '8:00'} fs={50} color={quarter ? RED : INK} />
						{row}
						{/* CEO zůstává */}
						<g>
							{spot > 0 ? (
								<polygon points={`${ceoX - 60},520 ${ceoX + 60},520 ${ceoX + 200},${GROUND} ${ceoX - 200},${GROUND}`} fill="url(#spotg)" opacity={spot} />
							) : null}
							<PBean x={ceoX} y={GROUND} s={ceoS2} tie={GOLD} dress="#8A1538" outfit={1} />
							{ceoFinal > 0.5 ? <Mic x={ceoX + 82 * ceoS2 * 0.8} y={GROUND - 100 * ceoS2} rot={20} /> : null}
						</g>
						{/* karaoke */}
						{machineS > 0 ? (
							<g transform={`translate(740 ${GROUND}) scale(${Math.min(machineS, 1.05)})`}>
								<rect x="-110" y="-290" width="220" height="290" rx="22" fill="#2B2F3F" stroke={INK} strokeWidth="6" />
								<rect x="-84" y="-262" width="168" height="110" rx="10" fill="#7FE0FF" />
								<text x="0" y="-215" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={INK}>
									♪ SOLO ♪
								</text>
								<text x="0" y="-178" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="24" fill={INK} opacity="0.7">
									SONG 1 OF 1
								</text>
								<circle cx="-56" cy="-90" r="32" fill="#1B1F2A" stroke="#6F7A93" strokeWidth="5" />
								<circle cx="56" cy="-90" r="32" fill="#1B1F2A" stroke="#6F7A93" strokeWidth="5" />
								<text x="0" y="-14" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" letterSpacing="4" fill="#FFD84D">
									KARAOKE
								</text>
								{[0, 1, 2].map((k) => {
									const ph = (((t - tKaraoke) * 0.7 + k / 3) % 1 + 1) % 1;
									return (
										<text key={k} x={-20 + k * 46} y={-300 - ph * 120} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="46" fill={RED} opacity={Math.sin(ph * Math.PI)}>
											♪
										</text>
									);
								})}
							</g>
						) : null}
					</g>
				) : null}
			</g>

			{/* titulek dokumentu */}
			<g transform="translate(540 392)">
				<rect x="-240" y="-30" width="480" height="60" rx="30" fill={INK} />
				<circle cx="-205" cy="0" r="8" fill={RED} opacity={0.5 + 0.5 * Math.sin(t * 5)} />
				<text x="10" y="11" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="32" letterSpacing="6" fill="#FFF6E5">
					PLANET OFFICE
				</text>
			</g>

			{/* štítky */}
			<Chip y={485} w={560} label="ELBOWS: VISIBLE" color={RED} o={ease(t, tElbow, tElbow + 0.25) * (1 - ease(t, tLeader - 0.3, tLeader))} fs={38} />
			<Chip
				y={485}
				w={t >= tFour ? 480 : 520}
				label={t >= tFour ? 'AUDIENCE: 4 SEC' : `WAITING: ${waitMin} MIN`}
				color={t >= tFour ? RED : INK}
				o={bufO}
				fs={38}
			/>
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const HolidayPartyShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#F1DFC0" vig={0.25}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
