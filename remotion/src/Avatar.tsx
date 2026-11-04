import React from 'react';
import {AbsoluteFill} from 'remotion';

// Profilovka kanálu "This Could Have Been a Short": svislé video (Short), v něm hodiny a tlačítko play.
// Obsah drží uvnitř kruhu o poloměru ~330 px, protože YouTube ořezává avatar do kruhu.
export const Avatar: React.FC = () => {
	const ticks = Array.from({length: 12});
	return (
		<AbsoluteFill>
			<svg width="800" height="800" viewBox="0 0 800 800">
				<defs>
					<radialGradient id="bg" cx="0.5" cy="0.4" r="0.8">
						<stop offset="0" stopColor="#2c4c80" />
						<stop offset="1" stopColor="#101c34" />
					</radialGradient>
				</defs>
				<rect width="800" height="800" fill="url(#bg)" />
				{/* tělo telefonu / Shortu */}
				<rect x="250" y="120" width="300" height="560" rx="50" fill="#f4f1e8" />
				<rect x="272" y="142" width="256" height="516" rx="34" fill="#12294a" />
				{/* hodiny */}
				<g transform="translate(400 330)">
					<circle r="98" fill="#f4f1e8" />
					{ticks.map((_, i) => (
						<line key={i} x1="0" y1="-80" x2="0" y2="-90" stroke="#12294a" strokeWidth="6" transform={`rotate(${i * 30})`} />
					))}
					<line x1="0" y1="8" x2="-52" y2="0" stroke="#12294a" strokeWidth="11" strokeLinecap="round" />
					<line x1="0" y1="10" x2="0" y2="-72" stroke="#d63a2f" strokeWidth="7" strokeLinecap="round" />
					<circle r="9" fill="#12294a" />
				</g>
				{/* play */}
				<circle cx="400" cy="548" r="66" fill="#f0b429" />
				<polygon points="382,515 382,581 438,548" fill="#12294a" />
			</svg>
		</AbsoluteFill>
	);
};
