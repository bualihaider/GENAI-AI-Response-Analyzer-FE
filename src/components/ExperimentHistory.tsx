'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ExperimentData } from '@/types'
import { 
  DocumentTextIcon, 
  TrashIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

export default function ExperimentHistory() {
  const [experiments, setExperiments] = useState<ExperimentData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showExportDropdown, setShowExportDropdown] = useState<string | null>(null)
  const [expandedResponses, setExpandedResponses] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchExperiments()
  }, [])

  const fetchExperiments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/experiments')
      
      if (!response.ok) {
        throw new Error('Failed to fetch experiments')
      }

      const result = await response.json()
      if (result.success) {
        setExperiments(result.data.experiments)
      } else {
        setError(result.error || 'Failed to fetch experiments')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const deleteExperiment = async (experimentId: string) => {
    if (!confirm('Are you sure you want to delete this experiment?')) {
      return
    }

    try {
      const response = await fetch(`/api/experiments/${experimentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setExperiments(prev => prev.filter(exp => exp.id !== experimentId))
      } else {
        alert('Failed to delete experiment')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete experiment')
    }
  }

  const exportExperiment = async (experimentId: string, format: 'json' | 'csv' | 'pdf') => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          experimentId,
          format,
          includeMetrics: true,
          includeDetails: false
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `experiment_${experimentId}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export error:', error)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Invalid Date'
      }
      
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
      
      return date.toLocaleDateString('en-US', options).replace(',', '')
    } catch (_err) {
      return 'Invalid Date'
    }
  }

  const getBestScore = (experiment: ExperimentData) => {
    return Math.max(...experiment.responses.map(r => r.metrics.overallScore))
  }

  const getAverageScore = (experiment: ExperimentData) => {
    const total = experiment.responses.reduce((sum, r) => sum + r.metrics.overallScore, 0)
    return total / experiment.responses.length
  }

  const toggleResponseExpansion = (responseId: string) => {
    setExpandedResponses(prev => {
      const newSet = new Set(prev)
      if (newSet.has(responseId)) {
        newSet.delete(responseId)
      } else {
        newSet.add(responseId)
      }
      return newSet
    })
  }

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading experiments...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Experiments</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchExperiments}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (experiments.length === 0) {
    return (
      <div className="text-center py-12">
        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No experiments yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Generate your first experiment to see results here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Experiment History</h2>
        <div className="text-sm text-gray-600">
          {experiments.length} experiment{experiments.length !== 1 ? 's' : ''} total
        </div>
      </div>

      <div className="grid gap-6">
        {experiments.map((experiment) => (
          <div key={experiment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {experiment.name || `Experiment ${experiment.id.slice(-8)}`}
                  </h3>
                  {experiment.description && (
                    <p className="text-gray-600 mt-1">{experiment.description}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2 font-mono bg-gray-100 px-2 py-1 rounded">
                    {experiment.prompt.length > 100 
                      ? `${experiment.prompt.substring(0, 100)}...` 
                      : experiment.prompt
                    }
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <div className="relative">
                    <button 
                      onClick={() => setShowExportDropdown(showExportDropdown === experiment.id ? null : experiment.id)}
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                      Export
                    </button>
                    {showExportDropdown === experiment.id && (
                      <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                        <button
                          onClick={() => {
                            exportExperiment(experiment.id, 'json')
                            setShowExportDropdown(null)
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Export JSON
                        </button>
                        <button
                          onClick={() => {
                            exportExperiment(experiment.id, 'csv')
                            setShowExportDropdown(null)
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Export CSV
                        </button>
                        <button
                          onClick={() => {
                            exportExperiment(experiment.id, 'pdf')
                            setShowExportDropdown(null)
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Export PDF
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteExperiment(experiment.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{experiment.totalRuns}</div>
                  <div className="text-sm text-gray-600">Responses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(getBestScore(experiment) * 100) / 100}
                  </div>
                  <div className="text-sm text-gray-600">Best Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(getAverageScore(experiment) * 100) / 100}
                  </div>
                  <div className="text-sm text-gray-600">Avg Score</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-600">
                    {formatDate(experiment.createdAt)}
                  </div>
                  <div className="text-sm text-gray-600">Created</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Parameter Range</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Temperature:</span>
                    <span className="ml-1 font-mono">
                      {experiment.parameterRange.temperature.min} - {experiment.parameterRange.temperature.max}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Top-P:</span>
                    <span className="ml-1 font-mono">
                      {experiment.parameterRange.top_p.min} - {experiment.parameterRange.top_p.max}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Max Tokens:</span>
                    <span className="ml-1 font-mono">
                      {experiment.parameterRange.max_tokens.min} - {experiment.parameterRange.max_tokens.max}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Response Summary</h4>
                <div className="space-y-3">
                  {experiment.responses.map((response, index) => {
                    const isExpanded = expandedResponses.has(response.id)
                    const shouldTruncate = response.content.length > 150
                    
                    return (
                      <div key={response.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="font-medium text-gray-900">Response {index + 1}</span>
                            <span className="text-gray-600">
                              Temp: {response.parameters.temperature}, Top-P: {response.parameters.top_p}
                            </span>
                            <span className="font-medium text-gray-900">
                              Score: {Math.round(response.metrics.overallScore * 100) / 100}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-800 leading-relaxed prose prose-sm max-w-none">
                          {isExpanded ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {response.content}
                            </ReactMarkdown>
                          ) : (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {truncateText(response.content)}
                            </ReactMarkdown>
                          )}
                        </div>
                        
                        {shouldTruncate && (
                          <button
                            onClick={() => toggleResponseExpansion(response.id)}
                            className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {isExpanded ? 'Read Less' : 'Read More'}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
