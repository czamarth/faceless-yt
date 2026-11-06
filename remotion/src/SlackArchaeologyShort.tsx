import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, GOLD, GREEN, INK, RED, lerp, pop} from './WatermelonShort';
import {ChannelStamp, Pill, PunchStamp, ease} from './PlanKit';

/*
 * W16 "Slack archaeology" (visuals/slack-archaeology.md), archeologický výkop.
 * Vrstvy kanálů odkrývané štětcem -> hřbitov projektů -> 400 teček, 3 svítí -> DM -> nejspodnější "#temp-do-not-use".
 */

const PANEL = {x: 70, y: 330, w: 940, h: 900};
const SOIL = ['#C9A878', '#B8935F', '#A67C4E', '#946A3F', '#7F5A35'];
const NAVY = '#243A66';
const MONO = "Consolas, 'Courier New', monospace";
const LAYERS = ['#general', '#general-two', '#random', '#random-random', '#oops'];

const Stone: React.FC<{x: number; y: number; label: string; o: number}> = ({x, y, label, o}) =>
	o > 0.01 ? (
		<g opacity={Math.min(1, o)} transform={`translate(${x} ${y + (1 - Math.min(1, o)) * 30})`}>
			<path d="M -95 80 V -20 A 95 95 0 0 1 95 -20 V 80 Z" fill="#B8BDC9" stroke={INK} strokeWidth="5" />
			<text x="0" y="0" textAnchor="middle" fontFamily={MONO} fontWeight="700" fontSize="28" fill={INK}>
				{label}
			</text>
			<text x="0" y="42" textAnchor="middle" fontFamily={font} fontWeight="800" fontSize="23" fill="#4A5160">
				11 MEMBERS
			</text>
		</g>
	) : null;

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tTop = cue(segs, /^In the top layer/);
	const tGen = cue(segs, /^general\./);
	const tBen = cue(segs, /^Beneath it/);
	const tGen2 = cue(segs, /^general-two/);
	const tThen = cue(segs, /^Then random/);
	const tGrave = cue(segs, /^Further down/);
	const tEach = cue(segs, /^Each one a channel/);
	const tMem = cue(segs, /^Each with eleven/);
	const tWho = cue(segs, /^does anyone know/);
	const tExp = cue(segs, /^Experts count/);
	const tThree = cue(segs, /^Three are in/);
	const tDm = cue(segs, /^The real decisions/);
	const tBottom = cue(segs, /^And at the very bottom/);
	const tTemp = cue(segs, /^a channel named temp/);

	const siteO = 1 - ease(t, tExp - 0.3, tExp);
	const dotsO = ease(t, tExp, tExp + 0.3) * (1 - ease(t, tBottom - 0.3, tBottom));
	const bottomO = ease(t, tBottom, tBottom + 0.5);
	const layerTimes = [tTop + 0.3, tBen + 0.2, tThen + 0.1, tThen + 1.2, tThen + 2.4];
	const brushX = (k: number) => 120 + ease(t, layerTimes[k], layerTimes[k] + 0.6) * 800;

	const lit = [34, 187, 301];
	return (
		<Svg>
			<defs>
				<clipPath id="pclip">
					<rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx="36" />
				</clipPath>
			</defs>
			<rect x={PANEL.x + 8} y={PANEL.y + 14} width={PANEL.w} height={PANEL.h} rx="36" fill="rgba(27,31,42,0.18)" />
			<rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx="36" fill="#F3E3C3" stroke={INK} strokeWidth="5" />
			<g clipPath="url(#pclip)">
				{/* výkop */}
				{siteO > 0.01 ? (
					<g opacity={siteO}>
						<rect x={PANEL.x} y="470" width={PANEL.w} height="760" fill="#6D4B2A" />
						{LAYERS.map((name, k) => {
							const w = ease(t, layerTimes[k], layerTimes[k] + 0.6);
							return (
								<g key={name}>
									<rect x="90" y={500 + k * 78} width="900" height="70" rx="8" fill="#5B3D22" />
									<rect x="90" y={500 + k * 78} width={900 * w} height="70" rx="8" fill={SOIL[k]} stroke="#5B3D22" strokeWidth="3" />
									{w > 0.4 ? (
										<text x="130" y={500 + k * 78 + 46} fontFamily={MONO} fontWeight="700" fontSize="38" fill={INK}>
											{name}
										</text>
									) : null}
								</g>
							);
						})}
						{/* štětec */}
						{t >= tTop && t < tThen + 3.2
							? LAYERS.map((_, k) =>
									t >= layerTimes[k] && t < layerTimes[k] + 0.7 ? (
										<g key={k} transform={`translate(${brushX(k)} ${535 + k * 78}) rotate(-30)`}>
											<rect x="-6" y="-80" width="12" height="80" fill="#8A6B47" />
											<rect x="-14" y="-8" width="28" height="30" rx="6" fill={GOLD} />
										</g>
									) : null,
								)
							: null}
						{/* hřbitov */}
						<Stone x={250} y={1010} label="#project-x" o={pop(t, tGrave, 0.4)} />
						<Stone x={540} y={1030} label="#project-y" o={pop(t, tGrave + 0.4, 0.4)} />
						<Stone x={830} y={1010} label="#project-z" o={pop(t, tGrave + 0.8, 0.4)} />
						<Pill y={455} w={720} label="4 YEARS OF NOTIFICATIONS" color={RED} fs={32} o={(1 - ease(t, tTop - 0.2, tTop)) * pop(t, 0.3, 0.3)} />
						<g opacity={ease(t, tWho, tWho + 0.3)}>
							<rect x="150" y="860" width="780" height="76" rx="38" fill="#fff" stroke={INK} strokeWidth="4" />
							<text x="540" y="910" textAnchor="middle" fontFamily={MONO} fontWeight="700" fontSize="32" fill={INK}>
								does anyone know who owns this?
							</text>
						</g>
						<Pill y={455} w={620} label="LAST MESSAGE" color={NAVY} fs={30} o={ease(t, tEach, tEach + 0.2) * (1 - ease(t, tTop + 1, tTop + 1.1)) * 0} />
					</g>
				) : null}

				{/* 400 teček */}
				{dotsO > 0.01 ? (
					<g opacity={dotsO}>
						<rect x="110" y="440" width="860" height="660" rx="26" fill="#1F2E55" stroke={INK} strokeWidth="5" />
						<text x="540" y="500" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="38" letterSpacing="4" fill="#fff">
							400 CHANNELS
						</text>
						{Array.from({length: 400}, (_, i) => {
							const cx = 175 + (i % 20) * 38;
							const cy = 545 + Math.floor(i / 20) * 27;
							const isLit = lit.includes(i) && t >= tThree;
							return <circle key={i} cx={cx} cy={cy} r={isLit ? 11 : 6} fill={isLit ? GREEN : '#5B6A94'} stroke={isLit ? '#fff' : 'none'} strokeWidth="3" opacity={isLit ? 1 : 0.8} />;
						})}
						<Pill y={1040} w={500} label="3 ACTIVE" color={GREEN} fill="#1F2E55" fs={32} o={ease(t, tThree, tThree + 0.25)} />
						{t >= tDm ? (
							<g transform={`translate(540 800) scale(${Math.min(pop(t, tDm, 0.35), 1.05)})`}>
								<rect x="-250" y="-90" width="500" height="180" rx="22" fill="#fff" stroke={GOLD} strokeWidth="8" />
								<text x="0" y="-18" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="3" fill={NAVY}>
									PRIVATE MESSAGE
								</text>
								<text x="0" y="40" textAnchor="middle" fontFamily={font} fontWeight="800" fontSize="32" fill="#4A5160">
									where decisions happen
								</text>
							</g>
						) : null}
					</g>
				) : null}

				{/* nejspodnější vrstva */}
				{bottomO > 0.01 ? (
					<g opacity={bottomO}>
						<rect x={PANEL.x} y="330" width={PANEL.w} height="900" fill="#3B2815" />
						{[0, 1, 2, 3, 4, 5, 6].map((i) => (
							<rect key={i} x="90" y={380 + i * 110} width="900" height="100" rx="10" fill={['#7F5A35', '#6F4D2C', '#5F4125', '#4F351E'][i % 4]} opacity={1 - i * 0.04} />
						))}
						<Pill y={470} w={700} label="THE OLDEST LAYER" color={GOLD} fill="#3B2815" fs={36} o={ease(t, tBottom + 0.3, tBottom + 0.6)} />
						<text x="540" y="420" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="26" letterSpacing="4" fill="#E6C68B">
							UNTOUCHED SINCE THE FOUNDING
						</text>
					</g>
				) : null}
			</g>
			{/* artefakt */}
			{t >= tTemp - 0.1 ? (
				<g transform={`translate(540 880) scale(${Math.min(pop(t, tTemp, 0.4), 1.05)})`}>
					<rect x="-400" y="-120" width="800" height="240" rx="26" fill="#F7E7B4" stroke={GOLD} strokeWidth="10" />
					<text x="0" y="-10" textAnchor="middle" fontFamily={MONO} fontWeight="700" fontSize="68" fill={INK}>
						#temp
					</text>
					<text x="0" y="68" textAnchor="middle" fontFamily={MONO} fontWeight="700" fontSize="46" fill={RED}>
						do-not-use
					</text>
				</g>
			) : null}
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const SlackArchaeologyShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#D9C7A2" vig={0.3}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
