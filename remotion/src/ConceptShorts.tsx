import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Sequence,
	interpolate,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import type {Segment, ShortProps} from './CorporateShort';

export const font = 'Segoe UI, Arial, sans-serif';
export const NEVER = 1e9;

export const ramp = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
export const sm = (x: number) => x * x * (3 - 2 * x);
export const cue = (segs: Segment[], re: RegExp) => {
	const s = segs.find((x) => re.test(x.text));
	return s ? s.start : NEVER;
};

const Subtitle: React.FC<{seg: Segment}> = ({seg}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 190, opacity: o}}>
			<div
				style={{
					width: 940,
					boxSizing: 'border-box',
					padding: '26px 34px',
					textAlign: 'center',
					fontFamily: font,
					fontWeight: 700,
					fontSize: seg.text.length > 100 ? 48 : 56,
					lineHeight: 1.25,
					color: 'white',
					background: 'rgba(8,12,18,0.72)',
					borderRadius: 14,
				}}
			>
				{seg.text}
			</div>
		</AbsoluteFill>
	);
};

export const Shell: React.FC<ShortProps & {bg: string; vig?: number; children: (t: number) => React.ReactNode}> = ({
	totalSeconds,
	audio,
	segments,
	bg,
	vig = 0.5,
	children,
}) => {
	const fps = 30;
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	const t = frame / fps;
	const scale = interpolate(frame, [0, totalSeconds * fps], [1, 1.05], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{background: bg}}>
			<AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: '50% 40%'}}>{children(t)}</AbsoluteFill>
			<AbsoluteFill
				style={{background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 60%, rgba(0,0,0,${vig}) 100%)`}}
			/>
			{segments.map((s, i) => {
				const from = Math.round(s.start * fps);
				const nextStart = i < segments.length - 1 ? segments[i + 1].start : totalSeconds + 0.5;
				const dur = Math.max(1, Math.round(nextStart * fps) - from);
				return (
					<Sequence key={i} from={from} durationInFrames={dur}>
						<Subtitle seg={s} />
					</Sequence>
				);
			})}
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					height: 8,
					width: Math.min(1, frame / (totalSeconds * fps)) * width,
					background: '#f0b429',
				}}
			/>
			{audio ? <Audio src={staticFile(audio)} /> : null}
		</AbsoluteFill>
	);
};

export const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
	<svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
		{children}
	</svg>
);

/* ------------------------------------------------------------------ */
/* 1) Organizační schéma: strom -> otočený strom -> baobab -> restrukturalizace */

type Branch = {x1: number; y1: number; x2: number; y2: number; w: number};
type Pt = {x: number; y: number};

const grow = (
	x: number,
	y: number,
	len: number,
	ang: number,
	d: number,
	max: number,
	dir: number,
	segs: Branch[],
	tips: Pt[],
) => {
	const x2 = x + Math.sin(ang) * len;
	const y2 = y - dir * Math.cos(ang) * len;
	segs.push({x1: x, y1: y, x2, y2, w: Math.max(3, (max - d) * 5)});
	if (d === max - 1) {
		tips.push({x: x2, y: y2});
		return;
	}
	const j = Math.sin(x2 * 0.05 + d * 3) * 0.18;
	grow(x2, y2, len * 0.76, ang - 0.46 + j, d + 1, max, dir, segs, tips);
	grow(x2, y2, len * 0.76, ang + 0.46 + j, d + 1, max, dir, segs, tips);
};

const TREE: Branch[] = [];
const TIPS: Pt[] = [];
const ROOTS: Branch[] = [];
grow(540, 1050, 230, 0, 0, 6, 1, TREE, TIPS);
grow(540, 1050, 95, 0, 0, 4, -1, ROOTS, []);
const CX = 540;
const CY = 886;

const OrgTree: React.FC<{t: number; segs: Segment[]}> = ({t, segs}) => {
	const tFlip = cue(segs, /^Today/);
	const tBao = cue(segs, /baobab/i);
	const tDrop = cue(segs, /dry season/i);
	const tRes = cue(segs, /restructuring/i);
	const tRe = cue(segs, /hires them back/i);
	const f = sm(ramp(t, tFlip, tFlip + 1.6));
	const a = f * Math.PI;
	const rot = (p: Pt): Pt => ({
		x: CX + (p.x - CX) * Math.cos(a) - (p.y - CY) * Math.sin(a),
		y: CY + (p.x - CX) * Math.sin(a) + (p.y - CY) * Math.cos(a),
	});
	const title =
		t < tFlip
			? 'ERIE RAILROAD ORG CHART · 1855'
			: t < tBao
				? 'ORG CHART · TODAY'
				: t < tDrop
					? 'BAOBAB (ACTUAL TREE)'
					: t < tRes
						? 'DRY SEASON'
						: t < tRe
							? 'RESTRUCTURING'
							: 'NEXT QUARTER';
	let fallen = 0;
	let hired = 0;
	const leaves = TIPS.map((p, i) => {
		const fs = tDrop + (i % 8) * 0.14 + Math.floor(i / 8) * 0.35;
		const pr = ramp(t, fs, fs + 2.4);
		const r = rot(p);
		const back = t >= tRe;
		const s = back ? sm(ramp(t, tRe + (i % 8) * 0.08, tRe + (i % 8) * 0.08 + 0.5)) : 1;
		if (pr >= 1) fallen += 1;
		if (back && s > 0.5) hired += 1;
		if (!back && pr >= 1) return null;
		const y = r.y + (back ? 0 : pr * pr * 1100);
		const x = r.x + (back ? 0 : Math.sin(i * 3 + pr * 6) * 40 * pr);
		return <circle key={i} cx={x} cy={y} r={18 * s} fill={back ? '#f0b429' : '#4fd1a5'} stroke="#0f2d52" strokeWidth="3" />;
	});
	const head = tDrop === NEVER || t < tDrop ? TIPS.length : TIPS.length - fallen;
	const lbl = (txt: string, x: number, y: number, o: number) => (
		<text
			x={x}
			y={y}
			textAnchor="middle"
			fill="#f2e9d0"
			fontFamily={font}
			fontSize="34"
			fontWeight="700"
			letterSpacing="3"
			opacity={o}
		>
			{txt}
		</text>
	);
	return (
		<Svg>
			<defs>
				<pattern id="bp" width="60" height="60" patternUnits="userSpaceOnUse">
					<path d="M 60 0 L 0 0 0 60" fill="none" stroke="#7fb2ff" strokeWidth="1" opacity="0.22" />
				</pattern>
			</defs>
			<rect width="1080" height="1920" fill="url(#bp)" />
			<text x="540" y="190" textAnchor="middle" fill="#ffffff" fontFamily={font} fontSize="46" fontWeight="800" letterSpacing="2">
				{title}
			</text>
			<g transform={`rotate(${(a * 180) / Math.PI} ${CX} ${CY})`}>
				<line x1="80" y1="1050" x2="1000" y2="1050" stroke="#7fb2ff" strokeWidth="3" strokeDasharray="14 10" />
				{ROOTS.map((b, i) => (
					<line key={'r' + i} x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2} stroke="#f0b86a" strokeWidth={b.w} strokeLinecap="round" />
				))}
				{TREE.map((b, i) => (
					<line key={'t' + i} x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2} stroke="#f2e9d0" strokeWidth={b.w} strokeLinecap="round" />
				))}
			</g>
			{leaves}
			{lbl('PRESIDENT & BOARD', 540, 1372, 1 - f)}
			{lbl('PRESIDENT & BOARD', 540, 400, f)}
			{lbl('WORKERS', 800, 880, 1 - f)}
			{lbl('WORKERS', 280, 892, f)}
			{t >= tDrop ? (
				<g fontFamily={font} fill="#ffffff">
					<text x="60" y="250" fontSize="26" fill="#9fc3ff" letterSpacing="2">
						HEADCOUNT
					</text>
					<text x="60" y="315" fontSize="64" fontWeight="800">
						{head}
					</text>
					{t >= tRe ? (
						<>
							<text x="1020" y="250" textAnchor="end" fontSize="26" fill="#f0b429" letterSpacing="2">
								CONSULTANTS · 2x RATE
							</text>
							<text x="1020" y="315" textAnchor="end" fontSize="64" fontWeight="800" fill="#f0b429">
								{hired}
							</text>
						</>
					) : null}
				</g>
			) : null}
		</Svg>
	);
};

export const OrgTreeShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#0f2d52">
		{(t) => <OrgTree t={t} segs={p.segments} />}
	</Shell>
);

/* ------------------------------------------------------------------ */
/* 2) Deadline: čára na zemi -> buňka v kalendáři, která se posune na pondělí */

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

const Deadline: React.FC<{t: number; segs: Segment[]}> = ({t, segs}) => {
	const tCal = cue(segs, /^Today/);
	const tNotif = cue(segs, /reminder/i);
	const tFri = cue(segs, /It is Friday/);
	const tMove = cue(segs, /moves the line/i);
	const calO = sm(ramp(t, tCal - 0.2, tCal + 0.6));
	const posts = Array.from({length: 15});
	const mins = Math.round(
		t < tFri ? interpolate(t, [tCal, tFri], [9 * 60, 16 * 60 + 58], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 16 * 60 + 59,
	);
	const clock = t >= tMove + 0.9 ? 'FRI 17:00' : `FRI ${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
	const mv = sm(ramp(t, tMove, tMove + 0.9));
	const bx = 115 + 4 * 178 + (115 - (115 + 4 * 178)) * mv;
	const by = 540 + (770 - 540) * mv;
	const toast = ramp(t, tNotif, tNotif + 0.4) * (1 - ramp(t, tNotif + 3, tNotif + 3.4));
	return (
		<Svg>
			<defs>
				<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#e0cba0" />
					<stop offset="1" stopColor="#8f7448" />
				</linearGradient>
			</defs>
			<g opacity={1 - calO}>
				<rect width="1080" height="1920" fill="url(#sky)" />
				<rect y="1000" width="1080" height="920" fill="#6e5434" />
				{posts.map((_, i) => (
					<rect key={i} x={30 + i * 72} y="740" width="26" height="300" fill="#4a3724" />
				))}
				<rect x="0" y="800" width="1080" height="16" fill="#4a3724" />
				<rect x="0" y="900" width="1080" height="16" fill="#4a3724" />
				<rect x="0" y="1260" width="1080" height="22" fill="#b3261e" />
				<text x="540" y="1350" textAnchor="middle" fill="#f6e7c3" fontFamily={font} fontSize="44" fontWeight="800" letterSpacing="4">
					THE DEAD LINE
				</text>
				<text x="540" y="300" textAnchor="middle" fill="#3a2a15" fontFamily={font} fontSize="46" fontWeight="800" letterSpacing="2">
					ANDERSONVILLE · 1864
				</text>
			</g>
			<g opacity={calO}>
				<rect width="1080" height="1920" fill="#e9edf3" />
				<rect x="60" y="250" width="960" height="1010" rx="26" fill="#ffffff" />
				<rect x="60" y="250" width="960" height="120" rx="26" fill="#1f3a5f" />
				<rect x="60" y="320" width="960" height="50" fill="#1f3a5f" />
				<text x="100" y="330" fill="#ffffff" fontFamily={font} fontSize="44" fontWeight="800">
					NOVEMBER
				</text>
				<text x="980" y="330" textAnchor="end" fill="#2dd4bf" fontFamily={font} fontSize="52" fontWeight="800">
					{clock}
				</text>
				{DAYS.map((d, i) => (
					<text key={d} x={115 + i * 178 + 80} y="430" textAnchor="middle" fill="#6b7a90" fontFamily={font} fontSize="26" fontWeight="700" letterSpacing="2">
						{d}
					</text>
				))}
				{[0, 1].map((row) =>
					DAYS.map((_, i) => (
						<rect key={row + '-' + i} x={115 + i * 178} y={470 + row * 230} width="160" height="200" rx="10" fill="#f3f6fb" stroke="#d6deea" strokeWidth="2" />
					)),
				)}
				<text x="115" y="462" fill="#6b7a90" fontFamily={font} fontSize="22" letterSpacing="2">
					THIS WEEK
				</text>
				<text x="115" y="692" fill="#6b7a90" fontFamily={font} fontSize="22" letterSpacing="2">
					NEXT WEEK
				</text>
				<g transform={`translate(${bx} ${by})`}>
					<rect width="160" height="54" rx="10" fill="#d63a2f" />
					<text x="80" y="36" textAnchor="middle" fill="#ffffff" fontFamily={font} fontSize="26" fontWeight="800">
						DEADLINE
					</text>
				</g>
				{t >= tMove + 0.9 ? (
					<text x="540" y="1060" textAnchor="middle" fill="#1f8f6f" fontFamily={font} fontSize="40" fontWeight="800">
						NOTHING HAPPENED
					</text>
				) : null}
				<g opacity={toast} transform={`translate(0 ${(1 - toast) * -40})`}>
					<rect x="120" y="1090" width="840" height="110" rx="20" fill="#1b2433" />
					<circle cx="180" cy="1145" r="22" fill="#f0b429" />
					<text x="225" y="1138" fill="#ffffff" fontFamily={font} fontSize="32" fontWeight="800">
						REMINDER
					</text>
					<text x="225" y="1178" fill="#b8c4d6" fontFamily={font} fontSize="28">
						Deadline approaching
					</text>
				</g>
			</g>
		</Svg>
	);
};

export const DeadlineShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#1a1a1a" vig={0.22}>
		{(t) => <Deadline t={t} segs={p.segments} />}
	</Shell>
);

