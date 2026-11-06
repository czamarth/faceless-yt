import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, Bean, GOLD, GREEN, INK, RED, lerp, pop} from './WatermelonShort';
import {ChannelStamp, Pill, PunchStamp, ease} from './PlanKit';

/*
 * W27 "Bus factor" (visuals/bus-factor.md), projektový diagram.
 * Autobus -> zdravý projekt (5 uzlů) -> bus factor 1 = Pavel -> deploy skript se sleep 40 -> dokument "ask Pavel" -> Pavel na pláži.
 */

const PANEL = {x: 70, y: 330, w: 940, h: 900};
const NAVY = '#243A66';
const GRAY = '#7B8498';
const MONO = "Consolas, 'Courier New', monospace";
const TIES = [BLUE, GREEN, GOLD, RED, '#8A5CD6'];

const Bus: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<rect x="-130" y="-60" width="260" height="110" rx="20" fill={GOLD} stroke={INK} strokeWidth="6" />
		{[-95, -40, 15, 70].map((wx) => (
			<rect key={wx} x={wx} y="-42" width="40" height="34" rx="5" fill="#BEE8FF" stroke={INK} strokeWidth="3" />
		))}
		<rect x="-130" y="12" width="260" height="8" fill={INK} opacity="0.4" />
		<circle cx="-70" cy="52" r="24" fill={INK} />
		<circle cx="70" cy="52" r="24" fill={INK} />
		<circle cx="-70" cy="52" r="10" fill="#9AA3B8" />
		<circle cx="70" cy="52" r="10" fill="#9AA3B8" />
	</g>
);

