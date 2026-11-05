import React from 'react';
import type {Segment, ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, Bean, GOLD, GREEN, INK, RED, lerp, pop} from './WatermelonShort';
import {ChannelStamp, PunchStamp, ease} from './PlanKit';

/*
 * W06 "Abilene paradox" (visuals/abilene-paradox.md).
 * Coleman 104 °F -> veranda se 4 fazolkami -> mapa 53 mil -> bubliny "..." -> "sounds great" -> auto cestou zpět
 * -> "I never wanted to go" -> Harvey 1974 -> pozvánka na offsite pátek 16:55 -> auto s běžícím motorem.
 */

const PANEL = {x: 70, y: 330, w: 940, h: 900};
const GROUND = 1110;
const BX = [190, 390, 590, 790];
const TIES = [BLUE, GOLD, GREEN, RED];
const NAMES = ['DAVE', 'BRAD', 'CEO', 'INTERN'];
const CAR = '#D96C4A';

const Check: React.FC<{x: number; y: number; color: string; o?: number}> = ({x, y, color, o = 1}) => (
	<path
		d="M -14 0 L -4 11 L 16 -12"
		transform={`translate(${x} ${y})`}
		fill="none"
		stroke={color}
		strokeWidth="8"
		strokeLinecap="round"
		strokeLinejoin="round"
		opacity={o}
	/>
);

const Bubble: React.FC<{x: number; y: number; w: number; label: string; color?: string; o?: number; dashed?: boolean; fs?: number; s?: number}> = ({
	x,
	y,
	w,
	label,
	color = INK,
	o = 1,
	dashed,
	fs = 28,
	s = 1,
}) =>
	o > 0 ? (
		<g opacity={o} transform={`translate(${x} ${y}) scale(${s})`}>
			<rect x={-w / 2} y="-38" width={w} height="76" rx="38" fill="#fff" stroke={color} strokeWidth="6" strokeDasharray={dashed ? '12 9' : undefined} />
			<text x="0" y={fs * 0.36} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize={fs} fill={color}>
				{label}
			</text>
		</g>
	) : null;

const Arrow: React.FC<{x1: number; x2: number; y: number; o: number}> = ({x1, x2, y, o}) => {
	const d = Math.sign(x2 - x1);
	return (
		<g opacity={o}>
			<line x1={x1} y1={y} x2={x2 - d * 10} y2={y} stroke={INK} strokeWidth="5" strokeLinecap="round" />
			<polygon points={`${x2},${y} ${x2 - d * 18},${y - 10} ${x2 - d * 18},${y + 10}`} fill={INK} />
		</g>
	);
};

const Thermometer: React.FC<{x: number; y: number; s: number; temp: number}> = ({x, y, s, temp}) => {
	const h = 360 * ((temp - 60) / 50);
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			<rect x="-24" y="-190" width="48" height="380" rx="24" fill="#fff" stroke={INK} strokeWidth="6" />
			<rect x="-12" y={180 - h} width="24" height={h + 14} rx="12" fill={RED} />
			<circle cx="0" cy="214" r="46" fill={RED} stroke={INK} strokeWidth="6" />
			{[0, 1, 2, 3, 4].map((i) => (
				<line key={i} x1="30" y1={-150 + i * 80} x2="54" y2={-150 + i * 80} stroke={INK} strokeWidth="4" />
			))}
			<text x="0" y="-236" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="64" fill={RED}>
				{Math.round(temp)}°F
			</text>
		</g>
	);
};

