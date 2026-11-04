import React from 'react';
import {AbsoluteFill} from 'remotion';

const font = 'Segoe UI, Arial, sans-serif';

// Banner kanálu 2560x1440. Na všech zařízeních je vidět jen střední pruh 1546x423 (x 507–2053, y 508–931),
// proto je v něm logo a text; po stranách jsou jen dekorace z videí (kalendář s deadlinem, počítadlo promluv).
export const Banner: React.FC = () => {
	const ticks = Array.from({length: 12});
	return (
		<AbsoluteFill>
			<svg width="2560" height="1440" viewBox="0 0 2560 1440">
				<defs>
					<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0" stopColor="#1d3f6e" />
						<stop offset="1" stopColor="#0a1529" />
					</linearGradient>
					<pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
						<path d="M 80 0 L 0 0 0 80" fill="none" stroke="#7fb2ff" strokeWidth="1.5" opacity="0.14" />
					</pattern>
				</defs>
				<rect width="2560" height="1440" fill="url(#bg)" />
				<rect width="2560" height="1440" fill="url(#grid)" />

				{/* levá dekorace: kalendář s deadlinem */}
				<g opacity="0.85">
					<rect x="130" y="470" width="340" height="430" rx="26" fill="#f4f1e8" />
					<rect x="130" y="470" width="340" height="86" rx="26" fill="#d63a2f" />
					<rect x="130" y="520" width="340" height="36" fill="#d63a2f" />
					{[0, 1, 2].map((r) =>
						[0, 1, 2].map((c) => (
							<rect key={r + '-' + c} x={160 + c * 100} y={590 + r * 100} width="80" height="80" rx="10" fill="#dfe5ef" />
						)),
					)}
					<rect x="150" y="780" width="300" height="52" rx="10" fill="#d63a2f" />
					<text x="300" y="817" textAnchor="middle" fill="#fff" fontFamily={font} fontSize="30" fontWeight="800">
						DEADLINE
					</text>
				</g>

				{/* pravá dekorace: počítadlo promluv */}
				<g opacity="0.85">
					<rect x="2090" y="470" width="340" height="430" rx="26" fill="#12294a" stroke="#f4f1e8" strokeWidth="8" />
					<text x="2130" y="540" fill="#9fb3c8" fontFamily={font} fontSize="26" letterSpacing="2">
						TIMES SPOKEN
					</text>
					<text x="2130" y="680" fill="#ffffff" fontFamily={font} fontSize="140" fontWeight="800">
						147
					</text>
					<text x="2130" y="740" fill="#9fb3c8" fontFamily={font} fontSize="24" letterSpacing="2">
						ENGAGEMENT
					</text>
					<rect x="2130" y="760" width="260" height="22" rx="11" fill="#1d3a5c" />
					<rect x="2130" y="760" width="240" height="22" rx="11" fill="#2dd4bf" />
				</g>

				{/* logo (stejné jako profilovka) v bezpečné zóně */}
				<g transform="translate(560 545) scale(0.6) translate(-250 -120)">
					<rect x="250" y="120" width="300" height="560" rx="50" fill="#f4f1e8" />
					<rect x="272" y="142" width="256" height="516" rx="34" fill="#12294a" />
					<g transform="translate(400 330)">
						<circle r="98" fill="#f4f1e8" />
						{ticks.map((_, i) => (
							<line key={i} x1="0" y1="-80" x2="0" y2="-90" stroke="#12294a" strokeWidth="6" transform={`rotate(${i * 30})`} />
						))}
						<line x1="0" y1="8" x2="-52" y2="0" stroke="#12294a" strokeWidth="11" strokeLinecap="round" />
						<line x1="0" y1="10" x2="0" y2="-72" stroke="#d63a2f" strokeWidth="7" strokeLinecap="round" />
						<circle r="9" fill="#12294a" />
					</g>
					<circle cx="400" cy="548" r="66" fill="#f0b429" />
					<polygon points="382,515 382,581 438,548" fill="#12294a" />
				</g>

				{/* název */}
				<text x="800" y="650" fill="#f4f1e8" fontFamily={font} fontSize="86" fontWeight="800" letterSpacing="3">
					THIS COULD HAVE BEEN
				</text>
				<text x="796" y="790" fill="#f0b429" fontFamily={font} fontSize="150" fontWeight="800" letterSpacing="2">
					A SHORT
				</text>
				<text x="802" y="880" fill="#b8c4d6" fontFamily={font} fontSize="40" letterSpacing="2">
					Corporate absurdity in under a minute.
				</text>
			</svg>
		</AbsoluteFill>
	);
};
