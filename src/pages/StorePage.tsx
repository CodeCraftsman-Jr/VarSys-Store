import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'appwrite';
import { databases, config } from '../lib/appwrite';
import type { AppUpdate } from '../types/index.js';

const APPS_COLLECTION_ID = 'apps';

type AppGroupName = 'CookSuite' | 'TraQify' | 'Joint Journey' | 'UsageTracker' | 'Volt Track' | 'DocuStore';

interface AppMetadata {
    icon: string;
    color: string;
    description: string;
    tagline: string;
}

interface AppData {
    app_name: string;
    display_name: string;
    icon: string;
    color: string;
    description: string;
    tagline: string;
    platform_category: string;
    is_active: boolean;
}

/**
 * StorePage - Public page accessible to everyone without authentication
 * Displays all available app updates with download links
 * Note: Appwrite collection must have public read permissions enabled
 */
export default function StorePage() {
    const [updates, setUpdates] = useState<AppUpdate[]>([]);
    const [apps, setApps] = useState<AppData[]>([]);
    const [appMetadata, setAppMetadata] = useState<Record<string, AppMetadata>>({});
    const [appGroups, setAppGroups] = useState<Record<string, string[]>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<AppGroupName | 'All'>('All');

    useEffect(() => {
        async function initializePage() {
            await Promise.all([loadApps(), loadUpdates()]);
            setIsLoading(false);
        }
        initializePage();
    }, []);

    async function loadApps() {
        try {
            console.log('Loading apps from database...');
            const response = await databases.listDocuments(
                config.databaseId,
                APPS_COLLECTION_ID,
                [Query.equal('is_active', true), Query.orderAsc('app_name'), Query.limit(100)]
            );
            
            console.log('Apps response:', response);
            console.log('Found apps:', response.documents.length);
            
            const appsData = response.documents as unknown as AppData[];
            setApps(appsData);
            
            // Build APP_METADATA from database
            const metadata: Record<string, AppMetadata> = {};
            appsData.forEach(app => {
                metadata[app.app_name] = {
                    icon: app.icon,
                    color: app.color,
                    description: app.description,
                    tagline: app.tagline
                };
            });
            setAppMetadata(metadata);
            
            // Build APP_GROUPS dynamically from app names
            const groups: Record<string, string[]> = {};
            appsData.forEach(app => {
                // Extract base name (e.g., "TraQify" from "TraQify Mobile")
                const baseName = app.app_name.replace(/ (Mobile|Desktop|Web)$/, '');
                if (!groups[baseName]) {
                    groups[baseName] = [];
                }
                groups[baseName].push(app.app_name);
            });
            setAppGroups(groups);
            
            console.log('Loaded appMetadata:', metadata);
            console.log('Loaded appGroups:', groups);
            
        } catch (err: any) {
            console.error('Error loading apps:', err);
            setError('Failed to load apps: ' + err.message);
        }
    }

    async function loadUpdates() {
        try {
            console.log('Loading updates from database...');
            const response = await databases.listDocuments(
                config.databaseId,
                config.collectionId,
                [
                    Query.equal('is_active', true),
                    Query.orderDesc('released_at'),
                    Query.limit(100)
                ]
            );

            console.log('Database response:', response);
            console.log('Found documents:', response.documents.length);

            // Show all builds, not just latest
            const allUpdates = response.documents.map(doc => doc as unknown as AppUpdate);
            setUpdates(allUpdates);
        } catch (err) {
            console.error('Error loading updates:', err);
            setError('Failed to load updates');
        }
    }

    function getFilteredUpdates(): Record<AppGroupName, AppUpdate[]> {
        const grouped: Record<AppGroupName, AppUpdate[]> = {
            'CookSuite': [],
            'TraQify': [],
            'Joint Journey': [],
            'UsageTracker': [],
            'Volt Track': [],
            'DocuStore': []
        };

        updates.forEach((update) => {
            for (const [group, appNames] of Object.entries(appGroups)) {
                if ((appNames as readonly string[]).includes(update.app_name)) {
                    grouped[group as AppGroupName].push(update);
                }
            }
        });

        return grouped;
    }

    function groupByMonth(updates: AppUpdate[]): Record<string, AppUpdate[]> {
        const grouped: Record<string, AppUpdate[]> = {};
        
        updates.forEach(update => {
            const date = new Date(update.released_at);
            const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
            
            if (!grouped[monthKey]) {
                grouped[monthKey] = [];
            }
            grouped[monthKey].push(update);
        });
        
        return grouped;
    }

    function formatFileSize(bytes: number): string {
        return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    }

    function formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function getPlatformIcon(platform: string): string {
        switch (platform) {
            case 'android': return 'fa-android';
            case 'ios': return 'fa-apple';
            case 'windows': return 'fa-windows';
            default: return 'fa-desktop';
        }
    }

    const groupedUpdates = getFilteredUpdates();
    const filteredGroups = activeFilter === 'All'
        ? Object.entries(groupedUpdates)
        : [[activeFilter, groupedUpdates[activeFilter]]] as [string, AppUpdate[]][];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-purple-200 text-lg">Loading available updates...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            {/* Header */}
            <header className="py-12 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl shadow-purple-500/30 mb-6">
                        <i className="fas fa-mobile-alt text-3xl text-white"></i>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                        VarSys Apps
                    </h1>
                    <p className="text-lg text-purple-200 max-w-xl mx-auto">
                        Download the latest versions of our premium applications
                    </p>
                </div>
            </header>

            {/* Filter Tabs */}
            <div className="max-w-6xl mx-auto px-4 mb-10">
                {/* App Filter */}
                <div className="flex flex-wrap justify-center gap-2">
                    {(['All', 'CookSuite', 'TraQify', 'Joint Journey', 'UsageTracker'] as const).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${activeFilter === filter
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'bg-white/10 text-purple-200 hover:bg-white/20'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 pb-16">
                {error ? (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-8 text-center max-w-lg mx-auto">
                        <i className="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                        <p className="text-red-200 text-lg">{error}</p>
                    </div>
                ) : updates.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center max-w-lg mx-auto">
                        <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fas fa-inbox text-4xl text-purple-400"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">No Updates Available</h3>
                        <p className="text-purple-200/70">Check back soon for new releases!</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {filteredGroups.map(([groupName, groupUpdates]) => (
                            <AppSection
                                key={groupName}
                                name={groupName as AppGroupName}
                                updates={groupUpdates}
                                appMetadata={appMetadata}
                                formatFileSize={formatFileSize}
                                formatDate={formatDate}
                                getPlatformIcon={getPlatformIcon}
                                groupByMonth={groupByMonth}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-black/20 py-6">
                <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-purple-300/70 text-sm">&copy; 2024 VarSys. All rights reserved.</p>
                    <Link
                        to="/admin"
                        className="text-purple-400 hover:text-purple-300 transition-colors text-sm flex items-center gap-2"
                    >
                        <i className="fas fa-shield-alt"></i>
                        Admin Login
                    </Link>
                </div>
            </footer>
        </div>
    );
}

interface AppSectionProps {
    name: AppGroupName;
    updates: AppUpdate[];
    appMetadata: Record<string, AppMetadata>;
    formatFileSize: (bytes: number) => string;
    formatDate: (dateStr: string) => string;
    getPlatformIcon: (platform: string) => string;
    groupByMonth: (updates: AppUpdate[]) => Record<string, AppUpdate[]>;
}

function AppSection({ name, updates, appMetadata, formatFileSize, formatDate, getPlatformIcon, groupByMonth }: AppSectionProps) {
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

    const toggleSection = (buildType: string) => {
        setCollapsedSections(prev => ({
            ...prev,
            [buildType]: !prev[buildType]
        }));
    };

    const colorConfig = {
        'CookSuite': {
            gradient: 'from-orange-500 to-red-500',
            accent: 'text-orange-400',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/20'
        },
        'TraQify': {
            gradient: 'from-emerald-500 to-teal-500',
            accent: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20'
        },
        'Joint Journey': {
            gradient: 'from-blue-500 to-indigo-500',
            accent: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        },
        'UsageTracker': {
            gradient: 'from-purple-500 to-pink-500',
            accent: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20'
        },
        'Volt Track': {
            gradient: 'from-yellow-500 to-amber-500',
            accent: 'text-yellow-400',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/20'
        },
        'DocuStore': {
            gradient: 'from-indigo-500 to-purple-500',
            accent: 'text-indigo-400',
            bg: 'bg-indigo-500/10',
            border: 'border-indigo-500/20'
        }
    };

    const colors = colorConfig[name];

    if (updates.length === 0) return null;

    // Group by build type first
    const buildTypeGroups: Record<string, AppUpdate[]> = {
        'production': [],
        'development': []
    };
    
    updates.forEach(update => {
        const buildType = update.build_type || 'production';
        // Ensure the array exists before pushing
        if (!buildTypeGroups[buildType]) {
            buildTypeGroups[buildType] = [];
        }
        buildTypeGroups[buildType].push(update);
    });

    return (
        <section className="space-y-10">
            {/* Section Header */}
            <div className="flex items-center gap-4">
                <div className={`w-1.5 h-8 bg-gradient-to-b ${colors.gradient} rounded-full`}></div>
                <h2 className={`text-2xl md:text-3xl font-bold ${colors.accent}`}>{name}</h2>
            </div>

            {/* Group by Build Type, then by Month */}
            {(['production', 'development'] as const).map(buildType => {
                const buildUpdates = buildTypeGroups[buildType];
                if (buildUpdates.length === 0) return null;

                const monthlyGroups = groupByMonth(buildUpdates);
                const sortedMonths = Object.keys(monthlyGroups).sort((a, b) => {
                    return new Date(b).getTime() - new Date(a).getTime();
                });

                return (
                    <div key={buildType} className="space-y-6">
                        {/* Build Type Header - Collapsible */}
                        <button
                            onClick={() => toggleSection(buildType)}
                            className="w-full flex items-center gap-3 ml-4 hover:bg-white/5 p-3 rounded-lg transition-colors cursor-pointer"
                        >
                            <i className={`fas ${buildType === 'production' ? 'fa-rocket' : 'fa-code'} text-lg ${
                                buildType === 'production' ? 'text-green-400' : 'text-yellow-400'
                            }`}></i>
                            <h3 className={`text-xl font-bold ${
                                buildType === 'production' ? 'text-green-400' : 'text-yellow-400'
                            } capitalize`}>
                                {buildType === 'production' ? '🚀 Production' : '🔧 Development'}
                            </h3>
                            <div className="flex-1 h-px bg-white/10"></div>
                            <span className={`text-xs px-3 py-1 rounded-full ${
                                buildType === 'production' 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                                {buildUpdates.length} {buildUpdates.length === 1 ? 'build' : 'builds'}
                            </span>
                            <i className={`fas fa-chevron-${collapsedSections[buildType] ? 'down' : 'up'} text-sm text-gray-400`}></i>
                        </button>

                        {/* Group by Month - Collapsible Content */}
                        {!collapsedSections[buildType] && sortedMonths.map(month => (
                            <div key={month} className="space-y-4 ml-8">
                                {/* Month Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <i className="fas fa-calendar-alt text-purple-400 text-lg"></i>
                                    <h4 className="text-lg font-semibold text-purple-300">{month}</h4>
                                    <div className="flex-1 h-px bg-white/10"></div>
                                    <span className="text-xs text-purple-400 bg-purple-500/20 px-3 py-1 rounded-full">
                                        {monthlyGroups[month].length} {monthlyGroups[month].length === 1 ? 'build' : 'builds'}
                                    </span>
                                </div>

                                {/* Cards Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {monthlyGroups[month].map((update) => {
                            const metadata = appMetadata[update.app_name] || {
                                icon: 'fa-mobile-alt',
                                description: 'Application',
                                tagline: 'Download the latest version'
                            };
                            const buildType = update.build_type || 'production';

                            return (
                                <div
                                    key={update.$id}
                                    className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl"
                                >
                                    {/* Card Header */}
                                    <div className={`bg-gradient-to-r ${colors.gradient} p-5`}>
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                                <i className={`fas ${metadata.icon} text-xl text-white`}></i>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className="bg-white/20 text-white px-3 py-1 rounded-full font-bold text-sm">
                                                    v{update.version}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                    buildType === 'development' 
                                                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' 
                                                        : 'bg-green-500/20 text-green-300 border border-green-500/30'
                                                }`}>
                                                    <i className={`fas ${buildType === 'development' ? 'fa-code' : 'fa-rocket'} mr-1`}></i>
                                                    {buildType === 'development' ? 'Dev' : 'Prod'}
                                                </span>
                                            </div>
                                        </div>
                                <h3 className="text-xl font-bold text-white mb-1">{update.app_name}</h3>
                                <p className="text-white/70 text-sm">{metadata.tagline}</p>
                            </div>

                            {/* Card Body */}
                            <div className="p-5">
                                <p className="text-gray-300 text-sm mb-4">{metadata.description}</p>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <i className={`fab ${getPlatformIcon(update.platform)} w-4 text-center`}></i>
                                        <span className="capitalize">{update.platform}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <i className="fas fa-calendar w-4 text-center"></i>
                                        <span>{formatDate(update.released_at)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <i className="fas fa-file w-4 text-center"></i>
                                        <span>{formatFileSize(update.file_size)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <i className="fas fa-code-branch w-4 text-center"></i>
                                        <span>Build {update.build_number}</span>
                                    </div>
                                </div>

                                {/* Release Notes */}
                                {update.release_notes && (
                                    <div className={`${colors.bg} ${colors.border} border rounded-lg p-3 mb-4`}>
                                        <p className="text-xs font-semibold text-gray-300 mb-1">What's New:</p>
                                        <p className="text-xs text-gray-400">{update.release_notes}</p>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs px-2.5 py-1 rounded-full ${update.is_mandatory
                                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                        : 'bg-green-500/20 text-green-300 border border-green-500/30'
                                        }`}>
                                        {update.is_mandatory ? 'Required' : 'Optional'}
                                    </span>
                                    <a
                                        href={update.file_url}
                                        className={`bg-gradient-to-r ${colors.gradient} text-white px-4 py-2 rounded-lg font-medium text-sm transition-all hover:opacity-90 flex items-center gap-2`}
                                        download
                                    >
                                        <i className="fas fa-download"></i>
                                        Download
                                    </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    </div>
                </div>
            ))}
                    </div>
                );
            })}
        </section>
    );
}