const Car: React.FC<{x: number; y: number; s: number; t: number; look?: number; sweat?: number; speed?: number}> = ({x, y, s, t, look = 0, sweat = 0, speed = 1}) => {
	const bounce = Math.sin(t * 22 * speed) * 2.2 * speed;
	const wins = [-148, -73, 2, 77];
	return (
		<g transform={`translate(${x} ${y + bounce}) scale(${s})`}>
			<ellipse cx="0" cy="8" rx="230" ry="14" fill="rgba(27,31,42,0.18)" />
			<rect x="-160" y="-176" width="320" height="94" rx="34" fill={CAR} stroke={INK} strokeWidth="6" />
			{wins.map((wx, i) => (
				<g key={i}>
					<rect x={wx} y="-162" width="62" height="64" rx="10" fill="#CFE8F5" stroke={INK} strokeWidth="4" />
					<circle cx={wx + 31} cy="-118" r="24" fill="#F2C9A0" stroke={INK} strokeWidth="3" />
					<circle cx={wx + 22 - look * 4} cy="-122" r="3.5" fill={INK} />
					<circle cx={wx + 40 - look * 4} cy="-122" r="3.5" fill={INK} />
					<line x1={wx + 20} y1="-106" x2={wx + 42} y2="-106" stroke={INK} strokeWidth="3" strokeLinecap="round" />
					{sweat > 0 ? (
						<path
							d={`M ${wx + 58} ${-150 + ((t * 40 + i * 17) % 40) * 0.5} q -6 10 0 14 q 6 -4 0 -14`}
							fill="#7FC8F8"
							opacity={sweat}
						/>
					) : null}
				</g>
			))}
			<rect x="-210" y="-98" width="420" height="70" rx="24" fill={CAR} stroke={INK} strokeWidth="6" />
			<circle cx="196" cy="-72" r="9" fill="#FFE27A" stroke={INK} strokeWidth="3" />
			<rect x="-214" y="-60" width="24" height="12" rx="4" fill={RED} />
			{[-125, 125].map((wx) => (
				<g key={wx}>
					<circle cx={wx} cy="-30" r="38" fill={INK} />
					<circle cx={wx} cy="-30" r="16" fill="#C7CEDD" />
				</g>
			))}
		</g>
	);
};

