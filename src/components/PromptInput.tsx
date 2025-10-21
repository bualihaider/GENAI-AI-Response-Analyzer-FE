'use client'

import { useState } from 'react'
import { GenerationRequest, ParameterRange } from '@/types'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

interface PromptInputProps {
  onGenerate: (request: GenerationRequest) => void
  isGenerating: boolean
  parameterRange: ParameterRange
}

export default function PromptInput({ onGenerate, isGenerating, parameterRange }: PromptInputProps) {
  const [prompt, setPrompt] = useState('')
  const [experimentName, setExperimentName] = useState('')
  const [experimentDescription, setExperimentDescription] = useState('')
  const [numberOfRuns, setNumberOfRuns] = useState(5)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prompt.trim()) {
      alert('Please enter a prompt')
      return
    }

    const request: GenerationRequest = {
      prompt: prompt.trim(),
      parameterRange: parameterRange,
      numberOfRuns,
      experimentName: experimentName.trim() || undefined,
      experimentDescription: experimentDescription.trim() || undefined
    }

    onGenerate(request)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Prompt & Experiment Setup
        </h3>
        <p className="text-sm text-gray-600">
          Enter your prompt and configure the experiment parameters.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="experimentName" className="block text-sm font-medium text-gray-700 mb-1">
            Experiment Name (Optional)
          </label>
          <input
            type="text"
            id="experimentName"
            value={experimentName}
            onChange={(e) => setExperimentName(e.target.value)}
            placeholder="e.g., Creative Writing Analysis"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />
        </div>

        <div>
          <label htmlFor="experimentDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="experimentDescription"
            value={experimentDescription}
            onChange={(e) => setExperimentDescription(e.target.value)}
            placeholder="Brief description of what you're testing..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />
        </div>

        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
            Prompt *
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here... (e.g., 'Write a creative story about a robot learning to paint')"
            rows={4}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />
        </div>

        <div>
          <label htmlFor="numberOfRuns" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Responses to Generate
          </label>
          <select
            id="numberOfRuns"
            value={numberOfRuns}
            onChange={(e) => setNumberOfRuns(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          >
            <option value={3}>3 responses</option>
            <option value={5}>5 responses</option>
            <option value={10}>10 responses</option>
            <option value={15}>15 responses</option>
            <option value={20}>20 responses</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generating Responses...
            </>
          ) : (
            <>
              <PaperAirplaneIcon className="w-5 h-5 mr-2" />
              Generate & Analyze Responses
            </>
          )}
        </button>
      </form>
    </div>
  )
}
