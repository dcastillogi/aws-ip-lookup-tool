import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';

interface IPInputFormProps {
    ipInput: string;
    setIpInput: (value: string) => void;
    onLookup: () => void;
    loading: boolean;
}

export default function IPInputForm({ ipInput, setIpInput, onLookup, loading }: IPInputFormProps) {
    return (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Search className="h-5 w-5 text-blue-600" />
                    IP Address Lookup
                </CardTitle>
                <CardDescription className="text-gray-600">
                    Enter IP addresses (one per line) to check if they belong to AWS services
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    placeholder="Example:&#10;52.95.110.1&#10;54.239.28.85&#10;13.107.42.14"
                    value={ipInput}
                    onChange={(e) => setIpInput(e.target.value)}
                    className="min-h-32 bg-white/50 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                />
                <Button
                    onClick={onLookup}
                    disabled={loading || !ipInput.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Looking up...
                        </>
                    ) : (
                        <>
                            <Search className="h-4 w-4 mr-2" />
                            Lookup IP Addresses
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}