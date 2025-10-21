'use client'

import { BeakerIcon } from '@heroicons/react/24/outline'

export default function Header() {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                            <BeakerIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                AI Response Quality Analyzer
                            </h1>
                            <p className="text-sm text-gray-500">
                                Powered by Gemini AI
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
