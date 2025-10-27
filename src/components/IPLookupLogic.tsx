import { useState } from 'react';
import IPInputForm from './IPInputForm';
import IPResults from './IPResults';
import { useIPLookup } from '../hooks/useIPLookup';

export default function IPLookupLogic() {
    const [ipInput, setIpInput] = useState('');
    const { results, loading, lookupIPs, downloadCSV } = useIPLookup();

    const handleLookup = () => {
        const ips = ipInput.split('\n').map(ip => ip.trim()).filter(ip => ip);
        lookupIPs(ips);
    };

    return (
        <div className="space-y-6">
            <IPInputForm
                ipInput={ipInput}
                setIpInput={setIpInput}
                onLookup={handleLookup}
                loading={loading}
            />
            <IPResults results={results} onDownloadCSV={downloadCSV} />
        </div>
    );
}