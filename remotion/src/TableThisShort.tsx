import React from 'react';
import type {Segment, ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font, ramp, sm} from './ConceptShorts';
import {BLUE, Bean, GREEN, INK, RED, cueAt, lerp, pop} from './WatermelonShort';

/*
 * W02 "Table this" (visuals/table-this.md).
 * Dělená obrazovka UK/US: jeden stůl, dva opačné významy -> návrh se zvedne, položí a zmizí v šuplíku
 * -> zápis "item tabled" -> razítko "ACCURATE IN BOTH COUNTRIES".
 */

const NAVY = '#1F3A8A';
const WOOD = '#B07A4A';
const FLOOR = 1130;
const MID = 540;
const STAGE = {y: 330, h: 900};

const ease = (t: number, a: number, b: number) => sm(ramp(t, a, b));

const Table: React.FC<{x: number; wobble: number; o: number}> = ({x, wobble, o}) => (
	<g opacity={o} transform={`translate(${x} ${FLOOR}) rotate(${wobble})`}>
		<rect x="-150" y="-135" width="300" height="26" rx="9" fill={WOOD} />
		<rect x="-128" y="-109" width="18" height="109" fill="#8A5C34" />
		<rect x="110" y="-109" width="18" height="109" fill="#8A5C34" />
	</g>
);

const Chip: React.FC<{x: number; y: number; w: number; label: string; color: string; s: number}> = ({x, y, w, label, color, s}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<rect x={-w / 2} y="-40" width={w} height="80" rx="40" fill="#fff" stroke={color} strokeWidth="6" />
		<text x="0" y="15" textAnchor="middle" fontFamily={font} fontWeight="800" fontSize="40" fill={INK} letterSpacing="2">
			{label}
		</text>
	</g>
);

const Arrow: React.FC<{x: number; y: number; dir: 1 | -1; color: string; o: number; push: number}> = ({x, y, dir, color, o, push}) => (
	<g opacity={o} transform={`translate(${x + dir * push} ${y}) scale(${dir} 1)`}>
		<path d="M -55 0 H 45 M 15 -34 L 52 0 L 15 34" fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
	</g>
);

const Paper: React.FC<{x: number; y: number; s: number; rot: number; label?: boolean}> = ({x, y, s, rot, label = true}) => (
	<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
		<rect x="-95" y="-120" width="190" height="240" rx="10" fill="#fff" stroke={INK} strokeWidth="5" />
		{label ? (
			<text x="0" y="-68" textAnchor="middle" fontFamily="Consolas, monospace" fontWeight="900" fontSize="25" fill={INK}>
				PROPOSAL
			</text>
		) : null}
		{[-30, 10, 50, 90].map((ly) => (
			<rect key={ly} x="-65" y={ly} width={ly === 90 ? 70 : 130} height="12" rx="6" fill={INK} opacity="0.18" />
		))}
	</g>
);

const Cabinet: React.FC<{x: number; s: number}> = ({x, s}) => (
	<g transform={`translate(${x} ${FLOOR}) scale(${s})`} style={{transformOrigin: '0 0'}}>
		<rect x="-75" y="-230" width="150" height="230" rx="12" fill="#8E97AB" stroke={INK} strokeWidth="5" />
		{[-230, -153, -76].map((dy) => (
			<g key={dy}>
				<line x1="-75" y1={dy + 77} x2="75" y2={dy + 77} stroke={INK} strokeWidth="4" />
				<rect x="-24" y={dy + 28} width="48" height="12" rx="6" fill="#D9DEE8" stroke={INK} strokeWidth="3" />
			</g>
		))}
	</g>
);

