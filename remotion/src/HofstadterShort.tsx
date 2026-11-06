import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, GOLD, GREEN, INK, RED, lerp, pop} from './WatermelonShort';
import {ChannelStamp, Pill, ease} from './PlanKit';

/*
 * W17 "Hofstadter's law" (visuals/hofstadters-law.md), odpočet ETA.
 * Zákon na slidu -> ETA 3 M -> 6 -> 12 -> 24 (každé přidá vrstvu "+HOFSTADTER") -> firma zhasne -> ETA 2031 -> zákon se opakuje, ETA se přepíše (smyčka).
 */

const NAVY = '#243A66';
const PAPER = '#F7F9FC';
const GRAY = '#7B8498';

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tLaw = cue(segs, /^it always takes longer/);
	const tThree = cue(segs, /^A project is/);
	const tSays = cue(segs, /^Hofstadter says/);
	const tSix = cue(segs, /^So, six/);
	const tKnow = cue(segs, /^But you already/);
	const tTwelve = cue(segs, /^Twelve months/);
	const tToo = cue(segs, /^And knowing that/);
	const t24 = cue(segs, /^Twenty-four/);
	const tSoon = cue(segs, /^Soon the estimate/);
	const tUpd = cue(segs, /^The project manager/);
	const t2031 = cue(segs, /^estimated completion/);
	const tLoop = cue(segs, /^It always takes longer/);

	const lawO = pop(t, 0.1, 0.4) * (1 - ease(t, tThree - 0.3, tThree));
	const cardO = ease(t, tThree - 0.1, tThree + 0.3);

	// hodnota ETA
	const steps: [number, string][] = [
		[tThree, '3 MONTHS'],
		[tSix, '6 MONTHS'],
		[tTwelve, '12 MONTHS'],
		[t24, '24 MONTHS'],
	];
	let cur = '3 MONTHS';
	let curAt = tThree;
	for (const [at, txt] of steps) if (t >= at) {cur = txt; curAt = at;}
	if (t >= tSoon) {
		const yrs = Math.min(2031, 2029 + Math.floor((t - tSoon) / 1.4));
		cur = t >= tUpd ? '' : `YEAR ${yrs}`;
		curAt = tSoon;
	}
	const layers = t >= t24 ? 3 : t >= tTwelve ? 2 : t >= tSix ? 1 : 0;
	const layerTimes = [tSix, tTwelve, t24];

	const logoDim = ease(t, tSoon + 2.0, tSoon + 3.0);
	const slideO = ease(t, tUpd, tUpd + 0.3);
	const loopP = ease(t, tLoop, tLoop + 1.5);
	const shownETA = t >= tLoop + 1.6 ? '2046' : t >= tLoop + 0.6 ? '2038' : '2031';

	return (
		<Svg>
			{/* zákon */}
			{lawO > 0.01 ? (
				<g opacity={Math.min(1, lawO)} transform={`translate(0 ${(1 - Math.min(1, lawO)) * 30})`}>
					<rect x="100" y="430" width="880" height="620" rx="30" fill={PAPER} stroke={INK} strokeWidth="5" />
					<rect x="100" y="430" width="880" height="110" rx="30" fill={NAVY} />
					<rect x="100" y="500" width="880" height="40" fill={NAVY} />
					<text x="540" y="505" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="46" letterSpacing="4" fill="#fff">
						HOFSTADTER'S LAW
					</text>
					{['IT ALWAYS TAKES LONGER', 'THAN YOU EXPECT,'].map((l, i) => (
						<text key={l} x="540" y={650 + i * 70} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="50" fill={INK}>
							{l}
						</text>
					))}
					<text x="540" y="840" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="50" fill={RED} opacity={ease(t, tLaw + 1.8, tLaw + 2.2)}>
						EVEN WHEN YOU TAKE
					</text>
					<text x="540" y="910" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="50" fill={RED} opacity={ease(t, tLaw + 2.6, tLaw + 3.0)}>
						THIS LAW INTO ACCOUNT
					</text>
				</g>
			) : null}

			{/* karta ETA */}
			{cardO > 0.01 ? (
				<g opacity={cardO}>
					<rect x="100" y="430" width="880" height="760" rx="30" fill={PAPER} stroke={INK} strokeWidth="5" />
					<rect x="100" y="430" width="880" height="100" rx="30" fill={NAVY} />
					<rect x="100" y="500" width="880" height="30" fill={NAVY} />
					<text x="540" y="497" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="40" letterSpacing="5" fill="#fff">
						PROJECT · ETA
					</text>
					{/* firma */}
					<g opacity={1 - logoDim * 0.85} transform="translate(180 590)">
						<rect x="-60" y="-34" width="120" height="68" rx="12" fill={BLUE} />
						<text x="0" y="13" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" fill="#fff">
							ACME
						</text>
					</g>
					{t >= tSoon + 3.0 ? (
						<text x="320" y="610" fontFamily={font} fontWeight="800" fontSize="28" fill={RED} opacity={ease(t, tSoon + 3.0, tSoon + 3.4)}>
							COMPANY: NOT FOUND
						</text>
					) : null}
					{/* velké ETA */}
					{t < tUpd ? (
						<g key={cur} transform={`translate(540 ${760 + (1 - Math.min(1, pop(t, curAt, 0.3))) * -30})`}>
							<text x="0" y="0" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize={cur.length > 9 ? 100 : 120} fill={INK}>
								{cur}
							</text>
						</g>
					) : null}
					{/* vrstvy +HOFSTADTER */}
					{[0, 1, 2].map((i) =>
						layers > i ? (
							<g key={i} opacity={Math.min(1, pop(t, layerTimes[i], 0.3)) * (1 - slideO)} transform={`translate(${280 + i * 260} ${880 + 0})`}>
								<rect x="-120" y="-30" width="240" height="60" rx="30" fill={GOLD} stroke={INK} strokeWidth="4" />
								<text x="0" y="11" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="28" fill={INK}>
									+HOFSTADTER
								</text>
							</g>
						) : null,
					)}
					<Pill y={1000} w={760} label="YOU ALREADY KNOW THE LAW" color={GRAY} fs={30} o={ease(t, tKnow, tKnow + 0.25) * (1 - ease(t, tSoon - 0.2, tSoon))} />
					<Pill y={1000} w={760} label="ADD TIME" color={GREEN} fs={34} o={ease(t, tSays, tSays + 0.25) * (1 - ease(t, tKnow - 0.2, tKnow))} />
					{/* slide s ETA */}
					{slideO > 0.01 ? (
						<g opacity={slideO}>
							<rect x="170" y="640" width="740" height="420" rx="20" fill="#fff" stroke={INK} strokeWidth="5" />
							<text x="540" y="710" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="4" fill={GRAY}>
								ESTIMATED COMPLETION
							</text>
							<text x="540" y="880" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="150" fill={RED}>
								{shownETA}
							</text>
							{loopP > 0 ? (
								<g transform={`translate(540 990) rotate(${loopP * 360})`} opacity={Math.min(1, loopP * 3)}>
									<path d="M -34 0 A 34 34 0 1 1 0 34" fill="none" stroke={BLUE} strokeWidth="9" strokeLinecap="round" />
									<polygon points="0,18 0,50 22,34" fill={BLUE} />
								</g>
							) : null}
						</g>
					) : null}
				</g>
			) : null}
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const HofstadterShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#16213E" vig={0.45}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
