import React from 'react';
import {
	AbsoluteFill,
	Sequence,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

const font = 'Segoe UI, Arial, sans-serif';

const Title: React.FC<{text: string; sub?: string}> = ({text, sub}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame, fps, config: {damping: 200}});
	return (
		<AbsoluteFill
			style={{
				background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
				justifyContent: 'center',
				alignItems: 'center',
				fontFamily: font,
				color: 'white',
			}}
		>
			<div
				style={{
					fontSize: 140,
					fontWeight: 700,
					opacity: s,
					transform: `translateY(${(1 - s) * 60}px)`,
				}}
			>
				{text}
			</div>
			{sub ? (
				<div style={{fontSize: 48, opacity: s * 0.8, marginTop: 24}}>{sub}</div>
			) : null}
		</AbsoluteFill>
	);
};

const values = [
	{label: 'Po', v: 40},
	{label: 'Út', v: 65},
	{label: 'St', v: 50},
	{label: 'Čt', v: 85},
	{label: 'Pá', v: 100},
];

const Chart: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const maxH = 600;
	return (
		<AbsoluteFill
			style={{
				background: '#0f172a',
				fontFamily: font,
				color: 'white',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<div style={{fontSize: 72, fontWeight: 700, marginBottom: 60}}>
				Animovaný graf
			</div>
			<div style={{display: 'flex', alignItems: 'flex-end', gap: 60, height: maxH}}>
				{values.map((d, i) => {
					const p = spring({
						frame: frame - i * 6,
						fps,
						config: {damping: 18},
					});
					return (
						<div key={d.label} style={{textAlign: 'center'}}>
							<div
								style={{
									width: 140,
									height: (d.v / 100) * maxH * p,
									background: '#38bdf8',
									borderRadius: '12px 12px 0 0',
								}}
							/>
							<div style={{fontSize: 40, marginTop: 12}}>{d.label}</div>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

const Outro: React.FC = () => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [0, 20, 80, 90], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return (
		<AbsoluteFill
			style={{
				background: 'linear-gradient(135deg, #1e3a8a, #0f172a)',
				justifyContent: 'center',
				alignItems: 'center',
				fontFamily: font,
				color: 'white',
			}}
		>
			<div style={{fontSize: 120, fontWeight: 700, opacity: o}}>Konec testu</div>
		</AbsoluteFill>
	);
};

// 10 s @ 30 fps: úvod 3 s, graf 4 s, závěr 3 s
export const TestPipeline: React.FC = () => {
	return (
		<AbsoluteFill>
			<Sequence from={0} durationInFrames={90}>
				<Title text="Test pipeline" sub="faceless-yt" />
			</Sequence>
			<Sequence from={90} durationInFrames={120}>
				<Chart />
			</Sequence>
			<Sequence from={210} durationInFrames={90}>
				<Outro />
			</Sequence>
		</AbsoluteFill>
	);
};
