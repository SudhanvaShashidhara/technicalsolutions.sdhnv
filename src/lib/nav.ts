export interface NavItem {
	href: string;
	label: string;
	shortLabel: string;
	description: string;
	badge?: string;
}

export interface NavGroup {
	id: 'lead' | 'ec' | 'sa360' | 'tools';
	title: string;
	accent: 'blue' | 'red' | 'yellow' | 'green';
	summary: string;
	items: NavItem[];
}

export const leadScoringLinks: NavItem[] = [
	{
		href: '/lead-scoring/google-tag-1',
		label: 'Google Tag (HTML Attributes)',
		shortLabel: 'Google Tag [1]',
		description: 'Reads predefined data-lead-value attributes from selected HTML options.',
		badge: 'gtag.js'
	},
	{
		href: '/lead-scoring/google-tag-2',
		label: 'Google Tag (Programmatic)',
		shortLabel: 'Google Tag [2]',
		description: 'Computes qualification value in JavaScript lookup maps without DOM attributes.',
		badge: 'gtag.js'
	},
	{
		href: '/lead-scoring/gtm-1',
		label: 'GTM (dataLayer)',
		shortLabel: 'GTM [1]',
		description: 'Pushes structured form fields to dataLayer for GTM Lookup Table scoring.',
		badge: 'dataLayer'
	},
	{
		href: '/lead-scoring/gtm-2',
		label: 'GTM (Combined Score)',
		shortLabel: 'GTM [2]',
		description: 'Sums multi-field scores in code and dispatches both dataLayer and gtag events.',
		badge: 'GTM + gtag'
	},
	{
		href: '/lead-scoring/multiple-checkbox',
		label: 'Multiple Checkboxes (gtag)',
		shortLabel: 'Multi-Checkbox',
		description: 'Aggregates lead values across multi-select checkbox inputs into a single score.',
		badge: 'gtag.js'
	}
];

export const enhancedConversionsLinks: NavItem[] = [
	{
		href: '/adsenhancedconversions/automatic',
		label: 'Automatic Detection',
		shortLabel: 'Automatic',
		description: 'Lets Google Tag automatically detect standard email and tel form inputs.',
		badge: 'Auto'
	},
	{
		href: '/adsenhancedconversions/css-selector',
		label: 'CSS Selector',
		shortLabel: 'CSS Selector',
		description: 'Exposes .ec_email and .ec_tel DOM selectors in the confirmation state.',
		badge: 'DOM'
	},
	{
		href: '/adsenhancedconversions/javascript',
		label: 'JavaScript Variable',
		shortLabel: 'JavaScript',
		description: 'Populates window.enhanced_conversion_data with normalized user fields.',
		badge: 'Window Var'
	},
	{
		href: '/adsenhancedconversions/code',
		label: 'GTM dataLayer (Code)',
		shortLabel: 'Code / dataLayer',
		description: 'Pushes user-provided data with form_submit_complete_dl to window.dataLayer.',
		badge: 'dataLayer'
	},
	{
		href: '/adsenhancedconversions/prehash',
		label: 'Pre-hashed (SHA-256)',
		shortLabel: 'Pre-hashed',
		description: 'Normalizes and SHA-256 hex-hashes user PII in browser before tag dispatch.',
		badge: 'SHA-256'
	}
];

export const sa360Links: NavItem[] = [
	{
		href: '/sa360/googletag',
		label: 'Google Tag (Floodlight)',
		shortLabel: 'Google Tag',
		description: 'Fires a Search Ads 360 Floodlight conversion directly via gtag.js.',
		badge: 'gtag.js'
	},
	{
		href: '/sa360/gtm/datalayer',
		label: 'GTM (dataLayer)',
		shortLabel: 'GTM dataLayer',
		description: 'Pushes custom Floodlight variables (u1, u2, value, ord) to dataLayer.',
		badge: 'dataLayer'
	},
	{
		href: '/sa360/gtm/floodlightformatted',
		label: 'GTM (Floodlight Formatted)',
		shortLabel: 'Floodlight Format',
		description: 'Emits standard Floodlight Counter/Sales parameters (cost, qty, ord, u-vars).',
		badge: 'Floodlight'
	},
	{
		href: '/sa360/gtm/javascript',
		label: 'GTM (JavaScript Variable)',
		shortLabel: 'JS Variable',
		description: 'Populates window.floodlight_data for GTM Custom JS / Variable extraction.',
		badge: 'Window Var'
	}
];

export const toolsLinks: NavItem[] = [
	{
		href: '/contact',
		label: 'Contact & SHA-256 Tester',
		shortLabel: 'Contact & Hasher',
		description: 'Test Google Ads email/phone normalization and inspect SHA-256 digests.',
		badge: 'API'
	},
	{
		href: '/iframe/typeform',
		label: 'Typeform Iframe Embed',
		shortLabel: 'Typeform',
		description: 'Embedded Typeform lead capture for cross-frame GTM measurement testing.',
		badge: 'Iframe'
	},
	{
		href: '/iframe/calendly',
		label: 'Calendly Iframe Embed',
		shortLabel: 'Calendly',
		description: 'Embedded Calendly booking widget with postMessage / redirect confirmation.',
		badge: 'Iframe'
	},
	{
		href: '/ogt/landing-page?gclid=TeSt_GcLiD_987XYZ',
		label: 'OGT GCLID Redirect Test',
		shortLabel: 'OGT GCLID',
		description: 'Demonstrates server-hook GCLID case normalization via 302 redirect.',
		badge: 'SSR Hook'
	}
];

export const navGroups: NavGroup[] = [
	{
		id: 'lead',
		title: 'Lead Scoring',
		accent: 'blue',
		summary: 'Assign qualification values to leads via HTML attributes, JS maps, or GTM.',
		items: leadScoringLinks
	},
	{
		id: 'ec',
		title: 'Enhanced Conversions',
		accent: 'red',
		summary: 'First-party user data capture across auto, CSS, JS, dataLayer, and SHA-256.',
		items: enhancedConversionsLinks
	},
	{
		id: 'sa360',
		title: 'Search Ads 360',
		accent: 'yellow',
		summary: 'Floodlight Counter and Sales measurement via Google Tag and GTM.',
		items: sa360Links
	},
	{
		id: 'tools',
		title: 'Tools & Embeds',
		accent: 'green',
		summary: 'SHA-256 hash verifier, cross-domain iframe widgets, and GCLID diagnostics.',
		items: toolsLinks
	}
];

export const serviceOptions = [
	{ value: 'door_service', label: 'Door Service', leadValue: 10 },
	{ value: 'kitchen_remodeling', label: 'Kitchen Remodeling', leadValue: 20 },
	{ value: 'roofing', label: 'Roofing', leadValue: 30 },
	{ value: 'plumbing', label: 'Plumbing', leadValue: 40 },
	{ value: 'hvac', label: 'HVAC', leadValue: 50 },
	{ value: 'landscaping', label: 'Landscaping', leadValue: 60 }
] as const;

export const serviceRequirementOptions = [
	{ value: 'immediate', label: 'Immediate', leadValue: 30 },
	{ value: 'within_week', label: 'Within the week', leadValue: 20 },
	{ value: 'within_month', label: 'Within the month', leadValue: 10 }
] as const;
