import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, GOLD, GREEN, INK, RED, lerp, pop} from './WatermelonShort';
import {ChannelStamp, Pill, PunchStamp, ease} from './PlanKit';

/*
 * W24 "Conway's law" (visuals/conways-law.md), org chart nahoře, checkout dole.
 * Citát 1967 -> 4 týmy = 4 kroky checkoutu -> tlačítka/formuláře/barvy -> mezera mezi týmy -> reorganizace -> Pay přeskočí na cizí stránku.
 */

const NAVY = '#243A66';
const GRAY = '#7B8498';
const TEAM = [BLUE, GREEN, GOLD, '#8A5CD6'];
const STEPS = ['CART', 'SHIPPING', 'PAYMENT', 'DONE'];
const BX = (i: number) => 200 + i * 226;

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tOrgs = cue(segs, /^Organizations design/);
	const tFour = cue(segs, /^Four teams built/);
	const tSteps = cue(segs, /^So the checkout/);
	const tDiff = cue(segs, /^Each step looks/);
	const tBtn = cue(segs, /^One team owns the buttons/);
	const tForm = cue(segs, /^One owns the forms/);
	const tCol = cue(segs, /^One owns the colors/);
	const tNobody = cue(segs, /^And nobody owns/);
	const tReorg = cue(segs, /^Then the company/);
	const tNewT = cue(segs, /^New teams/);
	const tNewC = cue(segs, /^New org chart/);
	const tPay = cue(segs, /^Next release/);

	const quoteO = pop(t, 0.1, 0.4) * (1 - ease(t, tFour - 0.3, tFour));
	const mainO = ease(t, tFour - 0.1, tFour + 0.3);
	// reorganizace: pořadí boxů se promíchá
	const order = [0, 1, 2, 3];
	const re = ease(t, tNewT, tNewC + 0.5);
	const posOf = (i: number) => lerp(i, [2, 0, 3, 1][i], re);
	const reorged = t >= tReorg;
	const payP = ease(t, tPay, tPay + 0.9);

	return (
		<Svg>
			{quoteO > 0.01 ? (
				<g opacity={Math.min(1, quoteO)}>
					<rect x="100" y="430" width="880" height="620" rx="30" fill="#fff" stroke={INK} strokeWidth="5" />
					<text x="540" y="520" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="40" letterSpacing="4" fill={GRAY}>
						MELVIN CONWAY · 1967
					</text>
					{['ORGANIZATIONS COPY', 'THEIR OWN COMMUNICATION', 'STRUCTURE.'].map((l, i) => (
						<text key={l} x="540" y={680 + i * 90} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="56" fill={i === 2 ? RED : INK} opacity={ease(t, tOrgs + i * 0.9, tOrgs + 0.3 + i * 0.9)}>
							{l}
						</text>
					))}
				</g>
			) : null}

			{mainO > 0.01 ? (
				<g opacity={mainO}>
					{/* org chart */}
					<rect x="100" y="340" width="880" height="380" rx="26" fill="#fff" stroke={INK} strokeWidth="5" />
					<text x="140" y="395" fontFamily={font} fontWeight="900" fontSize="28" letterSpacing="3" fill={NAVY}>
						{reorged ? 'NEW ORG CHART' : 'ORG CHART'}
					</text>
					{[0, 1, 2, 3].map((i) => (
						<line key={i} x1="540" y1="440" x2={BX(posOf(i))} y2="510" stroke={INK} strokeWidth="4" />
					))}
					<rect x="460" y="420" width="160" height="40" rx="10" fill={NAVY} />
					<text x="540" y="449" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="22" fill="#fff">
						CTO
					</text>
					{order.map((i) => {
						const x = BX(posOf(i));
						const o = pop(t, tFour + i * 0.25, 0.3);
						const label = i === 0 ? (t >= tBtn ? 'BUTTONS' : 'TEAM A') : i === 1 ? (t >= tForm ? 'FORMS' : 'TEAM B') : i === 2 ? (t >= tCol ? 'COLORS' : 'TEAM C') : 'TEAM D';
						return (
							<g key={i} opacity={Math.min(1, o)} transform={`translate(${x} 570)`}>
								<rect x="-85" y="-50" width="170" height="100" rx="14" fill={TEAM[i]} stroke={INK} strokeWidth="5" />
								<text x="0" y="12" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={i === 2 ? INK : '#fff'}>
									{label}
								</text>
							</g>
						);
					})}
					{t >= tNobody ? (
						<g opacity={ease(t, tNobody, tNobody + 0.3) * (1 - ease(t, tReorg - 0.2, tReorg))}>
							{[0, 1, 2].map((i) => (
								<g key={i} transform={`translate(${BX(i) + 113} 570)`}>
									<circle r="26" fill={RED} stroke="#fff" strokeWidth="4" />
									<text x="0" y="13" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="38" fill="#fff">
										?
									</text>
								</g>
							))}
						</g>
					) : null}
					<Pill y={680} w={560} label="NOBODY OWNS WHERE THEY MEET" color={RED} fs={26} o={ease(t, tNobody, tNobody + 0.3) * (1 - ease(t, tReorg - 0.2, tReorg))} />

					{/* checkout */}
					<rect x="100" y="760" width="880" height="440" rx="26" fill="#EEF1F8" stroke={INK} strokeWidth="5" />
					<rect x="100" y="760" width="880" height="56" rx="26" fill="#D3D9EA" />
					<rect x="100" y="790" width="880" height="26" fill="#D3D9EA" />
					{[0, 1, 2].map((i) => (
						<circle key={i} cx={140 + i * 30} cy="788" r="9" fill={['#E5484D', '#E0A800', '#2FB67C'][i]} />
					))}
					{STEPS.map((s, i) => {
						const x = 200 + i * 225;
						const o = ease(t, tSteps + i * 0.35, tSteps + 0.3 + i * 0.35);
						const rad = i === 0 ? 4 : i === 1 ? 24 : i === 2 ? 0 : 40;
						const fnt = i === 0 ? font : i === 1 ? 'Georgia, serif' : i === 2 ? "Consolas, 'Courier New', monospace" : "'Segoe Print', 'Comic Sans MS', cursive";
						const isPay = i === 2;
						return (
							<g key={s} opacity={o}>
								<rect x={x - 95} y="850" width="190" height="300" rx={rad} fill={t >= tDiff ? TEAM[i] : '#fff'} opacity={t >= tDiff ? 0.28 : 1} stroke={INK} strokeWidth="4" />
								<rect x={x - 95} y="850" width="190" height="300" rx={rad} fill="none" stroke={TEAM[i]} strokeWidth="6" />
								<text x={x} y="900" textAnchor="middle" fontFamily={fnt} fontWeight="900" fontSize="26" fill={INK}>
									{s}
								</text>
								<rect x={x - 70} y="940" width="140" height="30" rx="6" fill="#fff" stroke={INK} strokeWidth="3" opacity={t >= tForm ? 1 : 0.4} />
								<rect x={x - 70} y="990" width="140" height="30" rx="6" fill="#fff" stroke={INK} strokeWidth="3" opacity={t >= tForm ? 1 : 0.4} />
								{!(isPay && t >= tPay) && i < 3 ? (
									<rect x={x - 60} y="1070" width="120" height="50" rx={i === 1 ? 25 : 6} fill={isPay ? GREEN : TEAM[i]} stroke={INK} strokeWidth="4" />
								) : null}
								{!(isPay && t >= tPay) && i < 3 ? (
									<text x={x} y="1103" textAnchor="middle" fontFamily={fnt} fontWeight="900" fontSize="26" fill="#fff">
										{isPay ? 'PAY' : 'NEXT'}
									</text>
								) : null}
							</g>
						);
					})}
					{/* Pay přeskočí */}
					{t >= tPay ? (
						<g transform={`translate(${lerp(200 + 2 * 225, 200 + 3 * 225, payP)} ${1095 - Math.sin(payP * Math.PI) * 120})`}>
							<rect x="-60" y="-25" width="120" height="50" rx="6" fill={GREEN} stroke={INK} strokeWidth="4" />
							<text x="0" y="8" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="26" fill="#fff">
								PAY
							</text>
						</g>
					) : null}
				</g>
			) : null}
			<Pill y={1240} w={700} label="OTHER TEAM'S PAGE" color={RED} fill="#fff" fs={34} o={ease(t, tPay + 0.8, tPay + 1.1)} />
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const ConwaysLawShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#1A2442" vig={0.4}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
