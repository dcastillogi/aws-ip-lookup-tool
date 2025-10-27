import { Search, Globe, Download } from 'lucide-react';

export default function FeaturesBanner() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50 shadow-sm">
                <Search className="h-5 w-5 text-blue-600" />
                <div>
                    <p className="font-medium text-gray-900">Multiple IPs</p>
                    <p className="text-sm text-gray-600">Batch lookup support</p>
                </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50 shadow-sm">
                <Globe className="h-5 w-5 text-green-600" />
                <div>
                    <p className="font-medium text-gray-900">All Ranges</p>
                    <p className="text-sm text-gray-600">Complete AWS coverage</p>
                </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50 shadow-sm">
                <Download className="h-5 w-5 text-purple-600" />
                <div>
                    <p className="font-medium text-gray-900">Export CSV</p>
                    <p className="text-sm text-gray-600">Download results</p>
                </div>
            </div>
        </div>
    );
}