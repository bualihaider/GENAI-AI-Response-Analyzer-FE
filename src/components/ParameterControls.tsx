'use client'

import { ParameterRange } from '@/types'

interface ParameterControlsProps {
  parameterRange: ParameterRange
  onParameterRangeChange: (parameterRange: ParameterRange) => void
}

export default function ParameterControls({ parameterRange, onParameterRangeChange }: ParameterControlsProps) {

  const updateParameter = (param: keyof ParameterRange, field: 'min' | 'max' | 'step', value: number) => {
    onParameterRangeChange({
      ...parameterRange,
      [param]: {
        ...parameterRange[param],
        [field]: value
      }
    })
  }

  const resetToDefaults = () => {
    onParameterRangeChange({
      temperature: { min: 0.1, max: 1.0, step: 0.1 },
      top_p: { min: 0.1, max: 1.0, step: 0.1 },
      max_tokens: { min: 100, max: 1000, step: 100 }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Parameter Range Configuration
        </h3>
        <p className="text-sm text-gray-600">
          Configure the ranges for LLM parameters. Responses will be generated with random combinations within these ranges.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Temperature</h4>
            <span className="text-sm text-gray-600">
              Controls randomness (0.1 = deterministic, 1.0 = creative)
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Min</label>
              <input
                type="number"
                min="0.1"
                max="1.0"
                step="0.1"
                value={parameterRange.temperature.min}
                onChange={(e) => updateParameter('temperature', 'min', parseFloat(e.target.value))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Max</label>
              <input
                type="number"
                min="0.1"
                max="1.0"
                step="0.1"
                value={parameterRange.temperature.max}
                onChange={(e) => updateParameter('temperature', 'max', parseFloat(e.target.value))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Step</label>
              <input
                type="number"
                min="0.1"
                max="0.5"
                step="0.1"
                value={parameterRange.temperature.step}
                onChange={(e) => updateParameter('temperature', 'step', parseFloat(e.target.value))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Range: {parameterRange.temperature.min} - {parameterRange.temperature.max}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Top P</h4>
            <span className="text-sm text-gray-600">
              Controls nucleus sampling (0.1 = focused, 1.0 = diverse)
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Min</label>
              <input
                type="number"
                min="0.1"
                max="1.0"
                step="0.1"
                value={parameterRange.top_p.min}
                onChange={(e) => updateParameter('top_p', 'min', parseFloat(e.target.value))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Max</label>
              <input
                type="number"
                min="0.1"
                max="1.0"
                step="0.1"
                value={parameterRange.top_p.max}
                onChange={(e) => updateParameter('top_p', 'max', parseFloat(e.target.value))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Step</label>
              <input
                type="number"
                min="0.1"
                max="0.5"
                step="0.1"
                value={parameterRange.top_p.step}
                onChange={(e) => updateParameter('top_p', 'step', parseFloat(e.target.value))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Range: {parameterRange.top_p.min} - {parameterRange.top_p.max}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Max Tokens</h4>
            <span className="text-sm text-gray-600">
              Maximum length of generated response
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Min</label>
              <input
                type="number"
                min="50"
                max="2000"
                step="50"
                value={parameterRange.max_tokens.min}
                onChange={(e) => updateParameter('max_tokens', 'min', parseInt(e.target.value))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Max</label>
              <input
                type="number"
                min="100"
                max="2000"
                step="50"
                value={parameterRange.max_tokens.max}
                onChange={(e) => updateParameter('max_tokens', 'max', parseInt(e.target.value))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Step</label>
              <input
                type="number"
                min="50"
                max="200"
                step="50"
                value={parameterRange.max_tokens.step}
                onChange={(e) => updateParameter('max_tokens', 'step', parseInt(e.target.value))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Range: {parameterRange.max_tokens.min} - {parameterRange.max_tokens.max} tokens
          </div>
        </div>
      </div>

      <button
        onClick={resetToDefaults}
        className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Reset to Defaults
      </button>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-purple-900 mb-1">
          Parameter Tips:
        </h4>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• <strong>Temperature:</strong> Lower values = more focused, higher = more creative</li>
          <li>• <strong>Top P:</strong> Lower values = more focused vocabulary, higher = more diverse</li>
          <li>• <strong>Max Tokens:</strong> Controls response length (roughly 4 chars per token)</li>
          <li>• <strong>Wider ranges</strong> = more diverse responses for comparison</li>
        </ul>
      </div>
    </div>
  )
}
