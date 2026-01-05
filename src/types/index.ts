export interface AppUpdate {
    $id: string;
    app_name: string;
    platform: 'android' | 'ios' | 'windows' | 'macos';
    version: string;
    version_code: number;
    build_number: number;
    build_type?: 'development' | 'production'; // Optional for backward compatibility
    file_id: string;
    file_url: string;
    file_size: number;
    release_notes: string | null;
    is_mandatory: boolean;
    released_at: string;
    is_active: boolean;
}

export interface AppMetadata {
    icon: string;
    color: string;
    description: string;
    tagline: string;
}

export const APP_METADATA: Record<string, AppMetadata> = {
    'Joint Journey Mobile': {
        icon: 'fa-handshake',
        color: 'blue',
        description: 'Comprehensive personal finance and fitness tracking',
        tagline: 'Your Journey to Financial and Physical Wellness'
    },
    'CookSuite Mobile': {
        icon: 'fa-utensils',
        color: 'orange',
        description: 'Kitchen management and recipe organization',
        tagline: 'Master Your Kitchen, One Recipe at a Time'
    },
    'TraQify Mobile': {
        icon: 'fa-chart-line',
        color: 'green',
        description: 'Advanced analytics and tracking solutions',
        tagline: 'Track, Analyze, Optimize Your Life'
    },
    'Joint Journey Desktop': {
        icon: 'fa-desktop',
        color: 'blue',
        description: 'Desktop version for Windows',
        tagline: 'Full-featured desktop experience'
    },
    'CookSuite Desktop': {
        icon: 'fa-desktop',
        color: 'orange',
        description: 'Desktop version for Windows',
        tagline: 'Full-featured desktop experience'
    },
    'TraQify Desktop': {
        icon: 'fa-desktop',
        color: 'green',
        description: 'Desktop version for Windows',
        tagline: 'Full-featured desktop experience'
    },
    'Usage Tracker Mobile': {
        icon: 'fa-chart-bar',
        color: 'purple',
        description: 'Real-time analytics dashboard for VarSys apps',
        tagline: 'Track, Analyze, Monitor Everything'
    },
    'Volt Track Mobile': {
        icon: 'fa-bolt',
        color: 'yellow',
        description: 'Energy monitoring and power consumption tracking',
        tagline: 'Power Up Your Energy Management'
    },
    'Volt Track Desktop': {
        icon: 'fa-desktop',
        color: 'yellow',
        description: 'Desktop version for Windows',
        tagline: 'Full-featured desktop experience'
    },
    'DocuStore Mobile': {
        icon: 'fa-file-archive',
        color: 'indigo',
        description: 'Document management and storage solution',
        tagline: 'Your Documents, Organized and Secure'
    },
    'DocuStore Desktop': {
        icon: 'fa-desktop',
        color: 'indigo',
        description: 'Desktop version for Windows',
        tagline: 'Full-featured desktop experience'
    }
};

export const APP_GROUPS = {
    'CookSuite': ['CookSuite Mobile', 'CookSuite Desktop'],
    'TraQify': ['TraQify Mobile', 'TraQify Desktop'],
    'Joint Journey': ['Joint Journey Mobile', 'Joint Journey Desktop'],
    'UsageTracker': ['Usage Tracker Mobile'],
    'Volt Track': ['Volt Track Mobile', 'Volt Track Desktop'],
    'DocuStore': ['DocuStore Mobile', 'DocuStore Desktop']
} as const;

export type AppGroupName = keyof typeof APP_GROUPS;