const Palm: React.FC<{x: number; y: number}> = ({x, y}) => (
	<g transform={`translate(${x} ${y})`}>
		<path d="M 0 0 Q 18 -90 -6 -190" fill="none" stroke="#8A5A2B" strokeWidth="18" strokeLinecap="round" />
		{[-70, -30, 20, 65].map((a, i) => (
			<path key={i} d="M -6 -190 Q 40 -250 100 -200" fill="none" stroke="#2FB67C" strokeWidth="22" strokeLinecap="round" transform={`rotate(${a} -6 -190)`} />
		))}
	</g>
);

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tBus = cue(segs, /^It is called/);
	const tHow = cue(segs, /^how many people/);
	const tHealthy = cue(segs, /^Healthy projects/);
	const tEvery = cue(segs, /^Everyone knows/);
	const tOne = cue(segs, /^This project has/);
	const tPavel = cue(segs, /^His name is Pavel/);
	const tDeploy = cue(segs, /^Nobody else has seen/);
	const tSleep = cue(segs, /^Nobody else knows why/);
	const tAsk = cue(segs, /^Nobody dares/);
	const tDoc = cue(segs, /^Documentation/);
	const tAskP = cue(segs, /^ask Pavel/);
	const tVac = cue(segs, /^Pavel is on vacation/);

	const busO = ease(t, 0.2, 0.6) * (1 - ease(t, tHealthy - 0.3, tHealthy));
	const busX = lerp(1250, -200, ease(t, tHow, tHow + 3.0));
	const graphO = ease(t, tHealthy - 0.1, tHealthy + 0.3) * (1 - ease(t, tDeploy - 0.3, tDeploy));
	const toOne = ease(t, tOne, tOne + 1.0);
	const codeO = ease(t, tDeploy, tDeploy + 0.3) * (1 - ease(t, tDoc - 0.3, tDoc));
	const docO = ease(t, tDoc, tDoc + 0.3) * (1 - ease(t, tVac - 0.3, tVac));
	const beachO = ease(t, tVac, tVac + 0.4);

	// uzly grafu: pozice kolem středu
	const cx = 540;
	const cy = 800;
	const nodes = [0, 1, 2, 3, 4].map((i) => {
		const a = -Math.PI / 2 + (i / 5) * 2 * Math.PI;
		return [cx + 270 * Math.cos(a), cy + 250 * Math.sin(a)];
	});

	return (
		<Svg>
			<defs>
				<clipPath id="pclip">
					<rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx="36" />
				</clipPath>
			</defs>
			<rect x={PANEL.x + 8} y={PANEL.y + 14} width={PANEL.w} height={PANEL.h} rx="36" fill="rgba(0,0,0,0.3)" />
			<rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx="36" fill="#E3EEF2" stroke={INK} strokeWidth="5" />
			<g clipPath="url(#pclip)">
				{busO > 0.01 ? (
					<g opacity={busO}>
						<text x="540" y="560" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="100" letterSpacing="6" fill={NAVY}>
							BUS
						</text>
						<text x="540" y="660" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="100" letterSpacing="6" fill={RED} opacity={ease(t, tBus, tBus + 0.3)}>
							FACTOR
						</text>
						<rect x="70" y="990" width="940" height="16" fill="#8A93A6" />
						{t >= tHow ? <Bus x={busX} y={930} s={1.2} /> : <Bus x={1250} y={930} s={1.2} />}
						{t >= tHow ? (
							<g opacity={ease(t, tHow, tHow + 0.3)}>
								<Pill y={1120} w={820} label="HOW MANY PEOPLE MUST DISAPPEAR?" color={NAVY} fs={30} o={1} />
							</g>
						) : null}
					</g>
				) : null}

				{graphO > 0.01 ? (
					<g opacity={graphO}>
						<Pill y={430} w={720} label={toOne > 0.5 ? 'BUS FACTOR: 1' : 'BUS FACTOR: 5'} color={toOne > 0.5 ? RED : GREEN} fs={42} o={1} />
						{nodes.map(([x, y], i) => {
							const isPavel = i === 0;
							const o = isPavel ? 1 : 1 - toOne * 0.65;
							const w = isPavel ? lerp(6, 16, toOne) : lerp(6, 0, toOne);
							return (
								<g key={i}>
									{w > 0.2 ? <line x1={cx} y1={cy} x2={x} y2={y} stroke={isPavel && toOne > 0.5 ? RED : GREEN} strokeWidth={w} strokeLinecap="round" opacity={ease(t, tHealthy + 0.2 + i * 0.15, tHealthy + 0.6 + i * 0.15)} /> : null}
									<g opacity={o}>
										<Bean x={x} y={y + 55} s={0.5} tie={TIES[i]} />
									</g>
								</g>
							);
						})}
						<g transform={`translate(${cx} ${cy})`}>
							<rect x="-100" y="-44" width="200" height="88" rx="18" fill={NAVY} stroke={INK} strokeWidth="5" />
							<text x="0" y="12" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="3" fill="#fff">
								PROJECT
							</text>
						</g>
						<g opacity={ease(t, tPavel, tPavel + 0.3)} transform={`translate(${nodes[0][0] + 130} ${nodes[0][1] - 10})`}>
							<rect x="-80" y="-30" width="160" height="60" rx="30" fill={RED} />
							<text x="0" y="10" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="32" fill="#fff">
								PAVEL
							</text>
						</g>
					</g>
				) : null}

				{codeO > 0.01 ? (
					<g opacity={codeO}>
						<rect x="110" y="440" width="860" height="700" rx="22" fill="#0F1A2E" stroke={INK} strokeWidth="5" />
						<rect x="110" y="440" width="860" height="60" rx="22" fill="#1E2D4A" />
						<text x="140" y="482" fontFamily={MONO} fontWeight="700" fontSize="28" fill="#9FC3E8">
							deploy.sh
						</text>
						{Array.from({length: 11}, (_, i) => {
							const ln = [37, 38, 39, 40, 41, 42][i - 3] ?? null;
							const rowY = 560 + i * 48;
							const isSleep = i === 6;
							return (
								<g key={i}>
									<text x="140" y={rowY} fontFamily={MONO} fontWeight="700" fontSize="26" fill="#5B6A94">
										{34 + i}
									</text>
									{isSleep ? (
										<>
											<rect x="190" y={rowY - 34} width="740" height="46" rx="8" fill={RED} opacity={0.35 * ease(t, tSleep, tSleep + 0.3)} />
											<text x="210" y={rowY} fontFamily={MONO} fontWeight="700" fontSize="30" fill="#FFD66B">
												sleep 40
											</text>
										</>
									) : (
										<rect x="210" y={rowY - 18} width={160 + ((i * 97) % 380)} height="14" rx="7" fill="#33466F" />
									)}
								</g>
							);
						})}
						<g opacity={ease(t, tSleep + 0.4, tSleep + 0.7)} transform="translate(720 820)">
							<rect x="-150" y="-36" width="300" height="72" rx="36" fill="#fff" stroke={RED} strokeWidth="6" />
							<text x="0" y="13" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" fill={RED}>
								WHY?
							</text>
						</g>
						<Pill y={1080} w={560} label="NOBODY DARES TO ASK…" color={GRAY} fill="#fff" fs={30} o={ease(t, tAsk, tAsk + 0.3)} />
					</g>
				) : null}

				{docO > 0.01 ? (
					<g opacity={docO}>
						<rect x="230" y="450" width="620" height="620" rx="16" fill="#fff" stroke={INK} strokeWidth="5" />
						<text x="540" y="540" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="46" letterSpacing="6" fill={NAVY}>
							DOCUMENTATION
						</text>
						<text x="540" y="600" textAnchor="middle" fontFamily={font} fontWeight="800" fontSize="28" fill={GRAY}>
							PAGE 1 OF 1
						</text>
						<text x="540" y="800" textAnchor="middle" fontFamily={MONO} fontWeight="700" fontSize="70" fill={INK} opacity={ease(t, tAskP, tAskP + 0.3)}>
							ask Pavel
						</text>
					</g>
				) : null}

				{beachO > 0.01 ? (
					<g opacity={beachO}>
						<rect x={PANEL.x} y="330" width={PANEL.w} height="520" fill="#9FD8F5" />
						<circle cx="860" cy="470" r="60" fill={GOLD} />
						<rect x={PANEL.x} y="850" width={PANEL.w} height="380" fill="#F2DDA0" />
						<Palm x={260} y={900} />
						<Bean x={620} y={1040} s={1.0} tie={RED} />
						<Pill y={440} w={660} label="STATUS: OUT OF OFFICE" color={GREEN} fill="#fff" fs={36} o={ease(t, tVac + 0.3, tVac + 0.6)} />
					</g>
				) : null}
			</g>
			<PunchStamp t={t} at={tVac + 1.0} lines={['PAVEL IS', 'ON VACATION']} color={RED} y={720} size={70} />
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const BusFactorShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#C6D8E0" vig={0.3}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
