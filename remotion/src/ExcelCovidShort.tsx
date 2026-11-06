import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, GOLD, GREEN, INK, RED, lerp, pop} from './WatermelonShort';
import {ChannelStamp, Pill, ease} from './PlanKit';

/*
 * W23 "Excel ate COVID cases" (visuals/excel-covid.md), čistě geometrické tabulky.
 * Graf s dírou -> "not counted" -> 25.9.-2.10. a 15 841 -> řádky do 65 536, pak "####" -> bublina "do not trust" -> stejná věta v tabulce.
 */

const NAVY = '#243A66';
const GRAY = '#7B8498';
const XLS = '#1E7B4A';
const MONO = "Consolas, 'Courier New', monospace";
const BARS = [30, 34, 38, 36, 44, 50, 0, 0, 0, 0, 0, 0, 0, 58, 62];

const Sheet: React.FC<{x: number; y: number; w: number; h: number; rows: number; hash?: number; text?: string; textO?: number}> = ({x, y, w, h, rows, hash = 0, text, textO = 0}) => {
	const colW = (w - 100) / 4;
	const HW = 100;
	const n = Math.floor((h - 90) / 44);
	return (
		<g>
			<rect x={x} y={y} width={w} height={h} rx="18" fill="#fff" stroke={INK} strokeWidth="5" />
			<rect x={x} y={y} width={w} height="60" rx="18" fill={XLS} />
			<rect x={x} y={y + 30} width={w} height="30" fill={XLS} />
			<text x={x + 24} y={y + 42} fontFamily={font} fontWeight="900" fontSize="28" fill="#fff" letterSpacing="2">
				CASES.XLS
			</text>
			{['A', 'B', 'C', 'D'].map((c, i) => (
				<g key={c}>
					<rect x={x + HW + i * colW} y={y + 60} width={colW} height="34" fill="#E6EBF2" stroke="#C5CCDA" strokeWidth="2" />
					<text x={x + HW + i * colW + colW / 2} y={y + 85} textAnchor="middle" fontFamily={font} fontWeight="800" fontSize="22" fill={GRAY}>
						{c}
					</text>
				</g>
			))}
			{Array.from({length: n}, (_, r) => {
				const rowNum = Math.max(1, Math.round(rows - (n - 1 - r)));
				const over = hash > 0 && r >= n - 1 - Math.floor(hash * (n - 1));
				const ry = y + 94 + r * 44;
				return (
					<g key={r}>
						<rect x={x} y={ry} width={HW} height="44" fill="#E6EBF2" stroke="#C5CCDA" strokeWidth="2" />
						<text x={x + HW - 10} y={ry + 31} textAnchor="end" fontFamily={MONO} fontWeight="700" fontSize="22" fill={GRAY}>
							{over ? '' : rowNum}
						</text>
						{[0, 1, 2, 3].map((c) => (
							<g key={c}>
								<rect x={x + HW + c * colW} y={ry} width={colW} height="44" fill={over ? '#2B2F3A' : '#fff'} stroke="#D5DBE8" strokeWidth="2" />
								{over && c === 0 ? (
									<text x={x + HW + colW / 2} y={ry + 31} textAnchor="middle" fontFamily={MONO} fontWeight="700" fontSize="24" fill={RED}>
										####
									</text>
								) : null}
								{!over && c > 0 ? <rect x={x + HW + 20 + c * colW} y={ry + 16} width={colW * 0.45} height="12" rx="6" fill="#D5DBE8" /> : null}
							</g>
						))}
					</g>
				);
			})}
			{text ? (
				<g opacity={textO}>
					<rect x={x + HW} y={y + 94} width={w - HW} height="130" fill="#FFF8D6" stroke={GOLD} strokeWidth="5" />
					<text x={x + 100} y={y + 150} fontFamily={MONO} fontWeight="700" fontSize="32" fill={INK}>
						{text.split('|')[0]}
					</text>
					<text x={x + 100} y={y + 196} fontFamily={MONO} fontWeight="700" fontSize="32" fill={INK}>
						{text.split('|')[1]}
					</text>
				</g>
			) : null}
		</g>
	);
};

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tNot = cue(segs, /^Not lost/);
	const tHid = cue(segs, /^Not hidden/);
	const tSimp = cue(segs, /^Simply not counted/);
	const tBet = cue(segs, /^Between the twenty-fifth/);
	const tReason = cue(segs, /^The reason/);
	const tFmt = cue(segs, /^the data was stored/);
	const tStop = cue(segs, /^After that/);
	const tNobody = cue(segs, /^Nobody noticed/);
	const tEnds = cue(segs, /^It just ends/);
	const tLesson = cue(segs, /^The obvious lesson/);
	const tDont = cue(segs, /^do not trust/);
	const tFinal = cue(segs, /^That lesson was/);

	const chartO = ease(t, 0.2, 0.6) * (1 - ease(t, tBet - 0.3, tBet));
	const timeO = ease(t, tBet, tBet + 0.3) * (1 - ease(t, tReason - 0.3, tReason));
	const sheetO = ease(t, tFmt - 0.3, tFmt + 0.3) * (1 - ease(t, tLesson - 0.3, tLesson));
	const lessonO = ease(t, tLesson, tLesson + 0.3) * (1 - ease(t, tFinal - 0.3, tFinal));
	const finalO = ease(t, tFinal, tFinal + 0.4);

	const rows = t < tFmt ? 1 : t < tStop ? lerp(1, 65536, ease(t, tFmt + 0.5, tStop - 0.3)) : 65536;
	const hash = ease(t, tStop, tStop + 0.8);

	return (
		<Svg>
			{chartO > 0.01 ? (
				<g opacity={chartO}>
					<rect x="100" y="400" width="880" height="620" rx="26" fill="#fff" stroke={INK} strokeWidth="5" />
					<text x="140" y="460" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="3" fill={NAVY}>
						ENGLAND · OCT 2020 · DAILY TESTS
					</text>
					<line x1="140" y1="940" x2="940" y2="940" stroke={INK} strokeWidth="4" />
					{BARS.map((b, i) => {
						const x = 150 + i * 52;
						const grow = ease(t, 0.6 + i * 0.08, 1.0 + i * 0.08);
						return b > 0 ? (
							<rect key={i} x={x} y={940 - b * 8 * grow} width="38" height={b * 8 * grow} rx="5" fill={BLUE} />
						) : (
							<rect key={i} x={x} y={940 - 380} width="38" height="380" rx="5" fill="none" stroke={RED} strokeWidth="4" strokeDasharray="10 8" opacity={ease(t, 3.0 + (i - 6) * 0.15, 3.3 + (i - 6) * 0.15)} />
						);
					})}
					<Pill y={540} w={640} label="≈16,000 TESTS MISSING" color={RED} fs={34} o={ease(t, 3.0, 3.4)} />
					<Pill y={1090} w={700} label="NOT LOST IN THE MAIL" color={GRAY} fs={30} o={ease(t, tNot, tNot + 0.25) * (1 - ease(t, tHid, tHid + 0.1))} />
					<Pill y={1090} w={700} label="NOT HIDDEN" color={GRAY} fs={30} o={ease(t, tHid, tHid + 0.25) * (1 - ease(t, tSimp, tSimp + 0.1))} />
					<Pill y={1090} w={700} label="SIMPLY NOT COUNTED" color={RED} fs={30} o={ease(t, tSimp, tSimp + 0.25)} />
				</g>
			) : null}

			{timeO > 0.01 ? (
				<g opacity={timeO}>
					<rect x="100" y="400" width="880" height="620" rx="26" fill="#fff" stroke={INK} strokeWidth="5" />
					<line x1="180" y1="560" x2="900" y2="560" stroke={INK} strokeWidth="8" strokeLinecap="round" />
					{Array.from({length: 8}, (_, i) => (
						<g key={i} opacity={ease(t, tBet + 0.3 + i * 0.3, tBet + 0.6 + i * 0.3)}>
							<circle cx={180 + i * (720 / 7)} cy="560" r="14" fill={RED} stroke={INK} strokeWidth="4" />
						</g>
					))}
					<text x="180" y="620" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={INK}>
						25 SEP
					</text>
					<text x="900" y="620" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={INK}>
						2 OCT
					</text>
					<text x="540" y="860" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="170" fill={RED} opacity={ease(t, tBet + 4.0, tBet + 4.5)}>
						15,841
					</text>
					<text x="540" y="940" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="3" fill={GRAY} opacity={ease(t, tBet + 4.5, tBet + 5.0)}>
						CASES NEVER COUNTED
					</text>
				</g>
			) : null}

			{sheetO > 0.01 ? (
				<g opacity={sheetO}>
					<Sheet x={100} y={400} w={880} h={760} rows={rows} hash={hash} />
					<Pill y={470 + 0} w={0} label="" o={0} />
					<g transform="translate(540 1215)">
						<text x="0" y="0" textAnchor="middle" fontFamily={MONO} fontWeight="700" fontSize="40" fill={t >= tStop ? RED : '#fff'}>
							{t >= tStop ? 'ROW LIMIT: 65,536' : `ROW ${Math.round(rows).toLocaleString('en-US')}`}
						</text>
					</g>
					{t >= tNobody ? (
						<g transform="translate(700 640)" opacity={ease(t, tNobody, tNobody + 0.3)}>
							<rect x="-230" y="-34" width="460" height="68" rx="34" fill="#fff" stroke={INK} strokeWidth="4" />
							<text x="0" y="12" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill={GRAY}>
								…(NO WARNING)
							</text>
						</g>
					) : null}
					{t >= tEnds ? <rect x="100" y="1140" width="880" height="14" fill={INK} opacity={ease(t, tEnds, tEnds + 0.3)} /> : null}
				</g>
			) : null}

			{lessonO > 0.01 ? (
				<g opacity={lessonO}>
					<rect x="140" y="520" width="800" height="440" rx="36" fill="#fff" stroke={INK} strokeWidth="6" />
					<text x="540" y="620" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="3" fill={GRAY}>
						THE OBVIOUS LESSON
					</text>
					{['DO NOT TRUST', 'A SPREADSHEET'].map((l, i) => (
						<text key={l} x="540" y={740 + i * 90} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="72" fill={i === 1 ? RED : INK} opacity={ease(t, tDont + i * 0.6, tDont + 0.3 + i * 0.6)}>
							{l}
						</text>
					))}
					<text x="540" y="900" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" fill={GRAY} opacity={ease(t, tDont + 1.6, tDont + 2)}>
						WITH SOMETHING THIS IMPORTANT
					</text>
				</g>
			) : null}

			{finalO > 0.01 ? (
				<g opacity={finalO}>
					<Sheet x={100} y={400} w={880} h={760} rows={20} text="DO NOT TRUST A SPREADSHEET|WITH SOMETHING THIS IMPORTANT" textO={ease(t, tFinal + 0.4, tFinal + 0.9)} />
					<Pill y={1215} w={560} label="CIRCULATED IN A SPREADSHEET" color={GREEN} fs={28} o={ease(t, tFinal + 1.2, tFinal + 1.5)} />
				</g>
			) : null}
			<ChannelStamp t={t} total={total} y={1300} />
		</Svg>
	);
};

export const ExcelCovidShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#14301F" vig={0.45}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
