import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {Bean, GOLD, INK, RED, BLUE, lerp, pop} from './WatermelonShort';
import {ChannelStamp, Pill, PunchStamp, ease} from './PlanKit';

/*
 * W11 "Circle back" (visuals/circle-back.md), radar letiště.
 * Bublina z hovoru -> radar, letadlo kruží nad dráhou -> palivoměr bez emergency -> PROPOSAL, březen + dvě reorganizace -> pořád ve vzduchu.
 */

const PANEL = {x: 70, y: 330, w: 940, h: 900};
const BG = '#0C2A1F';
const G = '#3DDC84';
const GD = '#1F7A4A';
const CX = 540;
const CY = 790;

const Plane: React.FC<{x: number; y: number; rot: number; tag?: string; tagO?: number}> = ({x, y, rot, tag, tagO = 0}) => (
	<g transform={`translate(${x} ${y})`}>
		<g transform={`rotate(${rot})`}>
			<path d="M 0 -34 L 9 -8 L 40 10 L 40 20 L 9 12 L 6 30 L 18 38 L 18 44 L 0 40 L -18 44 L -18 38 L -6 30 L -9 12 L -40 20 L -40 10 L -9 -8 Z" fill="#fff" stroke={G} strokeWidth="4" />
		</g>
		{tag && tagO > 0.01 ? (
			<g opacity={tagO} transform="translate(0 -70)">
				<rect x="-96" y="-26" width="192" height="52" rx="10" fill={G} />
				<text x="0" y="10" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" letterSpacing="2" fill={BG}>
					{tag}
				</text>
			</g>
		) : null}
	</g>
);

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tPicture = cue(segs, /^Now picture/);
	const tCannot = cue(segs, /^A plane cannot/);
	const tBusy = cue(segs, /^The runway is busy/);
	const tPilots = cue(segs, /^Pilots call/);
	const tFuel = cue(segs, /^Every circle burns/);
	const tRule = cue(segs, /^when the fuel/);
	const tProp = cue(segs, /^Proposals have no/);
	const tMarch = cue(segs, /^Yours reached/);
	const tSince = cue(segs, /^It has been circling/);
	const tReorg = cue(segs, /^It has seen two/);
	const tAngry = cue(segs, /^Nobody is angry/);
	const tAligned = cue(segs, /^Everybody is very/);
	const tAir = cue(segs, /^It is just that/);
	const tNext = cue(segs, /^And next quarter/);
	const tInt = cue(segs, /^interesting/);

	const bubbleO = (1 - ease(t, tPicture - 0.2, tPicture + 0.1)) * pop(t, 0.1, 0.4);
	const radarO = ease(t, tPicture, tPicture + 0.5);
	const sweep = (t * 90) % 360;
	const ang = (t - tCannot) * 1.0 - 1.2;
	const R = 215;
	const px = CX + R * Math.cos(ang);
	const py = CY + R * Math.sin(ang) * 0.95;
	const heading = (ang * 180) / Math.PI + 90 + 90;
	const planeO = ease(t, tCannot, tCannot + 0.3);

	const fuel = t < tFuel ? 1 : Math.max(0.06, 1 - (t - tFuel) * 0.055);
	const fuelO = ease(t, tFuel, tFuel + 0.3);
	const emergO = ease(t, tRule, tRule + 0.25);
	const noEmerg = ease(t, tProp, tProp + 0.3);

	const months = ['MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT'];
	const mi = t < tSince ? 0 : Math.min(7, Math.floor((t - tSince) / 0.45));
	const calO = ease(t, tMarch, tMarch + 0.25);
	const reorg1 = pop(t, tReorg + 0.5, 0.3);
	const reorg2 = pop(t, tReorg + 1.6, 0.3);

	return (
		<Svg>
			<defs>
				<clipPath id="pclip">
					<rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx="36" />
				</clipPath>
			</defs>
			<rect x={PANEL.x + 8} y={PANEL.y + 14} width={PANEL.w} height={PANEL.h} rx="36" fill="rgba(0,0,0,0.35)" />
			<rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx="36" fill={BG} stroke={INK} strokeWidth="5" />
			<g clipPath="url(#pclip)">
				{/* bublina z hovoru */}
				{bubbleO > 0.01 ? (
					<g opacity={Math.min(1, bubbleO)} transform={`translate(540 ${Math.min(1, bubbleO) * 0 + 640}) scale(${Math.min(bubbleO, 1.05)})`}>
						<rect x="-380" y="-150" width="760" height="230" rx="46" fill="#fff" stroke={INK} strokeWidth="6" />
						<path d="M -100 80 L -150 150 L -30 80 Z" fill="#fff" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
						<rect x="-96" y="76" width="92" height="12" fill="#fff" />
						<text x="0" y="-50" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="64" fill={INK}>
							LET'S CIRCLE
						</text>
						<text x="0" y="40" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="64" fill={INK}>
							BACK ON THAT
						</text>
						<g transform="translate(250 -90) rotate(18)">
							<rect x="-22" y="-40" width="44" height="80" rx="9" fill={INK} />
							<rect x="-16" y="-30" width="32" height="50" rx="3" fill="#7FE0FF" />
						</g>
					</g>
				) : null}
				{bubbleO > 0.01 ? <Bean x={290} y={1120} s={0.9} tie={BLUE} /> : null}

				{/* radar */}
				{radarO > 0.01 ? (
					<g opacity={radarO}>
						{[330, 250, 170, 90].map((r) => (
							<circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke={GD} strokeWidth="3" />
						))}
						<line x1={CX - 330} y1={CY} x2={CX + 330} y2={CY} stroke={GD} strokeWidth="2" />
						<line x1={CX} y1={CY - 330} x2={CX} y2={CY + 330} stroke={GD} strokeWidth="2" />
						<path d={`M ${CX} ${CY} L ${CX + 330} ${CY} A 330 330 0 0 0 ${CX + 330 * Math.cos(-0.7)} ${CY + 330 * Math.sin(-0.7)} Z`} fill={G} opacity="0.2" transform={`rotate(${sweep} ${CX} ${CY})`} />
						<line x1={CX} y1={CY} x2={CX + 330} y2={CY} stroke={G} strokeWidth="5" transform={`rotate(${sweep} ${CX} ${CY})`} />
						{/* dráha */}
						<g>
							<rect x={CX - 170} y="1040" width="340" height="44" rx="6" fill="#2A2F3A" stroke={G} strokeWidth="3" />
							{[0, 1, 2, 3, 4, 5].map((i) => (
								<rect key={i} x={CX - 150 + i * 52} y="1060" width="30" height="5" fill="#fff" />
							))}
							<text x={CX} y="1030" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="28" letterSpacing="3" fill={G}>
								RUNWAY
							</text>
							{ease(t, tBusy, tBusy + 0.2) > 0 ? (
								<g opacity={ease(t, tBusy, tBusy + 0.2)}>
									<rect x={CX - 100} y="1100" width="200" height="52" rx="10" fill={RED} />
									<text x={CX} y="1136" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="32" letterSpacing="4" fill="#fff">
										BUSY
									</text>
								</g>
							) : null}
						</g>
						{planeO > 0.01 ? (
							<g opacity={planeO}>
								<ellipse cx={CX} cy={CY} rx={R} ry={R * 0.95} fill="none" stroke={G} strokeWidth="3" strokeDasharray="10 12" opacity="0.6" />
								<Plane x={px} y={py} rot={heading} tag="PROPOSAL" tagO={ease(t, tMarch - 0.1, tMarch + 0.2)} />
							</g>
						) : null}
						<Pill x={CX} y={CY} w={440} label="HOLDING PATTERN" color={G} fill={BG} textColor={G} fs={30} o={ease(t, tPilots, tPilots + 0.25) * (1 - ease(t, tFuel - 0.1, tFuel + 0.1))} />
					</g>
				) : null}

				{/* palivoměr */}
				{fuelO > 0.01 ? (
					<g opacity={fuelO}>
						<text x="120" y="408" fontFamily={font} fontWeight="900" fontSize="30" letterSpacing="4" fill="#fff">
							FUEL
						</text>
						<rect x="230" y="378" width="440" height="40" rx="20" fill="#14392B" stroke={G} strokeWidth="4" />
						<rect x="230" y="378" width={440 * fuel} height="40" rx="20" fill={fuel < 0.25 ? RED : G} />
						{emergO > 0.01 ? (
							<g opacity={emergO * (1 - noEmerg * 0.7)}>
								<rect x="710" y="372" width="260" height="54" rx="12" fill={fuel < 0.25 || t < tProp ? RED : '#555'} />
								<text x="840" y="410" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="26" letterSpacing="2" fill="#fff">
									EMERGENCY
								</text>
							</g>
						) : null}
						{noEmerg > 0.01 ? (
							<g opacity={noEmerg}>
								<rect x="710" y="372" width="260" height="54" rx="12" fill={BG} stroke={G} strokeWidth="3" strokeDasharray="8 6" />
								<text x="840" y="410" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="26" letterSpacing="2" fill={G}>
									NO BUTTON
								</text>
							</g>
						) : null}
					</g>
				) : null}

				{/* kalendář a reorg */}
				{calO > 0.01 ? (
					<g opacity={calO}>
						<rect x="110" y="470" width="150" height="120" rx="14" fill="#fff" stroke={INK} strokeWidth="4" />
						<rect x="110" y="470" width="150" height="40" rx="14" fill={RED} />
						<text x="185" y="570" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="46" fill={INK}>
							{months[mi]}
						</text>
						<text x="185" y="500" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="24" letterSpacing="3" fill="#fff">
							PLAN
						</text>
					</g>
				) : null}
				{reorg1 > 0 ? (
					<g transform={`translate(850 490) scale(${Math.min(reorg1, 1.05)})`}>
						<rect x="-100" y="-30" width="200" height="60" rx="30" fill={GOLD} stroke={INK} strokeWidth="4" />
						<text x="0" y="11" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={INK}>
							REORG #1
						</text>
					</g>
				) : null}
				{reorg2 > 0 ? (
					<g transform={`translate(850 568) scale(${Math.min(reorg2, 1.05)})`}>
						<rect x="-100" y="-30" width="200" height="60" rx="30" fill={GOLD} stroke={INK} strokeWidth="4" />
						<text x="0" y="11" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={INK}>
							REORG #2
						</text>
					</g>
				) : null}

				{/* nálepky */}
				<Pill x={290} y={1190} w={330} label="ANGRY: 0" color={G} fill={BG} textColor={G} fs={30} o={ease(t, tAngry, tAngry + 0.25)} />
				<Pill x={700} y={1190} w={400} label="ALIGNED: 100%" color={G} fill={BG} textColor={G} fs={30} o={ease(t, tAligned, tAligned + 0.25)} />
				{ease(t, tAir, tAir + 0.3) > 0 ? (
					<g opacity={ease(t, tAir, tAir + 0.3) * (1 - ease(t, tNext - 0.2, tNext + 0.1))}>
						<rect x="260" y="1100" width="560" height="64" rx="32" fill={G} />
						<text x="540" y="1143" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="3" fill={BG}>
							STILL IN THE AIR
						</text>
					</g>
				) : null}
			</g>
			<PunchStamp t={t} at={tInt} lines={['INTERESTING.', "LET'S CIRCLE BACK."]} color={RED} y={820} size={66} />
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const CircleBackShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#07180F" vig={0.4}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
