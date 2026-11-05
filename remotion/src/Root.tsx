import React from 'react';
import {Composition} from 'remotion';
import {TestPipeline} from './TestPipeline';
import {CorporateShort, ShortProps} from './CorporateShort';
import {RoomShort} from './RoomShort';
import {Avatar} from './Avatar';
import {Banner} from './Banner';
import {DeadlineShort, OrgTreeShort, SynergyShort} from './ConceptShorts';
import {WatermelonShort} from './WatermelonShort';
import {TableThisShort} from './TableThisShort';

// Díly ročního plánu (faceless-yt-brain/plan.csv): +36 snímků = pointa drží 1,2 s po hlasu (style guide)
const planShorts = [
	{id: 'WatermelonShort', component: WatermelonShort}, // W01
	{id: 'TableThisShort', component: TableThisShort}, // W02
];

const shortMeta = ({props}: {props: ShortProps}) => ({
	durationInFrames: Math.ceil(props.totalSeconds * 30) + 15,
});

const defaultShort: ShortProps = {totalSeconds: 5, audio: '', segments: []};

export const Root: React.FC = () => {
	return (
		<>
			<Composition
				id="TestPipeline"
				component={TestPipeline}
				durationInFrames={300}
				fps={30}
				width={1920}
				height={1080}
			/>
			{/* Short: vertikální 1080x1920; délku určuje timeline předaná přes --props */}
			<Composition
				id="CorporateShort"
				component={CorporateShort}
				durationInFrames={150}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={defaultShort}
				calculateMetadata={({props}) => ({
					durationInFrames: Math.ceil(props.totalSeconds * 30) + 15,
				})}
			/>
			{/* Shorty podle scénářů z lucy: organizační schéma, deadline, synergie */}
			{[
				{id: 'OrgTreeShort', component: OrgTreeShort},
				{id: 'DeadlineShort', component: DeadlineShort},
				{id: 'SynergyShort', component: SynergyShort},
			].map((c) => (
				<Composition
					key={c.id}
					id={c.id}
					component={c.component}
					durationInFrames={150}
					fps={30}
					width={1080}
					height={1920}
					defaultProps={defaultShort}
					calculateMetadata={shortMeta}
				/>
			))}
			{planShorts.map((c) => (
				<Composition
					key={c.id}
					id={c.id}
					component={c.component}
					durationInFrames={150}
					fps={30}
					width={1080}
					height={1920}
					defaultProps={defaultShort}
					calculateMetadata={({props}) => ({
						durationInFrames: Math.ceil(props.totalSeconds * 30) + 36,
					})}
				/>
			))}
			{/* Banner kanálu (still 2560x1440) */}
			<Composition id="Banner" component={Banner} durationInFrames={1} fps={30} width={2560} height={1440} />
			{/* Profilovka kanálu (still 800x800) */}
			<Composition id="Avatar" component={Avatar} durationInFrames={1} fps={30} width={800} height={800} />
			{/* Short ve stylu dokumentu: zasedačka s počítadlem promluv */}
			<Composition
				id="RoomShort"
				component={RoomShort}
				durationInFrames={150}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={defaultShort}
				calculateMetadata={({props}) => ({
					durationInFrames: Math.ceil(props.totalSeconds * 30) + 15,
				})}
			/>
		</>
	);
};
