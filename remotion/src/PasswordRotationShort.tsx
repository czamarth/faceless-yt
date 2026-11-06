import React from 'react';
import type {ShortProps} from './CorporateShort';
import {Shell, Svg, cue, font} from './ConceptShorts';
import {BLUE, Bean, GOLD, GREEN, INK, RED, pop} from './WatermelonShort';
import {ChannelStamp, Pill, PunchStamp, ease} from './PlanKit';

/*
 * W28 "Password rotation" (visuals/password-rotation.md), přihlašovací okno.
 * Expirace po 90 dnech -> Password1/2/3 -> NIST 2017 -> politika a audit -> znovu expirace, "Security recommends something harder".
 */

const NAVY = '#243A66';
const GRAY = '#7B8498';
const MONO = "Consolas, 'Courier New', monospace";

const Login: React.FC<{y: number; error: string | null; pw: string; strength: number; errO: number}> = ({y, error, pw, strength, errO}) => (
	<g>
		<rect x="110" y={y} width="860" height="640" rx="26" fill="#fff" stroke={INK} strokeWidth="5" />
		<rect x="110" y={y} width="860" height="80" rx="26" fill={NAVY} />
		<rect x="110" y={y + 50} width="860" height="30" fill={NAVY} />
		<text x="540" y={y + 55} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" letterSpacing="5" fill="#fff">
			CORPORATE LOGIN
		</text>
		{error ? (
			<g opacity={errO}>
				<rect x="150" y={y + 110} width="780" height="84" rx="14" fill="#FFE3E3" stroke={RED} strokeWidth="5" />
				<text x="540" y={y + 165} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="38" fill={RED}>
					{error}
				</text>
			</g>
		) : null}
		<text x="160" y={y + 270} fontFamily={font} fontWeight="800" fontSize="28" letterSpacing="3" fill={GRAY}>
			NEW PASSWORD
		</text>
		<rect x="150" y={y + 290} width="780" height="86" rx="14" fill="#F1F4FA" stroke={INK} strokeWidth="4" />
		<text x="180" y={y + 349} fontFamily={MONO} fontWeight="700" fontSize="44" fill={INK}>
			{pw}
		</text>
		<text x="160" y={y + 450} fontFamily={font} fontWeight="800" fontSize="28" letterSpacing="3" fill={GRAY}>
			STRENGTH
		</text>
		<rect x="150" y={y + 470} width="780" height="34" rx="17" fill="#E2E7F1" stroke={INK} strokeWidth="3" />
		<rect x="150" y={y + 470} width={780 * strength} height="34" rx="17" fill={strength > 0.6 ? GREEN : strength > 0.3 ? GOLD : RED} />
		<rect x="560" y={y + 548} width="370" height="64" rx="32" fill={BLUE} />
		<text x="745" y={y + 592} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="30" fill="#fff">
			CHANGE PASSWORD
		</text>
	</g>
);