const Scene: React.FC<{t: number; segs: Segment[]; total: number}> = ({t, segs, total}) => {
	const tFam = cue(segs, /^A family sits/);
	const tLet = cue(segs, /^let's drive/);
	const tFifty = cue(segs, /^Fifty-three/);
	const tRound = cue(segs, /^A hundred and six/);
	const tNobody = cue(segs, /^Nobody wants to go\.$/);
	const tBut = cue(segs, /^But everyone thinks/);
	const tSo = cue(segs, /^So everyone says/);
	const tGreat = cue(segs, /^sounds great/);
	const tBack = cue(segs, /^They come back/);
	const tNever = cue(segs, /^I never wanted/);
	const tNeither = cue(segs, /^Neither did/);
	const tHarvey = cue(segs, /^Management professor/);
	const tGroup = cue(segs, /^a group does something/);
	const tOff = cue(segs, /^Which is why/);
	const tAbil = cue(segs, /^Nobody wants to go to Abilene/);
	const tCar = cue(segs, /^Everyone is already/);

	// ---- veranda -----------------------------------------------------------------------------------
	const porchO = 1 - ease(t, tBack - 0.3, tBack);
	const temp = lerp(72, 104, ease(t, 0.3, 3.6));
	const thermMove = ease(t, tFam - 0.2, tFam + 0.5);
	const thermO = (1 - ease(t, tLet - 0.3, tLet)) * porchO;
	const pillO = 1 - ease(t, tLet - 0.3, tLet);

	// ---- mapa ----------------------------------------------------------------------------------------
	const mapO = ease(t, tLet - 0.1, tLet + 0.3) * (1 - ease(t, tNobody - 0.4, tNobody - 0.1));
	const fwd = ease(t, tFifty, tFifty + 0.9);
	const bck = ease(t, tRound, tRound + 1.0);
	const speech = ease(t, tLet, tLet + 0.25) * (1 - ease(t, tNobody - 0.4, tNobody - 0.1));

	// ---- bubliny na verandě --------------------------------------------------------------------
	const dots = ease(t, tNobody, tNobody + 0.25);
	const thinkO = ease(t, tBut, tBut + 0.25);
	const sayO = ease(t, tSo, tSo + 0.25);
	const bubLabel = t >= tGreat - 0.05 ? 'SOUNDS GREAT' : t >= tBut ? 'THEY WANT IT' : '...';
	const bubColor = t >= tGreat - 0.05 ? GREEN : INK;
	const bubO = Math.max(dots, 0) * porchO;

	// ---- auto ---------------------------------------------------------------------------------------------------
	const car1O = ease(t, tBack - 0.1, tBack + 0.2) * (1 - ease(t, tHarvey - 0.4, tHarvey - 0.1));
	const car1X = lerp(-320, 480, ease(t, tBack - 0.1, tBack + 1.6));
	const car2O = ease(t, tAbil - 0.2, tAbil + 0.2);
	const car2X = lerp(900, 440, ease(t, tAbil - 0.2, tAbil + 0.7));
	const carO = Math.max(car1O, car2O);
	const carX = car2O > 0.01 ? car2X : car1X;
	const driving = car2O > 0.01 ? 0.25 : t < tBack + 1.6 ? 1 : 0.5;
	const never = pop(t, tNever, 0.35);
	const neither = (i: number) => pop(t, tNeither + i * 0.18, 0.3);
	const bubFade = 1 - ease(t, tHarvey - 0.5, tHarvey - 0.2);

	// ---- Harvey ----------------------------------------------------------------------------------------------------
	const docO = ease(t, tHarvey - 0.1, tHarvey + 0.35) * (1 - ease(t, tOff - 0.3, tOff));
	const row = (k: number) => ease(t, tGroup + k * 0.55, tGroup + k * 0.55 + 0.3);

	// ---- pozvánka ----------------------------------------------------------------------------------------------
	const calO = ease(t, tOff - 0.1, tOff + 0.3) * (1 - ease(t, tAbil - 0.3, tAbil));
	const acc = (i: number) => ease(t, tOff + 1.4 + i * 0.4, tOff + 1.7 + i * 0.4);

	const dustAct = carO > 0.05 ? 1 : 0;
	const dust = Array.from({length: 5}, (_, i) => {
		const ph = (((t * 0.8 + i * 0.2) % 1) + 1) % 1;
		return (
			<circle
				key={i}
				cx={carX - 250 - ph * 170}
				cy={GROUND - 20 - ph * 50}
				r={14 + ph * 34}
				fill="#D9C5A0"
				opacity={0.6 * (1 - ph) * carO * dustAct * Math.min(1, driving + 0.2)}
			/>
		);
	});

	return (
		<Svg>
			<defs>
				<clipPath id="pclip">
					<rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx="36" />
				</clipPath>
			</defs>
			<rect x={PANEL.x + 8} y={PANEL.y + 14} width={PANEL.w} height={PANEL.h} rx="36" fill="rgba(27,31,42,0.12)" />
			<rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx="36" fill="#FCE6BF" stroke={INK} strokeWidth="5" />
			<g clipPath="url(#pclip)">
				<circle cx="190" cy="560" r={78 + 4 * Math.sin(t * 3)} fill="#FFB703" opacity="0.9" />
				<circle cx="190" cy="560" r={110 + 6 * Math.sin(t * 3)} fill="none" stroke="#FFB703" strokeWidth="6" opacity="0.4" />
				<rect x={PANEL.x} y={GROUND - 10} width={PANEL.w} height="130" fill="#E9B87C" />
				<line x1={PANEL.x} y1={GROUND - 10} x2={PANEL.x + PANEL.w} y2={GROUND - 10} stroke="#C99456" strokeWidth="5" />

				{/* veranda a rodina */}
				<g opacity={porchO}>
					<rect x="90" y="655" width="22" height="455" fill="#8A5C34" />
					<rect x="968" y="655" width="22" height="455" fill="#8A5C34" />
					<rect x="70" y="630" width="940" height="38" fill="#B07A4A" stroke={INK} strokeWidth="5" />
					<rect x="70" y={GROUND - 10} width="940" height="26" fill="#B07A4A" />
					{BX.map((x, i) => {
						const p = pop(t, tFam + i * 0.18, 0.3);
						return p > 0 ? <Bean key={i} x={x} y={GROUND} s={0.85 * Math.min(p, 1.05)} tie={TIES[i]} /> : null;
					})}
				</g>

				{/* teploměr */}
				<g opacity={thermO}>
					<Thermometer x={lerp(540, 930, thermMove)} y={lerp(820, 860, thermMove)} s={lerp(1.05, 0.62, thermMove)} temp={temp} />
				</g>

				{/* bubliny na verandě */}
				{bubO > 0
					? BX.map((x, i) => (
							<g key={i}>
								<Bubble
									x={x}
									y={840}
									w={180}
									label={bubLabel}
									color={bubColor}
									o={bubO}
									dashed={t < tBut}
									fs={bubLabel === '...' ? 40 : bubLabel === 'SOUNDS GREAT' ? 20 : 21}
									s={t >= tGreat ? 1 + 0.06 * Math.sin((t - tGreat) * 8) : 1}
								/>
							</g>
						))
					: null}
				{BX.slice(0, 3).map((x, i) => (
					<g key={i}>
						<Arrow x1={x + 62} x2={x + 138} y={950} o={thinkO * porchO * (1 - sayO)} />
						<Arrow x1={x + 138} x2={x + 62} y={992} o={thinkO * porchO * (1 - sayO)} />
					</g>
				))}
				{speech > 0 ? <Bubble x={420} y={840} w={540} label="LET'S DRIVE TO ABILENE!" o={speech} fs={34} /> : null}

				{/* mapa */}
				{mapO > 0 ? (
					<g opacity={mapO}>
						<rect x="130" y="520" width="820" height="290" rx="28" fill="#FFFDF6" stroke={INK} strokeWidth="6" />
						<line x1="230" y1="660" x2="850" y2="660" stroke="#C7CEDD" strokeWidth="14" strokeLinecap="round" />
						<line x1="230" y1="660" x2={lerp(230, 850, fwd)} y2="660" stroke={BLUE} strokeWidth="14" strokeLinecap="round" />
						{bck > 0 ? (
							<path d={`M 850 695 Q 540 745 ${lerp(850, 230, bck)} 695`} fill="none" stroke={RED} strokeWidth="10" strokeLinecap="round" strokeDasharray="1 22" />
						) : null}
						<circle cx="230" cy="660" r="20" fill="#fff" stroke={INK} strokeWidth="6" />
						<circle cx="850" cy="660" r="20" fill={RED} stroke={INK} strokeWidth="6" />
						<text x="230" y="625" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={INK}>
							COLEMAN
						</text>
						<text x="850" y="625" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={INK}>
							ABILENE
						</text>
						{fwd > 0.5 ? (
							<text x="540" y="590" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="54" fill={BLUE} opacity={ease(t, tFifty + 0.4, tFifty + 0.7)}>
								53 MILES
							</text>
						) : null}
						{bck > 0.4 ? (
							<text x="540" y="790" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="44" fill={RED} opacity={ease(t, tRound + 0.4, tRound + 0.8)}>
								ROUND TRIP: 106
							</text>
						) : null}
					</g>
				) : null}

				{/* auto */}
				{carO > 0.01 ? (
					<g opacity={carO}>
						{dust}
						<Car x={carX} y={GROUND} s={1.12} t={t} speed={driving} sweat={t < tHarvey ? 1 : 0} look={t >= tNever ? 1 : 0} />
						{never > 0 ? (
							<g opacity={bubFade}>
								<Bubble x={540} y={850} w={600} label="I NEVER WANTED TO GO" color={RED} s={Math.min(never, 1.05)} fs={36} />
								{[0, 1, 2].map((i) => (
									<Bubble key={i} x={225 + i * 315} y={720} w={290} label="NEITHER DID I" color={INK} s={Math.min(neither(i), 1.05)} o={neither(i) > 0 ? 1 : 0} fs={30} />
								))}
							</g>
						) : null}
						{car2O > 0.5 ? (
							<g transform={`translate(880 ${GROUND - 10})`}>
								<rect x="-8" y="-210" width="16" height="210" fill="#8A5C34" />
								<rect x="-100" y="-290" width="200" height="130" rx="14" fill="#2F7D4F" stroke={INK} strokeWidth="5" />
								<text x="0" y="-238" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" fill="#fff">
									ABILENE
								</text>
								<text x="0" y="-186" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="46" fill="#fff">
									53 MI
								</text>
							</g>
						) : null}
					</g>
				) : null}

				{/* Harvey 1974 */}
				{docO > 0 ? (
					<g opacity={docO} transform={`translate(0 ${(1 - docO) * 40})`}>
						<rect x="150" y="530" width="780" height="670" rx="16" fill="#FFFDF6" stroke={INK} strokeWidth="6" />
						<text x="540" y="625" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="64" letterSpacing="3" fill={INK}>
							THE ABILENE
						</text>
						<text x="540" y="700" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="64" letterSpacing="3" fill={INK}>
							PARADOX
						</text>
						<line x1="230" y1="730" x2="850" y2="730" stroke={INK} strokeWidth="4" />
						<text x="540" y="775" textAnchor="middle" fontFamily={font} fontWeight="700" fontSize="30" fill={INK} opacity="0.75">
							JERRY B. HARVEY · 1974
						</text>
						{[
							['WANTS TO GO', '0 / 4', INK],
							['SAYS NO', '0 / 4', INK],
							['DECISION', 'UNANIMOUS', GREEN],
						].map(([a, b, c], i) => (
							<g key={a} opacity={row(i)} transform={`translate(0 ${(1 - row(i)) * 20})`}>
								<rect x="210" y={830 + i * 105} width="660" height="84" rx="14" fill="#F4F1EA" stroke={INK} strokeWidth="4" />
								<text x="240" y={886 + i * 105} fontFamily={font} fontWeight="900" fontSize="34" fill={INK}>
									{a}
								</text>
								<text x="840" y={886 + i * 105} textAnchor="end" fontFamily={font} fontWeight="900" fontSize="38" fill={c}>
									{b}
								</text>
							</g>
						))}
					</g>
				) : null}

				{/* pozvánka */}
				{calO > 0 ? (
					<g opacity={calO} transform={`translate(0 ${(1 - calO) * 30})`}>
						<rect x="130" y="530" width="820" height="670" rx="24" fill="#fff" stroke={INK} strokeWidth="6" />
						<path d="M 130 620 V 554 A 24 24 0 0 1 154 530 H 926 A 24 24 0 0 1 950 554 V 620 Z" fill={RED} />
						<text x="180" y="598" fontFamily={font} fontWeight="900" fontSize="44" letterSpacing="4" fill="#fff">
							FRIDAY
						</text>
						<text x="900" y="600" textAnchor="end" fontFamily={font} fontWeight="900" fontSize="64" fill="#fff">
							16:55
						</text>
						<text x="540" y="725" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="80" letterSpacing="3" fill={INK}>
							TEAM OFFSITE
						</text>
						<text x="540" y="780" textAnchor="middle" fontFamily={font} fontWeight="700" fontSize="32" fill={INK} opacity="0.65">
							Where: Abilene
						</text>
						{NAMES.map((n, i) => (
							<g key={n}>
								<rect x="190" y={820 + i * 84} width="700" height="68" rx="12" fill="#F4F1EA" stroke={INK} strokeWidth="3" />
								<text x="220" y={865 + i * 84} fontFamily={font} fontWeight="900" fontSize="34" fill={INK}>
									{n}
								</text>
								<text x="800" y={864 + i * 84} textAnchor="end" fontFamily={font} fontWeight="900" fontSize="26" fill={GREEN} opacity={acc(i)}>
									ACCEPTED
								</text>
								<Check x={846} y={855 + i * 84} color={GREEN} o={acc(i)} />
							</g>
						))}
					</g>
				) : null}
			</g>

			{/* štítek místa */}
			<g opacity={pillO} transform="translate(540 400)">
				<rect x="-290" y="-36" width="580" height="72" rx="36" fill="#fff" stroke={INK} strokeWidth="5" />
				<text x="0" y="13" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="38" letterSpacing="3" fill={INK}>
					COLEMAN, TX · 104°F
				</text>
			</g>

			<PunchStamp t={t} at={tCar} lines={['ENGINE: RUNNING']} color={RED} y={720} size={72} />
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const AbileneParadoxShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#F6E3C0" vig={0.22}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