const Scene: React.FC<{t: number; segs: Segment[]; total: number}> = ({t, segs, total}) => {
	const tUk = cue(segs, /^A British manager/);
	const tUkTable = cue(segs, /^let's table this\.$/);
	const tUkMeans = cue(segs, /^let's discuss/);
	const tUs = cue(segs, /^An American manager/);
	const tUsTable = segs.filter((s) => /^let's table this\.$/.test(s.text))[1]?.start ?? 6.6;
	const tUsMeans = cue(segs, /^let's never/);
	const tBoth = cue(segs, /^Both are correct/);
	const tBrit = cue(segs, /^In Britain/);
	const tAmer = cue(segs, /^In America/);
	const tSameW = cue(segs, /^Same word/);
	const tSameL = cue(segs, /^Same language/);
	const tSameT = cue(segs, /^Same table/);
	const tOpp = cue(segs, /^Opposite/);
	const tTeams = cue(segs, /^So when a British team/);
	const tMeet = cueAt(segs, /^So when a British team/, 0.4);
	const tRaised = cueAt(segs, /^So when a British team/, 0.6);
	const tTabled = cueAt(segs, /^So when a British team/, 0.69);
	const tForgot = cueAt(segs, /^So when a British team/, 0.78);
	const tMin = cue(segs, /^Nobody notices/);
	const tItem = cue(segs, /^item tabled/);
	const tTrue = cue(segs, /^Which, in both/);

	// ---- panely UK / US -------------------------------------------------------
	const panels = (
		<>
			<rect x="50" y={STAGE.y} width="480" height={STAGE.h} rx="36" fill="#DCE6FA" />
			<rect x="550" y={STAGE.y} width="480" height={STAGE.h} rx="36" fill="#F8E1DF" />
			<path d={`M 50 ${STAGE.y + 110} V ${STAGE.y + 36} A 36 36 0 0 1 86 ${STAGE.y} H 494 A 36 36 0 0 1 530 ${STAGE.y + 36} V ${STAGE.y + 110} Z`} fill={NAVY} />
			<path d={`M 550 ${STAGE.y + 110} V ${STAGE.y + 36} A 36 36 0 0 1 586 ${STAGE.y} H 994 A 36 36 0 0 1 1030 ${STAGE.y + 36} V ${STAGE.y + 110} Z`} fill={RED} />
			<text x="290" y={STAGE.y + 78} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="54" letterSpacing="8" fill="#fff">
				UK
			</text>
			<text x="790" y={STAGE.y + 78} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="54" letterSpacing="8" fill="#fff">
				US
			</text>
			<rect x="50" y={FLOOR} width="480" height="6" fill="rgba(27,31,42,0.18)" />
			<rect x="550" y={FLOOR} width="480" height="6" fill="rgba(27,31,42,0.18)" />
		</>
	);

	// ---- pohyb figurek a stolu (fáze 1-3) -------------------------------------
	const ukX = lerp(-80, 330, ease(t, 0, tUkTable));
	const usIn = ease(t, tUs, tUsTable);
	const usOut = ease(t, tUsTable, tUsMeans + 0.8);
	const usBack = ease(t, tBoth - 0.5, tBoth + 0.5);
	const usX = t < tUsMeans + 0.8 ? lerp(1160, 750, usIn) + usOut * (1300 - 750) : lerp(1300, 750, usBack);
	const phase13 = 1 - ease(t, tSameW - 0.35, tSameW - 0.05);

	// stůl: nese ho UK, pak stojí uprostřed, US ho odnese, vrátí se, pohupuje se, odjede doleva
	let tableX: number;
	if (t < tUkTable) tableX = ukX + 190;
	else if (t < tUs) tableX = lerp(ukX + 190, MID, ease(t, tUkTable, tUkTable + 0.7));
	else if (t < tUsMeans + 0.8) tableX = lerp(MID, usX - 190, ease(t, tUsTable, tUsTable + 0.5));
	else if (t < tBoth) tableX = usX - 190;
	else tableX = lerp(1250, MID, ease(t, tBoth - 0.5, tBoth + 0.4));
	const exitLeft = ease(t, tSameW - 0.5, tSameW - 0.1);
	tableX = lerp(tableX, -260, exitLeft);
	const wobble = t > tBoth + 0.4 && t < tSameW - 0.5 ? Math.sin((t - tBoth) * 7) * 3.2 * Math.max(0, 1 - ramp(t, tBoth + 0.4, tBoth + 0.5) * 0) : 0;
	const bob = (k: number) => Math.abs(Math.sin(t * 8 + k)) * 14;
	const ukWalking = t < tUkTable;
	const usWalking = (t >= tUs && t < tUsTable) || (t >= tUsTable && t < tUsMeans + 0.8) || (t >= tBoth - 0.5 && t < tBoth + 0.5);

	// bubliny
	const bubble = (x: number, y: number, label: string, color: string, o: number) =>
		o > 0 ? (
			<g opacity={Math.min(1, o)} transform={`translate(${x} ${y - (1 - Math.min(1, o)) * 20})`}>
				<rect x="-170" y="-44" width="340" height="88" rx="44" fill="#fff" stroke={color} strokeWidth="6" />
				<text x="0" y="12" textAnchor="middle" fontFamily={font} fontWeight="800" fontSize="34" fill={INK}>
					{label}
				</text>
			</g>
		) : null;
	const ukBubble =
		t < tUs
			? bubble(330, 640, t < tUkMeans ? "LET'S TABLE THIS" : 'DISCUSS IT NOW', t < tUkMeans ? NAVY : GREEN, ramp(t, tUkTable - 0.5, tUkTable - 0.3) * (t < tUkMeans ? 1 : ramp(t, tUkMeans, tUkMeans + 0.2)))
			: null;
	const usBubbleOn = t >= tUsTable && t < tBoth - 0.2;
	const usBubble = usBubbleOn
		? bubble(750, 640, t < tUsMeans ? "LET'S TABLE THIS" : 'NEVER AGAIN', t < tUsMeans ? RED : INK, ramp(t, tUsTable, tUsTable + 0.2))
		: null;

	// popisky UK/US po "Both are correct"
	const chipUk = pop(t, tBrit, 0.3) * (1 - ease(t, tSameW - 0.4, tSameW - 0.1));
	const chipUs = pop(t, tAmer, 0.3) * (1 - ease(t, tSameW - 0.4, tSameW - 0.1));

	// ---- fáze 4: čtyři slova -----------------------------------------------
	const words = [
		{t: tSameW, label: 'SAME WORD', y: 560},
		{t: tSameL, label: 'SAME LANGUAGE', y: 690},
		{t: tSameT, label: 'SAME TABLE', y: 820},
	];
	const fadeWords = 1 - ease(t, tTeams - 0.4, tTeams - 0.05);
	const oppS = pop(t, tOpp, 0.35);
	const push = Math.sin(ramp(t, tOpp, tOpp + 1.2) * Math.PI * 3) * 14 + ease(t, tOpp, tOpp + 1.2) * 40;

	// ---- fáze 5: týmy, návrh, šuplík --------------------------------------------
	const teamO = ease(t, tTeams - 0.1, tTeams + 0.2) * (1 - ease(t, tMin - 0.3, tMin));
	const walk = ease(t, tTeams, tMeet + 0.2);
	const teamL = [150, 230, 310].map((x, i) => ({x: lerp(x, x + 140, walk), tie: BLUE, hat: i === 0 ? ('bowler' as const) : undefined}));
	const teamR = [930, 850, 770].map((x, i) => ({x: lerp(x, x - 140, walk), tie: RED, hat: i === 0 ? ('cap' as const) : undefined}));
	const table2 = pop(t, tMeet + 0.2, 0.35);
	const raised = ease(t, tRaised, tRaised + 0.35);
	const placed = ease(t, tTabled, tTabled + 0.3);
	const filed = ease(t, tForgot, tForgot + 0.7);
	let px = MID;
	let py = lerp(1010, 700, raised);
	py = lerp(py, FLOOR - 135 - 120 * 0.7, placed);
	let ps = lerp(1.0, 0.7, placed);
	px = lerp(px, 905, filed);
	py = lerp(py, 930, filed);
	ps = lerp(ps, 0.14, filed);
	const paperO = t < tRaised ? 0 : 1 - ease(t, tForgot + 0.65, tForgot + 0.8);
	const cab = pop(t, tForgot - 0.2, 0.35);

	// ---- fáze 6: zápis -----------------------------------------------------------
	const minO = ease(t, tMin - 0.1, tMin + 0.25);
	const minutes = (
		<g opacity={minO * (1 - 0.7 * ease(t, tTrue - 0.2, tTrue + 0.2))}>
			<rect x="155" y="470" width="770" height="720" rx="22" fill="#fff" stroke={INK} strokeWidth="6" />
			<text x="215" y="565" fontFamily="Consolas, monospace" fontWeight="900" fontSize="50" fill={INK} letterSpacing="4">
				MINUTES
			</text>
			<line x1="215" y1="595" x2="865" y2="595" stroke={INK} strokeWidth="5" />
			{['1. WELCOME', '2. BUDGET', '3. PROPOSAL', '4. NEXT STEPS'].map((label, i) => {
				const o = ease(t, tMin + 0.15 + i * 0.12, tMin + 0.4 + i * 0.12);
				const hit = i === 2;
				return (
					<g key={label} opacity={o}>
						<text x="215" y={690 + i * 110} fontFamily="Consolas, monospace" fontWeight="700" fontSize="38" fill={INK} opacity={hit ? 0.75 * (1 - ease(t, tItem, tItem + 0.1)) : 0.75}>
							{label}
						</text>
						{hit ? (
							<g opacity={ease(t, tItem, tItem + 0.15)} transform={`translate(0 ${pop(t, tItem, 0.4) * 0})`}>
								<rect x="215" y={716 + i * 110 - 44} width="650" height="66" rx="14" fill="rgba(47,182,124,0.18)" stroke={GREEN} strokeWidth="5" />
								<text x="240" y={716 + i * 110 - 4} fontFamily="Consolas, monospace" fontWeight="900" fontSize="40" fill={INK}>
									ITEM TABLED
								</text>
								<path d="M 760 920 L 792 953 L 850 888" fill="none" stroke={GREEN} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
							</g>
						) : (
							<rect x="560" y={662 + i * 110} width="300" height="14" rx="7" fill={INK} opacity="0.14" />
						)}
					</g>
				);
			})}
		</g>
	);

	// ---- pointa ------------------------------------------------------------------
	const trueS = pop(t, tTrue, 0.45);
	const stampT = total - 0.1;
	const stampS = pop(t, stampT, 0.3);

	const fadeAll13 = phase13;
	return (
		<Svg>
			<g opacity={ease(t, 0, 0.001)}>{panels}</g>

			{/* fáze 1–3 */}
			<g opacity={fadeAll13} transform={`translate(${MID} ${FLOOR}) scale(1.25) translate(${-MID} ${-FLOOR})`}>
				<Bean x={ukX} y={FLOOR} s={1.3} tie={NAVY} hat="bowler" jump={ukWalking ? bob(0) : 0} />
				{usX < 1250 || t > tBoth - 0.6 ? <Bean x={usX} y={FLOOR} s={1.3} tie={RED} hat="cap" jump={usWalking ? bob(2) : 0} /> : null}
				<Table x={tableX} wobble={wobble} o={t < tSameW - 0.1 ? 1 : 0} />
				{ukBubble}
				{usBubble}
				{chipUk > 0 ? (
					<g transform={`translate(330 ${700}) scale(${chipUk})`}>
						<rect x="-165" y="-40" width="330" height="80" rx="40" fill="#fff" stroke={NAVY} strokeWidth="6" />
						<text x="0" y="12" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="29" fill={INK}>
							UK: ON THE TABLE
						</text>
					</g>
				) : null}
				{chipUs > 0 ? (
					<g transform={`translate(750 ${700}) scale(${chipUs})`}>
						<rect x="-165" y="-40" width="330" height="80" rx="40" fill="#fff" stroke={RED} strokeWidth="6" />
						<text x="0" y="12" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="29" fill={INK}>
							US: OFF THE TABLE
						</text>
					</g>
				) : null}
			</g>

			{/* fáze 4 */}
			<g opacity={fadeWords}>
				{words.map((w) => {
					const s = pop(t, w.t, 0.3);
					return s > 0 ? <Chip key={w.label} x={MID} y={w.y} w={640} label={w.label} color={INK} s={s} /> : null;
				})}
				{oppS > 0 ? (
					<g>
						<Chip x={MID} y={990} w={800} label="OPPOSITE DIRECTIONS" color={RED} s={oppS} />
						<Arrow x={150} y={1100} dir={-1} color={NAVY} o={oppS} push={push} />
						<Arrow x={930} y={1100} dir={1} color={RED} o={oppS} push={push} />
					</g>
				) : null}
			</g>

			{/* fáze 5 */}
			<g opacity={teamO}>
				{teamL.map((b, i) => (
					<Bean key={`l${i}`} x={b.x} y={FLOOR} s={0.95} tie={b.tie} hat={b.hat} jump={walk > 0 && walk < 1 ? bob(i) * 0.6 : 0} />
				))}
				{teamR.map((b, i) => (
					<Bean key={`r${i}`} x={b.x} y={FLOOR} s={0.95} tie={b.tie} hat={b.hat} jump={walk > 0 && walk < 1 ? bob(i + 3) * 0.6 : 0} />
				))}
				{table2 > 0 ? (
					<g transform={`translate(${MID} ${FLOOR}) scale(${table2}) translate(${-MID} ${-FLOOR})`}>
						<Table x={MID} wobble={0} o={1} />
					</g>
				) : null}
				{cab > 0 ? <Cabinet x={905} s={cab} /> : null}
				{paperO > 0 ? (
					<g opacity={paperO}>
						<Paper x={px} y={py} s={ps} rot={lerp(-6, 0, placed)} label={filed < 0.4} />
					</g>
				) : null}
			</g>

			{/* fáze 6 */}
			{minutes}

			{/* pointa */}
			{trueS > 0 ? (
				<g transform={`translate(${MID} 800) rotate(-5) scale(${trueS})`}>
					<rect x="-420" y="-170" width="840" height="340" rx="26" fill="#fff" stroke={BLUE} strokeWidth="12" />
					<text x="0" y="-26" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="84" letterSpacing="2" fill={BLUE}>
						ACCURATE IN
					</text>
					<text x="0" y="100" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="84" letterSpacing="2" fill={BLUE}>
						BOTH COUNTRIES
					</text>
				</g>
			) : null}
			{stampS > 0 ? (
				<g transform={`translate(${MID} 1280) rotate(-6) scale(${stampS * 0.7})`}>
					<rect x="-440" y="-62" width="880" height="124" rx="16" fill="#fff" stroke={BLUE} strokeWidth="8" />
					<text x="0" y="16" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="46" letterSpacing="4" fill={BLUE}>
						THIS COULD HAVE BEEN A SHORT
					</text>
				</g>
			) : null}
		</Svg>
	);
};

export const TableThisShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#F4F1EA" vig={0.1}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