const Scene: React.FC<{t: number; segs: ShortProps['segments']; total: number}> = ({t, segs, total}) => {
	const tExp = cue(segs, /^your password has expired/);
	const tChange = cue(segs, /^So you change it/);
	const tOne = cue(segs, /^Password one/);
	const tTwo = cue(segs, /^Password two/);
	const tPolicy = cue(segs, /^For years/);
	const tNist = cue(segs, /^Then, in twenty/);
	const tWorse = cue(segs, /^People pick worse/);
	const tNoticed = cue(segs, /^Many companies noticed/);
	const tNothing = cue(segs, /^Many companies did nothing/);
	const tRule = cue(segs, /^Because the rule/);
	const tAudit = cue(segs, /^And the policy/);
	const tQuarter = cue(segs, /^So this quarter/);
	const tHarder = cue(segs, /^Security recommends/);

	const loginO = pop(t, 0.1, 0.4) * (1 - ease(t, tPolicy - 0.3, tPolicy)) + ease(t, tQuarter - 0.1, tQuarter + 0.3);
	const pw = t >= tTwo ? 'Password3' : t >= tOne ? 'Password2' : t >= tChange ? 'Password1' : '';
	const strength = t >= tWorse ? 0.2 : t >= tTwo ? 0.3 : t >= tOne ? 0.3 : 0.3;
	const showStrength = t >= tChange ? strength : 0;
	const polO = ease(t, tPolicy, tPolicy + 0.3) * (1 - ease(t, tNist - 0.3, tNist));
	const nistO = ease(t, tNist, tNist + 0.3) * (1 - ease(t, tQuarter - 0.3, tQuarter));
	const days = Math.min(90, Math.round(ease(t, 0.2, 2.0) * 90));

	return (
		<Svg>
			{loginO > 0.01 ? (
				<g opacity={Math.min(1, loginO)}>
					<Pill y={400} w={620} label={`PASSWORD AGE: ${days} DAYS`} color={RED} fs={32} o={1 - ease(t, tChange, tChange + 0.2)} />
					<Login y={470} error={t >= tExp || t >= tQuarter ? 'YOUR PASSWORD HAS EXPIRED' : null} errO={ease(t, tExp, tExp + 0.3) + ease(t, tQuarter, tQuarter + 0.3) * 0} pw={t >= tQuarter ? '' : pw} strength={t >= tQuarter ? 0.2 : showStrength} />
					{t >= tHarder ? (
						<g opacity={ease(t, tHarder, tHarder + 0.3)} transform="translate(540 1170)">
							<rect x="-420" y="-44" width="840" height="88" rx="44" fill="#fff" stroke={INK} strokeWidth="5" />
							<text x="0" y="14" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="28" fill={INK}>
								SECURITY: “RECOMMEND SOMETHING HARDER”
							</text>
						</g>
					) : null}
				</g>
			) : null}

			{polO > 0.01 ? (
				<g opacity={polO}>
					<rect x="110" y="470" width="860" height="560" rx="26" fill="#fff" stroke={INK} strokeWidth="5" />
					<text x="540" y="590" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="60" letterSpacing="5" fill={NAVY}>
						SECURITY POLICY
					</text>
					<text x="540" y="700" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="46" fill={INK}>
						CHANGE PASSWORD
					</text>
					<text x="540" y="770" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="46" fill={RED}>
						EVERY 90 DAYS
					</text>
					<Pill y={900} w={600} label="FOR YEARS" color={GRAY} fs={32} o={1} />
				</g>
			) : null}

			{nistO > 0.01 ? (
				<g opacity={nistO}>
					<rect x="110" y="440" width="860" height="730" rx="26" fill="#fff" stroke={INK} strokeWidth="5" />
					<text x="540" y="520" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="40" letterSpacing="4" fill={GRAY}>
						NIST · 2017
					</text>
					{['DO NOT FORCE', 'PERIODIC PASSWORD', 'CHANGES'].map((l, i) => (
						<text key={l} x="540" y={640 + i * 90} textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="64" fill={i === 2 ? RED : INK} opacity={ease(t, tNist + 1.2 + i * 1.2, tNist + 1.5 + i * 1.2)}>
							{l}
						</text>
					))}
					<g opacity={ease(t, tWorse, tWorse + 0.3)}>
						<text x="540" y="930" textAnchor="middle" fontFamily={font} fontWeight="800" fontSize="34" fill={GRAY}>
							FORCED CHANGES → WORSE PASSWORDS
						</text>
						<text x="540" y="1010" textAnchor="middle" fontFamily={MONO} fontWeight="700" fontSize="46" fill={RED}>
							Password1 → Password2 → Password3
						</text>
					</g>
					<g opacity={ease(t, tNoticed, tNoticed + 0.3)}>
						<rect x="130" y="1060" width="820" height="90" rx="45" fill="#E3F6EC" stroke={GREEN} strokeWidth="5" />
						<text x="540" y="1118" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" fill={GREEN}>
							MANY COMPANIES NOTICED
						</text>
					</g>
					<g opacity={ease(t, tNothing, tNothing + 0.3)}>
						<rect x="130" y="1060" width="820" height="90" rx="45" fill="#FFE3E3" stroke={RED} strokeWidth="5" />
						<text x="540" y="1118" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="34" fill={RED}>
							MANY COMPANIES DID NOTHING
						</text>
					</g>
					{t >= tRule ? (
						<g opacity={ease(t, tRule, tRule + 0.3)}>
							<rect x="115" y="445" width="850" height="715" rx="22" fill="#F8F5E8" stroke={INK} strokeWidth="5" />
							<text x="540" y="740" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="46" fill={INK}>
								THE RULE IS IN THE POLICY
							</text>
							<g opacity={ease(t, tAudit, tAudit + 0.3)}>
								<text x="540" y="840" textAnchor="middle" fontFamily={font} fontWeight="900" fontSize="46" fill={INK}>
									THE POLICY IS IN THE AUDIT
								</text>
							</g>
						</g>
					) : null}
				</g>
			) : null}
			{t < tQuarter - 0.2 ? <PunchStamp t={t} at={tAudit + 0.5} lines={['AUDIT', 'PASSED']} color={GREEN} y={1000} size={80} /> : null}
			<ChannelStamp t={t} total={total} />
		</Svg>
	);
};

export const PasswordRotationShort: React.FC<ShortProps> = (p) => (
	<Shell {...p} bg="#1B2748" vig={0.45}>
		{(t) => <Scene t={t} segs={p.segments} total={p.totalSeconds} />}
	</Shell>
);
