import { useState } from 'react';

interface IPRange {
    ip_prefix?: string;
    ipv6_prefix?: string;
    region: string;
    service: string;
    network_border_group: string;
}

interface AWSIPRanges {
    syncToken: string;
    createDate: string;
    prefixes: IPRange[];
    ipv6_prefixes: IPRange[];
}

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

export function useIPLookup() {
    const [results, setResults] = useState<IPResult[]>([]);
    const [loading, setLoading] = useState(false);

    const isIPInRange = (ip: string, cidr: string): boolean => {
        try {
            const [rangeIP, prefixLength] = cidr.split('/');
            const ipNum = ipToNumber(ip);
            const rangeIPNum = ipToNumber(rangeIP);
            const mask = (0xffffffff << (32 - parseInt(prefixLength))) >>> 0;

            return (ipNum & mask) === (rangeIPNum & mask);
        } catch {
            return false;
        }
    };

    const ipToNumber = (ip: string): number => {
        return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
    };

    const isValidIP = (ip: string): boolean => {
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipRegex.test(ip);
    };

    const lookupIPs = async (ips: string[]) => {
        setLoading(true);
        const newResults: IPResult[] = [];

        try {
            const response = await fetch('https://ip-ranges.amazonaws.com/ip-ranges.json');
            const data: AWSIPRanges = await response.json();

            for (const ip of ips) {
                if (!isValidIP(ip)) {
                    newResults.push({
                        ip,
                        matches: [],
                        error: 'Invalid IP format'
                    });
                    continue;
                }

                const matches: IPMatch[] = [];

                // Check IPv4 ranges - find ALL matches, not just the first one
                for (const range of data.prefixes) {
                    if (range.ip_prefix && isIPInRange(ip, range.ip_prefix)) {
                        matches.push({
                            service: range.service,
                            region: range.region,
                            range: range.ip_prefix
                        });
                    }
                }

                if (matches.length === 0) {
                    newResults.push({
                        ip,
                        matches: [],
                        error: 'Not found in AWS IP ranges'
                    });
                } else {
                    newResults.push({
                        ip,
                        matches
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching AWS IP ranges:', error);
            for (const ip of ips) {
                newResults.push({
                    ip,
                    matches: [],
                    error: 'Failed to fetch AWS IP ranges'
                });
            }
        }

        setResults(newResults);
        setLoading(false);
    };

    const downloadCSV = () => {
        if (results.length === 0) return;

        const csvRows = [];

        // Header
        csvRows.push('IP Address,Service,Region,Range,Status');

        // Data rows
        for (const result of results) {
            if (result.error) {
                csvRows.push(`"${result.ip}","","","","${result.error}"`);
            } else if (result.matches.length === 0) {
                csvRows.push(`"${result.ip}","","","","Not found in AWS IP ranges"`);
            } else {
                // Create a row for each match
                for (const match of result.matches) {
                    csvRows.push(`"${result.ip}","${match.service}","${match.region}","${match.range}","Found"`);
                }
            }
        }

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `aws-ip-lookup-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return {
        results,
        loading,
        lookupIPs,
        downloadCSV
    };
}