import { Button } from '@/components/ui/button';
import { Github, Linkedin, Shield } from 'lucide-react';

export default function Header() {
    return (
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Shield className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold">AWS IP Range Lookup</h1>
                            <p className="text-blue-100 mt-1 text-sm sm:text-base">
                                Discover which AWS services are behind any IP address
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                        <a
                            href="https://github.com/dcastillogi/aws-ip-lookup-tool"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-start sm:justify-center gap-2 h-8 px-3 rounded-md text-sm font-medium text-white hover:bg-white/20 border border-white/30 transition-all duration-200 cursor-pointer hover:shadow-md active:scale-95"
                        >
                            <Github className="h-4 w-4" />
                            <span className="sm:ml-2">Source Code</span>
                        </a>
                        <a
                            href="https://linkedin.com/in/dcastillogi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-start sm:justify-center gap-2 h-8 px-3 rounded-md text-sm font-medium text-white hover:bg-white/20 border border-white/30 transition-all duration-200 cursor-pointer hover:shadow-md active:scale-95"
                        >
                            <Linkedin className="h-4 w-4" />
                            <span className="sm:ml-2">Follow Me</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}