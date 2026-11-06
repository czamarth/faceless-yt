import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, GOLD, GREEN, INK, RED, pop} from './WatermelonShort';
import {ChannelStamp, Pill, PunchStamp, ease} from './PlanKit';

/*
 * W38 "File version names" (visuals/file-version-names.md), složka se soubory.
 * Report_final -> přibývají přívlastky -> legal razítko -> pátek 16:55 -> název přeteče -> e-mail "see attached".
 */

const MONO = "Consolas, 'Courier New', monospace";
const NAVY = '#243A66';
const GRAY = '#7B8498';
const NAMES = [
	'Report_final.docx',
	'Report_final_v2.docx',
	'Report_final_v2_revised.docx',
	'Report_final_final.docx',
	'Report_final_final_USE_THIS_ONE.docx',
	'Report_final_final_USE_THIS_ONE_really_I_mean_it.docx',
];

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tCh = cue(segs, /^Then someone makes/);
	const tV2 = cue(segs, /^Report, final, version two\./);
	const tAn = cue(segs, /^Another change/);
	const tRev = cue(segs, /^Report, final, version two, revised/);
	const tBoss = cue(segs, /^Then the boss/);
	const tFF = cue(segs, /^Report, final, final\./);
	const tLegal = cue(segs, /^Then legal/);
	const tUse = cue(segs, /^Report, final, final, use this one\./);
	const tFri = cue(segs, /^Then, at four/);
	const tReal = cue(segs, /^report, final, final, use this one, really/);
	const tNobody = cue(segs, /^Nobody knows/);
	const tAtt = cue(segs, /^The real final/);
	const tSee = cue(segs, /^see attached/);

	const at = [0.2, tV2 - 0.3, tRev - 0.3, tFF - 0.3, tUse - 0.3, tReal - 0.3];
	const folderO = 1 - ease(t, tAtt - 0.3, tAtt);
	const mailO = ease(t, tAtt, tAtt + 0.4);
	const clockO = ease(t, tFri, tFri + 0.3) * (1 - ease(t, tNobody - 0.2, tNobody));

	return (
		<Svg>
			<defs>
				<clipPath id="fclip">
					<rect x="100" y="470" width="880" height="680" rx="14" />
				</clipPath>
			</defs>
			{folderO > 0.01 ? (
				<g opacity={folderO}>
					<path d="M 100 380 H 380 L 420 340 H 940 Q 980 340 980 380 V 1180 Q 980 1220 940 1220 H 140 Q 100 1220 100 1180 Z" fill="#F0C75A" stroke={INK} strokeWidth="6" />
					<rect x="100" y="440" width="880" height="780" rx="14" fill="#fff" stroke={INK} strokeWidth="5" />
					<text x="140" y="420" fontFamily={font} fontWeight="900" fontSize="32" letterSpacing="3" fill={INK}>
						REPORTS
					</text>
					<g clipPath="url(#fclip)">
						{NAMES.map((n, i) => {
							const o = pop(t, at[i], 0.3);
							const y = 520 + i * 105;
							const ov = i === 5;
							return (
								<g key={i} opacity={Math.min(1, o)} transform={`translate(${(1 - Math.min(1, o)) * -60} 0)`}>
									<rect x="130" y={y - 36} width="820" height="84" rx="12" fill={i === 4 ? '#E8F5EC' : '#F4F6FB'} stroke={i === 5 ? RED : '#D5DBE8'} strokeWidth={i === 5 ? 4 : 2} />
									<rect x="150" y={y - 24} width="44" height="58" rx="5" fill="#fff" stroke={INK} strokeWidth="3" />
									<rect x="160" y={y - 10} width="24" height="5" fill={BLUE} />
									<rect x="160" y={y + 2} width="24" height="5" fill={BLUE} />
									<text x="214" y={y + 14} fontFamily={MONO} fontWeight="700" fontSize="28" fill={INK}>
										{n}
									</text>
									{ov ? <rect x="820" y={y - 36} width="130" height="84" fill="url(#fade)" /> : null}
								</g>
							);
						})}
						<defs>
							<linearGradient id="fade" x1="0" x2="1">
								<stop offset="0" stopColor="#F4F6FB" stopOpacity="0" />
								<stop offset="1" stopColor="#F4F6FB" stopOpacity="1" />
							</linearGradient>
						</defs>
					</g>
					{/* razítko legal */}
					{t >= tUse ? (
						<g opacity={ease(t, tUse, tUse + 0.3)} transform="translate(780 940) rotate(-8)">
							<rect x="-150" y="-34" width="300" height="68" rx="10" fill="#fff" stroke={RED} strokeWidth="6" />
							<text x="0" y="12" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="32" letterSpacing="3" fill={RED}>
								LEGAL ✔
							</text>
						</g>
					) : null}
					{clockO > 0.01 ? (
						<g opacity={clockO} transform="translate(800 1145)">
							<rect x="-150" y="-46" width="300" height="92" rx="16" fill="#0E1A2E" stroke={INK} strokeWidth="5" />
							<text x="0" y="16" textAnchor="middle" fontFamily={MONO} fontWeight="700" fontSize="44" fill="#FF6B6B">
								FRI 16:55
							</text>
						</g>
					) : null}
					<Pill y={1160} w={0} label="" o={0} />
					{t >= tNobody ? (
						<g opacity={ease(t, tNobody, tNobody + 0.3)}>
							<text x="540" y="1170" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="40" fill={RED}>
								WHICH ONE IS THE REAL FINAL?
							</text>
						</g>
					) : null}
				</g>
			) : null}

			{mailO > 0.01 ? (
				<g opacity={mailO} transform={`translate(0 ${(1 - mailO) * 30})`}>
					<rect x="100" y="440" width="880" height="620" rx="26" fill="#fff" stroke={INK} strokeWidth="5" />
					<rect x="100" y="440" width="880" height="80" rx="26" fill={NAVY} />
					<rect x="100" y="490" width="880" height="30" fill={NAVY} />
					<text x="140" y="494" fontFamily={font} fontWeight="900" fontSize="30" letterSpacing="3" fill="#fff">
						NEW MESSAGE
					</text>
					<text x="140" y="600" fontFamily={font} fontWeight="800" fontSize="30" fill={GRAY}>
						SUBJECT:
					</text>
					<text x="320" y="600" fontFamily={font} fontWeight="900" fontSize="52" fill={INK} opacity={ease(t, tSee, tSee + 0.3)}>
						see attached
					</text>
					<g opacity={ease(t, tSee + 0.3, tSee + 0.7)}>
						<rect x="140" y="700" width="800" height="110" rx="16" fill="#E8F5EC" stroke={GREEN} strokeWidth="5" />
						<path d="M 180 740 Q 170 790 200 790 Q 230 790 225 745" fill="none" stroke={GRAY} strokeWidth="6" strokeLinecap="round" />
						<text x="260" y="775" fontFamily={MONO} fontWeight="700" fontSize="30" fill={INK}>
							Report_final_final_REAL.docx
						</text>
					</g>
					<g opacity={ease(t, tSee + 0.9, tSee + 1.3)}>
						<text x="540" y="920" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="38" fill={RED}>
							THE REAL FINAL VERSION
						</text>
						<text x="540" y="975" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="38" fill={RED}>
							LIVES IN AN EMAIL
						</text>
					</g>
				</g>
			) : null}
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const FileVersionNamesShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#C6D3EA" vig={0.3}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
