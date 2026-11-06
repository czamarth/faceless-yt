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
import {GratitudeWallShort} from './GratitudeWallShort';
import {UseItOrLoseItShort} from './UseItOrLoseItShort';
import {HolidayPartyShort} from './HolidayPartyShort';
import {AbileneParadoxShort} from './AbileneParadoxShort';
import {SkeletonCrewShort} from './SkeletonCrewShort';
import {UnlimitedVacationShort} from './UnlimitedVacationShort';
import {ResolutionsRoadmapShort} from './ResolutionsRoadmapShort';
import {GoodhartOkrShort} from './GoodhartOkrShort';
import {CircleBackShort} from './CircleBackShort';
import {PeterPrincipleShort} from './PeterPrincipleShort';
import {FireTicketShort} from './FireTicketShort';
import {LoveContractShort} from './LoveContractShort';
import {RingelmannShort} from './RingelmannShort';
import {SlackArchaeologyShort} from './SlackArchaeologyShort';
import {HofstadterShort} from './HofstadterShort';
import {DaylightMeetingShort} from './DaylightMeetingShort';
import {BikesheddingShort} from './BikesheddingShort';
import {OnMuteShort} from './OnMuteShort';
import {EndOfMeetingsShort} from './EndOfMeetingsShort';
import {BrooksLawShort} from './BrooksLawShort';
import {ExcelCovidShort} from './ExcelCovidShort';
import {ConwaysLawShort} from './ConwaysLawShort';
import {CubicleInventorShort} from './CubicleInventorShort';
import {StandupShort} from './StandupShort';

// Díly ročního plánu (faceless-yt-brain/plan.csv): +36 snímků = pointa drží 1,2 s po hlasu (style guide)
const planShorts = [
	{id: 'WatermelonShort', component: WatermelonShort}, // W01
	{id: 'TableThisShort', component: TableThisShort}, // W02
	{id: 'GratitudeWallShort', component: GratitudeWallShort}, // W03
	{id: 'UseItOrLoseItShort', component: UseItOrLoseItShort}, // W04
	{id: 'HolidayPartyShort', component: HolidayPartyShort}, // W05
	{id: 'AbileneParadoxShort', component: AbileneParadoxShort}, // W06
	{id: 'SkeletonCrewShort', component: SkeletonCrewShort}, // W07
	{id: 'UnlimitedVacationShort', component: UnlimitedVacationShort}, // W08
	{id: 'ResolutionsRoadmapShort', component: ResolutionsRoadmapShort}, // W09
	{id: 'GoodhartOkrShort', component: GoodhartOkrShort}, // W10
	{id: 'CircleBackShort', component: CircleBackShort}, // W11
	{id: 'PeterPrincipleShort', component: PeterPrincipleShort}, // W12
	{id: 'FireTicketShort', component: FireTicketShort}, // W13
	{id: 'LoveContractShort', component: LoveContractShort}, // W14
	{id: 'RingelmannShort', component: RingelmannShort}, // W15
	{id: 'SlackArchaeologyShort', component: SlackArchaeologyShort}, // W16
	{id: 'HofstadterShort', component: HofstadterShort}, // W17
	{id: 'DaylightMeetingShort', component: DaylightMeetingShort}, // W18
	{id: 'BikesheddingShort', component: BikesheddingShort}, // W19
	{id: 'OnMuteShort', component: OnMuteShort}, // W20
	{id: 'EndOfMeetingsShort', component: EndOfMeetingsShort}, // W21
	{id: 'BrooksLawShort', component: BrooksLawShort}, // W22
	{id: 'ExcelCovidShort', component: ExcelCovidShort}, // W23
	{id: 'ConwaysLawShort', component: ConwaysLawShort}, // W24
	{id: 'CubicleInventorShort', component: CubicleInventorShort}, // W25
	{id: 'StandupShort', component: StandupShort}, // W26
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