/* ------------------------------------------------------------------ */
/* 3) Synergie: dva týmy se spojí, část lidí je redundantní, nakonec lišejník */

const Synergy: React.FC<{t: number; segs: Segment[]}> = ({t, segs}) => {
	const tTwo = cue(segs, /two of everything/i);
	const tSave = cue(segs, /thirty percent/i);
	const tRed = cue(segs, /redundancy is/i);
	const tOne = cue(segs, /same job, and then/i);
	const tSlide = cue(segs, /one plus one/i);
	const tSev = cue(segs, /severance/i);
	const tLich = cue(segs, /lichen/i);
	const tEnd = cue(segs, /never been/i);
	const intro = 1 - sm(ramp(t, tTwo - 0.1, tTwo + 0.4));
	const team = sm(ramp(t, tTwo, tTwo + 0.5)) * (1 - sm(ramp(t, tSlide - 0.1, tSlide + 0.4)));
	const eq = sm(ramp(t, tSlide, tSlide + 0.5)) * (1 - sm(ramp(t, tLich - 0.1, tLich + 0.4)));
	const lich = sm(ramp(t, tLich, tLich + 0.5));
	const save = ramp(t, tSave, tSave + 1.2);
	const cut = sm(ramp(t, tOne, tOne + 0.8));
	const mark = t >= tRed;
	const redundant = [7, 8, 9, 17, 18, 19];
	const headcount = t >= tOne + 0.8 ? 14 : 20;
	const dots = Array.from({length: 20}).map((_, i) => {
		const company = i < 10 ? 0 : 1;
		const k = i % 10;
		const x = (company === 0 ? 150 : 650) + (k % 5) * 70;
		const y = 600 + Math.floor(k / 5) * 80;
		const red = redundant.includes(i);
		const base = company === 0 ? '#2563eb' : '#ea7a1a';
		return (
			<g key={i}>
				<circle cx={x} cy={y} r="26" fill={red && cut > 0 ? '#c5ccd6' : base} opacity={red ? 1 - cut * 0.6 : 1} />
				{red && mark ? <circle cx={x} cy={y} r="32" fill="none" stroke="#d63a2f" strokeWidth="5" opacity={1 - cut * 0.6} /> : null}
			</g>
		);
	});
	return (
		<Svg>
			<rect width="1080" height="1920" fill="#f4f6fa" />
			<rect width="1080" height="170" fill="#1b2a4a" />
			<text x="60" y="105" fill="#ffffff" fontFamily={font} fontSize="34" fontWeight="700" letterSpacing="3">
				Q4 INTEGRATION · SYNERGY WORKSHOP
			</text>
			<g opacity={intro}>
				<text x="540" y="720" textAnchor="middle" fill="#1b2a4a" fontFamily={font} fontSize="170" fontWeight="800">
					SYNERGY
				</text>
				<text x="540" y="810" textAnchor="middle" fill="#5b6b86" fontFamily={font} fontSize="40">
					synergía · working together
				</text>
			</g>
			<g opacity={team}>
				<rect x="90" y="300" width="400" height="150" rx="16" fill="#2563eb" />
				<text x="290" y="395" textAnchor="middle" fill="#fff" fontFamily={font} fontSize="54" fontWeight="800">
					ACME
				</text>
				<rect x="590" y="300" width="400" height="150" rx="16" fill="#ea7a1a" />
				<text x="790" y="395" textAnchor="middle" fill="#fff" fontFamily={font} fontSize="54" fontWeight="800">
					GLOBEX
				</text>
				<text x="540" y="540" textAnchor="middle" fill="#5b6b86" fontFamily={font} fontSize="30" letterSpacing="2">
					TWO OF EVERYTHING
				</text>
				{dots}
				<g opacity={save}>
					<text x="90" y="880" fill="#5b6b86" fontFamily={font} fontSize="28" letterSpacing="2">
						EXPECTED SAVINGS
					</text>
					<rect x="90" y="900" width="900" height="34" rx="17" fill="#dfe5ef" />
					<rect x="90" y="900" width={900 * 0.3 * save} height="34" rx="17" fill="#1f8f6f" />
					<text x="990" y="880" textAnchor="end" fill="#1f8f6f" fontFamily={font} fontSize="44" fontWeight="800">
						{Math.round(30 * save)}%
					</text>
				</g>
				{t >= tRed ? (
					<g>
						<text x="90" y="1040" fill="#5b6b86" fontFamily={font} fontSize="28" letterSpacing="2">
							HEADCOUNT
						</text>
						<text x="90" y="1150" fill="#1b2a4a" fontFamily={font} fontSize="110" fontWeight="800">
							{headcount}
						</text>
						<text x="990" y="1150" textAnchor="end" fill="#d63a2f" fontFamily={font} fontSize="38" fontWeight="800" letterSpacing="2">
							REDUNDANCIES: 6
						</text>
					</g>
				) : null}
			</g>
			<g opacity={eq}>
				<text x="540" y="760" textAnchor="middle" fill="#1b2a4a" fontFamily={font} fontSize="200" fontWeight="800">
					1 + 1 = 3
				</text>
				{t >= tSev ? (
					<text x="540" y="900" textAnchor="middle" fill="#d63a2f" fontFamily={font} fontSize="46" fontWeight="800">
						3 = SEVERANCE PACKAGE
					</text>
				) : null}
			</g>
			<g opacity={lich}>
				<text x="540" y="420" textAnchor="middle" fill="#1b2a4a" fontFamily={font} fontSize="64" fontWeight="800">
					LICHEN
				</text>
				<text x="540" y="480" textAnchor="middle" fill="#5b6b86" fontFamily={font} fontSize="34" letterSpacing="2">
					FUNGUS + ALGA
				</text>
				<ellipse cx="540" cy="1000" rx="340" ry="150" fill="#8b8f96" />
				<ellipse cx="480" cy="900" rx="200" ry="90" fill="#c9b27c" />
				{[[430, 880], [490, 905], [540, 870], [580, 910], [460, 930], [520, 850]].map(([x, y], i) => (
					<circle key={i} cx={x} cy={y} r="16" fill="#4caf50" />
				))}
				<text x="540" y="1180" textAnchor="middle" fill="#5b6b86" fontFamily={font} fontSize="30" letterSpacing="2">
					MEETINGS ATTENDED TOGETHER
				</text>
				<text x="540" y="1290" textAnchor="middle" fill="#1f8f6f" fontFamily={font} fontSize="120" fontWeight="800">
					0
				</text>
				{t >= tEnd ? (
					<text x="540" y="1340" textAnchor="middle" fill="#1f8f6f" fontFamily={font} fontSize="34" fontWeight="800" letterSpacing="2">
						WORKS
					</text>
				) : null}
			</g>
		</Svg>
	);
};

export const SynergyShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#f4f6fa" vig={0.1}>
		{(t) => <Synergy t={t} segs={p.segments} />}
	</Shell>
);
