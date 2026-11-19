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
	summary: string;
	items: NavItem[];
}

export const leadScoringLinks: NavItem[] = [
	{
		href: '/lead-scoring/google-tag-1',
		label: 'HTML Attributes',
		shortLabel: 'HTML Attrs',
		description: 'Score leads via option data-lead-value attributes.',
		badge: 'gtag.js'
	},
	{
		href: '/lead-scoring/google-tag-2',
		label: 'Programmatic Map',
		shortLabel: 'Programmatic',
		description: 'Compute income & tenure scores in JS.',
		badge: 'gtag.js'
	},
	{
		href: '/lead-scoring/gtm-1',
		label: 'GTM dataLayer',
		shortLabel: 'GTM [1]',
		description: 'Push raw fields for GTM Lookup Tables.',
		badge: 'dataLayer'
	},
	{
		href: '/lead-scoring/gtm-2',
		label: 'Combined Score',
		shortLabel: 'GTM [2]',
		description: 'Sum service and urgency into one score.',
		badge: 'GTM + gtag'
	},
	{
		href: '/lead-scoring/multiple-checkbox',
		label: 'Multi-Checkbox',
		shortLabel: 'Checkboxes',
		description: 'Sum selected checkbox values on submit.',
		badge: 'gtag.js'
	}
];

export const enhancedConversionsLinks: NavItem[] = [
	{
		href: '/adsenhancedconversions/automatic',
		label: 'Automatic',
		shortLabel: 'Automatic',
		description: 'Standard email and tel input auto-detection.',
		badge: 'Auto'
	},
	{
		href: '/adsenhancedconversions/css-selector',
		label: 'CSS Selector',
		shortLabel: 'CSS Selector',
		description: 'Extract .ec_email and .ec_tel confirmation DOM.',
		badge: 'DOM'
	},
	{
		href: '/adsenhancedconversions/javascript',
		label: 'JS Variable',
		shortLabel: 'JS Variable',
		description: 'Set window.enhanced_conversion_data on submit.',
		badge: 'Window'
	},
	{
		href: '/adsenhancedconversions/code',
		label: 'GTM dataLayer',
		shortLabel: 'dataLayer',
		description: 'Push user fields via form_submit_complete_dl.',
		badge: 'dataLayer'
	},
	{
		href: '/adsenhancedconversions/prehash',
		label: 'Pre-hashed SHA-256',
		shortLabel: 'Pre-hashed',
		description: 'Normalize and SHA-256 hash PII in-browser.',
		badge: 'SHA-256'
	}
];

export const sa360Links: NavItem[] = [
	{
		href: '/sa360/googletag',
		label: 'Google Tag Floodlight',
		shortLabel: 'Google Tag',
		description: 'Direct gtag.js Floodlight Sales conversion.',
		badge: 'gtag.js'
	},
	{
		href: '/sa360/gtm/datalayer',
		label: 'GTM dataLayer',
		shortLabel: 'dataLayer',
		description: 'Push u1, u2, value, and ord variables.',
		badge: 'dataLayer'
	},
	{
		href: '/sa360/gtm/floodlightformatted',
		label: 'Floodlight Formatted',
		shortLabel: 'Formatted',
		description: 'Canonical src, type, cat, cost, qty, ord payload.',
		badge: 'Floodlight'
	},
	{
		href: '/sa360/gtm/javascript',
		label: 'JS Variable',
		shortLabel: 'JS Variable',
		description: 'Expose window.floodlight_data for GTM reads.',
		badge: 'Window'
	}
];

export const toolsLinks: NavItem[] = [
	{
		href: '/contact',
		label: 'SHA-256 Verifier',
		shortLabel: 'SHA-256',
		description: 'Verify hex, Base64, and Base64URL digests.',
		badge: 'API'
	},
	{
		href: '/iframe/typeform',
		label: 'Typeform Embed',
		shortLabel: 'Typeform',
		description: 'Cross-origin form-submit postMessage capture.',
		badge: 'Iframe'
	},
	{
		href: '/iframe/calendly',
		label: 'Calendly Embed',
		shortLabel: 'Calendly',
		description: 'Capture calendly.* booking events via postMessage.',
		badge: 'Iframe'
	},
	{
		href: '/ogt/landing-page?gclid=TeSt_GcLiD_987XYZ',
		label: 'GCLID Redirect Test',
		shortLabel: 'GCLID',
		description: 'Test 302 server redirect lowercasing gclid.',
		badge: 'SSR'
	}
];

export const navGroups: NavGroup[] = [
	{
		id: 'lead',
		title: 'Lead Scoring',
		summary: 'Value-based lead qualification patterns.',
		items: leadScoringLinks
	},
	{
		id: 'ec',
		title: 'Enhanced Conversions',
		summary: 'First-party user data capture methods.',
		items: enhancedConversionsLinks
	},
	{
		id: 'sa360',
		title: 'Search Ads 360',
		summary: 'Floodlight Counter & Sales tagging.',
		items: sa360Links
	},
	{
		id: 'tools',
		title: 'Tools & Embeds',
		summary: 'SHA-256 hashing, iframes, and GCLID.',
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
