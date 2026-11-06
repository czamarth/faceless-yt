import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, Bean, GOLD, GREEN, INK, RED, lerp, mix, pop} from './WatermelonShort';
import {ChannelStamp, Pill, PunchStamp, ease} from './PlanKit';

/*
 * W34 "Kodak drawer" (visuals/kodak-drawer.md), sépie 70. let.
 * 1975 Sasson -> foťák velikosti topinkovače -> 100x100 pixelů, 23 s -> "cute, but don't tell anyone" -> film = byznys -> šuplík "next quarter's priorities".
 */

const PANEL = {x: 70, y: 330, w: 940, h: 900};
const SEPIA = '#D8C09A';
const BROWN = '#5B4528';
const NAVY = '#243A66';

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tToast = cue(segs, /^It was the size/);
	const tPix = cue(segs, /^The picture was/);
	const tSave = cue(segs, /^It took twenty-three/);
	const tMgmt = cue(segs, /^He showed it/);
	const tAcc = cue(segs, /^According to/);
	const tCute = cue(segs, /^that's cute/);
	const tStupid = cue(segs, /^Management was not/);
	const tFilm = cue(segs, /^Film was the business/);
	const tBill = cue(segs, /^Film made billions/);
	const tIdea = cue(segs, /^So the idea/);
	const tDrawer = cue(segs, /^A drawer/);
	const tLabel = cue(segs, /^Labeled/);
	const tNext = cue(segs, /^next quarter/);

	const color = ease(t, tIdea, tIdea + 1.5);
	const bg = mix('#D8C09A', '#E8EEF8', color);
	const ink = mix('#5B4528', '#1B1F2A', color);

	const camO = ease(t, 0.5, 0.9) * (1 - ease(t, tPix - 0.3, tPix));
	const toasterO = ease(t, tToast, tToast + 0.4);
	const pixO = ease(t, tPix, tPix + 0.3) * (1 - ease(t, tMgmt - 0.3, tMgmt));
	const mgmtO = ease(t, tMgmt, tMgmt + 0.3) * (1 - ease(t, tStupid - 0.3, tStupid));
	const filmO = ease(t, tStupid, tStupid + 0.3) * (1 - ease(t, tIdea - 0.3, tIdea));
	const drawerO = ease(t, tIdea, tIdea + 0.4);
	const close = ease(t, tDrawer, tDrawer + 0.8);
	const sec = Math.min(23, Math.round(ease(t, tSave, tSave + 2.4) * 23));

	return (
		<Svg>
			<defs>
				<clipPath id="pclip">
					<rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx="36" />
				</clipPath>
			</defs>
			<rect x={PANEL.x + 8} y={PANEL.y + 14} width={PANEL.w} height={PANEL.h} rx="36" fill="rgba(27,31,42,0.22)" />
			<rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx="36" fill={bg} stroke={INK} strokeWidth="5" />
			<g clipPath="url(#pclip)">
				<text x="540" y="470" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="130" letterSpacing="6" fill={ink} opacity={1 - ease(t, tMgmt - 0.3, tMgmt)}>
					1975
				</text>
				<Pill y={550} w={640} label="STEVE SASSON · KODAK" color={ink} fill="transparent" textColor={ink} fs={32} o={ease(t, 0.8, 1.1) * (1 - ease(t, tMgmt - 0.3, tMgmt))} />

				{camO > 0.01 ? (
					<g opacity={camO}>
						<g transform="translate(400 860)">
							<rect x="-170" y="-110" width="340" height="220" rx="14" fill="#8A7455" stroke={ink} strokeWidth="6" />
							<circle cx="-30" cy="0" r="76" fill="#2B2418" stroke={ink} strokeWidth="6" />
							<circle cx="-30" cy="0" r="42" fill="#5C6A8C" />
							<rect x="70" y="-90" width="80" height="50" rx="6" fill="#B8A07A" stroke={ink} strokeWidth="4" />
							<rect x="-170" y="110" width="340" height="40" rx="6" fill="#6B5A3E" stroke={ink} strokeWidth="5" />
							<text x="0" y="205" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="3" fill={ink}>
								NO FILM
							</text>
						</g>
						<g opacity={toasterO} transform="translate(820 900)">
							<rect x="-110" y="-60" width="220" height="130" rx="30" fill="#B8BDC9" stroke={ink} strokeWidth="6" />
							<rect x="-70" y="-62" width="50" height="14" rx="4" fill={ink} />
							<rect x="20" y="-62" width="50" height="14" rx="4" fill={ink} />
							<rect x="60" y="-10" width="40" height="14" rx="6" fill={ink} />
							<text x="0" y="135" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="3" fill={ink}>
								TOASTER
							</text>
							<text x="-300" y="30" fontFamily={font} fontWeight="900" fontSize="60" fill={ink}>
								≈
							</text>
						</g>
					</g>
				) : null}

				{pixO > 0.01 ? (
					<g opacity={pixO}>
						<rect x="120" y="630" width="420" height="420" rx="8" fill="#2B2418" stroke={ink} strokeWidth="6" />
						{Array.from({length: 100}, (_, i) => {
							const c = i % 10;
							const r = Math.floor(i / 10);
							const v = 60 + ((i * 53) % 120);
							return <rect key={i} x={128 + c * 40.4} y={638 + r * 40.4} width="38" height="38" fill={`rgb(${v},${v - 10},${v - 25})`} opacity={ease(t, tPix + i * 0.015, tPix + 0.2 + i * 0.015)} />;
						})}
						<text x="330" y="1105" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="2" fill={ink}>
							100 × 100 PIXELS
						</text>
						<g transform="translate(790 800)" opacity={ease(t, tSave, tSave + 0.3)}>
							<circle r="140" fill="none" stroke="#E2D2B0" strokeWidth="26" />
							<circle r="140" fill="none" stroke={RED} strokeWidth="26" strokeDasharray={`${(sec / 23) * 880} 880`} transform="rotate(-90)" strokeLinecap="round" />
							<text x="0" y="22" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="86" fill={ink}>
								{sec}s
							</text>
							<text x="0" y="200" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="32" letterSpacing="3" fill={ink}>
								TO SAVE
							</text>
						</g>
					</g>
				) : null}

				{mgmtO > 0.01 ? (
					<g opacity={mgmtO}>
						<Pill y={430} w={760} label="HE SHOWED IT TO MANAGEMENT" color={ink} fill="transparent" textColor={ink} fs={30} o={1} />
						<Bean x={330} y={1130} s={1.3} tie={GOLD} />
						<Bean x={560} y={1130} s={1.3} tie={BLUE} />
						<Bean x={790} y={1130} s={1.3} tie={RED} />
						<g opacity={ease(t, tCute, tCute + 0.3)} transform="translate(540 700)">
							<rect x="-390" y="-90" width="780" height="180" rx="40" fill="#fff" stroke={INK} strokeWidth="6" />
							<text x="0" y="-8" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="46" fill={INK}>
								“THAT'S CUTE,
							</text>
							<text x="0" y="52" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="46" fill={RED}>
								BUT DON'T TELL ANYONE.”
							</text>
						</g>
						<Pill y={500} w={760} label="HIS OWN LATER ACCOUNT" color={ink} fill="transparent" textColor={ink} fs={28} o={ease(t, tAcc, tAcc + 0.25) * (1 - ease(t, tCute, tCute + 0.1))} />
					</g>
				) : null}

				{filmO > 0.01 ? (
					<g opacity={filmO}>
						{[0, 1, 2, 3, 4].map((i) => (
							<g key={i} transform={`translate(540 ${1100 - i * 96})`} opacity={ease(t, tFilm + i * 0.12, tFilm + 0.3 + i * 0.12)}>
								<rect x="-200" y="-40" width="400" height="80" rx="10" fill="#E0A800" stroke={INK} strokeWidth="5" />
								<text x="0" y="14" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="40" letterSpacing="6" fill={INK}>
									FILM
								</text>
							</g>
						))}
						<text x="540" y="470" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="64" fill={ink}>
							FILM WAS THE BUSINESS
						</text>
						<text x="540" y="580" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="110" fill={GREEN} opacity={ease(t, tBill, tBill + 0.3)}>
							$ $ $
						</text>
					</g>
				) : null}

				{drawerO > 0.01 ? (
					<g opacity={drawerO}>
						<rect x="160" y="520" width="760" height="620" rx="16" fill="#9C7B4A" stroke={INK} strokeWidth="6" />
						<rect x="190" y="560" width="700" height={lerp(300, 0, close)} rx="10" fill="#4A3A22" />
						<g transform={`translate(0 ${lerp(-180, 0, close)})`}>
							<rect x="190" y="800" width="700" height="300" rx="16" fill="#B8935F" stroke={INK} strokeWidth="6" />
							<rect x="440" y="860" width="200" height="40" rx="12" fill="#6B5A3E" stroke={INK} strokeWidth="4" />
							<rect x="260" y="930" width="560" height="110" rx="10" fill="#F7F1DF" stroke={INK} strokeWidth="4" />
							<text x="540" y="975" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" letterSpacing="2" fill={INK}>
								NEXT QUARTER'S
							</text>
							<text x="540" y="1020" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="38" letterSpacing="2" fill={RED} opacity={ease(t, tLabel, tLabel + 0.3)}>
								PRIORITIES
							</text>
						</g>
						<g transform={`translate(540 ${lerp(640, 840, close)}) scale(${lerp(1, 0.5, close)})`} opacity={1 - ease(t, tDrawer + 0.6, tDrawer + 1.0)}>
							<rect x="-110" y="-70" width="220" height="130" rx="12" fill="#8A7455" stroke={INK} strokeWidth="5" />
							<circle cx="-30" cy="0" r="44" fill="#2B2418" />
						</g>
					</g>
				) : null}
			</g>
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const KodakDrawerShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#B8A07A" vig={0.4}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
