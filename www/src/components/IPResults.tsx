import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Shield } from 'lucide-react';

interface IPMatch {
    service: string;
    region: string;
    range: string;
}

interface IPResult {
    ip: string;
    matches: IPMatch[];
    error?: string;
}

interface IPResultsProps {
    results: IPResult[];
    onDownloadCSV: () => void;
}

export default function IPResults({ results, onDownloadCSV }: IPResultsProps) {
    if (results.length === 0) return null;

    return (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                        <Shield className="h-5 w-5 text-green-600" />
                        Results ({results.length} IPs analyzed)
                    </CardTitle>
                    <Button
                        onClick={onDownloadCSV}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 bg-white/50 hover:bg-white/80 border-gray-200"
                    >
                        <Download className="h-4 w-4" />
                        Download CSV
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {results.map((result, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-xl border shadow-sm transition-all hover:shadow-md ${
                                result.error
                                    ? 'border-red-200 bg-gradient-to-r from-red-50 to-red-100/50'
                                    : result.matches.length > 0
                                    ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-100/50'
                                    : 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-100/50'
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <p className="font-mono font-bold text-lg text-gray-900">{result.ip}</p>
                                    {result.error ? (
                                        <p className="text-red-600 text-sm mt-1 font-medium">{result.error}</p>
                                    ) : result.matches.length > 0 ? (
                                        <div className="mt-3 space-y-3">
                                            <div className="bg-white/60 p-3 rounded-lg">
                                                <p className="text-green-700 font-bold text-base">
                                                    Services: {result.matches.map(m => m.service).join(', ')}
                                                </p>
                                                {result.matches.length > 1 && (
                                                    <p className="text-green-600 text-sm mt-1 font-medium">
                                                        Found in {result.matches.length} ranges
                                                    </p>
                                                )}
                                            </div>
                                            {result.matches.map((match, matchIndex) => (
                                                <div key={matchIndex} className="bg-white/70 p-3 rounded-lg border-l-4 border-green-400 shadow-sm">
                                                    <p className="text-green-700 text-sm font-bold">{match.service}</p>
                                                    <p className="text-green-600 text-sm font-medium">Region: {match.region}</p>
                                                    <p className="text-green-600 text-sm font-mono bg-green-50 px-2 py-1 rounded mt-1 inline-block">
                                                        {match.range}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-yellow-600 text-sm mt-1 font-medium">Not found in AWS ranges</p>
                                    )}
                                </div>
                                <div className={`px-3 py-2 rounded-full text-xs font-bold ml-4 shadow-sm ${
                                    result.error
                                        ? 'bg-red-200 text-red-800'
                                        : result.matches.length > 0
                                        ? 'bg-green-200 text-green-800'
                                        : 'bg-yellow-200 text-yellow-800'
                                }`}>
                                    {result.error ? 'Error' : result.matches.length > 0 ? 'AWS' : 'Not AWS'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}