export interface AppUpdate {
    $id: string;
    app_name: string;
    platform: 'android' | 'ios' | 'windows' | 'macos';
    version: string;
    version_code: number;
    build_number: number;
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
    }
};

export const APP_GROUPS = {
    'CookSuite': ['CookSuite Mobile', 'CookSuite Desktop'],
    'TraQify': ['TraQify Mobile', 'TraQify Desktop'],
    'Joint Journey': ['Joint Journey Mobile', 'Joint Journey Desktop'],
    'UsageTracker': ['Usage Tracker Mobile']
} as const;

export type AppGroupName = keyof typeof APP_GROUPS;
