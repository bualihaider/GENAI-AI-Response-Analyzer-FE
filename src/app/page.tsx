'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import PromptInput from '@/components/PromptInput'
import ParameterControls from '@/components/ParameterControls'
import ResponseDisplay from '@/components/ResponseDisplay'
import ExperimentHistory from '@/components/ExperimentHistory'
import { ExperimentData, GenerationRequest, ParameterRange } from '@/types'

export default function Home() {
  const [currentExperiment, setCurrentExperiment] = useState<ExperimentData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate')
  const [parameterRange, setParameterRange] = useState<ParameterRange>({
    temperature: { min: 0.1, max: 1.0, step: 0.1 },
    top_p: { min: 0.1, max: 1.0, step: 0.1 },
    max_tokens: { min: 100, max: 1000, step: 100 }
  })

  const handleGenerate = async (request: GenerationRequest) => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error('Failed to generate responses')
      }

      const result = await response.json()
      if (result.success) {
        setCurrentExperiment(result.data)
        setActiveTab('generate')
      }
    } catch (error) {
      console.error('Generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'generate'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Generate & Analyze
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Experiment History
            </button>
          </div>
        </div>

        {activeTab === 'generate' ? (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                AI Response Quality Analyzer
              </h2>
              <p className="text-gray-600 mb-6">
                Enter a prompt and configure LLM parameters to generate multiple responses 
                and analyze their quality using custom metrics.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PromptInput 
                  onGenerate={handleGenerate} 
                  isGenerating={isGenerating}
                  parameterRange={parameterRange}
                />
                <ParameterControls 
                  parameterRange={parameterRange}
                  onParameterRangeChange={setParameterRange}
                />
              </div>
            </div>

            {currentExperiment && (
              <ResponseDisplay experiment={currentExperiment} />
            )}
          </div>
        ) : (
          <ExperimentHistory />
        )}
      </main>
    </div>
  )
}